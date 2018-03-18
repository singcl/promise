## 深入理解Promise内部结构，逐步实现一个完整的Promise类

### Promise标准简读
#### 1. 只有一个then方法，没有race，all等方法，甚至没有构造函数
Promise标准中仅指定了Promise对象的then方法的行为，其它一切我们常见的方法/函数都并没有指定，包括catch，race，all等常用方法，甚至也没有指定该如何构造出一个Promise对象。另外then也没有一般实现中（Q, $q等）所支持的第三个参数，一般称onProgress.

#### 2. then方法返回一个新的Promise
Promise的then方法返回一个新的Promise，而不是返回this
```js
// 假设已经实现了一个Promise对象promise1
var promise2 = promise1.then(/*your code*/)
console.log(promise2 === promise1)  // fales
```
#### 3. 不同Promise的实现需要可以相互调用
#### 4. 三个状态：pending,resolved,rejected
Promise的初始状态为pending，它可以由此状态转换为fulfilled（resolved）或者rejected,Promise的状态一旦从pending变为fulfilled或者rejected就**永远**不会在变化.
#### 5. 更多规范参照[Promise官方英文文档](https://promisesaplus.com/)

- ### **Promise实现**

- [x] Promise构造函数基本结构
- [x] Promise原型方法then