"use strict";
/**
 * Mongoose plugin to encrypt all given fields before saving,
 * and add some helpers methods to check/generate tokens
 *
 */

const encryptToken = require("../../encryption/sym-encrypt-tokens");

const classify = function(propertyName) {
  const str = propertyName.replace(/[-_\s]+(.)?/g, function(match, c) {
    return c ? c.toUpperCase() : "";
  });
  return str.charAt(0).toUpperCase() + str.slice(1);
};


module.exports = function encryptTokenPlugin(schema, optionsParam) {
  const options = optionsParam || {};
  const {tokenEncryptionKey} = options;
  let fields = options.fields || options.field || [];
  if (fields.token) {
    fields = [fields];
  }

  // Add verifier and generate methods to the schema for each encrypted field
  fields.forEach(function(field) {
    // Setup field name for camelcasing
    const fieldName = classify(field.token);

    // Define verification function
    schema.methods[`verify${fieldName}`] = function(token) {
      if (!this[field.token]) {
        return false;
      }
      const verifiedToken = encryptToken.checkToken(token, this[field.token], tokenEncryptionKey);
      let expirationVerificator = true;
      if (field.date && field.expiration) {
        if (!this[field.date]) {
          return false;
        }
        let expirationShift = new Date();
        expirationShift.setMinutes(expirationShift.getMinutes() - field.expiration);
        expirationVerificator = this[field.date] > expirationShift;
      }
      return verifiedToken && expirationVerificator;
    };

    // Define generate function
    schema.methods[`generate${fieldName}`] = function(forceRenew) {
      if (field.date && field.expiration) {
        if (this[field.token] && this[field.date]) {
          let expirationShift = new Date();
          expirationShift.setMinutes(expirationShift.getMinutes() - field.expiration + (field.renewalTime? field.renewalTime : 0));
          if (this[field.date] <= expirationShift || forceRenew) {
            this[field.token] = encryptToken.generateToken(field.length, field.numeric);
            this[field.date] = new Date();
          } else {
            try {
              const decryptedToken = encryptToken.decryptToken(this[field.token], tokenEncryptionKey);
              return decryptedToken;
            } catch (e) {
              this[field.token] = encryptToken.generateToken(field.length, field.numeric);
              this[field.date] = new Date();
              return this[field.token];
            }
          }
        } else {
          this[field.date] = new Date();
          this[field.token] = encryptToken.generateToken(field.length, field.numeric);
        }
      } else if (!this[field.token] || field.alwaysRenew || forceRenew) {
        this[field.token] = encryptToken.generateToken(field.length, field.numeric);
      } else {
        try {
          const decryptedToken = encryptToken.decryptToken(this[field.token], tokenEncryptionKey);
          return decryptedToken;
        } catch (e) {
          this[field.token] = encryptToken.generateToken(field.length, field.numeric);
          this[field.date] = new Date();
          return this[field.token];
        }
      }
      return this[field.token];
    };
  });

  // encrypt fields upon saving the model
  schema.pre("save", function preSaveText(next) {
    const self = this;

    // Encrypt the fields that have been modified (if not null or already encrypted)
    fields.forEach(function(field) {
      if (
        self.isModified(field.token) &&
        self[field.token] !== null &&
        self[field.token] !== undefined &&
        !self[field.token].match(/^[a-f0-9]{32}&[a-f0-9]+$/)
      ) {
        self[field.token] = encryptToken.encryptToken(self[field.token], tokenEncryptionKey);
      }
    });
    next();
  });
};
