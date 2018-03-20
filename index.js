/**
 * @description Promise实现.符合Promise A+规范。
 * Promise构造函数接收一个 executor 函数,executor函数执行完同步或异步操作后,调用它的两个参数 resolve 和 reject
 * @example
 *   // return promise 实例
 * new Promise(function(resolve, reject) {
 *   // 如果操作成功，调用 resolve并传入 value
 *      resolve(value)
 *   // 如果操作失败，调用 reject并传入 reason
 *      reject(reason)
 * }
 * @author singcl(24661881@qq.com)
 * @date    2018-03-14 01:03:15
 * @version 0.0.1
 */

// Promise构造函数接收一个executor函数，executor函数执行完同步或异步操作后，调用它的两个参数resolve和reject
function Promise(executor) {
    var self = this

    self.status = 'pending'                 // Promise当前的状态
    self.data = undefined                   // Promise的值
    self.onResolvedCallback = []            // Promise resolve时的回调函数集，因为在Promise结束之前有可能有多个回调添加到它上面
    self.onRejectedCallback = []            // Promise reject时的回调函数集，因为在Promise结束之前有可能有多个回调添加到它上面

    /* =================================== Promise 构造函数 ============================================ */
    // resolve函数实现
    // Promise构造函数内部定义的私有函数
    // 作为executor回调函数的第一个参数使用
    function resolve(value) {
        // resolve一个promise的时候具体流程还没有搞清楚 =》OK
        // 如果value是一个Promise对象，直接取它的结果做为promise的结果
        // resolve作为callback在then内部异步执行，当resolve执行时，传入resolve的参数时候value的data,而resolve是以参数参数传进去的，它的执行改变的是外部调用resolve的环境即将生成的promise的状态
        if (value instanceof Promise) {
            return value.then(resolve, reject)
        }
        // 异步执行所有回调函数
        // 为什么这里要异步执行？暂时我的理解是：resolve和reject可能同步被调用，也可能异步被调用。
        // 如果我们resolve被设计为同步，那么当它被同步调用时候在执行then方法之前状态就位resolved， 当它被异步调用时候在执行then方法之前它的状态还是pending
        // 所以这样会有很多不确定性。为了统一，这里resolve和reject都被设计为异步，那么不同同步调用还是异步调用，都会异步更新promise，保证在执行then的时候统一为pending
        // 第二，这样这设计可以保证在异步执行resolve和reject的时候保证then 的callback已经push到了相应的队列当中。
        setTimeout(function() {
            if(self.status === 'pending') {
                self.status = 'resolved'
                self.data = value
                for(var i = 0; i < self.onResolvedCallback.length; i++) {
                    self.onResolvedCallback[i](value)
                }
            }
        }, 0)
    }
    // reject函数实现
    // Promise构造函数内部定义的私有函数
    // 作为executor回调函数的第二个参数使用
    function reject(reason) {
        // 异步执行所有回调函数
        // 为什么这里要异步执行？暂时我的理解是：resolve和reject可能同步被调用，也可能异步被调用。
        // 如果我们resolve被设计为同步，那么当它被同步调用时候在执行then方法之前状态就位resolved， 当它被异步调用时候在执行then方法之前它的状态还是pending
        // 所以这样会有很多不确定性。为了统一，这里resolve和reject都被设计为异步，那么不同同步调用还是异步调用，都会异步更新promise，保证在执行then的时候统一为pending
        // 第二，这样这设计可以保证在异步执行resolve和reject的时候保证then 的callback已经push到了相应的队列当中。
        setTimeout(function() {
            if (self.status === 'pending') {
                self.status = 'rejected'
                self.data = reason
                for(var i = 0; i < self.onRejectedCallback.length; i++) {
                    self.onRejectedCallback[i](reason)
                }
            }
        }, 0)
    }
    // executor函数在执行过程中有可能出错
    // 我们来捕获这个错误
    try {
        executor(resolve, reject)               // 执行executor并传入相应的参数
    } catch (error) {
        reject(error)
    }
    /* =============================== Promise 构造函数 END ======================================== */

    /* =============================== Promise 原型方法: then ====================================== */
    // Promise对象有一个then方法，用来注册在这个Promise状态确定后的回调.
    // 显然，then方法定义在Promise的原型对象上。then方法会返回一个Promise.
    Promise.prototype.then = function(onResolved, onRejected) {
        var self = this
        var promise2

        // 根据标准，then方法的参数如果不是function,则我们需要忽略它
        onResolved = typeof onResolved === 'function' ? onResolved : function() {}
        onRejected = typeof onRejected === 'function' ? onRejected : function() {}

        if (self.status === 'pending') {
            // 如果当前的Promise还处于pending状态，我们并不能确定调用onResolved还是onRejected，
            // 只能等到Promise的状态确定后，才能确实如何处理。
            // 所以我们需要把我们的**两种情况**的处理逻辑做为callback放入promise1(此处即this/self)的回调数组里
            // 逻辑本身跟第一个if块内的几乎一致
            promise2 = new Promise(function(resolve, reject) {
                // 这里之所以没有异步执行，是因为这些函数必然会被resolve或reject调用，而resolve或reject函数里的内容已是异步执行，构造函数里的定义
                self.onResolvedCallback.push(function(value) {
                    var x = onResolved(value)
                    if (x instanceof Promise) {
                        // 如果onResolved的返回值是一个Promise对象，直接取它的结果做为promise2的结果
                        x.then(resolve, reject)
                    }
                    resolve(x)
                })

                self.onRejectedCallback.push(function(reason) {
                    var x = onRejected(reason)
                    if (x instanceof Promise) {
                        x.then(resolve, reject)
                    }
                    reject(x)
                })
            })
            // then方法执行结果返回一个新的promise: promise2
            return promise2
        }

        if (self.status === 'resolved') {
            // 如果promise1(此处即为this/self)的状态已经确定并且是resolved，我们调用onResolved
            promise2 = new Promise(function(resolve, reject) {
                // 异步执行onResolved
                setTimeout(function() {
                    // 因为考虑到有可能throw，所以我们将其包在try/catch块里
                    try {
                        var x = onResolved(self.data)
                        // 如果onResolved的返回值是一个Promise对象，直接取它的结果做为promise2的结果
                        if (x instanceof Promise) {
                            x.then(resolve, reject)
                        }
                        // 否则，以它的返回值做为promise2的结果
                        resolve(x)
                    } catch (error) {
                        // 如果出错，以捕获到的错误做为promise2的结果
                        reject(error)
                    }
                }, 0)
            })
            // then方法执行结果返回一个新的promise: promise2
            return promise2
        }

        // 此处与前一个if块的逻辑几乎相同，区别在于所调用的是onRejected函数
        if (self.status === 'rejected') {
            // 如果promise1(此处即为this/self)的状态已经确定并且是rejected，我们调用onRejected
            promise2 = new Promise(function(resolve, reject) {
                // 异步执行onRejected
                setTimeout(function() {
                    // 因为考虑到有可能throw，所以我们将其包在try/catch块里
                    try {
                        var x = onRejected(self.data)
                        // 如果onRejected的返回值是一个Promise对象，直接取它的结果做为promise2的结果
                        if (x instanceof Promise) {
                            x.then(resolve, reject)
                        }
                        // 否则，以它的返回值做为promise2的结果
                        reject(x)
                    } catch (error) {
                        // 如果出错，以捕获到的错误做为promise2的结果
                        reject(error)
                    }
                }, 0)
            })
            // then方法执行结果返回一个新的promise: promise2
            return promise2
        }
    }
    /* ============================ Promise 原型方法then END ===================================== */
}

// exports
module.exports = Promise
