ali.defineClass("test.class1",{
  uid:'001',
  getUid: function () {
    this.logger.log("the uid property inherit from test.class1:"+this.uid)
  	return this.uid;
  }
});

ali.defineClass("test.class2",test.class1,{
  name:'ww',
  getName: function () {
    this.logger.log("the name property inherit from test.class2:"+this.name)
  	return this.name;
  }
});

ali.defineClass("test.class3",test.class2,{
  age:23,
  getAge: function () {
  	return this.age;
  }
});