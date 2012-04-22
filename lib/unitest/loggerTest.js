ali.defineClass("test.logger1",{
  getLoggerInstance: function() {
  	return this.logger;
  }
});


ali.defineClass("test.logger2",function(KLASS){
  KLASS.getLoggerInstance= function() {
  	return KLASS.logger;
  };
  //}
});
