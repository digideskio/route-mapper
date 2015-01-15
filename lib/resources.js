"use strict";

var _slicedToArray = function (arr, i) {
  if (Array.isArray(arr)) {
    return arr;
  } else {
    var _arr = [];

    for (var _iterator = _core.$for.getIterator(arr), _step; !(_step = _iterator.next()).done;) {
      _arr.push(_step.value);

      if (i && _arr.length === i) break;
    }

    return _arr;
  }
};

var _defineProperty = function (obj, key, value) {
  return Object.defineProperty(obj, key, {
    value: value,
    enumerable: true,
    configurable: true,
    writable: true
  });
};

var _toArray = function (arr) {
  return Array.isArray(arr) ? arr : _core.Array.from(arr);
};

var _get = function get(object, property, receiver) {
  var desc = _core.Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = _core.Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    return desc.value;
  } else {
    var getter = desc.get;
    if (getter === undefined) {
      return undefined;
    }
    return getter.call(receiver);
  }
};

var _inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) subClass.__proto__ = superClass;
};

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var _hasOwn = Object.prototype.hasOwnProperty;
var _core = _interopRequire(require("core-js/library"));

var isFunction = _interopRequire(require("lodash-node/modern/lang/isFunction"));

var isObject = _interopRequire(require("lodash-node/modern/lang/isObject"));

var isRegExp = _interopRequire(require("lodash-node/modern/lang/isRegExp"));

var isString = _interopRequire(require("lodash-node/modern/lang/isString"));

var isEmpty = _interopRequire(require("lodash-node/modern/lang/isEmpty"));

var plural = require("pluralize").plural;
var singular = require("pluralize").singular;
var ACTIONS = require("actions").ACTIONS;
var SINGLETON_ACTIONS = require("actions").SINGLETON_ACTIONS;
var buildArgs = require("./utils").buildArgs;
var hasOwn = require("./utils").hasOwn;
var normalizePath = require("./utils").normalizePath;
var compact = require("./utils").compact;
var root = require("./base").root;
var namespace = require("./scoping").namespace;
var Mapping = _interopRequire(require("./mapping"));

var VALID_ON_OPTIONS = ["new", "collection", "member"];
var RESOURCE_OPTIONS = ["as", "controller", "path", "only", "except", "param", "concerns"];
var CANONICAL_ACTIONS = ["index", "create", "new", "show", "update", "destroy"];

var Resource = (function () {
  function Resource(entities, options) {
    this._name = String(entities);
    this.path = options.path || this._name;
    this.controller = options.controller || this._name;
    this.as = options.as;
    this.param = options.param || "id";
    this.options = options;
    this.shallow = false;
  }

  _prototypeProperties(Resource, null, {
    defaultActions: {
      get: function () {
        return ACTIONS;
      },
      enumerable: true,
      configurable: true
    },
    actions: {
      get: function () {
        var only = this.options.only;
        var except = this.options.except;
        if (typeof only === "string") only = [only];
        if (typeof except === "string") except = [except];
        if (only && only.length) return only;else if (except && except.length) {
          return this.defaultActions.filter(function (a) {
            return except.indexOf(a) < 0;
          });
        } else {
          return this.defaultActions;
        }
      },
      enumerable: true,
      configurable: true
    },
    name: {
      get: function () {
        return this.as || this._name;
      },
      enumerable: true,
      configurable: true
    },
    plural: {
      get: function () {
        var _ref;
        return (_ref = this, !_hasOwn.call(_ref, "_plural") && (_ref._plural = this.name), _ref._plural);
      },
      enumerable: true,
      configurable: true
    },
    singular: {
      get: function () {
        var _ref2;
        return (_ref2 = this, !_hasOwn.call(_ref2, "_singular") && (_ref2._singular = singular(this.name)), _ref2._singular);
      },
      enumerable: true,
      configurable: true
    },
    memberName: {
      get: function () {
        return this.singular;
      },
      enumerable: true,
      configurable: true
    },
    collectionName: {
      get: function () {
        return this.singular === this.plural ? this.plural + "_index" : this.plural;
      },
      enumerable: true,
      configurable: true
    },
    resourceScope: {
      get: function () {
        return { controller: this.controller };
      },
      enumerable: true,
      configurable: true
    },
    collectionScope: {
      get: function () {
        return this.path;
      },
      enumerable: true,
      configurable: true
    },
    memberScope: {
      get: function () {
        return this.path + "/:" + this.param;
      },
      enumerable: true,
      configurable: true
    },
    shallowScope: {
      get: function () {
        return this.memberScope;
      },
      enumerable: true,
      configurable: true
    },
    nestedParam: {
      get: function () {
        return this.singular + "_" + this.param;
      },
      enumerable: true,
      configurable: true
    },
    nestedScope: {
      get: function () {
        return this.path + "/:" + this.nestedParam;
      },
      enumerable: true,
      configurable: true
    },
    newScope: {
      value: function newScope(newPath) {
        return this.path + "/" + newPath;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    isShallow: {
      value: function isShallow() {
        return this.shallow;
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Resource;
})();

var SingletonResource = (function (Resource) {
  function SingletonResource(entities, options) {
    _get(_core.Object.getPrototypeOf(SingletonResource.prototype), "constructor", this).call(this, entities, options);
    this.as = null;
    this.controller = options.controller || this.plural;
    this.as = options.as;
  }

  _inherits(SingletonResource, Resource);

  _prototypeProperties(SingletonResource, null, {
    defaultActions: {
      get: function () {
        return SINGLETON_ACTIONS.slice();
      },
      enumerable: true,
      configurable: true
    },
    plural: {
      get: function () {
        var _ref3;
        return (_ref3 = this, !_hasOwn.call(_ref3, "_plural") && (_ref3._plural = plural(this.name)), _ref3._plural);
      },
      enumerable: true,
      configurable: true
    },
    singular: {
      get: function () {
        var _ref4;
        return (_ref4 = this, !_hasOwn.call(_ref4, "_singular") && (_ref4._singular = this.name), _ref4._singular);
      },
      enumerable: true,
      configurable: true
    },
    memberName: {
      get: function () {
        return this.singular;
      },
      enumerable: true,
      configurable: true
    },
    collectionName: {
      get: function () {
        return this.singular;
      },
      enumerable: true,
      configurable: true
    },
    memberScope: {
      get: function () {
        return this.path;
      },
      enumerable: true,
      configurable: true
    },
    nestedScope: {
      get: function () {
        return this.path;
      },
      enumerable: true,
      configurable: true
    }
  });

  return SingletonResource;
})(Resource);

var Resources = (function () {
  function Resources() {}

  _prototypeProperties(Resources, null, (function () {
    var _prototypeProperties2 = {
      resourcesPathNames: {
        value: function resourcesPathNames(options) {
          return _core.Object.assign(this.context.get("path_names"), options);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      resource: {
        value: function resource() {
          var _this = this;
          var args = [];

          for (var _key = 0; _key < arguments.length; _key++) {
            args[_key] = arguments[_key];
          }

          var _buildArgs$apply = buildArgs.apply(undefined, _toArray(args));

          var _buildArgs$apply2 = _slicedToArray(_buildArgs$apply, 3);

          var resources = _buildArgs$apply2[0];
          var options = _buildArgs$apply2[1];
          var cb = _buildArgs$apply2[2];


          if (this.applyCommonBehaviorFor("resource", resources, options, cb)) {
            return this;
          }

          this.resourceScope("resource", new SingletonResource(resources.pop(), options), function () {
            if (isFunction(cb)) {
              cb.call(_this);
            }

            if (options.concerns) {
              _this.concerns(options.concerns);
            }

            var actions = _this.parentResource().actions;
            if (actions.includes("create")) {
              _this.collection(function () {
                _this.post("create");
              });
            }

            if (actions.includes("new")) {
              _this["new"](function () {
                _this.get("new");
              });
            }

            _this.setMemberMappingsForResource();
          });
          return this;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      resources: {
        value: function resources() {
          var _this2 = this;
          var args = [];

          for (var _key2 = 0; _key2 < arguments.length; _key2++) {
            args[_key2] = arguments[_key2];
          }

          var _buildArgs$apply3 = buildArgs.apply(undefined, _toArray(args));

          var _buildArgs$apply3 = _slicedToArray(_buildArgs$apply3, 3);

          var resources = _buildArgs$apply3[0];
          var options = _buildArgs$apply3[1];
          var cb = _buildArgs$apply3[2];


          if (this.applyCommonBehaviorFor("resources", resources, options, cb)) {
            return this;
          }

          this.resourceScope("resources", new Resource(resources.pop(), options), function () {
            if (isFunction(cb)) {
              cb.call(_this2);
            }

            if (options.concerns) {
              _this2.concerns(options.concerns);
            }

            var actions = _this2.parentResource().actions;
            _this2.collection(function () {
              if (actions.includes("index")) {
                _this2.get("index");
              }
              if (actions.includes("create")) {
                _this2.post("create");
              }
            });

            if (actions.includes("new")) {
              _this2["new"](function () {
                _this2.get("new");
              });
            }

            _this2.setMemberMappingsForResource();
          });
          return this;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      collection: {
        value: function collection(cb) {
          var _this3 = this;
          if (!this.isResourceScope()) {
            throw "Can't use collection outside resource(s) scope";
          }

          this.withScopeLevel("collection", function () {
            _this3.scope(_this3.parentResource().collectionScope, cb);
          });
          return this;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      member: {
        value: function member(cb) {
          var _this4 = this;
          if (!this.isResourceScope()) {
            throw "Can't use member outside resource(s) scope";
          }

          this.withScopeLevel("member", function () {
            if (_this4.isShallow()) {
              _this4.shallowScope(_this4.parentResource().memberScope, cb);
            } else {
              _this4.scope(_this4.parentResource().memberScope, cb);
            }
          });
          return this;
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    };

    _defineProperty(_prototypeProperties2, "new", {
      value: function _new(cb) {
        var _this5 = this;
        if (!this.isResourceScope()) {
          throw "Can't use new outside resource(s) scope";
        }
        this.withScopeLevel("new", function () {
          _this5.scope(_this5.parentResource().newScope(_this5.actionPath("new")), cb);
        });
        return this;
      },
      writable: true,
      enumerable: true,
      configurable: true
    });

    _defineProperty(_prototypeProperties2, "nested", {
      value: function nested(cb) {
        var _this6 = this;
        if (!this.isResourceScope()) {
          throw "Can't use nested outside resource(s) scope";
        }

        this.withScopeLevel("nested", function () {
          if (_this6.isShallow() && _this6.shallowNestingDepth() >= 1) {
            _this6.shallowScope(_this6.parentResource().nestedScope, _this6.nestedOptions(), cb);
          } else {
            _this6.scope(_this6.parentResource().nestedScope, _this6.nestedOptions(), cb);
          }
        });
        return this;
      },
      writable: true,
      enumerable: true,
      configurable: true
    });

    _defineProperty(_prototypeProperties2, "namespace", {

      // Scoping#namespace
      //namespace(path, options = {}, cb) {
      value: (function (_namespace) {
        var _namespaceWrapper = function namespace() {
          return _namespace.apply(this, arguments);
        };

        _namespaceWrapper.toString = function () {
          return _namespace.toString();
        };

        return _namespaceWrapper;
      })(function () {
        var _this7 = this;
        var args = [];

        for (var _key3 = 0; _key3 < arguments.length; _key3++) {
          args[_key3] = arguments[_key3];
        }

        args = buildArgs.apply(undefined, _toArray(args));
        if (this.isResourceScope()) {
          this.nested(function () {
            namespace.apply(_this7, args);
          });
        } else {
          namespace.apply(this, args);
        }
        return this;
      }),
      writable: true,
      enumerable: true,
      configurable: true
    });

    _defineProperty(_prototypeProperties2, "shallow", {
      value: function shallow(cb) {
        return this.scope({ shallow: true }, cb);
      },
      writable: true,
      enumerable: true,
      configurable: true
    });

    _defineProperty(_prototypeProperties2, "isShallow", {
      value: function isShallow() {
        return this.parentResource() instanceof Resource && this.context.get("shallow");
      },
      writable: true,
      enumerable: true,
      configurable: true
    });

    _defineProperty(_prototypeProperties2, "root", {

      // root({ to: 'photos#show' })
      // root('photos#show')
      value: (function (_root) {
        var _rootWrapper = function root() {
          return _root.apply(this, arguments);
        };

        _rootWrapper.toString = function () {
          return _root.toString();
        };

        return _rootWrapper;
      })(function (path) {
        var _this8 = this;
        var options = arguments[1] === undefined ? {} : arguments[1];
        if (isString(path)) {
          options.to = path;
        } else if (isObject(path) && isEmpty(options)) {
          options = path;
        } else {
          throw "must be called with a path and/or options";
        }

        if (this.context.isResources()) {
          this.withScopeLevel("root", function () {
            _this8.scope(_this8.parentResource().path, function () {
              root.call(_this8, options);
            });
          });
        } else {
          root.call(this, options);
        }
        return this;
      }),
      writable: true,
      enumerable: true,
      configurable: true
    });

    _defineProperty(_prototypeProperties2, "match", {

      // match 'path'
      // match 'path', { to: 'controller#action' }
      // match 'path', 'otherpath', { on: 'member', via: 'get' }
      // match { on: 'member', via: 'get' }
      //match(path, ...rest) {
      value: function match() {
        var _this9 = this;
        var args = [];

        for (var _key4 = 0; _key4 < arguments.length; _key4++) {
          args[_key4] = arguments[_key4];
        }

        var _buildArgs$apply4 = buildArgs.apply(undefined, _toArray(args));

        var _buildArgs$apply4 = _slicedToArray(_buildArgs$apply4, 3);

        var paths = _buildArgs$apply4[0];
        var options = _buildArgs$apply4[1];
        var cb = _buildArgs$apply4[2];


        var to = options.to;
        if (to) {
          if (!/#/.test(to)) {
            options.controller = to;
          }
        }

        if (paths.length === 0 && options.path) {
          paths = [options.path];
        }

        if (!hasOwn(options, "anchor")) {
          options.anchor = true;
        }

        if (options.on && !VALID_ON_OPTIONS.includes(options.on)) {
          throw "Unknown scope " + options.on + " given to :on";
        }

        var controller = this.context.get("controller");
        var action = this.context.get("action");
        if (controller && action) {
          var _options = options;
          if (!_hasOwn.call(_options, "to")) _options.to = "" + controller + "#" + action;
        }

        paths.forEach(function (p) {
          var routeOptions = _core.Object.assign(options);
          routeOptions.path = p;
          var pathWithoutFormat = p.replace(/\(\.:format\)$/, "");
          if (_this9.isUsingMatchShorthand(pathWithoutFormat, routeOptions)) {
            var _routeOptions = routeOptions;
            if (!_hasOwn.call(_routeOptions, "to")) _routeOptions.to = pathWithoutFormat.replace(/^\//g, "").replace(/\/([^\/]*)$/, "#$1");
            routeOptions.to = routeOptions.to.replace(/-/g, "_");
          }
          _this9.decomposedMatch(p, routeOptions);
        });
        return this;
      },
      writable: true,
      enumerable: true,
      configurable: true
    });

    _defineProperty(_prototypeProperties2, "isUsingMatchShorthand", {
      value: function isUsingMatchShorthand(path, options) {
        return path && !(options.to || options.action) && /\//.test(path);
      },
      writable: true,
      enumerable: true,
      configurable: true
    });

    _defineProperty(_prototypeProperties2, "decomposedMatch", {
      value: function decomposedMatch(path, options) {
        var _this10 = this;
        var on = options.on;
        if (on) {
          delete options.on;
          this[on](function () {
            _this10.decomposedMatch(path, options);
          });
        } else {
          switch (this.context.scopeLevel) {
            case "resources":
              this.nested(function () {
                _this10.decomposedMatch(path, options);
              });
              break;
            case "resource":
              this.member(function () {
                _this10.decomposedMatch(path, options);
              });
              break;
            default:
              this.addRoute(path, options);
          }
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    });

    _defineProperty(_prototypeProperties2, "shallowScope", {

      //shallowScope(path, options = {}, cb) {
      value: function shallowScope() {
        var _ref5;
        var args = [];

        for (var _key5 = 0; _key5 < arguments.length; _key5++) {
          args[_key5] = arguments[_key5];
        }

        var _buildArgs$apply5 = buildArgs.apply(undefined, _toArray(args));

        var _buildArgs$apply5 = _slicedToArray(_buildArgs$apply5, 3);

        var paths = _buildArgs$apply5[0];
        var options = _buildArgs$apply5[1];
        var cb = _buildArgs$apply5[2];
        var scope = {
          as: this.context.get("shallow_prefix"),
          path: this.context.get("shallow_path")
        };
        this.context = this.context.create(scope);
        (_ref5 = this).scope.apply(_ref5, _toArray(paths).concat([options, cb]));
        this.context = this.context.parent;
      },
      writable: true,
      enumerable: true,
      configurable: true
    });

    _defineProperty(_prototypeProperties2, "setMemberMappingsForResource", {
      value: function setMemberMappingsForResource() {
        var _this11 = this;
        this.member(function () {
          var actions = _this11.parentResource().actions;
          if (actions.includes("edit")) {
            _this11.get("edit");
          }
          if (actions.includes("show")) {
            _this11.get("show");
          }
          if (actions.includes("update")) {
            _this11.patch("update");
            _this11.put("update");
          }
          if (actions.includes("destroy")) {
            _this11["delete"]("destroy");
          }
        });
      },
      writable: true,
      enumerable: true,
      configurable: true
    });

    _defineProperty(_prototypeProperties2, "applyCommonBehaviorFor", {
      value: function applyCommonBehaviorFor(method, resources, options, cb) {
        var _this12 = this;
        if (resources.length > 1) {
          resources.forEach(function (r) {
            _this12[method](r, options, cb);
          });
          return true;
        }

        if (options.shallow) {
          delete options.shallow;
          this.shallow(function () {
            _this12[method](resources.pop(), options, cb);
          });
          return true;
        }

        if (this.isResourceScope()) {
          this.nested(function () {
            _this12[method](resources.pop(), options, cb);
          });
          return true;
        }

        _core.Object.keys(options).forEach(function (k) {
          if (isRegExp(options[k])) {
            var _options2;
            (_options2 = options, !_hasOwn.call(_options2, "constraints") && (_options2.constraints = {}), _options2.constraints)[k] = options[k];
            delete options[k];
          }
        });

        var scopeOptions = {};
        _core.Object.keys(options).forEach(function (k) {
          if (!RESOURCE_OPTIONS.includes(k)) {
            scopeOptions[k] = options[k];
            delete options[k];
          }
        });
        if (_core.Object.keys(scopeOptions).length > 0) {
          this.scope(scopeOptions, function () {
            _this12[method](resources.pop(), options, cb);
          });
          return true;
        }

        if (!this.isActionOptions(options)) {
          if (this.isScopeActionOptions()) {
            _core.Object.assign(options, this.scopeActionOptions());
          }
        }

        return false;
      },
      writable: true,
      enumerable: true,
      configurable: true
    });

    _defineProperty(_prototypeProperties2, "resourceScope", {
      value: function resourceScope(kind, resource, cb) {
        var _this13 = this;
        resource.shallow = this.context.get("shallow");
        this.context = this.context.create({ scope_level_resource: resource });
        this.nesting.push(resource);

        this.withScopeLevel(kind, function () {
          _this13.scope(_this13.parentResource().resourceScope, cb);
        });

        this.nesting.pop();
        this.context = this.context.parent;
      },
      writable: true,
      enumerable: true,
      configurable: true
    });

    _defineProperty(_prototypeProperties2, "nestedOptions", {
      value: function nestedOptions() {
        var parentResource = this.parentResource();
        var options = {
          as: parentResource.memberName
        };
        if (this.isParamConstraint()) {
          options.constraints = _defineProperty({}, parentResource.nestedParam, this.paramConstraint());
        }
        return options;
      },
      writable: true,
      enumerable: true,
      configurable: true
    });

    _defineProperty(_prototypeProperties2, "isParamConstraint", {
      value: function isParamConstraint() {
        var constraints = this.context.get("constraints");
        return constraints && constraints[this.parentResource().param];
      },
      writable: true,
      enumerable: true,
      configurable: true
    });

    _defineProperty(_prototypeProperties2, "paramConstraint", {
      value: function paramConstraint() {
        return this.context.get("constraints")[this.parentResource().param];
      },
      writable: true,
      enumerable: true,
      configurable: true
    });

    _defineProperty(_prototypeProperties2, "withScopeLevel", {
      value: function withScopeLevel(kind, cb) {
        if (isFunction(cb)) {
          this.context = this.context.createLevel(kind);
          cb.call(this);
          this.context = this.context.parent;
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    });

    _defineProperty(_prototypeProperties2, "parentResource", {
      value: function parentResource() {
        return this.context.get("scope_level_resource");
      },
      writable: true,
      enumerable: true,
      configurable: true
    });

    _defineProperty(_prototypeProperties2, "shallowNestingDepth", {
      value: function shallowNestingDepth() {
        return this.nesting.filter(function (r) {
          return r.isShallow();
        }).length;
      },
      writable: true,
      enumerable: true,
      configurable: true
    });

    _defineProperty(_prototypeProperties2, "isResourceScope", {
      value: function isResourceScope() {
        return this.context.isResourceScope();
      },
      writable: true,
      enumerable: true,
      configurable: true
    });

    _defineProperty(_prototypeProperties2, "isNestedScope", {
      value: function isNestedScope() {
        return this.context.isNested();
      },
      writable: true,
      enumerable: true,
      configurable: true
    });

    _defineProperty(_prototypeProperties2, "isActionOptions", {
      value: function isActionOptions(options) {
        return options.only || options.except;
      },
      writable: true,
      enumerable: true,
      configurable: true
    });

    _defineProperty(_prototypeProperties2, "isScopeActionOptions", {
      value: function isScopeActionOptions() {
        var options = this.context.get("options");
        return options && (options.only || options.except);
      },
      writable: true,
      enumerable: true,
      configurable: true
    });

    _defineProperty(_prototypeProperties2, "scopeActionOptions", {
      value: function scopeActionOptions() {
        var options = this.context.get("options");
        var o = {};
        _core.Object.keys(options).forEach(function (k) {
          if (k === "only" || k === "except") {
            o[k] = options[k];
          }
        });
        return o;
      },
      writable: true,
      enumerable: true,
      configurable: true
    });

    _defineProperty(_prototypeProperties2, "isResourceMethodScope", {
      value: function isResourceMethodScope() {
        return this.context.isResourceMethodScope();
      },
      writable: true,
      enumerable: true,
      configurable: true
    });

    _defineProperty(_prototypeProperties2, "isCanonicalAction", {
      value: function isCanonicalAction(action) {
        return this.isResourceMethodScope() && CANONICAL_ACTIONS.includes(action);
      },
      writable: true,
      enumerable: true,
      configurable: true
    });

    _defineProperty(_prototypeProperties2, "pathForAction", {
      value: function pathForAction(action, path) {
        if (path && this.isCanonicalAction(action)) {
          return this.context.get("path");
        } else {
          var scopePath = this.context.get("path");
          var actionPath = this.actionPath(action, path);
          return compact([scopePath, actionPath]).join("/");
          //if (scopePath) {
          //  return [scopePath, actionPath].join('/');
          //}
          //return actionPath;
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    });

    _defineProperty(_prototypeProperties2, "actionPath", {
      value: function actionPath(name, path) {
        return path || this.context.get("path_names")[name] || name;
      },
      writable: true,
      enumerable: true,
      configurable: true
    });

    _defineProperty(_prototypeProperties2, "addRoute", {
      value: function addRoute(action, options) {
        var path = normalizePath(this.pathForAction(action, options.path));
        delete options.path;

        action = String(action);
        if (/^[\w\-\/]+$/.test(action)) {
          if (!action.includes("/")) {
            var _options3 = options;
            if (!_hasOwn.call(_options3, "action")) _options3.action = action.replace(/-/g, "_");
          }
        } else {
          action = null;
        }

        var as = this.nameForAction(options.as, action);
        delete options.as;

        var mapping = Mapping.build(this.context, this.set, path, as, options);
        console.dir(mapping);

        this.set.addRoute(mapping);
      },
      writable: true,
      enumerable: true,
      configurable: true
    });

    _defineProperty(_prototypeProperties2, "prefixNameForAction", {
      value: function prefixNameForAction(as, action) {
        var prefix = undefined;
        if (as) {
          prefix = as;
        } else if (!this.isCanonicalAction(action)) {
          prefix = action;
        }

        if (prefix && prefix !== "/") {
          //return normalizePath(prefix.replace(/-/g, '_'));
          return prefix.replace(/-/g, "_");
        }

        return prefix;
      },
      writable: true,
      enumerable: true,
      configurable: true
    });

    _defineProperty(_prototypeProperties2, "nameForAction", {
      value: function nameForAction(as, action) {
        var prefix = this.prefixNameForAction(as, action);
        var namePrefix = this.context.get("as");
        var collectionName = undefined;
        var memberName = undefined;
        var parentResource = this.parentResource();
        if (parentResource) {
          if (!(as || action)) {
            return null;
          }

          collectionName = parentResource.collectionName;
          memberName = parentResource.memberName;
        }

        var name = this.context.actionName(namePrefix, prefix, collectionName, memberName);

        var candidate = compact(name).join("_");
        if (candidate) {
          if (!as) {
            if (/^[_a-zA-Z]/.test(candidate) && !hasOwn(this.set.namedRoutes, candidate)) {
              return candidate;
            }
          } else {
            return candidate;
          }
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    });

    return _prototypeProperties2;
  })());

  return Resources;
})();

module.exports = Resources;