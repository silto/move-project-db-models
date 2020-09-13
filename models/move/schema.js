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
      enum: ["daily", "weekly", "quarterly"],
      required: true,
    },
    openAsFutureDate: Date,
    openDate: {
      type: Date,
      required: true,
    },
    closeDate: Date,
    expirationPrice: Number,
    IVFuture: Number,
    IVOpen: Number,
    RV: Number,
    strike: Number,
  });
  MoveSchema.index({openDate: 1, openDuration: 1});
  return MoveSchema;
};
