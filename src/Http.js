'use strict'

/*!
 * route-mapper - Http
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

import METHODS from 'methods'
import utils from './utils'

export default class Http {

  _mapMethod(method, args) {
    const [paths, opts, cb] = utils.parseArgs(...args)
    opts.verb = method
    return this.match(paths, opts, cb)
  }

  static get METHODS() {
    return METHODS
  }

}

METHODS.forEach((m) => {
  const v = m.replace('-', '')
  Object.defineProperty(Http.prototype, v, {
    value: eval(`(function $${v}() {
                return this._mapMethod('${m}', arguments) })`)
  })
})
