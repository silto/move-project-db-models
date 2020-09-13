"use strict";

const mongoose = require("mongoose");

module.exports = function() {
  const OHLCSchema = require("./schema")();
  return mongoose.model("OHLC", OHLCSchema);
};
