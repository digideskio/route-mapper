/*!
 * route-mapper - Resource
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _pluralize = require('pluralize');

var _pluralize2 = _interopRequireDefault(_pluralize);

var _actions = require('actions');

/**
 * Resource
 *
 * @class
 */

let Resource = (function () {

  /**
   * @constructor
   * @param {String} entities       - The resource name
   * @param {Object} options        - Defaults to empby object
   * @param {Boolean} [camelCase]   - Defaults to true
   */

  function Resource(entities) {
    let options = arguments[1] === undefined ? Object.create(null) : arguments[1];
    let camelCase = arguments[2] === undefined ? true : arguments[2];

    _classCallCheck(this, Resource);

    this._name = String(entities);
    this.path = options.path || this._name;
    this.controller = options.controller || this._name;
    this.as = options.as;
    this.param = options.param || 'id';
    this.shallow = false;
    this.options = options;
    this.camelCase = camelCase;
  }

  /**
   * @example
   *  resource.newScope('edit')
   *  // => photos/edit
   */

  Resource.prototype.newScope = function newScope(newPath) {
    return `${ this.path }/${ newPath }`;
  };

  _createClass(Resource, [{
    key: 'defaultActions',
    get: function () {
      return _actions.ACTIONS;
    }
  }, {
    key: 'actions',
    get: function () {
      let only = this.options.only;
      let except = this.options.except;
      if (_lodash2['default'].isString(only)) only = [only];
      if (_lodash2['default'].isString(except)) except = [except];
      if (only && only.length) {
        return only;
      } else if (except && except.length) {
        return this.defaultActions.filter(function (a) {
          return except.indexOf(a) < 0;
        });
      }
      return this.defaultActions;
    }
  }, {
    key: 'name',
    get: function () {
      return _lodash2['default'].isString(this.as) ? this.as : this._name;
    }
  }, {
    key: 'plural',

    /**
     * @example
     *  resource.plural
     *  // => photos
     */
    get: function () {
      if (!_lodash2['default'].has(this, '_plural')) this._plural = _pluralize2['default'].plural(this.name);
      return this._plural;
    }
  }, {
    key: 'singular',

    /**
     * @example
     *  resource.singular
     *  // => photo
     */
    get: function () {
      if (!_lodash2['default'].has(this, '_singular')) this._singular = _pluralize2['default'].singular(this.name);
      return this._singular;
    }
  }, {
    key: 'memberName',

    /**
     * @example
     *  resource.memberName
     *  // => photo
     */
    get: function () {
      return this.singular;
    }
  }, {
    key: 'collectionName',

    /**
     * @example
     *  resource.collectionName
     *  // => index
     *  // => photoIndex
     *  // => photo_index
     *  // => photo
     */
    get: function () {
      let name = '';
      if (!this.plural) {
        name = 'index';
      } else if (this.singular === this.plural) {
        name = `${ this.plural }_index`;
      } else {
        name = this.plural;
      }
      return this.camelCase ? _lodash2['default'].camelCase(name) : name;
    }
  }, {
    key: 'resourceScope',
    get: function () {
      return {
        controller: this.controller
      };
    }
  }, {
    key: 'collectionScope',
    get: function () {
      return this.path;
    }
  }, {
    key: 'memberScope',

    /**
     * @example
     *  resource.memberScope
     *  // => photos/:id
     *  // => photos/:photoId/users/id
     *  // => photos/:photo_id/users/id
     */
    get: function () {
      return `${ this.path }/:${ this.param }`;
    }
  }, {
    key: 'shallowScope',
    get: function () {
      return this.memberScope;
    }
  }, {
    key: 'nestedParam',

    /**
     * @example
     *  resource.nestedParam
     *  // => id
     *  // => photoId
     *  // => photo_id
     */
    get: function () {
      let param = this.param !== 'id' ? this.param : this.singular + '_' + this.param;
      return this.camelCase ? _lodash2['default'].camelCase(param) : param;
    }
  }, {
    key: 'nestedScope',

    /**
     * @example
     *  resource.nestedScope
     *  // => photos/:id
     *  // => photos/:photoId/users/:id
     *  // => photos/:photo_id/users/:id
     */
    get: function () {
      return `${ this.path }/:${ this.nestedParam }`;
    }
  }, {
    key: 'isShallow',
    get: function () {
      return this.shallow;
    }
  }]);

  return Resource;
})();

exports['default'] = Resource;
module.exports = exports['default'];