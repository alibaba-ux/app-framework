/**
*@class ali.pubsub
*@name   ali.pubsub
*@author   <a href="mailto:zhouquan.yezq@alibaba-inc.com">Zhouquan.yezq</a>
*@description borrow the backbone event code , and i think the on / off /trigger is very good, since it 
* not the real event , just simulate the event. but the it more close the publish/subscribe , like 
* observer pattern , so rename it. 
<pre>Todo : 
the min pub/sub just solve the problem of the object level, for the message communication between
component and component , it should have a global message bus . like : http://developer.tibco.com/pagebus/default.jsp

how to use it?
$.extend(Object,ali.pubsub);
var o=new Object();
o.sub('datachange',function(){
   alert('datachange');
}) 
o.pub('datachange');
o.sub('datachange');
o.pub('datachange');
</pre>
*/
(function($){
    $.namespace('ali.uxcore.util');
    ali.uxcore.util.pubsub={

       /***
              *  @name ali.pubsub#sub
              * @function
              * @description Subscribes to an event published by this object.
               * @param {string} types The event types.
               * @parsm  Object} [function] call back function 
               * @param {Object} [scope] The observer context. The observer function will be called in the context of this object, if provided. 
               */
      sub: function(types, fct, scope) {
          var ev;
          types = types.split(/\s+/);
          var calls = this._fcts || (this._fcts = {});
          while (ev = types.shift()) {
            // Create an immutable fct list, allowing traversal during
            // modification.  The tail is an empty object that will always be used
            // as the next node.
            var list  = calls[ev] || (calls[ev] = {});
            var tail = list.tail || (list.tail = list.next = {});
            tail.fct = fct;
            tail.scope = scope;
            list.tail = tail.next = {};
          }
          return this;
      },
       /***
              * @name ali.pubsub#unsub
              * @function
              * @description Remove one or many fcts. If `context` is null, removes all fcts
              * with that function. If `fct` is null, removes all fcts for the
              * event. If `ev` is null, removes all bound fcts for all events.
              */
      unsub: function(events, fct, context) {
          var ev, calls, node;
          if (!events) {
            delete this._fcts;
          } else if (calls = this._fcts) {
            events = events.split(/\s+/);
            while (ev = events.shift()) {
              node = calls[ev];
              delete calls[ev];
              if (!fct || !node) continue;
              // Create a new list, omitting the indicated event/context pairs.
              while ((node = node.next) && node.next) {
                if (node.fct === fct &&
                  (!context || node.context === context)) continue;
                this.pub(ev, node.fct, node.context);
              }
            }
          }
          return this;
        },
      /***
              * @name ali.pubsub#unsub
              * @function
              *@description Trigger an event, firing all bound fcts. fcts are passed the
              *  same arguments as `trigger` is, apart from the event name.
              *Listening for `"all"` passes the true event name as the first argument.
              */
       pub: function(events) {
          var event, node, calls, tail, args, all, rest;
          if (!(calls = this._fcts)) return this;
          all = calls['all'];
          (events = events.split(/\s+/)).push(null);
          // Save references to the current heads & tails.
          while (event = events.shift()) {
            if (all) events.push({next: all.next, tail: all.tail, event: event});
            if (!(node = calls[event])) continue;
            events.push({next: node.next, tail: node.tail});
          }
          // Traverse each list, stopping when the saved tail is reached.
          rest = Array.prototype.slice.call(arguments, 1);
          while (node = events.pop()) {
            tail = node.tail;
            args = node.event ? [node.event].concat(rest) : rest;
            while ((node = node.next) !== tail) {
              node.fct.apply(node.context || this, args);
            }
          }
          return this;
        }
    }
    //short cut for ali.uxcore.util.pubsub
    ali.pubsub=ali.uxcore.util.pubsub;
 })(jQuery);