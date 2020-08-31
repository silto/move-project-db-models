"use strict";

const accessDatesPlugin = require("../plugins/access-dates-plugin");
const encryptPasswordPlugin = require("../plugins/encrypt-password-plugin");
const encryptTokenPlugin = require("../plugins/encrypt-token-plugin");

module.exports = function(UserSchema, config) {
  UserSchema.plugin(accessDatesPlugin);
  UserSchema.plugin(encryptPasswordPlugin, {
    fields: ["pwd"],
  });

  UserSchema.plugin(encryptTokenPlugin, {
    fields: [
      {token: "npwd_token", date: "npwd_date", expiration: 1440, renewalTime: 120},
      {token: "nmail_token", date: "nmail_date", expiration: 1440, renewalTime: 120},
      {token: "signupMailToken", date: null, expiration: null},
    ],
    tokenEncryptionKey: config.tokenEncryptionKey,
  });
};
