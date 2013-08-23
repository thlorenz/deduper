'use strict';
/*jshint asi: true */

var debug// =  true;
var test  =  debug  ? function () {} : require('tap').test
var test_ =  !debug ? function () {} : require('tap').test

var satisfy = require('../satisfy-criteria')

function ok (t, criteria, given, cached, cachedWins) {
  var info = satisfy(criteria, given, cached)
  t.ok(info.satisfied, '"' + given + '" and "' + cached + '" satisfy ' + criteria);
  t.equal(info.cachedWins, cachedWins, (cachedWins ? 'cached' : 'given') + ' wins')
}

function notok (t, criteria, given, cached, cachedWins) {
  var info = satisfy(criteria, given, cached)
  t.notOk(info.satisfied, '"' + given + '" and "' + cached + '" do not satisfy ' + criteria);
}

test('\nexact', function (t) {
  ok(t, 'exact', '1.1.2', 'v1.1.2', true);
  ok(t, 'exact', '1.1.2', '   1.1.2', true) 
  notok(t, 'exact', '1.1.3', '1.1.2') 

  t.end()
})

test('\nany', function (t) {
  ok(t, 'any', '1.1.3', '1.1.2', false) 
  ok(t, 'any', '1.0.0', '1.9.9-beta2', true) 
  ok(t, 'any', 'v1.9.99', '1.9.9-beta2', false) 
  ok(t, 'any', 'v2.0.0', '1.9.9-beta2', false) 
  ok(t, 'any', '2.0.6', '11.9.4', true) 
  
  t.end()
})

test('\nmajor', function (t) {
  ok(t, 'major', '1.1.3', '1.1.2', false) 
  ok(t, 'major', '1.0.0', '1.9.9-beta2', true) 
  ok(t, 'major', 'v1.9.99', '1.9.9-beta2', false) 
  notok(t, 'major', 'v2.0.0', '1.9.9-beta2') 
  
  t.end()
})

test('\nminor', function (t) {
  ok(t, 'minor', '1.1.3', '1.1.2', false) 
  notok(t, 'minor', '1.0.0', '1.9.9-beta2') 
  ok(t, 'minor', 'v1.9.99', '1.9.9-beta2', false) 
  notok(t, 'minor', 'v2.0.0', '1.9.9-beta2') 

  t.end()
})

test('\npatch', function (t) {
  ok(t, 'patch', '1.1.2', '1.1.2-beta3', false) 
  notok(t, 'patch', '1.1.2', '1.1.3') 
  notok(t, 'patch', '1.0.0', '1.9.9-beta2') 
  notok(t, 'patch', 'v1.9.99', '1.9.9-beta2') 
  notok(t, 'patch', 'v2.0.0', '1.9.9-beta2') 

  t.end()
})
