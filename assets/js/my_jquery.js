// (function() {
	$ = function(selector){
		if(!(this instanceof $)) {
			return new $(selector);
		}
		var elements;
		if(typeof selector === 'string') {
			elements = document.querySelectorAll(selector);
		} else {
			elements = selector;
		}
		for (var i = 0; i < elements.length; i++){
			this[i] = elements[i];
		}
		this.length = elements.length;
		return this;
	};

	$.extend = function(target, object) {
		for(prop in object){
			if(object.hasOwnProperty(prop)) {
				target[prop] = object[prop];
			}
		}
		return target;
	};

	var isArray = function(obj){
		return Object.prototype.toString.call(obj) === '[object array]';
	}

	var isArrayLike = function (obj) {
		if(typeof obj.length == 'number') {
			if(obj.length === 0) {
				return true;
			} else if(obj.length > 0) {
				return (obj.length-1) in obj;
			}
		} else {
			return false;
		}
	};
	var makeTraverser = function(cb) {
		return function() {
			var elements = [],
			args = arguments;
			$.each(this,function(i, el){
				var ret = cb.apply(el, args);
				if(ret && isArrayLike(ret)) {
					[].push.apply(elements, ret);
				} else if(ret) {
					elements.push(ret);
				}
			})
			return $(elements);
		}
	}
	$.extend($, {
		isArray: function(obj) {
			return Object.prototype.toString.call(obj) === '[object Array]';
		},
		each: function(collection,cb){
			if(isArrayLike(collection)){
				for (var i = 0;i < collection.length; i++){
					var val = collection[i];
					cb.call(val, i, val);
				}
			} else {
				for (prop in collection){
					var value = collection[prop];
					cb.call(value,prop,value);
				}
			}
			return collection;
		},
		makeArray: function(arr) {
			if(isArrayLike(arr)){
				var array = [];
				for(var i = 0;i < arr.length; i++) {
					array.push(arr[i]);
				}
				return array;
			}
			return arr;
		},
		proxy: function(fn,context) {
			return function() {
				return fn.apply(context,arguments);
			}
		}
	}
	);

	var getText = function(el) {
		var txt = "";
		$.each(el.childNodes, function(i, childNode){
			if(childNode.nodeType === Node.TEXT_NODE) {
				txt += childNode.nodeValue;
			} else if(childNode.nodeType === Node.ELEMENT_NODE) {
				txt += getText(childNode);
			}
		});
		return txt;
	}

	$.extend($.prototype, {
		html: function(newHtml){
			if(arguments.length > 0) {
				 $.each(this, function(i,el){
					el.innerHTML = newHtml;
				});
				return this;
			} else {
				return this[0] && this[0].innerHTML;
			}
		},
		val: function(newVal){
			if(arguments.length > 0) {
				 $.each(this, function(i,el){
					el.value = newVal;
				});
				return this;
			} else {
				return this[0] && this[0].value;
			}
		},
		text: function(newText) {
			if(arguments.length){
				$.each(this, function(i, el){
					el.innerHTML = '';
					var textNode = document.createTextNode(newText);
					el.appendChild(textNode);
				})
				return this;
			} else {
				return this[0] && getText(this[0]);
			}

		},
		find: function(selector) {
			var elements = [];
			$.each(this,function(i, el){
				var els = el.querySelectorAll(selector);
				[].push.apply(elements, els);
			});
			return $(elements);
		},
		next: makeTraverser(function() {
			var current = this.nextSibling;
			while(current && current.nodeType !== 1){
				current = current.nextSibling;
			}
			if(current) {
				return current;
			}
		}),
		prev: makeTraverser(function() {
			var current = this.previousSibling;
			while(current && current.nodeType !== 1){
				current = current.previousSibling;
			}
			if(current) {
				return current;
			}
		}),
		parent: makeTraverser(function(){
			return this.parentNode;
		}),
		children: makeTraverser(function(){
			return this.children;
		}),
		attr: function(attrName, value) {
			if(arguments.length > 1) {
				return $.each(this, function(i, el) {
					el.setAttribute(attrName, value);
				});
			} else {
				return this[0] && this[0].getAttribute(attrName);
			}
		},
		css: function(cssPropName, value) {
			if(arguments.length > 1) {
				return $.each(this, function(i, el){
					el.style[cssPropName] = value;
				});
			} else {
				return this[0] && document.defaultView.getComputedStyle(this[0]).getPropertyValue(cssPropName);
			}
		},
		width: function() {
			var clientWidth = this[0].clientWidth;
			console.log($(this[0]));
			var leftPadding = this.css('padding-left');
				rightPadding = this.css('padding-right');
			return clientWidth - parseInt(leftPadding) - parseInt(rightPadding);
		},
		offset: function() {
			var offset = this[0].getBoundingClientRect();
			return {
				top: offset.top + window.pageYOffset,
				left: offset.left + window.pageXOffset,
			}
		},
		hide: function() {
			this.css('display','none');
		},
		show: function() {
			this.css('display','block');
		},
		bind: function(eventName, handler) {
			return $.each(this, function(i, el){
				el.addEventListener(eventName, handler, false);
			});
		},
		unbind: function(eventName, handler) {
			return $.each(this, function(i, el){
				el.removeEventListener(eventName, handler, false);
			});
		}
	});
	$.fn = $.prototype;
// })();