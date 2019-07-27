// 使用this
{
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

  speak.call(me); // Hello, I'm JAMES
  speak.call(you); // Hello, I'm HEHE
}

// 显示传入
{
  function identity(context) {
    return context.name.toUpperCase();
  }
  function speak(context) {
    var greeting = "Hello, I'm " + identify(context);
    console.log(greeting);
  }
}

// 探究this是否指向自身
{
  function foo(num) {
    console.log("foo:" + num);
    this.count++;
  }
  foo.count = 0;
  for (var i = 0; i < 10; i++) {
    if (i > 5) {
      foo(i);
    }
  }
  // foo: 6
  // foo: 7
  // foo: 8
  // foo: 9
  console.log(foo.count); // 0
}

// 修改this指向
{
  function foo(num) {
    console.log("foo:" + num);
    this.count++;
  }
  foo.count = 0;
  for (var i = 0; i < 10; i++) {
    if (i > 5) {
      foo.call(foo, i);
    }
  }
  // foo: 6
  // foo: 7
  // foo: 8
  // foo: 9
  console.log(foo.count); // 4
}

// this误导
{
  function foo() {
    var a = 2; // vscode会告诉你，这个变量已定义未使用
    this.bar();
  }
  function bar() {
    console.log(this.a);
  }
  foo(); // 相当于访问了window.a
}

// 函数调用的位置
{
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
}

// this绑定规则

// 1、默认绑定
{
  function foo() {
    console.log(this.a);
  }
  var a = 2;
  foo(); // 2
}

// 严格模式和非严格模式
{
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
}

// 隐式绑定
{
  function foo() {
    console.log(this.a);
  }
  var obj = {
    a: 2,
    foo: foo
  };
  obj.foo(); // 2
}

{
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
}

// 隐式丢失
{
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
}

// 隐式丢失 回调函数
{
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
}

// 显式绑定
{
  function foo() {
    console.log(this.a);
  }
  var obj = {
    a: 2
  };
  foo.call(obj); // 2
}

// 硬绑定
{
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
}

// 硬绑定的应用
{
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
}

// 可复用的函数
{
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
}

// API上下文
{
  function foo(el) {
    console.log(el, this.id);
  }
  var obj = {
    id: 'hehe'
  };
  [1, 2, 3].forEach(foo, obj);
  // 1 hehe 2 hehe 3 hehe
}

// new绑定
{
  function foo(a) {
    this.a = a;
  }
  var bar = new foo(2); // 创建了一个新的对象
  console.log(bar.a); // 2
}