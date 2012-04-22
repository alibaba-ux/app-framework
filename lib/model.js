/**
*@class  ali.model
*@name ali.model
*@author   <a href="mailto:zhouquan.yezq@alibaba-inc.com">Zhouquan.yezq</a>
*@description  <p>ali.mode is the basic class for all the model,it inherit the ali.pubsub,
*              and also show up how to define the event, how to bind the class to the view<br>
*             Issue: load the model, should make sure the Dom render already, or the event could not attach correct.<p>
*/
ali.defineClass("ali.model",ali.pubsub,{

    /**
     *  @name ali.model#_init
     *  @description init method for the class, and also expose the hook method for developer: initHook
     */
    _init:function() {
      this.reuseModel=true;
      this.initialize.apply(this,arguments);
      this.initHook();
      this.pub('inited');
      this.sub('beforedoV',function(){
        this.closeAllServerError();
      }.bind(this));
    },
    /***
  *  @name ali.model#$el
     * @description the jQuery dom element we want the class to attach, so according the $el,
     * the class and DOM element will make the connection
     * @field
     */
    $el:'',
     /***
     *  @name ali.model#events
     * @description list all the event we want to attach ,and also target which we want attach, also the call back
     * @field
     */
    events:{
    },
     /***
     *  @name ali.model#initialize
     * @function
     * @description the initialize method for every class
     * @param {JSON} auxObj
     * @return NULL
     */
    initialize: function(auxObj) {
        for (var key in auxObj) {
            this[key] = auxObj[key];
        }
        this.delegateEvents();
    },
     /***
     *  @name ali.model#initHook
      * @function
     * @description the hook method for init, so if user want do some hook during the init, just rewrite the initHook
     *  method, and right now the initHook method will do the form element border color effect by default.
     * @return NULL
     */
    initHook: function(){
      this.$('.editEl').each(function(index,e) {
         this.$(e).css({'border-color' : '#91c3d8',"border-width":'1px',"border-style":"solid"})
      }.bind(this));
      this.$('.editEl').focus(function(e){
          this.$(e.target).css({'border-color' : '#fe876b'});
      }.bind(this));

      this.$('.editEl').blur(function(e){
           this.$(e.target).css({'border-color' : '#91c3d8'});
      }.bind(this));
      this.$('.readonly').blur(function(e){
           this.$(e.target).css({'border-color' : '#dedede'});
      }.bind(this));
    },
    /***
     *  @name ali.model#$
      * @function
     * @description this.$ function is the optimize method for jQuery dom element query, it do not query from the whole
     * document, just starting from  the $el element . and some time , since the this point context change, we need use
     * the bind method to bind the current context to the target function
     * @return NULL
     */
    $: function(selector) {
      return this.$el.find(selector);
    },
     /***
     * @name ali.model#delegateEvents
     * @function
     * @description this method will delegate all the event to the target element according the events JSON we defined,
     * if the selector element do not find, the event will not be delegate to the target element
     * @return NULL
     */
    delegateEvents: function() {
        // Cached regex to split keys for `delegate`.
        var eventSplitter = /^(\S+)\s*(.*)$/;
        var events = this.events;
        for (var key in events) {
            var method = events[key];
            if (!jQuery.isFunction(method)) method = this[events[key]];
            if (!method) throw new Error('Event "' + events[key] + '" does not exist');
            method = method.bind(this);
            var match = key.match(eventSplitter);
            var eventName = match[1], selector = match[2];
            //todo need think if no validate, the match of el position should be change
            if(this.reuseModel && this.$(selector).length>0){  
               this.$el.delegate(selector, eventName, method);
            }else if(!this.reuseModel){
              this.$el.delegate(selector, eventName, method);
            }
        }
    },
    /***
         *  @name ali.model#doV
         * @function
         * @description this is the empty for validation, the user will rewrite this method, and use the fd4 web-valid to do
         * the validation
         * @return NULL
         */
    // do validation,please rewrite it, use
    doV: function() {
    //todo
    },
    /***
         *  @name ali.model#closeAllServerError
         * @function
         * @description some time, we have two type validtaion, one is the front-end validation, the other is
         * the backend validation . so before we do the client validation, we should close the back-end issue.
         <pre>
           how to do it?
           before doV, just call this.pub('beforedoV'), since we already sub this topic already in the init method
           by the way, we should use 'comp-ff-backend-error' class style, like 
            <div  class="comp-ff-backend-error" style="display:block;">
               <span class="error">$field.message</span>
            </div>
           </pre>
         * @return NULL
         */
    closeAllServerError: function(){
      this.$('.comp-ff-backend-error').css('display','none');
    }
    
});