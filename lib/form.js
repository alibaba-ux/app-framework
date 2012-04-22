/**
*@class  ali.form
*@name   ali.form
*@author   <a href="mailto:zhouquan.yezq@alibaba-inc.com">Zhouquan.yezq</a>
*@description  ali.uxcore.form is the component development for the open platform project .
<pre>feature:
1: vie/edit mode switch, so suit for two case
2: validation, right now, form validation use the FD4 web-valid component 
3: could get the form data where you want
</pre>
 */
(function($){
    $.namespace('ali.uxcore'); 
    ali.uxcore.form = function() {
        this.initialize.apply(this, arguments);
    };
    ali.uxcore.form.VIEWMODE = 0;
    ali.uxcore.form.EDITMODE = 1;
    ali.uxcore.form.viewELClass = "viewEl";
    ali.uxcore.form.editElClass = "editEl";
    ali.uxcore.form.readOnlyClass="readonlyEl";
    ali.uxcore.form.noteClass = "ffnote";//form field note
    ali.uxcore.form.errorClass="fferror";//form  field error
    ali.uxcore.form.DATABINDING="data-binding";
    $.extend(ali.uxcore.form.prototype, {
        mode:1,//0 viewMode 1 editMode
        validateElSeltors:[],
        
       /***
       *  @name ali.form#getMode
        * @function
        * @description get the mode for the form
        */
        getMode:function() {
            return this.mode;
        },
        // events is an empty function by default. Override it with your own
        events:function() {
        },
        _setMode:function(mode) {
            if (mode === ali.uxcore.form.VIEWMODE) {
                $.each(this.getEditEls(), function(index, el) {
                    $(el).css("display", "none");
                });
                $.each(this.getViewEls(), function(index, el) {
                    $(el).css("display", "block");
                });
                $.each(this.getFFNoteEls(), function(index, el) {
                    $(el).css("display", "none");
                });
            } else if (mode === ali.uxcore.form.EDITMODE) {
                $.each(this.getViewEls(), function(index, el) {
                    $(el).css("display", "none");
                });
                $.each(this.getEditEls(), function(index, el) {
                    $(el).css("display", "block");
                });
                $.each(this.getFFNoteEls(), function(index, el) {
                    $(el).css("display", "block");
                });
            } else {
                return;
            }
            this.mode = mode;
        },
       /***
              *  @name ali.form#setMode
              * @function
              * @description set the mode for the form
              */
        setMode: function(mode) {
          if(!this.doV()) return;
          this._setMode(mode);
        },
        initialize: function(auxObj) {
            for (var key in auxObj) {
                this[key] = auxObj[key];
            }
            this._setMode(this.mode);
            this.delegateEvents();
        },
        setContainer:function(selector) {
            this.$el = $(selector);
        },
        /***
                  *  @name ali.form#getContainer
                  * @function
                  * @description get the container of the form
                  */
        getContainer:function() {
            return this.$el;
        },
        /***
                  *  @name ali.form#getViewEls
                  * @function
                  */
        getViewEls:function() {
            //myLog.log(ali.uxcore.form.viewELClass);
            this._viewEls ? "" : (this._viewEls = this.getContainer().find([".",ali.uxcore.form.viewELClass].join('')));
            return this._viewEls
        },
        /***
                  *  @name ali.form#getEditEls
                  * @function
                  */
        getEditEls:function() {
            this._EditEls ? "" : (this._EditEls = this.getContainer().find([".", ali.uxcore.form.editElClass].join('')));
            return this._EditEls
        },
        getFFNoteEls:function(){
            this._FFNoteEls ? "" : (this._FFNoteEls = this.getContainer().find([".", ali.uxcore.form.noteClass].join('')));
            return this._FFNoteEls
        },
         /***
                  *  @name ali.form#getReadonlyEl
                  * @function
                  */
        getReadonlyEl: function() {
            this._ReadonlyEls ? "" : (this._ReadonlyEls = this.getContainer().find([".", ali.uxcore.form.readOnlyClass].join('')));
            return this._ReadonlyEls
        },
        delegateEvents: function() {
            // Cached regex to split keys for `delegate`.
            var eventSplitter = /^(\S+)\s*(.*)$/;
            var events = this.events;
            for (var key in events) {
                var method = events[key];
                if (!$.isFunction(method)) method = this[events[key]];
                if (!method) throw new Error('Event "' + events[key] + '" does not exist');
                var match = key.match(eventSplitter);
                var eventName = match[1], selector = match[2];
                //todo need think if no validate, the match of el position should be change
                if (selector === '') {
                    this.$el.bind(eventName, method);
                } else {
                    this.$el.delegate(selector, eventName, method);
                }
                //hasValidate?this.validateElSeltors.push(selector):"";
            }
        },
        /***
                  *  @name ali.form#doV
                  * @function
                  *@description  do validation,please rewrite it, use fd4 web-valid 
                  */
        doV: function() {
          //todo
        },
        /***
                  *  @name ali.form#getData
                  * @function
                  *@description get the data of the form
                  * <pre>        // todo use the jQuery $.data() method to rewrite it.</pre>
                  */
        getData: function() {
            var d={},jel,k,v
            $.each(this.getEditEls(), function(index, el) {
                jel=$(el);
                k=jel.attr(ali.uxcore.form.DATABINDING).split(":")[1];
                v=jel.val();
                d[k]=v;
            });
            $.each(this.getReadonlyEl(), function(index, el) {
                k=$(el).attr(ali.uxcore.form.DATABINDING).split(":")[1];
                v=$(el).val();  
                d[k]=v;                
            });
            return d;
        }

    });
    //short cut for ali.uxcore.form
    ali.form=ali.uxcore.form;
 })(jQuery);