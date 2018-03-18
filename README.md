## 深入理解Promise内部结构，逐步实现一个完整的Promise类

- ### Promise标准简读
#### 1. 只有一个then方法，没有race，all等方法，甚至没有构造函数
`Promise`标准中仅指定了`Promise`对象的`then`方法的行为，其它一切我们常见的方法/函数都并没有指定，包括`catch`，`race`，`all`等常用方法，甚至也没有指定该如何构造出一个`Promise`对象。另外`then`也没有一般实现中（Q, $q等）所支持的第三个参数，一般称`onProgress`.

#### 2. then方法返回一个新的Promise
`Promise`的`then`方法返回一个新的`Promise`，而不是返回`this`
```js
// 假设已经实现了一个Promise对象promise1
var promise2 = promise1.then(/*your code*/)
console.log(promise2 === promise1)  // fales
```
#### 3. 不同Promise的实现需要可以相互调用
#### 4. 三个状态：pending,resolved,rejected
`Promise`的初始状态为`pending`，它可以由此状态转换为`fulfilled`（`resolved`）或者`rejected`,`Promise`的状态一旦从`pending`变为`fulfilled`或者`rejected`就**永远**不会在变化.
#### 5. 更多规范参照[Promise官方英文文档](https://promisesaplus.com/)

- ### **Promise实现**

- [x] `Promise`构造函数基本结构
- [x] `Promise`原型方法then