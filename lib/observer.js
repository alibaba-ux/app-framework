/**
* MVVM pattern to do the front-end development
*/
(function(window){
var ob = window["ob"] = {};
ob.constant={
  dataclass:['data-binding'],
  events:['click','change']
};
/**
* viewModel {JSON} this object will present the related UI component , 
*                   including the attribute, data , and operation
* rootNode  {Element} default is the document.
* currently , it will search the "data-binding:text/value" etc
*/
ob.applyBindings=function (viewModel, rootNode) {
  if (rootNode && (rootNode.nodeType !== 1) && (rootNode.nodeType !== 8))
			throw new Error("observer.applyBindings: first parameter should be your view model; second parameter should be a DOM node");
	applyBindingsToNodeAndDescendantsInternal(viewModel,rootNode);
};
function applyBindingsToNodeAndDescendantsInternal(viewModel, rootNode){
  rootNode=rootNode?rootNode:document.body;
  var childs=rootNode.children;
  var isElement = (rootNode.nodeType == 1);
  var nodeHasBinding=ob.bindingProvider.nodeHasBindings(rootNode);
  if(isElement && nodeHasBinding){
    applyBindingsToNode(viewModel,rootNode);
  }
  ob.util.arrayForEach(childs,function(e){
    applyBindingsToNodeAndDescendantsInternal(viewModel,e);
  });
}
//current just support single data-bindings
function applyBindingsToNode(viewModel,node){
  var bindings=ob.bindingProvider.getBindings(node);
  for(var prop in bindings) {
    if(bindings.hasOwnProperty(prop) && prop=="data-binding") {
	  ob.util.arrayForEach(bindings["data-binding"],function(e){
	    ob.bindingProvider.syncDataBinding(viewModel,node,e);
	  });
	}
  }
}

/**
 * triggerObject Class, triggerObject including the attribute or the Array Object,
 * like attribute value change , or the Array Object element be changed(add/delete),
 * they will trigger the change event to their subscriber, so subscriber will 
 * auto do the relative change/action. 
 *  suppose triggerObject is AAA(no matter attribute or Object), so this 
 * instance should have getAAA, setAAA, subscribersMap, notifySubscribers method
 * 
 * Usage:
 * <pre>
 * var triggerObj=new triggerObject();
 * triggerObj.init(obj,viewModel,node);
 * </pre>
*/
ob.triggerObject=function(){}
var _triggerObjProto=ob.triggerObject.prototype;
_triggerObjProto.init=function(attr,viewModel,node){
  this.attr=attr;
  this.getViewModel=function(){
    return viewModel;
  }
  var me=this;
  viewModel['get'+this.attr]=function(){
    return this[attr];
  };
  viewModel['get'+this.attr+"Obj"]=function(){
    this[attr+"Obj"]=me;
    return this[attr+"Obj"];
  }
  viewModel['set'+this.attr]=function(value,triggerObject){
    this[attr]=value;
	triggerObject.notifySubscribers();
  }
  if(!this.subscribersMap)
    this.subscribersMap=[];
  this.subscribersMap.push(node);
}
_triggerObjProto.notifySubscribers=function(){
  for(var i=0;i<this.subscribersMap.length;i++){//update
    ob.bindingProvider.updateDataBinding(this.getViewModel(),this.subscribersMap[i],this.attr);
  }
};

_triggerObjProto.addSubscriber=function(node){
  this.subscribersMap.push(node);
};

/**
* Simple Binding Provider, to check whether the element have the binding property, if have , register the binding relationship
*/
ob.bindingProvider={
  nodeHasBindings:function(node){
	  /*ob.util.arrayForEach(ob.constant.dataclass,function(e){
		  var attribute= node.getAttribute ? node.getAttribute(e) : false;
		  console.log(attribute);
		  return 
	  });*/
	  for(var i=0;i<ob.constant.dataclass.length;i++){
	    var attribute= node.getAttribute ? node.getAttribute(ob.constant.dataclass[i]) : false;
		return attribute;
	  }
	 },
  getBindings:function(node){
	  var bindingObj={};
	  ob.util.arrayForEach(ob.constant.dataclass,function(e){
	  var attributes=node.getAttribute(e);
	  if(attributes){
	   attributes = attributes.split(' ');
	   var arr=[];
	   for(var i=0;i<attributes.length;i++){
		 arr.push(attributes[i]);
	   }
	   bindingObj[e]=arr;
	  }
	})
	  return bindingObj;
  },
  syncDataBinding:function(viewModel,node,binding){
    var type=binding.split(":")[0],
	attr=binding.split(":")[1];
	var triggerObject,expressionArr=[];
	//if(isObserved){
	var pattern=/^[a-zA-Z]{1}([a-zA-Z0-9]|[_])*$/;
	var originalExpressionResult;
	if(!pattern.test(attr)){//expression,currently just support '!','>','<','==','==='
	  var opeArr=['!','>','<','==','==='];
	  for(var i=0;i<opeArr.length;i++){
		if(attr.indexOf(opeArr[i])!=-1){
		  var _s=attr.split(opeArr[i]);
		  if(opeArr=='!'){
		   attr=_s[1]
		   originalExpressionResult=eval("!viewModel"+attr+"()");
		  }else{
			attr=_s[0];
			//contain . like ['friends.length']
			var attrCopy=attr;
			if(attr.indexOf('.')==-1){
			  originalExpressionResult=eval("viewModel."+attr+'()'+opeArr[i]+_s[1]);
			}else{
			  originalExpressionResult=eval("viewModel."+attr+opeArr[i]+_s[1]);
		      attr=attr.split('.')[0];
			}
		  }
		  //expressionArr=[attr,opeArr[i],opeArr=='!'?_s[0]:_s[1]];
		  break;
		}
	  }
	}
	var isObserved=ob.util.isFunction(viewModel[attr]);
	if(isObserved){
	  triggerObject=ob.bindingProvider.registerDependance(viewModel,node,attr);
	}
	var value=isObserved?viewModel[attr]():viewModel[attr];
	switch(type){
	  case "text":
	    node.innerHTML="<text>"+value+"</text>";
		break;
	  case "value":
	    node.value=value;
		if(isObserved && triggerObject){
			var handler=function(){
			  viewModel[attr]=node.value;
			  triggerObject.notifySubscribers();
			}
			ob.util.registerEventHandler(node,"blur",handler);
		}
		break;
	  case "visible":  //array , attribute value etc . condition judge
	     if(!originalExpressionResult){
		   node.style.display="none";
		 }else{
		   node.style.display="block";
		 }
	    break;
	 case "disabled":
	   	 if(!originalExpressionResult){
		   node.setAttribute('disabled','disabled');
		 }else{
		   node.removeAttribute('disabled');
		 }
	    break;
	    
	  default:
	    if(ob.util.arrayIndexOf(ob.constant.events,type)!=-1){
		  ob.util.registerEventHandler(node,type,viewModel[attr]);
		}
	    break;
	}
  },
  registerDependance:function(viewModel,node,attr){
    var triggerObject;
    if(!viewModel['get'+attr+"Obj"]){
      triggerObject=new ob.triggerObject();
	  triggerObject.init(attr,viewModel,node);
	}else{
	  if(viewModel['get'+attr+"Obj"]().addSubscriber)
	   viewModel['get'+attr+"Obj"]().addSubscriber(node);
	  triggerObject=viewModel['get'+attr+"Obj"]();
	}
	return triggerObject;
  },
  updateDataBinding:function(viewModel,node,attr){
    var bindings=ob.bindingProvider.getBindings(node);
	var attr=attr;
	for(var prop in bindings) {
    if(bindings.hasOwnProperty(prop) && prop=="data-binding") {
	  var attrs=bindings["data-binding"];
	  for(var i=0;i<attrs.length;i++){
	    if(attrs[i].indexOf(attr) !=-1){
		  var type=attrs[i].split(":")[0],
	      attr=attrs[i].split(":")[1];
		  	switch(type){
			  case "text":
				node.innerHTML="<text>"+viewModel[attr]+"</text>";
				break;
			  case "value":
				node.value=viewModel[attr];
				break;
			  default:
				break;
			}
		}
	  }
	}
   }
  }
}

/**
* 
*/
ob.observerable=function(initValue){
  return function(){
    return initValue;
  };
};

ob.observerableArray=function(array){
    return function(){
    return array;
  };
};

ob.observerDependance=function(fct){
  
}

/**
* util method
*/
ob.util={
	extend: function (target, source) {
		for(var prop in source) {
			if(source.hasOwnProperty(prop)) {//will not check the prototype chain prop
				target[prop] = source[prop];
			}
		}
		return target;
	},
	arrayForEach: function (array, action) {
	for (var i = 0, j = array.length; i < j; i++)
		action(array[i]);
	},
	arrayIndexOf: function (array, item) {
		if (typeof Array.prototype.indexOf == "function")
			return Array.prototype.indexOf.call(array, item);
		for (var i = 0, j = array.length; i < j; i++)
			if (array[i] === item)
				return i;
		return -1;
	},
	isFunction:function(obj){
	  return jQuery.type(obj) === "function";
	},
    isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},
	registerEventHandler: function (element, eventType, handler) {
           if (typeof element.addEventListener == "function")
                element.addEventListener(eventType, handler, false);
            else if (typeof element.attachEvent != "undefined")
                element.attachEvent("on" + eventType, function (event) {
                    handler.call(element, event);
                });
            else
                throw new Error("Browser doesn't support addEventListener or attachEvent");
        },
        triggerEvent: function (element, eventType) {
            if (!(element && element.nodeType))
                throw new Error("element must be a DOM node when calling triggerEvent");

            if (typeof jQuery != "undefined") {
                var eventData = [];
                if (isClickOnCheckableElement(element, eventType)) {
                    // Work around the jQuery "click events on checkboxes" issue described above by storing the original checked state before triggering the handler
                    eventData.push({ checkedStateBeforeEvent: element.checked });
                }
                jQuery(element)['trigger'](eventType, eventData);
            } else if (typeof document.createEvent == "function") {
                if (typeof element.dispatchEvent == "function") {
                    var eventCategory = knownEventTypesByEventName[eventType] || "HTMLEvents";
                    var event = document.createEvent(eventCategory);
                    event.initEvent(eventType, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, element);
                    element.dispatchEvent(event);
                }
                else
                    throw new Error("The supplied element doesn't support dispatchEvent");
            } else if (typeof element.fireEvent != "undefined") {
                // Unlike other browsers, IE doesn't change the checked state of checkboxes/radiobuttons when you trigger their "click" event
                // so to make it consistent, we'll do it manually here
                if (eventType == "click") {
                    if ((element.tagName == "INPUT") && ((element.type.toLowerCase() == "checkbox") || (element.type.toLowerCase() == "radio")))
                        element.checked = element.checked !== true;
                }
                element.fireEvent("on" + eventType);
            }
            else
                throw new Error("Browser doesn't support triggering events");
        }
};

//copy from Google Closure Compiler helpers//
/**
 * Inherit the prototype methods from one constructor into another.
 *
 * Usage:
 * <pre>
 * function ParentClass(a, b) { }
 * ParentClass.prototype.foo = function(a) { }
 *
 * function ChildClass(a, b, c) {
 *   ob.base(this, a, b);
 * }
 * ob.inherits(ChildClass, ParentClass);
 *
 * var child = new ChildClass('a', 'b', 'see');
 * child.foo(); // works
 * </pre>
 *
 * In addition, a superclass' implementation of a method can be invoked
 * as follows:
 *
 * <pre>
 * ChildClass.prototype.foo = function(a) {
 *   ChildClass.superClass_.foo.call(this, a);
 *   // other code
 * };
 * </pre>
 *
 * @param {Function} childCtor Child class.
 * @param {Function} parentCtor Parent class.
 */

ob.inherits = function(childCtor, parentCtor) {
  /** @constructor */
  function tempCtor() {};
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor();
  childCtor.prototype.constructor = childCtor;
};
/**
 * Call up to the superclass.
 *
 * If this is called from a constructor, then this calls the superclass
 * contructor with arguments 1-N.
 *
 * If this is called from a prototype method, then you must pass
 * the name of the method as the second argument to this function. If
 * you do not, you will get a runtime error. This calls the superclass'
 * method with arguments 2-N.
 *
 * This function only works if you use ob.inherits to express
 * inheritance relationships between your classes.
 *
 * This function is a compiler primitive. At compile-time, the
 * compiler will do macro expansion to remove a lot of
 * the extra overhead that this function introduces. The compiler
 * will also enforce a lot of the assumptions that this function
 * makes, and treat it as a compiler error if you break them.
 *
 * @param {!Object} me Should always be "this".
 * @param {*=} opt_methodName The method name if calling a super method.
 * @param {...*} var_args The rest of the arguments.
 * @return {*} The return value of the superclass method.
 */
ob.base = function(me, opt_methodName, var_args) {
  var caller = arguments.callee.caller;
  if (caller.superClass_) {
    // This is a constructor. Call the superclass constructor.
    return caller.superClass_.constructor.apply(
        me, Array.prototype.slice.call(arguments, 1));
  }
  var args = Array.prototype.slice.call(arguments, 2);
  var foundCaller = false;
  for (var ctor = me.constructor;
       ctor; ctor = ctor.superClass_ && ctor.superClass_.constructor) {
    if (ctor.prototype[opt_methodName] === caller) {
      foundCaller = true;
    } else if (foundCaller) {
      return ctor.prototype[opt_methodName].apply(me, args);
    }
  }

  // If we did not find the caller in the prototype chain,
  // then one of two things happened:
  // 1) The caller is an instance method.
  // 2) This method was not called by the right caller.
  if (me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args);
  } else {
    throw Error(
        'ob.base called from a method of one name ' +
        'to a method of a different name');
  }
};

})(window);

