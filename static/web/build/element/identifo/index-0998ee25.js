let e,t,n=!1;const l="undefined"!=typeof window?window:{},o=l.document||{head:{}},s={t:0,l:"",jmp:e=>e(),raf:e=>requestAnimationFrame(e),ael:(e,t,n,l)=>e.addEventListener(t,n,l),rel:(e,t,n,l)=>e.removeEventListener(t,n,l),ce:(e,t)=>new CustomEvent(e,t)},c=e=>Promise.resolve(e),r=(()=>{try{return new CSSStyleSheet,"function"==typeof(new CSSStyleSheet).replace}catch(e){}return!1})(),i=new WeakMap,u=e=>"sc-"+e.o,a={},f=e=>"object"==(e=typeof e)||"function"===e,$=(e,t,...n)=>{let l=null,o=!1,s=!1,c=[];const r=t=>{for(let n=0;n<t.length;n++)l=t[n],Array.isArray(l)?r(l):null!=l&&"boolean"!=typeof l&&((o="function"!=typeof e&&!f(l))&&(l+=""),o&&s?c[c.length-1].i+=l:c.push(o?d(null,l):l),s=o)};if(r(n),t){const e=t.className||t.class;e&&(t.class="object"!=typeof e?e:Object.keys(e).filter((t=>e[t])).join(" "))}const i=d(e,null);return i.u=t,c.length>0&&(i.$=c),i},d=(e,t)=>({t:0,p:e,i:t,m:null,$:null,u:null}),p={},y=(e,t,n,o,c,r)=>{if(n!==o){let i=z(e,t),u=t.toLowerCase();if("class"===t){const t=e.classList,l=h(n),s=h(o);t.remove(...l.filter((e=>e&&!s.includes(e)))),t.add(...s.filter((e=>e&&!l.includes(e))))}else if(i||"o"!==t[0]||"n"!==t[1]){const l=f(o);if((i||l&&null!==o)&&!c)try{if(e.tagName.includes("-"))e[t]=o;else{let l=null==o?"":o;"list"===t?i=!1:null!=n&&e[t]==l||(e[t]=l)}}catch(e){}null==o||!1===o?!1===o&&""!==e.getAttribute(t)||e.removeAttribute(t):(!i||4&r||c)&&!l&&e.setAttribute(t,o=!0===o?"":o)}else t="-"===t[2]?t.slice(3):z(l,u)?u.slice(2):u[2]+t.slice(3),n&&s.rel(e,t,n,!1),o&&s.ael(e,t,o,!1)}},m=/\s/,h=e=>e?e.split(m):[],b=(e,t,n,l)=>{const o=11===t.m.nodeType&&t.m.host?t.m.host:t.m,s=e&&e.u||a,c=t.u||a;for(l in s)l in c||y(o,l,s[l],void 0,n,t.t);for(l in c)y(o,l,s[l],c[l],n,t.t)},w=(t,n,l)=>{let s,c,r=n.$[l],i=0;if(null!==r.i)s=r.m=o.createTextNode(r.i);else if(s=r.m=o.createElement(r.p),b(null,r,!1),null!=e&&s["s-si"]!==e&&s.classList.add(s["s-si"]=e),r.$)for(i=0;i<r.$.length;++i)c=w(t,r,i),c&&s.appendChild(c);return s},S=(e,n,l,o,s,c)=>{let r,i=e;for(i.shadowRoot&&i.tagName===t&&(i=i.shadowRoot);s<=c;++s)o[s]&&(r=w(null,l,s),r&&(o[s].m=r,i.insertBefore(r,n)))},g=(e,t,n,l)=>{for(;t<=n;++t)(l=e[t])&&l.m.remove()},j=(e,t)=>e.p===t.p,M=(e,t)=>{const n=t.m=e.m,l=e.$,o=t.$,s=t.i;null===s?(b(e,t,!1),null!==l&&null!==o?((e,t,n,l)=>{let o,s=0,c=0,r=t.length-1,i=t[0],u=t[r],a=l.length-1,f=l[0],$=l[a];for(;s<=r&&c<=a;)null==i?i=t[++s]:null==u?u=t[--r]:null==f?f=l[++c]:null==$?$=l[--a]:j(i,f)?(M(i,f),i=t[++s],f=l[++c]):j(u,$)?(M(u,$),u=t[--r],$=l[--a]):j(i,$)?(M(i,$),e.insertBefore(i.m,u.m.nextSibling),i=t[++s],$=l[--a]):j(u,f)?(M(u,f),e.insertBefore(u.m,i.m),u=t[--r],f=l[++c]):(o=w(t&&t[c],n,c),f=l[++c],o&&i.m.parentNode.insertBefore(o,i.m));s>r?S(e,null==l[a+1]?null:l[a+1].m,n,l,c,a):c>a&&g(t,s,r)})(n,l,t,o):null!==o?(null!==e.i&&(n.textContent=""),S(n,null,t,o,0,o.length-1)):null!==l&&g(l,0,l.length-1)):e.i!==s&&(n.data=s)},v=(e,t,n)=>{const l=(e=>N(e).h)(e);return{emit:e=>k(l,t,{bubbles:!!(4&n),composed:!!(2&n),cancelable:!!(1&n),detail:e})}},k=(e,t,n)=>{const l=s.ce(t,n);return e.dispatchEvent(l),l},C=(e,t)=>{t&&!e.S&&t["s-p"]&&t["s-p"].push(new Promise((t=>e.S=t)))},O=(e,t)=>{if(e.t|=16,!(4&e.t))return C(e,e.g),ee((()=>L(e,t)));e.t|=512},L=(e,t)=>{const n=e.j;let l;return t&&(l=E(n,"componentWillLoad")),l=T(l,(()=>E(n,"componentWillRender"))),T(l,(()=>P(e,n,t)))},P=async(e,t,n)=>{const l=e.h,s=l["s-rc"];n&&(e=>{const t=e.M,n=e.h,l=t.t,s=((e,t)=>{let n=u(t),l=I.get(n);if(e=11===e.nodeType?e:o,l)if("string"==typeof l){let t,s=i.get(e=e.head||e);s||i.set(e,s=new Set),s.has(n)||(t=o.createElement("style"),t.innerHTML=l,e.insertBefore(t,e.querySelector("link")),s&&s.add(n))}else e.adoptedStyleSheets.includes(l)||(e.adoptedStyleSheets=[...e.adoptedStyleSheets,l]);return n})(n.shadowRoot?n.shadowRoot:n.getRootNode(),t);10&l&&(n["s-sc"]=s,n.classList.add(s+"-h"))})(e);R(e,t),s&&(s.map((e=>e())),l["s-rc"]=void 0);{const t=l["s-p"],n=()=>W(e);0===t.length?n():(Promise.all(t).then(n),e.t|=4,t.length=0)}},R=(n,l)=>{try{l=l.render(),n.t&=-17,n.t|=2,((n,l)=>{const o=n.h,s=n.M,c=n.v||d(null,null),r=(e=>e&&e.p===p)(l)?l:$(null,null,l);t=o.tagName,s.k&&(r.u=r.u||{},s.k.map((([e,t])=>r.u[t]=o[e]))),r.p=null,r.t|=4,n.v=r,r.m=c.m=o.shadowRoot||o,e=o["s-sc"],M(c,r)})(n,l)}catch(e){B(e,n.h)}return null},W=e=>{const t=e.h,n=e.g;64&e.t||(e.t|=64,U(t),e.C(t),n||x()),e.S&&(e.S(),e.S=void 0),512&e.t&&Z((()=>O(e,!1))),e.t&=-517},x=()=>{U(o.documentElement),Z((()=>k(l,"appload",{detail:{namespace:"identifo"}})))},E=(e,t,n)=>{if(e&&e[t])try{return e[t](n)}catch(e){B(e)}},T=(e,t)=>e&&e.then?e.then(t):t(),U=e=>e.classList.add("hydrated"),A=(e,t,n)=>{if(t.O){const l=Object.entries(t.O),o=e.prototype;if(l.map((([e,[l]])=>{(31&l||2&n&&32&l)&&Object.defineProperty(o,e,{get(){return((e,t)=>N(this).L.get(t))(0,e)},set(n){((e,t,n,l)=>{const o=N(e),s=o.L.get(t),c=o.t,r=o.j;n=((e,t)=>null==e||f(e)?e:1&t?e+"":e)(n,l.O[t][0]),8&c&&void 0!==s||n===s||(o.L.set(t,n),r&&2==(18&c)&&O(o,!1))})(this,e,n,t)},configurable:!0,enumerable:!0})})),1&n){const n=new Map;o.attributeChangedCallback=function(e,t,l){s.jmp((()=>{const t=n.get(e);this[t]=(null!==l||"boolean"!=typeof this[t])&&l}))},e.observedAttributes=l.filter((([e,t])=>15&t[0])).map((([e,l])=>{const o=l[1]||e;return n.set(o,e),512&l[0]&&t.k.push([e,o]),o}))}}return e},q=(e,t={})=>{const n=[],c=t.exclude||[],i=l.customElements,a=o.head,f=a.querySelector("meta[charset]"),$=o.createElement("style"),d=[];let p,y=!0;Object.assign(s,t),s.l=new URL(t.resourcesUrl||"./",o.baseURI).href,e.map((e=>e[1].map((t=>{const l={t:t[0],o:t[1],O:t[2],P:t[3]};l.O=t[2],l.k=[];const o=l.o,a=class extends HTMLElement{constructor(e){super(e),_(e=this,l),1&l.t&&e.attachShadow({mode:"open"})}connectedCallback(){p&&(clearTimeout(p),p=null),y?d.push(this):s.jmp((()=>(e=>{if(0==(1&s.t)){const t=N(e),n=t.M,l=()=>{};if(!(1&t.t)){t.t|=1;{let n=e;for(;n=n.parentNode||n.host;)if(n["s-p"]){C(t,t.g=n);break}}n.O&&Object.entries(n.O).map((([t,[n]])=>{if(31&n&&e.hasOwnProperty(t)){const n=e[t];delete e[t],e[t]=n}})),(async(e,t,n,l,o)=>{if(0==(32&t.t)){{if(t.t|=32,(o=G(n)).then){const e=()=>{};o=await o,e()}o.isProxied||(A(o,n,2),o.isProxied=!0);const e=()=>{};t.t|=8;try{new o(t)}catch(e){B(e)}t.t&=-9,e()}if(o.style){let e=o.style;const t=u(n);if(!I.has(t)){const l=()=>{};((e,t,n)=>{let l=I.get(e);r&&n?(l=l||new CSSStyleSheet,l.replace(t)):l=t,I.set(e,l)})(t,e,!!(1&n.t)),l()}}}const s=t.g,c=()=>O(t,!0);s&&s["s-rc"]?s["s-rc"].push(c):c()})(0,t,n)}l()}})(this)))}disconnectedCallback(){s.jmp((()=>{}))}componentOnReady(){return N(this).R}};l.W=e[0],c.includes(o)||i.get(o)||(n.push(o),i.define(o,A(a,l,1)))})))),$.innerHTML=n+"{visibility:hidden}.hydrated{visibility:inherit}",$.setAttribute("data-styles",""),a.insertBefore($,f?f.nextSibling:a.firstChild),y=!1,d.length?d.map((e=>e.connectedCallback())):s.jmp((()=>p=setTimeout(x,30)))},F=e=>{const t=new URL(e,s.l);return t.origin!==l.location.origin?t.href:t.pathname},H=new WeakMap,N=e=>H.get(e),V=(e,t)=>H.set(t.j=e,t),_=(e,t)=>{const n={t:0,h:e,M:t,L:new Map};return n.R=new Promise((e=>n.C=e)),e["s-p"]=[],e["s-rc"]=[],H.set(e,n)},z=(e,t)=>t in e,B=(e,t)=>(0,console.error)(e,t),D=new Map,G=e=>{const t=e.o.replace(/-/g,"_"),n=e.W,l=D.get(n);return l?l[t]:import(`./${n}.entry.js`).then((e=>(D.set(n,e),e[t])),B)},I=new Map,J=[],K=[],Q=(e,t)=>l=>{e.push(l),n||(n=!0,t&&4&s.t?Z(Y):s.raf(Y))},X=e=>{for(let t=0;t<e.length;t++)try{e[t](performance.now())}catch(e){B(e)}e.length=0},Y=()=>{X(J),X(K),(n=J.length>0)&&s.raf(Y)},Z=e=>c().then(e),ee=Q(K,!0);export{q as b,v as c,F as g,$ as h,c as p,V as r}