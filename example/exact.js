'use strict';

var deduper = require('../')();

var orig_id = '/orig/pack';
var match_id = '/match/pack';
var nomatch_id = '/nomatch/pack';

var pack_1_1_1 = { name: 'pack', version: '1.1.1', n: 1 };
var pack_1_1_1_ = { name: 'pack', version: '1.1.1', n: 2 };
var pack_1_1_2 = { name: 'pack', version: '1.1.2', n: 3 };

var orig = deduper.dedupe('exact', orig_id, pack_1_1_1);
var match = deduper.dedupe('exact', match_id, pack_1_1_1_);
var nomatch = deduper.dedupe('exact', nomatch_id, pack_1_1_2);

console.log({ orig: orig, match: match, nomatch: nomatch });
