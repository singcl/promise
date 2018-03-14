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

/**
 * ***************************************************************************************************************
 * STEP: 4
 * Promise对象有一个then方法，用来注册在这个Promise状态确定后的回调，很明显，then方法需要写在原型链上.
 * then方法会返回一个Promise，关于这一点，Promise/A+标准并没有要求返回的这个Promise是一个新的对象，
 * 但在Promise/A标准中，明确规定了then要返回一个新的对象，目前的Promise实现中then几乎都是返回一个新的Promise([详情](https://promisesaplus.com/differences-from-promises-a#point-5))对象，
 * 所以在我们的实现中，也让then返回一个新的Promise对象。
 *
 * 关于这一点，我认为标准中是有一点矛盾的：
 *
 * 标准中说，如果promise2 = promise1.then(onResolved, onRejected)里的onResolved/onRejected返回一个Promise，
 * 则promise2直接取这个Promise的状态和值为己用，但考虑如下代码：
 * promise2 = promise1.then(function foo(value) {
      return Promise.reject(3)
  })
 * 此处如果foo运行了，则promise1的状态必然已经确定且为resolved，如果then返回了this（即promise2 === promise1），
 * 说明promise2和promise1是同一个对象，而此时promise1/2的状态已经确定，没有办法再取Promise.reject(3)的状态和结果为己用，
 * 因为Promise的状态确定后就不可再转换为其它状态。
 *
 * 另外每个Promise对象都可以在其上多次调用then方法，而每次调用then返回的Promise的状态取决于那一次调用then时传入参数的返回值，
 * 所以then不能返回this，因为then每次返回的Promise的结果都有可能不同。
 * ================================================================================================================================
 * then方法
 * // then方法接收两个参数，onResolved，onRejected，分别为Promise成功或失败后的回调
  Promise.prototype.then = function(onResolved, onRejected) {
    var self = this
    var promise2

    // 根据标准，如果then的参数不是function，则我们需要忽略它，此处以如下方式处理
    onResolved = typeof onResolved === 'function' ? onResolved : function(v) {}
    onRejected = typeof onRejected === 'function' ? onRejected : function(r) {}

    if (self.status === 'resolved') {
      return promise2 = new Promise(function(resolve, reject) {

      })
    }

    if (self.status === 'rejected') {
      return promise2 = new Promise(function(resolve, reject) {

      })
    }

    if (self.status === 'pending') {
      return promise2 = new Promise(function(resolve, reject) {

      })
    }
  }
 * Promise总共有三种可能的状态，我们分三个if块来处理，在里面分别都返回一个new Promise。
 * ================================================================================================
 * 根据标准，我们知道，对于如下代码，promise2的值取决于then里面函数的返回值：
   * promise2 = promise1.then(function(value) {
    return 4
  }, function(reason) {
    throw new Error('sth went wrong')
  })
 * 如果promise1被resolve了，promise2的将被4 resolve，
 * 如果promise1被reject了，promise2将被new Error('sth went wrong') reject，
 * 更多复杂的情况不再详述。
 * ==============================================================================================
 * 所以，我们需要在then里面执行onResolved或者onRejected，
 * 并根据返回值(标准中记为x)来确定promise2的结果，并且，如果onResolved/onRejected返回的是一个Promise，promise2将直接取这个Promise的结果：
 * ============================================================================================
 * Promise.prototype.then = function(onResolved, onRejected) {
  var self = this
  var promise2

  // 根据标准，如果then的参数不是function，则我们需要忽略它，此处以如下方式处理
  onResolved = typeof onResolved === 'function' ? onResolved : function(value) {}
  onRejected = typeof onRejected === 'function' ? onRejected : function(reason) {}

  if (self.status === 'resolved') {
    // 如果promise1(此处即为this/self)的状态已经确定并且是resolved，我们调用onResolved
    // 因为考虑到有可能throw，所以我们将其包在try/catch块里
    return promise2 = new Promise(function(resolve, reject) {
      try {
        var x = onResolved(self.data)
        if (x instanceof Promise) { // 如果onResolved的返回值是一个Promise对象，直接取它的结果做为promise2的结果
          x.then(resolve, reject)
        }
        resolve(x) // 否则，以它的返回值做为promise2的结果
      } catch (e) {
        reject(e) // 如果出错，以捕获到的错误做为promise2的结果
      }
    })
  }

  // 此处与前一个if块的逻辑几乎相同，区别在于所调用的是onRejected函数，就不再做过多解释
  if (self.status === 'rejected') {
    return promise2 = new Promise(function(resolve, reject) {
      try {
        var x = onRejected(self.data)
        if (x instanceof Promise) {
          x.then(resolve, reject)
        }
      } catch (e) {
        reject(e)
      }
    })
  }

  if (self.status === 'pending') {
  // 如果当前的Promise还处于pending状态，我们并不能确定调用onResolved还是onRejected，
  // 只能等到Promise的状态确定后，才能确实如何处理。
  // 所以我们需要把我们的**两种情况**的处理逻辑做为callback放入promise1(此处即this/self)的回调数组里
  // 逻辑本身跟第一个if块内的几乎一致，此处不做过多解释
    return promise2 = new Promise(function(resolve, reject) {
      self.onResolvedCallback.push(function(value) {
        try {
          var x = onResolved(self.data)
          if (x instanceof Promise) {
            x.then(resolve, reject)
          }
        } catch (e) {
          reject(e)
        }
      })

      self.onRejectedCallback.push(function(reason) {
        try {
          var x = onRejected(self.data)
          if (x instanceof Promise) {
            x.then(resolve, reject)
          }
        } catch (e) {
          reject(e)
        }
      })
    })
  }
}

// 为了下文方便，我们顺便实现一个catch方法
Promise.prototype.catch = function(onRejected) {
  return this.then(null, onRejected)
}
 *===================================================================================
 *至此，我们基本实现了Promise标准中所涉及到的内容，但还有几个问题：
 *1. 不同的Promise实现之间需要无缝的可交互，即Q的Promise，ES6的Promise，和我们实现的Promise之间以及其它的Promise实现，应该并且是有必要无缝相互调用的，比如：
 * // 此处用MyPromise来代表我们实现的Promise
  new MyPromise(function(resolve, reject) { // 我们实现的Promise
    setTimeout(function() {
      resolve(42)
    }, 2000)
  }).then(function() {
    return new Promise.reject(2) // ES6的Promise
  }).then(function() {
    return Q.all([ // Q的Promise
      new MyPromise(resolve=>resolve(8)), // 我们实现的Promise
      new Promise.resolve(9), // ES6的Promise
      Q.resolve(9) // Q的Promise
    ])
  })
 * 我们前面实现的代码并没有处理这样的逻辑，我们只判断了onResolved/onRejected的返回值是否为我们实现的Promise的实例，
 * 并没有做任何其它的判断，所以上面这样的代码目前是没有办法在我们的Promise里正确运行的。
 *======================================================================================
 *2. 下面这样的代码目前也是没办法处理的：
 *new Promise(resolve => resolve(8))
  .then()
  .then()
  .then(function foo(value) {
    alert(value)
  })
 * 正确的行为应该是alert出8，而如果拿我们的Promise，运行上述代码，将会alert出undefined。
 * 这种行为称为穿透，即8这个值会穿透两个then(说Promise更为准确)到达最后一个then里的foo函数里，成为它的实参，最终将会alert出8。
 *=======================================================================================
 */

/**
 * *****************************************************************************************
 * STEP: 5
 * 下面我们首先处理简单的情况，值的穿透
 * Promise值的穿透
 * 通过观察，会发现我们希望下面这段代码
 * new Promise(resolve=>resolve(8))
    .then()
    .catch()
    .then(function(value) {
      alert(value)
    })
  *跟下面这段代码的行为是一样的
  *new Promise(resolve=>resolve(8))
  .then(function(value){
    return value
  })
  .catch(function(reason){
    throw reason
  })
  .then(function(value) {
    alert(value)
  })
 * 所以如果想要把then的实参留空且让值可以穿透到后面，意味着then的两个参数的默认值分别为function(value) {return value}，function(reason) {throw reason}。
 * 所以我们只需要把then里判断onResolved和onRejected的部分改成如下即可：
 * onResolved = typeof onResolved === 'function' ? onResolved : function(value) {return value}
 * onRejected = typeof onRejected === 'function' ? onRejected : function(reason) {throw reason}
 * 于是Promise神奇的值的穿透也没有那么黑魔法，只不过是then默认参数就是把值往后传或者抛
 * ==========================================================================================
 */

/**
 * *****************************************************************************************************************
 * STEP: 6
 * 不同Promise的交互
 * 关于不同Promise间的交互，其实标准里是有[说明](https://promisesaplus.com/#point-46)的，其中详细指定了如何通过then的实参返回的值来决定promise2的状态，我们只需要按照标准把标准的内容转成代码即可。
 * 这里简单解释一下标准：
 */
