'use strict';

var satisfyCriteria = require('./satisfy-criteria');

// TODO: function needs to return new instance with cache property in order to allow multiple instances with their own cache
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
    .some(function (c, idx) {
      var cachedVersion = c.pack.version;
      var info = satisfyCriteria(criteria, givenVersion, cachedVersion);

      if (info.satisfied) {
        match = c;
        match.cachedIsLatest = info.cachedIsLatest;
        match.idx = idx;
      }
      return info.satisfied;
    });


  var info;
  if (satisfied) {

    // when cached version wasn't latest we need to upgrade our cache 
    // additionally we help whoever is calling us to proceed similarly by adding replace info
    if (!match.cachedIsLatest) {
      info = { id: given.id, pack: given.pack };
      info.replacesId = match.id;

      cached[match.idx] = given;
    } else {
      // if cached one is latest, we just need to redirect the current resolve to the cached result entirely
      info = { id: match.id, pack: match.pack };
    }

    return info;
  }

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
