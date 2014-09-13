//
// JSON = raw-string ;;  (embed html directly)
//  or 
// JSON = [JSON] ;; each individual element of the array is processed separately and concatenated
//  or 
// JSON = {$: JSON0, attribute1: JSON1, attribute2: JSON2...} ;;
//  or
// JSON = {tag1: JSON1, tag2: JSON2, ... $$: {attribute1: JSON1...}}
//
//  $ represents children of current json
//  $$ represents attributes
//
var encoder = require('node-html-encoder').Encoder();
module.exports = json2html;

function forEach(obj, cb) {
  if ('length' in obj) for (var kk = 0; kk < obj.length; kk ++) cb(obj[kk], kk);
  else for (var key in obj) cb(obj[key], key);
}

function map(obj, cb) {
  var ret = [];
  if ('length' in obj) for (var kk = 0; kk < obj.length; kk ++) ret.push(cb(obj[kk], kk));
  else for (var key in obj) ret.push(cb(obj[key], key));
  return ret;
}

function encode(x) { return encoder.htmlEncode(x.toString()); }
function json2html(json) {
  if (typeof(json) == 'undefined' || json === null) return '';
  if (typeof(json) != 'object') return json.toString();
  if ('length' in json) return map(json, json2html).join('');
  var ret = '';
  forEach(json, function (children, tag) { if (tag != '$$') ret += _json2html(children, tag); });
  return ret;
}

function _json2html(json, tag) {
  tag = parseTag(tag || '');
  json = json || '';
  var ret = openTag(tag);
  var body = '';
  if (typeof(json) != 'object') body = json;
  else if ('length' in json) body = json2html(json);
  else {
    forEach(('$' in json) ? json : json.$$ || {}, function (value, key) { tag.attributes[key] = value; });
    body = json2html('$' in json ? json.$ : json);
  }
  return ret + formatAttributes(tag.attributes) + '>' +  body + closeTag(tag);
}

function formatAttributes(obj) {
  var ret = '';
  for (key in obj) if (key != '$') ret += ' ' + mapKey(key) + '="' + format(key) + '"';
  return ret;
  function format(key) {
    if (key == 'css') return encode(map(obj[key], function (value, style) { 
      return [style, value].join(':') + ';';
    }));
    x = obj[key];
    if (typeof(x) == 'object' && 'length' in x) x = x.join(' ');
    return encode(x);
  }
  function mapKey(key) { return (key == 'css') && 'style' || key; }
}

var tagRE = /(^|[#.])[^#.]+/g;
function parseTag(tag) {
  var classes = [], ret = {tag: 'div', attributes: {}};
  forEach(tag.trim().match(tagRE), function (part) {
    if (part[0] == '.') classes.push(part.slice(1));
    else if (part[0] == '#') ret.attributes.id = part.slice(1);
    else ret.tag = part;
  });
  if (classes.length) ret.attributes['class'] = classes.join(' ');
  return ret;
}

function openTag(parsed) { return '<' + parsed.tag; }
function closeTag(parsed) { return '</' + parsed.tag + '>'; }
