'use strict';
/*jshint asi: true */

var test = require('tap').test
var dedupe = require('../')

var id = '/foo/pack';
var pack_1_1_1 = { name: 'pack', version: '1.1.1', n: 1 };
var pack_1_1_1_ = { name: 'pack', version: '1.1.1', n: 2 };
var pack_1_1_2 = { name: 'pack', version: '1.1.2', n: 3 };
var pack_1_2_1 = { name: 'pack', version: '1.2.1', n: 4 };
var pack_2_1_1 = { name: 'pack', version: '2.1.1', n: 5 };

var otherpack_2_1_1 = { name: 'otherpack', version: '2.1.1', n: 6 };

test('\nsame name exact - matching', function (t) {
  var first = dedupe('exact', id, pack_1_1_1);
  var second = dedupe('exact', id, pack_1_1_1_);
  
  t.equal(second.pack.n, first.pack.n, 'returns cached one second time')
  t.end()
})

test('\nsame name exact - not matching', function (t) {
  var first = dedupe('exact', id, pack_1_1_1);
  var second = dedupe('exact', id, pack_1_1_2);
  
  t.notEqual(second.pack.n, first.pack.n, 'returns given one second time')
  t.end()
})

test('\nsame name exact - matching with intermittent reset', function (t) {
  var first = dedupe('exact', id, pack_1_1_1);
  dedupe.reset()
  var second = dedupe('exact', id, pack_1_1_1_);
  
  t.notEqual(second.pack.n, first.pack.n, 'returns given one second time')
  t.end()
})

test('\nsame name patch - matching', function (t) {
  var first = dedupe('exact', id, pack_1_1_1);
  var second = dedupe('exact', id, pack_1_1_1_);
  
  t.equal(second.pack.n, first.pack.n, 'returns cached one second time')
  t.end()
})

test('\nsame name patch - not matching', function (t) {
  var first = dedupe('patch', id, pack_1_1_1);
  var second = dedupe('patch', id, pack_1_1_2);
  
  t.notEqual(second.pack.n, first.pack.n, 'returns given one second time')
  t.end()
})

test('\nsame name minor - matching', function (t) {
  var first = dedupe('minor', id, pack_1_1_1);
  var second = dedupe('minor', id, pack_1_1_2);
  
  t.equal(second.pack.n, first.pack.n, 'returns cached one second time')
  t.end()
})

test('\nsame name minor - not matching', function (t) {
  var first = dedupe('minor', id, pack_1_1_1);
  var second = dedupe('minor', id, pack_1_2_1);
  
  t.notEqual(second.pack.n, first.pack.n, 'returns given one second time')
  t.end()
})

test('\nsame name major - matching', function (t) {
  var first = dedupe('major', id, pack_1_1_1);
  var second = dedupe('major', id, pack_1_1_1);
  
  t.equal(second.pack.n, first.pack.n, 'returns cached one second time')
  t.end()
})

test('\nsame name major - not matching', function (t) {
  var first = dedupe('major', id, pack_1_1_1);
  var second = dedupe('major', id, pack_2_1_1);
  
  t.notEqual(second.pack.n, first.pack.n, 'returns given one second time')
  t.end()
})

test('\nsame name any - matching', function (t) {
  var first = dedupe('any', id, pack_1_1_1);
  var second = dedupe('any', id, pack_2_1_1);
  
  t.equal(second.pack.n, first.pack.n, 'returns cached one second time')
  t.end()
})

test('\ndifferent name any', function (t) {
  var first = dedupe('any', id, pack_1_1_1);
  var second = dedupe('any', id, otherpack_2_1_1);
  
  t.notEqual(second.pack.n, first.pack.n, 'returns given one second time')
  t.end()
})

test('\ndifferent name minor (fulfilling criteria)', function (t) {
  var first = dedupe('minor', id, pack_2_1_1);
  var second = dedupe('minor', id, otherpack_2_1_1);
  
  t.notEqual(second.pack.n, first.pack.n, 'returns given one second time')
  t.end()
})
