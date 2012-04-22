/**
*Author: zhouquan.yezq
* Time: 2/21/2012
* the dashboard model, service for the dashboard view
*/
ali.defineClass("ali.openpf.dash.register",ali.model,{
    $el:jQuery("#register"),//if use this way, this dashMenuBar should be already existed on the dom.
    events: {
      "click .rsubmitbtn": "doSubmit"
    },
    doSubmit: function(){
      if(this.doV()){
    	this.$('rform')[0].submit();
      }
      return false;
    },
    doV: function(){
      //jQuery.use("web-valid", function() {
             vd = new FE.ui.Valid(jQuery('.editEl',this.$el), {
                onValid : function(res, o) {
                    var fferror=jQuery(this).siblings('.comp-ff-fferror');
                    fferror.css('display',(res=='pass')?'none':'block');
                }
            });
            return vd.valid();
      //}.bind(this));
    }

});