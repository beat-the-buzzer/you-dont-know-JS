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