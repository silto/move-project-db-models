"use strict";

const crypto = require("crypto");

const randomString = function(length, numeric) {
  const possibleChars = numeric ? "0123456789" :
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";
  for (let i = 0; i < length; i += 1) {
    randomString += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
  }
  return randomString;
};

// Generate a random password
module.exports.generateToken = function(size, numeric) {
  return randomString(size || 32, numeric);
};

// Generate a random password
module.exports.generateUniqNumericCode = function(size, buffer) {
  let randomGen = randomString(size || 32, true);
  const checker = (code) => code === randomGen;
  while (buffer.some(checker)) {
    randomGen = randomString(size || 32, true);
  }
  return randomGen;
};

module.exports.encryptToken = function(token, tokenEncryptionKey) {
  const key = new Buffer(tokenEncryptionKey, "hex");//encryption key must be 32bytes hex
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-ctr", key, iv);
  let encrypted = cipher.update(token, "utf8", "hex");
  encrypted += cipher.final("hex");
  const ivString = iv.toString("hex");
  return `${ivString}&${encrypted}`;
};

const decryptToken = module.exports.decryptToken = function(encryptedToken, tokenEncryptionKey) {
  const key = new Buffer(tokenEncryptionKey, "hex");//encryption key must be 32bytes hex
  const cypherParts = encryptedToken.split("&");
  const iv = new Buffer(cypherParts[0], "hex");
  const data = new Buffer(cypherParts[1], "hex");
  const decipher = crypto.createDecipheriv("aes-256-ctr", key, iv);
  let decrypted = decipher.update(data, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

module.exports.checkToken = function(token, encryptedToken, tokenEncryptionKey) {
  const dbToken = decryptToken(encryptedToken, tokenEncryptionKey);
  return dbToken === token;
};
