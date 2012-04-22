define(function(require, exports,module) {

  exports.foo = 'a';
  /*require.async('../lib/logging',function(){
      var myLog=ali.getLogger('ssss');
  console.info(myLog);
  });*/

 var t=require.resolve('../lib/logging');
 console.log(t);
 console.log(module.id)

});