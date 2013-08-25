# deduper [![build status](https://secure.travis-ci.org/thlorenz/deduper.png)](http://travis-ci.org/thlorenz/deduper)

Dedupes packages with identical names and version numbers match based on a given requirement.

```js
var deduper = require('deduper')();

var orig_id = '/orig/pack';
var match_id = '/match/pack';
var nomatch_id = '/nomatch/pack';

var pack_1_1_1 = { name: 'pack', version: '1.1.1', n: 1 };
var pack_1_1_2 = { name: 'pack', version: '1.1.2', n: 2 };
var pack_1_2_1 = { name: 'pack', version: '1.2.1', n: 3 };

var orig = deduper.dedupe('minor', orig_id, pack_1_1_1);
var match = deduper.dedupe('minor', match_id, pack_1_1_2);
var nomatch = deduper.dedupe('minor', nomatch_id, pack_1_2_1);

console.log({ orig: orig, match: match, nomatch: nomatch });
```

```
{ orig:
   { id: '/orig/pack',
     pack: { name: 'pack', version: '1.1.1', n: 1 } },
  match:
   { id: '/orig/pack',
     pack: { name: 'pack', version: '1.1.1', n: 1 } },
  nomatch:
   { id: '/nomatch/pack',
     pack: { name: 'pack', version: '1.2.1', n: 3 } } }
```

## Installation

    npm install deduper

## API

###*deduper()*

```
/**
 * Creates new deduper instance with its own cache
 * 
 * @name Deduper
 * @function
 * @param cache {Object} (optional) provides a cache to use, if not supplied a new cache is created
 * @return {Deduper} instance
 */
```

###*deduper.dedupe(criteria, id, pack)*

```
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
```

#### criteria

- **exact** versions have to be equal
- **patch** *major* and *minor*  and *patch* numbers have to be equal, *alpha*, *beta* suffixes may vary
- **minor** *major* and *minor* numbers have to be equal, *patch* number may vary
- **major** *major* number has to be equal, *minor* and *patch* numbers may vary
- **any** versions are not considered

###*deduper.reset()*

- resets the package cache

## License

MIT
