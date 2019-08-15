function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.getName = function () {
  return this.name;
}
Person.prototype.getAge = function () {
  return this.age;
}
function Student(name, age, grade) {
  // 构造函数继承
  Person.call(this, name, age);
  this.grade = grade;
}
// 原型继承
Student.prototype = Object.create(Person.prototype, {
  // 这里需要指定constructor
  constructor: {
    value: Student
  },
  getGrade: {
    value: function () {
      return this.grade
    }
  },
  testProp: {
    enumerable: false,
    writable: true,
    configurable: true,
    value: 3
  }
});

var s1 = new Student('Ming', 22, 5);
console.log(s1.getName()); // Ming
console.log(s1.getAge()); // 22
console.log(s1.getGrade()); // 5