const crypto = require("crypto");

module.exports = (data, iv, key) => {
  var decipher = crypto.createDecipheriv("aes-128-ctr", key, iv);
  let decrypted = decipher.update(data, "binary", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};
