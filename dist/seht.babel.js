"use strict";function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}
/*!
 * Seht, v0.11.0 - a JavaScript library, like jQuery or Zepto!
 * https://github.com/oscarpalmer/seht
 * (c) Oscar Palmér, 2019, MIT @license
 */var seht=function(){var o=window,i=o.document,u=Array.prototype,r={html:/^\s*<([^\s>]+)/,id:/^#[\w-]+$/},t=function(t){i.addEventListener("DOMContentLoaded",t)},c=function(n,t){var e;f(t,function(t){(e=i.createEvent("CustomEvent")).initEvent(t,!0,!0),n.dispatchEvent(e)})};function f(e,i,r){return o.isFinite(e.length)?u.forEach.call(e,function(t,n){i.call(r||t,t,n,e)}):u.forEach.call(Object.keys(e),function(t){i.call(r||e[t],e[t],t,e)}),e}function n(t,n,e){return e instanceof d&&(e=e.toString()),t.each(function(t){t.insertAdjacentHTML(n,e)})}function e(t,e,i){return u.map.call(t,function(t,n){return e.call(i||t,t,n)})}function s(n,t){if(t=function(t){return void 0===t?i:t instanceof d||t.nodeType?t:"string"==typeof t?s(t,i):o.isFinite(t.length)?t:i}(t),o.isFinite(t.length)){var e=[];return f(t,function(t){e=e.concat(l(s(n,t)))}),e}return r.id.test(n)?[t.getElementById(n.slice(1))]:r.html.test(n)?function(t){if("string"!=typeof t)return t;var n=i.implementation.createHTMLDocument();return n.body.innerHTML=t,n.body.children}(n):t.querySelectorAll(n)}function l(t){return u.slice.call(t)}function a(t){return t.length<=1?l(t):u.filter.call(t,function(t,n,e){return u.indexOf.call(e,t)===n})}function h(t,n){return t instanceof d?t:new d(t,n)}function d(t,n){var e,i=this;e=a(e=function(t,n){return null==t?[]:t.nodeType||t===t.window?[t]:"object"===_typeof(t)&&o.isFinite(t.length)?t:"string"==typeof t?s(t,n):[]}(t,n)),this.length=e.length,f(e,function(t,n){i[n]=t},this)}return d.prototype={length:0,addClass:function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return f(this,function(n){f(e,function(t){n.classList.add(t)})})},after:function(t){return n(this,"afterend",t)},append:function(t){return n(this,"beforeend",t)},appendTo:function(t){return h(t).append(this)},attr:function(n,e){return void 0!==n&&void 0!==e?f(this,function(t){t.setAttribute(n,e)}):0<this.length?this[0].getAttribute(n):null},before:function(t){return n(this,"beforebegin",t)},data:function(n,e){return(n=void 0===n?null:"data-".concat(n))&&void 0!==e?(e=JSON.stringify(e),f(this,function(t){t.setAttribute(n,e)})):0<this.length?JSON.parse(this[0].getAttribute(n)):null},each:function(t){return f(this,t)},empty:function(){return f(this,function(t){t.innerHTML=""})},eq:function(t){return h(0<=t&&t<this.length?this[t]:null)},first:function(){return this.eq(0)},hasClass:function(t){return this[0].classList.contains(t)},html:function(n){return void 0!==n?(n instanceof d&&(n=this.toString()),f(this,function(t){t.innerHTML=n})):0<this.length?this[0].innerHTML:null},last:function(){return this.eq(this.length-1)},map:function(t){return h(e(this,t))},off:function(n,e){return f(this,function(t){t.removeEventListener(n,e)})},on:function(n,e){return f(this,function(t){t.addEventListener(n,e)})},parent:function(){return h(e(this,function(t){return t.parentNode}))},prepend:function(t){return n(this,"afterbegin",t)},prependTo:function(t){return h(t).prepend(this)},remove:function(){var t=this.parent();return f(this,function(t){t.parentNode.removeChild(t)}),t},removeClass:function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return f(this,function(n){f(e,function(t){n.classList.remove(t)})})},text:function(n){return void 0!==n?f(this,function(t){t.textContent=n}):0<this.length?this[0].textContent:null},toArray:function(){return l(this)},toggleClass:function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return f(this,function(n){f(e,function(t){n.classList.toggle(t)})})},toString:function(){var n="";return f(this,function(t){n+=t.outerHTML}),n},trigger:function(){for(var t=arguments.length,n=new Array(t),e=0;e<t;e++)n[e]=arguments[e];return f(this,function(t){c(t,n)})},value:function(n){return void 0!==n?f(this,function(t){t.value=n}):0<this.length?this[0].value:null}},h.each=f,h.map=e,h.ready=t,h.toArray=l,h.unique=a,h.fn=d.prototype,h}();