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
  cookie.setCookie(`thx_guid=${thx}`, "https://dfme.kleinanzeigen.de/");
  var deviceData = generateDevice();
  var deviceId = crypto.randomUUID().toString().toUpperCase();
  var osVersion = "9";
  var sessionId = crypto
    .randomUUID()
    .toString()
    .replaceAll("-", "")
    .toLowerCase();
  var sidRandom = tmxUtils.randomSid(16);
  const tmxVersion = "7.3-50";

  var conf = await curlyoshi({
    method: "POST",
    url: "https://dfme.kleinanzeigen.de/fp/mobile/conf",
    form: {
      org_id: orgId,
      os: "android",
      osVersion: osVersion,
      session_id: sessionId,
      sdk_version: tmxVersion,
      thx: thx,
    },
    headers: {
      Host: "dfme.kleinanzeigen.de",
      Accept: "*/*",
      "Content-Encoding": "gzip",
      "Accept-Language": "de-DE,de;q=0.9",
      "Accept-Encoding": "gzip, deflate",
      "Cache-Control": "no-cache, no-store, must-revalidate, no-transform",
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": deviceData.web.headers["User-Agent"],
      Connection: "keep-alive",
      Referer: "http://Kleinanzeigen/",
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

  // Kleinanzeigen
  const sah =
    "44650041ae979a79d44754c01a11116ed9fa7512b2700fc584423579f6ac03c7";
  const auah =
    "483a3f2f1b7a826416f1e9bbcf4e18f6eed392ab5546b8876c847fea0e848775";
  const bid = crypto.randomUUID().replaceAll("-", "").toUpperCase();
  const swid = crypto.randomUUID().replaceAll("-", "").toLowerCase();
  const vid = crypto.randomUUID().replaceAll("-", "").toUpperCase();
  const now = Math.floor(Date.now() / 1000);
  const apbt = 1723240601; // app build time
  const anv = "com.ebaykleinanzeigen.ebc:100.17.0:24.221.1930:arm64"; // app version
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
  const afs = getPercentualValue(
    deviceData.iphone.harddisk.size,
    THREE.MathUtils.randFloat(45, 94)
  );
  const pri = THREE.MathUtils.randInt(20, 200);
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
  const ftsn = THREE.MathUtils.randInt(198, 225);
  const fts = crypto.createHash("md5").update(randomHash(12)).digest("hex");
  const ani = randomHash(16);

  const adid = crypto.randomUUID().toString();
  const mac = "XX:XX:XX:XX:XX:XX"
    .replace(/X/g, () => {
      return "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16));
    })
    .toLowerCase();

  var tmxPayload = {
    hh: hh,
    autm: "0",
    aspl: "2019-07-05",
    aos: "android",
    lq: `Mozilla/5.0 (Linux; Android 9; ASUS_AI2205_A Build/PQ3A.190605.07291528; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/91.0.4472.114 Mobile Safari/537.36 ${tmxVersion}`,
    cos: "android",
    aov: "9",
    pid: pid,
    dr: "http://com.ebay.kleinanzeigen",
    apd: cpi,
    bhsydpi: "240.0",
    bbtm: bbtm,
    sa_pt:
      "eG1OlxAQSbKHthmRGi_y5o:APA91bFCkkPR4OqNHus4EYO5wbRnwo0W7GIpQmkmc0V7g370n3_M6N6T8kbKvcVL0IX4etejptW5xgayslRdwRCpNswnqqXSx78BdCiTettkUCD29RSvHr3Rs3KjznfOdInsXfU034OQ",
    ics: "0",
    ftsn: `${ftsn}`,
    btst: `{"level":${batery},"status":"${bateryStatus}"}`,
    atr: `{"cpo":1147859351997775358,"dyo":1147859351997775358,"psi":1,"pri":${pri},"cpi":${cpi},"ori":"landscape","adb":0,"dper":["ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION", "CHANGE_WIFI_STATE"],"mif":"2","crs":"0"}`,
    tzd: "America/Sao_Paulo",
    ats: deviceData.iphone.harddisk.size,
    ab: "rog, rog",
    ad: "marlin",
    alo: "de_DE",
    // mr: "2",
    cps: "2865600,2865600,2865600,2865600",
    ah: "d27b553239b744257e20e974b7e051ef",
    mto: "4040988",
    al: "de-de",
    am: "asus_ai2205_a",
    mdf: mdf,
    bhsshpx: "900",
    ppid: `${THREE.MathUtils.randInt(5000, 9000)}`,
    upl: '{"granted":["com.google.android.gms.permission.AD_ID","android.permission.ACCESS_NETWORK_STATE","android.permission.ACCESS_WIFI_STATE"],"denied":["android.permission.ACCESS_FINE_LOCATION","android.permission.ACCESS_COARSE_LOCATION"]}',
    at: "agent_mobile",
    av: tmxVersion,
    name: "ASUS_AI2205_A",
    mds: mds,
    swid: swid,
    wc: "wifi",
    mac: `{"${mac}":"wlan0"}`,
    se: "enforcing",
    bhsdmo: "android-9 ROG:marlin",
    adid: adid,
    ipv4: `{"${randomIpv4}":"wlan0"}`,
    pldec1: '{"description":"Not Cloned"}',
    nci: `;:127.0.0.1:TCP:${THREE.MathUtils.randInt(
      400,
      50000
    )}-0.0.0.0:TCP:0;:${randomIp.v4()}:TCP:${THREE.MathUtils.randInt(
      400,
      50000
    )}-${randomIp.v4()}:TCP:9090;:127.0.0.1:TCP:${THREE.MathUtils.randInt(
      400,
      50000
    )}-127.0.0.1:TCP:${THREE.MathUtils.randInt(
      400,
      50000
    )};:${randomIp.v4()}:TCP:${THREE.MathUtils.randInt(
      400,
      50000
    )}-${randomIp.v4()}:TCP:${THREE.MathUtils.randInt(
      400,
      50000
    )};:${randomIp.v4()}:TCP:${THREE.MathUtils.randInt(
      400,
      50000
    )}-8.8.8.8:TCP:853;:127.0.0.1:TCP:${THREE.MathUtils.randInt(
      400,
      50000
    )}-127.0.0.1:TCP:${THREE.MathUtils.randInt(
      400,
      50000
    )};:127.0.0.1:TCP:${THREE.MathUtils.randInt(
      400,
      50000
    )}-127.0.0.1:TCP:${THREE.MathUtils.randInt(400, 50000)};;`,
    ipv6: `["${randomIpv6["1"]} : wlan0","${randomIpv6["2"]} : wlan0","${randomIpv6["3"]} : wlan0"`,
    prst: prst,
    sah: "88f67303ccb3f3ded33e8a173908c613a6ee87f5b058d2fd5f1f5c83fc201c32",
    ani: ani,
    mex2: '{"mlc":8,"mls":85550887,"slc":229,"sls":604308682,"tda":true}',
    c: "-480",
    mdtm: "0",
    fts: fts,
    mex6: "0",
    f: "1600x900",
    nhc: "4",
    anv: "com.ebay.kleinanzeigen:100.16.0:676553:x86_64",
    ah2: "97b400c725fca85a0ed202ea6864d37ad69bba10997d2329ebd12237df2c117c",
    afs: afs,
    abt: abt,
    bhsxdpi: "240.0",
    asi: "{no=72400, non=Nextel, nc_iso=DE}",
    w: nonce,
    z: "60",
    bhssnby: "6.6666665",
    bhssnbx: "3.75",
    lh: "http://com.ebay.kleinanzeigen/mobile",
    bhsswpx: "1600",
  };

  var jaEncrypted = tmxUtils.encrypt(
    querystring.stringify(tmxPayload),
    sessionId
  );

  await curlyoshi({
    method: "POST",
    url: `https://dfme.kleinanzeigen.de/fp/clear.png;CIS3SID=${CIS3SID}`,
    form: {
      org_id: orgId,
      ja: jaEncrypted,
      h: "0",
      session_id: sessionId,
      m: "2",
      nonce: nonce,
    },
    headers: {
      Host: "dfme.kleinanzeigen.de",
      Accept: "*/*",
      "Content-Encoding": "gzip",
      "Accept-Language": "de-DE,de;q=0.9",
      "Accept-Encoding": "gzip, deflate",
      "Cache-Control": "no-cache, no-store, must-revalidate, no-transform",
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": deviceData.web.headers["User-Agent"],
      Connection: "keep-alive",
      Referer: "http://Kleinanzeigen/",
    },
    forever: true,
    gzip: true,
    jar: cookie,
    proxy,
  }).then((res) => res.body);

  return { sessionId, deviceId };
};

module.exports = { createSession };
