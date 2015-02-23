"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var has = _babelHelpers.interopRequire(require("lodash-node/modern/object/has"));

var OPTIONS = ["path", "shallow_path", "as", "shallow_prefix", "module", "controller", "action", "path_names", "constraints", "shallow", /*'blocks',*/"defaults", "options"];

var RESOURCE_SCOPES = ["resource", "resources"];
var RESOURCE_METHOD_SCOPES = ["collection", "member", "new"];

var Scope = (function () {
  function Scope(hash) {
    var parent = arguments[1] === undefined ? {} : arguments[1];
    var scopeLevel = arguments[2] === undefined ? null : arguments[2];

    _babelHelpers.classCallCheck(this, Scope);

    this.hash = hash;
    this.parent = parent;
    this.scopeLevel = scopeLevel;
  }

  _babelHelpers.prototypeProperties(Scope, null, {
    options: {
      get: function () {
        return OPTIONS;
      },
      configurable: true
    },
    isNested: {
      value: function isNested() {
        return this.scopeLevel === "nested";
      },
      writable: true,
      configurable: true
    },
    isResources: {
      value: function isResources() {
        return this.scopeLevel === "resources";
      },
      writable: true,
      configurable: true
    },
    isResourceScope: {
      value: function isResourceScope() {
        return RESOURCE_SCOPES.includes(this.scopeLevel);
      },
      writable: true,
      configurable: true
    },
    isResourceMethodScope: {
      value: function isResourceMethodScope() {
        return RESOURCE_METHOD_SCOPES.includes(this.scopeLevel);
      },
      writable: true,
      configurable: true
    },
    actionName: {
      value: function actionName(namePrefix, prefix, collectionName, memberName) {
        switch (this.scopeLevel) {
          case "nested":
            return [namePrefix, prefix];
          case "collection":
            return [prefix, namePrefix, collectionName];
          case "new":
            return [prefix, "new", namePrefix, memberName];
          case "member":
            return [prefix, namePrefix, memberName];
          case "root":
            return [namePrefix, collectionName, prefix];
          default:
            return [namePrefix, memberName, prefix];
        }
      },
      writable: true,
      configurable: true
    },
    get: {

      // maybe should use Proxy

      value: function get(key, value) {
        if (has(this.hash, key)) {
          return this.hash[key];
        }
        if (has(this.parent, key)) {
          return this.parent[key];
        }
        if (this.parent instanceof Scope) {
          return this.parent.get(key, value);
        }
        return value;
      },
      writable: true,
      configurable: true
    },
    set: {
      value: function set(key, value) {
        this.hash[key] = value;
      },
      writable: true,
      configurable: true
    },
    create: {
      value: function create(hash) {
        return new Scope(hash, this, this.scopeLevel);
      },
      writable: true,
      configurable: true
    },
    createLevel: {
      value: function createLevel(level) {
        return new Scope(this, this, level);
      },
      writable: true,
      configurable: true
    }
  });

  return Scope;
})();

module.exports = Scope;