"use strict";

const accessDatesPlugin = require("../plugins/access-dates-plugin");

module.exports = function(MoveSchema, config) {
  MoveSchema.plugin(accessDatesPlugin);
};
