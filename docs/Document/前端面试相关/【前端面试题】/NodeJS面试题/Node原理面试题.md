# V8 引擎原理笔记文档

[JavaScript 的运行环境 | 牡涯前端学习笔记 (muyacode.github.io)](https://muyacode.github.io/FrontEndInterviewQuestion/Document/JavaScript笔记/JavaScript的运行和原理/JavaScript的运行环境#v8引擎的工作原理)

# Node 原理面试题

## 什么是 Node.js？

Node.js 是一个服务器环境，其中包含开发人员运行 JavaScript 脚本所需的所有组件。一般来说，每当你看到一个技术术语附带“js”时，它都是 JavaScript 的一部分。作为运行时环境，Node.js 包含与 Java 运行时环境类似的组件，包括用于处理计算命令的引擎和用于构造代码的 API 库。Node.js 是免费和开源的，这使得它对许多公司来说是一个有吸引力的选择。除了节省成本外，开源平台带来的一个好处是可以访问广泛的开发人员社区以及由创建者社区制作的大量可用代码。

Node.js 是一个基于 Chrome 的 V8 JavaScript 引擎的开源、跨平台运行环境，用于在浏览器之外执行 JavaScript 代码。它提供了一个事件驱动、非阻塞（异步）的 I/O 和跨平台的运行环境，用于使用 JavaScript 构建高度可扩展的服务器端应用程序。

## Node.js 和 JavaScript 之间有什么区别？

- JavaScript 是一种脚本语言，而 Node.js 是一个引擎，提供了运行 JavaScript 代码的运行时环境。
- Node.js 主要用于构建应用程序的后端，具有高度可扩展性。
- Node.js 基于 Chrome 的 V8 JavaScript 引擎，运行在浏览器的 JavaScript 引擎中，可以构建可扩展的网络应用程序，支持事件驱动、非阻塞的 I/O 操作。

## Node.js 是单线程的吗？

- 是的，Node.js 默认是单线程的。但是，它利用事件驱动的架构和非阻塞的 I/O 操作来高效处理多个并发请求，从而实现了可扩展性和高性能。

## Node.js 支持哪种类型的 API 函数？

- Node.js 支持两种类型的 API 函数：
  - 同步（Synchronous）：用于阻塞式代码。
  - 异步（Asynchronous）：用于非阻塞式代码。

## Node.js 的事件循环是如何工作的？

- Node.js 使用事件循环来处理非阻塞异步操作。事件循环允许 Node.js 在没有多线程的情况下执行非 I/O 代码（如用户代码），并在操作完成时调用回调函数。

## Node.js 如何处理并发请求？

- Node.js 通过事件循环和回调机制处理并发。每当有 I/O 操作需要执行时，Node.js 会将其委托给系统内核，然后继续执行其他代码。当 I/O 操作完成时，回调函数会被放入事件队列中，等待事件循环再次到达它时执行。

## 什么是 Node.js 中的非阻塞 I/O？

- 非阻塞 I/O 指的是当 Node.js 执行 I/O 操作（如读写文件、网络通信等）时，不会阻塞程序的执行，而是在操作完成后通过回调函数来处理结果。

## Node.js 的单线程模型意味着什么？

- 单线程模型意味着 Node.js 在主线程上只有一个事件循环来处理所有的异步操作。这样做可以减少上下文切换和锁的开销，但也意味着不能直接利用多核 CPU 的计算能力。

## 如何在 Node.js 中使用异步操作？

- 在 Node.js 中，可以使用回调函数、Promises 或 async/await 来处理异步操作。这些方法允许你编写非阻塞的代码，并在操作完成时处理结果。

## Node.js 中的 libuv 是什么？

- libuv 是一个跨平台的 C 库，它为 Node.js 提供了事件循环和异步 I/O 的功能。它处理文件系统操作、网络通信以及为 Node.js 提供线程池。

## V8 引擎在 Node.js 中的作用是什么？

- V8 引擎是 Google 开发的 JavaScript 引擎，它负责解释和执行用户的 JavaScript 代码。Node.js 使用 V8 引擎因为它的性能非常高效，并且支持现代 JavaScript 的特性。

## Node.js 如何利用多核 CPU？

- 尽管 Node.js 是单线程的，但它可以通过创建子进程或使用集群模块来利用多核 CPU。这允许多个 Node.js 实例运行在不同的核心上，从而提高应用程序的并发处理能力。

## nodejs 中的异步、非阻塞 I/O 是如何实现的？

在听到 nodejs 相关的特性时，经常会对 异步 I/O 、 非阻塞 I/O 有所耳闻，听起来好像是差不多的意思，但其实是两码事，下面我们就以原理的角度来剖析一下对 nodejs 来说，这两种技术底层是如何实现的？

### 什么是 I/O？

I/O 即 Input/Output, 输入和输出的意思。在浏览器端，只有一种 I/O，那就是利用 Ajax 发送网络请求，然后读取返回的内容，这属于 网络 I/O 。回到 nodejs 中，其实这种的 I/O 的场景就更加广泛了，主要分为两种：

- 文件 I/O。比如用 fs 模块对文件进行读写操作。
- 网络 I/O。比如 http 模块发起网络请求。

#### 阻塞和非阻塞 I/O

阻塞 和 非阻塞 I/O 其实是针对操作系统内核而言的，而不是 nodejs 本身。阻塞 I/O 的特点就是一定要等到操作系统完成所有操作后才表示调用结束，而非阻塞 I/O 是调用后立马返回，不用等操作系统内核完成操作。

对前者而言，在操作系统进行 I/O 的操作的过程中，我们的应用程序其实是一直处于等待状态的，什么都做不了。那如果换成 非阻塞 I/O ，调用返回后我们的 nodejs 应用程序可以完成其他的事情，而操作系统同时也在进行 I/O。这样就把等待的时间充分利用了起来，提高了执行效率，但是同时又会产生一个问题，nodejs 应用程序怎么知道操作系统已经完成了 I/O 操作呢？

为了让 nodejs 知道操作系统已经做完 I/O 操作，需要重复地去操作系统那里判断一下是否完成，这种重复判断的方式就是 轮询 。对于轮询而言，有以下这么几种方案：

- 1）一直轮询检查 I/O 状态，直到 I/O 完成。这是最原始的方式，也是性能最低的，会让 CPU 一直耗用在等待上面。其实跟阻塞 I/O 的效果是一样的。
- 2）遍历文件描述符(即 文件 I/O 时操作系统和 nodejs 之间的文件凭证)的方式来确定 I/O 是否完成，I/O 完成则文件描述符的状态改变。但 CPU 轮询消耗还是很大。
- 3）epoll 模式。即在进入轮询的时候如果 I/O 未完成 CPU 就休眠，完成之后唤醒 CPU。

总之，CPU 要么重复检查 I/O，要么重复检查文件描述符，要么休眠，都得不到很好的利用，我们希望的是：

> nodejs 应用程序发起 I/O 调用后可以直接去执行别的逻辑，操作系统默默地做完 I/O 之后给 nodejs 发一个完成信号，nodejs 执行回调操作。

这是理想的情况，也是异步 I/O 的效果，那如何实现这样的效果呢？

#### 异步 I/O 的本质

Linux 原生存在这样的一种方式，即(AIO), 但两个致命的缺陷：

- 1）只有 Linux 下存在，在其他系统中没有异步 I/O 支持。
- 2）无法利用系统缓存。

#### nodejs 中的异步 I/O 方案

是不是没有办法了呢？在单线程的情况下确实是这样，但是如果把思路放开一点，利用多线程来考虑这个问题，就变得轻松多了。我们可以让一个进程进行计算操作，另外一些进行 I/O 调用，I/O 完成后把信号传给计算的线程，进而执行回调，这不就好了吗？没错，异步 I/O 就是使用这样的线程池来实现的。

只不过在不同的系统下面表现会有所差异，在 Linux 下可以直接使用线程池来完成，在 Window 系统下则采用 IOCP 这个系统 API(其内部还是用线程池完成的)。

有了操作系统的支持，那 nodejs 如何来对接这些操作系统从而实现异步 I/O 呢？
以文件为 I/O 我们以一段代码为例：

```js
let fs = require("fs");
fs.readFile("/test.txt", function (err, data) {
	console.log(data);
});
```

#### 执行流程

执行代码的过程中大概发生了这些事情：

1）首先，fs.readFile 调用 Node 的核心模块 fs.js ；

2）接下来，Node 的核心模块调用内建模块 node`file.cc，创建对应的文件 I/O 观察者对象(这个对象后面有大用！) ；

3）最后，根据不同平台（Linux 或者 window），内建模块通过 libuv 中间层进行系统

#### 调用 libuv 调用过程拆解

重点来了！libuv 中是如何来进行进行系统调用的呢？也就是 uv`fs`open() 中做了些什么？

##### （1）创建请求对象

以 Windows 系统为例来说，在这个函数的调用过程中，我们创建了一个文件 I/O 的请求对象，并往里面注入了回调函数。

```bash
req`wrap->object`->Set(oncomplete`sym, callback);
```

req*wrap 便是这个请求对象，req`wrap 中 object* 的 oncomplete`sym 属性对应的值便是我们 nodejs 应用程序代码中传入的回调函数。

##### （2）推入线程池，调用返回

在这个对象包装完成后，QueueUserWorkItem() 方法将这个对象推进线程池中等待执行。

好，至此现在 js 的调用就直接返回了，我们的 js 应用程序代码可以 继续往下执行 ，当然，当前的 I/O 操作同时也在线程池中将被执行，这不就完成了异步么：）

等等，别高兴太早，回调都还没执行呢！接下来便是执行回调通知的环节。

##### （3）回调通知

事实上现在线程池中的 I/O 无论是阻塞还是非阻塞都已经无所谓了，因为异步的目的已经达成。重要的是 I/O 完成后会发生什么。

在介绍后续的故事之前，给大家介绍两个重要的方法: GetQueuedCompletionStatus 和 PostQueuedCompletionStatus 。

1）还记得之前讲过的 eventLoop 吗？在每一个 Tick 当中会调用 GetQueuedCompletionStatus 检查线程池中是否有执行完的请求，如果有则表示时机已经成熟，可以执行回调了。

2） PostQueuedCompletionStatus 方法则是向 IOCP 提交状态，告诉它当前 I/O 完成了。

把后面的过程串联起来。

当对应线程中的 I/O 完成后，会将获得的结果 存储 起来，保存到 相应的请求对象 中，然后调用 PostQueuedCompletionStatus() 向 IOCP 提交执行完成的状态，并且将线程还给操作系统。一旦 EventLoop 的轮询操作中，调用 etQueuedCompletionStatus 检测到了完成的状态，就会把 请求对象塞给 I/O 观察者(之前埋下伏笔，如今终于闪亮登场)。

I/O 观察者现在的行为就是取出 请求对象 的 存储结果 ，同时也取出它的 oncomplete`sym 属性，即回调函数(不懂这个属性的回看第 1 步的操作)。将前者作为函数参数传入后者，并执行后者。 这里，回调函数就成功执行啦！

### 总结

1） 阻塞 和 非阻塞 I/O 其实是针对操作系统内核而言的。阻塞 I/O 的特点就是一定要等到操作系统完成所有操作后才表示调用结束，而非阻塞 I/O 是调用后立马返回，不用等操作系统内核完成操作。
2）nodejs 中的异步 I/O 采用多线程的方式，由 EventLoop 、 I/O 观察者 ， 请求对象 、 线程池 四大要素相互配合，共同实现。

## 详细说明 Event loop

**event loop**

- [这一次，彻底弄懂 JavaScript 执行机制](https://juejin.im/post/59e85eebf265da430d571f89)
- [一次弄懂 Event Loop（彻底解决此类面试问题）](https://juejin.im/post/5c3d8956e51d4511dc72c200)
- [从 event loop 规范探究 javaScript 异步及浏览器更新渲染时机](https://github.com/aooy/blog/issues/5)
- [浏览器与 Node 的事件循环(Event Loop)有何区别?](https://zhuanlan.zhihu.com/p/54882306)

众所周知 JS 是门非阻塞单线程语言，因为在最初 JS 就是为了和浏览器交互而诞生的。如果 JS 是门多线程的语言话，我们在多个线程中处理 DOM 就可能会发生问题（一个线程中新加节点，另一个线程中删除节点），当然可以引入读写锁解决这个问题。

JS 在执行的过程中会产生执行环境，这些执行环境会被顺序的加入到执行栈中。如果遇到异步的代码，会被挂起并加入到 Task（有多种 task） 队列中。一旦执行栈为空，Event Loop 就会从 Task 队列中拿出需要执行的代码并放入执行栈中执行，所以本质上来说 JS 中的异步还是同步行为。

```javascript
console.log('script start');

setTimeout(function() {
  console.log('setTimeout');
}, 0);

console.log('script end');
```

以上代码虽然 `setTimeout` 延时为 0，其实还是异步。这是因为 HTML5 标准规定这个函数第二个参数不得小于 4 毫秒，不足会自动增加。所以 `setTimeout` 还是会在 `script end` 之后打印。

不同的任务源会被分配到不同的 Task 队列中，任务源可以分为 微任务（microtask） 和 宏任务（macrotask）。在 ES6 规范中，microtask 称为 `jobs`，macrotask 称为 `task`。

```javascript
console.log('script start');

setTimeout(function() {
  console.log('setTimeout');
}, 0);

new Promise((resolve) => {
    console.log('Promise')
    resolve()
}).then(function() {
  console.log('promise1');
}).then(function() {
  console.log('promise2');
});

console.log('script end');
// script start => Promise => script end => promise1 => promise2 => setTimeout
```

以上代码虽然 `setTimeout` 写在 `Promise` 之前，但是因为 `Promise` 属于微任务而 `setTimeout` 属于宏任务，所以会有以上的打印。

微任务包括 `process.nextTick` ，`promise` ，`Object.observe` ，`MutationObserver`

宏任务包括 `script` ， `setTimeout` ，`setInterval` ，`setImmediate` ，`I/O` ，`UI rendering`

很多人有个误区，认为微任务快于宏任务，其实是错误的。因为宏任务中包括了 `script` ，浏览器会先执行一个宏任务，接下来有异步代码的话就先执行微任务。

所以正确的一次 Event loop 顺序是这样的

1. 执行同步代码，这属于宏任务
2. 执行栈为空，查询是否有微任务需要执行
3. 执行所有微任务
4. 必要的话渲染 UI
5. 然后开始下一轮 Event loop，执行宏任务中的异步代码

通过上述的 Event loop 顺序可知，如果宏任务中的异步代码有大量的计算并且需要操作 DOM 的话，为了更快的 界面响应，我们可以把操作 DOM 放入微任务中。

### Node 中的 Event loop

Node 中的 Event loop 和浏览器中的不相同。

Node 的 Event loop 分为 6 个阶段，它们会按照顺序反复运行

```bash
┌───────────────────────┐
┌─>│        timers         │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     I/O callbacks     │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     idle, prepare     │
│  └──────────┬────────────┘      ┌───────────────┐
│  ┌──────────┴────────────┐      │   incoming:   │
│  │         poll          │<──connections───     │
│  └──────────┬────────────┘      │   data, etc.  │
│  ┌──────────┴────────────┐      └───────────────┘
│  │        check          │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
└──┤    close callbacks    │
   └───────────────────────┘
```

#### timer

timers 阶段会执行 `setTimeout` 和 `setInterval`

一个 `timer` 指定的时间并不是准确时间，而是在达到这个时间后尽快执行回调，可能会因为系统正在执行别的事务而延迟。

下限的时间有一个范围：`[1, 2147483647]` ，如果设定的时间不在这个范围，将被设置为 1。

#### I/O

I/O 阶段会执行除了 close 事件，定时器和 `setImmediate` 的回调

#### idle, prepare

idle, prepare 阶段内部实现

#### poll

poll 阶段很重要，这一阶段中，系统会做两件事情

1. 执行到点的定时器
2. 执行 poll 队列中的事件

并且当 poll 中没有定时器的情况下，会发现以下两件事情

- 如果 poll 队列不为空，会遍历回调队列并同步执行，直到队列为空或者系统限制
- 如果 poll 队列为空，会有两件事发生
  - 如果有 `setImmediate` 需要执行，poll 阶段会停止并且进入到 check 阶段执行 `setImmediate`
  - 如果没有 `setImmediate` 需要执行，会等待回调被加入到队列中并立即执行回调

如果有别的定时器需要被执行，会回到 timer 阶段执行回调。

#### check

check 阶段执行 `setImmediate`

#### close callbacks

close callbacks 阶段执行 close 事件

并且在 Node 中，有些情况下的定时器执行顺序是随机的

```javascript
setTimeout(() => {
    console.log('setTimeout');
}, 0);
setImmediate(() => {
    console.log('setImmediate');
})
// 这里可能会输出 setTimeout，setImmediate
// 可能也会相反的输出，这取决于性能
// 因为可能进入 event loop 用了不到 1 毫秒，这时候会执行 setImmediate
// 否则会执行 setTimeout
```

当然在这种情况下，执行顺序是相同的

```javascript
var fs = require('fs')

fs.readFile(__filename, () => {
    setTimeout(() => {
        console.log('timeout');
    }, 0);
    setImmediate(() => {
        console.log('immediate');
    });
});
// 因为 readFile 的回调在 poll 中执行
// 发现有 setImmediate ，所以会立即跳到 check 阶段执行回调
// 再去 timer 阶段执行 setTimeout
// 所以以上输出一定是 setImmediate，setTimeout
```

上面介绍的都是 macrotask 的执行情况，microtask 会在以上每个阶段完成后立即执行。

```javascript
setTimeout(()=>{
    console.log('timer1')

    Promise.resolve().then(function() {
        console.log('promise1')
    })
}, 0)

setTimeout(()=>{
    console.log('timer2')

    Promise.resolve().then(function() {
        console.log('promise2')
    })
}, 0)

// 以上代码在浏览器和 node 中打印情况是不同的
// 浏览器中打印 timer1, promise1, timer2, promise2
// node 中打印 timer1, timer2, promise1, promise2
```

Node 中的 `process.nextTick` 会先于其他 microtask 执行。

```javascript
setTimeout(() => {
  console.log("timer1");

  Promise.resolve().then(function() {
    console.log("promise1");
  });
}, 0);

process.nextTick(() => {
  console.log("nextTick");
});
// nextTick, timer1, promise1
```



## 能不能简单实现一下 node 中回调函数的机制？

回调函数 的方式其实内部利用了 发布-订阅 模式，在这里我们以模拟实现 node 中的 Event 模块为例来写实现回调函数的机制。

```js
function EventEmitter() {
	this.events = new Map();
}
```

这个 EventEmitter 一共需要实现这些方法: addListener , removeListener , once ,
removeAllListener , emit 。

首先是 addListener：

```js
// once 参数表示是否只是触发一次
const wrapCallback = (fn, once = false) => ({ callback: fn, once });

EventEmitter.prototype.addListener = function (type, fn, once = false) {
	let handler = this.events.get(type);
	if (!handler) {
		// 为 type 事件绑定回调
		this.events.set(type, wrapCallback(fn, once));
	} else if (handler && typeof handler.callback === "function") {
		// 目前 type 事件只有一个回调
		this.events.set(type, [handler, wrapCallback(fn, once)]);
	} else {
		// 目前 type 事件回调数 >= 2
		handler.push(wrapCallback(fn, once));
	}
};
```

removeLisener 的实现如下：

```js
EventEmitter.prototype.removeListener = function (type, listener) {
	let handler = this.events.get(type);
	if (!handler) return;
	if (!Array.isArray(handler)) {
		if (handler.callback === listener.callback) this.events.delete(type);
		else return;
	}
	for (let i = 0; i < handler.length; i++) {
		let item = handler[i];
		if (item.callback === listener.callback) {
			// 删除该回调，注意数组塌陷的问题，即后面的元素会往前挪一位。i 要 --
			handler.splice(i, 1);
			i--;
			if (handler.length === 1) {
				// 长度为 1 就不用数组存了
				this.events.set(type, handler[0]);
			}
		}
	}
};
```

once 实现思路很简单，先调用 addListener 添加上了 once 标记的回调对象, 然后在 emit 的时候遍历回调列表，将标记了 once: true 的项 remove 掉即可。

```js
EventEmitter.prototype.once = function (type, fn) {
	this.addListener(type, fn, true);
};
EventEmitter.prototype.emit = function (type, ...args) {
	let handler = this.events.get(type);
	if (!handler) return;
	if (Array.isArray(handler)) {
		// 遍历列表，执行回调
		handler.map((item) => {
			item.callback.apply(this, args);
			// 标记的 once: true 的项直接移除
			if (item.once) this.removeListener(type, item);
		});
	} else {
		// 只有一个回调则直接执行
		handler.callback.apply(this, args);
	}
	return true;
};
```

最后是 removeAllListener：

```js
EventEmitter.prototype.removeAllListener = function (type) {
	let handler = this.events.get(type);
	if (!handler) return;
	else this.events.delete(type);
};
```

现在我们测试一下：

```js
let e = new EventEmitter();
e.addListener("type", () => {
	console.log("type事件触发！");
});
e.addListener("type", () => {
	console.log("WOW!type事件又触发了！");
});
function f() {
	console.log("type事件我只触发一次");
}

e.once("type", f);
e.emit("type");
e.emit("type");
e.removeAllListener("type");
e.emit("type");
// type事件触发！
// WOW!type事件又触发了！
// type事件我只触发一次
// type事件触发！
// WOW!type事件又触发了！
```

一个简易的 Event 就这样实现完成了，为什么说它简易呢？因为还有很多细节的部分没有考虑：

- 1）在 参数少 的情况下，call 的性能优于 apply，反之 apply 的性能更好。因此在执行回调时候可以根据情况调用 call 或者 apply。
- 2）考虑到内存容量，应该设置 回调列表的最大值 ，当超过最大值的时候，应该选择部分回调进行删除操作。
- 3）鲁棒性有待提高。对于参数的校验很多地方直接忽略掉了。
