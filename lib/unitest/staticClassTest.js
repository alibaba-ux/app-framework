
//
ali.defineClass("te.staticClass",function(KLASS,instance){
  KLASS.helloWorld= function() {
  	return "helloworld";
  };
  
  instance.helloWorld= function() {
  	return "helloworld";
  };
});


ali.defineClass("te.staticClass2",te.staticClass,function(KLASS,instance){
  KLASS.helloWorld2= function() {
  	return "helloworld2";
  };
  
  instance.helloWorld2= function() {
  	return "helloworld2";
  };
});
