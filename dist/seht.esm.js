function d(t){return`data-${t.replace(/^data-/i,"")}`}function v(t,e){let n=t?.getAttribute(d(e));return n==null?n:JSON.parse(n)}var a=class{constructor(e){this.seht=e}get(e){return v(this.seht.elements[0],e)}set(e){return p(this.seht.elements,e,!0)??this.seht}};function x(t,e){let n=[];if(typeof t!="object"||Array.isArray(t))return n;for(let r in t){if(r.length<1)continue;let s=e?d(r):r,i=t[r]==null?null:e?JSON.stringify(t[r]):String(t[r]);n.push({name:s,value:i})}return n}function p(t,e,n){let r=x(e,n);for(let s of r){let{name:i,value:l}=s;for(let b of t)l==null?b.removeAttribute(i):b.setAttribute(i,l)}return null}var c=class{constructor(e){this.seht=e}get(e){return this.seht.elements[0]?.getAttribute(e)??void 0}set(e){return p(this.seht.elements,e,!1)??this.seht}};function S(t){return Array.isArray(t)?t.filter(e=>typeof e=="string"&&e.length>0):[]}function g(t,e,n){let r=S(n);for(let s of e)if(t==="toggle")for(let i of n)s.classList.toggle(i);else s.classList[t](...r);return null}var u=class{constructor(e){this.seht=e}add(...e){return g("add",this.seht.elements,e)??this.seht}has(e){return this.seht.elements[0]?.classList.contains(e)??!1}remove(...e){return g("remove",this.seht.elements,e)??this.seht}toggle(...e){return g("toggle",this.seht.elements,e)??this.seht}};function y(t,e){if(t instanceof Node)return[t].filter(f).filter(h);if(Array.isArray(t))return t.filter(f).filter(h);if(t instanceof NodeList)return Array.from(t).filter(f).filter(h);if(typeof t!="string")return[];let n=e==null?[globalThis.document]:y(e),r=[];for(let s of n){let i=Array.from(s.querySelectorAll(t));r.push(...i)}return r.filter(f).filter(h)}function f(t){return t.nodeType===1||t.nodeType>8}function h(t,e,n){return n.indexOf(t)===e}function A(t,e){let n=L(e);for(let r of n)for(let s of t)typeof r=="string"?s.dispatchEvent(new Event(r)):s.dispatchEvent(new CustomEvent(r.name,{detail:r.data}));return null}function L(t){if(typeof t=="string")return[t];if(typeof t!="object")return[];if(!Array.isArray(t))return typeof t.name=="string"?[t]:[];let e=[];for(let n of t)typeof n=="string"&&e.push(n),typeof n=="object"&&typeof n.name=="string"&&e.push(n);return e}function O(t){let e=[];if(typeof t!="object"||Array.isArray(t))return e;for(let n in t){let{listener:r,options:s}=t[n]??{};typeof r=="function"&&e.push({listener:r,name:n,options:s})}return e}function E(t,e,n){let r=n?"addEventListener":"removeEventListener",s=O(e);for(let i of s)for(let l of t)l[r](i.name,i.listener,i.options);return null}var m=class{constructor(e){this.seht=e}add(e){return E(this.seht.elements,e,!0)??this.seht}dispatch(e){return A(this.seht.elements,e)??this.seht}remove(e){return E(this.seht.elements,e,!1)??this.seht}};var o=class{elements;get attributes(){return new c(this)}get classes(){return new u(this)}get data(){return new a(this)}get events(){return new m(this)}constructor(e,n){this.elements=y(e,n)}each(e){for(let n of this.elements)e.call(this,n,this.elements.indexOf(n),this.elements);return this}filter(e){return new o(this.elements.filter(e))}map(e){return new o(this.elements.map(e))}};function $(t,e){return new o(t,e)}export{$,o as Seht};