webpackJsonp([0],{276:function(n,e,t){"use strict";function r(n,e,t){return e in n?Object.defineProperty(n,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[e]=t,n}function u(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;return{type:i,payload:n}}function c(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:f,e=arguments[1],t=d[e.type];return t?t(n,e):n}Object.defineProperty(e,"__esModule",{value:!0}),t.d(e,"COUNTER_INCREMENT",function(){return i}),t.d(e,"COUNTER_DOUBLE_ASYNC",function(){return a}),e.increment=u,t.d(e,"doubleAsync",function(){return l}),t.d(e,"actions",function(){return s}),e.default=c;var o,i="COUNTER_INCREMENT",a="COUNTER_DOUBLE_ASYNC",l=function(){return function(n,e){return new Promise(function(t){setTimeout(function(){n({type:a,payload:e().counter}),t()},200)})}},s={increment:u,doubleAsync:l},d=(o={},r(o,i,function(n,e){return n+e.payload}),r(o,a,function(n,e){return 2*n}),o),f=0},277:function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=t(41),u=t(276),c=t(278),o={increment:function(){return Object(u.increment)(1)},doubleAsync:u.doubleAsync},i=function(n){return{counter:n.counter}};e.default=Object(r.connect)(i,o)(c.a)},278:function(n,e,t){"use strict";var r=t(0),u=t.n(r),c=t(1),o=t.n(c),i=function(n){var e=n.counter,t=n.increment,r=n.doubleAsync;return u.a.createElement("div",{style:{margin:"0 auto"}},u.a.createElement("h2",null,"Counter: ",e),u.a.createElement("button",{className:"btn btn-primary",onClick:t},"Increment")," ",u.a.createElement("button",{className:"btn btn-secondary",onClick:r},"Double (Async)"))};i.propTypes={counter:o.a.number.isRequired,increment:o.a.func.isRequired,doubleAsync:o.a.func.isRequired},e.a=i}});