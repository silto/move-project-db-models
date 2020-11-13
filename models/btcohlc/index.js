"use strict";

const mongoose = require("mongoose");

module.exports = function() {
  const BTCOHLCSchema = require("./schema")();
  return mongoose.model("BTCOHLC", BTCOHLCSchema);
};
