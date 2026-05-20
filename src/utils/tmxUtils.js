const crypto = require("crypto");
const THREE = require("three");
const zlib = require("zlib");

function encrypt(decrypted_string, session_id) {
  try {
    let td_G = decrypted_string.length.toString() + "&" + decrypted_string;
    let td_r = "";
    let td_D = "0123456789abcdef";
    for (let td_g = 0; td_g < td_G.length; td_g++) {
      let td_E =
        td_G.charCodeAt(td_g) ^
        (session_id.charCodeAt(td_g % session_id.length) & 10);
      td_r += td_D[(td_E >> 4) & 15];
      td_r += td_D[td_E & 15];
    }
    return td_r;
  } catch (e) {
    return null;
  }
}

function decrypt(encrypted_string, session_id) {
  try {
    var td_D = "0123456789abcdef";
    var td_G = "";
    for (var td_g = 0; td_g < encrypted_string.length; td_g += 2) {
      var td_E =
        (td_D.indexOf(encrypted_string.charAt(td_g)) << 4) |
        td_D.indexOf(encrypted_string.charAt(td_g + 1));
      var td_T = session_id.charCodeAt((td_g / 2) % session_id.length) & 10;
      td_G += String.fromCharCode(td_E ^ td_T);
    }
    var td_U_length = parseInt(td_G.split("&")[0]);
    var td_U = td_G.substring(
      td_G.indexOf("&") + 1,
      td_U_length + td_G.indexOf("&") + 1
    );
    return td_U;
  } catch (td_d) {
    return null;
  }
}

function randomString(length) {
  var result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789.-~_";
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function randomSid(length) {
  const __PAIR64__ = (high, low) => (BigInt(high) << 32n) | BigInt(low);
  const special_chars = "-_.~";
  var random = "";
  for (var i = 0, random = ""; i < length; i++) {
    var n = THREE.MathUtils.randInt(0, 39);
    if (n <= 25) random += String.fromCharCode(n + 97);
    else if ((__PAIR64__(((length * (length - 1)) & 1) == 0n, n) - 36n) >> 32n)
      random += special_chars[n - 36];
    else random += String.fromCharCode((n & 0xe5) - (~n & 0x1a) + 48);
  }
  return random;
}

function randomSessionId(len) {
  var maxlen = 8,
    min = Math.pow(16, Math.min(len, maxlen) - 1),
    max = Math.pow(16, Math.min(len, maxlen)) - 1,
    n = Math.floor(Math.random() * (max - min + 1)) + min,
    r = n.toString(16);
  while (r.length < len) {
    r = r + randomSessionId(len - maxlen);
  }
  return r;
}

function hashPayload(random, nonce, date) {
  var concatenated = random + nonce + date + "strong:ecdsa" + "BCD";
  var hash = crypto.createHash("sha256").update(concatenated).digest("hex");
  return hash;
}

function getAESKey(crc32Array) {
  let keyBuffer = Buffer.alloc(16);
  for (let i = 0; i < crc32Array.length; i++) {
    let valueBuffer = Buffer.alloc(4);
    valueBuffer.writeInt32BE(crc32Array[i]);
    valueBuffer.copy(keyBuffer, i * 4, 0, 4);
  }
  return keyBuffer;
}

function signECDSA(data) {
  var keyPair = crypto.generateKeyPairSync("ec", {
    namedCurve: "P-256",
    publicKeyEncoding: { type: "spki", format: "der" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });

  var sign = crypto.createSign("sha256");
  sign.write(data);
  sign.end();

  var signature = sign.sign(keyPair.privateKey, "hex");

  return {
    sidKey: keyPair.publicKey.toString("hex"),
    sidSig: signature.toString("hex"),
  };
}

module.exports = {
  encrypt,
  decrypt,
  randomSid,
  randomString,
  randomSessionId,
  hashPayload,
  getAESKey,
  signECDSA,
};
