"use strict";

const mongoose = require("mongoose");

module.exports = function(config, helpers) {
  const BacktestSchema = require("./schema")(config);
  // Apply plugins, methods and hooks
  // require("./virtuals")(BacktestSchema);
  // BacktestSchema.methods = require("./methods")(config, helpers);
  // BacktestSchema.statics = require("./statics")(config, helpers);
  require("./plugins")(BacktestSchema, config);
  // require("./validates")(BacktestSchema);
  return mongoose.model("Backtest", BacktestSchema);
};
