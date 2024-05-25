# NodeJS 面试题

# 相关网址

Node官网：https://nodejs.org/

GitHub：https://github.com/nodejs/node

# 需要掌握的 Node.js 知识点

### 1.基础概念

- Node.js 不是语言、库或框架。它是 JavaScript 的运行环境，可以解析和执行 JavaScript 代码，使其脱离浏览器在服务器端运行。
- 了解 Node.js 是什么，它的特性，以及它如何工作。
- 理解 Node.js 的事件驱动、非阻塞 I/O 模型。

### 2.组成部分

- 浏览器中的 JavaScript：包括 ECMAScript、DOM 和 BOM。
- Node.js 中的 JavaScript：只有 ECMAScript，没有 DOM 和 BOM。但它提供了一些服务器级别的操作 API，如文件读写、网络服务构建、HTTP 服务器等。

### 3.核心模块、第三方模块、自定义模块

- 核心模块：熟悉 Node.js 提供的核心模块，如 `fs` (文件系统), `http` (网络通信), `path` (路径操作), 等等。



1、Node.js中的模块化基于Commen.JS；

- 导出的是：`module.exports`对象；内部默认`var module.exports={}; var exports = module.exports; return module.exports`
- 所以想导出什么，往对象中添加，一般导出单个用：`module.exports= `；导出多个用：`exports.属性名= `或`module.exports={}`

2、require加载规则

- 优先从缓存加载；缓存有的就不执行内部代码，而是返回对象`module.exports`；
- `require('fs')`：引入核心模块
- `require('./aa.js')`：引入自定义模块(路径方式)
- `require('art-template')`：引入第三方模块
  核心模块、第三方模块的加载：在`node_module`文件下的同名文件中找`package.json`中的`main`属性对应的值，如`index.js`，然后去这个文件并执行；如果`main`没有，那默认找`index.js`；本文件夹没有则往外找`package.json、index.js`，直到找到根目录。

3、`package.json`会自动记录同文件中npm下载时带`--save、--save-dev`的第三方模块；不带不记录；

4、使用`npm init`会自动生成`package.json`文件；

5、使用`npm install`会自动根据`package.json`中记录下载包；用于拷贝项目时下载包。

6、[npm命令](https://www.cnblogs.com/itlkNote/p/6830682.html)

7、解决npm被墙问题（国外网站访问慢）：

- 使用`nrm`源管理器；可以用`npm`命令，但是源变了；
- 下载指定源：`npm install --global cnpm`；这是可以用新源：`cnpm init`；
- `cnpm`是淘宝镜像，每10分钟从npm中更新一次包数据。
- 配置npm以指定源，`npm config list`查看：`npm config set registry https://registry.npm.taobao.org`；这样还是npm命令，源变了；

### 4.异步编程

- 事件驱动：基于事件的编程模型。
- 非阻塞 I/O 模型（异步）：使 Node.js 高效且快速。
- 轻量且高效：构建于 Chrome 的 V8 引擎之上。
- 掌握 Node.js 中的异步编程模式，包括回调函数、Promises、async/await。

### 5.Web 应用开发

Web 后台服务器：学习使用 Express.js、Koa、Nest.js等等框架来创建 Web 应用程序。了解它们的优势和适用场景。

静态资源服务

模板引擎

- 命令行工具。

- 理解中间件、路由、请求处理、模板引擎等概念。

- B/S 编程模型。

- 模块化编程。

- Node 常用 API。

- 异步编程。

- ECMAScript 6。

- 内置的具名的核心模块：

  ```
  var [模块名] = require('[模块名]')；
  ```

  - 常用：`fs,http,os,path,`

- 第三方模块：`Express`web开发框架，需要下载引用；

- 用户自定义模块：就是常说的**模块化**编程，引入js文件；

  - Node中没有全局作用域，只有模块作用域，即引入的不同js文件，不能互相访问内部变量；所以要在js文件内使用`exports`对象导出内部变量、方法；
  - 引入时可以不写后缀`.js`；但必须写相对路径`./,../`，否则会被认为是核心模块，报错！

- HTTP响应内容类型：

  - 告诉浏览器响应数据类型为普通文本，字符编码格式是 UTF-8。

  - > **问题原因：**
    > 服务器默认发送的json字符串数据（读取文件时文件内容编码成的二进制所采用的规则由文件创建时的编码环境决定,一般用开发工具创建的文件都是utf-8）就是`utf-8`编码，但是浏览器默认不知道是什么编码，会按当前操作系统默认的编码格式，如：中文操作系统的默认编码规则：`GBK`，两者规则不同导致中文乱码。
    > （对于直接传二进制数据流时，因为不同编码规则对数字、字母的编码都一样，在通过二进制解码html文件前部分字母是都很正常，中文操作系统用`GBK`正常解码二进制数据，识别看到`meta`便知道用`UTF-8`，所以在传html文件时要声明类型和编码规则，元数据`meta`中定义的编码格式等同于在服务器端响应编码格式）

    > **解决方案：**
    > 声明响应数据的类型（普通文本`text/plain`、html代码`text/html`等），并告诉浏览器编码格式`charset=utf-8`；
    > 不管以字符串形式还是二进制传的都可以视情况需要在服务器设置响应数据类型：提供数据类型和编码格式给浏览器

    > **发送的数据与对应响应类型：**
    > [Content-Type 对照表](https://tool.oschina.net/commons/)
    >
    > - 图片需要指定响应类型，但不需要指定编码格式；
    > - 一般只为字符数据（中文、字母、数字、符号等）指定编码格式 `utf-8`；
    >   如：`res.setHeader('Content-Type','text/plain;charset = utf-8')`
    >   如：`res.setHeader('Content-Type','text/html;charset = utf-8')`
    > - **特别地**：对于响应读取html文件的内容时，可以不写上述声明是因为浏览器自动识别html代码，并且html代码中`meta元数据`也可以声明编码格式。

### 6.数据库交互

- 学习如何在 Node.js 应用中连接和操作数据库，如 MongoDB、MySQL。

掌握数据库的增删改查：连接、查询、事务处理等操作。

### 7.服务器端的 IP 与端口号

- IP 地址用于定位计算机。
- 端口号：0~65536，端口号用于定位具体的应用程序；（因为一台计算机有多个应用程序，靠IP地址无法区分通讯）
  - 客户端中浏览器等应用程序会默认找一个空闲端口来与服务器通信；
  - 一些指定端口号与指定服务联系，不会被默认使用；
  - 80端口号，一般在上线部署时用，浏览器默认加80，用户就不用写了；
  - 3000端口号，一般在开发测试时用；
- 所有需要联网通信的应用程序都会占用一个端口号；
- 互相通信的计算机都知道彼此IP地址、端口号；
- 所以一台服务器可以开启多个服务，每个服务对应一个端口号。

### 8.客户端渲染与服务端渲染

- 渲染：就是将数据以html元素这种浏览器可以识别的方式显示；
- 客户端渲染：采用`ajax等异步操作请求数据`，速度更快；但不利于SEO，爬虫抓不到异步数据（在源代码中看不到数据：如京东商品的评论区分页功能）；
- 服务端渲染：直接传过来带数据的html页面，爬虫在源代码中能找到数据，有利于SEO；（在网页源代码中可以看到数据，如京东商品展示功能）
- 所以一般网站前后端渲染都会用到，为了更快、也为了SEO。

### 9.服务器对静态资源的处理

**背景**：

当我们在html页面中使用`link、script、img、iframe、video、audio`等需要再次发请求引入静态资源的标签时，其实就是自动又向服务器发了一次请求（请求路径分为：网络路径、url文件路径会拼接在服务器地址后面；），所以服务器端也会对这些请求做响应。（如果没有响应，浏览器就会一直处于等待状态，没法渲染页面）

**处理方式**：

服务器将静态资源统一放到一个文件夹`public`中，然后在html页面中通过文件路径引用，这样可以通过`req.url`判断只要是以`/public/`开头的就直接把这个`url`当做文件路径去找这个文件，然后响应回去；所以html页面中使用的路径要是文件路径。

**服务器对表单提交的处理**

- 传统`req.url`返回的是整个根目录及以后的部分；包含了路径和`query`信息；
- 当客户端使用`get`请求时，服务器要想得到`query`数据，单从`req.url`中不容易获取，所以有了专门处理路径的核心模块：`var url = require('url')`；
- 使用这个模块的`parse`方法可以得到一个路径对象；
- `var pathObj = url.parse(req.url,true)`；第二个参数用于将`query`的属性值以对象形式呈现，默认是字符串，这里会涉及编码格式；
- 然后就是判断`pathObj.pathname`路径字符串来决定响应内容；
- 并向模板中使用上`pathObj.query`对象；
- 比如，添加到已有数组中，并使用重定向让页面刷新；
  - 重定向：响应设置`302状态码`（临时重定向，再次发请求，浏览器不记住重定向后的地址，相当于每次都是第一次，还是会向原网址发请求），浏览器收到这个状态码，就直接去响应头中找`Location`；在响应头中设置`Location`告诉浏览器重定向的路径；
  - `res.statusCode = 302 res.setHeader('Location','/') res.end()`
- 但是这一步不是数据持久化，服务器一重启新加的数据会没有。



#### Node.js的服务自动重启

`nodemon`：用于修改代码保存后自动重启服务器；

```bash
node install --global nodemom

nodemon aa.js
```



### 8.包管理

- 使用 npm 或 yarn 管理项目依赖。
- 创建和发布自己的 Node.js 包。

### 9.测试和调试

- 编写单元测试和集成测试。
- 使用调试工具进行错误跟踪和性能优化。
- 浏览器中有`F12`调试工具
- node中也有调试工具：`>node`命令行直接输命令，可以直接用node中API，按`ctrl+c+c`退出。

### 10.性能优化

- 掌握提高 Node.js 应用性能的技巧，如负载均衡、缓存策略。

### 11.部署和维护

- 学习如何将 Node.js 应用部署到服务器。
- 理解持续集成和持续部署的流程。
- 学习如何部署和扩展Node.js应用程序，包括使用负载均衡、集群、容器化等技术，以满足高流量和高可用性需求。

### 11.安全性

- 了解常见的安全威胁，如 XSS、CSRF，并学习如何防范。

# 待定

待定面试题：[JavaScript 开发人员的 52 Node.js面试问题（已回答） |全栈咖啡馆 (fullstack.cafe)](https://www.fullstack.cafe/blog/node-js-interview-questions)

## 如何判断当前脚本运行在浏览器还是 node 环境中？

```js
this === window ? "browser" : "node";
```

通过判断 Global 对象是否为 window，如果不为 window，当前脚本没有运行在浏览器中。

## 运行错误与程序员错误的区别

- 运行错误是由外部因素引起的，如网络故障、文件不存在等。
- 程序员错误是由代码逻辑错误引起的，如类型错误、未定义的变量等。

## NPM 的好处

- NPM 是 Node.js 的包管理工具，它允许我们轻松安装、管理和共享代码包。
- 通过 NPM，我们可以快速获取其他开发者编写的模块，提高开发效率。

## 1、node 的事件方法讲讲看

**考察点：node**

::: details 查看参考回答

emitter.addListener(eventName, listener)，emitter.emit(eventName[, ...args])，

emitter.on(eventName, listener)，emitter.removeListener(eventName, listener)等

:::

## 2、node 的特性，适合处理什么场景

**考察点：node**

::: details 查看参考回答

Node.js 借助事件驱动，非阻塞 I/O 模型变得轻量和高效，非常适合运行在分布式设备的数据密集型实时应用。

:::

## 3、你有用到 Express,讲讲 Express

**考察点：express**

::: details 查看参考回答

Express 是一个简洁而灵活的 node.js Web 应用框架, 提供了一系列强大特性帮助你创建各种 Web 应用，和丰富的 HTTP 工具。

:::

## 4、promise 的状态有那些

**考察点：promise**

::: details 查看参考回答

等待(pending)、已完成(fulfilled)、已拒绝(rejected)

:::

## 5、数组移除第一个元素的方法有哪些？

**考察点：数组**

::: details 查看参考回答

`splice` 和 `shift` 等

:::

## 1、对 Node 的优点和缺点提出了自己的看法

\*（优点）因为 Node 是基于事件驱动和无阻塞的，所以非常适合处理并发请求，因此构建在 Node 上的代理服务器相比其他技术实现（如 Ruby）的服务器表现要好得多。

此外，与 Node 代理服务器交互的客户端代码是由 javascript 语言编写的，因此客户端和服务器端都用同一种语言编写，这是非常美妙的事情。

\*（缺点）Node 是一个相对新的开源项目，所以不太稳定，它总是一直在变，而且缺少足够多的第三方库支持。看起来，就像是 Ruby/Rails 当年的样子。

## 2、需求：实现一个页面操作不会整页刷新的网站，并且能在浏览器前进、后退

时正确响应。给出你的技术实现方案？

至少给出自己的思路（url-hash,可以使用已有的一些框架 history.js 等）

## 3、Node.js 的适用场景？

1)、实时应用：如在线聊天，实时通知推送等等（如 socket.io） 2)、分布式应用：通过高效的并行 I/O 使用已有的数据 3)、工具类应用：海量的工具，小到前端压缩部署（如 grunt），大到桌面图形界面应用程序 4)、游戏类应用：游戏领域对实时和并发有很高的要求（如网易的 pomelo 框架） 5)、利用稳定接口提升 Web 渲染能力 6)、前后端编程语言环境统一：前端开发人员可以非常快速地切入到服务器端的开发（如著名的纯 Javascript 全栈式 MEAN 架构）

## 4、(如果会用 node)知道 route, middleware, cluster, nodemon, pm2, server-side

rendering 么?

Nodejs 相关概念的理解程度

## 5、解释一下 Backbone 的 MVC 实现方式？

流行的 MVC 架构模式

## 6、什么是"前端路由"?什么时候适合使用"前端路由"? "前端路由"有哪些优点和缺点?

熟悉前后端通信相关知识

前端路由就是在不进行后端请求的情况下对页面进行跳转

## 7、对 Node 的优点和缺点提出了自己的看法？

优点：

1. 因为 Node 是基于事件驱动和无阻塞的，所以非常适合处理并发请求，因此构建在 Node 上的代理服务器相比其他技术实现（如 Ruby）的服务器表现要好得多。

2. 与 Node 代理服务器交互的客户端代码是由 javascript 语言编写的，因此客户端和服务器端都用同一种语言编写，这是非常美妙的事情。

缺点：

1. Node 是一个相对新的开源项目，所以不太稳定，它总是一直在变。
2. 缺少足够多的第三方库支持。看起来，就像是 Ruby/Rails 当年的样子（第三方库现在已经很丰富了，所以这个缺点可以说不存在了）。

## 浏览器 Eventloop 和 Node 中的有什么区别

众所周知 JS 是⻔非阻塞单线程语⾔，因为在最初 JS 就是为了和浏览器交互而
诞生的。如果 JS 是⻔多线程的语⾔话，我们在多个线程中处理 DOM 就可能会发生问题（一个线程中新加节点，另一个线程中删除节点），当然可以引入
读写锁解决这个问题。

JS 在执行的过程中会产生执行环境，这些执行环境会被顺序的加入到执行栈中。如果遇到异步的代码，会被挂起并加入到 Task （有多种 task ） 队列中。一旦执行栈为空，Event Loop 就会从 Task 队列中拿出需要执行的代码并放入执行栈中执行，所以本质上来说 JS 中的异步还是同步行为

```js
console.log("script start");
setTimeout(function () {
	console.log("setTimeout");
}, 0);
console.log("script end");
```

以上代码虽然 setTimeout 延时为 0 ，其实还是异步。这是因为 HTML5 标准规定这个函数第二个参数不得小于 4 毫秒，不足会自动增加。所以 setTimeout 还是会在 script end 之后打印。

不同的任务源会被分配到不同的 Task 队列中，任务源可以分为 微任务（microtask ）和 宏任务（ macrotask ）。在 ES6 规范中， microtask 称为 jobs， macrotask 称为 task 。

```js
console.log("script start");
setTimeout(function () {
	console.log("setTimeout");
}, 0);
new Promise((resolve) => {
	console.log("Promise");
	resolve();
})
	.then(function () {
		console.log("promise1");
	})
	.then(function () {
		console.log("promise2");
	});
console.log("script end");
// script start => Promise => script end => promise1 => promise2 => setTime
```

- 以上代码虽然 setTimeout 写在 Promise 之前，但是因为 Promise 属于微任务而 setTimeout 属于宏任务，所以会有以上的打印。

微任务包括 process.nextTick ， promise ， Object.observe ，MutationObserver

宏任务包括 script ， setTimeout ， setInterval ， setImmediate ， I/O ，
UI renderin

很多⼈有个误区，认为微任务快于宏任务，其实是错误的。因为宏任务中包括
了 script ，浏览器会先执行一个宏任务，接下来有异步代码的话就先执行
微任务

所以正确的一次 Event loop 顺序是这样的

- 执行同步代码，这属于宏任务
- 执行栈为空，查询是否有微任务需要执行
- 执行所有微任务
- 必要的话渲染 UI
- 然后开始下一轮 Event loop ，执行宏任务中的异步代码

通过上述的 Event loop 顺序可知，如果宏任务中的异步代码有大量的计算
并且需要操作 DOM 的话，为了更快的 界面响应，我们可以把操作 DOM 放
入微任务中。

## Node 的应用场景

特点：

- 1、它是一个 Javascript 运行环境
- 2、依赖于 Chrome V8 引擎进行代码解释
- 3、事件驱动
- 4、非阻塞 I/O
- 5、单进程，单线程

优点：高并发（最重要的优点）

缺点：

- 1、只支持单核 CPU ，不能充分利用 CPU
- 2、可靠性低，一旦代码某个环节崩溃，整个系统都崩溃

## 浏览器中和 node.js 中的事件循环机制

当我们谈论浏览器中的事件循环和 Node.js 中的事件循环时，其实都在讨论一种处理异步任务的方式。这两者的核心思想都是在执行代码时，不必等待某些耗时的操作完成，而是继续执行其他任务，等待这些任务完成后再来处理结果。

### 介绍

- **浏览器中的事件循环：**

想象一下你在浏览器中点击一个按钮，触发了一个事件。浏览器会把这个事件放到一个叫做“事件队列”的地方。同时，浏览器也在做其他的事情，比如渲染页面，处理网络请求等等。当浏览器完成了当前的任务，它就会去“事件队列”里看看有没有新的事件需要处理。如果有，它就会把这个事件拿出来执行，然后再继续处理其他任务。这个循环过程就叫做事件循环。

在浏览器环境中，事件循环是处理用户交互、网络请求、渲染更新等异步操作的核心机制。

- **Node.js 中的事件循环：**

Node.js 是用来构建服务器端应用程序的，它也有自己的事件循环机制。比如，当你在 Node.js 中发起一个网络请求时，Node.js 会把这个请求放到一个叫做“事件队列”的地方。然后，Node.js 会继续执行其他任务，比如处理数据库查询等等。当网络请求完成后，Node.js 就会去“事件队列”里找到对应的请求，然后执行相应的回调函数。这个过程和浏览器中的事件循环很相似，都是一种处理异步任务的方式。

### 1. 浏览器中的事件循环

浏览器的事件循环机制遵循 HTML5 规范，主要由以下几个阶段组成：

1. **宏任务队列（macrotask queue）：** 宏任务队列包含一些独立的任务，比如用户交互事件、setTimeout/setInterval 定时器、网络请求等。这些任务会被依次添加到宏任务队列中等待执行。
2. **微任务队列（microtask queue）：** 微任务队列包含一些相对较小的任务，比如 Promise 的回调函数、MutationObserver 等。微任务会在宏任务执行完毕后立即执行，优先级高于宏任务。
3. **渲染更新：** 在每个事件循环的末尾，浏览器会执行渲染更新，更新页面的显示状态。

事件循环会不断地从宏任务队列中取出任务执行，直到宏任务队列为空。在执行完一个宏任务后，会依次执行微任务队列中的所有微任务，然后进行渲染更新。这个过程循环不断，构成了浏览器的事件循环机制。

### 2. Node.js 中的事件循环

Node.js 中的事件循环机制与浏览器中的有些许不同，但本质上也是为了处理异步操作。Node.js 采用了类似于浏览器事件循环的模型，但是在实现上略有差异：

1. **宏任务队列（macrotask queue）：** 宏任务队列中包含了一些独立的任务，比如 I/O 操作、定时器等。这些任务会被依次添加到宏任务队列中等待执行。
2. **微任务队列（microtask queue）：** 与浏览器环境相同，Node.js 也有微任务队列，用于存放 Promise 的回调函数等任务。
3. **事件触发和回调执行：** Node.js 中的事件循环主要通过触发事件和执行回调函数来驱动。当有事件发生时，会触发对应的事件回调函数执行。这些回调函数可能是同步的，也可能是异步的，取决于事件的类型和注册方式。

**两者的异同：**

虽然浏览器中的事件循环和 Node.js 中的事件循环很相似，但它们也有一些不同之处。比如，在浏览器中，事件循环除了处理网络请求等异步任务外，还要负责渲染页面等任务；而在 Node.js 中，事件循环主要用于处理 I/O 操作，比如网络请求、文件读写等。

# 其他

## 常见Node.js开发人员面试问题

准备面试的开发人员可以回答有关开发的一般问题以及面向Node.js的高技术问题。开发人员可以期待回答的一些热门问题包括：

- 您在使用Node.js时最杰出的成就是什么？
- 您最想用Node.js完成哪些工作项目？
- 在第一季度，你能用Node.js完成什么？
- 你的同事会如何描述你的职业道德？
- 你的同事会如何描述你对Node.js的了解？
- 您在技术主题上的舒适程度如何？
- 如果我们雇用您作为Node.js开发人员，您正在寻找什么薪水范围？
- 您最近在Node.js方面取得了什么成就？
- 使用Node.js的人应该具备的最重要的技能是什么？
- 你为什么要离开你现在的开发工作？
- 你最喜欢Node.js的哪一点？
- 您使用 Node.js 多久了？
- 你在Node.js最大的优势是什么？
- 在Node.js方面，你最大的弱点是什么？

## 更多常见Node.js开发人员面试问题

关于Node.js发展的可能谈话要点列表非常广泛。这样做的好处是，如果你有备而来，你将能够处理对话可能走向的任何方向。以下是您可能面临的一些更常见的问题：

- 告诉我一个Node.js项目不成功的经历。
- 您知道哪些编码语言？
- 根据您的经验，Node.js的主要好处是什么？
- 你接受过Node.js方面的专业教育吗？
- 解释项目组合中使用Node.js的项目。
- 什么是Node.js中的子线程？
- 检查一段代码片段，并找到不同的方法来Node.js做同样的事情。
- 如何处理Node.js中的异常？
- 给 Node.js 回调处理程序的最常见的第一个参数是什么？
- 什么是 REPL，您如何使用它？
- 描述什么是错误优先回调。
- 解释Node.js中有什么应许。
- 什么是存根？

## Node.js面试问题和答案

在展示高水平专业知识的同时谈论Node.js需要在面试中拥有深厚的知识和轻松的对话。为了更好地准备面试，这里有一些技术Node.js问题，包括答案和其他有用的信息：

- 你为什么使用Node.js？
- 定义事件驱动的编程。
- 什么是Node.js中的事件循环？
- 使用 Node.js，保护 HTTP cookie 免受 XSS 攻击的最佳方法是什么？
- 如何保护依赖关系？
- module.exports 在 Node.js 中有什么作用？

### 你为什么使用Node.js？

这个问题让面试官对你对Node.js作为一个平台和一个概念的了解有一个基本的了解。这种类型的问题通常会引入一系列关于Node.js的问题。要正确回答这个问题，请解释Node.js在编程时对您最有益的好处。**示例：“***我使用 Node.js 是因为它具有强大的开源 API 和模块库。Node.js提供了当今最全面的 JavaScript 库之一。它也是一个轻量级和高效的环境，可以提高业务绩效。*

### 定义事件驱动的编程。

Node.js是一个事件驱动的服务器环境。因此，展示对事件驱动编程的理解等同于对平台的了解。为了表明您有效地将Node.js用作运行时环境，请通过提供明确的定义来回答此问题。**示例：“***事件驱动编程是一种软件开发类型，其中回调函数作为对事件发生的反应而运行。事件是用户操作，如按钮按下或鼠标悬停，它会导致预先分配的回调函数调度，以便向用户提供功能。这种类型的程序通常是以发布-订阅模式建立的。*

### 什么是Node.js中的事件循环？

事件循环是Node.js严重依赖的过程来制作更快的程序。出于这个原因，重要的是要知道在代码中有效地使用它们，并且您可以以反映同样多的方式谈论其目的。**示例***：“事件循环是处理异步回调的过程。由于 JavaScript 是事件驱动的，因此称为侦听器的对象被附加到事件中，因此当事件发生时，侦听器会发出开发人员提供的回调，以实现事件的目的。*

### 使用 Node.js，保护 HTTP cookie 免受 XSS 攻击的最佳方法是什么？

安全性对于维护业务运营至关重要。使用 Node.js 的开发人员必须了解如何始终保持安全性。通过展示您对Node.js HTTP cookie 的了解以及如何保护它们免受特定攻击类型的了解来回答这个基于场景的问题。**示例：“***XSS 是一种网络攻击，当黑客可以将 JavaScript 代码注入 HTML cookie 时，就会发生这种攻击，这些 cookie 是 Node.js 众所周知的回调和响应过程的一部分。要保护您的 HTML cookie，请使用“set-flags”在 HTTP 标头上创建标志。HTTPonly 标志不允许黑客使用 JavaScript 渗透 cookie，而安全标志则告诉浏览器只响应 HTTPS 请求。*

### 如何保护依赖关系？

当开发人员使用 Node.js 作为他们的主要开发平台时，他们最终可能会有数百个（如果不是数千个）依赖项。通过概述执行此操作的过程，证明您可以确保依赖项的安全。**例：**“*尝试手动检查所有依赖项会使它们容易受到攻击。由于需要监控许多依赖项，自动化是此过程的关键部分。有几个免费和付费的平台选项可以与Node.js集成，并提供额外的自动化功能，帮助保护依赖项，而无需手动监控。*

# 初学者Node.js面试问题和示例答案

## 向候选人询问的 24 个初学者Node.js面试问题

向您的初级申请者询问这 24 个初学者Node.js面试问题中的一些，以测试他们的知识和能力。

1. 请解释一下Node.js是什么以及如何使用它。
2. 请告诉我们您的Node.js体验。
3. 解释您选择申请此职位的原因。
4. 您有多少年Node.js经验？
5. 您对 RESTful API 了解多少？
6. 为什么软技能在使用Node.js时很重要？
7. 您能说出Node.js的三个优点吗？
8. 您是否具有支持您申请此Node.js职位的资格？
9. 你能解释一下Node.js是如何工作的吗？
10. Node.js单线程吗？你能解释一下为什么或为什么不？
11. 尽管是单线程的，Node.js如何处理并发？
12. Node.js中的回调函数是什么？
13. 请解释一下使用 promise 是否比使用回调更好。
14. 您能解释一下 I/O 的含义吗？
15. 说出开发人员使用 Node.js 制作的主要应用程序类型。
16. 开发人员是将 Node.js 用于前端还是后端开发？
17. 请告诉我们 NPM 的含义并解释其主要功能。
18. 您了解Node.js中有哪些模块吗？请解释一下他们的工作。
19. Node.js 比 Java 好吗？解释你的答案。
20. Node.js 和 Angular 有什么区别吗？请举例说明。
21. 您能说出开发人员经常与Node.js一起使用的一个数据库吗？
22. 您能说出一些开发人员经常与 Node.js 一起使用的库吗？
23. 请列举Node.js的一些缺点。
24. 开发人员如何将外部库导入Node.js？命名他们使用的命令。

以下是一些最重要的初学者Node.js面试问题的五个示例答案。在查看申请人的回答时，请检查这些答案。

## 面试题

### 1. 为什么软技能在使用Node.js时很重要？

由于Node.js开发人员必须与许多客户合作，因此他们需要一些关键的软技能。软件开发人员招聘信息中包含的一些顶级软技能是沟通、团队合作、解决问题和计划。

这些基本的软技能可以帮助开发人员与客户建立信任并增强企业与客户的关系。

然而，软技能对Node.js开发人员的重要性并不止于此——他们还必须与开发团队和非技术利益相关者合作，以交付高质量的软件应用程序。

### 2. 你能说出Node.js的三个优点吗？

Node.js有几个关键优势，这可以解释为什么 [47.1% 的](https://www.statista.com/statistics/1124699/worldwide-developer-survey-most-used-frameworks-web/)[开发人员](https://www.statista.com/statistics/1124699/worldwide-developer-survey-most-used-frameworks-web/)在 2022 年选择它作为他们的首选框架。它不仅可以帮助工程师构建可扩展的网络软件和程序，还具有以下品质：

- 快速运行环境
- 异步功能
- 确保开发人员不必等待非 JavaScript 操作结束才能执行 JavaScript 操作
- 简单易学
- 使用缓存来减少加载时间
- 只需要 JavaScript 即可处理前端和后端开发
- 来自大型Node.js开发人员社区的支持

询问有关您的候选人如何从这些优势中受益的其他问题将帮助您了解他们的经验，因此不要忘记询问他们成功的Node.js项目。

### 3. 您能说出一些开发人员经常与Node.js一起使用的库吗？

开发人员经常将一些库与 Node.js 一起使用，因此请寻找一个可以命名几个并解释它们是什么的候选人。

以下是开发人员经常使用的两个库Node.js说明：

- **Express.js：**这个灵活的 Node.js Web 应用程序框架提供了多种功能，可支持移动和 Web 应用程序开发
- **獴：**这个用于Node.js的 Web 应用程序框架使开发人员能够将其应用程序连接到数据库

Parser、Ethers.js 和 Request 是开发人员用于 Node.js 的库的其他一些示例。可以谈论这些功能的候选人值得为您的组织考虑。

### 4. Node.js 和 Angular 有什么区别吗？请举一些例子。

考生应该知道 Node.js 和 Angular 之间存在一些差异。为了证明他们的专业知识，他们可以在回答中提及以下示例：

- Node.js 是一个运行时环境，使开发人员能够在服务器端执行 JavaScript 代码，而 Angular 是客户端应用程序的开发框架
- Node.js 通常用于后端开发，而 Angular 用于前端开发
- Node.js 是用 C 和 C++ 编程语言编写的，而 Angular 是用 TypeScript 编写的
- Node.js 是构建可扩展的服务器端网络应用程序的理想选择，而 Angular 最适合单页客户端应用程序

还提到 Node.js 可用于生成数据库查询的候选人可能具备加入开发团队所需的知识。

### 5. 你了解Node.js有哪些模块吗？请解释一下他们的工作。

即使是初级Node.js工程师也应该了解Node.js中的模块。在他们的回复中寻找以下一些细节：

- Node.js模块类似于 JavaScript 库
- 如果开发人员想要使用特定功能，他们可以将它们包含在 Node.js 应用程序中
- 程序员应使用 ***require（）*** 函数并在括号中添加模块名称以在应用程序中包含模块

优秀的申请者会明白，Node.js中有许多模块，包括 HTTP、查询字符串、URL 和流类型。他们还将能够解释这些模块的作用以及它们的工作原理。例如，流模块处理流数据，HTTP 模块帮助开发人员制作Node.js HTTP 服务器。

### 1. 什么是Node.js？

[Node.js](https://www.geeksforgeeks.org/node-js-introduction/) 是一个 JavaScript 引擎，用于在浏览器外部执行 JavaScript 代码。它通常用于构建应用程序的后端，并且具有高度可扩展性。

### 2. [Node.js 和 JavaScript 有什么区别？](https://www.geeksforgeeks.org/difference-between-node-js-and-javascript/)

JavaScript 是一种脚本语言，而 Node.js 是一种提供运行 JavaScript 代码的运行时环境的引擎。

这里我们有 [Node.js 和 JavaScript 之间的差异表](https://www.geeksforgeeks.org/difference-between-node-js-and-javascript/)

| [Node.js](https://www.geeksforgeeks.org/node-js-introduction/) | [JavaScript的](https://www.geeksforgeeks.org/introduction-to-javascript/) |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
|                      服务器端运行时环境                      |                        客户端脚本语言                        |
|              允许在服务器上运行 JavaScript 代码              |                      主要用于 Web 开发                       |
|            基于 Chrome 的 V8 JavaScript 引擎构建             |            在 Web 浏览器的 JavaScript 引擎中运行             |
|                 支持构建可扩展的网络应用程序                 |                    在浏览器环境中执行代码                    |
|                提供对文件系统和网络资源的访问                |                   仅限于浏览器 API 和功能                    |
|                支持事件驱动、非阻塞 I/O 操作                 |                    在单线程事件循环中执行                    |
|              用于构建后端 API、服务器和应用程序              |                用于创建交互式网页和客户端逻辑                |

### 3. Node.js是单线程的吗？

是的，[默认情况下Node.js是单线程](https://www.geeksforgeeks.org/why-node-js-is-a-single-threaded-language/)的。但是，它利用事件驱动的架构和非阻塞 I/O 操作来高效处理多个并发请求，从而在应用程序中实现可扩展性和高性能。

### 4. Node.js支持什么样的API功能？

Node.js支持两种类型的 [API 函数](https://www.geeksforgeeks.org/types-of-api-functions-in-node-js/)：

- 同步：这些 API 函数用于阻止代码。
- 异步：这些 API 函数用于非阻塞代码。

### 5. 同步函数和异步函数有什么区别？

这里我们有[同步函数和异步函数之间的差异表](https://www.geeksforgeeks.org/synchronous-and-asynchronous-in-javascript/)

|   特征   |                       同步函数                        |                         异步函数                         |
| :------: | :---------------------------------------------------: | :------------------------------------------------------: |
| 执行阻塞 |               阻止执行，直到任务完成。                |            不阻止执行;允许其他任务同时进行。             |
| 等待完成 | 按顺序执行任务;每个任务必须在下一个任务开始之前完成。 |         在等待完成时启动任务并继续执行其他操作。         |
|  返回值  |                 完成后立即返回结果。                  | 通常返回 promise、回调，或使用事件处理在完成时处理结果。 |
| 错误处理 |        使用 try-catch 块可以很容易地捕获错误。        | 错误处理更为复杂，通常涉及回调、承诺或异步/await 语法。  |
| 使用场景 |       适用于具有可预测执行流程的简单顺序任务。        |  非常适合 I/O 绑定操作、网络请求和需要并行处理的任务。   |

### 6. 什么是Node.js模块？

在 Node.js 应用程序中，[模块](https://www.geeksforgeeks.org/what-are-modules-in-node-js/)可以被视为提供可以与外部应用程序通信的简单或复杂功能的代码块。模块可以组织在单个文件中，也可以组织在多个文件/文件夹的集合中。模块之所以有用，是因为它们具有可重用性，并且能够将代码的复杂性降低到更小的部分。模块的一些示例是。HTTP、FS、OS、PATH 等

### 7. 什么是npm及其优点？

npm（节点包管理器）是Node.js的默认包管理器。它允许开发人员轻松发现、共享和重用代码包。它的优势包括依赖管理、版本控制、集中式存储库以及与Node.js项目的无缝集成。

### 8. 什么是中间件？

[中间件](https://www.geeksforgeeks.org/middleware-in-express-js/)是在请求和响应周期之间工作的函数。中间件在服务器收到请求后和控制器发送响应之前执行。

### 9. 即使在单线程之后，Node.js如何处理并发性？

[Node.js](https://www.geeksforgeeks.org/if-node-js-is-single-threaded-then-how-to-handles-concurrency/) 使用异步、非阻塞操作处理并发。它可以启动多个任务并在等待它们完成的同时继续处理，而不是等待一个任务完成然后再开始下一个任务，所有这些都在单个线程中完成。

### 10. 什么是Node.js中的控制流？

Node.js中的控制流是指执行语句和函数的顺序。它管理执行顺序，处理异步操作、回调和错误处理，以确保程序流的顺畅。

### 11. Node.js中的事件循环是什么意思？

Node.js 中的[事件循环](https://www.geeksforgeeks.org/node-js-event-loop/)是一种机制，允许它在单个线程中同时处理多个异步任务。它持续侦听事件并执行关联的回调函数。

### 12. 控制流语句的执行顺序是什么？

语句的执行顺序如下：

- 执行和队列处理
- 收集和存储数据
- 处理并发
- 执行下一行代码

### 13. Node.js的主要缺点是什么？

以下是下面列出的[Node.js](https://www.geeksforgeeks.org/the-pros-and-cons-of-node-js-in-web-development/)的一些主要缺点：

- 单线程性质：可能无法充分利用多核 CPU，从而限制性能。
- NoSQL 首选项：像 MySQL 这样的关系数据库并不常用。
- 快速 API 更改：频繁更新可能会引入不稳定和兼容性问题。

### 14. Node.js中的REPL是什么？

[REPL ](https://www.geeksforgeeks.org/node-js-repl-read-eval-print-loop/)在 Node.js 中代表读取、评估、打印和循环。它是一个类似于 shell 的计算机环境，可用于编写和调试代码，因为它在 on go 中执行代码。

### 15. [如何在Node.js中导入模块？](https://www.geeksforgeeks.org/import-and-export-in-node-js/)

我们使用 require 模块在 Node.js 中导入外部库。require（） 返回的结果存储在一个变量中，该变量用于使用点表示法调用函数。

### 16. Node.js 和 AJAX 有什么区别？

Node.js 是在服务器端运行的 JavaScript 运行时环境，而 AJAX 是在浏览器上运行的客户端编程语言。

### 17. Node.js package.json是什么？

[Node.js 中的package.json](https://www.geeksforgeeks.org/node-js-package-json/)是一个元数据文件，其中包含特定于项目的信息，例如依赖项、脚本、版本、作者详细信息以及管理和生成项目所需的其他配置设置。

### 18. 如何使用 node.js 编写 hello world？

Javascript 的

```javascript
const http = require('http');

// Create a server object
http.createServer(function (req, res) {
    res.write('Hello World!'); 
    res.end();
}).listen(3000);
```

从命令行运行此程序，并在浏览器窗口中查看输出。当浏览器通过 http://localhost:3000/ 发送请求时，此程序会在浏览器上打印 Hello World。

### 19. 现在最流行的Node.js框架是什么？

使用的最有名的Node.js框架是 Express.js，因为它具有高度可扩展性、高效性，并且只需很少的代码行即可创建应用程序。

### 20.Node.js中的promise是什么？

promise 基本上是 NodeJS 中回调的改进。换句话说，promise 是一个 JavaScript 对象，用于处理所有异步数据操作。在开发应用程序时，您可能会遇到使用大量嵌套回调函数的情况，这会导致回调地狱问题。Promise 解决了这个回调地狱的问题。



# 中级Node.js面试问题

将为具有 2 年以上经验的候选人寻找中级节点面试问题。

在面试期间，向您的中级申请人询问这 14 个中级Node.js面试问题中的一些，以测试他们的专业知识和经验。

1. 您对事件驱动编程了解多少？
2. 你知道Node.js中有哪些事件循环吗？
3. 请解释***一下 nextTick（）*** 在Node.js中的作用。
4. 请解释 ***setImmediate（）*** 在 Node.js 中的作用。
5. 您了解 ***EventEmitter*** Node.js是什么吗？
6. Node.js 中有多少个 API 函数？你能说出两个吗？
7. 您对 ***package.json*** 文件了解多少？
8. 在Node.js中使用 URL 模块的方法是什么？
9. 你明白Express.js包是什么吗？你能给我们一个定义吗？
10. 请解释您将如何进行基本的Express.js申请。
11. 请解释一下什么是Node.js流。
12. Node.js中有多少种类型的流？
13. 您需要提高哪些Node.js技能？解释你会如何变得更好。
14. 请告诉我们您将如何更新和删除依赖项。

## 中级Node.js面试问题和示例答案

以下是重要的中级Node.js面试问题的五个示例答案。参考这些答案来评估候选人回答的深度。



### 1. 您需要提高哪些Node.js技能？解释你会如何变得更好。

想要提高技能的开发人员非常适合您的组织，因此请考虑您的候选人是否旨在成长。有些人可能想提高他们的数据库管理技能，而另一些人可能打算专注于增加他们的Express.js知识。

他们的目标是如何改进与想要改进一样重要。了解他们如何最好地学习，他们是否喜欢通过完成新项目或通过培训来提高自己的技能。

尽管许多人力资源专业人士认为招聘开发人员是一个困难的过程，但有一种简单的方法可以实现这一目标。使用我们的[数据库管理和行政测试](https://www.testgorilla.com/test-library/role-specific-skills-tests/database-management-and-administration-test-2/)等技能测试来评估申请人的知识。

### 2. 你对事件驱动编程有什么了解？

事件驱动编程涉及使用事件来触发各种功能。留意那些可以举出一些事件示例的申请人，例如点击鼠标或按下键盘上的键。

考生应提及开发人员将函数链接到事件。然后，当用户触发事件时，系统将执行该函数。

### 3. 您对***package.json***文件了解多少？

具有Node.js经验的中级开发人员应该知道***package.json***文件包含特定项目的元数据。他们将能够解释此文件位于Node.js应用程序或模块的根目录中。

理想的响应还将指定元数据包含的内容，包括项目的版本、名称和依赖项详细信息。寻找提到文件向 NPM 包管理器提供信息以标识项目的答案。

### 4. 请解释一下什么是Node.js流。

流是开发人员经常用来连续读取或写入数据的Node.js对象。但是，它们还具有其他功能。

考生应该知道，流可以帮助开发人员完成各种任务，例如处理网络通信和轻松管理端到端信息交换。它们是 ***EventEmitter*** 类的实例，该类包含能够发出事件的每个对象。

### 5. Node.js有多少种类型的流？

熟悉流的申请人会知道有四种主要流类型：

- **可读流**用于从指定源读取数据
- **可写流**用于将数据写入指定源
- **双工流**用于读取和写入操作
- **转换流**是一种双工流，当系统计算相对于输入的输出时使用



### 21. 什么是Node.js中的事件驱动编程？

[事件驱动编程](https://www.geeksforgeeks.org/explain-event-driven-programming-in-node-js/)用于同步多个事件的发生，并使程序尽可能简单。事件驱动计划的基本组成部分包括：

- 触发事件时，将调用回调函数（称为事件处理程序）。
- 侦听事件触发器并调用该事件的相应事件处理程序的事件循环。

### 22. 什么是Node.js中的缓冲区？

Node.js 中的 [Buffer ](https://www.geeksforgeeks.org/what-is-buffer-in-node-js/)类用于对原始二进制数据执行操作。通常，缓冲区是指内存中的特定内存位置。缓冲区和数组有一些相似之处，但区别在于数组可以是任何类型，并且可以调整大小。缓冲区仅处理二进制数据，并且不能调整大小。缓冲区中的每个整数表示一个字节。console.log（） 函数用于打印 Buffer 实例。

### 23. [什么是Node.js流？](https://www.geeksforgeeks.org/node-js-streams/)

流是一种数据处理方法，用于按顺序将输入读取或写入输出。流用于以有效的方式处理读取/写入文件或交换信息。流模块提供用于实现流接口的 API。Node.js 中的流对象示例可以是对 HTTP 服务器的请求，而 process.stdout 都是流实例。

### 24. [解释Node.js中的加密模块](https://www.geeksforgeeks.org/what-is-crypto-module-in-node-js-and-how-it-is-used/)

[加密模块](https://www.geeksforgeeks.org/what-is-crypto-module-in-node-js-and-how-it-is-used/)用于加密、解密或散列任何类型的数据。这种加密和解密基本上有助于保护数据并为数据添加一层身份验证。加密模块的主要用例是将纯文本转换为加密格式，并在需要时对其进行解密。

### 25. 什么是回调地狱？

[回调地狱](https://www.geeksforgeeks.org/what-is-callback-hell-in-node-js/)是由于嵌套回调引起的问题。这会导致代码看起来像金字塔，并使其无法读取 为了克服这种情况，我们使用 promise。

### 26[. 解释Node.js中定时器模块的用](https://www.geeksforgeeks.org/node-js-timers-module/)法

Node.js 中的 Timers 模块包含各种函数，这些函数允许我们在设定的时间段后执行代码块或函数。Timers 模块是全局的，我们不需要使用 require（） 来导入它。

它有以下方法：

- [setTimeout（）](https://www.geeksforgeeks.org/what-is-the-purpose-of-settimeout-function-in-javascript/) 方法
- [setImmediate（）](https://www.geeksforgeeks.org/node-js-immediate-timer-class/) 方法
- [setInterval（）](https://www.geeksforgeeks.org/what-is-setinterval-in-javascript/) 方法

### 27. [setImmediate（） 和 process.nextTick（） 方法之间的区别](https://www.geeksforgeeks.org/difference-between-process-nexttick-and-setimmediate-methods/)

process.nextTick（） 方法用于在下一个事件队列的开头添加新的回调函数。在处理事件之前调用它。setImmediate 在下一个事件队列的检查阶段调用。它是在轮询阶段创建的，并在检查阶段调用。

### 28. setTimeout（） 和 setImmediate（） 方法有什么区别？

setImmediate 函数用于立即执行特定脚本，而 setTimeout 函数用于保存函数并在指定时间段后执行该函数。

### 29. [spawn（） 和 fork（） 方法有什么区别？](https://www.geeksforgeeks.org/difference-between-spawn-and-fork-methods-in-node-js/)

这两种方法都用于创建新的子进程，它们之间的唯一区别是 spawn（） 方法创建一个新函数，该函数 Node 从命令行运行，而 fork（） 函数创建现有 fork（） 方法的实例并创建多个工作线程来执行同一任务。

### 30[. 解释护照模块在Node.js中的使用](https://www.geeksforgeeks.org/explain-passport-in-node-js/)方法

passport 模块用于为我们的网站或 Web 应用程序添加身份验证功能。它实现了有助于执行登录操作的身份验证措施。

### 31. 什么是分叉Node.js？

Fork 是 Node.js 中用于创建子进程的方法。它有助于处理不断增加的工作量。它创建引擎的新实例，使多个进程能够运行代码。

### 32. [避免回调地狱的三种方法是什么？](https://www.geeksforgeeks.org/how-to-avoid-callback-hell-in-node-js/)

避免回调地狱的三种方法是：

- 使用 async/await（）
- 使用承诺
- 使用发电机

### 33. [Node.js 中的 body-parser 是什么？](https://www.geeksforgeeks.org/body-parser-middleware-in-node-js/)

Body-parser 是Node.js正文解析中间件。它负责在处理中间件之前解析传入的请求正文。它是一个 NPM 模块，用于处理在 HTTP 请求中发送的数据。

### 34. [什么是Node.js中的CORS？](https://www.geeksforgeeks.org/use-of-cors-in-node-js/)

[CORS](https://www.geeksforgeeks.org/use-of-cors-in-node-js/)一词代表“跨域资源共享”。跨域资源共享是由浏览器实现的一种基于 HTTP 标头的机制，它允许服务器或 API 指示除其源之外的任何源（在协议、主机名或端口方面不同），未知源从中获取访问和加载资源的权限。npm 注册表中提供的 cors 包用于解决 Node.js 应用程序中的 CORS 错误。

### 35. 解释一下 tls 模块Node.js？

tls 模块提供了基于 OpenSSL 构建的传输层安全性 （TLS） 和安全套接字层 （SSL） 协议的实现。它有助于在网络上建立安全连接。



> *如需进一步阅读，请查看我们关于*[中级节点面试问答](https://www.geeksforgeeks.org/nodejs-interview-questions-and-answers-intermediate-level/)*的专题文章**。在里面，你会发现20+问题和详细的答案。*

# 高级Node.js面试问题要问您的候选人

将为具有 5 年以上经验的经验丰富的开发人员提供 Node 面试问题。

在面试中向高级候选人询问这 50 个高级Node.js面试问题中的一些，以测试他们的熟练程度和能力。

1. 您能告诉我们REPL的含义以及它代表什么吗？
2. 请解释控制流功能的工作原理。
3. 你能解释一下 ***fork（）*** 方法是什么吗？
4. 请告诉我们 ***spawn（）*** 方法是什么。
5. 你能解释一下 ***fork（）*** 和 ***spawn（）*** 有什么不同吗？
6. 您对 ***Buffer*** 类了解多少？
7. 请解释一下管道在Node.js中指的是什么。
8. 你明白回调地狱是什么意思吗？请提供定义。
9. 您能解释一下Node.js中有哪些反应堆模式吗？
10. 您对Node.js中的测试金字塔了解多少？
11. 你知道退出代码在Node.js有什么作用吗？
12. 您能告诉我们什么是中间件吗？
13. 您能举几个 HTTP 请求的例子吗？
14. 您是否有将Node.js连接到MongoDB数据库的方法？
15. 你对***node_env***了解多少？
16. 请告诉我们Node.js的主要计时功能。
17. 你了解WASI是什么吗？你能解释一下为什么它很重要吗？
18. 你对 JavaScript 中的一流函数了解多少？
19. 您是否有管理Node.js项目中的包的方法？
20. 模块导出在Node.js中有什么作用？
21. 您是否使用任何工具来确保代码风格一致？
22. 事件循环按什么顺序执行控制流语句？
23. 为什么要在Node.js中使用基于事件的模型？
24. Node.js与阿贾克斯有何不同？
25. 请说明Node.js是否在 Windows 上运行。
26. 开发人员是否可以在Node.js中访问 DOM？解释为什么或为什么不。
27. 你认为为什么有些 Java 程序员喜欢Node.js？
28. 您能解释一下非阻塞在Node.js中的含义吗？
29. 将服务器和 Express 应用程序分开重要吗？解释为什么或为什么不。
30. 你对Node.js存根的理解是什么？
31. 开发人员与 Node.js 一起使用的最流行的框架是什么？
32. 说出Node.js中存在的两个安全实现。
33. 你知道libuv是什么吗？你能解释一下它在Node.js中的作用吗？
34. 简要描述Node.js中的全局对象。
35. 开发人员在哪种情况下应该在Node.js中使用 ***assert***？
36. 请解释一下 Connect 模块的作用。
37. 您对 Node.js 年的 LTS 版本了解多少？
38. Node.js有处理子线程的方法吗？解释你的答案。
39. 开发人员可以使用集群来增强Node.js的性能吗？解释如何操作。
40. 请解释什么是线程池。
41. 工作线程和集群之间有区别吗？解释你的答案。
42. 您是否有测量异步操作持续时间的方法？
43. 您对Node.js中的跟踪了解多少？
44. 请告诉我们Node.js是否支持加密。
45. 您能解释一下Node.js是否具有调试工具吗？
46. 您能解释一下 Punycode 在Node.js的背景下是什么吗？
47. 您能告诉我们Node.js的DNS查找功能是如何工作的吗？
48. 请解释一下 ***fs.stat（）*** 方法在Node.js中的作用。
49. 您能解释一下 Passport 是什么以及Node.js的作用吗？
50. 您对Node.js中的加密模块了解多少？

## 高级Node.js面试问题和示例答案

以下是五个重要的高级Node.js面试问题的示例答案。将候选人的回答与这些答案进行比较，以衡量他们的熟练程度。

### 1. Node.js与Ajax有何不同？

Node.js 是一种与 Ajax 不同的技术，每种技术都有不同的用途。开发人员使用客户端 Ajax 技术来完成服务器和客户端之间的异步通信。他们还使用此工具来避免在更新网页的某些部分时启动整页重新加载。

另一方面，Node.js 是用于实时创建应用程序的流行运行时环境——许多公司经常使用此服务器环境。

如果候选人能说出开发人员使用这些技术的一些应用程序，那么它们可能非常适合您的团队。例如，许多程序员在创建流媒体服务、在线游戏和聊天工具时使用Node.js。

另一方面，Ajax 通常用于向网页添加动态功能，例如聊天程序的实时更新和实时通知。

### 2. 请解释Node.js是否在 Windows 上运行。

Node.js确实可以在 Windows 上运行，但要寻找更全面的回答来证明申请人的专业知识。

考生应该知道 Node.js 是一个跨平台的运行时工具，因此开发人员可以在多个操作系统上运行它。他们可能会提到它可以在 macOS、Unix 和 Linux 上运行，并指出其跨平台功能的一些好处。

例如，如果他们说此功能有助于开发需要跨多个平台工作的应用程序，那么他们可能对Node.js有很好的了解。

### 3. 简要描述Node.js中的全局对象。

Node.js 中的全局对象是开发人员可以在所有模块中访问的一种对象。开发人员无需使用导入或要求语句即可在应用程序中访问和使用这些对象。相反，他们可以用值声明它们，并在程序中的任何位置访问它们。

如果考生想展示他们的经验，他们应该毫无问题地提供开发人员在Node.js中经常使用的全局对象示例。他们可能会提到的一些示例包括缓冲区、控制台和进程。

### 4. 请解释一下 Connect 模块的作用。

Connect 模块是一个组件或中间件框架。开发人员在处理各种类型的中间件时使用 Connect 模块，但您应该听取一个答案，该答案指定了该模块对开发人员有用的几种方式。

例如，它可以帮助开发人员完成一系列不同的活动，例如：

- 处理请求-响应周期中发生的错误
- 解析请求标头中的 Cookie
- 管理用户会话

### 5. 您能解释一下护照是什么以及Node.js的作用吗？

Passport 是开发人员在Node.js中使用的一种身份验证软件。它为程序员提供了一种在Node.js应用程序中实现用户身份验证的简单方法。

最好的回答会知道 Passport 可以支持多种身份验证机制，因此请考虑您的候选人是否可以说出以下三个身份验证支持示例：

- JSON Web 令牌
- 从 Google 或 Facebook 登录的社交信息
- 用户名和密码识别



### 36. [什么是Node.js集群？](https://www.geeksforgeeks.org/how-does-the-cluster-module-work/)

由于 node.js 中的单个线程，它可以更有效地处理内存，因为没有多个线程，因此不需要线程管理。现在，为了有效地处理工作负载并利用计算机多核系统，创建了群集模块，为我们提供了使子进程与单个父进程同时运行的方法。

### 37. [解释一些聚类方法Node.js](https://www.geeksforgeeks.org/how-does-the-cluster-module-work/)

- Fork（）：它从主进程创建一个新的子进程。如果当前进程为 master，则 isMaster 返回 true，否则返回 false。
- isWorker：如果当前进程是工作进程，则返回 true，否则返回 false。
- process：它返回全局的子进程。
- send（）：它从 worker 向 master 发送消息，反之亦然。
- kill（）：用于杀死当前工作线程。

### 38. [如何在Node.js中管理会话？](https://www.geeksforgeeks.org/session-management-using-express-session-module-in-node-js/)

可以使用 express-session 模块在node.js中完成会话管理。它有助于以键值形式保存数据。在此模块中，会话数据不保存在 cookie 本身中，仅保存会话 ID。

### 39. [解释Node.js中的流类型](https://www.geeksforgeeks.org/what-is-stream-and-its-types-in-node-js/)

流类型：

- 可读流：它是您可以从中以有序方式接收和读取数据的流。但是，您不能发送任何东西。例如，fs.createReadStream（） 允许我们读取文件的内容。
- 可写流：您可以按有序方式发送数据，但不允许接收回数据的流。例如，fs.createWriteStream（） 允许我们将数据写入文件。
- 双工流：它是可读和可写的流。因此，您可以同时发送和接收数据。例如，net.套接字是 TCP 套接字。
- 转换流：它是用于在读取数据时修改数据或转换数据的流。转换流本质上是双工的。例如，zlib.createGzip 流用于使用 gzip 压缩数据。

### 40. 我们如何在Node.js中实现身份验证和授权？

身份验证是验证用户身份的过程，而授权是确定可以执行哪些操作的过程。我们使用 Passport 和 JWT 等软件包来实现身份验证和授权。

### 41. 解释[一下Node.js中用于文件上传的软件包？](https://www.geeksforgeeks.org/file-uploading-in-node-js/)

Node.js 中用于文件上传的包是 Multer。可以使用此模块将文件上传到服务器。市场上还有其他模块，但 Multer 在文件上传方面非常受欢迎。Multer 是一个node.js中间件，用于处理 multipart/form-data，这是一个主要用于上传文件的库。

### 42. [解释 Node.js 和服务器端脚本语言（如 Python）之间的区别](https://www.geeksforgeeks.org/difference-between-node-js-and-python/)

Node.js是异步编程的最佳选择 Python 不是异步编程的最佳选择。Node.js 最适合小型项目，以实现需要较少脚本的功能。如果您正在开发大型项目，Python 是最佳选择。Node.js最适合内存密集型活动。不建议用于内存密集型活动。如果您的重点完全集中在 Web 应用程序和网站开发上，Node.js 是一个更好的选择。但是，Python 是一个多面手，可以执行多项任务，例如 Web 应用程序、与后端应用程序集成、数值计算、机器学习和网络编程。Node.js 是一个理想且充满活力的平台，可用于处理实时 Web 应用程序。Python 不是处理实时 Web 应用程序的理想平台。最快的速度和出色的性能很大程度上归功于Node.js基于 Chrome 的 V8，这是一款非常快速和强大的引擎。Python 比 Node.js 慢，由于 Node.js 基于快速而强大的 Chrome 的 V8 引擎，Node.js使用 JavaScript 解释器。Python 使用 PyPy 作为解释器。在错误处理和调试的情况下，Python 胜过Node.js。与Node.js相比，Python 中的错误处理花费的时间非常少，并且 Python 中的调试也非常容易。

### 43. 如何在Node.js中处理数据库连接？

为了处理Node.js中的数据库连接，我们使用 [MySQL ](https://www.geeksforgeeks.org/mysql-introdution/)的驱动程序和 Mongoose 等库来连接到 MongoDB 数据库。这些库提供了连接到数据库和执行查询的方法。

### 44. [如何在Node.js中读取命令行参数？](https://www.geeksforgeeks.org/how-to-read-command-line-arguments-in-node-js/)

命令行参数 （CLI） 是文本字符串，用于在应用程序通过操作系统的命令行界面运行时将其他信息传递给程序。我们可以很容易地通过节点中的全局对象（即进程对象）读取这些参数。方法如下：

步骤1：将文件另存为index.js并将以下代码粘贴到文件中。

Javascript 的



```javascript
let arguments = process.argv ; 
  
console.log(arguments) ;
```

步骤 2：使用以下命令运行index.js文件：

```
node index.js 
```

### 45.[ 解释 redis 模块Node.js](https://www.geeksforgeeks.org/node-js-redis-module/)

Redis 是一个用于存储数据结构的开源存储。它以多种方式使用。它用作数据库、缓存和消息代理。它可以存储数据结构，例如字符串、哈希、集合、排序集、位图、索引和流。Redis 对Node.js开发人员非常有用，因为它减少了缓存大小，从而提高了应用程序的效率。但是，将 Redis 与Node.js应用程序集成非常容易。

### 46. [什么是网络套接字？](https://www.geeksforgeeks.org/web-socket-in-node-js/)

Web 套接字是一种提供全双工（多路）通信的协议，即允许同时在两个方向上进行通信。它是一种现代 Web 技术，其中用户的浏览器（客户端）和服务器之间存在连续连接。在这种类型的通信中，在 Web 服务器和 Web 浏览器之间，它们都可以在任何时间点相互发送消息。传统上，在网络上，我们有一种请求/响应格式，用户发送一个HTTP请求，服务器对此做出响应。这在大多数情况下仍然适用，尤其是那些使用 RESTful API 的情况。但是，服务器也需要与客户端通信，而不会被客户端轮询（或请求）。服务器本身应该能够向客户端或浏览器发送信息。这就是 Web Socket 的用武之地。

### 47[. 解释 util 模块Node.js](https://www.geeksforgeeks.org/node-js-utility-module/)

node.js 中的 Util 模块提供对各种实用程序功能的访问。node.js模块库中提供了各种实用程序模块。

- 操作系统模块：操作系统模块提供用于node.js的基于操作系统的实用程序模块。
- 路径模块：node.js 中的路径模块用于转换和处理各种文件路径。
- DNS 模块：DNS 模块使我们能够使用底层操作系统名称解析功能。实际的 DNS 查找也由 DNS 模块执行。
- 网络模块：node.js中的网络模块用于创建客户端和服务器。与 DNS 模块类似，此模块也提供异步网络包装器。

### 48. [如何处理Node.js中的环境变量？](https://www.geeksforgeeks.org/setting-up-environment-variables-in-node-js-in-a-platform-independent-way/)

我们使用 process.env 来处理Node.js中的环境变量。我们可以在 .env 文件中指定环境配置和密钥。为了访问应用程序中的变量，我们使用“process.env.VARIABLE_NAME”语法。要使用它，我们必须使用以下命令安装 dotenv 软件包：

```bash
npm install dotenv
```

### 49. [解释 DNS 模块Node.js](https://www.geeksforgeeks.org/node-js-dns/)

DNS是一个节点模块，用于执行由操作系统提供的名称解析功能，并用于执行实际的DNS查找。它的主要优点是不需要记住 IP 地址——DNS 服务器为将域名或子域名转换为 IP 地址提供了漂亮的解决方案。

### 50. Node.js中的子进程是什么？

通常，Node.js允许单线程、非阻塞性能，但在 CPU 中运行单个线程无法处理不断增加的工作负载，因此 child_process 模块可用于生成子进程。子进程使用内置消息传递系统相互通信。

### 51. [什么是Node.js中的追踪？](https://www.geeksforgeeks.org/node-js-tracing-objects/)

跟踪对象用于一组类别，用于启用和禁用跟踪。创建跟踪事件时，通过调用 tracing.enable（） 方法禁用跟踪对象，然后将类别添加到启用的跟踪集中，并且可以通过调用 tracing.categories 进行访问。

> 如需进一步阅读，请查看我们关于[高级节点面试问题的](https://www.geeksforgeeks.org/nodejs-interview-questions-and-answers-advanced-level/)专门文章。在里面，你会发现20+问题和详细的答案。

# Node.js关于技能的面试问题

在面试Node.js，向应聘者询问一些关于技能和能力的问题，以评估他们的技术和非技术知识。

1. 您如何评价您的MongoDB技能？
2. 您的工程经理如何评价您的数据库开发技能？
3. 为什么时间管理技能对Node.js开发人员至关重要？
4. 为什么解决问题是Node.js开发人员的一项关键技能？
5. 您的工程经理如何评价您的调试能力？
6. 为什么Express.js框架知识对Node.js开发人员很重要？
7. 沟通对Node.js开发人员重要吗？解释你的答案。
8. Azure 知识对Node.js开发人员有用吗？解释你的答案。
9. 对细节的关注是Node.js开发人员的一项重要技能吗？解释原因。
10. 请告诉我们为什么 UX 和 UI 知识对Node.js开发人员很重要。
11. 您能告诉我们为什么 Git 知识对Node.js开发人员来说至关重要吗？
12. 请解释为什么前端开发技能对Node.js开发人员很重要。

## 5 个关于技能的Node.js面试问题和示例答案

以下是五个关于技能Node.js面试问题的示例答案。在查看候选人的回答时，请参阅提供的答案。

### 1. 您如何评价自己的 MongoDB 技能？

具有 MongoDB 技能的开发人员可以完成灵活的数据建模任务，并以精选文档的形式访问数据，这使Node.js可以轻松访问它们。因此，找到具有顶级MongoDB技能的申请人是关键。

如果您需要评估申请人的 MongoDB 技能，请不要忘记将我们的 [MongoDB 在线测试](https://www.testgorilla.com/test-library/software-skills-tests/mongodb-test/)纳入您的评估中。

### 2. 为什么Express.js框架知识对Node.js开发人员很重要？

申请人应该知道，这个服务器框架是建立在Node.js之上的，它对于使用服务器管理方法访问数据很有用。

Express.js 服务器框架为 Web 和移动应用程序提供了多种功能，因此非常适合使用 Node.js 创建这些类型的应用程序的开发人员。因此，如果您的申请人具有Express.js专业知识，它会有所帮助。

你需要一种方法来评估这项技能吗？在面试申请人之前，请使用我们的[Express.js测试](https://www.testgorilla.com/test-library/programming-skills-tests/express-js-test/)来测试他们的能力。

### 3. 请告诉我们为什么 UX 和 UI 知识对Node.js开发人员很重要。

并非所有Node.js开发人员都需要设计技能，但 UX 和 UI 经验可能是有益的。这可能意味着创建一个对用户没有吸引力的沉闷应用程序和一个设计令人愉悦的结构良好的应用程序之间的区别。

UX 和 UI 体验还有助于开发人员与团队中的设计人员协作，并分享有关应用程序结构的想法。

为了评估你的开发人员的UX和UI知识，你可以在他们回复你的职位发布后立即在评估阶段使用我们的[UX/UI设计测试](https://www.testgorilla.com/test-library/role-specific-skills-tests/ux-ui-design-test/)。

### 4. 您能告诉我们为什么 Git 知识是Node.js开发人员的基础吗？

Git 是一个代码版本控制应用程序，可帮助开发人员监控对其代码的更改。为了有效地协作和管理代码，大多数Node.js开发人员都需要 Git 知识。

请留意那些最近有使用 Git 经验的候选人，他们可以提供它如何帮助他们完成项目的示例。例如，一些开发人员可能会受益于该工具的历史记录跟踪功能或方便的代码备份选项。其他人可能会欣赏它支持开发人员之间的协作。

评估申请人 Git 技能的最简单方法是使用我们的 [Git 技能测试](https://www.testgorilla.com/test-library/software-skills-tests/git-test/)。在雇用开发人员之前，在评估中使用此测试来评估候选人的技能。

### 5. Azure 知识对Node.js开发人员有益吗？解释你的答案。

Azure 以多种方式支持Node.js开发。由于此云计算平台为开发人员提供了构建可缩放的云应用程序的机会，因此 Azure 知识可以使Node.js开发人员受益。

Azure 云平台具有许多优势。它可以加快应用程序开发速度，提高云安全性，并增强应用程序资源的可靠性。

最好在招聘前评估申请人的 Azure 技能，尤其是在云应用程序开发对组织很重要的情况下。请确保使用我们的 [Microsoft Azure 测试](https://www.testgorilla.com/test-library/programming-skills-tests/microsoft-azure-test/)来完成评估过程。

# 手写模块实现

## 简单实现 Node 的 Events 模块

参考回答：

简介：观察者模式或者说订阅模式，它定义了对象间的一种一对多的关系，让多个观察者对象同时监听某一个主题对象，当一个对象发生改变时，所有依赖于它的对象都将得到通知。

node 中的 Events 模块就是通过观察者模式来实现的：

```js
var events = require("events");
var eventEmitter = new events.EventEmitter();
eventEmitter.on("say", function (name) {
	console.log("Hello", name);
});
eventEmitter.emit("say", "Jony yu");
```

这样，eventEmitter 发出 say 事件，通过 On 接收，并且输出结果，这就是一个订阅模式的实现，下面我们来简单的实现一个 Events 模块的 ventEmitter。

(1)实现简单的 Event 模块的 emit 和 on 方法

```js
function Events() {
	this.on = function (eventName, callBack) {
		if (!this.handles) {
			this.handles = {};
		}
		if (!this.handles[eventName]) {
			this.handles[eventName] = [];
		}
		this.handles[eventName].push(callBack);
	};
	this.emit = function (eventName, obj) {
		if (this.handles[eventName]) {
			for (var i = 0; o < this.handles[eventName].length; i++) {
				this.handles[eventName][i](obj);
			}
		}
	};
	return this;
}
```

这样我们就定义了 Events，现在我们可以开始来调用：

```js
var events = new Events();
events.on("say", function (name) {
	console.log("Hello", nama);
});
events.emit("say", "Jony yu");
// 结果就是通过 emit 调用之后，输出了 Jony yu
```

(2)每个对象是独立的

因为是通过 new 的方式，每次生成的对象都是不相同的，因此：

```js
var event1 = new Events();
var event2 = new Events();
event1.on("say", function () {
	console.log("Jony event1");
});
event2.on("say", function () {
	console.log("Jony event2");
});
event1.emit("say");
event2.emit("say");
// event1、event2 之间的事件监听互相不影响
// 输出结果为'Jony event1' 'Jony event2'
```

