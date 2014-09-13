# jonx

Javascript natively works well with JSON, so the idea behind this module is to do UI with JSON as much as possible and finally convert to HTML as the last step.

This would allow building templates that are based purely on JSON and transforming JSON.

[![NPM info](https://nodei.co/npm/jonx.png?downloads=true)](https://npmjs.org/package/jonx)

[![Travis build status](https://api.travis-ci.org/Like-Falling-Leaves/jonx.png?branch=master)](
https://travis-ci.org/Like-Falling-Leaves/jonx)

## TODO

   This is a work in progress, and some critical functionality is in the works still:
* There is no browser build though there are no dependencies which would break this for the browser.
* There is no ability to convert from HTML to json yet
* There is no ability to transform JSON dynamically (templates).

## Install

    npm install jonx


## API

   It is best to read the unit tests under test directory to understand how to use this.  The API is still under flux.

Here is a complicated example which cover bulk of the interesting cases.

```javascript
jonx.json2html({
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
})
```

Output HTML:
```html
<body>
  <div class="header">First Div</div>
  <section id="main">
    <div style="background:black;">
      <span>First Span</span>
      <span>Second Span</span>
    </div>
  </section>
</body>
```