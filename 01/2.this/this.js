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
}

// 修改this指向
{
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