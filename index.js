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
// STEP: 1
// 我们先构建promise构造函数的基本结构
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
// STEP: 2
// 上面的代码基本实现了Promise构造函数的基本结构，但目前还有两个问题
// 1. 我们给executor函数传了两个参数：resolve 和 reject，这两个参数目前还没有定义
// 2. executor执行过程中有可能出错。如果executor出错，我们应该reject掉这个错误
// 现在我们在构造函数里定义 resolve 和 reject 这两个函数
// 同时捕获错误

function Promise(executor) {
    var self = this
    self.status = 'pending'         // Promise 初始状态
    self.data = undefined           // Promise 初始数据
    self.onResolvedCallback = []    // Promise resolve时的callback集，因为在Promise结束之前有可能有多个callback添加到它上面
    self.onRejectedCallback = []    // Promise reject时的callback集，因为在Promise结束之前有可能有多个callback添加到它上面
    executor(resolve, reject)       // 执行executor并传入相应的参数

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
