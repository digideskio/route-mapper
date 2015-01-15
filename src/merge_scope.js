import {normalizePath, compact} from './utils';

let mergeScope = {

  // parent/child
  path(parent, child) {
    return normalizePath([parent, child].join('/'));
  },

  // parent/child
  shallow_path(parent, child) {
    return normalizePath([parent, child].join('/'));
  },

  // parent_child
  as(parent, child) {
    return parent ? [parent, child].join('_') : child;
  },

  // parent_child
  shallow_prefix(parent, child) {
    return parent ? [parent, child].join('_') : child;
  },

  // parent/child
  module(parent, child) {
    return parent ? normalizePath([parent, child].join('/')) : child;
  },

  controller(parent, child) {
    return child;
  },

  action(parent, child) {
    return child;
  },

  path_names(parent, child) {
    return this.options(parent, child);
  },

  constraints(parent, child) {
    return this.options(parent, child);
  },

  defaults(parent, child) {
    return this.options(parent, child);
  },

  //blocks(parent, child) { },

  options(parent, child) {
    parent = Object.assign(parent || {});
    let excepts = this.overrideKeys(child);
    for (let key of excepts) {
      delete parent[key];
    }
    return Object.assign(parent, child);
  },

  shallow(parent, child) {
    return child ? true : false;
  },

  overrideKeys(child) {
    return (child.only || child.except) ? ['only', 'except'] : [];
  }

};

export default mergeScope;
