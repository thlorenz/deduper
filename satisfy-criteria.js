'use strict';

var semver = require('semver');
var rx = /[.+-]/;

/**
 * Determines if the two versions are considered equal considering the given criteria and returns information
 * detailing if they are, which one is the latest version and if the cached version won.
 * 
 * @name exports
 * @function
 * @param criteria {String} none | exact | major | minor | patch
 * @param given {String} the given version
 * @param cached {String} the version that was previously cached
 * @return {Object} with properties:
 *  - satisfied {Boolean} true if the versions satisfied the criteria and are considered equal, false if not
 *  - latest {String} the version that is the latest
 *  - cachedIsLatest {Boolean} true if the latest version is the cached version, otherwise false
 */
var go = module.exports = function (criteria, given, cached) {
  if (criteria === 'exact') return { satisfied: semver.eq(given, cached), cachedIsLatest: true };

  var latest, earliest, satisfied, cachedIsLatest;

  if (semver.gt(given, cached)) {
    latest = semver.clean(given);
    earliest = semver.clean(cached);
    cachedIsLatest = false;
  } else {
    latest = semver.clean(cached);
    earliest = semver.clean(given);
    cachedIsLatest = true;
  }

  if (criteria === 'any') return { satisfied: true, cachedIsLatest: cachedIsLatest };

  var ep = earliest.split(rx);
  var lp = latest.split(rx);

  switch(criteria) {
    case 'major':
      satisfied = ep[0] === lp[0];    
      break;
    case 'minor':
      satisfied = ep[0] === lp[0] 
              &&  ep[1] === lp[1] 
      break;
    case 'patch':
      satisfied = ep[0] === lp[0] 
              &&  ep[1] === lp[1] 
              &&  ep[2] === lp[2] 
      break;
    default:
      throw new Error('Unknown dedupe criteria: ' + criteria);
  }

  return { satisfied: satisfied, cachedIsLatest: cachedIsLatest };
}

