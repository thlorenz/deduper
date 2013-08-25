'use strict';
/*jshint asi: true */

var debug// =  true;
var test  =  debug  ? function () {} : require('tap').test
var test_ =  !debug ? function () {} : require('tap').test

var deduper = require('../')();
var dedupe = deduper.dedupe.bind(deduper);

var id = '/foo/pack';
var pack_1_1_1 = { name: 'pack', version: '1.1.1', n: 1 };
var pack_1_1_1_ = { name: 'pack', version: '1.1.1+beta', n: 2 };
var pack_1_1_2 = { name: 'pack', version: '1.1.2', n: 3 };
var pack_1_2_1 = { name: 'pack', version: '1.2.1', n: 4 };
var pack_2_1_1 = { name: 'pack', version: '2.1.1', n: 5 };

var otherpack_2_1_1 = { name: 'otherpack', version: '2.1.1', n: 6 };

test('\nsame name exact - matching', function (t) {
  deduper.reset()
  var first = dedupe('exact', id + pack_1_1_1.version + ':' + pack_1_1_1.n, pack_1_1_1);
  var second = dedupe('exact', id + pack_1_1_1_.version + ':' + pack_1_1_1_.n, pack_1_1_1_);
  
  t.equal(second.pack.version, first.pack.version, 'returns cached one second time')
  t.end()
})

test('\nsame name exact - not matching', function (t) {
  deduper.reset()
  var first = dedupe('exact', id + pack_1_1_1.version + ':' + pack_1_1_1.n, pack_1_1_1);
  var second = dedupe('exact', id + pack_1_1_2.version + ':' + pack_1_1_2.n, pack_1_1_2);
  
  t.notEqual(second.id, first.id, 'returns given one second time')
  t.end()
})

test('\nsame name exact - matching with intermittent reset', function (t) {
  deduper.reset()
  var first = dedupe('exact', id + pack_1_1_1.version + ':' + pack_1_1_1.n, pack_1_1_1);
  deduper.reset()
  var second = dedupe('exact', id + pack_1_1_1_.version + ':' + pack_1_1_1_.n, pack_1_1_1_);
  
  t.notEqual(second.id, first.id, 'returns given one second time')
  t.end()
})

test('\nsame name patch - matching cached is latest', function (t) {
  deduper.reset()
  var first = dedupe('patch', id + pack_1_1_1_.version + ':' + pack_1_1_1_.n, pack_1_1_1_);
  var second = dedupe('patch', id + pack_1_1_1.version + ':' + pack_1_1_1.n, pack_1_1_1);

  t.equal(second.pack.version, first.pack.version, 'returns cached one second time')
  t.end()
})

test('\nsame name patch - matching cached is not latest', function (t) {
  deduper.reset()
  var first = dedupe('patch', id + pack_1_1_1.version + ':' + pack_1_1_1.n, pack_1_1_1);
  var second = dedupe('patch', id + pack_1_1_1_.version + ':' + pack_1_1_1_.n, pack_1_1_1_);
  
  t.equal(second.id, first.id, 'returns cached one second time')
  t.end()
})

test('\nsame name patch - not matching', function (t) {
  deduper.reset()
  var first = dedupe('patch', id + pack_1_1_1.version + ':' + pack_1_1_1.n, pack_1_1_1);
  var second = dedupe('patch', id + pack_1_1_2.version + ':' + pack_1_1_2.n, pack_1_1_2);
  
  t.notEqual(second.id, first.id, 'returns given one second time')
  t.end()
})

test('\nsame name minor - matching, cached not latest', function (t) {
  deduper.reset()
  var first = dedupe('minor', id + pack_1_1_1.version + ':' + pack_1_1_1.n, pack_1_1_1);
  var second = dedupe('minor', id + pack_1_1_2.version + ':' + pack_1_1_2.n, pack_1_1_2);
  
  t.notEqual(second.id, first.id, 'returns given one second time')
  t.equal(second.replacesId, first.id, 'second replaces first')
  t.end()
})

test('\nsame name minor - matching, cached latest', function (t) {
  deduper.reset()
  var first = dedupe('minor', id + pack_1_1_2.version + ':' + pack_1_1_2.n, pack_1_1_2);
  var second = dedupe('minor', id + pack_1_1_1.version + ':' + pack_1_1_1.n, pack_1_1_1);
  
  t.equal(second.id, first.id, 'returns cached one second time')
  t.end()
})

test('\nsame name minor - not matching', function (t) {
  deduper.reset()
  var first = dedupe('minor', id + pack_1_1_1.version + ':' + pack_1_1_1.n, pack_1_1_1);
  var second = dedupe('minor', id + pack_1_2_1.version + ':' + pack_1_2_1.n, pack_1_2_1);
  
  t.notEqual(second.pack.version, first.pack.version, 'returns given one second time')
  t.end()
})

test('\nsame name major - matching', function (t) {
  deduper.reset()
  var first = dedupe('major', id + pack_1_1_1.version + ':' + pack_1_1_1.n, pack_1_1_1);
  var second = dedupe('major', id + pack_1_1_1.version + ':' + pack_1_1_1.n, pack_1_1_1);
  
  t.equal(second.pack.version, first.pack.version, 'returns cached one second time')
  t.end()
})

test('\nsame name major - not matching', function (t) {
  deduper.reset()
  var first = dedupe('major', id + pack_1_1_1.version + ':' + pack_1_1_1.n, pack_1_1_1);
  var second = dedupe('major', id + pack_2_1_1.version + ':' + pack_2_1_1.n, pack_2_1_1);
  
  t.notEqual(second.pack.version, first.pack.version, 'returns given one second time')
  t.end()
})

test('\nsame name any - matching cached not latest', function (t) {
  deduper.reset()
  var first = dedupe('any', id + pack_1_1_1.version + ':' + pack_1_1_1.n, pack_1_1_1);
  var second = dedupe('any', id + pack_2_1_1.version + ':' + pack_2_1_1.n, pack_2_1_1);
  
  t.notEqual(second.id, first.id, 'returns given one second time')
  t.equal(second.replacesId, first.id, 'second replaces first')
  t.end()
})

test('\nsame name any - matching cached latest', function (t) {
  deduper.reset()
  var first = dedupe('any', id + pack_2_1_1.version + ':' + pack_2_1_1.n, pack_2_1_1);
  var second = dedupe('any', id + pack_1_1_1.version + ':' + pack_1_1_1.n, pack_1_1_1);
  
  t.equal(second.id, first.id, 'returns cached one second time')
  t.end()
})

test('\ndifferent name any', function (t) {
  deduper.reset()
  var first = dedupe('any', id + pack_1_1_1.version + ':' + pack_1_1_1.n, pack_1_1_1);
  var second = dedupe('any', id + otherpack_2_1_1.version + ':' + otherpack_2_1_1.n, otherpack_2_1_1);
  
  t.notEqual(second.pack.version, first.pack.version, 'returns given one second time')
  t.end()
})

test('\ndifferent name minor (fulfilling criteria)', function (t) {
  deduper.reset()
  var first = dedupe('minor', id + pack_2_1_1.version + ':' + pack_2_1_1.n, pack_2_1_1);
  var second = dedupe('minor', id + otherpack_2_1_1.version + ':' + otherpack_2_1_1.n, otherpack_2_1_1);
  
  t.notEqual(second.id, first.id, 'returns given one second time')
  t.end()
})

test('\nsame name multi cache - first matching third', function (t) {
  deduper.reset()
  var first = dedupe('minor', id + pack_1_1_2.version + ':' + pack_1_1_2.n, pack_1_1_2);
  var second = dedupe('minor', id + pack_2_1_1.version + ':' + pack_2_1_1.n, pack_2_1_1);
  var third = dedupe('minor', id + pack_1_1_1_.version + ':' + pack_1_1_1_.n, pack_1_1_1_);
  
  t.notEqual(second.pack.version, first.pack.version, 'returns given one second time')
  t.equal(third.pack.version, first.pack.version, 'returns second one third time')
  t.end()
})
