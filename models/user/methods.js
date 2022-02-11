"use strict";

module.exports = function(config, helpers) {
  const mailHelpers = helpers.mail;
  return {
    // Set the new email in `nmail` field before confirmation
    // The user object will be saved in the caller method
    changeEmail: function(newEmail, callback) {
      if (!newEmail || newEmail === this.mail) {
        return callback();
      }
      let self = this;
      self.model("User").findOne({
        mail: newEmail,
      }).exec()
      .then(user => {
        if (user) {
          throw new Error("Email address already used.");
        }
        if (self.needEmailValidation) {
          self.mail = newEmail;
          return self.validate();
        }
        self.nmail = newEmail;
        //eslint-disable-next-line camelcase
        self.nmail_token = self.generateNmailToken();
        return self.validate();
      })
      .then(() => {
        if (self.needEmailValidation) {
          return self.validateSignupEmail(callback);
        }
        return new Promise(function(resolve, reject) {
          mailHelpers.sendChangedMailMail(self, (err) => (err? reject(err): resolve()));
        }).then(() => {
          return new Promise((resolve, reject) => {
            self.save(function(err) {
              if (err) {
                reject(err);
              }
              resolve();
            });
          });
        })
        .then(() => callback && callback())
        .catch(err => callback(err));
      });
    },
    validateNewEmail: function(callback) {
      if (!this.nmail) {
        return callback("no new mail to validate");
      }
      this.nmail_token = this.generateNmailToken();
      return new Promise((resolve,reject) => {
        mailHelpers.sendChangedMailMail(this, (err) => (err ? reject(err) : resolve()));
      })
      .then(() => this.validate())
      .then(() => {
        return new Promise((resolve, reject) => {
          this.save(function(err) {
            if (err) {
              reject(err);
            }
            resolve();
          });
        });
      })
      .then(() => callback && callback())
      .catch(err => (callback ? callback(err) : console.error(err)));
    },
    validateSignupEmail: function(callback) {
      this.signupMailToken = this.generateSignupMailToken();
      return new Promise((resolve,reject) => {
        mailHelpers.sendConfirmSignupMail(this, (err) => (err ? reject(err) : resolve()));
      })
      .then(() => this.validate())
      .then(() => {
        return new Promise((resolve, reject) => {
          this.save(function(err) {
            if (err) {
              reject(err);
            }
            resolve();
          });
        });
      })
      .then(() => callback && callback())
      .catch(err => (callback ? callback(err) : console.error(err)));
    },
    changeUsername: function(newUsername, callback) {
      if (!newUsername || newUsername === this.username) {
        return callback();
      }
      let self = this;
      self.model("User").findOne({
        username: newUsername,
      }).exec()
      .then(user => {
        if (user) {
          throw new Error("Username already used.");
        }
        self.username = newUsername;
        return self.validate();
      })
      .then(() => {
        return new Promise((resolve, reject) => {
          self.save(function(err) {
            if (err) {
              reject(err);
            }
            resolve();
          });
        });
      })
      .then(() => callback && callback())
      .catch(err => callback(err));
    },
    updatePassword: function(oldPassword, newPassword, callback) {
      if (!this.pwd) { // doesn't have a password, shouldn't happen
        return callback && callback(new Error("no password set"));
      } else {
        const isValid = this.verifyPwd(oldPassword);
        if (!isValid) {
          return callback && callback(new Error("invalid password"));
        }
        // change the password. The verification is done by the validators
        this.pwd = newPassword;
        return new Promise((resolve, reject) => {
          this.save(function(err) {
            if (err) {
              reject(err);
            }
            resolve();
          });
        })
        .then(() => callback && callback(null))
        .catch(err => (callback ? callback(err) : console.error(err)));
      }
    },
  };
};
