var assert = require('assert');
var json2html = require('../json2html');

describe('JSON2HTML', function () {
  it ('should stringify numbers, booleans and raw strings', function () {
    assert.equal(json2html(42), '42');
    assert.equal(json2html(true), 'true');
    assert.equal(json2html(false), 'false');
    assert.equal(json2html(null), '');
    assert.equal(json2html(), '');
    var ss = 'asdfasdf asdff asdsdafa adf <>?!*adsfads';
    assert.equal(json2html(ss),ss); 
  });

  it ('should create empty divs', function () {
    assert.equal(json2html({span: ''}), '<span></span>');
    assert.equal(json2html({div: []}), '<div></div>');
  });

  it ('should process arrays', function () {
    assert.equal(json2html([{div: ''}]), '<div></div>');
    assert.equal(json2html([{div: ''}, {span: []}]), '<div></div><span></span>');
  });

  it ('should process a map', function () {
    assert.equal(json2html({div: '', span: []}), '<div></div><span></span>');
  });

  it ('should process $$', function () {
    assert.equal(
      json2html({body: {div: '', span: [], $$: {name: 42}}}),
      '<body name="42"><div></div><span></span></body>'
    );
  });

  it ('should process $', function () {
    assert.equal(
      json2html({body: {name: 42, $: {div: '', span: [], $$: {name: 42}}}}),
      '<body name="42"><div></div><span></span></body>'
    );
  });

  it ('should process inline classses and ids', function () {
    assert.equal(
      json2html({'body#42.wrapped.shown': {div: ''}}),
      '<body id="42" class="wrapped shown"><div></div></body>'
    );
    assert.equal(
      json2html({'body.wrapped#42.shown': {div: ''}}),
      '<body id="42" class="wrapped shown"><div></div></body>'
    );
  });

  if (0) it ('should post-process functions', function () {
    assert.equal(
      json2html({div: 'hello', $xform: function (obj) { return {div: 'hello world'}; }}),
      '<div>hello world</div>'
    );
    assert.equal(
      json2html({'body.test': {id: 'hello', $xform: xformer}}),
      '<body class="hello world">Testing yo</body>'
    );
    function xformer(obj, tag) {
      assert.equal(tag.tag, 'body');
      assert.equal(tag.attributes['class'], 'test');
      assert.equal(obj.id, 'hello');
      return {'class': ['hello', 'world'], $: 'Testing yo'};
    }
  });

  it ('should handle something complex', function () {
    assert.equal(json2html({
      body: {
        'div.header': 'First Div',
        'section#main': [
          {div: {
            css: {background: 'black'}, $: [
            {span: 'First Span'},
            {span: 'Second Span'}
            ]}}
        ]
      }
    }), 
      '<body><div class="header">First Div</div><section id="main"><div style="background:black;"><span>First Span</span><span>Second Span</span></div></section></body>');

  })
});
