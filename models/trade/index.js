"use strict";

const mongoose = require("mongoose");

module.exports = function() {
  const TradeSchema = require("./schema")();
  return mongoose.model("Trade", TradeSchema);
};
