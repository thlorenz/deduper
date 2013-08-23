'use strict';

var dedupe = require('../');

var id = '/foo/pack';
var pack_1_1_1 = { name: 'pack', version: '1.1.1', n: 1 };
var pack_1_1_1_ = { name: 'pack', version: '1.1.1', n: 2 };
var pack_1_1_2 = { name: 'pack', version: '1.1.2', n: 3 };

var orig = dedupe('exact', id, pack_1_1_1);
var match = dedupe('exact', id, pack_1_1_1_);
var nomatch = dedupe('exact', id, pack_1_1_2);

console.log({ orig: orig, match: match, nomatch: nomatch });
