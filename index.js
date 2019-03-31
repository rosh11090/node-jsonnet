'use strict';
const libjsonnet = require('./lib/libjsonnet');

/*
inspired from https://github.com/google/jsonnet/blob/master/doc/js/demo.js
*/

let Jsonnet = function() {
  let jsonnet_make = libjsonnet.cwrap(
      'jsonnet_make', 'number', []);

  this.vm = jsonnet_make();

  this.jsonnet_import_callback = libjsonnet.cwrap(
      'jsonnet_import_callback', 'number', ['number', 'number', 'number'])

  this.jsonnet_ext_var = libjsonnet.cwrap(
      'jsonnet_ext_var', 'number', ['number', 'string', 'string'])

  this.jsonnet_ext_code = libjsonnet.cwrap(
      'jsonnet_ext_code', 'number', ['number', 'string', 'string'])

  this.jsonnet_tla_var = libjsonnet.cwrap(
      'jsonnet_tla_var', 'number', ['number', 'string', 'string'])

  this.jsonnet_tla_code = libjsonnet.cwrap(
      'jsonnet_tla_code', 'number', ['number', 'string', 'string'])

  this.jsonnet_realloc = libjsonnet.cwrap(
      'jsonnet_realloc', 'number', ['number', 'number', 'number'])

  this.jsonnet_evaluate_snippet = libjsonnet.cwrap(
      'jsonnet_evaluate_snippet', 'number', ['number', 'string', 'string', 'number'])

  this.jsonnet_fmt_snippet = libjsonnet.cwrap(
      'jsonnet_fmt_snippet', 'number', ['number', 'string', 'string', 'number'])

  this.jsonnet_destroy = libjsonnet.cwrap(
      'jsonnet_destroy', 'number', ['number'])
}

Jsonnet.prototype.eval = function(code, tla_args) {
  let tla = tla_args || {};

  let ext_var = tla['ext_var'] || {};
  let ext_code = tla['ext_code'] || {};
  let tla_str = tla['tla_str'] || {};
  let tla_code = tla['tla_code'] || {};


  let that = this;
  for (let key in ext_var) {
    that.jsonnet_ext_var(that.vm, key, ext_var[key]);
  }
  for (let key in ext_code) {
    that.jsonnet_ext_code(that.vm, key, ext_code[key]);
  }
  for (let key in tla_str) {
    that.jsonnet_tla_var(that.vm, key, tla_str[key]);
  }
  for (let key in tla_code) {
    that.jsonnet_tla_code(that.vm, key, tla_code[key]);
  }

  let error_ptr = libjsonnet._malloc(4);
  let output_ptr = this.jsonnet_evaluate_snippet(this.vm, '', code, error_ptr);
  let error = libjsonnet.getValue(error_ptr, 'i32*');
  libjsonnet._free(error_ptr);
  let result = libjsonnet.Pointer_stringify(output_ptr);
  this.jsonnet_realloc(this.vm, output_ptr, 0);
  if (error) {
    throw result;
  }
  return JSON.parse(result);
};

Jsonnet.prototype.evalFile = function(filepath, tla_args) {
  const code = libjsonnet.read(filepath);
  return this.eval(code, tla_args);
};

Jsonnet.prototype.evalFiles = function(files, tla_args) {
  let code = ""
  for (let idx in files) {
    code += libjsonnet.read(files[idx]);
  }
  return this.eval(code, tla_args);
};

Jsonnet.prototype.destroy = function() {
  this.jsonnet_destroy(this.vm);
};

module.exports = Jsonnet;
