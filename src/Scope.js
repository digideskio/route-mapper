/*!
 * route-mapper - Scope
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

import _ from 'lodash';

/**
 * Options keywords.
 *
 * @const
 * @static
 * @public
 */
export const OPTIONS = [
  'path',
  'as',
  'module',
  'controller',
  'action',
  'pathNames',
  'options'
];

const RESOURCE_SCOPES = ['resource', 'resources'];

const RESOURCE_METHOD_SCOPES = ['collection', 'member', 'new'];

/**
 * Scope
 *
 * @class
 */
export default class Scope {

  /**
   * @param {Object} current    - The current scope
   * @param {Object} parent     - The parent scope
   * @param {String} scopeLevel - The scope level
   */
  constructor(current, parent = {}, scopeLevel = '') {
    this.current = current;
    this.parent = parent;
    this.scopeLevel = scopeLevel;
  }

  get options() {
    return OPTIONS;
  }

  get isNested() {
    return this.scopeLevel === 'nested';
  }

  get isResources() {
    return this.scopeLevel === 'resources';
  }

  get isResourceScope() {
    return RESOURCE_SCOPES.includes(this.scopeLevel);
  }

  get isResourceMethodScope() {
    return RESOURCE_METHOD_SCOPES.includes(this.scopeLevel);
  }

  actionName(namePrefix, prefix, collectionName, memberName) {
    switch (this.scopeLevel) {
      case 'nested':
        return [namePrefix, prefix];
      case 'collection':
        return [prefix, namePrefix, collectionName];
      case 'new':
        return [prefix, 'new', namePrefix, memberName];
      case 'member':
        return [prefix, namePrefix, memberName];
      case 'root':
        return [namePrefix, collectionName, prefix];
      default:
        return [namePrefix, memberName, prefix];
    }
  }

  get(key, value) {
    if (_.has(this.current, key)) return this.current[key];
    if (_.has(this.parent, key)) return this.parent[key];
    if (this.parent instanceof Scope) return this.parent.get(key, value);
    return value;
  }

  set(key, value) {
    this.current[key] = value;
  }

  create(current) {
    return new Scope(current, this, this.scopeLevel);
  }

  createLevel(level) {
    return new Scope(this, this, level);
  }

}
