const { Curl } = require("node-libcurl");
// const nodeLibCurl = require("/Users/ola/Downloads/binding_arm64/node_libcurl");
const Caseless = require("caseless");
const UserAgents = require("user-agents");
const multipart = require("./multipart.js");
const { compress, uncompress, randomIp } = require("./utils.js");

class CurlYoshi {
  constructor(options) {
    return this.init(options);
  }

  static parse = {
    stringify: function (data) {
      try {
        return JSON.stringify(data);
      } catch (error) {
        return data;
      }
    },
    json: function (data) {
      try {
        return JSON.parse(data);
      } catch (error) {
        return data;
      }
    },
    xmlToJson: function (data) {
      try {
        const json = {};
        for (const xml of data.matchAll(
          /(?:<(\w*)(?:\s[^>]*)*>)((?:(?!<\1).)*)(?:<\/\1>)|<(\w*)(?:\s*)*\/>/gm
        )) {
          const key = xml[1] || xml[3];
          const value = xml[2] && this.xmlToJson(xml[2]);
          if (json[key] !== undefined) {
            if (!Array.isArray(json[key])) {
              json[key] = [json[key]];
            }
            json[key].push(value && Object.keys(value).length ? value : xml[2]);
          } else {
            json[key] = value && Object.keys(value).length ? value : xml[2];
          }
        }
        return json;
      } catch (error) {
        return data;
      }
    },
  };

  init(options) {
    if (options.qs) {
      const parsed = new URL(options.url);
      options.url += !parsed.search ? `?` : parsed.search == "?" ? "" : "&";
      const values = [];
      for (let key in options.qs) {
        values.push(`${key}=${options.qs[key]}`);
      }
      options.url += values.join("&");
      delete options.qs;
    }

    return new Promise((resolve) => {
      const curl = new Curl();

      curl.setOpt("URL", options.url);

      if (options.verbose) {
        curl.setOpt(Curl.option.VERBOSE, true);
        curl.setOpt(Curl.option.DEBUGFUNCTION, (infoType, content) => {
          if (infoType == 0) {
            console.log(Buffer.from(content).toString().trim());
          }
        });
      }

      curl.setOpt(Curl.option.SSL_VERIFYPEER, false);
      curl.setOpt(Curl.option.SSL_VERIFYHOST, false);
      curl.setOpt(Curl.option.SSL_VERIFYSTATUS, false);

      curl.setOpt(Curl.option.SSL_ENABLE_ALPN, false);
      curl.setOpt(Curl.option.SSL_ENABLE_NPN, false);

      if (options.cert) {
        curl.setOpt(Curl.option.SSLCERT, options.cert);
      }

      if (options.key) {
        curl.setOpt(Curl.option.SSLKEY, options.key);
      }

      curl.setOpt(Curl.option.CUSTOMREQUEST, options.method || "GET");

      if (options.timeout) {
        curl.setOpt(Curl.option.TIMEOUT_MS, options.timeout);
      }

      if (options.forever) {
        curl.setOpt(Curl.option.TCP_KEEPALIVE, 2);
        curl.setOpt(Curl.option.FORBID_REUSE, 0);
        curl.setOpt(Curl.option.FRESH_CONNECT, 0);
      } else {
        curl.setOpt(Curl.option.TCP_KEEPALIVE, 0);
        curl.setOpt(Curl.option.FORBID_REUSE, 2);
        curl.setOpt(Curl.option.FRESH_CONNECT, 1);
      }

      curl.setOpt(Curl.option.PATH_AS_IS, options.rebuild);

      let headers = {};
      for (let header of Object.keys(options.headers)) {
        if (header.toLowerCase() == "cookie") {
          if (options.jar) {
            let cookiesInJar = options.jar.getCookieStringSync(options.url);
            if (!cookiesInJar) {
              Object.assign(headers, { [header]: options.headers[header] });
            } else {
              Object.assign(headers, {
                [header]: `${options.headers[header]}; ${cookiesInJar}`,
              });
            }
          } else {
            Object.assign(headers, { [header]: options.headers[header] });
          }
        } else {
          Object.assign(headers, { [header]: options.headers[header] });
        }
      }

      let caseless = Caseless(headers);
      if (!caseless.has("cookie") && options.jar) {
        let cookiesInJar = options.jar.getCookieStringSync(options.url);
        if (cookiesInJar) Object.assign(headers, { cookie: cookiesInJar });
      }

      let postdata;
      if (options.form) {
        let data = [];
        let keys = Object.keys(options.form);

        for (let i in keys) {
          let key = keys[i];
          data.push(`${key}=${options.form[key]}`);
        }

        let fields = data.join("&");

        if (!headers) {
          headers = {
            "content-type": "application/x-www-form-urlencoded",
          };
        }
        if (!caseless.get("content-type")) {
          caseless.set("content-type", "application/x-www-form-urlencoded");
        }
        postdata = fields;
        delete options.form;
      } else if (options.body) {
        if (!headers) {
          headers = {
            "content-type": "application/x-www-form-urlencoded",
          };
        }
        if (!caseless.get("content-type")) {
          caseless.set("content-type", "application/x-www-form-urlencoded");
        }
        postdata = options.body;
        delete options.body;
      } else if (options.json) {
        if (typeof options.json !== "boolean") {
          if (!headers) {
            headers = {
              "content-type": "application/json",
            };
          }
          if (!caseless.get("content-type")) {
            caseless.set("content-type", "application/json");
          }
          postdata = CurlYoshi.parse.stringify(options.json);
          delete options.json;
        }
      } else if (options.multipart) {
        let boundary = options.boundary || "X-CURLYOSHI-BOUNDARY";
        if (!headers) {
          headers = {
            "content-type": `multipart/form-data; boundary=${boundary}`,
          };
        }
        if (!caseless.get("content-type")) {
          caseless.set(
            "content-type",
            `multipart/form-data; boundary=${boundary}`
          );
        }
        multipart(options.multipart, boundary, function (err, parts) {
          if (err) throw err;
          postdata = parts;
        });
        delete options.multipart;
      }

      if (typeof postdata == "string" && !options.gzip) {
        curl.setOpt(Curl.option.POSTFIELDS, postdata);
      }

      if (options.gzip) {
        caseless.set("content-encoding", "gzip");
        let compressed = compress(postdata, "gzip");
        curl.setOpt(Curl.option.POST, 1);
        curl.setOpt(Curl.option.READFUNCTION, (buffer, size, nmemb) => {
          const chunkSize = size * nmemb;
          const chunk = compressed.slice(0, chunkSize);
          compressed = compressed.slice(chunkSize);
          chunk.copy(buffer);
          return chunk.length;
        });
        curl.setOpt(Curl.option.POSTFIELDSIZE, compressed.length);
        curl.setOpt(Curl.option.ACCEPT_ENCODING, "gzip, deflate");
      } else {
        curl.setOpt(Curl.option.HTTP_CONTENT_DECODING, "0");
      }

      if (options.http2) {
        curl.setOpt(Curl.option.SSL_ENABLE_ALPN, true);
        curl.setOpt(Curl.option.HTTP_VERSION, "CURL_HTTP_VERSION_2_0");
      } else {
        curl.setOpt(Curl.option.HTTP_VERSION, "CURL_HTTP_VERSION_1_1");
      }

      if (options.xff) {
        caseless.set("x-real-ip", randomIp());
        caseless.set(
          "x-forwarded-for",
          `${randomIp()}, ${randomIp()}, ${randomIp()}`
        );
        caseless.set("true-client-ip", randomIp());
      }

      if (!caseless.has("user-agent")) {
        let userAgent = new UserAgents({
          deviceCategory: options.desktop ? "desktop" : "mobile",
        });
        caseless.set("user-agent", userAgent.toString());
      }

      curl.setOpt(
        Curl.option.HTTPHEADER,
        Object.keys(headers).map((key) => `${key}: ${headers[key]}`)
      );

      if (options.proxy) {
        let proxy =
          typeof options.proxy == "function" ? options.proxy() : options.proxy;
        curl.setOpt(Curl.option.PROXY, proxy);
      }

      curl.setOpt(Curl.option.FOLLOWLOCATION, false);

      if (options.ciphers) {
        curl.setOpt(Curl.option.SSL_CIPHER_LIST, options.ciphers);
      }

      curl.on("end", function (statusCode, data, headers) {
        let respHeaders = headers[headers.length - 1];
        delete respHeaders.result;
        if (options.jar) {
          let { protocol, host } = new URL(options.url);
          let hostname = `${protocol}//${host}/`;
          let caseless = Caseless(respHeaders);
          if (caseless.has("set-cookie")) {
            caseless.get("set-cookie").forEach(function (line) {
              let cookie = line.split(";")[0];
              options.jar.setCookieSync(cookie, hostname);
            });
          }
        }

        if (options.followRedirects && curl.getInfo(Curl.info.REDIRECT_URL)) {
          options.redirectCount = options.redirectCount + 1 || 1;
          if (options.redirectCount != options.maxRedirects) {
            options.forever = true;
            options.url = curl.getInfo(Curl.info.REDIRECT_URL);

            options.method = options.followMethod || options.method || "GET";
            if (options.method.toLowerCase() == "get") {
              delete options.form;
              delete options.body;
            }

            this.close();
            return resolve(new CurlYoshi(options));
          }
        }

        if (options.xmlToJson) {
          data = CurlYoshi.parse.xmlToJson(data);
        } else {
          data = CurlYoshi.parse.json(data);
        }

        let response = {
          body: data,
          headers: respHeaders,
          statusCode: statusCode,
        };

        this.close();

        resolve(response);
      });

      curl.on("error", function (error) {
        curl.close.bind(curl);
        this.close();
        resolve(error.message);
      });

      try {
        curl.perform();
      } catch (error) {
        curl.close();
        resolve(error.message);
      }
    });
  }
}

module.exports = CurlYoshi;
