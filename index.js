'use strict';

var satisfyCriteria = require('./satisfy-criteria');

var cache = {};

/**
 * Caches packages and returns cached versions if the package name is found in the cache and the versions are considered
 * compatible considering the given criteria.
 * 
 * @name exports
 * @function
 * @param criteria {String} one of the following - most to least specific: exact | patch | minor | major | any
 * @param id {String} identification for the package (i.e. its full path)
 * @param pack {Object} npm package metadata
 * @return {Object} with matching id and pack or the one that was given
 */
exports = module.exports = function (criteria, id, pack) {
  var given = { id: id, pack: pack };

  var cached = cache[pack.name];

  if (!cached) { 
    cache[pack.name] = [ given ];
    return given;
  }

  var givenVersion = pack.version;
  var match;

  var satisfied = cached
    .some(function (c) {
      var cachedVersion = c.pack.version;
      var info = satisfyCriteria(criteria, givenVersion, cachedVersion);

      if (info.satisfied) match = c;
      return info.satisfied;
    });

  if (satisfied) return match;

  cached.push(given);
  return given;
};

/**
 * Resets the cache
 * 
 * @name reset
 * @function
 */
exports.reset = function () { cache = {}; };
