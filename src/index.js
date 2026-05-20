const Fastify = require("fastify");
const { csvToObj } = require("csv-to-js-parser");
const fs = require("fs");
const cors = require("@fastify/cors");
const tmxAndroid = require("./tmx/android.js");
const tmxIos = require("./tmx/ios.js");
const mysql = require("mysql2/promise");
const fp = require("fastify-plugin");
const { keyBy } = require("lodash");

var dbConnected = false;
var connection = false;

async function dbConnect() {
  if (!dbConnected) {
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "test",
      database: "<DATABASE_NAME>",
    });
    dbConnected = true;
  }
}

const app = Fastify();
app.register(cors, {
  origin: "*",
});

async function validateApiKey(request, reply) {
  const { apiKey } = request.body;

  const uuidV4Regex = /^[a-fA-F\d]{8}(?:\-[a-fA-F\d]{4}){3}\-[a-fA-F\d]{12}$/;
  if (!apiKey || !uuidV4Regex.test(apiKey)) {
    return reply.code(400).send({
      msg: "Invalid API key format, it should be a UUIDv4",
    });
  }

  try {
    const [rows] = await connection.query(
      `SELECT * FROM api_keys WHERE apikey = ?;`,
      [apiKey]
    );

    if (rows.length <= 0) {
      return reply.code(403).send({
        msg: "Api key not found",
      });
    }

    const api = rows[0];
    if (api.req_count >= api.req_limit) {
      return reply.code(403).send({
        msg: "Request limit exceeded",
      });
    }
  } catch (err) {
    return reply.code(500).send({
      msg: `An error occurred while querying the database: ${err}`,
    });
  }
}

async function incrementRequestCount(apiKey) {
  try {
    await connection.query(
      `UPDATE api_keys SET req_count = req_count + 1 WHERE apikey = ?;`,
      [apiKey]
    );
  } catch (err) {
    console.error(`An error occurred while updating the request count: ${err}`);
  }
}

app.post("/self", async (request, reply) => {
  const { apiKey } = request.body;

  const uuidV4Regex = /^[a-fA-F\d]{8}(?:\-[a-fA-F\d]{4}){3}\-[a-fA-F\d]{12}$/;
  if (!apiKey || !uuidV4Regex.test(apiKey)) {
    return reply.code(400).send({
      msg: "Invalid API key format, it should be a UUIDv4",
    });
  }

  try {
    const [rows] = await connection.query(
      `SELECT * FROM api_keys WHERE apikey = ?;`,
      [apiKey]
    );

    if (rows.length <= 0) {
      return reply.code(403).send({
        msg: "Api key not found",
      });
    }

    const api = rows[0];
    return reply.code(200).send({
      limit: api.max_req,
      count: api.req_count,
      key: api.apikey,
      createdAt: api.create_time,
      endAt: api.end_time,
    });
  } catch (err) {
    return reply.code(500).send({
      msg: `An error occurred while querying the database: ${err}`,
    });
  }
});

async function createSession(proxy, apiKey, platform) {
  var result = null;
  if (platform === "android") {
    const { sessionId, deviceId } = await tmxAndroid.createSession(
      proxy,
      apiKey
    );
    result = {
      sessionId,
      deviceId: deviceId.toLowerCase(),
    };
  } else {
    const { sessionId, deviceId } = await tmxIos.createSession(proxy, apiKey);
    result = {
      sessionId,
      deviceId,
    };
  }

  if (!("sessionId" in result) || !("deviceId" in result)) {
    return null;
  }

  return result;
}

app.post(
  "/tmx/session/create",
  { preHandler: validateApiKey },
  async (request, reply) => {
    const { proxy, apiKey, platform } = request.body;

    // Validate proxy format
    if (!proxy || !/^.+:.+@.+:\d+$/.test(proxy)) {
      return reply.code(400).send({
        msg: "Invalid proxy format, it should be: username:password@host:port",
      });
    }

    // Validate platform
    if (!platform || !["android", "ios"].includes(platform.toLowerCase())) {
      return reply.code(400).send({
        msg: "Invalid platform, it should be either 'android' or 'ios'",
      });
    }

    try {
      const session = await createSession(`http://${proxy}`, apiKey, platform);
      if (!session) {
        return reply.code(500).send({
          msg: "An error occurred while creating the session id",
        });
      }

      await incrementRequestCount(apiKey);
      return reply.code(200).send(session);
    } catch (err) {
      return reply.code(500).send({
        msg: `An error occurred while creating the session id: ${err}`,
      });
    }
  }
);

app.listen({ host: "::", port: 4502 }, async (err, address) => {
  if (err) {
    console.error(err);
  }
  await dbConnect();
  console.log(`Server listening at ${address}`);
});
