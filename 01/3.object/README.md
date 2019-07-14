## 对象

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

> Vue框架就是使用defineProperty来拦截数据，如果想去研究Vue源码，首先必须要弄懂属性描述符。

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

1、writable

writable决定是否可以修改属性的值：

```js
var myObj = {};
Object.defineProperty(myObj, 'a', {
  value: 2,
  writable: false,
  configurable: true,
  enumerable: true
});

myObj.a = 3;
console.log(myObj.a); // 2 属性不可修改，静默失败。
```

这里需要注意，在严格模式下，试图改变不可写属性的操作，会出错。

面试的时候，有被问到ES6的const常量怎么实现，其实可以使用这个属性描述符。

2、configurable

如果是可配置的属性，就可以去使用defineProperty修改属性描述符：

```js
var myObj = {
  a: 2
};
myObj.a = 3;
console.log(myObj.a); // 3 修改属性成功

Object.defineProperty(myObj, 'a', {
  value: 4,
  writable: true,
  configurable: false,
  enumerable: true
});
console.log(myObj.a); // 4 使用属性描述符修改成功
myObj.a = 5;
console.log(myObj.a); // 5 修改成功

delete myObj.a; // 删除失效
console.log(myObj.a); // 5 属性依旧存在

// 再次使用defineProperty报错
Object.defineProperty(myObj, 'a', {
  value: 4,
  writable: true,
  configurable: true,
  enumerable: true
});

// 有一个例外，可以在configurable为false的情况下，把writable从true改成false
Object.defineProperty(myObj, 'a', {
  value: 4,
  writable: false,
  configurable: false,
  enumerable: true
});
```

有一个例外，可以在configurable为false的情况下，把writable从true改成false。

另外，删除属性也是禁止的。

3、enumerable

这个属性描述符控制的是这个属性是否会出现在对象的属性枚举中：

```js
var myObj = {
  a: 1,
};
Object.defineProperty(myObj, 'b', {
  value: 2,
  writable: true,
  configurable: true,
  enumerable: true
});
Object.defineProperty(myObj, 'c', {
  value: 3,
  writable: true,
  configurable: true,
  enumerable: false
});
for(var i in myObj) {
  console.log(i); // a,b 没有c
}
```

#### 不变性

1、对象常量

```js
var myObj = {};
Object.defineProperty(myObj, 'a', {
  value: 1,
  writable: false,
  configurable: false,
  enumerable: true
});
console.log(myObj); // { a: 1}, 不可修改 重定义 或删除
```

2、禁止扩展

在用ES6 const的时候，我们会发现，就算定义了一个常量数组，我们依旧可以对这个数组进行push操作：

```js
const arr = [1, 2];
arr.push(3);
console.log(arr); // 1,2,3
```

对象也是类似，上面的对象常量其实可以继续添加属性。如果我们也禁止添加属性，就需要额外的操作：

```js
var myObj = {
  a: 1
};
Object.preventExtensions(myObj);

myObj.b = 2; 
console.log(myObj.b); // undefined 严格模式，在上一行就报错
```

3、密封

密封的操作`Object.seal()`其实就是上面的禁止扩展操作，并把所有的属性设置为不可配置`configurable: false`，这里就不再举例了。

4、冻结

冻结的操作`Object.freeze()`其实就是上面的密封操作，并把所有的属性设置为不可写`writable: false`，这里就不再举例了。

#### \[[get]] 和 \[[put]]

1、\[[get]]

```js
var myObj = {
  a: 2
};
myObj.a; // 2
```

看起来myObj.a仅仅只是一次属性访问操作，但是这条语句不仅仅只是在myObj中查找a。

myObj.a 执行的时候，对象的默认内置\[[get]]操作首先在对象中查找是否有名称相同的属性，如果有，就直接返回这个属性值。

如果没找到，并不是停止查询，而是去遍历这个对象的原型链。

如果依旧没有找到名称相同的属性，就会返回undefined。

```js
var myObj = {
  a: undefined
};
myObj.a; // undefined
myObj.b; // undefined
```

访问a和访问b得到的结果是一样，但是过程不一样。访问a只是一种属性访问，访问b的是，还去遍历了原型链。遍历原型链的操作，就是\[[get]]在底层进行的操作。

2、\[[put]]

给对象的属性（存在或者不存在）赋值时，会触发\[[put]]

\[[put]]的行为取决于多个因素，先介绍给存在的属性赋值的情况：

 - 属性是否是访问描述符（后面会介绍），如果是，并且存在setter，就去调用setter。
 - 属性的数据描述符的writable是否为false，如果是，非严格模式下静默失败，严格模式下报错。
 - 如果不满足上述条件，就将该值设置为属性的值

 给对象不存在的属性赋值时，操作会更加复杂。在\[[prototype]]里会去进行讨论。

 #### Getter和Setter

 getter是一个隐藏函数，会在获取属性值的时候调用；setter也是一个隐藏函数，会在设置属性值的时候调用。

getter:

```js
var myObj = {
  get a() {
    return 2;
  }
}

Object.defineProperty(myObj, 'b', {
  get: function () {
    return this.a * 2;
  },
  enumerable: true
})
myObj.a; // 2 调用了get
myObj.b; // 4
myObj.a = 3; // 没有set，这个操作无效
myObj.a; // 2 依旧是2
```

setter:

```js
var myObj = {
  get a() {
    return this._a_;
  },
  set a(val) {
    this._a_ = val * 2;
  }
}
myObj.a = 2; // 调用了setter方法，使得this._a_的值变成了4
myObj.a; // 调用了getter方法，读取this._a_的值，是4
```


#### 存在性

```js
var myObj = {};
Object.defineProperty(myObj, 'a', {
  enumerable: true,
  value: 2
});
Object.defineProperty(myObj, 'b', {
  enumerable: false,
  value: 3
});
myObj.b; // 3 可以正常访问
('b' in myObj); // true
for(var k in myObj) {
  console.log(k, myObj[k]); // 'a' 2 并没有b
}
```

> 在数组上使用for in有时会产生出人意料的结果。因为这种枚举除了会遍历索引值之外，还会包含所有的可枚举属性。所以遍历数组还是直接使用for循环。

其他方式区分属性是否可枚举：

```js
var myObj = {};
Object.defineProperty(myObj, 'a', {
  value: 2,
  enumerable: true
});
Object.defineProperty(myObj, 'b', {
  value: 3,
  enumerable: false
});
myObj.propertyIsEnumerable('a'); // true
myObj.propertyIsEnumerable('b'); // false

Object.keys(myObj); // ['a']
Object.getOwnPropertyNames(myObj); // ['a', 'b]
```

propertyIsEnumerable会检查给定的属性名是否直接存在对象中，并且满足enumerable: true

Object.keys返回一个数组，包含所有可枚举属性

Object.getOwnPropertyNames会返回一个数组，包含所有属性，无论是否可枚举

in和hasOwnProperty的区别在于是否查找\[[prototype]]链，Object.keys和Object.getOwnPropertyNames都只会查找对象直接包含的属性。

#### 遍历

对于数组来讲，我们经常使用for循环遍历数组下标：

```js
var myArr = [1, 2, 3];
for(var i = 0; i < myArr.length; i++) {
  console.log(myArr[i]); // 1 2 3
}
```

ES6新增了for of方法，可以用来遍历值：

```js
var myArr = [1, 2, 3];
for (var v of myArr) {
  console.log(v); // 1 2 3
}
```

for of会像被访问对象请求一个迭代器对象，然后通过调用迭代器对象的next()方法来遍历所有返回值。

#### 小结

1、JavaScript中的对象有字面量形式（var a = {...}）和构造形式（var a = new Array(...)）

2、对象是6个（或7个）基础类型之一，对象有包括function在内的子类型，不同子类型具有不同的行为

3、对象就是键值对的集合，可以通过.propName和['propName']来获取属性值。访问属性时，实际上会调用内部的\[[Get]]或者\[[Put]]方法。\[[Get]]操作会检查对象本身是否包含这个属性。如果没找到，还会查找\[[prototype]]链。

4、属性的特性可以使用属性描述符来控制，比如writable、configurable。此外，可以使用Object.preventExtensions、Object.seal、Object.freeze来设置对象的不可变性级别。

5、属性不一定包含值，它们可能是具备getter/setter的访问描述符。此外，属性可以是可枚举或者不可枚举的，这决定了它们是否会出现在for in中。

6、可以使用ES6的for of遍历数组，for of会寻找内置或者自定义的@@iterator对象并调用它的next()方法来遍历数据的值。