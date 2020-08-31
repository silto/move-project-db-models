"use strict";

const constants = require("../constants");

const validatePassword = function(value) {
  return value === null || value === undefined || constants.passwordRegex.test(value);
};

module.exports = function(UserSchema) {
  UserSchema.path("pwd").validate(validatePassword, "Password should be at least 6 characters.");
};
