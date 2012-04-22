/**
*@class ali.system
*@name   ali.system
*@author   <a href="mailto:zhouquan.yezq@alibaba-inc.com">Zhouquan.yezq</a>
*@description the system class will charge the system level setting and information,
* like running mode(static/living) , global message timeout etc. so in the feature , if we 
* want change and setting , we just modify one place, not the developer code.
*/
(function($){
    $.namespace('ali.uxcore.util');
    ali.uxcore.util.system={
       /***
              * @name ali.system#STATICMODE
              *@field
              *@description the system will running in the static mode, send request just get the dummy data, not real data.
              */
      STATICMODE:0,
      /***
              * @name ali.system#LIVEMODE
              *@field
              *@description the system will running in the living mode, send request get real data.
              */
      LIVEMODE:1,
      mode:1,
      systempath:'',
      dummydataPath:'',
       /***
              * @name ali.system#globalmsgtimeout
              *@field
              */
      globalmsgtimeout:3000,
      setMode: function(mode) {
        this.mode=mode;
      },
      needLogMonitor: false,
      openLogMemory:false //global setting for log memory flag
    };
    //short cut for ali.uxcore.util.pubsub
    ali.system=ali.uxcore.util.system;

  /**Log Monitor ***/

  $.namespace('ali.monitor');
  var KLASS = ali.monitor;
  KLASS.MONITOR_PAGE = "monitor.html"; //this html file ,you should put together with your project file.   
  KLASS.getName = function() {
    return "iLogger"
  };
  ali.monitor.trunOn = false;
  window.childOpen = false;
  if(ali.system.needLogMonitor){
    $(document).keydown(function(e) {
      if (e.ctrlKey && e.altKey && e.keyCode == 76) { //ctrl+alt+l
        ali.monitor.trunOn = true;
        KLASS._openWindow();
      }
    });
  }
  KLASS._openWindow = function() {
    var url = window.location.href;
    url = url.replace(window.location.pathname, '/' + KLASS.MONITOR_PAGE);
    KLASS._window = window.open(url, "Monitor_", "directories=no," + "location=no," + "menubar=no," + "status=yes," + "personalbar=no," + "titlebar=yes," + "toolbar=no," + "resizable=yes," + "scrollbars=no," + "width=500," + "height=400");
    window.childOpen = true;
    if (this._window) {
      window.focus();
    }
    window.onunload = this.UpdateChild;
  };

  KLASS.UpdateChild = function() {
    //Only if child window is still open, set the parentOpen property
    if (window.childOpen == true) {
      this._window.opener=null;
      this._window.parentOpen = false
      KLASS._window.close();
    }
  };
  KLASS.onHotKey = function() {
    if (this._window == null || this._window.closed) this._openWindow();
  };
  KLASS.appendMessage = function(msg) {
    var w = this._window;
    if (!w || !window.childOpen) {
      this._openWindow();
      w = this._window;
    }
    if (w && w.appendMessage) {
      if (w.isFirstTime()) {
        var memory = ali.logger.logPool;
        for (var i = 0; i < memory.length; i++) {
          w.appendMessage(memory[i]);
        }
      }
      w.appendMessage(msg);
    }
  };

 })(jQuery);