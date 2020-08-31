"use strict";

module.exports = function accessDatesPlugin(schema) {
  const fields = {
    updt: Date,
  };
  schema.add(fields);

  schema.pre("save", function(next) {
    this.updt = new Date();
    next();
  });
};
