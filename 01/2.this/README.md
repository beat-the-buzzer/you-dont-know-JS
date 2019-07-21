## this全面解析

this关键字是JavaScript中最复杂的机制之一。

#### 为什么要使用this

```js
function identify() {
  return this.name.toUpperCase();
}
function speak() {
  var greeting = "Hello, I'm " + identify.call(this);
  console.log(greeting);
}
var me = {
  name: 'James'
};
var you = {
  name: 'hehe'
};
identify.call(me); // James
identify.call(you); // hehe

speak.call(me); // Hello, I'm James
speak.call(you); // Hello, I'm hehe
```

上面这段代码可以在不同的上下文对象中重复使用函数identity和speak，不需要针对不同的对象写不同的版本。

如果不使用this，我们需要把函数嗲用的上下文环境传过来：

```js
function identity(context) {
  return context.name.toUpperCase();
}
function speak(context) {
  var greeting = "Hello, I'm " + identify(context);
  console.log(greeting);
}
```

显然，使用this可以更加优雅地“传入”一个对象的引用，因此我们的API会更加简洁。

#### 对this的误解

误解一：this指向自身

从字面意思上来看，this可能就是指自身，但是我们要通过实际的例子来证明这个是真理还是误解：

```js
function foo(num) {
  console.log("foo:" + num);
  this.count++;
}
foo.count = 0; 
for(var i = 0; i < 10; i++) {
  if(i > 5) {
    foo(i);
  }
}
// foo: 6
// foo: 7
// foo: 8
// foo: 9
console.log(foo.count); // 0
```

显然，foo函数被调用了四次，但是foo.count依然是0。所以，从字面上来理解this，即this指向自身，是错误的。

深入探究，我们会发现，我们在函数上新增了一个属性count，但是增加的count实际上是window下的一个属性。执行this.count++，实际上是window.count++，由于window.count原本的值是undefine，所以执行之后会变成NaN。

我们可以使用其他方法解决这个问题：

```js
function foo(num) {
  console.log("foo:" + num);
  data.count++;
}
var data = {
  count: 0; 
};

for(var i = 0; i < 10; i++) {
  if(i > 5) {
    foo(i);
  }
}
console.log(data.count);
```

虽然可以轻松解决这个问题，但是实际上，我们回避了this指向的问题，改用词法作用域。

如果我们去面对this，并且已经知道上面例子的this实际上指向的是window，我们就可以用我们的方式修改this的指向

```js
// 修改this指向
function foo(num) {
  console.log("foo:" + num);
  this.count++;
}
foo.count = 0; 
for(var i = 0; i < 10; i++) {
  if(i > 5) {
    foo.call(foo, i);
  }
}
// foo: 6
// foo: 7
// foo: 8
// foo: 9
console.log(foo.count); // 4
```

误解二：this指向函数的作用域

首先需要明确一点：this在任何情况下都不指向函数的词法作用域。虽然，作用域和对象看起来很像，但是作用域无法通过代码访问，他只是存在与JavaScript引擎内部。

```js
function foo() {
  var a = 2; // vscode会告诉你，这个变量已定义未使用
  this.bar();
}
function bar() {
  console.log(this.a);
}
foo(); // 相当于访问了window.a
```

#### this是什么

> this是在运行的时候绑定的，并不是在定义的时候绑定，它的上下文取决于调用时的各种关系。this的绑定和函数声明的位置没有关系，只取决于函数调用的方式。

当函数被调用时，会创建一个活动记录，也就是执行上下文。这个记录里面包含函数在哪里被调用，函数调用方式，传入的参数等等。this就是这个记录的一个属性，会在函数执行的过程中用到。

this是非常重要的，但是猜测、盲目复制别人的理解都不能真正理解this的机制。

#### 理解调用位置

```js
function baz() {
  // this指向调用位置
  console.log('baz');
  bar(); // 相当于window.bar()
}
function bar() {
  // this指向window
  console.log('bar');
  foo(); // 相当于window.foo()
}
function foo() {
  // this指向window
  console.log('foo');
}
baz(); // 函数调用的位置，相当于window.baz();
var obj = { a: baz };
obj.a(); // baz里面的this指向obj
```

#### 绑定规则

1、默认绑定

```js
function foo() {
  console.log(this.a);
}
var a = 2;
foo(); // 2
```

我们应该意识到，在全局作用域中定义的变量，就是在全局环境下添加了一个属性。上面的例子中，调用foo()时，应用了this的`默认绑定`，因此this指向全局对象。

我们分析函数的调用位置，发现foo()没有任何修饰符，所以只能使用默认绑定规则。

如果使用严格模式，则不能将全局对象用于默认绑定，此时this会指向undefined。

```js
function foo() {
  'use strict';
  console.log(this.a);
}
function bar() {
  console.log(this.a);
}
var a = 2;
bar(); // 2
foo(); //  Cannot read property 'a' of undefined
```

> 通常来说，不应该在代码里混合使用严格模式和非严格模式，然而，有时候引入的第三方库有严格模式和非严格模式的区分，所以要注意这方面的兼容。

2、隐式绑定