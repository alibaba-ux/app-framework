ali.defineClass("ali.openpf.isv.createApp",ali.model,{
    events: {
      "click span.appdelete": "onAppDelete",
      "click #closedlgIcon": "doDlgClose",
      "click #confirmbtn": "doAction",
      "click #cancelbtn": "doCancel",
      "click span.applyReason": "onApplyReason",
      "click #findSecretKey": "onFindSecretKey",
      "click #resetSecretKey": "onResetSecretKey",
      "change #cappcheckbox": "oncappcheckboxChange"
    },

    oncappcheckboxChange: function() {
      var isChecked=this.iscappcheckboxChecked();
      this.logger.log(isChecked);
      this.$("#cappcheckbox_error").css("display",isChecked?'none':'block');
    },
    iscappcheckboxChecked: function() {
      return this.$("#cappcheckbox").prop('checked');
    },
    doSubmit: function(){
        if (this.doV()) {
            this.$('#createAppForm')[0].submit();
        }
        return false;
    },
    doV: function(){
       var vd = new FE.ui.Valid(jQuery('.editEl', this.$el), {
                onValid : function(res, o) {
                    switch (o.type) {
                        case 'fun':
                            if (!o.msg) {
                                res = 'nopass';
                            }
                    }
                    var fferror = jQuery(this).siblings('.comp-ff-fferror');
                    fferror.css('display', (res == 'pass') ? 'none' : 'block');
                }
        });
        if (!vd.valid()) {
            return false;
        }
        if(!this.iscappcheckboxChecked()){
          this.oncappcheckboxChange();
          return false;
        }
        return true;
    },

    reloadAppList : function(){
      jQuery("#mygrid").setGridParam({
        url:jQuery("#list_url").attr("value")
      }).trigger("reloadGrid"); 
    },

    showDialog : function(){
      this.$('#confirmbtn').css('display',"block");
      var d = this.$("#applistDlg");
      jQuery.use('ui-dialog', function(){
        d.dialog({
          modal: true,
          draggable: {
           handle: "#dheader",
           containment: 'body'
          },
          shim: true,
          center: true
        });
      });
      //jQuery("#dheader" ).draggable();
    },

    //设置对话框 title
    setDialogTitle : function(title){
      this.$('#dheader>p').html(title);
    },
    // 设置对话框内容
    setDialogContent : function(content){
      this.$('#dbody').html(content);
    },

    setDialogLoading : function(content){
      this.$('#dbody').html('<span><img src="http://img.china.alibaba.com/cms/upload/2012/924/303/303429_1255716180.gif"/></span>' + content);
    },
   
    // 获得对话框内容元素 
    getDialogContentEl : function(){
      return  this.$('#dbody');
    },

    // set/get 对话框确认按钮绑定的data
    dialogConfirmBtnData : function(){
      if(arguments.length === 1){
        return this.$('#confirmbtn').data(arguments[0]);  
      }
      if(arguments.length === 2){
        this.$('#confirmbtn').data(arguments[0],arguments[1]);
      }
    },

    hideDialogBtn : function(){
      this.$('#confirmbtn').hide();
      this.$('#cancelbtn').hide();
    },

    showDialogBtn : function(){
      this.$('#confirmbtn').show();
      this.$('#cancelbtn').show();
    },

    showSuccessinfo : function(content){
      this.$("#msg-level").attr("class","comp-ff-big-success");
      this.$("#msg-level span.info").html(content);
      this.$("#remind-msg").fadeIn(800).delay(1500).fadeOut(800);
    },

    showErrorinfo : function(content){
      this.$("#msg-level").attr("class","comp-ff-big-error");
      this.$("#msg-level span.info").html(content);
      this.$("#remind-msg").fadeIn(400).delay(1500).fadeOut(400);
    },

    showWarninfo : function(content){
      this.$("#msg-level").attr("class","comp-ff-big-warn");
      this.$("#msg-level span.info").html(content);
      this.$("#remind-msg").fadeIn(400).delay(1500).fadeOut(400);
    },

    showAttentioninfo : function(content){
      this.$("#msg-level").attr("class","comp-ff-big-attentions");
      this.$("#msg-level span.info").html(content);
      this.$("remind-msg").fadeIn().delay().fadeOut();;
    },

    onAppDelete: function(e){
      this.delete_url = this.$(e.target).data('url');
      this.logger.info(this.delete_url);
      this.setDialogTitle('删除App');
      this.dialogConfirmBtnData("action","delete");
      this.setDialogContent('确认删除？');
      this.showDialog();
      return false;
    },

    
    doDlgClose: function(){
      this.$("#applistDlg").dialog('close');
    },

    doCancel: function(){
       this.doDlgClose();
    },
   
    onApplyReason: function(e){
      this.apply_reason_url = this.$(e.target).data('url');
      this.logger.info(this.apply_reason_url);
      this.setDialogContent('Loading...');
      this.showDialog();
      
      ali.network.ajax({
        url : this.apply_reason_url,
        showMsgObj:{
          msgEl: this.getDialogContentEl(),
          errorMsg:'对不起，查找失败，请稍后重试'
        },
        success: function(json){
          var response = jQuery.parseJSON(json);
          this.logger.info(response);
          if(response.success){
            this.logger.info("success :" + response);
            if( response.result == null || response.result.trim() == ''){
              this.setDialogContent('对不起，查找失败，请稍后重试');
            }else{
              this.setDialogContent(response.result);
            }
          }else{
            this.setDialogContent(response.errMsg == null ? '对不起，查找失败，请稍后重试' : response.errMsg);
          }
        }.bind(this),

        timeout : function(xhr,status,errormsg){
          if(status=='timeout'){
              this.setDialogContent('对不起，查找超时，请稍后重试');
              this.logger.info(" find apply reason app timeout");
          }
        }
      });
    },
    
    // 重置 appSecretKey 的窗口
    onResetSecretKey : function(e){
      this.logger.info(e.target);
      this.resetSecretKeyUrl = this.$(e.target).data("url");
      this.dialogConfirmBtnData("action","resetSecretKey");
      this.logger.info(this.resetSecretKeyUrl);
      this.setDialogTitle("重置 app secret key");
      this.setDialogContent('确认重置？');
      this.showDialog();
      return false;
    },

    // 查看 appSecretKey 的窗口
    onFindSecretKey : function(e){
      var target = jQuery("#findSecretKey");
      this.logger.info(target);
      this.findSecretKeyUrl = target.data("url");
      this.logger.info(this.findSecretKeyUrl);
      this.setDialogTitle('查看 app secret key');
      this.setDialogLoading('查找中');
      this.showDialog();

      ali.network.ajax({
        url : this.findSecretKeyUrl,
        success: function(json){
          var response = jQuery.parseJSON(json);
          this.logger.info(response);
          if(response.success){
            this.logger.info("success :" + response);
              if( response.result == null || response.result.trim() == ''){
                this.setDialogContent('对不起，查找失败，请稍后重试');
              }else{
                this.setDialogContent('您的 app secrey key 为 : ' + '<strong>' + response.result + '</strong>');
              }
           }else{
             this.setDialogContent('对不起，查找失败，请稍后重试');
           }
         }.bind(this),

         error : function(xhr,status,errorMsg){
           if(status=='timeout'){
               this.setDialogContent('对不起，请求超时，请重试');
               this.logger.info(" find apply reason app timeout");
           }
         }.bind(this)
       });
       //this.$("#dbody").addClass("loading");
      return false;
    },

    doAction: function(){
      var action = this.dialogConfirmBtnData("action");
      this.dialogConfirmBtnData("action", null); // clean the action
      //删除app
      if("delete" == action){
        this.doDelete();
      }
      else if("resetSecretKey" == action){
        this.doResetSecretKey();
      }
      else if("reloadApplist" == action){
        this.doReloadApplist();
      }
      else{ //其他动作，默认关闭
       this.doDlgClose();
      }
    },

    //做删除的请求
    doDelete : function(){
      if(this.delete_url){
        ali.network.ajax({
          url : this.delete_url,
          type: "POST",
          beforeSend : function(xhr, settings){
            this.hideDialogBtn();
            this.setDialogLoading('删除中');
          }.bind(this),
          success: function(json){
            var response = jQuery.parseJSON(json);
            this.logger.info(response);
            if(response.success){
              this.showSuccessinfo("删除成功");
              this.logger.info("删除成功");
              this.reloadAppList();
            }else{
              this.showErrorinfo(response.errMsg == null ? '对不起，删除失败，请稍后重试' : response.errMsg);
              this.logger.info("删除失败");
            }
          }.bind(this),
          error : function(xhr,status,errorMsg){
              this.showErrorinfo('对不起，删除失败，请稍后重试');
              this.logger.info(" delete app timeout");
          }.bind(this), 
          complete : function(xhr, status){
            this.doDlgClose();
            this.logger.info(xhr);
            this.logger.info(status);
          }.bind(this)
        });
      }
      this.delete_url = null; // clean the delete url
    },

    doResetSecretKey : function(){
       this.setDialogLoading('重置中');
       ali.network.ajax({
        url : this.resetSecretKeyUrl,
        type : "POST",
        success: function(json){
          var response = jQuery.parseJSON(json);
          this.logger.info(response);
          if(response.success){
            this.setDialogContent('新的 secret key 为 : ' +  '<strong>' + response.result + '</strong>');
           }else{
            this.setDialogContent(response.errMsg == null ? '对不起，重置失败，请稍后重试' : response.errMsg);
           }
         }.bind(this),

         error : function(xhr,status,errorMsg){
           if(status=='timeout'){
               this.setDialogContent('对不起，重置超时，请稍后重试');
               this.logger.info(" reset reason app timeout");
           }
         }.bind(this)
       });
       this.resetSecretKeyUrl = null; // clean the reset url
    }

  });
