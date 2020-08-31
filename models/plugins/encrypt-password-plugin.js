"use strict";
/**
 * Mongoose plugin to encrypt all given fields before saving,
 * and add some helpers methods to check/generate passwords
 *
 * Inspired by https://github.com/proswdev/mongoose-bcrypt
 */


const encryptedPasswords = require("../../encryption/encrypted-passwords");

const classify = function(propertyName) {
  const str = propertyName.replace(/[-_\s]+(.)?/g, function(match, c) {
    return c ? c.toUpperCase() : "";
  });
  return str.charAt(0).toUpperCase() + str.slice(1);
};

module.exports = function encryptPasswordPlugin(schema, optionsParam) {
  const options = optionsParam || {};

  let fields = options.fields || options.field || [];
  if (typeof fields === "string") {
    fields = [fields];
  }

  // Add verifier and generate methods to the schema for each encrypted field
  fields.forEach(function(field) {
    // Setup field name for camelcasing
    const fieldName = classify(field);

    // Define verification function
    schema.methods[`verify${fieldName}`] = function(password) {
      return encryptedPasswords.checkPassword(password, this[field]);
    };

    // Define generate function
    schema.methods[`generate${fieldName}`] = function() {
      this[field] = encryptedPasswords.generatePassword();
      return this[field];
    };
  });

  // Hash all modified encrypted fields upon saving the model
  schema.pre("save", function preSaveText(next) {
    const self = this;

    // Encrypt the fields that have been modified (if not null or already encrypted)
    fields.forEach(function(field) {
      if (self.isModified(field) &&
        self[field] !== null &&
        self[field] !== undefined &&
        !self[field].match(/^sha512\$[a-f0-9]{6}\$[a-f0-9]{128}$/)
      ) {
        self[field] = encryptedPasswords.encryptPassword(self[field]);
      }
    });
    next();
  });
};
