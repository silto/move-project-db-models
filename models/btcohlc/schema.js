"use strict";
/* eslint camelcase: 0*/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const constants = require("../constants");

module.exports = function() {
  const BTCOHLCSchema = new Schema({
    exchange: String,
    timeframe: {
      type: String,
      enum: [
        "1m",
        "3m",
        "5m",
        "15m",
        "30m",
        "1h",
        "2h",
        "4h",
        "6h",
        "12h",
        "1d",
        "3d",
        "1w",
      ],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timestamp: {
      type: Number,
      required: true,
    },
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    volume: Number,
  });
  BTCOHLCSchema.index({timeframe: 1, date: 1, timestamp: 1});
  return BTCOHLCSchema;
};
