### 新增API

#### 数组

1、静态函数Array.of

Array构造器有一个问题，就是当传入的是一个数字类型的参数时，和传入一个字符串类型的参数表现不一样。为了阻止可能出现的意外的输出，于是ES6新增了Array.of

```js
var a = Array(3);
console.log(a.length); // 3
console.log(a); // [3 empty items]

var b = Array('3');
console.log(b); // ['3']

var c = Array.of(3);
console.log(c); // [3]
```

其实，在平时的开发中，我们很少使用构造器来创建数组，一般都是直接使用字面量。

2、静态函数Array.from

这个方法的作用是将类数组的对象（有数字键，有length）转成真正的数组。

```js
var arrlike = {
  0: 'first',
  1: 'second',
  length: 2
};
var arr = Array.from(arrlike);
console.log(arr); // ['first', 'second']
```

在ES5中，我们经常使用数组的slice方法，将类数组对象转成真正的数组。

```js
// 过去解决这个问题的方法
function func() {
  var arr = [].slice.call(arguments);
  console.log(arr);
}
func(1, 2); // 输出[1, 2]
```

ES6提供了一种更优雅的实现方式。

Array.from还有一种映射的用法，与数组的map方法类似。

```js
// 映射用法
var newArr = Array.from(arrlike, function(value) {
  return value.toUpperCase()
});
console.log(newArr); // [ 'FIRST', 'SECOND' ]
```

3、原型方法