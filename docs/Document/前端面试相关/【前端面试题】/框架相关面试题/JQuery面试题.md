# JQuery面试题

[jQuery - 廖雪峰的官方网站 (liaoxuefeng.com)](https://www.liaoxuefeng.com/wiki/1022910821149312/1023022609723552)

### 1、JQuery 的源码看过吗？能不能简单概况一下它的实现原理？

考察学习知识的态度，是否仅仅是停留在使用层面，要知其然知其所以然

### 2、jQuery.fn 的 init 方法返回的 this 指的是什么对象？为什么要返回 this？

this 执行 init 构造函数自身，其实就是 jQuery 实例对象，返回 this 是为了实现 jQuery 的链式操作

### 3、jquery 中如何将数组转化为 json 字符串，然后再转化回来？

```js
$.parseJSON('{"name":"John"}');
JSON.stringify;
```

### 4、jQuery 的属性拷贝(extend)的实现原理是什么，如何实现深拷贝？

递归赋值

` .extend`：在 `jQuery` 中，`.extend∗：在 ∗jQuery∗ 中，∗.extend(deep,target,object1,objectN)` 方法可以进行深浅拷贝。

`deep` 如过设为 `true` 为深拷贝，默认是 `false` 浅拷贝。

### 5、jquery.extend 与 jquery.fn.extend 的区别？

Jquery.extend 用来扩展 jQuery 对象本身；jquery.fn.extend 用来扩展 jQuery 实例

### 6、谈一下 Jquery 中的 bind(),live(),delegate(),on()的区别？

jquery1.7 以后就推荐使用 on 的方式来进行事件绑定了

### 7、JQuery 一个对象可以同时绑定多个事件，这是如何实现的？

可以同时绑定多个事件，低层实现原理是使用 addEventListner 与 attachEvent 兼容处理做事件注册

### 4、Jquery 与 jQuery UI 有啥区别？

jQuery 是操作 dom 的框架，jQueryUI 是基于 jQuery 做的一个 UI 组件库

### 5、jQuery 和 Zepto 的区别？各自的使用场景？

jQuery 主要用于 pc 端，当然有对应的 jQuerymobile 用于移动端，zepto 比 jQuery 更加小巧，主要用于移动端

jquer mobile 相对于 zepto 功能强大，但是体积也很庞大，zepto 非常的轻量

### 6、针对 jQuery 的优化方法？

a、优先使用 ID 选择器
b、jquery 获取到的 DOM 元素如果需要多次使用，建议使用一个变量将其保存起来，因为操作 DOM 的过程是非常耗费性能的
c、在 class 前使用 tag(标签名)
d、给选择器一个上下文
e、慎用 .live()方法（应该说尽量不要使用）
f、使用 data()方法存储临时变量

### `jQuery` 的事件委托方法 `bind 、live、delegate、one、on` 之间有什么区别？

参考答案：

这几个方法都可以实现事件处理。其中 `on` 集成了事件处理的所有功能，也是目前推荐使用的方法。

`one` 是指添加的是一次性事件，意味着只要触发一次该事件，相应的处理方法执行后就自动被删除。

`bind` 是较早版本的绑定事件的方法，现在已被 `on` 替代。

`live` 和 `delegate` 主要用来做事件委托。`live` 的版本较早，现在已被废弃。`delegate` 目前仍然可用，不过也可用 `on` 来替代它。

### `$(document).ready` 方法和 `window.onload` 有什么区别？

参考答案：

主要有两点区别：

1. 执行时机

`window.onload` 方法是在网页中的所有的元素(包括元素的所有关联文件)都完全加载到浏览器之后才执行。而通过 `jQuery` 中的`$(document).ready`方法注册的事件处理程序，只要在 `DOM` 完全就绪时，就可以调用了，比如一张图片只要`<img>`标签完成，不用等这个图片加载完成，就可以设置图片的宽高的属性或样式等。

其实从二者的英文字母可以大概理解上面的话，`onload` 即加载完成，`ready` 即 `DOM` 准备就绪。

1. 注册事件

`$(document).ready`方法可以多次使用而注册不同的事件处理程序，而 `window.onload` 一次只能保存对一个函数的引用，多次绑定函数只会覆盖前面的函数。

### jquery 中.get()提交和.get()提交和.post()提交有区别吗？

参考答案：

相同点：都是异步请求的方式来获取服务端的数据

不同点：

- 请求方式不同：`$.get()` 方法使用 `GET` 方法来进行异步请求的。`$.post()` 方法使用 `POST` 方法来进行异步请求的。
- 参数传递方式不同： `GET` 请求会将参数跟在 `URL` 后进行传递，而 `POST` 请求则是作为 `HTTP` 消息的实体内容发送给 `Web` 服务器 的，这种传递是对用户不可见的。
- 数据传输大小不同： `GET` 方式传输的数据大小不能超过 `2KB` 而 `POST` 要大的多
- 安全问题： `GET` 方式请求的数据会被浏览器缓存起来，因此有安全问题。

### 7、Zepto 的点透问题如何解决？

点透主要是由于两个 div 重合，例如：一个 div 调用 show()，一个 div 调用 hide()；

这个时候当点击上面的 div 的时候就会影响到下面的那个 div；

解决办法主要有 2 种：

1.github 上有一个叫做 fastclick 的库，它也能规避移动设备上 click 事件的延迟响应，<https://github.com/ftlabs/fastclick>

将它用 script 标签引入页面（该库支持 AMD，于是你也可以按照 AMD 规范，用诸如 require.js 的模块加载器引入），并且在 dom ready 时初始化在 body 上。

2.根据分析，如果不引入其它类库，也不想自己按照上述 fastclcik 的思路再开发一套东西，需要 1.一个优先于下面的"divClickUnder"捕获的事件；

2.并且通过这个事件阻止掉默认行为（下面的"divClickUnder"对 click 事件的捕获，在 ios 的 safari，click 的捕获被认为和滚屏、点击输入框弹起键盘等一样，是一种浏览器默认行为，即可以被 event.preventDefault()阻止的行为）。

### jQuery 使用建议

1. 尽量减少对 dom 元素的访问和操作
2. 尽量避免给 dom 元素绑定多个相同类型的事件处理函数，可以将多个相同类型事件处理函数合并到一个处理函数，通过数据状态来处理分支

3. 尽量避免使用 toggle 事件

### 如何在 `jquery` 上扩展插件，以及内部原理

参考答案：

通过 `$.extend(object);` 为整个 `jQuery` 类添加新的方法。

例如：

```javascript
$.extend({
	sayHello: function (name) {
		console.log("Hello," + (name ? name : "World") + "!");
	},
	showAge() {
		console.log(18);
	},
});

// 外部使用
$.sayHello(); // Hello,World!  无参调用
$.sayHello("zhangsan"); // Hello,zhangsan! 带参调用
```

通过 `$.fn.extend(object);` 给 `jQuery` 对象添加方法。

例如：

```javascript
$.fn.extend({
	swiper: function (options) {
		var obj = new Swiper(options, this); // 实例化 Swiper 对象
		obj.init(); // 调用对象的 init 方法
	},
});

// 外部使用
$("#id").swiper();
```

**extend 方法内部原理**

```css
jQuery.extend( target [, object1 ] [, objectN ] )
```

对后一个参数进行循环，然后把后面参数上所有的字段都给了第一个字段，若第一个参数里有相同的字段，则进行覆盖操作，否则就添加一个新的字段。

解析如下：

```js
// 为与源码的下标对应上，我们把第一个参数称为第0个参数，依次类推
jQuery.extend = jQuery.fn.extend = function () {
	var options,
		name,
		src,
		copy,
		copyIsArray,
		clone,
		target = arguments[0] || {}, // 默认第0个参数为目标参数
		i = 1, // i表示从第几个参数凯斯想目标参数进行合并，默认从第1个参数开始向第0个参数进行合并
		length = arguments.length,
		deep = false; // 默认为浅度拷贝

	// 判断第0个参数的类型，若第0个参数是boolean类型，则获取其为true还是false
	// 同时将第1个参数作为目标参数，i从当前目标参数的下一个
	// Handle a deep copy situation
	if (typeof target === "boolean") {
		deep = target;

		// Skip the boolean and the target
		target = arguments[i] || {};
		i++;
	}

	//  判断目标参数的类型，若目标参数既不是object类型，也不是function类型，则为目标参数重新赋值
	// Handle case when target is a string or something (possible in deep copy)
	if (typeof target !== "object" && !jQuery.isFunction(target)) {
		target = {};
	}

	// 若目标参数后面没有参数了，如$.extend({`name:'wenzi'}), $.extend(true, {`name:'wenzi'})
	// 则目标参数即为jQuery本身，而target表示的参数不再为目标参数
	// Extend jQuery itself if only one argument is passed
	if (i === length) {
		target = this;
		i--;
	}

	// 从第i个参数开始
	for (; i < length; i++) {
		// 获取第i个参数，且该参数不为null，
		// 比如$.extend(target, {}, null);中的第2个参数null是不参与合并的
		// Only deal with non-null/undefined values
		if ((options = arguments[i]) != null) {
			// 使用for~in获取该参数中所有的字段
			// Extend the base object
			for (name in options) {
				src = target[name]; // 目标参数中name字段的值
				copy = options[name]; // 当前参数中name字段的值

				// 若参数中字段的值就是目标参数，停止赋值，进行下一个字段的赋值
				// 这是为了防止无限的循环嵌套，我们把这个称为，在下面进行比较详细的讲解
				// Prevent never-ending loop
				if (target === copy) {
					continue;
				}

				// 若deep为true，且当前参数中name字段的值存在且为object类型或Array类型，则进行深度赋值
				// Recurse if we're merging plain objects or arrays
				if (
					deep &&
					copy &&
					(jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))
				) {
					// 若当前参数中name字段的值为Array类型
					// 判断目标参数中name字段的值是否存在，若存在则使用原来的，否则进行初始化
					if (copyIsArray) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];
					} else {
						// 若原对象存在，则直接进行使用，而不是创建
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// 递归处理，此处为2.2
					// Never move original objects, clone them
					target[name] = jQuery.extend(deep, clone, copy);

					// deep为false，则表示浅度拷贝，直接进行赋值
					// 若copy是简单的类型且存在值，则直接进行赋值
					// Don't bring in undefined values
				} else if (copy !== undefined) {
					// 若原对象存在name属性，则直接覆盖掉；若不存在，则创建新的属性
					target[name] = copy;
				}
			}
		}
	}

	// 返回修改后的目标参数
	// Return the modified object
	return target;
};
```

### 你觉得 jQ3uery 源码有哪些写的好的地方

- jquery 源码封装在一个匿名函数的自执行环境中，有助于防止变量的全局污染，然后通过传入 window 对象参数，可以使 window 对象作为局部变量使用，好处是当 jquery 中访问 window 对象的时候，就不用将作用域链退回到顶层作用域了，从而可以更快的访问 window 对象。同样，传入 undefined 参数，可以缩短查找 undefined 时的作用域链
- jquery 将一些原型属性和方法封装在了 jquery.prototype 中，为了缩短名称，⼜赋值给了 jquery.fn ，这是很形象的写法
- 有一些数组或对象的方法经常能使用到， jQuery 将其保存为局部变量以提高访问速度
- jquery 实现的链式调用可以节约代码，所返回的都是同一个对象，可以提高代码效率



# 待定

### 1. 什么是jQuery？

jQuery 是一个开源 JavaScript 库，它简化了 HTML/CSS 文档之间的交互，或者更准确地说是文档对象模型（DOM） 和 JavaScript。 jQuery 简化了 HTML 文档遍历和操作、浏览器事件处理、DOM 动画、Ajax 交互和跨浏览器 JavaScript 开发。

### 2. jQuery是否适用于HTML和XML文档？

是的，jQuery旨在与HTML和XML文档无缝协作。jQuery 的核心功能（如 DOM 遍历和操作、事件处理和 AJAX 操作）适用于 HTML 和 XML。

### 3. 什么是jQuery选择器？

jQuery 选择器选择 HTML 元素并允许您操作 HTML 元素。它选择变量参数上的 HTML 元素，例如它们的名称、类、id、类型、属性、属性值等。jQuery中的所有选择器都是使用特殊符号（即美元符号和括号）选择的：

```
$("selector-name")
```

- 元素选择器：元素选择器根据元素的名称选择元素。 例：

  ```
  $("h1")
  ```

- Id 选择器：id 选择器根据元素的 id 选择元素。 例：

  ```
  $("#gfg")
  ```

- 类选择器：类选择器根据元素的类来选择元素。 例：

  ```
  $(".GFG")
  ```

### 4. jQuery的优点是什么？

- 它包含广泛的插件。jQuery 允许开发人员在 JavaScript 库之上创建插件。
- 大型开发社区。
- 它有一个良好而全面的文档。
- 它包含许多JavaScript库，与标准JavaScript相比，它易于使用。
- jQuery 让用户可以轻松开发 Ajax 模板，Ajax 支持更时尚的界面，可以在页面上执行操作，而无需重新加载整个页面。
- 轻量级和强大的链接功能使 jQuery 更加强大。

### 5. 提供效果的jQuery方法有哪些？

下面列出了一些提供效果的方法：

- [jQuery toggle()方法](https://www.geeksforgeeks.org/jquery-toggle-method/)
- [jQuery slideDown()方法](https://www.geeksforgeeks.org/jquery-slidedown-method/)
- [jQuery Effect fadeOut()方法](https://www.geeksforgeeks.org/jquery-effect-fadeout-method/)
- [jQuery fadeToggle()方法](http://geeksforgeeks.org/jquery-fadetoggle-method/)

### 6. jQuery 中 empty（）、remove()和 detach()methos 之间的区别？

- [jQuery empty()方法：](https://www.geeksforgeeks.org/jquery-empty-with-examples/)empty()方法删除所选元素的所有子节点及其内容。
- [jQuery remove()方法：](http://geeksforgeeks.org/jquery-remove/)remove()方法删除所有选定的元素，包括所有文本。此方法还会删除所选元素的数据和所有事件。
- [jQuery detach()方法：](https://www.geeksforgeeks.org/jquery-detach-with-examples/)detach()方法从 DOM 树中删除选定的元素，包括其所有文本和子节点，但保留数据和事件。文档对象模型 （DOM） 是万维网联合会的标准。这定义了访问 DOM 树中的元素。

注意：remove()方法比 empty()或 detach()方法更快。

### 7. jQuery是JavaScript还是JSON库文件？

jQuery 是一个 JavaScript 文件库，它由 DOM 事件效果和 Ajax 函数组成。jQuery 据称是一个 JavaScript 文件。

### 8.Jquery中提供了哪些ajax函数？

Ajax 允许用户与服务器交换数据并更新页面的某些部分，而无需重新加载整个页面。ajax 的一些功能如下：

- [jQuery ajaxSetup()方法：](https://www.geeksforgeeks.org/jquery-ajaxsetup-method/)ajaxSetup()方法为将来的 AJAX 请求设置默认值。
- [jQuery ajax()方法：](http://geeksforgeeks.org/jquery-ajax-method/)ajax()方法执行 AJAX 请求或异步 HTTP 请求。
- [jQuery getScript()方法：](https://www.geeksforgeeks.org/jquery-getscript-method/)getScript()方法使用 AJAX HTTP GET 请求运行 JavaScript。
- [jQuery getJSON()方法：](https://www.geeksforgeeks.org/jquery-getjson-method/)getJSON()方法使用 GET HTTP 请求从服务器获取 JSON 编码的数据。

### 9. 提及与 jQuery 兼容的操作系统

jQuery 本身是一个 JavaScript 库，因此不依赖于任何特定的操作系统。它与多种操作系统兼容，因为它在客户端的 Web 浏览器中运行。因此，jQuery 与平台无关，您可以在任何支持现代 Web 浏览器的操作系统上使用它。

jQuery 兼容性的关键因素是 Web 浏览器，而不是底层操作系统。jQuery与主要的Web浏览器兼容，包括：

- 谷歌浏览器
- Mozilla Firefox浏览器
- Microsoft边缘
- Safari浏览器
- 歌剧

### 10. 如何在 ASP.Net 项目中包含jQuery库？

从 jQuery.com 下载 jQuery 库，并将该引用包含在 asp.net 页面中。

### 11. 解释 jQuery 中的 bind() vs live() vs delegate()方法

bind： 绑定事件，对新添加的事件不起作用，方法用于将一个处理程序附加到每个匹配元素的事件上并返回 jQuery 对象。

live： 方法将一个事件处理程序附加到与当前选择器匹配的所有元素(包含现有的或将来添加的)的指定事件上并返回 jQuery 对象。

delegate： 方法基于一组特定的根元素将处理程序附加到匹配选择器的所有元素(现有的或将来的)的一个或多个事件上。

最佳实现：on() off()



bind()方法不会将事件附加到加载 DOM 后添加的元素，而 live()和 delegate()方法也会将事件附加到将来的元素。

live()和 delegate()方法之间的区别在于 live()函数在链接中不起作用。它只适用于选择器或元素，而 delegate()方法适用于链接。

### `jquery` 事件委托

参考答案：

在 `jquery` 中使用 `on` 来绑定事件的时候，传入第二个参数即可。例如：

```js
$("ul").on("click", "li", function () {
	alert(1);
});
```

### 怎么用原生的 js 实现 jquery 的一个特定方法

::: details 查看参考回答

略

:::

### window.onload 和$(document).ready

> 原生 JS 的 window.onload 与 Jquery 的 `$(document).ready(function(){})` 有什么不同？如何用原生 JS 实现 Jq 的 ready 方法？

- window.onload() 方法是必须等到页面内包括图片的所有元素加载完毕后才能执行。
- $(document).ready() 是 DOM 结构绘制完毕后就执行，不必等到加载完毕

```js
function ready(fn) {
	if (document.addEventListener) {
		// 标准浏览器
		document.addEventListener(
			"DOMContentLoaded",
			function () {
				//注销事件, 避免反复触发
				document.removeEventListener(
					"DOMContentLoaded",
					arguments.callee,
					false
				);
				fn(); //执行函数
			},
			false
		);
	} else if (document.attachEvent) {
		// IE
		document.attachEvent("onreadystatechange", function () {
			if (document.readyState == "complete") {
				document.detachEvent("onreadystatechange", arguments.callee);
				fn(); // 函数执行
			}
		});
	}
}
```



### 原生 JS 的 window.onload 与 Jquery 的 `$(document).ready(function(){})`有什么不同？如何用原生 JS 实现 Jq 的 ready 方法？

**触发时间：** document.onload 事件在整个页面(包括所有图片、样式表、脚本等)都完全加载完毕后才会触发。这意味着，如果页面中有大量资源需要加载，用户可能需要等待一段时间才能看到 document.onload 事件触发的效果。相比之下，`$(document).ready()` 事件在 DOM(Document Object Model，文档对象模型)结构绘制完成后就会触发，不必等待所有的外部资源如图片和样式表加载完成。因此，一般来说，`$(document).ready()` 的触发时间要早于 document.onload。

**用途：** `$(document).ready()` 更适合于需要在 DOM 结构绘制完成后立即执行的代码，例如修改页面元素的样式或绑定事件处理器等。而 document.onload 更适合于需要等待所有资源都加载完成后再执行的代码，例如需要图片资源才能正确显示的动画效果等。

`window.onload()`方法是必须等到页面内包括图片的所有元素加载完毕后才能执行。

`$(document).ready()`是 DOM 结构绘制完毕后就执行，不必等到加载完毕。

```js
/*

* 传递函数给 whenReady()
* 当文档解析完毕且为操作准备就绪时，函数作为 document 的方法调用
  */
var whenReady = (function () {
	//这个函数返回 whenReady()
	函数;
	var funcs = []; //当获得事件时，要运行的函数
	var ready = false; //当触发事件处理程序时,切换为 true
	//当文档就绪时,调用事件处理程序
	function handler(e) {
		if (ready) return; //确保事件处理程序只完整运行一次
		//如果发生 onreadystatechange 事件，但其状态不是 complete 的话,那么文
		档尚未准备好;
		if (e.type === "onreadystatechange" && document.readyState !== "complete") {
			return;
		}
		//运行所有注册函数
		//注意每次都要计算 funcs.length
		//以防这些函数的调用可能会导致注册更多的函数
		for (var i = 0; i < funcs.length; i++) {
			funcs[i].call(document);
		}
		//事件处理函数完整执行,切换 ready 状态, 并移除所有函数
		ready = true;
		funcs = null;
	}
	//为接收到的任何事件注册处理程序
	if (document.addEventListener) {
		document.addEventListener("DOMContentLoaded", handler, false);
		document.addEventListener("readystatechange", handler, false); //IE9+
		window.addEventListener("load", handler, false);
	} else if (document.attachEvent) {
		document.attachEvent("onreadystatechange", handler);
		window.attachEvent("onload", handler);
	}
	//返回 whenReady()函数
	return function whenReady(fn) {
		if (ready) {
			fn.call(document);
		} else {
			funcs.push(fn);
		}
	};
})();
```

如果上述代码十分难懂，下面这个简化版：

```js
function ready(fn){
if(document.addEventListener) {//标准浏览器
document.addEventListener('DOMContentLoaded', function() {
//注销事件, 避免反复触发
document.removeEventListener('DOMContentLoaded',arguments.c
allee, false);
fn();//执行函数
}, false);
}else if(document.attachEvent) {//IE
document.attachEvent('onreadystatechange', function() {
if(document.readyState == 'complete') {
document.detachEvent('onreadystatechange',
arguments.callee);
fn();//函数执行
}
});
}
};
```



### 12. 编写给出 jQuery 版本的命令？

命令 **`$.ui.version`** 返回 jQuery UI 版本。

### jQuery 的 slideUp 动画 

**如果目标元素是被外部事件驱动, 当鼠标快速地连续触发外部元素事件, 动画会滞后的反复执行该如何处理呢?**

先 stop(true,true)后 slideUp()

### 13. 什么是jQuery connect？

jQuery connect 是用于连接或绑定一个函数或将另一个函数绑定的插件。Connect 用于执行来自其他函数或插件的函数。

### 14. 如何使用连接？

从 jQuery.com 下载jQuery连接文件，并将该文件包含在HTML文件中。使用 $.connect 函数将一个函数连接到另一个函数。

### 15. [param()方法在 JQuery 中的用途是什么？](https://www.geeksforgeeks.org/jquery-param-method/)

param()方法创建对象的序列化表示形式。

### 16. jQuery 中 $（this） 和 this 之间的区别？

this 和 $（this） 引用是相同的，但区别在于“this”以传统方式使用，但当“this”与 $()一起使用时，它就变成了一个 jQuery 对象。

### 17. 查找方法和子方法的区别？

[find（）](https://www.geeksforgeeks.org/jquery-find-with-examples/) 方法查找所选元素的所有后代元素，[children（）](https://www.geeksforgeeks.org/jquery-children-with-examples/) 方法查找与该选定元素相关的所有子元素。

### 18. jQuery可以在什么场景下使用？

jQuery可用于以下场景：

- 主要用于动画效果
- 操纵目的
- 对事件调用函数
- 应用 CSS 静态或动态

### 19. 如何在jQuery中读取、写入和删除cookie？

我们可以使用 **Dough cookie 插件**在 jquery 中处理 cookie。面团易于使用，功能强大。

- 创建 cookie： $.dough（“cookie_name”， “cookie_value”）;
- 读取 Cookie： $.dough（“cookie_name”）;
- 删除 cookie： $.dough（“cookie_name”， “remove”）;

### 20. jQuery在Web应用程序中使用的功能是什么？

jQuery 在 Web 应用程序中使用滑动、文件上传和 accordian 等功能。

jQuery 是一个开源 JavaScript 库，它简化了 HTML/CSS 文档之间的交互，它以其“少写多做”的理念而闻名。您可以按照此 [jQuery 教程](https://www.geeksforgeeks.org/jquery-tutorials/)和 [jQuery 示例](https://www.geeksforgeeks.org/jquery-examples/)从头开始学习 jQuery。

1. **jQuery中的基本选择器是什么？**
   以下是jQuery中的基本选择器：

   - 元素 ID
   - CSS 名称
   - 标签名称
   - DOM 层次结构

2.   

3. 

4. jQuery Events 中有哪些类别？

   - 形式
   - 键盘
   - 鼠
   - 浏览器
   - 文档加载

5.   

6. **jQuery浏览器相关的问题是什么？**
   与 jQuery 插件的浏览器兼容是一个问题。

7.   

8. **[css()方法在 JQuery 中有什么用？](https://www.geeksforgeeks.org/jquery-css-method/)**
   JQuery 中的 css()方法用于更改所选元素的样式属性。JQuery 中的 css()属性可以以不同的方式使用。

9.   

10. **JavaScript 和 jQuery 和有什么不一样？**
    jQuery 是一个包含专为 JavaScript 设计的 API 的库。JavaScript 是一种解释型编程语言。jQuery 简化了 JavaScript 语言的使用。

11.   

12. **jQuery 中的事件是什么？**
    响应用户在网页上的操作称为事件。jQuery 提供了将事件处理程序附加到选择的简单方法。当事件发生时，将执行提供的函数。

13.   

14. **我们是否需要在“主”和“内容”页面中同时添加jQuery文件？**
    jQuery 文件应添加到母版页，并且可以直接从内容页使用访问权限，而无需对它进行任何引用。

15.   

16. **[jQuery.size（）](https://www.geeksforgeeks.org/jquery-size-with-examples/) 和 [jQuery.length](https://www.geeksforgeeks.org/jquery-length-property/) 之间的区别？**
    **jQuery.size()方法**用于查找给定选择器匹配的元素数，jQuery.length 属性用于计算 jQuery 对象的元素数。jQuery.length 属性是首选，因为它没有函数调用的开销。

17.   

18. **我们可以使用 jQuery 调用 C# 代码吗？**
    是的，我们可以从 jQuery 调用 C# 代码，因为它支持 .net 应用程序。

19.   

20. **如何在jQuery中读取、写入和删除cookie？**
    使用 Dough cookie 插件处理 jQuery 中的 cookie。

    - 创建 Cookie：

      ```
      $.dough(“cookie_name”, “cookie_value”);
      ```

    - 读取 Cookie：

      ```
      $.dough(“cookie_name”);
      ```

    - 删除 Cookie：

      ```
      $.dough(“cookie_name”, “remove”);
      ```

21.   

22. **jQuery 中的 ID selector 和 class selector 和有什么不一样？**
    ID 选择器使用 ID，而类选择器使用类来选择元素。您可以使用 ID 选择器仅选取 1 个元素。如果要选择具有相同 CSS 类的一组元素，可以使用类选择器。

23.   

24. **jQuery.data方法有什么用？**
    jQuery.data 方法用于将 {data|info|information} 与 DOM 节点和对象相关联。此数据方法使 jQuery 代码清晰简洁。

25.   

26. **什么是jQuery connect？**
    用于连接或绑定一个函数或将另一个函数绑定的插件。每当执行来自另一个对象或插件的函数时，Connect 用于执行函数。

27.   

28. **jQuery中每个函数有什么用？**
    每个函数都用于迭代对象的每个元素。它用于循环 DOM 元素、数组和对象属性。

29.   

30. **引导需要jQuery吗？**
    Bootstrap 使用 jQuery for JavaScript 插件（如模型、工具提示等）。如果只使用 Bootstrap 的 CSS 部分，则不需要 jQuery。

31.   

32. **jQuery中的选择器有哪些类型？**
    jQuery中有三种类型的选择器：

    - CSS 选择器
    - XPath 选择器
    - 自定义选择器

33.   

34. **jQuery库可以用于服务器脚本吗？**
    jQuery设计为具有客户端脚本功能。jQuery 与服务器端脚本不兼容。

35.   

36. **为什么jQuery比JavaScript更好？**
    jQuery 是一个用于开发 Ajax 应用程序的库，它有助于编写简洁明了的代码。它还处理事件、动画和 Ajax 支持应用程序。

37.   

38. **什么是QUnit？**
    QUnit 是一个功能强大、易于使用的 JavaScript 单元测试框架。它由 jQuery、jQuery UI 和 jQuery Mobile 项目使用，并且能够测试任何通用 JavaScript 代码。

39.   

40. **用什么方法定义特定字符来代替 $ 符号？**
    'NoConflict' 方法用于引用 jQuery 并将其保存在变量中。可以使用该变量代替 Sign。

1. **jQuery中\**[的方法链](https://www.geeksforgeeks.org/jquery-chaining/)\**是什么？它有什么优势？**
   方法链接是 jQuery 的一项功能，它允许在单个元素的单个语句中将多个方法链接在一起。
   **优点：**通过组合或“链接”多种方法，您可以大大减少浏览器查找相同元素的次数，而无需设置任何变量。

2.   

3. 

4. **[jQuery.get()](https://www.geeksforgeeks.org/jquery-get-method/)和 [jQuery.ajax（）](https://www.geeksforgeeks.org/jquery-ajax-method/) 方法和有什么不一样？**
   jQuery 中的 ajax()方法用于执行 AJAX 请求或异步 HTTP 请求。jQuery .get()方法使用 GET HTTP 请求从服务器加载数据。此方法返回 XMLHttpRequest 对象。

5.   

6. **什么是jQuery的数据表插件？**
   DataTables 是 jQuery、JavaScript 库的插件。它是一个高度通用的工具，建立在渐进式改进的基础上，可以向任何 HTML 表格添加高级选项。

7.   

8. **jQuery代码在哪里执行？**
   客户端（浏览器）用于执行jQuery代码。

9.   

10. **解释和对比 event.preventDefault()和 event.stopPropagation()方法的用法。**
    jQuery 中的 preventDefault()方法用于停止所选元素的默认操作。它用于检查是否为所选元素调用了 preventDefault()方法。 event.stopPropagation()方法是 jQuery 中的内置方法，用于停止窗口传播。在 DOM 树中，当使用子元素和父元素设置事件时，如果点击子元素事件，它也会同时调用子元素和父元素。

11.   

12. **在解析 Promise 之前，jQuery 中从 DOM 中删除元素的正确方法是什么？**
    jQuery 中返回的 Promise 连接到存储在元素的 data()上的延迟对象。由于 remove()方法仍然会因为元素本身而删除元素的数据。它将阻止元素的任何未解决的承诺得到解决。
    因此，在解析 Promise 之前，有必要从 DOM 中删除元素。请改用 detach()方法，并在解析时使用 removeData()方法。

13.   

14. **jQuery 中最慢的选择器是什么？**
    类选择器是jQuery中最慢的选择器。

15.   

16. **jQuery 中最快的选择器是什么？**
    ID 和 Element 选择器是 jQuery 中最快的选择器。

17.   

18. **document.ready()和 window.onload()方法和有什么不一样？**
    document.ready()事件在加载所有 HTML 文档后发生，但 window.onload()在加载所有内容（包括图像）后发生。因此，document.ready()事件首先触发。

19.   

20. **如何使用jQuery在代码中调用方法？**
    $.ajax 可以通过使用 jQuery 在代码后方声明 Web 方法来调用。

21.   

22. **如何在jQuery中使用parent（），children（）和siblings（）方法？**
    parent()方法通过调用 jQuery parent()方法返回所选元素的父元素。siblings()方法返回给定 HTML 元素的所有同级。

23.   

24. **jQuery每个函数有什么用？**
    jQuery 每个函数都用于遍历目标 jQuery 对象的每个元素。它同时有助于多元素 DOM、循环数组和对象属性。

25.   

26. **定义 slideToggle()效果 ？**
    滑动方法执行 up 和 down 元素。要实现在 jQuery 元素上上下滑动，区域单位有三种方法：

    - [滑下（）](https://www.geeksforgeeks.org/jquery-slidedown-method/)
    - [幻灯片上（）](https://www.geeksforgeeks.org/jquery-slideup-with-examples/)
    - [slideToggle（）](https://www.geeksforgeeks.org/jquery-slidetoggle-method/)

27.   

28. **我们在哪里可以下载JQuery？**
    jQuery，JavaScript可以从jQuery官方网站下载 – https://jquery.com/

29.   

30. **在 jQuery 中定义 bind()和 unbind()元素？**
    jQuery bind()方法将事件处理程序附加到元素，而 unbind()将现有事件处理程序与元素分离。使用基本 HTML 代码形成 HTML 元素。

31.   

32. **jQuery是JavaScript的替代品吗？**
    不，jQuery 不是 JavaScript 的替代品。

33.   

34. **如何在jQuery中查找浏览器和浏览器版本**？
    使用 jQuery 的 $.browser 属性返回浏览器信息。

    jQuery 本身不建议使用 $.browser，因此此功能已移至 jQuery.migrate 插件，如果用户需要，可以下载该插件。

    - 使用相同的方法是一种易受攻击的做法。仅在需要时使用。
    - 不使用特定于浏览器的代码会持续升高。

35.   

36. **在页面中包含jQuery的所有方法是什么？**
    以下是在页面中合并jQuery的方法：

    - 脚本标记中的本地副本
    - jQuery.com 的远程副本
    - Ajax API 的远程副本
    - 脚本管理器控件的本地副本
    - 使用客户端脚本对象的嵌入式脚本

37.   

38. **我们如何调试jQuery？**
    有两种方法可以调试 jQuery 代码：
    Debugger 关键字

    - 将调试器添加到行中，从我们必须开始调试并在调试模式下使用 F5 功能键运行 Visual Studio。
    - 附加进程后插入断点。

39.   

40. **如何检查jQuery中任何变量的数据类型？**
    使用 **$.type（Object）** 方法获取对象的数据类型。