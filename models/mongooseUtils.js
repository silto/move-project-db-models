const mongoose = require("mongoose");
const normalizeUrl = require("normalize-url");
const {
  ObjectId,
} = mongoose.Types;

// proper validation of object ids
mongoose.isValidObjectId = function(id) {
  if (id instanceof ObjectId) {
    return true;
  }
  if (typeof id !== "string") {
    return false;
  }
  return ObjectId.isValid(id) && (new ObjectId(id)).toString() === id;
};

// Declare Url type for mongoose

const regUrl = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;

function validateUrl (val) {
  return regUrl.test(val);
}

function Url (path, options) {
  mongoose.SchemaTypes.String.call(this, path, options);
  this.validate(validateUrl, "url is invalid");
}

Object.setPrototypeOf(Url.prototype, mongoose.SchemaTypes.String.prototype);

Url.prototype.cast = function (val) {
  return normalizeUrl(val, {stripWWW: false, removeQueryParameters: false});
};

mongoose.SchemaTypes.Url = Url;
mongoose.Types.Url = String;


// Declare SIREN type for mongoose

function validateSiren (val) { //validate using Luhn algo
  if ( (val.length !== 9) || (isNaN(val)) ) {
    return false;
  } else {
    let somme = 0;
    let tmp;
    for (let cpt = 0; cpt < val.length; cpt++) {
      if ((cpt % 2) === 1) {
        tmp = val.charAt(cpt) * 2;
        if (tmp > 9) {
          tmp -= 9;
        }
      } else {
        tmp = val.charAt(cpt);
      }
      somme += parseInt(tmp);
    }
    if ((somme % 10) === 0) {
      return true;
    } else {
      return false;
    }
  }
}
