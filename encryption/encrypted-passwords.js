"use strict";

const crypto = require("crypto");


const hashText = function(clearText, method, salt) {
  if (!~["sha1", "md5", "sha256", "sha512"].indexOf(method)) {
    return console.error("Hash method not supported.");
  }
  return crypto.createHash(method).update(salt + clearText).digest("hex");
};

const randomString = function(length, hexa) {
  const possibleChars = hexa ? "abcdef0123456789" : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";
  for (let i = 0; i < length; i += 1) {
    randomString += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
  }

  return randomString;
};

// Generate a random password
const generatePassword = module.exports.generatePassword = function(size) {
  return randomString(size || 12);
};

const generateSalt = function() {
  return randomString(6, true);
};

// Encrypt a password
const encryptPassword = module.exports.encryptPassword = function(clearText, methodParam, saltParam) {
  const salt = saltParam || generateSalt();
  const method = methodParam || "sha512";

  const hash = hashText(clearText, method, salt);

  return `${method}$${salt}$${hash}`;
};

// Check a password
module.exports.checkPassword = function(password, encryptedPassword) {
  const pwdParts = encryptedPassword.split("$");
  if (pwdParts.length < 3) {
    return console.error("Encrypted password bad format");
  }
  // FIXME: handle case when the salt has $$$$$ in it
  return encryptPassword(password, pwdParts[0], pwdParts[1]) === encryptedPassword;
};

// generate a hash from random string
module.exports.generateRandomHash = function(methodParam) {
  const seed = generatePassword(160);
  const method = methodParam || "sha1";

  const hash = hashText(seed, method, "");

  return hash;
};
