"use strict";
/* eslint camelcase: 0*/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const constants = require("../constants");
// const { ObjectId } = Schema.Types;

module.exports = function(config) {
  const MoveSchema = new Schema({
    symbol: {
      type: String,
      required: true,
      index: true,
    },
    openDuration: {
      type: String,
      enum: ["D", "W", "Q"],
      required: true,
    },
    openAsFutureDate: Date,
    openDate: Date,
    closeDate: Date,
    expirationPrice: Number,
    IV: Number,
    RV: Number,
    strike: Number,
    history: [{
      timestamp: Number,
      date: Date,
      open: Number,
      high: Number,
      low: Number,
      close: Number,
      volume: Number,
    }],
    relativeHistory: [{
      timestamp: Number,
      date: Date,
      open: Number,
      high: Number,
      low: Number,
      close: Number,
      volume: Number,
    }],
    trades: [{
      timestamp: Number,
      date: Date,
      liquidation: Boolean,
      price: Number,
      side: String,
      size: Number,
    }],
  });

  return MoveSchema;
};
