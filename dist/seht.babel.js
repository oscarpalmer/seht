/*!
 * Seht, v0.12.0 - a JavaScript library, like jQuery or Zepto!
 * https://github.com/oscarpalmer/seht
 * (c) Oscar Palmér, 2019, MIT @license
 */
"use strict";function _classCallCheck(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,n){for(var e=0;e<n.length;e++){var r=n[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _createClass(t,n,e){return n&&_defineProperties(t.prototype,n),e&&_defineProperties(t,e),t}function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var seht=function(){function t(t,n){return t instanceof s?t:new s(t,n)}var r=window.document,u=Array.prototype,i={html:/^\s*<([^\s>]+)/,id:/^#[\w-]+$/},o=function(e,r,i){return"object"===_typeof(e)&&"number"==typeof e.length?u.forEach.call(e,function(t,n){r.call(i||t,t,n,e)}):u.forEach.call(Object.keys(e),function(t){r.call(i||e[t],e[t],e)}),e},n=function(e,r,i){return u.forEach.call(e,function(t,n){return r.call(i||t,t,n,e)})},c=function(t){return u.slice.call(t)},a=function(t){return t.length<=1?t:u.filter.call(t,function(t,n,e){return u.indexOf.call(e,t)===n})},e=function(t){r.addEventListener("DOMContentLoaded",t)},f=function(n,t){var e;o(t,function(t){(e=r.createEvent("CustomEvent")).initCustomEvent(t,!0,!0),n.dispatchEvent(e)})},l={defineContext:function(t){return void 0===t?r:t.nodeType?t:"string"==typeof t?l.query(t,r):"object"===_typeof(t)&&"number"==typeof t.length?t:r},find:function(t,n){return null==t?[]:t.nodeType||t===t.window?[t]:"object"===_typeof(t)&&"number"==typeof t.length?t:"string"==typeof t?l.query(t,n):[]},htmlify:function(t){if("string"!=typeof t)return[];var n=r.implementation.createHTMLDocument();return n.body.innerHTML=t,n.body.children},insertAdjacentHTML:function(t,n,e){return e=e.toString()||e,o(t,function(t){t.insertAdjacentHTML(n,e)})},query:function(n,t){if("object"!==_typeof(t=l.defineContext(t))||"number"!=typeof t.length)return i.id.test(n)?[t.getElementById(n.slice(1))]:i.html.test(n)?l.htmlify(n):t.querySelectorAll(n);var e=[];return o(t,function(t){e=e.concat(c(l.query(n,t)))}),e}},s=function(){function i(t,n){var e,r=this;_classCallCheck(this,i),e=l.find(t,n),e=a(e),this.length=e.length,o(e,function(t,n){r[n]=t},this)}return _createClass(i,[{key:"addClass",value:function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return o(this,function(n){o(e,function(t){n.classList.add(t)})})}},{key:"after",value:function(t){return l.insertAdjacentHTML(this,"afterend",t)}},{key:"append",value:function(t){return l.insertAdjacentHTML(this,"beforeend",t)}},{key:"appendTo",value:function(t){return seht(t).append(this)}},{key:"attr",value:function(n,e){return void 0!==n&&void 0!==e?o(this,function(t){t.setAttribute(n,e)}):0<this.length?this[0].getAttribute(n):null}},{key:"before",value:function(t){return l.insertAdjacentHTML(this,"beforebegin",t)}},{key:"data",value:function(n,e){return(n=void 0===n?null:"data-".concat(n))&&void 0!==e?(e=JSON.stringify(e),o(this,function(t){t.setAttribute(n,e)})):0<this.length?JSON.parse(this[0].getAttribute(n)):null}},{key:"each",value:function(t){return o(this,t)}},{key:"empty",value:function(){return o(this,function(t){t.innerHTML=""})}},{key:"eq",value:function(t){return seht(0<=t&&t<this.length?this[t]:null)}},{key:"first",value:function(){return this.eq(0)}},{key:"hasClass",value:function(t){return this[0].classList.contains(t)}},{key:"html",value:function(n){return void 0!==n?(n instanceof i&&(n=this.toString()),o(this,function(t){t.innerHTML=n})):0<this.length?this[0].innerHTML:null}},{key:"last",value:function(){return this.eq(this.length)}},{key:"map",value:function(t){return seht(n(this,t))}},{key:"off",value:function(n,e){return o(this,function(t){t.removeEventListener(n,e)})}},{key:"on",value:function(n,e){return o(this,function(t){t.addEventListener(n,e)})}},{key:"parent",value:function(){return seht(n(this,function(t){return t.parentNode}))}},{key:"prepend",value:function(t){return l.insertAdjacentHTML(this,"afterbegin",t)}},{key:"prependTo",value:function(t){return seht(t).prepend(this)}},{key:"remove",value:function(){var t=this.parent();return o(this,function(t){t.parentNode.removeChild(t)}),t}},{key:"removeClass",value:function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return o(this,function(n){o(e,function(t){n.classList.remove(t)})})}},{key:"text",value:function(n){return void 0!==n?o(this,function(t){t.textContent=n}):0<this.length?this[0].textContent:null}},{key:"toArray",value:function(){return c(this)}},{key:"toggleClass",value:function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return o(this,function(n){o(e,function(t){n.classList.toggle(t)})})}},{key:"toString",value:function(){var n="";return o(this,function(t){n+=t.outerHTML}),n}},{key:"trigger",value:function(){for(var t=arguments.length,n=new Array(t),e=0;e<t;e++)n[e]=arguments[e];return o(this,function(t){f(t,n)})}},{key:"value",value:function(n){return void 0!==n?o(this,function(t){t.value=n}):0<this.length?this[0].value:null}}]),i}();return t.each=o,t.map=n,t.ready=e,t.toArray=c,t.unique=a,t}();