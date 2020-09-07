"use strict";

module.exports = function(config, helpers) {
  require("./mongooseUtils");
  return {
    move: require("./move")(config, helpers),
    user: require("./user")(config, helpers),
  };
};
