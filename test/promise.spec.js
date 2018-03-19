var Promise = require('../index.js')

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