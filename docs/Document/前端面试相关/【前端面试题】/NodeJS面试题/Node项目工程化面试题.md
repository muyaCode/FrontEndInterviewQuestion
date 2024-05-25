# Node 项目工程化面试题

## 待定面试

1.使用 NodeJS 编写代码实现遍历文件夹及所有文件名

2.Node 如何做版本的升级?为什么要使用 nvm?

3.模块化的差异，AMD，CMD，COMMONJS，ESMODULE

4.图片上传到服务器的过程(FileReader.readAsDataURL)

5.token 存在 localstorage 里，过期怎么处理?

6.node 框架中的 mvc

7.mongle 与 mysql 的优势

8.Less(js)，sass(ruby) ，stylus，css，命名空间与 css module

9.工程化上的按需加载

10.git 上的冲突怎么解决

11.设计模式

12.Node 中的 npm 与版本管理 (package.lock，yarnlock)

13.Webpack

14.后端环境的搭建

15.typescript

## 简单实现Node的Events模块

简介：观察者模式或者说订阅模式，它定义了对象间的一种一对多的关系，让多个观察者对象同时监听某一个主题对象，当一个对象发生改变时，所有依赖于它的对象都将得到通知。

node中的Events模块就是通过观察者模式来实现的：

```js
var events=require('events');
var eventEmitter=new events.EventEmitter();
eventEmitter.on('say',function(name){
  console.log('Hello',name);
})
eventEmitter.emit('say','Jony yu');
```

这样，eventEmitter发出say事件，通过On接收，并且输出结果，这就是一个订阅模式的实现，下面我们来简单的实现一个Events模块的EventEmitter。

1.实现简单的Event模块的emit和on方法

```js
function Events(){
    this.on=function(eventName,callBack){
        if(!this.handles){
            this.handles={};
        }
        if(!this.handles[eventName]){
            this.handles[eventName]=[];
        }
        this.handles[eventName].push(callBack);
    }
    this.emit=function(eventName,obj){
        if(this.handles[eventName]){
            for(var i=0;o<this.handles[eventName].length;i++){
                this.handles[eventName][i](obj);
            }
        }
    }
    return this;
}
```

2.这样我们就定义了Events，现在我们可以开始来调用：

```js
var events=new Events();
events.on('say',function(name){
    console.log('Hello',nama)
});

//结果就是通过emit调用之后，输出了Jony yu
events.emit('say','Jony yu');
```

3.每个对象是独立的

因为是通过new的方式，每次生成的对象都是不相同的，因此：

```js
var event1=new Events();
var event2=new Events();
event1.on('say',function(){
    console.log('Jony event1');
});
event2.on('say',function(){
    console.log('Jony event2');
})

//event1、event2之间的事件监听互相不影响
//输出结果为'Jony event1' 'Jony event2'
event1.emit('say');
event2.emit('say');
```
