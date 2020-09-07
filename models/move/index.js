"use strict";

const mongoose = require("mongoose");

module.exports = function(config, helpers) {
  const MoveSchema = require("./schema")(config);
  // Apply plugins, methods and hooks
  // require("./virtuals")(UserSchema);
  // MoveSchema.methods = require("./methods")(config, helpers);
  // MoveSchema.statics = require("./statics")(config, helpers);
  require("./plugins")(MoveSchema, config);
  // require("./validates")(MoveSchema);
  return mongoose.model("Move", MoveSchema);
};
