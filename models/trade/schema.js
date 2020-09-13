"use strict";
/* eslint camelcase: 0*/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const constants = require("../constants");
const { ObjectId } = Schema.Types;

module.exports = function() {
  const TradeSchema = new Schema({
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
    date: {
      type: Date,
      required: true,
    },
    timestamp: {
      type: Number,
      required: true,
    },
    liquidation: Boolean,
    price: Number,
    side: String,
    size: Number,
  });
  TradeSchema.index({move: 1, date: 1});
  return TradeSchema;
};
