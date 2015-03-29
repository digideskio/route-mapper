/*!
 * route-mapper - lib/mergeScope
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var assign = _interopRequire(require("lodash-node/modern/object/assign"));

var normalizePath = require("./utils").normalizePath;

module.exports = {

  // parent/child
  path: function path(parent, child) {
    return parent ? normalizePath(`${ parent }/${ child }`) : child;
  },

  // parent/child
  shallowPath: function shallowPath(parent, child) {
    return parent ? normalizePath(`${ parent }/${ child }`) : child;
  },

  // parent_child
  as: function as(parent, child) {
    return parent ? `${ parent }_${ child }` : child;
  },

  // parent_child
  shallowPrefix: function shallowPrefix(parent, child) {
    return parent ? `${ parent }_${ child }` : child;
  },

  // parent/child
  module: function module(parent, child) {
    return parent ? normalizePath(`${ parent }/${ child }`) : child;
  },

  controller: function controller(parent, child) {
    return child;
  },

  action: function action(parent, child) {
    return child;
  },

  pathNames: function pathNames(parent, child) {
    return this.options(parent, child);
  },

  constraints: function constraints(parent, child) {
    return this.options(parent, child);
  },

  defaults: function defaults(parent, child) {
    return this.options(parent, child);
  },

  options: function options(parent, child) {
    parent = assign(parent || {});
    let excepts = this.overrideKeys(child);
    for (var _iterator = excepts, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      let key = _ref;

      delete parent[key];
    }
    return assign(parent, child);
  },

  shallow: function shallow(parent, child) {
    return child ? true : false;
  },

  overrideKeys: function overrideKeys(child) {
    return child.only || child.except ? ["only", "except"] : [];
  }

};