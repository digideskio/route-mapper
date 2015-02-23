"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var _core = require("babel-runtime/core-js")["default"];

var SINGLETON_ACTIONS = require("actions").SINGLETON_ACTIONS;

var plural = require("pluralize").plural;

var Resource = _babelHelpers.interopRequire(require("./resource"));

var SingletonResource = (function (Resource) {
  function SingletonResource(entities, options) {
    _babelHelpers.classCallCheck(this, SingletonResource);

    _babelHelpers.get(_core.Object.getPrototypeOf(SingletonResource.prototype), "constructor", this).call(this, entities, options);
    this.as = null;
    this.controller = options.controller || this.plural;
    this.as = options.as;
  }

  _babelHelpers.inherits(SingletonResource, Resource);

  _babelHelpers.prototypeProperties(SingletonResource, null, {
    defaultActions: {
      get: function () {
        return SINGLETON_ACTIONS;
      },
      configurable: true
    },
    plural: {
      get: function () {
        var _ref;

        return (_ref = this, !_babelHelpers.hasOwn.call(_ref, "_plural") && (_ref._plural = plural(this.name)), _ref._plural);
      },
      configurable: true
    },
    singular: {
      get: function () {
        var _ref;

        return (_ref = this, !_babelHelpers.hasOwn.call(_ref, "_singular") && (_ref._singular = this.name), _ref._singular);
      },
      configurable: true
    },
    memberName: {
      get: function () {
        return this.singular;
      },
      configurable: true
    },
    collectionName: {
      get: function () {
        return this.singular;
      },
      configurable: true
    },
    memberScope: {
      get: function () {
        return this.path;
      },
      configurable: true
    },
    nestedScope: {
      get: function () {
        return this.path;
      },
      configurable: true
    }
  });

  return SingletonResource;
})(Resource);

module.exports = SingletonResource;