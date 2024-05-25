# 手写 Promise

[从一道让我失眠的 Promise 面试题开始，深入分析 Promise 实现细节 - 掘金 (juejin.cn)](https://juejin.cn/post/6945319439772434469)

## Promise 介绍

Promise 是 ES6 新增的语法，解决了回调地狱的问题。

- 可以把 Promise 看成一个状态机。初始是 pending 状态，可以通过函数 resolve 和 reject ，将状态转变为 resolved 或者 rejected 状态，状态一旦改变就不能再次变化。
- then 函数会返回一个 Promise 实例，并且该返回值是一个新的实例而不是之前的实例。因为 Promise 规范规定除了 pending 状态，其他状态是不可以改变的，如果返回的是一个相同实例的话，多个 then 调用就失去意义了。 对于 then 来说，本质上可以把它看成是 flatMap

## Promise 用法

```js
new Promise((resolve, reject) => {
	// 异步成功执行resolve，否则执行reject
}).then((res) => {
	// resolve触发第一个回调函数执行
}, (err) => {
	// reject触发第二个回调函数执行
}).then(res => {
// 需要保证then方法返回的依然是promise
// 这样才能实现链式调用
}).catch(reason => {
});
// 等待所有的promise都成功执行then，
// 反之只要有一个失败就会执行catch
Promise.all([promise1, ...]).then();
```

## Promise/A+ 规范

在编写 Promise 之前，我们必须了解 Promise/A+ 规范。由于内容较长，下面我总结了几点，更详细的内容可以查阅 [Promise/A+ 规范](https://promisesaplus.com/)。

Promise 是一个对象或者函数，对外提供了一个 then 函数，内部拥有 3 个状态。

### then 函数

then 函数接收两个函数作为可选参数：

```js
promise.then(onFulfilled, onRejected);
```

同时遵循下面几个规则：

- 如果可选参数不为函数时应该被忽略；

- 两个函数都应该是异步执行的，即放入事件队列等待下一轮 tick，而非立即执行；

- 当调用 onFulfilled 函数时，会将当前 Promise 的值作为参数传入；

- 当调用 onRejected 函数时，会将当前 Promise 的失败原因作为参数传入；

- then 函数的返回值为 Promise。

### Promise 状态

Promise 的 3 个状态分别为 pending、fulfilled 和 rejected。

- pending：（默认状态）“等待”状态，可以转移到 fulfilled 或者 rejected 状态

- fulfilled：“执行”（或“履行”）状态，是 Promise 的最终态，表示执行成功，该状态下不可再改变。

- rejected：“拒绝”状态，是 Promise 的最终态，表示执行失败，该状态不可再改变。

executor 执行器调用 reject 与 resolve 两个方法：

- promise 有一个 value 保存成功状态的值，有一个 reason 保存失败状态的值，可以是 undefined/thenable/promise。
- promise 只能从 pending 到 rejected, 或者从 pending 到 fulfilled，状态一旦确认，就不会再改变。

then 接收两个参数，分别是成功的回调 onFulfilled,失败的回调 onRejected

- promise 必须有一个 then 方法，then 接收两个参数，分别是 promise 成功的回调 onFulfilled, 和 promise 失败的回调 onRejected。
- 如果 then 中抛出了异常，那么就会把这个异常作为参数，传递给下一个 then 的失败的回调 onRejected。

### Promise 解决过程

Promise 解决过程是一个抽象的操作，即接收一个 promise 和一个值 x，目的就是对 Promise 形式的执行结果进行统一处理。需要考虑以下 4 种情况。

- 情况 1： x 等于 promise

- 抛出一个 TypeError 错误，拒绝 promise。
- 情况 2：x 为 Promise 的实例
- 如果 x 处于等待状态，那么 promise 继续等待至 x 执行或拒绝，否则根据 x 的状态执行/拒绝 promise。
- 情况 3：x 为对象或函数
- 该情况的核心是取出 x.then 并调用，在调用的时候将 this 指向 x。将 then 回调函数中得到结果 y 传入新的 Promise 解决过程中，形成一个递归调用。其中，如果执行报错，则以对应的错误为原因拒绝 promise。
- 这一步是处理拥有 then() 函数的对象或函数，这类对象或函数我们称之为“thenable”。注意，它只是拥有 then() 函数，并不是 Promise 实例。
- 情况 4：如果 x 不为对象或函数
- 以 x 作为值，执行 promise。

## Promise 实现

下面我们就根据规范来逐步实现一个 Promise。

### 实现 Promise() 函数及状态

由于 Promise 只有 3 个 状态，这里我们可以先创建 3 个“常量”来消除魔术字符串：

```js
var PENDING = "pending";
var FULFILLED = "fulfilled";
var REJECTED = "rejected";
```

由于 Promise 可以被实例化，所以可以定义成类或函数，这里为了增加难度，先考虑在 ES5 环境下实现，所以写成构造函数的形式。

使用过 Promise 的人肯定知道，在创建 Promise 的时候会传入一个回调函数，该回调函数会接收两个参数，分别用来执行或拒绝当前 Promise。同时考虑到 Promise 在执行时可能会有返回值，在拒绝时会给出拒绝原因，我们分别用 value 和 reason 两个变量来表示。具体代码如下：

```js
function Promise(execute) {
	var self = this;
	self.state = PENDING;
	function resolve(value) {
		if (self.state === PENDING) {
			self.state = FULFILLED;
			self.value = value;
		}
	}
	function reject(reason) {
		if (self.state === PENDING) {
			self.state = REJECTED;
			self.reason = reason;
		}
	}
	try {
		execute(resolve, reject);
	} catch (e) {
		reject(e);
	}
}
```

Promise 是单次执行的，所以需要判断状态为 PENDING 的时候再执行函数 resolve() 或函数 reject() 。同时 Promise 的内部异常不能直接抛出，所以要进行异常捕获。

#### 实现 2

```js
// promise.js
class Promise {
	// 传一个异步函数进来
	constructor(excutorCallBack) {
		this.status = "pending";
		this.value = undefined;
		this.fulfillAry = [];
		this.rejectedAry = [];
		// =>执行Excutor
		let resolveFn = (result) => {
			if (this.status !== "pending") return;
			let timer = setTimeout(() => {
				this.status = "fulfilled";
				this.value = result;
				this.fulfillAry.forEach((item) => item(this.value));
			}, 0);
		};
		let rejectFn = (reason) => {
			if (this.status !== "pending") return;
			let timer = setTimeout(() => {
				this.status = "rejected";
				this.value = reason;
				this.rejectedAry.forEach((item) => item(this.value));
			});
		};
		try {
			// 执行这个异步函数
			excutorCallBack(resolveFn, rejectFn);
		} catch (err) {
			// =>有异常信息按照rejected状态处理
			rejectFn(err);
		}
	}
	then(fulfilledCallBack, rejectedCallBack) {
		// resolve和reject函数其实一个作为微任务
		// 因此他们不是立即执行，而是等then调用完成后执行
		this.fulfillAry.push(fulfilledCallBack);
		this.rejectedAry.push(rejectedCallBack);
		// 一顿push过后他们被执行
	}
}
module.exports = Promise;
```

测试如下：

```js
let Promise = require("./promise");
let p1 = new Promise((resolve, reject) => {
	setTimeout(() => {
		Math.random() < 0.5 ? resolve(100) : reject(-100);
	}, 1000);
}).then(
	(res) => {
		console.log(res);
	},
	(err) => {
		console.log(err);
	}
);
```

### 完成链式 then() 效果函数

每个 Promise 实例都有一个 then() 函数，该函数会访问 Promise 内部的值或拒绝原因，所以通过函数原型 prototype 来实现。then() 函数接收两个回调函数作为参数，于是写成下面的形式：

```js
Promise.prototype.then = function (onFulfilled, onRejected) {};
```

根据第 1 条原则，如果可选参数不为函数时应该被忽略，所以在函数 then() 内部加上对参数的判断：

```js
onFulfilled =
	typeof onFulfilled === "function"
		? onFulfilled
		: function (x) {
				return x;
		  };
onRejected =
	typeof onRejected === "function"
		? onRejected
		: function (e) {
				throw e;
		  };
```

根据第 2 条规则，传入的回调函数是异步执行的。要模拟异步，可以通过 setTimeout 来延迟执行。再根据第 3 条和第 4 条规则，应根据 Promise 的状态来执行对应的回调，执行状态下调用 onFulfilled() 函数，拒绝状态下调用 onRejected() 函数。

```js
var self = this;
switch (self.state) {
	case FULFILLED:
		setTimeout(function () {
			onFulfilled(self.value);
		});
		break;
	case REJECTED:
		setTimeout(function () {
			onRejected(self.reason);
		});
		break;
	case PENDING:
		// todo
		break;
}
```

等待状态下就有些麻烦了，需要等到 Promise 状态转变时才能调用。

按照常规处理方式，可以建立一个监听，监听 Promise 的状态值改变。由于浏览器环境和 Node.js 环境的事件监听不一样，考虑兼容性，这种实现会比较复杂。

换个角度来看，在不考虑异常的情况下 Promise 的状态改变只依赖于构造函数中的 resolve() 函数和 reject() 函数执行。所以可考虑将 onFulfilled() 和 onRejected() 函数先保存到 Promise 属性 onFulfilledFn 和 onRejectedFn 中，等到状态改变时再调用。

```js
case PENDING:
  self.onFulfilledFn = function () {
    onFulfilled(self.value);
  }
  self.onRejectedFn = function () {
    onRejected(self.reason);
  }
  break;
```

最后看第 5 条规则，then() 被调用时应该返回一个新的 Promise，所以在上面的 3 种状态的处理逻辑中，都应该创建并返回一个 Promise 实例。以执行状态为例，可以改成下面的样子。

```js
case FULFILLED:
  promise = new Promise(function (resolve, reject) {
    setTimeout(function () {
      try {
        onFulfilled(self.value);
      } catch (e) {
        reject(e)
      }
    })
  });
  break;
```

同时，它带来的另一个效果是支持链式调用。在链式调用的情况下，如果 Promise 实例处于等待状态，那么需要保存多个 resolve() 或 reject() 函数，所以 onFulfilledFn 和 onRejectedFn 应该改成数组。

```js
case PENDING:
  promise = new Promise(function (resolve, reject) {
    self.onFulfilledFn.push(function () {
      try {
        onFulfilled(self.value);
      } catch (e) {
        reject(e)
      }
    });
    self.onRejectedFn.push(function () {
      try {
        onRejected(self.reason);
      } catch (e) {
        reject(e)
      }
    })
  });
  break;
```

对应的，Promise 构造函数中应该初始化属性 onFulfilledFn 和 onRejectedFn 为数组，同时 resolve() 和 reject() 函数在改变状态时应该调用这个数组中的函数，并且这个调用过程应该是异步的。

```js
function Promise(execute) {
  ...
  self.onFulfilledFn = [];
  self.onRejectedFn = [];
  ...
  function resolve(value) {
    setTimeout(function() {
      ...
      self.onFulfilledFn.forEach(function (f) {
        f(self.value)
      })
    })
  }
  function reject(reason) {
    setTimeout(function() {
      ...
      self.onRejectedFn.forEach(function (f) {
        f(self.reason)
      })
    })
  }
}
```

#### 实现 2

最大的难点在于链式调用的实现，具体来说就是 then 方法的实现。

```js
// then传进两个函数
then(fulfilledCallBack, rejectedCallBack) {
	// 保证两者为函数
	typeof fulfilledCallBack !== "function"
		? (fulfilledCallBack = (result) => result)
		: null;
	typeof rejectedCallBack !== "function"
		? (rejectedCallBack = (reason) => {
				throw new Error(reason instanceof Error ? reason.message : reason);
		  })
		: null;
	// 返回新的Promise对象，后面称它为“新Promise”
	return new Promise((resolve, reject) => {
		// 注意这个this指向目前的Promise对象，而不是新的Promise
		// 再强调一遍,很重要：
		// 目前的Promise(不是这里return的新Promise)的resolve和reject函数其实一个作为微任务
		// 因此他们不是立即执行，而是等then调用完成后执行
		this.fulfillAry.push(() => {
			try {
				// 把then里面的方法拿过来执行
				// 执行的目的已经达到
				let x = fulfilledCallBack(this.value);
				// 下面执行之后的下一步，也就是记录执行的状态，决定新Promise如何表现
				// 如果返回值x是一个Promise对象，就执行then操作
				// 如果不是Promise,直接调用新Promise的resolve函数,
				// 新Promise的fulfilAry现在为空,在新Promise的then操作后.新Promise的resolve执
				行;
				x instanceof Promise ? x.then(resolve, reject) : resolve(x);
			} catch (err) {
				reject(err);
			}
		});
		// 以下同理
		this.rejectedAry.push(() => {
			try {
				let x = this.rejectedCallBack(this.value);
				x instanceof Promise ? x.then(resolve, reject) : resolve(x);
			} catch (err) {
				reject(err);
			}
		});
	});
}
```

测试用例：

```js
let p1 = new Promise((resolve, reject) => {
	setTimeout(() => {
		Math.random() < 0.5 ? resolve(100) : reject(-100);
	}, 1000);
});
let p2 = p1.then((result) => {
	// 执行then返回的是一个新的Promise
	return result + 100;
});
let p3 = p2.then(
	(result) => {
		console.log(result);
	},
	(reason) => {
		console.log(reason);
	}
);
```

简单画图来模拟一下链式调用的内部流程：

![image-20240319000340162](./手写Promise.assets/image-20240319000340162.png)

有了 then 方法，catch 自然而然调用即可：

```js
catch(rejectedCallBack) {
	return this.then(null, rejectedCallBack);
}
```

### Promise.resolve() 函数

前面提到解决过程函数有两个参数及 3 种情况，先来考虑第 1 种情况，promise 与 x 相等，应该直接抛出 TypeError 错误：

```js
function resolvePromise(promise, x) {
	if (promise === x) {
		return reject(new TypeError("x 不能与 promise 相等"));
	}
}
```

情况 2，x 为 Promise 的实例，应该尝试让 promise 接受 x 的状态，怎么接受呢？

直接改变 promise 状态肯定是不可取的，首先状态信息属于内部变量，其次也无法调用属性 onResolvedFn 和 onFulfilledFn 中的待执行函数。所以必须要通过调用 promise 在构造时的函数 resolve() 和 reject() 来改变。

如果 x 处于等待状态，那么 promise 继续保持等待状态，等待解决过程函数 resolvePromise() 执行，否则应该用相同的值执行或拒绝 promise。我们无法从外部拒绝或执行一个 Promise 实例，只能通过调用构造函数传入的 resolve() 和 reject() 函数来实现。所以还需要把这两个函数作为参数传递到 resolvePromise 函数中。

在函数 resolvePromise() 内部加上情况 2 的判断，代码如下：

```js
function resolvePromise(promise, x, resolve, reject) {
  ...
  if (x instanceof Promise) {
    if (x.state === FULFILLED) {
      resolve(x.value)
    } else if (x.state === REJECTED) {
      reject(x.reason)
    } else {
      x.then(function (y) {
        resolvePromise(promise, y, resolve, reject)
      }, reject)
    }
  }
}
```

再来实现情况 3，将 x.then 取出然后执行，并将执行结果放入解决过程函数 resolvePromise() 中。 考虑到 x 可能只是一个 thenable 而非真正的 Promise，所以在调用 then() 函数的时候要设置一个变量 excuted 避免重复调用。同时记得在执行时添加异常捕获并及时拒绝当前 promise。

```js
if (x !== null && (typeof x === "object" || typeof x === "function")) {
	var executed;
	try {
		var then = x.then;
		if (typeof then === "function") {
			then.call(
				x,
				function (y) {
					if (executed) return;
					executed = true;
					return resolvePromise(promise, y, resolve, reject);
				},
				function (e) {
					if (executed) return;
					executed = true;
					reject(e);
				}
			);
		} else {
			resolve(x);
		}
	} catch (e) {
		if (executed) return;
		executed = true;
		reject(e);
	}
}
```

情况 4 就很简单了，直接把 x 作为值执行。

```js
resolve(x);
```

#### 实现 2

```js
static resolve (value) {
    if (value instanceof Promise) return value
    return new Promise(resolve => resolve(value))
}
```

#### 实现3

实现 resolve 静态方法有三个要点：

- 传参为一个 Promise, 则直接返回它。
- 传参为一个 thenable 对象，返回的 Promise 会跟随这个对象， 采用它的最终状态 作为 自己的状态 。
- 其他情况，直接返回以该值为成功状态的 promise 对象。

具体实现如下：

```js
Promise.resolve = (param) => {
	if (param instanceof Promise) return param;
	return new Promise((resolve, reject) => {
		if (param && param.then && typeof param.then === "function") {
			// param 状态变为成功会调用resolve，将新 Promise 的状态变为成功，反之亦然
			param.then(resolve, reject);
		} else {
			resolve(param);
		}
	});
};
```





### Promise.reject()

#### 实现 2

```js
static reject (value) {
	return new Promise((resolve, reject) => reject(value))
}
```

#### 实现3

Promise.reject 中传入的参数会作为一个 reason 原封不动地往下传, 实现如下：

```js
Promise.reject = function (reason) {
	return new Promise((resolve, reject) => {
		reject(reason);
	});
};
```



### 实现 Promise.prototype.finally

无论当前 Promise 是成功还是失败，调用 finally 之后都会执行 finally 中传入的函数，并且将值原封不动的往下传。

```js
Promise.prototype.finally = function (callback) {
	this.then(
		(value) => {
			return Promise.resolve(callback()).then(() => {
				return value;
			});
		},
		(error) => {
			return Promise.resolve(callback()).then(() => {
				throw error;
			});
		}
	);
};
```



### Promise 测试

编写测试代码永远是一个好习惯，为了验证编写的 Promise 正确性，引用一个专门用来测试 Promise 规范性的模块 [promises-aplus-tests](https://github.com/promises-aplus/promises-tests)，该模块内置了数百个测试案例，支持命令行一键测试。只是在导出模块的时候需要遵循 CommonJS 规范，并且按照要求导出对应的函数。最终代码地址：[course/plus2 at master · yalishizhude/course (github.com)](https://github.com/yalishizhude/course/tree/master/plus2)

### async/await

async 是 ES2017 标准推出的用于处理异步操作的关键字，从本质上来说，它就是 Generator 函数的语法糖。

#### 什么是 Generator 函数？

Generator 函数是 ES6 提出的除 Promise 之外的另一种异步解决方案，不同于常见的异步回调，它的用法有些“奇怪”。这里我们只简单介绍一下它的主要用法。

当声明一个 Generator 函数时，需要在 function 关键字与函数名之间加上一个星号，像下面这样：

```js
function* fn() {
  ...
}
```

当调用 Generator 函数后，函数并不会立即执行，而是返回一个迭代器对象。

- 函数体内部使用 yield 表达式，定义不同的内部状态。

- 当函数体外部调用迭代器的 next() 函数时，函数会执行到下一个 yield 表达式的位置，并返回一个对象，该对象包含属性 value 和 done，value 是调用 next() 函数时传入的参数，done 为布尔值表示是否执行完成。

下面是一个将异步回调函数改写成 Generator 函数的示例代码：

```js
function asyncFn(cb) {
	setTimeout(cb, 1000, 1);
}
function* fn() {
	var result = yield asyncFn(function (data) {
		it.next(data);
	});
	console.log(result); // 1
}
var it = fn();
it.next();
```

下面讲讲这段代码的执行逻辑。

- asyncFn() 是一个自定义的异步回调函数，1 秒后返回数值 1。

- 先调用 Generator 函数得到迭代器 it，但此时函数并没有执行，需要执行迭代器的 next() 函数才能调用函数 fn() 。

- Generator 函数 fn() 内部调用异步函数 asyncFn 时使用了 yield 关键字，代表此处暂停执行，等到异步函数 asyncFn 执行完成后再执行后面的代码。

- 1 秒后，匿名回调函数内部得到的返回值 1，通过 it.next() 函数返回这个值，并告诉迭代器继续执行后面的 console.log。

#### async/await 原理

虽然说 Generator 函数号称是解决异步回调问题，但却带来了一些麻烦，比如函数外部无法捕获异常，比如多个 yield 会导致调试困难。所以相较之下 Promise 是更优秀的异步解决方案。

async/await 做的事情就是将 Generator 函数转换成 Promise。下面代码描述的是 async 的实现逻辑：

```js
function generator2promise(generatorFn) {
	return function () {
		var gen = generatorFn.apply(this, arguments);
		return new Promise(function (resolve, reject) {
			function step(key, arg) {
				try {
					var info = gen[key](arg);
					var value = info.value;
				} catch (error) {
					reject(error);
					return;
				}
				if (info.done) {
					resolve(value);
				} else {
					return Promise.resolve(value).then(
						function (value) {
							step("next", value);
						},
						function (err) {
							step("throw", err);
						}
					);
				}
			}
			return step("next");
		});
	};
}
```

它将 Generator 函数包装成了一个新的匿名函数，调用这个匿名函数时返回一个 Promise。在这个 Promise 内部会创建一个 step() 函数，该函数负责递归调用 Generator 函数对应的迭代器，当迭代器执行完成时执行当前的 Promise，失败时则拒绝 Promise。

### Promise.all()

对于 all 方法而言，需要完成下面的核心功能：

- 1）传入参数为一个空的可迭代对象，则直接进行 resolve。
- 2）如果参数中有一个 promise 失败，那么 Promise.all 返回的 promise 对象失败。
- 3）在任何情况下，Promise.all 返回的 promise 的完成状态的结果都是一个数组

具体实现如下：

```javascript
Promise.all = function (promises) {
	return new Promise((resolve, reject) => {
		let result = [];
		let index = 0;
		let len = promises.length;
		if (len === 0) {
			resolve(result);
			return;
		}
		for (let i = 0; i < len; i++) {
			// 为什么不直接 promise[i].then, 因为promise[i]可能不是一个promise
			Promise.resolve(promise[i])
				.then((data) => {
					result[i] = data;
					index++;
					if (index === len) resolve(result);
				})
				.catch((err) => {
					reject(err);
				});
		}
	});
};
```



#### 实现 2

```js
// 为类的静态方法，而不是在原型上
static all(promiseAry = []) {
    let index = 0,
    result = [];
    return new Promise((resolve, reject) => {
        for(let i = 0; i < promiseAry.length; i++){
            promiseAry[i].then(val => {
                index++;
                result[i] = val;
                if( index === promiseAry.length){
                	resolve(result)
                }
            }, reject);
        }
    })
}
```

### 实现 Promise.race

race 的实现相比之下就简单一些，只要有一个 promise 执行完，直接 resolve 并停止执行。

```js
Promise.race = function (promises) {
	return new Promise((resolve, reject) => {
		let len = promises.length;
		if (len === 0) return;
		for (let i = 0; i < len; i++) {
			Promise.resolve(promise[i])
				.then((data) => {
					resolve(data);
					return;
				})
				.catch((err) => {
					reject(err);
					return;
				});
		}
	});
};
```



### 总结

本课时通过代码实例深入分析了 Promise/A+ 规范以及 async/await 的实现原理。对于手写 Promise 的过程，重点不在于实现结果，而在于实现过程，即先理解清楚规范，然后根据规范一步一步地去实现和优化。

对于 async/await 语法糖，结合 Generator 函数，理解其封装原理即可。

最后布置一道练习题：学完本课时内容后，试着自己动手写一个 Promise，看看能否通过测试用例。

## Promise 如何实现链式调用？

### 简易版实现

首先写出第一版的代码：

```js
// 定义三种状态
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function MyPromise(executor) {
	let self = this; // 缓存当前promise实例
	self.value = null;
	self.error = null;
	self.status = PENDING;
	self.onFulfilled = null; //成功的回调函数
	self.onRejected = null; //失败的回调函数
	const resolve = (value) => {
		if (self.status !== PENDING) return;
		setTimeout(() => {
			self.status = FULFILLED;
			self.value = value;
			self.onFulfilled(self.value); //resolve时执行成功回调
		});
	};
	const reject = (error) => {
		if (self.status !== PENDING) return;
		setTimeout(() => {
			self.status = REJECTED;
			self.error = error;
			self.onRejected(self.error); //resolve时执行成功回调
		});
	};
	executor(resolve, reject);
}
MyPromise.prototype.then = function (onFulfilled, onRejected) {
	if (this.status === PENDING) {
		this.onFulfilled = onFulfilled;
		this.onRejected = onRejected;
	} else if (this.status === FULFILLED) {
		//如果状态是fulfilled，直接执行成功回调，并将成功值传入
		onFulfilled(this.value);
	} else {
		//如果状态是rejected，直接执行失败回调，并将失败原因传入
		onRejected(this.error);
	}
	return this;
};
```

可以看到，Promise 的本质是一个有限状态机，存在三种状态：

PENDING(等待)
FULFILLED(成功)
REJECTED(失败)

状态改变规则如下图：

![image-20240318221458502](./手写Promise.assets/image-20240318221458502.png)

对于 Promise 而言，状态的改变 不可逆 ，即由等待态变为其他的状态后，就无法再改变了。

不过，回到目前这一版的 Promise, 还是存在一些问题的。

### 设置回调数组

首先只能执行一个回调函数，对于多个回调的绑定就无能为力，比如下面这样：

```js
let promise1 = new MyPromise((resolve, reject) => {
	fs.readFile("./001.txt", (err, data) => {
		if (!err) {
			resolve(data);
		} else {
			reject(err);
		}
	});
});
let x1 = promise1.then((data) => {
	console.log("第一次展示", data.toString());
});
let x2 = promise1.then((data) => {
	console.log("第二次展示", data.toString());
});
let x3 = promise1.then((data) => {
	console.log("第三次展示", data.toString());
});
```

这里绑定了三个回调，想要在 resolve() 之后一起执行，那怎么办呢？

需要将 onFulfilled 和 onRejected 改为数组，调用 resolve 时将其中的方法拿出来一一执行即可。

```js
self.onFulfilledCallbacks = [];
self.onRejectedCallbacks = [];
MyPromise.prototype.then = function (onFulfilled, onRejected) {
	if (this.status === PENDING) {
		this.onFulfilledCallbacks.push(onFulfilled);
		this.onRejectedCallbacks.push(onRejected);
	} else if (this.status === FULFILLED) {
		onFulfilled(this.value);
	} else {
		onRejected(this.error);
	}
	return this;
};
```

接下来将 resolve 和 reject 方法中执行回调的部分进行修改：

```js
// resolve 中
self.onFulfilledCallbacks.forEach((callback) => callback(self.value));
//reject 中
self.onRejectedCallbacks.forEach((callback) => callback(self.error));
```

### 链式调用完成

我们采用目前的代码来进行测试：

```js
let fs = require("fs");
let readFilePromise = (filename) => {
	return new MyPromise((resolve, reject) => {
		fs.readFile(filename, (err, data) => {
			if (!err) {
				resolve(data);
			} else {
				reject(err);
			}
		});
	});
};
readFilePromise("./001.txt")
	.then((data) => {
		console.log(data.toString());
		return readFilePromise("./002.txt");
	})
	.then((data) => {
		console.log(data.toString());
	});
// 001.txt的内容
// 001.txt的内容
```

咦？怎么打印了两个 001 ，第二次不是读的 002 文件吗？

问题出在这里：

```js
MyPromise.prototype.then = function (onFulfilled, onRejected) {
	// ...
	return this;
};
```

这么写每次返回的都是第一个 Promise。then 函数当中返回的第二个 Promise 直接被无视了！

说明 then 当中的实现还需要改进, 我们现在需要对 then 中返回值重视起来。

```js
MyPromise.prototype.then = function (onFulfilled, onRejected) {
	let bridgePromise;
	let self = this;
	if (self.status === PENDING) {
		return (bridgePromise = new MyPromise((resolve, reject) => {
			self.onFulfilledCallbacks.push((value) => {
				try {
					// 看到了吗？要拿到 then 中回调返回的结果。
					let x = onFulfilled(value);
					resolve(x);
				} catch (e) {
					reject(e);
				}
			});
			self.onRejectedCallbacks.push((error) => {
				try {
					let x = onRejected(error);
					resolve(x);
				} catch (e) {
					reject(e);
				}
			});
		}));
	}
	//...
};
```

假若当前状态为 PENDING，将回调数组中添加如上的函数，当 Promise 状态变化后，会遍历相应回调数组并执行回调。

但是这段程度还是存在一些问题：

- 1）首先 then 中的两个参数不传的情况并没有处理，
- 2）假如 then 中的回调执行后返回的结果(也就是上面的 x )是一个 Promise, 直接给 resolve 了，这是我们不希望看到的。

**怎么来解决这两个问题呢？**

先对参数不传的情况做判断：

```js
// 成功回调不传给它一个默认函数
onFulfilled = typeof onFulfilled === "function" ? onFulfilled : value => value;
// 对于失败回调直接抛错
onRejected = typeof onRejected === "function" ? onRejected : error => { throw
error };
```

然后对返回 Promise 的情况进行处理：

```js
function resolvePromise(bridgePromise, x, resolve, reject) {
	//如果x是一个promise
	if (x instanceof MyPromise) {
		// 拆解这个 promise ，直到返回值不为 promise 为止
		if (x.status === PENDING) {
			x.then(
				(y) => {
					resolvePromise(bridgePromise, y, resolve, reject);
				},
				(error) => {
					reject(error);
				}
			);
		} else {
			x.then(resolve, reject);
		}
	} else {
		// 非 Promise 的话直接 resolve 即可
		resolve(x);
	}
}
```

然后在 then 的方法实现中作如下修改：

```js
resolve(x) -> resolvePromise(bridgePromise, x, resolve, reject);
```

在这里大家好好体会一下拆解 Promise 的过程，其实不难理解，要强调的是其中的递归调用始终传入的 resolve 和 reject 这两个参数是什么含义，其实他们控制的是最开始传入的 bridgePromise 的状态，这一点非常重要。

紧接着，我们实现一下当 Promise 状态不为 PENDING 时的逻辑。

成功状态下调用 then：

```js
if (self.status === FULFILLED) {
	return (bridgePromise = new MyPromise((resolve, reject) => {
		try {
			// 状态变为成功，会有相应的 self.value
			let x = onFulfilled(self.value);
			// 暂时可以理解为 resolve(x)，后面具体实现中有拆解的过程
			resolvePromise(bridgePromise, x, resolve, reject);
		} catch (e) {
			reject(e);
		}
	}));
}
```

失败状态下调用 then：

```js
if (self.status === REJECTED) {
	return (bridgePromise = new MyPromise((resolve, reject) => {
		try {
			// 状态变为失败，会有相应的 self.error
			let x = onRejected(self.error);
			resolvePromise(bridgePromise, x, resolve, reject);
		} catch (e) {
			reject(e);
		}
	}));
}
```

Promise A+中规定成功和失败的回调都是微任务，由于浏览器中 JS 触碰不到底层微任务的分配，可以直接拿 setTimeout (属于宏任务的范畴) 来模拟，用 setTimeout 将需要执行的任务包裹 ，当然，上面的 resolve 实现也是同理, 大家注意一下即可，其实并不是真正的微任务。

```js
if (self.status === FULFILLED) {
	return (bridgePromise = new MyPromise((resolve, reject) => {
		setTimeout(() => {
			//...
		});
	}));
}
if (self.status === REJECTED) {
	return (bridgePromise = new MyPromise((resolve, reject) => {
		setTimeout(() => {
			//...
		});
	}));
}
```

好了，到这里, 我们基本实现了 then 方法，现在我们拿刚刚的测试代码做一下测试, 依次打印如下：

```js
(001).txt的内容;
(002).txt的内容;
```

可以看到，已经可以顺利地完成链式调用。

### 错误捕获及冒泡机制分析

现在来实现 catch 方法：

```js
Promise.prototype.catch = function (onRejected) {
	return this.then(null, onRejected);
};
```

对，就是这么几行，catch 原本就是 then 方法的语法糖。

相比于实现来讲，更重要的是理解其中错误冒泡的机制，即中途一旦发生错误，可以在最后用 catch 捕获错误。

我们回顾一下 Promise 的运作流程也不难理解，贴上一行关键的代码：

```js
// then 的实现中
onRejected = typeof onRejected === "function" ? onRejected : error => { throw
error };
```

一旦其中有一个 PENDING 状态的 Promise 出现错误后状态必然会变为失败, 然后执行 onRejected 函数，而这个 onRejected 执行又会抛错，把新的 Promise 状态变为失败，新的 Promise 状态变为失败后又会执行 onRejected......就这样一直抛下去，直到用 catch 捕获到这个错误，才停止往下抛。

这就是 Promise 的错误冒泡机制。

至此，Promise 三大法宝: 回调函数延迟绑定、回调返回值穿透 和 错误冒泡。

## ES5 构造函数实现 Promise

```js
function SxPromise(executor) {
	this.status = "pending"; // 记录状态
	this.result = undefined; // 记录执行结果
	this.cb = []; // 成功和失败的回调方法存储
	var _this = this;
	// resolve方法
	function resolve(res) {
		if (_this.status !== "pending") return;
		// console.log(_this)
		_this.status = "fulfilled";
		_this.result = res;

		_this.cb.forEach((item) => {
			item.successCB && item.successCB(_this.result);
		});
	}
	// reject方法
	function reject(res) {
		if (_this.status !== "pending") return;
		// console.log("reject")
		_this.status = "rejected";
		_this.result = res;
		_this.cb.forEach((item) => {
			item.failCB && item.failCB(_this.result);
		});
	}
	executor(resolve, reject);
}

// 实现.then方法-链式调用，解决回调地狱
SxPromise.prototype.then = function (successCB, failCB) {
	// .catch方法的实现需要的判断，如果没有成功或失败的回调参数，则返回
	if (!successCB) {
		successCB = (value) => value;
	}
	if (!failCB) {
		failCB = (error) => error;
	}

	// 成功完成、失败、进行中的状态返回
	return new SxPromise((resolve, reject) => {
		// 成功完成 状态，执行successCB成功回调函数
		if (this.status === "fulfilled") {
			var result = successCB && successCB(this.result);
			// console.log(result);

			// 如果result结果是SxPromise的实例：用于.then方法里无限返回调用：return new SxPromise()，供链式调用的下一个.then()方法使用
			if (result instanceof SxPromise) {
				result.then(
					(res) => {
						// console.log(res)
						resolve(res);
					},
					(err) => {
						// console.log(err)
						reject(err);
					}
				);
			} else {
				resolve(result);
			}
		}
		// 失败 状态，执行failCB失败回调函数
		if (this.status === "rejected") {
			var result = failCB && failCB(this.result);
			// 如果result结果是SxPromise的实例：用于.then方法里无限返回调用：return new SxPromise()，供链式调用的下一个.then()方法使用
			if (result instanceof SxPromise) {
				result.then(
					(res) => {
						// console.log(res)
						resolve(res);
					},
					(err) => {
						// console.log(err)
						reject(err);
					}
				);
			} else {
				reject(result);
			}
		}
		// 进行中 状态
		if (this.status === "pending") {
			// 收集成功和失败的回调函数
			this.cb.push({
				successCB: () => {
					var result = successCB && successCB(this.result);
					// 和上面的两个状态的原理一样
					if (result instanceof SxPromise) {
						result.then(
							(res) => {
								// console.log(res)
								resolve(res);
							},
							(err) => {
								// console.log(err)
								reject(err);
							}
						);
					} else {
						resolve(result);
					}
				},
				failCB: () => {
					var result = failCB && failCB(this.result);
					// 和上面的两个状态的原理一样
					if (result instanceof SxPromise) {
						result.then(
							(res) => {
								// console.log(res)
								resolve(res);
							},
							(err) => {
								// console.log(err)
								reject(err);
							}
						);
					} else {
						reject(result);
					}
				},
			});
		}
	});
};
// .catch方法的实现
SxPromise.prototype.catch = function (failCB) {
	this.then(undefined, failCB);
};
```

## ES6 实现

现在手写一个简陋但是功能较为完备的 Promise 就大功告成了。

```js
class Promise {
	constructor(excutorCallBack) {
		this.status = "pending";
		this.value = undefined;
		this.fulfillAry = [];
		this.rejectedAry = [];
		//=>执行Excutor
		let resolveFn = (result) => {
			if (this.status !== "pending") return;
			let timer = setTimeout(() => {
				this.status = "fulfilled";
				this.value = result;
				this.fulfillAry.forEach((item) => item(this.value));
			}, 0);
		};
		let rejectFn = (reason) => {
			if (this.status !== "pending") return;
			let timer = setTimeout(() => {
				this.status = "rejected";
				this.value = reason;
				this.rejectedAry.forEach((item) => item(this.value));
			});
		};
		try {
			excutorCallBack(resolveFn, rejectFn);
		} catch (err) {
			//=>有异常信息按照rejected状态处理
			rejectFn(err);
		}
	}
	then(fulfilledCallBack, rejectedCallBack) {
		typeof fulfilledCallBack !== "function"
			? (fulfilledCallBack = (result) => result)
			: null;
		typeof rejectedCallBack !== "function"
			? (rejectedCallBack = (reason) => {
					throw new Error(reason instanceof Error ? reason.message : reason);
			  })
			: null;
		return new Promise((resolve, reject) => {
			this.fulfillAry.push(() => {
				try {
					let x = fulfilledCallBack(this.value);
					x instanceof Promise ? x.then(resolve, reject) : resolve(x);
				} catch (err) {
					reject(err);
				}
			});
			this.rejectedAry.push(() => {
				try {
					let x = this.rejectedCallBack(this.value);
					x instanceof Promise ? x.then(resolve, reject) : resolve(x);
				} catch (err) {
					reject(err);
				}
			});
		});
	}
	catch(rejectedCallBack) {
		return this.then(null, rejectedCallBack);
	}
	static all(promiseAry = []) {
		let index = 0,
			result = [];
		return new Promise((resolve, reject) => {
			for (let i = 0; i < promiseAry.length; i++) {
				promiseAry[i].then((val) => {
					index++;
					result[i] = val;
					if (index === promiseAry.length) {
						resolve(result);
					}
				}, reject);
			}
		});
	}
	static race(promiseAry) {
		return new Promise((resolve, reject) => {
			if (promiseAry.length === 0) {
				return;
			}
			for (let i = 0; i < promiseAry.length; i++) {
				promiseAry[i].then((val) => {
					resolve(val);
					return;
				}, reject);
			}
		});
	}
	static resolve(value) {
		if (value instanceof Promise) return value;
		return new Promise((resolve) => resolve(value));
	}
	static reject(value) {
		return new Promise((resolve, reject) => reject(value));
	}
}
module.exports = Promise;
```

## class 类实现 Promise：把上述代码 使用 VS Code 的在 SxPromise 函数的快速修复 转为 ES6 的 class 类 实现

```js
class SxPromise {
	constructor(executor) {
		this.status = "pending"; // 记录状态
		this.result = undefined; // 记录执行结果
		this.cb = []; // 成功和失败的回调方法存储
		var _this = this;
		// resolve方法
		function resolve(res) {
			if (_this.status !== "pending") return;
			// console.log(_this)
			_this.status = "fulfilled";
			_this.result = res;

			_this.cb.forEach((item) => {
				item.successCB && item.successCB(_this.result);
			});
		}
		// reject方法
		function reject(res) {
			if (_this.status !== "pending") return;
			// console.log("reject")
			_this.status = "rejected";
			_this.result = res;
			_this.cb.forEach((item) => {
				item.failCB && item.failCB(_this.result);
			});
		}
		executor(resolve, reject);
	}
	// 实现.then方法-链式调用，解决回调地狱
	then(successCB, failCB) {
		// .catch方法的实现需要的判断，如果没有成功或失败的回调参数，则返回
		if (!successCB) {
			successCB = (value) => value;
		}
		if (!failCB) {
			failCB = (error) => error;
		}

		// 成功完成、失败、进行中的状态返回
		return new SxPromise((resolve, reject) => {
			// 成功完成 状态，执行successCB成功回调函数
			if (this.status === "fulfilled") {
				var result = successCB && successCB(this.result);
				// console.log(result);
				// 如果result结果是SxPromise的实例：用于.then方法里无限返回调用：return new SxPromise()，供链式调用的下一个.then()方法使用
				if (result instanceof SxPromise) {
					result.then(
						(res) => {
							// console.log(res)
							resolve(res);
						},
						(err) => {
							// console.log(err)
							reject(err);
						}
					);
				} else {
					resolve(result);
				}
			}
			// 失败 状态，执行failCB失败回调函数
			if (this.status === "rejected") {
				var result = failCB && failCB(this.result);
				// 如果result结果是SxPromise的实例：用于.then方法里无限返回调用：return new SxPromise()，供链式调用的下一个.then()方法使用
				if (result instanceof SxPromise) {
					result.then(
						(res) => {
							// console.log(res)
							resolve(res);
						},
						(err) => {
							// console.log(err)
							reject(err);
						}
					);
				} else {
					reject(result);
				}
			}
			// 进行中 状态
			if (this.status === "pending") {
				// 收集成功和失败的回调函数
				this.cb.push({
					successCB: () => {
						var result = successCB && successCB(this.result);
						// 和上面的两个状态的原理一样
						if (result instanceof SxPromise) {
							result.then(
								(res) => {
									// console.log(res)
									resolve(res);
								},
								(err) => {
									// console.log(err)
									reject(err);
								}
							);
						} else {
							resolve(result);
						}
					},
					failCB: () => {
						var result = failCB && failCB(this.result);
						// 和上面的两个状态的原理一样
						if (result instanceof SxPromise) {
							result.then(
								(res) => {
									// console.log(res)
									resolve(res);
								},
								(err) => {
									// console.log(err)
									reject(err);
								}
							);
						} else {
							reject(result);
						}
					},
				});
			}
		});
	}
	// .catch方法的实现
	catch(failCB) {
		this.then(undefined, failCB);
	}
}
```

## 实现 3

```js
// 三种状态
const PENDING = "pending";
const RESOLVED = "resolved";
const REJECTED = "rejected";
// promise 接收一个函数参数，该函数会立即执行
function MyPromise(fn) {
	let _this = this;
	_this.currentState = PENDING;
	_this.value = undefined;
	// 用于保存 then 中的回调，只有当 promise
	// 状态为 pending 时才会缓存，并且每个实例⾄多缓存一个
	_this.resolvedCallbacks = [];
	_this.rejectedCallbacks = [];
	_this.resolve = function (value) {
		if (value instanceof MyPromise) {
			// 如果 value 是个 Promise，递归执行
			return value.then(_this.resolve, _this.reject);
		}
		setTimeout(() => {
			// 异步执行，保证执行顺序
			if (_this.currentState === PENDING) {
				_this.currentState = RESOLVED;
				_this.value = value;
				_this.resolvedCallbacks.forEach((cb) => cb());
			}
		});
	};
	_this.reject = function (reason) {
		setTimeout(() => {
			// 异步执行，保证执行顺序
			if (_this.currentState === PENDING) {
				_this.currentState = REJECTED;
				_this.value = reason;
				_this.rejectedCallbacks.forEach((cb) => cb());
			}
		});
	};
	// 用于解决以下问题
	// new Promise(() => throw Error('error))
	try {
		fn(_this.resolve, _this.reject);
	} catch (e) {
		_this.reject(e);
	}
}
MyPromise.prototype.then = function (onResolved, onRejected) {
	var self = this;
	// 规范 2.2.7，then 必须返回一个新的 promise
	var promise2;
	// 规范 2.2.onResolved 和 onRejected 都为可选参数
	// 如果类型不是函数需要忽略，同时也实现了透传
	// Promise.resolve(4).then().then((value) => console.log(value))
	onResolved = typeof onResolved === "function" ? onResolved : (v) => v;
	onRejected =
		typeof onRejected === "function"
			? onRejected
			: (r) => {
					throw r;
					if (self.currentState === RESOLVED) {
						return (promise2 = new MyPromise(function (resolve, reject) {
							// 规范 2.2.4，保证 onFulfilled，onRjected 异步执行
							// 所以用了 setTimeout 包裹下
							setTimeout(function () {
								try {
									var x = onResolved(self.value);
									resolutionProcedure(promise2, x, resolve, reject);
								} catch (reason) {
									reject(reason);
								}
							});
						}));
					}
					if (self.currentState === REJECTED) {
						return (promise2 = new MyPromise(function (resolve, reject) {
							setTimeout(function () {
								// 异步执行onRejected
								try {
									var x = onRejected(self.value);
									resolutionProcedure(promise2, x, resolve, reject);
								} catch (reason) {
									reject(reason);
								}
							});
						}));
					}
					if (self.currentState === PENDING) {
						return (promise2 = new MyPromise(function (resolve, reject) {
							self.resolvedCallbacks.push(function () {
								// 考虑到可能会有报错，所以使用 try/catch 包裹
								try {
									var x = onResolved(self.value);
									resolutionProcedure(promise2, x, resolve, reject);
								} catch (r) {
									reject(r);
								}
							});
							self.rejectedCallbacks.push(function () {
								try {
									var x = onRejected(self.value);
									resolutionProcedure(promise2, x, resolve, reject);
								} catch (r) {
									reject(r);
								}
							});
						}));
					}
			  };
	// 规范 2.3
	function resolutionProcedure(promise2, x, resolve, reject) {
		// 规范 2.3.1，x 不能和 promise2 相同，避免循环引用
		if (promise2 === x) {
			return reject(new TypeError("Error"));
		}
		// 规范 2.3.2
		// 如果 x 为 Promise，状态为 pending 需要继续等待否则执行
		if (x instanceof MyPromise) {
			if (x.currentState === PENDING) {
				x.then(function (value) {
					// 再次调用该函数是为了确认 x resolve 的
					// 参数是什么类型，如果是基本类型就再次 resolve
					// 把值传给下个 then
					resolutionProcedure(promise2, value, resolve, reject);
				}, reject);
			} else {
				x.then(resolve, reject);
			}
			return;
		}
		// 规范 2.3.3.3.3
		// reject 或者 resolve 其中一个执行过得话，忽略其他的
		let called = false;
		// 规范 2.3.3，判断 x 是否为对象或者函数
		if (x !== null && (typeof x === "object" || typeof x === "function")) {
			// 规范 2.3.3.2，如果不能取出 then，就 reject
			try {
				// 规范 2.3.3.1
				let then = x.then;
				// 如果 then 是函数，调用 x.then
				if (typeof then === "function") {
					// 规范 2.3.3.3
					then.call(
						x,
						(y) => {
							if (called) return;
							called = true;
							// 规范 2.3.3.3.1
							resolutionProcedure(promise2, y, resolve, reject);
						},
						(e) => {
							if (called) return;
							called = true;
							reject(e);
						}
					);
				} else {
					// 规范 2.3.3.4
					resolve(x);
				}
			} catch (e) {
				if (called) return;
				called = true;
				reject(e);
			}
		} else {
			// 规范 2.3.4，x 为基本类型
			resolve(x);
		}
	}
};
```

## 实现 4

我很早之前实现过一版，而且注释很多，但是居然找不到了,这是在网络上找了一版带注释的，目测没有大问题，具体过程可以看这篇：[史上最易读懂的 Promise/A+ 完全实现 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/21834559)

```js
var PromisePolyfill = (function () {
	// 和reject不同的是resolve需要尝试展开thenable对象
	function tryToResolve(value) {
		if (this === value) {
			// 主要是防止下面这种情况
			// let y = new Promise(res => setTimeout(res(y)))
			throw TypeError("Chaining cycle detected for promise!");
		}
		// 根据规范2.32以及2.33 对对象或者函数尝试展开
		// 保证S6之前的 polyfill 也能和ES6的原生promise混用
		if (
			value !== null &&
			(typeof value === "object" || typeof value === "function")
		) {
			try {
				// 这里记录这次then的值同时要被try包裹
				// 主要原因是 then 可能是一个getter, 也也就是说
				// 1. value.then可能报错
				// 2. value.then可能产生副作用(例如多次执行可能结果不同)
				var then = value.then;
				// 另一方面, 由于无法保证 then 确实会像预期的那样只调用一个onFullfilled / onRejected
				// 所以增加了一个flag来防止resolveOrReject被多次调用
				var thenAlreadyCalledOrThrow = false;
				if (typeof then === "function") {
					// 是thenable 那么尝试展开
					// 并且在该thenable状态改变之前this对象的状态不变
					then.bind(value)(
						// onFullfilled
						function (value2) {
							if (thenAlreadyCalledOrThrow) return;
							thenAlreadyCalledOrThrow = true;
							tryToResolve.bind(this, value2)();
						}.bind(this),
						// onRejected
						function (reason2) {
							if (thenAlreadyCalledOrThrow) return;
							thenAlreadyCalledOrThrow = true;
							resolveOrReject.bind(this, "rejected", reason2)();
						}.bind(this)
					);
				} else {
					// 拥有then 但是then不是一个函数 所以也不是thenable
					resolveOrReject.bind(this, "resolved", value)();
				}
			} catch (e) {
				if (thenAlreadyCalledOrThrow) return;
				thenAlreadyCalledOrThrow = true;
				resolveOrReject.bind(this, "rejected", e)();
			}
		} else {
			// 基本类型 直接返回
			resolveOrReject.bind(this, "resolved", value)();
		}
	}
	function resolveOrReject(status, data) {
		if (this.status !== "pending") return;
		this.status = status;
		this.data = data;
		if (status === "resolved") {
			for (var i = 0; i < this.resolveList.length; ++i) {
				this.resolveList[i]();
			}
		} else {
			for (i = 0; i < this.rejectList.length; ++i) {
				this.rejectList[i]();
			}
		}
	}
	function Promise(executor) {
		if (!(this instanceof Promise)) {
			throw Error("Promise can not be called without new !");
		}
		if (typeof executor !== "function") {
			// 非标准 但与Chrome⾕歌保持一致
			throw TypeError("Promise resolver " + executor + " is not a function");
		}
		this.status = "pending";
		this.resolveList = [];
		this.rejectList = [];
		try {
			executor(tryToResolve.bind(this), resolveOrReject.bind(this, "rejected"));
		} catch (e) {
			resolveOrReject.bind(this, "rejected", e)();
		}
	}
	Promise.prototype.then = function (onFullfilled, onRejected) {
		// 返回值穿透以及错误穿透, 注意错误穿透用的是throw而不是return，否则的话
		// 这个then返回的promise状态将变成resolved即接下来的then中的onFullfilled
		// 会被调用, 然而我们想要调用的是onRejected
		if (typeof onFullfilled !== "function") {
			onFullfilled = function (data) {
				return data;
			};
		}
		if (typeof onRejected !== "function") {
			onRejected = function (reason) {
				throw reason;
			};
		}
		var executor = function (resolve, reject) {
			setTimeout(
				function () {
					try {
						// 拿到对应的handle函数处理this.data
						// 并以此为依据解析这个新的Promise
						var value =
							this.status === "resolved"
								? onFullfilled(this.data)
								: onRejected(this.data);
						resolve(value);
					} catch (e) {
						reject(e);
					}
				}.bind(this)
			);
		};
		// then 接受两个函数返回一个新的Promise
		// then 自身的执行永远异步与onFullfilled/onRejected的执行
		if (this.status !== "pending") {
			return new Promise(executor.bind(this));
		} else {
			// pending
			return new Promise(
				function (resolve, reject) {
					this.resolveList.push(executor.bind(this, resolve, reject));
					this.rejectList.push(executor.bind(this, resolve, reject));
				}.bind(this)
			);
		}
	};
	// for prmise A+ test
	Promise.deferred = Promise.defer = function () {
		var dfd = {};
		dfd.promise = new Promise(function (resolve, reject) {
			dfd.resolve = resolve;
			dfd.reject = reject;
		});
		return dfd;
	};
	// for prmise A+ test
	if (typeof module !== "undefined") {
		module.exports = Promise;
	}
	return Promise;
})();
PromisePolyfill.all = function (promises) {
	return new Promise((resolve, reject) => {
		const result = [];
		let cnt = 0;
		for (let i = 0; i < promises.length; ++i) {
			promises[i].then((value) => {
				cnt++;
				result[i] = value;
				if (cnt === promises.length) resolve(result);
			}, reject);
		}
	});
};
PromisePolyfill.race = function (promises) {
	return new Promise((resolve, reject) => {
		for (let i = 0; i < promises.length; ++i) {
			promises[i].then(resolve, reject);
		}
	});
};
```

## Promise 以及相关方法的实现

题目描述：手写 Promise 以及 Promise.all Promise.race 的实现

实现代码如下：

```javascript
class Mypromise {
	constructor(fn) {
		// 表示状态
		this.state = "pending";
		// 表示then注册的成功函数
		this.successFun = [];
		// 表示then注册的失败函数
		this.failFun = [];

		let resolve = (val) => {
			// 保持状态改变不可变（resolve和reject只准触发一种）
			if (this.state !== "pending") return;

			// 成功触发时机  改变状态 同时执行在then注册的回调事件
			this.state = "success";
			// 为了保证then事件先注册（主要是考虑在promise里面写同步代码） promise规范 这里为模拟异步
			setTimeout(() => {
				// 执行当前事件里面所有的注册函数
				this.successFun.forEach((item) => item.call(this, val));
			});
		};

		let reject = (err) => {
			if (this.state !== "pending") return;
			// 失败触发时机  改变状态 同时执行在then注册的回调事件
			this.state = "fail";
			// 为了保证then事件先注册（主要是考虑在promise里面写同步代码） promise规范 这里模拟异步
			setTimeout(() => {
				this.failFun.forEach((item) => item.call(this, err));
			});
		};
		// 调用函数
		try {
			fn(resolve, reject);
		} catch (error) {
			reject(error);
		}
	}

	// 实例方法 then

	then(resolveCallback, rejectCallback) {
		// 判断回调是否是函数
		resolveCallback =
			typeof resolveCallback !== "function" ? (v) => v : resolveCallback;
		rejectCallback =
			typeof rejectCallback !== "function"
				? (err) => {
						throw err;
				  }
				: rejectCallback;
		// 为了保持链式调用  继续返回promise
		return new Mypromise((resolve, reject) => {
			// 将回调注册到successFun事件集合里面去
			this.successFun.push((val) => {
				try {
					//    执行回调函数
					let x = resolveCallback(val);
					//（最难的一点）
					// 如果回调函数结果是普通值 那么就resolve出去给下一个then链式调用  如果是一个promise对象（代表又是一个异步） 那么调用x的then方法 将resolve和reject传进去 等到x内部的异步 执行完毕的时候（状态完成）就会自动执行传入的resolve 这样就控制了链式调用的顺序
					x instanceof Mypromise ? x.then(resolve, reject) : resolve(x);
				} catch (error) {
					reject(error);
				}
			});

			this.failFun.push((val) => {
				try {
					//    执行回调函数
					let x = rejectCallback(val);
					x instanceof Mypromise ? x.then(resolve, reject) : reject(x);
				} catch (error) {
					reject(error);
				}
			});
		});
	}
	//静态方法
	static all(promiseArr) {
		let result = [];
		//声明一个计数器 每一个promise返回就加一
		let count = 0;
		return new Mypromise((resolve, reject) => {
			for (let i = 0; i < promiseArr.length; i++) {
				//这里用 Promise.resolve包装一下 防止不是Promise类型传进来
				Promise.resolve(promiseArr[i]).then(
					(res) => {
						//这里不能直接push数组  因为要控制顺序一一对应(感谢评论区指正)
						result[i] = res;
						count++;
						//只有全部的promise执行成功之后才resolve出去
						if (count === promiseArr.length) {
							resolve(result);
						}
					},
					(err) => {
						reject(err);
					}
				);
			}
		});
	}
	//静态方法
	static race(promiseArr) {
		return new Mypromise((resolve, reject) => {
			for (let i = 0; i < promiseArr.length; i++) {
				Promise.resolve(promiseArr[i]).then(
					(res) => {
						//promise数组只要有任何一个promise 状态变更  就可以返回
						resolve(res);
					},
					(err) => {
						reject(err);
					}
				);
			}
		});
	}
}

// 使用
// let promise1 = new Mypromise((resolve, reject) => {
//   setTimeout(() => {
//     resolve(123);
//   }, 2000);
// });
// let promise2 = new Mypromise((resolve, reject) => {
//   setTimeout(() => {
//     resolve(1234);
//   }, 1000);
// });

// Mypromise.all([promise1,promise2]).then(res=>{
//   console.log(res);
// })

// Mypromise.race([promise1, promise2]).then(res => {
//   console.log(res);
// });

// promise1
//   .then(
//     res => {
//       console.log(res); //过两秒输出123
//       return new Mypromise((resolve, reject) => {
//         setTimeout(() => {
//           resolve("success");
//         }, 1000);
//       });
//     },
//     err => {
//       console.log(err);
//     }
//   )
//   .then(
//     res => {
//       console.log(res); //再过一秒输出success
//     },
//     err => {
//       console.log(err);
//     }
//   );
```

> 扩展思考:如何取消 promise

Promise.race()方法可以用来竞争 Promise 可以借助这个特性 自己包装一个 空的 Promise 与要发起的 Promise 来实现

```javascript
function wrap(pro) {
	let obj = {};
	// 构造一个新的promise用来竞争
	let p1 = new Promise((resolve, reject) => {
		obj.resolve = resolve;
		obj.reject = reject;
	});

	obj.promise = Promise.race([p1, pro]);
	return obj;
}

let testPro = new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve(123);
	}, 1000);
});

let wrapPro = wrap(testPro);
wrapPro.promise.then((res) => {
	console.log(res);
});
wrapPro.resolve("被拦截了");
```

### 222

```js
// 建议阅读 [Promises/A+ 标准](https://promisesaplus.com/)
class MyPromise {
	constructor(func) {
		this.status = "pending";
		this.value = null;
		this.resolvedTasks = [];
		this.rejectedTasks = [];
		this._resolve = this._resolve.bind(this);
		this._reject = this._reject.bind(this);
		try {
			func(this._resolve, this._reject);
		} catch (error) {
			this._reject(error);
		}
	}

	_resolve(value) {
		setTimeout(() => {
			this.status = "fulfilled";
			this.value = value;
			this.resolvedTasks.forEach((t) => t(value));
		});
	}

	_reject(reason) {
		setTimeout(() => {
			this.status = "reject";
			this.value = reason;
			this.rejectedTasks.forEach((t) => t(reason));
		});
	}

	then(onFulfilled, onRejected) {
		return new MyPromise((resolve, reject) => {
			this.resolvedTasks.push((value) => {
				try {
					const res = onFulfilled(value);
					if (res instanceof MyPromise) {
						res.then(resolve, reject);
					} else {
						resolve(res);
					}
				} catch (error) {
					reject(error);
				}
			});
			this.rejectedTasks.push((value) => {
				try {
					const res = onRejected(value);
					if (res instanceof MyPromise) {
						res.then(resolve, reject);
					} else {
						reject(res);
					}
				} catch (error) {
					reject(error);
				}
			});
		});
	}

	catch(onRejected) {
		return this.then(null, onRejected);
	}
}

// 测试
new MyPromise((resolve) => {
	setTimeout(() => {
		resolve(1);
	}, 500);
})
	.then((res) => {
		console.log(res);
		return new MyPromise((resolve) => {
			setTimeout(() => {
				resolve(2);
			}, 500);
		});
	})
	.then((res) => {
		console.log(res);
		throw new Error("a error");
	})
	.catch((err) => {
		console.log("==>", err);
	});
```

### 3333

```js
const PROMISE_STATUS_PENDING = "pending";
const PROMISE_STATUS_FULFILLED = "fulfilled";
const PROMISE_STATUS_REJECTED = "rejected";

// help fun
function execFunctionWithCatchError(execFun, value, resolve, reject) {
	try {
		const result = execFun(value);
		resolve(result);
	} catch (error) {
		reject(error);
	}
}

class MyPromise {
	constructor(executor) {
		this.status = PROMISE_STATUS_PENDING; // 记录promise状态
		this.value = undefined; // resolve返回值
		this.reason = undefined; // reject返回值
		this.onFulfilledFns = []; // 存放成功回调
		this.onRejectedFns = []; // 存放失败回调

		const resolve = (value) => {
			if (this.status === PROMISE_STATUS_PENDING) {
				queueMicrotask(() => {
					if (this.status !== PROMISE_STATUS_PENDING) return;
					this.status = PROMISE_STATUS_FULFILLED;
					this.value = value;
					this.onFulfilledFns.forEach((fn) => {
						fn(this.value);
					});
				});
			}
		};
		const reject = (reason) => {
			if (this.status === PROMISE_STATUS_PENDING) {
				queueMicrotask(() => {
					if (this.status !== PROMISE_STATUS_PENDING) return;
					this.status = PROMISE_STATUS_REJECTED;
					this.reason = reason;
					this.onRejectedFns.forEach((fn) => {
						fn(this.reason);
					});
				});
			}
		};

		try {
			executor(resolve, reject);
		} catch (error) {
			reject(error);
		}
	}

	then(onFulfilled, onRejected) {
		onFulfilled =
			onFulfilled ||
			((value) => {
				return value;
			});

		onRejected =
			onRejected ||
			((err) => {
				throw err;
			});

		return new MyPromise((resolve, reject) => {
			// 1、 when operate then, status have confirmed
			if (this.status === PROMISE_STATUS_FULFILLED && onFulfilled) {
				execFunctionWithCatchError(onFulfilled, this.value, resolve, reject);
			}
			if (this.status === PROMISE_STATUS_REJECTED && onRejected) {
				execFunctionWithCatchError(onRejected, this.reason, resolve, reject);
			}

			if (this.status === PROMISE_STATUS_PENDING) {
				// this.onFulfilledFns.push(onFulfilled);
				if (onFulfilled) {
					this.onFulfilledFns.push(() => {
						execFunctionWithCatchError(
							onFulfilled,
							this.value,
							resolve,
							reject
						);
					});
				}

				// this.onRejectedFns.push(onRejected);
				if (onRejected) {
					this.onRejectedFns.push(() => {
						execFunctionWithCatchError(
							onRejected,
							this.reason,
							resolve,
							reject
						);
					});
				}
			}
		});
	}

	catch(onRejected) {
		return this.then(undefined, onRejected);
	}

	finally(onFinally) {
		this.then(
			() => {
				onFinally();
			},
			() => {
				onFinally();
			}
		);
	}

	static resolve(value) {
		return new MyPromise((resolve) => resolve(value));
	}

	static reject(reason) {
		return new MyPromise((resolve, reject) => reject(reason));
	}

	static all(promises) {
		return new MyPromise((resolve, reject) => {
			const values = [];
			promises.forEach((promise) => {
				promise.then(
					(res) => {
						values.push(res);
						if (values.length === promises.length) {
							resolve(values);
						}
					},
					(err) => {
						reject(err);
					}
				);
			});
		});
	}

	static allSettled(promises) {
		return new MyPromise((resolve) => {
			const results = [];
			promises.forEach((promise) => {
				promise.then(
					(res) => {
						results.push({ status: PROMISE_STATUS_FULFILLED, value: res });
						if (results.length === promises.length) {
							resolve(results);
						}
					},
					(err) => {
						results.push({ status: PROMISE_STATUS_REJECTED, value: err });
						if (results.length === promises.length) {
							resolve(results);
						}
					}
				);
			});
		});
	}

	static race(promises) {
		return new MyPromise((resolve, reject) => {
			promises.forEach((promise) => {
				promise.then(
					(res) => {
						resolve(res);
					},
					(err) => {
						reject(err);
					}
				);
			});
		});
	}

	static any(promises) {
		return new MyPromise((resolve, reject) => {
			const reasons = [];
			promises.forEach((promise) => {
				promise.then(
					(res) => {
						resolve(res);
					},
					(err) => {
						reasons.push(err);
						if (reasons.length === promise.length) {
							// reject(new AggreagateError(reasons));
							reject(reasons);
						}
					}
				);
			});
		});
	}
}

const p1 = new MyPromise((resolve, reject) => {
	setTimeout(() => {
		console.log("--- 1 ---");
		resolve(111);
	});
}).then((res) => {
	console.log("p1 res :>> ", res);
});

const p2 = new MyPromise((resolve, reject) => {
	console.log("--- 2 ---");
	resolve(222);
});

const p3 = new MyPromise((resolve, reject) => {
	console.log("--- 3 ---");
	resolve(333);
});

const p4 = new MyPromise((resolve, reject) => {
	console.log("--- 4 ---");
	reject(444);
});

MyPromise.all([p2, p3]).then((res) => {
	console.log("p2&p3 res :>> ", res);
});

MyPromise.all([p2, p4])
	.then((res) => {
		console.log("p2&p4 res :>> ", res);
	})
	.catch((err) => {
		console.log("err :>> ", err);
	});

// --- 2 ---
// --- 3 ---
// --- 4 ---
// p2&p3 res :>>  [ 222, 333 ]
// err :>>  444
// --- 1 ---
// p1 res :>>  111
```

