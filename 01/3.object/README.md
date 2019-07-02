### 对象

#### 类型

大家都知道，JavaScript中的类型有`string、number、boolean、null、undefined、object`。我们可以使用typeof去得到变量的类型。其中null是特例，typeof null === 'object'

> typeof null === 'object'的秘密：不同的对象在底层都是二进制的形式，在JavaScript中，二进制前三位都为0的话会被判断为object，null的二进制表示全是0，所以typeof null === 'object'

函数、数组等等都是object的子类型。函数是“可调用的对象”，内部实现了[[call]]，所以typeof去判断函数类型时，会返回'function'

#### 内置对象

JavaScript中有一些对象的子类型，我们称之为内置对象。

 - String
 - Number
 - Boolean
 - Object
 - Function
 - Array
 - Date
 - RegExp
 - Error

内置对象可以当作构造函数来用。例如：

```JavaScript
var str = 'str';
typeof str; // "string"
str instanceof String; // false

var strObj = new String('str');
typeof strObj; // "object"
strObj instanceof String; // true

Object.prototype.toString.call(strObj); // "[object String]"
```

> instanceof运算符用来测试一个对象在其原型链中是否存在一个构造函数的prototype属性。

我们可以访问str的长度、对str进行操作，是因为JavaScript自动把基本类型转成了对象，这个对象也被称为`包装对象`。

#### 内容

对象的内容是由一些存储在特定命名位置的值组成。

```JavaScript
var person = {
  name: 'James'
};
person.name; // 'James' => 属性访问
person['name']; // 'James' => 键访问
```

属性访问和键访问最大的区别是，属性访问.操作符的名字必须是变量名的规范。例如，我想使用'name-age'作为属性名，就必须要这样写：

	person['name-age'];

另外，属性名必须是字符串。如果不是字符串，会去进行隐式转换。

```JavaScript
var a = { a: 1 };
var b = { b: 1 };
var c = {};
c[a] = '123';
c[b] = '456';

c[a] // '456' => 实际访问的是c['[object Object]']
```

> ES6提供了一种新的数据结构来表示key值为非字符串的对象，叫做Map。

#### 可计算属性名

我们可以使用变量作为属性名。

```JavaScript
var key1 = 'name';
var key2 = 'age';
var obj = {
  [key1 + key2]: 'James-18'
};
obj.nameage; // 'James-18'
obj['nameage']; // 'James-18'
```

#### 属性与方法

我们访问的对象的属性可能是一个函数，我们有时候把“属性访问”称作“方法访问”。

在其他语言中，方法都是在类中定义的，属于某个类的。但是在JavaScript中，函数不会属于某个对象。我们在调用的时候才能确定函数内部的this指向。

#### 数组

数组也支持[]的访问，一般[]里面都是一个数字类型的索引值。如果是数字的字符串方式，例如"12"，会转成数字12。如果是其它的字符串，就变成了对象访问（数组也是对象）。

```JavaScript
var arr = ['str', 0, true];
arr[0]; // 'str'
arr['1']; // str
arr['hehe']; // undefined，并不能找到hehe属性
```

#### 对象的复制

这是一个很容易出问题的知识点。

我们最先想到的对象复制方法就是直接赋值：

```JavaScript
var obj1 = {};
var obj2 = obj1;
obj2.a = 1;
obj1; // {a: 1}
```

在例子中，我们看到，我们明明没有直接修改过obj1，但是obj1也被改变了。

我们可以这样理解：`obj2 = obj1;`执行完这个操作之后，obj1和obj2指向了同一块内存地址。无论改变obj1还是obj2，改动的都是同一个东西。

如何去进行深拷贝操作呢？其实方法有很多。

方法1：jQuery的$.extend方法，第一个参数指定是深拷贝还是浅拷贝

现在已经不去使用jQuery了，我们使用React/Vue这样的框架。我们可以把jQuery的$.extend方法弄下来，封装成自己的方法。不过，我们还有其他的方法。

方法2：JSON.parse和JSON.stringfy

这种方式有一定的局限性，就是操作的对象必须要是标准格式的JSON。不过，一般情况下，这种方式足够解决99%开发中的问题了。

```JavaScript
var obj = { a: 1 };
var objCopy = JSON.parse(JSON.stringfy(obj));
```

方法3：ES6展开运算符

这种方式的拷贝的局限性是，只能深拷贝一层。

```JavaScript
var objInner = { a: 1 };
var obj = {
  b: objInner
};
var objCopy = {
  ...obj
};
objCopy.b.a = 2;
objInner; // { a: 2 } // 改变了
obj; // { b: { a: 2 } } // 改变了
```

这种方式可以对一层对象或者一维数组进行深拷贝操作：

```JavaScript
var arr = [1, 2, 3];
var arrCopy = [...arr];
arrCopy[0] = 0;
arr; // [1, 2, 3]
```

方法4：ES6 Object.assign

这种方式也是只能深拷贝一层：

```JavaScript
var objInner = { a: 1 };
var obj = {
  b: objInner
};
var objCopy = Object.assign({}, obj);
objCopy.b.a = 2;
objInner; // { a: 2 } // 改变了
obj; // { b: { a: 2 } } // 改变了

```

这种方式可以对一层对象或者一维数组进行深拷贝操作：

```JavaScript
var obj = { a: 1 };
var objCopy = Object.assign({}, obj);
objCopy.a = 2;
obj; // { a: 1 };
```

#### 属性描述符

Vue框架就是使用defineProperty来拦截数据，如果想去研究Vue源码，首先必须要弄懂属性描述符。

```JavaScript
var obj = { a: 1 };
Object.getOwnPropertyDescriptor(obj, 'a');
// {
//     value: 1,
//     writable: true,
//     emuerable: true,
//     configurable: true
// }
```
