"use strict";

module.exports = function(config, helpers) {
  require("./mongooseUtils");
  return {
    user: require("./user")(config, helpers),
  };
};
