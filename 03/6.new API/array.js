// Array.of
{
  var a = Array(3);
  console.log(a.length); // 3
  console.log(a); // [undefined, undefined， undefined]

  var b = Array('3');
  console.log(b); // ['3']

  var c = Array.of(3);
  console.log(c); // [3]
}

// Array.from
{
  var arrlike = {
    0: 'first',
    1: 'second',
    length: 2
  };
  var arr = Array.from(arrlike);
  console.log(arr); // ['first', 'second']

  // 过去解决这个问题的方法
  function func() {
    var arr = [].slice.call(arguments);
    console.log(arr);
  }
  func(1, 2); // 输出[1, 2]

  // 映射用法
  var newArr = Array.from(arrlike, function(value) {
    return value.toUpperCase()
  });
  console.log(newArr); // [ 'FIRST', 'SECOND' ]
}