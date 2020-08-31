"use strict";
// const PhoneNumber = require("awesome-phonenumber");
// const aws = require("aws-sdk");
//
// module.exports.normalizePhoneNumber = function(phone, countryCode) {
//   if (!phone) {
//     return {err: new Error("no phone number")};
//   }
//   const pn = new PhoneNumber(phone, countryCode);
//   if (!pn.isValid()) {
//     if (!countryCode) {
//       return {err: "MISSING_INFO"};
//     } else {
//       return {err: "INVALID_PHONE"};
//     }
//   }
//   return  {num: pn.getNumber(), isMobile: pn.isMobile()};
// };
