![promise](./img/promise.png)
## Promise/A+
[![npm (scoped)](https://img.shields.io/npm/v/@singcl/promise.svg?style=flat-square)](https://www.npmjs.com/package/@singcl/promise)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-10de6e.svg?style=flat-square)](https://github.com/prettier/prettier)
![David](https://img.shields.io/david/dev/singcl/promise.svg?style=flat-square)
![David](https://img.shields.io/david/singcl/promise.svg?style=flat-square)
![Github file size](https://img.shields.io/github/size/singcl/promise/dist/index.js.svg?style=flat-square)
![npm](https://img.shields.io/npm/dm/promise.svg?style=flat-square)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fsingcl%2Fpromise.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fsingcl%2Fpromise?ref=badge_shield)

*badge: https://img.shields.io/*

### USAGE

1. install: `npm i @singcl/promise`
2. In project:
```js
var Promise = require('@singcl/promise')

var promise = new Promise(function(resolve, reject) {
	resolve('This is an example')
})

promise.then(function(v) {
	console.log(v)
})

// This is an example
```


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

### **Promise实现**

- [x] Promise构造函数基本结构
- [x] Promise原型方法:then
- [x] Promise原型方法:catch

### 问题探讨
then方法的callbakc为什么要设计成异步调用？

答：Promise 的机制就是 then 回调函数必须异步执行。为什么？因为这样保障了代码执行顺序的一致性。

先看一个场景：
```js
promise.then(function() { 
  if (trueOrFalse) { 
    // 同步执行 
    foo(); 
  } else { 
    // 异步执行 (如：使用第三方库)
    setTimeout(function() { 
        foo(); 
    }) 
  } 
}); 

bar();
```
如果 promise then 回调是同步执行的，请问 foo() 和 bar() 函数谁先执行?

答案是，如果 trueOrFalse 为 true 则 foo() 先执行，bar() 后执行；否则 bar() 先执行，foo() 后执行。在大部分情况下，你没法预料到 trueOrFalse 的值，这也就意味着，你不能确定这段代码真正的执行顺序，这可能会导致一些难以想到的 bug。

如果 promise then 回调是异步执行的，请问 foo() 和 bar() 函数谁先执行?
答案一目了然，bar() 先执行，foo() 后执行。

所以为了保证代码执行顺序的一致性， then 回调必须保证是异步的。

除此之外，Promise 的设计还是为了解决以下情形导致的不确定性：
- Call the callback too early
- Call the callback too late (or never)
- Call the callback too few or too many times
- Fail to pass along any necessary environment/parameters
- Swallow any errors/exceptions that may happen

更多关于该问题的探讨可以阅读：https://www.zhihu.com/question/57071244
## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fsingcl%2Fpromise.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fsingcl%2Fpromise?ref=badge_large)