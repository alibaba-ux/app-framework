/**
 * @preserve Copyright (c) 2012 Alibaba Inc. All rights reserved. Proprietary and confidential.
 */
/**
*@class  ali.defineClass  
*@name   ali.defineClass
*@author   <a href="mailto:zhouquan.yezq@alibaba-inc.com">Zhouquan.yezq</a>
*@description  * Defines a new class. If there is a super class other than <code>Object</code> pass this as the first parameter,
* followed by any number of mixins or other objects to inject into the class prototype.
* <pre>
* ali.defineClass('ali.uxcore.openpf.nav',MySuperclass, ali.PubSub, MyMixin, {
*
*   property: 1,
*
*   init: function() {
*     MyClass._super.init(this, arguments);
*   },
*
*   method: function() {
*     return this.property;
*   }
*
* });
* </pre>
* or below style, this style will support add the static method or prototype method, to support the complex application scenario
 * <pre>
 * ali.defineClass('ali.uxcore.openpf.nav',MySuperclass, ali.PubSub,function(KLASS,instance){
 *     KLASS.getName=function(){
 *         KLASS.logger.log('this is the static method');
 *     };
 *     instance.getName=function(){
 *        this.logger.log('this is the instance method');
 *     };
 * });
 * </pre>
or 
 * <pre>
 * ali.defineClass('ali.uxcore.openpf.nav',function(KLASS,instance){
 *     KLASS.getName=function(){
 *         KLASS.logger.log('this is the static method');
 *     };
 *     instance.getName=function(){
 *        this.logger.log('this is the instance method');
 *     };
 * });
 * </pre>
 <ul>
  <li>1: current , just support prototype property and method inherit, static method and prototype , 
 do not inherit .
 </li>
 </ul>
 */
if (!Function.prototype.bind)
  Function.prototype.bind = (function(){
    var _slice = Array.prototype.slice;
    return function(context) {
      var fn = this,
          args = _slice.call(arguments, 1);
      if (args.length) {
        return function() {
          return arguments.length
            ? fn.apply(context, args.concat(_slice.call(arguments)))
            : fn.apply(context, args);
        }
      }
      return function() {
        return arguments.length
          ? fn.apply(context, arguments)
          : fn.call(context);
      };
    }
  })();
(function($){
  $.namespace('ali');
  //to rewrite the namespace method in the runtime, since I need get the last item object , to attach the
  // the method from the inherit , mixsin or ,,,
  var s=function (){
    var q=arguments[0],u,s=0,r,t,p,f;
    u=window;
    p=q;
    if(p.indexOf(".")){
        t=p.split(".");
        t[0]=="window"?(f=t[1]):(f=t[0]);
        for(r=(t[0]=="window")?1:0;r<t.length;r++){
            u[t[r]]=u[t[r]]||{};
            u=u[t[r]]
            if(r==t.length-1)
              return u;
        }
    }else{
        u[p]=u[p]||{}
        return u[p];
    }
  };
  ali.defineClass = function() {

    var cls = function() {
      //var args=Array.prototype.slice.call(arguments);
      if (typeof(this._init) == "function" && arguments[0] !== undefined)
        this._init.apply(this, arguments);
    };

    var a = arguments;
    var sup = Object;
    //current, just support single inherit
    var objfun=[],staticFun;
    for (var i = 0; i < a.length; i++) {
      if (typeof(a[i]) == "function") {
        objfun.push(a[i]);
     }
   }
      if(objfun.length>=1){
          for (var i = 0; i < objfun.length; i++) {
            if(!!objfun[i]["logger"]){
              sup = objfun[i]; //first ali class is the super class
            }else{
              staticFun=objfun[i];
            }
          }
      }
   //  // support the static method and instance method adding at one time
    if (sup != Object){//copy from  Google Closure Compiler helpers
        function t() {};
        t.prototype = sup.prototype;
        cls.prototype = new t({});
        cls.prototype.constructor = cls;
        cls._super = sup.prototype;
    }
    //use the logger property to judge it is the simple function or ali class, fix the 
    //previous issue , if no super class, static class define will not work.
    //if(objfun[objfun.length-1]  ){
      //!objfun[objfun.length-1].logger?objfun[objfun.length-1](cls,cls.prototype):'';
   // }
    (typeof staticFun=='function')?staticFun(cls,cls.prototype):'';
    //we could get the class according the class instance.
    cls.prototype.aliClass = function() { return cls; };

    for (var i = 0; i < a.length; i++) {
      if (typeof(a[i]) == "object")
        $.extend(cls.prototype, a[i]);
      else {
      }
    }
    if (typeof(a[0]) == "string") {
        var arr=a[0].split('.');
        var la=arr.splice(-1,1);
        s(arr.join('.'))[la]=cls;
    }

    //add a default logger for every class instance
    cls.logger=cls.prototype.logger=jQuery.Logger(a[0]);
    return cls;
  };
 })(jQuery);