"use strict";function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}var precacheConfig=[["index.html","c826feaf3b7c31eec7cb674a9d485682"],["static/css/main.9e7397e6.css","bf73309637305f391076ea1f6671bd3c"],["static/js/main.cf226752.js","08a11f9c8f83434ababef5e2a9a07a99"],["static/media/andrey.755157db.jpg","755157dbb9ec8f2b8d1ecb32c523782a"],["static/media/anton.22f24eb1.jpg","22f24eb173de1217ae52bbd5af050a01"],["static/media/evgeniya.966389c9.jpg","966389c9e1152275d300b3ef7756ff27"],["static/media/icon-header.f0b8cf09.png","f0b8cf09efa59bdebd7d5c2d17fa8dc8"],["static/media/icon_gif.803e08d6.svg","803e08d67f143ffcdf56d1ca5e7934ac"],["static/media/icon_other.fde2e768.svg","fde2e7682166dd7ba4f39f4f225c215b"],["static/media/icon_psd.f9541ef1.svg","f9541ef1bddb67ede1c017d088ba7ab7"],["static/media/icon_rar.ff2ffb91.svg","ff2ffb91e3c7223a846104e3fbfa783c"],["static/media/icon_zip.d789edc3.svg","d789edc33db490c310984c98984f49ff"],["static/media/julia.0d7c4d83.jpg","0d7c4d830ad5e7aa81cecfc75f215ede"],["static/media/sergey.bdf69206.jpg","bdf69206966538f6a4cc0fa6fcfde1ac"],["static/media/tanya.5ee93a9d.jpg","5ee93a9d77a9328bcaf425637e1bc207"],["static/media/unknown-user.5fa718c4.svg","5fa718c4f5cb60591ba64082a0676c9e"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,t){var n=new URL(e);return"/"===n.pathname.slice(-1)&&(n.pathname+=t),n.toString()},cleanResponse=function(e){return e.redirected?("body"in e?Promise.resolve(e.body):e.blob()).then(function(t){return new Response(t,{headers:e.headers,status:e.status,statusText:e.statusText})}):Promise.resolve(e)},createCacheKey=function(e,t,n,a){var r=new URL(e);return a&&r.pathname.match(a)||(r.search+=(r.search?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(n)),r.toString()},isPathWhitelisted=function(e,t){if(0===e.length)return!0;var n=new URL(t).pathname;return e.some(function(e){return n.match(e)})},stripIgnoredUrlParameters=function(e,t){var n=new URL(e);return n.hash="",n.search=n.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(e){return t.every(function(t){return!t.test(e[0])})}).map(function(e){return e.join("=")}).join("&"),n.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var t=e[0],n=e[1],a=new URL(t,self.location),r=createCacheKey(a,hashParamName,n,/\.\w{8}\./);return[a.toString(),r]}));self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(e){return setOfCachedUrls(e).then(function(t){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(n){if(!t.has(n)){var a=new Request(n,{credentials:"same-origin"});return fetch(a).then(function(t){if(!t.ok)throw new Error("Request for "+n+" returned a response with status "+t.status);return cleanResponse(t).then(function(t){return e.put(n,t)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var t=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(e){return e.keys().then(function(n){return Promise.all(n.map(function(n){if(!t.has(n.url))return e.delete(n)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(e){if("GET"===e.request.method){var t,n=stripIgnoredUrlParameters(e.request.url,ignoreUrlParametersMatching);t=urlsToCacheKeys.has(n);t||(n=addDirectoryIndex(n,"index.html"),t=urlsToCacheKeys.has(n));!t&&"navigate"===e.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],e.request.url)&&(n=new URL("/index.html",self.location).toString(),t=urlsToCacheKeys.has(n)),t&&e.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(n)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(t){return console.warn('Couldn\'t serve response for "%s" from cache: %O',e.request.url,t),fetch(e.request)}))}});