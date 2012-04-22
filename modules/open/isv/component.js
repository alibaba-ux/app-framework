/**
*Author: zhouquan.yezq
* Time: 2/21/2012
* the dashboard model, service for the dashboard view
*/
ali.defineClass("ali.openpf.isv",ali.model,{
    $el:jQuery("#isvwelcome"),
    events:{
      "mouseenter div.comp-interface": "onMouseE_Interf",
      "mouseleave div.comp-interface": "onMouseL_Interf"
    },
    onMouseE_Interf: function() {
      
    },
    onMouseL_Interf: function() {
      
    },
    initBanner: function() {
      
    }
  
});

var instance=new ali.openpf.isv({$el:jQuery("#isvwelcome")});
instance.initBanner();