"use strict";

const mongoose = require("mongoose");

module.exports = function(config, helpers) {
  const UserSchema = require("./schema")(config);
  // Apply plugins, methods and hooks
  // require("./virtuals")(UserSchema);
  UserSchema.methods = require("./methods")(config, helpers);
  UserSchema.statics = require("./statics")(config, helpers);
  require("./plugins")(UserSchema, config);
  require("./validates")(UserSchema);
  return mongoose.model("User", UserSchema);
};
