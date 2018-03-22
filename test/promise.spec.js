var path = require('path')
var promisePath = process.env.NODE_ENV === 'production' ? path.resolve(__dirname, '../dist/index.js') : path.resolve(__dirname, '../src/index.js')
var Promise = require(promisePath)

/* ===================================== TEST ==================================================== */
Promise.defer = function() {
    var dfd = {}
    dfd.promise = new Promise(function(_resolve, _reject) {
        dfd.resolve = _resolve
        dfd.reject = _reject
    })
    return dfd
}

Promise.deferred = Promise.defer
/* ===================================== TEST END================================================= */

module.exports = Promise