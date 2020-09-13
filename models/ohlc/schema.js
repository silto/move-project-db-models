"use strict";
/* eslint camelcase: 0*/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const constants = require("../constants");
const { ObjectId } = Schema.Types;

module.exports = function() {
  const OHLCSchema = new Schema({
    move: {
      type: ObjectId,
      ref: "Move",
      required: true,
    },
    symbol: {
      type: String,
      required: true,
      index: true,
    },
    period: {
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
  OHLCSchema.index({move: 1, timeframe: 1, date: 1});
  return OHLCSchema;
};
