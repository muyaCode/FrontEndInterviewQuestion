# Angular面试题

[AngularJS 面试问答 （2024） - GeeksforGeeks](https://www.geeksforgeeks.org/angularjs-interview-questions-and-answers/?ref=lbp)

## AngularJS 双向绑定原理

参考回答：

Angular 将双向绑定转换为一堆 watch 表达式，然后递归这些表达式检查是否发生过变化，如果变了则执行相应的 watcher 函数（指 view 上的指令，如 ng-bind，ng-show等或是{{}}）。等到 model 中的值不再发生变化，也就不会再有 watcher 被触发，一个完整的 digest 循环就完成了。

Angular 中在 view 上声明的事件指令，如：ng-click、ng-change 等，会将浏览器的事件转发给$scope 上相应的 model 的响应函数。等待相应函数改变 model，紧接着触发脏检查机制刷新 view。

watch 表达式：可以是一个函数、可以是$scope 上的一个属性名，也可以是一个字符串形式的表达式。$watch 函数所监听的对象叫做 watch 表达式。

watcher 函数：指在view 上的指令（ngBind，ngShow、ngHide 等）以及{{}}表达式，他们所注册的函数。

每一个 watcher 对象都包括：监听函数，上次变化的值，获取监听表达式的方法以及监听表达式，最后还包括是否需要使用深度对比（angular.equals()）

## Angular 中组件之间通信的方式 

参考回答：

Props down

- 1.调用子组件,通过自定义属性传值
- 2.子组件内部通过 Input 来接收属性的值

Events up

- 1.在父组件中定义一个有参数的方法
- 2.调用子组件时,绑定自定义事件和上一步方法
- 3.子组件内部通过 Output 和 EventEmitter 来触发事件并传值.

## Angualr 的八大组成部分并简单描述 

参考回答：

- model 是 Angular 开发中的基本单位,是一个容器,可以包含组件、指令、管道等
- Pipes 可以对数据做一个筛选、过滤、格式化从而得到目的数据
- Components 是可被反复使用的带有特定功能的视图
- Templates 是经过指令和管道、组件等增强过的 html
- Bindings 结合着事件绑定 属性绑定 双向数据绑定等扩展 html 的功能
- Directives 分为结构性和属性型指令还有其他模块中比如路由模块中的指令等，主要是增强 html。
- Service 将组件、应用中的可共用的部分,比如数据或者方法等 封装成服务以方

便服用
DependencyInjection 依赖注入

## Angular 中常见的生命周期的钩子函数? 

参考回答：

ngOnChanges:当 Angular 设置其接收当前和上一个对象值的数据绑定属性时响应。

ngOnInit:在第一个 ngOnChange 触发器之后,初始化组件/指令。这是最常用的方法,用于从后端服务检索模板的数据。

ngDoCheck：检测并在 Angular 上下文发生变化时执行。

每次更改检测运行时,会被调用。

ngOnDestroy:在 Angular 销毁指令/组件之前消除。取消订阅可观察的对象并脱离事件处理程序,以避免内存泄漏。

组件特定的 hooks:

- ngAfterContentInit:组件内容已初始化完成
- ngAfterContentChecked:在 Angular 检查投影到其视图中的绑定的外部内容之后。
- ngAfterViewInit:Angular 创建组件的视图后。
- ngAfterViewChecked：在 Angular 检查组件视图的绑定之后

## Angular 中路由的工作原理 

参考回答：

Angular 应用程序具有路由器服务的单个实例,并且每当 URL 改变时,相应的路由就与路由配置数组进行匹配。在成功匹配时,它会应用重定向,此时路由器会构建 ActivatedRoute 对象的树,同时包含路由器的当前状态。在重定向之前,路由器将通过运行保护(CanActivate)来检查是否允许新的状态。

Route Guard 只是路由器运行来检查路由授权的接口方法。

保护运行后,它将解析路由数据并通过将所需的组件实例化到`<router-outlet></router-outlet>`来激活路由器状态。

## 解释 rjx 在 Angular 中的使用场景 

参考回答：

Rxjs 是在微软所提供的一种的异步处理数据的方式,在 Angular 中处理网络通信时用到了。

创建一个 Observable 并 subsribe

比如：`this.http.get('').subscribe((data)=>{ })`

# 待定

### ***\*1. 什么是AngularJS，谁创建了它？\****

[AngularJS](https://www.geeksforgeeks.org/introduction-to-angularjs/) 是一个开源的 JavaScript 前端框架，擅长构建单页 Web 应用程序 （SPA）。通过动态绑定和依赖注入等功能，它将静态 HTML 转换为动态内容。AngularJS 由 Misko Hevery 和 Adam Abrons 于 2008-2009 年开发，由 Google 维护，并拥有持续的增长和演变，最新的稳定版本是 1.7.7。它使用指令扩展 HTML 属性，并促进无缝数据绑定。区分 AngularJS 和 Angular 至关重要，因为它们是不同的框架。

### ***\*2. AngularJS有哪些特点？\****

[AngularJS的主要特点](https://www.geeksforgeeks.org/interesting-facts-and-features-about-angularjs/)如下：

- 可测试：AngularJS 应用程序易于测试，可以对各种组件和功能进行高效测试。
- 数据绑定：促进模型和视图组件之间的数据同步。
- 控制器：绑定到作用域的 JavaScript 函数，有助于实现应用程序逻辑。
- 服务：内置服务，如用于进行 XMLHttpRequests 和 AJAX 调用的 $http。
- 作用域：连接模型并充当视图和控制器之间的粘合剂的特殊对象。
- 过滤器：支持用于数组子集和数据过滤的内置和自定义过滤器。
- 指令：DOM 元素的标记，创建自定义 HTML 标签和小部件。
- 路由：根据动态应用程序导航的条件切换视图。
- MVC 模式：模型管理数据，视图显示数据，控制器处理应用程序逻辑。
- 依赖关系注入：通过解决组件依赖关系来简化应用程序开发、维护和测试。

### ***\*3. 什么是 AngularJS 中的范围和数据绑定？\****

- [***\*Scope：\****](https://www.geeksforgeeks.org/angularjs-scope/)AngularJS 中的 Scope 是 HTML 视图和 JavaScript 控制器的绑定部分。将属性添加到 JavaScript 控制器的范围对象中时，HTML 视图才能访问这些属性。AngularJS 中有两种类型的 Scope。
- [***\*数据绑定：\****](https://www.geeksforgeeks.org/angularjs-data-binding/)Angular 提供了一个功能数据绑定，它帮助我们几乎实时地反映用户给出的输入，即它在模型和视图之间创建连接。

### ***\*4. AngularJs 中有多少种类型的数据绑定？\****

[AngularJS 中有四种数据绑定](https://www.geeksforgeeks.org/angularjs-data-binding/)，它们是：

- 事件绑定
- 属性绑定
- 双向绑定
- 插值绑定

### ***\*5、单向绑定与双向绑定的区别\****

- ***\*属性绑定：\****与 Java 类似，父类中定义的变量可以由子类继承，在这种情况下是模板。插值和属性绑定之间的唯一区别是，在使用插值时，我们不应该将非字符串值存储在变量中。因此，如果我们必须存储布尔值或其他数据类型，则不使用属性绑定。
- ***\*插值绑定：\****使用角度插值在相应的视图模板中显示组件属性，并采用双大括号语法。插值用于传输元件类中提到的属性以反映在其模板中。

### ***\*6. 解释 AngularJS 中的服务和表达式\****

- [***\*服务：\****](https://www.geeksforgeeks.org/angularjs-services/)服务用于创建可共享的变量/数据，并可在定义它的组件之外使用。
- [***\*表达式：\****](https://www.geeksforgeeks.org/angularjs-expressions/)AngularJS 中的表达式用于将应用程序数据绑定到 HTML。表达式由 Angular 解析，结果返回到写入表达式的位置。

### ***\*7. angular 表达式和 JavaScript 表达式之间的主要区别是什么？\****

AngularJS 表达式可以用 HTML 编写，但 JavaScript 表达式不能，AngularJS 支持过滤器，但 JavaScript 不支持。我们不能在 AngularJs 中使用条件迭代、循环和异常，但我们可以在 JavaScript 表达式中使用所有这些条件属性。

### ***\*8. 编写配置 Angular App（ng-app） 的所有步骤？\****

- ***\*第 1 步：\****首先创建 angular.module。
- ***\*第 2 步：\****控制器将被分配给模块。
- ***\*第 3 步：\****该模块将通过 angular app（ng-app） 与 HTML 模板链接。
- ***\*第 4 步：\****HTML 模板将使用 ng-controller 指令与控制器链接。

### ***\*9. 使用页面加载选项时，如何初始化选择框？\****

您可以在页面加载选项时使用 ng-init 指令初始化选择框。

```
<div ng-controller = " apps/dashboard/account " ng-switch
On = "! ! accounts" ng-init = " loadData ( ) ">
```

### ***\*10. AngularJS 中的指令是什么，仅举几例？\****

[AngularJS 中的指令](https://www.geeksforgeeks.org/angularjs-directive/)是 DOM 元素上的标记，它告诉 Angular 的 HTML 编译器将指定的行为附加到该 DOM 元素。一些指令包括 ng-model、ng-repeat、ng-if、ng-show、ng-hide、ng-click 和 ng-class。

### ***\*11. 使用AngularJS有什么好处？\****

AngularJS 有几个优点。支持 MVC 模式，支持使用 AngularJS 的两种数据绑定方式。它具有每个定义的表单验证 支持客户端-服务器通信和动画。

### ***\*12. AngularJS 路由是做什么的？\****

当用户想要导航到应用程序中的不同页面但仍希望它是单页应用程序时，使用 [AngularJS 中的路由](https://www.geeksforgeeks.org/angularjs-routing/)。AngularJS 路由使用户能够为应用程序中的不同内容创建不同的 URL。ngRoute 模块有助于访问应用程序的不同页面，而无需重新加载整个应用程序。

### ***\*13. 如何在 AngularJS 中在控制器之间共享数据？\****

我们必须首先创建一个服务。这些服务用于在 AngularJS 中的控制器之间共享数据。我们通过使用$rootScope来使用事件、$parent、下一个同级和控制器。

### ***\*14. HTML的编译过程有哪些步骤？\****

- ***\*第 1 步：\****使用标准浏览器 API，首先将 HTML 解析为 DOM
- ***\*第 2 步：\****通过使用对 $compile（） 方法的调用，执行 DOM 的编译。该方法遍历 DOM，然后匹配指令。
- ***\*步骤 3：\****通过调用从上一步返回的链接函数，将模板与作用域链接。

### ***\*15. 什么是AngularJS中的字符串插值？\****

在 AngularJS 中，在编译过程中，它使用插值服务匹配文本和属性，以查看它们是否包含嵌入式表达式。作为正常摘要周期的一部分，这些表达式将更新并注册为监视。

### ***\*16. AngularJS 中有多少种类型的指令可用？\****

AngularJS 中有四种指令，如下所述：

- 元素指令
- 属性指令
- CSS 类指令
- 注释指令

### ***\*17. 什么是喷油器？\****

AngularJS 中的注入器基本上是一个服务定位器。它用于调用方法和加载模块。单个 AngularJS 应用程序中只能有一个注入器。

### ***\*18. 什么是AngularJS中的工厂方法？\****

AngularJS [工厂化方法](https://www.geeksforgeeks.org/angularjs-factory-method/)使 AngularJS 应用程序的开发过程更加健壮。工厂是一个简单的函数，它允许我们向创建的对象添加一些逻辑并返回创建的对象。工厂还用于以可重用代码的形式创建/返回函数，该函数可以在应用程序中的任何位置使用。每当我们使用工厂创建对象时，它总是为该对象返回一个新实例。工厂返回的对象可以与 Angularjs 框架的不同组件（如控制器、服务、过滤器或指令）集成（注入）。

### ***\*19. AngularJS中的摘要周期是什么？\****

它是 AngularJS 中数据绑定过程中最重要的部分。它基本上比较了范围模型的旧版本和新版本。自动触发摘要循环。如果我们想手动触发摘要周期，那么我们可以使用 $apply（）。

### ***\*20. Angular 和 AngularJS 有什么区别？\****

|   方面   |                          角                           |              AngularJS的              |
| :------: | :---------------------------------------------------: | :-----------------------------------: |
|   版本   |     Angular 是 2.0 及更高版本，包括 Angular 12。      | AngularJS 是 1.0 版，由 Google 开发。 |
|   语言   | 用 TypeScript 编写，TypeScript 是 JavaScript 的超集。 |         用 JavaScript 编写。          |
|   建筑   |               遵循基于组件的体系结构。                |  遵循 MVC（模型-视图-控制器）架构。   |
|   性能   |             提供更好的性能和增强的功能。              |     由于消化周期，性能相对较低。      |
| 移动支持 |              为移动开发提供更好的支持。               |      缺乏对移动开发的强大支持。       |
| 数据绑定 |                     双向数据绑定                      |             单向数据绑定              |
| 依赖注入 |                    使用分层喷油器                     |     使用全局作用域进行依赖项注入      |

## 结论

本文介绍了针对新开发人员和有经验的开发人员的常见 AngularJS 面试问题。AngularJS 引入了依赖注入和简化的单页应用程序开发，因其优势、易用性和可扩展性而在各种公司中被广泛采用。