'use strict';

var dedupe = require('../');

var id = '/foo/pack';
var pack_1_1_1 = { name: 'pack', version: '1.1.1', n: 1 };
var pack_1_1_2 = { name: 'pack', version: '1.1.2', n: 2 };
var pack_1_2_1 = { name: 'pack', version: '1.2.1', n: 3 };

var orig = dedupe('minor', id, pack_1_1_1);
var match = dedupe('minor', id, pack_1_1_2);
var nomatch = dedupe('minor', id, pack_1_2_1);

console.log({ orig: orig, match: match, nomatch: nomatch });
