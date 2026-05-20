const querystring = require("querystring");
const crypto = require("crypto");
const crc32 = require("crc-32");
const math = require("mathjs");
const async = require("async");
const THREE = require("three");
const format = require("date-format");
const {
  curlyoshi,
  tmxUtils,
  getProxy,
  randomIp,
  randomInt,
  xmlToJson,
  generateDevice,
  randomHash,
  decryptAES,
  sleep,
  splitBuffer,
  axialMovement,
  formatPayload,
  angle,
  magnitude,
  toFixed,
  resultant,
  invertVector,
  normalizeVector,
  cummulativeNonce,
  getPercentualValue,
  BBTM,
  PRST,
  randomStr,
} = require("../utils");

const createSession = async (proxy) => {
  const orgId = "udd8uxur";
  var cookie = curlyoshi.jar();
  const thx = crypto.randomUUID().replaceAll("-", "");
  cookie.setCookie(`thx_guid=${thx}`, "https://dfme.<domain>.com/");
  var deviceData = generateDevice();
  var deviceId = crypto.randomUUID().toString().toUpperCase();
  var osVersion = deviceData.iphone.ios.version;
  var sessionId = crypto.randomUUID().toString();
  var sidRandom = tmxUtils.randomSid(16);
  const tmxVersion = "7.3-29";

  var conf = await curlyoshi({
    method: "POST",
    url: "https://dfme.<domain>.com/fp/mobile/conf",
    form: {
      org_id: orgId,
      os: "iOS",
      osVersion: osVersion,
      session_id: sessionId,
      sdk_version: tmxVersion,
      cafs: "<12_CHARACTERS_LONG_INTEGER_STRING>", // 12 characters long integer string, every app has a different cafs
      cats: "<12_CHARACTERS_LONG_INTEGER_STRING>", // 12 characters long integer string, every app has a different cats
      thx: thx,
    },
    headers: {
      Host: "dfme.<domain>.com",
      Accept: "*/*",
      "Content-Encoding": "gzip",
      "Accept-Language": "de-DE,de;q=0.9",
      "Accept-Encoding": "gzip, deflate",
      "Cache-Control": "no-cache, no-store, must-revalidate, no-transform",
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": deviceData.web.headers["User-Agent"],
      Connection: "keep-alive",
      Referer: "http://<domain>/",
    },
    forever: true,
    gzip: true,
    jar: cookie,
    proxy,
  }).then((res) => res.body);

  var confBuffer = Buffer.from(conf, "base64");
  var { pairBuffer, oddBuffer } = splitBuffer(confBuffer.subarray(0, 32));
  var nonce = pairBuffer.toString();
  var nonceSeed = cummulativeNonce(nonce);
  var confKey = tmxUtils.getAESKey([
    crc32.str(nonce + sessionId),
    crc32.str(nonce + orgId),
    crc32.str(sessionId + nonce),
    crc32.str(orgId + nonce),
  ]);

  var confPayload = Buffer.concat([oddBuffer, confBuffer.subarray(32)]);
  var xml = xmlToJson(decryptAES(confPayload, nonce, confKey));
  var CIS3SID = xml.MC.S;
  var randomIpv4 = randomIp.v4();
  var randomIpv6 = {
    1: randomIp.v6(),
    2: randomIp.v6(),
    3: randomIp.v6(),
    4: randomIp.v6(),
    5: randomIp.v6(),
    6: randomIp.v6(),
    7: randomIp.v6(),
    8: randomIp.v6(),
    9: randomIp.v6(),
  };

  const sah =
    "44650041ae979a79d44754c01a11116ed9fa7512b2700fc584423579f6ac03c7";
  const auah =
    "483a3f2f1b7a826416f1e9bbcf4e18f6eed392ab5546b8876c847fea0e848775";
  const bid = crypto.randomUUID().replaceAll("-", "").toUpperCase();
  const swid = crypto.randomUUID().replaceAll("-", "").toLowerCase();
  const vid = crypto.randomUUID().replaceAll("-", "").toUpperCase();
  const now = Math.floor(Date.now() / 1000);
  const apbt = 1723240601; // app build time
  // const anv = "com.example.brand.app:100.17.0:24.221.1930:arm64";
  const anv = "<APP_PACKAGE_NAME>:<BUILD_NUMBER>:<BUILD_TIME>:<ARCHITECTURE>";
  const apit = THREE.MathUtils.randInt(apbt, now);
  const sidDate = Math.floor(Date.now() / 1000);
  const ait = Math.floor(
    (Date.now() -
      THREE.MathUtils.randInt(86400 * 1000 * 20, 86400 * 1000 * 365)) /
      1000
  );
  const abt_ms =
    Math.floor(Date.now()) - THREE.MathUtils.randInt(3600000, 86400000 * 21);
  const abt = Math.floor(abt_ms / 1000);
  const batery = (Math.random() * 0.9 + 0.1).toFixed(2);
  const bateryStatus = Math.random() < 0.5 ? "charging" : "unplugged";
  const grid = 0x100000000 + THREE.MathUtils.randInt(0x2000, 0x3000);
  const anh = crypto.createHash("sha1").update(randomHash(10)).digest("hex");
  const afs = getPercentualValue(
    deviceData.iphone.harddisk.size,
    THREE.MathUtils.randFloat(45, 94)
  );
  const hh = crypto
    .createHash("md5")
    .update(orgId + sessionId)
    .digest("hex");
  const mds = crypto
    .createHash("md5")
    .update(afs + "-" + abt)
    .digest("hex");
  const mdf = crypto.createHash("md5").update(randomHash(12)).digest("hex");
  const bbtm = 0; // BBTM(nonceSeed);
  const height = Math.floor(
    deviceData.iphone.model.viewport.height *
      deviceData.iphone.model.viewport.ratio
  );
  const width = Math.floor(
    deviceData.iphone.model.viewport.width *
      deviceData.iphone.model.viewport.ratio
  );
  const resolution = `${height}x${width}`;
  const prst = PRST(nonceSeed);
  const cpi = THREE.MathUtils.randInt(400, 1800);
  const pid = THREE.MathUtils.randInt(300, 30000);
  const lsi = crypto.randomUUID().toString();

  var sha256Payload = tmxUtils.hashPayload(sidRandom, nonce, sidDate);
  var { sidKey, sidSig } = tmxUtils.signECDSA(sha256Payload);

  var tmxPayload = {
    apit: apit,
    dr: "http://<domain>/",
    ab: "Apple",
    nhc: "6",
    bhsshpx: height.toFixed(6),
    bhsadn: "<APP_NAME>",
    ppid: 1,
    sah: sah,
    hh: hh,
    ftsn: `302`,
    mtldi: `{"ghas":0,"gn":"Apple ${deviceData.iphone.model.cpu} GPU","gms":1,"grid":${grid},"gv":"Apple"}`,
    wglv: "Apple",
    ait: ait,
    bhsswpx: width.toFixed(6),
    apbt: apbt,
    bhsdmo: "iPhone",
    auah: auah,
    bhssnbx: 2.693267,
    bbtm: bbtm,
    bhssnby: 4.78803,
    swid: swid,
    atr: `{"dyo":136279312037374,"cpi":2578,"lsi":"${lsi}","psi":2,"dbgc":"true","lps":1,"ori":"portrait","cpo":136279312037374,"lpi":2362,"mif":"1","pri":116,"dbg":"false"}`,
    aos: "iOS",
    anh: anh,
    anv: anv,
    bhsxdpi: 401,
    gr: "0",
    c: "-180",
    al: "de-DE",
    vid: vid,
    ats: deviceData.iphone.harddisk.size,
    alo: "de_DE",
    afs: afs,
    btst: `{"level":${batery},"status":"${bateryStatus}"}`,
    am: deviceData.iphone.model.code,
    mlapp: "0",
    f: resolution,
    asi: '{"0000000100000001":{"MCC":"65535","VOIP":"true","ICC":"--","CN":"--","MNC":"65535"}}',
    autm: "0",
    name: "iPhone",
    apd: cpi,
    lh: "http://<domain>/mobile",
    aov: osVersion,
    ipv4: `["${randomIpv4} : en0"]`,
    pid: pid,
    mlst: "0",
    vpn: "true",
    wglr: `Apple ${deviceData.iphone.model.cpu} GPU`,
    cos: "iOS",
    prst: prst,
    fts: "6f8054207984fcc344bc2a8105ff2075",
    bid: bid,
    abt: abt,
    mds: mds,
    wc: "wifi",
    at: "agent_mobile",
    mdf: mdf,
    tzd: "America/Sao_Paulo",
    bhsydpi: 401,
    mto: 3045136,
    fg: deviceData.app.idfv.replaceAll("-", "").toLowerCase(),
    av: tmxVersion,
    ipv6: `["${randomIpv6["1"]} : en0","${randomIpv6["2"]} : en0","${randomIpv6["3"]} : utun4","${randomIpv6["4"]} : anpi0","${randomIpv6["5"]} : awdl0","${randomIpv6["4"]} : llw0","${randomIpv6["5"]} : utun0","${randomIpv6["6"]} : utun1","${randomIpv6["7"]} : en0","${randomIpv6["8"]} : utun2","${randomIpv6["9"]} : utun3"]`,
    mex6: "1",
    caps: "BCD",
    w: nonce,
    ics: "0",
    lq: deviceData.web.headers["User-Agent"],
    z: "60",
  };

  var jaEncrypted = tmxUtils.encrypt(
    querystring.stringify(tmxPayload),
    sessionId
  );

  await curlyoshi({
    method: "POST",
    url: `https://dfme.<domain>.com/fp/clear.png;CIS3SID=${CIS3SID}`,
    form: {
      org_id: orgId,
      ja: jaEncrypted,
      sid_date: sidDate,
      sid_type: "strong%3Aecdsa",
      h: "0",
      session_id: sessionId,
      m: "2",
      sid_rnd: sidRandom,
      sid_sig: sidSig,
      sid_key: sidKey,
      nonce: nonce,
    },
    headers: {
      Host: "dfme.<domain>.com",
      Accept: "*/*",
      "Content-Encoding": "gzip",
      "Accept-Language": "de-DE,de;q=0.9",
      "Accept-Encoding": "gzip, deflate",
      "Cache-Control": "no-cache, no-store, must-revalidate, no-transform",
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": deviceData.web.headers["User-Agent"],
      Connection: "keep-alive",
      Referer: "http://<domain>/",
    },
    forever: true,
    gzip: true,
    jar: cookie,
    proxy,
  }).then((res) => res.body);

  return { sessionId: sessionId.toUpperCase(), deviceId };
};

module.exports = { createSession };
