// 构造函数
{
  var Person = function (name, age) {
    this.name = name;
    this.age = age;
  };

  Person.prototype.getName = function () {
    return this.name;
  }

  var p1 = new Person('Tom', 23);
  var p2 = new Person('Jerry', 22);
  p1.getName(); // Tom
  p2.getName(); // Jerry
}

// new
function New(func) {
  // 声明一个中间对象，该对象为最终返回的实例
  var res = {};
  if (func.prototype !== null) {
    // 将实例的原型指向构造函数的原型
    res.__proto__ = func.prototype;
  }
  // ret为构造函数的执行结果
  // 将构造函数内部的this指向修改为指向res 
  // 通过apply实现
  var ret = func.apply(res, [].slice.call(arguments, 1));
  // 当我们在构造函数中指定了返回的对象时，new执行的结果就是这个对象
  if ((typeof ret === 'object' || typeof ret === 'function') && ret !== null) {
    return ret;
  }
  // 默认返回res
  return res;
}

var Person = function (name) {
  this.name = name;
}
Person.prototype.getName = function () {
  return this.name;
}
var p1 = New(Person, 'Tom');
var p2 = New(Person, 'Jerry');
p1.getName(); // Tom
p2.getName(); // Jerry


// 优先级问题
function PPerson(name) {
  this.name = name;
  this.getName = function () {
    return this.name + ', 你正在访问私有方法';
  }
}
PPerson.prototype.getName = function () {
  return this.name;
}
var pp1 = new PPerson('Tom', 20);
pp1.getName(); // Tom, 你正在访问私有方法

console.log('name' in pp1); // true 
console.log('age' in pp1); // false
console.log('getName' in pp1); // true


