/**
*@class jQuery.Logger
*@name   jQuery.Logger
*@author   <a href="mailto:zhouquan.yezq@alibaba-inc.com">Zhouquan.yezq</a>
*@description jQuery.Logger will return a logger instance, and it already solve the console
*script issue on lower browser version like IE6. and for the IE6 or other lower version, we use the log
monitor to show the log . and right now it has the default inline monitor. use quick key: Alt+Shift+Ctrl+L to 
make it works. 
 <h2>How to use?<h2>
<pre>
  var mylog=jQuery.Logger('com.company.project.moduleName');
  mylog.log('this is the log');
</pre>
*/
(function($){
   //the log constructor
   
   var log=function(){};
   log.level=4; //default level, show all the log,if you want to close the log, just set log level as -1
   log.cacheSize=1000;
   log.policy=[]; // the filter policy center
   
   var methods = [ "error", "warn", "info", "debug", "log"];//0-4 level 
   //log level not very clear compare with back-end  --log4j
   
   $.extend(log.prototype, {
    /***
          *  @name jQuery.getLogger#enabled
          * @function
          */
     enabled: function(lev) {
       if(lev>log.level ) {
         return false;
       }
       return true;
     },
     /***
          *  @name jQuery.getLogger#doFilter
          *  @description  if just one filter, so it means just show the log which meet the filter, and if have filter call back ,do it
          *  if have more filters, from the console, it will show all the logs to the user, but it will do every filter call back for it's condiction
          * @function
          */
	 doFilter: function() {
	   if(!(log.policy.length==1)) return true;
	   var f=log.policy[0];
	   f=f['fi'];
	   if(f.test && !f.test(arguments[0][0]) && !f.test(this.name())) {
	     return false
	   }
	   return true;
	 },
     name: function() {
       return this._name;
     },
     /***
          *  @name jQuery.getLogger#log
          * @function
          */
     log: function() {
        this._log(4, arguments);
     },
     /***
          *  @name jQuery.getLogger#debug
          * @function
          */
     debug: function() {
        this._log(3, arguments);
     },
     /***
          *  @name jQuery.getLogger#info
          * @function
          */
     info: function() {
        this._log(2, arguments);
     },
    /***
          *  @name jQuery.getLogger#warn
          * @function
          */
     warn: function() {
        this._log(1, arguments);
     },
     /***
          *  @name jQuery.getLogger#error
          * @function
          */
     error: function() {
        this._log(0, arguments);
     },
     _handler: function(level, name, msg){
        var method=methods[level];
        msg=[[method,name+" |"].join(" | ")].concat(Array.prototype.slice.call(msg));
             if(!log.logPool){
               log.logPool=[];
             }
			 if(log.logPool.length===log.cacheSize){
			    //if the cache log more than cacheSize , then remove the  previous first one.
			    log.logPool=log.logPool.slice(1);
			 }
			 if(!(outputProcessor.turnOn || (this.monitor && this.monitor.trunOn))){
			    log.logPool.push(msg.join(''));
			 }
             if( this.monitor && this.monitor.trunOn ){ //$.browser.msie   Just IE or not
               this.monitor.appendMessage(msg.join(''));
             }else if(!this.monitor){
			   outputProcessor(msg.join(''));
			 }
       if(self.console && self.console.error) {
           if(console.log.apply) {//IE8 do not work on this way. undefined
              console[method].apply(console, msg);       
           }else {
              console[console[method]?method:'log'](msg);
           }
       }
     },
	 
    _log: function(level, msg) {
      if (this.enabled(level) && this.doFilter(msg)) {
         this._handler(level,this.name(),msg);
		 var me=this;
		 log.policy.length>0?$.each(log.policy,function(index,e) {  // do every filter and execute it's callback
		   var f=e['fi'];
		   if(f && f.test &&  (f.test(msg) || f.test(me.name()))) {// if have filter action , do it
		     e['cb']? e['cb'](msg,window.location.href,( new Date() ).getTime()):'';
		   }
		 }):'';
		 
      }
    }
     
   });
   
   var logs={};//logs container
   //extend this getLoggger method as jQuery method
   $.extend({
     Logger: function(name) {
       if (!logs[name]) {
          logs[name] = new log(name);
          logs[name]._name=name;
        }
        return logs[name];
     }
    });
    $.extend($.Logger,{
	// all the Logger configuratin will set under Logger 
	 setLogLevel: function(level) {
	   log.level=level;
	 },
	/**
	 *  @param filter should be RegExp pattern
	 *  @cb this is the call back function, it will pass the log message into
	 *    the cb parameter as the first parameter. so user could do some action to process the log message , like
	 *    send the message to the back-end or others.  etc: cb(message, winodw.location.href,( new Date() ).getTime())
	 *    so user could get the enough information for log
	 */
	 setLogFilter: function(filter,cb) {
	   var fool={
	     'fi':filter
	   };
	   cb?(fool['cb']=cb):'';
	   log.policy.push(fool);
	   //cb?(log.filterAction=cb):'';
	 },
	 
	/**
	 * setting the Monitor page url. Note: we should keep the target page and monior page  under same domain.
	 */
	 setMonitorPage: function(url) {
	   log.monitor?(log.monitor.MONITOR_PAGE)=url:'';
	 },
	 
	 gc: function() { //should parent level call it
	   log=null;
	 }
	 
   });
    
	function outputProcessor(msg){
		if($('#loggingContainer20120526').length==0){
		  var tpl=["<div id='myc'><div id='loggingContainer20120526' style='display:none;clear:left;position:absolute;font-size:11px;right:0px;top:0px;width:350px;",
	      "color:#000;font-family:Monaco, Courier, monospace;z-index:1;border:2px solid #444;'>",
		  "<div id='loggingheader20120526' style='width:100%;height:25px;line-height:25px;background-color:#000;cursor:pointer;text-align:left;color:#FFF;bold-weight:bold;'>",
		  "<span style='float:left;'>Application Log Monitor</span>",
		  "<span style='float:right;cursor:pointer;color:#FFF;margin-right:5px;'><strong  id='loggingclosebtn20120526'>X</strong></span>",
		  "<span style='float:right;width:10px;height:10px;line-height:25px;background-color:yellow;margin:8px 5px;' class='bgcolor' data-bgcolor='yellow'></span>",
		  "<span style='margin:8px 5px;float:right;width:10px;height:10px;line-height:25px;background-color:#FFF;' class='bgcolor' data-bgcolor='#FFF'></span>",
		  "<span style='margin:8px 5px;float:right;width:10px;height:10px;line-height:25px;background-color:pink;' class='bgcolor' data-bgcolor='pink'></span>",
		  "<span style='margin:8px 5px;float:right;width:10px;height:10px;line-height:25px;background-color:#fcf9a4;' class='bgcolor' data-bgcolor='#fcf9a4'></span>",
		  "<span style='margin:8px 5px;float:right;width:10px;height:10px;line-height:25px;background-color:#00bf00;' class='bgcolor' data-bgcolor='#00bf00''></span>",
		  "<span style='margin:8px 5px;float:right;width:10px;height:10px;line-height:25px;background-color:#b4d3f2;' class='bgcolor' data-bgcolor='#b4d3f2''></span>",
		  "<span style='margin:8px 5px;float:right;width:10px;height:10px;line-height:25px;background-color:#bfbfbf;' class='bgcolor' data-bgcolor='#bfbfbf'></span>",
		  "</div>",
	      "<div id='logging20120526' style='position:relative;background-color:#FFF;font-size:11px;color:#000000;",
	      "text-align:left;padding: 19px 4px 2px 4px;width:340px;height:400px;overflow-y:auto;overflow-x:auto;'>",
	      "</div></div></div>"].join('');
		    $(document.body).append(tpl);
			$('#loggingheader20120526').dblclick(function(){
			   var t=$('#logging20120526');
			   t.css('display')=='block'?t.hide():t.show();
			});
			$('#loggingheader20120526').delegate('.bgcolor','click',function(){
			  $('#logging20120526').css('background-color',$(this).data('bgcolor'));
			})
			$('#loggingclosebtn20120526').click(function(){
			  $('#loggingContainer20120526').hide();
			});
		    $(document).keydown(function(e) {
			    if (e.ctrlKey && e.altKey && e.keyCode == 76) { //ctrl+alt+l
				      $('#loggingContainer20120526').show();
					  outputProcessor.turnOn=true;
				      $.use('ui-core,ui-draggable,ui-dialog', function(){
		              var d = $('#loggingContainer20120526',"#myc");
					  d.dialog( {
					        modal: false,
					        shim: true,
							draggable:{
							  handle:'#loggingheader20120526'
							},
							 css: {
						        left: e.clientX?(e.clientX +100):600,
		                        top: e.clientY? (e.clientY+100):100
						    }
							});
		             });

			    }
		    });
		}
	     $.each(log.logPool,function(index,e){
		   appendMessage(e);
		 });
		 log.logPool=[];
		 appendMessage(msg);
	};
	
	function appendMessage(strMessage){
        var logLevel=strMessage.split('|')[0];
        //var methods = [ "error", "warn", "info", "debug", "log"];
        var color="";
        switch (logLevel)
        {
          case 'error ':
            color='color:#990000;';
            break;
          case 'warn ':
            color='color:#996600;';
            break;
          case 'info ':
            color='color:#000000;';
            break;
          case 'debug ':
           color='color:#444444;';
           break;
          case 'log ':
           color='color:#888888;';
           break; 
        }
        this._hasappendedmsg = true;
		//TODO add object parse processor, right now all the thing, just treat it as text.
         $('#logging20120526').append('<pre style="'+color+' ">'+strMessage+'</pre>');
	};
   //jQuery(function($) {
   //  outputProcessor('');
   //});
})(jQuery);

