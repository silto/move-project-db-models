"use strict";

const accessDatesPlugin = require("../plugins/access-dates-plugin");

module.exports = function(BacktestSchema, config) {
  BacktestSchema.plugin(accessDatesPlugin);
};
