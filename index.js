'use strict';

var satisfyCriteria = require('./satisfy-criteria');

var cache = {};

exports = module.exports = function (criteria, id, pack) {
  var given = { id: id, pack: pack };

  var cached = cache[pack.name];

  if (!cached) { 
    cache[pack.name] = given;
    return given;
  }

  var cachedVersion = cached.pack.version;
  var givenVersion = pack.version;

  var info = satisfyCriteria(criteria, givenVersion, cachedVersion);
  return info.satisfied ? cached : given;
};

exports.reset = function () { cache = {}; };
