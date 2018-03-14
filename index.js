/**
 * @description Promise实现.符合Promise A+规范。
 * Promise构造函数接收一个executor函数,executor函数执行完同步或异步操作后,调用它的两个参数resolve和reject
 * @example
 *   // return promise 实例
 * new Promise(function(resolve, reject) {
 *   // 如果操作成功，调用resolve并传入value
 *      resolve(value)
 *   // 如果操作失败，调用reject并传入reason
 *      reject(reason)
 * }
 * @author singcl(24661881@qq.com)
 * @date    2018-03-14 01:03:15
 * @version 0.0.1
 */

/**************************************************************************************************************
// STEP: 1
// 我们先实现promise构造函数的框架
function Promise(executor) {
    var self = this
    self.status = 'pending'         // Promise 初始状态
    self.data = undefined           // Promise 初始数据
    self.onResolvedCallback = []    // Promise resolve时的回调函数集，因为在Promise结束之前有可能有多个callback添加到它上面
    self.onRejectedCallback = []    // Promise reject时的回调函数集，因为在Promise结束之前有可能有多个callback添加到它上面
    executor(resolve, reject)       // 执行executor并传入相应的参数
}
***************************************************************************************************************/

/****************************************************************************************************************
// STEP: 2
// 上面的代码基本实现了Promise构造函数的主体，但目前还有两个问题
// 1. 我们给executor函数传了两个参数：resolve和reject，这两个参数目前还没有定义
// 2. executor有可能会出错（throw），而如果executor出错，Promise应当reject其throw出的值
// 现在让我们在构造函数里定义resolve和reject这两个函数 和 错误捕获

function Promise(executor) {
    var self = this
    self.status = 'pending'         // Promise 初始状态
    self.data = undefined           // Promise 初始数据
    self.onResolvedCallback = []    // Promise resolve时的回调函数集，因为在Promise结束之前有可能有多个callback添加到它上面
    self.onRejectedCallback = []    // Promise reject时的回调函数集，因为在Promise结束之前有可能有多个callback添加到它上面
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
*******************************************************************************************************************/
