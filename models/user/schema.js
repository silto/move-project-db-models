"use strict";
/* eslint camelcase: 0*/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const constants = require("../constants");
const ShortId = require("mongoose-shortid-nodeps");
const { ObjectId } = Schema.Types;

module.exports = function(config) {
  const UserSchema = new Schema({
    shortId: {
      type: ShortId,
      base: config.shortId.alphabet? undefined : 62,
      len: config.shortId.len || 7,
      alphabet: config.shortId.alphabet,
      retries: config.shortId.retries,
      index: true,
      unique: true,
    },
    /* username */
    username: {
      type: String,
      match: constants.usernameRegex,
      unique: true,
    },
    /* language */
    language: String,
    /* email */
    mail: {
      type: String,
      match: constants.mailRegex,
      trim: true,
      index: {
        unique: true,
        partialFilterExpression: {email: {$type: "string"}},
      },
    },
    /* If the user need to validate his email */
    needEmailValidation: Boolean,
    /* Token for validating the email used at signup */
    signupMailToken: String,
    /* new email */
    nmail: {
      type: String,
      match: constants.mailRegex,
    },
    /* new mail date */
    nmail_date: {
      type: Date,
    },
    /* new email tok */
    nmail_token: {
      type: String,
    },
    /* password */
    pwd: {
      type: String,
    },
    /* new password */
    npwd_token: {
      type: String,
    },
    /* new pass date */
    npwd_date: {
      type: Date,
    },
    /* The last date the user requested on the backend */
    lastPing: {
      type: Date,
      index: true,
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
  });

  return UserSchema;
};
