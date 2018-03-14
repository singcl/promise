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

/** ************************************************************************************************************
 * STEP: 1
 * 我们先构建promise构造函数的基本结构
 * ==============================================================================================================
function Promise(executor) {
    var self = this
    self.status = 'pending'         // Promise 初始状态
    self.data = undefined           // Promise 初始数据
    self.onResolvedCallback = []    // Promise resolve 时的 callback集，因为在Promise 结束之前可能有多个callback添加到它上面
    self.onRejectedCallback = []    // Promise reject 时的 callback集，因为在Promise 结束之前可能有多个callback添加到它上面
    executor(resolve, reject)       // 执行executor并传入相应的参数
}
************************************************************************************************************** */

/** **************************************************************************************************************
 * STEP: 2
 * 上面的代码基本实现了Promise构造函数的基本结构，但目前还有两个问题
 * 1. 我们给executor函数传了两个参数：resolve 和 reject，这两个参数目前还没有定义
 * 2. executor执行过程中有可能出错。如果executor出错，我们应该reject掉这个错误
 * 现在我们在构造函数里定义 resolve 和 reject 这两个函数
 * 同时捕获错误
 * ==============================================================================================================

function Promise(executor) {

    // ...

    function resolve(value) {
        // TODO
    }
    function reject(reason) {
        // TODO
    }
    // 考虑到执行executor的过程中有可能出错，所以我们用try/catch块给包起来，并且在出错后reject掉catch到的值
    try {
        executor(resolve, reject) // 执行executor
    } catch(e) {
        reject(e)
    }
}
****************************************************************************************************************** */

/**
 ******************************************************************************************************************
 * STEP: 3
 * 有人可能会问，resolve 和 reject这两个函数能不能不定义在构造函数里呢？
 * 考虑到我们在executor函数里是以resolve(value)，reject(reason)的形式调用的这两个函数
 * 而不是以resolve.call(promise, value)，reject.call(promise, reason)这种形式调用的
 * 所以这两个函数在调用时的内部也必然有一个隐含的this
 * 也就是说，要么这两个函数是经过bind后传给了executor，要么它们定义在构造函数的内部，使用self来访问所属的Promise对象。
 * 所以如果我们想把这两个函数定义在构造函数的外部，确实是可以这么写的：
 * =================================================================================================================
 *  function resolve() {
       // TODO
    }
    function reject() {
      // TODO
    }
    function Promise(executor) {
      try {
        executor(resolve.bind(this), reject.bind(this))
      } catch(e) {
        reject.bind(this)(e)
      }
    }
 * =============================================================================================================
 * 但是众所周知，bind也会返回一个新的函数，这么一来还是相当于每个Promise对象都有一对属于自己的resolve和reject函数，
 * 就跟写在构造函数内部没什么区别了，所以我们就直接把这两个函数定义在构造函数里面了。
 * ==============================================================================================================
 * 另外我们这里的实现并没有考虑隐藏this上的变量，这使得这个Promise的状态可以在executor函数外部被改变，
 * 在一个靠谱的实现里，构造出的Promise对象的状态和最终结果应当是无法从外部更改的。
 * 接下来，我们实现resolve和reject这两个函数
 * ==============================================================================================================
 * function Promise(executor) {

  // ...

  function resolve(value) {
    if (self.status === 'pending') {
      self.status = 'resolved'
      self.data = value
      for(var i = 0; i < self.onResolvedCallback.length; i++) {
        self.onResolvedCallback[i](value)
      }
    }
  }

  function reject(reason) {
    if (self.status === 'pending') {
      self.status = 'rejected'
      self.data = reason
      for(var i = 0; i < self.onRejectedCallback.length; i++) {
        self.onRejectedCallback[i](reason)
      }
    }
  }

  // ...
}
 *===============================================================================================================
 * 基本上就是在判断状态为pending之后把状态改为相应的值，并把对应的value和reason存在self的data属性上面，之后执行相应的回调函数
 **************************************************************************************************************** */
