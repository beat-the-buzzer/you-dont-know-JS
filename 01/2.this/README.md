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

另一条需要考虑的规则是调用位置是否有上下文对象。

```js
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2,
  foo: foo
};
obj.foo(); // 2
```

我们已经知道，就算foo函数成为了obj的一个属性，foo函数也不属于obj对象。但是，调用位置会使用obj上下文来引用函数，所以可以说：`foo函数在被调用的瞬间obj对象拥有或者包含这个函数`。

当函数拥有上下文对象时，隐式绑定规则会把函数调用中的this绑定到这个上下文对象。

对象属性引用链只在上一层或者说最后一层在调用位置有用。

```js
function foo() {
  console.log(this.a);
}
var obj2 = {
  a: 42,
  foo: foo
};
var obj1 = {
  a: 2,
  obj2: obj2
};
obj1.obj2.foo(); // 42
```

隐式丢失的情况：

一个常见的this绑定问题就是被隐式绑定的函数会丢失绑定对象，也就是说它会应用默认绑定。

```js
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2,
  foo: foo
};
var bar = obj.foo;
var a = '全局对象';
bar(); // '全局对象'
```

还有一种情况会发生在回调函数里：

```js
function foo() {
  console.log(this.a);
}
function doFoo(fn) {
  fn(); // 调用的位置
}
var obj = {
  a: 2,
  foo: foo
};
var a = '全局';
doFoo(obj.foo); // '全局'
```

参数传递也是一种隐式赋值。

3、显式绑定

在隐式绑定里面，我们必须在一个对象内部包含一个指向函数的属性，并通过这个属性间接引用函数。

有时候我们不想在对象内部包含函数引用，而是想在某个对象上强制调用函数，这个时候就需要显式绑定。

JavaScript中使用call或者apply来改变函数的tihs绑定，它们的第一个参数是一个对象，这个对象就是绑定到this的对象，所以叫做显式绑定。

```js
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2
};
foo.call(obj); // 2
```

call/apply的第一个参数是一个对象，如果传一个基本类型，就会自动转成他们的对象类型（例如：new String(...)）

> JavaScript中很多地方都会有自动转换的思想，例如，对象的key是一个字符串，如果使用另一个对象作为该对象的key，这个key会被自动转成字符串"[object Object]"

显式绑定依然无法直接解决绑定丢失的问题。不过利用显式绑定，可以找到解决问题的方案。

```js
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2
};
var bar = function() {
  foo.call(obj);
};
bar(); // 2
setTimeout(bar, 100); // 2
bar.call(window); // 2 不能再修改this指向
```

我们把调用foo的操作写在了bar函数里，并且强行绑定了obj，然后通过调用bar来调用foo，这样，无论我们如何调用bar，foo已经强行绑定了，无法修改。

一个简单的应用就是创建一个包裹函数，负责接收参数并返回值：

```js
function foo(something) {
  console.log(this.a, something);
  return this.a + something;
}
var obj = {
  a: 2
};
var bar = function() {
  return foo.apply(obj, arguments);
}
var b = bar(3); // 2 3
console.log(b); // 5
```

另一个常见的应用就是创建一个可以重复使用的辅助函数：

```js
function foo(something) {
  console.log(this.a, something);
  return this.a + something;
}
// 辅助函数
function bind(fn, obj) {
  return function () {
    return fn.apply(obj, arguments);
  }
}
var obj = {
  a: 2
};
var bar = bind(foo, obj);
var b = bar(3); // 2 3
console.log(b); // 5
```

> 这种方式就是函数式编程的思想。实际上，函数是编程就是闭包+call/apply。

API上下文

很多第三方库函数都提供了可选上下文参数，可以确保回调函数可以使用指定的this

```js
function foo(el) {
  console.log(el, this.id);
}
var obj = {
  id: 'hehe'
};
[1, 2, 3].forEach(foo, obj);
// 1 hehe 2 hehe 3 hehe
```

[附：call、apply、bind原生实现](https://github.com/beat-the-buzzer/you-dont-konw-JS/blob/master/01/2.this/call-apply-bind.js)

4、new 绑定

首先，我们知道，不仅仅是JavaScript，其它很多编程语言都有new，但是，JavaScript中的new和其它编程语言有明显的不一样的地方。

JavaScript中，“构造函数”只是一些使用new操作符时被调用的函数，它们不会属于某个类，也不会实例化一个类。

当我们使用new去调用Number时，Number是一个构造函数，它会初始化创建一个新的对象。所以，包括内置对象函数（例如Number）在内的所有函数都可以使用new来调用，这种函数调用被称为构造函数调用。

我们使用new来调用函数时，会执行一系列的操作：

 - 创建一个新的对象
 - 这个新对象会被执行\[[prototype]]连接
 - 这个新对象会绑定到函数调用的this
 - 如果函数没有返回其它对象，那么new表达式中的函数调用会自动返回这个新对象

第二步暂时调过，会在介绍原型的时候详细说明。

```js
function foo(a) {
  this.a = a;
}
var bar = new foo(2); // 创建了一个新的对象
console.log(bar.a); // 2
```

使用new来调用foo()时，我们会构造一个新对象并把它绑定到foo()调用中的this上。

#### 优先级测试