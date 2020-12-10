"use strict";
/* eslint camelcase: 0*/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const constants = require("../constants");
// const { ObjectId } = Schema.Types;

module.exports = function() {
  const BacktestSchema = new Schema({
    parameters: {
      startTime: Date,
      endTime: Date,
      side: {
        type: String,
        enum: ["long", "short"],
        required: true,
      },
      openCandle: Number,
      positionSize: {
        type: Number,
        required: true,
      },
      takeProfit: Number,
      stopLoss: Number,
      takerFee: Number,
      makerFee: Number,
      slippage: Number,
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
    endRunTime: Date,
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
