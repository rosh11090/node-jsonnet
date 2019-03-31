# node-jsonnet

[jsonnet](https://jsonnet.org/) is a DSL for JSON. Jsonnet is created by Google.

This module is a Jsonnet wrapper for Node.js

## Docs
To know about jsonnet syntax, read [here](https://jsonnet.org/learning/tutorial.html).

In case of jsonnet standard library, read [here](https://jsonnet.org/ref/stdlib.html).

## For Setup

```shell
$ npm install https://github.com/rosh11090/node-jsonnet#v0.5.0
```

## Usage
```javascript

var Jsonnet = require('jsonnet');
// instance jsonnet
var jsonnet = new Jsonnet();
var fs = require('fs');

var code = fs.readFileSync("./menu.jsonnet", "utf8");

// eval jsonnet to javascript object
var result = jsonnet.eval(code);


// or directly render file
var result = jsonnet.evalFile("./menu.jsonnet");

console.log("result>", result)

```

Both function(eval, evalFile) take optional argument tla object({}) with key/attribute as,
```
let ext_var = {key1: "value"}  // => {"key_value": std.excVar("key1")}

let ext_code = {key2: false}  //=> {"key_value": std.excVar("key2")}

let tla_str = {key1: "value"}  //=> function(key1){...jsonnet..}

let tla_code = {key2: true}  // =>  function(key2){...jsonnet code..}

jsonnet.evalFile("./menu.jsonnet", {ext_var: ext_var, tla_str: tla_str})
```

Check [here](https://jsonnet.org/learning/tutorial.html#parameterize-entire-config) for prametrized config.

## Authors
* forked from [here](https://github.com/yosuke-furukawa/node-jsonnet).
* **Roshan** - *Initial update work* - [Noon](https://github.com/rosh11090)

## Acknowledgments
* Uses [jsonnet](https://jsonnet.org/js/libjsonnet.js) library from google.
* Extended work of [Yosuke Furukawa](https://github.com/yosuke-furukawa).
