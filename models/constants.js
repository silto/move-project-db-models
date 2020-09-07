"use strict";

module.exports = {
  usernameRegex: /[a-z0-9_\-.]{3,50}/i,
  nameRegex: /.{0,50}/i,
  handleRegex: /[a-z0-9_\-.]{3,50}/i,
  // TODO: A mail can't be regexed !
  mailRegex: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  passwordRegex: /^.{6,}$/,
  DUPLICATE_KEY_ERROR: 11000,
  OHLC_PERIODS: {
    "1m": 60,
    "3m": 180,
    "5m": 300,
    "15m": 900,
    "30m": 1800,
    "1h": 3600,
    "2h": 7200,
    "4h": 14400,
    "6h": 21600,
    "12h": 43200,
    "1d": 86400,
    "3d": 259200,
    "1w": 604800,
  },
};
