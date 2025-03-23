// STINKY LIBRARIES:
/*! jQuery v3.7.1 | (c) OpenJS Foundation and other contributors | jquery.org/license */
!function(e,t){"use strict";"object"==typeof module&&"object"==typeof module.exports?module.exports=e.document?t(e,!0):function(e){if(!e.document)throw new Error("jQuery requires a window with a document");return t(e)}:t(e)}("undefined"!=typeof window?window:this,function(ie,e){"use strict";var oe=[],r=Object.getPrototypeOf,ae=oe.slice,g=oe.flat?function(e){return oe.flat.call(e)}:function(e){return oe.concat.apply([],e)},s=oe.push,se=oe.indexOf,n={},i=n.toString,ue=n.hasOwnProperty,o=ue.toString,a=o.call(Object),le={},v=function(e){return"function"==typeof e&&"number"!=typeof e.nodeType&&"function"!=typeof e.item},y=function(e){return null!=e&&e===e.window},C=ie.document,u={type:!0,src:!0,nonce:!0,noModule:!0};function m(e,t,n){var r,i,o=(n=n||C).createElement("script");if(o.text=e,t)for(r in u)(i=t[r]||t.getAttribute&&t.getAttribute(r))&&o.setAttribute(r,i);n.head.appendChild(o).parentNode.removeChild(o)}function x(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?n[i.call(e)]||"object":typeof e}var t="3.7.1",l=/HTML$/i,ce=function(e,t){return new ce.fn.init(e,t)};function c(e){var t=!!e&&"length"in e&&e.length,n=x(e);return!v(e)&&!y(e)&&("array"===n||0===t||"number"==typeof t&&0<t&&t-1 in e)}function fe(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()}ce.fn=ce.prototype={jquery:t,constructor:ce,length:0,toArray:function(){return ae.call(this)},get:function(e){return null==e?ae.call(this):e<0?this[e+this.length]:this[e]},pushStack:function(e){var t=ce.merge(this.constructor(),e);return t.prevObject=this,t},each:function(e){return ce.each(this,e)},map:function(n){return this.pushStack(ce.map(this,function(e,t){return n.call(e,t,e)}))},slice:function(){return this.pushStack(ae.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},even:function(){return this.pushStack(ce.grep(this,function(e,t){return(t+1)%2}))},odd:function(){return this.pushStack(ce.grep(this,function(e,t){return t%2}))},eq:function(e){var t=this.length,n=+e+(e<0?t:0);return this.pushStack(0<=n&&n<t?[this[n]]:[])},end:function(){return this.prevObject||this.constructor()},push:s,sort:oe.sort,splice:oe.splice},ce.extend=ce.fn.extend=function(){var e,t,n,r,i,o,a=arguments[0]||{},s=1,u=arguments.length,l=!1;for("boolean"==typeof a&&(l=a,a=arguments[s]||{},s++),"object"==typeof a||v(a)||(a={}),s===u&&(a=this,s--);s<u;s++)if(null!=(e=arguments[s]))for(t in e)r=e[t],"__proto__"!==t&&a!==r&&(l&&r&&(ce.isPlainObject(r)||(i=Array.isArray(r)))?(n=a[t],o=i&&!Array.isArray(n)?[]:i||ce.isPlainObject(n)?n:{},i=!1,a[t]=ce.extend(l,o,r)):void 0!==r&&(a[t]=r));return a},ce.extend({expando:"jQuery"+(t+Math.random()).replace(/\D/g,""),isReady:!0,error:function(e){throw new Error(e)},noop:function(){},isPlainObject:function(e){var t,n;return!(!e||"[object Object]"!==i.call(e))&&(!(t=r(e))||"function"==typeof(n=ue.call(t,"constructor")&&t.constructor)&&o.call(n)===a)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},globalEval:function(e,t,n){m(e,{nonce:t&&t.nonce},n)},each:function(e,t){var n,r=0;if(c(e)){for(n=e.length;r<n;r++)if(!1===t.call(e[r],r,e[r]))break}else for(r in e)if(!1===t.call(e[r],r,e[r]))break;return e},text:function(e){var t,n="",r=0,i=e.nodeType;if(!i)while(t=e[r++])n+=ce.text(t);return 1===i||11===i?e.textContent:9===i?e.documentElement.textContent:3===i||4===i?e.nodeValue:n},makeArray:function(e,t){var n=t||[];return null!=e&&(c(Object(e))?ce.merge(n,"string"==typeof e?[e]:e):s.call(n,e)),n},inArray:function(e,t,n){return null==t?-1:se.call(t,e,n)},isXMLDoc:function(e){var t=e&&e.namespaceURI,n=e&&(e.ownerDocument||e).documentElement;return!l.test(t||n&&n.nodeName||"HTML")},merge:function(e,t){for(var n=+t.length,r=0,i=e.length;r<n;r++)e[i++]=t[r];return e.length=i,e},grep:function(e,t,n){for(var r=[],i=0,o=e.length,a=!n;i<o;i++)!t(e[i],i)!==a&&r.push(e[i]);return r},map:function(e,t,n){var r,i,o=0,a=[];if(c(e))for(r=e.length;o<r;o++)null!=(i=t(e[o],o,n))&&a.push(i);else for(o in e)null!=(i=t(e[o],o,n))&&a.push(i);return g(a)},guid:1,support:le}),"function"==typeof Symbol&&(ce.fn[Symbol.iterator]=oe[Symbol.iterator]),ce.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(e,t){n["[object "+t+"]"]=t.toLowerCase()});var pe=oe.pop,de=oe.sort,he=oe.splice,ge="[\\x20\\t\\r\\n\\f]",ve=new RegExp("^"+ge+"+|((?:^|[^\\\\])(?:\\\\.)*)"+ge+"+$","g");ce.contains=function(e,t){var n=t&&t.parentNode;return e===n||!(!n||1!==n.nodeType||!(e.contains?e.contains(n):e.compareDocumentPosition&&16&e.compareDocumentPosition(n)))};var f=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;function p(e,t){return t?"\0"===e?"\ufffd":e.slice(0,-1)+"\\"+e.charCodeAt(e.length-1).toString(16)+" ":"\\"+e}ce.escapeSelector=function(e){return(e+"").replace(f,p)};var ye=C,me=s;!function(){var e,b,w,o,a,T,r,C,d,i,k=me,S=ce.expando,E=0,n=0,s=W(),c=W(),u=W(),h=W(),l=function(e,t){return e===t&&(a=!0),0},f="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",t="(?:\\\\[\\da-fA-F]{1,6}"+ge+"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",p="\\["+ge+"*("+t+")(?:"+ge+"*([*^$|!~]?=)"+ge+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+t+"))|)"+ge+"*\\]",g=":("+t+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+p+")*)|.*)\\)|)",v=new RegExp(ge+"+","g"),y=new RegExp("^"+ge+"*,"+ge+"*"),m=new RegExp("^"+ge+"*([>+~]|"+ge+")"+ge+"*"),x=new RegExp(ge+"|>"),j=new RegExp(g),A=new RegExp("^"+t+"$"),D={ID:new RegExp("^#("+t+")"),CLASS:new RegExp("^\\.("+t+")"),TAG:new RegExp("^("+t+"|[*])"),ATTR:new RegExp("^"+p),PSEUDO:new RegExp("^"+g),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+ge+"*(even|odd|(([+-]|)(\\d*)n|)"+ge+"*(?:([+-]|)"+ge+"*(\\d+)|))"+ge+"*\\)|)","i"),bool:new RegExp("^(?:"+f+")$","i"),needsContext:new RegExp("^"+ge+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+ge+"*((?:-\\d)?\\d*)"+ge+"*\\)|)(?=[^-]|$)","i")},N=/^(?:input|select|textarea|button)$/i,q=/^h\d$/i,L=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,H=/[+~]/,O=new RegExp("\\\\[\\da-fA-F]{1,6}"+ge+"?|\\\\([^\\r\\n\\f])","g"),P=function(e,t){var n="0x"+e.slice(1)-65536;return t||(n<0?String.fromCharCode(n+65536):String.fromCharCode(n>>10|55296,1023&n|56320))},M=function(){V()},R=J(function(e){return!0===e.disabled&&fe(e,"fieldset")},{dir:"parentNode",next:"legend"});try{k.apply(oe=ae.call(ye.childNodes),ye.childNodes),oe[ye.childNodes.length].nodeType}catch(e){k={apply:function(e,t){me.apply(e,ae.call(t))},call:function(e){me.apply(e,ae.call(arguments,1))}}}function I(t,e,n,r){var i,o,a,s,u,l,c,f=e&&e.ownerDocument,p=e?e.nodeType:9;if(n=n||[],"string"!=typeof t||!t||1!==p&&9!==p&&11!==p)return n;if(!r&&(V(e),e=e||T,C)){if(11!==p&&(u=L.exec(t)))if(i=u[1]){if(9===p){if(!(a=e.getElementById(i)))return n;if(a.id===i)return k.call(n,a),n}else if(f&&(a=f.getElementById(i))&&I.contains(e,a)&&a.id===i)return k.call(n,a),n}else{if(u[2])return k.apply(n,e.getElementsByTagName(t)),n;if((i=u[3])&&e.getElementsByClassName)return k.apply(n,e.getElementsByClassName(i)),n}if(!(h[t+" "]||d&&d.test(t))){if(c=t,f=e,1===p&&(x.test(t)||m.test(t))){(f=H.test(t)&&U(e.parentNode)||e)==e&&le.scope||((s=e.getAttribute("id"))?s=ce.escapeSelector(s):e.setAttribute("id",s=S)),o=(l=Y(t)).length;while(o--)l[o]=(s?"#"+s:":scope")+" "+Q(l[o]);c=l.join(",")}try{return k.apply(n,f.querySelectorAll(c)),n}catch(e){h(t,!0)}finally{s===S&&e.removeAttribute("id")}}}return re(t.replace(ve,"$1"),e,n,r)}function W(){var r=[];return function e(t,n){return r.push(t+" ")>b.cacheLength&&delete e[r.shift()],e[t+" "]=n}}function F(e){return e[S]=!0,e}function $(e){var t=T.createElement("fieldset");try{return!!e(t)}catch(e){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function B(t){return function(e){return fe(e,"input")&&e.type===t}}function _(t){return function(e){return(fe(e,"input")||fe(e,"button"))&&e.type===t}}function z(t){return function(e){return"form"in e?e.parentNode&&!1===e.disabled?"label"in e?"label"in e.parentNode?e.parentNode.disabled===t:e.disabled===t:e.isDisabled===t||e.isDisabled!==!t&&R(e)===t:e.disabled===t:"label"in e&&e.disabled===t}}function X(a){return F(function(o){return o=+o,F(function(e,t){var n,r=a([],e.length,o),i=r.length;while(i--)e[n=r[i]]&&(e[n]=!(t[n]=e[n]))})})}function U(e){return e&&"undefined"!=typeof e.getElementsByTagName&&e}function V(e){var t,n=e?e.ownerDocument||e:ye;return n!=T&&9===n.nodeType&&n.documentElement&&(r=(T=n).documentElement,C=!ce.isXMLDoc(T),i=r.matches||r.webkitMatchesSelector||r.msMatchesSelector,r.msMatchesSelector&&ye!=T&&(t=T.defaultView)&&t.top!==t&&t.addEventListener("unload",M),le.getById=$(function(e){return r.appendChild(e).id=ce.expando,!T.getElementsByName||!T.getElementsByName(ce.expando).length}),le.disconnectedMatch=$(function(e){return i.call(e,"*")}),le.scope=$(function(){return T.querySelectorAll(":scope")}),le.cssHas=$(function(){try{return T.querySelector(":has(*,:jqfake)"),!1}catch(e){return!0}}),le.getById?(b.filter.ID=function(e){var t=e.replace(O,P);return function(e){return e.getAttribute("id")===t}},b.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&C){var n=t.getElementById(e);return n?[n]:[]}}):(b.filter.ID=function(e){var n=e.replace(O,P);return function(e){var t="undefined"!=typeof e.getAttributeNode&&e.getAttributeNode("id");return t&&t.value===n}},b.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&C){var n,r,i,o=t.getElementById(e);if(o){if((n=o.getAttributeNode("id"))&&n.value===e)return[o];i=t.getElementsByName(e),r=0;while(o=i[r++])if((n=o.getAttributeNode("id"))&&n.value===e)return[o]}return[]}}),b.find.TAG=function(e,t){return"undefined"!=typeof t.getElementsByTagName?t.getElementsByTagName(e):t.querySelectorAll(e)},b.find.CLASS=function(e,t){if("undefined"!=typeof t.getElementsByClassName&&C)return t.getElementsByClassName(e)},d=[],$(function(e){var t;r.appendChild(e).innerHTML="<a id='"+S+"' href='' disabled='disabled'></a><select id='"+S+"-\r\\' disabled='disabled'><option selected=''></option></select>",e.querySelectorAll("[selected]").length||d.push("\\["+ge+"*(?:value|"+f+")"),e.querySelectorAll("[id~="+S+"-]").length||d.push("~="),e.querySelectorAll("a#"+S+"+*").length||d.push(".#.+[+~]"),e.querySelectorAll(":checked").length||d.push(":checked"),(t=T.createElement("input")).setAttribute("type","hidden"),e.appendChild(t).setAttribute("name","D"),r.appendChild(e).disabled=!0,2!==e.querySelectorAll(":disabled").length&&d.push(":enabled",":disabled"),(t=T.createElement("input")).setAttribute("name",""),e.appendChild(t),e.querySelectorAll("[name='']").length||d.push("\\["+ge+"*name"+ge+"*="+ge+"*(?:''|\"\")")}),le.cssHas||d.push(":has"),d=d.length&&new RegExp(d.join("|")),l=function(e,t){if(e===t)return a=!0,0;var n=!e.compareDocumentPosition-!t.compareDocumentPosition;return n||(1&(n=(e.ownerDocument||e)==(t.ownerDocument||t)?e.compareDocumentPosition(t):1)||!le.sortDetached&&t.compareDocumentPosition(e)===n?e===T||e.ownerDocument==ye&&I.contains(ye,e)?-1:t===T||t.ownerDocument==ye&&I.contains(ye,t)?1:o?se.call(o,e)-se.call(o,t):0:4&n?-1:1)}),T}for(e in I.matches=function(e,t){return I(e,null,null,t)},I.matchesSelector=function(e,t){if(V(e),C&&!h[t+" "]&&(!d||!d.test(t)))try{var n=i.call(e,t);if(n||le.disconnectedMatch||e.document&&11!==e.document.nodeType)return n}catch(e){h(t,!0)}return 0<I(t,T,null,[e]).length},I.contains=function(e,t){return(e.ownerDocument||e)!=T&&V(e),ce.contains(e,t)},I.attr=function(e,t){(e.ownerDocument||e)!=T&&V(e);var n=b.attrHandle[t.toLowerCase()],r=n&&ue.call(b.attrHandle,t.toLowerCase())?n(e,t,!C):void 0;return void 0!==r?r:e.getAttribute(t)},I.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},ce.uniqueSort=function(e){var t,n=[],r=0,i=0;if(a=!le.sortStable,o=!le.sortStable&&ae.call(e,0),de.call(e,l),a){while(t=e[i++])t===e[i]&&(r=n.push(i));while(r--)he.call(e,n[r],1)}return o=null,e},ce.fn.uniqueSort=function(){return this.pushStack(ce.uniqueSort(ae.apply(this)))},(b=ce.expr={cacheLength:50,createPseudo:F,match:D,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(O,P),e[3]=(e[3]||e[4]||e[5]||"").replace(O,P),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||I.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&I.error(e[0]),e},PSEUDO:function(e){var t,n=!e[6]&&e[2];return D.CHILD.test(e[0])?null:(e[3]?e[2]=e[4]||e[5]||"":n&&j.test(n)&&(t=Y(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(O,P).toLowerCase();return"*"===e?function(){return!0}:function(e){return fe(e,t)}},CLASS:function(e){var t=s[e+" "];return t||(t=new RegExp("(^|"+ge+")"+e+"("+ge+"|$)"))&&s(e,function(e){return t.test("string"==typeof e.className&&e.className||"undefined"!=typeof e.getAttribute&&e.getAttribute("class")||"")})},ATTR:function(n,r,i){return function(e){var t=I.attr(e,n);return null==t?"!="===r:!r||(t+="","="===r?t===i:"!="===r?t!==i:"^="===r?i&&0===t.indexOf(i):"*="===r?i&&-1<t.indexOf(i):"$="===r?i&&t.slice(-i.length)===i:"~="===r?-1<(" "+t.replace(v," ")+" ").indexOf(i):"|="===r&&(t===i||t.slice(0,i.length+1)===i+"-"))}},CHILD:function(d,e,t,h,g){var v="nth"!==d.slice(0,3),y="last"!==d.slice(-4),m="of-type"===e;return 1===h&&0===g?function(e){return!!e.parentNode}:function(e,t,n){var r,i,o,a,s,u=v!==y?"nextSibling":"previousSibling",l=e.parentNode,c=m&&e.nodeName.toLowerCase(),f=!n&&!m,p=!1;if(l){if(v){while(u){o=e;while(o=o[u])if(m?fe(o,c):1===o.nodeType)return!1;s=u="only"===d&&!s&&"nextSibling"}return!0}if(s=[y?l.firstChild:l.lastChild],y&&f){p=(a=(r=(i=l[S]||(l[S]={}))[d]||[])[0]===E&&r[1])&&r[2],o=a&&l.childNodes[a];while(o=++a&&o&&o[u]||(p=a=0)||s.pop())if(1===o.nodeType&&++p&&o===e){i[d]=[E,a,p];break}}else if(f&&(p=a=(r=(i=e[S]||(e[S]={}))[d]||[])[0]===E&&r[1]),!1===p)while(o=++a&&o&&o[u]||(p=a=0)||s.pop())if((m?fe(o,c):1===o.nodeType)&&++p&&(f&&((i=o[S]||(o[S]={}))[d]=[E,p]),o===e))break;return(p-=g)===h||p%h==0&&0<=p/h}}},PSEUDO:function(e,o){var t,a=b.pseudos[e]||b.setFilters[e.toLowerCase()]||I.error("unsupported pseudo: "+e);return a[S]?a(o):1<a.length?(t=[e,e,"",o],b.setFilters.hasOwnProperty(e.toLowerCase())?F(function(e,t){var n,r=a(e,o),i=r.length;while(i--)e[n=se.call(e,r[i])]=!(t[n]=r[i])}):function(e){return a(e,0,t)}):a}},pseudos:{not:F(function(e){var r=[],i=[],s=ne(e.replace(ve,"$1"));return s[S]?F(function(e,t,n,r){var i,o=s(e,null,r,[]),a=e.length;while(a--)(i=o[a])&&(e[a]=!(t[a]=i))}):function(e,t,n){return r[0]=e,s(r,null,n,i),r[0]=null,!i.pop()}}),has:F(function(t){return function(e){return 0<I(t,e).length}}),contains:F(function(t){return t=t.replace(O,P),function(e){return-1<(e.textContent||ce.text(e)).indexOf(t)}}),lang:F(function(n){return A.test(n||"")||I.error("unsupported lang: "+n),n=n.replace(O,P).toLowerCase(),function(e){var t;do{if(t=C?e.lang:e.getAttribute("xml:lang")||e.getAttribute("lang"))return(t=t.toLowerCase())===n||0===t.indexOf(n+"-")}while((e=e.parentNode)&&1===e.nodeType);return!1}}),target:function(e){var t=ie.location&&ie.location.hash;return t&&t.slice(1)===e.id},root:function(e){return e===r},focus:function(e){return e===function(){try{return T.activeElement}catch(e){}}()&&T.hasFocus()&&!!(e.type||e.href||~e.tabIndex)},enabled:z(!1),disabled:z(!0),checked:function(e){return fe(e,"input")&&!!e.checked||fe(e,"option")&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,!0===e.selected},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeType<6)return!1;return!0},parent:function(e){return!b.pseudos.empty(e)},header:function(e){return q.test(e.nodeName)},input:function(e){return N.test(e.nodeName)},button:function(e){return fe(e,"input")&&"button"===e.type||fe(e,"button")},text:function(e){var t;return fe(e,"input")&&"text"===e.type&&(null==(t=e.getAttribute("type"))||"text"===t.toLowerCase())},first:X(function(){return[0]}),last:X(function(e,t){return[t-1]}),eq:X(function(e,t,n){return[n<0?n+t:n]}),even:X(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:X(function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e}),lt:X(function(e,t,n){var r;for(r=n<0?n+t:t<n?t:n;0<=--r;)e.push(r);return e}),gt:X(function(e,t,n){for(var r=n<0?n+t:n;++r<t;)e.push(r);return e})}}).pseudos.nth=b.pseudos.eq,{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})b.pseudos[e]=B(e);for(e in{submit:!0,reset:!0})b.pseudos[e]=_(e);function G(){}function Y(e,t){var n,r,i,o,a,s,u,l=c[e+" "];if(l)return t?0:l.slice(0);a=e,s=[],u=b.preFilter;while(a){for(o in n&&!(r=y.exec(a))||(r&&(a=a.slice(r[0].length)||a),s.push(i=[])),n=!1,(r=m.exec(a))&&(n=r.shift(),i.push({value:n,type:r[0].replace(ve," ")}),a=a.slice(n.length)),b.filter)!(r=D[o].exec(a))||u[o]&&!(r=u[o](r))||(n=r.shift(),i.push({value:n,type:o,matches:r}),a=a.slice(n.length));if(!n)break}return t?a.length:a?I.error(e):c(e,s).slice(0)}function Q(e){for(var t=0,n=e.length,r="";t<n;t++)r+=e[t].value;return r}function J(a,e,t){var s=e.dir,u=e.next,l=u||s,c=t&&"parentNode"===l,f=n++;return e.first?function(e,t,n){while(e=e[s])if(1===e.nodeType||c)return a(e,t,n);return!1}:function(e,t,n){var r,i,o=[E,f];if(n){while(e=e[s])if((1===e.nodeType||c)&&a(e,t,n))return!0}else while(e=e[s])if(1===e.nodeType||c)if(i=e[S]||(e[S]={}),u&&fe(e,u))e=e[s]||e;else{if((r=i[l])&&r[0]===E&&r[1]===f)return o[2]=r[2];if((i[l]=o)[2]=a(e,t,n))return!0}return!1}}function K(i){return 1<i.length?function(e,t,n){var r=i.length;while(r--)if(!i[r](e,t,n))return!1;return!0}:i[0]}function Z(e,t,n,r,i){for(var o,a=[],s=0,u=e.length,l=null!=t;s<u;s++)(o=e[s])&&(n&&!n(o,r,i)||(a.push(o),l&&t.push(s)));return a}function ee(d,h,g,v,y,e){return v&&!v[S]&&(v=ee(v)),y&&!y[S]&&(y=ee(y,e)),F(function(e,t,n,r){var i,o,a,s,u=[],l=[],c=t.length,f=e||function(e,t,n){for(var r=0,i=t.length;r<i;r++)I(e,t[r],n);return n}(h||"*",n.nodeType?[n]:n,[]),p=!d||!e&&h?f:Z(f,u,d,n,r);if(g?g(p,s=y||(e?d:c||v)?[]:t,n,r):s=p,v){i=Z(s,l),v(i,[],n,r),o=i.length;while(o--)(a=i[o])&&(s[l[o]]=!(p[l[o]]=a))}if(e){if(y||d){if(y){i=[],o=s.length;while(o--)(a=s[o])&&i.push(p[o]=a);y(null,s=[],i,r)}o=s.length;while(o--)(a=s[o])&&-1<(i=y?se.call(e,a):u[o])&&(e[i]=!(t[i]=a))}}else s=Z(s===t?s.splice(c,s.length):s),y?y(null,t,s,r):k.apply(t,s)})}function te(e){for(var i,t,n,r=e.length,o=b.relative[e[0].type],a=o||b.relative[" "],s=o?1:0,u=J(function(e){return e===i},a,!0),l=J(function(e){return-1<se.call(i,e)},a,!0),c=[function(e,t,n){var r=!o&&(n||t!=w)||((i=t).nodeType?u(e,t,n):l(e,t,n));return i=null,r}];s<r;s++)if(t=b.relative[e[s].type])c=[J(K(c),t)];else{if((t=b.filter[e[s].type].apply(null,e[s].matches))[S]){for(n=++s;n<r;n++)if(b.relative[e[n].type])break;return ee(1<s&&K(c),1<s&&Q(e.slice(0,s-1).concat({value:" "===e[s-2].type?"*":""})).replace(ve,"$1"),t,s<n&&te(e.slice(s,n)),n<r&&te(e=e.slice(n)),n<r&&Q(e))}c.push(t)}return K(c)}function ne(e,t){var n,v,y,m,x,r,i=[],o=[],a=u[e+" "];if(!a){t||(t=Y(e)),n=t.length;while(n--)(a=te(t[n]))[S]?i.push(a):o.push(a);(a=u(e,(v=o,m=0<(y=i).length,x=0<v.length,r=function(e,t,n,r,i){var o,a,s,u=0,l="0",c=e&&[],f=[],p=w,d=e||x&&b.find.TAG("*",i),h=E+=null==p?1:Math.random()||.1,g=d.length;for(i&&(w=t==T||t||i);l!==g&&null!=(o=d[l]);l++){if(x&&o){a=0,t||o.ownerDocument==T||(V(o),n=!C);while(s=v[a++])if(s(o,t||T,n)){k.call(r,o);break}i&&(E=h)}m&&((o=!s&&o)&&u--,e&&c.push(o))}if(u+=l,m&&l!==u){a=0;while(s=y[a++])s(c,f,t,n);if(e){if(0<u)while(l--)c[l]||f[l]||(f[l]=pe.call(r));f=Z(f)}k.apply(r,f),i&&!e&&0<f.length&&1<u+y.length&&ce.uniqueSort(r)}return i&&(E=h,w=p),c},m?F(r):r))).selector=e}return a}function re(e,t,n,r){var i,o,a,s,u,l="function"==typeof e&&e,c=!r&&Y(e=l.selector||e);if(n=n||[],1===c.length){if(2<(o=c[0]=c[0].slice(0)).length&&"ID"===(a=o[0]).type&&9===t.nodeType&&C&&b.relative[o[1].type]){if(!(t=(b.find.ID(a.matches[0].replace(O,P),t)||[])[0]))return n;l&&(t=t.parentNode),e=e.slice(o.shift().value.length)}i=D.needsContext.test(e)?0:o.length;while(i--){if(a=o[i],b.relative[s=a.type])break;if((u=b.find[s])&&(r=u(a.matches[0].replace(O,P),H.test(o[0].type)&&U(t.parentNode)||t))){if(o.splice(i,1),!(e=r.length&&Q(o)))return k.apply(n,r),n;break}}}return(l||ne(e,c))(r,t,!C,n,!t||H.test(e)&&U(t.parentNode)||t),n}G.prototype=b.filters=b.pseudos,b.setFilters=new G,le.sortStable=S.split("").sort(l).join("")===S,V(),le.sortDetached=$(function(e){return 1&e.compareDocumentPosition(T.createElement("fieldset"))}),ce.find=I,ce.expr[":"]=ce.expr.pseudos,ce.unique=ce.uniqueSort,I.compile=ne,I.select=re,I.setDocument=V,I.tokenize=Y,I.escape=ce.escapeSelector,I.getText=ce.text,I.isXML=ce.isXMLDoc,I.selectors=ce.expr,I.support=ce.support,I.uniqueSort=ce.uniqueSort}();var d=function(e,t,n){var r=[],i=void 0!==n;while((e=e[t])&&9!==e.nodeType)if(1===e.nodeType){if(i&&ce(e).is(n))break;r.push(e)}return r},h=function(e,t){for(var n=[];e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n},b=ce.expr.match.needsContext,w=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;function T(e,n,r){return v(n)?ce.grep(e,function(e,t){return!!n.call(e,t,e)!==r}):n.nodeType?ce.grep(e,function(e){return e===n!==r}):"string"!=typeof n?ce.grep(e,function(e){return-1<se.call(n,e)!==r}):ce.filter(n,e,r)}ce.filter=function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?ce.find.matchesSelector(r,e)?[r]:[]:ce.find.matches(e,ce.grep(t,function(e){return 1===e.nodeType}))},ce.fn.extend({find:function(e){var t,n,r=this.length,i=this;if("string"!=typeof e)return this.pushStack(ce(e).filter(function(){for(t=0;t<r;t++)if(ce.contains(i[t],this))return!0}));for(n=this.pushStack([]),t=0;t<r;t++)ce.find(e,i[t],n);return 1<r?ce.uniqueSort(n):n},filter:function(e){return this.pushStack(T(this,e||[],!1))},not:function(e){return this.pushStack(T(this,e||[],!0))},is:function(e){return!!T(this,"string"==typeof e&&b.test(e)?ce(e):e||[],!1).length}});var k,S=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;(ce.fn.init=function(e,t,n){var r,i;if(!e)return this;if(n=n||k,"string"==typeof e){if(!(r="<"===e[0]&&">"===e[e.length-1]&&3<=e.length?[null,e,null]:S.exec(e))||!r[1]&&t)return!t||t.jquery?(t||n).find(e):this.constructor(t).find(e);if(r[1]){if(t=t instanceof ce?t[0]:t,ce.merge(this,ce.parseHTML(r[1],t&&t.nodeType?t.ownerDocument||t:C,!0)),w.test(r[1])&&ce.isPlainObject(t))for(r in t)v(this[r])?this[r](t[r]):this.attr(r,t[r]);return this}return(i=C.getElementById(r[2]))&&(this[0]=i,this.length=1),this}return e.nodeType?(this[0]=e,this.length=1,this):v(e)?void 0!==n.ready?n.ready(e):e(ce):ce.makeArray(e,this)}).prototype=ce.fn,k=ce(C);var E=/^(?:parents|prev(?:Until|All))/,j={children:!0,contents:!0,next:!0,prev:!0};function A(e,t){while((e=e[t])&&1!==e.nodeType);return e}ce.fn.extend({has:function(e){var t=ce(e,this),n=t.length;return this.filter(function(){for(var e=0;e<n;e++)if(ce.contains(this,t[e]))return!0})},closest:function(e,t){var n,r=0,i=this.length,o=[],a="string"!=typeof e&&ce(e);if(!b.test(e))for(;r<i;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(n.nodeType<11&&(a?-1<a.index(n):1===n.nodeType&&ce.find.matchesSelector(n,e))){o.push(n);break}return this.pushStack(1<o.length?ce.uniqueSort(o):o)},index:function(e){return e?"string"==typeof e?se.call(ce(e),this[0]):se.call(this,e.jquery?e[0]:e):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){return this.pushStack(ce.uniqueSort(ce.merge(this.get(),ce(e,t))))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}}),ce.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return d(e,"parentNode")},parentsUntil:function(e,t,n){return d(e,"parentNode",n)},next:function(e){return A(e,"nextSibling")},prev:function(e){return A(e,"previousSibling")},nextAll:function(e){return d(e,"nextSibling")},prevAll:function(e){return d(e,"previousSibling")},nextUntil:function(e,t,n){return d(e,"nextSibling",n)},prevUntil:function(e,t,n){return d(e,"previousSibling",n)},siblings:function(e){return h((e.parentNode||{}).firstChild,e)},children:function(e){return h(e.firstChild)},contents:function(e){return null!=e.contentDocument&&r(e.contentDocument)?e.contentDocument:(fe(e,"template")&&(e=e.content||e),ce.merge([],e.childNodes))}},function(r,i){ce.fn[r]=function(e,t){var n=ce.map(this,i,e);return"Until"!==r.slice(-5)&&(t=e),t&&"string"==typeof t&&(n=ce.filter(t,n)),1<this.length&&(j[r]||ce.uniqueSort(n),E.test(r)&&n.reverse()),this.pushStack(n)}});var D=/[^\x20\t\r\n\f]+/g;function N(e){return e}function q(e){throw e}function L(e,t,n,r){var i;try{e&&v(i=e.promise)?i.call(e).done(t).fail(n):e&&v(i=e.then)?i.call(e,t,n):t.apply(void 0,[e].slice(r))}catch(e){n.apply(void 0,[e])}}ce.Callbacks=function(r){var e,n;r="string"==typeof r?(e=r,n={},ce.each(e.match(D)||[],function(e,t){n[t]=!0}),n):ce.extend({},r);var i,t,o,a,s=[],u=[],l=-1,c=function(){for(a=a||r.once,o=i=!0;u.length;l=-1){t=u.shift();while(++l<s.length)!1===s[l].apply(t[0],t[1])&&r.stopOnFalse&&(l=s.length,t=!1)}r.memory||(t=!1),i=!1,a&&(s=t?[]:"")},f={add:function(){return s&&(t&&!i&&(l=s.length-1,u.push(t)),function n(e){ce.each(e,function(e,t){v(t)?r.unique&&f.has(t)||s.push(t):t&&t.length&&"string"!==x(t)&&n(t)})}(arguments),t&&!i&&c()),this},remove:function(){return ce.each(arguments,function(e,t){var n;while(-1<(n=ce.inArray(t,s,n)))s.splice(n,1),n<=l&&l--}),this},has:function(e){return e?-1<ce.inArray(e,s):0<s.length},empty:function(){return s&&(s=[]),this},disable:function(){return a=u=[],s=t="",this},disabled:function(){return!s},lock:function(){return a=u=[],t||i||(s=t=""),this},locked:function(){return!!a},fireWith:function(e,t){return a||(t=[e,(t=t||[]).slice?t.slice():t],u.push(t),i||c()),this},fire:function(){return f.fireWith(this,arguments),this},fired:function(){return!!o}};return f},ce.extend({Deferred:function(e){var o=[["notify","progress",ce.Callbacks("memory"),ce.Callbacks("memory"),2],["resolve","done",ce.Callbacks("once memory"),ce.Callbacks("once memory"),0,"resolved"],["reject","fail",ce.Callbacks("once memory"),ce.Callbacks("once memory"),1,"rejected"]],i="pending",a={state:function(){return i},always:function(){return s.done(arguments).fail(arguments),this},"catch":function(e){return a.then(null,e)},pipe:function(){var i=arguments;return ce.Deferred(function(r){ce.each(o,function(e,t){var n=v(i[t[4]])&&i[t[4]];s[t[1]](function(){var e=n&&n.apply(this,arguments);e&&v(e.promise)?e.promise().progress(r.notify).done(r.resolve).fail(r.reject):r[t[0]+"With"](this,n?[e]:arguments)})}),i=null}).promise()},then:function(t,n,r){var u=0;function l(i,o,a,s){return function(){var n=this,r=arguments,e=function(){var e,t;if(!(i<u)){if((e=a.apply(n,r))===o.promise())throw new TypeError("Thenable self-resolution");t=e&&("object"==typeof e||"function"==typeof e)&&e.then,v(t)?s?t.call(e,l(u,o,N,s),l(u,o,q,s)):(u++,t.call(e,l(u,o,N,s),l(u,o,q,s),l(u,o,N,o.notifyWith))):(a!==N&&(n=void 0,r=[e]),(s||o.resolveWith)(n,r))}},t=s?e:function(){try{e()}catch(e){ce.Deferred.exceptionHook&&ce.Deferred.exceptionHook(e,t.error),u<=i+1&&(a!==q&&(n=void 0,r=[e]),o.rejectWith(n,r))}};i?t():(ce.Deferred.getErrorHook?t.error=ce.Deferred.getErrorHook():ce.Deferred.getStackHook&&(t.error=ce.Deferred.getStackHook()),ie.setTimeout(t))}}return ce.Deferred(function(e){o[0][3].add(l(0,e,v(r)?r:N,e.notifyWith)),o[1][3].add(l(0,e,v(t)?t:N)),o[2][3].add(l(0,e,v(n)?n:q))}).promise()},promise:function(e){return null!=e?ce.extend(e,a):a}},s={};return ce.each(o,function(e,t){var n=t[2],r=t[5];a[t[1]]=n.add,r&&n.add(function(){i=r},o[3-e][2].disable,o[3-e][3].disable,o[0][2].lock,o[0][3].lock),n.add(t[3].fire),s[t[0]]=function(){return s[t[0]+"With"](this===s?void 0:this,arguments),this},s[t[0]+"With"]=n.fireWith}),a.promise(s),e&&e.call(s,s),s},when:function(e){var n=arguments.length,t=n,r=Array(t),i=ae.call(arguments),o=ce.Deferred(),a=function(t){return function(e){r[t]=this,i[t]=1<arguments.length?ae.call(arguments):e,--n||o.resolveWith(r,i)}};if(n<=1&&(L(e,o.done(a(t)).resolve,o.reject,!n),"pending"===o.state()||v(i[t]&&i[t].then)))return o.then();while(t--)L(i[t],a(t),o.reject);return o.promise()}});var H=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;ce.Deferred.exceptionHook=function(e,t){ie.console&&ie.console.warn&&e&&H.test(e.name)&&ie.console.warn("jQuery.Deferred exception: "+e.message,e.stack,t)},ce.readyException=function(e){ie.setTimeout(function(){throw e})};var O=ce.Deferred();function P(){C.removeEventListener("DOMContentLoaded",P),ie.removeEventListener("load",P),ce.ready()}ce.fn.ready=function(e){return O.then(e)["catch"](function(e){ce.readyException(e)}),this},ce.extend({isReady:!1,readyWait:1,ready:function(e){(!0===e?--ce.readyWait:ce.isReady)||(ce.isReady=!0)!==e&&0<--ce.readyWait||O.resolveWith(C,[ce])}}),ce.ready.then=O.then,"complete"===C.readyState||"loading"!==C.readyState&&!C.documentElement.doScroll?ie.setTimeout(ce.ready):(C.addEventListener("DOMContentLoaded",P),ie.addEventListener("load",P));var M=function(e,t,n,r,i,o,a){var s=0,u=e.length,l=null==n;if("object"===x(n))for(s in i=!0,n)M(e,t,s,n[s],!0,o,a);else if(void 0!==r&&(i=!0,v(r)||(a=!0),l&&(a?(t.call(e,r),t=null):(l=t,t=function(e,t,n){return l.call(ce(e),n)})),t))for(;s<u;s++)t(e[s],n,a?r:r.call(e[s],s,t(e[s],n)));return i?e:l?t.call(e):u?t(e[0],n):o},R=/^-ms-/,I=/-([a-z])/g;function W(e,t){return t.toUpperCase()}function F(e){return e.replace(R,"ms-").replace(I,W)}var $=function(e){return 1===e.nodeType||9===e.nodeType||!+e.nodeType};function B(){this.expando=ce.expando+B.uid++}B.uid=1,B.prototype={cache:function(e){var t=e[this.expando];return t||(t={},$(e)&&(e.nodeType?e[this.expando]=t:Object.defineProperty(e,this.expando,{value:t,configurable:!0}))),t},set:function(e,t,n){var r,i=this.cache(e);if("string"==typeof t)i[F(t)]=n;else for(r in t)i[F(r)]=t[r];return i},get:function(e,t){return void 0===t?this.cache(e):e[this.expando]&&e[this.expando][F(t)]},access:function(e,t,n){return void 0===t||t&&"string"==typeof t&&void 0===n?this.get(e,t):(this.set(e,t,n),void 0!==n?n:t)},remove:function(e,t){var n,r=e[this.expando];if(void 0!==r){if(void 0!==t){n=(t=Array.isArray(t)?t.map(F):(t=F(t))in r?[t]:t.match(D)||[]).length;while(n--)delete r[t[n]]}(void 0===t||ce.isEmptyObject(r))&&(e.nodeType?e[this.expando]=void 0:delete e[this.expando])}},hasData:function(e){var t=e[this.expando];return void 0!==t&&!ce.isEmptyObject(t)}};var _=new B,z=new B,X=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,U=/[A-Z]/g;function V(e,t,n){var r,i;if(void 0===n&&1===e.nodeType)if(r="data-"+t.replace(U,"-$&").toLowerCase(),"string"==typeof(n=e.getAttribute(r))){try{n="true"===(i=n)||"false"!==i&&("null"===i?null:i===+i+""?+i:X.test(i)?JSON.parse(i):i)}catch(e){}z.set(e,t,n)}else n=void 0;return n}ce.extend({hasData:function(e){return z.hasData(e)||_.hasData(e)},data:function(e,t,n){return z.access(e,t,n)},removeData:function(e,t){z.remove(e,t)},_data:function(e,t,n){return _.access(e,t,n)},_removeData:function(e,t){_.remove(e,t)}}),ce.fn.extend({data:function(n,e){var t,r,i,o=this[0],a=o&&o.attributes;if(void 0===n){if(this.length&&(i=z.get(o),1===o.nodeType&&!_.get(o,"hasDataAttrs"))){t=a.length;while(t--)a[t]&&0===(r=a[t].name).indexOf("data-")&&(r=F(r.slice(5)),V(o,r,i[r]));_.set(o,"hasDataAttrs",!0)}return i}return"object"==typeof n?this.each(function(){z.set(this,n)}):M(this,function(e){var t;if(o&&void 0===e)return void 0!==(t=z.get(o,n))?t:void 0!==(t=V(o,n))?t:void 0;this.each(function(){z.set(this,n,e)})},null,e,1<arguments.length,null,!0)},removeData:function(e){return this.each(function(){z.remove(this,e)})}}),ce.extend({queue:function(e,t,n){var r;if(e)return t=(t||"fx")+"queue",r=_.get(e,t),n&&(!r||Array.isArray(n)?r=_.access(e,t,ce.makeArray(n)):r.push(n)),r||[]},dequeue:function(e,t){t=t||"fx";var n=ce.queue(e,t),r=n.length,i=n.shift(),o=ce._queueHooks(e,t);"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,function(){ce.dequeue(e,t)},o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return _.get(e,n)||_.access(e,n,{empty:ce.Callbacks("once memory").add(function(){_.remove(e,[t+"queue",n])})})}}),ce.fn.extend({queue:function(t,n){var e=2;return"string"!=typeof t&&(n=t,t="fx",e--),arguments.length<e?ce.queue(this[0],t):void 0===n?this:this.each(function(){var e=ce.queue(this,t,n);ce._queueHooks(this,t),"fx"===t&&"inprogress"!==e[0]&&ce.dequeue(this,t)})},dequeue:function(e){return this.each(function(){ce.dequeue(this,e)})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,t){var n,r=1,i=ce.Deferred(),o=this,a=this.length,s=function(){--r||i.resolveWith(o,[o])};"string"!=typeof e&&(t=e,e=void 0),e=e||"fx";while(a--)(n=_.get(o[a],e+"queueHooks"))&&n.empty&&(r++,n.empty.add(s));return s(),i.promise(t)}});var G=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,Y=new RegExp("^(?:([+-])=|)("+G+")([a-z%]*)$","i"),Q=["Top","Right","Bottom","Left"],J=C.documentElement,K=function(e){return ce.contains(e.ownerDocument,e)},Z={composed:!0};J.getRootNode&&(K=function(e){return ce.contains(e.ownerDocument,e)||e.getRootNode(Z)===e.ownerDocument});var ee=function(e,t){return"none"===(e=t||e).style.display||""===e.style.display&&K(e)&&"none"===ce.css(e,"display")};function te(e,t,n,r){var i,o,a=20,s=r?function(){return r.cur()}:function(){return ce.css(e,t,"")},u=s(),l=n&&n[3]||(ce.cssNumber[t]?"":"px"),c=e.nodeType&&(ce.cssNumber[t]||"px"!==l&&+u)&&Y.exec(ce.css(e,t));if(c&&c[3]!==l){u/=2,l=l||c[3],c=+u||1;while(a--)ce.style(e,t,c+l),(1-o)*(1-(o=s()/u||.5))<=0&&(a=0),c/=o;c*=2,ce.style(e,t,c+l),n=n||[]}return n&&(c=+c||+u||0,i=n[1]?c+(n[1]+1)*n[2]:+n[2],r&&(r.unit=l,r.start=c,r.end=i)),i}var ne={};function re(e,t){for(var n,r,i,o,a,s,u,l=[],c=0,f=e.length;c<f;c++)(r=e[c]).style&&(n=r.style.display,t?("none"===n&&(l[c]=_.get(r,"display")||null,l[c]||(r.style.display="")),""===r.style.display&&ee(r)&&(l[c]=(u=a=o=void 0,a=(i=r).ownerDocument,s=i.nodeName,(u=ne[s])||(o=a.body.appendChild(a.createElement(s)),u=ce.css(o,"display"),o.parentNode.removeChild(o),"none"===u&&(u="block"),ne[s]=u)))):"none"!==n&&(l[c]="none",_.set(r,"display",n)));for(c=0;c<f;c++)null!=l[c]&&(e[c].style.display=l[c]);return e}ce.fn.extend({show:function(){return re(this,!0)},hide:function(){return re(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){ee(this)?ce(this).show():ce(this).hide()})}});var xe,be,we=/^(?:checkbox|radio)$/i,Te=/<([a-z][^\/\0>\x20\t\r\n\f]*)/i,Ce=/^$|^module$|\/(?:java|ecma)script/i;xe=C.createDocumentFragment().appendChild(C.createElement("div")),(be=C.createElement("input")).setAttribute("type","radio"),be.setAttribute("checked","checked"),be.setAttribute("name","t"),xe.appendChild(be),le.checkClone=xe.cloneNode(!0).cloneNode(!0).lastChild.checked,xe.innerHTML="<textarea>x</textarea>",le.noCloneChecked=!!xe.cloneNode(!0).lastChild.defaultValue,xe.innerHTML="<option></option>",le.option=!!xe.lastChild;var ke={thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};function Se(e,t){var n;return n="undefined"!=typeof e.getElementsByTagName?e.getElementsByTagName(t||"*"):"undefined"!=typeof e.querySelectorAll?e.querySelectorAll(t||"*"):[],void 0===t||t&&fe(e,t)?ce.merge([e],n):n}function Ee(e,t){for(var n=0,r=e.length;n<r;n++)_.set(e[n],"globalEval",!t||_.get(t[n],"globalEval"))}ke.tbody=ke.tfoot=ke.colgroup=ke.caption=ke.thead,ke.th=ke.td,le.option||(ke.optgroup=ke.option=[1,"<select multiple='multiple'>","</select>"]);var je=/<|&#?\w+;/;function Ae(e,t,n,r,i){for(var o,a,s,u,l,c,f=t.createDocumentFragment(),p=[],d=0,h=e.length;d<h;d++)if((o=e[d])||0===o)if("object"===x(o))ce.merge(p,o.nodeType?[o]:o);else if(je.test(o)){a=a||f.appendChild(t.createElement("div")),s=(Te.exec(o)||["",""])[1].toLowerCase(),u=ke[s]||ke._default,a.innerHTML=u[1]+ce.htmlPrefilter(o)+u[2],c=u[0];while(c--)a=a.lastChild;ce.merge(p,a.childNodes),(a=f.firstChild).textContent=""}else p.push(t.createTextNode(o));f.textContent="",d=0;while(o=p[d++])if(r&&-1<ce.inArray(o,r))i&&i.push(o);else if(l=K(o),a=Se(f.appendChild(o),"script"),l&&Ee(a),n){c=0;while(o=a[c++])Ce.test(o.type||"")&&n.push(o)}return f}var De=/^([^.]*)(?:\.(.+)|)/;function Ne(){return!0}function qe(){return!1}function Le(e,t,n,r,i,o){var a,s;if("object"==typeof t){for(s in"string"!=typeof n&&(r=r||n,n=void 0),t)Le(e,s,n,r,t[s],o);return e}if(null==r&&null==i?(i=n,r=n=void 0):null==i&&("string"==typeof n?(i=r,r=void 0):(i=r,r=n,n=void 0)),!1===i)i=qe;else if(!i)return e;return 1===o&&(a=i,(i=function(e){return ce().off(e),a.apply(this,arguments)}).guid=a.guid||(a.guid=ce.guid++)),e.each(function(){ce.event.add(this,t,i,r,n)})}function He(e,r,t){t?(_.set(e,r,!1),ce.event.add(e,r,{namespace:!1,handler:function(e){var t,n=_.get(this,r);if(1&e.isTrigger&&this[r]){if(n)(ce.event.special[r]||{}).delegateType&&e.stopPropagation();else if(n=ae.call(arguments),_.set(this,r,n),this[r](),t=_.get(this,r),_.set(this,r,!1),n!==t)return e.stopImmediatePropagation(),e.preventDefault(),t}else n&&(_.set(this,r,ce.event.trigger(n[0],n.slice(1),this)),e.stopPropagation(),e.isImmediatePropagationStopped=Ne)}})):void 0===_.get(e,r)&&ce.event.add(e,r,Ne)}ce.event={global:{},add:function(t,e,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,v=_.get(t);if($(t)){n.handler&&(n=(o=n).handler,i=o.selector),i&&ce.find.matchesSelector(J,i),n.guid||(n.guid=ce.guid++),(u=v.events)||(u=v.events=Object.create(null)),(a=v.handle)||(a=v.handle=function(e){return"undefined"!=typeof ce&&ce.event.triggered!==e.type?ce.event.dispatch.apply(t,arguments):void 0}),l=(e=(e||"").match(D)||[""]).length;while(l--)d=g=(s=De.exec(e[l])||[])[1],h=(s[2]||"").split(".").sort(),d&&(f=ce.event.special[d]||{},d=(i?f.delegateType:f.bindType)||d,f=ce.event.special[d]||{},c=ce.extend({type:d,origType:g,data:r,handler:n,guid:n.guid,selector:i,needsContext:i&&ce.expr.match.needsContext.test(i),namespace:h.join(".")},o),(p=u[d])||((p=u[d]=[]).delegateCount=0,f.setup&&!1!==f.setup.call(t,r,h,a)||t.addEventListener&&t.addEventListener(d,a)),f.add&&(f.add.call(t,c),c.handler.guid||(c.handler.guid=n.guid)),i?p.splice(p.delegateCount++,0,c):p.push(c),ce.event.global[d]=!0)}},remove:function(e,t,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,v=_.hasData(e)&&_.get(e);if(v&&(u=v.events)){l=(t=(t||"").match(D)||[""]).length;while(l--)if(d=g=(s=De.exec(t[l])||[])[1],h=(s[2]||"").split(".").sort(),d){f=ce.event.special[d]||{},p=u[d=(r?f.delegateType:f.bindType)||d]||[],s=s[2]&&new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),a=o=p.length;while(o--)c=p[o],!i&&g!==c.origType||n&&n.guid!==c.guid||s&&!s.test(c.namespace)||r&&r!==c.selector&&("**"!==r||!c.selector)||(p.splice(o,1),c.selector&&p.delegateCount--,f.remove&&f.remove.call(e,c));a&&!p.length&&(f.teardown&&!1!==f.teardown.call(e,h,v.handle)||ce.removeEvent(e,d,v.handle),delete u[d])}else for(d in u)ce.event.remove(e,d+t[l],n,r,!0);ce.isEmptyObject(u)&&_.remove(e,"handle events")}},dispatch:function(e){var t,n,r,i,o,a,s=new Array(arguments.length),u=ce.event.fix(e),l=(_.get(this,"events")||Object.create(null))[u.type]||[],c=ce.event.special[u.type]||{};for(s[0]=u,t=1;t<arguments.length;t++)s[t]=arguments[t];if(u.delegateTarget=this,!c.preDispatch||!1!==c.preDispatch.call(this,u)){a=ce.event.handlers.call(this,u,l),t=0;while((i=a[t++])&&!u.isPropagationStopped()){u.currentTarget=i.elem,n=0;while((o=i.handlers[n++])&&!u.isImmediatePropagationStopped())u.rnamespace&&!1!==o.namespace&&!u.rnamespace.test(o.namespace)||(u.handleObj=o,u.data=o.data,void 0!==(r=((ce.event.special[o.origType]||{}).handle||o.handler).apply(i.elem,s))&&!1===(u.result=r)&&(u.preventDefault(),u.stopPropagation()))}return c.postDispatch&&c.postDispatch.call(this,u),u.result}},handlers:function(e,t){var n,r,i,o,a,s=[],u=t.delegateCount,l=e.target;if(u&&l.nodeType&&!("click"===e.type&&1<=e.button))for(;l!==this;l=l.parentNode||this)if(1===l.nodeType&&("click"!==e.type||!0!==l.disabled)){for(o=[],a={},n=0;n<u;n++)void 0===a[i=(r=t[n]).selector+" "]&&(a[i]=r.needsContext?-1<ce(i,this).index(l):ce.find(i,this,null,[l]).length),a[i]&&o.push(r);o.length&&s.push({elem:l,handlers:o})}return l=this,u<t.length&&s.push({elem:l,handlers:t.slice(u)}),s},addProp:function(t,e){Object.defineProperty(ce.Event.prototype,t,{enumerable:!0,configurable:!0,get:v(e)?function(){if(this.originalEvent)return e(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[t]},set:function(e){Object.defineProperty(this,t,{enumerable:!0,configurable:!0,writable:!0,value:e})}})},fix:function(e){return e[ce.expando]?e:new ce.Event(e)},special:{load:{noBubble:!0},click:{setup:function(e){var t=this||e;return we.test(t.type)&&t.click&&fe(t,"input")&&He(t,"click",!0),!1},trigger:function(e){var t=this||e;return we.test(t.type)&&t.click&&fe(t,"input")&&He(t,"click"),!0},_default:function(e){var t=e.target;return we.test(t.type)&&t.click&&fe(t,"input")&&_.get(t,"click")||fe(t,"a")}},beforeunload:{postDispatch:function(e){void 0!==e.result&&e.originalEvent&&(e.originalEvent.returnValue=e.result)}}}},ce.removeEvent=function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n)},ce.Event=function(e,t){if(!(this instanceof ce.Event))return new ce.Event(e,t);e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||void 0===e.defaultPrevented&&!1===e.returnValue?Ne:qe,this.target=e.target&&3===e.target.nodeType?e.target.parentNode:e.target,this.currentTarget=e.currentTarget,this.relatedTarget=e.relatedTarget):this.type=e,t&&ce.extend(this,t),this.timeStamp=e&&e.timeStamp||Date.now(),this[ce.expando]=!0},ce.Event.prototype={constructor:ce.Event,isDefaultPrevented:qe,isPropagationStopped:qe,isImmediatePropagationStopped:qe,isSimulated:!1,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=Ne,e&&!this.isSimulated&&e.preventDefault()},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=Ne,e&&!this.isSimulated&&e.stopPropagation()},stopImmediatePropagation:function(){var e=this.originalEvent;this.isImmediatePropagationStopped=Ne,e&&!this.isSimulated&&e.stopImmediatePropagation(),this.stopPropagation()}},ce.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,"char":!0,code:!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:!0},ce.event.addProp),ce.each({focus:"focusin",blur:"focusout"},function(r,i){function o(e){if(C.documentMode){var t=_.get(this,"handle"),n=ce.event.fix(e);n.type="focusin"===e.type?"focus":"blur",n.isSimulated=!0,t(e),n.target===n.currentTarget&&t(n)}else ce.event.simulate(i,e.target,ce.event.fix(e))}ce.event.special[r]={setup:function(){var e;if(He(this,r,!0),!C.documentMode)return!1;(e=_.get(this,i))||this.addEventListener(i,o),_.set(this,i,(e||0)+1)},trigger:function(){return He(this,r),!0},teardown:function(){var e;if(!C.documentMode)return!1;(e=_.get(this,i)-1)?_.set(this,i,e):(this.removeEventListener(i,o),_.remove(this,i))},_default:function(e){return _.get(e.target,r)},delegateType:i},ce.event.special[i]={setup:function(){var e=this.ownerDocument||this.document||this,t=C.documentMode?this:e,n=_.get(t,i);n||(C.documentMode?this.addEventListener(i,o):e.addEventListener(r,o,!0)),_.set(t,i,(n||0)+1)},teardown:function(){var e=this.ownerDocument||this.document||this,t=C.documentMode?this:e,n=_.get(t,i)-1;n?_.set(t,i,n):(C.documentMode?this.removeEventListener(i,o):e.removeEventListener(r,o,!0),_.remove(t,i))}}}),ce.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(e,i){ce.event.special[e]={delegateType:i,bindType:i,handle:function(e){var t,n=e.relatedTarget,r=e.handleObj;return n&&(n===this||ce.contains(this,n))||(e.type=r.origType,t=r.handler.apply(this,arguments),e.type=i),t}}}),ce.fn.extend({on:function(e,t,n,r){return Le(this,e,t,n,r)},one:function(e,t,n,r){return Le(this,e,t,n,r,1)},off:function(e,t,n){var r,i;if(e&&e.preventDefault&&e.handleObj)return r=e.handleObj,ce(e.delegateTarget).off(r.namespace?r.origType+"."+r.namespace:r.origType,r.selector,r.handler),this;if("object"==typeof e){for(i in e)this.off(i,t,e[i]);return this}return!1!==t&&"function"!=typeof t||(n=t,t=void 0),!1===n&&(n=qe),this.each(function(){ce.event.remove(this,e,n,t)})}});var Oe=/<script|<style|<link/i,Pe=/checked\s*(?:[^=]|=\s*.checked.)/i,Me=/^\s*<!\[CDATA\[|\]\]>\s*$/g;function Re(e,t){return fe(e,"table")&&fe(11!==t.nodeType?t:t.firstChild,"tr")&&ce(e).children("tbody")[0]||e}function Ie(e){return e.type=(null!==e.getAttribute("type"))+"/"+e.type,e}function We(e){return"true/"===(e.type||"").slice(0,5)?e.type=e.type.slice(5):e.removeAttribute("type"),e}function Fe(e,t){var n,r,i,o,a,s;if(1===t.nodeType){if(_.hasData(e)&&(s=_.get(e).events))for(i in _.remove(t,"handle events"),s)for(n=0,r=s[i].length;n<r;n++)ce.event.add(t,i,s[i][n]);z.hasData(e)&&(o=z.access(e),a=ce.extend({},o),z.set(t,a))}}function $e(n,r,i,o){r=g(r);var e,t,a,s,u,l,c=0,f=n.length,p=f-1,d=r[0],h=v(d);if(h||1<f&&"string"==typeof d&&!le.checkClone&&Pe.test(d))return n.each(function(e){var t=n.eq(e);h&&(r[0]=d.call(this,e,t.html())),$e(t,r,i,o)});if(f&&(t=(e=Ae(r,n[0].ownerDocument,!1,n,o)).firstChild,1===e.childNodes.length&&(e=t),t||o)){for(s=(a=ce.map(Se(e,"script"),Ie)).length;c<f;c++)u=e,c!==p&&(u=ce.clone(u,!0,!0),s&&ce.merge(a,Se(u,"script"))),i.call(n[c],u,c);if(s)for(l=a[a.length-1].ownerDocument,ce.map(a,We),c=0;c<s;c++)u=a[c],Ce.test(u.type||"")&&!_.access(u,"globalEval")&&ce.contains(l,u)&&(u.src&&"module"!==(u.type||"").toLowerCase()?ce._evalUrl&&!u.noModule&&ce._evalUrl(u.src,{nonce:u.nonce||u.getAttribute("nonce")},l):m(u.textContent.replace(Me,""),u,l))}return n}function Be(e,t,n){for(var r,i=t?ce.filter(t,e):e,o=0;null!=(r=i[o]);o++)n||1!==r.nodeType||ce.cleanData(Se(r)),r.parentNode&&(n&&K(r)&&Ee(Se(r,"script")),r.parentNode.removeChild(r));return e}ce.extend({htmlPrefilter:function(e){return e},clone:function(e,t,n){var r,i,o,a,s,u,l,c=e.cloneNode(!0),f=K(e);if(!(le.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||ce.isXMLDoc(e)))for(a=Se(c),r=0,i=(o=Se(e)).length;r<i;r++)s=o[r],u=a[r],void 0,"input"===(l=u.nodeName.toLowerCase())&&we.test(s.type)?u.checked=s.checked:"input"!==l&&"textarea"!==l||(u.defaultValue=s.defaultValue);if(t)if(n)for(o=o||Se(e),a=a||Se(c),r=0,i=o.length;r<i;r++)Fe(o[r],a[r]);else Fe(e,c);return 0<(a=Se(c,"script")).length&&Ee(a,!f&&Se(e,"script")),c},cleanData:function(e){for(var t,n,r,i=ce.event.special,o=0;void 0!==(n=e[o]);o++)if($(n)){if(t=n[_.expando]){if(t.events)for(r in t.events)i[r]?ce.event.remove(n,r):ce.removeEvent(n,r,t.handle);n[_.expando]=void 0}n[z.expando]&&(n[z.expando]=void 0)}}}),ce.fn.extend({detach:function(e){return Be(this,e,!0)},remove:function(e){return Be(this,e)},text:function(e){return M(this,function(e){return void 0===e?ce.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=e)})},null,e,arguments.length)},append:function(){return $e(this,arguments,function(e){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||Re(this,e).appendChild(e)})},prepend:function(){return $e(this,arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=Re(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return $e(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return $e(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},empty:function(){for(var e,t=0;null!=(e=this[t]);t++)1===e.nodeType&&(ce.cleanData(Se(e,!1)),e.textContent="");return this},clone:function(e,t){return e=null!=e&&e,t=null==t?e:t,this.map(function(){return ce.clone(this,e,t)})},html:function(e){return M(this,function(e){var t=this[0]||{},n=0,r=this.length;if(void 0===e&&1===t.nodeType)return t.innerHTML;if("string"==typeof e&&!Oe.test(e)&&!ke[(Te.exec(e)||["",""])[1].toLowerCase()]){e=ce.htmlPrefilter(e);try{for(;n<r;n++)1===(t=this[n]||{}).nodeType&&(ce.cleanData(Se(t,!1)),t.innerHTML=e);t=0}catch(e){}}t&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var n=[];return $e(this,arguments,function(e){var t=this.parentNode;ce.inArray(this,n)<0&&(ce.cleanData(Se(this)),t&&t.replaceChild(e,this))},n)}}),ce.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,a){ce.fn[e]=function(e){for(var t,n=[],r=ce(e),i=r.length-1,o=0;o<=i;o++)t=o===i?this:this.clone(!0),ce(r[o])[a](t),s.apply(n,t.get());return this.pushStack(n)}});var _e=new RegExp("^("+G+")(?!px)[a-z%]+$","i"),ze=/^--/,Xe=function(e){var t=e.ownerDocument.defaultView;return t&&t.opener||(t=ie),t.getComputedStyle(e)},Ue=function(e,t,n){var r,i,o={};for(i in t)o[i]=e.style[i],e.style[i]=t[i];for(i in r=n.call(e),t)e.style[i]=o[i];return r},Ve=new RegExp(Q.join("|"),"i");function Ge(e,t,n){var r,i,o,a,s=ze.test(t),u=e.style;return(n=n||Xe(e))&&(a=n.getPropertyValue(t)||n[t],s&&a&&(a=a.replace(ve,"$1")||void 0),""!==a||K(e)||(a=ce.style(e,t)),!le.pixelBoxStyles()&&_e.test(a)&&Ve.test(t)&&(r=u.width,i=u.minWidth,o=u.maxWidth,u.minWidth=u.maxWidth=u.width=a,a=n.width,u.width=r,u.minWidth=i,u.maxWidth=o)),void 0!==a?a+"":a}function Ye(e,t){return{get:function(){if(!e())return(this.get=t).apply(this,arguments);delete this.get}}}!function(){function e(){if(l){u.style.cssText="position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",l.style.cssText="position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",J.appendChild(u).appendChild(l);var e=ie.getComputedStyle(l);n="1%"!==e.top,s=12===t(e.marginLeft),l.style.right="60%",o=36===t(e.right),r=36===t(e.width),l.style.position="absolute",i=12===t(l.offsetWidth/3),J.removeChild(u),l=null}}function t(e){return Math.round(parseFloat(e))}var n,r,i,o,a,s,u=C.createElement("div"),l=C.createElement("div");l.style&&(l.style.backgroundClip="content-box",l.cloneNode(!0).style.backgroundClip="",le.clearCloneStyle="content-box"===l.style.backgroundClip,ce.extend(le,{boxSizingReliable:function(){return e(),r},pixelBoxStyles:function(){return e(),o},pixelPosition:function(){return e(),n},reliableMarginLeft:function(){return e(),s},scrollboxSize:function(){return e(),i},reliableTrDimensions:function(){var e,t,n,r;return null==a&&(e=C.createElement("table"),t=C.createElement("tr"),n=C.createElement("div"),e.style.cssText="position:absolute;left:-11111px;border-collapse:separate",t.style.cssText="box-sizing:content-box;border:1px solid",t.style.height="1px",n.style.height="9px",n.style.display="block",J.appendChild(e).appendChild(t).appendChild(n),r=ie.getComputedStyle(t),a=parseInt(r.height,10)+parseInt(r.borderTopWidth,10)+parseInt(r.borderBottomWidth,10)===t.offsetHeight,J.removeChild(e)),a}}))}();var Qe=["Webkit","Moz","ms"],Je=C.createElement("div").style,Ke={};function Ze(e){var t=ce.cssProps[e]||Ke[e];return t||(e in Je?e:Ke[e]=function(e){var t=e[0].toUpperCase()+e.slice(1),n=Qe.length;while(n--)if((e=Qe[n]+t)in Je)return e}(e)||e)}var et=/^(none|table(?!-c[ea]).+)/,tt={position:"absolute",visibility:"hidden",display:"block"},nt={letterSpacing:"0",fontWeight:"400"};function rt(e,t,n){var r=Y.exec(t);return r?Math.max(0,r[2]-(n||0))+(r[3]||"px"):t}function it(e,t,n,r,i,o){var a="width"===t?1:0,s=0,u=0,l=0;if(n===(r?"border":"content"))return 0;for(;a<4;a+=2)"margin"===n&&(l+=ce.css(e,n+Q[a],!0,i)),r?("content"===n&&(u-=ce.css(e,"padding"+Q[a],!0,i)),"margin"!==n&&(u-=ce.css(e,"border"+Q[a]+"Width",!0,i))):(u+=ce.css(e,"padding"+Q[a],!0,i),"padding"!==n?u+=ce.css(e,"border"+Q[a]+"Width",!0,i):s+=ce.css(e,"border"+Q[a]+"Width",!0,i));return!r&&0<=o&&(u+=Math.max(0,Math.ceil(e["offset"+t[0].toUpperCase()+t.slice(1)]-o-u-s-.5))||0),u+l}function ot(e,t,n){var r=Xe(e),i=(!le.boxSizingReliable()||n)&&"border-box"===ce.css(e,"boxSizing",!1,r),o=i,a=Ge(e,t,r),s="offset"+t[0].toUpperCase()+t.slice(1);if(_e.test(a)){if(!n)return a;a="auto"}return(!le.boxSizingReliable()&&i||!le.reliableTrDimensions()&&fe(e,"tr")||"auto"===a||!parseFloat(a)&&"inline"===ce.css(e,"display",!1,r))&&e.getClientRects().length&&(i="border-box"===ce.css(e,"boxSizing",!1,r),(o=s in e)&&(a=e[s])),(a=parseFloat(a)||0)+it(e,t,n||(i?"border":"content"),o,r,a)+"px"}function at(e,t,n,r,i){return new at.prototype.init(e,t,n,r,i)}ce.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Ge(e,"opacity");return""===n?"1":n}}}},cssNumber:{animationIterationCount:!0,aspectRatio:!0,borderImageSlice:!0,columnCount:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,gridArea:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnStart:!0,gridRow:!0,gridRowEnd:!0,gridRowStart:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,scale:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeMiterlimit:!0,strokeOpacity:!0},cssProps:{},style:function(e,t,n,r){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var i,o,a,s=F(t),u=ze.test(t),l=e.style;if(u||(t=Ze(s)),a=ce.cssHooks[t]||ce.cssHooks[s],void 0===n)return a&&"get"in a&&void 0!==(i=a.get(e,!1,r))?i:l[t];"string"===(o=typeof n)&&(i=Y.exec(n))&&i[1]&&(n=te(e,t,i),o="number"),null!=n&&n==n&&("number"!==o||u||(n+=i&&i[3]||(ce.cssNumber[s]?"":"px")),le.clearCloneStyle||""!==n||0!==t.indexOf("background")||(l[t]="inherit"),a&&"set"in a&&void 0===(n=a.set(e,n,r))||(u?l.setProperty(t,n):l[t]=n))}},css:function(e,t,n,r){var i,o,a,s=F(t);return ze.test(t)||(t=Ze(s)),(a=ce.cssHooks[t]||ce.cssHooks[s])&&"get"in a&&(i=a.get(e,!0,n)),void 0===i&&(i=Ge(e,t,r)),"normal"===i&&t in nt&&(i=nt[t]),""===n||n?(o=parseFloat(i),!0===n||isFinite(o)?o||0:i):i}}),ce.each(["height","width"],function(e,u){ce.cssHooks[u]={get:function(e,t,n){if(t)return!et.test(ce.css(e,"display"))||e.getClientRects().length&&e.getBoundingClientRect().width?ot(e,u,n):Ue(e,tt,function(){return ot(e,u,n)})},set:function(e,t,n){var r,i=Xe(e),o=!le.scrollboxSize()&&"absolute"===i.position,a=(o||n)&&"border-box"===ce.css(e,"boxSizing",!1,i),s=n?it(e,u,n,a,i):0;return a&&o&&(s-=Math.ceil(e["offset"+u[0].toUpperCase()+u.slice(1)]-parseFloat(i[u])-it(e,u,"border",!1,i)-.5)),s&&(r=Y.exec(t))&&"px"!==(r[3]||"px")&&(e.style[u]=t,t=ce.css(e,u)),rt(0,t,s)}}}),ce.cssHooks.marginLeft=Ye(le.reliableMarginLeft,function(e,t){if(t)return(parseFloat(Ge(e,"marginLeft"))||e.getBoundingClientRect().left-Ue(e,{marginLeft:0},function(){return e.getBoundingClientRect().left}))+"px"}),ce.each({margin:"",padding:"",border:"Width"},function(i,o){ce.cssHooks[i+o]={expand:function(e){for(var t=0,n={},r="string"==typeof e?e.split(" "):[e];t<4;t++)n[i+Q[t]+o]=r[t]||r[t-2]||r[0];return n}},"margin"!==i&&(ce.cssHooks[i+o].set=rt)}),ce.fn.extend({css:function(e,t){return M(this,function(e,t,n){var r,i,o={},a=0;if(Array.isArray(t)){for(r=Xe(e),i=t.length;a<i;a++)o[t[a]]=ce.css(e,t[a],!1,r);return o}return void 0!==n?ce.style(e,t,n):ce.css(e,t)},e,t,1<arguments.length)}}),((ce.Tween=at).prototype={constructor:at,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||ce.easing._default,this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(ce.cssNumber[n]?"":"px")},cur:function(){var e=at.propHooks[this.prop];return e&&e.get?e.get(this):at.propHooks._default.get(this)},run:function(e){var t,n=at.propHooks[this.prop];return this.options.duration?this.pos=t=ce.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):this.pos=t=e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):at.propHooks._default.set(this),this}}).init.prototype=at.prototype,(at.propHooks={_default:{get:function(e){var t;return 1!==e.elem.nodeType||null!=e.elem[e.prop]&&null==e.elem.style[e.prop]?e.elem[e.prop]:(t=ce.css(e.elem,e.prop,""))&&"auto"!==t?t:0},set:function(e){ce.fx.step[e.prop]?ce.fx.step[e.prop](e):1!==e.elem.nodeType||!ce.cssHooks[e.prop]&&null==e.elem.style[Ze(e.prop)]?e.elem[e.prop]=e.now:ce.style(e.elem,e.prop,e.now+e.unit)}}}).scrollTop=at.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},ce.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2},_default:"swing"},ce.fx=at.prototype.init,ce.fx.step={};var st,ut,lt,ct,ft=/^(?:toggle|show|hide)$/,pt=/queueHooks$/;function dt(){ut&&(!1===C.hidden&&ie.requestAnimationFrame?ie.requestAnimationFrame(dt):ie.setTimeout(dt,ce.fx.interval),ce.fx.tick())}function ht(){return ie.setTimeout(function(){st=void 0}),st=Date.now()}function gt(e,t){var n,r=0,i={height:e};for(t=t?1:0;r<4;r+=2-t)i["margin"+(n=Q[r])]=i["padding"+n]=e;return t&&(i.opacity=i.width=e),i}function vt(e,t,n){for(var r,i=(yt.tweeners[t]||[]).concat(yt.tweeners["*"]),o=0,a=i.length;o<a;o++)if(r=i[o].call(n,t,e))return r}function yt(o,e,t){var n,a,r=0,i=yt.prefilters.length,s=ce.Deferred().always(function(){delete u.elem}),u=function(){if(a)return!1;for(var e=st||ht(),t=Math.max(0,l.startTime+l.duration-e),n=1-(t/l.duration||0),r=0,i=l.tweens.length;r<i;r++)l.tweens[r].run(n);return s.notifyWith(o,[l,n,t]),n<1&&i?t:(i||s.notifyWith(o,[l,1,0]),s.resolveWith(o,[l]),!1)},l=s.promise({elem:o,props:ce.extend({},e),opts:ce.extend(!0,{specialEasing:{},easing:ce.easing._default},t),originalProperties:e,originalOptions:t,startTime:st||ht(),duration:t.duration,tweens:[],createTween:function(e,t){var n=ce.Tween(o,l.opts,e,t,l.opts.specialEasing[e]||l.opts.easing);return l.tweens.push(n),n},stop:function(e){var t=0,n=e?l.tweens.length:0;if(a)return this;for(a=!0;t<n;t++)l.tweens[t].run(1);return e?(s.notifyWith(o,[l,1,0]),s.resolveWith(o,[l,e])):s.rejectWith(o,[l,e]),this}}),c=l.props;for(!function(e,t){var n,r,i,o,a;for(n in e)if(i=t[r=F(n)],o=e[n],Array.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),(a=ce.cssHooks[r])&&"expand"in a)for(n in o=a.expand(o),delete e[r],o)n in e||(e[n]=o[n],t[n]=i);else t[r]=i}(c,l.opts.specialEasing);r<i;r++)if(n=yt.prefilters[r].call(l,o,c,l.opts))return v(n.stop)&&(ce._queueHooks(l.elem,l.opts.queue).stop=n.stop.bind(n)),n;return ce.map(c,vt,l),v(l.opts.start)&&l.opts.start.call(o,l),l.progress(l.opts.progress).done(l.opts.done,l.opts.complete).fail(l.opts.fail).always(l.opts.always),ce.fx.timer(ce.extend(u,{elem:o,anim:l,queue:l.opts.queue})),l}ce.Animation=ce.extend(yt,{tweeners:{"*":[function(e,t){var n=this.createTween(e,t);return te(n.elem,e,Y.exec(t),n),n}]},tweener:function(e,t){v(e)?(t=e,e=["*"]):e=e.match(D);for(var n,r=0,i=e.length;r<i;r++)n=e[r],yt.tweeners[n]=yt.tweeners[n]||[],yt.tweeners[n].unshift(t)},prefilters:[function(e,t,n){var r,i,o,a,s,u,l,c,f="width"in t||"height"in t,p=this,d={},h=e.style,g=e.nodeType&&ee(e),v=_.get(e,"fxshow");for(r in n.queue||(null==(a=ce._queueHooks(e,"fx")).unqueued&&(a.unqueued=0,s=a.empty.fire,a.empty.fire=function(){a.unqueued||s()}),a.unqueued++,p.always(function(){p.always(function(){a.unqueued--,ce.queue(e,"fx").length||a.empty.fire()})})),t)if(i=t[r],ft.test(i)){if(delete t[r],o=o||"toggle"===i,i===(g?"hide":"show")){if("show"!==i||!v||void 0===v[r])continue;g=!0}d[r]=v&&v[r]||ce.style(e,r)}if((u=!ce.isEmptyObject(t))||!ce.isEmptyObject(d))for(r in f&&1===e.nodeType&&(n.overflow=[h.overflow,h.overflowX,h.overflowY],null==(l=v&&v.display)&&(l=_.get(e,"display")),"none"===(c=ce.css(e,"display"))&&(l?c=l:(re([e],!0),l=e.style.display||l,c=ce.css(e,"display"),re([e]))),("inline"===c||"inline-block"===c&&null!=l)&&"none"===ce.css(e,"float")&&(u||(p.done(function(){h.display=l}),null==l&&(c=h.display,l="none"===c?"":c)),h.display="inline-block")),n.overflow&&(h.overflow="hidden",p.always(function(){h.overflow=n.overflow[0],h.overflowX=n.overflow[1],h.overflowY=n.overflow[2]})),u=!1,d)u||(v?"hidden"in v&&(g=v.hidden):v=_.access(e,"fxshow",{display:l}),o&&(v.hidden=!g),g&&re([e],!0),p.done(function(){for(r in g||re([e]),_.remove(e,"fxshow"),d)ce.style(e,r,d[r])})),u=vt(g?v[r]:0,r,p),r in v||(v[r]=u.start,g&&(u.end=u.start,u.start=0))}],prefilter:function(e,t){t?yt.prefilters.unshift(e):yt.prefilters.push(e)}}),ce.speed=function(e,t,n){var r=e&&"object"==typeof e?ce.extend({},e):{complete:n||!n&&t||v(e)&&e,duration:e,easing:n&&t||t&&!v(t)&&t};return ce.fx.off?r.duration=0:"number"!=typeof r.duration&&(r.duration in ce.fx.speeds?r.duration=ce.fx.speeds[r.duration]:r.duration=ce.fx.speeds._default),null!=r.queue&&!0!==r.queue||(r.queue="fx"),r.old=r.complete,r.complete=function(){v(r.old)&&r.old.call(this),r.queue&&ce.dequeue(this,r.queue)},r},ce.fn.extend({fadeTo:function(e,t,n,r){return this.filter(ee).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(t,e,n,r){var i=ce.isEmptyObject(t),o=ce.speed(e,n,r),a=function(){var e=yt(this,ce.extend({},t),o);(i||_.get(this,"finish"))&&e.stop(!0)};return a.finish=a,i||!1===o.queue?this.each(a):this.queue(o.queue,a)},stop:function(i,e,o){var a=function(e){var t=e.stop;delete e.stop,t(o)};return"string"!=typeof i&&(o=e,e=i,i=void 0),e&&this.queue(i||"fx",[]),this.each(function(){var e=!0,t=null!=i&&i+"queueHooks",n=ce.timers,r=_.get(this);if(t)r[t]&&r[t].stop&&a(r[t]);else for(t in r)r[t]&&r[t].stop&&pt.test(t)&&a(r[t]);for(t=n.length;t--;)n[t].elem!==this||null!=i&&n[t].queue!==i||(n[t].anim.stop(o),e=!1,n.splice(t,1));!e&&o||ce.dequeue(this,i)})},finish:function(a){return!1!==a&&(a=a||"fx"),this.each(function(){var e,t=_.get(this),n=t[a+"queue"],r=t[a+"queueHooks"],i=ce.timers,o=n?n.length:0;for(t.finish=!0,ce.queue(this,a,[]),r&&r.stop&&r.stop.call(this,!0),e=i.length;e--;)i[e].elem===this&&i[e].queue===a&&(i[e].anim.stop(!0),i.splice(e,1));for(e=0;e<o;e++)n[e]&&n[e].finish&&n[e].finish.call(this);delete t.finish})}}),ce.each(["toggle","show","hide"],function(e,r){var i=ce.fn[r];ce.fn[r]=function(e,t,n){return null==e||"boolean"==typeof e?i.apply(this,arguments):this.animate(gt(r,!0),e,t,n)}}),ce.each({slideDown:gt("show"),slideUp:gt("hide"),slideToggle:gt("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,r){ce.fn[e]=function(e,t,n){return this.animate(r,e,t,n)}}),ce.timers=[],ce.fx.tick=function(){var e,t=0,n=ce.timers;for(st=Date.now();t<n.length;t++)(e=n[t])()||n[t]!==e||n.splice(t--,1);n.length||ce.fx.stop(),st=void 0},ce.fx.timer=function(e){ce.timers.push(e),ce.fx.start()},ce.fx.interval=13,ce.fx.start=function(){ut||(ut=!0,dt())},ce.fx.stop=function(){ut=null},ce.fx.speeds={slow:600,fast:200,_default:400},ce.fn.delay=function(r,e){return r=ce.fx&&ce.fx.speeds[r]||r,e=e||"fx",this.queue(e,function(e,t){var n=ie.setTimeout(e,r);t.stop=function(){ie.clearTimeout(n)}})},lt=C.createElement("input"),ct=C.createElement("select").appendChild(C.createElement("option")),lt.type="checkbox",le.checkOn=""!==lt.value,le.optSelected=ct.selected,(lt=C.createElement("input")).value="t",lt.type="radio",le.radioValue="t"===lt.value;var mt,xt=ce.expr.attrHandle;ce.fn.extend({attr:function(e,t){return M(this,ce.attr,e,t,1<arguments.length)},removeAttr:function(e){return this.each(function(){ce.removeAttr(this,e)})}}),ce.extend({attr:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return"undefined"==typeof e.getAttribute?ce.prop(e,t,n):(1===o&&ce.isXMLDoc(e)||(i=ce.attrHooks[t.toLowerCase()]||(ce.expr.match.bool.test(t)?mt:void 0)),void 0!==n?null===n?void ce.removeAttr(e,t):i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:(e.setAttribute(t,n+""),n):i&&"get"in i&&null!==(r=i.get(e,t))?r:null==(r=ce.find.attr(e,t))?void 0:r)},attrHooks:{type:{set:function(e,t){if(!le.radioValue&&"radio"===t&&fe(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},removeAttr:function(e,t){var n,r=0,i=t&&t.match(D);if(i&&1===e.nodeType)while(n=i[r++])e.removeAttribute(n)}}),mt={set:function(e,t,n){return!1===t?ce.removeAttr(e,n):e.setAttribute(n,n),n}},ce.each(ce.expr.match.bool.source.match(/\w+/g),function(e,t){var a=xt[t]||ce.find.attr;xt[t]=function(e,t,n){var r,i,o=t.toLowerCase();return n||(i=xt[o],xt[o]=r,r=null!=a(e,t,n)?o:null,xt[o]=i),r}});var bt=/^(?:input|select|textarea|button)$/i,wt=/^(?:a|area)$/i;function Tt(e){return(e.match(D)||[]).join(" ")}function Ct(e){return e.getAttribute&&e.getAttribute("class")||""}function kt(e){return Array.isArray(e)?e:"string"==typeof e&&e.match(D)||[]}ce.fn.extend({prop:function(e,t){return M(this,ce.prop,e,t,1<arguments.length)},removeProp:function(e){return this.each(function(){delete this[ce.propFix[e]||e]})}}),ce.extend({prop:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return 1===o&&ce.isXMLDoc(e)||(t=ce.propFix[t]||t,i=ce.propHooks[t]),void 0!==n?i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:e[t]=n:i&&"get"in i&&null!==(r=i.get(e,t))?r:e[t]},propHooks:{tabIndex:{get:function(e){var t=ce.find.attr(e,"tabindex");return t?parseInt(t,10):bt.test(e.nodeName)||wt.test(e.nodeName)&&e.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),le.optSelected||(ce.propHooks.selected={get:function(e){var t=e.parentNode;return t&&t.parentNode&&t.parentNode.selectedIndex,null},set:function(e){var t=e.parentNode;t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex)}}),ce.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){ce.propFix[this.toLowerCase()]=this}),ce.fn.extend({addClass:function(t){var e,n,r,i,o,a;return v(t)?this.each(function(e){ce(this).addClass(t.call(this,e,Ct(this)))}):(e=kt(t)).length?this.each(function(){if(r=Ct(this),n=1===this.nodeType&&" "+Tt(r)+" "){for(o=0;o<e.length;o++)i=e[o],n.indexOf(" "+i+" ")<0&&(n+=i+" ");a=Tt(n),r!==a&&this.setAttribute("class",a)}}):this},removeClass:function(t){var e,n,r,i,o,a;return v(t)?this.each(function(e){ce(this).removeClass(t.call(this,e,Ct(this)))}):arguments.length?(e=kt(t)).length?this.each(function(){if(r=Ct(this),n=1===this.nodeType&&" "+Tt(r)+" "){for(o=0;o<e.length;o++){i=e[o];while(-1<n.indexOf(" "+i+" "))n=n.replace(" "+i+" "," ")}a=Tt(n),r!==a&&this.setAttribute("class",a)}}):this:this.attr("class","")},toggleClass:function(t,n){var e,r,i,o,a=typeof t,s="string"===a||Array.isArray(t);return v(t)?this.each(function(e){ce(this).toggleClass(t.call(this,e,Ct(this),n),n)}):"boolean"==typeof n&&s?n?this.addClass(t):this.removeClass(t):(e=kt(t),this.each(function(){if(s)for(o=ce(this),i=0;i<e.length;i++)r=e[i],o.hasClass(r)?o.removeClass(r):o.addClass(r);else void 0!==t&&"boolean"!==a||((r=Ct(this))&&_.set(this,"__className__",r),this.setAttribute&&this.setAttribute("class",r||!1===t?"":_.get(this,"__className__")||""))}))},hasClass:function(e){var t,n,r=0;t=" "+e+" ";while(n=this[r++])if(1===n.nodeType&&-1<(" "+Tt(Ct(n))+" ").indexOf(t))return!0;return!1}});var St=/\r/g;ce.fn.extend({val:function(n){var r,e,i,t=this[0];return arguments.length?(i=v(n),this.each(function(e){var t;1===this.nodeType&&(null==(t=i?n.call(this,e,ce(this).val()):n)?t="":"number"==typeof t?t+="":Array.isArray(t)&&(t=ce.map(t,function(e){return null==e?"":e+""})),(r=ce.valHooks[this.type]||ce.valHooks[this.nodeName.toLowerCase()])&&"set"in r&&void 0!==r.set(this,t,"value")||(this.value=t))})):t?(r=ce.valHooks[t.type]||ce.valHooks[t.nodeName.toLowerCase()])&&"get"in r&&void 0!==(e=r.get(t,"value"))?e:"string"==typeof(e=t.value)?e.replace(St,""):null==e?"":e:void 0}}),ce.extend({valHooks:{option:{get:function(e){var t=ce.find.attr(e,"value");return null!=t?t:Tt(ce.text(e))}},select:{get:function(e){var t,n,r,i=e.options,o=e.selectedIndex,a="select-one"===e.type,s=a?null:[],u=a?o+1:i.length;for(r=o<0?u:a?o:0;r<u;r++)if(((n=i[r]).selected||r===o)&&!n.disabled&&(!n.parentNode.disabled||!fe(n.parentNode,"optgroup"))){if(t=ce(n).val(),a)return t;s.push(t)}return s},set:function(e,t){var n,r,i=e.options,o=ce.makeArray(t),a=i.length;while(a--)((r=i[a]).selected=-1<ce.inArray(ce.valHooks.option.get(r),o))&&(n=!0);return n||(e.selectedIndex=-1),o}}}}),ce.each(["radio","checkbox"],function(){ce.valHooks[this]={set:function(e,t){if(Array.isArray(t))return e.checked=-1<ce.inArray(ce(e).val(),t)}},le.checkOn||(ce.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})});var Et=ie.location,jt={guid:Date.now()},At=/\?/;ce.parseXML=function(e){var t,n;if(!e||"string"!=typeof e)return null;try{t=(new ie.DOMParser).parseFromString(e,"text/xml")}catch(e){}return n=t&&t.getElementsByTagName("parsererror")[0],t&&!n||ce.error("Invalid XML: "+(n?ce.map(n.childNodes,function(e){return e.textContent}).join("\n"):e)),t};var Dt=/^(?:focusinfocus|focusoutblur)$/,Nt=function(e){e.stopPropagation()};ce.extend(ce.event,{trigger:function(e,t,n,r){var i,o,a,s,u,l,c,f,p=[n||C],d=ue.call(e,"type")?e.type:e,h=ue.call(e,"namespace")?e.namespace.split("."):[];if(o=f=a=n=n||C,3!==n.nodeType&&8!==n.nodeType&&!Dt.test(d+ce.event.triggered)&&(-1<d.indexOf(".")&&(d=(h=d.split(".")).shift(),h.sort()),u=d.indexOf(":")<0&&"on"+d,(e=e[ce.expando]?e:new ce.Event(d,"object"==typeof e&&e)).isTrigger=r?2:3,e.namespace=h.join("."),e.rnamespace=e.namespace?new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,e.result=void 0,e.target||(e.target=n),t=null==t?[e]:ce.makeArray(t,[e]),c=ce.event.special[d]||{},r||!c.trigger||!1!==c.trigger.apply(n,t))){if(!r&&!c.noBubble&&!y(n)){for(s=c.delegateType||d,Dt.test(s+d)||(o=o.parentNode);o;o=o.parentNode)p.push(o),a=o;a===(n.ownerDocument||C)&&p.push(a.defaultView||a.parentWindow||ie)}i=0;while((o=p[i++])&&!e.isPropagationStopped())f=o,e.type=1<i?s:c.bindType||d,(l=(_.get(o,"events")||Object.create(null))[e.type]&&_.get(o,"handle"))&&l.apply(o,t),(l=u&&o[u])&&l.apply&&$(o)&&(e.result=l.apply(o,t),!1===e.result&&e.preventDefault());return e.type=d,r||e.isDefaultPrevented()||c._default&&!1!==c._default.apply(p.pop(),t)||!$(n)||u&&v(n[d])&&!y(n)&&((a=n[u])&&(n[u]=null),ce.event.triggered=d,e.isPropagationStopped()&&f.addEventListener(d,Nt),n[d](),e.isPropagationStopped()&&f.removeEventListener(d,Nt),ce.event.triggered=void 0,a&&(n[u]=a)),e.result}},simulate:function(e,t,n){var r=ce.extend(new ce.Event,n,{type:e,isSimulated:!0});ce.event.trigger(r,null,t)}}),ce.fn.extend({trigger:function(e,t){return this.each(function(){ce.event.trigger(e,t,this)})},triggerHandler:function(e,t){var n=this[0];if(n)return ce.event.trigger(e,t,n,!0)}});var qt=/\[\]$/,Lt=/\r?\n/g,Ht=/^(?:submit|button|image|reset|file)$/i,Ot=/^(?:input|select|textarea|keygen)/i;function Pt(n,e,r,i){var t;if(Array.isArray(e))ce.each(e,function(e,t){r||qt.test(n)?i(n,t):Pt(n+"["+("object"==typeof t&&null!=t?e:"")+"]",t,r,i)});else if(r||"object"!==x(e))i(n,e);else for(t in e)Pt(n+"["+t+"]",e[t],r,i)}ce.param=function(e,t){var n,r=[],i=function(e,t){var n=v(t)?t():t;r[r.length]=encodeURIComponent(e)+"="+encodeURIComponent(null==n?"":n)};if(null==e)return"";if(Array.isArray(e)||e.jquery&&!ce.isPlainObject(e))ce.each(e,function(){i(this.name,this.value)});else for(n in e)Pt(n,e[n],t,i);return r.join("&")},ce.fn.extend({serialize:function(){return ce.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=ce.prop(this,"elements");return e?ce.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!ce(this).is(":disabled")&&Ot.test(this.nodeName)&&!Ht.test(e)&&(this.checked||!we.test(e))}).map(function(e,t){var n=ce(this).val();return null==n?null:Array.isArray(n)?ce.map(n,function(e){return{name:t.name,value:e.replace(Lt,"\r\n")}}):{name:t.name,value:n.replace(Lt,"\r\n")}}).get()}});var Mt=/%20/g,Rt=/#.*$/,It=/([?&])_=[^&]*/,Wt=/^(.*?):[ \t]*([^\r\n]*)$/gm,Ft=/^(?:GET|HEAD)$/,$t=/^\/\//,Bt={},_t={},zt="*/".concat("*"),Xt=C.createElement("a");function Ut(o){return function(e,t){"string"!=typeof e&&(t=e,e="*");var n,r=0,i=e.toLowerCase().match(D)||[];if(v(t))while(n=i[r++])"+"===n[0]?(n=n.slice(1)||"*",(o[n]=o[n]||[]).unshift(t)):(o[n]=o[n]||[]).push(t)}}function Vt(t,i,o,a){var s={},u=t===_t;function l(e){var r;return s[e]=!0,ce.each(t[e]||[],function(e,t){var n=t(i,o,a);return"string"!=typeof n||u||s[n]?u?!(r=n):void 0:(i.dataTypes.unshift(n),l(n),!1)}),r}return l(i.dataTypes[0])||!s["*"]&&l("*")}function Gt(e,t){var n,r,i=ce.ajaxSettings.flatOptions||{};for(n in t)void 0!==t[n]&&((i[n]?e:r||(r={}))[n]=t[n]);return r&&ce.extend(!0,e,r),e}Xt.href=Et.href,ce.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:Et.href,type:"GET",isLocal:/^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(Et.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":zt,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":ce.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?Gt(Gt(e,ce.ajaxSettings),t):Gt(ce.ajaxSettings,e)},ajaxPrefilter:Ut(Bt),ajaxTransport:Ut(_t),ajax:function(e,t){"object"==typeof e&&(t=e,e=void 0),t=t||{};var c,f,p,n,d,r,h,g,i,o,v=ce.ajaxSetup({},t),y=v.context||v,m=v.context&&(y.nodeType||y.jquery)?ce(y):ce.event,x=ce.Deferred(),b=ce.Callbacks("once memory"),w=v.statusCode||{},a={},s={},u="canceled",T={readyState:0,getResponseHeader:function(e){var t;if(h){if(!n){n={};while(t=Wt.exec(p))n[t[1].toLowerCase()+" "]=(n[t[1].toLowerCase()+" "]||[]).concat(t[2])}t=n[e.toLowerCase()+" "]}return null==t?null:t.join(", ")},getAllResponseHeaders:function(){return h?p:null},setRequestHeader:function(e,t){return null==h&&(e=s[e.toLowerCase()]=s[e.toLowerCase()]||e,a[e]=t),this},overrideMimeType:function(e){return null==h&&(v.mimeType=e),this},statusCode:function(e){var t;if(e)if(h)T.always(e[T.status]);else for(t in e)w[t]=[w[t],e[t]];return this},abort:function(e){var t=e||u;return c&&c.abort(t),l(0,t),this}};if(x.promise(T),v.url=((e||v.url||Et.href)+"").replace($t,Et.protocol+"//"),v.type=t.method||t.type||v.method||v.type,v.dataTypes=(v.dataType||"*").toLowerCase().match(D)||[""],null==v.crossDomain){r=C.createElement("a");try{r.href=v.url,r.href=r.href,v.crossDomain=Xt.protocol+"//"+Xt.host!=r.protocol+"//"+r.host}catch(e){v.crossDomain=!0}}if(v.data&&v.processData&&"string"!=typeof v.data&&(v.data=ce.param(v.data,v.traditional)),Vt(Bt,v,t,T),h)return T;for(i in(g=ce.event&&v.global)&&0==ce.active++&&ce.event.trigger("ajaxStart"),v.type=v.type.toUpperCase(),v.hasContent=!Ft.test(v.type),f=v.url.replace(Rt,""),v.hasContent?v.data&&v.processData&&0===(v.contentType||"").indexOf("application/x-www-form-urlencoded")&&(v.data=v.data.replace(Mt,"+")):(o=v.url.slice(f.length),v.data&&(v.processData||"string"==typeof v.data)&&(f+=(At.test(f)?"&":"?")+v.data,delete v.data),!1===v.cache&&(f=f.replace(It,"$1"),o=(At.test(f)?"&":"?")+"_="+jt.guid+++o),v.url=f+o),v.ifModified&&(ce.lastModified[f]&&T.setRequestHeader("If-Modified-Since",ce.lastModified[f]),ce.etag[f]&&T.setRequestHeader("If-None-Match",ce.etag[f])),(v.data&&v.hasContent&&!1!==v.contentType||t.contentType)&&T.setRequestHeader("Content-Type",v.contentType),T.setRequestHeader("Accept",v.dataTypes[0]&&v.accepts[v.dataTypes[0]]?v.accepts[v.dataTypes[0]]+("*"!==v.dataTypes[0]?", "+zt+"; q=0.01":""):v.accepts["*"]),v.headers)T.setRequestHeader(i,v.headers[i]);if(v.beforeSend&&(!1===v.beforeSend.call(y,T,v)||h))return T.abort();if(u="abort",b.add(v.complete),T.done(v.success),T.fail(v.error),c=Vt(_t,v,t,T)){if(T.readyState=1,g&&m.trigger("ajaxSend",[T,v]),h)return T;v.async&&0<v.timeout&&(d=ie.setTimeout(function(){T.abort("timeout")},v.timeout));try{h=!1,c.send(a,l)}catch(e){if(h)throw e;l(-1,e)}}else l(-1,"No Transport");function l(e,t,n,r){var i,o,a,s,u,l=t;h||(h=!0,d&&ie.clearTimeout(d),c=void 0,p=r||"",T.readyState=0<e?4:0,i=200<=e&&e<300||304===e,n&&(s=function(e,t,n){var r,i,o,a,s=e.contents,u=e.dataTypes;while("*"===u[0])u.shift(),void 0===r&&(r=e.mimeType||t.getResponseHeader("Content-Type"));if(r)for(i in s)if(s[i]&&s[i].test(r)){u.unshift(i);break}if(u[0]in n)o=u[0];else{for(i in n){if(!u[0]||e.converters[i+" "+u[0]]){o=i;break}a||(a=i)}o=o||a}if(o)return o!==u[0]&&u.unshift(o),n[o]}(v,T,n)),!i&&-1<ce.inArray("script",v.dataTypes)&&ce.inArray("json",v.dataTypes)<0&&(v.converters["text script"]=function(){}),s=function(e,t,n,r){var i,o,a,s,u,l={},c=e.dataTypes.slice();if(c[1])for(a in e.converters)l[a.toLowerCase()]=e.converters[a];o=c.shift();while(o)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!u&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),u=o,o=c.shift())if("*"===o)o=u;else if("*"!==u&&u!==o){if(!(a=l[u+" "+o]||l["* "+o]))for(i in l)if((s=i.split(" "))[1]===o&&(a=l[u+" "+s[0]]||l["* "+s[0]])){!0===a?a=l[i]:!0!==l[i]&&(o=s[0],c.unshift(s[1]));break}if(!0!==a)if(a&&e["throws"])t=a(t);else try{t=a(t)}catch(e){return{state:"parsererror",error:a?e:"No conversion from "+u+" to "+o}}}return{state:"success",data:t}}(v,s,T,i),i?(v.ifModified&&((u=T.getResponseHeader("Last-Modified"))&&(ce.lastModified[f]=u),(u=T.getResponseHeader("etag"))&&(ce.etag[f]=u)),204===e||"HEAD"===v.type?l="nocontent":304===e?l="notmodified":(l=s.state,o=s.data,i=!(a=s.error))):(a=l,!e&&l||(l="error",e<0&&(e=0))),T.status=e,T.statusText=(t||l)+"",i?x.resolveWith(y,[o,l,T]):x.rejectWith(y,[T,l,a]),T.statusCode(w),w=void 0,g&&m.trigger(i?"ajaxSuccess":"ajaxError",[T,v,i?o:a]),b.fireWith(y,[T,l]),g&&(m.trigger("ajaxComplete",[T,v]),--ce.active||ce.event.trigger("ajaxStop")))}return T},getJSON:function(e,t,n){return ce.get(e,t,n,"json")},getScript:function(e,t){return ce.get(e,void 0,t,"script")}}),ce.each(["get","post"],function(e,i){ce[i]=function(e,t,n,r){return v(t)&&(r=r||n,n=t,t=void 0),ce.ajax(ce.extend({url:e,type:i,dataType:r,data:t,success:n},ce.isPlainObject(e)&&e))}}),ce.ajaxPrefilter(function(e){var t;for(t in e.headers)"content-type"===t.toLowerCase()&&(e.contentType=e.headers[t]||"")}),ce._evalUrl=function(e,t,n){return ce.ajax({url:e,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,converters:{"text script":function(){}},dataFilter:function(e){ce.globalEval(e,t,n)}})},ce.fn.extend({wrapAll:function(e){var t;return this[0]&&(v(e)&&(e=e.call(this[0])),t=ce(e,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstElementChild)e=e.firstElementChild;return e}).append(this)),this},wrapInner:function(n){return v(n)?this.each(function(e){ce(this).wrapInner(n.call(this,e))}):this.each(function(){var e=ce(this),t=e.contents();t.length?t.wrapAll(n):e.append(n)})},wrap:function(t){var n=v(t);return this.each(function(e){ce(this).wrapAll(n?t.call(this,e):t)})},unwrap:function(e){return this.parent(e).not("body").each(function(){ce(this).replaceWith(this.childNodes)}),this}}),ce.expr.pseudos.hidden=function(e){return!ce.expr.pseudos.visible(e)},ce.expr.pseudos.visible=function(e){return!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length)},ce.ajaxSettings.xhr=function(){try{return new ie.XMLHttpRequest}catch(e){}};var Yt={0:200,1223:204},Qt=ce.ajaxSettings.xhr();le.cors=!!Qt&&"withCredentials"in Qt,le.ajax=Qt=!!Qt,ce.ajaxTransport(function(i){var o,a;if(le.cors||Qt&&!i.crossDomain)return{send:function(e,t){var n,r=i.xhr();if(r.open(i.type,i.url,i.async,i.username,i.password),i.xhrFields)for(n in i.xhrFields)r[n]=i.xhrFields[n];for(n in i.mimeType&&r.overrideMimeType&&r.overrideMimeType(i.mimeType),i.crossDomain||e["X-Requested-With"]||(e["X-Requested-With"]="XMLHttpRequest"),e)r.setRequestHeader(n,e[n]);o=function(e){return function(){o&&(o=a=r.onload=r.onerror=r.onabort=r.ontimeout=r.onreadystatechange=null,"abort"===e?r.abort():"error"===e?"number"!=typeof r.status?t(0,"error"):t(r.status,r.statusText):t(Yt[r.status]||r.status,r.statusText,"text"!==(r.responseType||"text")||"string"!=typeof r.responseText?{binary:r.response}:{text:r.responseText},r.getAllResponseHeaders()))}},r.onload=o(),a=r.onerror=r.ontimeout=o("error"),void 0!==r.onabort?r.onabort=a:r.onreadystatechange=function(){4===r.readyState&&ie.setTimeout(function(){o&&a()})},o=o("abort");try{r.send(i.hasContent&&i.data||null)}catch(e){if(o)throw e}},abort:function(){o&&o()}}}),ce.ajaxPrefilter(function(e){e.crossDomain&&(e.contents.script=!1)}),ce.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(e){return ce.globalEval(e),e}}}),ce.ajaxPrefilter("script",function(e){void 0===e.cache&&(e.cache=!1),e.crossDomain&&(e.type="GET")}),ce.ajaxTransport("script",function(n){var r,i;if(n.crossDomain||n.scriptAttrs)return{send:function(e,t){r=ce("<script>").attr(n.scriptAttrs||{}).prop({charset:n.scriptCharset,src:n.url}).on("load error",i=function(e){r.remove(),i=null,e&&t("error"===e.type?404:200,e.type)}),C.head.appendChild(r[0])},abort:function(){i&&i()}}});var Jt,Kt=[],Zt=/(=)\?(?=&|$)|\?\?/;ce.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Kt.pop()||ce.expando+"_"+jt.guid++;return this[e]=!0,e}}),ce.ajaxPrefilter("json jsonp",function(e,t,n){var r,i,o,a=!1!==e.jsonp&&(Zt.test(e.url)?"url":"string"==typeof e.data&&0===(e.contentType||"").indexOf("application/x-www-form-urlencoded")&&Zt.test(e.data)&&"data");if(a||"jsonp"===e.dataTypes[0])return r=e.jsonpCallback=v(e.jsonpCallback)?e.jsonpCallback():e.jsonpCallback,a?e[a]=e[a].replace(Zt,"$1"+r):!1!==e.jsonp&&(e.url+=(At.test(e.url)?"&":"?")+e.jsonp+"="+r),e.converters["script json"]=function(){return o||ce.error(r+" was not called"),o[0]},e.dataTypes[0]="json",i=ie[r],ie[r]=function(){o=arguments},n.always(function(){void 0===i?ce(ie).removeProp(r):ie[r]=i,e[r]&&(e.jsonpCallback=t.jsonpCallback,Kt.push(r)),o&&v(i)&&i(o[0]),o=i=void 0}),"script"}),le.createHTMLDocument=((Jt=C.implementation.createHTMLDocument("").body).innerHTML="<form></form><form></form>",2===Jt.childNodes.length),ce.parseHTML=function(e,t,n){return"string"!=typeof e?[]:("boolean"==typeof t&&(n=t,t=!1),t||(le.createHTMLDocument?((r=(t=C.implementation.createHTMLDocument("")).createElement("base")).href=C.location.href,t.head.appendChild(r)):t=C),o=!n&&[],(i=w.exec(e))?[t.createElement(i[1])]:(i=Ae([e],t,o),o&&o.length&&ce(o).remove(),ce.merge([],i.childNodes)));var r,i,o},ce.fn.load=function(e,t,n){var r,i,o,a=this,s=e.indexOf(" ");return-1<s&&(r=Tt(e.slice(s)),e=e.slice(0,s)),v(t)?(n=t,t=void 0):t&&"object"==typeof t&&(i="POST"),0<a.length&&ce.ajax({url:e,type:i||"GET",dataType:"html",data:t}).done(function(e){o=arguments,a.html(r?ce("<div>").append(ce.parseHTML(e)).find(r):e)}).always(n&&function(e,t){a.each(function(){n.apply(this,o||[e.responseText,t,e])})}),this},ce.expr.pseudos.animated=function(t){return ce.grep(ce.timers,function(e){return t===e.elem}).length},ce.offset={setOffset:function(e,t,n){var r,i,o,a,s,u,l=ce.css(e,"position"),c=ce(e),f={};"static"===l&&(e.style.position="relative"),s=c.offset(),o=ce.css(e,"top"),u=ce.css(e,"left"),("absolute"===l||"fixed"===l)&&-1<(o+u).indexOf("auto")?(a=(r=c.position()).top,i=r.left):(a=parseFloat(o)||0,i=parseFloat(u)||0),v(t)&&(t=t.call(e,n,ce.extend({},s))),null!=t.top&&(f.top=t.top-s.top+a),null!=t.left&&(f.left=t.left-s.left+i),"using"in t?t.using.call(e,f):c.css(f)}},ce.fn.extend({offset:function(t){if(arguments.length)return void 0===t?this:this.each(function(e){ce.offset.setOffset(this,t,e)});var e,n,r=this[0];return r?r.getClientRects().length?(e=r.getBoundingClientRect(),n=r.ownerDocument.defaultView,{top:e.top+n.pageYOffset,left:e.left+n.pageXOffset}):{top:0,left:0}:void 0},position:function(){if(this[0]){var e,t,n,r=this[0],i={top:0,left:0};if("fixed"===ce.css(r,"position"))t=r.getBoundingClientRect();else{t=this.offset(),n=r.ownerDocument,e=r.offsetParent||n.documentElement;while(e&&(e===n.body||e===n.documentElement)&&"static"===ce.css(e,"position"))e=e.parentNode;e&&e!==r&&1===e.nodeType&&((i=ce(e).offset()).top+=ce.css(e,"borderTopWidth",!0),i.left+=ce.css(e,"borderLeftWidth",!0))}return{top:t.top-i.top-ce.css(r,"marginTop",!0),left:t.left-i.left-ce.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent;while(e&&"static"===ce.css(e,"position"))e=e.offsetParent;return e||J})}}),ce.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(t,i){var o="pageYOffset"===i;ce.fn[t]=function(e){return M(this,function(e,t,n){var r;if(y(e)?r=e:9===e.nodeType&&(r=e.defaultView),void 0===n)return r?r[i]:e[t];r?r.scrollTo(o?r.pageXOffset:n,o?n:r.pageYOffset):e[t]=n},t,e,arguments.length)}}),ce.each(["top","left"],function(e,n){ce.cssHooks[n]=Ye(le.pixelPosition,function(e,t){if(t)return t=Ge(e,n),_e.test(t)?ce(e).position()[n]+"px":t})}),ce.each({Height:"height",Width:"width"},function(a,s){ce.each({padding:"inner"+a,content:s,"":"outer"+a},function(r,o){ce.fn[o]=function(e,t){var n=arguments.length&&(r||"boolean"!=typeof e),i=r||(!0===e||!0===t?"margin":"border");return M(this,function(e,t,n){var r;return y(e)?0===o.indexOf("outer")?e["inner"+a]:e.document.documentElement["client"+a]:9===e.nodeType?(r=e.documentElement,Math.max(e.body["scroll"+a],r["scroll"+a],e.body["offset"+a],r["offset"+a],r["client"+a])):void 0===n?ce.css(e,t,i):ce.style(e,t,n,i)},s,n?e:void 0,n)}})}),ce.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){ce.fn[t]=function(e){return this.on(t,e)}}),ce.fn.extend({bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)},hover:function(e,t){return this.on("mouseenter",e).on("mouseleave",t||e)}}),ce.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(e,n){ce.fn[n]=function(e,t){return 0<arguments.length?this.on(n,null,e,t):this.trigger(n)}});var en=/^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;ce.proxy=function(e,t){var n,r,i;if("string"==typeof t&&(n=e[t],t=e,e=n),v(e))return r=ae.call(arguments,2),(i=function(){return e.apply(t||this,r.concat(ae.call(arguments)))}).guid=e.guid=e.guid||ce.guid++,i},ce.holdReady=function(e){e?ce.readyWait++:ce.ready(!0)},ce.isArray=Array.isArray,ce.parseJSON=JSON.parse,ce.nodeName=fe,ce.isFunction=v,ce.isWindow=y,ce.camelCase=F,ce.type=x,ce.now=Date.now,ce.isNumeric=function(e){var t=ce.type(e);return("number"===t||"string"===t)&&!isNaN(e-parseFloat(e))},ce.trim=function(e){return null==e?"":(e+"").replace(en,"$1")},"function"==typeof define&&define.amd&&define("jquery",[],function(){return ce});var tn=ie.jQuery,nn=ie.$;return ce.noConflict=function(e){return ie.$===ce&&(ie.$=nn),e&&ie.jQuery===ce&&(ie.jQuery=tn),ce},"undefined"==typeof e&&(ie.jQuery=ie.$=ce),ce});
/* chess.js */
var Chess=function(r){var u="b",s="w",l=-1,_="p",A="n",S="b",m="r",y="q",p="k",t="pnbrqkPNBRQK",e="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",g=["1-0","0-1","1/2-1/2","*"],C={b:[16,32,17,15],w:[-16,-32,-17,-15]},T={n:[-18,-33,-31,-14,18,33,31,14],b:[-17,-15,17,15],r:[-16,1,16,-1],q:[-17,-16,-15,1,17,16,15,-1],k:[-17,-16,-15,1,17,16,15,-1]},c=[20,0,0,0,0,0,0,24,0,0,0,0,0,0,20,0,0,20,0,0,0,0,0,24,0,0,0,0,0,20,0,0,0,0,20,0,0,0,0,24,0,0,0,0,20,0,0,0,0,0,0,20,0,0,0,24,0,0,0,20,0,0,0,0,0,0,0,0,20,0,0,24,0,0,20,0,0,0,0,0,0,0,0,0,0,20,2,24,2,20,0,0,0,0,0,0,0,0,0,0,0,2,53,56,53,2,0,0,0,0,0,0,24,24,24,24,24,24,56,0,56,24,24,24,24,24,24,0,0,0,0,0,0,2,53,56,53,2,0,0,0,0,0,0,0,0,0,0,0,20,2,24,2,20,0,0,0,0,0,0,0,0,0,0,20,0,0,24,0,0,20,0,0,0,0,0,0,0,0,20,0,0,0,24,0,0,0,20,0,0,0,0,0,0,20,0,0,0,0,24,0,0,0,0,20,0,0,0,0,20,0,0,0,0,0,24,0,0,0,0,0,20,0,0,20,0,0,0,0,0,0,24,0,0,0,0,0,0,20],v=[17,0,0,0,0,0,0,16,0,0,0,0,0,0,15,0,0,17,0,0,0,0,0,16,0,0,0,0,0,15,0,0,0,0,17,0,0,0,0,16,0,0,0,0,15,0,0,0,0,0,0,17,0,0,0,16,0,0,0,15,0,0,0,0,0,0,0,0,17,0,0,16,0,0,15,0,0,0,0,0,0,0,0,0,0,17,0,16,0,15,0,0,0,0,0,0,0,0,0,0,0,0,17,16,15,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,-1,-1,-1,-1,-1,-1,-1,0,0,0,0,0,0,0,-15,-16,-17,0,0,0,0,0,0,0,0,0,0,0,0,-15,0,-16,0,-17,0,0,0,0,0,0,0,0,0,0,-15,0,0,-16,0,0,-17,0,0,0,0,0,0,0,0,-15,0,0,0,-16,0,0,0,-17,0,0,0,0,0,0,-15,0,0,0,0,-16,0,0,0,0,-17,0,0,0,0,-15,0,0,0,0,0,-16,0,0,0,0,0,-17,0,0,-15,0,0,0,0,0,0,-16,0,0,0,0,0,0,-17],h={p:0,n:1,b:2,r:3,q:4,k:5},o={NORMAL:"n",CAPTURE:"c",BIG_PAWN:"b",EP_CAPTURE:"e",PROMOTION:"p",KSIDE_CASTLE:"k",QSIDE_CASTLE:"q"},I={NORMAL:1,CAPTURE:2,BIG_PAWN:4,EP_CAPTURE:8,PROMOTION:16,KSIDE_CASTLE:32,QSIDE_CASTLE:64},P=7,w=6,L=1,R=0,N={a8:0,b8:1,c8:2,d8:3,e8:4,f8:5,g8:6,h8:7,a7:16,b7:17,c7:18,d7:19,e7:20,f7:21,g7:22,h7:23,a6:32,b6:33,c6:34,d6:35,e6:36,f6:37,g6:38,h6:39,a5:48,b5:49,c5:50,d5:51,e5:52,f5:53,g5:54,h5:55,a4:64,b4:65,c4:66,d4:67,e4:68,f4:69,g4:70,h4:71,a3:80,b3:81,c3:82,d3:83,e3:84,f3:85,g3:86,h3:87,a2:96,b2:97,c2:98,d2:99,e2:100,f2:101,g2:102,h2:103,a1:112,b1:113,c1:114,d1:115,e1:116,f1:117,g1:118,h1:119},E={w:[{square:N.a1,flag:I.QSIDE_CASTLE},{square:N.h1,flag:I.KSIDE_CASTLE}],b:[{square:N.a8,flag:I.QSIDE_CASTLE},{square:N.h8,flag:I.KSIDE_CASTLE}]},O=new Array(128),k={w:l,b:l},q=s,D={w:0,b:0},K=l,d=0,b=1,Q=[],U={};function x(r){void 0===r&&(r=!1),O=new Array(128),k={w:l,b:l},q=s,D={w:0,b:0},K=l,d=0,b=1,Q=[],r||(U={}),F(M())}function j(){B(e)}function B(r,e){void 0===e&&(e=!1);var n=r.split(/\s+/),t=n[0],o=0;if(!$(r).valid)return!1;x(e);for(var i=0;i<t.length;i++){var f=t.charAt(i);if("/"===f)o+=8;else if(-1!=="0123456789".indexOf(f))o+=parseInt(f,10);else{var a=f<"a"?s:u;W({type:f.toLowerCase(),color:a},fr(o)),o++}}return q=n[1],-1<n[2].indexOf("K")&&(D.w|=I.KSIDE_CASTLE),-1<n[2].indexOf("Q")&&(D.w|=I.QSIDE_CASTLE),-1<n[2].indexOf("k")&&(D.b|=I.KSIDE_CASTLE),-1<n[2].indexOf("q")&&(D.b|=I.QSIDE_CASTLE),K="-"===n[3]?l:N[n[3]],d=parseInt(n[4],10),b=parseInt(n[5],10),F(M()),!0}function $(r){var e="No errors.",n="FEN string must contain six space-delimited fields.",t="6th field (move number) must be a positive integer.",o="5th field (half move counter) must be a non-negative integer.",i="4th field (en-passant square) is invalid.",f="3rd field (castling availability) is invalid.",a="2nd field (side to move) is invalid.",l="1st field (piece positions) does not contain 8 '/'-delimited rows.",u="1st field (piece positions) is invalid [consecutive numbers].",s="1st field (piece positions) is invalid [invalid piece].",p="1st field (piece positions) is invalid [row too large].",c="Illegal en-passant square",v=r.split(/\s+/);if(6!==v.length)return{valid:!1,error_number:1,error:n};if(isNaN(v[5])||parseInt(v[5],10)<=0)return{valid:!1,error_number:2,error:t};if(isNaN(v[4])||parseInt(v[4],10)<0)return{valid:!1,error_number:3,error:o};if(!/^(-|[abcdefgh][36])$/.test(v[3]))return{valid:!1,error_number:4,error:i};if(!/^(KQ?k?q?|Qk?q?|kq?|q|-)$/.test(v[2]))return{valid:!1,error_number:5,error:f};if(!/^(w|b)$/.test(v[1]))return{valid:!1,error_number:6,error:a};var g=v[0].split("/");if(8!==g.length)return{valid:!1,error_number:7,error:l};for(var h=0;h<g.length;h++){for(var E=0,d=!1,b=0;b<g[h].length;b++)if(isNaN(g[h][b])){if(!/^[prnbqkPRNBQK]$/.test(g[h][b]))return{valid:!1,error_number:9,error:s};E+=1,d=!1}else{if(d)return{valid:!1,error_number:8,error:u};E+=parseInt(g[h][b],10),d=!0}if(8!==E)return{valid:!1,error_number:10,error:p}}return"3"==v[3][1]&&"w"==v[1]||"6"==v[3][1]&&"b"==v[1]?{valid:!1,error_number:11,error:c}:{valid:!0,error_number:0,error:e}}function M(){for(var r=0,e="",n=N.a8;n<=N.h1;n++){if(null==O[n])r++;else{0<r&&(e+=r,r=0);var t=O[n].color,o=O[n].type;e+=t===s?o.toUpperCase():o.toLowerCase()}n+1&136&&(0<r&&(e+=r),n!==N.h1&&(e+="/"),r=0,n+=8)}var i="";D[s]&I.KSIDE_CASTLE&&(i+="K"),D[s]&I.QSIDE_CASTLE&&(i+="Q"),D[u]&I.KSIDE_CASTLE&&(i+="k"),D[u]&I.QSIDE_CASTLE&&(i+="q"),i=i||"-";var f=K===l?"-":fr(K);return[e,q,i,f,d,b].join(" ")}function G(r){for(var e=0;e<r.length;e+=2)"string"==typeof r[e]&&"string"==typeof r[e+1]&&(U[r[e]]=r[e+1]);return U}function F(r){0<Q.length||(r!==e?(U.SetUp="1",U.FEN=r):(delete U.SetUp,delete U.FEN))}function i(r){var e=O[N[r]];return e?{type:e.type,color:e.color}:null}function W(r,e){if(!("type"in r&&"color"in r))return!1;if(-1===t.indexOf(r.type.toLowerCase()))return!1;if(!(e in N))return!1;var n=N[e];return(r.type!=p||k[r.color]==l||k[r.color]==n)&&(O[n]={type:r.type,color:r.color},r.type===p&&(k[r.color]=n),F(M()),!0)}function H(r,e,n,t,o){var i={color:q,from:e,to:n,flags:t,piece:r[e].type};return o&&(i.flags|=I.PROMOTION,i.promotion=o),r[n]?i.captured=r[n].type:t&I.EP_CAPTURE&&(i.captured=_),i}function Z(r){function e(r,e,n,t,o){if(r[n].type!==_||or(t)!==R&&or(t)!==P)e.push(H(r,n,t,o));else for(var i=[y,m,S,A],f=0,a=i.length;f<a;f++)e.push(H(r,n,t,o,i[f]))}var n=[],t=q,o=ar(t),i={b:L,w:w},f=N.a8,a=N.h1,l=!1,u=!(void 0!==r&&"legal"in r)||r.legal;if(void 0!==r&&"square"in r){if(!(r.square in N))return[];f=a=N[r.square],l=!0}for(var s=f;s<=a;s++)if(136&s)s+=7;else{var p=O[s];if(null!=p&&p.color===t)if(p.type===_){var c=s+C[t][0];if(null==O[c]){e(O,n,s,c,I.NORMAL);c=s+C[t][1];i[t]===or(s)&&null==O[c]&&e(O,n,s,c,I.BIG_PAWN)}for(v=2;v<4;v++){136&(c=s+C[t][v])||(null!=O[c]&&O[c].color===o?e(O,n,s,c,I.CAPTURE):c===K&&e(O,n,s,K,I.EP_CAPTURE))}}else for(var v=0,g=T[p.type].length;v<g;v++){var h=T[p.type][v];for(c=s;!(136&(c+=h));){if(null!=O[c]){if(O[c].color===t)break;e(O,n,s,c,I.CAPTURE);break}if(e(O,n,s,c,I.NORMAL),"n"===p.type||"k"===p.type)break}}}if(!l||a===k[t]){if(D[t]&I.KSIDE_CASTLE){var E=(d=k[t])+2;null!=O[d+1]||null!=O[E]||V(o,k[t])||V(o,d+1)||V(o,E)||e(O,n,k[t],E,I.KSIDE_CASTLE)}if(D[t]&I.QSIDE_CASTLE){var d;E=(d=k[t])-2;null!=O[d-1]||null!=O[d-2]||null!=O[d-3]||V(o,k[t])||V(o,d-1)||V(o,E)||e(O,n,k[t],E,I.QSIDE_CASTLE)}}if(!u)return n;var b=[];for(s=0,g=n.length;s<g;s++)er(n[s]),X(t)||b.push(n[s]),nr();return b}function z(r,e){var n="";if(r.flags&I.KSIDE_CASTLE)n="O-O";else if(r.flags&I.QSIDE_CASTLE)n="O-O-O";else{var t=function(r,e){for(var n=Z({legal:!e}),t=r.from,o=r.to,i=r.piece,f=0,a=0,l=0,u=0,s=n.length;u<s;u++){var p=n[u].from,c=n[u].to,v=n[u].piece;i===v&&t!==p&&o===c&&(f++,or(t)===or(p)&&a++,ir(t)===ir(p)&&l++)}if(0<f)return 0<a&&0<l?fr(t):0<l?fr(t).charAt(1):fr(t).charAt(0);return""}(r,e);r.piece!==_&&(n+=r.piece.toUpperCase()+t),r.flags&(I.CAPTURE|I.EP_CAPTURE)&&(r.piece===_&&(n+=fr(r.from)[0]),n+="x"),n+=fr(r.to),r.flags&I.PROMOTION&&(n+="="+r.promotion.toUpperCase())}return er(r),f()&&(a()?n+="#":n+="+"),nr(),n}function J(r){return r.replace(/=/,"").replace(/[+#]?[?!]*$/,"")}function V(r,e){for(var n=N.a8;n<=N.h1;n++)if(136&n)n+=7;else if(null!=O[n]&&O[n].color===r){var t=O[n],o=n-e,i=119+o;if(c[i]&1<<h[t.type]){if(t.type===_){if(0<o){if(t.color===s)return!0}else if(t.color===u)return!0;continue}if("n"===t.type||"k"===t.type)return!0;for(var f=v[i],a=n+f,l=!1;a!==e;){if(null!=O[a]){l=!0;break}a+=f}if(!l)return!0}}return!1}function X(r){return V(ar(r),k[r])}function f(){return X(q)}function a(){return f()&&0===Z().length}function n(){return!f()&&0===Z().length}function Y(){for(var r={},e=[],n=0,t=0,o=N.a8;o<=N.h1;o++)if(t=(t+1)%2,136&o)o+=7;else{var i=O[o];i&&(r[i.type]=i.type in r?r[i.type]+1:1,i.type===S&&e.push(t),n++)}if(2===n)return!0;if(3===n&&(1===r[S]||1===r[A]))return!0;if(n===r[S]+2){var f=0,a=e.length;for(o=0;o<a;o++)f+=e[o];if(0===f||f===a)return!0}return!1}function rr(){for(var r=[],e={},n=!1;;){var t=nr();if(!t)break;r.push(t)}for(;;){var o=M().split(" ").slice(0,4).join(" ");if(e[o]=o in e?e[o]+1:1,3<=e[o]&&(n=!0),!r.length)break;er(r.pop())}return n}function er(r){var e,n=q,t=ar(n);if(e=r,Q.push({move:e,kings:{b:k.b,w:k.w},turn:q,castling:{b:D.b,w:D.w},ep_square:K,half_moves:d,move_number:b}),O[r.to]=O[r.from],O[r.from]=null,r.flags&I.EP_CAPTURE&&(q===u?O[r.to-16]=null:O[r.to+16]=null),r.flags&I.PROMOTION&&(O[r.to]={type:r.promotion,color:n}),O[r.to].type===p){if(k[O[r.to].color]=r.to,r.flags&I.KSIDE_CASTLE){var o=r.to-1,i=r.to+1;O[o]=O[i],O[i]=null}else if(r.flags&I.QSIDE_CASTLE){o=r.to+1,i=r.to-2;O[o]=O[i],O[i]=null}D[n]=""}if(D[n])for(var f=0,a=E[n].length;f<a;f++)if(r.from===E[n][f].square&&D[n]&E[n][f].flag){D[n]^=E[n][f].flag;break}if(D[t])for(f=0,a=E[t].length;f<a;f++)if(r.to===E[t][f].square&&D[t]&E[t][f].flag){D[t]^=E[t][f].flag;break}K=r.flags&I.BIG_PAWN?"b"===q?r.to-16:r.to+16:l,r.piece===_||r.flags&(I.CAPTURE|I.EP_CAPTURE)?d=0:d++,q===u&&b++,q=ar(q)}function nr(){var r=Q.pop();if(null==r)return null;var e=r.move;k=r.kings,q=r.turn,D=r.castling,K=r.ep_square,d=r.half_moves,b=r.move_number;var n,t,o=q,i=ar(q);if(O[e.from]=O[e.to],O[e.from].type=e.piece,O[e.to]=null,e.flags&I.CAPTURE)O[e.to]={type:e.captured,color:i};else if(e.flags&I.EP_CAPTURE){var f;f=o===u?e.to-16:e.to+16,O[f]={type:_,color:i}}e.flags&(I.KSIDE_CASTLE|I.QSIDE_CASTLE)&&(e.flags&I.KSIDE_CASTLE?(n=e.to+1,t=e.to-1):e.flags&I.QSIDE_CASTLE&&(n=e.to-2,t=e.to+1),O[n]=O[t],O[t]=null);return e}function tr(r,e){var n=J(r);if(e){var t=n.match(/([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/);if(t)var o=t[1],i=t[2],f=t[3],a=t[4]}for(var l=Z(),u=0,s=l.length;u<s;u++){if(n===J(z(l[u]))||e&&n===J(z(l[u],!0)))return l[u];if(t&&(!o||o.toLowerCase()==l[u].piece)&&N[i]==l[u].from&&N[f]==l[u].to&&(!a||a.toLowerCase()==l[u].promotion))return l[u]}return null}function or(r){return r>>4}function ir(r){return 15&r}function fr(r){var e=ir(r),n=or(r);return"abcdefgh".substring(e,e+1)+"87654321".substring(n,n+1)}function ar(r){return r===s?u:s}function lr(r){var e=function r(e){var n=e instanceof Array?[]:{};for(var t in e)n[t]="object"==typeof t?r(e[t]):e[t];return n}(r);e.san=z(e,!1),e.to=fr(e.to),e.from=fr(e.from);var n="";for(var t in I)I[t]&e.flags&&(n+=o[t]);return e.flags=n,e}function ur(r){return r.replace(/^\s+|\s+$/g,"")}return B(void 0===r?e:r),{WHITE:s,BLACK:u,PAWN:_,KNIGHT:A,BISHOP:S,ROOK:m,QUEEN:y,KING:p,SQUARES:function(){for(var r=[],e=N.a8;e<=N.h1;e++)136&e?e+=7:r.push(fr(e));return r}(),FLAGS:o,load:function(r){return B(r)},reset:function(){return j()},moves:function(r){for(var e=Z(r),n=[],t=0,o=e.length;t<o;t++)void 0!==r&&"verbose"in r&&r.verbose?n.push(lr(e[t])):n.push(z(e[t],!1));return n},in_check:function(){return f()},in_checkmate:function(){return a()},in_stalemate:function(){return n()},in_draw:function(){return 100<=d||n()||Y()||rr()},insufficient_material:function(){return Y()},in_threefold_repetition:function(){return rr()},game_over:function(){return 100<=d||a()||n()||Y()||rr()},validate_fen:function(r){return $(r)},fen:function(){return M()},board:function(){for(var r=[],e=[],n=N.a8;n<=N.h1;n++)null==O[n]?e.push(null):e.push({type:O[n].type,color:O[n].color}),n+1&136&&(r.push(e),e=[],n+=8);return r},pgn:function(r){var e="object"==typeof r&&"string"==typeof r.newline_char?r.newline_char:"\n",n="object"==typeof r&&"number"==typeof r.max_width?r.max_width:0,t=[],o=!1;for(var i in U)t.push("["+i+' "'+U[i]+'"]'+e),o=!0;o&&Q.length&&t.push(e);for(var f=[];0<Q.length;)f.push(nr());for(var a=[],l="";0<f.length;){var u=f.pop();Q.length||"b"!==u.color?"w"===u.color&&(l.length&&a.push(l),l=b+"."):l=b+". ...",l=l+" "+z(u,!1),er(u)}if(l.length&&a.push(l),void 0!==U.Result&&a.push(U.Result),0===n)return t.join("")+a.join(" ");var s=0;for(i=0;i<a.length;i++)s+a[i].length>n&&0!==i?(" "===t[t.length-1]&&t.pop(),t.push(e),s=0):0!==i&&(t.push(" "),s++),t.push(a[i]),s+=a[i].length;return t.join("")},load_pgn:function(r,e){var n=void 0!==e&&"sloppy"in e&&e.sloppy;function l(r){return r.replace(/\\/g,"\\")}var t="object"==typeof e&&"string"==typeof e.newline_char?e.newline_char:"\r?\n",o=new RegExp("^(\\[((?:"+l(t)+")|.)*\\])(?:"+l(t)+"){2}"),i=o.test(r)?o.exec(r)[1]:"";j();var f=function(r,e){for(var n="object"==typeof e&&"string"==typeof e.newline_char?e.newline_char:"\r?\n",t={},o=r.split(new RegExp(l(n))),i="",f="",a=0;a<o.length;a++)i=o[a].replace(/^\[([A-Z][A-Za-z]*)\s.*\]$/,"$1"),f=o[a].replace(/^\[[A-Za-z]+\s"(.*)"\]$/,"$1"),0<ur(i).length&&(t[i]=f);return t}(i,e);for(var a in f)G([a,f[a]]);if("1"===f.SetUp&&!("FEN"in f&&B(f.FEN,!0)))return!1;var u=r.replace(i,"").replace(new RegExp(l(t),"g")," ");u=u.replace(/(\{[^}]+\})+?/g,"");for(var s=/(\([^\(\)]+\))+?/g;s.test(u);)u=u.replace(s,"");var p=ur(u=(u=(u=u.replace(/\d+\.(\.\.)?/g,"")).replace(/\.\.\./g,"")).replace(/\$\d+/g,"")).split(new RegExp(/\s+/));p=p.join(",").replace(/,,+/g,",").split(",");for(var c="",v=0;v<p.length-1;v++){if(null==(c=tr(p[v],n)))return!1;er(c)}if(c=p[p.length-1],-1<g.indexOf(c))!function(r){for(var e in r)return 1}(U)||void 0!==U.Result||G(["Result",c]);else{if(null==(c=tr(c,n)))return!1;er(c)}return!0},header:function(){return G(arguments)},ascii:function(){return function(){for(var r="   +------------------------+\n",e=N.a8;e<=N.h1;e++){if(0===ir(e)&&(r+=" "+"87654321"[or(e)]+" |"),null==O[e])r+=" . ";else{var n=O[e].type;r+=" "+(O[e].color===s?n.toUpperCase():n.toLowerCase())+" "}e+1&136&&(r+="|\n",e+=8)}return r+="   +------------------------+\n",r+="     a  b  c  d  e  f  g  h\n"}()},turn:function(){return q},move:function(r,e){var n=void 0!==e&&"sloppy"in e&&e.sloppy,t=null;if("string"==typeof r)t=tr(r,n);else if("object"==typeof r)for(var o=Z(),i=0,f=o.length;i<f;i++)if(!(r.from!==fr(o[i].from)||r.to!==fr(o[i].to)||"promotion"in o[i]&&r.promotion!==o[i].promotion)){t=o[i];break}if(!t)return null;var a=lr(t);return er(t),a},undo:function(){var r=nr();return r?lr(r):null},clear:function(){return x()},put:function(r,e){return W(r,e)},get:function(r){return i(r)},remove:function(r){return n=i(e=r),O[N[e]]=null,n&&n.type===p&&(k[n.color]=l),F(M()),n;var e,n},perft:function(r){return function r(e){for(var n=Z({legal:!1}),t=0,o=q,i=0,f=n.length;i<f;i++)er(n[i]),X(o)||(0<e-1?t+=r(e-1):t++),nr();return t}(r)},square_color:function(r){if(r in N){var e=N[r];return(or(e)+ir(e))%2==0?"light":"dark"}return null},history:function(r){for(var e=[],n=[],t=(void 0!==r&&"verbose"in r&&r.verbose);0<Q.length;)e.push(nr());for(;0<e.length;){var o=e.pop();t?n.push(lr(o)):n.push(z(o)),er(o)}return n}}};"undefined"!=typeof exports&&(exports.Chess=Chess),"undefined"!=typeof define&&define(function(){return Chess});
/*! chessboard.js v1.0.0 | (c) 2019 Chris Oakman | MIT License chessboardjs.com/license */
!function(){"use strict";var z=window.jQuery,F="abcdefgh".split(""),r=20,A="…",W="1.8.3",e="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",G=pe(e),n=200,t=200,o=60,a=30,i=100,H={};function V(e,r,n){function t(){o=0,a&&(a=!1,s())}var o=0,a=!1,i=[],s=function(){o=window.setTimeout(t,r),e.apply(n,i)};return function(e){i=arguments,o?a=!0:s()}}function Z(){return"xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx".replace(/x/g,function(e){return(16*Math.random()|0).toString(16)})}function _(e){return JSON.parse(JSON.stringify(e))}function s(e){var r=e.split(".");return{major:parseInt(r[0],10),minor:parseInt(r[1],10),patch:parseInt(r[2],10)}}function ee(e,r){for(var n in r)if(r.hasOwnProperty(n))for(var t="{"+n+"}",o=r[n];-1!==e.indexOf(t);)e=e.replace(t,o);return e}function re(e){return"string"==typeof e}function ne(e){return"function"==typeof e}function p(e){return"number"==typeof e&&isFinite(e)&&Math.floor(e)===e}function c(e){return"fast"===e||"slow"===e||!!p(e)&&0<=e}function te(e){if(!re(e))return!1;var r=e.split("-");return 2===r.length&&(oe(r[0])&&oe(r[1]))}function oe(e){return re(e)&&-1!==e.search(/^[a-h][1-8]$/)}function u(e){return re(e)&&-1!==e.search(/^[bw][KQRNBP]$/)}function ae(e){if(!re(e))return!1;var r=(e=function(e){return e.replace(/8/g,"11111111").replace(/7/g,"1111111").replace(/6/g,"111111").replace(/5/g,"11111").replace(/4/g,"1111").replace(/3/g,"111").replace(/2/g,"11")}(e=e.replace(/ .+$/,""))).split("/");if(8!==r.length)return!1;for(var n=0;n<8;n++)if(8!==r[n].length||-1!==r[n].search(/[^kqrnbpKQRNBP1]/))return!1;return!0}function ie(e){if(!z.isPlainObject(e))return!1;for(var r in e)if(e.hasOwnProperty(r)&&(!oe(r)||!u(e[r])))return!1;return!0}function se(){return typeof window.$&&z.fn&&z.fn.jquery&&function(e,r){e=s(e),r=s(r);var n=1e5*e.major*1e5+1e5*e.minor+e.patch;return 1e5*r.major*1e5+1e5*r.minor+r.patch<=n}(z.fn.jquery,W)}function pe(e){if(!ae(e))return!1;for(var r,n=(e=e.replace(/ .+$/,"")).split("/"),t={},o=8,a=0;a<8;a++){for(var i=n[a].split(""),s=0,p=0;p<i.length;p++){if(-1!==i[p].search(/[1-8]/))s+=parseInt(i[p],10);else t[F[s]+o]=(r=i[p]).toLowerCase()===r?"b"+r.toUpperCase():"w"+r.toUpperCase(),s+=1}o-=1}return t}function ce(e){if(!ie(e))return!1;for(var r,n,t="",o=8,a=0;a<8;a++){for(var i=0;i<8;i++){var s=F[i]+o;e.hasOwnProperty(s)?t+=(r=e[s],n=void 0,"w"===(n=r.split(""))[0]?n[1].toUpperCase():n[1].toLowerCase()):t+="1"}7!==a&&(t+="/"),o-=1}return t=function(e){return e.replace(/11111111/g,"8").replace(/1111111/g,"7").replace(/111111/g,"6").replace(/11111/g,"5").replace(/1111/g,"4").replace(/111/g,"3").replace(/11/g,"2")}(t)}function ue(e,r,n){for(var t=function(e){for(var r=[],n=0;n<8;n++)for(var t=0;t<8;t++){var o=F[n]+(t+1);e!==o&&r.push({square:o,distance:(a=e,i=o,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,s=a.split(""),p=F.indexOf(s[0])+1,c=parseInt(s[1],10),u=i.split(""),f=F.indexOf(u[0])+1,d=parseInt(u[1],10),h=Math.abs(p-f),l=Math.abs(c-d),l<=h?h:l)})}var a,i,s,p,c,u,f,d,h,l;r.sort(function(e,r){return e.distance-r.distance});var v=[];for(n=0;n<r.length;n++)v.push(r[n].square);return v}(n),o=0;o<t.length;o++){var a=t[o];if(e.hasOwnProperty(a)&&e[a]===r)return a}return!1}function fe(e){return"black"!==e.orientation&&(e.orientation="white"),!1!==e.showNotation&&(e.showNotation=!0),!0!==e.draggable&&(e.draggable=!1),"trash"!==e.dropOffBoard&&(e.dropOffBoard="snapback"),!0!==e.sparePieces&&(e.sparePieces=!1),e.sparePieces&&(e.draggable=!0),e.hasOwnProperty("pieceTheme")&&(re(e.pieceTheme)||ne(e.pieceTheme))||(e.pieceTheme="img/chesspieces/wikipedia/{piece}.png"),c(e.appearSpeed)||(e.appearSpeed=n),c(e.moveSpeed)||(e.moveSpeed=t),c(e.snapbackSpeed)||(e.snapbackSpeed=o),c(e.snapSpeed)||(e.snapSpeed=a),c(e.trashSpeed)||(e.trashSpeed=i),function(e){return p(e)&&1<=e}(e.dragThrottleRate)||(e.dragThrottleRate=r),e}H.alpha="alpha-d2270",H.black="black-3c85d",H.board="board-b72b1",H.chessboard="chessboard-63f37",H.clearfix="clearfix-7da63",H.highlight1="highlight1-32417",H.highlight2="highlight2-9c5d2",H.notation="notation-322f9",H.numeric="numeric-fc462",H.piece="piece-417db",H.row="row-5277c",H.sparePieces="spare-pieces-7492f",H.sparePiecesBottom="spare-pieces-bottom-ae20f",H.sparePiecesTop="spare-pieces-top-4028b",H.square="square-55d63",H.white="white-1e1d7",window.Chessboard=function(e,f){if(!function(){if(se())return!0;var e="Chessboard Error 1005: Unable to find a valid version of jQuery. Please include jQuery "+W+" or higher on the page\n\nExiting"+A;return window.alert(e),!1}())return null;var n=function(e){if(""===e){var r="Chessboard Error 1001: The first argument to Chessboard() cannot be an empty string.\n\nExiting"+A;return window.alert(r),!1}re(e)&&"#"!==e.charAt(0)&&(e="#"+e);var n=z(e);if(1===n.length)return n;var t="Chessboard Error 1003: The first argument to Chessboard() must be the ID of a DOM node, an ID query selector, or a single DOM node.\n\nExiting"+A;return window.alert(t),!1}(e);if(!n)return null;f=fe(f=function(e){return"start"===e?e={position:_(G)}:ae(e)?e={position:pe(e)}:ie(e)&&(e={position:_(e)}),z.isPlainObject(e)||(e={}),e}(f));var r=null,a=null,t=null,o=null,i={},s=2,p="white",c={},u=null,d=null,h=null,l=!1,v={},g={},w={},b=16;function m(e,r,n){if(!0===f.hasOwnProperty("showErrors")&&!1!==f.showErrors){var t="Chessboard Error "+e+": "+r;return"console"===f.showErrors&&"object"==typeof console&&"function"==typeof console.log?(console.log(t),void(2<=arguments.length&&console.log(n))):"alert"===f.showErrors?(n&&(t+="\n\n"+JSON.stringify(n)),void window.alert(t)):void(ne(f.showErrors)&&f.showErrors(e,r,n))}}function P(e){return ne(f.pieceTheme)?f.pieceTheme(e):re(f.pieceTheme)?ee(f.pieceTheme,{piece:e}):(m(8272,"Unable to build image source for config.pieceTheme."),"")}function y(e,r,n){var t='<img src="'+P(e)+'" ';return re(n)&&""!==n&&(t+='id="'+n+'" '),t+='alt="" class="{piece}" data-piece="'+e+'" style="width:'+b+"px;height:"+b+"px;",r&&(t+="display:none;"),ee(t+='" />',H)}function x(e){var r=["wK","wQ","wR","wB","wN","wP"];"black"===e&&(r=["bK","bQ","bR","bB","bN","bP"]);for(var n="",t=0;t<r.length;t++)n+=y(r[t],!1,v[r[t]]);return n}function O(e,r,n,t){var o=z("#"+g[e]),a=o.offset(),i=z("#"+g[r]),s=i.offset(),p=Z();z("body").append(y(n,!0,p));var c=z("#"+p);c.css({display:"",position:"absolute",top:a.top,left:a.left}),o.find("."+H.piece).remove();var u={duration:f.moveSpeed,complete:function(){i.append(y(n)),c.remove(),ne(t)&&t()}};c.animate(s,u)}function S(e,r,n){var t=z("#"+v[e]).offset(),o=z("#"+g[r]),a=o.offset(),i=Z();z("body").append(y(e,!0,i));var s=z("#"+i);s.css({display:"",position:"absolute",left:t.left,top:t.top});var p={duration:f.moveSpeed,complete:function(){o.find("."+H.piece).remove(),o.append(y(e)),s.remove(),ne(n)&&n()}};s.animate(a,p)}function T(){for(var e in r.find("."+H.piece).remove(),c)c.hasOwnProperty(e)&&z("#"+g[e]).append(y(c[e]))}function q(){r.html(function(e){"black"!==e&&(e="white");var r="",n=_(F),t=8;"black"===e&&(n.reverse(),t=1);for(var o="white",a=0;a<8;a++){r+='<div class="{row}">';for(var i=0;i<8;i++){var s=n[i]+t;r+='<div class="{square} '+H[o]+" square-"+s+'" style="width:'+b+"px;height:"+b+'px;" id="'+g[s]+'" data-square="'+s+'">',f.showNotation&&(("white"===e&&1===t||"black"===e&&8===t)&&(r+='<div class="{notation} {alpha}">'+n[i]+"</div>"),0===i&&(r+='<div class="{notation} {numeric}">'+t+"</div>")),r+="</div>",o="white"===o?"black":"white"}r+='<div class="{clearfix}"></div></div>',o="white"===o?"black":"white","white"===e?t-=1:t+=1}return ee(r,H)}(p,f.showNotation)),T(),f.sparePieces&&("white"===p?(t.html(x("black")),o.html(x("white"))):(t.html(x("white")),o.html(x("black"))))}function k(e){var r=_(c),n=_(e);ce(r)!==ce(n)&&(ne(f.onChange)&&f.onChange(r,n),c=e)}function E(e,r){for(var n in w)if(w.hasOwnProperty(n)){var t=w[n];if(e>=t.left&&e<t.left+b&&r>=t.top&&r<t.top+b)return n}return"offboard"}function C(){r.find("."+H.square).removeClass(H.highlight1+" "+H.highlight2)}function B(){C();var e=_(c);delete e[h],k(e),T(),a.fadeOut(f.trashSpeed),l=!1}function I(e,r,n,t){ne(f.onDragStart)&&!1===f.onDragStart(e,r,_(c),p)||(l=!0,u=r,d="spare"===(h=e)?"offboard":e,function(){for(var e in w={},g)g.hasOwnProperty(e)&&(w[e]=z("#"+g[e]).offset())}(),a.attr("src",P(r)).css({display:"",position:"absolute",left:n-b/2,top:t-b/2}),"spare"!==e&&z("#"+g[e]).addClass(H.highlight1).find("."+H.piece).css("display","none"))}function M(e,r){a.css({left:e-b/2,top:r-b/2});var n=E(e,r);n!==d&&(oe(d)&&z("#"+g[d]).removeClass(H.highlight2),oe(n)&&z("#"+g[n]).addClass(H.highlight2),ne(f.onDragMove)&&f.onDragMove(n,d,h,u,_(c),p),d=n)}function N(e){var r="drop";if("offboard"===e&&"snapback"===f.dropOffBoard&&(r="snapback"),"offboard"===e&&"trash"===f.dropOffBoard&&(r="trash"),ne(f.onDrop)){var n=_(c);"spare"===h&&oe(e)&&(n[e]=u),oe(h)&&"offboard"===e&&delete n[h],oe(h)&&oe(e)&&(delete n[h],n[e]=u);var t=_(c),o=f.onDrop(h,e,u,n,t,p);"snapback"!==o&&"trash"!==o||(r=o)}"snapback"===r?function(){if("spare"!==h){C();var e=z("#"+g[h]).offset(),r={duration:f.snapbackSpeed,complete:function(){T(),a.css("display","none"),ne(f.onSnapbackEnd)&&f.onSnapbackEnd(u,h,_(c),p)}};a.animate(e,r),l=!1}else B()}():"trash"===r?B():"drop"===r&&function(e){C();var r=_(c);delete r[h],r[e]=u,k(r);var n=z("#"+g[e]).offset(),t={duration:f.snapSpeed,complete:function(){T(),a.css("display","none"),ne(f.onSnapEnd)&&f.onSnapEnd(h,e,u)}};a.animate(n,t),l=!1}(e)}function j(e){e.preventDefault()}function D(e){if(f.draggable){var r=z(this).attr("data-square");oe(r)&&c.hasOwnProperty(r)&&I(r,c[r],e.pageX,e.pageY)}}function R(e){if(f.draggable){var r=z(this).attr("data-square");oe(r)&&c.hasOwnProperty(r)&&(e=e.originalEvent,I(r,c[r],e.changedTouches[0].pageX,e.changedTouches[0].pageY))}}function Q(e){f.sparePieces&&I("spare",z(this).attr("data-piece"),e.pageX,e.pageY)}function X(e){f.sparePieces&&I("spare",z(this).attr("data-piece"),(e=e.originalEvent).changedTouches[0].pageX,e.changedTouches[0].pageY)}i.clear=function(e){i.position({},e)},i.destroy=function(){n.html(""),a.remove(),n.unbind()},i.fen=function(){return i.position("fen")},i.flip=function(){return i.orientation("flip")},i.move=function(){if(0!==arguments.length){for(var e=!0,r={},n=0;n<arguments.length;n++)if(!1!==arguments[n])if(te(arguments[n])){var t=arguments[n].split("-");r[t[0]]=t[1]}else m(2826,"Invalid move passed to the move method.",arguments[n]);else e=!1;var o=function(e,r){var n=_(e);for(var t in r)if(r.hasOwnProperty(t)&&n.hasOwnProperty(t)){var o=n[t];delete n[t],n[r[t]]=o}return n}(c,r);return i.position(o,e),o}},i.orientation=function(e){return 0===arguments.length?p:"white"===e||"black"===e?(p=e,q(),p):"flip"===e?(p="white"===p?"black":"white",q(),p):void m(5482,"Invalid value passed to the orientation method.",e)},i.position=function(e,r){if(0===arguments.length)return _(c);if(re(e)&&"fen"===e.toLowerCase())return ce(c);(re(e)&&"start"===e.toLowerCase()&&(e=_(G)),ae(e)&&(e=pe(e)),ie(e))?(!1!==r&&(r=!0),r?(function(e,r,n){if(0!==e.length)for(var t=0,o=0;o<e.length;o++){var a=e[o];"clear"===a.type?z("#"+g[a.square]+" ."+H.piece).fadeOut(f.trashSpeed,i):"add"!==a.type||f.sparePieces?"add"===a.type&&f.sparePieces?S(a.piece,a.square,i):"move"===a.type&&O(a.source,a.destination,a.piece,i):z("#"+g[a.square]).append(y(a.piece,!0)).find("."+H.piece).fadeIn(f.appearSpeed,i)}function i(){(t+=1)===e.length&&(T(),ne(f.onMoveEnd)&&f.onMoveEnd(_(r),_(n)))}}(function(e,r){e=_(e),r=_(r);var n=[],t={};for(var o in r)r.hasOwnProperty(o)&&e.hasOwnProperty(o)&&e[o]===r[o]&&(delete e[o],delete r[o]);for(o in r)if(r.hasOwnProperty(o)){var a=ue(e,r[o],o);a&&(n.push({type:"move",source:a,destination:o,piece:r[o]}),delete e[a],delete r[o],t[o]=!0)}for(o in r)r.hasOwnProperty(o)&&(n.push({type:"add",square:o,piece:r[o]}),delete r[o]);for(o in e)e.hasOwnProperty(o)&&(t.hasOwnProperty(o)||(n.push({type:"clear",square:o,piece:e[o]}),delete e[o]));return n}(c,e),c,e),k(e)):(k(e),T())):m(6482,"Invalid value passed to the position method.",e)},i.resize=function(){b=function(){var e=parseInt(n.width(),10);if(!e||e<=0)return 0;for(var r=e-1;r%8!=0&&0<r;)r-=1;return r/8}(),r.css("width",8*b+"px"),a.css({height:b,width:b}),f.sparePieces&&n.find("."+H.sparePieces).css("paddingLeft",b+s+"px"),q()},i.start=function(e){i.position("start",e)};var Y=V(function(e){l&&M(e.pageX,e.pageY)},f.dragThrottleRate),K=V(function(e){l&&(e.preventDefault(),M(e.originalEvent.changedTouches[0].pageX,e.originalEvent.changedTouches[0].pageY))},f.dragThrottleRate);function L(e){l&&N(E(e.pageX,e.pageY))}function U(e){l&&N(E(e.originalEvent.changedTouches[0].pageX,e.originalEvent.changedTouches[0].pageY))}function $(e){if(!l&&ne(f.onMouseoverSquare)){var r=z(e.currentTarget).attr("data-square");if(oe(r)){var n=!1;c.hasOwnProperty(r)&&(n=c[r]),f.onMouseoverSquare(r,n,_(c),p)}}}function J(e){if(!l&&ne(f.onMouseoutSquare)){var r=z(e.currentTarget).attr("data-square");if(oe(r)){var n=!1;c.hasOwnProperty(r)&&(n=c[r]),f.onMouseoutSquare(r,n,_(c),p)}}}return p=f.orientation,f.hasOwnProperty("position")&&("start"===f.position?c=_(G):ae(f.position)?c=pe(f.position):ie(f.position)?c=_(f.position):m(7263,"Invalid value passed to config.position.",f.position)),function(){!function(){for(var e=0;e<F.length;e++)for(var r=1;r<=8;r++){var n=F[e]+r;g[n]=n+"-"+Z()}var t="KQRNBP".split("");for(e=0;e<t.length;e++){var o="w"+t[e],a="b"+t[e];v[o]=o+"-"+Z(),v[a]=a+"-"+Z()}}(),n.html(function(e){var r='<div class="{chessboard}">';return e&&(r+='<div class="{sparePieces} {sparePiecesTop}"></div>'),r+='<div class="{board}"></div>',e&&(r+='<div class="{sparePieces} {sparePiecesBottom}"></div>'),ee(r+="</div>",H)}(f.sparePieces)),r=n.find("."+H.board),f.sparePieces&&(t=n.find("."+H.sparePiecesTop),o=n.find("."+H.sparePiecesBottom));var e=Z();z("body").append(y("wP",!0,e)),a=z("#"+e),s=parseInt(r.css("borderLeftWidth"),10),i.resize()}(),function(){z("body").on("mousedown mousemove","."+H.piece,j),r.on("mousedown","."+H.square,D),n.on("mousedown","."+H.sparePieces+" ."+H.piece,Q),r.on("mouseenter","."+H.square,$).on("mouseleave","."+H.square,J);var e=z(window);e.on("mousemove",Y).on("mouseup",L),"ontouchstart"in document.documentElement&&(r.on("touchstart","."+H.square,R),n.on("touchstart","."+H.sparePieces+" ."+H.piece,X),e.on("touchmove",K).on("touchend",U))}(),i},window.ChessBoard=window.Chessboard,window.Chessboard.fenToObj=pe,window.Chessboard.objToFen=ce}();

const style = document.createElement('style');
style.textContent = `/*! chessboard.js v1.0.0 | (c) 2019 Chris Oakman | MIT License chessboardjs.com/license */
.clearfix-7da63{clear:both}.board-b72b1{border:2px solid #404040;box-sizing:content-box}.square-55d63{float:left;position:relative;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.white-1e1d7{background-color:#f0d9b5;color:#b58863}.black-3c85d{background-color:#b58863;color:#f0d9b5}.highlight1-32417,.highlight2-9c5d2{box-shadow:inset 0 0 3px 3px #ff0}.notation-322f9{cursor:default;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:14px;position:absolute}.alpha-d2270{bottom:1px;right:3px}.numeric-fc462{top:2px;left:2px}`;
document.head.appendChild(style);

(function(Scratch) {
	"use strict";
	if (!Scratch.extensions.unsandboxed) {
		throw new Error("Chess Extension must run unsandboxed!")
	}
	class ChessExtension {
		constructor(runtime) {
			this.runtime = runtime;
			this.chess = null;
			this.board = null;
			this.loaded = false;
			this.settings = {
				position: 'center',
				size: 'large',
				customSize: null,
				interactive: true
			};
		}

		_createBoardElement() {
			if (this.wrapperElement) return;

			this.wrapperElement = document.createElement('div');
			this.wrapperElement.style.position = 'fixed';
			this.wrapperElement.style.display = 'none';
			this.wrapperElement.style.zIndex = '9999';

			const boardContainer = document.createElement('div');

			const boardSize = Scratch.vm.runtime.stageHeight;

			boardContainer.style.width = boardSize + 'px';
			boardContainer.style.height = boardSize + 'px';
			boardContainer.style.position = 'relative';
			boardContainer.style.pointerEvents = 'auto';

			this.boardElement = document.createElement('div');
			this.boardElement.id = 'chess-board';
			this.boardElement.style.width = '100%';
			this.boardElement.style.height = '100%';
			this.boardElement.style.position = 'relative';
			this.boardElement.style.pointerEvents = 'auto';

			boardContainer.appendChild(this.boardElement);
			this.wrapperElement.appendChild(boardContainer);

			document.body.appendChild(this.wrapperElement);
			Scratch.vm.renderer.addOverlay(this.wrapperElement, "scale");
		}

		_updateBoardPosition() {
			if (!this.wrapperElement) return;

			this.wrapperElement.style.top = '';
			this.wrapperElement.style.bottom = '';
			this.wrapperElement.style.left = '';
			this.wrapperElement.style.right = '';
			this.wrapperElement.style.transform = '';

			switch (this.settings.position) {
				case 'center':
					this.wrapperElement.style.top = '50%';
					this.wrapperElement.style.left = '50%';
					this.wrapperElement.style.transform = 'translate(-50%, -50%)';
					break;
				case 'topleft':
					this.wrapperElement.style.top = '10px';
					this.wrapperElement.style.left = '10px';
					break;
				case 'topright':
					this.wrapperElement.style.top = '10px';
					this.wrapperElement.style.right = '10px';
					break;
				case 'bottomleft':
					this.wrapperElement.style.bottom = '10px';
					this.wrapperElement.style.left = '10px';
					break;
				case 'bottomright':
					this.wrapperElement.style.bottom = '10px';
					this.wrapperElement.style.right = '10px';
					break;
			}
		}

		_updateBoardSize() {
			if (!this.wrapperElement) return;

			const stageHeight = Scratch.vm.runtime.stageHeight;
			const windowWidth = window.innerWidth;
			const windowHeight = window.innerHeight;

			const availableSpace = Math.min(
				stageHeight,
				windowWidth,
				windowHeight
			);

			let size;

			switch (this.settings.size) {
				case 'small':
					size = availableSpace * 0.4;
					break;
				case 'medium':
					size = availableSpace * 0.6;
					break;
				case 'large':
					size = availableSpace * 0.8;
					break;
				case 'full':
					size = availableSpace;
					break;
				case 'custom':
					size = Math.min(
						this.settings.customSize || availableSpace * 0.6,
						availableSpace
					);
					break;
				default:
					size = availableSpace * 0.6;
			}

			size = Math.min(size, availableSpace);

			this.wrapperElement.firstChild.style.width = size + 'px';
			this.wrapperElement.firstChild.style.height = size + 'px';

			if (this.board) {
				this.board.resize();
			}
		}

		async initializeBoard() {
			try {
				this.loaded = false;
				await this._loadLibraries();

				if (!this.wrapperElement) {
					this._createBoardElement();
				}

				this.chess = new Chess();

				if (this.board) {
					this.board.destroy();
				}

				this.wrapperElement.style.display = 'block';

				const config = {
					position: 'start',
					pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
					draggable: true,
					onDragStart: (source, piece, position, orientation) => this._onDragStart(source, piece, position, orientation),
					onDrop: (source, target) => this._onDrop(source, target),
					onSnapEnd: () => this._onSnapEnd()
				};

				setTimeout(() => {
					this.board = Chessboard(this.boardElement.id, config);
					this.toggleBoardInteractivity({
						INTERACTIVE: this.settings.interactive ? 'true' : 'false'
					});
					this.loaded = true;
				}, 100);

				window.addEventListener('resize', () => {
					if (this.board) {
						this._updateBoardSize();
						this.board.resize();
					}
				});

				return 'Chess game initialized';
			} catch (error) {
				console.error('Chess initialization error:', error);
				return 'Failed to initialize chess game: ' + error.message;
			}
		}

		removeHighlights() {
			const squares = document.querySelectorAll('#chess-board .square-55d63');
			squares.forEach(square => {
				square.classList.remove('highlight-white');
				square.classList.remove('highlight-black');
			});
		}

		highlightSquare(square) {
			if (!this.chess) return;

			const moves = this.chess.moves({
				square: square,
				verbose: true
			});

			if (moves.length === 0) return;

			const squareElement = document.querySelector(`#chess-board .square-${square}`);
			const background = squareElement.classList.contains('black-3c85d') ? 'highlight-black' : 'highlight-white';
			squareElement.classList.add(background);

			moves.forEach((move) => {
				const targetSquare = document.querySelector(`#chess-board .square-${move.to}`);
				const targetBackground = targetSquare.classList.contains('black-3c85d') ? 'highlight-black' : 'highlight-white';
				targetSquare.classList.add(targetBackground);
			});
		}

		_onDragStart(source, piece, position, orientation) {
			console.log("WE'RE DRAGGING STUFFFFFF")
			if (!this.chess) return false;

			if (this.chess.game_over()) return false;

			if ((this.chess.turn() === 'w' && piece.search(/^b/) !== -1) ||
				(this.chess.turn() === 'b' && piece.search(/^w/) !== -1)) {
				return false;
			}

			return true;
		}

		_onDrop(source, target) {
			if (!this.chess) return 'snapback';

			try {
				const move = this.chess.move({
					from: source,
					to: target,
					promotion: 'q'
				});

				if (move === null) return 'snapback';
				return;
			} catch (e) {
				return 'snapback';
			}
		}

		_onSnapEnd() {
			if (this.board && this.chess) {
				this.board.position(this.chess.fen());
			}
		}

		getInfo() {
			return {
				id: 'chessG1nX',
				name: 'Chess Extension',
				color1: '#B58863',
				docsURI: "https://hackmd.io/@vBTXv9pwQ3GoeueFKGElEw/chess-ext-docs",
				blocks: [{
						opcode: 'initializeBoard',
						blockType: 'command',
						text: 'initialize new chess game'
					},
					{
						opcode: 'showBoard',
						blockType: 'command',
						text: 'show chess board'
					},
					{
						opcode: 'hideBoard',
						blockType: 'command',
						text: 'hide chess board'
					},
					{
						opcode: 'initializeDetector',
						blockType: 'Boolean',
						text: 'has the board loaded yet?',
					},
					'---',
					{
						opcode: 'setBoardPosition',
						blockType: 'command',
						text: 'set board position to [POSITION]',
						arguments: {
							POSITION: {
								type: 'string',
								menu: 'positionMenu',
								defaultValue: 'center'
							}
						}
					},
					{
						opcode: 'setBoardSize',
						blockType: 'command',
						text: 'set board size to [SIZE]',
						arguments: {
							SIZE: {
								type: 'string',
								menu: 'sizeMenu',
								defaultValue: 'medium'
							}
						}
					},
					{
						opcode: 'setCustomBoardSize',
						blockType: 'command',
						text: 'set custom board size to [SIZE] pixels',
						arguments: {
							SIZE: {
								type: 'number',
								defaultValue: 300
							}
						}
					},
					{
						opcode: 'toggleBoardInteractivity',
						blockType: 'command',
						text: 'set board interactivity to [INTERACTIVE]',
						arguments: {
							INTERACTIVE: {
								type: 'string',
								menu: 'interactivityMenu',
								defaultValue: 'true'
							}
						}
					},
					'---',
					{
						opcode: 'makeMove',
						blockType: 'command',
						text: 'make move [MOVE]',
						arguments: {
							MOVE: {
								type: 'string',
								defaultValue: 'e2e4'
							}
						}
					},
					{
						opcode: 'isValidMove',
						blockType: 'Boolean',
						text: 'is [MOVE] valid?',
						arguments: {
							MOVE: {
								type: 'string',
								defaultValue: 'e2e4'
							}
						}
					},
					'---',
					{
						opcode: 'getFEN',
						blockType: 'reporter',
						text: 'get FEN position'
					},
					{
						opcode: 'setFEN',
						blockType: 'command',
						text: 'set board to FEN [FEN]',
						arguments: {
							FEN: {
								type: 'string',
								defaultValue: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
							}
						}
					},
					'---',
					{
						opcode: 'analyzeChessPosition',
						blockType: 'reporter',
						text: 'analyze chess position [FEN] with variants [VARIANTS] depth [DEPTH] max time [MAX_THINKING_TIME] search moves [SEARCH_MOVES]',
						arguments: {
							FEN: {
								type: 'string',
								defaultValue: 'current'
							},
							VARIANTS: {
								type: 'number',
								defaultValue: 1
							},
							DEPTH: {
								type: 'number',
								defaultValue: 12
							},
							MAX_THINKING_TIME: {
								type: 'number',
								defaultValue: 50
							},
							SEARCH_MOVES: {
								type: 'string',
								defaultValue: ''
							}
						}
					},
					'---',
					{
						opcode: 'isCheck',
						blockType: 'Boolean',
						text: 'is king in check?'
					},
					{
						opcode: 'isGameOver',
						blockType: 'Boolean',
						text: 'is game over?'
					},
					{
						opcode: 'getValidMoves',
						blockType: 'reporter',
						text: 'get all valid moves'
					},
					{
						opcode: 'getPieceAt',
						blockType: 'reporter',
						text: 'get piece at [SQUARE]',
						arguments: {
							SQUARE: {
								type: 'string',
								defaultValue: 'e4'
							}
						}
					},
					{
						opcode: 'getTurn',
						blockType: 'reporter',
						text: 'whose turn? (w/b)'
					},
					'---',
					{
						opcode: 'getPGN',
						blockType: 'reporter',
						text: 'get game PGN'
					},
					'---',
					{
						opcode: 'getPieceCount',
						blockType: 'reporter',
						text: 'count of [PIECE_TYPE] pieces for [COLOR]',
						arguments: {
							PIECE_TYPE: {
								type: 'string',
								menu: 'pieceTypeMenu',
								defaultValue: 'all'
							},
							COLOR: {
								type: 'string',
								menu: 'colorMenu',
								defaultValue: 'w'
							}
						}
					},
					{
						opcode: 'getMaterialScore',
						blockType: 'reporter',
						text: 'material score for [COLOR]',
						arguments: {
							COLOR: {
								type: 'string',
								menu: 'colorMenu',
								defaultValue: 'w'
							}
						}
					},
					{
						opcode: 'getAttackersOfSquare',
						blockType: 'reporter',
						text: 'attackers of square [SQUARE] by [COLOR]',
						arguments: {
							SQUARE: {
								type: 'string',
								defaultValue: 'e4'
							},
							COLOR: {
								type: 'string',
								menu: 'colorMenu',
								defaultValue: 'w'
							}
						}
					},
					{
						opcode: 'getPieceMoves',
						blockType: 'reporter',
						text: 'valid moves for piece at [SQUARE]',
						arguments: {
							SQUARE: {
								type: 'string',
								defaultValue: 'e2'
							}
						}
					},
					{
						opcode: 'getPositionScore',
						blockType: 'reporter',
						text: 'position evaluation score'
					},
					{
						opcode: 'getMoveHistory',
						blockType: 'reporter',
						text: 'get move history'
					}
				],
				menus: {
					positionMenu: {
						acceptReporters: false,
						items: ['center', 'topleft', 'topright', 'bottomleft', 'bottomright']
					},
					sizeMenu: {
						acceptReporters: false,
						items: ['small', 'medium', 'large', 'full']
					},
					pieceTypeMenu: {
						acceptReporters: false,
						items: ['all', 'p', 'n', 'b', 'r', 'q', 'k']
					},
					colorMenu: {
						acceptReporters: false,
						items: ['w', 'b']
					},
					interactivityMenu: {
						items: ['true', 'false']
					}
				}
			};
		}

		initializeDetector() {
			return this.loaded;
		}

		getPGN() {
			if (!this.chess) return '';
			return this.chess.pgn({
				maxWidth: 80,
				newline: '\n',
				showHeaders: true
			});
		}

		setFEN({
			FEN
		}) {
			if (!this.chess || !this.board) {
				return false;
			}

			try {
				const tempChess = new Chess(FEN);
				this.chess = tempChess;
				this.board.position(FEN);
			} catch (error) {
				console.error('Invalid FEN:', error);
				return false;
			}
		}

		toggleBoardInteractivity({
			INTERACTIVE
		}) {
			const isInteractive = INTERACTIVE === 'true';

			this.settings.interactive = isInteractive;

			if (this.boardElement) {
				const tempBoardDiv = document.querySelector('.board-b72b1');

				if (isInteractive) {
					tempBoardDiv.style.pointerEvents = 'auto';
				} else {
					tempBoardDiv.style.pointerEvents = 'none';
				}
			}

			return true;
		}

		async analyzeChessPosition({
			FEN,
			VARIANTS = 1,
			DEPTH = 12,
			MAX_THINKING_TIME = 50,
			SEARCH_MOVES = ''
		}) {
			let positionToAnalyze = FEN;

			if (FEN === 'current') {
				if (this.chess) {
					positionToAnalyze = this.chess.pgn({
						maxWidth: 80,
						newline: '\n',
						showHeaders: true
					});
				} else {
					positionToAnalyze = '';
				}
			}

			try {
				const response = await Scratch.fetch("https://chess-api.com/v1", {
					"headers": {
						"Content-Type": "application/json",
					},
					"body": JSON.stringify({
						variants: Math.max(1, Math.min(5, Scratch.Cast.toNumber(VARIANTS))),
						depth: Math.max(1, Math.min(18, Scratch.Cast.toNumber(DEPTH))),
						maxThinkingTime: Math.max(10, Math.min(100, Scratch.Cast.toNumber(MAX_THINKING_TIME))),
						searchmoves: SEARCH_MOVES,
						input: positionToAnalyze || '<div></div>'
					}),
					"method": "POST",
				});

				if (!response.ok) {
					return 'API request failed';
				}

				const data = await response.json();
				return JSON.stringify(data);
			} catch (error) {
				console.error('Chess API Error:', error);
				return 'Error analyzing position: ' + error.message;
			}
		}

		_isValidFEN(fen) {
			try {
				const tempChess = new Chess(fen);
				return true;
			} catch (error) {
				return false;
			}
		}

		getPieceValue(type) {
			return this.pieceValues[type] || 0;
		}

		getPieceCount({
			PIECE_TYPE,
			COLOR
		}) {
			if (!this.chess) return 0;

			let count = 0;
			const board = this.chess.board();

			for (let row of board) {
				for (let square of row) {
					if (square) {
						if (square.color === COLOR &&
							(PIECE_TYPE === 'all' || square.type === PIECE_TYPE)) {
							count++;
						}
					}
				}
			}

			return count;
		}

		_getPieceValue(pieceType) {
			if (!pieceType) return 0;

			const pieceValues = {
				p: 1,
				n: 3,
				b: 3,
				r: 5,
				q: 9,
				k: 0
			};

			return pieceValues[pieceType.toLowerCase()] || 0;
		}

		getMaterialScore({
			COLOR
		}) {
			if (!this.chess) return 0;

			let score = 0;
			const board = this.chess.board();

			for (let row of board) {
				for (let square of row) {
					if (square && square.color === COLOR) {
						score += this._getPieceValue(square.type);
					}
				}
			}

			return score;
		}

		getAttackersOfSquare({
			SQUARE,
			COLOR
		}) {
			if (!this.chess) return '[]';

			const attackers = [];
			const board = this.chess.board();

			const moves = this.chess.moves({
				verbose: true
			});
			for (let move of moves) {
				if (move.to === SQUARE && this.chess.get(move.from).color === COLOR) {
					attackers.push(move.from);
				}
			}

			return JSON.stringify(attackers);
		}

		getPieceMoves({
			SQUARE
		}) {
			if (!this.chess) return '[]';

			const moves = this.chess.moves({
				square: SQUARE,
				verbose: true
			});

			return JSON.stringify(moves.map(move => move.to));
		}

		getPositionScore() {
			if (!this.chess) return 0;

			const whiteMaterial = this.getMaterialScore({
				COLOR: 'w'
			});
			const blackMaterial = this.getMaterialScore({
				COLOR: 'b'
			});

			return whiteMaterial - blackMaterial;
		}

		getMoveHistory() {
			if (!this.chess) return '[]';
			return JSON.stringify(this.chess.history());
		}

		showBoard() {
			if (this.wrapperElement) {
				this.wrapperElement.style.display = 'block';
				if (this.board) {
					setTimeout(() => this.board.resize(), 0);
				}
			}
		}

		hideBoard() {
			if (this.wrapperElement) {
				this.wrapperElement.style.display = 'none';
			}
		}

		makeMove({
			MOVE
		}) {
			if (!this.chess || !this.board) return false;

			try {

				const cleanMove = MOVE.trim();

				let result = this.chess.move(cleanMove, {
					sloppy: true
				});

				if (!result && cleanMove.length === 4) {
					result = this.chess.move({
						from: cleanMove.substring(0, 2),
						to: cleanMove.substring(2, 4),
						promotion: 'q'
					});
				}

				if (result) {
					const newPosition = this.chess.fen();
					this.board.position(newPosition, false);
					return true;
				}

				return false;
			} catch (e) {
				console.error('Move error:', e);
				return false;
			}
		}

		isValidMove({
			MOVE
		}) {
			if (!this.chess) return false;
			try {

				const cleanMove = MOVE.trim();

				let move = this.chess.move(cleanMove, {
					sloppy: true
				});

				if (!move && cleanMove.length === 4) {
					move = this.chess.move({
						from: cleanMove.substring(0, 2),
						to: cleanMove.substring(2, 4)
					});
				}

				if (move) {
					this.chess.undo();
					return true;
				}
				return false;
			} catch (e) {
				return false;
			}
		}

		getFEN() {
			return this.chess ? this.chess.fen() : 'Board not initialized';
		}

		isCheck() {
			return this.chess ? this.chess.in_check() : false;
		}

		isGameOver() {
			return this.chess ? this.chess.game_over() : false;
		}

		getValidMoves() {
			if (!this.chess) return '[]';
			return JSON.stringify(this.chess.moves());
		}

		getPieceAt({
			SQUARE
		}) {
			if (!this.chess) return 'none';
			const piece = this.chess.get(SQUARE);
			return piece ? `${piece.color}${piece.type}` : 'none';
		}

		getTurn() {
			return this.chess ? this.chess.turn() : 'w';
		}

		setBoardPosition({
			POSITION
		}) {
			this.settings.position = POSITION;
			this._updateBoardPosition();
		}

		setBoardSize({
			SIZE
		}) {
			this.settings.size = SIZE;
			this.settings.customSize = null;
			this._updateBoardSize();
		}

		setCustomBoardSize({
			SIZE
		}) {
			this.settings.size = 'custom';
			this.settings.customSize = Math.max(100, Math.min(Scratch.Cast.toNumber(SIZE), Scratch.vm.runtime.stageHeight))
			this._updateBoardSize();
		}

		_cleanup() {
			if (this.board) {
				this.board.destroy();
				this.board = null;
			}
			if (this.chess) {
				this.chess = null;
			}
		}

		_loadLibraries() {
			this._createBoardElement()
			return new Promise((resolve) => {
				if (window.Chess && window.Chessboard) {
					resolve();
					return;
				}

				resolve();
			});
		}
	}

	Scratch.extensions.register(new ChessExtension());
})(Scratch);
