/**
*@class  ali.network
*@name ali.network
*@author   <a href="mailto:zhouquan.yezq@alibaba-inc.com">Zhouquan.yezq</a>
* @description ali.network is the network class service for the project, include the ali.network.ajax
* etc. this class is the wrap for jQuery ajax , so we could do more thing , like extend the ajax, error
* message handler, success message show up etc. also the cache mechanism, this will be implement in the
* next stage .
*
*/
(function($){
    $.namespace('ali.uxcore.util');
    var sys=ali.system;
    var showMsgObj={'msgEl':null,'errorMsg':'默认错误信息','successMsg':'默认成功信息'};
    var mylog=$.Logger("ali.network");
    ali.uxcore.util.network={
   /**
     *  @name ali.network#ajax
      * @function
      *@description this method is the same as jQuery.ajax , we just wrap it , and do some extend for it .
      * how to use it?
      * 1: for the message hanlde , you should pass showMsgObj to the ajax parameter, this object is
      * the json type, var showMsgObj={msgEl:jQuery("selector"),errorMsg:'',successMsg:''}, and for the
      * msgEl, this is the jQuery dom element, and we should add .comp-ff-info class for info message,
      * add .comp-ff-error for error message, .comp-ff-warn for warn message, .comp-ff-error for error message
      *.comp-ff-success for success message . the ali.network will be auto add them . so developer will
      *just focus on logic , not view style . for time out example , please see timeoutTest.html.
      * <pre>
      * ali.network.ajax({
      *         url:'timeout.php',
      *         showMsgObj:{
      *            msgEl: $("#errorshow"),
      *            isBigIcon:false,
      *            errorMsg:'Error Message',
      *            successMsg:'Success Message'
      *         },success:function(data){
      *           console.info(data);
      *         },error:function(){
      *
      *        }
      *   })
      * </pre>
      *
      */
      ajax: function() {
        var objAux=arguments[0]
        var n=objAux.methodName;
        var scope=objAux.scope;
        showMsgObj=objAux.showMsgObj?objAux.showMsgObj:showMsgObj;
        var suc=objAux.success?objAux.success:function(){};
        var err=objAux.error?objAux.error:function(){};
        // so if load html fragement or js , we need moduleName parameter
        //this place we could do some work for some module plugalbe project.
        if(objAux.dataType=='html') {
            //objAux.url=[sys.systempath,'/modules/',objAux.moduleName,'/view.html'].join('');
        }else if(objAux.dataType=='script') {
           // objAux.url=[sys.systempath,'/modules/',objAux.moduleName,'/model.js'].join('');
        }else if(objAux.dataType=='json' && sys.mode==sys.STATICMODE) {
            // ifcall a method to get json data , we should attach methodName as parameter
             //$.getJSON([sys.dummydataPath,'/',n,'.json'].join(''),suc);
             //return;
        }
        var args={
            url:objAux.url,
            dataType:objAux.dataType,
            success:suc,
            error:function(xhr,status,error){//we should wrap the error method, expose some useful case to developer
              mylog.log('status:'+xhr.status);
              if(status!=="error"){// "timeout", "abort", and "parsererror"
                err.apply(null,arguments);// at least should process timeout
              }
              if(xhr.readyState==4){//error 404,500 tec  xhr.status
                err.apply(null,arguments); // at least should process 500 error
              }else{// some other case
                mylog.log(xhr.readyState);
              }
            },
            timeout: 5000,
            method:objAux.method,
            type:objAux.type?objAux.type:'get',
            data:objAux.data?objAux.data:'',
            beforeSend:objAux.beforeSend?objAux.beforeSend:'',
            complete:objAux.complete?objAux.complete:'',
            cache:objAux.cache == undefined ? true : objAux.cache
        };
        return jQuery.ajax(args).done(this.onSuccess).fail(this.onError).always(this.onComplete);
      },
      onSuccess: function(data) {
         mylog.log("++++ onsuccess+++");
         data= jQuery.parseJSON(data);
        if(showMsgObj['msgEl'] && !data.success){
             switch (data.level)
             {
               case "WARN":
                   showMsgObj['msgEl'].attr("class",showMsgObj['isBigIcon']?"comp-ff-big-warn":"comp-ff-small-warn");
                  break;
                case "FATAL":
                    showMsgObj['msgEl'].attr("class",showMsgObj['isBigIcon']?"comp-ff-big-error":"comp-ff-small-error");
                 break;
               default:
                 break;
             }
            showMsgObj['msgEl'].html(data['errMsg']);
        }
      },
      onError: function(xhr, textStatus,errorThrown) {
        mylog.log("+++timout ++++");
        mylog.info(textStatus);
        if(showMsgObj['msgEl']){
             showMsgObj['msgEl'].attr("class",showMsgObj['isBigIcon']?"comp-ff-big-error":"comp-ff-small-error");
                switch (textStatus)
                {
                   case "timeout":
                       showMsgObj['msgEl'].html("请求超时！");
                       break;
                   case "abort":
                       showMsgObj['msgEl'].html("请求被取消！");
                       break;
                   default:
                        showMsgObj['msgEl'].html(showMsgObj.errorMsg);
                        break;
                }
        }
      },
      onComplete: function() {
        mylog.log("+++onComplete ++++");
      },
      getScript: function() {
        var objAux=arguments[0]
        objAux.dataType="script";
        ali.network.ajax(objAux);
      },
      getHTML: function(){
        var objAux=arguments[0]
        objAux.dataType="html";
        ali.network.ajax(objAux);
      },
      getJSON: function(){
        var objAux=arguments[0]
        objAux.dataType="json";
        ali.network.ajax(objAux);
      }
    };
    //short cut for ali.uxcore.util.pubsub
    ali.network=ali.uxcore.util.network;
 })(jQuery);
