/**
*Author: zhouquan.yezq
* Time: 3/6/2012
*/
ali.defineClass("ali.openpf.isv",ali.model,{
    events:{
    },
    initNavTabs: function() {
        this.logger.log("++++initNavTabs enter+++++");
        jQuery.use('ui-tabs', function() {
            jQuery('#bannertab').tabs({
                isAutoPlay:true,
                effect:'fade',
                currentClass:'curpoint',
                select: function(e, data) {
                }
            });
        }.bind(this));
    },
    initHook2: function(){
      if(this.$('#bannertab').length>0){
        this.initNavTabs();
      }
    },
    getLoginId: function() {
      return FE.util.loginId;
    },
    isLogin: function() {
        return FE.util.isLogin;
    },
    initView: function(){
        this.logger.log("isLogin: "+this.isLogin());
        if(this.isLogin()){
            this.setLoginDisplay(this.$('ul.logined'),true);
            this.setLoginDisplay(this.$('ul.nologin'),false);
            this.setContent(this.$('#loginid'),this.getLoginId());
        }else{
            this.setLoginDisplay(this.$('ul.logined'),false);
            this.setLoginDisplay(this.$('ul.nologin'),true); 
            this.setContent(this.$('#loginid'),'');
        }
    },
    initWW: function(){
      jQuery.use('web-alitalk', function() {
      FE.util.alitalk(jQuery('a[data-alitalk]'),{
        onRemote: function(data) {
            var el = jQuery('a[data-alitalk]');
            el.addClass("alitalk-on");
            el.removeClass("alitalk-mb");
            //el.html("qiuff1013");
        }
      });
    });
    },
    setLoginDisplay: function(target,b){
        target.css("display",b?"block":"none");
    },
    setContent: function(target,c){
        target.html(c);
    }
});