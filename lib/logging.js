/**
*@class ali.getLogger
*@name   ali.getLogger
*@author   <a href="mailto:zhouquan.yezq@alibaba-inc.com">Zhouquan.yezq</a>
*@description ali.getLogger will return a logger instance, and it already mask the console
* script issue on lower browser version like IE6. and for the IE6 or other lower version, we will
* support it logger later. 
 <h2>How to use?<h2>
<pre>
  var mylog=ali.getLogger('ali.openpf.isv.register');
  mylog.log('this is the log');
</pre>
or
 * <pre>
 * ali.defineClass('ali.openpf.isv.register',MySuperclass, ali.PubSub,function(KLASS,instance){
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
  ali.defineClass('ali.openpf.isv.register',MySuperclass, ali.PubSub,{
  print: function(){
    this.logger.log('this is the print method');
  },
  initEl:function() {
      this.logger.log('this is the initEl method');
  }
  });
  </pre>
*/
(function($){
   //the Logger constructor
   $.namespace('ali.uxcore.util'); 
   ali.uxcore.util.Logger=function(){};
   ali.uxcore.util.Logger.level=4; //default level
   ali.uxcore.util.Logger.setLevel=function(level){//set logger level to filter the logger , so just show the logger level you focus.
     ali.uxcore.util.Logger.level=level;
   };
   
   var methods = [ "error", "warn", "info", "debug", "log"];//0-4 level
   
   $.extend(ali.uxcore.util.Logger.prototype, {
     level:ali.uxcore.util.Logger.level,//default level is 4, so all the log will be print out.,
     setEnableLevel: function(level) {
       if(level>4 || level<0) {
         this.error(['wrong level setting. level should be 0-4, the int type,you set ',level,", so stupided."].join(''));
       }
       this.level=parseInt(level);
     },
     enabled: function(lev) {
       if(lev>this.level) {
         return false;
       }
       return true;
     },
     name: function() {
       return this._name;
     },
     /***
          *  @name ali.getLogger#log
          * @function
          */
     log: function() {
        this._log(4, arguments);
     },
     /***
          *  @name ali.getLogger#debug
          * @function
          */
     debug: function() {
        this._log(3, arguments);
     },
     /***
          *  @name ali.getLogger#info
          * @function
          */
     info: function() {
        this._log(2, arguments);
     },
    /***
          *  @name ali.getLogger#warn
          * @function
          */
     warn: function() {
        this._log(1, arguments);
     },
     /***
          *  @name ali.getLogger#error
          * @function
          */
     error: function() {
        this._log(0, arguments);
     },
     _handler: function(level, name, msg){

        var method=methods[level];
        msg=[[method,name+" |"].join(" | ")].concat(Array.prototype.slice.call(msg));
             if(!ali.uxcore.util.Logger.logPool){
               ali.uxcore.util.Logger.logPool=[];
             }
             ali.uxcore.util.Logger.logPool.push(msg.join(''));
             if( ali.monitor && ali.monitor.trunOn ){ //$.browser.msie &&
               ali.monitor.appendMessage(msg.join(''));
             }
       if(self.console && self.console.error){
           if(console.log.apply){//IE8 do not work on this way. undefined
              console[method].apply(console, msg);       
           }else{
              console[console[method]?method:'log'](msg);
           }
       }
     },
    _log: function(level, msg) {
      if (this.enabled(level)) {
         this._handler(level,this.name(),msg);
      }
    }
     
   });
   
   var logs={};//logs container
   ali.uxcore.util.getLogger= function(name) {
       if (!logs[name]) {
          logs[name] = new ali.uxcore.util.Logger(name);
          logs[name]._name=name;
        }
        return logs[name];
   };
   //short cut
   ali.logger=ali.uxcore.util.Logger;
   ali.getLogger=ali.uxcore.util.getLogger;
})(jQuery);
