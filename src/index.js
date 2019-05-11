/**
 * Quasar App Extension index/runner script
 * (runs on each dev/build)
 *
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/IndexAPI.js
 */

const extendConf = function (conf) {
  // make sure qpdfviewer boot file is registered
  conf.boot.push('~@quasar/quasar-app-extension-qd3/src/boot/qd3.js')
  console.log(` App Extension (qd3) Info: 'Adding qd3 boot reference to your quasar.conf.js'`)

  // make sure boot & component files transpile
  conf.build.transpileDependencies.push(/quasar-app-extension-qd3[\\/]src/)

  // make sure qpdfviewer css goes through webpack to avoid ssr issues
  conf.css.push('~@quasar/quasar-app-extension-qd3/src/component/d3.styl')
  console.log(` App Extension (qd3) Info: 'Adding d3.styl css reference to your quasar.conf.js'`)
}

module.exports = function (api) {
  // quasar compatibility check
  api.compatibleWith('@quasar/app', '^1.0.0-beta.18')

  // register JSON api
  api.registerDescribeApi('QD3', './component/QD3.json')

  // extend quasar.conf
  api.extendQuasarConf(extendConf)
}
