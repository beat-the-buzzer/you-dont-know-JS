// 内置对象可以当作构造函数来用
{
  var str = 'str';
  typeof str; // "string"
  str instanceof String; // false

  var strObj = new String('str');
  typeof strObj; // "object"
  strObj instanceof String; // true

  Object.prototype.toString.call(strObj); // "[object String]"
}

// 对象属性访问
{
  var person = {
    name: 'James'
  };
  person.name; // 'James' => 属性访问
  person['name']; // 'James' => 键访问
}

// 属性名必须要是字符串
{
  var a = { a: 1 };
  var b = { b: 1 };
  var c = {};
  c[a] = '123';
  c[b] = '456';

  c[a] // '456' => 实际访问的是c['[object Object]']
}

// 可计算属性名
{
  var key1 = 'name';
  var key2 = 'age';
  var obj = {
    [key1 + key2]: 'James-18'
  };
  obj.nameage; // 'James-18'
  obj['nameage']; // 'James-18'
}

// 数组
{
  var arr = ['str', 0, true];
  arr[0]; // 'str'
  arr['1']; // str
  arr['hehe']; // undefined，并不能找到hehe属性
}

// 对象复制
{
  var obj1 = {};
  var obj2 = obj1;
  obj2.a = 1;
  obj1; // {a: 1}
}

// 深拷贝
{
  var obj = { a: 1 };
  var objCopy = JSON.parse(JSON.stringfy(obj));
}

// 扩展运算符
{
  // 操作对象
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

  // 操作数组
  var arr = [1, 2, 3];
  var arrCopy = [...arr];
  arrCopy[0] = 0;
  arr; // [1, 2, 3]
}

// ES6 Object.assign
{
  var objInner = { a: 1 };
  var obj = {
    b: objInner
  };
  var objCopy = Object.assign({}, obj);
  objCopy.b.a = 2;
  objInner; // { a: 2 } // 改变了
  obj; // { b: { a: 2 } } // 改变了
}

// 属性描述符
{
  var obj = { a: 1 };
  Object.getOwnPropertyDescriptor(obj, 'a');
  // {
  //     value: 1,
  //     writable: true,
  //     emuerable: true,
  //     configurable: true
  // }
}

// writable
{
  var myObj = {};
  Object.defineProperty(myObj, 'a', {
    value: 2,
    writable: false,
    configurable: true,
    enumerable: true
  });

  myObj.a = 3;
  console.log(myObj.a); // 2 属性不可修改，静默失败。
  // 如果是严格模式，就会报错
}

{
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
  // Object.defineProperty(myObj, 'a', {
  //   value: 4,
  //   writable: true,
  //   configurable: true,
  //   enumerable: true
  // });

  // 有一个例外，可以在configurable为false的情况下，把writable从true改成false
  Object.defineProperty(myObj, 'a', {
    value: 4,
    writable: false,
    configurable: false,
    enumerable: true
  });
}


// enumerable
{
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
  for (var i in myObj) {
    console.log(i); // a,b 没有c
  }
}

// 对象常量
{
  var myObj = {};
  Object.defineProperty(myObj, 'a', {
    value: 1,
    writable: false,
    configurable: false,
    enumerable: true
  });
  console.log(myObj); // { a: 1}, 不可修改 重定义 或删除
}

// 对象浅不变性
{
  const arr = [1, 2];
  arr.push(3);
  console.log(arr); // 1,2,3
}

// 禁止扩展
{
  var myObj = {
    a: 1
  };
  Object.preventExtensions(myObj);

  myObj.b = 2;
  console.log(myObj.b); // undefined 严格模式，在上一行就报错
}

// [[get]]操作
{
  var myObj = {
    a: 2
  };
  myObj.a; // 2
}

// 对象访问
{
  var myObj = {
    a: undefined
  };
  myObj.a; // undefined
  myObj.b; // undefined
}

// getter
{
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
  myObj.a; // 2
  myObj.b; // 4
  myObj.a = 3; // 没有setter方法，无效
  myObj.a; // 2 依旧是2
}

// setter
{
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
}

// 存在性校验
{
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
  for (var k in myObj) {
    console.log(k, myObj[k]); // 'a' 2 并没有b
  }
}

// 区分属性是否可枚举
{
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
}

// 遍历数组： 遍历下标，指向值
{
  var myArr = [1, 2, 3];
  for (var i = 0; i < myArr.length; i++) {
    console.log(myArr[i]); // 1 2 3
  }
}

// 遍历数组： 遍历值
{
  var myArr = [1, 2, 3];
  for (var v of myArr) {
    console.log(v); // 1 2 3
  }
}