"use strict";

module.exports = function(config, helpers) {
  require("./mongooseUtils");
  return {
    move: require("./move")(config, helpers),
    trade: require("./trade")(config, helpers),
    ohlc: require("./ohlc")(config, helpers),
    user: require("./user")(config, helpers),
    btcohlc: require("./btcohlc")(config, helpers),
  };
};
