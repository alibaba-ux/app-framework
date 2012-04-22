
ali.defineClass("te.networkTest",function(KLASS,instance){
  KLASS.makeRequest=function() {
       ali.network.ajax({
            method: "GET",
            url: "http://api.twitter.com/1/statuses/show/trevmex.json",
            datatype: "json",
            success: function (data) {
                this.addDataToDOM(data);
            }.bind(this)
        });
    };
    
  KLASS.addDataToDOM= function(data) {
        // does something
        // We will mock this behavior with a spy.
        return data;
    };
});
