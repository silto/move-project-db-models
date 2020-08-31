"use strict";

module.exports = {
  usernameRegex: /[a-z0-9_\-.]{3,50}/i,
  nameRegex: /.{0,50}/i,
  handleRegex: /[a-z0-9_\-.]{3,50}/i,
  // TODO: A mail can't be regexed !
  mailRegex: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  passwordRegex: /^.{6,}$/,
  DUPLICATE_KEY_ERROR: 11000,
};
