/**
*Author: zhouquan.yezq
* Time: 2/21/2012
* the dashboard model, service for the dashboard view
*/
ali.defineClass("ali.openpf.isv.applist",ali.model,{
    events: {
    },
    initGrid: function(){
      this.$("#mygrid").jqGrid({
      url:'../../../staticdata/getApplist.json',
      datatype: "json",
      colNames:['应用名称','证书', '状态', '操作'],
      colModel:[
          {name:'appName',index:'appName', width:150,formatter : function(value, options, rData){
            return '<div><div style="float:left;width:30px;height:30px;border:1px solid #999;margin:11px 10px 10px 0px"></div><p style="line-height:55px;">'+value+'</p></div>'
          }},
          {name:'paper',index:'paper', width:300,formatter: function(value, options, rData){
            return '<div><span>APP Key: </span><span style="color:#0066cc">'+value+'</span><span style="padding-left:10px;">流量: </span><span>'+rData[2]+' 次/每天</span></div>';
          }},
          {name:'status',index:'status', width:200,formatter: function(value, options, rData){
            var innerHTML='';
            if(rData[3]=='testing'){
            innerHTML='<span class="applistItem-status apptesting"></span><span style="line-height:40px">正式测试环境</span>';
            }else if(rData[3]=='checking'){
            innerHTML='<span class="applistItem-status appchecking"></span><span style="line-height:40px">应用审核中</span>';
            }else if(rData[3]=='checkfailed'){
              innerHTML='<span class="applistItem-status checkfailed"></span><span style="line-height:40px">应用审核不通过</span>';
            }else if(rData[3]=='online'){
              innerHTML='<span class="applistItem-status online"></span><span style="line-height:40px">已上架</span>';
            }else if(rData[3]=='onchecking'){
              innerHTML='<span class="applistItem-status onchecking"></span><span style="line-height:40px">待审核</span>';
            }
            return innerHTML;
          }},
          {name:'operation',index:'operation', width:250, align:"left", formatter: function(value, options, rData){
            if(rData[3]=='testing' || rData[3]=='checkfailed'){
              return '<div class="menubtn f12"><a href="http://style.china.alibaba.com/open/lib/modules/open/isv.modifyappinfo/"><span class="tx">修改</span></a></div><span class="menubtnspliter">|</span><div class="menubtn f12"><a href="#"><span class="tx">删除</span></a></div>';
            }else{
              return '<div class="menubtn f12"><a href="#"><span class="tx">查看</span></a></div>';
            }
          }}
      ],
      rowNum:20,
      sortname: 'id',
      viewrecords: true,
      sortorder: "desc"
      });
      this.$("#mygrid").jqGrid('navGrid',{edit:false,add:false,del:false});
      this.$(".ui-jqgrid-bdiv").css({"height":"600px","width":"auto"}); 
      this.$(".ui-jqgrid-hdiv").css({"width":"auto"});
    }

});