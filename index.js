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

 // 我们先实现promise构造函数的框架
 