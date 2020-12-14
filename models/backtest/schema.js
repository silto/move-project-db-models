"use strict";
/* eslint camelcase: 0*/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const constants = require("../constants");
// const { ObjectId } = Schema.Types;

module.exports = function(config) {
  const BacktestSchema = new Schema({
    parameters: {
      startTime: Date,
      endTime: Date,
      side: {
        type: String,
        enum: ["long", "short"],
        required: true,
      },
      openCandle: Number,// position of the open candle
      positionSize: {// as % of account
        type: Number,
        required: true,
      },
      takeProfit: Number,// as % of open price (openPrice = 100, tp = 30 side = long => tp @ 70)
      stopLoss: Number,// as % of open price
      takerFee: Number,// as %
      makerFee: Number,//as %
      slippage: Number,// as % of target price
    },
    results: {
      trades: Number,
      wins: Number,
      losses: Number,
      startAccount: Number,
      endAccount: Number,
      liquidated: Boolean,
      equityHistory: [{
        date: Date,
        equity: Number,
      }],
    },
    startRunTime: Date,
    endRunTime: { type: Date, expires: 3600 * config.backtestTTL },
    error: String,
    status: {
      type: String,
      enum: ["inqueue", "running", "finished", "error"],
      required: true,
    },
  });
  // BacktestSchema.index({side: 1, positionSize: 1});
  return BacktestSchema;
};
