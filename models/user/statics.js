"use strict";

const mongoose = require("mongoose");
const constants = require("../constants");
const {generatePassword} = require("../../encryption/encrypted-passwords");

module.exports = function(config, helpers) {
  const mailHelpers = helpers.mail;
  return {
    EXPOSED_FIELDS: [
      // "-signupMailToken",
      // "-nmail_token",
      // "-pwd",
      // "-npwd_token",
    ],
    addPassword: function(email, callback) {
      const lowerCaseEmail = email.toLowerCase();
      this.findOne({
        "$or": [
          {
            mail: email,
          },
          {
            mail: lowerCaseEmail,
          },
        ],
      }, function(err, user) {
        if (err) {
          return callback(err);
        }
        if (!user) {
          return callback(new Error("INVALID_EMAIL_ADDRESS"));
        }

        // User found, we can send him a add password email
        let clearNpwdToken = user.generateNpwdToken();
        user.save(function(err) {
          if (err) {
            return callback(err);
          }
          // Send the clear token in the email (it was encrypted during save)
          //eslint-disable-next-line camelcase
          user.npwd_token = clearNpwdToken;
          mailHelpers.sendAddPasswordMail(user, callback);
        });
      });
    },

    resetPassword: function(email, callback) {
      const lowerCaseEmail = email.toLowerCase();
      this.findOne({
        "$or": [
          {
            mail: email,
          },
          {
            mail: lowerCaseEmail,
          },
        ],
      }, function(err, user) {
        if (err) {
          return callback(err);
        }
        if (!user) {
          return callback(new Error("INVALID_EMAIL_ADDRESS"));
        }

        // No user found, we can send him a reset email
        let clearNpwdToken = user.generateNpwdToken();
        user.save(function(err) {
          if (err) {
            return callback(err);
          }
          // Send the clear token in the email (it was encrypted during save)
          //eslint-disable-next-line camelcase
          user.npwd_token = clearNpwdToken;
          mailHelpers.sendResetPasswordMail(user, callback);
        });
      });
    },

    changePassword: function(email, token, password, callback) {
      this.findOne({
        mail: email,
      }, function(err, user) {
        if (err || !user) {
          return callback(err || new Error("Unable to find user"));
        }

        // Check if the given token is the correct, and if the mail was sent less than 30 minutes ago
        let verifiedToken = user.verifyNpwdToken(token);
        if (verifiedToken) {
          user.pwd = password;
          //eslint-disable-next-line camelcase
          user.npwd_token = undefined;
          //eslint-disable-next-line camelcase
          user.npwd_date = undefined;
          user.save(function(err) {
            if (err && err.name === "ValidationError") {
              return callback(new Error("INVALID_PASSWORD"));
            }
            callback(err);
          });
        } else {
          return callback(new Error("INVALID_TOKEN"));
        }
      });
    },

    generateUsername: function(uName, callback) {
      let self = this;
      let username = uName;

      // Default username
      if (!username) {
        username = "trader";
      }

      // Check if the username exists
      self.find({
        username: new RegExp(`^${username}[0-9]*$`),
      }, function(err, users) {
        if (err) {
          return callback(err);
        }
        if (!users || (Array.isArray(users) && users.length === 0)) {
          callback(null, username);
        }
        let finalNum = 0;
        for (let i = 0; i < users.length + 1; i++) {
          let hasThisOne = users.some(user => {
            let userNum = user.username.substr(username.length);
            if (userNum && userNum === "" && i === 0) {
              return true;
            }
            if (parseInt(userNum) === i) {
              return true;
            }
            return false;
          });
          if (!hasThisOne) {
            finalNum = i;
            break;
          }
        }
        callback(null, `${username}${finalNum}`);
      });
    },
    createNew: function(obj, opts, cback) {
      let callback = cback;
      let options = opts;
      if (!callback) {
        callback = options;
        options = {};
      }
      const User = mongoose.model("User");
      let newUser = new User();
      newUser.username = obj.username;
      newUser.mail = obj.mail;
      const pwd = obj.pwd || options.generatePassword? generatePassword(15) : null;
      newUser.pwd = pwd;
      newUser.needEmailValidation = obj.needEmailValidation || false;

      new Promise((resolve, reject) => {
        if (config.allowedEmails && config.allowedEmails !== "*" && config.allowedEmails.indexOf(newUser.mail) === -1) {
          return reject(new Error("Email not allowed"));
        }
        return User.generateUsername(obj.username, (err, username) => {
          if (err) {
            return reject(err);
          }
          resolve(username);
        });
      })
      .then(username => {
        if (username) {
          newUser.username = username;
        }
        return newUser.save();
      })
      .then(() => {
        if (options.generatePassword) {
          newUser.pwd = pwd;
        }
        callback(null, newUser);
      })
      .catch(err => {
        if (err.code === constants.DUPLICATE_KEY_ERROR) {
          // shouldn't happen when generating username
          if (~err.message.indexOf("username")) {
            return callback(new Error("Username already taken."));
          }

          if (~err.message.indexOf("mail")) {
            return callback(new Error("Email already taken."));
          }
        }
        if (err.name === "ValidationError") {
          return callback(new Error(Object.keys(err.errors).shift()));
        }
        return callback(err);
      });
    },
  };
};
