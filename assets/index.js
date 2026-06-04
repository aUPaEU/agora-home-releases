(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=class{owner;state;lastState;constructor(e,t){this.owner=t,this.state=e,this.lastState=e}set(e,t=!0){switch(typeof e){case typeof this.state:this.state=e,this.lastState=this.state;break;case`function`:this.state=e(this.lastState),this.lastState=this.state;break;default:throw Error(`Invalid state update. Must be a value of the same type or a function.`)}t&&this.owner.render()}get(){return this.state}getLast(){return this.lastState}},t=class e{static instances=new Map;subscribers=new Set;name;attachedComponent;subscribeToContext=!1;location=`session`;constructor(t,n,r=!1,i=`session`){this.name=`${t}Context`,this.attachedComponent=n,this.subscribeToContext=r,this.location=i;let a=e.instances.get(this.name);if(a)return this.subscribeToContext&&a.subscribe(this.attachedComponent),a;this.initialize(),this.subscribeToContext&&this.subscribe(this.attachedComponent),e.instances.set(this.name,this)}initialize(){switch(this.location){case`local`:localStorage.getItem(this.name)||localStorage.setItem(this.name,JSON.stringify({}));break;case`session`:sessionStorage.getItem(this.name)||sessionStorage.setItem(this.name,JSON.stringify({}));break}}subscribe(e){this.subscribers.add(e)}propagate(){this.subscribers.forEach(e=>e.render())}get(e){let t=this.location===`local`?localStorage.getItem(this.name):sessionStorage.getItem(this.name),n=JSON.parse(t??`{}`);return e?e.split(`.`).reduce((e,t)=>e?.[t],n):n}set(e,t,n=!1){let r;typeof t==`string`?r=t:typeof t==`boolean`&&(n=t);let i=(e,t,n)=>{let r=t.split(`.`);return r.reduce((e,t,i)=>(i===r.length-1?e[t]=n:((!e[t]||typeof e[t]!=`object`)&&(e[t]={}),e=e[t]),e),e),e};if(this.location===`local`){let t=JSON.parse(localStorage.getItem(this.name)||`{}`);if(r){let n=i(t,r,e);localStorage.setItem(this.name,JSON.stringify(n))}else localStorage.setItem(this.name,JSON.stringify(e))}else{let t=JSON.parse(sessionStorage.getItem(this.name)||`{}`);if(r){let n=i(t,r,e);sessionStorage.setItem(this.name,JSON.stringify(n))}else sessionStorage.setItem(this.name,JSON.stringify(e))}n&&this.propagate()}clear(){this.location===`local`?localStorage.removeItem(this.name):sessionStorage.removeItem(this.name),e.instances.delete(this.name)}},n=class{app;root;routes=new Map;currentRoute;constructor(e,t=`/`){this.app=e,this.root=t,this.currentRoute=window.location.pathname,this.initialize()}initialize(){window.onpopstate=()=>this.handleRouteChange()}start(e){this.routes=new Map(Object.entries(e));let t=this.parse();if(t in e)return e[t];for(let[n,r]of Object.entries(e)){if(n===`*`)continue;let e=this.matchRoute(n,t);if(e)return this.injectParams(r,e.params)}return e[`*`]}navigateTo(e){let t=this.addRoot(e);window.history.pushState(null,``,t),this.handleRouteChange()}getRoutes(){return this.routes}handleRouteChange(){this.currentRoute=this.stripRoot(window.location.pathname||`/`),this.app.render()}matchRoute(e,t){let n=e.split(`/`).filter(e=>e),r=t.split(`/`).filter(e=>e);if(n.length!==r.length)return null;let i={};for(let e=0;e<n.length;e++){let t=n[e],a=r[e];if(t.startsWith(`:`)){let e=t.slice(1);i[e]=a}else if(t!==a)return null}return{params:i}}injectParams(e,t){if(Object.keys(t).length===0)return e;let n=e.match(/^(\s*<[a-zA-Z][\w-]*)(\s|>|\/)/);if(!n)return e;let r=Object.entries(t).map(([e,t])=>`param-${e}="${this.escapeHtml(t)}"`).join(` `),i=n[1].length;return e.slice(0,i)+` `+r+e.slice(i)}stripRoot(e){if(this.root===`/`)return e;let t=this.root.endsWith(`/`)?this.root.slice(0,-1):this.root;return e.startsWith(t)?e.slice(t.length)||`/`:e}addRoot(e){if(this.root===`/`)return e;let t=this.root.endsWith(`/`)?this.root.slice(0,-1):this.root,n=e.startsWith(`/`)?e:`/${e}`;return`${t}${n}`}parse(){return this.stripRoot(window.location.pathname)}escapeHtml(e){let t={"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#039;`};return e.replace(/[&<>"']/g,e=>t[e])}},r=class{owner;registry;constructor(e){if(!e)throw Error(`You need to specify the owner of the signal. Use 'this' as default.`);this.owner=e,this.registry={}}register(e){if(!this.registry[e])this.registry[e]=[];else throw Error(`'${e}' signal already exists.`)}connect(e,t,n){if(e.signals.registry[t])e.signals.registry[t].push({element:this.owner,callback:n});else throw Error(`${e}:'${t}' signal does not exist. Maybe you're trying to connect to ${this.similarSignal(t)}...`)}emit(e,t=null){this.registry[e].forEach(e=>{e.element[e.callback.name]?t?e.element[e.callback.name](t):e.element[e.callback.name]():t?e.callback(t):e.callback()})}similarSignal(e){let t={};Object.keys(this.registry).forEach(n=>{let r=0;e.split(``).forEach((e,t)=>{n.length-1<=t&&n[t]===e&&r++}),t[n]=r});let n=null,r=0;return Object.entries(t).forEach(([e,t])=>{t>r&&(r=t,n=e)}),n}},i=class extends HTMLElement{parent=null;name;wrapper;shadow;styles;mode;props;signals=void 0;constructor(e,t=``,n=`open`){super(),this.name=e,this.mode=n,this.shadow=this.setupShadow(),this.wrapper=this.setupWrapper(),this.styles=this.setupStyles(t),this.parent=this.setupParent(),this.props=this.setupProps(),this.initialize()}initialize(){this.shadow.appendChild(this.styles),this.shadow.appendChild(this.wrapper)}setupShadow(){return this.attachShadow({mode:this.mode})}setupWrapper(){let e=document.createElement(`section`);return e.className=`${this.name}-wrapper`,e}setupStyles(e=``){let t=document.createElement(`style`);return t.innerHTML=e,t}setupParent(){if(!this.parentElement)return null;let e=this.parentElement.getRootNode();return e instanceof ShadowRoot?e.host:this.parentElement}setupProps(){let e={},t=Array.from(this.attributes),n=e=>e.includes(`-`)?e.split(`-`).map((e,t)=>t===0?e:e.charAt(0).toUpperCase()+e.slice(1)).join(``):e.includes(`:`)?e.split(`:`).map((e,t)=>t===0?e:e.charAt(0).toUpperCase()+e.slice(1)).join(``):e.includes(`.`)?e.split(`.`).map((e,t)=>t===0?e:e.charAt(0).toUpperCase()+e.slice(1)).join(``):e;for(let r of t)e[n(r.name)]=r.value;if(!this.parent)return e;let r={};for(let e of t)e.value in this.parent&&(this.parent[e.value]instanceof Function?r[n(e.name)]=this.parent[e.value].bind(this.parent):r[n(e.name)]=this.parent[e.value]);return Object.assign(e,r),e}render(){this.beforeRender(),this.wrapper.innerHTML=this.template(),this.listeners(),this.connectors(),this.afterRender()}template(){return``}listeners(){}connectors(){}connectedCallback(){this.render(),this.onMount()}disconnectedCallback(){this.onDismount()}onMount(){}onDismount(){}beforeRender(){}afterRender(){}html(e,...t){return e.reduce((e,n,r)=>e+n+(t[r]||``),``)}static css(e,...t){return e.reduce((e,n,r)=>e+n+(t[r]||``),``)}$(e){return this.shadow.querySelector(e)}$$(e){return this.shadow.querySelectorAll(e)}useState(t){return new e(t,this)}useContext(e,n=!1,r=`session`){return new t(e,this,n,r)}useRouter(){return new n(this)}useSignals(){return this.signals||=new r(this),this.signals}},a=`* {
    transition: 300ms all ease-in-out;
}

/* Utility class to disable transitions */
.no-transition,
.no-transition * {
    transition: none !important;
}
`,o=`.agora-app-wrapper {
    position: relative;
    box-sizing: border-box;

    display: flex;
    height: 100vh;
    /* width: 100vw; */

    overflow: hidden;

    background-color: white;
}

.agora-app-wrapper.agora-app-wrapper--with-background {
    background-image:
        linear-gradient(rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.5)),
        var(--agora-wrapper-bg-image);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}
`,s=`.left-panel {
    flex: 1;

    display: flex;
    flex-direction: column;
    justify-content: stretch;
    align-items: stretch;

    flex: 0 0 420px;
    width: 420px;
    max-width: 420px;

    position: relative;
    z-index: 50;
    background: white !important;

    /* background-color: white; */
    
    transition: flex 300ms ease, opacity 300ms ease, transform 300ms ease, min-width 300ms ease;
}

.left-panel--header {
    padding: 16px;
    /* justify-content: center; -- Overriden/merged with later rule? */
    flex: 0 0 100px;

    /* Merging from later section */
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center; /* Merged */
}

.left-panel--nav {
    padding: 16px;

    flex: 1;

    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-gutter: stable;
}

.left-panel--nav::-webkit-scrollbar {
    width: 4px;
}

.left-panel--nav::-webkit-scrollbar-track {
    background: transparent;
}

.left-panel--nav::-webkit-scrollbar-thumb {
    background: #e7e8e9;
    border-radius: 50pt;
}

.left-panel--nav::-webkit-scrollbar-button {
    display: none;
}

.left-panel--footer {
    max-height: 200px;
    flex: 0 0 200px;
    padding: 16px;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.left-panel--footer plain-carousel {
    height: 200px !important;
    width: 350px !important;
}

/* NAV COLLAPSE BUTTON */
.nav-collapse-btn {
    position: absolute;
    bottom: 0;
    right: 16px;
    
    display: flex;
    align-items: center;
    justify-content: center;
    
    width: 32px;
    height: 32px;
    padding: 0;
    
    background: transparent;
    border: none;
    border-radius: 6px;
    
    color: #9aa0a6;
    cursor: pointer;
    
    transition: all 200ms ease;
}

.nav-collapse-btn:hover {
    background: #f1f3f4;
    color: #5f6368;
}

.nav-collapse-btn svg {
    width: 20px;
    height: 20px;
}

/* NAV HOVER ZONE - invisible strip on the left edge */
.nav-hover-zone {
    position: fixed;
    left: 0;
    top: 0;
    width: 12px;
    height: 100vh;
    z-index: 100;
    
    opacity: 0;
    pointer-events: none;
    
    transition: opacity 200ms ease, background 200ms ease;
}

.nav-hover-zone.active {
    pointer-events: auto;
    opacity: 1;
}

/* Visual indicator tab when nav is collapsed */
.nav-hover-zone.active::before {
    content: '›';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    
    width: 32px;
    height: 56px;
    
    display: flex;
    align-items: center;
    justify-content: center;
    
    font-size: 24px;
    color: #5f6368;

    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(190, 190, 190);
    border-left: none;
    border-radius: 0 12px 12px 0;
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.08);
    
    transition: width 200ms ease, box-shadow 200ms ease, background 200ms ease;
}

.nav-hover-zone.active:hover::before {
    width: 28px;
    background: rgba(255, 255, 255, 0.85);
    box-shadow: 4px 0 16px rgba(0, 0, 0, 0.12);
    color: #3c4043;
}

.nav-hover-zone.active:hover {
    background: linear-gradient(to right, rgba(0, 0, 0, 0.03), transparent);
}

/* LEFT PANEL COLLAPSED STATE */
.left-panel.nav-collapsed {
    flex: 0 0 0px;
    overflow: hidden;
    opacity: 0;
    transform: translateX(-100%);
    pointer-events: none;
}

/* Intermediate state for smooth collapse animation */
.left-panel.nav-collapsing {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    min-width: calc(350px + 32px);
    flex: none;
    
    opacity: 0;
    transform: translateX(-100%);
    pointer-events: none;
    
    background: #fff;
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0);
    z-index: 99;
}

/* LEFT PANEL HOVER EXPANDED STATE (when collapsed but hovering) */
.left-panel.nav-hover-expanded {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    min-width: calc(350px + 32px); /* carousel width + paddings */
    flex: none;
    
    opacity: 1;
    transform: translateX(0);
    pointer-events: auto;
    
    background: #fff;
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.12);
    z-index: 20000;
}

.left-panel.nav-hover-expanded .left-panel--header,
.left-panel.nav-hover-expanded .left-panel--nav,
.left-panel.nav-hover-expanded .left-panel--footer {
    opacity: 1;
}

/* Hide collapse button when panel is collapsed */
.left-panel.nav-collapsed .nav-collapse-btn {
    opacity: 0;
    pointer-events: none;
}
`,c=`.main-panel {
    margin-inline: auto;

    flex: 3;

    display: flex;
    flex-direction: column;
    justify-content: stretch;
    align-items: stretch;

    max-width: 1400px;
    min-width: 0;
}

.main-panel--header {
    padding: 16px;

    flex: 2;
}

.main-panel--content {
    padding: 16px;

    flex: 3;

    min-height: 0;

    transition: flex 1s ease-out;

    position: relative; /* Needed for absolute positioning of children */
}

.main-panel--footer {
    padding: 16px;
    padding-bottom: 32px;

    flex: 0 0 100px;
}

/* HOVER RESIZINGS */
/* .main-panel--header:hover {
    flex: 5;
} */

.main-panel--content:hover {
    flex: 10;
}
`,l=`.right-panel {
    position: relative;
    z-index: 50;
    background: inherit;

    flex: 0 0 420px;
    width: 420px;
    max-width: 420px;

    display: flex;
    flex-direction: column;

    background: white !important;

    transition: flex 300ms ease, opacity 300ms ease, min-width 300ms ease, transform 300ms ease, width 300ms ease;
    overflow: hidden;
}

.right-panel--header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 16px;
    flex: 0 0 auto;
}

@media (max-width: 768px) {
    .right-panel--header {
        margin-top: 56px;
    }
}

.right-panel--content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-gutter: stable;
}

.right-panel.collapsed {
    flex: 0 0 0px !important;
    width: 0 !important;
    min-width: 0;
    opacity: 0;
    pointer-events: none;
}

.right-panel--content::-webkit-scrollbar {
    width: 4px;
}

.right-panel--content::-webkit-scrollbar-track {
    background: transparent;
}

.right-panel--content::-webkit-scrollbar-thumb {
    background: #e7e8e9;
    border-radius: 50pt;
}

.right-panel--content::-webkit-scrollbar-button {
    display: none;
}

/* RIGHT PANEL COLLAPSE BUTTON */
.right-panel-collapse-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    
    width: 32px;
    height: 32px;
    padding: 0;
    
    background: transparent;
    border: none;
    border-radius: 6px;
    
    color: #9aa0a6;
    cursor: pointer;
    
    transition: all 200ms ease;
}

.right-panel-collapse-btn:hover {
    background: #f1f3f4;
    color: #5f6368;
}

.right-panel-collapse-btn svg {
    width: 20px;
    height: 20px;
}

/* RIGHT PANEL HOVER ZONE - invisible strip on the right edge */
.right-panel-hover-zone {
    position: fixed;
    right: 0;
    top: 0;
    width: 12px;
    height: 100vh;
    z-index: 100;
    
    opacity: 0;
    pointer-events: none;
    
    transition: opacity 200ms ease, background 200ms ease;
}

.right-panel-hover-zone.active {
    pointer-events: auto;
    opacity: 1;
}

/* Visual indicator tab when right panel is collapsed */
.right-panel-hover-zone.active::before {
    content: '‹';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    
    width: 32px;
    height: 56px;
    
    display: flex;
    align-items: center;
    justify-content: center;
    
    font-size: 24px;
    color: #5f6368;

    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(190, 190, 190);
    border-right: none;
    border-radius: 12px 0 0 12px;
    box-shadow: -2px 0 12px rgba(0, 0, 0, 0.08);
    
    transition: width 200ms ease, box-shadow 200ms ease, background 200ms ease;
}

.right-panel-hover-zone.active:hover::before {
    width: 28px;
    background: rgba(255, 255, 255, 0.85);
    box-shadow: -4px 0 16px rgba(0, 0, 0, 0.12);
    color: #3c4043;
}

.right-panel-hover-zone.active:hover {
    background: linear-gradient(to left, rgba(0, 0, 0, 0.03), transparent);
}

/* RIGHT PANEL COLLAPSED STATE (manual collapse) */
.right-panel.panel-collapsed {
    flex: 0 0 0px;
    overflow: hidden;
    opacity: 0;
    transform: translateX(100%);
    pointer-events: none;
}

/* Intermediate state for smooth collapse animation */
.right-panel.panel-collapsing {
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    width: 420px;
    max-width: 420px;
    flex: none;
    
    opacity: 0;
    transform: translateX(100%);
    pointer-events: none;
    
    background: #fff;
    box-shadow: -4px 0 24px rgba(0, 0, 0, 0);
    z-index: 99;
}

/* RIGHT PANEL HOVER EXPANDED STATE (when collapsed but hovering) */
.right-panel.panel-hover-expanded {
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    width: 420px;
    max-width: 420px;
    flex: none;
    
    opacity: 1;
    transform: translateX(0);
    pointer-events: auto;
    
    background: #fff;
    box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12);
    z-index: 20000;
}

.right-panel.panel-hover-expanded .right-panel--header,
.right-panel.panel-hover-expanded .right-panel--content {
    opacity: 1;
}

/* Hide collapse button when panel is collapsed */
.right-panel.panel-collapsed .right-panel-collapse-btn {
    opacity: 0;
    pointer-events: none;
}
`,u=`.content-split {
    position: absolute;
    inset: 16px;
    display: flex;
    gap: 16px;
    width: auto;
    height: auto;
}

.content-left {
    flex: 0;
    min-width: 0;
    overflow: hidden;
    transition: flex 400ms ease, min-width 400ms ease, opacity 400ms ease;
    opacity: 0;
}

.content-left.has-content {
    flex: 1;
    min-width: 300px;
    opacity: 1;
}

.content-right {
    flex: 1;
    position: relative;
    min-width: 0;
    transition: flex 400ms ease, min-width 400ms ease, opacity 400ms ease;
}

/* When chat has content and results exist, use 2:3 ratio */
.content-left.has-content {
    flex: 2;
}

.content-left.has-content ~ .content-right.has-results {
    flex: 3;
}

/* When chat has content but no results, collapse content-right */
.content-left.has-content ~ .content-right:not(.has-results) {
    flex: 0;
    min-width: 0;
    opacity: 0;
    overflow: hidden;
}

/* Chat-expanded mode: chat fills the main area, results pane is squeezed out */
.content-split.chat-expanded .content-left.has-content {
    flex: 1 1 100%;
    min-width: 0;
}

.content-split.chat-expanded .content-right {
    flex: 0;
    min-width: 0;
    opacity: 0;
    overflow: hidden;
}

/* Position carousel and artifact display within content-right */
.content-right > * {
    position: absolute;
    inset: 0;
    transition: opacity 500ms ease-in-out, visibility 500ms ease-in-out;
}
`,d=`.faded-in {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    z-index: 1;
}

.faded-out {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    z-index: 0;
}

.collapsed {
    flex: 0 0 0px !important;
    padding: 0 !important;
    overflow: hidden;
    opacity: 0;
}

.display-none {
    display: none !important;
}
`,f=`.welcome-banner {
    display: flex;
    gap: 16px;
}

.welcome-banner plain-carousel,
.welcome-banner plain-metagora-carousel {
    flex: 1;
}
`,p=`.agora-app-wrapper:has(>.mobile-warning) {
    width: 100vw;

    display: grid;
    place-content: center;
}

.mobile-warning {
    padding-inline: 48px;
    box-sizing: border-box;
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 16px;
}

.mobile-warning h2 {
    margin: 0;

    font-family: var(--agora-font-title, 'Sora'), sans-serif;
    font-size: 16px;
    text-wrap: pretty;
}
.mobile-warning p {
    margin: 0;

    font-family: var(--agora-font-body, 'Geist'), sans-serif;
    font-size: 12px;

    text-wrap: pretty;
}`,m=`/* ========================================
   MOBILE HEADER (hamburger + logo bar)
   ======================================== */
.mobile-header {
    padding: 8px 16px;
    margin-top: 16px;
    box-sizing: border-box;

    height: 56px;

    display: none;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-shrink: 0;

    z-index: 60;
    background: inherit;
}

.mobile-header plain-logo {
    height: 40px;
}

/* ========================================
   HAMBURGER BUTTON
   ======================================== */
.hamburger-btn {
    display: none;
    align-items: center;
    justify-content: center;
    width: auto;
    height: 40px;
    padding: 0 20px;
    border: 1px solid;
    border-radius: 8px;
    color: #ffffff;
    cursor: pointer;
    z-index: 70;
    flex-shrink: 0;

    font-family: var(--agora-font-body, 'Geist Mono'), monospace;
    font-size: 12px;
    font-weight: 600;
    transition: all 0.2s ease;
    background-color: transparent;
}

.hamburger-btn:active {
    animation: boing 200ms ease;
}

@keyframes boing {
    0% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-2px);
    }
    100% {
        transform: translateY(0);
    }
}

.hamburger-btn svg {
    width: 24px;
    height: 24px;
}

/* ========================================
   DRAWER BACKDROP
   ======================================== */
.drawer-backdrop {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 90;
    opacity: 0;
    pointer-events: none;
}

.drawer-backdrop.active {
    opacity: 1;
    pointer-events: auto;
}

/* ========================================
   DRAWER CLOSE BUTTON (inside left panel)
   ======================================== */
.drawer-close-btn {
    display: none;
}

/* ========================================
   RIGHT PANEL CLOSE BUTTON (mobile only)
   ======================================== */
.right-panel-close-btn {
    display: none;
}

/* ========================================
   FILTER FAB
   ======================================== */
.filter-fab {
    display: none;
}

/* ========================================
   TABLET BREAKPOINT (max-width: 1024px)
   ======================================== */
@media (max-width: 1024px) {
    /* Disable the global transition rule to prevent janky resize transitions */
    * {
        transition: none !important;
    }

    plain-chat-window {
        width: 100%;
    }

    /* Re-enable transitions only for drawer and backdrop elements */
    .left-panel,
    .left-panel.drawer-open,
    .right-panel,
    .drawer-backdrop,
    .drawer-backdrop.active {
        transition: transform 300ms ease, opacity 300ms ease, box-shadow 300ms ease !important;
    }

    /* MOBILE HEADER */
    .mobile-header {
        display: flex;
    }

    .hamburger-btn {
        display: flex;
    }

    /* WRAPPER: switch to column layout */
    .agora-app-wrapper {
        flex-direction: column;
        height: 100dvh;
    }

    /* LEFT PANEL: fixed drawer from left */
    .left-panel {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        width: 320px;
        max-width: 85vw;
        flex: none !important;
        z-index: 100;
        background: #fff;
        transform: translateX(-100%);
        box-shadow: none;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .left-panel.drawer-open {
        transform: translateX(0);
        box-shadow: 4px 0 24px rgba(0, 0, 0, 0.12);
        min-width: 100%;
        z-index: 50000;
    }

    /* DRAWER BACKDROP */
    .drawer-backdrop {
        display: block;
    }

    /* DRAWER CLOSE BUTTON */
    .drawer-close-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        padding: 0;
        background: transparent;
        border: none;
        border-radius: 8px;
        color: #9aa0a6;
        cursor: pointer;
        position: absolute;
        top: 12px;
        right: 12px;
        z-index: 10;
    }

    .drawer-close-btn:hover {
        background: #f1f3f4;
        color: #5f6368;
    }

    .drawer-close-btn svg {
        width: 20px;
        height: 20px;
    }

    /* Hide desktop-only collapse controls */
    .nav-collapse-btn {
        display: none !important;
    }

    .nav-hover-zone {
        display: none !important;
    }

    .right-panel-hover-zone {
        display: none !important;
    }

    /* Override nav-collapsed state for mobile drawer behavior */
    .left-panel.nav-collapsed {
        flex: none !important;
        opacity: 1;
        transform: translateX(-100%);
        pointer-events: auto;
    }

    .left-panel.nav-collapsed.drawer-open {
        transform: translateX(0);
    }

    /* Disable hover-expand states on mobile */
    .left-panel.nav-hover-expanded {
        position: fixed;
        transform: translateX(-100%);
        box-shadow: none;
        opacity: 1;
    }

    .left-panel.nav-hover-expanded.drawer-open {
        transform: translateX(0);
        box-shadow: 4px 0 24px rgba(0, 0, 0, 0.12);
    }

    /* MAIN PANEL: takes full width */
    .main-panel {
        flex: 1;
        width: 100%;
        max-width: none;
        min-height: 0;
    }

    /* RIGHT PANEL: slide-in overlay from right */
    .right-panel {
        position: fixed;
        right: 0;
        top: 0;
        bottom: 0;
        width: 360px;
        max-width: 85vw;
        z-index: 100;
        background: #fff;
        flex: none !important;
        transform: translateX(100%);
        box-shadow: none;
        opacity: 1 !important;
        pointer-events: auto !important;
    }

    .right-panel:not(.collapsed):not(.panel-collapsed) {
        transform: translateX(0);
        box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12);
    }

    /* Override collapsed state for overlay behavior */
    .right-panel.collapsed {
        flex: none !important;
        width: 360px !important;
        max-width: 85vw;
        opacity: 0 !important;
        transform: translateX(100%);
        pointer-events: none !important;
    }

    /* Disable hover-expand on right panel */
    .right-panel.panel-hover-expanded {
        position: fixed;
        transform: translateX(100%);
        box-shadow: none;
    }

    /* RIGHT PANEL CLOSE BUTTON */
    .right-panel-close-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        padding: 0;
        background: transparent;
        border: none;
        border-radius: 8px;
        color: #9aa0a6;
        cursor: pointer;
    }

    .right-panel-close-btn:hover {
        background: #f1f3f4;
        color: #5f6368;
    }

    .right-panel-close-btn svg {
        width: 20px;
        height: 20px;
    }

    /* Hide desktop collapse button on mobile */
    .right-panel-collapse-btn {
        display: none !important;
    }

    /* CONTENT SPLIT: stack vertically */
    .content-split {
        flex-direction: column;
        position: relative;
        inset: 0;
        height: 100%;
    }

    .content-right {
        flex: 1;
        min-height: 0;
    }

    /* In search mode (no has-content), fully collapse content-left */
    .content-left {
        display: none;
    }

    .content-left.has-content {
        display: flex;
        flex: 1;
        min-width: 0;
        min-height: 0;
    }

    /* On mobile, chat takes full space — collapse results when chat is active */
    .content-left.has-content ~ .content-right {
        flex: 0 0 0;
        min-height: 0;
        max-height: 0;
        opacity: 0;
        overflow: hidden;
    }

    /* FILTER FAB */
    .filter-fab {
        position: fixed;
        bottom: 140px;
        right: 16px;
        z-index: 80;

        align-items: center;
        gap: 6px;

        padding: 10px 16px;
        background: #1f2937;
        color: white;
        border: none;
        border-radius: 24px;
        font-family: inherit;
        font-size: 13px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        cursor: pointer;

        opacity: 0;
        pointer-events: none;
    }

    .filter-fab.visible {
        display: flex;
        opacity: 1;
        pointer-events: auto;
    }

    .filter-fab svg {
        width: 16px;
        height: 16px;
    }
}

/* ========================================
   MOBILE BREAKPOINT (max-width: 768px)
   ======================================== */
@media (max-width: 768px) {
    .left-panel {
        width: 280px;
    }

    .right-panel,
    .right-panel.collapsed {
        width: 100% !important;
        max-width: none;
    }

    .main-panel--header {
        padding: 8px 16px;
        flex: 0 0 auto;
    }

    .main-panel--content {
        padding: 8px;
    }

    .main-panel--footer {
        padding: 0;
        flex: 0 0 0px;
        overflow: hidden;
    }

    /* Content split: stacked with relative positioning */
    .content-split {
        height: 90%;
    }

    /* Hide left panel footer (small carousel) on mobile */
    .left-panel--footer {
        display: none;
    }

    /* Adjust filter FAB position - above fixed input */
    .filter-fab {
        bottom: 162px;
        right: 12px;
    }

    /* Content section takes remaining space */
    .main-panel--content {
        flex: 1;
        min-height: 0;
    }
}
`,h=`.plain-logo-wrapper {
    width: 100%;
    height: 100%;

    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 8px;

    font-family: var(--agora-font-title, 'Sora'), sans-serif;
    font-size: clamp(24px, 8vw, 48px);
} 

.logo {
    font-weight: 500;
}

.logo-subtext {
    margin-bottom: 8px;

    opacity: 0.6;

    font-family: var(--agora-font-body, 'Geist Mono'), monospace;
    font-weight: 400;
    font-size: clamp(12px, 3vw, 24px);
}

.dot {
    font-weight: 300;
    border-radius: 100pt;
}

/* Skeleton Loader Styles */
.skeleton-logo {
    display: flex;
    align-items: flex-end;
    gap: 8px;
}

.skeleton-text {
    border-radius: 4px;
    background: linear-gradient(90deg, #e8eaec 25%, #f3f4f5 50%, #e8eaec 75%);
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

.skeleton-company {
    width: 120px;
    height: clamp(24px, 8vw, 48px);
}

.skeleton-subtext {
    width: 60px;
    height: clamp(12px, 3vw, 24px);
    margin-bottom: 8px;
    animation-delay: 0.1s;
}

.skeleton-dot {
    font-weight: 300;
    color: #e0e0e0;
}

@keyframes skeleton-shimmer {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}`;const g={COMPANY:`company`,CONFIG:`config`,RESULT:`result`,SERVICE:`service`,METAGORA:`metagora`,SEARCH:`search`,FILTER:`filter`,MODAL:`modal`,CHAT:`chat`,VISUAL_CONFIG:`visualConfig`};var _={name:`agora-home`,private:!0,version:`1.0.0`,type:`module`,scripts:{dev:`vite`,build:`tsc && vite build`,preview:`vite preview`,"create-component":`node ./scripts/create.cjs`},devDependencies:{"plain-ts":`npm:plain-ts@latest`,typescript:`~5.9.3`,vite:`npm:rolldown-vite@7.1.14`},overrides:{vite:`npm:rolldown-vite@7.1.14`},dependencies:{katex:`^0.16.46`,marked:`^17.0.1`,"marked-katex-extension":`^5.1.8`}};const v={APP_NAME:_.name,VERSION:_.version,API_HOST:`http://localhost:8010`,AI_HOST:`http://localhost:2020`,TRANSLATION_HOST:null,ENABLED_AI:!0,DEBUG_MODE:!1,IS_METAGORA:!1,MAX_HEIGHT:null,VISIBLE_LOGO:!0,PROMPT_CONFIG_ID:null},y={id:0,name:`Home Visual Configuration`,primary_color:`#9747FF`,secondary_color:`#f5f5f5`,greeting_headline:`What will you discover?`,greeting_text:`From funding and courses to shared infrastructure and researcher matchmaking — find the right resources to accelerate your career in the {name} Agora.`,greeting_prompt_headline:`Try searching for`,greeting_prompt_suggestion:[`funding opportunities`,`research partners`,`upcoming events`,`shared infrastructure`,`challenges`],trending_searches_headline:`TRENDING SEARCHES`,trending_searches_suggestion:[`latest ai courses`,`innovation projects`,`research collaboration`],searchbar_placeholder:`Search for funding, courses, infrastructure...`,agora_or_datagora:`agora`,central_widget_type:`carousel`,title_font:`Geist`,body_font:`Geist Mono`,open_new_tab_on_menu_click:!0,agora_name_visible:!0,background_image:!1,language:`en_GB`};var b=class extends i{companyContext;visualConfigContext;constructor(){super(`plain-logo`,h),this.companyContext=this.useContext(g.COMPANY,!0),this.visualConfigContext=this.useContext(g.VISUAL_CONFIG,!0)}renderSkeletonLoader(){return this.html`
            <div class="skeleton-logo">
                <span class="skeleton-text skeleton-company"></span>
                <span class="skeleton-dot">/</span>
                <span class="skeleton-text skeleton-subtext"></span>
            </div>
        `}template(){let e=this.companyContext.get(`name`),t=this.visualConfigContext.get(`agora_or_datagora`)||`Agora`,n=t.charAt(0).toUpperCase()+t.slice(1);return e?this.html`
            <span class="logo">${e}</span>
            <span class="dot" style="color: ${this.companyContext.get(`primaryColor`)||`#8238eb`};">/</span>
            <span class="logo-subtext">${n}</span>
        `:this.renderSkeletonLoader()}};window.customElements.define(`plain-logo`,b);var ee=`.plain-nav-menu-wrapper {
    width: 100%;
    height: fit-content;

    font-family: var(--agora-font-body, 'Geist'), sans-serif;
}

:host {
    interpolate-size: allow-keywords;
}

/* Search Styles */
.search-container {
    padding: 12px 8px 12px 8px;
    position: sticky;
    top: -16px;
    background-color: #fff;
    z-index: 10;
}

.search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.search-icon {
    position: absolute;
    left: 10px;
    color: #9ca3af;
    display: flex;
    align-items: center;
    pointer-events: none;
}

.search-icon svg {
    width: 16px;
    height: 16px;
}

.nav-search-input {
    width: 100%;
    padding: 8px 12px 8px 34px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 0.9rem;
    color: #374151;
    background-color: #f9fafb;
    transition: all 0.2s;
    outline: none;
}

.nav-search-input:focus {
    background-color: #fff;
    border-color: #d1d5db;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05);
}

.nav-search-input::placeholder {
    color: #9ca3af;
}

.no-results {
    padding: 16px;
    text-align: center;
    color: #6b7280;
    font-size: 0.9rem;
    font-style: italic;
}

.service-details {
    border-radius: 8px;
    overflow: hidden;

    transition: 300ms;
}

.service-details[open] {
    background-color: rgb(249 250 251 / 0.5);
}

.service-details[open] summary {
    padding-block: 10px;
    background-color: #f1f3f4;
}

summary {
    padding: 4px 8px;
    box-sizing: border-box;

    list-style: none;

    display: flex;
    align-items: center;
    justify-content: space-between;

    transition: 300ms;
}

summary::-webkit-details-marker {
    display: none;
}

summary > plain-nav-item {
    flex: 1;
}

summary > div {
    flex: 1;
}

.vertical-separator {
    margin-inline: 6px;
    flex: 0 0 1px;
    min-height: 20px;
    background-color: #e0e0e0;
}

.chevron-icon {
    flex: 0 0 20px;
    
    cursor: pointer;

    color: rgb(156, 163, 175);

    width: 20px;
    height: 20px;

    transition: transform 0.3s ease;
}

.service-details[open] .chevron-icon {
    transform: rotate(180deg);
}

.service-details::details-content {
    height: 0;
    overflow: hidden;
    transition: height 0.3s ease, content-visibility 0.3s allow-discrete;
}

.service-details[open]::details-content {
    height: auto;
}

.nav-item-separator {
    border-top: 1px solid #ffffff5c;
}

ul {
    list-style: none;
    padding: 8px;
    margin: 0;
    margin-left: 16px;
    /* border-left: 1px solid #e0e0e0; */
}

.catalogues-label {
    padding: 8px;
    padding-bottom: 0;
    margin: 0;
    margin-top: 6px;
    margin-left: calc(16px + 8px + 10px);
    margin-bottom: -6px;
    box-sizing: border-box;

    user-select: none;

    display: block;

    font-size: 10px;
    color: #b3b6b9;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    
}

/* Skeleton Loader Styles */
.skeleton-loader {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 4px 8px;
}

.skeleton-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 8px;
}

.skeleton-icon {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    background: linear-gradient(90deg, #e8eaec 25%, #f3f4f5 50%, #e8eaec 75%);
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

.skeleton-text {
    height: 14px;
    border-radius: 4px;
    background: linear-gradient(90deg, #e8eaec 25%, #f3f4f5 50%, #e8eaec 75%);
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.5s ease-in-out infinite;
    animation-delay: 0.1s;
}

.skeleton-separator {
    border-top: 1px solid #f0f0f0;
    margin: 2px 0;
}

@keyframes skeleton-shimmer {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}

/* Responsive */
@media (max-width: 768px) {
    summary {
        padding: 6px 4px;
    }

    .catalogues-label {
        margin-left: calc(8px + 8px + 10px);
    }

    ul {
        margin-left: 8px;
    }
}`,x=`.plain-nav-item-wrapper {
    padding-block: 2px;
    box-sizing: border-box;

    display: flex;
    align-items: stretch;
    width: 100%;
    box-sizing: border-box;
    border-radius: 8px;
    transition: background-color 0.2s ease;

    font-family: var(--agora-font-body, 'Geist'), sans-serif;
} 

/* .plain-nav-item-wrapper:has(> .plain-nav-item--left.navigable):hover {
    cursor: pointer;
    background-color: var(--company-primary-color);
} */

.plain-nav-item--left {
    padding-left: 12px;
    padding-right: 6px;
    box-sizing: border-box;

    width: 100%;

    display: flex;
    align-items: stretch;
    gap: 12px;
}

.plain-nav-item--left:has(> .company-badge) {
    padding-left: 0;
}

/* .plain-nav-item--left:not(.navigable) {
    padding-left: 12px;
    padding-right: 6px;
} */

/* .plain-nav-item--left.navigable {
    width: 100%;
} */

.plain-nav-item--right {
    margin-left: auto;
    display: flex;
    align-items: center;
}

.nav-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    
    color: #5f6368;

    opacity: 0.25;

    transition: 300ms;
}

.nav-arrow svg {
    width: 20px;
    height: 20px;
}

.item-icon {
    padding-block: 8px;
    box-sizing: border-box;

    width: 32px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 6px;

    /* color: #5f6368; */
    color: var(--company-primary-color);
    
    background-color: color-mix(in srgb, var(--company-primary-color) 15%, transparent);

    transition: 300ms;
}

.item-icon svg {
    width: 20px;
    height: 20px;
}

.service-name {
    align-self: center;

    user-select: none;
    /* padding-block: 8px; */
    padding-left: 0;
    padding-right: 6px;
    box-sizing: border-box;

    display: flex;
    align-items: center;
    gap: 12px;

    font-size: 14px;
    font-weight: 500;
    color: #202124;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 20px;

    transition: 300ms;
}

.service-name.navigable {
    width: 100%;

    padding-block: 8px;
    margin-block: -8px;
    padding-left: 8px;
    margin-left: -8px;

    text-decoration: underline;
    text-underline-offset: 4px;
    text-decoration-color: color-mix(in srgb, black 35%, transparent);
}

.service-name.navigable:hover {
    cursor: pointer;
    border-radius: 4px;
    background-color: color-mix(in srgb, var(--company-primary-color) 15%, transparent);
    color: var(--company-primary-color);
    text-decoration-color: color-mix(in srgb, var(--company-primary-color) 75%, transparent);
    text-underline-offset: 2px;
}

.service-name.navigable:hover .nav-arrow {
    color: var(--company-primary-color);
    opacity: 0.75;
} 

.service-name.navigable:hover .item-icon {
    color: var(--company-primary-color);
    background-color: transparent;
}

.info-icon-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.info-icon {
    display: flex;
    align-items: center;
    color: #9aa0a6;
    margin-left: 8px;
    margin-right: 8px;
    opacity: 0;
    transition: opacity 0.2s, color 0.2s;
    cursor: help;
}

.plain-nav-item-wrapper:hover .info-icon {
    opacity: 1;
}

.info-icon:hover {
    color: #5f6368;
}

.info-icon svg {
    width: 18px;
    height: 18px;
}

.tooltip {
    visibility: hidden;
    width: 200px;
    background-color: #333;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 8px;
    position: fixed;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s;
    font-size: 12px;
    pointer-events: none;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    white-space: normal;
    word-wrap: break-word;
    line-height: 1.4;
}

.tooltip::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #333 transparent transparent transparent;
}

a.service-name {
    text-decoration: none;
    cursor: pointer;
}

a.service-name:hover {
    text-decoration: underline;
    color: #1a73e8;
}

.company-badge {
    display: inline-block;

    padding: 2px 6px;
    box-sizing: border-box;

    display: flex;
    align-items: center;
    justify-content: center;

    min-width: 60px;

    font-size: 10px;
    font-weight: 500;
    text-decoration: none;
    color: #6b7280;
    white-space: nowrap;

    border: 1px solid #e5e7eb;
    border-radius: 4px;

    background-color: #f3f4f6;
}

/* Ensure badge doesn't get underlined when hovering the link */
a.service-name:hover .company-badge {
    text-decoration: none;
    color: #6b7280;
}

.service-name {
    display: flex;
    align-items: center;
}

/* Responsive */
@media (max-width: 1024px) {
    .tooltip {
        display: none !important;
    }

    .info-icon {
        opacity: 0.6;
    }
}`;const S=`
    <svg 
        id="aUPaEU" 
        data-name="aUPaEU" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 658.08 657.97"
    >
        <defs>
            <style>
                .cls-1 {
                fill: #3a85fe;
                }

                .cls-2 {
                fill: #febd0b;
                }

                .cls-3 {
                fill: #fe006e;
                }

                .cls-4 {
                fill: #8238eb;
                }

                .cls-5 {
                fill: #fa5607;
                }
            </style>
        </defs>
        <g id="Capa_1-2" data-name="Capa 1">
        <path class="cls-2" d="M318.49,229.28c89.04-7.92,144.11,93.15,88.17,163.02-44.78,55.93-135.14,46.33-167.52-17.41-31.65-62.3,9.58-139.4,79.34-145.61Z"/>
        <path class="cls-5" d="M330.39,459.87l2.84.83c17.63,19.48,39.12,36.96,56.48,56.48,52.92,59.49,11,147.48-68.51,140.38-39.16-3.5-70.49-38.81-72.56-77.37-2.95-55.05,49.76-83.94,81.74-120.32Z"/>
        <path class="cls-5" d="M316.49.48c76-7.75,121.11,79.38,71.23,137.11-17.65,20.43-40.91,38.6-58.98,58.96l-2.55,1.49-2.55-1.49c-37.16-42.18-95.3-71.92-76.22-138.18C256.21,27.88,284.72,3.72,316.49.48Z"/>
        <path class="cls-3" d="M234.69,238.97c-27.69-1.31-56.98,1.76-84.49,0-113.78-7.32-100.41-171.77,8.03-164.88,35.63,2.26,76.46,36.06,76.46,73.47v91.42Z"/>
        <path class="cls-1" d="M71.49,247.26c23.94-2.44,46.51,4.05,64.73,19.66l61.4,61.61-1.39,2.39c-42.26,36.94-72.35,96.51-138.97,76.84-83.95-24.78-72.52-151.67,14.23-160.5Z"/>
        <path class="cls-1" d="M565.49,247.26c59.39-6.04,105.16,46.45,89.49,104.39-15.5,57.32-87.79,78.51-132.81,40.21l-62.4-62.61,1.39-2.39c32.04-26.68,59.42-75.04,104.33-79.6Z"/>
        <path class="cls-4" d="M237.69,422.8v95.41c0,14.05-16.07,39.15-26.53,48.43-61.42,54.54-155.86-3.87-134.76-83.68,7.76-29.36,40.22-60.16,71.78-60.16h89.5Z"/>
        <path class="cls-3" d="M422.69,419.8h93.5c25.66,0,55.74,27.24,64.98,49.97,31.93,78.52-59.75,148.36-126.94,96.85-14.97-11.48-31.54-37.09-31.54-56.41v-90.42Z"/>
        <path class="cls-4" d="M419.69,234.97v-94.41c0-21.13,22.97-49.27,40.69-59.25,66.87-37.68,143.92,26.9,118.76,99.67-8.8,25.46-39.99,53.99-67.96,53.99h-91.5Z"/>
        </g>
    </svg>
`,C=`
    <svg 
        id="aUPaEU-grey" 
        data-name="aUPaEU-grey" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 658.08 657.97"
    >
        <defs>
            <style>
                .cls-1-grey {
                fill: #6b6b6b;
                }

                .cls-2-grey {
                fill: #9a9a9a;
                }

                .cls-3-grey {
                fill: #7d7d7d;
                }

                .cls-4-grey {
                fill: #5e5e5e;
                }

                .cls-5-grey {
                fill: #8a8a8a;
                }
            </style>
        </defs>
        <g id="Capa_1-2" data-name="Capa 1">
        <path class="cls-2-grey" d="M318.49,229.28c89.04-7.92,144.11,93.15,88.17,163.02-44.78,55.93-135.14,46.33-167.52-17.41-31.65-62.3,9.58-139.4,79.34-145.61Z"/>
        <path class="cls-5-grey" d="M330.39,459.87l2.84.83c17.63,19.48,39.12,36.96,56.48,56.48,52.92,59.49,11,147.48-68.51,140.38-39.16-3.5-70.49-38.81-72.56-77.37-2.95-55.05,49.76-83.94,81.74-120.32Z"/>
        <path class="cls-5-grey" d="M316.49.48c76-7.75,121.11,79.38,71.23,137.11-17.65,20.43-40.91,38.6-58.98,58.96l-2.55,1.49-2.55-1.49c-37.16-42.18-95.3-71.92-76.22-138.18C256.21,27.88,284.72,3.72,316.49.48Z"/>
        <path class="cls-3-grey" d="M234.69,238.97c-27.69-1.31-56.98,1.76-84.49,0-113.78-7.32-100.41-171.77,8.03-164.88,35.63,2.26,76.46,36.06,76.46,73.47v91.42Z"/>
        <path class="cls-1-grey" d="M71.49,247.26c23.94-2.44,46.51,4.05,64.73,19.66l61.4,61.61-1.39,2.39c-42.26,36.94-72.35,96.51-138.97,76.84-83.95-24.78-72.52-151.67,14.23-160.5Z"/>
        <path class="cls-1-grey" d="M565.49,247.26c59.39-6.04,105.16,46.45,89.49,104.39-15.5,57.32-87.79,78.51-132.81,40.21l-62.4-62.61,1.39-2.39c32.04-26.68,59.42-75.04,104.33-79.6Z"/>
        <path class="cls-4-grey" d="M237.69,422.8v95.41c0,14.05-16.07,39.15-26.53,48.43-61.42,54.54-155.86-3.87-134.76-83.68,7.76-29.36,40.22-60.16,71.78-60.16h89.5Z"/>
        <path class="cls-3-grey" d="M422.69,419.8h93.5c25.66,0,55.74,27.24,64.98,49.97,31.93,78.52-59.75,148.36-126.94,96.85-14.97-11.48-31.54-37.09-31.54-56.41v-90.42Z"/>
        <path class="cls-4-grey" d="M419.69,234.97v-94.41c0-21.13,22.97-49.27,40.69-59.25,66.87-37.68,143.92,26.9,118.76,99.67-8.8,25.46-39.99,53.99-67.96,53.99h-91.5Z"/>
        </g>
    </svg>
`,te=`
    <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
    >
    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
    <line x1="12" y1="8" x2="12" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="12" y1="11" x2="12" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
`,ne=`
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
    >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
`,re=`
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        class="chevron-icon"
    >
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
`,ie=`
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
`,ae=`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
`,oe=`
    <svg viewBox="-19.04 0 75.804 75.804" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <g>
            <path d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" transform="translate(-831.568 -384.448)"></path>
        </g>
    </svg>
`,se=`
    <svg viewBox="-19.04 0 75.804 75.804" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <g transform="scale(-1, 1) translate(-37.724, 0)">
            <path d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" transform="translate(-831.568 -384.448)"></path>
        </g>
    </svg>
`,ce=`
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 21h18"/>
        <path d="M5 21V7"/>
        <path d="M19 21V7"/>
        <path d="M4 7h16"/>
        <path d="M12 2L2 7h20L12 2z"/>
        <path d="M10 21V11"/>
        <path d="M14 21V11"/>
    </svg>
`,le=`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
`,ue=`
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="5" y1="19" x2="17" y2="7"></line>
        <polyline points="7 7 17 7 17 17"></polyline>
    </svg>
`,de=`
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M11 19l-7-7 7-7"></path>
        <path d="M18 5v14"></path>
    </svg>
`,fe=`
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M13 5l7 7-7 7"></path>
        <path d="M6 5v14"></path>
    </svg>
`,pe=`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
    </svg>
`,me={gear:`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
`,tool:`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
    </svg>
`,research:`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 490.1 490.1" fill="currentColor">
        <path d="M467.667,460.9l-130.3-269v-171c0-11.5-9.4-20.9-20.9-20.9h-142.8c-11.5,0-20.9,9.4-20.9,20.9v171l-130.3,269
        c-4.4,6.9-3.7,28,18.8,29.2h408.7C471.967,489.5,471.667,467.6,467.667,460.9z M192.467,205.5c1-3.1,2.1-6.3,2.1-9.4V40.8h102.2
        v155.3c0,3.1,1,6.3,2.1,9.4l43.6,90.2c-49.7-12.1-86.2,0.8-119.7,12c-27.2,9.4-53.1,18-87.1,14.7L192.467,205.5z M73.567,449.4
        l43.1-88.5c58.7,9.6,94.5-6.4,119.5-14.7c40-14,74.3-25.1,131.3,1.6l49.1,101.6H73.567z"/>
    </svg>
`,calendar:`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
`,conversation:`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/>
        <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>
    </svg>
`,sparks:`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3l1.9 5.8a2 2 0 0 0 1.2 1.2l5.9 1.9-5.9 1.9a2 2 0 0 0-1.2 1.2L12 21l-1.9-5.8a2 2 0 0 0-1.2-1.2l-5.9-1.9 5.9-1.9a2 2 0 0 0 1.2-1.2z"/>
        <path d="M19 13l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z"/>
    </svg>
`,blog:`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <line x1="10" y1="9" x2="8" y2="9"/>
    </svg>
`,mortarboard:`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
`,badge:`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
`};var he=class extends i{companyContext;constructor(){super(`plain-nav-item`,x),this.companyContext=this.useContext(`company`)}showTooltip(e){let t=e.currentTarget,n=t.querySelector(`.tooltip`);if(!n)return;let r=t.getBoundingClientRect();n.style.position=`fixed`,n.style.top=`${r.top-n.offsetHeight-8}px`,n.style.left=`${r.left+r.width/2-n.offsetWidth/2}px`,n.style.visibility=`visible`,n.style.opacity=`1`}hideTooltip(e){let t=e.currentTarget.querySelector(`.tooltip`);t&&(t.style.visibility=`hidden`,t.style.opacity=`0`)}template(){let e=this.props.menuTargetMode,t=this.props.openInNewTab,n=e?e!==`same-tab`:!(t===!1||t===`false`||t===``),r=n?`_blank`:`_self`,i=n?`noopener noreferrer`:``,a=this.props.mainUrl?this.html`
                <a 
                    href="${this.props.mainUrl}" 
                    class="service-name navigable" 
                    target="${r}"
                    rel="${i}"
                    style="--company-primary-color: ${this.companyContext.get(`primaryColor`)};"
                    onclick="event.stopPropagation()"
                >
                    ${!this.props.companyName&&this.props.serviceIcon&&me[this.props.serviceIcon]?this.html`<span class="item-icon">${me[this.props.serviceIcon]}</span>`:``}
                    ${this.props.serviceName}
                    ${this.props.mainUrl?this.html`<span class="nav-arrow">${ue}</span>`:``}
                    <div class="plain-nav-item--right">
                    <div class="info-icon-wrapper" 
                         onmouseenter="this.getRootNode().host.showTooltip(event)" 
                         onmouseleave="this.getRootNode().host.hideTooltip(event)">
                        <span class="info-icon">${te}</span>
                        <div class="tooltip">${this.props.serviceDescription.trim()===``?`No description available`:this.props.serviceDescription}</div>
                    </div>
                </div>
                </a>`:this.html`<span class="service-name">
                ${this.props.serviceName}
            </span>`;return this.html`
            <div class="plain-nav-item-wrapper ">
                <div 
                    class="plain-nav-item--left ${this.props.mainUrl?`navigable`:``}"
                    style="--company-primary-color: ${this.props.companyPrimaryColor||this.companyContext.get(`primaryColor`)};"
                >
                    ${this.props.companyName?this.html`
                            <span 
                                class="company-badge" 
                                style="border-color: ${this.props.companyPrimaryColor} !important;color: ${this.props.companyPrimaryColor} !important;background-color: ${this.props.companyPrimaryColor}22 !important;"
                            >
                                ${this.props.companyName}
                            </span>
                        `:!this.props.mainUrl&&this.props.serviceIcon&&me[this.props.serviceIcon]?this.html`
                                <span class="item-icon">${me[this.props.serviceIcon]}</span>
                            `:``}
                    
                    ${a}
                    ${!this.props.mainUrl&&this.props.serviceDescription?this.html`
                    <div class="plain-nav-item--right">
                        <div class="info-icon-wrapper"
                             onmouseenter="this.getRootNode().host.showTooltip(event)" 
                             onmouseleave="this.getRootNode().host.hideTooltip(event)">
                            <span class="info-icon">${te}</span>
                            <div class="tooltip">${this.props.serviceDescription}</div>
                        </div>
                    </div>
                    `:``}
                </div>
                
            </div>
        `}};window.customElements.define(`plain-nav-item`,he);var ge=`.plain-catalogue-item-wrapper {
    display: block;
}

.catalogue-item {
    padding: 10px 16px;
    box-sizing: border-box;

    cursor: pointer;
    user-select: none;
    
    display: flex;
    align-items: center;

    border-radius: 8px;
    
    color: #5f6368;
    font-size: 14px;
    font-weight: 400;

    transition: background-color 0.2s ease, color 0.2s ease;
}

.catalogue-item:not(.disabled):hover {
    background-color: #f1f3f4;
    color: #202124;
}

.catalogue-item.disabled {
    cursor: default;
}

.icon {
    display: flex;
    align-items: center;
    margin-right: 12px;
    color: inherit;
}

.icon.disabled {
    color: #a8a8a8;
}

.icon svg {
    width: 20px;
    height: 20px;
}

.label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
} 

.label.disabled {
    color: #a8a8a8;
}`,_e=class extends i{configContext;metagoraContext;constructor(){super(`plain-catalogue-item`,ge),this.configContext=this.useContext(g.CONFIG,!0),this.metagoraContext=this.useContext(g.METAGORA,!0)}template(){let e=this.props.menuTargetMode,t=e?e!==`same-tab`:!0,n=t?`_blank`:`_self`,r=t?`noopener noreferrer`:``,i=this.configContext.get(`IS_METAGORA`),a=i?(this.metagoraContext.get(`agoras`)||[]).find(e=>e.name===this.props.companyName):void 0,o=`${this.props.website||(i?a?.host:this.configContext.get(`API_HOST`))}${this.props.url}`;return i&&!a?this.html`
            <span class="catalogue-item disabled" title="The page is not available">
                <span class="icon disabled">${`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 17H7A5 5 0 0 1 7 7h2"></path>
        <path d="M15 7h2a5 5 0 0 1 4 8"></path>
        <line x1="8" y1="12" x2="12" y2="12"></line>
        <line x1="2" y1="2" x2="22" y2="22"></line>
    </svg>
`}</span>
                <span class="label disabled">${this.props.name}</span>
            </span>
            `:this.html`
            <a href="${o}" target="${n}" rel="${r}" class="catalogue-item">
                <!-- <span class="icon">${ne}</span> -->
                <span class="label">${this.props.name}</span>
            </a>
        `}};window.customElements.define(`plain-catalogue-item`,_e);function ve(e){return!e||Array.isArray(e)?[]:e.websites??[]}var ye=class extends i{serviceContext;companyContext;visualConfigContext;searchQuery=``;searchTimeout=null;constructor(){super(`plain-nav-menu`,ee),this.serviceContext=this.useContext(g.SERVICE,!0),this.companyContext=this.useContext(g.COMPANY,!0),this.visualConfigContext=this.useContext(g.VISUAL_CONFIG,!0)}handleSearch(e){let t=e.target.value.toLowerCase();this.searchTimeout&&clearTimeout(this.searchTimeout),this.searchTimeout=window.setTimeout(()=>{this.searchQuery=t,this.updateList()},300)}updateList(){let e=this.$(`#services-list`);e&&(e.innerHTML=this.getServicesListHTML())}renderSkeletonLoader(){let e=[,,,,].fill(null).map((e,t)=>this.html`
            <div class="skeleton-item">
                <div class="skeleton-icon"></div>
                <div class="skeleton-text" style="width: ${70+t*10%30}%"></div>
            </div>
            ${t<3?`<hr class="nav-item-separator skeleton-separator"/>`:``}
        `).join(``);return this.html`
            <div class="skeleton-loader">
                ${e}
            </div>
        `}getServicesListHTML(){let e=this.serviceContext.get(`services`),t=this.visualConfigContext.get(`open_new_tab_on_menu_click`)===!1?`same-tab`:`new-tab`,n=this.searchQuery;if(!e||e.length===0)return``;let r=e.filter(e=>{if(!n)return!0;let t=e.fields.name?.toLowerCase()||``,r=ve(e.fields.catalogues).some(e=>e.name?.toLowerCase().includes(n));return t.includes(n)||r});return r.length===0?this.html`
                <div class="no-results">
                    No services found matching your search
                </div>
            `:this.html`
            ${r.map((e,n)=>{let i=ve(e.fields.catalogues),a=i&&i.length>0,o=e.fields.main_url&&e.fields.main_url!==`False`?e.fields.main_url:``,s=this.html`
                    <plain-nav-item
                        service-name="${e.fields.name}"
                        service-description="${e.fields.description}"
                        main-url="${o}"
                        service-icon="${e.fields.service_icon}"
                        menu-target-mode="${t}"
                    ></plain-nav-item>
                `;return a?this.html`
                    <details class="service-details">
                        <summary>
                            <div onclick="event.preventDefault()">
                                ${s}
                            </div>
                            <div class="vertical-separator"></div>
                            ${re}
                        </summary>
                        <span class="catalogues-label">Catalogues</span>
                        <ul>
                            ${i.map(e=>this.html`
                                    <plain-catalogue-item
                                        name="${e.name}"
                                        url="${e.url}"
                                        model="${e.model}"
                                        view-id="${e.view_id}"
                                        website="${e.website}"
                                        menu-target-mode="${t}"
                                    ></plain-catalogue-item>
                                `).join(``)}
                        </ul>
                    </details>
                    ${n===r.length-1?``:`<hr class="nav-item-separator"/>`}
                `:this.html`
                    <summary>
                        ${s}
                    </summary>
                        ${n===r.length-1?``:`<hr class="nav-item-separator"/>`}
                    `}).join(`
`)}
        `}template(){let e=this.serviceContext.get(`services`);return!e||e.length===0?this.renderSkeletonLoader():this.html`
            <div class="search-container">
                <div class="search-input-wrapper">
                    <span class="search-icon">${ae}</span>
                    <input
                        type="text"
                        class="nav-search-input"
                        placeholder="Search services..."
                        value="${this.searchQuery}"
                        oninput="this.getRootNode().host.handleSearch(event)"
                    />
                </div>
            </div>
            <div id="services-list">
                ${this.getServicesListHTML()}
            </div>
        `}};window.customElements.define(`plain-nav-menu`,ye);var be=`.plain-metagora-nav-menu-wrapper {
    width: 100%;
    height: fit-content;

    font-family: var(--agora-font-body, 'Geist'), sans-serif;
} 

:host {
    interpolate-size: allow-keywords;
}

/* Search Styles */
.search-container {
    padding: 12px 8px 12px 8px;
    position: sticky;
    top: -16px;
    background-color: #fff;
    z-index: 10;
}

.search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.search-icon {
    position: absolute;
    left: 10px;
    color: #9ca3af;
    display: flex;
    align-items: center;
    pointer-events: none;
}

.search-icon svg {
    width: 16px;
    height: 16px;
}

.nav-search-input {
    width: 100%;
    padding: 8px 12px 8px 34px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 0.9rem;
    color: #374151;
    background-color: #f9fafb;
    transition: all 0.2s;
    outline: none;
}

.nav-search-input:focus {
    background-color: #fff;
    border-color: #d1d5db;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05);
}

.nav-search-input::placeholder {
    color: #9ca3af;
}

/* Filter Styles */
.filter-scroll-wrapper {
    position: relative;
}

.filter-arrow {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 2;
    border: none;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 0 2px;
    width: 28px;
    color: #6b7280;
    transition: color 0.2s;
}

.filter-arrow:hover {
    color: #374151;
}

.filter-arrow--left {
    left: 0;
    background: linear-gradient(to right, #fff 55%, transparent);
}

.filter-arrow--right {
    right: 0;
    background: linear-gradient(to left, #fff 55%, transparent);
}

.filter-arrow.visible {
    display: flex;
}

.filter-container {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-top: 8px;
    padding-bottom: 4px;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE/Edge */
}

.filter-container::-webkit-scrollbar {
    display: none; /* Chrome/Safari */
}

.filter-chip {
    flex: 0 0 auto;
    padding: 4px 12px;
    border-radius: 16px;
    border: 1px solid #e5e7eb;
    background-color: #fff;
    color: #6b7280;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
}

.filter-chip:hover {
    background-color: #f9fafb;
    border-color: #d1d5db;
}

.filter-chip.active {
    background-color: #eff6ff;
    border-color: #bfdbfe;
    color: #2563eb;
}

.no-results {
    padding: 16px;
    text-align: center;
    color: #6b7280;
    font-size: 0.9rem;
    font-style: italic;
}

/* Category Styles */
.category-details {
    margin-bottom: 4px;
}

.category-details::details-content {
    height: 0;
    overflow: hidden;
    transition: height 0.3s ease, content-visibility 0.3s allow-discrete;
}

.category-details[open]::details-content {
    height: auto;
}

.category-summary {
    padding: 12px 8px;
    font-weight: 600;
    color: #374151;
    cursor: pointer;
    background-color: transparent;
    border-radius: 6px;
    
    display: flex;
    align-items: center;
    justify-content: space-between;
    list-style: none;
}

.category-summary::-webkit-details-marker {
    display: none;
}

.category-summary:hover {
    background-color: rgba(0, 0, 0, 0.05);
}

.category-name {
    flex: 1;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #6b7280;
}

.category-services {
    padding-left: 0;
}

.category-separator {
    border: 0;
    border-top: 1px solid #e5e7eb;
    margin: 8px 0;
}

.category-details[open] > .category-summary .chevron-icon {
    transform: rotate(180deg);
}

/* Service Styles (copied and adapted from NavMenu) */
.service-details {
    border-radius: 8px;
    overflow: hidden;
    transition: 300ms;
}

.service-details[open] {
    background-color: rgb(249 250 251 / 0.5);
}

.service-details[open] summary {
    padding-block: 10px;
    background-color: #f1f3f4;
}

.service-item {
    padding: 4px 8px;
    box-sizing: border-box;
}

summary {
    padding: 4px 8px;
    box-sizing: border-box;
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: 300ms;
}

summary::-webkit-details-marker {
    display: none;
}

summary > plain-nav-item {
    flex: 1;
}

summary > div {
    flex: 1;
}

.vertical-separator {
    margin-inline: 6px;
    flex: 0 0 1px;
    min-height: 20px;
    background-color: #e0e0e0;
}

.chevron-icon {
    flex: 0 0 20px;
    cursor: pointer;

    width: 20px;
    height: 20px;
    
    color: rgb(156, 163, 175);

    transition: transform 0.3s ease;
}

.service-details[open] .chevron-icon {
    transform: rotate(180deg);
}

.service-details::details-content {
    height: 0;
    overflow: hidden;
    transition: height 0.3s ease, content-visibility 0.3s allow-discrete;
}

.service-details[open]::details-content {
    height: auto;
}

.nav-item-separator {
    border-top: 1px solid #ffffff5c;
}

ul {
    list-style: none;
    padding: 8px;
    margin: 0;
    margin-left: 16px;
}

.catalogues-label {
    padding: 8px;
    padding-bottom: 0;
    margin: 0;
    margin-top: 6px;
    margin-left: calc(16px + 8px + 10px);
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 500;
    display: block;
}

/* Skeleton Loader */
.skeleton-loader {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.skeleton-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem;
}

.skeleton-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
}

.skeleton-text {
    height: 16px;
    border-radius: 4px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
}

.skeleton-separator {
    margin: 0;
    border-color: #f0f0f0;
}

@keyframes loading {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
} `;function xe(e){if(!e||typeof e!=`string`)return null;try{let t=[],n=e.replace(/\bTrue\b/g,`true`).replace(/\bFalse\b/g,`false`).replace(/\bNone\b/g,`null`).replace(/"((?:[^"\\]|\\.)*)"/g,(e,n)=>(t.push(n),`<<<${t.length-1}>>>`)).replace(/'((?:[^'\\]|\\.)*)'/g,(e,t)=>`"${t.replace(/\\'/g,`'`).replace(/"/g,`\\"`)}"`).replace(/<<<(\d+)>>>/g,(e,n)=>`"${t[parseInt(n)]}"`);return JSON.parse(n)}catch(t){return console.warn(`Failed to parse Python object to JSON:`,e,t),null}}function Se(e){if(!e||typeof e!=`string`||!e.startsWith(`[`)||e===`[]`)return null;let t=xe(e);if(!t)return null;if(Array.isArray(t)&&t.length>0){let e=t[0];if(typeof e==`object`&&e&&`name`in e)return t.map(e=>e.name||e.display_name||``).filter(e=>e!==``)}return null}function Ce(e){if(!e)return[];if(Array.isArray(e))return e.map(e=>{if(typeof e==`object`&&e){let t=e.name||e.display_name||``;if(!t)return null;let n=t.match(/^\(([^)]+)\)/);return n?n[1]:t}if(typeof e==`string`){let t=e.match(/^\(([^)]+)\)/);return t?t[1]:e}return null}).filter(e=>e!==null&&e!==``);if(typeof e==`string`){if(e.startsWith(`[`)){let t=xe(e);if(t)return Ce(t)}let t=e.match(/^\(([^)]+)\)/);return t?[t[1]]:[e]}if(typeof e==`object`&&e){let t=e.name||e.display_name||``;if(!t)return[];let n=t.match(/^\(([^)]+)\)/);return n?[n[1]]:[t]}return[]}function we(e){return e&&e.startsWith(`as_`)?e.substring(3).replace(/_/g,` `).split(` `).map(e=>e.charAt(0).toUpperCase()+e.slice(1)).join(` `):`Other`}function Te(e){if(!e)return``;let t=document.createElement(`div`);return t.innerHTML=e,t.textContent||t.innerText||``}function Ee(e){if(!e)return``;let t=e.trim();if(!t.startsWith(`<`))return t;let n=document.createElement(`div`);return n.innerHTML=t,n.querySelector(`a`)?.href||Te(t)}var De=class extends i{serviceContext;metagoraContext;searchQuery=``;selectedCompany=null;searchTimeout=null;constructor(){super(`plain-metagora-nav-menu`,be),this.serviceContext=this.useContext(g.SERVICE,!0),this.metagoraContext=this.useContext(g.METAGORA,!0)}handleSearch(e){let t=e.target.value.toLowerCase();this.searchTimeout&&clearTimeout(this.searchTimeout),this.searchTimeout=window.setTimeout(()=>{this.searchQuery=t,this.updateList()},300)}handleCompanyFilter(e){this.selectedCompany===e?this.selectedCompany=null:this.selectedCompany=e,this.updateList(),this.updateFilterChips()}updateList(){let e=this.$(`#services-list`);e&&(e.innerHTML=this.getServicesListHTML())}updateFilterChips(){(this.shadowRoot?.querySelectorAll(`.filter-chip`))?.forEach(e=>{let t=e.getAttribute(`data-company`);t===this.selectedCompany||t===`all`&&this.selectedCompany===null?e.classList.add(`active`):e.classList.remove(`active`)})}renderSkeletonLoader(){let e=[,,,,].fill(null).map((e,t)=>this.html`
            <div class="skeleton-item">
                <div class="skeleton-icon"></div>
                <div class="skeleton-text" style="width: ${70+t*10%30}%"></div>
            </div>
            ${t<3?`<hr class="nav-item-separator skeleton-separator"/>`:``}
        `).join(``);return this.html`
            <div class="skeleton-loader">
                ${e}
            </div>
        `}renderService(e){let t=e.fields.catalogues,n=!Array.isArray(t)&&t?.websites?t.websites:[],r=n&&n.length>0,i=e.fields.main_url&&e.fields.main_url!==`False`?e.fields.main_url:``,a=e.fields.company?.fields?.name,o=this.metagoraContext.get(`agoras`)?.find(e=>e.name===a)?.primaryColor||`#000000`,s=this.html`
            <plain-nav-item
                service-name="${e.fields.name}"
                service-description="${e.fields.description}"
                main-url="${i}"
                service-icon="${e.fields.service_icon}"
                company-name="${a}"
                company-primary-color="${o}"
            ></plain-nav-item>
        `;return r?this.html`
            <details class="service-details">
                <summary>
                    <div onclick="event.preventDefault()">
                        ${s}
                    </div>
                    <div class="vertical-separator"></div>
                    ${re}
                </summary>
                <span class="catalogues-label">Catalogues</span>
                <ul>
                    ${n.map(e=>this.html`
                            <plain-catalogue-item 
                                name="${e.name}"
                                url="${e.url}"
                                model="${e.model}"
                                view-id="${e.view_id}"
                                website="${e.website}"
                                company-name="${a}"
                            ></plain-catalogue-item>
                        `).join(``)}
                </ul>
            </details>
        `:this.html`
                <div class="service-item">
                    ${s}
                </div>
            `}getUniqueCompanies(e){let t=new Set;return e.forEach(e=>{let n=e.fields.company?.fields?.name;n&&t.add(n)}),Array.from(t).sort()}getServicesListHTML(){let e=this.serviceContext.get(`services`),t=this.searchQuery,n=this.selectedCompany;if(!e||e.length===0)return``;let r={},i=!1;e.forEach(e=>{if(n&&e.fields.company?.fields?.name!==n)return;if(t){let n=e.fields.name?.toLowerCase()||``,r=ve(e.fields.catalogues).some(e=>e.name?.toLowerCase().includes(t));if(!n.includes(t)&&!r)return}let a=e.fields.category||`Uncategorized`,o=we(a)||a;r[o]||(r[o]=[]),r[o].push(e),i=!0});let a=Object.keys(r).sort();return!i&&(t||n)?this.html`
                    <div class="no-results">
                        No services found matching your criteria
                    </div>
                `:this.html`
            ${a.map((e,i)=>{let o=r[e],s=e,c=!!t||!!n;return this.html`
                    <details class="category-details" ${c?`open`:``}>
                        <summary class="category-summary">
                            <span class="category-name">${s}</span>
                            ${re}
                        </summary>
                        <div class="category-services">
                            ${o.map((e,t)=>this.html`
                                    ${this.renderService(e)}
                                    ${t===o.length-1?``:`<hr class="nav-item-separator"/>`}
                                `).join(``)}
                        </div>
                    </details>
                    ${i===a.length-1?``:`<hr class="category-separator"/>`}
                `}).join(``)}
        `}updateScrollArrows(){let e=this.$(`.filter-container`),t=this.$(`.filter-arrow--left`),n=this.$(`.filter-arrow--right`);if(!e||!t||!n)return;let r=e.scrollLeft>0,i=e.scrollLeft<e.scrollWidth-e.clientWidth-1;t.classList.toggle(`visible`,r),n.classList.toggle(`visible`,i)}smoothScroll(e,t){let n=e.scrollLeft,r=Math.max(0,Math.min(n+t,e.scrollWidth-e.clientWidth)),i=performance.now(),a=e=>e<.5?2*e*e:-1+(4-2*e)*e,o=t=>{let s=t-i,c=Math.min(s/250,1);e.scrollLeft=n+(r-n)*a(c),c<1&&requestAnimationFrame(o)};requestAnimationFrame(o)}scrollFilterLeft(){let e=this.$(`.filter-container`);e&&this.smoothScroll(e,-150)}scrollFilterRight(){let e=this.$(`.filter-container`);e&&this.smoothScroll(e,150)}afterRender(){let e=this.$(`.filter-container`);e&&(e.addEventListener(`scroll`,()=>this.updateScrollArrows()),this.updateScrollArrows())}template(){let e=this.serviceContext.get(`services`);if(!e||e.length===0)return this.renderSkeletonLoader();let t=this.getUniqueCompanies(e);return this.html`
            <div class="search-container">
                <div class="search-input-wrapper">
                    <span class="search-icon">${ae}</span>
                    <input 
                        type="text" 
                        class="nav-search-input" 
                        placeholder="Search services..." 
                        value="${this.searchQuery}"
                        oninput="this.getRootNode().host.handleSearch(event)"
                    />
                </div>
                ${t.length>0?this.html`
                    <div class="filter-scroll-wrapper">
                        <button class="filter-arrow filter-arrow--left" aria-label="Scroll left" onclick="this.getRootNode().host.scrollFilterLeft()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>
                        <div class="filter-container">
                            <button 
                                class="filter-chip ${this.selectedCompany===null?`active`:``}" 
                                data-company="all"
                                onclick="this.getRootNode().host.handleCompanyFilter(null)"
                            >
                                All
                            </button>
                            ${t.map(e=>this.html`
                                <button 
                                    class="filter-chip ${this.selectedCompany===e?`active`:``}" 
                                    data-company="${e}"
                                    onclick="this.getRootNode().host.handleCompanyFilter('${e}')"
                                >
                                    ${e}
                                </button>
                            `).join(``)}
                        </div>
                        <button class="filter-arrow filter-arrow--right" aria-label="Scroll right" onclick="this.getRootNode().host.scrollFilterRight()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="9 6 15 12 9 18"></polyline>
                            </svg>
                        </button>
                    </div>
                `:``}
            </div>
            <div id="services-list">
                ${this.getServicesListHTML()}
            </div>
        `}};window.customElements.define(`plain-metagora-nav-menu`,De);var Oe=`.plain-greetings-wrapper {
    box-sizing: border-box;

    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 0 2rem;

}

.greetings-container {
    max-width: 800px;
}

.headline {
    margin: 0 0 1rem 0;

    font-family: var(--agora-font-title, 'Sora'), sans-serif;
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 700;
    color: #1a1a1a;
    line-height: 1.2;

    opacity: 0;
    animation: slideUpFade 0.8s ease-out forwards;
}

.subheadline {
    margin: 0 0 2rem 0;

    max-width: 600px;

    font-family: var(--agora-font-body, 'Geist'), sans-serif;
    font-size: clamp(12px, 2vw, 16px);
    font-weight: 400;
    text-wrap: balance;
    color: #666;
    line-height: 1.6;

    opacity: 0;
    animation: slideUpFade 0.8s ease-out 0.2s forwards;
}

.subheadline strong {
    font-weight: 600;
}

.prompt {
    margin: 0;

    display: flex;
    align-items: baseline;
    gap: 0.5ch;

    font-family: var(--agora-font-body, 'Geist Mono'), monospace;
    font-size: 14px;
    color: #888;

    opacity: 0;

    animation: slideUpFade 0.8s ease-out 0.4s forwards;
}

.dynamic-wrapper {
    position: relative;

    height: 1.2em;

    display: inline-block;

    vertical-align: bottom;

    overflow: hidden;
}

.dynamic-text {
    display: inline-block;

    color: #555;
    font-weight: 500;

    border-bottom: 1px dashed #ccc;
}

.dynamic-text.roll-out {
    animation: rollOut 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.dynamic-text.roll-in {
    animation: rollIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes rollOut {
    from {
        transform: translateY(0);
        opacity: 1;
    }

    to {
        transform: translateY(-100%);
        opacity: 0;
    }
}

@keyframes rollIn {
    from {
        transform: translateY(100%);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes slideUpFade {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Responsive */
@media (max-width: 1024px) {
    .plain-greetings-wrapper {
        padding: 0 1rem;
    }

    .headline {
        font-size: clamp(24px, 5vw, 36px);
    }
}

@media (max-width: 768px) {
    .plain-greetings-wrapper {
        padding: 0 0.75rem;
        justify-content: flex-start;
        padding-top: 1rem;
    }

    .headline {
        font-size: clamp(22px, 6vw, 32px);
        margin-bottom: 0.5rem;
    }

    .subheadline {
        font-size: clamp(11px, 3vw, 14px);
        margin-bottom: 1rem;
    }

    .prompt {
        font-size: 13px;
    }
}

/* Skeleton Loader Styles */
.skeleton-headline {
    width: 60%;
    height: 48px;
    border-radius: 8px;
    margin-bottom: 1rem;
    background: linear-gradient(90deg, #e8eaec 25%, #f3f4f5 50%, #e8eaec 75%);
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

.skeleton-subheadline {
    width: 90%;
    height: 16px;
    border-radius: 4px;
    margin-bottom: 0.6rem;
    background: linear-gradient(90deg, #e8eaec 25%, #f3f4f5 50%, #e8eaec 75%);
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.5s ease-in-out infinite;
    animation-delay: 0.1s;
}

.skeleton-subheadline.short {
    width: 55%;
}

.skeleton-prompt {
    width: 40%;
    height: 14px;
    border-radius: 4px;
    margin-top: 1rem;
    background: linear-gradient(90deg, #e8eaec 25%, #f3f4f5 50%, #e8eaec 75%);
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.5s ease-in-out infinite;
    animation-delay: 0.2s;
}

@keyframes skeleton-shimmer {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}`,ke=class extends i{companyContext;visualConfigContext;intervalId;constructor(){super(`plain-greetings`,Oe),this.companyContext=this.useContext(g.COMPANY,!0),this.visualConfigContext=this.useContext(g.VISUAL_CONFIG,!0)}connectedCallback(){super.connectedCallback(),this.startCycling()}disconnectedCallback(){super.disconnectedCallback(),this.intervalId&&clearInterval(this.intervalId)}getExamples(){return this.visualConfigContext.get(`greeting_prompt_suggestion`)||[]}startCycling(){let e=0;this.intervalId=setInterval(()=>{let t=this.getExamples();if(t.length===0)return;e=(e+1)%t.length;let n=this.shadowRoot?.querySelector(`.dynamic-text`);n&&(n.classList.remove(`roll-in`),n.classList.add(`roll-out`),setTimeout(()=>{n.textContent=t[e],n.classList.remove(`roll-out`),n.classList.add(`roll-in`)},400))},4e3)}renderSkeletonLoader(){return this.html`
            <div class="greetings-container">
                <div class="skeleton-headline"></div>
                <div class="skeleton-subheadline"></div>
                <div class="skeleton-subheadline short"></div>
                <div class="skeleton-prompt"></div>
            </div>
        `}template(){let e=this.visualConfigContext.get(`greeting_headline`),t=this.visualConfigContext.get(`greeting_text`)==``?`From funding and courses to shared infrastructure and researcher matchmaking — find the right resources to accelerate your career in the {name} Agora.`:this.visualConfigContext.get(`greeting_text`);if(e===void 0&&t===void 0)return this.renderSkeletonLoader();let n=this.companyContext.get(`primaryColor`)||`inherit`,r=this.companyContext.get(`name`)||``,i=this.visualConfigContext.get(`agora_or_datagora`)||`Agora`,a=this.visualConfigContext.get(`agora_name_visible`)!==!1,o=this.getExamples(),s=i.charAt(0).toUpperCase()+i.slice(1),c=a?`<strong style="color: ${n}">${r}</strong>`:``,l=typeof t==`string`?t.replace(`{name}`,c).replace(`Agora`,s):``;return this.html`
            <div class="greetings-container">
                ${e===!1?``:this.html`<h1 class="headline">${e}</h1>`}
                ${t===!1?``:this.html`
                    <p class="subheadline">
                        ${l}
                    </p>
                `}
                ${o.length>0?this.html`
                    <p class="prompt">
                        ${this.visualConfigContext.get(`greeting_prompt_headline`)||`Try searching for`} <span class="dynamic-wrapper"><span class="dynamic-text">${o[0]}</span></span>
                    </p>
                `:``}
            </div>
        `}};window.customElements.define(`plain-greetings`,ke);var Ae=`.plain-carousel-wrapper {
    height: 100%;
    max-height: var(--slide-height);
}

.carousel-container {
    position: relative;
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    height: var(--slide-height);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.slide {
    width: 100%;
    height: var(--slide-height);
    position: relative;
}

.carousel-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    opacity: 0;
    transition: opacity 1s ease-in-out;
    z-index: 0;
}

.carousel-bg.active {
    opacity: 1;
    z-index: 1;
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 100%);
    z-index: 2;
}

.content {
    position: absolute;
    top: 8px;
    left: 0;

    padding: var(--content-padding);
    padding-bottom: calc(40px + 24px);
    box-sizing: border-box;

    height: calc(100% - 16px);
    max-width: 600px;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 8px;

    overflow-y: auto;
    overflow-x: hidden;

    /* Hide scrollbar */
    scrollbar-width: none;          /* Firefox */
    -ms-overflow-style: none;       /* IE/Edge */

    color: white;

    z-index: 3;
}

.content::-webkit-scrollbar {
    display: none;                  /* Chrome, Safari, Edge */
}

.tag {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 4px;

    font-size: var(--small-text-size);
    font-weight: 700;
    text-transform: uppercase;

    backdrop-filter: blur(5px);
    background-color: rgb(255, 255, 255, 0.3);
}

.title {
    margin: 0;
    font-size: var(--big-text-size);
    font-weight: 700;
    line-height: 1.2;
}

.description {
    margin: 0;

    display: -webkit-box;
    -webkit-box-orient: vertical;

    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    line-clamp: 3;
    -webkit-line-clamp: 3;

    opacity: 0.9;

    overflow: hidden;
    text-overflow: ellipsis;
    min-height: calc(3 * 1.5em);
}

.description.is-hidden {
    display: none;
}

.search-terms {
    margin-bottom: 24px;

    font-family: var(--agora-font-body, 'Geist Mono'), monospace;
    font-size: 12px;
    opacity: 0.8;
    min-height: 1.2em;
}

.search-terms span {
    opacity: 0.8;
    margin-right: 8px;
}

.action-button {
    position: absolute;
    bottom: var(--button-bottom, 8px);
    left: var(--content-padding);

    padding: var(--cta-padding);
    width: var(--cta-width);
    box-sizing: border-box;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    color: white;
    text-decoration: none;
    font-weight: 400;
    font-size: var(--cta-text-size);

    border-radius: 8px;
    min-height: 40px;

    transition: background-color 0.2s;
}

.action-button:hover {
    background-color: #f1f3f4;
}

.action-button svg {
    margin-left: 0;
    max-width: 0;
    opacity: 0;
    transition: all 0.3s ease;
}

.action-button:hover svg {
    margin-left: 8px;
    max-width: var(--default-text-size);
    opacity: 1;
}

.pagination {
    position: absolute;
    bottom: 24px;
    right: 24px;
    display: flex;
    gap: 8px;
    z-index: 2;
}

.dot {
    width: 10px;
    height: 10px;
    border-radius: 100%;
    background-color: rgba(255, 255, 255, 0.3);
    cursor: pointer;
    transition: background-color 0.3s, width 0.6s;
}

.dot.active {
    background-color: white;
    width: 24px;
    border-radius: 5px;
}

/* Animations */
.anim-slide-text {
    transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
    transform: translateX(0);
    opacity: 1;
}

.anim-slide-text.exit {
    opacity: 0;
    transform: translateX(50px);
}

.anim-slide-text.enter-start {
    opacity: 0;
    transform: translateX(-50px);
    transition: none;
}

.anim-fade {
    transition: opacity 0.5s ease-in-out;
    opacity: 1;
}

.anim-fade.exit {
    opacity: 0;
}

.anim-fade.enter-start {
    opacity: 0;
    transition: none;
}

.gradient-bg {
    background: linear-gradient(-45deg, var(--primary-color, #8238eb), #2c3e50, #000000, var(--primary-color, #8238eb)) !important;
    background-size: 400% 400% !important;
    animation: gradient 15s ease infinite;
}

@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}

/* Responsive */
@media (max-width: 768px) {
    .carousel-container {
        max-width: 100%;
        max-height: 40vh;
    }

    .content {
        padding: 20px;
        padding-bottom: calc(40px + 24px);
        max-width: 100%;
    }

    .action-button {
        left: 20px;
        right: 20px;
        width: auto;
    }

    .title {
        font-size: clamp(18px, 5vw, 28px);
    }

    .description {
        -webkit-line-clamp: 2;
        line-clamp: 2;
        font-size: 13px;
        margin-bottom: 16px;
        min-height: calc(2 * 1.5em);
    }

    .pagination {
        bottom: 12px;
        right: 12px;
        gap: 6px;
    }

    .dot {
        width: 8px;
        height: 8px;
    }

    .dot.active {
        width: 18px;
    }
}

/* Constrained height: reduce description */
@media (max-height: 600px) {
    .content {
        gap: 6px;
    }

    .search-terms {
        margin-bottom: 16px;
    }

    .description {
        -webkit-line-clamp: 2;
        line-clamp: 2;
        min-height: calc(2 * 1.5em);
    }
}

/* Very constrained height: hide search terms */
@media (max-height: 450px) {
    .search-terms {
        display: none;
    }

    .description {
        -webkit-line-clamp: 1;
        line-clamp: 1;
        min-height: 1.5em;
    }
}

/* Extreme constraint: hide description */
@media (max-height: 350px) {
    .description {
        display: none;
    }

    .tag {
        padding: 2px 8px;
        font-size: 10px;
    }
}`,je={force:!0,bypassRefreshCooldown:!1},Me=null;function Ne(){return typeof window.translationWidgetEnsureTranslated==`function`?window.translationWidgetEnsureTranslated:typeof window.translationWidgetApi?.ensureTranslated==`function`?window.translationWidgetApi.ensureTranslated.bind(window.translationWidgetApi):null}function Pe(e={}){if(typeof window>`u`)return;let t=Ne();if(!t)return;let{options:n,debounceMs:r=220,source:i=`unknown`}=e,a={...je,...n||{}};Me!==null&&clearTimeout(Me),Me=window.setTimeout(()=>{Me=null;try{let e=t(a);Promise.resolve(e).catch(e=>{console.warn(`[translation] refresh rejected (${i})`,e)})}catch(e){console.warn(`[translation] refresh failed (${i})`,e)}},Math.max(0,r))}var Fe=class extends i{serviceContext;configContext;companyContext;currentIndex=0;intervalId=null;activeBgIndex=0;constructor(){super(`plain-carousel`,Ae),this.serviceContext=this.useContext(g.SERVICE,!0),this.configContext=this.useContext(g.CONFIG,!0),this.companyContext=this.useContext(g.COMPANY,!0)}connectedCallback(){super.connectedCallback(),this.startAutoPlay()}disconnectedCallback(){super.disconnectedCallback(),this.stopAutoPlay()}startAutoPlay(){this.stopAutoPlay(),this.intervalId=setInterval(()=>{this.nextSlide()},5e3)}stopAutoPlay(){this.intervalId&&=(clearInterval(this.intervalId),null)}nextSlide(){let e=this.serviceContext.get(`services`)||[];e.length!==0&&(this.currentIndex=(this.currentIndex+1)%e.length,this.updateView())}hasDescription(e){return!!e&&e!==`False`&&e.trim()!==``}setSlide(e){this.currentIndex=e,this.updateView(),this.startAutoPlay()}updateView(){let e=this.serviceContext.get(`services`)||[];if(e.length===0)return;let t=e[this.currentIndex],{name:n,description:r,image:i,suggested_search_terms:a,main_url:o}=t.fields,s=this.$$(`.carousel-bg`);if(s&&s.length===2){let e=this.activeBgIndex===0?1:0,n=s[this.activeBgIndex],r=s[e];if(i){let e=t._sourceHost||this.configContext.get(`API_HOST`);r.style.backgroundImage=`url('${e}${i}')`,r.style.removeProperty(`--primary-color`),r.classList.remove(`gradient-bg`)}else r.style.backgroundImage=``,r.style.setProperty(`--primary-color`,this.companyContext.get(`primaryColor`)||`#8238eb`),r.classList.add(`gradient-bg`);r.classList.add(`active`),n.classList.remove(`active`),this.activeBgIndex=e}let c=[this.$(`.title`),this.$(`.description`),this.$(`.search-terms`)],l=[this.$(`.tag`),this.$(`.action-button`)];c.forEach(e=>e?.classList.add(`exit`)),l.forEach(e=>e?.classList.add(`exit`)),setTimeout(()=>{let e=this.$(`.title`);e&&(e.textContent=n);let t=this.$(`.description`);if(t){let e=this.hasDescription(r);t.textContent=e?r:``,t.classList.toggle(`is-hidden`,!e)}let i=this.$(`.search-terms`);i&&(i.innerHTML=this.getSearchTerms(a).slice(0,3).map(e=>`<span>#${e.trim()}</span>`).join(` `));let s=this.$(`.action-button`);s&&(o&&o!==`False`?(s.style.visibility=`visible`,s.style.pointerEvents=``,s.tabIndex=0,s.href=`${o}`,s.style.backgroundColor=this.companyContext.get(`primaryColor`)||`#8238eb`):(s.style.visibility=`hidden`,s.style.pointerEvents=`none`,s.tabIndex=-1));let u=this.$$(`.dot`);u&&u.forEach((e,t)=>{t===this.currentIndex?e.classList.add(`active`):e.classList.remove(`active`)}),c.forEach(e=>{e&&(e.classList.remove(`exit`),e.classList.add(`enter-start`))}),l.forEach(e=>{e&&(e.classList.remove(`exit`),e.classList.add(`enter-start`))});let d=this.$(`.slide`);d&&d.offsetWidth,c.forEach(e=>e?.classList.remove(`enter-start`)),l.forEach(e=>e?.classList.remove(`enter-start`)),Pe({source:`carousel-slide-update`,debounceMs:180})},500)}getSearchTerms(e){return typeof e==`string`&&e!==`False`&&e.trim()!==``?e.split(`,`):Array.isArray(e)?e.filter(e=>e&&e!==`False`):[]}setupVariants(){switch(this.props.variant){case`small`:this.style.setProperty(`--slide-height`,`180px`),this.style.setProperty(`--big-text-size`,`16px`),this.style.setProperty(`--default-text-size`,`12px`),this.style.setProperty(`--small-text-size`,`10px`),this.style.setProperty(`--content-padding`,`20px 40px`),this.style.setProperty(`--cta-width`,`100px`),this.style.setProperty(`--cta-padding`,`5px 10px`),this.style.setProperty(`--cta-text-size`,`10px`),this.style.setProperty(`--button-bottom`,`4px`);break;default:this.style.setProperty(`--slide-height`,`100%`),this.style.setProperty(`--big-text-size`,`32px`),this.style.setProperty(`--default-text-size`,`16px`),this.style.setProperty(`--small-text-size`,`14px`),this.style.setProperty(`--content-padding`,`40px`),this.style.setProperty(`--cta-width`,`150px`),this.style.setProperty(`--cta-padding`,`10px 20px`),this.style.setProperty(`--cta-text-size`,`14px`),this.style.setProperty(`--button-bottom`,`8px`);break}}template(){this.setupVariants();let e=this.serviceContext.get(`services`)||[];if(e.length===0)return this.html``;let t=e[this.currentIndex],{name:n,description:r,image:i,suggested_search_terms:a,main_url:o}=t.fields,s=!!i,c=t._sourceHost||this.configContext.get(`API_HOST`),l=s?`background-image: url('${c}${i}');`:`--primary-color: ${this.companyContext.get(`primaryColor`)||`#8238eb`};`,u=s?``:`gradient-bg`,d=o&&o!==`False`,f=this.hasDescription(r),p=d?`background-color: ${this.companyContext.get(`primaryColor`)||`#8238eb`}`:`visibility: hidden; pointer-events: none;`;return this.html`
            <div class="carousel-container ${this.props.variant?`carousel-${this.props.variant}`:``}">
                <div class="slide">
                    <div class="carousel-bg active ${u}" style="${l}"></div>
                    <div class="carousel-bg"></div>
                    <div class="overlay"></div>
                    <div class="content">
                        <div class="tag anim-fade">${this.getAttribute(`label-service`)||`Service`}</div>
                        <h1 class="title anim-slide-text">${n}</h1>
                        ${this.props.variant!==`small`&&this.html`<p class="description anim-slide-text ${f?``:`is-hidden`}">${f?r:``}</p>`}
                        <div class="search-terms anim-slide-text">
                            ${this.getSearchTerms(a).slice(0,3).map(e=>`<span>#${e.trim()}</span>`).join(` `)}
                        </div>
                        <a
                            href="${d?o:`#`}"
                            target="_blank"
                            class="action-button anim-fade"
                            style="${p}"
                            tabindex="${d?`0`:`-1`}"
                        >
                            ${this.getAttribute(`label-read-more`)||`Read More`} ${ie}
                        </a>
                    </div>
                </div>
                ${this.props.variant===`small`?``:this.html`
                    <div class="pagination">
                        ${e.map((e,t)=>`
                            <span 
                                class="dot ${t===this.currentIndex?`active`:``}" 
                            ></span>
                        `).join(``)}
                    </div>
                `}
            </div>
        `}listeners(){let e=this.$$(`.dot`);e&&e.forEach((e,t)=>{e.onclick=()=>this.setSlide(t)})}afterRender(){this.$(`.carousel-container`)&&Pe({source:`carousel-render`,debounceMs:220})}};window.customElements.define(`plain-carousel`,Fe);var Ie=`.plain-metagora-hero-wrapper {
    width: 100%;
    height: 100%;
    position: relative;

    border-radius: 32px;
} 

/* ==== BACKGROUND ========================================================== */
.background-container {
    width: 100%;
    height: 1538px !important;
    border-radius: 5px;
    background: #E86A2F; /* White background for contrast */
    overflow: hidden; /* Hide overflow for masking */
    z-index: -1; /* Behind all other content */
    pointer-events: none; /* Don't block interactions with other elements */
}

@media (max-width: 768px) {
    .background-container {
        background:#E86A2F !important;
    }
}

/* ==== BACKGROUND SHAPES =================================================== */
.central-square {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    border-radius: 32px;

    /* width: 10px;
    height: 10px; */
    width: calc(100% - 32px);
    height: calc(100% - 32px);

    background-color: blue;

    overflow: hidden;

    /* animation: expand 1.5s ease-in-out forwards; */

    transition: 300ms;
}

.gradient-layer {
    position: absolute;
    width: 220vw;
    height: 130vh;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(28.42deg, #5281F5 10.24%, #783FE4 30.6%, #E73371 53.81%, #E86A2F 76.8%, #F5BF45 101.98%);
    filter: blur(75px);
    animation: gradientShift 12s ease-in-out infinite alternate;
    z-index: 1;
    opacity: 0; /* Initially hidden */
}

.ellipse {
    position: absolute;
    background: #FFFFFF;
    border-radius: 50%;
    opacity: 1;
    filter: blur(50px);
    z-index: 2;
    
    /* This creates the effect where gradient shows through */
    background-image: linear-gradient(28.42deg, #5281F5 10.24%, #783FE4 30.6%, #E73371 53.81%, #E86A2F 76.8%, #F5BF45 101.98%);
    animation: ellipseColorShift 12s ease-in-out infinite alternate;
}

.ellipse-323 {
    width: 1200px;
    height: 1200px;
    animation: ellipse323Move 9s ease-in-out infinite alternate;
}

.ellipse-324 {
    width: 550px;
    height: 550px;
    animation: ellipse324Move 11s ease-in-out infinite alternate;
}

.ellipse-325 {
    width: 650px;
    height: 650px;
    animation: ellipse325Move 13s ease-in-out infinite alternate;
}

.ellipse-326 {
    width: 900px;
    height: 1000px;
    animation: ellipse326Move 15s ease-in-out infinite alternate;
}

.ellipse-327 {
    width: 650px;
    height: 650px;
    animation: ellipse327Move 12s ease-in-out infinite alternate;
}

.ellipse-328 {
    width: 650px;
    height: 650px;
    animation: ellipse328Move 10s ease-in-out infinite alternate;
}

.ellipse-329 {
    width: 650px;
    height: 650px;
    animation: ellipse329Move 14s ease-in-out infinite alternate;
}

.ellipse-330 {
    width: 650px;
    height: 650px;
    animation: ellipse330Move 11s ease-in-out infinite alternate;
}

@media (max-width: 768px) {
    .ellipse {
        transform: scale(0.7);
    }
}

@media (max-width: 480px) {
    .ellipse {
        transform: scale(0.5);
    }
}

/* ==== CONTENT ============================================================= */
.metagora-hero--content {
    position: relative;
    padding: 64px;
    padding-block: 48px;
    box-sizing: border-box;

    width: 100%;
    height: 100%;

    display: flex;
    align-items: flex-start;

    z-index: 100;
}

.metagora-hero--left {
    flex: 0 0 60%;

    max-width: 60%;

    display: flex;
    flex-direction: column;
}

.metagora-hero--right {
    flex: 0 0 40%;
    height: 100%;

    overflow-x: hidden;
    overflow-y: auto;
    scrollbar-gutter: stable;

    /* Gradient fade at top and bottom */
    mask-image: linear-gradient(
        to bottom,
        transparent 0%,
        black 48px,
        black calc(100% - 48px),
        transparent 100%
    );
    -webkit-mask-image: linear-gradient(
        to bottom,
        transparent 0%,
        black 48px,
        black calc(100% - 48px),
        transparent 100%
    );
}

.metagora-hero--right::-webkit-scrollbar {
    width: 4px;
}

.metagora-hero--right::-webkit-scrollbar-track {
    background: transparent;
}

.metagora-hero--right::-webkit-scrollbar-thumb {
    background: #ffffff;
    border-radius: 50pt;
}

.metagora-hero--right::-webkit-scrollbar-button {
    display: none;
}

.metagora-hero--words {
    padding-top: 24px;
    padding-inline: 12px;

    font-family: var(--agora-font-title, 'Sora'), sans-serif;
    font-size: 124px;
    font-weight: 800;
    color: white;

    display: flex;
    align-items: center;
}

@media (max-width: 1600px) {
    .metagora-hero--words {
        font-size: 86px;
    }
}

@media (max-width: 1200px) {
    .metagora-hero--words {
        font-size: 64px;
    }
}

@media (max-width: 768px) {
    .metagora-hero--words {
        font-size: 48px;
    }
}

.metagora-hero--words .animated-word {
    display: inline-block;
    transition: opacity 0.5s ease, transform 0.5s ease;
    opacity: 1;
    transform: translateY(0);
}

.metagora-hero--words .animated-word.fade-out {
    opacity: 0;
    transform: translateY(10px);
}

.metagora-hero--greetings {
    padding: 16px;

    font-family: var(--agora-font-body, 'Geist'), sans-serif;
    color: white;
}

.metagora-hero--alliances-container {
    list-style: none;

    padding: 0;

    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
    gap: 16px;
}

.metagora-hero--alliance-item {
    padding: 12px 16px;
}

.metagora-hero--alliance-link {
    padding: 12px 16px;
    color: rgb(from white r g b / 0.9);

    display: flex;
    align-items: center;
    gap: 12px;
}

.metagora-hero--alliance-icon,
.metagora-hero--cta-icon {
    opacity: 0.5;
    transition: 300ms;
}

.metagora-hero--alliance-item:hover .metagora-hero--alliance-icon {
    opacity: 1;
}

.metagora-hero--cta-container {
    margin-top: 32px;
    padding: 16px;

    display: flex;
    align-items: center;
    gap: 16px;
}

.metagora-hero--cta-container a {
    font-family: var(--agora-font-body, 'Geist'), sans-serif;
    font-weight: 600;
    color: white;

    text-decoration: none;
}

.metagora-hero--cta {
    display: flex;
    align-items: center;
    gap: 8px;
}

.metagora-hero--cta:hover .metagora-hero--cta-icon {
    opacity: 1;
}

/* ==== ANIMATIONS ========================================================== */
.move-out-to-left {
    animation: moveOutToLeft 4s ease-in-out forwards;
}

@keyframes expand {
    0% {
        width: 10px;
        height: 10px;
    }
    100% {
        width: calc(100% - 32px);
        height: calc(100% - 32px);
    }
}

@keyframes moveOutToLeft {
    0% {
        transform: translate(-50%, -50%);
    }
    100% {
        transform: translate(-100%, -50%);
    }
}

@keyframes fadeIn {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

@keyframes gradientShift {
    0% {
        background: linear-gradient(28.42deg, #5281F5 10.24%, #783FE4 30.6%, #E73371 53.81%, #E86A2F 76.8%, #F5BF45 101.98%);
        transform: translate(-50%, -50%) rotate(0deg) scale(1);
    }
    25% {
        background: linear-gradient(29.27deg, #5281F5 -1.75%, #783FE4 19.09%, #E73371 42.84%, #E86A2F 66.36%, #F5BF45 92.11%);
        transform: translate(-50%, -50%) rotate(5deg) scale(1.1);
    }
    50% {
        background: linear-gradient(30.06deg, #5281F5 6.63%, #783FE4 25.95%, #E73371 47.98%, #E86A2F 69.8%, #F5BF45 93.69%);
        transform: translate(-50%, -50%) rotate(-3deg) scale(1.05);
    }
    75% {
        background: linear-gradient(34.1deg, #5281F5 -3.5%, #783FE4 20.73%, #E73371 48.36%, #E86A2F 75.72%, #F5BF45 105.67%);
        transform: translate(-50%, -50%) rotate(7deg) scale(0.95);
    }
    100% {
        background: linear-gradient(31.63deg, #5281F5 -0.05%, #783FE4 22.23%, #E73371 47.63%, #E86A2F 72.78%, #F5BF45 100.32%);
        transform: translate(-50%, -50%) rotate(0deg) scale(1);
    }
}

@keyframes ellipseColorShift {
    0% {
        background-image: linear-gradient(28.42deg, #5281F5 10.24%, #783FE4 30.6%, #E73371 53.81%, #E86A2F 76.8%, #F5BF45 101.98%);
    }
    25% {
        background-image: linear-gradient(29.27deg, #5281F5 -1.75%, #783FE4 19.09%, #E73371 42.84%, #E86A2F 66.36%, #F5BF45 92.11%);
    }
    50% {
        background-image: linear-gradient(30.06deg, #5281F5 6.63%, #783FE4 25.95%, #E73371 47.98%, #E86A2F 69.8%, #F5BF45 93.69%);
    }
    75% {
        background-image: linear-gradient(34.1deg, #5281F5 -3.5%, #783FE4 20.73%, #E73371 48.36%, #E86A2F 75.72%, #F5BF45 105.67%);
    }
    100% {
        background-image: linear-gradient(31.63deg, #5281F5 -0.05%, #783FE4 22.23%, #E73371 47.63%, #E86A2F 72.78%, #F5BF45 100.32%);
    }
}

@keyframes ellipse323Move {
    0% { left: -15%; top: 1.5%; }
    25% { left: 5%; top: -17%; }
    50% { left: -42%; top: -5%; }
    75% { left: -4%; top: -3%; }
    100% { left: 0%; top: -7%; }
}

@keyframes ellipse324Move {
    0% { left: 30%; top: 4%; }
    25% { left: 38%; top: -8.5%; }
    50% { left: 38%; top: -8.5%; }
    75% { left: 38.5%; top: 10%; }
    100% { left: 38.5%; top: 10%; }
}

@keyframes ellipse325Move {
    0% { left: 19%; top: 38%; }
    25% { left: 8.5%; top: 25%; }
    50% { left: 8.5%; top: 25%; }
    75% { left: 8.5%; top: 25%; }
    100% { left: 12%; top: 29%; }
}

@keyframes ellipse326Move {
    0% { left: 47%; top: 2.5%; }
    25% { left: 69%; top: -3%; }
    50% { left: 50%; top: 10%; }
    75% { left: 47.5%; top: 1.8%; }
    100% { left: 51.5%; top: -2%; }
}

@keyframes ellipse327Move {
    0% { left: 46.5%; top: 20.5%; }
    25% { left: 41%; top: 28%; }
    50% { left: 31%; top: 35%; }
    75% { left: 38%; top: 10.5%; }
    100% { left: 43%; top: 30.5%; }
}

@keyframes ellipse328Move {
    0% { left: 78.5%; top: 43.5%; }
    25% { left: 69.5%; top: 13%; }
    50% { left: 69.5%; top: 13%; }
    75% { left: 69.5%; top: 13%; }
    100% { left: 69.5%; top: 13%; }
}

@keyframes ellipse329Move {
    0% { left: 89%; top: -5%; }
    25% { left: 89%; top: -5%; }
    50% { left: 89%; top: -16%; }
    75% { left: 84%; top: 11.5%; }
    100% { left: 88%; top: -7%; }
}

@keyframes ellipse330Move {
    0% { left: -26.5%; top: -5%; }
    25% { left: -26.5%; top: -5%; }
    50% { left: -26.5%; top: -5%; }
    75% { left: -26.5%; top: 10.5%; }
    100% { left: -26.5%; top: -5.5%; }
}

/* ==== ICON SPINNER ======================================================== */
.metagora-hero--icon-spinner {
    position: absolute;
    top: 32px;
    right: 32px;

    padding: 8px;
    box-sizing: border-box;

    width: 48px;
    height: 48px;

    background: white;
    border-radius: 50%;
    
    display: flex;
    justify-content: center;
    align-items: center;

    z-index: 1000;
    
    animation: simpleSpin 20s linear infinite;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    
    pointer-events: auto; /* Ensure it captures events if needed, though mostly visual */
}

.metagora-hero--icon-spinner svg {
    width: 100%;
    height: 100%;
}

@keyframes simpleSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 1024px) {
    .background-container {
        height: auto !important;
        min-height: 100%;
    }

    .metagora-hero--content {
        flex-direction: column;
        padding: 32px;
    }

    .metagora-hero--left {
        flex: none;
        max-width: 100%;
    }

    .metagora-hero--right {
        flex: none;
        height: auto;
        max-height: 400px;
    }
}

@media (max-width: 768px) {
    .metagora-hero--content {
        padding: 20px;
    }

    .metagora-hero--alliances-container {
        grid-template-columns: 1fr;
    }

    .metagora-hero--cta-container {
        flex-direction: column;
        margin-top: 16px;
    }

    .metagora-hero--icon-spinner {
        width: 40px;
        height: 40px;
    }
}`,Le=class extends i{metagoraContext;words=[`Explore`,`Transform`,`Empower`,`Accelerate`,`Bound`,`Innovate`];currentWordIndex=0;intervalId=null;wordElement=null;constructor(){super(`plain-metagora-hero`,Ie),this.metagoraContext=this.useContext(g.METAGORA,!0)}template(){let e=this.metagoraContext.get(`agoras`)||[];return this.html`
            <div class="central-square">
                <section class="s_aupaeu_animated_background background-container" >
                    <div class="gradient-layer"></div>
                    <div class="ellipse ellipse-323"></div>
                    <div class="ellipse ellipse-324"></div>
                    <div class="ellipse ellipse-325"></div>
                    <div class="ellipse ellipse-326"></div>
                    <div class="ellipse ellipse-327"></div>
                    <div class="ellipse ellipse-328"></div>
                    <div class="ellipse ellipse-329"></div>
                    <div class="ellipse ellipse-330"></div>
                </section>
            </div>
            <section class="metagora-hero--content">
                <div class="metagora-hero--left">
                    <div class="metagora-hero--words">
                        <span class="animated-word">${this.words[0]}</span>
                    </div>
                    
                    <div class="metagora-hero--greetings" contenteditable="true">
                            Agora is a digital platform designed to support the<br/>
                            institutional transformation of HEI. Agora acts as a practical<br/>
                            tool for HEIs seeking impactful and sustainable change.<br/><br/>
                            Next, you can find more information about <b>all the alliances</b><br/>
                            that are part of the Agora ecosystem.
                        </div>

                    <div class="metagora-hero--cta-container">
                        <a  href="https://aupaeu.widening.eu/" 
                            target="_blank" 
                            class="metagora-hero--cta"
                        >
                            Know more about us
                            <span class="metagora-hero--cta-icon">${ue}</span>
                        </a>
                        <a  href="https://aupaeu.widening.eu/contact" 
                            target="_blank" 
                            class="metagora-hero--cta metagora-hero--cta-secondary"
                        >
                            Contact us
                            <span class="metagora-hero--cta-icon">${ue}</span>
                        </a>
                    </div>
                </div>
                
                <div class="metagora-hero--right">
                    <ul class="metagora-hero--alliances-container">
                        ${e.map(e=>this.html`
                            <li class="metagora-hero--alliance-item">
                                <a  class="metagora-hero--alliance-link" 
                                    href="${e.host}" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    ${e.name}
                                    <span class="metagora-hero--alliance-icon">
                                        ${ue}
                                    </span>
                                </a>
                            </li>
                        `).join(``)}
                    </ul>
                </div>
            </section>
            <div class="metagora-hero--icon-spinner">
                ${S}
            </div>
        `}listeners(){this.startAnimation()}connectors(){}disconnectedCallback(){super.disconnectedCallback&&super.disconnectedCallback(),this.stopAnimation()}startAnimation(){this.wordElement=(this.shadowRoot||this).querySelector(`.animated-word`),this.wordElement&&!this.intervalId&&(this.intervalId=window.setInterval(()=>this.rotateWord(),2500))}stopAnimation(){this.intervalId&&=(clearInterval(this.intervalId),null)}rotateWord(){this.wordElement&&(this.wordElement.classList.add(`fade-out`),setTimeout(()=>{this.currentWordIndex=(this.currentWordIndex+1)%this.words.length,this.wordElement&&(this.wordElement.textContent=this.words[this.currentWordIndex],this.wordElement.classList.remove(`fade-out`))},500))}};window.customElements.define(`plain-metagora-hero`,Le);var Re=`:host {
    display: block;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
}

.results-container {
    width: 100%;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    box-sizing: border-box;
}

.results-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
    margin: 0;
    margin-bottom: -1.5rem; /* Pull it closer to the first section */
}

/* Category Section Styles */
.category-section {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.category-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
}

.category-accent-bar {
    width: 6px;
    height: 28px;
    border-radius: 3px;

    background-color: #e2e8f0; /* Default gray, can be customized per category */
}

.category-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 800;
    color: #111827;
    letter-spacing: 0.05em;
}

.category-result-count {
    background-color: #e2e8f0;
    color: #475569;
    padding: 4px 12px;
    border-radius: 9999px;
    font-size: 10px;
    font-weight: 600;
}

.category-agora-badges {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-left: auto;
}

.agora-badge {
    font-size: 0.7rem;
    color: #6b7280;
    background-color: #f3f4f6;
    padding: 3px 8px;
    border-radius: 4px;
    font-weight: 500;
    white-space: nowrap;
    border: 1px solid #e5e7eb;
    text-decoration: none;
    display: inline-block;
    cursor: pointer;
    transition: filter 0.2s ease;
}

.agora-badge:hover {
    filter: brightness(0.5);
}

.category-services {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding-left: 0.5rem;
}

/* Service Section Styles */
.service-section {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.service-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.accent-bar {
    width: 4px;
    height: 24px;
    background-color: #3b82f6;
    border-radius: 2px;
}

.service-title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 700;
    color: #111827;
    letter-spacing: 0.025em;
}

/* Smaller service title when nested inside category */
.category-services .service-title {
    font-size: 1rem;
    font-weight: 600;
    color: #374151;
    letter-spacing: 0.015em;
}

.result-count {
    background-color: #f1f5f9;
    color: #64748b;
    padding: 4px 12px;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 600;
}

.carousel-controls {
    display: flex;
    gap: 0.75rem;
}

.arrow-btn {
    cursor: pointer;
    padding: 0;

    width: 32px;
    height: 32px;

    display: grid;
    place-content: center;

    border-radius: 50%;
    border: 1px solid #e5e7eb;

    background: white;

    transition: all 0.2s ease;
    color: #6b7280;
}

.arrow-btn:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    color: #374151;
}

.arrow-btn:active {
    color: #111827;
    background-color: #d8d8d8;
}

.arrow-btn svg {
    width: 14px;
    height: 14px;
    fill: currentColor;
}

.carousel-wrapper {
    position: relative;
    width: 100%;
}

.carousel-container {
    display: flex;
    gap: 1.5rem;
    overflow-x: auto;
    scroll-behavior: smooth;
    padding: 0.5rem 0.25rem; /* Slight padding for shadows if needed */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE/Edge */
}

.carousel-container::-webkit-scrollbar {
    display: none; /* Chrome/Safari */
}

.carousel-container plain-dynamic-card {
    flex: 0 0 240px; /* Adjusted width */
    min-width: 320px;
}

/* Stacked Column for Medium Cards */
.stacked-column {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 0 0 240px;
    min-width: 320px;
}

.stacked-column plain-dynamic-card {
    flex: 1;
    min-height: 0;
}

/* Agora Cards Grid */
.agora-cards-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-x: auto;
    scroll-behavior: smooth;
    padding: 0.5rem 0.25rem;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.agora-cards-grid::-webkit-scrollbar {
    display: none;
}

/* Agora Card */
.agora-card {
    flex: 1;
    flex-shrink: 0;
    /* min-height: 320px; */
    background: white;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
    width: 100%;
}

.agora-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: var(--agora-color, #e5e7eb);
}

/* Agora Card Header */
.agora-card-header {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #f3f4f6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(to bottom, #fafafa, white);
}

.agora-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.agora-card-header .agora-badge {
    font-size: 0.7rem;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 5px;
    border: 1px solid;
    white-space: nowrap;
    text-decoration: none;
    cursor: pointer;
    transition: filter 0.2s ease;
}

.agora-card-header .agora-badge:hover {
    filter: brightness(0.5);
}

.agora-result-count {
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 500;
}

.agora-carousel-controls {
    display: flex;
    gap: 0.25rem;
}

.agora-arrow-btn {
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: grid;
    place-content: center;
    border-radius: 50%;
    border: 1px solid #e5e7eb;
    background: white;
    transition: all 0.2s ease;
    color: #9ca3af;
}

.agora-arrow-btn:hover {
    background: #f9fafb;
    border-color: var(--agora-color, #d1d5db);
    color: var(--agora-color, #374151);
}

.agora-arrow-btn svg {
    width: 10px;
    height: 10px;
    fill: currentColor;
}

/* Agora Items Container */
.agora-items {
    flex: 1;
    display: flex;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    overflow-x: auto;
    scroll-behavior: smooth;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.agora-items::-webkit-scrollbar {
    display: none;
}

.agora-items plain-dynamic-card {
    /* flex: 0 0 280px; */
    min-width: 280px;
}

/* More Results Card */
.more-results-card {
    flex: 0 0 120px;
    min-width: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    border: 2px dashed;
    cursor: pointer;
    transition: all 0.2s ease;
    background: transparent;
    font-family: inherit;
}

.more-results-card:hover {
    transform: scale(1.02);
}

.more-count {
    font-size: 1.25rem;
    font-weight: 700;
    color: #374151;
}

.more-label {
    font-size: 0.65rem;
    color: #6b7280;
    margin-top: 0.125rem;
}

/* Empty state */
.empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 200px;
    padding: 2rem;
}

.empty-state p {
    color: #9ca3af;
    font-size: 1rem;
    text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
    .results-container {
        padding: 1rem;
        gap: 2rem;
        max-height: 70vh;;
    }

    .service-title {
        font-size: 1rem;
    }

    .carousel-container plain-dynamic-card {
        flex: 0 0 280px;
        min-width: 280px;
    }

    .stacked-column {
        flex: 0 0 280px;
        min-width: 280px;
    }

    .carousel-controls {
        display: none; /* Hide arrows on mobile, rely on swipe */
    }

    /* Agora cards responsive */
    .agora-card {
        min-height: 260px;
    }

    .agora-carousel-controls {
        display: none;
    }

    .agora-items plain-dynamic-card {
        /* flex: 0 0 240px; */
        min-width: 240px;
    }
}`,ze=`.plain-dynamic-card-wrapper {
    width: 100%;
    height: 100%;

    font-family: var(--agora-font-body, 'Geist'), sans-serif;
}

.card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    transform: translateY(-4px);
}

/* Full and Medium Cards */
.full-card {
    height: 496px;
    display: flex;
    flex-direction: column;
}

.medium-card {
    height: 240px;
    display: flex;
    flex-direction: column;
}

/* Allow medium cards to stretch in stacked columns */
.stacked-column .plain-dynamic-card-wrapper,
.stacked-column .plain-dynamic-card-wrapper .medium-card {
    height: 100%;
}

.card-image-container {
    padding: 8px;
    box-sizing: border-box;
}

.card-image {
    width: 100%;
    height: 200px;

    border-radius: 10px;

    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    flex-shrink: 0;
}

.full-card .card-content,
.medium-card .card-content {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    flex: 1;
    min-height: 0;
}

.card-content {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex: 1;
}

.card-header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex-shrink: 0;
}

.card-top-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    width: 100%;
}

.card-title {
    margin: 0;
    font-family: var(--agora-font-title, 'Sora'), sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
    line-height: 1.4;
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-clamp: 2;
    overflow: hidden;
    word-break: break-word;
    flex-shrink: 0;
}

.score-badge {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    background-color: #f3f4f6;
    color: #374151;
    padding: 0.25rem 0.625rem;
    border-radius: 9999px;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    border: 1px solid #e5e7eb;
    flex-shrink: 0;
}

.score-badge.ai-pick {
    background: linear-gradient(135deg, #f0e6ff 0%, #e6f0ff 100%);
    border-color: #c4b5fd;
    color: #6b21a8;
}

.score-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: hsl(calc(var(--score) * 120), 70%, 50%);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.5);
}

.score-dot.ai {
    background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
    box-shadow: 0 0 0 1px rgba(139, 92, 246, 0.3);
}

.card-summary {
    margin: 0;
    color: #6b7280;
    font-size: 12px;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    line-clamp: 3;
    overflow: hidden;
    word-break: break-word;
    flex-shrink: 0;
}

/* Dynamic spacing for cards with summaries */
.full-card .card-summary,
.medium-card .card-summary {
    display: block;
    flex: 1;
    -webkit-line-clamp: unset;
    line-clamp: unset;
    mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
}

.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    padding-top: 0.75rem;
    border-top: 1px solid #e5e7eb;
    flex-shrink: 0;
}

.card-link {
    color: #8238eb;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.9375rem;
    transition: color 0.2s;
}

.card-link:hover {
    color: #6b21a8;
    text-decoration: underline;
}

.card-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.125rem;
    max-width: 60%;
}

.card-origins {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    align-items: center;
    justify-content: flex-end;
    max-width: 70%;
    min-width: 0;
}

.card-origin {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.7rem;
    color: #6b7280;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.025em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 160px;
    min-width: 0;
    background-color: #f3f4f6;
    padding: 0.125rem 0.5rem;
    border-radius: 9999px;
    border: 1px solid #e5e7eb;
}

.card-origin svg {
    flex-shrink: 0;
    opacity: 0.7;
}

.card-origin-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
}

.card-model {
    color: #9ca3af;
    font-size: 0.75rem;
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
}

.card-model:hover {
    text-decoration: underline;
    color: #6b7280;
}

/* Minimal Card */
.minimal-card {
    height: 200px;
}

.minimal-card .card-content {
    padding: 1.25rem;
}

.minimal-card .card-title {
    font-size: 1.125rem;
}

.card-fields {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 0.75rem;
}

.field-item {
    display: flex;
    gap: 0.5rem;
    font-size: 0.875rem;
}

.field-label {
    color: #6b7280;
    font-weight: 500;
}

.field-value {
    color: #1f2937;
}

/* Highlighted Terms - Highlighter marker style */
mark {
    background-color: transparent; /* Will be set inline */
    color: inherit;
    padding: 0;
    border: none;
    border-radius: 0;
    font-weight: inherit;
}

/* Error State */
.error-card {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 150px;
    color: #9ca3af;
    font-style: italic;
}

/* Responsive */
@media (max-width: 768px) {
    .card-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .card-footer {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
    }

    .card-title {
        font-size: 1.125rem;
    }
}`;function Be(e,t){return e?e.startsWith(`http://`)||e.startsWith(`https://`)?e:`${t}${e}`:``}function Ve(e,t,n,r,i){if(!e||!t)return i||`#`;let a=n.filter(e=>e._sourceHost===r);for(let n of a){let i=ve(n.fields?.catalogues);for(let n of i)if(n.model===e)return`${r}/offering/${n.view_id}/${t}`}for(let i of n){let n=ve(i.fields?.catalogues);for(let i of n)if(i.model===e)return`${r}/offering/${i.view_id}/${t}`}return i||`#`}function He(e,t=1){let n=e.startsWith(`#`)?e.slice(1):e,r=parseInt(n.slice(0,2),16),i=parseInt(n.slice(2,4),16),a=parseInt(n.slice(4,6),16);return`rgba(${r}, ${i}, ${a}, ${t})`}function Ue(e,t,n){if(!e||!t||t.length===0)return e;let r=e;return[...t].sort((e,t)=>t.length-e.length).forEach(e=>{if(!e)return;let t=e.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`),i=RegExp(`\\b(${t}\\w*)`,`gi`),a=n.startsWith(`#`)?He(n,.2):`${n}33`;r=r.replace(i,`<mark style="background-color: ${a};">$1</mark>`)}),r}var We=`.score-badge {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    background-color: #f3f4f6;
    color: #374151;
    padding: 0.25rem 0.625rem;
    border-radius: 9999px;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    border: 1px solid #e5e7eb;
    flex-shrink: 0;
}

.score-badge.ai-pick {
    background: linear-gradient(135deg, #f0e6ff 0%, #e6f0ff 100%);
    border-color: #c4b5fd;
    color: #6b21a8;
}

.score-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: hsl(calc(var(--score) * 120), 70%, 50%);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.5);
}

.score-dot.ai {
    background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
    box-shadow: 0 0 0 1px rgba(139, 92, 246, 0.3);
}
`,Ge=class extends i{constructor(){super(`plain-score-badge`,We)}get score(){let e=this.props.score;if(e==null||e===`null`||e===``)return null;let t=parseFloat(e);return isNaN(t)?null:t}get aiPickTitle(){return this.props.aiPickTitle||`Suggested by AI assistant`}get matchTitle(){return this.props.matchTitle||`This is the relevance of the result`}template(){let e=this.score;return e===null?this.html`
                <div class="score-badge ai-pick" title="${this.aiPickTitle}">
                    <div class="score-dot ai"></div>
                    <span class="score-value">AI Pick</span>
                </div>
            `:this.html`
            <div class="score-badge" style="--score: ${e}" title="${this.matchTitle}">
                <div class="score-dot"></div>
                <span class="score-value">${Math.round(e*100)}% Match</span>
            </div>
        `}};window.customElements.define(`plain-score-badge`,Ge);var Ke=class extends i{result;configContext;serviceContext;modalContext;companyContext;constructor(){super(`plain-dynamic-card`,ze),this.configContext=this.useContext(g.CONFIG),this.serviceContext=this.useContext(g.SERVICE),this.modalContext=this.useContext(g.MODAL),this.companyContext=this.useContext(g.COMPANY),this.result=JSON.parse(this.props.result)}getDetailUrl(){let e=this.result?._sourceHost||this.configContext.get(`API_HOST`);return Ve(this.result?.model,this.result?.data?.id,this.serviceContext.get(`services`)||[],e,this.result?.model_view_url)}getCardType(){let e=this.result?.data;if(!e)return`minimal`;let t=e?.name||e?.display_name,n=e?.x_summary||e?.x_description,r=e?.x_image,i=e?.x_origin||e?.x_home_partner_institution||e?.x_partner_institution||e?.partner_institution||e?.x_partner_institutions||e?.partner_institutions||e?.x_host_university||e?.x_hosting_university||e?.x_participating_universities,a=e?.x_web_link||e?.x_link||e?.x_more_info||e?.x_additional_link,o=this.result?.model_view_url;return t&&n&&r&&i&&a&&o?`full`:t&&n?`medium`:`minimal`}extractFullCard(){let e=this.result.data,t=e?.x_origin||e?.x_university_origin||e?.x_home_partner_institution||e?.x_partner_institution||e?.partner_institution||e?.x_partner_institutions||e?.partner_institutions||e?.x_host_university||e?.x_hosting_university||e?.x_participating_universities||``;return{score:this.result.score?.relative??null,image_url:e?.x_image||``,origins:Ce(t),name:e?.display_name||e?.name||``,summary:e?.x_summary||e?.x_description?Te(e.x_summary||e.x_description):``,model_name:this.result?.model_verbose_name||``,detail_url:this.getDetailUrl(),additional_url:e?.x_web_link||e?.x_link||e?.x_more_info||e?.x_additional_link||``,catalogue_url:this.result.model_view_url||``}}extractMediumCard(){let e=this.result.data,t=e?.x_origin||e?.x_university_origin||e?.x_home_partner_institution||e?.x_host_university||e?.x_hosting_university||e?.x_participating_universities,n=t?Ce(t):[];return{score:this.result.score?.relative??null,origins:n.length>0?n:void 0,name:e?.display_name||e?.name||``,summary:e?.x_summary||e?.x_description?Te(e.x_summary||e.x_description):``,model_name:this.result?.model_verbose_name||``,detail_url:this.getDetailUrl(),catalogue_url:this.result.model_view_url,additional_url:e?.x_web_link||e?.x_link||e?.x_more_info||e?.x_additional_link}}extractMinimalCard(){let e=this.result.data,t=e?.x_origin||e?.x_university_origin||e?.x_home_partner_institution||e?.x_partner_institution||e?.partner_institution||e?.x_partner_institutions||e?.partner_institutions||e?.x_host_university||e?.x_hosting_university||e?.x_participating_universities,n=t?Ce(t):[],r=this.result.score?.relative??null;return{name:e?.display_name||e?.name||`Untitled`,score:r,model_name:this.result?.model_verbose_name||``,origins:n.length>0?n:void 0}}getHighlightedText(e){let t=this.result?.roots||[],n=this.companyContext.get(`primaryColor`)||`#8238eb`;return Ue(e,t,n)}renderFullCard(){let e=this.extractFullCard(),t=this.result?._sourceHost||this.configContext.get(`API_HOST`),n=e.origins.length>0?e.origins.map(e=>this.html`
                <span class="card-origin">
                    ${ce}
                    <span class="card-origin-text">${e}</span>
                </span>
            `).join(``):``;return this.html`
            <div class="card full-card">
                ${e.image_url?this.html`
                        <div class="card-image-container">
                            <div 
                                class="card-image" 
                                style="background-image: url('${Be(e.image_url,t)}')"
                            ></div>
                        </div>
                    `:``}
                <div class="card-content">
                    <div class="card-header">
                        <div class="card-top-info">
                            <plain-score-badge score="${e.score}"></plain-score-badge>
                            ${n?this.html`
                                <div class="card-origins">
                                    ${n}
                                </div>
                            `:this.html`<span></span>`}
                        </div>
                        <h3 class="card-title">${this.getHighlightedText(e.name)}</h3>
                    </div>
                    <p class="card-summary">${this.getHighlightedText(e.summary)}</p>
                    <div class="card-footer">
                        <a href="${e.detail_url}" target="_blank" class="card-link">Learn More →</a>
                        <div class="card-meta">
                            <a href="${e.catalogue_url}" target="_blank" class="card-model">${e.model_name}</a>
                        </div>
                    </div>
                </div>
            </div>
        `}renderMediumCard(){let e=this.extractMediumCard(),t=e.origins&&e.origins.length>0?e.origins.map(e=>this.html`
                <span class="card-origin">
                    ${ce}
                    <span class="card-origin-text">${e}</span>
                </span>
            `).join(``):``;return this.html`
            <div class="card medium-card">
                <div class="card-content">
                    <div class="card-header">
                        <div class="card-top-info">
                            <plain-score-badge score="${e.score}"></plain-score-badge>
                            ${t?this.html`
                                <div class="card-origins">
                                    ${t}
                                </div>
                            `:this.html`<span></span>`}
                        </div>
                        <h3 class="card-title">${this.getHighlightedText(e.name)}</h3>
                    </div>
                    ${e.summary?`<p class="card-summary">${this.getHighlightedText(e.summary)}</p>`:``}
                    <div class="card-footer">
                        ${e.detail_url?`<a href="${e.detail_url}" target="_blank" class="card-link">View Details →</a>`:``}
                        <div class="card-meta">
                            ${e.catalogue_url?`<a href="${e.catalogue_url}" target="_blank" class="card-model">${e.model_name}</a>`:``}
                        </div>
                    </div>
                </div>
            </div>
        `}renderMinimalCard(){let e=this.extractMinimalCard(),t=e.origins&&e.origins.length>0?e.origins.map(e=>this.html`
                <span class="card-origin">
                    ${ce}
                    ${e}
                </span>
            `).join(``):``;return this.html`
            <div class="card minimal-card">
                <div class="card-content">
                    <div class="card-header">
                        <div class="card-top-info">
                            <plain-score-badge score="${e.score}"></plain-score-badge>
                            ${t?this.html`
                                <div class="card-origins">
                                    ${t}
                                </div>
                            `:this.html`<span></span>`}
                        </div>
                        <h3 class="card-title">${this.getHighlightedText(e.name)}</h3>
                    </div>
                    <div class="card-footer">
                        <div class="card-meta">
                            <span class="card-model">${e.model_name}</span>
                        </div>
                    </div>
                </div>
            </div>
        `}template(){if(!this.result)return this.html`<div class="card error-card">No result data</div>`;switch(this.getCardType()){case`full`:return this.renderFullCard();case`medium`:return this.renderMediumCard();case`minimal`:return this.renderMinimalCard();default:return this.renderMinimalCard()}}listeners(){let e=this.$(`.card`);e&&this.result.data&&(e.style.cursor=`pointer`,e.onclick=e=>{e.target.tagName!==`A`&&this.modalContext.set({isOpen:!0,element:this.result},!0)})}};window.customElements.define(`plain-dynamic-card`,Ke);var qe=class extends i{resultContext;filterContext;searchContext;configContext;metagoraContext;expandedAgoraCards=new Set;skipScrollOnRender=!1;lastExpandedAgoraId=null;savedScrollPosition=0;constructor(){super(`plain-artifact-display`,Re),this.resultContext=this.useContext(g.RESULT,!0),this.filterContext=this.useContext(g.FILTER,!0),this.searchContext=this.useContext(g.SEARCH,!0),this.configContext=this.useContext(g.CONFIG),this.metagoraContext=this.useContext(g.METAGORA)}scrollCarousel(e,t){let n=this.$(`.carousel-container[data-service="${e}"]`);if(!n)return;let r=n.clientWidth*.8,i=t===`left`?n.scrollLeft-r:n.scrollLeft+r;n.scrollTo({left:i,behavior:`smooth`})}getServiceColor(e){let t=0;for(let n=0;n<e.length;n++)t=e.charCodeAt(n)+((t<<5)-t);return`hsl(${Math.abs(t%360)}, 80%, 55%)`}getUniqueAgorasFromItems(e){let t=this.metagoraContext.get(`agoras`)||[];return[...new Set(e.map(e=>e._sourceHost).filter(Boolean))].map(e=>t.find(t=>t.host===e)||{host:e,name:e,primaryColor:`#6b7280`,secondaryColor:null})}renderAgoraBadges(e){let t=this.getUniqueAgorasFromItems(e);return t.length===0?``:t.map(e=>this.html`
            <a 
                href="${e.host}"
                target="_blank"
                class="agora-badge" 
                style="border-color: ${e.primaryColor}; color: ${e.primaryColor}; background-color: ${e.primaryColor}22;"
            >
                ${e.name}
            </a>
        `).join(``)}groupItemsByAgora(e){let t=this.metagoraContext.get(`agoras`)||[],n=new Map;e.forEach(e=>{let t=e._sourceHost||`unknown`;n.has(t)||n.set(t,[]),n.get(t).push(e)});let r=[];return n.forEach((e,n)=>{let i=t.find(e=>e.host===n)||{host:n,name:n.replace(/^https?:\/\//,``).split(`/`)[0],primaryColor:`#6b7280`,secondaryColor:null};r.push({agora:i,items:e})}),r.sort((e,t)=>t.items.length-e.items.length)}renderAgoraCards(e,t){let n=this.groupItemsByAgora(e);return this.html`
            <div class="agora-cards-grid">
                ${n.map(e=>{let n=`${t}-${e.agora.host.replace(/[^a-zA-Z0-9]/g,`-`)}`,r=this.expandedAgoraCards.has(n),i=r?e.items:e.items.slice(0,4),a=r?0:e.items.length-i.length,o=this.renderAgoraCarouselItems(i);return this.html`
                        <div class="agora-card" style="--agora-color: ${e.agora.primaryColor};">
                            <div class="agora-card-header">
                                <div class="agora-info">
                                    <a 
                                        href="${e.agora.host}"
                                        target="_blank"
                                        class="agora-badge"
                                        style="border-color: ${e.agora.primaryColor}; color: ${e.agora.primaryColor}; background-color: ${e.agora.primaryColor}22;"
                                    >
                                        ${e.agora.name}
                                    </a>
                                    <span class="agora-result-count">${e.items.length} results</span>
                                </div>
                                <div class="agora-carousel-controls">
                                    <button class="agora-arrow-btn left" data-agora="${n}" aria-label="Scroll left">
                                        ${se}
                                    </button>
                                    <button class="agora-arrow-btn right" data-agora="${n}" aria-label="Scroll right">
                                        ${oe}
                                    </button>
                                </div>
                            </div>
                            <div class="agora-items" data-agora="${n}">
                                ${o}
                                ${a>0?this.html`
                                    <button 
                                        class="more-results-card" 
                                        data-expand-agora="${n}"
                                        style="background-color: ${e.agora.primaryColor}11; border-color: ${e.agora.primaryColor}33;"
                                    >
                                        <span class="more-count">+${a}</span>
                                        <span class="more-label">more results</span>
                                    </button>
                                `:``}
                            </div>
                        </div>
                    `}).join(``)}
            </div>
        `}renderAgoraCarouselItems(e){let t=[];for(let n=0;n<e.length;n++){let r=e[n];if(this.getCardType(r)===`medium`&&n+1<e.length){let i=e[n+1];if(this.getCardType(i)===`medium`){t.push(this.html`
                        <div class="stacked-column">
                            <plain-dynamic-card 
                                result='${JSON.stringify(r).replace(/'/g,`&apos;`)}'
                            ></plain-dynamic-card>
                            <plain-dynamic-card 
                                result='${JSON.stringify(i).replace(/'/g,`&apos;`)}'
                            ></plain-dynamic-card>
                        </div>
                    `),n++;continue}}t.push(this.html`
                <plain-dynamic-card 
                    result='${JSON.stringify(r).replace(/'/g,`&apos;`)}'
                ></plain-dynamic-card>
            `)}return t.join(``)}scrollAgoraCarousel(e,t){let n=this.$(`.agora-items[data-agora="${e}"]`);if(!n)return;let r=n.clientWidth*.6,i=t===`left`?n.scrollLeft-r:n.scrollLeft+r;n.scrollTo({left:i,behavior:`smooth`})}getValueByPath(e,t){if(t===`origin`){let t=e.data,n=t?.x_origin||t?.x_university_origin||t?.x_home_partner_institution||t?.x_host_university||t?.x_participating_universities;return n?Ce(n):void 0}return t.split(`.`).reduce((e,t)=>e&&e[t],e)}getCardType(e){let t=e?.data;if(!t)return`minimal`;let n=t?.name||t?.display_name,r=t?.x_summary||t?.x_description,i=t?.x_image,a=t?.x_origin||t?.x_home_partner_institution||t?.x_host_university||t?.x_participating_universities,o=t?.x_web_link||t?.x_link||t?.x_more_info||t?.x_additional_link,s=e?.model_view_url;return n&&r&&i&&a&&o&&s?`full`:n&&r?`medium`:`minimal`}template(){let e=this.resultContext.get(),t=this.filterContext.get()?.filters||{},n=this.filterContext.get()?.mapping||{},r=this.searchContext.get()?.current?.join(` `),i=this.configContext.get(`IS_METAGORA`);return e?i&&e.groupedByCategory?this.renderMetagoraTemplate(e.groupedByCategory,t,n,r):e.grouped?this.renderAgoraTemplate(e.grouped,t,n,r):``:``}applyFiltersToItems(e,t,n){return e.filter(e=>Object.entries(t).every(([t,r])=>{let i=Array.isArray(r)?r:[r];if(i.length===0)return!0;let a=n[t]&&n[t].length>0?n[t][0]:t,o=this.getValueByPath(e,a);return i.some(e=>typeof e==`boolean`?!!o===e:Array.isArray(o)?o.some(t=>String(t).toLowerCase()===String(e).toLowerCase()):String(o).toLowerCase()===String(e).toLowerCase())}))}renderCarouselItems(e){let t=[];for(let n=0;n<e.length;n++){let r=e[n];if(this.getCardType(r)===`medium`&&n+1<e.length){let i=e[n+1];if(this.getCardType(i)===`medium`){t.push(this.html`
                        <div class="stacked-column">
                            <plain-dynamic-card 
                                result='${JSON.stringify(r).replace(/'/g,`&apos;`)}'
                            ></plain-dynamic-card>
                            <plain-dynamic-card 
                                result='${JSON.stringify(i).replace(/'/g,`&apos;`)}'
                            ></plain-dynamic-card>
                        </div>
                    `),n++;continue}}t.push(this.html`
                <plain-dynamic-card 
                    result='${JSON.stringify(r).replace(/'/g,`&apos;`)}'
                ></plain-dynamic-card>
            `)}return t.join(``)}renderAgoraTemplate(e,t,n,r){let i=e.map(e=>({...e,items:this.applyFiltersToItems(e.items,t,n)})).filter(e=>e.items.length>0);return i.length===0?this.html`
                <div class="empty-state">
                    <p>No results found matching the filters.</p>
                </div>
            `:this.html`
            <div class="results-container">
                ${r?`<div class="results-label">Results for "${r}"...</div>`:``}
                ${i.map(e=>{let t=e.service.replace(/\s+/g,`-`).toLowerCase(),n=this.getServiceColor(e.service);return this.html`
                        <div class="service-section">
                            <div class="service-header">
                                <div class="header-left">
                                    <div class="accent-bar" style="background-color: ${n}"></div>
                                    <h2 class="service-title">${e.service.toUpperCase()}</h2>
                                    <span class="result-count">${e.items.length} results</span>
                                </div>
                                <div class="carousel-controls">
                                    <button class="arrow-btn left" data-service="${t}" aria-label="Scroll left">
                                        ${se}
                                    </button>
                                    <button class="arrow-btn right" data-service="${t}" aria-label="Scroll right">
                                        ${oe}
                                    </button>
                                </div>
                            </div>
                            <div class="carousel-wrapper" data-service="${t}">
                                <div class="carousel-container" data-service="${t}">
                                    ${this.renderCarouselItems(e.items)}
                                </div>
                            </div>
                        </div>
                    `}).join(``)}
            </div>
        `}renderMetagoraTemplate(e,t,n,r){let i=e.map(e=>({...e,services:e.services.map(e=>({...e,items:this.applyFiltersToItems(e.items,t,n)})).filter(e=>e.items.length>0)})).filter(e=>e.services.length>0);return i.length===0?this.html`
                <div class="empty-state">
                    <p>No results found matching the filters.</p>
                </div>
            `:this.html`
            <div class="results-container">
                ${r?`<div class="results-label">Results for "${r}"...</div>`:``}
                ${i.map(e=>{let t=e.category.replace(/\s+/g,`-`).toLowerCase(),n=e.services.reduce((e,t)=>e+t.items.length,0),r=e.services.flatMap(e=>e.items);return this.html`
                        <div class="category-section" data-category="${t}">
                            <div class="category-header">
                                <div class="category-accent-bar"></div>
                                <h2 class="category-title">${e.category.toUpperCase()}</h2>
                                <span class="category-result-count">${n} results</span>
                                <div class="category-agora-badges">
                                    ${this.renderAgoraBadges(r)}
                                </div>
                            </div>
                            <div class="category-services">
                                ${e.services.map(e=>{let n=`${t}-${e.service.replace(/\s+/g,`-`).toLowerCase()}`,r=this.getServiceColor(e.service);return this.html`
                                        <div class="service-section">
                                            <div class="service-header">
                                                <div class="header-left">
                                                    <div class="accent-bar" style="background-color: ${r}"></div>
                                                    <h3 class="service-title">${e.service}</h3>
                                                    <span class="result-count">${e.items.length} results</span>
                                                </div>
                                            </div>
                                            ${this.renderAgoraCards(e.items,n)}
                                        </div>
                                    `}).join(``)}
                            </div>
                        </div>
                    `}).join(``)}
            </div>
        `}afterRender(){if(this.skipScrollOnRender){if(this.skipScrollOnRender=!1,this.lastExpandedAgoraId){let e=this.$(`.agora-items[data-agora="${this.lastExpandedAgoraId}"]`);e&&(e.style.scrollBehavior=`auto`,e.scrollLeft=this.savedScrollPosition,requestAnimationFrame(()=>{e.style.scrollBehavior=``})),this.lastExpandedAgoraId=null}return}this.scrollTo({top:0,behavior:`smooth`}),this.$(`.results-container`)&&Pe({source:`artifact-display-results`,debounceMs:220})}expandAgoraCard(e){let t=this.$(`.agora-items[data-agora="${e}"]`);this.savedScrollPosition=t?t.scrollLeft:0,this.expandedAgoraCards.add(e),this.skipScrollOnRender=!0,this.lastExpandedAgoraId=e,this.render()}listeners(){let e=this.resultContext.get(),t=this.configContext.get(`IS_METAGORA`);e&&(t&&e.groupedByCategory?(e.groupedByCategory.forEach(e=>{let t=e.category.replace(/\s+/g,`-`).toLowerCase();e.services.forEach(e=>{let n=`${t}-${e.service.replace(/\s+/g,`-`).toLowerCase()}`;this.groupItemsByAgora(e.items).forEach(e=>{let t=`${n}-${e.agora.host.replace(/[^a-zA-Z0-9]/g,`-`)}`,r=this.$(`.agora-arrow-btn.left[data-agora="${t}"]`),i=this.$(`.agora-arrow-btn.right[data-agora="${t}"]`);r&&(r.onclick=()=>this.scrollAgoraCarousel(t,`left`)),i&&(i.onclick=()=>this.scrollAgoraCarousel(t,`right`))})})}),this.$$(`.more-results-card[data-expand-agora]`).forEach(e=>{let t=e.getAttribute(`data-expand-agora`);t&&(e.onclick=()=>this.expandAgoraCard(t))})):e.grouped&&e.grouped.forEach(e=>{let t=e.service.replace(/\s+/g,`-`).toLowerCase(),n=this.$(`.arrow-btn.left[data-service="${t}"]`),r=this.$(`.arrow-btn.right[data-service="${t}"]`);n&&(n.onclick=()=>this.scrollCarousel(t,`left`)),r&&(r.onclick=()=>this.scrollCarousel(t,`right`))}))}};window.customElements.define(`plain-artifact-display`,qe);var Je=`.agora-input-container {
    margin: 0 auto;

    width: 100%;
    max-width: 800px;

    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    font-family: var(--agora-font-body, 'Geist'), sans-serif;
}

/* Responsive */
@media (max-width: 768px) {
    .agora-input-container {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        max-width: 100%;
        gap: 0;
        margin: 0;
        padding: 12px;
        background: #fff;
        z-index: 100;
        box-sizing: border-box;
    }
}
`,Ye=`.search-card {
    position: relative;

    border: 1px solid #eef2f6;
    border-radius: 16px;

    background: transparent;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);

    z-index: 100;

    transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.search-card::before {
    content: '';
    position: absolute;

    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;

    border-radius: 18px;

    background: linear-gradient(45deg,
            #3a85fe,
            #febd0b,
            #fe006e,
            #8238eb,
            #fa5607,
            #3a85fe);
    background-size: 400%;

    filter: blur(12px);
    opacity: 0;

    z-index: -1;

    transition: opacity 0.5s ease;
    animation: glowing 20s linear infinite;
}

.search-card.mode-chat::before {
    opacity: 0.5;
}

@keyframes glowing {
    0% {
        background-position: 0 0;
    }

    50% {
        background-position: 400% 0;
    }

    100% {
        background-position: 0 0;
    }
}
`,Xe=`.card-header {
    padding: 0.5rem 1rem;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;

    border-bottom: 1px solid #e2e8f0;
    border-radius: 16px 16px 0 0;

    background-color: #f1f5f9;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

.clear-btn-header,
.new-chat-btn {
    cursor: pointer;
    
    padding: 0.5rem;
    
    display: flex;
    align-items: center;
    justify-content: center;
    
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    
    background: #fff;
    color: #64748b;
    
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    
    opacity: 1;
    transform: scale(1);
}

.clear-btn-header svg,
.new-chat-btn svg {
    width: 18px;
    height: 18px;
}

.clear-btn-header:hover {
    background: #fee2e2;
    border-color: #fecaca;
    color: #dc2626;
}

.new-chat-btn:hover {
    background: #f0fdf4;
    border-color: #bbf7d0;
    color: #16a34a;
}

.clear-btn-header:active,
.new-chat-btn:active {
    transform: scale(0.95);
}

.clear-btn-header.hidden,
.new-chat-btn.hidden {
    opacity: 0;
    transform: scale(0.8);
    pointer-events: none;
}
`,Ze=`.card-body {
    padding: 1rem 1.5rem;

    display: flex;
    align-items: flex-start;
    gap: 1rem;

    border-radius: 0 0 16px 16px;

    background: #fff;
}

.icon {
    display: flex;
    align-items: center;
    color: #94a3b8;
    padding-top: 0.5rem;
    flex-shrink: 0;
}

.icon svg {
    width: 24px;
    height: 24px;
}

.globe-icon {
    color: #94a3b8;
}

textarea {
    flex: 1;
    border: none;
    outline: none;
    font-size: 16px;
    color: #1e293b;
    background: transparent;
    padding: 0.5rem 0;
    font-family: inherit;
    resize: none;
    field-sizing: content;
    min-height: 26px;
    max-height: 300px;
    line-height: 1.5;
    transition: min-height 0.3s ease;
}

.search-card.mode-chat textarea {
    min-height: 120px;
}

textarea::placeholder {
    font-size: 16px;
    color: #94a3b8;
    transition: opacity 0.2s ease;
    opacity: 1;
}

textarea.placeholder-hidden::placeholder {
    opacity: 0;
}

.actions {
    align-self: flex-end;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.shortcut {
    font-size: 0.8rem;
    color: #94a3b8;
    border: 1px solid #e2e8f0;
    padding: 0.2rem 0.5rem;
    border-radius: 6px;
    background: #f8fafc;
    font-family: inherit;
}

.go-btn {
    padding: 0.6rem 1.5rem;
    cursor: pointer;

    border: none;
    border-radius: 8px;

    background: #0f172a;

    color: #fff;
    font-weight: 600;
    font-size: 14px;

    transition: background 0.2s;
}

.go-btn:hover {
    background: #1e293b;
}

/* Responsive */
@media (max-width: 768px) {
    .card-body {
        padding: 0.75rem 1rem;
        gap: 0.5rem;
    }

    textarea {
        font-size: 16px; /* prevents iOS zoom on focus */
    }

    textarea::placeholder {
        font-size: 14px;
    }

    .search-card.mode-chat textarea {
        min-height: 80px;
    }

    .shortcut {
        display: none;
    }

    .go-btn {
        padding: 0.5rem 1rem;
    }
}
`,Qe=`.tabs-single {
    padding: 0.5rem 0;

    display: flex;
}

.tab-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    font-size: 14px;
    color: #0f172a;
}

.tabs {
    padding: 4px;

    position: relative;

    display: inline-flex;

    border-radius: 10px;

    background-color: #e2e8f0;
}

.tab-slider {
    position: absolute;
    top: 4px;
    bottom: 4px;
    left: 4px;

    width: calc(50% - 4px);

    border-radius: 8px;

    background-color: #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

    z-index: 1;

    transition: transform 0.25s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.tabs.mode-chat .tab-slider {
    transform: translateX(100%);
}

.tab {
    cursor: pointer;

    padding: 0.5rem 1rem;

    position: relative;

    width: 110px;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    border: none;
    border-radius: 8px;

    background: transparent;

    font-size: 12px;
    font-weight: 500;
    color: #64748b;

    transition: color 0.2s ease;

    z-index: 2;
}

.tabs.mode-search .tab[data-mode="search"],
.tabs.mode-chat .tab[data-mode="chat"] {
    color: #0f172a;
}

.tab:hover:not(.active) {
    color: #334155;
}

/* Responsive */
@media (max-width: 768px) {
    .tab {
        width: 90px;
        padding: 0.4rem 0.75rem;
        font-size: 11px;
    }
}
`,$e=`.trending {
    display: grid;
    grid-template-rows: 1fr;
    transition: grid-template-rows 0.3s ease, opacity 0.3s ease, margin-top 0.3s ease, transform 0.3s ease;
    opacity: 1;
    transform: translateY(0);
}

.trending.hidden {
    grid-template-rows: 0fr;
    opacity: 0;
    transform: translateY(10px);
    pointer-events: none;
    margin-top: -1.5rem;
}

.trending-content {
    overflow: hidden;
    padding-left: 0.5rem;
}

.trending .label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #94a3b8;
    margin-bottom: 0.75rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
}

.chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
}

.chip {
    cursor: pointer;

    padding: 0.4rem 1rem;

    border: 1px solid #e2e8f0;
    border-radius: 20px;

    color: #475569;
    font-family: var(--agora-font-body, 'Geist Mono'), sans-serif;
    font-size: 12px;

    background: #fff;
    transition: all 0.2s;
}

.chip:hover {
    border-color: #cbd5e1;
    background: #f8fafc;
    color: #1e293b;
}

/* Responsive */
@media (max-width: 768px) {
    .trending {
        display: none;
    }
}
`,et=`.suggestions {
    position: absolute;
    bottom: calc(100% + 10px);
    left: 0;
    right: 0;

    background: #fff;
    border-radius: 16px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);

    overflow: hidden;
    z-index: 10;

    display: grid;
    grid-template-rows: 1fr;
    opacity: 1;
    transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, transform 0.3s ease;
    transform: translateY(0);
}

.suggestions.hidden {
    grid-template-rows: 0fr;
    opacity: 0;
    transform: translateY(10px);
    display: grid;
    pointer-events: none;
}

.suggestions-content {
    min-height: 0;
    padding: 0.5rem 0;
}

.suggestion-item {
    padding: 0.75rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    transition: background 0.2s;
    color: #64748b;
}

.suggestion-item .highlight {
    color: #3b82f6;
    font-weight: 600;
}

.suggestion-item:hover,
.suggestion-item.active {
    background: #f1f5f9;
}

.tab-hint {
    margin-left: auto;
    font-size: 10px;
    font-weight: 600;
    color: #94a3b8;
    background: #e2e8f0;
    padding: 2px 6px;
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.2s;
}

.suggestion-item:hover .tab-hint,
.suggestion-item.active .tab-hint {
    opacity: 1;
}

/* Responsive */
@media (max-width: 768px) {
    .suggestions-content {
        max-height: 200px;
        overflow-y: auto;
    }

    .suggestion-item {
        padding: 0.6rem 1rem;
    }

    .tab-hint {
        display: none;
    }
}
`,tt=`.mentions {
    position: absolute;
    bottom: calc(100% + 10px);
    left: 0;
    right: 0;

    background: #fff;
    border-radius: 16px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;

    overflow: hidden;
    z-index: 11;

    display: grid;
    grid-template-rows: 1fr;
    opacity: 1;
    transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, transform 0.3s ease;
    transform: translateY(0);
}

.mentions.hidden {
    grid-template-rows: 0fr;
    opacity: 0;
    transform: translateY(10px);
    display: grid;
    pointer-events: none;
}

.mentions-header {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e2e8f0;
    background: #f8fafc;
}

.mentions-label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #64748b;
}

.mentions-content {
    min-height: 0;
    padding: 0.5rem 0;
    max-height: 240px;
    overflow-y: auto;
}

.mention-item {
    padding: 0.75rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    cursor: pointer;
    transition: background 0.2s;
}

.mention-item:hover,
.mention-item.active {
    background: #f1f5f9;
}

.mention-name {
    font-size: 14px;
    font-weight: 500;
    color: #1e293b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.mention-meta {
    font-size: 12px;
    color: #64748b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
`;const w={RESULTS_FETCHED:`results-fetched`,RESULTS_CLEARED:`results-cleared`,CHAT_STARTED:`chat-started`,CHAT_USER_MESSAGE:`chat-user-message`,CHAT_MESSAGE_CHUNK:`chat-message-chunk`,CHAT_MESSAGE_COMPLETE:`chat-message-complete`,CHAT_RESULTS_UPDATED:`chat-results-updated`,CHAT_FETCHING_RESULTS:`chat-fetching-results`,NEW_CHAT:`new-chat`,MODE_SWITCH:`mode-switch`,FILTERS_AVAILABILITY_CHANGED:`filters-availability-changed`,CHAT_EXPAND_TOGGLED:`chat-expand-toggled`,CHAT_RETRY_REQUESTED:`chat-retry-requested`,CHAT_REASONING_CHUNK:`chat-reasoning-chunk`};function nt(e){return e.length&&Math.max(...e.map(e=>e.score))||1}function rt(e,t){let n=e.filter(e=>e.service===t);return n.length&&Math.max(...n.map(e=>e.score))||1}function it(e,t,n=.1){return e.filter(e=>e.score[t]>=n)}function at(e,t){e.forEach(e=>{let n=t.find(t=>t.models.includes(e.model));n?(e.service=n.service,e.serviceCategory=n.category):(console.warn(`No service found for model: ${e.model}`),e.service=`unknown`,e.serviceCategory=`Other`)})}function ot(e,t,n){let r=nt(e);return e.sort((e,t)=>t.score-e.score).map(i=>{let a=t.find(e=>e.model===i.model),o=a?.name||i.model,s=a?.website,c=a?.url,l=i._sourceHost||n,u=s?`${s}${c}`:`${l}${c}`,d=rt(e,i.service);return{model:i.model,model_verbose_name:o,model_view_url:u,service:i.service,serviceCategory:i.serviceCategory||`Other`,featured_fields:i.featured_fields||[`web_link`,`url`,`website`],featured:i.featured||!1,data:i.data,roots:i.roots,score:{absolute:Number((i.score/r).toFixed(2)),relative:Number((i.score/d).toFixed(2))},_sourceHost:i._sourceHost}})}function st(e){return[...new Set(e.map(e=>e.service))].sort().map(t=>{let n=e.filter(e=>e.service===t);return{service:t,items:n}})}function ct(e){return[...new Set(e.map(e=>e.serviceCategory))].sort().map(t=>{let n=e.filter(e=>e.serviceCategory===t),r=[...new Set(n.map(e=>e.service))].sort().map(e=>({service:e,items:n.filter(t=>t.service===e)}));return{category:t,services:r}})}function lt(e,t,n=5){return e.filter(e=>e.toLowerCase().includes(t.toLowerCase())).reverse().slice(0,n)}function ut(e,t){let n=t.length,r=e.substring(0,n),i=e.substring(n);return{match:r,rest:i}}var dt=`:host {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 10000;
    pointer-events: none;
}

.toast-container-wrapper {
    display: flex;
    flex-direction: column-reverse;
    gap: 10px;
}

.toast-item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    padding-bottom: 18px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background: #333;
    color: #fff;
    font-size: 14px;
    max-width: 400px;
    min-width: 280px;
    pointer-events: auto;
    overflow: hidden;
}

/* Fade in animation */
.toast-item.fade-in {
    animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* Fade out animation */
.toast-item.fade-out {
    animation: slideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(calc(100% + 20px));
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideOut {
    from {
        opacity: 1;
        transform: translateX(0);
    }
    to {
        opacity: 0;
        transform: translateX(calc(100% + 20px));
    }
}

.toast-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    font-size: 14px;
    font-weight: bold;
    flex-shrink: 0;
}

.toast-message {
    flex: 1;
    line-height: 1.4;
    word-break: break-word;
}

.toast-close {
    background: none;
    border: none;
    color: inherit;
    font-size: 20px;
    cursor: pointer;
    padding: 0;
    margin-left: 8px;
    opacity: 0.7;
    transition: opacity 0.2s;
    line-height: 1;
}

.toast-close:hover {
    opacity: 1;
}

/* Progress bar */
.toast-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 4px;
    width: 100%;
    background: rgba(255, 255, 255, 0.3);
    transform-origin: left;
}

.toast-item.fade-in .toast-progress {
    animation: progress var(--duration, 5000ms) linear forwards;
}

@keyframes progress {
    from {
        transform: scaleX(1);
    }
    to {
        transform: scaleX(0);
    }
}

/* Type variants */
.toast-item.error {
    background: #dc3545;
}

.toast-item.error .toast-icon {
    background: rgba(255, 255, 255, 0.2);
}

.toast-item.error .toast-progress {
    background: rgba(255, 255, 255, 0.4);
}

.toast-item.warning {
    background: #ffc107;
    color: #333;
}

.toast-item.warning .toast-icon {
    background: rgba(0, 0, 0, 0.1);
}

.toast-item.warning .toast-progress {
    background: rgba(0, 0, 0, 0.2);
}

.toast-item.info {
    background: #17a2b8;
}

.toast-item.info .toast-icon {
    background: rgba(255, 255, 255, 0.2);
}

.toast-item.info .toast-progress {
    background: rgba(255, 255, 255, 0.4);
}

.toast-item.success {
    background: #28a745;
}

.toast-item.success .toast-icon {
    background: rgba(255, 255, 255, 0.2);
}

.toast-item.success .toast-progress {
    background: rgba(255, 255, 255, 0.4);
} `,ft=class extends i{constructor(){super(`toast-container`,dt)}template(){return this.html`
            <div class="toast-container-wrapper"></div>
        `}addToast(e){let t=this.$(`.toast-container-wrapper`);if(!t)return;let n=document.createElement(`div`),r=e.type||`info`,i=e.duration||5e3;n.className=`toast-item ${r} fade-in`,n.style.setProperty(`--duration`,`${i}ms`),n.innerHTML=`
            <div class="toast-icon">${this.getIcon(r)}</div>
            <div class="toast-message">${e.message}</div>
            <button class="toast-close">×</button>
            <div class="toast-progress"></div>
        `,t.appendChild(n);let a=n.querySelector(`.toast-close`);a&&a.addEventListener(`click`,()=>this.removeToast(n)),setTimeout(()=>{this.removeToast(n)},i)}removeToast(e){if(!e.parentElement)return;e.classList.remove(`fade-in`),e.classList.add(`fade-out`);let t=n=>{n.animationName===`slideOut`&&(e.removeEventListener(`animationend`,t),e.remove())};e.addEventListener(`animationend`,t)}getIcon(e){return{error:`✕`,warning:`⚠`,info:`ℹ`,success:`✓`}[e]}};function pt(e,t=`info`,n=5e3){let r=document.querySelector(`agora-app-v2`)?.shadowRoot?.querySelector(`toast-container`);r&&r.addToast({message:e,type:t,duration:n})}function mt(e,t){if(!v.DEBUG_MODE)return;let n=e instanceof Error?e.message:e,r=t?`[${t}] ${n}`:n;pt(r,`error`,8e3)}window.customElements.define(`toast-container`,ft);var ht={GET_AGORA_SERVICES:`/catalogue-api/v2/acceleration-services/1`,GET_AGORA_SEARCH_RESULTS:`/elastic/search`,GET_AGORA_INGEST_MODEL:`/elastic/ingest`,SEND_MESSAGE:`/rag/stream`,FETCH_ELEMENT:`/catalogue-api/v2`,GET_AIDA_API_KEY:`/catalogue-api/v2/api-key/aida`,GET_HOME_VISUAL_CONFIG:`/catalogue-api/v2/home-visual-config`,GET_ACTIVE_PROMPT_CONFIG:`/ai/prompt/config/active`};async function gt(e,t={}){let{maxRetries:n=2,timeoutMs:r=5e3,delayMs:i=1e3}=t,a=null;for(let t=0;t<=n;t++){let o=new AbortController,s=setTimeout(()=>o.abort(),r);try{let t=await fetch(e,{signal:o.signal});return clearTimeout(s),t}catch(e){clearTimeout(s),a=e,t<n&&await new Promise(e=>setTimeout(e,i))}}throw a}const _t={GET_ALL_AGORA_URLS:async()=>[`https://agora.unite-university.eu/`,`https://eugreen.pre.widening.eu/`,`https://eudres.widening.eu/`,`https://civis.widening.eu/`,`https://aupaeu.widening.eu/`,`https://forthem.widening.eu/`,`https://eutopia-agora.widening.eu/`,`https://circle-u.widening.eu/`,`https://heroes.widening.eu/`,`https://uninovis.widening.eu/`,`https://foreu4all.widening.eu/`],GET_AGORA_SERVICES:async e=>{try{let t=`${e}${ht.GET_AGORA_SERVICES}`,n=await fetch(t);if(!n.ok)throw mt(Error(`Failed to fetch Agora services from ${t}`),`GET_AGORA_SERVICES`),Error(`Something went wrong while fetching the Agora services`);return await n.json()}catch(e){throw mt(e,`GET_AGORA_SERVICES`),e}},GET_AGORA_SEARCH_RESULTS:async(e,t,n,r,i)=>{if(!t||t.length===0)throw Error(`No query provided`);if(n.length===0)throw Error(`No models provided for the search`);let a=`${e}${ht.GET_AGORA_SEARCH_RESULTS}?query=${t}&models=${n.join()}`;try{let e=await fetch(a);if(!e.ok&&e.status===404){let t=await e.json();throw Error(JSON.stringify(t))}return await e.json()}catch(e){throw mt(e,`GET_AGORA_SEARCH_RESULTS`),e}},GET_AGORA_INGEST_MODEL:async(e,t)=>{let n=`${e}${ht.GET_AGORA_INGEST_MODEL}/${t}`;try{let e=await fetch(n);if(!e.ok){let t=await e.json();throw Error(t.message)}return await e.json()}catch(e){throw mt(e,`GET_AGORA_INGEST_MODEL`),e}},SEND_MESSAGE:async(e,t,n=null,r=null,i=[`source_model`,`source_id`],a=null)=>{let o={message:t,stream_mode:`custom`};n&&(o.context=n),r&&(o.session_id=r),i&&(o.artifact_keys=i);let s=`${e}${ht.SEND_MESSAGE}`,c={"Content-Type":`application/json`};a&&(c[`X-Prompt-Config-Id`]=a);try{let e=await fetch(s,{method:`POST`,headers:c,body:JSON.stringify(o)});if(!e.ok)throw Error(`Something went wrong while sending message`);return e.body instanceof ReadableStream?e:await e.json()}catch(e){throw mt(e,`SEND_MESSAGE`),e}},FETCH_ELEMENT:async(e,t,n)=>{let r=`${e}${ht.FETCH_ELEMENT}/${t}/${n}`;try{let e=localStorage.getItem(`aida_ak`);if(!e)throw Error(`AIDA API key not found. Please ensure you are properly authenticated.`);let i=await fetch(r,{method:`GET`,headers:{accept:`application/json`,Authorization:`Bearer ${e}`}});if(!i.ok){if(i.status===404){let e=await i.json();throw Error(JSON.stringify(e))}if(i.status===401||i.status===403){let e=await i.json();throw Error(JSON.stringify(e))}throw Error(`Failed to fetch element ${t}/${n}`)}return await i.json()}catch(e){throw mt(e,`FETCH_ELEMENT`),e}},GET_AIDA_API_KEY:async(e,t=[])=>{try{let n=new URLSearchParams;t&&t.length>0&&n.append(`models`,t.join(`,`));let r=`${e}${ht.GET_AIDA_API_KEY}${n.toString()?`?${n.toString()}`:``}`,i=await fetch(r,{method:`GET`,headers:{accept:`application/json`}});if(!i.ok){if(i.status===400){let e=await i.json();throw Error(e.error?.message||`Bad request when fetching API key`)}if(i.status===500){let e=await i.json();throw Error(e.error?.message||`Server error when fetching API key`)}throw Error(`Something went wrong while fetching AIDA API key`)}return await i.json()}catch(e){throw mt(e,`GET_AIDA_API_KEY`),e}},GET_MULTIPLE_AIDA_API_KEYS:async(e,t={})=>{let n={};return await Promise.all(e.map(async e=>{try{let r=await _t.GET_AIDA_API_KEY(e,t[e]);r?.token?.jwt_token&&(n[e]=r.token.jwt_token)}catch(t){console.warn(`Failed to fetch API key for host: ${e}`,t)}})),n},GET_HOME_VISUAL_CONFIG:async e=>{try{let t=`${e}${ht.GET_HOME_VISUAL_CONFIG}`,n=await gt(t);return n.ok?await n.json():(console.warn(`Failed to fetch visual config from ${t} (status: ${n.status})`),null)}catch(e){return console.warn(`Error fetching home visual config:`,e),null}},GET_ACTIVE_PROMPT_CONFIG:async e=>{try{let t=`${e}${ht.GET_ACTIVE_PROMPT_CONFIG}`,n=await fetch(t);return n.ok?(await n.json())?.data?.config_id??null:(console.warn(`Failed to fetch active prompt config`),null)}catch(e){return console.warn(`Error fetching active prompt config:`,e),null}}},vt=(e,t)=>{let n=[];function r(e){for(let i in e)Object.prototype.hasOwnProperty.call(e,i)&&(i===t&&n.push({[t]:e[i]}),typeof e[i]==`object`&&e[i]!==null&&r(e[i]))}return r(e),n};var yt=null;function bt(){if(yt!==null)return yt;try{let e=new URLSearchParams(window.location.search).get(`debug_reasoning`);yt=e!==null&&/^(1|true|yes|on)$/i.test(e)}catch{yt=!1}return yt}var xt=class{deps;callbacks;messageBuffer=``;reasoningBuffer=``;isFirstChunk=!0;shouldResetResults=!1;completionEmitted=!1;constructor(e,t){this.deps=e,this.callbacks=t}async chat(e){if(!e){console.warn(`No message provided`);return}this.callbacks.showSpinner(),this.isFirstChunk=!0,this.messageBuffer=``,this.reasoningBuffer=``,this.completionEmitted=!1,this.deps.signals.emit(w.CHAT_STARTED),this.storeMessageInChatContext(e,`user`),this.deps.signals.emit(w.CHAT_USER_MESSAGE);try{let t=this.deps.configContext.get(`AI_HOST`),n=this.extractMentionsFromMessage(e),r=this.filterResultsByMentions(n),i=this.buildChatContext(r),a=this.deps.chatContext.get(`sessionId`)||null,o=this.deps.configContext.get(`PROMPT_CONFIG_ID`)||null,s=await _t.SEND_MESSAGE(t,e,i,a,void 0,o),c=s.headers?.get(`X-Session-Id`)??s.headers?.get(`x-session-id`);if(c&&this.deps.chatContext.set(c,`sessionId`),s.body instanceof ReadableStream)await this.handleStreamingResponse(s);else{let e=s,t=e.response||e.message||``;this.storeMessageInChatContext(t,`ai`),this.deps.signals.emit(w.CHAT_MESSAGE_COMPLETE,t)}}catch(e){console.error(`Chat error:`,e),this.emitEmptyResponseError()}finally{this.callbacks.hideSpinner(),this.shouldResetResults=!0}}buildChatContext(e){let t=this.deps.companyContext.get(`name`)||`the alliance`,n=this.deps.resultContext.get(`data`)?.length||0,r=e.map(e=>` >> Resource: ${JSON.stringify(e)}\n`),i=[`You are a helpful assistant working in the Metagora platform.`,`Metagora is a HUB that grants access to all university resources and services within all the university alliances that are using the Agora platform.`,`Agora is a platform to manage and share university resources within a university alliance.`,`An Agora is a service that serves as a central hub that provides access to services and resources offered by the alliance members.`,`A university alliance is a collaboration between multiple universities to share resources, knowledge, and services for the benefit of their students and staff.`,`This site is the Metagora.`].join(`
`)+`

`,a=[`You are a helpful assistant working in the Agora platform for the university alliance ${t}.`,`Agora is a platform to manage and share university resources within a university alliance.`,`An Agora is a service that serves as a central hub that provides access to services and resources offered by the alliance members.`,`A university alliance is a collaboration between multiple universities to share resources, knowledge, and services for the benefit of their students and staff.`,`This site is the ${t} Alliance Agora.`].join(`
`)+`

`,o=r.length>0?[`The user is specifically asking about these resources (referenced with @ mentions):`,r.join(`
`),`Take into account the user's previous messages and the context provided by these resources when formulating your response.`].join(`
`):`(No specific resources referenced by the user.)`,s=n>0&&e.length===0?`\nIMPORTANT: The user currently has ${n} results displayed on their screen, but they haven't referenced any specific result using @ mentions. If the user asks about "the results", "these results", or references displayed resources WITHOUT specifying which ones, ask them to specify which result(s) they want to discuss by typing @ followed by the result name (e.g., "@Result Name"). This helps provide accurate and focused responses.`:n>0?`\nNote: The user has ${n} results displayed on their screen. They have referenced ${e.length} specific result(s) using @ mentions.`:``;return[`${this.deps.configContext.get(`IS_METAGORA`)?i:a}`,`If the user asks for more information about the alliance, verify your response on the internet and provide accurate information.`,`If the user asks for resources or related information use your retrieve capabilities to find the most relevant information.
`,`Use the provided context to answer the user's question as accurately as possible.`,`If you don't know the answer, just say you don't know.`,`Do not make up an answer.`,`Always keep your answers concise and to the point.
`,s,o].join(`
`)}storeMessageInChatContext(e,t,n){if(!e||e.trim()===``)return;let r=this.deps.chatContext.get(`history`)||[];r.push({content:e,author:t,time:new Date().toLocaleTimeString(),...n||{}}),this.deps.chatContext.set(r,`history`),this.callbacks.updateClearButtonVisibility()}emitEmptyResponseError(){if(this.completionEmitted)return;let e=this.deps.chatContext.get(`history`)||[];e.push({content:`Something went wrong and I couldn't generate a response. Please try again.`,author:`ai`,time:new Date().toLocaleTimeString(),isError:!0}),this.deps.chatContext.set(e,`history`),this.callbacks.updateClearButtonVisibility(),this.deps.signals.emit(w.CHAT_MESSAGE_COMPLETE,``),this.completionEmitted=!0}async handleStreamingResponse(e){let t=e.body.getReader(),n=new TextDecoder;try{for(;;){let{done:e,value:r}=await t.read();if(e)break;let i=n.decode(r,{stream:!0});console.log(`>> CHUNK RECEIVED:`,i),this.handleChunk(i)}this.completionEmitted||(this.messageBuffer.trim()?(this.storeMessageInChatContext(this.messageBuffer,`ai`,this.reasoningBuffer?{reasoning:this.reasoningBuffer}:void 0),this.deps.signals.emit(w.CHAT_MESSAGE_COMPLETE,this.messageBuffer),this.completionEmitted=!0):this.emitEmptyResponseError(),this.messageBuffer=``,this.reasoningBuffer=``)}catch(e){throw console.error(`Stream reading error:`,e),e}}splitChunkByTags(e){let t=/(\[\$\w+\])(.*?)(?=\[\$\w+\]|$)/gs,n=[],r;for(;(r=t.exec(e))!==null;){let e=r[1],t=r[2];if(e===`[$done]`){n.length>0&&(n[n.length-1].content+=` [$done]`);continue}n.push({tag:e,content:t})}return n}handleChunk(e){this.splitChunkByTags(e).forEach(e=>{if(e.tag===`[$artifact]`)try{let t=JSON.parse(e.content.replace(/'/g,`"`));this.handleChatResults(t)}catch(e){console.error(`Error parsing artifact:`,e)}else if(e.tag===`[$message]`){let t=e.content.includes(`[$done]`),n=t?e.content.split(`[$done]`)[0]:e.content;this.handleChatMessage({isFirstChunk:this.isFirstChunk,isLastChunk:t,message:n}),this.isFirstChunk&&=!1}else if(e.tag===`[$reasoning]`){if(!bt())return;let t=e.content.includes(`[$done]`)?e.content.split(`[$done]`)[0]:e.content;this.reasoningBuffer+=t,this.deps.signals.emit(w.CHAT_REASONING_CHUNK,{chunk:t,fullReasoning:this.reasoningBuffer})}})}handleChatMessage(e){if(e.isFirstChunk&&this.callbacks.hideSpinner(),e.isLastChunk){let t=this.messageBuffer+e.message;t.trim()?(this.storeMessageInChatContext(t,`ai`,this.reasoningBuffer?{reasoning:this.reasoningBuffer}:void 0),this.deps.signals.emit(w.CHAT_MESSAGE_COMPLETE,t),this.completionEmitted=!0):this.emitEmptyResponseError(),this.messageBuffer=``,this.reasoningBuffer=``;return}this.messageBuffer+=e.message,e.message&&this.deps.signals.emit(w.CHAT_MESSAGE_CHUNK,{chunk:e.message,fullMessage:this.messageBuffer})}async handleChatResults(e){if(!e||e.length===0)return;e=e.filter(e=>e.source_model&&e.source_id),e=Array.from(new Set(e.map(e=>JSON.stringify(e)))).map(e=>JSON.parse(e));let t={grouped:[],data:[]};this.shouldResetResults||(t.data=this.deps.resultContext.get(`data`)||[],t.grouped=this.deps.resultContext.get(`grouped`)||[]),this.shouldResetResults&&=!1;let n=this.deps.serviceContext.get(`services`)||[],r=vt(n,`websites`).flatMap(e=>e.websites),i={},a=e=>{t.data.push(e),t.grouped=[...new Set(t.data.map(e=>e.service))].sort().map(e=>({service:e,items:t.data.filter(t=>t.service===e)})),this.deps.resultContext.set(t,!0),this.deps.signals.emit(w.CHAT_RESULTS_UPDATED,t.grouped),this.deps.signals.emit(w.RESULTS_FETCHED,t.data)};this.deps.signals.emit(w.CHAT_FETCHING_RESULTS,!0),(async()=>{for(let t of e){i[t.source_model]=r.find(e=>e.model===t.source_model)?.name||null;let e=t.source_model,o=null;if(n.forEach(t=>{let n=t.fields?.catalogues?.websites;if(!n)return;let r={};n.forEach(t=>{if(!t.model||t.model!==e)return;let n={model:t.model,model_verbose_name:t.model_verbose_name,model_website:t.website,model_view_url:t.url,model_view_id:t.view_id};r[t.model]=n}),e in r&&(o={service:t.fields.name,serviceCategory:we(t.fields.category),models:r})}),!o)continue;let s=o,c;try{c=await _t.FETCH_ELEMENT(this.deps.configContext.get(`API_HOST`),t.source_model,Number(t.source_id))}catch(e){console.error(`Error fetching element:`,e);continue}if(!c)continue;Object.entries(c.fields).forEach(([e,t])=>{if(typeof t==`string`&&(t.startsWith(`[`)||t.startsWith(`{`)))try{let n=xe(t);n&&(c.fields[e]=n.name||t)}catch(n){console.warn(`Could not parse field ${e} with value ${t} as JSON:`,n)}});let l=c.fields?.x_image||null;l&&=l.replace(this.deps.configContext.get(`API_HOST`),``);let u=c.fields?.detail_url?s.models[e].model_website+s.models[e].model_view_url:null,d={data:{...c.fields,id:c.id,image:l},featured:c.fields?.featured||!1,featured_fields:[`web_link`,`url`,`website`],model:t.source_model,model_verbose_name:i[t.source_model],model_view_url:u,roots:[],score:{absolute:null,relative:null},service:s.service,serviceCategory:s.serviceCategory};a(d)}this.deps.signals.emit(w.CHAT_FETCHING_RESULTS,!1)})()}extractMentionsFromMessage(e){let t=/@([^@\n]+?)(?=\s*@|\s*$)/g,n=[],r;for(;(r=t.exec(e))!==null;){let e=r[1].trim();e&&n.push(e.toLowerCase())}return n}filterResultsByMentions(e){return e.length===0?[]:(this.deps.resultContext.get(`data`)||[]).filter(t=>{let n=this.getResultDisplayName(t).toLowerCase();return e.some(e=>n.includes(e)||e.includes(n))})}getResultDisplayName(e){let t=e.data||{};for(let e of[`name`,`title`,`Name`,`Title`,`headline`,`label`,`display_name`])if(t[e]&&typeof t[e]==`string`)return t[e];return e.model_verbose_name||``}clearChatHistory(){this.deps.chatContext.set({history:[],sessionId:null}),this.messageBuffer=``}newChat(e){this.deps.chatContext.set({history:[],sessionId:null}),this.messageBuffer=``,e(),this.deps.signals.emit(w.NEW_CHAT)}};const St=async(e,t,n)=>{if(!t||t.trim()===``)return console.warn(`No query provided`),{data:null};if(n.length===0)return console.warn(`No models provided`),{data:null};let r={raw:t,translated:t};try{let t=await _t.GET_AGORA_SEARCH_RESULTS(e,r.translated,n);return Pe({source:`search-response`,debounceMs:260}),{data:t}}catch(e){throw console.log(`Error during query:`,JSON.parse(e.message)),mt(e,`Search Query`),e}},Ct=async(e,t)=>{try{return pt(`Elasticsearch is ingesting the missing model data.\n
            Ingesting missing data from the model: '${t}' into Elasticsearch`,`warning`,1e4),console.warn(`ELASTICSEARCH IS INGESTING\nIngesting missing data from the model: '${t}' into Elasticsearch`),await _t.GET_AGORA_INGEST_MODEL(e,t),null}catch(e){return mt(e,`Model Data Ingestion`),e}};var wt=class{props;callbacks;constructor(e,t){this.props=e,this.callbacks=t}async search(e){let t=this.props.serviceContext.get(`models`);if(!e||e.trim()===``){console.warn(`No query provided`);return}if(t.length===0){console.warn(`No models provided`),pt(`There is no data currently available to search`);return}this.callbacks.hideSuggestions(),this.callbacks.showSpinner();let n=this.sanitizeQuery(e);if(this.props.configContext.get(`IS_METAGORA`)){let t=this.props.serviceContext.get(`modelsByAgora`)||{},r=new Map;await Promise.all(Object.entries(t).map(async([e,t])=>{if(t.length===0){console.warn(`No models available for Agora at host ${e}`);return}try{let i=(await St(e,n,t)).data.results;r.set(e,i)}catch(t){console.error(`Error querying Agora at host ${e}\n${t}`),r.set(e,[])}})),this.callbacks.hideSpinner(),this.handleMetagoraSearchResults(e,r);return}try{let r=await St(this.props.configContext.get(`API_HOST`),n,t);this.callbacks.hideSpinner();let i=r.data.results;this.handleSearchResults(e,i)}catch(t){try{let n=JSON.parse(t.message);if(n.missing_model){let t=await Ct(this.props.configContext.get(`API_HOST`),n.missing_model);if(t){console.error(`ELASTICSEARCH INGESTION ERROR\n${t}`),this.callbacks.hideSpinner();return}await this.search(e)}}catch{throw console.error(`SEARCH ERROR\n${t}`),this.callbacks.hideSpinner(),t}}}sanitizeQuery(e){console.log(`Raw query:`,e);let t=e.normalize(`NFC`).replace(/[^\p{L}\p{N} ]/gu,``);return console.log(`Sanitized query:`,t),t}handleSearchResults(e,t,n=!1){if(this.props.signals.emit(w.RESULTS_FETCHED,t),this.callbacks.updateClearButtonVisibility(t.length>0),t.length===0){this.props.resultContext.set({data:[],grouped:[]},!0);return}this.storeQueryInContext({raw:e,translated:e});let r=this.props.serviceContext.get(`services`),i=[...new Set(r.map(e=>({service:e.fields.name,category:we(e.fields.category),models:vt(e,`model`).map(e=>e.model)})))];at(t,i);let a=vt(r,`websites`).flatMap(e=>e.websites),o=ot(t,a,this.props.configContext.get(`API_HOST`)),s=it(o,`absolute`),c=st(s);this.props.resultContext.set({data:s,grouped:c},!0)}handleMetagoraSearchResults(e,t){let n=[];if(t.forEach((e,t)=>{let r=e.map(e=>({...e,_sourceHost:t}));n.push(...r)}),this.props.signals.emit(w.RESULTS_FETCHED,n),this.callbacks.updateClearButtonVisibility(n.length>0),n.length===0){this.props.resultContext.set({data:[],grouped:[]},!0);return}this.storeQueryInContext({raw:e,translated:e});let r=this.props.serviceContext.get(`services`),i=[...new Set(r.map(e=>({service:e.fields.name,category:we(e.fields.category),models:vt(e,`model`).map(e=>e.model)})))];at(n,i);let a=vt(r,`websites`).flatMap(e=>e.websites),o=ot(n,a,``),s=it(o,`absolute`),c=ct(s),l=c.flatMap(e=>e.services);this.props.resultContext.set({data:s,grouped:l,groupedByCategory:c},!0)}storeQueryInContext(e){let t=this.props.searchContext.get(`history`)||[],n={history:[...new Set([...t,e.raw])],current:e.translated.split(` `)};this.props.searchContext.set(n)}},Tt=class{deps;constructor(e){this.deps=e}checkForMention(e,t){let n=-1;for(let r=t-1;r>=0;r--){let t=e[r];if(t===` `||t===`
`||t===`\r`)break;if(t===`@`){n=r;break}}if(n===-1)return{isMentioning:!1,startIndex:-1,query:``};let r=e.substring(n+1,t).toLowerCase();return{isMentioning:!0,startIndex:n,query:r}}filterMentionResults(e){let t=this.deps.resultContext.get(`data`)||[],n=new Map;return t.forEach(e=>{let t=this.getResultDisplayName(e);t&&!n.has(t)&&n.set(t,{name:t,model:e.model_verbose_name||e.model,service:e.service})}),Array.from(n.values()).filter(t=>t.name.toLowerCase().includes(e)).slice(0,5)}getResultDisplayName(e){let t=e.data||{};for(let e of[`name`,`title`,`Name`,`Title`,`headline`,`label`,`display_name`])if(t[e]&&typeof t[e]==`string`)return t[e];return e.model_verbose_name||``}buildMentionText(e,t,n,r){let i=e.substring(0,t),a=e.substring(n),o=`${i}@${r} ${a}`,s=t+r.length+2;return{newText:o,newCursorPosition:s}}},Et=`:host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
}

.spinner {
    width: 1em;
    height: 1em;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: currentColor;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}`,Dt=class extends i{constructor(){super(`plain-spinner`,Et)}template(){return this.html`
            <div class="spinner"></div>
        `}};window.customElements.define(`plain-spinner`,Dt);var Ot=class extends i{activeMode=`search`;inputValues={search:``,chat:``};suggestions=[];activeSuggestionIndex=-1;mentionResults=[];activeMentionIndex=-1;mentionStartIndex=-1;isMentioning=!1;companyContext;configContext;serviceContext;searchContext;resultContext;filterContext;chatContext;visualConfigContext;chatHandler;searchHandler;mentionHandler;constructor(){super(`plain-agora-input`,[Je,Ye,Xe,Ze,Qe,$e,et,tt].join(`
`)),this.companyContext=this.useContext(g.COMPANY),this.configContext=this.useContext(g.CONFIG),this.serviceContext=this.useContext(g.SERVICE),this.searchContext=this.useContext(g.SEARCH,!1,`local`),this.resultContext=this.useContext(g.RESULT),this.filterContext=this.useContext(g.FILTER),this.chatContext=this.useContext(g.CHAT),this.visualConfigContext=this.useContext(g.VISUAL_CONFIG,!0),this.signals=this.useSignals(),this.signals.register(w.RESULTS_FETCHED),this.signals.register(w.RESULTS_CLEARED),this.signals.register(w.CHAT_STARTED),this.signals.register(w.CHAT_USER_MESSAGE),this.signals.register(w.CHAT_MESSAGE_CHUNK),this.signals.register(w.CHAT_MESSAGE_COMPLETE),this.signals.register(w.CHAT_RESULTS_UPDATED),this.signals.register(w.CHAT_FETCHING_RESULTS),this.signals.register(w.CHAT_REASONING_CHUNK),this.signals.register(w.NEW_CHAT),this.signals.register(w.MODE_SWITCH),this.initializeHandlers()}initializeHandlers(){this.chatHandler=new xt({configContext:this.configContext,serviceContext:this.serviceContext,companyContext:this.companyContext,resultContext:this.resultContext,filterContext:this.filterContext,chatContext:this.chatContext,signals:this.signals},{showSpinner:()=>this.showSpinner(),hideSpinner:()=>this.hideSpinner(),updateClearButtonVisibility:()=>this.updateClearButtonVisibility()}),this.searchHandler=new wt({configContext:this.configContext,serviceContext:this.serviceContext,resultContext:this.resultContext,searchContext:this.searchContext,signals:this.signals},{showSpinner:()=>this.showSpinner(),hideSpinner:()=>this.hideSpinner(),hideSuggestions:()=>this.hideSuggestions(),updateClearButtonVisibility:e=>{let t=this.$(`.clear-btn-header`);e?t?.classList.remove(`hidden`):t?.classList.add(`hidden`)}}),this.mentionHandler=new Tt({resultContext:this.resultContext})}toggleMode(e,t){t.stopPropagation();let n=this.$(`textarea`);n&&(this.inputValues[this.activeMode]=n.value),this.activeMode=e,this.suggestions=[],this.activeSuggestionIndex=-1,this.hideSuggestions(),this.mentionResults=[],this.activeMentionIndex=-1,this.isMentioning=!1,this.hideMentions(),this.updateTabs(),this.updateInputState(),this.updateIcon(),n&&(n.value=this.inputValues[e]),this.signals.emit(w.MODE_SWITCH,e)}updateTabs(){let e=this.$(`.tabs`),t=this.$(`.search-card`),n=this.$(`.trending`);this.activeMode===`search`?(e?.classList.remove(`mode-chat`),e?.classList.add(`mode-search`),t?.classList.remove(`mode-chat`),n?.classList.remove(`hidden`)):(e?.classList.remove(`mode-search`),e?.classList.add(`mode-chat`),t?.classList.add(`mode-chat`),n?.classList.add(`hidden`))}updateInputState(){let e=this.$(`textarea`);e&&(e.classList.add(`placeholder-hidden`),setTimeout(()=>{if(this.activeMode===`search`){let t=this.visualConfigContext.get(`searchbar_placeholder`);e.setAttribute(`maxlength`,`100`),e.setAttribute(`placeholder`,typeof t==`string`?t:`Search for funding, courses, infrastructure...`)}else e.removeAttribute(`maxlength`),e.setAttribute(`placeholder`,`Ask the AI assistant...`);e.classList.remove(`placeholder-hidden`)},200))}updateIcon(){let e=this.$(`.globe-icon`);e&&(e.innerHTML=this.activeMode===`search`?C:S)}template(){let e=this.companyContext.get(`primaryColor`)||`#8238eb`,t=this.configContext.get(`ENABLED_AI`),n=this.visualConfigContext.get(`searchbar_placeholder`),r=typeof n==`string`?n:n===!1?``:`Search for funding, courses, infrastructure...`,i=this.visualConfigContext.get(`trending_searches_headline`),a=this.visualConfigContext.get(`trending_searches_suggestion`)||[],o=i!==!1&&a.length>0,s=t?this.html`
                <div class="tabs mode-search">
                    <div class="tab-slider"></div>
                    <button class="tab" data-mode="search">
                        ${ae} ${this.getAttribute(`label-search`)||`Search`}
                    </button>
                    <button class="tab" data-mode="chat">
                        ${`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
        <path d="M20.5 5.5A2 2 0 0 0 19 4l-1-.232a.5.5 0 0 1 0-.964l1-.232A2 2 0 0 0 20.5 1a.5.5 0 0 1 .964 0A2 2 0 0 0 23 2.572l1 .232a.5.5 0 0 1 0 .964l-1 .232A2 2 0 0 0 21.464 5.5a.5.5 0 0 1-.964 0z" transform="translate(-1 0) scale(0.7)" transform-origin="21 3"/>
        <path d="M20.5 5.5A2 2 0 0 0 19 4l-1-.232a.5.5 0 0 1 0-.964l1-.232A2 2 0 0 0 20.5 1a.5.5 0 0 1 .964 0A2 2 0 0 0 23 2.572l1 .232a.5.5 0 0 1 0 .964l-1 .232A2 2 0 0 0 21.464 5.5a.5.5 0 0 1-.964 0z" transform="translate(-2 16) scale(0.6)" transform-origin="21 3"/>
    </svg>
`} ${this.getAttribute(`label-assistant`)||`Assistant`}
                    </button>
                </div>`:this.html`
                <div class="tabs-single">
                    <span class="tab-label">
                        ${ae} ${this.getAttribute(`label-search`)||`Search`}
                    </span>
                </div>`;return this.html`
            <div class="agora-input-container" style="--primary-color: ${e}">
                <div class="search-card">
                    <div class="card-header">
                        ${s}
                        <div class="header-actions">
                            <button 
                                class="new-chat-btn hidden" 
                                title="New conversation" 
                                aria-label="New conversation"
                            >${`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        <line x1="12" y1="7" x2="12" y2="13"/>
        <line x1="9" y1="10" x2="15" y2="10"/>
    </svg>
`}</button>
                            <button 
                                class="clear-btn-header hidden" 
                                title="Clear results" 
                                aria-label="Clear results"
                            >${`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/>
        <path d="M22 21H7"/>
        <path d="m5 11 9 9"/>
    </svg>
`}</button>
                        </div>
                    </div>
                    
                    <div class="card-body">
                        <span class="icon globe-icon">${this.activeMode===`search`?C:S}</span>
                        <textarea 
                            placeholder="${r}"  
                            rows="1" 
                            maxlength="100"
                        ></textarea>
                        <div class="actions">
                            <span class="shortcut">⌘ K</span>
                            <button class="go-btn" aria-label="Send">${pe}</button>
                        </div>
                    </div>
                    <div class="suggestions hidden"></div>
                    <div class="mentions hidden"></div>
                </div>

                ${o?this.html`
                    <div class="trending">
                        <div class="trending-content">
                            <span class="label">${typeof i==`string`?i:`TRENDING SEARCHES`}</span>
                            <div class="chips">
                                ${a.map(e=>`<span class="chip">${e}</span>`).join(``)}
                            </div>
                        </div>
                    </div>
                `:``}
            </div>
        `}afterRender(){this.updateClearButtonVisibility()}listeners(){let e=this.$(`.tab[data-mode="search"]`),t=this.$(`.tab[data-mode="chat"]`),n=this.$(`.go-btn`),r=this.$(`.clear-btn-header`),i=this.$(`.new-chat-btn`),a=this.$(`textarea`);e&&(e.onclick=e=>this.toggleMode(`search`,e)),t&&(t.onclick=e=>this.toggleMode(`chat`,e)),n&&(n.onclick=()=>this.handleSubmit()),r&&(r.onclick=()=>this.clear()),i&&(i.onclick=()=>this.newChat()),a&&(a.onkeydown=e=>this.handleKeyDown(e)),a&&(a.oninput=e=>this.handleInput(e))}handleSubmit(){let e=this.$(`textarea`),t=e?.value?.trim()||``;this.activeMode===`search`?this.searchHandler.search(t):(e.value=``,this.chatHandler.chat(t))}retryChat(e){e&&this.chatHandler.chat(e)}showSpinner(){let e=this.$(`.go-btn`),t=this.$(`textarea`);e&&(e.querySelector(`plain-spinner`)||(e.dataset.originalHtml=e.innerHTML,e.innerHTML=`<plain-spinner></plain-spinner>`,e.disabled=!0,e.style.cursor=`not-allowed`,t&&(t.disabled=!0,t.style.cursor=`not-allowed`,t.style.opacity=`0.6`)))}hideSpinner(){let e=this.$(`.go-btn`),t=this.$(`textarea`);e&&(e.innerHTML=e.dataset.originalHtml||pe,e.disabled=!1,e.style.cursor=`pointer`,t&&(t.disabled=!1,t.style.cursor=`text`,t.style.opacity=`1`,t.focus()))}clear(){let e=this.$(`textarea`);e&&(e.value=``,e.focus()),this.hideSuggestions(),this.$(`.clear-btn-header`)?.classList.add(`hidden`),this.resultContext.set({data:[],grouped:[]},!0),this.signals.emit(w.RESULTS_CLEARED);let t=this.searchContext.get(`history`)||[];this.searchContext.set({history:t,current:[]}),this.filterContext.set([],`filters`,!0)}updateClearButtonVisibility(){let e=this.$(`.clear-btn-header`),t=this.$(`.new-chat-btn`),n=this.resultContext.get(`data`)||[],r=this.chatContext.get(`history`)||[];n.length>0?e?.classList.remove(`hidden`):e?.classList.add(`hidden`),r.length>0?t?.classList.remove(`hidden`):t?.classList.add(`hidden`)}newChat(){let e=this.$(`.new-chat-btn`);this.chatHandler.newChat(()=>e?.classList.add(`hidden`))}handleInput(e){let t=e.target,n=t.value,r=t.selectionStart||0;if(this.activeMode===`chat`){let e=this.mentionHandler.checkForMention(n,r);if(e.isMentioning&&(this.isMentioning=!0,this.mentionStartIndex=e.startIndex,this.mentionResults=this.mentionHandler.filterMentionResults(e.query),this.activeMentionIndex=this.mentionResults.length>0?0:-1,this.mentionResults.length>0)){this.renderMentions(),this.showMentions();return}}this.hideMentions(),this.isMentioning=!1;let i=n.trim().toLowerCase();if(!i){this.hideSuggestions();return}if(this.activeMode!==`search`){this.hideSuggestions();return}let a=this.searchContext.get(`history`)||[];this.suggestions=lt(a,i),this.activeSuggestionIndex=-1,this.suggestions.length>0?(this.renderSuggestions(i),this.showSuggestions()):this.hideSuggestions()}renderMentions(){let e=this.$(`.mentions`);e&&(e.innerHTML=`
            <div class="mentions-header">
                <span class="mentions-label">@ Reference a result</span>
            </div>
            <div class="mentions-content">
                ${this.mentionResults.map((e,t)=>`
                <div class="mention-item ${t===this.activeMentionIndex?`active`:``}" data-index="${t}">
                    <span class="mention-name">${e.name}</span>
                    <span class="mention-meta">${e.model} · ${e.service}</span>
                </div>
            `).join(``)}
            </div>
        `,e.querySelectorAll(`.mention-item`).forEach((e,t)=>{e.onmousedown=e=>{e.preventDefault(),this.selectMention(this.mentionResults[t])},e.onmouseenter=()=>{this.activeMentionIndex=t,this.renderMentions()}}))}showMentions(){let e=this.$(`.mentions`),t=this.$(`.search-card`);e?.classList.remove(`hidden`),t?.classList.add(`has-mentions`)}hideMentions(){let e=this.$(`.mentions`),t=this.$(`.search-card`);e?.classList.add(`hidden`),t?.classList.remove(`has-mentions`),this.mentionResults=[],this.activeMentionIndex=-1}selectMention(e){let t=this.$(`textarea`);if(!t)return;let n=t.selectionStart||0,{newText:r,newCursorPosition:i}=this.mentionHandler.buildMentionText(t.value,this.mentionStartIndex,n,e.name);t.value=r,t.setSelectionRange(i,i),this.hideMentions(),this.isMentioning=!1,t.focus()}showSuggestions(){let e=this.$(`.suggestions`),t=this.$(`.search-card`);e?.classList.remove(`hidden`),t?.classList.add(`has-suggestions`)}hideSuggestions(){let e=this.$(`.suggestions`),t=this.$(`.search-card`);e?.classList.add(`hidden`),t?.classList.remove(`has-suggestions`)}renderSuggestions(e){let t=this.$(`.suggestions`);t&&(t.innerHTML=`
            <div class="suggestions-content">
                ${this.suggestions.map((t,n)=>{let{match:r,rest:i}=ut(t,e);return`
                <div class="suggestion-item ${n===this.activeSuggestionIndex?`active`:``}">
                    ${ae}
                    <span><span class="highlight">${r}</span>${i}</span>
                    <span class="tab-hint">TAB</span>
                </div>
            `}).join(``)}
            </div>
        `,t.querySelectorAll(`.suggestion-item`).forEach((t,n)=>{t.onmousedown=e=>{e.preventDefault(),this.selectSuggestion(this.suggestions[n])},t.onmouseenter=()=>{this.activeSuggestionIndex=n,this.renderSuggestions(e)}}))}handleKeyDown(e){let t=this.$(`textarea`);if(this.isMentioning&&this.mentionResults.length>0){if(e.key===`ArrowDown`){e.preventDefault(),this.activeMentionIndex++,this.activeMentionIndex>=this.mentionResults.length&&(this.activeMentionIndex=0),this.renderMentions();return}else if(e.key===`ArrowUp`){e.preventDefault(),this.activeMentionIndex--,this.activeMentionIndex<0&&(this.activeMentionIndex=this.mentionResults.length-1),this.renderMentions();return}else if(e.key===`Tab`||e.key===`Enter`){if(this.activeMentionIndex>=0){e.preventDefault(),this.selectMention(this.mentionResults[this.activeMentionIndex]);return}}else if(e.key===`Escape`){e.preventDefault(),this.hideMentions(),this.isMentioning=!1;return}}e.key===`ArrowDown`?(e.preventDefault(),this.activeSuggestionIndex++,this.activeSuggestionIndex>=this.suggestions.length&&(this.activeSuggestionIndex=0),this.renderSuggestions(t.value)):e.key===`ArrowUp`?(e.preventDefault(),this.activeSuggestionIndex--,this.activeSuggestionIndex<0&&(this.activeSuggestionIndex=this.suggestions.length-1),this.renderSuggestions(t.value)):e.key===`Tab`?this.activeSuggestionIndex>=0&&(e.preventDefault(),this.selectSuggestion(this.suggestions[this.activeSuggestionIndex])):e.key===`Enter`&&!e.shiftKey&&(e.preventDefault(),this.activeSuggestionIndex>=0?this.selectSuggestion(this.suggestions[this.activeSuggestionIndex]):this.handleSubmit())}selectSuggestion(e){let t=this.$(`textarea`);t&&(t.value=e,this.hideSuggestions(),this.suggestions=[],this.activeSuggestionIndex=-1,t.focus(),t.setSelectionRange(e.length,e.length))}};window.customElements.define(`plain-agora-input`,Ot);var kt=`.plain-filter-widget-wrapper {
    padding: 1rem;
    box-sizing: border-box;

    width: 100%;

    display: block;
    
    color: var(--text-color);
    font-family: var(--agora-font-body, 'Geist'), sans-serif;
}

.filter-widget {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #eef2f6;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    padding: 0;
    overflow: hidden;
}

.filter-header {
    user-select: none;
    cursor: pointer;

    padding: 0.75rem 1.5rem;

    height: 25px;

    border-bottom: 1px solid #e2e8f0;

    display: flex;
    justify-content: space-between;
    align-items: center;

    background-color: #f1f5f9;

    transition: border-bottom-color 0.2s;
}

.filter-widget.collapsed .filter-header {
    border-bottom-color: transparent;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.header-left h3 {
    font-size: 12px !important;
}

.chevron {
    display: flex;
    align-items: center;
    color: #64748b;
    transition: transform 0.3s ease;
}

.filter-widget.collapsed .chevron {
    transform: rotate(-90deg);
}

.filter-header h3 {
    margin: 0;
    font-family: var(--agora-font-title, 'Sora'), sans-serif;
    font-size: 1rem;
    font-weight: 600;
    color: #0f172a;
    letter-spacing: -0.01em;
    text-transform: uppercase;
}

.clear-filters-btn {
    background: none;
    border: none;
    color: #64748b;
    font-size: 0.75rem;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    transition: all 0.2s ease;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.02em;
}

.clear-filters-btn:hover {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
}

.filter-wrapper {
    height: auto;
    overflow: hidden;
    transition: height 0.3s ease-in-out;
    interpolate-size: allow-keywords;
}

.filter-widget.collapsed .filter-wrapper {
    height: 0;
}

.filter-list {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}



.filter-item {
    padding: 1rem;

    display: flex;
    flex-direction: column;

    border: 1px solid #e2e8f0;
    border-radius: 12px;

    background-color: #f8fafc;
}

.filter-item label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-color-secondary);
}

.filter-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    user-select: none;
}

.filter-section-header label {
    cursor: pointer;
}

.section-chevron {
    display: flex;
    align-items: center;
    color: #64748b;
    transition: transform 0.2s ease;
}

.filter-item.section-collapsed .section-chevron {
    transform: rotate(-90deg);
}

.chip-container {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    max-height: 500px;
    overflow: hidden;
    transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out, margin-top 0.3s ease-in-out;
    opacity: 1;
    margin-top: 0.75rem;
}

.filter-item.section-collapsed .chip-container {
    max-height: 0;
    opacity: 0;
    margin-top: 0;
}

.chip {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 9999px;
    padding: 0.35rem 0.85rem;
    font-size: 12px;
    font-weight: 500;
    color: #475569;
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;
}

.chip:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
}

.chip.active {
    background: #fff;
    color: var(--primary-color, var(--accent-color));
    border-color: var(--primary-color, var(--accent-color));
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.filter-widget.empty {
    text-align: center;
    color: var(--text-color-muted);
    font-style: italic;
    padding: 2rem 0;
}

/* Responsive */
@media (max-width: 768px) {
    .plain-filter-widget-wrapper {
        padding: 0.75rem;
    }

    .filter-list {
        padding: 1rem;
    }

    .filter-item {
        padding: 0.75rem;
    }
}
`;const At={catalogue:[`model_verbose_name`],service:[`service`],serviceCategory:[`serviceCategory`],agora:[`_sourceHost`],origin:[`origin`,`x_origin`,`x_home_partner_institution`,`x_home_university`,`x_participating_universities`,`x_host_university`,`x_university`,`x_university_origin`]};var jt=class extends i{selectedFilters;resultContext;filterContext;companyContext;metagoraContext;isCollapsed=!1;collapsedSections=new Set;sectionsInitialized=!1;lastHasFilters=null;constructor(){super(`plain-filter-widget`,kt),this.resultContext=this.useContext(g.RESULT,!0),this.filterContext=this.useContext(g.FILTER),this.companyContext=this.useContext(g.COMPANY),this.metagoraContext=this.useContext(g.METAGORA),this.selectedFilters=this.useState({mapping:At,filters:{}}),this.signals=this.useSignals(),this.signals.register(w.FILTERS_AVAILABILITY_CHANGED),this.initiFilters()}computeHasDisplayableFilters(e){return(e.origin?.length||0)>=2||(e.service?.length||0)>=2||(e.catalogue?.length||0)>=2||(e.serviceCategory?.length||0)>=2||(e.agora?.length||0)>=2}initiFilters(){let e=this.filterContext.get();this.selectedFilters.set({mapping:At,filters:e?.filters||{}})}getAgoraNameFromHost(e){return(this.metagoraContext.get(`agoras`)||[]).find(t=>t.host===e)?.name||e}truncateText(e,t=30){return e.length<=t?e:e.substring(0,t)+`...`}updateAvailableFilters(){let e=this.resultContext.get()?.data||[],t=Object.values(At).flatMap(e=>e),n={service:[],origin:[],catalogue:[],serviceCategory:[],agora:[]};return t.map(t=>{e.map(e=>{let r=vt(e,t),i=Object.keys(At).find(e=>At[e].includes(t));if(!i||![`service`,`origin`,`catalogue`,`serviceCategory`,`agora`].includes(i))return;let a=r.map(e=>e[t]);if(a=a.filter(e=>e),i===`origin`){let e=a.flatMap(e=>Ce(e));n[i].push(...e)}else if(i===`agora`){let e=a.map(e=>({label:this.getAgoraNameFromHost(e),value:e}));n[i].push(...e)}else n[i].push(...a);if(i===`agora`){let e=new Set;n[i]=n[i].filter(t=>e.has(t.value)?!1:(e.add(t.value),!0))}else n[i]=Array.from(new Set(n[i]))})}),n}clearFilters(){let e={mapping:At,filters:{}};this.selectedFilters.set(e),this.filterContext.set(e,!0)}toggleCollapse(){this.isCollapsed=!this.isCollapsed,this.$(`.filter-widget`)?.classList.toggle(`collapsed`,this.isCollapsed)}toggleSection(e){this.collapsedSections.has(e)?this.collapsedSections.delete(e):this.collapsedSections.add(e),this.render()}template(){if((this.resultContext.get()?.data||[]).length===0)return``;let e=this.updateAvailableFilters(),t=Object.values(e).flatMap(e=>e).length>0;t&&!this.sectionsInitialized&&(this.sectionsInitialized=!0,[`origin`,`service`,`catalogue`,`serviceCategory`,`agora`].forEach(t=>{e[t]&&e[t].length>1&&this.collapsedSections.add(t)}));let n=this.companyContext.get(`primaryColor`);n&&this.style.setProperty(`--primary-color`,n);let r=e.origin.length>1?this.html`
                <div class="filter-item ${this.collapsedSections.has(`origin`)?`section-collapsed`:``}">
                <div class="filter-section-header" data-section="origin">
                    <label>${`
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
`} Origins</label>
                    <div class="section-chevron">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                </div>
                <div class="chip-container">
                    ${e.origin.map(e=>`
                            <button 
                                class="chip ${this.selectedFilters.get()?.filters?.origin?.includes(e)?`active`:``}"
                                data-key="origin"
                                data-value="${e}"
                                title="${e}"
                            >
                                ${this.truncateText(e)}
                            </button>
                        `).join(``)}
                </div>
            </div>`:``,i=e.service.length>1?this.html`
                <div class="filter-item ${this.collapsedSections.has(`service`)?`section-collapsed`:``}">
                <div class="filter-section-header" data-section="service">
                    <label>${`
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
`} Services</label>
                    <div class="section-chevron">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                </div>
                <div class="chip-container">
                    ${e.service.map(e=>`
                            <button 
                                class="chip ${this.selectedFilters.get()?.filters?.service?.includes(e)?`active`:``}"
                                data-key="service"
                                data-value="${e}"
                                title="${e}"
                            >
                                ${this.truncateText(e)}
                            </button>
                        `).join(``)}
                </div>
            </div>`:``,a=e.catalogue.length>1?this.html`
                <div class="filter-item ${this.collapsedSections.has(`catalogue`)?`section-collapsed`:``}">
                <div class="filter-section-header" data-section="catalogue">
                    <label>${ne} Catalogues</label>
                    <div class="section-chevron">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                </div>
                <div class="chip-container">
                    ${e.catalogue.map(e=>`
                            <button 
                                class="chip ${this.selectedFilters.get()?.filters?.catalogue?.includes(e)?`active`:``}"
                                data-key="catalogue"
                                data-value="${e}"
                                title="${e}"
                            >
                                ${this.truncateText(e)}
                            </button>
                        `).join(``)}
                </div>
            </div>`:``,o=e.serviceCategory.length>1?this.html`
                <div class="filter-item ${this.collapsedSections.has(`serviceCategory`)?`section-collapsed`:``}">
                <div class="filter-section-header" data-section="serviceCategory">
                    <label>${`
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
`} Service Categories</label>
                    <div class="section-chevron">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                </div>
                <div class="chip-container">
                    ${e.serviceCategory.map(e=>`
                            <button 
                                class="chip ${this.selectedFilters.get()?.filters?.serviceCategory?.includes(e)?`active`:``}"
                                data-key="serviceCategory"
                                data-value="${e}"
                                title="${e}"
                            >
                                ${this.truncateText(e)}
                            </button>
                        `).join(``)}
                </div>
            </div>`:``,s=e.agora.length>1?this.html`
                <div class="filter-item ${this.collapsedSections.has(`agora`)?`section-collapsed`:``}">
                <div class="filter-section-header" data-section="agora">
                    <label>${`
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
        <path d="M2 17l10 5 10-5"></path>
        <path d="M2 12l10 5 10-5"></path>
    </svg>
`} Agoras</label>
                    <div class="section-chevron">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                </div>
                <div class="chip-container">
                    ${e.agora.map(e=>{let t=typeof e==`object`?e.value:e,n=typeof e==`object`?e.label:e;return`
                            <button 
                                class="chip ${this.selectedFilters.get()?.filters?.agora?.includes(t)?`active`:``}"
                                data-key="agora"
                                data-value="${t}"
                                title="${n}"
                            >
                                ${this.truncateText(n)}
                            </button>
                        `}).join(``)}
                </div>
            </div>`:``;return e.origin.length<2&&e.service.length<2&&e.catalogue.length<2&&e.serviceCategory.length<2&&e.agora.length<2?``:this.html`
            <div class="filter-widget ${this.isCollapsed?`collapsed`:``}">
                <div class="filter-header">
                    <div class="header-left">
                        <h3>Filters</h3>
                        <div class="chevron">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                    </div>
                    ${t?this.html`<button class="clear-filters-btn">Clear all</button>`:``}
                </div>
                <div class="filter-wrapper">
                    <div class="filter-list">
                        ${s}
                        ${o}
                        ${i}
                        ${r}
                        ${a}
                    </div>
                </div>
            </div>
        `}listeners(){this.$$(`.chip`).forEach(e=>{e.onclick=t=>this.selectChip(t,e)});let e=this.$(`.clear-filters-btn`);e&&(e.onclick=e=>{e.stopPropagation(),this.clearFilters()});let t=this.$(`.filter-header`);t&&(t.onclick=()=>this.toggleCollapse()),this.$$(`.filter-section-header`).forEach(e=>{e.onclick=t=>{t.stopPropagation();let n=e.dataset.section;n&&this.toggleSection(n)}})}selectChip(e,t){e.stopPropagation();let n=t.dataset.key,r=t.dataset.value,{filters:i,mapping:a}=this.selectedFilters.get(),o={...i};o[n]&&o[n].includes(r)?o[n]=o[n].filter(e=>e!==r):o[n]=[...o[n]||[],r],this.selectedFilters.set({mapping:a,filters:o}),this.filterContext.set({mapping:a,filters:o},!0)}afterRender(){let e=(this.resultContext.get()?.data||[]).length>0?this.computeHasDisplayableFilters(this.updateAvailableFilters()):!1;this.classList.toggle(`has-filters`,e),this.lastHasFilters!==e&&(this.lastHasFilters=e,this.signals?.emit(w.FILTERS_AVAILABILITY_CHANGED,e))}};window.customElements.define(`plain-filter-widget`,jt);var Mt=`.plain-intro-animation-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: white;

    z-index: 1000000;

    transition: 300ms;
} 

.central-square {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    border-radius: 32px;

    width: 10px;
    height: 10px;

    background-color: blue;

    overflow: hidden;

    animation: expand 1.5s ease-in-out forwards;

    transition: 300ms;
}

.title {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    font-family: var(--agora-font-title, 'Sora'), sans-serif;
    color: white;
    font-size: 82px;

    opacity: 0;

    animation: fadeIn 1.5s ease-in-out forwards;
    animation-delay: 0.5s;
}

.move-out-to-left {
    animation: moveOutToLeft 4s ease-in-out forwards;
}

@keyframes expand {
    0% {
        width: 10px;
        height: 10px;
    }
    100% {
        width: calc(100% - 32px);
        height: calc(100% - 32px);
    }
}

@keyframes moveOutToLeft {
    0% {
        transform: translate(-50%, -50%);
    }
    100% {
        transform: translate(-100%, -50%);
    }
}

@keyframes fadeIn {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

/* ANIMATED BACKGROUND */
/* Background container */
.background-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1538px !important;
    border-radius: 5px;
    background: #E86A2F; /* White background for contrast */
    overflow: hidden; /* Hide overflow for masking */
    z-index: -1; /* Behind all other content */
    pointer-events: none; /* Don't block interactions with other elements */
}

@media (max-width: 768px) {
    .background-container {
        background:#E86A2F !important;
    }
}

/* Content styles */
.content {
    position: relative;
    z-index: 1; /* Above the background */
    padding: 2rem;
    min-height: 100vh;
    /* Add any other styles for your content */
}

/* Animated gradient background */
.gradient-layer {
    position: absolute;
    width: 220vw;
    height: 130vh;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(28.42deg, #5281F5 10.24%, #783FE4 30.6%, #E73371 53.81%, #E86A2F 76.8%, #F5BF45 101.98%);
    filter: blur(75px);
    animation: gradientShift 12s ease-in-out infinite alternate;
    z-index: 1;
    opacity: 0; /* Initially hidden */
}

/* Base ellipse styles */
.ellipse {
    position: absolute;
    background: #FFFFFF;
    border-radius: 50%;
    opacity: 1;
    filter: blur(50px);
    z-index: 2;
    
    /* This creates the effect where gradient shows through */
    background-image: linear-gradient(28.42deg, #5281F5 10.24%, #783FE4 30.6%, #E73371 53.81%, #E86A2F 76.8%, #F5BF45 101.98%);
    animation: ellipseColorShift 12s ease-in-out infinite alternate;
}

/* Individual ellipse animations */
.ellipse-323 {
    width: 1200px;
    height: 1200px;
    animation: ellipse323Move 9s ease-in-out infinite alternate;
}

.ellipse-324 {
    width: 550px;
    height: 550px;
    animation: ellipse324Move 11s ease-in-out infinite alternate;
}

.ellipse-325 {
    width: 650px;
    height: 650px;
    animation: ellipse325Move 13s ease-in-out infinite alternate;
}

.ellipse-326 {
    width: 900px;
    height: 1000px;
    animation: ellipse326Move 15s ease-in-out infinite alternate;
}

.ellipse-327 {
    width: 650px;
    height: 650px;
    animation: ellipse327Move 12s ease-in-out infinite alternate;
}

.ellipse-328 {
    width: 650px;
    height: 650px;
    animation: ellipse328Move 10s ease-in-out infinite alternate;
}

.ellipse-329 {
    width: 650px;
    height: 650px;
    animation: ellipse329Move 14s ease-in-out infinite alternate;
}

.ellipse-330 {
    width: 650px;
    height: 650px;
    animation: ellipse330Move 11s ease-in-out infinite alternate;
}

/* Keyframe animations for gradient */
@keyframes gradientShift {
    0% {
        background: linear-gradient(28.42deg, #5281F5 10.24%, #783FE4 30.6%, #E73371 53.81%, #E86A2F 76.8%, #F5BF45 101.98%);
        transform: translate(-50%, -50%) rotate(0deg) scale(1);
    }
    25% {
        background: linear-gradient(29.27deg, #5281F5 -1.75%, #783FE4 19.09%, #E73371 42.84%, #E86A2F 66.36%, #F5BF45 92.11%);
        transform: translate(-50%, -50%) rotate(5deg) scale(1.1);
    }
    50% {
        background: linear-gradient(30.06deg, #5281F5 6.63%, #783FE4 25.95%, #E73371 47.98%, #E86A2F 69.8%, #F5BF45 93.69%);
        transform: translate(-50%, -50%) rotate(-3deg) scale(1.05);
    }
    75% {
        background: linear-gradient(34.1deg, #5281F5 -3.5%, #783FE4 20.73%, #E73371 48.36%, #E86A2F 75.72%, #F5BF45 105.67%);
        transform: translate(-50%, -50%) rotate(7deg) scale(0.95);
    }
    100% {
        background: linear-gradient(31.63deg, #5281F5 -0.05%, #783FE4 22.23%, #E73371 47.63%, #E86A2F 72.78%, #F5BF45 100.32%);
        transform: translate(-50%, -50%) rotate(0deg) scale(1);
    }
}

/* Ellipse color animation to match gradient */
@keyframes ellipseColorShift {
    0% {
        background-image: linear-gradient(28.42deg, #5281F5 10.24%, #783FE4 30.6%, #E73371 53.81%, #E86A2F 76.8%, #F5BF45 101.98%);
    }
    25% {
        background-image: linear-gradient(29.27deg, #5281F5 -1.75%, #783FE4 19.09%, #E73371 42.84%, #E86A2F 66.36%, #F5BF45 92.11%);
    }
    50% {
        background-image: linear-gradient(30.06deg, #5281F5 6.63%, #783FE4 25.95%, #E73371 47.98%, #E86A2F 69.8%, #F5BF45 93.69%);
    }
    75% {
        background-image: linear-gradient(34.1deg, #5281F5 -3.5%, #783FE4 20.73%, #E73371 48.36%, #E86A2F 75.72%, #F5BF45 105.67%);
    }
    100% {
        background-image: linear-gradient(31.63deg, #5281F5 -0.05%, #783FE4 22.23%, #E73371 47.63%, #E86A2F 72.78%, #F5BF45 100.32%);
    }
}

/* Ellipse movement animations */
@keyframes ellipse323Move {
    0% { left: -15%; top: 1.5%; }
    25% { left: 5%; top: -17%; }
    50% { left: -42%; top: -5%; }
    75% { left: -4%; top: -3%; }
    100% { left: 0%; top: -7%; }
}

@keyframes ellipse324Move {
    0% { left: 30%; top: 4%; }
    25% { left: 38%; top: -8.5%; }
    50% { left: 38%; top: -8.5%; }
    75% { left: 38.5%; top: 10%; }
    100% { left: 38.5%; top: 10%; }
}

@keyframes ellipse325Move {
    0% { left: 19%; top: 38%; }
    25% { left: 8.5%; top: 25%; }
    50% { left: 8.5%; top: 25%; }
    75% { left: 8.5%; top: 25%; }
    100% { left: 12%; top: 29%; }
}

@keyframes ellipse326Move {
    0% { left: 47%; top: 2.5%; }
    25% { left: 69%; top: -3%; }
    50% { left: 50%; top: 10%; }
    75% { left: 47.5%; top: 1.8%; }
    100% { left: 51.5%; top: -2%; }
}

@keyframes ellipse327Move {
    0% { left: 46.5%; top: 20.5%; }
    25% { left: 41%; top: 28%; }
    50% { left: 31%; top: 35%; }
    75% { left: 38%; top: 10.5%; }
    100% { left: 43%; top: 30.5%; }
}

@keyframes ellipse328Move {
    0% { left: 78.5%; top: 43.5%; }
    25% { left: 69.5%; top: 13%; }
    50% { left: 69.5%; top: 13%; }
    75% { left: 69.5%; top: 13%; }
    100% { left: 69.5%; top: 13%; }
}

@keyframes ellipse329Move {
    0% { left: 89%; top: -5%; }
    25% { left: 89%; top: -5%; }
    50% { left: 89%; top: -16%; }
    75% { left: 84%; top: 11.5%; }
    100% { left: 88%; top: -7%; }
}

@keyframes ellipse330Move {
    0% { left: -26.5%; top: -5%; }
    25% { left: -26.5%; top: -5%; }
    50% { left: -26.5%; top: -5%; }
    75% { left: -26.5%; top: 10.5%; }
    100% { left: -26.5%; top: -5.5%; }
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .ellipse {
        transform: scale(0.7);
    }
}

@media (max-width: 480px) {
    .ellipse {
        transform: scale(0.5);
    }
}`,Nt=class extends i{constructor(){super(`plain-intro-animation`,Mt),setTimeout(()=>{let e=this.$(`.central-square`);e&&(e.style.opacity=`0`),setTimeout(()=>{this.style.opacity=`0`,setTimeout(()=>{this.remove()},1e3)},500)},3e3)}template(){return this.html`
            <div class="central-square">
                <section class="s_aupaeu_animated_background background-container" >
                    <div class="gradient-layer"></div>
                    <div class="ellipse ellipse-323"></div>
                    <div class="ellipse ellipse-324"></div>
                    <div class="ellipse ellipse-325"></div>
                    <div class="ellipse ellipse-326"></div>
                    <div class="ellipse ellipse-327"></div>
                    <div class="ellipse ellipse-328"></div>
                    <div class="ellipse ellipse-329"></div>
                    <div class="ellipse ellipse-330"></div>
                </section>
            </div>
            <div class="title">
                <svg xmlns="http://www.w3.org/2000/svg" width="621" height="193" viewBox="0 0 621 193" fill="none">
                    <path d="M0 149.248L50.8478 0H98.2241L150.501 149.248H120.687L76.3738 19.8316L86.7884 24.3295H61.2624L71.8812 19.8316L28.9976 149.248H0ZM35.5322 109.585L44.7216 85.0508H105.167L114.152 109.585H35.5322Z" fill="white"></path>
                    <path d="M212.096 193C206.786 193 201.341 192.796 195.759 192.387C190.313 191.978 185.208 191.433 180.443 190.751V167.035C185.344 167.58 190.586 168.057 196.167 168.466C201.749 169.011 206.99 169.284 211.891 169.284C221.013 169.284 228.364 168.194 233.946 166.013C239.664 163.832 243.816 160.356 246.403 155.586C249.125 150.952 250.487 145.023 250.487 137.799V115.923L256.613 102.02C256.205 112.243 254.094 120.966 250.283 128.19C246.471 135.277 241.297 140.729 234.763 144.546C228.228 148.226 220.672 150.066 212.096 150.066C204.472 150.066 197.529 148.635 191.266 145.772C185.14 142.91 179.831 138.957 175.338 133.914C170.982 128.871 167.578 122.942 165.128 116.127C162.677 109.312 161.452 102.02 161.452 94.2511V89.9576C161.452 82.1886 162.677 74.9647 165.128 68.286C167.714 61.471 171.322 55.542 175.951 50.4989C180.58 45.4559 186.093 41.5713 192.492 38.8453C198.89 36.1194 205.969 34.7564 213.729 34.7564C222.851 34.7564 230.747 36.7327 237.417 40.6854C244.224 44.6381 249.534 50.3626 253.346 57.8591C257.158 65.3556 259.268 74.5558 259.676 85.4598L254.775 86.2775V38.232H277.238V136.163C277.238 149.657 274.924 160.561 270.295 168.875C265.666 177.189 258.519 183.255 248.853 187.071C239.323 191.024 227.071 193 212.096 193ZM220.264 125.736C225.71 125.736 230.679 124.51 235.171 122.056C239.664 119.603 243.271 116.059 245.994 111.425C248.717 106.791 250.078 101.202 250.078 94.66V87.5042C250.078 81.2345 248.649 75.9188 245.79 71.5572C243.067 67.1956 239.46 63.9244 234.967 61.7436C230.474 59.4266 225.573 58.268 220.264 58.268C214.274 58.268 208.964 59.6992 204.336 62.5614C199.843 65.2874 196.304 69.172 193.717 74.215C191.13 79.2581 189.837 85.2553 189.837 92.2066C189.837 99.0215 191.13 104.951 193.717 109.994C196.304 115.037 199.843 118.921 204.336 121.647C208.964 124.373 214.274 125.736 220.264 125.736Z" fill="white"></path>
                    <path d="M361.498 153.132C351.696 153.132 343.051 151.565 335.563 148.43C328.076 145.295 321.745 141.07 316.572 135.754C311.399 130.302 307.451 124.169 304.728 117.354C302.141 110.539 300.848 103.451 300.848 96.0911V91.7977C300.848 84.1649 302.209 76.941 304.932 70.1261C307.791 63.1748 311.807 57.0413 316.98 51.7256C322.29 46.2737 328.688 42.0484 336.176 39.0498C343.664 35.9149 352.104 34.3475 361.498 34.3475C370.891 34.3475 379.332 35.9149 386.82 39.0498C394.307 42.0484 400.638 46.2737 405.811 51.7256C411.12 57.0413 415.136 63.1748 417.859 70.1261C420.582 76.941 421.943 84.1649 421.943 91.7977V96.0911C421.943 103.451 420.582 110.539 417.859 117.354C415.273 124.169 411.393 130.302 406.219 135.754C401.046 141.07 394.716 145.295 387.228 148.43C379.74 151.565 371.164 153.132 361.498 153.132ZM361.498 128.803C368.441 128.803 374.295 127.304 379.06 124.305C383.825 121.17 387.432 117.013 389.883 111.834C392.333 106.518 393.558 100.521 393.558 93.8422C393.558 87.0272 392.265 81.03 389.678 75.8506C387.228 70.535 383.552 66.3778 378.651 63.3792C373.886 60.2444 368.169 58.6769 361.498 58.6769C354.827 58.6769 349.041 60.2444 344.14 63.3792C339.375 66.3778 335.699 70.535 333.113 75.8506C330.526 81.03 329.233 87.0272 329.233 93.8422C329.233 100.521 330.458 106.518 332.909 111.834C335.495 117.013 339.171 121.17 343.936 124.305C348.701 127.304 354.555 128.803 361.498 128.803Z" fill="white"></path>
                    <path d="M446.798 149.248V38.232H469.261V85.2553H468.648C468.648 69.3083 472.051 57.2458 478.858 49.0678C485.665 40.8898 495.672 36.8008 508.877 36.8008H512.961V61.5392H505.201C495.672 61.5392 488.252 64.1289 482.943 69.3083C477.769 74.3513 475.183 81.7115 475.183 91.3888V149.248H446.798Z" fill="white"></path>
                    <path d="M598.537 149.248V116.332H593.84V79.7352C593.84 73.3291 592.275 68.5586 589.143 65.4237C586.012 62.2888 581.179 60.7214 574.645 60.7214C571.241 60.7214 567.157 60.7895 562.392 60.9258C557.627 61.0621 552.794 61.2666 547.893 61.5392C543.129 61.6755 538.84 61.8799 535.028 62.1525V38.0275C538.16 37.7549 541.699 37.4823 545.647 37.2097C549.595 36.9371 553.611 36.8008 557.695 36.8008C561.916 36.6646 565.864 36.5964 569.54 36.5964C580.975 36.5964 590.437 38.0957 597.924 41.0943C605.548 44.0929 611.266 48.7952 615.078 55.2013C619.026 61.6073 621 69.9898 621 80.3485V149.248H598.537ZM562.801 152.11C554.768 152.11 547.689 150.679 541.563 147.817C535.573 144.954 530.876 140.865 527.473 135.55C524.205 130.234 522.572 123.828 522.572 116.332C522.572 108.154 524.546 101.475 528.494 96.2956C532.578 91.1162 538.228 87.2316 545.443 84.642C552.794 82.0523 561.371 80.7574 571.173 80.7574H596.903V97.7267H570.765C564.23 97.7267 559.193 99.3623 555.653 102.633C552.25 105.768 550.548 109.857 550.548 114.9C550.548 119.944 552.25 124.032 555.653 127.167C559.193 130.302 564.23 131.87 570.765 131.87C574.713 131.87 578.32 131.188 581.588 129.825C584.991 128.326 587.782 125.873 589.96 122.465C592.275 118.921 593.568 114.151 593.84 108.154L600.783 116.127C600.103 123.896 598.197 130.439 595.066 135.754C592.071 141.07 587.85 145.159 582.405 148.021C577.095 150.747 570.561 152.11 562.801 152.11Z" fill="white"></path>
                </svg>
            </div>
        `}};window.customElements.define(`plain-intro-animation`,Nt);var Pt=`.plain-detail-modal-wrapper {
    pointer-events: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
}

.modal-overlay {
    padding: 2rem;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: auto;
    animation: fadeIn 0.3s ease-out;
}

@media (max-width: 768px) {
    .modal-overlay {
        padding: 16px;
    }
}

.modal-content {
    position: relative;
    padding: 0;
    box-sizing: border-box;
    background: white;
    width: 90%;
    max-width: 1000px;
    height: 85%;
    max-height: 800px;
    border-radius: 24px;
    box-shadow: 
        0 20px 50px rgba(0, 0, 0, 0.15),
        0 0 0 1px rgba(0,0,0,0.05);
    animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.close-btn {
    cursor: pointer;
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    width: 36px;
    height: 36px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(4px);
    border: 1px solid #e5e7eb;
    border-radius: 50%;
    color: #6b7280;
    font-size: 24px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20;
    transition: all 0.2s ease;
}

.close-btn:hover {
    color: #111827;
    background: #fff;
    transform: rotate(90deg);
}

/* LAYOUT */

.modal-content--top {
    flex: 1;
    display: flex;
    flex-direction: row;
    min-height: 0;
    border-bottom: 1px solid #f3f4f6;
}

.modal-content--top-left {
    flex: 1;
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    overflow-y: auto;
}

.modal-content--top-right {
    flex: 0 0 40%;
    background-color: #f9fafb;
    border-left: 1px solid #f3f4f6;
    position: relative;
    overflow: hidden;
}

.image-item {
    width: 100%;
    height: 100%;
}

.image-wrapper {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    transition: transform 0.5s ease;
}

/* Header */
.modal-content--header {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.top-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
}

.score-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    background-color: #f0fdf4;
    color: #166534;
    padding: 4px 10px;
    border-radius: 9999px;
    font-size: 13px;
    font-weight: 600;
    border: 1px solid #dcfce7;
}

.score-badge.ai-pick {
    background: linear-gradient(135deg, #f0e6ff 0%, #e6f0ff 100%);
    border-color: #c4b5fd;
    color: #6b21a8;
}

.score-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: hsl(calc(var(--score) * 120), 70%, 50%);
    box-shadow: 0 0 0 1px rgba(255,255,255,0.5);
}

.score-dot.ai {
    background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
    box-shadow: 0 0 0 1px rgba(139, 92, 246, 0.3);
}

.origin-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #6b7280;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.025em;
    background: #f9fafb;
    padding: 4px 10px;
    border-radius: 6px;
    border: 1px solid #f3f4f6;
}

.origin-badge svg {
    width: 14px;
    height: 14px;
    opacity: 0.7;
}

.modal-title {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #111827;
    line-height: 1.2;
    letter-spacing: -0.02em;
}

.model-badge {
    display: inline-block;
    font-size: 14px;
    color: #6b7280;
    background: #f3f4f6;
    padding: 2px 8px;
    border-radius: 4px;
    align-self: flex-start;
}

/* Summary */
.modal-content--summary h3 {
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #9ca3af;
    margin: 0 0 0.75rem 0;
    font-weight: 600;
}

.modal-content--summary p {
    margin: 0;
    font-size: 14px;
    line-height: 1.6;
    color: #4b5563;
}

/* Actions */
.actions-wrapper {
    display: flex;
    gap: 1rem;
    margin-top: auto;
    padding-top: 1rem;
}

.action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 15px;
    text-decoration: none;
    transition: all 0.2s ease;
}

.action-btn.primary {
    background: #111827;
    color: white;
    border: 1px solid transparent;
}

.action-btn.primary svg {
    margin-left: 0;
    max-width: 0;
    opacity: 0;
    transition: all 0.3s ease;
}

.action-btn.primary:hover svg {
    margin-left: 8px;
    max-width: 16px;
    opacity: 1;
}

.action-btn.primary:hover {
    background: #000;
    /* box-shadow: 0 4px 12px rgba(0,0,0,0.15); */
}

.action-btn.secondary {
    gap: 8px;
    background: white;
    color: #374151;
    border: 1px solid #e5e7eb;
}

.action-btn.secondary:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    color: #111827;
}

/* Bottom Details */
.modal-content--bottom {
    background: #fcfcfc;
    border-top: 1px solid #f3f4f6;
    padding: 2rem 2.5rem;
    max-height: 40%;
    overflow-y: auto;
}

.modal-content--bottom h3 {
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #9ca3af;
    margin: 0 0 1.5rem 0;
    font-weight: 600;
}

.details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem 3rem;
}

.detail-row {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.detail-label {
    font-size: 12px;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.025em;
    font-weight: 600;
}

.detail-value {
    font-size: 14px;
    color: #374151;
    font-weight: 500;
    word-break: break-word;
}

.detail-value.detail-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.detail-tag {
    display: inline-block;
    background-color: #f3f4f6;
    color: #374151;
    padding: 4px 10px;
    border-radius: 9999px;
    font-size: 13px;
    font-weight: 500;
    border: 1px solid #e5e7eb;
}

/* Highlighted Terms - Highlighter marker style */
mark {
    background-color: transparent; /* Will be set inline */
    color: inherit;
    padding: 0;
    border: none;
    border-radius: 0;
    font-weight: inherit;
}

/* Animations */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideUp {
    from { opacity: 0; transform: translateY(20px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}

/* Responsive */
@media (max-width: 900px) {
    .modal-content {
        width: 100%;
        height: 100%;
        max-width: none;
        max-height: none;
    }

    .modal-content--top {
        flex-direction: column-reverse;
        flex: auto;
    }

    .modal-content--top-right {
        flex: 0 0 200px;
        border-left: none;
        border-bottom: 1px solid #f3f4f6;
    }

    .modal-content--top-left {
        padding: 1.5rem;
    }

    .modal-content--bottom {
        padding: 1.5rem;
    }
    
    .modal-title {
        font-size: 1.5rem;
    }
}`,Ft=class extends i{modalContext;configContext;serviceContext;companyContext;possibleNameFields;possibleSummaryFields;possibleImageFields;possibleOriginFields;possibleAdditionalUrlFields;excludedFields;constructor(){super(`plain-detail-modal`,Pt),this.configContext=this.useContext(g.CONFIG),this.serviceContext=this.useContext(g.SERVICE),this.companyContext=this.useContext(g.COMPANY),this.modalContext=this.useContext(g.MODAL,!0),this.possibleNameFields=[`display_name`,`name`],this.possibleSummaryFields=[`x_summary`,`x_description`,`summary`,`description`],this.possibleImageFields=[`x_image`,`image`],this.possibleOriginFields=[`origin`,`x_origin`,`x_university_origin`,`university_origin`,`x_home_partner_institution`,`home_partner_institution`,`x_partner_institution`,`partner_institution`,`x_partner_institutions`,`partner_institutions`,`x_host_university`,`host_university`,`x_hosting_university`,`hosting_university`,`x_participating_universities`,`participating_universities`],this.possibleAdditionalUrlFields=[`x_web_link`,`web_link`,`x_link`,`link`,`x_more_info`,`more_info`,`x_additional_link`,`additional_link`],this.excludedFields=[...this.possibleImageFields,...this.possibleOriginFields,...this.possibleNameFields,...this.possibleSummaryFields,...this.possibleAdditionalUrlFields,`id`,`score`,`detail_url`,`write_uid`,`write_date`,`create_uid`,`create_date`,`__last_update`,`featured`,`validated`,`lead`,`x_editors`,`contact_person`]}close(){this.modalContext.set({isOpen:!1,element:null},!0)}getDetailUrl(e){let t=e?._sourceHost||this.configContext.get(`API_HOST`);return Ve(e?.model,e?.data?.id,this.serviceContext.get(`services`)||[],t,e?.model_view_url)}getHighlightedText(e,t){let n=this.companyContext.get(`primaryColor`)||`#8238eb`;return Ue(e,t,n)}extractValueForField(e,t){for(let n of t)if(e[n])return e[n];return null}extractFieldsData(e){let t=this.extractValueForField(e.data,this.possibleOriginFields)||``,n=this.extractValueForField(e.data,this.possibleImageFields)||``,r=this.extractValueForField(e.data,this.possibleNameFields)||``,i=this.extractValueForField(e.data,this.possibleSummaryFields)||``,a=Ee(this.extractValueForField(e.data,this.possibleAdditionalUrlFields)||``),o=e.model_verbose_name||``;return{rawOrigin:t,rawImageUrl:n,name:r,summary:i,additionalUrl:a,modelName:o}}template(){let{isOpen:e,element:t}=this.modalContext.get();if(!e||!t)return``;let{rawOrigin:n,rawImageUrl:r,name:i,summary:a,additionalUrl:o,modelName:s}=this.extractFieldsData(t),c=t?._sourceHost||this.configContext.get(`API_HOST`),l=t.data,u=t.score?.relative??null,d=Ce(n),f=Te(a),p=this.getDetailUrl(t),m=r?Be(r,c):``,h=d.length>0?d.map(e=>this.html`
                <span class="origin-badge">
                    ${ce}
                    ${e}
                </span>
            `).join(``):``;return this.html`
            <div class="modal-overlay">
                <div class="modal-content">
                    <button class="close-btn" aria-label="Close modal">×</button>

                    <div class="modal-content--top">
                        <div class="modal-content--top-left">

                            <!-- Header -->
                            <div class="modal-content--header">
                                <div class="top-info">
                                    <plain-score-badge score="${u}"></plain-score-badge>
                                    ${h}
                                </div>
                                <h2 class="modal-title">${this.getHighlightedText(i,t.roots||[])}</h2>
                                <div class="model-badge">${s}</div>
                            </div>

                            <!-- Summary -->
                            <div class="modal-content--summary">
                                <h3>Summary</h3>
                                <p>${this.getHighlightedText(f,t.roots||[])}</p>
                            </div>

                            <!-- Actions -->
                            <div class="actions-wrapper">
                                <a 
                                    href="${p}" 
                                    target="_blank" 
                                    class="action-btn primary"
                                    style="background-color: ${this.companyContext.get(`primaryColor`)}"
                                >
                                    ${this.getAttribute(`label-view-details`)||`View Full Details`}
                                    ${ie}
                                </a>
                                ${o?this.html`
                                    <a href="${o}" target="_blank" class="action-btn secondary">
                                        ${this.getAttribute(`label-source`)||`Visit Source`}
                                        <span class="icon">↗</span>
                                    </a>
                                `:``}
                            </div>
                        </div>

                        ${m?this.html`
                        <!-- Image -->
                        <div class="modal-content--top-right">
                            <div class="image-item">
                                <div class="image-wrapper" style="background-image: url('${m}')"></div>
                            </div>
                        </div>`:``}
                    </div>

                    <div class="modal-content--bottom">
                        <h3>${this.getAttribute(`label-details`)||`Details`}</h3>
                        <div class="details-grid">
                        ${Object.entries(l).map(([e,n])=>{if(this.excludedFields.includes(e)||typeof n!=`string`||!n||n===`False`||n===`[]`||n===`{}`)return``;let r=e.replace(/^x_/,``).replace(/_/g,` `),i=Se(n);return i===null?this.html`
                                <div class="detail-row">
                                    <span class="detail-label">${r}</span>
                                    <span class="detail-value">
                                        ${this.getHighlightedText(n,t.roots||[])}
                                    </span>
                                </div>
                            `:i.length===0?``:this.html`
                                    <div class="detail-row">
                                        <span class="detail-label">${r}</span>
                                        <span class="detail-value detail-tags">
                                            ${i.map(e=>this.html`
                                                <span class="detail-tag">${e}</span>
                                            `).join(``)}
                                        </span>
                                    </div>
                                `}).join(``)}
                        </div>
                    </div>
                </div>
            </div>
        `}listeners(){let e=this.$(`.modal-overlay`),t=this.$(`.close-btn`);e&&(e.onclick=t=>{t.target===e&&this.close()}),t&&(t.onclick=()=>this.close())}afterRender(){let{isOpen:e}=this.modalContext.get();!e||!this.$(`.modal-content`)||Pe({source:`detail-modal-open`,debounceMs:140,options:{bypassRefreshCooldown:!0}})}};window.customElements.define(`plain-detail-modal`,Ft);var It=`.plain-chat-window-wrapper {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;

    border-radius: 16px;

    overflow: hidden;
}

.chat-window {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    background: #fafafa;
    position: relative;
}

.chat-header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 8px 12px 0 12px;
    position: relative;
    z-index: 2;
}

.chat-expand-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    border: none;
    background: transparent;
    color: #888;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;
}

.chat-expand-btn:hover {
    background: color-mix(in srgb, var(--company-primary-color) 12%, transparent);
    color: var(--company-primary-color);
}

.chat-window::before,
.chat-window::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 50px;
    pointer-events: none;
    z-index: 1;
}

.chat-window::before {
    top: 0;
    background: linear-gradient(to bottom, #fafafa 0%, transparent 100%);
}

.chat-window::after {
    bottom: 0;
    background: linear-gradient(to top, #fafafa 0%, transparent 100%);
}

.chat-messages {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 32px 24px;
    display: flex;
    flex-direction: column;
    gap: 32px;
}

.chat-messages::-webkit-scrollbar {
    width: 4px;
}

.chat-messages::-webkit-scrollbar-track {
    background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 2px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
    background: #ccc;
}

/* Empty State */
.empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px;
    position: relative;
}

.empty-text-container {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
}

.empty-text {
    font-family: var(--agora-font-body, 'Geist Mono'), monospace;
    font-size: 15px;
    font-weight: 400;
    color: #4a4a4a;
    letter-spacing: -0.01em;
}

.empty-hint {
    font-family: var(--agora-font-body, 'Geist Mono'), monospace;
    font-size: 12px;
    font-weight: 400;
    color: #9a9a9a;
    letter-spacing: -0.01em;
}

.flying-dot {
    position: absolute;
    width: 6px;
    height: 6px;
    top: 50%;
    left: 50%;
    z-index: 1;
    animation: 
        fly-x 11s ease-in-out infinite,
        fly-y 7s ease-in-out infinite,
        fly-drift 13s ease-in-out infinite;
}

.flying-dot::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: var(--company-primary-color);
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(124, 58, 237, 0.5);
}

.pulse-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 6px;
    height: 6px;
    transform: translate(-50%, -50%);
    border: 1.5px solid rgba(124, 58, 237, 0.6);
    border-radius: 50%;
    animation: pulse-out 2s ease-out infinite;
}

.pulse-ring-2 {
    animation-delay: 0.6s;
}

.pulse-ring-3 {
    animation-delay: 1.2s;
}

@keyframes pulse-out {
    0% {
        width: 6px;
        height: 6px;
        opacity: 0.8;
    }
    100% {
        width: 50px;
        height: 50px;
        opacity: 0;
    }
}

@keyframes fly-x {
    0%, 100% { transform: translateX(-170px); }
    50% { transform: translateX(170px); }
}

@keyframes fly-y {
    0%, 100% { margin-top: -70px; }
    25% { margin-top: 50px; }
    50% { margin-top: -60px; }
    75% { margin-top: 70px; }
}

@keyframes fly-drift {
    0%, 100% { margin-left: 0; }
    20% { margin-left: 30px; }
    40% { margin-left: -40px; }
    60% { margin-left: 35px; }
    80% { margin-left: -25px; }
}

/* Messages */
.message {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.message-author {
    font-family: var(--agora-font-body, 'Geist'), sans-serif;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #999;
}

.message.user {
    margin-left: auto;
    text-align: right;
}

.message.user .message-author {
    display: none;
    color: #666;
}

.message.ai .message-author {
    color: var(--company-primary-color);
}

.message-text {
    font-family: var(--agora-font-body, 'Geist'), sans-serif;
    font-size: 15px;
    font-weight: 400;
    line-height: 1.65;
    color: #1a1a1a;
    letter-spacing: -0.01em;
}

.message.user .message-text {
    padding: 6px 12px;
    box-sizing: border-box;

    color: #0a0a0a;

    background-color: rgb(230, 230, 230);
}

.message.ai .message-text {
    color: #2a2a2a;
}

.message-text code {
    font-family: var(--agora-font-body, 'Geist Mono'), monospace;
    font-size: 13px;
    background: #f0f0f0;
    padding: 2px 6px;
    border-radius: 4px;
    color: #d14;
}

.message-text strong {
    font-weight: 600;
}

.message-text em {
    font-style: italic;
}

/* Markdown Formatting */
.message-text p {
    margin: 0 0 12px 0;
}

.message-text p:last-child {
    margin-bottom: 0;
}

.message-text h1,
.message-text h2,
.message-text h3,
.message-text h4,
.message-text h5,
.message-text h6 {
    font-family: var(--agora-font-body, 'Geist'), sans-serif;
    font-weight: 600;
    margin: 16px 0 8px 0;
    line-height: 1.3;
    color: #1a1a1a;
}

.message-text h1:first-child,
.message-text h2:first-child,
.message-text h3:first-child {
    margin-top: 0;
}

.message-text h1 { font-size: 1.4em; }
.message-text h2 { font-size: 1.25em; }
.message-text h3 { font-size: 1.1em; }
.message-text h4 { font-size: 1em; }

.message-text ul,
.message-text ol {
    margin: 8px 0;
    padding-left: 24px;
}

.message-text li {
    margin: 4px 0;
    line-height: 1.5;
}

.message-text li::marker {
    color: var(--company-primary-color);
}

.message-text pre {
    background: #1e1e1e;
    color: #d4d4d4;
    padding: 12px 16px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 12px 0;
    font-family: var(--agora-font-body, 'Geist Mono'), monospace;
    font-size: 13px;
    line-height: 1.5;
}

.message-text pre code {
    background: transparent;
    padding: 0;
    color: inherit;
    font-size: inherit;
}

.message-text blockquote {
    border-left: 3px solid var(--company-primary-color);
    margin: 12px 0;
    padding: 8px 16px;
    background: color-mix(in srgb, var(--company-primary-color) 8%, transparent);
    color: color-mix(in srgb, var(--company-primary-color) 75%, black);
    font-style: italic;
}

.message-text blockquote p {
    margin: 0;
}

.message-text a {
    color: var(--company-primary-color);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s;
}

.message-text a:hover {
    border-bottom-color: var(--company-primary-color);
}

.message-text hr {
    border: none;
    border-top: 1px solid #e5e5e5;
    margin: 16px 0;
}

.message-text table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    font-size: 14px;
}

.message-text th,
.message-text td {
    border: 1px solid #e5e5e5;
    padding: 8px 12px;
    text-align: left;
}

.message-text th {
    background: #f5f5f5;
    font-weight: 600;
}

.message-text tr:nth-child(even) {
    background: #fafafa;
}

/* Typing Indicator */
.typing-indicator {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 0;
}

.typing-indicator span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--company-primary-color);
    opacity: 0.4;
    animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
    animation-delay: 0s;
}

.typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes typing {
    0%, 60%, 100% {
        opacity: 0.4;
        transform: scale(1);
    }
    30% {
        opacity: 1;
        transform: scale(1.1);
    }
}

/* Streaming Animation */
.message.streaming .message-text::after {
    content: '│';
    font-weight: 300;
    color: var(--company-primary-color);
    animation: cursor-blink 0.8s infinite;
    margin-left: 1px;
}

@keyframes cursor-blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
}

/* Fetching Label (inline with author name) */
.fetching-label {
    display: inline-block;
    margin-left: 8px;
    font-family: var(--agora-font-body, 'Geist'), sans-serif;
    font-size: 10px;
    font-weight: 500;
    color: var(--company-primary-color);
    text-transform: none;
    letter-spacing: 0;
    animation: label-fade-in 0.3s ease-out forwards;
    white-space: nowrap;
}

.fetching-label.fade-out {
    animation: label-fade-out 1.5s ease-out forwards;
}

@keyframes label-fade-in {
    from {
        opacity: 0;
        transform: translateX(-4px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes label-fade-out {
    0% {
        opacity: 1;
        transform: translateX(0);
    }
    70% {
        opacity: 1;
        transform: translateX(0);
    }
    100% {
        opacity: 0;
        transform: translateX(4px);
    }
}

/* Responsive */
@media (max-width: 1024px) {
    .chat-messages {
        padding: 24px 16px;
        gap: 24px;
    }

    .empty-state {
        padding: 24px;
    }
}

@media (max-width: 768px) {
    .chat-messages {
        padding: 16px 12px;
        gap: 16px;
    }

    .message-text {
        font-size: 14px;
        line-height: 1.5;
    }

    .message.user .message-text {
        padding: 4px 10px;
    }

    .message-text pre {
        padding: 8px 12px;
        font-size: 12px;
    }

    .message-text table {
        font-size: 12px;
    }

    .message-text th,
    .message-text td {
        padding: 6px 8px;
    }
}

.chat-media-youtube {
    position: relative;
    display: block;
    width: 100%;
    max-width: 480px;
    aspect-ratio: 16 / 9;
    margin: 8px 0;
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    background: #000;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    transition: transform 0.15s ease-out, box-shadow 0.15s ease-out;
}

.chat-media-youtube:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
}

.chat-media-youtube iframe {
    width: 100%;
    height: 100%;
    border: 0;
    pointer-events: none;
}

.chat-media-image {
    display: block;
    max-width: 320px;
    max-height: 240px;
    margin: 8px 0;
    border-radius: 10px;
    cursor: zoom-in;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    transition: transform 0.15s ease-out, box-shadow 0.15s ease-out;
}

.chat-media-image:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
}

/* Error message + Retry */
.message.ai.error .message-author {
    color: #b94a48;
}

.message.ai.error .message-text {
    color: #7a3a39;
    background: rgba(217, 83, 79, 0.08);
    border: 1px solid rgba(217, 83, 79, 0.18);
    padding: 10px 14px;
    border-radius: 10px;
    align-self: flex-start;
}

.retry-btn {
    align-self: flex-start;
    margin-top: 8px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border: 1px solid color-mix(in srgb, var(--company-primary-color) 30%, transparent);
    background: transparent;
    color: var(--company-primary-color);
    border-radius: 6px;
    font-family: var(--agora-font-body, 'Geist'), sans-serif;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

.retry-btn:hover {
    background: color-mix(in srgb, var(--company-primary-color) 10%, transparent);
    border-color: var(--company-primary-color);
}

.retry-btn svg {
    flex-shrink: 0;
}

/* Reasoning (debug) */
.reasoning-block {
    align-self: flex-start;
    margin: 4px 0 8px 0;
    max-width: 100%;
    background: rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 8px;
    font-size: 12px;
    color: #555;
}

.reasoning-block summary {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    cursor: pointer;
    color: #666;
    font-weight: 500;
    list-style: none;
    user-select: none;
    border-radius: 8px;
    transition: background 0.15s ease;
}

.reasoning-block summary::-webkit-details-marker {
    display: none;
}

.reasoning-block summary:hover {
    background: rgba(0, 0, 0, 0.04);
}

.reasoning-block[open] summary {
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}

.reasoning-chevron {
    flex-shrink: 0;
    opacity: 0.7;
    transition: transform 0.15s ease;
}

.reasoning-block[open] summary .reasoning-chevron {
    transform: rotate(180deg);
}

.reasoning-content {
    margin: 0;
    padding: 10px 12px;
    max-height: 240px;
    overflow-y: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: var(--agora-font-body, 'Geist Mono'), monospace;
    font-size: 11.5px;
    line-height: 1.55;
    color: #666;
    background: transparent;
}

.reasoning-content::-webkit-scrollbar {
    width: 4px;
}

.reasoning-content::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 2px;
}

.reasoning-block.streaming-reasoning summary {
    color: var(--company-primary-color);
}`;function Lt(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Rt=Lt();function zt(e){Rt=e}var Bt={exec:()=>null};function T(e,t=``){let n=typeof e==`string`?e:e.source,r={replace:(e,t)=>{let i=typeof t==`string`?t:t.source;return i=i.replace(Ht.caret,`$1`),n=n.replace(e,i),r},getRegex:()=>new RegExp(n,t)};return r}var Vt=(()=>{try{return!0}catch{return!1}})(),Ht={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:e=>RegExp(`^ {0,${Math.min(3,e-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:e=>RegExp(`^ {0,${Math.min(3,e-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:e=>RegExp(`^ {0,${Math.min(3,e-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:e=>RegExp(`^ {0,${Math.min(3,e-1)}}#`),htmlBeginRegex:e=>RegExp(`^ {0,${Math.min(3,e-1)}}<(?:[a-z].*>|!--)`,`i`)},Ut=/^(?:[ \t]*(?:\n|$))+/,Wt=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Gt=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,Kt=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,qt=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,Jt=/(?:[*+-]|\d{1,9}[.)])/,Yt=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,Xt=T(Yt).replace(/bull/g,Jt).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,``).getRegex(),Zt=T(Yt).replace(/bull/g,Jt).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),Qt=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,$t=/^[^\n]+/,en=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,tn=T(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace(`label`,en).replace(`title`,/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),nn=T(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,Jt).getRegex(),rn=`address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul`,an=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,on=T(`^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))`,`i`).replace(`comment`,an).replace(`tag`,rn).replace(`attribute`,/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),sn=T(Qt).replace(`hr`,Kt).replace(`heading`,` {0,3}#{1,6}(?:\\s|$)`).replace(`|lheading`,``).replace(`|table`,``).replace(`blockquote`,` {0,3}>`).replace(`fences`," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace(`list`,` {0,3}(?:[*+-]|1[.)]) `).replace(`html`,`</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)`).replace(`tag`,rn).getRegex(),cn={blockquote:T(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace(`paragraph`,sn).getRegex(),code:Wt,def:tn,fences:Gt,heading:qt,hr:Kt,html:on,lheading:Xt,list:nn,newline:Ut,paragraph:sn,table:Bt,text:$t},ln=T(`^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)`).replace(`hr`,Kt).replace(`heading`,` {0,3}#{1,6}(?:\\s|$)`).replace(`blockquote`,` {0,3}>`).replace(`code`,`(?: {4}| {0,3}	)[^\\n]`).replace(`fences`," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace(`list`,` {0,3}(?:[*+-]|1[.)]) `).replace(`html`,`</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)`).replace(`tag`,rn).getRegex(),un={...cn,lheading:Zt,table:ln,paragraph:T(Qt).replace(`hr`,Kt).replace(`heading`,` {0,3}#{1,6}(?:\\s|$)`).replace(`|lheading`,``).replace(`table`,ln).replace(`blockquote`,` {0,3}>`).replace(`fences`," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace(`list`,` {0,3}(?:[*+-]|1[.)]) `).replace(`html`,`</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)`).replace(`tag`,rn).getRegex()},dn={...cn,html:T(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace(`comment`,an).replace(/tag/g,`(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b`).getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Bt,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:T(Qt).replace(`hr`,Kt).replace(`heading`,` *#{1,6} *[^
]`).replace(`lheading`,Xt).replace(`|table`,``).replace(`blockquote`,` {0,3}>`).replace(`|fences`,``).replace(`|list`,``).replace(`|html`,``).replace(`|tag`,``).getRegex()},fn=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,pn=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,mn=/^( {2,}|\\)\n(?!\s*$)/,hn=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,gn=/[\p{P}\p{S}]/u,_n=/[\s\p{P}\p{S}]/u,vn=/[^\s\p{P}\p{S}]/u,yn=T(/^((?![*_])punctSpace)/,`u`).replace(/punctSpace/g,_n).getRegex(),bn=/(?!~)[\p{P}\p{S}]/u,xn=/(?!~)[\s\p{P}\p{S}]/u,Sn=/(?:[^\s\p{P}\p{S}]|~)/u,Cn=T(/link|precode-code|html/,`g`).replace(`link`,/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace(`precode-`,Vt?"(?<!`)()":"(^^|[^`])").replace(`code`,/(?<b>`+)[^`]+\k<b>(?!`)/).replace(`html`,/<(?! )[^<>]*?>/).getRegex(),wn=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,Tn=T(wn,`u`).replace(/punct/g,gn).getRegex(),En=T(wn,`u`).replace(/punct/g,bn).getRegex(),Dn=`^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)`,On=T(Dn,`gu`).replace(/notPunctSpace/g,vn).replace(/punctSpace/g,_n).replace(/punct/g,gn).getRegex(),kn=T(Dn,`gu`).replace(/notPunctSpace/g,Sn).replace(/punctSpace/g,xn).replace(/punct/g,bn).getRegex(),An=T(`^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)`,`gu`).replace(/notPunctSpace/g,vn).replace(/punctSpace/g,_n).replace(/punct/g,gn).getRegex(),jn=T(/\\(punct)/,`gu`).replace(/punct/g,gn).getRegex(),Mn=T(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace(`scheme`,/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace(`email`,/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Nn=T(an).replace(`(?:-->|$)`,`-->`).getRegex(),Pn=T(`^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>`).replace(`comment`,Nn).replace(`attribute`,/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Fn=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,In=T(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace(`label`,Fn).replace(`href`,/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace(`title`,/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),Ln=T(/^!?\[(label)\]\[(ref)\]/).replace(`label`,Fn).replace(`ref`,en).getRegex(),Rn=T(/^!?\[(ref)\](?:\[\])?/).replace(`ref`,en).getRegex(),zn=T(`reflink|nolink(?!\\()`,`g`).replace(`reflink`,Ln).replace(`nolink`,Rn).getRegex(),Bn=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,Vn={_backpedal:Bt,anyPunctuation:jn,autolink:Mn,blockSkip:Cn,br:mn,code:pn,del:Bt,emStrongLDelim:Tn,emStrongRDelimAst:On,emStrongRDelimUnd:An,escape:fn,link:In,nolink:Rn,punctuation:yn,reflink:Ln,reflinkSearch:zn,tag:Pn,text:hn,url:Bt},Hn={...Vn,link:T(/^!?\[(label)\]\((.*?)\)/).replace(`label`,Fn).getRegex(),reflink:T(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace(`label`,Fn).getRegex()},Un={...Vn,emStrongRDelimAst:kn,emStrongLDelim:En,url:T(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace(`protocol`,Bn).replace(`email`,/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:T(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace(`protocol`,Bn).getRegex()},Wn={...Un,br:T(mn).replace(`{2,}`,`*`).getRegex(),text:T(Un.text).replace(`\\b_`,`\\b_| {2,}\\n`).replace(/\{2,\}/g,`*`).getRegex()},Gn={normal:cn,gfm:un,pedantic:dn},Kn={normal:Vn,gfm:Un,breaks:Wn,pedantic:Hn},qn={"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`},Jn=e=>qn[e];function Yn(e,t){if(t){if(Ht.escapeTest.test(e))return e.replace(Ht.escapeReplace,Jn)}else if(Ht.escapeTestNoEncode.test(e))return e.replace(Ht.escapeReplaceNoEncode,Jn);return e}function Xn(e){try{e=encodeURI(e).replace(Ht.percentDecode,`%`)}catch{return null}return e}function Zn(e,t){let n=e.replace(Ht.findPipe,(e,t,n)=>{let r=!1,i=t;for(;--i>=0&&n[i]===`\\`;)r=!r;return r?`|`:` |`}).split(Ht.splitPipe),r=0;if(n[0].trim()||n.shift(),n.length>0&&!n.at(-1)?.trim()&&n.pop(),t)if(n.length>t)n.splice(t);else for(;n.length<t;)n.push(``);for(;r<n.length;r++)n[r]=n[r].trim().replace(Ht.slashPipe,`|`);return n}function Qn(e,t,n){let r=e.length;if(r===0)return``;let i=0;for(;i<r;){let a=e.charAt(r-i-1);if(a===t&&!n)i++;else if(a!==t&&n)i++;else break}return e.slice(0,r-i)}function $n(e,t){if(e.indexOf(t[1])===-1)return-1;let n=0;for(let r=0;r<e.length;r++)if(e[r]===`\\`)r++;else if(e[r]===t[0])n++;else if(e[r]===t[1]&&(n--,n<0))return r;return n>0?-2:-1}function er(e,t,n,r,i){let a=t.href,o=t.title||null,s=e[1].replace(i.other.outputLinkReplace,`$1`);r.state.inLink=!0;let c={type:e[0].charAt(0)===`!`?`image`:`link`,raw:n,href:a,title:o,text:s,tokens:r.inlineTokens(s)};return r.state.inLink=!1,c}function tr(e,t,n){let r=e.match(n.other.indentCodeCompensation);if(r===null)return t;let i=r[1];return t.split(`
`).map(e=>{let t=e.match(n.other.beginningSpace);if(t===null)return e;let[r]=t;return r.length>=i.length?e.slice(i.length):e}).join(`
`)}var nr=class{options;rules;lexer;constructor(e){this.options=e||Rt}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:`space`,raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let e=t[0].replace(this.rules.other.codeRemoveIndent,``);return{type:`code`,raw:t[0],codeBlockStyle:`indented`,text:this.options.pedantic?e:Qn(e,`
`)}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let e=t[0],n=tr(e,t[3]||``,this.rules);return{type:`code`,raw:e,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,`$1`):t[2],text:n}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let e=t[2].trim();if(this.rules.other.endingHash.test(e)){let t=Qn(e,`#`);(this.options.pedantic||!t||this.rules.other.endingSpaceChar.test(t))&&(e=t.trim())}return{type:`heading`,raw:t[0],depth:t[1].length,text:e,tokens:this.lexer.inline(e)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:`hr`,raw:Qn(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let e=Qn(t[0],`
`).split(`
`),n=``,r=``,i=[];for(;e.length>0;){let t=!1,a=[],o;for(o=0;o<e.length;o++)if(this.rules.other.blockquoteStart.test(e[o]))a.push(e[o]),t=!0;else if(!t)a.push(e[o]);else break;e=e.slice(o);let s=a.join(`
`),c=s.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,``);n=n?`${n}
${s}`:s,r=r?`${r}
${c}`:c;let l=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(c,i,!0),this.lexer.state.top=l,e.length===0)break;let u=i.at(-1);if(u?.type===`code`)break;if(u?.type===`blockquote`){let t=u,a=t.raw+`
`+e.join(`
`),o=this.blockquote(a);i[i.length-1]=o,n=n.substring(0,n.length-t.raw.length)+o.raw,r=r.substring(0,r.length-t.text.length)+o.text;break}else if(u?.type===`list`){let t=u,a=t.raw+`
`+e.join(`
`),o=this.list(a);i[i.length-1]=o,n=n.substring(0,n.length-u.raw.length)+o.raw,r=r.substring(0,r.length-t.raw.length)+o.raw,e=a.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:`blockquote`,raw:n,tokens:i,text:r}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),r=n.length>1,i={type:`list`,raw:``,ordered:r,start:r?+n.slice(0,-1):``,loose:!1,items:[]};n=r?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=r?n:`[*+-]`);let a=this.rules.other.listItemRegex(n),o=!1;for(;e;){let n=!1,r=``,s=``;if(!(t=a.exec(e))||this.rules.block.hr.test(e))break;r=t[0],e=e.substring(r.length);let c=t[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,e=>` `.repeat(3*e.length)),l=e.split(`
`,1)[0],u=!c.trim(),d=0;if(this.options.pedantic?(d=2,s=c.trimStart()):u?d=t[1].length+1:(d=t[2].search(this.rules.other.nonSpaceChar),d=d>4?1:d,s=c.slice(d),d+=t[1].length),u&&this.rules.other.blankLine.test(l)&&(r+=l+`
`,e=e.substring(l.length+1),n=!0),!n){let t=this.rules.other.nextBulletRegex(d),n=this.rules.other.hrRegex(d),i=this.rules.other.fencesBeginRegex(d),a=this.rules.other.headingBeginRegex(d),o=this.rules.other.htmlBeginRegex(d);for(;e;){let f=e.split(`
`,1)[0],p;if(l=f,this.options.pedantic?(l=l.replace(this.rules.other.listReplaceNesting,`  `),p=l):p=l.replace(this.rules.other.tabCharGlobal,`    `),i.test(l)||a.test(l)||o.test(l)||t.test(l)||n.test(l))break;if(p.search(this.rules.other.nonSpaceChar)>=d||!l.trim())s+=`
`+p.slice(d);else{if(u||c.replace(this.rules.other.tabCharGlobal,`    `).search(this.rules.other.nonSpaceChar)>=4||i.test(c)||a.test(c)||n.test(c))break;s+=`
`+l}!u&&!l.trim()&&(u=!0),r+=f+`
`,e=e.substring(f.length+1),c=p.slice(d)}}i.loose||(o?i.loose=!0:this.rules.other.doubleBlankLine.test(r)&&(o=!0)),i.items.push({type:`list_item`,raw:r,task:!!this.options.gfm&&this.rules.other.listIsTask.test(s),loose:!1,text:s,tokens:[]}),i.raw+=r}let s=i.items.at(-1);if(s)s.raw=s.raw.trimEnd(),s.text=s.text.trimEnd();else return;i.raw=i.raw.trimEnd();for(let e of i.items){if(this.lexer.state.top=!1,e.tokens=this.lexer.blockTokens(e.text,[]),e.task){if(e.text=e.text.replace(this.rules.other.listReplaceTask,``),e.tokens[0]?.type===`text`||e.tokens[0]?.type===`paragraph`){e.tokens[0].raw=e.tokens[0].raw.replace(this.rules.other.listReplaceTask,``),e.tokens[0].text=e.tokens[0].text.replace(this.rules.other.listReplaceTask,``);for(let e=this.lexer.inlineQueue.length-1;e>=0;e--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[e].src)){this.lexer.inlineQueue[e].src=this.lexer.inlineQueue[e].src.replace(this.rules.other.listReplaceTask,``);break}}let t=this.rules.other.listTaskCheckbox.exec(e.raw);if(t){let n={type:`checkbox`,raw:t[0]+` `,checked:t[0]!==`[ ]`};e.checked=n.checked,i.loose?e.tokens[0]&&[`paragraph`,`text`].includes(e.tokens[0].type)&&`tokens`in e.tokens[0]&&e.tokens[0].tokens?(e.tokens[0].raw=n.raw+e.tokens[0].raw,e.tokens[0].text=n.raw+e.tokens[0].text,e.tokens[0].tokens.unshift(n)):e.tokens.unshift({type:`paragraph`,raw:n.raw,text:n.raw,tokens:[n]}):e.tokens.unshift(n)}}if(!i.loose){let t=e.tokens.filter(e=>e.type===`space`);i.loose=t.length>0&&t.some(e=>this.rules.other.anyLine.test(e.raw))}}if(i.loose)for(let e of i.items){e.loose=!0;for(let t of e.tokens)t.type===`text`&&(t.type=`paragraph`)}return i}}html(e){let t=this.rules.block.html.exec(e);if(t)return{type:`html`,block:!0,raw:t[0],pre:t[1]===`pre`||t[1]===`script`||t[1]===`style`,text:t[0]}}def(e){let t=this.rules.block.def.exec(e);if(t){let e=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal,` `),n=t[2]?t[2].replace(this.rules.other.hrefBrackets,`$1`).replace(this.rules.inline.anyPunctuation,`$1`):``,r=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,`$1`):t[3];return{type:`def`,tag:e,raw:t[0],href:n,title:r}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let n=Zn(t[1]),r=t[2].replace(this.rules.other.tableAlignChars,``).split(`|`),i=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,``).split(`
`):[],a={type:`table`,raw:t[0],header:[],align:[],rows:[]};if(n.length===r.length){for(let e of r)this.rules.other.tableAlignRight.test(e)?a.align.push(`right`):this.rules.other.tableAlignCenter.test(e)?a.align.push(`center`):this.rules.other.tableAlignLeft.test(e)?a.align.push(`left`):a.align.push(null);for(let e=0;e<n.length;e++)a.header.push({text:n[e],tokens:this.lexer.inline(n[e]),header:!0,align:a.align[e]});for(let e of i)a.rows.push(Zn(e,a.header.length).map((e,t)=>({text:e,tokens:this.lexer.inline(e),header:!1,align:a.align[t]})));return a}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t)return{type:`heading`,raw:t[0],depth:t[2].charAt(0)===`=`?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let e=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:`paragraph`,raw:t[0],text:e,tokens:this.lexer.inline(e)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:`text`,raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:`escape`,raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:`html`,raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let e=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(e)){if(!this.rules.other.endAngleBracket.test(e))return;let t=Qn(e.slice(0,-1),`\\`);if((e.length-t.length)%2==0)return}else{let e=$n(t[2],`()`);if(e===-2)return;if(e>-1){let n=(t[0].indexOf(`!`)===0?5:4)+t[1].length+e;t[2]=t[2].substring(0,e),t[0]=t[0].substring(0,n).trim(),t[3]=``}}let n=t[2],r=``;if(this.options.pedantic){let e=this.rules.other.pedanticHrefTitle.exec(n);e&&(n=e[1],r=e[3])}else r=t[3]?t[3].slice(1,-1):``;return n=n.trim(),this.rules.other.startAngleBracket.test(n)&&(n=this.options.pedantic&&!this.rules.other.endAngleBracket.test(e)?n.slice(1):n.slice(1,-1)),er(t,{href:n&&n.replace(this.rules.inline.anyPunctuation,`$1`),title:r&&r.replace(this.rules.inline.anyPunctuation,`$1`)},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let e=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal,` `),r=t[e.toLowerCase()];if(!r){let e=n[0].charAt(0);return{type:`text`,raw:e,text:e}}return er(n,r,n[0],this.lexer,this.rules)}}emStrong(e,t,n=``){let r=this.rules.inline.emStrongLDelim.exec(e);if(!(!r||r[3]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(r[1]||r[2])||!n||this.rules.inline.punctuation.exec(n))){let n=[...r[0]].length-1,i,a,o=n,s=0,c=r[0][0]===`*`?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(c.lastIndex=0,t=t.slice(-1*e.length+n);(r=c.exec(t))!=null;){if(i=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!i)continue;if(a=[...i].length,r[3]||r[4]){o+=a;continue}else if((r[5]||r[6])&&n%3&&!((n+a)%3)){s+=a;continue}if(o-=a,o>0)continue;a=Math.min(a,a+o+s);let t=[...r[0]][0].length,c=e.slice(0,n+r.index+t+a);if(Math.min(n,a)%2){let e=c.slice(1,-1);return{type:`em`,raw:c,text:e,tokens:this.lexer.inlineTokens(e)}}let l=c.slice(2,-2);return{type:`strong`,raw:c,text:l,tokens:this.lexer.inlineTokens(l)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let e=t[2].replace(this.rules.other.newLineCharGlobal,` `),n=this.rules.other.nonSpaceChar.test(e),r=this.rules.other.startingSpaceChar.test(e)&&this.rules.other.endingSpaceChar.test(e);return n&&r&&(e=e.substring(1,e.length-1)),{type:`codespan`,raw:t[0],text:e}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:`br`,raw:t[0]}}del(e){let t=this.rules.inline.del.exec(e);if(t)return{type:`del`,raw:t[0],text:t[2],tokens:this.lexer.inlineTokens(t[2])}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let e,n;return t[2]===`@`?(e=t[1],n=`mailto:`+e):(e=t[1],n=e),{type:`link`,raw:t[0],text:e,href:n,tokens:[{type:`text`,raw:e,text:e}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let e,n;if(t[2]===`@`)e=t[0],n=`mailto:`+e;else{let r;do r=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??``;while(r!==t[0]);e=t[0],n=t[1]===`www.`?`http://`+t[0]:t[0]}return{type:`link`,raw:t[0],text:e,href:n,tokens:[{type:`text`,raw:e,text:e}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let e=this.lexer.state.inRawBlock;return{type:`text`,raw:t[0],text:t[0],escaped:e}}}},rr=class e{tokens;options;state;inlineQueue;tokenizer;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||Rt,this.options.tokenizer=this.options.tokenizer||new nr,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let t={other:Ht,block:Gn.normal,inline:Kn.normal};this.options.pedantic?(t.block=Gn.pedantic,t.inline=Kn.pedantic):this.options.gfm&&(t.block=Gn.gfm,this.options.breaks?t.inline=Kn.breaks:t.inline=Kn.gfm),this.tokenizer.rules=t}static get rules(){return{block:Gn,inline:Kn}}static lex(t,n){return new e(n).lex(t)}static lexInline(t,n){return new e(n).inlineTokens(t)}lex(e){e=e.replace(Ht.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let e=0;e<this.inlineQueue.length;e++){let t=this.inlineQueue[e];this.inlineTokens(t.src,t.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,t=[],n=!1){for(this.options.pedantic&&(e=e.replace(Ht.tabCharGlobal,`    `).replace(Ht.spaceLine,``));e;){let r;if(this.options.extensions?.block?.some(n=>(r=n.call({lexer:this},e,t))?(e=e.substring(r.raw.length),t.push(r),!0):!1))continue;if(r=this.tokenizer.space(e)){e=e.substring(r.raw.length);let n=t.at(-1);r.raw.length===1&&n!==void 0?n.raw+=`
`:t.push(r);continue}if(r=this.tokenizer.code(e)){e=e.substring(r.raw.length);let n=t.at(-1);n?.type===`paragraph`||n?.type===`text`?(n.raw+=(n.raw.endsWith(`
`)?``:`
`)+r.raw,n.text+=`
`+r.text,this.inlineQueue.at(-1).src=n.text):t.push(r);continue}if(r=this.tokenizer.fences(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.heading(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.hr(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.blockquote(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.list(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.html(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.def(e)){e=e.substring(r.raw.length);let n=t.at(-1);n?.type===`paragraph`||n?.type===`text`?(n.raw+=(n.raw.endsWith(`
`)?``:`
`)+r.raw,n.text+=`
`+r.raw,this.inlineQueue.at(-1).src=n.text):this.tokens.links[r.tag]||(this.tokens.links[r.tag]={href:r.href,title:r.title},t.push(r));continue}if(r=this.tokenizer.table(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.lheading(e)){e=e.substring(r.raw.length),t.push(r);continue}let i=e;if(this.options.extensions?.startBlock){let t=1/0,n=e.slice(1),r;this.options.extensions.startBlock.forEach(e=>{r=e.call({lexer:this},n),typeof r==`number`&&r>=0&&(t=Math.min(t,r))}),t<1/0&&t>=0&&(i=e.substring(0,t+1))}if(this.state.top&&(r=this.tokenizer.paragraph(i))){let a=t.at(-1);n&&a?.type===`paragraph`?(a.raw+=(a.raw.endsWith(`
`)?``:`
`)+r.raw,a.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):t.push(r),n=i.length!==e.length,e=e.substring(r.raw.length);continue}if(r=this.tokenizer.text(e)){e=e.substring(r.raw.length);let n=t.at(-1);n?.type===`text`?(n.raw+=(n.raw.endsWith(`
`)?``:`
`)+r.raw,n.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=n.text):t.push(r);continue}if(e){let t=`Infinite loop on byte: `+e.charCodeAt(0);if(this.options.silent){console.error(t);break}else throw Error(t)}}return this.state.top=!0,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}inlineTokens(e,t=[]){let n=e,r=null;if(this.tokens.links){let e=Object.keys(this.tokens.links);if(e.length>0)for(;(r=this.tokenizer.rules.inline.reflinkSearch.exec(n))!=null;)e.includes(r[0].slice(r[0].lastIndexOf(`[`)+1,-1))&&(n=n.slice(0,r.index)+`[`+`a`.repeat(r[0].length-2)+`]`+n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(r=this.tokenizer.rules.inline.anyPunctuation.exec(n))!=null;)n=n.slice(0,r.index)+`++`+n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let i;for(;(r=this.tokenizer.rules.inline.blockSkip.exec(n))!=null;)i=r[2]?r[2].length:0,n=n.slice(0,r.index+i)+`[`+`a`.repeat(r[0].length-i-2)+`]`+n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);n=this.options.hooks?.emStrongMask?.call({lexer:this},n)??n;let a=!1,o=``;for(;e;){a||(o=``),a=!1;let r;if(this.options.extensions?.inline?.some(n=>(r=n.call({lexer:this},e,t))?(e=e.substring(r.raw.length),t.push(r),!0):!1))continue;if(r=this.tokenizer.escape(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.tag(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.link(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(r.raw.length);let n=t.at(-1);r.type===`text`&&n?.type===`text`?(n.raw+=r.raw,n.text+=r.text):t.push(r);continue}if(r=this.tokenizer.emStrong(e,n,o)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.codespan(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.br(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.del(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.autolink(e)){e=e.substring(r.raw.length),t.push(r);continue}if(!this.state.inLink&&(r=this.tokenizer.url(e))){e=e.substring(r.raw.length),t.push(r);continue}let i=e;if(this.options.extensions?.startInline){let t=1/0,n=e.slice(1),r;this.options.extensions.startInline.forEach(e=>{r=e.call({lexer:this},n),typeof r==`number`&&r>=0&&(t=Math.min(t,r))}),t<1/0&&t>=0&&(i=e.substring(0,t+1))}if(r=this.tokenizer.inlineText(i)){e=e.substring(r.raw.length),r.raw.slice(-1)!==`_`&&(o=r.raw.slice(-1)),a=!0;let n=t.at(-1);n?.type===`text`?(n.raw+=r.raw,n.text+=r.text):t.push(r);continue}if(e){let t=`Infinite loop on byte: `+e.charCodeAt(0);if(this.options.silent){console.error(t);break}else throw Error(t)}}return t}},ir=class{options;parser;constructor(e){this.options=e||Rt}space(e){return``}code({text:e,lang:t,escaped:n}){let r=(t||``).match(Ht.notSpaceStart)?.[0],i=e.replace(Ht.endingNewline,``)+`
`;return r?`<pre><code class="language-`+Yn(r)+`">`+(n?i:Yn(i,!0))+`</code></pre>
`:`<pre><code>`+(n?i:Yn(i,!0))+`</code></pre>
`}blockquote({tokens:e}){return`<blockquote>
${this.parser.parse(e)}</blockquote>
`}html({text:e}){return e}def(e){return``}heading({tokens:e,depth:t}){return`<h${t}>${this.parser.parseInline(e)}</h${t}>
`}hr(e){return`<hr>
`}list(e){let t=e.ordered,n=e.start,r=``;for(let t=0;t<e.items.length;t++){let n=e.items[t];r+=this.listitem(n)}let i=t?`ol`:`ul`,a=t&&n!==1?` start="`+n+`"`:``;return`<`+i+a+`>
`+r+`</`+i+`>
`}listitem(e){return`<li>${this.parser.parse(e.tokens)}</li>
`}checkbox({checked:e}){return`<input `+(e?`checked="" `:``)+`disabled="" type="checkbox"> `}paragraph({tokens:e}){return`<p>${this.parser.parseInline(e)}</p>
`}table(e){let t=``,n=``;for(let t=0;t<e.header.length;t++)n+=this.tablecell(e.header[t]);t+=this.tablerow({text:n});let r=``;for(let t=0;t<e.rows.length;t++){let i=e.rows[t];n=``;for(let e=0;e<i.length;e++)n+=this.tablecell(i[e]);r+=this.tablerow({text:n})}return r&&=`<tbody>${r}</tbody>`,`<table>
<thead>
`+t+`</thead>
`+r+`</table>
`}tablerow({text:e}){return`<tr>
${e}</tr>
`}tablecell(e){let t=this.parser.parseInline(e.tokens),n=e.header?`th`:`td`;return(e.align?`<${n} align="${e.align}">`:`<${n}>`)+t+`</${n}>
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${Yn(e,!0)}</code>`}br(e){return`<br>`}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:n}){let r=this.parser.parseInline(n),i=Xn(e);if(i===null)return r;e=i;let a=`<a href="`+e+`"`;return t&&(a+=` title="`+Yn(t)+`"`),a+=`>`+r+`</a>`,a}image({href:e,title:t,text:n,tokens:r}){r&&(n=this.parser.parseInline(r,this.parser.textRenderer));let i=Xn(e);if(i===null)return Yn(n);e=i;let a=`<img src="${e}" alt="${n}"`;return t&&(a+=` title="${Yn(t)}"`),a+=`>`,a}text(e){return`tokens`in e&&e.tokens?this.parser.parseInline(e.tokens):`escaped`in e&&e.escaped?e.text:Yn(e.text)}},ar=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return``+e}image({text:e}){return``+e}br(){return``}checkbox({raw:e}){return e}},or=class e{options;renderer;textRenderer;constructor(e){this.options=e||Rt,this.options.renderer=this.options.renderer||new ir,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new ar}static parse(t,n){return new e(n).parse(t)}static parseInline(t,n){return new e(n).parseInline(t)}parse(e){let t=``;for(let n=0;n<e.length;n++){let r=e[n];if(this.options.extensions?.renderers?.[r.type]){let e=r,n=this.options.extensions.renderers[e.type].call({parser:this},e);if(n!==!1||![`space`,`hr`,`heading`,`code`,`table`,`blockquote`,`list`,`html`,`def`,`paragraph`,`text`].includes(e.type)){t+=n||``;continue}}let i=r;switch(i.type){case`space`:t+=this.renderer.space(i);break;case`hr`:t+=this.renderer.hr(i);break;case`heading`:t+=this.renderer.heading(i);break;case`code`:t+=this.renderer.code(i);break;case`table`:t+=this.renderer.table(i);break;case`blockquote`:t+=this.renderer.blockquote(i);break;case`list`:t+=this.renderer.list(i);break;case`checkbox`:t+=this.renderer.checkbox(i);break;case`html`:t+=this.renderer.html(i);break;case`def`:t+=this.renderer.def(i);break;case`paragraph`:t+=this.renderer.paragraph(i);break;case`text`:t+=this.renderer.text(i);break;default:{let e=`Token with "`+i.type+`" type was not found.`;if(this.options.silent)return console.error(e),``;throw Error(e)}}}return t}parseInline(e,t=this.renderer){let n=``;for(let r=0;r<e.length;r++){let i=e[r];if(this.options.extensions?.renderers?.[i.type]){let e=this.options.extensions.renderers[i.type].call({parser:this},i);if(e!==!1||![`escape`,`html`,`link`,`image`,`strong`,`em`,`codespan`,`br`,`del`,`text`].includes(i.type)){n+=e||``;continue}}let a=i;switch(a.type){case`escape`:n+=t.text(a);break;case`html`:n+=t.html(a);break;case`link`:n+=t.link(a);break;case`image`:n+=t.image(a);break;case`checkbox`:n+=t.checkbox(a);break;case`strong`:n+=t.strong(a);break;case`em`:n+=t.em(a);break;case`codespan`:n+=t.codespan(a);break;case`br`:n+=t.br(a);break;case`del`:n+=t.del(a);break;case`text`:n+=t.text(a);break;default:{let e=`Token with "`+a.type+`" type was not found.`;if(this.options.silent)return console.error(e),``;throw Error(e)}}}return n}},sr=class{options;block;constructor(e){this.options=e||Rt}static passThroughHooks=new Set([`preprocess`,`postprocess`,`processAllTokens`,`emStrongMask`]);static passThroughHooksRespectAsync=new Set([`preprocess`,`postprocess`,`processAllTokens`]);preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}emStrongMask(e){return e}provideLexer(){return this.block?rr.lex:rr.lexInline}provideParser(){return this.block?or.parse:or.parseInline}},cr=new class{defaults=Lt();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=or;Renderer=ir;TextRenderer=ar;Lexer=rr;Tokenizer=nr;Hooks=sr;constructor(...e){this.use(...e)}walkTokens(e,t){let n=[];for(let r of e)switch(n=n.concat(t.call(this,r)),r.type){case`table`:{let e=r;for(let r of e.header)n=n.concat(this.walkTokens(r.tokens,t));for(let r of e.rows)for(let e of r)n=n.concat(this.walkTokens(e.tokens,t));break}case`list`:{let e=r;n=n.concat(this.walkTokens(e.items,t));break}default:{let e=r;this.defaults.extensions?.childTokens?.[e.type]?this.defaults.extensions.childTokens[e.type].forEach(r=>{let i=e[r].flat(1/0);n=n.concat(this.walkTokens(i,t))}):e.tokens&&(n=n.concat(this.walkTokens(e.tokens,t)))}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(e=>{let n={...e};if(n.async=this.defaults.async||n.async||!1,e.extensions&&(e.extensions.forEach(e=>{if(!e.name)throw Error(`extension name required`);if(`renderer`in e){let n=t.renderers[e.name];n?t.renderers[e.name]=function(...t){let r=e.renderer.apply(this,t);return r===!1&&(r=n.apply(this,t)),r}:t.renderers[e.name]=e.renderer}if(`tokenizer`in e){if(!e.level||e.level!==`block`&&e.level!==`inline`)throw Error(`extension level must be 'block' or 'inline'`);let n=t[e.level];n?n.unshift(e.tokenizer):t[e.level]=[e.tokenizer],e.start&&(e.level===`block`?t.startBlock?t.startBlock.push(e.start):t.startBlock=[e.start]:e.level===`inline`&&(t.startInline?t.startInline.push(e.start):t.startInline=[e.start]))}`childTokens`in e&&e.childTokens&&(t.childTokens[e.name]=e.childTokens)}),n.extensions=t),e.renderer){let t=this.defaults.renderer||new ir(this.defaults);for(let n in e.renderer){if(!(n in t))throw Error(`renderer '${n}' does not exist`);if([`options`,`parser`].includes(n))continue;let r=n,i=e.renderer[r],a=t[r];t[r]=(...e)=>{let n=i.apply(t,e);return n===!1&&(n=a.apply(t,e)),n||``}}n.renderer=t}if(e.tokenizer){let t=this.defaults.tokenizer||new nr(this.defaults);for(let n in e.tokenizer){if(!(n in t))throw Error(`tokenizer '${n}' does not exist`);if([`options`,`rules`,`lexer`].includes(n))continue;let r=n,i=e.tokenizer[r],a=t[r];t[r]=(...e)=>{let n=i.apply(t,e);return n===!1&&(n=a.apply(t,e)),n}}n.tokenizer=t}if(e.hooks){let t=this.defaults.hooks||new sr;for(let n in e.hooks){if(!(n in t))throw Error(`hook '${n}' does not exist`);if([`options`,`block`].includes(n))continue;let r=n,i=e.hooks[r],a=t[r];sr.passThroughHooks.has(n)?t[r]=e=>{if(this.defaults.async&&sr.passThroughHooksRespectAsync.has(n))return(async()=>{let n=await i.call(t,e);return a.call(t,n)})();let r=i.call(t,e);return a.call(t,r)}:t[r]=(...e)=>{if(this.defaults.async)return(async()=>{let n=await i.apply(t,e);return n===!1&&(n=await a.apply(t,e)),n})();let n=i.apply(t,e);return n===!1&&(n=a.apply(t,e)),n}}n.hooks=t}if(e.walkTokens){let t=this.defaults.walkTokens,r=e.walkTokens;n.walkTokens=function(e){let n=[];return n.push(r.call(this,e)),t&&(n=n.concat(t.call(this,e))),n}}this.defaults={...this.defaults,...n}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return rr.lex(e,t??this.defaults)}parser(e,t){return or.parse(e,t??this.defaults)}parseMarkdown(e){return(t,n)=>{let r={...n},i={...this.defaults,...r},a=this.onError(!!i.silent,!!i.async);if(this.defaults.async===!0&&r.async===!1)return a(Error(`marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise.`));if(typeof t>`u`||t===null)return a(Error(`marked(): input parameter is undefined or null`));if(typeof t!=`string`)return a(Error(`marked(): input parameter is of type `+Object.prototype.toString.call(t)+`, string expected`));if(i.hooks&&(i.hooks.options=i,i.hooks.block=e),i.async)return(async()=>{let n=i.hooks?await i.hooks.preprocess(t):t,r=await(i.hooks?await i.hooks.provideLexer():e?rr.lex:rr.lexInline)(n,i),a=i.hooks?await i.hooks.processAllTokens(r):r;i.walkTokens&&await Promise.all(this.walkTokens(a,i.walkTokens));let o=await(i.hooks?await i.hooks.provideParser():e?or.parse:or.parseInline)(a,i);return i.hooks?await i.hooks.postprocess(o):o})().catch(a);try{i.hooks&&(t=i.hooks.preprocess(t));let n=(i.hooks?i.hooks.provideLexer():e?rr.lex:rr.lexInline)(t,i);i.hooks&&(n=i.hooks.processAllTokens(n)),i.walkTokens&&this.walkTokens(n,i.walkTokens);let r=(i.hooks?i.hooks.provideParser():e?or.parse:or.parseInline)(n,i);return i.hooks&&(r=i.hooks.postprocess(r)),r}catch(e){return a(e)}}}onError(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let e=`<p>An error occurred:</p><pre>`+Yn(n.message+``,!0)+`</pre>`;return t?Promise.resolve(e):e}if(t)return Promise.reject(n);throw n}}};function E(e,t){return cr.parse(e,t)}E.options=E.setOptions=function(e){return cr.setOptions(e),E.defaults=cr.defaults,zt(E.defaults),E},E.getDefaults=Lt,E.defaults=Rt,E.use=function(...e){return cr.use(...e),E.defaults=cr.defaults,zt(E.defaults),E},E.walkTokens=function(e,t){return cr.walkTokens(e,t)},E.parseInline=cr.parseInline,E.Parser=or,E.parser=or.parse,E.Renderer=ir,E.TextRenderer=ar,E.Lexer=rr,E.lexer=rr.lex,E.Tokenizer=nr,E.Hooks=sr,E.parse=E,E.options,E.setOptions,E.use,E.walkTokens,E.parseInline,or.parse,rr.lex;var D=class e extends Error{constructor(t,n){var r=`KaTeX parse error: `+t,i,a,o=n&&n.loc;if(o&&o.start<=o.end){var s=o.lexer.input;i=o.start,a=o.end,i===s.length?r+=` at end of input: `:r+=` at position `+(i+1)+`: `;var c=s.slice(i,a).replace(/[^]/g,`$&̲`),l=i>15?`…`+s.slice(i-15,i):s.slice(0,i),u=a+15<s.length?s.slice(a,a+15)+`…`:s.slice(a);r+=l+c+u}super(r),this.name=`ParseError`,this.position=void 0,this.length=void 0,this.rawMessage=void 0,Object.setPrototypeOf(this,e.prototype),this.position=i,i!=null&&a!=null&&(this.length=a-i),this.rawMessage=t}},lr=/([A-Z])/g,ur=e=>e.replace(lr,`-$1`).toLowerCase(),dr={"&":`&amp;`,">":`&gt;`,"<":`&lt;`,'"':`&quot;`,"'":`&#x27;`},fr=/[&><"']/g,pr=e=>String(e).replace(fr,e=>dr[e]),mr=e=>e.type===`ordgroup`||e.type===`color`?e.body.length===1?mr(e.body[0]):e:e.type===`font`?mr(e.body):e,hr=new Set([`mathord`,`textord`,`atom`]),gr=e=>hr.has(mr(e).type),_r=e=>{var t=/^[\x00-\x20]*([^\\/#?]*?)(:|&#0*58|&#x0*3a|&colon)/i.exec(e);return t?t[2]!==`:`||!/^[a-zA-Z][a-zA-Z0-9+\-.]*$/.test(t[1])?null:t[1].toLowerCase():`_relative`},vr={displayMode:{type:`boolean`,description:`Render math in display mode, which puts the math in display style (so \\int and \\sum are large, for example), and centers the math on the page on its own line.`,cli:`-d, --display-mode`},output:{type:{enum:[`htmlAndMathml`,`html`,`mathml`]},description:`Determines the markup language of the output.`,cli:`-F, --format <type>`},leqno:{type:`boolean`,description:`Render display math in leqno style (left-justified tags).`},fleqn:{type:`boolean`,description:`Render display math flush left.`},throwOnError:{type:`boolean`,default:!0,cli:`-t, --no-throw-on-error`,cliDescription:`Render errors (in the color given by --error-color) instead of throwing a ParseError exception when encountering an error.`},errorColor:{type:`string`,default:`#cc0000`,cli:`-c, --error-color <color>`,cliDescription:`A color string given in the format 'rgb' or 'rrggbb' (no #). This option determines the color of errors rendered by the -t option.`,cliProcessor:e=>`#`+e},macros:{type:`object`,cli:`-m, --macro <def>`,cliDescription:`Define custom macro of the form '\\foo:expansion' (use multiple -m arguments for multiple macros).`,cliDefault:[],cliProcessor:(e,t)=>(t.push(e),t)},minRuleThickness:{type:`number`,description:"Specifies a minimum thickness, in ems, for fraction lines, `\\sqrt` top lines, `{array}` vertical lines, `\\hline`, `\\hdashline`, `\\underline`, `\\overline`, and the borders of `\\fbox`, `\\boxed`, and `\\fcolorbox`.",processor:e=>Math.max(0,e),cli:`--min-rule-thickness <size>`,cliProcessor:parseFloat},colorIsTextColor:{type:`boolean`,description:`Makes \\color behave like LaTeX's 2-argument \\textcolor, instead of LaTeX's one-argument \\color mode change.`,cli:`-b, --color-is-text-color`},strict:{type:[{enum:[`warn`,`ignore`,`error`]},`boolean`,`function`],description:`Turn on strict / LaTeX faithfulness mode, which throws an error if the input uses features that are not supported by LaTeX.`,cli:`-S, --strict`,cliDefault:!1},trust:{type:[`boolean`,`function`],description:`Trust the input, enabling all HTML features such as \\url.`,cli:`-T, --trust`},maxSize:{type:`number`,default:1/0,description:`If non-zero, all user-specified sizes, e.g. in \\rule{500em}{500em}, will be capped to maxSize ems. Otherwise, elements and spaces can be arbitrarily large`,processor:e=>Math.max(0,e),cli:`-s, --max-size <n>`,cliProcessor:parseInt},maxExpand:{type:`number`,default:1e3,description:`Limit the number of macro expansions to the specified number, to prevent e.g. infinite macro loops. If set to Infinity, the macro expander will try to fully expand as in LaTeX.`,processor:e=>Math.max(0,e),cli:`-e, --max-expand <n>`,cliProcessor:e=>e===`Infinity`?1/0:parseInt(e)},globalGroup:{type:`boolean`,cli:!1}};function yr(e){if(typeof e!=`string`)return e.enum[0];switch(e){case`boolean`:return!1;case`string`:return``;case`number`:return 0;case`object`:return{};default:throw Error(`Unexpected schema type; settings must declare an explicit default.`)}}function br(e){if(e.default!==void 0)return e.default;var t=Array.isArray(e.type)?e.type[0]:e.type;return yr(t)}function xr(e,t,n,r){var i=n[t];e[t]=i===void 0?br(r):r.processor?r.processor(i):i}var Sr=class{constructor(e){e===void 0&&(e={}),this.displayMode=void 0,this.output=void 0,this.leqno=void 0,this.fleqn=void 0,this.throwOnError=void 0,this.errorColor=void 0,this.macros=void 0,this.minRuleThickness=void 0,this.colorIsTextColor=void 0,this.strict=void 0,this.trust=void 0,this.maxSize=void 0,this.maxExpand=void 0,this.globalGroup=void 0,e||={};for(var t of Object.keys(vr)){var n=vr[t];n&&xr(this,t,e,n)}}reportNonstrict(e,t,n){var r=this.strict;if(typeof r==`function`&&(r=r(e,t,n)),!(!r||r===`ignore`)){if(r===!0||r===`error`)throw new D(`LaTeX-incompatible input and strict mode is set to 'error': `+(t+` [`+e+`]`),n);r===`warn`?typeof console<`u`&&console.warn(`LaTeX-incompatible input and strict mode is set to 'warn': `+(t+` [`+e+`]`)):typeof console<`u`&&console.warn(`LaTeX-incompatible input and strict mode is set to `+(`unrecognized '`+r+`': `+t+` [`+e+`]`))}}useStrictBehavior(e,t,n){var r=this.strict;if(typeof r==`function`)try{r=r(e,t,n)}catch{r=`error`}return!r||r===`ignore`?!1:r===!0||r===`error`?!0:r===`warn`?(typeof console<`u`&&console.warn(`LaTeX-incompatible input and strict mode is set to 'warn': `+(t+` [`+e+`]`)),!1):(typeof console<`u`&&console.warn(`LaTeX-incompatible input and strict mode is set to `+(`unrecognized '`+r+`': `+t+` [`+e+`]`)),!1)}isTrusted(e){if(`url`in e&&e.url&&!e.protocol){var t=_r(e.url);if(t==null)return!1;e.protocol=t}return!!(typeof this.trust==`function`?this.trust(e):this.trust)}},Cr=class{constructor(e,t,n){this.id=void 0,this.size=void 0,this.cramped=void 0,this.id=e,this.size=t,this.cramped=n}sup(){return Mr[Nr[this.id]]}sub(){return Mr[Pr[this.id]]}fracNum(){return Mr[Fr[this.id]]}fracDen(){return Mr[Ir[this.id]]}cramp(){return Mr[Lr[this.id]]}text(){return Mr[Rr[this.id]]}isTight(){return this.size>=2}},wr=0,Tr=1,Er=2,Dr=3,Or=4,kr=5,Ar=6,jr=7,Mr=[new Cr(wr,0,!1),new Cr(Tr,0,!0),new Cr(Er,1,!1),new Cr(Dr,1,!0),new Cr(Or,2,!1),new Cr(kr,2,!0),new Cr(Ar,3,!1),new Cr(jr,3,!0)],Nr=[Or,kr,Or,kr,Ar,jr,Ar,jr],Pr=[kr,kr,kr,kr,jr,jr,jr,jr],Fr=[Er,Dr,Or,kr,Ar,jr,Ar,jr],Ir=[Dr,Dr,kr,kr,jr,jr,jr,jr],Lr=[Tr,Tr,Dr,Dr,kr,kr,jr,jr],Rr=[wr,Tr,Er,Dr,Er,Dr,Er,Dr],O={DISPLAY:Mr[wr],TEXT:Mr[Er],SCRIPT:Mr[Or],SCRIPTSCRIPT:Mr[Ar]},zr=[{name:`latin`,blocks:[[256,591],[768,879]]},{name:`cyrillic`,blocks:[[1024,1279]]},{name:`armenian`,blocks:[[1328,1423]]},{name:`brahmic`,blocks:[[2304,4255]]},{name:`georgian`,blocks:[[4256,4351]]},{name:`cjk`,blocks:[[12288,12543],[19968,40879],[65280,65376]]},{name:`hangul`,blocks:[[44032,55215]]}];function Br(e){for(var t=0;t<zr.length;t++)for(var n=zr[t],r=0;r<n.blocks.length;r++){var i=n.blocks[r];if(e>=i[0]&&e<=i[1])return n.name}return null}var Vr=[];zr.forEach(e=>e.blocks.forEach(e=>Vr.push(...e)));function Hr(e){for(var t=0;t<Vr.length;t+=2)if(e>=Vr[t]&&e<=Vr[t+1])return!0;return!1}var Ur=e=>e+` `+e,Wr=80,Gr=function(e,t){return`M95,`+(622+e+t)+`
c-2.7,0,-7.17,-2.7,-13.5,-8c-5.8,-5.3,-9.5,-10,-9.5,-14
c0,-2,0.3,-3.3,1,-4c1.3,-2.7,23.83,-20.7,67.5,-54
c44.2,-33.3,65.8,-50.3,66.5,-51c1.3,-1.3,3,-2,5,-2c4.7,0,8.7,3.3,12,10
s173,378,173,378c0.7,0,35.3,-71,104,-213c68.7,-142,137.5,-285,206.5,-429
c69,-144,104.5,-217.7,106.5,-221
l`+e/2.075+` -`+e+`
c5.3,-9.3,12,-14,20,-14
H400000v`+(40+e)+`H845.2724
s-225.272,467,-225.272,467s-235,486,-235,486c-2.7,4.7,-9,7,-19,7
c-6,0,-10,-1,-12,-3s-194,-422,-194,-422s-65,47,-65,47z
M`+(834+e)+` `+t+`h400000v`+(40+e)+`h-400000z`},Kr=function(e,t){return`M263,`+(601+e+t)+`c0.7,0,18,39.7,52,119
c34,79.3,68.167,158.7,102.5,238c34.3,79.3,51.8,119.3,52.5,120
c340,-704.7,510.7,-1060.3,512,-1067
l`+e/2.084+` -`+e+`
c4.7,-7.3,11,-11,19,-11
H40000v`+(40+e)+`H1012.3
s-271.3,567,-271.3,567c-38.7,80.7,-84,175,-136,283c-52,108,-89.167,185.3,-111.5,232
c-22.3,46.7,-33.8,70.3,-34.5,71c-4.7,4.7,-12.3,7,-23,7s-12,-1,-12,-1
s-109,-253,-109,-253c-72.7,-168,-109.3,-252,-110,-252c-10.7,8,-22,16.7,-34,26
c-22,17.3,-33.3,26,-34,26s-26,-26,-26,-26s76,-59,76,-59s76,-60,76,-60z
M`+(1001+e)+` `+t+`h400000v`+(40+e)+`h-400000z`},qr=function(e,t){return`M983 `+(10+e+t)+`
l`+e/3.13+` -`+e+`
c4,-6.7,10,-10,18,-10 H400000v`+(40+e)+`
H1013.1s-83.4,268,-264.1,840c-180.7,572,-277,876.3,-289,913c-4.7,4.7,-12.7,7,-24,7
s-12,0,-12,0c-1.3,-3.3,-3.7,-11.7,-7,-25c-35.3,-125.3,-106.7,-373.3,-214,-744
c-10,12,-21,25,-33,39s-32,39,-32,39c-6,-5.3,-15,-14,-27,-26s25,-30,25,-30
c26.7,-32.7,52,-63,76,-91s52,-60,52,-60s208,722,208,722
c56,-175.3,126.3,-397.3,211,-666c84.7,-268.7,153.8,-488.2,207.5,-658.5
c53.7,-170.3,84.5,-266.8,92.5,-289.5z
M`+(1001+e)+` `+t+`h400000v`+(40+e)+`h-400000z`},Jr=function(e,t){return`M424,`+(2398+e+t)+`
c-1.3,-0.7,-38.5,-172,-111.5,-514c-73,-342,-109.8,-513.3,-110.5,-514
c0,-2,-10.7,14.3,-32,49c-4.7,7.3,-9.8,15.7,-15.5,25c-5.7,9.3,-9.8,16,-12.5,20
s-5,7,-5,7c-4,-3.3,-8.3,-7.7,-13,-13s-13,-13,-13,-13s76,-122,76,-122s77,-121,77,-121
s209,968,209,968c0,-2,84.7,-361.7,254,-1079c169.3,-717.3,254.7,-1077.7,256,-1081
l`+e/4.223+` -`+e+`c4,-6.7,10,-10,18,-10 H400000
v`+(40+e)+`H1014.6
s-87.3,378.7,-272.6,1166c-185.3,787.3,-279.3,1182.3,-282,1185
c-2,6,-10,9,-24,9
c-8,0,-12,-0.7,-12,-2z M`+(1001+e)+` `+t+`
h400000v`+(40+e)+`h-400000z`},Yr=function(e,t){return`M473,`+(2713+e+t)+`
c339.3,-1799.3,509.3,-2700,510,-2702 l`+e/5.298+` -`+e+`
c3.3,-7.3,9.3,-11,18,-11 H400000v`+(40+e)+`H1017.7
s-90.5,478,-276.2,1466c-185.7,988,-279.5,1483,-281.5,1485c-2,6,-10,9,-24,9
c-8,0,-12,-0.7,-12,-2c0,-1.3,-5.3,-32,-16,-92c-50.7,-293.3,-119.7,-693.3,-207,-1200
c0,-1.3,-5.3,8.7,-16,30c-10.7,21.3,-21.3,42.7,-32,64s-16,33,-16,33s-26,-26,-26,-26
s76,-153,76,-153s77,-151,77,-151c0.7,0.7,35.7,202,105,604c67.3,400.7,102,602.7,104,
606zM`+(1001+e)+` `+t+`h400000v`+(40+e)+`H1017.7z`},Xr=function(e){var t=e/2;return`M400000 `+e+` H0 L`+t+` 0 l65 45 L145 `+(e-80)+` H400000z`},Zr=function(e,t,n){var r=n-54-t-e;return`M702 `+(e+t)+`H400000`+(40+e)+`
H742v`+r+`l-4 4-4 4c-.667.7 -2 1.5-4 2.5s-4.167 1.833-6.5 2.5-5.5 1-9.5 1
h-12l-28-84c-16.667-52-96.667 -294.333-240-727l-212 -643 -85 170
c-4-3.333-8.333-7.667-13 -13l-13-13l77-155 77-156c66 199.333 139 419.667
219 661 l218 661zM702 `+t+`H400000v`+(40+e)+`H742z`},Qr=function(e,t,n){t=1e3*t;var r=``;switch(e){case`sqrtMain`:r=Gr(t,Wr);break;case`sqrtSize1`:r=Kr(t,Wr);break;case`sqrtSize2`:r=qr(t,Wr);break;case`sqrtSize3`:r=Jr(t,Wr);break;case`sqrtSize4`:r=Yr(t,Wr);break;case`sqrtTall`:r=Zr(t,Wr,n)}return r},$r=function(e,t){switch(e){case`⎜`:return Ur(`M291 0 H417 V`+t+` H291z`);case`∣`:return Ur(`M145 0 H188 V`+t+` H145z`);case`∥`:return Ur(`M145 0 H188 V`+t+` H145z`)+Ur(`M367 0 H410 V`+t+` H367z`);case`⎟`:return Ur(`M457 0 H583 V`+t+` H457z`);case`⎢`:return Ur(`M319 0 H403 V`+t+` H319z`);case`⎥`:return Ur(`M263 0 H347 V`+t+` H263z`);case`⎪`:return Ur(`M384 0 H504 V`+t+` H384z`);case`⏐`:return Ur(`M312 0 H355 V`+t+` H312z`);case`‖`:return Ur(`M257 0 H300 V`+t+` H257z`)+Ur(`M478 0 H521 V`+t+` H478z`);default:return``}},ei={doubleleftarrow:`M262 157
l10-10c34-36 62.7-77 86-123 3.3-8 5-13.3 5-16 0-5.3-6.7-8-20-8-7.3
 0-12.2.5-14.5 1.5-2.3 1-4.8 4.5-7.5 10.5-49.3 97.3-121.7 169.3-217 216-28
 14-57.3 25-88 33-6.7 2-11 3.8-13 5.5-2 1.7-3 4.2-3 7.5s1 5.8 3 7.5
c2 1.7 6.3 3.5 13 5.5 68 17.3 128.2 47.8 180.5 91.5 52.3 43.7 93.8 96.2 124.5
 157.5 9.3 8 15.3 12.3 18 13h6c12-.7 18-4 18-10 0-2-1.7-7-5-15-23.3-46-52-87
-86-123l-10-10h399738v-40H218c328 0 0 0 0 0l-10-8c-26.7-20-65.7-43-117-69 2.7
-2 6-3.7 10-5 36.7-16 72.3-37.3 107-64l10-8h399782v-40z
m8 0v40h399730v-40zm0 194v40h399730v-40z`,doublerightarrow:`M399738 392l
-10 10c-34 36-62.7 77-86 123-3.3 8-5 13.3-5 16 0 5.3 6.7 8 20 8 7.3 0 12.2-.5
 14.5-1.5 2.3-1 4.8-4.5 7.5-10.5 49.3-97.3 121.7-169.3 217-216 28-14 57.3-25 88
-33 6.7-2 11-3.8 13-5.5 2-1.7 3-4.2 3-7.5s-1-5.8-3-7.5c-2-1.7-6.3-3.5-13-5.5-68
-17.3-128.2-47.8-180.5-91.5-52.3-43.7-93.8-96.2-124.5-157.5-9.3-8-15.3-12.3-18
-13h-6c-12 .7-18 4-18 10 0 2 1.7 7 5 15 23.3 46 52 87 86 123l10 10H0v40h399782
c-328 0 0 0 0 0l10 8c26.7 20 65.7 43 117 69-2.7 2-6 3.7-10 5-36.7 16-72.3 37.3
-107 64l-10 8H0v40zM0 157v40h399730v-40zm0 194v40h399730v-40z`,leftarrow:`M400000 241H110l3-3c68.7-52.7 113.7-120
 135-202 4-14.7 6-23 6-25 0-7.3-7-11-21-11-8 0-13.2.8-15.5 2.5-2.3 1.7-4.2 5.8
-5.5 12.5-1.3 4.7-2.7 10.3-4 17-12 48.7-34.8 92-68.5 130S65.3 228.3 18 247
c-10 4-16 7.7-18 11 0 8.7 6 14.3 18 17 47.3 18.7 87.8 47 121.5 85S196 441.3 208
 490c.7 2 1.3 5 2 9s1.2 6.7 1.5 8c.3 1.3 1 3.3 2 6s2.2 4.5 3.5 5.5c1.3 1 3.3
 1.8 6 2.5s6 1 10 1c14 0 21-3.7 21-11 0-2-2-10.3-6-25-20-79.3-65-146.7-135-202
 l-3-3h399890zM100 241v40h399900v-40z`,leftbrace:`M6 548l-6-6v-35l6-11c56-104 135.3-181.3 238-232 57.3-28.7 117
-45 179-50h399577v120H403c-43.3 7-81 15-113 26-100.7 33-179.7 91-237 174-2.7
 5-6 9-10 13-.7 1-7.3 1-20 1H6z`,leftbraceunder:`M0 6l6-6h17c12.688 0 19.313.3 20 1 4 4 7.313 8.3 10 13
 35.313 51.3 80.813 93.8 136.5 127.5 55.688 33.7 117.188 55.8 184.5 66.5.688
 0 2 .3 4 1 18.688 2.7 76 4.3 172 5h399450v120H429l-6-1c-124.688-8-235-61.7
-331-161C60.687 138.7 32.312 99.3 7 54L0 41V6z`,leftgroup:`M400000 80
H435C64 80 168.3 229.4 21 260c-5.9 1.2-18 0-18 0-2 0-3-1-3-3v-38C76 61 257 0
 435 0h399565z`,leftgroupunder:`M400000 262
H435C64 262 168.3 112.6 21 82c-5.9-1.2-18 0-18 0-2 0-3 1-3 3v38c76 158 257 219
 435 219h399565z`,leftharpoon:`M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3
-3.3 10.2-9.5 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5
-18.3 3-21-1.3-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7
-196 228-6.7 4.7-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40z`,leftharpoonplus:`M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3-3.3 10.2-9.5
 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5-18.3 3-21-1.3
-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7-196 228-6.7 4.7
-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40zM0 435v40h400000v-40z
m0 0v40h400000v-40z`,leftharpoondown:`M7 241c-4 4-6.333 8.667-7 14 0 5.333.667 9 2 11s5.333
 5.333 12 10c90.667 54 156 130 196 228 3.333 10.667 6.333 16.333 9 17 2 .667 5
 1 9 1h5c10.667 0 16.667-2 18-6 2-2.667 1-9.667-3-21-32-87.333-82.667-157.667
-152-211l-3-3h399907v-40zM93 281 H400000 v-40L7 241z`,leftharpoondownplus:`M7 435c-4 4-6.3 8.7-7 14 0 5.3.7 9 2 11s5.3 5.3 12
 10c90.7 54 156 130 196 228 3.3 10.7 6.3 16.3 9 17 2 .7 5 1 9 1h5c10.7 0 16.7
-2 18-6 2-2.7 1-9.7-3-21-32-87.3-82.7-157.7-152-211l-3-3h399907v-40H7zm93 0
v40h399900v-40zM0 241v40h399900v-40zm0 0v40h399900v-40z`,lefthook:`M400000 281 H103s-33-11.2-61-33.5S0 197.3 0 164s14.2-61.2 42.5
-83.5C70.8 58.2 104 47 142 47 c16.7 0 25 6.7 25 20 0 12-8.7 18.7-26 20-40 3.3
-68.7 15.7-86 37-10 12-15 25.3-15 40 0 22.7 9.8 40.7 29.5 54 19.7 13.3 43.5 21
 71.5 23h399859zM103 281v-40h399897v40z`,leftlinesegment:Ur(`M40 281 V428 H0 V94 H40 V241 H400000 v40z`),leftbracketunder:Ur(`M0 0 h120 V290 H399995 v120 H0z`),leftbracketover:Ur(`M0 440 h120 V150 H399995 v-120 H0z`),leftmapsto:Ur(`M40 281 V448H0V74H40V241H400000v40z`),leftToFrom:`M0 147h400000v40H0zm0 214c68 40 115.7 95.7 143 167h22c15.3 0 23
-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69-70-101l-7-8h399905v-40H95l7-8
c28.7-32 52-65.7 70-101 10.7-23.3 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 265.3
 68 321 0 361zm0-174v-40h399900v40zm100 154v40h399900v-40z`,longequal:Ur(`M0 50 h400000 v40H0z m0 194h40000v40H0z`),midbrace:`M200428 334
c-100.7-8.3-195.3-44-280-108-55.3-42-101.7-93-139-153l-9-14c-2.7 4-5.7 8.7-9 14
-53.3 86.7-123.7 153-211 199-66.7 36-137.3 56.3-212 62H0V214h199568c178.3-11.7
 311.7-78.3 403-201 6-8 9.7-12 11-12 .7-.7 6.7-1 18-1s17.3.3 18 1c1.3 0 5 4 11
 12 44.7 59.3 101.3 106.3 170 141s145.3 54.3 229 60h199572v120z`,midbraceunder:`M199572 214
c100.7 8.3 195.3 44 280 108 55.3 42 101.7 93 139 153l9 14c2.7-4 5.7-8.7 9-14
 53.3-86.7 123.7-153 211-199 66.7-36 137.3-56.3 212-62h199568v120H200432c-178.3
 11.7-311.7 78.3-403 201-6 8-9.7 12-11 12-.7.7-6.7 1-18 1s-17.3-.3-18-1c-1.3 0
-5-4-11-12-44.7-59.3-101.3-106.3-170-141s-145.3-54.3-229-60H0V214z`,oiintSize1:`M512.6 71.6c272.6 0 320.3 106.8 320.3 178.2 0 70.8-47.7 177.6
-320.3 177.6S193.1 320.6 193.1 249.8c0-71.4 46.9-178.2 319.5-178.2z
m368.1 178.2c0-86.4-60.9-215.4-368.1-215.4-306.4 0-367.3 129-367.3 215.4 0 85.8
60.9 214.8 367.3 214.8 307.2 0 368.1-129 368.1-214.8z`,oiintSize2:`M757.8 100.1c384.7 0 451.1 137.6 451.1 230 0 91.3-66.4 228.8
-451.1 228.8-386.3 0-452.7-137.5-452.7-228.8 0-92.4 66.4-230 452.7-230z
m502.4 230c0-111.2-82.4-277.2-502.4-277.2s-504 166-504 277.2
c0 110 84 276 504 276s502.4-166 502.4-276z`,oiiintSize1:`M681.4 71.6c408.9 0 480.5 106.8 480.5 178.2 0 70.8-71.6 177.6
-480.5 177.6S202.1 320.6 202.1 249.8c0-71.4 70.5-178.2 479.3-178.2z
m525.8 178.2c0-86.4-86.8-215.4-525.7-215.4-437.9 0-524.7 129-524.7 215.4 0
85.8 86.8 214.8 524.7 214.8 438.9 0 525.7-129 525.7-214.8z`,oiiintSize2:`M1021.2 53c603.6 0 707.8 165.8 707.8 277.2 0 110-104.2 275.8
-707.8 275.8-606 0-710.2-165.8-710.2-275.8C311 218.8 415.2 53 1021.2 53z
m770.4 277.1c0-131.2-126.4-327.6-770.5-327.6S248.4 198.9 248.4 330.1
c0 130 128.8 326.4 772.7 326.4s770.5-196.4 770.5-326.4z`,rightarrow:`M0 241v40h399891c-47.3 35.3-84 78-110 128
-16.7 32-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20
 11 8 0 13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7
 39-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85
-40.5-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5
-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67
 151.7 139 205zm0 0v40h399900v-40z`,rightbrace:`M400000 542l
-6 6h-17c-12.7 0-19.3-.3-20-1-4-4-7.3-8.3-10-13-35.3-51.3-80.8-93.8-136.5-127.5
s-117.2-55.8-184.5-66.5c-.7 0-2-.3-4-1-18.7-2.7-76-4.3-172-5H0V214h399571l6 1
c124.7 8 235 61.7 331 161 31.3 33.3 59.7 72.7 85 118l7 13v35z`,rightbraceunder:`M399994 0l6 6v35l-6 11c-56 104-135.3 181.3-238 232-57.3
 28.7-117 45-179 50H-300V214h399897c43.3-7 81-15 113-26 100.7-33 179.7-91 237
-174 2.7-5 6-9 10-13 .7-1 7.3-1 20-1h17z`,rightgroup:`M0 80h399565c371 0 266.7 149.4 414 180 5.9 1.2 18 0 18 0 2 0
 3-1 3-3v-38c-76-158-257-219-435-219H0z`,rightgroupunder:`M0 262h399565c371 0 266.7-149.4 414-180 5.9-1.2 18 0 18
 0 2 0 3 1 3 3v38c-76 158-257 219-435 219H0z`,rightharpoon:`M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3
-3.7-15.3-11-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2
-10.7 0-16.7 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58
 69.2 92 94.5zm0 0v40h399900v-40z`,rightharpoonplus:`M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3-3.7-15.3-11
-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2-10.7 0-16.7
 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58 69.2 92 94.5z
m0 0v40h399900v-40z m100 194v40h399900v-40zm0 0v40h399900v-40z`,rightharpoondown:`M399747 511c0 7.3 6.7 11 20 11 8 0 13-.8 15-2.5s4.7-6.8
 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3 8.5-5.8 9.5
-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3-64.7 57-92 95
-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 241v40h399900v-40z`,rightharpoondownplus:`M399747 705c0 7.3 6.7 11 20 11 8 0 13-.8
 15-2.5s4.7-6.8 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3
 8.5-5.8 9.5-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3
-64.7 57-92 95-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 435v40h399900v-40z
m0-194v40h400000v-40zm0 0v40h400000v-40z`,righthook:`M399859 241c-764 0 0 0 0 0 40-3.3 68.7-15.7 86-37 10-12 15-25.3
 15-40 0-22.7-9.8-40.7-29.5-54-19.7-13.3-43.5-21-71.5-23-17.3-1.3-26-8-26-20 0
-13.3 8.7-20 26-20 38 0 71 11.2 99 33.5 0 0 7 5.6 21 16.7 14 11.2 21 33.5 21
 66.8s-14 61.2-42 83.5c-28 22.3-61 33.5-99 33.5L0 241z M0 281v-40h399859v40z`,rightlinesegment:Ur(`M399960 241 V94 h40 V428 h-40 V281 H0 v-40z`),rightbracketunder:Ur(`M399995 0 h-120 V290 H0 v120 H400000z`),rightbracketover:Ur(`M399995 440 h-120 V150 H0 v-120 H399995z`),rightToFrom:`M400000 167c-70.7-42-118-97.7-142-167h-23c-15.3 0-23 .3-23
 1 0 1.3 5.3 13.7 16 37 18 35.3 41.3 69 70 101l7 8H0v40h399905l-7 8c-28.7 32
-52 65.7-70 101-10.7 23.3-16 35.7-16 37 0 .7 7.7 1 23 1h23c24-69.3 71.3-125 142
-167z M100 147v40h399900v-40zM0 341v40h399900v-40z`,twoheadleftarrow:`M0 167c68 40
 115.7 95.7 143 167h22c15.3 0 23-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69
-70-101l-7-8h125l9 7c50.7 39.3 85 86 103 140h46c0-4.7-6.3-18.7-19-42-18-35.3
-40-67.3-66-96l-9-9h399716v-40H284l9-9c26-28.7 48-60.7 66-96 12.7-23.333 19
-37.333 19-42h-46c-18 54-52.3 100.7-103 140l-9 7H95l7-8c28.7-32 52-65.7 70-101
 10.7-23.333 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 71.3 68 127 0 167z`,twoheadrightarrow:`M400000 167
c-68-40-115.7-95.7-143-167h-22c-15.3 0-23 .3-23 1 0 1.3 5.3 13.7 16 37 18 35.3
 41.3 69 70 101l7 8h-125l-9-7c-50.7-39.3-85-86-103-140h-46c0 4.7 6.3 18.7 19 42
 18 35.3 40 67.3 66 96l9 9H0v40h399716l-9 9c-26 28.7-48 60.7-66 96-12.7 23.333
-19 37.333-19 42h46c18-54 52.3-100.7 103-140l9-7h125l-7 8c-28.7 32-52 65.7-70
 101-10.7 23.333-16 35.7-16 37 0 .7 7.7 1 23 1h22c27.3-71.3 75-127 143-167z`,tilde1:`M200 55.538c-77 0-168 73.953-177 73.953-3 0-7
-2.175-9-5.437L2 97c-1-2-2-4-2-6 0-4 2-7 5-9l20-12C116 12 171 0 207 0c86 0
 114 68 191 68 78 0 168-68 177-68 4 0 7 2 9 5l12 19c1 2.175 2 4.35 2 6.525 0
 4.35-2 7.613-5 9.788l-19 13.05c-92 63.077-116.937 75.308-183 76.128
-68.267.847-113-73.952-191-73.952z`,tilde2:`M344 55.266c-142 0-300.638 81.316-311.5 86.418
-8.01 3.762-22.5 10.91-23.5 5.562L1 120c-1-2-1-3-1-4 0-5 3-9 8-10l18.4-9C160.9
 31.9 283 0 358 0c148 0 188 122 331 122s314-97 326-97c4 0 8 2 10 7l7 21.114
c1 2.14 1 3.21 1 4.28 0 5.347-3 9.626-7 10.696l-22.3 12.622C852.6 158.372 751
 181.476 676 181.476c-149 0-189-126.21-332-126.21z`,tilde3:`M786 59C457 59 32 175.242 13 175.242c-6 0-10-3.457
-11-10.37L.15 138c-1-7 3-12 10-13l19.2-6.4C378.4 40.7 634.3 0 804.3 0c337 0
 411.8 157 746.8 157 328 0 754-112 773-112 5 0 10 3 11 9l1 14.075c1 8.066-.697
 16.595-6.697 17.492l-21.052 7.31c-367.9 98.146-609.15 122.696-778.15 122.696
 -338 0-409-156.573-744-156.573z`,tilde4:`M786 58C457 58 32 177.487 13 177.487c-6 0-10-3.345
-11-10.035L.15 143c-1-7 3-12 10-13l22-6.7C381.2 35 637.15 0 807.15 0c337 0 409
 177 744 177 328 0 754-127 773-127 5 0 10 3 11 9l1 14.794c1 7.805-3 13.38-9
 14.495l-20.7 5.574c-366.85 99.79-607.3 139.372-776.3 139.372-338 0-409
 -175.236-744-175.236z`,vec:`M377 20c0-5.333 1.833-10 5.5-14S391 0 397 0c4.667 0 8.667 1.667 12 5
3.333 2.667 6.667 9 10 19 6.667 24.667 20.333 43.667 41 57 7.333 4.667 11
10.667 11 18 0 6-1 10-3 12s-6.667 5-14 9c-28.667 14.667-53.667 35.667-75 63
-1.333 1.333-3.167 3.5-5.5 6.5s-4 4.833-5 5.5c-1 .667-2.5 1.333-4.5 2s-4.333 1
-7 1c-4.667 0-9.167-1.833-13.5-5.5S337 184 337 178c0-12.667 15.667-32.333 47-59
H213l-171-1c-8.667-6-13-12.333-13-19 0-4.667 4.333-11.333 13-20h359
c-16-25.333-24-45-24-59z`,widehat1:`M529 0h5l519 115c5 1 9 5 9 10 0 1-1 2-1 3l-4 22
c-1 5-5 9-11 9h-2L532 67 19 159h-2c-5 0-9-4-11-9l-5-22c-1-6 2-12 8-13z`,widehat2:`M1181 0h2l1171 176c6 0 10 5 10 11l-2 23c-1 6-5 10
-11 10h-1L1182 67 15 220h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z`,widehat3:`M1181 0h2l1171 236c6 0 10 5 10 11l-2 23c-1 6-5 10
-11 10h-1L1182 67 15 280h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z`,widehat4:`M1181 0h2l1171 296c6 0 10 5 10 11l-2 23c-1 6-5 10
-11 10h-1L1182 67 15 340h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z`,widecheck1:`M529,159h5l519,-115c5,-1,9,-5,9,-10c0,-1,-1,-2,-1,-3l-4,-22c-1,
-5,-5,-9,-11,-9h-2l-512,92l-513,-92h-2c-5,0,-9,4,-11,9l-5,22c-1,6,2,12,8,13z`,widecheck2:`M1181,220h2l1171,-176c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,
-11,-10h-1l-1168,153l-1167,-153h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z`,widecheck3:`M1181,280h2l1171,-236c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,
-11,-10h-1l-1168,213l-1167,-213h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z`,widecheck4:`M1181,340h2l1171,-296c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,
-11,-10h-1l-1168,273l-1167,-273h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z`,baraboveleftarrow:`M400000 620h-399890l3 -3c68.7 -52.7 113.7 -120 135 -202
c4 -14.7 6 -23 6 -25c0 -7.3 -7 -11 -21 -11c-8 0 -13.2 0.8 -15.5 2.5
c-2.3 1.7 -4.2 5.8 -5.5 12.5c-1.3 4.7 -2.7 10.3 -4 17c-12 48.7 -34.8 92 -68.5 130
s-74.2 66.3 -121.5 85c-10 4 -16 7.7 -18 11c0 8.7 6 14.3 18 17c47.3 18.7 87.8 47
121.5 85s56.5 81.3 68.5 130c0.7 2 1.3 5 2 9s1.2 6.7 1.5 8c0.3 1.3 1 3.3 2 6
s2.2 4.5 3.5 5.5c1.3 1 3.3 1.8 6 2.5s6 1 10 1c14 0 21 -3.7 21 -11
c0 -2 -2 -10.3 -6 -25c-20 -79.3 -65 -146.7 -135 -202l-3 -3h399890z
M100 620v40h399900v-40z M0 241v40h399900v-40zM0 241v40h399900v-40z`,rightarrowabovebar:`M0 241v40h399891c-47.3 35.3-84 78-110 128-16.7 32
-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20 11 8 0
13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7 39
-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85-40.5
-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5
-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67
151.7 139 205zm96 379h399894v40H0zm0 0h399904v40H0z`,baraboveshortleftharpoon:`M507,435c-4,4,-6.3,8.7,-7,14c0,5.3,0.7,9,2,11
c1.3,2,5.3,5.3,12,10c90.7,54,156,130,196,228c3.3,10.7,6.3,16.3,9,17
c2,0.7,5,1,9,1c0,0,5,0,5,0c10.7,0,16.7,-2,18,-6c2,-2.7,1,-9.7,-3,-21
c-32,-87.3,-82.7,-157.7,-152,-211c0,0,-3,-3,-3,-3l399351,0l0,-40
c-398570,0,-399437,0,-399437,0z M593 435 v40 H399500 v-40z
M0 281 v-40 H399908 v40z M0 281 v-40 H399908 v40z`,rightharpoonaboveshortbar:`M0,241 l0,40c399126,0,399993,0,399993,0
c4.7,-4.7,7,-9.3,7,-14c0,-9.3,-3.7,-15.3,-11,-18c-92.7,-56.7,-159,-133.7,-199,
-231c-3.3,-9.3,-6,-14.7,-8,-16c-2,-1.3,-7,-2,-15,-2c-10.7,0,-16.7,2,-18,6
c-2,2.7,-1,9.7,3,21c15.3,42,36.7,81.8,64,119.5c27.3,37.7,58,69.2,92,94.5z
M0 241 v40 H399908 v-40z M0 475 v-40 H399500 v40z M0 475 v-40 H399500 v40z`,shortbaraboveleftharpoon:`M7,435c-4,4,-6.3,8.7,-7,14c0,5.3,0.7,9,2,11
c1.3,2,5.3,5.3,12,10c90.7,54,156,130,196,228c3.3,10.7,6.3,16.3,9,17c2,0.7,5,1,9,
1c0,0,5,0,5,0c10.7,0,16.7,-2,18,-6c2,-2.7,1,-9.7,-3,-21c-32,-87.3,-82.7,-157.7,
-152,-211c0,0,-3,-3,-3,-3l399907,0l0,-40c-399126,0,-399993,0,-399993,0z
M93 435 v40 H400000 v-40z M500 241 v40 H400000 v-40z M500 241 v40 H400000 v-40z`,shortrightharpoonabovebar:`M53,241l0,40c398570,0,399437,0,399437,0
c4.7,-4.7,7,-9.3,7,-14c0,-9.3,-3.7,-15.3,-11,-18c-92.7,-56.7,-159,-133.7,-199,
-231c-3.3,-9.3,-6,-14.7,-8,-16c-2,-1.3,-7,-2,-15,-2c-10.7,0,-16.7,2,-18,6
c-2,2.7,-1,9.7,3,21c15.3,42,36.7,81.8,64,119.5c27.3,37.7,58,69.2,92,94.5z
M500 241 v40 H399408 v-40z M500 435 v40 H400000 v-40z`},ti=function(e,t){switch(e){case`lbrack`:return`M403 1759 V84 H666 V0 H319 V1759 v`+t+` v1759 v84 h347 v-84
H403z M403 1759 V0 H319 V1759 v`+t+` v1759 v84 h84z`;case`rbrack`:return`M347 1759 V0 H0 V84 H263 V1759 v`+t+` v1759 H0 v84 H347z
M347 1759 V0 H263 V1759 v`+t+` v1759 h84z`;case`vert`:return`M145 15 v585 v`+t+` v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v`+-t+` v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M188 15 H145 v585 v`+t+` v585 h43z`;case`doublevert`:return`M145 15 v585 v`+t+` v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v`+-t+` v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M188 15 H145 v585 v`+t+` v585 h43z
M367 15 v585 v`+t+` v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v`+-t+` v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M410 15 H367 v585 v`+t+` v585 h43z`;case`lfloor`:return`M319 602 V0 H403 V602 v`+t+` v1715 h263 v84 H319z
MM319 602 V0 H403 V602 v`+t+` v1715 H319z`;case`rfloor`:return`M319 602 V0 H403 V602 v`+t+` v1799 H0 v-84 H319z
MM319 602 V0 H403 V602 v`+t+` v1715 H319z`;case`lceil`:return`M403 1759 V84 H666 V0 H319 V1759 v`+t+` v602 h84z
M403 1759 V0 H319 V1759 v`+t+` v602 h84z`;case`rceil`:return`M347 1759 V0 H0 V84 H263 V1759 v`+t+` v602 h84z
M347 1759 V0 h-84 V1759 v`+t+` v602 h84z`;case`lparen`:return`M863,9c0,-2,-2,-5,-6,-9c0,0,-17,0,-17,0c-12.7,0,-19.3,0.3,-20,1
c-5.3,5.3,-10.3,11,-15,17c-242.7,294.7,-395.3,682,-458,1162c-21.3,163.3,-33.3,349,
-36,557 l0,`+(t+84)+`c0.2,6,0,26,0,60c2,159.3,10,310.7,24,454c53.3,528,210,
949.7,470,1265c4.7,6,9.7,11.7,15,17c0.7,0.7,7,1,19,1c0,0,18,0,18,0c4,-4,6,-7,6,-9
c0,-2.7,-3.3,-8.7,-10,-18c-135.3,-192.7,-235.5,-414.3,-300.5,-665c-65,-250.7,-102.5,
-544.7,-112.5,-882c-2,-104,-3,-167,-3,-189
l0,-`+(t+92)+`c0,-162.7,5.7,-314,17,-454c20.7,-272,63.7,-513,129,-723c65.3,
-210,155.3,-396.3,270,-559c6.7,-9.3,10,-15.3,10,-18z`;case`rparen`:return`M76,0c-16.7,0,-25,3,-25,9c0,2,2,6.3,6,13c21.3,28.7,42.3,60.3,
63,95c96.7,156.7,172.8,332.5,228.5,527.5c55.7,195,92.8,416.5,111.5,664.5
c11.3,139.3,17,290.7,17,454c0,28,1.7,43,3.3,45l0,`+(t+9)+`
c-3,4,-3.3,16.7,-3.3,38c0,162,-5.7,313.7,-17,455c-18.7,248,-55.8,469.3,-111.5,664
c-55.7,194.7,-131.8,370.3,-228.5,527c-20.7,34.7,-41.7,66.3,-63,95c-2,3.3,-4,7,-6,11
c0,7.3,5.7,11,17,11c0,0,11,0,11,0c9.3,0,14.3,-0.3,15,-1c5.3,-5.3,10.3,-11,15,-17
c242.7,-294.7,395.3,-681.7,458,-1161c21.3,-164.7,33.3,-350.7,36,-558
l0,-`+(t+144)+`c-2,-159.3,-10,-310.7,-24,-454c-53.3,-528,-210,-949.7,
-470,-1265c-4.7,-6,-9.7,-11.7,-15,-17c-0.7,-0.7,-6.7,-1,-18,-1z`;default:throw Error(`Unknown stretchy delimiter.`)}};function ni(e){return`toText`in e}var ri=class{constructor(e){this.children=void 0,this.classes=void 0,this.height=void 0,this.depth=void 0,this.maxFontSize=void 0,this.style=void 0,this.children=e,this.classes=[],this.height=0,this.depth=0,this.maxFontSize=0,this.style={}}hasClass(e){return this.classes.includes(e)}toNode(){for(var e=document.createDocumentFragment(),t=0;t<this.children.length;t++)e.appendChild(this.children[t].toNode());return e}toMarkup(){for(var e=``,t=0;t<this.children.length;t++)e+=this.children[t].toMarkup();return e}toText(){return this.children.map(e=>{if(ni(e))return e.toText();throw Error(`Expected MathDomNode with toText, got `+e.constructor.name)}).join(``)}},ii={pt:1,mm:7227/2540,cm:7227/254,in:72.27,bp:803/800,pc:12,dd:1238/1157,cc:14856/1157,nd:685/642,nc:1370/107,sp:1/65536,px:803/800},ai={ex:!0,em:!0,mu:!0},oi=function(e){return typeof e!=`string`&&(e=e.unit),e in ii||e in ai||e===`ex`},k=function(e,t){var n;if(e.unit in ii)n=ii[e.unit]/t.fontMetrics().ptPerEm/t.sizeMultiplier;else if(e.unit===`mu`)n=t.fontMetrics().cssEmPerMu;else{var r=t.style.isTight()?t.havingStyle(t.style.text()):t;if(e.unit===`ex`)n=r.fontMetrics().xHeight;else if(e.unit===`em`)n=r.fontMetrics().quad;else throw new D(`Invalid unit: '`+e.unit+`'`);r!==t&&(n*=r.sizeMultiplier/t.sizeMultiplier)}return Math.min(e.number*n,t.maxSize)},A=function(e){return+e.toFixed(4)+`em`},si=function(e){return e.filter(e=>e).join(` `)},ci=function(e){var t=``;for(var n of Object.keys(e)){var r=e[n];r!==void 0&&(t+=ur(n)+`:`+r+`;`)}return t},li=function(e,t,n){if(this.classes=e||[],this.attributes={},this.height=0,this.depth=0,this.maxFontSize=0,this.style=n||{},t){t.style.isTight()&&this.classes.push(`mtight`);var r=t.getColor();r&&(this.style.color=r)}},ui=function(e){var t=document.createElement(e);t.className=si(this.classes),Object.assign(t.style,this.style);for(var n of Object.keys(this.attributes))t.setAttribute(n,this.attributes[n]);for(var r=0;r<this.children.length;r++)t.appendChild(this.children[r].toNode());return t},di=/[\s"'>/=\x00-\x1f]/,fi=function(e){var t=`<`+e;this.classes.length&&(t+=` class="`+pr(si(this.classes))+`"`);var n=ci(this.style);n&&(t+=` style="`+pr(n)+`"`);for(var r of Object.keys(this.attributes)){if(di.test(r))throw new D(`Invalid attribute name '`+r+`'`);t+=` `+r+`="`+pr(this.attributes[r])+`"`}t+=`>`;for(var i=0;i<this.children.length;i++)t+=this.children[i].toMarkup();return t+=`</`+e+`>`,t},pi=class{constructor(e,t,n,r){this.children=void 0,this.attributes=void 0,this.classes=void 0,this.height=void 0,this.depth=void 0,this.width=void 0,this.maxFontSize=void 0,this.style=void 0,this.italic=void 0,li.call(this,e,n,r),this.children=t||[]}setAttribute(e,t){this.attributes[e]=t}hasClass(e){return this.classes.includes(e)}toNode(){return ui.call(this,`span`)}toMarkup(){return fi.call(this,`span`)}},mi=class{constructor(e,t,n,r){this.children=void 0,this.attributes=void 0,this.classes=void 0,this.height=void 0,this.depth=void 0,this.maxFontSize=void 0,this.style=void 0,li.call(this,t,r),this.children=n||[],this.setAttribute(`href`,e)}setAttribute(e,t){this.attributes[e]=t}hasClass(e){return this.classes.includes(e)}toNode(){return ui.call(this,`a`)}toMarkup(){return fi.call(this,`a`)}},hi=class{constructor(e,t,n){this.src=void 0,this.alt=void 0,this.classes=void 0,this.height=void 0,this.depth=void 0,this.maxFontSize=void 0,this.style=void 0,this.alt=t,this.src=e,this.classes=[`mord`],this.height=0,this.depth=0,this.maxFontSize=0,this.style=n}hasClass(e){return this.classes.includes(e)}toNode(){var e=document.createElement(`img`);return e.src=this.src,e.alt=this.alt,e.className=`mord`,Object.assign(e.style,this.style),e}toMarkup(){var e=`<img src="`+pr(this.src)+`"`+(` alt="`+pr(this.alt)+`"`),t=ci(this.style);return t&&(e+=` style="`+pr(t)+`"`),e+=`'/>`,e}},gi={î:`ı̂`,ï:`ı̈`,í:`ı́`,ì:`ı̀`},_i=class{constructor(e,t,n,r,i,a,o,s){this.text=void 0,this.height=void 0,this.depth=void 0,this.italic=void 0,this.skew=void 0,this.width=void 0,this.maxFontSize=void 0,this.classes=void 0,this.style=void 0,this.text=e,this.height=t||0,this.depth=n||0,this.italic=r||0,this.skew=i||0,this.width=a||0,this.classes=o||[],this.style=s||{},this.maxFontSize=0;var c=Br(this.text.charCodeAt(0));c&&this.classes.push(c+`_fallback`),/[îïíì]/.test(this.text)&&(this.text=gi[this.text])}hasClass(e){return this.classes.includes(e)}toNode(){var e=document.createTextNode(this.text),t=null;return this.italic>0&&(t=document.createElement(`span`),t.style.marginRight=A(this.italic)),this.classes.length>0&&(t||=document.createElement(`span`),t.className=si(this.classes)),Object.keys(this.style).length>0&&(t||=document.createElement(`span`),Object.assign(t.style,this.style)),t?(t.appendChild(e),t):e}toMarkup(){var e=!1,t=`<span`;this.classes.length&&(e=!0,t+=` class="`,t+=pr(si(this.classes)),t+=`"`);var n=``;this.italic>0&&(n+=`margin-right:`+A(this.italic)+`;`),n+=ci(this.style),n&&(e=!0,t+=` style="`+pr(n)+`"`);var r=pr(this.text);return e?(t+=`>`,t+=r,t+=`</span>`,t):r}},vi=class{constructor(e,t){this.children=void 0,this.attributes=void 0,this.children=e||[],this.attributes=t||{}}toNode(){var e=document.createElementNS(`http://www.w3.org/2000/svg`,`svg`);for(var t of Object.keys(this.attributes))e.setAttribute(t,this.attributes[t]);for(var n=0;n<this.children.length;n++)e.appendChild(this.children[n].toNode());return e}toMarkup(){var e=`<svg xmlns="http://www.w3.org/2000/svg"`;for(var t of Object.keys(this.attributes))e+=` `+t+`="`+pr(this.attributes[t])+`"`;e+=`>`;for(var n=0;n<this.children.length;n++)e+=this.children[n].toMarkup();return e+=`</svg>`,e}},yi=class{constructor(e,t){this.pathName=void 0,this.alternate=void 0,this.pathName=e,this.alternate=t}toNode(){var e=document.createElementNS(`http://www.w3.org/2000/svg`,`path`);return this.alternate?e.setAttribute(`d`,this.alternate):e.setAttribute(`d`,ei[this.pathName]),e}toMarkup(){return this.alternate?`<path d="`+pr(this.alternate)+`"/>`:`<path d="`+pr(ei[this.pathName])+`"/>`}},bi=class{constructor(e){this.attributes=void 0,this.attributes=e||{}}toNode(){var e=document.createElementNS(`http://www.w3.org/2000/svg`,`line`);for(var t of Object.keys(this.attributes))e.setAttribute(t,this.attributes[t]);return e}toMarkup(){var e=`<line`;for(var t of Object.keys(this.attributes))e+=` `+t+`="`+pr(this.attributes[t])+`"`;return e+=`/>`,e}};function xi(e){if(e instanceof _i)return e;throw Error(`Expected symbolNode but got `+String(e)+`.`)}function Si(e){if(e instanceof pi)return e;throw Error(`Expected span<HtmlDomNode> but got `+String(e)+`.`)}var Ci=e=>e instanceof pi||e instanceof mi||e instanceof ri,wi={"AMS-Regular":{32:[0,0,0,0,.25],65:[0,.68889,0,0,.72222],66:[0,.68889,0,0,.66667],67:[0,.68889,0,0,.72222],68:[0,.68889,0,0,.72222],69:[0,.68889,0,0,.66667],70:[0,.68889,0,0,.61111],71:[0,.68889,0,0,.77778],72:[0,.68889,0,0,.77778],73:[0,.68889,0,0,.38889],74:[.16667,.68889,0,0,.5],75:[0,.68889,0,0,.77778],76:[0,.68889,0,0,.66667],77:[0,.68889,0,0,.94445],78:[0,.68889,0,0,.72222],79:[.16667,.68889,0,0,.77778],80:[0,.68889,0,0,.61111],81:[.16667,.68889,0,0,.77778],82:[0,.68889,0,0,.72222],83:[0,.68889,0,0,.55556],84:[0,.68889,0,0,.66667],85:[0,.68889,0,0,.72222],86:[0,.68889,0,0,.72222],87:[0,.68889,0,0,1],88:[0,.68889,0,0,.72222],89:[0,.68889,0,0,.72222],90:[0,.68889,0,0,.66667],107:[0,.68889,0,0,.55556],160:[0,0,0,0,.25],165:[0,.675,.025,0,.75],174:[.15559,.69224,0,0,.94666],240:[0,.68889,0,0,.55556],295:[0,.68889,0,0,.54028],710:[0,.825,0,0,2.33334],732:[0,.9,0,0,2.33334],770:[0,.825,0,0,2.33334],771:[0,.9,0,0,2.33334],989:[.08167,.58167,0,0,.77778],1008:[0,.43056,.04028,0,.66667],8245:[0,.54986,0,0,.275],8463:[0,.68889,0,0,.54028],8487:[0,.68889,0,0,.72222],8498:[0,.68889,0,0,.55556],8502:[0,.68889,0,0,.66667],8503:[0,.68889,0,0,.44445],8504:[0,.68889,0,0,.66667],8513:[0,.68889,0,0,.63889],8592:[-.03598,.46402,0,0,.5],8594:[-.03598,.46402,0,0,.5],8602:[-.13313,.36687,0,0,1],8603:[-.13313,.36687,0,0,1],8606:[.01354,.52239,0,0,1],8608:[.01354,.52239,0,0,1],8610:[.01354,.52239,0,0,1.11111],8611:[.01354,.52239,0,0,1.11111],8619:[0,.54986,0,0,1],8620:[0,.54986,0,0,1],8621:[-.13313,.37788,0,0,1.38889],8622:[-.13313,.36687,0,0,1],8624:[0,.69224,0,0,.5],8625:[0,.69224,0,0,.5],8630:[0,.43056,0,0,1],8631:[0,.43056,0,0,1],8634:[.08198,.58198,0,0,.77778],8635:[.08198,.58198,0,0,.77778],8638:[.19444,.69224,0,0,.41667],8639:[.19444,.69224,0,0,.41667],8642:[.19444,.69224,0,0,.41667],8643:[.19444,.69224,0,0,.41667],8644:[.1808,.675,0,0,1],8646:[.1808,.675,0,0,1],8647:[.1808,.675,0,0,1],8648:[.19444,.69224,0,0,.83334],8649:[.1808,.675,0,0,1],8650:[.19444,.69224,0,0,.83334],8651:[.01354,.52239,0,0,1],8652:[.01354,.52239,0,0,1],8653:[-.13313,.36687,0,0,1],8654:[-.13313,.36687,0,0,1],8655:[-.13313,.36687,0,0,1],8666:[.13667,.63667,0,0,1],8667:[.13667,.63667,0,0,1],8669:[-.13313,.37788,0,0,1],8672:[-.064,.437,0,0,1.334],8674:[-.064,.437,0,0,1.334],8705:[0,.825,0,0,.5],8708:[0,.68889,0,0,.55556],8709:[.08167,.58167,0,0,.77778],8717:[0,.43056,0,0,.42917],8722:[-.03598,.46402,0,0,.5],8724:[.08198,.69224,0,0,.77778],8726:[.08167,.58167,0,0,.77778],8733:[0,.69224,0,0,.77778],8736:[0,.69224,0,0,.72222],8737:[0,.69224,0,0,.72222],8738:[.03517,.52239,0,0,.72222],8739:[.08167,.58167,0,0,.22222],8740:[.25142,.74111,0,0,.27778],8741:[.08167,.58167,0,0,.38889],8742:[.25142,.74111,0,0,.5],8756:[0,.69224,0,0,.66667],8757:[0,.69224,0,0,.66667],8764:[-.13313,.36687,0,0,.77778],8765:[-.13313,.37788,0,0,.77778],8769:[-.13313,.36687,0,0,.77778],8770:[-.03625,.46375,0,0,.77778],8774:[.30274,.79383,0,0,.77778],8776:[-.01688,.48312,0,0,.77778],8778:[.08167,.58167,0,0,.77778],8782:[.06062,.54986,0,0,.77778],8783:[.06062,.54986,0,0,.77778],8785:[.08198,.58198,0,0,.77778],8786:[.08198,.58198,0,0,.77778],8787:[.08198,.58198,0,0,.77778],8790:[0,.69224,0,0,.77778],8791:[.22958,.72958,0,0,.77778],8796:[.08198,.91667,0,0,.77778],8806:[.25583,.75583,0,0,.77778],8807:[.25583,.75583,0,0,.77778],8808:[.25142,.75726,0,0,.77778],8809:[.25142,.75726,0,0,.77778],8812:[.25583,.75583,0,0,.5],8814:[.20576,.70576,0,0,.77778],8815:[.20576,.70576,0,0,.77778],8816:[.30274,.79383,0,0,.77778],8817:[.30274,.79383,0,0,.77778],8818:[.22958,.72958,0,0,.77778],8819:[.22958,.72958,0,0,.77778],8822:[.1808,.675,0,0,.77778],8823:[.1808,.675,0,0,.77778],8828:[.13667,.63667,0,0,.77778],8829:[.13667,.63667,0,0,.77778],8830:[.22958,.72958,0,0,.77778],8831:[.22958,.72958,0,0,.77778],8832:[.20576,.70576,0,0,.77778],8833:[.20576,.70576,0,0,.77778],8840:[.30274,.79383,0,0,.77778],8841:[.30274,.79383,0,0,.77778],8842:[.13597,.63597,0,0,.77778],8843:[.13597,.63597,0,0,.77778],8847:[.03517,.54986,0,0,.77778],8848:[.03517,.54986,0,0,.77778],8858:[.08198,.58198,0,0,.77778],8859:[.08198,.58198,0,0,.77778],8861:[.08198,.58198,0,0,.77778],8862:[0,.675,0,0,.77778],8863:[0,.675,0,0,.77778],8864:[0,.675,0,0,.77778],8865:[0,.675,0,0,.77778],8872:[0,.69224,0,0,.61111],8873:[0,.69224,0,0,.72222],8874:[0,.69224,0,0,.88889],8876:[0,.68889,0,0,.61111],8877:[0,.68889,0,0,.61111],8878:[0,.68889,0,0,.72222],8879:[0,.68889,0,0,.72222],8882:[.03517,.54986,0,0,.77778],8883:[.03517,.54986,0,0,.77778],8884:[.13667,.63667,0,0,.77778],8885:[.13667,.63667,0,0,.77778],8888:[0,.54986,0,0,1.11111],8890:[.19444,.43056,0,0,.55556],8891:[.19444,.69224,0,0,.61111],8892:[.19444,.69224,0,0,.61111],8901:[0,.54986,0,0,.27778],8903:[.08167,.58167,0,0,.77778],8905:[.08167,.58167,0,0,.77778],8906:[.08167,.58167,0,0,.77778],8907:[0,.69224,0,0,.77778],8908:[0,.69224,0,0,.77778],8909:[-.03598,.46402,0,0,.77778],8910:[0,.54986,0,0,.76042],8911:[0,.54986,0,0,.76042],8912:[.03517,.54986,0,0,.77778],8913:[.03517,.54986,0,0,.77778],8914:[0,.54986,0,0,.66667],8915:[0,.54986,0,0,.66667],8916:[0,.69224,0,0,.66667],8918:[.0391,.5391,0,0,.77778],8919:[.0391,.5391,0,0,.77778],8920:[.03517,.54986,0,0,1.33334],8921:[.03517,.54986,0,0,1.33334],8922:[.38569,.88569,0,0,.77778],8923:[.38569,.88569,0,0,.77778],8926:[.13667,.63667,0,0,.77778],8927:[.13667,.63667,0,0,.77778],8928:[.30274,.79383,0,0,.77778],8929:[.30274,.79383,0,0,.77778],8934:[.23222,.74111,0,0,.77778],8935:[.23222,.74111,0,0,.77778],8936:[.23222,.74111,0,0,.77778],8937:[.23222,.74111,0,0,.77778],8938:[.20576,.70576,0,0,.77778],8939:[.20576,.70576,0,0,.77778],8940:[.30274,.79383,0,0,.77778],8941:[.30274,.79383,0,0,.77778],8994:[.19444,.69224,0,0,.77778],8995:[.19444,.69224,0,0,.77778],9416:[.15559,.69224,0,0,.90222],9484:[0,.69224,0,0,.5],9488:[0,.69224,0,0,.5],9492:[0,.37788,0,0,.5],9496:[0,.37788,0,0,.5],9585:[.19444,.68889,0,0,.88889],9586:[.19444,.74111,0,0,.88889],9632:[0,.675,0,0,.77778],9633:[0,.675,0,0,.77778],9650:[0,.54986,0,0,.72222],9651:[0,.54986,0,0,.72222],9654:[.03517,.54986,0,0,.77778],9660:[0,.54986,0,0,.72222],9661:[0,.54986,0,0,.72222],9664:[.03517,.54986,0,0,.77778],9674:[.11111,.69224,0,0,.66667],9733:[.19444,.69224,0,0,.94445],10003:[0,.69224,0,0,.83334],10016:[0,.69224,0,0,.83334],10731:[.11111,.69224,0,0,.66667],10846:[.19444,.75583,0,0,.61111],10877:[.13667,.63667,0,0,.77778],10878:[.13667,.63667,0,0,.77778],10885:[.25583,.75583,0,0,.77778],10886:[.25583,.75583,0,0,.77778],10887:[.13597,.63597,0,0,.77778],10888:[.13597,.63597,0,0,.77778],10889:[.26167,.75726,0,0,.77778],10890:[.26167,.75726,0,0,.77778],10891:[.48256,.98256,0,0,.77778],10892:[.48256,.98256,0,0,.77778],10901:[.13667,.63667,0,0,.77778],10902:[.13667,.63667,0,0,.77778],10933:[.25142,.75726,0,0,.77778],10934:[.25142,.75726,0,0,.77778],10935:[.26167,.75726,0,0,.77778],10936:[.26167,.75726,0,0,.77778],10937:[.26167,.75726,0,0,.77778],10938:[.26167,.75726,0,0,.77778],10949:[.25583,.75583,0,0,.77778],10950:[.25583,.75583,0,0,.77778],10955:[.28481,.79383,0,0,.77778],10956:[.28481,.79383,0,0,.77778],57350:[.08167,.58167,0,0,.22222],57351:[.08167,.58167,0,0,.38889],57352:[.08167,.58167,0,0,.77778],57353:[0,.43056,.04028,0,.66667],57356:[.25142,.75726,0,0,.77778],57357:[.25142,.75726,0,0,.77778],57358:[.41951,.91951,0,0,.77778],57359:[.30274,.79383,0,0,.77778],57360:[.30274,.79383,0,0,.77778],57361:[.41951,.91951,0,0,.77778],57366:[.25142,.75726,0,0,.77778],57367:[.25142,.75726,0,0,.77778],57368:[.25142,.75726,0,0,.77778],57369:[.25142,.75726,0,0,.77778],57370:[.13597,.63597,0,0,.77778],57371:[.13597,.63597,0,0,.77778]},"Caligraphic-Regular":{32:[0,0,0,0,.25],65:[0,.68333,0,.19445,.79847],66:[0,.68333,.03041,.13889,.65681],67:[0,.68333,.05834,.13889,.52653],68:[0,.68333,.02778,.08334,.77139],69:[0,.68333,.08944,.11111,.52778],70:[0,.68333,.09931,.11111,.71875],71:[.09722,.68333,.0593,.11111,.59487],72:[0,.68333,.00965,.11111,.84452],73:[0,.68333,.07382,0,.54452],74:[.09722,.68333,.18472,.16667,.67778],75:[0,.68333,.01445,.05556,.76195],76:[0,.68333,0,.13889,.68972],77:[0,.68333,0,.13889,1.2009],78:[0,.68333,.14736,.08334,.82049],79:[0,.68333,.02778,.11111,.79611],80:[0,.68333,.08222,.08334,.69556],81:[.09722,.68333,0,.11111,.81667],82:[0,.68333,0,.08334,.8475],83:[0,.68333,.075,.13889,.60556],84:[0,.68333,.25417,0,.54464],85:[0,.68333,.09931,.08334,.62583],86:[0,.68333,.08222,0,.61278],87:[0,.68333,.08222,.08334,.98778],88:[0,.68333,.14643,.13889,.7133],89:[.09722,.68333,.08222,.08334,.66834],90:[0,.68333,.07944,.13889,.72473],160:[0,0,0,0,.25]},"Fraktur-Regular":{32:[0,0,0,0,.25],33:[0,.69141,0,0,.29574],34:[0,.69141,0,0,.21471],38:[0,.69141,0,0,.73786],39:[0,.69141,0,0,.21201],40:[.24982,.74947,0,0,.38865],41:[.24982,.74947,0,0,.38865],42:[0,.62119,0,0,.27764],43:[.08319,.58283,0,0,.75623],44:[0,.10803,0,0,.27764],45:[.08319,.58283,0,0,.75623],46:[0,.10803,0,0,.27764],47:[.24982,.74947,0,0,.50181],48:[0,.47534,0,0,.50181],49:[0,.47534,0,0,.50181],50:[0,.47534,0,0,.50181],51:[.18906,.47534,0,0,.50181],52:[.18906,.47534,0,0,.50181],53:[.18906,.47534,0,0,.50181],54:[0,.69141,0,0,.50181],55:[.18906,.47534,0,0,.50181],56:[0,.69141,0,0,.50181],57:[.18906,.47534,0,0,.50181],58:[0,.47534,0,0,.21606],59:[.12604,.47534,0,0,.21606],61:[-.13099,.36866,0,0,.75623],63:[0,.69141,0,0,.36245],65:[0,.69141,0,0,.7176],66:[0,.69141,0,0,.88397],67:[0,.69141,0,0,.61254],68:[0,.69141,0,0,.83158],69:[0,.69141,0,0,.66278],70:[.12604,.69141,0,0,.61119],71:[0,.69141,0,0,.78539],72:[.06302,.69141,0,0,.7203],73:[0,.69141,0,0,.55448],74:[.12604,.69141,0,0,.55231],75:[0,.69141,0,0,.66845],76:[0,.69141,0,0,.66602],77:[0,.69141,0,0,1.04953],78:[0,.69141,0,0,.83212],79:[0,.69141,0,0,.82699],80:[.18906,.69141,0,0,.82753],81:[.03781,.69141,0,0,.82699],82:[0,.69141,0,0,.82807],83:[0,.69141,0,0,.82861],84:[0,.69141,0,0,.66899],85:[0,.69141,0,0,.64576],86:[0,.69141,0,0,.83131],87:[0,.69141,0,0,1.04602],88:[0,.69141,0,0,.71922],89:[.18906,.69141,0,0,.83293],90:[.12604,.69141,0,0,.60201],91:[.24982,.74947,0,0,.27764],93:[.24982,.74947,0,0,.27764],94:[0,.69141,0,0,.49965],97:[0,.47534,0,0,.50046],98:[0,.69141,0,0,.51315],99:[0,.47534,0,0,.38946],100:[0,.62119,0,0,.49857],101:[0,.47534,0,0,.40053],102:[.18906,.69141,0,0,.32626],103:[.18906,.47534,0,0,.5037],104:[.18906,.69141,0,0,.52126],105:[0,.69141,0,0,.27899],106:[0,.69141,0,0,.28088],107:[0,.69141,0,0,.38946],108:[0,.69141,0,0,.27953],109:[0,.47534,0,0,.76676],110:[0,.47534,0,0,.52666],111:[0,.47534,0,0,.48885],112:[.18906,.52396,0,0,.50046],113:[.18906,.47534,0,0,.48912],114:[0,.47534,0,0,.38919],115:[0,.47534,0,0,.44266],116:[0,.62119,0,0,.33301],117:[0,.47534,0,0,.5172],118:[0,.52396,0,0,.5118],119:[0,.52396,0,0,.77351],120:[.18906,.47534,0,0,.38865],121:[.18906,.47534,0,0,.49884],122:[.18906,.47534,0,0,.39054],160:[0,0,0,0,.25],8216:[0,.69141,0,0,.21471],8217:[0,.69141,0,0,.21471],58112:[0,.62119,0,0,.49749],58113:[0,.62119,0,0,.4983],58114:[.18906,.69141,0,0,.33328],58115:[.18906,.69141,0,0,.32923],58116:[.18906,.47534,0,0,.50343],58117:[0,.69141,0,0,.33301],58118:[0,.62119,0,0,.33409],58119:[0,.47534,0,0,.50073]},"Main-Bold":{32:[0,0,0,0,.25],33:[0,.69444,0,0,.35],34:[0,.69444,0,0,.60278],35:[.19444,.69444,0,0,.95833],36:[.05556,.75,0,0,.575],37:[.05556,.75,0,0,.95833],38:[0,.69444,0,0,.89444],39:[0,.69444,0,0,.31944],40:[.25,.75,0,0,.44722],41:[.25,.75,0,0,.44722],42:[0,.75,0,0,.575],43:[.13333,.63333,0,0,.89444],44:[.19444,.15556,0,0,.31944],45:[0,.44444,0,0,.38333],46:[0,.15556,0,0,.31944],47:[.25,.75,0,0,.575],48:[0,.64444,0,0,.575],49:[0,.64444,0,0,.575],50:[0,.64444,0,0,.575],51:[0,.64444,0,0,.575],52:[0,.64444,0,0,.575],53:[0,.64444,0,0,.575],54:[0,.64444,0,0,.575],55:[0,.64444,0,0,.575],56:[0,.64444,0,0,.575],57:[0,.64444,0,0,.575],58:[0,.44444,0,0,.31944],59:[.19444,.44444,0,0,.31944],60:[.08556,.58556,0,0,.89444],61:[-.10889,.39111,0,0,.89444],62:[.08556,.58556,0,0,.89444],63:[0,.69444,0,0,.54305],64:[0,.69444,0,0,.89444],65:[0,.68611,0,0,.86944],66:[0,.68611,0,0,.81805],67:[0,.68611,0,0,.83055],68:[0,.68611,0,0,.88194],69:[0,.68611,0,0,.75555],70:[0,.68611,0,0,.72361],71:[0,.68611,0,0,.90416],72:[0,.68611,0,0,.9],73:[0,.68611,0,0,.43611],74:[0,.68611,0,0,.59444],75:[0,.68611,0,0,.90138],76:[0,.68611,0,0,.69166],77:[0,.68611,0,0,1.09166],78:[0,.68611,0,0,.9],79:[0,.68611,0,0,.86388],80:[0,.68611,0,0,.78611],81:[.19444,.68611,0,0,.86388],82:[0,.68611,0,0,.8625],83:[0,.68611,0,0,.63889],84:[0,.68611,0,0,.8],85:[0,.68611,0,0,.88472],86:[0,.68611,.01597,0,.86944],87:[0,.68611,.01597,0,1.18888],88:[0,.68611,0,0,.86944],89:[0,.68611,.02875,0,.86944],90:[0,.68611,0,0,.70277],91:[.25,.75,0,0,.31944],92:[.25,.75,0,0,.575],93:[.25,.75,0,0,.31944],94:[0,.69444,0,0,.575],95:[.31,.13444,.03194,0,.575],97:[0,.44444,0,0,.55902],98:[0,.69444,0,0,.63889],99:[0,.44444,0,0,.51111],100:[0,.69444,0,0,.63889],101:[0,.44444,0,0,.52708],102:[0,.69444,.10903,0,.35139],103:[.19444,.44444,.01597,0,.575],104:[0,.69444,0,0,.63889],105:[0,.69444,0,0,.31944],106:[.19444,.69444,0,0,.35139],107:[0,.69444,0,0,.60694],108:[0,.69444,0,0,.31944],109:[0,.44444,0,0,.95833],110:[0,.44444,0,0,.63889],111:[0,.44444,0,0,.575],112:[.19444,.44444,0,0,.63889],113:[.19444,.44444,0,0,.60694],114:[0,.44444,0,0,.47361],115:[0,.44444,0,0,.45361],116:[0,.63492,0,0,.44722],117:[0,.44444,0,0,.63889],118:[0,.44444,.01597,0,.60694],119:[0,.44444,.01597,0,.83055],120:[0,.44444,0,0,.60694],121:[.19444,.44444,.01597,0,.60694],122:[0,.44444,0,0,.51111],123:[.25,.75,0,0,.575],124:[.25,.75,0,0,.31944],125:[.25,.75,0,0,.575],126:[.35,.34444,0,0,.575],160:[0,0,0,0,.25],163:[0,.69444,0,0,.86853],168:[0,.69444,0,0,.575],172:[0,.44444,0,0,.76666],176:[0,.69444,0,0,.86944],177:[.13333,.63333,0,0,.89444],184:[.17014,0,0,0,.51111],198:[0,.68611,0,0,1.04166],215:[.13333,.63333,0,0,.89444],216:[.04861,.73472,0,0,.89444],223:[0,.69444,0,0,.59722],230:[0,.44444,0,0,.83055],247:[.13333,.63333,0,0,.89444],248:[.09722,.54167,0,0,.575],305:[0,.44444,0,0,.31944],338:[0,.68611,0,0,1.16944],339:[0,.44444,0,0,.89444],567:[.19444,.44444,0,0,.35139],710:[0,.69444,0,0,.575],711:[0,.63194,0,0,.575],713:[0,.59611,0,0,.575],714:[0,.69444,0,0,.575],715:[0,.69444,0,0,.575],728:[0,.69444,0,0,.575],729:[0,.69444,0,0,.31944],730:[0,.69444,0,0,.86944],732:[0,.69444,0,0,.575],733:[0,.69444,0,0,.575],915:[0,.68611,0,0,.69166],916:[0,.68611,0,0,.95833],920:[0,.68611,0,0,.89444],923:[0,.68611,0,0,.80555],926:[0,.68611,0,0,.76666],928:[0,.68611,0,0,.9],931:[0,.68611,0,0,.83055],933:[0,.68611,0,0,.89444],934:[0,.68611,0,0,.83055],936:[0,.68611,0,0,.89444],937:[0,.68611,0,0,.83055],8211:[0,.44444,.03194,0,.575],8212:[0,.44444,.03194,0,1.14999],8216:[0,.69444,0,0,.31944],8217:[0,.69444,0,0,.31944],8220:[0,.69444,0,0,.60278],8221:[0,.69444,0,0,.60278],8224:[.19444,.69444,0,0,.51111],8225:[.19444,.69444,0,0,.51111],8242:[0,.55556,0,0,.34444],8407:[0,.72444,.15486,0,.575],8463:[0,.69444,0,0,.66759],8465:[0,.69444,0,0,.83055],8467:[0,.69444,0,0,.47361],8472:[.19444,.44444,0,0,.74027],8476:[0,.69444,0,0,.83055],8501:[0,.69444,0,0,.70277],8592:[-.10889,.39111,0,0,1.14999],8593:[.19444,.69444,0,0,.575],8594:[-.10889,.39111,0,0,1.14999],8595:[.19444,.69444,0,0,.575],8596:[-.10889,.39111,0,0,1.14999],8597:[.25,.75,0,0,.575],8598:[.19444,.69444,0,0,1.14999],8599:[.19444,.69444,0,0,1.14999],8600:[.19444,.69444,0,0,1.14999],8601:[.19444,.69444,0,0,1.14999],8636:[-.10889,.39111,0,0,1.14999],8637:[-.10889,.39111,0,0,1.14999],8640:[-.10889,.39111,0,0,1.14999],8641:[-.10889,.39111,0,0,1.14999],8656:[-.10889,.39111,0,0,1.14999],8657:[.19444,.69444,0,0,.70277],8658:[-.10889,.39111,0,0,1.14999],8659:[.19444,.69444,0,0,.70277],8660:[-.10889,.39111,0,0,1.14999],8661:[.25,.75,0,0,.70277],8704:[0,.69444,0,0,.63889],8706:[0,.69444,.06389,0,.62847],8707:[0,.69444,0,0,.63889],8709:[.05556,.75,0,0,.575],8711:[0,.68611,0,0,.95833],8712:[.08556,.58556,0,0,.76666],8715:[.08556,.58556,0,0,.76666],8722:[.13333,.63333,0,0,.89444],8723:[.13333,.63333,0,0,.89444],8725:[.25,.75,0,0,.575],8726:[.25,.75,0,0,.575],8727:[-.02778,.47222,0,0,.575],8728:[-.02639,.47361,0,0,.575],8729:[-.02639,.47361,0,0,.575],8730:[.18,.82,0,0,.95833],8733:[0,.44444,0,0,.89444],8734:[0,.44444,0,0,1.14999],8736:[0,.69224,0,0,.72222],8739:[.25,.75,0,0,.31944],8741:[.25,.75,0,0,.575],8743:[0,.55556,0,0,.76666],8744:[0,.55556,0,0,.76666],8745:[0,.55556,0,0,.76666],8746:[0,.55556,0,0,.76666],8747:[.19444,.69444,.12778,0,.56875],8764:[-.10889,.39111,0,0,.89444],8768:[.19444,.69444,0,0,.31944],8771:[.00222,.50222,0,0,.89444],8773:[.027,.638,0,0,.894],8776:[.02444,.52444,0,0,.89444],8781:[.00222,.50222,0,0,.89444],8801:[.00222,.50222,0,0,.89444],8804:[.19667,.69667,0,0,.89444],8805:[.19667,.69667,0,0,.89444],8810:[.08556,.58556,0,0,1.14999],8811:[.08556,.58556,0,0,1.14999],8826:[.08556,.58556,0,0,.89444],8827:[.08556,.58556,0,0,.89444],8834:[.08556,.58556,0,0,.89444],8835:[.08556,.58556,0,0,.89444],8838:[.19667,.69667,0,0,.89444],8839:[.19667,.69667,0,0,.89444],8846:[0,.55556,0,0,.76666],8849:[.19667,.69667,0,0,.89444],8850:[.19667,.69667,0,0,.89444],8851:[0,.55556,0,0,.76666],8852:[0,.55556,0,0,.76666],8853:[.13333,.63333,0,0,.89444],8854:[.13333,.63333,0,0,.89444],8855:[.13333,.63333,0,0,.89444],8856:[.13333,.63333,0,0,.89444],8857:[.13333,.63333,0,0,.89444],8866:[0,.69444,0,0,.70277],8867:[0,.69444,0,0,.70277],8868:[0,.69444,0,0,.89444],8869:[0,.69444,0,0,.89444],8900:[-.02639,.47361,0,0,.575],8901:[-.02639,.47361,0,0,.31944],8902:[-.02778,.47222,0,0,.575],8968:[.25,.75,0,0,.51111],8969:[.25,.75,0,0,.51111],8970:[.25,.75,0,0,.51111],8971:[.25,.75,0,0,.51111],8994:[-.13889,.36111,0,0,1.14999],8995:[-.13889,.36111,0,0,1.14999],9651:[.19444,.69444,0,0,1.02222],9657:[-.02778,.47222,0,0,.575],9661:[.19444,.69444,0,0,1.02222],9667:[-.02778,.47222,0,0,.575],9711:[.19444,.69444,0,0,1.14999],9824:[.12963,.69444,0,0,.89444],9825:[.12963,.69444,0,0,.89444],9826:[.12963,.69444,0,0,.89444],9827:[.12963,.69444,0,0,.89444],9837:[0,.75,0,0,.44722],9838:[.19444,.69444,0,0,.44722],9839:[.19444,.69444,0,0,.44722],10216:[.25,.75,0,0,.44722],10217:[.25,.75,0,0,.44722],10815:[0,.68611,0,0,.9],10927:[.19667,.69667,0,0,.89444],10928:[.19667,.69667,0,0,.89444],57376:[.19444,.69444,0,0,0]},"Main-BoldItalic":{32:[0,0,0,0,.25],33:[0,.69444,.11417,0,.38611],34:[0,.69444,.07939,0,.62055],35:[.19444,.69444,.06833,0,.94444],37:[.05556,.75,.12861,0,.94444],38:[0,.69444,.08528,0,.88555],39:[0,.69444,.12945,0,.35555],40:[.25,.75,.15806,0,.47333],41:[.25,.75,.03306,0,.47333],42:[0,.75,.14333,0,.59111],43:[.10333,.60333,.03306,0,.88555],44:[.19444,.14722,0,0,.35555],45:[0,.44444,.02611,0,.41444],46:[0,.14722,0,0,.35555],47:[.25,.75,.15806,0,.59111],48:[0,.64444,.13167,0,.59111],49:[0,.64444,.13167,0,.59111],50:[0,.64444,.13167,0,.59111],51:[0,.64444,.13167,0,.59111],52:[.19444,.64444,.13167,0,.59111],53:[0,.64444,.13167,0,.59111],54:[0,.64444,.13167,0,.59111],55:[.19444,.64444,.13167,0,.59111],56:[0,.64444,.13167,0,.59111],57:[0,.64444,.13167,0,.59111],58:[0,.44444,.06695,0,.35555],59:[.19444,.44444,.06695,0,.35555],61:[-.10889,.39111,.06833,0,.88555],63:[0,.69444,.11472,0,.59111],64:[0,.69444,.09208,0,.88555],65:[0,.68611,0,0,.86555],66:[0,.68611,.0992,0,.81666],67:[0,.68611,.14208,0,.82666],68:[0,.68611,.09062,0,.87555],69:[0,.68611,.11431,0,.75666],70:[0,.68611,.12903,0,.72722],71:[0,.68611,.07347,0,.89527],72:[0,.68611,.17208,0,.8961],73:[0,.68611,.15681,0,.47166],74:[0,.68611,.145,0,.61055],75:[0,.68611,.14208,0,.89499],76:[0,.68611,0,0,.69777],77:[0,.68611,.17208,0,1.07277],78:[0,.68611,.17208,0,.8961],79:[0,.68611,.09062,0,.85499],80:[0,.68611,.0992,0,.78721],81:[.19444,.68611,.09062,0,.85499],82:[0,.68611,.02559,0,.85944],83:[0,.68611,.11264,0,.64999],84:[0,.68611,.12903,0,.7961],85:[0,.68611,.17208,0,.88083],86:[0,.68611,.18625,0,.86555],87:[0,.68611,.18625,0,1.15999],88:[0,.68611,.15681,0,.86555],89:[0,.68611,.19803,0,.86555],90:[0,.68611,.14208,0,.70888],91:[.25,.75,.1875,0,.35611],93:[.25,.75,.09972,0,.35611],94:[0,.69444,.06709,0,.59111],95:[.31,.13444,.09811,0,.59111],97:[0,.44444,.09426,0,.59111],98:[0,.69444,.07861,0,.53222],99:[0,.44444,.05222,0,.53222],100:[0,.69444,.10861,0,.59111],101:[0,.44444,.085,0,.53222],102:[.19444,.69444,.21778,0,.4],103:[.19444,.44444,.105,0,.53222],104:[0,.69444,.09426,0,.59111],105:[0,.69326,.11387,0,.35555],106:[.19444,.69326,.1672,0,.35555],107:[0,.69444,.11111,0,.53222],108:[0,.69444,.10861,0,.29666],109:[0,.44444,.09426,0,.94444],110:[0,.44444,.09426,0,.64999],111:[0,.44444,.07861,0,.59111],112:[.19444,.44444,.07861,0,.59111],113:[.19444,.44444,.105,0,.53222],114:[0,.44444,.11111,0,.50167],115:[0,.44444,.08167,0,.48694],116:[0,.63492,.09639,0,.385],117:[0,.44444,.09426,0,.62055],118:[0,.44444,.11111,0,.53222],119:[0,.44444,.11111,0,.76777],120:[0,.44444,.12583,0,.56055],121:[.19444,.44444,.105,0,.56166],122:[0,.44444,.13889,0,.49055],126:[.35,.34444,.11472,0,.59111],160:[0,0,0,0,.25],168:[0,.69444,.11473,0,.59111],176:[0,.69444,0,0,.94888],184:[.17014,0,0,0,.53222],198:[0,.68611,.11431,0,1.02277],216:[.04861,.73472,.09062,0,.88555],223:[.19444,.69444,.09736,0,.665],230:[0,.44444,.085,0,.82666],248:[.09722,.54167,.09458,0,.59111],305:[0,.44444,.09426,0,.35555],338:[0,.68611,.11431,0,1.14054],339:[0,.44444,.085,0,.82666],567:[.19444,.44444,.04611,0,.385],710:[0,.69444,.06709,0,.59111],711:[0,.63194,.08271,0,.59111],713:[0,.59444,.10444,0,.59111],714:[0,.69444,.08528,0,.59111],715:[0,.69444,0,0,.59111],728:[0,.69444,.10333,0,.59111],729:[0,.69444,.12945,0,.35555],730:[0,.69444,0,0,.94888],732:[0,.69444,.11472,0,.59111],733:[0,.69444,.11472,0,.59111],915:[0,.68611,.12903,0,.69777],916:[0,.68611,0,0,.94444],920:[0,.68611,.09062,0,.88555],923:[0,.68611,0,0,.80666],926:[0,.68611,.15092,0,.76777],928:[0,.68611,.17208,0,.8961],931:[0,.68611,.11431,0,.82666],933:[0,.68611,.10778,0,.88555],934:[0,.68611,.05632,0,.82666],936:[0,.68611,.10778,0,.88555],937:[0,.68611,.0992,0,.82666],8211:[0,.44444,.09811,0,.59111],8212:[0,.44444,.09811,0,1.18221],8216:[0,.69444,.12945,0,.35555],8217:[0,.69444,.12945,0,.35555],8220:[0,.69444,.16772,0,.62055],8221:[0,.69444,.07939,0,.62055]},"Main-Italic":{32:[0,0,0,0,.25],33:[0,.69444,.12417,0,.30667],34:[0,.69444,.06961,0,.51444],35:[.19444,.69444,.06616,0,.81777],37:[.05556,.75,.13639,0,.81777],38:[0,.69444,.09694,0,.76666],39:[0,.69444,.12417,0,.30667],40:[.25,.75,.16194,0,.40889],41:[.25,.75,.03694,0,.40889],42:[0,.75,.14917,0,.51111],43:[.05667,.56167,.03694,0,.76666],44:[.19444,.10556,0,0,.30667],45:[0,.43056,.02826,0,.35778],46:[0,.10556,0,0,.30667],47:[.25,.75,.16194,0,.51111],48:[0,.64444,.13556,0,.51111],49:[0,.64444,.13556,0,.51111],50:[0,.64444,.13556,0,.51111],51:[0,.64444,.13556,0,.51111],52:[.19444,.64444,.13556,0,.51111],53:[0,.64444,.13556,0,.51111],54:[0,.64444,.13556,0,.51111],55:[.19444,.64444,.13556,0,.51111],56:[0,.64444,.13556,0,.51111],57:[0,.64444,.13556,0,.51111],58:[0,.43056,.0582,0,.30667],59:[.19444,.43056,.0582,0,.30667],61:[-.13313,.36687,.06616,0,.76666],63:[0,.69444,.1225,0,.51111],64:[0,.69444,.09597,0,.76666],65:[0,.68333,0,0,.74333],66:[0,.68333,.10257,0,.70389],67:[0,.68333,.14528,0,.71555],68:[0,.68333,.09403,0,.755],69:[0,.68333,.12028,0,.67833],70:[0,.68333,.13305,0,.65277],71:[0,.68333,.08722,0,.77361],72:[0,.68333,.16389,0,.74333],73:[0,.68333,.15806,0,.38555],74:[0,.68333,.14028,0,.525],75:[0,.68333,.14528,0,.76888],76:[0,.68333,0,0,.62722],77:[0,.68333,.16389,0,.89666],78:[0,.68333,.16389,0,.74333],79:[0,.68333,.09403,0,.76666],80:[0,.68333,.10257,0,.67833],81:[.19444,.68333,.09403,0,.76666],82:[0,.68333,.03868,0,.72944],83:[0,.68333,.11972,0,.56222],84:[0,.68333,.13305,0,.71555],85:[0,.68333,.16389,0,.74333],86:[0,.68333,.18361,0,.74333],87:[0,.68333,.18361,0,.99888],88:[0,.68333,.15806,0,.74333],89:[0,.68333,.19383,0,.74333],90:[0,.68333,.14528,0,.61333],91:[.25,.75,.1875,0,.30667],93:[.25,.75,.10528,0,.30667],94:[0,.69444,.06646,0,.51111],95:[.31,.12056,.09208,0,.51111],97:[0,.43056,.07671,0,.51111],98:[0,.69444,.06312,0,.46],99:[0,.43056,.05653,0,.46],100:[0,.69444,.10333,0,.51111],101:[0,.43056,.07514,0,.46],102:[.19444,.69444,.21194,0,.30667],103:[.19444,.43056,.08847,0,.46],104:[0,.69444,.07671,0,.51111],105:[0,.65536,.1019,0,.30667],106:[.19444,.65536,.14467,0,.30667],107:[0,.69444,.10764,0,.46],108:[0,.69444,.10333,0,.25555],109:[0,.43056,.07671,0,.81777],110:[0,.43056,.07671,0,.56222],111:[0,.43056,.06312,0,.51111],112:[.19444,.43056,.06312,0,.51111],113:[.19444,.43056,.08847,0,.46],114:[0,.43056,.10764,0,.42166],115:[0,.43056,.08208,0,.40889],116:[0,.61508,.09486,0,.33222],117:[0,.43056,.07671,0,.53666],118:[0,.43056,.10764,0,.46],119:[0,.43056,.10764,0,.66444],120:[0,.43056,.12042,0,.46389],121:[.19444,.43056,.08847,0,.48555],122:[0,.43056,.12292,0,.40889],126:[.35,.31786,.11585,0,.51111],160:[0,0,0,0,.25],168:[0,.66786,.10474,0,.51111],176:[0,.69444,0,0,.83129],184:[.17014,0,0,0,.46],198:[0,.68333,.12028,0,.88277],216:[.04861,.73194,.09403,0,.76666],223:[.19444,.69444,.10514,0,.53666],230:[0,.43056,.07514,0,.71555],248:[.09722,.52778,.09194,0,.51111],338:[0,.68333,.12028,0,.98499],339:[0,.43056,.07514,0,.71555],710:[0,.69444,.06646,0,.51111],711:[0,.62847,.08295,0,.51111],713:[0,.56167,.10333,0,.51111],714:[0,.69444,.09694,0,.51111],715:[0,.69444,0,0,.51111],728:[0,.69444,.10806,0,.51111],729:[0,.66786,.11752,0,.30667],730:[0,.69444,0,0,.83129],732:[0,.66786,.11585,0,.51111],733:[0,.69444,.1225,0,.51111],915:[0,.68333,.13305,0,.62722],916:[0,.68333,0,0,.81777],920:[0,.68333,.09403,0,.76666],923:[0,.68333,0,0,.69222],926:[0,.68333,.15294,0,.66444],928:[0,.68333,.16389,0,.74333],931:[0,.68333,.12028,0,.71555],933:[0,.68333,.11111,0,.76666],934:[0,.68333,.05986,0,.71555],936:[0,.68333,.11111,0,.76666],937:[0,.68333,.10257,0,.71555],8211:[0,.43056,.09208,0,.51111],8212:[0,.43056,.09208,0,1.02222],8216:[0,.69444,.12417,0,.30667],8217:[0,.69444,.12417,0,.30667],8220:[0,.69444,.1685,0,.51444],8221:[0,.69444,.06961,0,.51444],8463:[0,.68889,0,0,.54028]},"Main-Regular":{32:[0,0,0,0,.25],33:[0,.69444,0,0,.27778],34:[0,.69444,0,0,.5],35:[.19444,.69444,0,0,.83334],36:[.05556,.75,0,0,.5],37:[.05556,.75,0,0,.83334],38:[0,.69444,0,0,.77778],39:[0,.69444,0,0,.27778],40:[.25,.75,0,0,.38889],41:[.25,.75,0,0,.38889],42:[0,.75,0,0,.5],43:[.08333,.58333,0,0,.77778],44:[.19444,.10556,0,0,.27778],45:[0,.43056,0,0,.33333],46:[0,.10556,0,0,.27778],47:[.25,.75,0,0,.5],48:[0,.64444,0,0,.5],49:[0,.64444,0,0,.5],50:[0,.64444,0,0,.5],51:[0,.64444,0,0,.5],52:[0,.64444,0,0,.5],53:[0,.64444,0,0,.5],54:[0,.64444,0,0,.5],55:[0,.64444,0,0,.5],56:[0,.64444,0,0,.5],57:[0,.64444,0,0,.5],58:[0,.43056,0,0,.27778],59:[.19444,.43056,0,0,.27778],60:[.0391,.5391,0,0,.77778],61:[-.13313,.36687,0,0,.77778],62:[.0391,.5391,0,0,.77778],63:[0,.69444,0,0,.47222],64:[0,.69444,0,0,.77778],65:[0,.68333,0,0,.75],66:[0,.68333,0,0,.70834],67:[0,.68333,0,0,.72222],68:[0,.68333,0,0,.76389],69:[0,.68333,0,0,.68056],70:[0,.68333,0,0,.65278],71:[0,.68333,0,0,.78472],72:[0,.68333,0,0,.75],73:[0,.68333,0,0,.36111],74:[0,.68333,0,0,.51389],75:[0,.68333,0,0,.77778],76:[0,.68333,0,0,.625],77:[0,.68333,0,0,.91667],78:[0,.68333,0,0,.75],79:[0,.68333,0,0,.77778],80:[0,.68333,0,0,.68056],81:[.19444,.68333,0,0,.77778],82:[0,.68333,0,0,.73611],83:[0,.68333,0,0,.55556],84:[0,.68333,0,0,.72222],85:[0,.68333,0,0,.75],86:[0,.68333,.01389,0,.75],87:[0,.68333,.01389,0,1.02778],88:[0,.68333,0,0,.75],89:[0,.68333,.025,0,.75],90:[0,.68333,0,0,.61111],91:[.25,.75,0,0,.27778],92:[.25,.75,0,0,.5],93:[.25,.75,0,0,.27778],94:[0,.69444,0,0,.5],95:[.31,.12056,.02778,0,.5],97:[0,.43056,0,0,.5],98:[0,.69444,0,0,.55556],99:[0,.43056,0,0,.44445],100:[0,.69444,0,0,.55556],101:[0,.43056,0,0,.44445],102:[0,.69444,.07778,0,.30556],103:[.19444,.43056,.01389,0,.5],104:[0,.69444,0,0,.55556],105:[0,.66786,0,0,.27778],106:[.19444,.66786,0,0,.30556],107:[0,.69444,0,0,.52778],108:[0,.69444,0,0,.27778],109:[0,.43056,0,0,.83334],110:[0,.43056,0,0,.55556],111:[0,.43056,0,0,.5],112:[.19444,.43056,0,0,.55556],113:[.19444,.43056,0,0,.52778],114:[0,.43056,0,0,.39167],115:[0,.43056,0,0,.39445],116:[0,.61508,0,0,.38889],117:[0,.43056,0,0,.55556],118:[0,.43056,.01389,0,.52778],119:[0,.43056,.01389,0,.72222],120:[0,.43056,0,0,.52778],121:[.19444,.43056,.01389,0,.52778],122:[0,.43056,0,0,.44445],123:[.25,.75,0,0,.5],124:[.25,.75,0,0,.27778],125:[.25,.75,0,0,.5],126:[.35,.31786,0,0,.5],160:[0,0,0,0,.25],163:[0,.69444,0,0,.76909],167:[.19444,.69444,0,0,.44445],168:[0,.66786,0,0,.5],172:[0,.43056,0,0,.66667],176:[0,.69444,0,0,.75],177:[.08333,.58333,0,0,.77778],182:[.19444,.69444,0,0,.61111],184:[.17014,0,0,0,.44445],198:[0,.68333,0,0,.90278],215:[.08333,.58333,0,0,.77778],216:[.04861,.73194,0,0,.77778],223:[0,.69444,0,0,.5],230:[0,.43056,0,0,.72222],247:[.08333,.58333,0,0,.77778],248:[.09722,.52778,0,0,.5],305:[0,.43056,0,0,.27778],338:[0,.68333,0,0,1.01389],339:[0,.43056,0,0,.77778],567:[.19444,.43056,0,0,.30556],710:[0,.69444,0,0,.5],711:[0,.62847,0,0,.5],713:[0,.56778,0,0,.5],714:[0,.69444,0,0,.5],715:[0,.69444,0,0,.5],728:[0,.69444,0,0,.5],729:[0,.66786,0,0,.27778],730:[0,.69444,0,0,.75],732:[0,.66786,0,0,.5],733:[0,.69444,0,0,.5],915:[0,.68333,0,0,.625],916:[0,.68333,0,0,.83334],920:[0,.68333,0,0,.77778],923:[0,.68333,0,0,.69445],926:[0,.68333,0,0,.66667],928:[0,.68333,0,0,.75],931:[0,.68333,0,0,.72222],933:[0,.68333,0,0,.77778],934:[0,.68333,0,0,.72222],936:[0,.68333,0,0,.77778],937:[0,.68333,0,0,.72222],8211:[0,.43056,.02778,0,.5],8212:[0,.43056,.02778,0,1],8216:[0,.69444,0,0,.27778],8217:[0,.69444,0,0,.27778],8220:[0,.69444,0,0,.5],8221:[0,.69444,0,0,.5],8224:[.19444,.69444,0,0,.44445],8225:[.19444,.69444,0,0,.44445],8230:[0,.123,0,0,1.172],8242:[0,.55556,0,0,.275],8407:[0,.71444,.15382,0,.5],8463:[0,.68889,0,0,.54028],8465:[0,.69444,0,0,.72222],8467:[0,.69444,0,.11111,.41667],8472:[.19444,.43056,0,.11111,.63646],8476:[0,.69444,0,0,.72222],8501:[0,.69444,0,0,.61111],8592:[-.13313,.36687,0,0,1],8593:[.19444,.69444,0,0,.5],8594:[-.13313,.36687,0,0,1],8595:[.19444,.69444,0,0,.5],8596:[-.13313,.36687,0,0,1],8597:[.25,.75,0,0,.5],8598:[.19444,.69444,0,0,1],8599:[.19444,.69444,0,0,1],8600:[.19444,.69444,0,0,1],8601:[.19444,.69444,0,0,1],8614:[.011,.511,0,0,1],8617:[.011,.511,0,0,1.126],8618:[.011,.511,0,0,1.126],8636:[-.13313,.36687,0,0,1],8637:[-.13313,.36687,0,0,1],8640:[-.13313,.36687,0,0,1],8641:[-.13313,.36687,0,0,1],8652:[.011,.671,0,0,1],8656:[-.13313,.36687,0,0,1],8657:[.19444,.69444,0,0,.61111],8658:[-.13313,.36687,0,0,1],8659:[.19444,.69444,0,0,.61111],8660:[-.13313,.36687,0,0,1],8661:[.25,.75,0,0,.61111],8704:[0,.69444,0,0,.55556],8706:[0,.69444,.05556,.08334,.5309],8707:[0,.69444,0,0,.55556],8709:[.05556,.75,0,0,.5],8711:[0,.68333,0,0,.83334],8712:[.0391,.5391,0,0,.66667],8715:[.0391,.5391,0,0,.66667],8722:[.08333,.58333,0,0,.77778],8723:[.08333,.58333,0,0,.77778],8725:[.25,.75,0,0,.5],8726:[.25,.75,0,0,.5],8727:[-.03472,.46528,0,0,.5],8728:[-.05555,.44445,0,0,.5],8729:[-.05555,.44445,0,0,.5],8730:[.2,.8,0,0,.83334],8733:[0,.43056,0,0,.77778],8734:[0,.43056,0,0,1],8736:[0,.69224,0,0,.72222],8739:[.25,.75,0,0,.27778],8741:[.25,.75,0,0,.5],8743:[0,.55556,0,0,.66667],8744:[0,.55556,0,0,.66667],8745:[0,.55556,0,0,.66667],8746:[0,.55556,0,0,.66667],8747:[.19444,.69444,.11111,0,.41667],8764:[-.13313,.36687,0,0,.77778],8768:[.19444,.69444,0,0,.27778],8771:[-.03625,.46375,0,0,.77778],8773:[-.022,.589,0,0,.778],8776:[-.01688,.48312,0,0,.77778],8781:[-.03625,.46375,0,0,.77778],8784:[-.133,.673,0,0,.778],8801:[-.03625,.46375,0,0,.77778],8804:[.13597,.63597,0,0,.77778],8805:[.13597,.63597,0,0,.77778],8810:[.0391,.5391,0,0,1],8811:[.0391,.5391,0,0,1],8826:[.0391,.5391,0,0,.77778],8827:[.0391,.5391,0,0,.77778],8834:[.0391,.5391,0,0,.77778],8835:[.0391,.5391,0,0,.77778],8838:[.13597,.63597,0,0,.77778],8839:[.13597,.63597,0,0,.77778],8846:[0,.55556,0,0,.66667],8849:[.13597,.63597,0,0,.77778],8850:[.13597,.63597,0,0,.77778],8851:[0,.55556,0,0,.66667],8852:[0,.55556,0,0,.66667],8853:[.08333,.58333,0,0,.77778],8854:[.08333,.58333,0,0,.77778],8855:[.08333,.58333,0,0,.77778],8856:[.08333,.58333,0,0,.77778],8857:[.08333,.58333,0,0,.77778],8866:[0,.69444,0,0,.61111],8867:[0,.69444,0,0,.61111],8868:[0,.69444,0,0,.77778],8869:[0,.69444,0,0,.77778],8872:[.249,.75,0,0,.867],8900:[-.05555,.44445,0,0,.5],8901:[-.05555,.44445,0,0,.27778],8902:[-.03472,.46528,0,0,.5],8904:[.005,.505,0,0,.9],8942:[.03,.903,0,0,.278],8943:[-.19,.313,0,0,1.172],8945:[-.1,.823,0,0,1.282],8968:[.25,.75,0,0,.44445],8969:[.25,.75,0,0,.44445],8970:[.25,.75,0,0,.44445],8971:[.25,.75,0,0,.44445],8994:[-.14236,.35764,0,0,1],8995:[-.14236,.35764,0,0,1],9136:[.244,.744,0,0,.412],9137:[.244,.745,0,0,.412],9651:[.19444,.69444,0,0,.88889],9657:[-.03472,.46528,0,0,.5],9661:[.19444,.69444,0,0,.88889],9667:[-.03472,.46528,0,0,.5],9711:[.19444,.69444,0,0,1],9824:[.12963,.69444,0,0,.77778],9825:[.12963,.69444,0,0,.77778],9826:[.12963,.69444,0,0,.77778],9827:[.12963,.69444,0,0,.77778],9837:[0,.75,0,0,.38889],9838:[.19444,.69444,0,0,.38889],9839:[.19444,.69444,0,0,.38889],10216:[.25,.75,0,0,.38889],10217:[.25,.75,0,0,.38889],10222:[.244,.744,0,0,.412],10223:[.244,.745,0,0,.412],10229:[.011,.511,0,0,1.609],10230:[.011,.511,0,0,1.638],10231:[.011,.511,0,0,1.859],10232:[.024,.525,0,0,1.609],10233:[.024,.525,0,0,1.638],10234:[.024,.525,0,0,1.858],10236:[.011,.511,0,0,1.638],10815:[0,.68333,0,0,.75],10927:[.13597,.63597,0,0,.77778],10928:[.13597,.63597,0,0,.77778],57376:[.19444,.69444,0,0,0]},"Math-BoldItalic":{32:[0,0,0,0,.25],48:[0,.44444,0,0,.575],49:[0,.44444,0,0,.575],50:[0,.44444,0,0,.575],51:[.19444,.44444,0,0,.575],52:[.19444,.44444,0,0,.575],53:[.19444,.44444,0,0,.575],54:[0,.64444,0,0,.575],55:[.19444,.44444,0,0,.575],56:[0,.64444,0,0,.575],57:[.19444,.44444,0,0,.575],65:[0,.68611,0,0,.86944],66:[0,.68611,.04835,0,.8664],67:[0,.68611,.06979,0,.81694],68:[0,.68611,.03194,0,.93812],69:[0,.68611,.05451,0,.81007],70:[0,.68611,.15972,0,.68889],71:[0,.68611,0,0,.88673],72:[0,.68611,.08229,0,.98229],73:[0,.68611,.07778,0,.51111],74:[0,.68611,.10069,0,.63125],75:[0,.68611,.06979,0,.97118],76:[0,.68611,0,0,.75555],77:[0,.68611,.11424,0,1.14201],78:[0,.68611,.11424,0,.95034],79:[0,.68611,.03194,0,.83666],80:[0,.68611,.15972,0,.72309],81:[.19444,.68611,0,0,.86861],82:[0,.68611,.00421,0,.87235],83:[0,.68611,.05382,0,.69271],84:[0,.68611,.15972,0,.63663],85:[0,.68611,.11424,0,.80027],86:[0,.68611,.25555,0,.67778],87:[0,.68611,.15972,0,1.09305],88:[0,.68611,.07778,0,.94722],89:[0,.68611,.25555,0,.67458],90:[0,.68611,.06979,0,.77257],97:[0,.44444,0,0,.63287],98:[0,.69444,0,0,.52083],99:[0,.44444,0,0,.51342],100:[0,.69444,0,0,.60972],101:[0,.44444,0,0,.55361],102:[.19444,.69444,.11042,0,.56806],103:[.19444,.44444,.03704,0,.5449],104:[0,.69444,0,0,.66759],105:[0,.69326,0,0,.4048],106:[.19444,.69326,.0622,0,.47083],107:[0,.69444,.01852,0,.6037],108:[0,.69444,.0088,0,.34815],109:[0,.44444,0,0,1.0324],110:[0,.44444,0,0,.71296],111:[0,.44444,0,0,.58472],112:[.19444,.44444,0,0,.60092],113:[.19444,.44444,.03704,0,.54213],114:[0,.44444,.03194,0,.5287],115:[0,.44444,0,0,.53125],116:[0,.63492,0,0,.41528],117:[0,.44444,0,0,.68102],118:[0,.44444,.03704,0,.56666],119:[0,.44444,.02778,0,.83148],120:[0,.44444,0,0,.65903],121:[.19444,.44444,.03704,0,.59028],122:[0,.44444,.04213,0,.55509],160:[0,0,0,0,.25],915:[0,.68611,.15972,0,.65694],916:[0,.68611,0,0,.95833],920:[0,.68611,.03194,0,.86722],923:[0,.68611,0,0,.80555],926:[0,.68611,.07458,0,.84125],928:[0,.68611,.08229,0,.98229],931:[0,.68611,.05451,0,.88507],933:[0,.68611,.15972,0,.67083],934:[0,.68611,0,0,.76666],936:[0,.68611,.11653,0,.71402],937:[0,.68611,.04835,0,.8789],945:[0,.44444,0,0,.76064],946:[.19444,.69444,.03403,0,.65972],947:[.19444,.44444,.06389,0,.59003],948:[0,.69444,.03819,0,.52222],949:[0,.44444,0,0,.52882],950:[.19444,.69444,.06215,0,.50833],951:[.19444,.44444,.03704,0,.6],952:[0,.69444,.03194,0,.5618],953:[0,.44444,0,0,.41204],954:[0,.44444,0,0,.66759],955:[0,.69444,0,0,.67083],956:[.19444,.44444,0,0,.70787],957:[0,.44444,.06898,0,.57685],958:[.19444,.69444,.03021,0,.50833],959:[0,.44444,0,0,.58472],960:[0,.44444,.03704,0,.68241],961:[.19444,.44444,0,0,.6118],962:[.09722,.44444,.07917,0,.42361],963:[0,.44444,.03704,0,.68588],964:[0,.44444,.13472,0,.52083],965:[0,.44444,.03704,0,.63055],966:[.19444,.44444,0,0,.74722],967:[.19444,.44444,0,0,.71805],968:[.19444,.69444,.03704,0,.75833],969:[0,.44444,.03704,0,.71782],977:[0,.69444,0,0,.69155],981:[.19444,.69444,0,0,.7125],982:[0,.44444,.03194,0,.975],1009:[.19444,.44444,0,0,.6118],1013:[0,.44444,0,0,.48333],57649:[0,.44444,0,0,.39352],57911:[.19444,.44444,0,0,.43889]},"Math-Italic":{32:[0,0,0,0,.25],48:[0,.43056,0,0,.5],49:[0,.43056,0,0,.5],50:[0,.43056,0,0,.5],51:[.19444,.43056,0,0,.5],52:[.19444,.43056,0,0,.5],53:[.19444,.43056,0,0,.5],54:[0,.64444,0,0,.5],55:[.19444,.43056,0,0,.5],56:[0,.64444,0,0,.5],57:[.19444,.43056,0,0,.5],65:[0,.68333,0,.13889,.75],66:[0,.68333,.05017,.08334,.75851],67:[0,.68333,.07153,.08334,.71472],68:[0,.68333,.02778,.05556,.82792],69:[0,.68333,.05764,.08334,.7382],70:[0,.68333,.13889,.08334,.64306],71:[0,.68333,0,.08334,.78625],72:[0,.68333,.08125,.05556,.83125],73:[0,.68333,.07847,.11111,.43958],74:[0,.68333,.09618,.16667,.55451],75:[0,.68333,.07153,.05556,.84931],76:[0,.68333,0,.02778,.68056],77:[0,.68333,.10903,.08334,.97014],78:[0,.68333,.10903,.08334,.80347],79:[0,.68333,.02778,.08334,.76278],80:[0,.68333,.13889,.08334,.64201],81:[.19444,.68333,0,.08334,.79056],82:[0,.68333,.00773,.08334,.75929],83:[0,.68333,.05764,.08334,.6132],84:[0,.68333,.13889,.08334,.58438],85:[0,.68333,.10903,.02778,.68278],86:[0,.68333,.22222,0,.58333],87:[0,.68333,.13889,0,.94445],88:[0,.68333,.07847,.08334,.82847],89:[0,.68333,.22222,0,.58056],90:[0,.68333,.07153,.08334,.68264],97:[0,.43056,0,0,.52859],98:[0,.69444,0,0,.42917],99:[0,.43056,0,.05556,.43276],100:[0,.69444,0,.16667,.52049],101:[0,.43056,0,.05556,.46563],102:[.19444,.69444,.10764,.16667,.48959],103:[.19444,.43056,.03588,.02778,.47697],104:[0,.69444,0,0,.57616],105:[0,.65952,0,0,.34451],106:[.19444,.65952,.05724,0,.41181],107:[0,.69444,.03148,0,.5206],108:[0,.69444,.01968,.08334,.29838],109:[0,.43056,0,0,.87801],110:[0,.43056,0,0,.60023],111:[0,.43056,0,.05556,.48472],112:[.19444,.43056,0,.08334,.50313],113:[.19444,.43056,.03588,.08334,.44641],114:[0,.43056,.02778,.05556,.45116],115:[0,.43056,0,.05556,.46875],116:[0,.61508,0,.08334,.36111],117:[0,.43056,0,.02778,.57246],118:[0,.43056,.03588,.02778,.48472],119:[0,.43056,.02691,.08334,.71592],120:[0,.43056,0,.02778,.57153],121:[.19444,.43056,.03588,.05556,.49028],122:[0,.43056,.04398,.05556,.46505],160:[0,0,0,0,.25],915:[0,.68333,.13889,.08334,.61528],916:[0,.68333,0,.16667,.83334],920:[0,.68333,.02778,.08334,.76278],923:[0,.68333,0,.16667,.69445],926:[0,.68333,.07569,.08334,.74236],928:[0,.68333,.08125,.05556,.83125],931:[0,.68333,.05764,.08334,.77986],933:[0,.68333,.13889,.05556,.58333],934:[0,.68333,0,.08334,.66667],936:[0,.68333,.11,.05556,.61222],937:[0,.68333,.05017,.08334,.7724],945:[0,.43056,.0037,.02778,.6397],946:[.19444,.69444,.05278,.08334,.56563],947:[.19444,.43056,.05556,0,.51773],948:[0,.69444,.03785,.05556,.44444],949:[0,.43056,0,.08334,.46632],950:[.19444,.69444,.07378,.08334,.4375],951:[.19444,.43056,.03588,.05556,.49653],952:[0,.69444,.02778,.08334,.46944],953:[0,.43056,0,.05556,.35394],954:[0,.43056,0,0,.57616],955:[0,.69444,0,0,.58334],956:[.19444,.43056,0,.02778,.60255],957:[0,.43056,.06366,.02778,.49398],958:[.19444,.69444,.04601,.11111,.4375],959:[0,.43056,0,.05556,.48472],960:[0,.43056,.03588,0,.57003],961:[.19444,.43056,0,.08334,.51702],962:[.09722,.43056,.07986,.08334,.36285],963:[0,.43056,.03588,0,.57141],964:[0,.43056,.1132,.02778,.43715],965:[0,.43056,.03588,.02778,.54028],966:[.19444,.43056,0,.08334,.65417],967:[.19444,.43056,0,.05556,.62569],968:[.19444,.69444,.03588,.11111,.65139],969:[0,.43056,.03588,0,.62245],977:[0,.69444,0,.08334,.59144],981:[.19444,.69444,0,.08334,.59583],982:[0,.43056,.02778,0,.82813],1009:[.19444,.43056,0,.08334,.51702],1013:[0,.43056,0,.05556,.4059],57649:[0,.43056,0,.02778,.32246],57911:[.19444,.43056,0,.08334,.38403]},"SansSerif-Bold":{32:[0,0,0,0,.25],33:[0,.69444,0,0,.36667],34:[0,.69444,0,0,.55834],35:[.19444,.69444,0,0,.91667],36:[.05556,.75,0,0,.55],37:[.05556,.75,0,0,1.02912],38:[0,.69444,0,0,.83056],39:[0,.69444,0,0,.30556],40:[.25,.75,0,0,.42778],41:[.25,.75,0,0,.42778],42:[0,.75,0,0,.55],43:[.11667,.61667,0,0,.85556],44:[.10556,.13056,0,0,.30556],45:[0,.45833,0,0,.36667],46:[0,.13056,0,0,.30556],47:[.25,.75,0,0,.55],48:[0,.69444,0,0,.55],49:[0,.69444,0,0,.55],50:[0,.69444,0,0,.55],51:[0,.69444,0,0,.55],52:[0,.69444,0,0,.55],53:[0,.69444,0,0,.55],54:[0,.69444,0,0,.55],55:[0,.69444,0,0,.55],56:[0,.69444,0,0,.55],57:[0,.69444,0,0,.55],58:[0,.45833,0,0,.30556],59:[.10556,.45833,0,0,.30556],61:[-.09375,.40625,0,0,.85556],63:[0,.69444,0,0,.51945],64:[0,.69444,0,0,.73334],65:[0,.69444,0,0,.73334],66:[0,.69444,0,0,.73334],67:[0,.69444,0,0,.70278],68:[0,.69444,0,0,.79445],69:[0,.69444,0,0,.64167],70:[0,.69444,0,0,.61111],71:[0,.69444,0,0,.73334],72:[0,.69444,0,0,.79445],73:[0,.69444,0,0,.33056],74:[0,.69444,0,0,.51945],75:[0,.69444,0,0,.76389],76:[0,.69444,0,0,.58056],77:[0,.69444,0,0,.97778],78:[0,.69444,0,0,.79445],79:[0,.69444,0,0,.79445],80:[0,.69444,0,0,.70278],81:[.10556,.69444,0,0,.79445],82:[0,.69444,0,0,.70278],83:[0,.69444,0,0,.61111],84:[0,.69444,0,0,.73334],85:[0,.69444,0,0,.76389],86:[0,.69444,.01528,0,.73334],87:[0,.69444,.01528,0,1.03889],88:[0,.69444,0,0,.73334],89:[0,.69444,.0275,0,.73334],90:[0,.69444,0,0,.67223],91:[.25,.75,0,0,.34306],93:[.25,.75,0,0,.34306],94:[0,.69444,0,0,.55],95:[.35,.10833,.03056,0,.55],97:[0,.45833,0,0,.525],98:[0,.69444,0,0,.56111],99:[0,.45833,0,0,.48889],100:[0,.69444,0,0,.56111],101:[0,.45833,0,0,.51111],102:[0,.69444,.07639,0,.33611],103:[.19444,.45833,.01528,0,.55],104:[0,.69444,0,0,.56111],105:[0,.69444,0,0,.25556],106:[.19444,.69444,0,0,.28611],107:[0,.69444,0,0,.53056],108:[0,.69444,0,0,.25556],109:[0,.45833,0,0,.86667],110:[0,.45833,0,0,.56111],111:[0,.45833,0,0,.55],112:[.19444,.45833,0,0,.56111],113:[.19444,.45833,0,0,.56111],114:[0,.45833,.01528,0,.37222],115:[0,.45833,0,0,.42167],116:[0,.58929,0,0,.40417],117:[0,.45833,0,0,.56111],118:[0,.45833,.01528,0,.5],119:[0,.45833,.01528,0,.74445],120:[0,.45833,0,0,.5],121:[.19444,.45833,.01528,0,.5],122:[0,.45833,0,0,.47639],126:[.35,.34444,0,0,.55],160:[0,0,0,0,.25],168:[0,.69444,0,0,.55],176:[0,.69444,0,0,.73334],180:[0,.69444,0,0,.55],184:[.17014,0,0,0,.48889],305:[0,.45833,0,0,.25556],567:[.19444,.45833,0,0,.28611],710:[0,.69444,0,0,.55],711:[0,.63542,0,0,.55],713:[0,.63778,0,0,.55],728:[0,.69444,0,0,.55],729:[0,.69444,0,0,.30556],730:[0,.69444,0,0,.73334],732:[0,.69444,0,0,.55],733:[0,.69444,0,0,.55],915:[0,.69444,0,0,.58056],916:[0,.69444,0,0,.91667],920:[0,.69444,0,0,.85556],923:[0,.69444,0,0,.67223],926:[0,.69444,0,0,.73334],928:[0,.69444,0,0,.79445],931:[0,.69444,0,0,.79445],933:[0,.69444,0,0,.85556],934:[0,.69444,0,0,.79445],936:[0,.69444,0,0,.85556],937:[0,.69444,0,0,.79445],8211:[0,.45833,.03056,0,.55],8212:[0,.45833,.03056,0,1.10001],8216:[0,.69444,0,0,.30556],8217:[0,.69444,0,0,.30556],8220:[0,.69444,0,0,.55834],8221:[0,.69444,0,0,.55834]},"SansSerif-Italic":{32:[0,0,0,0,.25],33:[0,.69444,.05733,0,.31945],34:[0,.69444,.00316,0,.5],35:[.19444,.69444,.05087,0,.83334],36:[.05556,.75,.11156,0,.5],37:[.05556,.75,.03126,0,.83334],38:[0,.69444,.03058,0,.75834],39:[0,.69444,.07816,0,.27778],40:[.25,.75,.13164,0,.38889],41:[.25,.75,.02536,0,.38889],42:[0,.75,.11775,0,.5],43:[.08333,.58333,.02536,0,.77778],44:[.125,.08333,0,0,.27778],45:[0,.44444,.01946,0,.33333],46:[0,.08333,0,0,.27778],47:[.25,.75,.13164,0,.5],48:[0,.65556,.11156,0,.5],49:[0,.65556,.11156,0,.5],50:[0,.65556,.11156,0,.5],51:[0,.65556,.11156,0,.5],52:[0,.65556,.11156,0,.5],53:[0,.65556,.11156,0,.5],54:[0,.65556,.11156,0,.5],55:[0,.65556,.11156,0,.5],56:[0,.65556,.11156,0,.5],57:[0,.65556,.11156,0,.5],58:[0,.44444,.02502,0,.27778],59:[.125,.44444,.02502,0,.27778],61:[-.13,.37,.05087,0,.77778],63:[0,.69444,.11809,0,.47222],64:[0,.69444,.07555,0,.66667],65:[0,.69444,0,0,.66667],66:[0,.69444,.08293,0,.66667],67:[0,.69444,.11983,0,.63889],68:[0,.69444,.07555,0,.72223],69:[0,.69444,.11983,0,.59722],70:[0,.69444,.13372,0,.56945],71:[0,.69444,.11983,0,.66667],72:[0,.69444,.08094,0,.70834],73:[0,.69444,.13372,0,.27778],74:[0,.69444,.08094,0,.47222],75:[0,.69444,.11983,0,.69445],76:[0,.69444,0,0,.54167],77:[0,.69444,.08094,0,.875],78:[0,.69444,.08094,0,.70834],79:[0,.69444,.07555,0,.73611],80:[0,.69444,.08293,0,.63889],81:[.125,.69444,.07555,0,.73611],82:[0,.69444,.08293,0,.64584],83:[0,.69444,.09205,0,.55556],84:[0,.69444,.13372,0,.68056],85:[0,.69444,.08094,0,.6875],86:[0,.69444,.1615,0,.66667],87:[0,.69444,.1615,0,.94445],88:[0,.69444,.13372,0,.66667],89:[0,.69444,.17261,0,.66667],90:[0,.69444,.11983,0,.61111],91:[.25,.75,.15942,0,.28889],93:[.25,.75,.08719,0,.28889],94:[0,.69444,.0799,0,.5],95:[.35,.09444,.08616,0,.5],97:[0,.44444,.00981,0,.48056],98:[0,.69444,.03057,0,.51667],99:[0,.44444,.08336,0,.44445],100:[0,.69444,.09483,0,.51667],101:[0,.44444,.06778,0,.44445],102:[0,.69444,.21705,0,.30556],103:[.19444,.44444,.10836,0,.5],104:[0,.69444,.01778,0,.51667],105:[0,.67937,.09718,0,.23889],106:[.19444,.67937,.09162,0,.26667],107:[0,.69444,.08336,0,.48889],108:[0,.69444,.09483,0,.23889],109:[0,.44444,.01778,0,.79445],110:[0,.44444,.01778,0,.51667],111:[0,.44444,.06613,0,.5],112:[.19444,.44444,.0389,0,.51667],113:[.19444,.44444,.04169,0,.51667],114:[0,.44444,.10836,0,.34167],115:[0,.44444,.0778,0,.38333],116:[0,.57143,.07225,0,.36111],117:[0,.44444,.04169,0,.51667],118:[0,.44444,.10836,0,.46111],119:[0,.44444,.10836,0,.68334],120:[0,.44444,.09169,0,.46111],121:[.19444,.44444,.10836,0,.46111],122:[0,.44444,.08752,0,.43472],126:[.35,.32659,.08826,0,.5],160:[0,0,0,0,.25],168:[0,.67937,.06385,0,.5],176:[0,.69444,0,0,.73752],184:[.17014,0,0,0,.44445],305:[0,.44444,.04169,0,.23889],567:[.19444,.44444,.04169,0,.26667],710:[0,.69444,.0799,0,.5],711:[0,.63194,.08432,0,.5],713:[0,.60889,.08776,0,.5],714:[0,.69444,.09205,0,.5],715:[0,.69444,0,0,.5],728:[0,.69444,.09483,0,.5],729:[0,.67937,.07774,0,.27778],730:[0,.69444,0,0,.73752],732:[0,.67659,.08826,0,.5],733:[0,.69444,.09205,0,.5],915:[0,.69444,.13372,0,.54167],916:[0,.69444,0,0,.83334],920:[0,.69444,.07555,0,.77778],923:[0,.69444,0,0,.61111],926:[0,.69444,.12816,0,.66667],928:[0,.69444,.08094,0,.70834],931:[0,.69444,.11983,0,.72222],933:[0,.69444,.09031,0,.77778],934:[0,.69444,.04603,0,.72222],936:[0,.69444,.09031,0,.77778],937:[0,.69444,.08293,0,.72222],8211:[0,.44444,.08616,0,.5],8212:[0,.44444,.08616,0,1],8216:[0,.69444,.07816,0,.27778],8217:[0,.69444,.07816,0,.27778],8220:[0,.69444,.14205,0,.5],8221:[0,.69444,.00316,0,.5]},"SansSerif-Regular":{32:[0,0,0,0,.25],33:[0,.69444,0,0,.31945],34:[0,.69444,0,0,.5],35:[.19444,.69444,0,0,.83334],36:[.05556,.75,0,0,.5],37:[.05556,.75,0,0,.83334],38:[0,.69444,0,0,.75834],39:[0,.69444,0,0,.27778],40:[.25,.75,0,0,.38889],41:[.25,.75,0,0,.38889],42:[0,.75,0,0,.5],43:[.08333,.58333,0,0,.77778],44:[.125,.08333,0,0,.27778],45:[0,.44444,0,0,.33333],46:[0,.08333,0,0,.27778],47:[.25,.75,0,0,.5],48:[0,.65556,0,0,.5],49:[0,.65556,0,0,.5],50:[0,.65556,0,0,.5],51:[0,.65556,0,0,.5],52:[0,.65556,0,0,.5],53:[0,.65556,0,0,.5],54:[0,.65556,0,0,.5],55:[0,.65556,0,0,.5],56:[0,.65556,0,0,.5],57:[0,.65556,0,0,.5],58:[0,.44444,0,0,.27778],59:[.125,.44444,0,0,.27778],61:[-.13,.37,0,0,.77778],63:[0,.69444,0,0,.47222],64:[0,.69444,0,0,.66667],65:[0,.69444,0,0,.66667],66:[0,.69444,0,0,.66667],67:[0,.69444,0,0,.63889],68:[0,.69444,0,0,.72223],69:[0,.69444,0,0,.59722],70:[0,.69444,0,0,.56945],71:[0,.69444,0,0,.66667],72:[0,.69444,0,0,.70834],73:[0,.69444,0,0,.27778],74:[0,.69444,0,0,.47222],75:[0,.69444,0,0,.69445],76:[0,.69444,0,0,.54167],77:[0,.69444,0,0,.875],78:[0,.69444,0,0,.70834],79:[0,.69444,0,0,.73611],80:[0,.69444,0,0,.63889],81:[.125,.69444,0,0,.73611],82:[0,.69444,0,0,.64584],83:[0,.69444,0,0,.55556],84:[0,.69444,0,0,.68056],85:[0,.69444,0,0,.6875],86:[0,.69444,.01389,0,.66667],87:[0,.69444,.01389,0,.94445],88:[0,.69444,0,0,.66667],89:[0,.69444,.025,0,.66667],90:[0,.69444,0,0,.61111],91:[.25,.75,0,0,.28889],93:[.25,.75,0,0,.28889],94:[0,.69444,0,0,.5],95:[.35,.09444,.02778,0,.5],97:[0,.44444,0,0,.48056],98:[0,.69444,0,0,.51667],99:[0,.44444,0,0,.44445],100:[0,.69444,0,0,.51667],101:[0,.44444,0,0,.44445],102:[0,.69444,.06944,0,.30556],103:[.19444,.44444,.01389,0,.5],104:[0,.69444,0,0,.51667],105:[0,.67937,0,0,.23889],106:[.19444,.67937,0,0,.26667],107:[0,.69444,0,0,.48889],108:[0,.69444,0,0,.23889],109:[0,.44444,0,0,.79445],110:[0,.44444,0,0,.51667],111:[0,.44444,0,0,.5],112:[.19444,.44444,0,0,.51667],113:[.19444,.44444,0,0,.51667],114:[0,.44444,.01389,0,.34167],115:[0,.44444,0,0,.38333],116:[0,.57143,0,0,.36111],117:[0,.44444,0,0,.51667],118:[0,.44444,.01389,0,.46111],119:[0,.44444,.01389,0,.68334],120:[0,.44444,0,0,.46111],121:[.19444,.44444,.01389,0,.46111],122:[0,.44444,0,0,.43472],126:[.35,.32659,0,0,.5],160:[0,0,0,0,.25],168:[0,.67937,0,0,.5],176:[0,.69444,0,0,.66667],184:[.17014,0,0,0,.44445],305:[0,.44444,0,0,.23889],567:[.19444,.44444,0,0,.26667],710:[0,.69444,0,0,.5],711:[0,.63194,0,0,.5],713:[0,.60889,0,0,.5],714:[0,.69444,0,0,.5],715:[0,.69444,0,0,.5],728:[0,.69444,0,0,.5],729:[0,.67937,0,0,.27778],730:[0,.69444,0,0,.66667],732:[0,.67659,0,0,.5],733:[0,.69444,0,0,.5],915:[0,.69444,0,0,.54167],916:[0,.69444,0,0,.83334],920:[0,.69444,0,0,.77778],923:[0,.69444,0,0,.61111],926:[0,.69444,0,0,.66667],928:[0,.69444,0,0,.70834],931:[0,.69444,0,0,.72222],933:[0,.69444,0,0,.77778],934:[0,.69444,0,0,.72222],936:[0,.69444,0,0,.77778],937:[0,.69444,0,0,.72222],8211:[0,.44444,.02778,0,.5],8212:[0,.44444,.02778,0,1],8216:[0,.69444,0,0,.27778],8217:[0,.69444,0,0,.27778],8220:[0,.69444,0,0,.5],8221:[0,.69444,0,0,.5]},"Script-Regular":{32:[0,0,0,0,.25],65:[0,.7,.22925,0,.80253],66:[0,.7,.04087,0,.90757],67:[0,.7,.1689,0,.66619],68:[0,.7,.09371,0,.77443],69:[0,.7,.18583,0,.56162],70:[0,.7,.13634,0,.89544],71:[0,.7,.17322,0,.60961],72:[0,.7,.29694,0,.96919],73:[0,.7,.19189,0,.80907],74:[.27778,.7,.19189,0,1.05159],75:[0,.7,.31259,0,.91364],76:[0,.7,.19189,0,.87373],77:[0,.7,.15981,0,1.08031],78:[0,.7,.3525,0,.9015],79:[0,.7,.08078,0,.73787],80:[0,.7,.08078,0,1.01262],81:[0,.7,.03305,0,.88282],82:[0,.7,.06259,0,.85],83:[0,.7,.19189,0,.86767],84:[0,.7,.29087,0,.74697],85:[0,.7,.25815,0,.79996],86:[0,.7,.27523,0,.62204],87:[0,.7,.27523,0,.80532],88:[0,.7,.26006,0,.94445],89:[0,.7,.2939,0,.70961],90:[0,.7,.24037,0,.8212],160:[0,0,0,0,.25]},"Size1-Regular":{32:[0,0,0,0,.25],40:[.35001,.85,0,0,.45834],41:[.35001,.85,0,0,.45834],47:[.35001,.85,0,0,.57778],91:[.35001,.85,0,0,.41667],92:[.35001,.85,0,0,.57778],93:[.35001,.85,0,0,.41667],123:[.35001,.85,0,0,.58334],125:[.35001,.85,0,0,.58334],160:[0,0,0,0,.25],710:[0,.72222,0,0,.55556],732:[0,.72222,0,0,.55556],770:[0,.72222,0,0,.55556],771:[0,.72222,0,0,.55556],8214:[-99e-5,.601,0,0,.77778],8593:[1e-5,.6,0,0,.66667],8595:[1e-5,.6,0,0,.66667],8657:[1e-5,.6,0,0,.77778],8659:[1e-5,.6,0,0,.77778],8719:[.25001,.75,0,0,.94445],8720:[.25001,.75,0,0,.94445],8721:[.25001,.75,0,0,1.05556],8730:[.35001,.85,0,0,1],8739:[-.00599,.606,0,0,.33333],8741:[-.00599,.606,0,0,.55556],8747:[.30612,.805,.19445,0,.47222],8748:[.306,.805,.19445,0,.47222],8749:[.306,.805,.19445,0,.47222],8750:[.30612,.805,.19445,0,.47222],8896:[.25001,.75,0,0,.83334],8897:[.25001,.75,0,0,.83334],8898:[.25001,.75,0,0,.83334],8899:[.25001,.75,0,0,.83334],8968:[.35001,.85,0,0,.47222],8969:[.35001,.85,0,0,.47222],8970:[.35001,.85,0,0,.47222],8971:[.35001,.85,0,0,.47222],9168:[-99e-5,.601,0,0,.66667],10216:[.35001,.85,0,0,.47222],10217:[.35001,.85,0,0,.47222],10752:[.25001,.75,0,0,1.11111],10753:[.25001,.75,0,0,1.11111],10754:[.25001,.75,0,0,1.11111],10756:[.25001,.75,0,0,.83334],10758:[.25001,.75,0,0,.83334]},"Size2-Regular":{32:[0,0,0,0,.25],40:[.65002,1.15,0,0,.59722],41:[.65002,1.15,0,0,.59722],47:[.65002,1.15,0,0,.81111],91:[.65002,1.15,0,0,.47222],92:[.65002,1.15,0,0,.81111],93:[.65002,1.15,0,0,.47222],123:[.65002,1.15,0,0,.66667],125:[.65002,1.15,0,0,.66667],160:[0,0,0,0,.25],710:[0,.75,0,0,1],732:[0,.75,0,0,1],770:[0,.75,0,0,1],771:[0,.75,0,0,1],8719:[.55001,1.05,0,0,1.27778],8720:[.55001,1.05,0,0,1.27778],8721:[.55001,1.05,0,0,1.44445],8730:[.65002,1.15,0,0,1],8747:[.86225,1.36,.44445,0,.55556],8748:[.862,1.36,.44445,0,.55556],8749:[.862,1.36,.44445,0,.55556],8750:[.86225,1.36,.44445,0,.55556],8896:[.55001,1.05,0,0,1.11111],8897:[.55001,1.05,0,0,1.11111],8898:[.55001,1.05,0,0,1.11111],8899:[.55001,1.05,0,0,1.11111],8968:[.65002,1.15,0,0,.52778],8969:[.65002,1.15,0,0,.52778],8970:[.65002,1.15,0,0,.52778],8971:[.65002,1.15,0,0,.52778],10216:[.65002,1.15,0,0,.61111],10217:[.65002,1.15,0,0,.61111],10752:[.55001,1.05,0,0,1.51112],10753:[.55001,1.05,0,0,1.51112],10754:[.55001,1.05,0,0,1.51112],10756:[.55001,1.05,0,0,1.11111],10758:[.55001,1.05,0,0,1.11111]},"Size3-Regular":{32:[0,0,0,0,.25],40:[.95003,1.45,0,0,.73611],41:[.95003,1.45,0,0,.73611],47:[.95003,1.45,0,0,1.04445],91:[.95003,1.45,0,0,.52778],92:[.95003,1.45,0,0,1.04445],93:[.95003,1.45,0,0,.52778],123:[.95003,1.45,0,0,.75],125:[.95003,1.45,0,0,.75],160:[0,0,0,0,.25],710:[0,.75,0,0,1.44445],732:[0,.75,0,0,1.44445],770:[0,.75,0,0,1.44445],771:[0,.75,0,0,1.44445],8730:[.95003,1.45,0,0,1],8968:[.95003,1.45,0,0,.58334],8969:[.95003,1.45,0,0,.58334],8970:[.95003,1.45,0,0,.58334],8971:[.95003,1.45,0,0,.58334],10216:[.95003,1.45,0,0,.75],10217:[.95003,1.45,0,0,.75]},"Size4-Regular":{32:[0,0,0,0,.25],40:[1.25003,1.75,0,0,.79167],41:[1.25003,1.75,0,0,.79167],47:[1.25003,1.75,0,0,1.27778],91:[1.25003,1.75,0,0,.58334],92:[1.25003,1.75,0,0,1.27778],93:[1.25003,1.75,0,0,.58334],123:[1.25003,1.75,0,0,.80556],125:[1.25003,1.75,0,0,.80556],160:[0,0,0,0,.25],710:[0,.825,0,0,1.8889],732:[0,.825,0,0,1.8889],770:[0,.825,0,0,1.8889],771:[0,.825,0,0,1.8889],8730:[1.25003,1.75,0,0,1],8968:[1.25003,1.75,0,0,.63889],8969:[1.25003,1.75,0,0,.63889],8970:[1.25003,1.75,0,0,.63889],8971:[1.25003,1.75,0,0,.63889],9115:[.64502,1.155,0,0,.875],9116:[1e-5,.6,0,0,.875],9117:[.64502,1.155,0,0,.875],9118:[.64502,1.155,0,0,.875],9119:[1e-5,.6,0,0,.875],9120:[.64502,1.155,0,0,.875],9121:[.64502,1.155,0,0,.66667],9122:[-99e-5,.601,0,0,.66667],9123:[.64502,1.155,0,0,.66667],9124:[.64502,1.155,0,0,.66667],9125:[-99e-5,.601,0,0,.66667],9126:[.64502,1.155,0,0,.66667],9127:[1e-5,.9,0,0,.88889],9128:[.65002,1.15,0,0,.88889],9129:[.90001,0,0,0,.88889],9130:[0,.3,0,0,.88889],9131:[1e-5,.9,0,0,.88889],9132:[.65002,1.15,0,0,.88889],9133:[.90001,0,0,0,.88889],9143:[.88502,.915,0,0,1.05556],10216:[1.25003,1.75,0,0,.80556],10217:[1.25003,1.75,0,0,.80556],57344:[-.00499,.605,0,0,1.05556],57345:[-.00499,.605,0,0,1.05556],57680:[0,.12,0,0,.45],57681:[0,.12,0,0,.45],57682:[0,.12,0,0,.45],57683:[0,.12,0,0,.45]},"Typewriter-Regular":{32:[0,0,0,0,.525],33:[0,.61111,0,0,.525],34:[0,.61111,0,0,.525],35:[0,.61111,0,0,.525],36:[.08333,.69444,0,0,.525],37:[.08333,.69444,0,0,.525],38:[0,.61111,0,0,.525],39:[0,.61111,0,0,.525],40:[.08333,.69444,0,0,.525],41:[.08333,.69444,0,0,.525],42:[0,.52083,0,0,.525],43:[-.08056,.53055,0,0,.525],44:[.13889,.125,0,0,.525],45:[-.08056,.53055,0,0,.525],46:[0,.125,0,0,.525],47:[.08333,.69444,0,0,.525],48:[0,.61111,0,0,.525],49:[0,.61111,0,0,.525],50:[0,.61111,0,0,.525],51:[0,.61111,0,0,.525],52:[0,.61111,0,0,.525],53:[0,.61111,0,0,.525],54:[0,.61111,0,0,.525],55:[0,.61111,0,0,.525],56:[0,.61111,0,0,.525],57:[0,.61111,0,0,.525],58:[0,.43056,0,0,.525],59:[.13889,.43056,0,0,.525],60:[-.05556,.55556,0,0,.525],61:[-.19549,.41562,0,0,.525],62:[-.05556,.55556,0,0,.525],63:[0,.61111,0,0,.525],64:[0,.61111,0,0,.525],65:[0,.61111,0,0,.525],66:[0,.61111,0,0,.525],67:[0,.61111,0,0,.525],68:[0,.61111,0,0,.525],69:[0,.61111,0,0,.525],70:[0,.61111,0,0,.525],71:[0,.61111,0,0,.525],72:[0,.61111,0,0,.525],73:[0,.61111,0,0,.525],74:[0,.61111,0,0,.525],75:[0,.61111,0,0,.525],76:[0,.61111,0,0,.525],77:[0,.61111,0,0,.525],78:[0,.61111,0,0,.525],79:[0,.61111,0,0,.525],80:[0,.61111,0,0,.525],81:[.13889,.61111,0,0,.525],82:[0,.61111,0,0,.525],83:[0,.61111,0,0,.525],84:[0,.61111,0,0,.525],85:[0,.61111,0,0,.525],86:[0,.61111,0,0,.525],87:[0,.61111,0,0,.525],88:[0,.61111,0,0,.525],89:[0,.61111,0,0,.525],90:[0,.61111,0,0,.525],91:[.08333,.69444,0,0,.525],92:[.08333,.69444,0,0,.525],93:[.08333,.69444,0,0,.525],94:[0,.61111,0,0,.525],95:[.09514,0,0,0,.525],96:[0,.61111,0,0,.525],97:[0,.43056,0,0,.525],98:[0,.61111,0,0,.525],99:[0,.43056,0,0,.525],100:[0,.61111,0,0,.525],101:[0,.43056,0,0,.525],102:[0,.61111,0,0,.525],103:[.22222,.43056,0,0,.525],104:[0,.61111,0,0,.525],105:[0,.61111,0,0,.525],106:[.22222,.61111,0,0,.525],107:[0,.61111,0,0,.525],108:[0,.61111,0,0,.525],109:[0,.43056,0,0,.525],110:[0,.43056,0,0,.525],111:[0,.43056,0,0,.525],112:[.22222,.43056,0,0,.525],113:[.22222,.43056,0,0,.525],114:[0,.43056,0,0,.525],115:[0,.43056,0,0,.525],116:[0,.55358,0,0,.525],117:[0,.43056,0,0,.525],118:[0,.43056,0,0,.525],119:[0,.43056,0,0,.525],120:[0,.43056,0,0,.525],121:[.22222,.43056,0,0,.525],122:[0,.43056,0,0,.525],123:[.08333,.69444,0,0,.525],124:[.08333,.69444,0,0,.525],125:[.08333,.69444,0,0,.525],126:[0,.61111,0,0,.525],127:[0,.61111,0,0,.525],160:[0,0,0,0,.525],176:[0,.61111,0,0,.525],184:[.19445,0,0,0,.525],305:[0,.43056,0,0,.525],567:[.22222,.43056,0,0,.525],711:[0,.56597,0,0,.525],713:[0,.56555,0,0,.525],714:[0,.61111,0,0,.525],715:[0,.61111,0,0,.525],728:[0,.61111,0,0,.525],730:[0,.61111,0,0,.525],770:[0,.61111,0,0,.525],771:[0,.61111,0,0,.525],776:[0,.61111,0,0,.525],915:[0,.61111,0,0,.525],916:[0,.61111,0,0,.525],920:[0,.61111,0,0,.525],923:[0,.61111,0,0,.525],926:[0,.61111,0,0,.525],928:[0,.61111,0,0,.525],931:[0,.61111,0,0,.525],933:[0,.61111,0,0,.525],934:[0,.61111,0,0,.525],936:[0,.61111,0,0,.525],937:[0,.61111,0,0,.525],8216:[0,.61111,0,0,.525],8217:[0,.61111,0,0,.525],8242:[0,.61111,0,0,.525],9251:[.11111,.21944,0,0,.525]}},Ti={slant:[.25,.25,.25],space:[0,0,0],stretch:[0,0,0],shrink:[0,0,0],xHeight:[.431,.431,.431],quad:[1,1.171,1.472],extraSpace:[0,0,0],num1:[.677,.732,.925],num2:[.394,.384,.387],num3:[.444,.471,.504],denom1:[.686,.752,1.025],denom2:[.345,.344,.532],sup1:[.413,.503,.504],sup2:[.363,.431,.404],sup3:[.289,.286,.294],sub1:[.15,.143,.2],sub2:[.247,.286,.4],supDrop:[.386,.353,.494],subDrop:[.05,.071,.1],delim1:[2.39,1.7,1.98],delim2:[1.01,1.157,1.42],axisHeight:[.25,.25,.25],defaultRuleThickness:[.04,.049,.049],bigOpSpacing1:[.111,.111,.111],bigOpSpacing2:[.166,.166,.166],bigOpSpacing3:[.2,.2,.2],bigOpSpacing4:[.6,.611,.611],bigOpSpacing5:[.1,.143,.143],sqrtRuleThickness:[.04,.04,.04],ptPerEm:[10,10,10],doubleRuleSep:[.2,.2,.2],arrayRuleWidth:[.04,.04,.04],fboxsep:[.3,.3,.3],fboxrule:[.04,.04,.04]},Ei={Å:`A`,Ð:`D`,Þ:`o`,å:`a`,ð:`d`,þ:`o`,А:`A`,Б:`B`,В:`B`,Г:`F`,Д:`A`,Е:`E`,Ж:`K`,З:`3`,И:`N`,Й:`N`,К:`K`,Л:`N`,М:`M`,Н:`H`,О:`O`,П:`N`,Р:`P`,С:`C`,Т:`T`,У:`y`,Ф:`O`,Х:`X`,Ц:`U`,Ч:`h`,Ш:`W`,Щ:`W`,Ъ:`B`,Ы:`X`,Ь:`B`,Э:`3`,Ю:`X`,Я:`R`,а:`a`,б:`b`,в:`a`,г:`r`,д:`y`,е:`e`,ж:`m`,з:`e`,и:`n`,й:`n`,к:`n`,л:`n`,м:`m`,н:`n`,о:`o`,п:`n`,р:`p`,с:`c`,т:`o`,у:`y`,ф:`b`,х:`x`,ц:`n`,ч:`n`,ш:`w`,щ:`w`,ъ:`a`,ы:`m`,ь:`a`,э:`e`,ю:`m`,я:`r`};function Di(e,t){wi[e]=t}function Oi(e,t,n){if(!wi[t])throw Error(`Font metrics not found for font: `+t+`.`);var r=e.charCodeAt(0),i=wi[t][r];if(!i&&e[0]in Ei&&(r=Ei[e[0]].charCodeAt(0),i=wi[t][r]),!i&&n===`text`&&Hr(r)&&(i=wi[t][77]),i)return{depth:i[0],height:i[1],italic:i[2],skew:i[3],width:i[4]}}var ki={};function Ai(e){var t=e>=5?0:e>=3?1:2;if(!ki[t]){var n=ki[t]={cssEmPerMu:Ti.quad[t]/18};for(var r in Ti)Ti.hasOwnProperty(r)&&(n[r]=Ti[r][t])}return ki[t]}var j={math:{},text:{}};function M(e,t,n,r,i,a){j[e][i]={font:t,group:n,replace:r},a&&r&&(j[e][r]=j[e][i])}var N=`math`,P=`text`,F=`main`,I=`ams`,L=`accent-token`,R=`bin`,ji=`close`,Mi=`inner`,z=`mathord`,Ni=`op-token`,Pi=`open`,Fi=`punct`,B=`rel`,Ii=`spacing`,V=`textord`;M(N,F,B,`≡`,`\\equiv`,!0),M(N,F,B,`≺`,`\\prec`,!0),M(N,F,B,`≻`,`\\succ`,!0),M(N,F,B,`∼`,`\\sim`,!0),M(N,F,B,`⊥`,`\\perp`),M(N,F,B,`⪯`,`\\preceq`,!0),M(N,F,B,`⪰`,`\\succeq`,!0),M(N,F,B,`≃`,`\\simeq`,!0),M(N,F,B,`∣`,`\\mid`,!0),M(N,F,B,`≪`,`\\ll`,!0),M(N,F,B,`≫`,`\\gg`,!0),M(N,F,B,`≍`,`\\asymp`,!0),M(N,F,B,`∥`,`\\parallel`),M(N,F,B,`⋈`,`\\bowtie`,!0),M(N,F,B,`⌣`,`\\smile`,!0),M(N,F,B,`⊑`,`\\sqsubseteq`,!0),M(N,F,B,`⊒`,`\\sqsupseteq`,!0),M(N,F,B,`≐`,`\\doteq`,!0),M(N,F,B,`⌢`,`\\frown`,!0),M(N,F,B,`∋`,`\\ni`,!0),M(N,F,B,`∝`,`\\propto`,!0),M(N,F,B,`⊢`,`\\vdash`,!0),M(N,F,B,`⊣`,`\\dashv`,!0),M(N,F,B,`∋`,`\\owns`),M(N,F,Fi,`.`,`\\ldotp`),M(N,F,Fi,`⋅`,`\\cdotp`),M(N,F,Fi,`⋅`,`·`),M(P,F,V,`⋅`,`·`),M(N,F,V,`#`,`\\#`),M(P,F,V,`#`,`\\#`),M(N,F,V,`&`,`\\&`),M(P,F,V,`&`,`\\&`),M(N,F,V,`ℵ`,`\\aleph`,!0),M(N,F,V,`∀`,`\\forall`,!0),M(N,F,V,`ℏ`,`\\hbar`,!0),M(N,F,V,`∃`,`\\exists`,!0),M(N,F,V,`∇`,`\\nabla`,!0),M(N,F,V,`♭`,`\\flat`,!0),M(N,F,V,`ℓ`,`\\ell`,!0),M(N,F,V,`♮`,`\\natural`,!0),M(N,F,V,`♣`,`\\clubsuit`,!0),M(N,F,V,`℘`,`\\wp`,!0),M(N,F,V,`♯`,`\\sharp`,!0),M(N,F,V,`♢`,`\\diamondsuit`,!0),M(N,F,V,`ℜ`,`\\Re`,!0),M(N,F,V,`♡`,`\\heartsuit`,!0),M(N,F,V,`ℑ`,`\\Im`,!0),M(N,F,V,`♠`,`\\spadesuit`,!0),M(N,F,V,`§`,`\\S`,!0),M(P,F,V,`§`,`\\S`),M(N,F,V,`¶`,`\\P`,!0),M(P,F,V,`¶`,`\\P`),M(N,F,V,`†`,`\\dag`),M(P,F,V,`†`,`\\dag`),M(P,F,V,`†`,`\\textdagger`),M(N,F,V,`‡`,`\\ddag`),M(P,F,V,`‡`,`\\ddag`),M(P,F,V,`‡`,`\\textdaggerdbl`),M(N,F,ji,`⎱`,`\\rmoustache`,!0),M(N,F,Pi,`⎰`,`\\lmoustache`,!0),M(N,F,ji,`⟯`,`\\rgroup`,!0),M(N,F,Pi,`⟮`,`\\lgroup`,!0),M(N,F,R,`∓`,`\\mp`,!0),M(N,F,R,`⊖`,`\\ominus`,!0),M(N,F,R,`⊎`,`\\uplus`,!0),M(N,F,R,`⊓`,`\\sqcap`,!0),M(N,F,R,`∗`,`\\ast`),M(N,F,R,`⊔`,`\\sqcup`,!0),M(N,F,R,`◯`,`\\bigcirc`,!0),M(N,F,R,`∙`,`\\bullet`,!0),M(N,F,R,`‡`,`\\ddagger`),M(N,F,R,`≀`,`\\wr`,!0),M(N,F,R,`⨿`,`\\amalg`),M(N,F,R,`&`,`\\And`),M(N,F,B,`⟵`,`\\longleftarrow`,!0),M(N,F,B,`⇐`,`\\Leftarrow`,!0),M(N,F,B,`⟸`,`\\Longleftarrow`,!0),M(N,F,B,`⟶`,`\\longrightarrow`,!0),M(N,F,B,`⇒`,`\\Rightarrow`,!0),M(N,F,B,`⟹`,`\\Longrightarrow`,!0),M(N,F,B,`↔`,`\\leftrightarrow`,!0),M(N,F,B,`⟷`,`\\longleftrightarrow`,!0),M(N,F,B,`⇔`,`\\Leftrightarrow`,!0),M(N,F,B,`⟺`,`\\Longleftrightarrow`,!0),M(N,F,B,`↦`,`\\mapsto`,!0),M(N,F,B,`⟼`,`\\longmapsto`,!0),M(N,F,B,`↗`,`\\nearrow`,!0),M(N,F,B,`↩`,`\\hookleftarrow`,!0),M(N,F,B,`↪`,`\\hookrightarrow`,!0),M(N,F,B,`↘`,`\\searrow`,!0),M(N,F,B,`↼`,`\\leftharpoonup`,!0),M(N,F,B,`⇀`,`\\rightharpoonup`,!0),M(N,F,B,`↙`,`\\swarrow`,!0),M(N,F,B,`↽`,`\\leftharpoondown`,!0),M(N,F,B,`⇁`,`\\rightharpoondown`,!0),M(N,F,B,`↖`,`\\nwarrow`,!0),M(N,F,B,`⇌`,`\\rightleftharpoons`,!0),M(N,I,B,`≮`,`\\nless`,!0),M(N,I,B,``,`\\@nleqslant`),M(N,I,B,``,`\\@nleqq`),M(N,I,B,`⪇`,`\\lneq`,!0),M(N,I,B,`≨`,`\\lneqq`,!0),M(N,I,B,``,`\\@lvertneqq`),M(N,I,B,`⋦`,`\\lnsim`,!0),M(N,I,B,`⪉`,`\\lnapprox`,!0),M(N,I,B,`⊀`,`\\nprec`,!0),M(N,I,B,`⋠`,`\\npreceq`,!0),M(N,I,B,`⋨`,`\\precnsim`,!0),M(N,I,B,`⪹`,`\\precnapprox`,!0),M(N,I,B,`≁`,`\\nsim`,!0),M(N,I,B,``,`\\@nshortmid`),M(N,I,B,`∤`,`\\nmid`,!0),M(N,I,B,`⊬`,`\\nvdash`,!0),M(N,I,B,`⊭`,`\\nvDash`,!0),M(N,I,B,`⋪`,`\\ntriangleleft`),M(N,I,B,`⋬`,`\\ntrianglelefteq`,!0),M(N,I,B,`⊊`,`\\subsetneq`,!0),M(N,I,B,``,`\\@varsubsetneq`),M(N,I,B,`⫋`,`\\subsetneqq`,!0),M(N,I,B,``,`\\@varsubsetneqq`),M(N,I,B,`≯`,`\\ngtr`,!0),M(N,I,B,``,`\\@ngeqslant`),M(N,I,B,``,`\\@ngeqq`),M(N,I,B,`⪈`,`\\gneq`,!0),M(N,I,B,`≩`,`\\gneqq`,!0),M(N,I,B,``,`\\@gvertneqq`),M(N,I,B,`⋧`,`\\gnsim`,!0),M(N,I,B,`⪊`,`\\gnapprox`,!0),M(N,I,B,`⊁`,`\\nsucc`,!0),M(N,I,B,`⋡`,`\\nsucceq`,!0),M(N,I,B,`⋩`,`\\succnsim`,!0),M(N,I,B,`⪺`,`\\succnapprox`,!0),M(N,I,B,`≆`,`\\ncong`,!0),M(N,I,B,``,`\\@nshortparallel`),M(N,I,B,`∦`,`\\nparallel`,!0),M(N,I,B,`⊯`,`\\nVDash`,!0),M(N,I,B,`⋫`,`\\ntriangleright`),M(N,I,B,`⋭`,`\\ntrianglerighteq`,!0),M(N,I,B,``,`\\@nsupseteqq`),M(N,I,B,`⊋`,`\\supsetneq`,!0),M(N,I,B,``,`\\@varsupsetneq`),M(N,I,B,`⫌`,`\\supsetneqq`,!0),M(N,I,B,``,`\\@varsupsetneqq`),M(N,I,B,`⊮`,`\\nVdash`,!0),M(N,I,B,`⪵`,`\\precneqq`,!0),M(N,I,B,`⪶`,`\\succneqq`,!0),M(N,I,B,``,`\\@nsubseteqq`),M(N,I,R,`⊴`,`\\unlhd`),M(N,I,R,`⊵`,`\\unrhd`),M(N,I,B,`↚`,`\\nleftarrow`,!0),M(N,I,B,`↛`,`\\nrightarrow`,!0),M(N,I,B,`⇍`,`\\nLeftarrow`,!0),M(N,I,B,`⇏`,`\\nRightarrow`,!0),M(N,I,B,`↮`,`\\nleftrightarrow`,!0),M(N,I,B,`⇎`,`\\nLeftrightarrow`,!0),M(N,I,B,`△`,`\\vartriangle`),M(N,I,V,`ℏ`,`\\hslash`),M(N,I,V,`▽`,`\\triangledown`),M(N,I,V,`◊`,`\\lozenge`),M(N,I,V,`Ⓢ`,`\\circledS`),M(N,I,V,`®`,`\\circledR`),M(P,I,V,`®`,`\\circledR`),M(N,I,V,`∡`,`\\measuredangle`,!0),M(N,I,V,`∄`,`\\nexists`),M(N,I,V,`℧`,`\\mho`),M(N,I,V,`Ⅎ`,`\\Finv`,!0),M(N,I,V,`⅁`,`\\Game`,!0),M(N,I,V,`‵`,`\\backprime`),M(N,I,V,`▲`,`\\blacktriangle`),M(N,I,V,`▼`,`\\blacktriangledown`),M(N,I,V,`■`,`\\blacksquare`),M(N,I,V,`⧫`,`\\blacklozenge`),M(N,I,V,`★`,`\\bigstar`),M(N,I,V,`∢`,`\\sphericalangle`,!0),M(N,I,V,`∁`,`\\complement`,!0),M(N,I,V,`ð`,`\\eth`,!0),M(P,F,V,`ð`,`ð`),M(N,I,V,`╱`,`\\diagup`),M(N,I,V,`╲`,`\\diagdown`),M(N,I,V,`□`,`\\square`),M(N,I,V,`□`,`\\Box`),M(N,I,V,`◊`,`\\Diamond`),M(N,I,V,`¥`,`\\yen`,!0),M(P,I,V,`¥`,`\\yen`,!0),M(N,I,V,`✓`,`\\checkmark`,!0),M(P,I,V,`✓`,`\\checkmark`),M(N,I,V,`ℶ`,`\\beth`,!0),M(N,I,V,`ℸ`,`\\daleth`,!0),M(N,I,V,`ℷ`,`\\gimel`,!0),M(N,I,V,`ϝ`,`\\digamma`,!0),M(N,I,V,`ϰ`,`\\varkappa`),M(N,I,Pi,`┌`,`\\@ulcorner`,!0),M(N,I,ji,`┐`,`\\@urcorner`,!0),M(N,I,Pi,`└`,`\\@llcorner`,!0),M(N,I,ji,`┘`,`\\@lrcorner`,!0),M(N,I,B,`≦`,`\\leqq`,!0),M(N,I,B,`⩽`,`\\leqslant`,!0),M(N,I,B,`⪕`,`\\eqslantless`,!0),M(N,I,B,`≲`,`\\lesssim`,!0),M(N,I,B,`⪅`,`\\lessapprox`,!0),M(N,I,B,`≊`,`\\approxeq`,!0),M(N,I,R,`⋖`,`\\lessdot`),M(N,I,B,`⋘`,`\\lll`,!0),M(N,I,B,`≶`,`\\lessgtr`,!0),M(N,I,B,`⋚`,`\\lesseqgtr`,!0),M(N,I,B,`⪋`,`\\lesseqqgtr`,!0),M(N,I,B,`≑`,`\\doteqdot`),M(N,I,B,`≓`,`\\risingdotseq`,!0),M(N,I,B,`≒`,`\\fallingdotseq`,!0),M(N,I,B,`∽`,`\\backsim`,!0),M(N,I,B,`⋍`,`\\backsimeq`,!0),M(N,I,B,`⫅`,`\\subseteqq`,!0),M(N,I,B,`⋐`,`\\Subset`,!0),M(N,I,B,`⊏`,`\\sqsubset`,!0),M(N,I,B,`≼`,`\\preccurlyeq`,!0),M(N,I,B,`⋞`,`\\curlyeqprec`,!0),M(N,I,B,`≾`,`\\precsim`,!0),M(N,I,B,`⪷`,`\\precapprox`,!0),M(N,I,B,`⊲`,`\\vartriangleleft`),M(N,I,B,`⊴`,`\\trianglelefteq`),M(N,I,B,`⊨`,`\\vDash`,!0),M(N,I,B,`⊪`,`\\Vvdash`,!0),M(N,I,B,`⌣`,`\\smallsmile`),M(N,I,B,`⌢`,`\\smallfrown`),M(N,I,B,`≏`,`\\bumpeq`,!0),M(N,I,B,`≎`,`\\Bumpeq`,!0),M(N,I,B,`≧`,`\\geqq`,!0),M(N,I,B,`⩾`,`\\geqslant`,!0),M(N,I,B,`⪖`,`\\eqslantgtr`,!0),M(N,I,B,`≳`,`\\gtrsim`,!0),M(N,I,B,`⪆`,`\\gtrapprox`,!0),M(N,I,R,`⋗`,`\\gtrdot`),M(N,I,B,`⋙`,`\\ggg`,!0),M(N,I,B,`≷`,`\\gtrless`,!0),M(N,I,B,`⋛`,`\\gtreqless`,!0),M(N,I,B,`⪌`,`\\gtreqqless`,!0),M(N,I,B,`≖`,`\\eqcirc`,!0),M(N,I,B,`≗`,`\\circeq`,!0),M(N,I,B,`≜`,`\\triangleq`,!0),M(N,I,B,`∼`,`\\thicksim`),M(N,I,B,`≈`,`\\thickapprox`),M(N,I,B,`⫆`,`\\supseteqq`,!0),M(N,I,B,`⋑`,`\\Supset`,!0),M(N,I,B,`⊐`,`\\sqsupset`,!0),M(N,I,B,`≽`,`\\succcurlyeq`,!0),M(N,I,B,`⋟`,`\\curlyeqsucc`,!0),M(N,I,B,`≿`,`\\succsim`,!0),M(N,I,B,`⪸`,`\\succapprox`,!0),M(N,I,B,`⊳`,`\\vartriangleright`),M(N,I,B,`⊵`,`\\trianglerighteq`),M(N,I,B,`⊩`,`\\Vdash`,!0),M(N,I,B,`∣`,`\\shortmid`),M(N,I,B,`∥`,`\\shortparallel`),M(N,I,B,`≬`,`\\between`,!0),M(N,I,B,`⋔`,`\\pitchfork`,!0),M(N,I,B,`∝`,`\\varpropto`),M(N,I,B,`◀`,`\\blacktriangleleft`),M(N,I,B,`∴`,`\\therefore`,!0),M(N,I,B,`∍`,`\\backepsilon`),M(N,I,B,`▶`,`\\blacktriangleright`),M(N,I,B,`∵`,`\\because`,!0),M(N,I,B,`⋘`,`\\llless`),M(N,I,B,`⋙`,`\\gggtr`),M(N,I,R,`⊲`,`\\lhd`),M(N,I,R,`⊳`,`\\rhd`),M(N,I,B,`≂`,`\\eqsim`,!0),M(N,F,B,`⋈`,`\\Join`),M(N,I,B,`≑`,`\\Doteq`,!0),M(N,I,R,`∔`,`\\dotplus`,!0),M(N,I,R,`∖`,`\\smallsetminus`),M(N,I,R,`⋒`,`\\Cap`,!0),M(N,I,R,`⋓`,`\\Cup`,!0),M(N,I,R,`⩞`,`\\doublebarwedge`,!0),M(N,I,R,`⊟`,`\\boxminus`,!0),M(N,I,R,`⊞`,`\\boxplus`,!0),M(N,I,R,`⋇`,`\\divideontimes`,!0),M(N,I,R,`⋉`,`\\ltimes`,!0),M(N,I,R,`⋊`,`\\rtimes`,!0),M(N,I,R,`⋋`,`\\leftthreetimes`,!0),M(N,I,R,`⋌`,`\\rightthreetimes`,!0),M(N,I,R,`⋏`,`\\curlywedge`,!0),M(N,I,R,`⋎`,`\\curlyvee`,!0),M(N,I,R,`⊝`,`\\circleddash`,!0),M(N,I,R,`⊛`,`\\circledast`,!0),M(N,I,R,`⋅`,`\\centerdot`),M(N,I,R,`⊺`,`\\intercal`,!0),M(N,I,R,`⋒`,`\\doublecap`),M(N,I,R,`⋓`,`\\doublecup`),M(N,I,R,`⊠`,`\\boxtimes`,!0),M(N,I,B,`⇢`,`\\dashrightarrow`,!0),M(N,I,B,`⇠`,`\\dashleftarrow`,!0),M(N,I,B,`⇇`,`\\leftleftarrows`,!0),M(N,I,B,`⇆`,`\\leftrightarrows`,!0),M(N,I,B,`⇚`,`\\Lleftarrow`,!0),M(N,I,B,`↞`,`\\twoheadleftarrow`,!0),M(N,I,B,`↢`,`\\leftarrowtail`,!0),M(N,I,B,`↫`,`\\looparrowleft`,!0),M(N,I,B,`⇋`,`\\leftrightharpoons`,!0),M(N,I,B,`↶`,`\\curvearrowleft`,!0),M(N,I,B,`↺`,`\\circlearrowleft`,!0),M(N,I,B,`↰`,`\\Lsh`,!0),M(N,I,B,`⇈`,`\\upuparrows`,!0),M(N,I,B,`↿`,`\\upharpoonleft`,!0),M(N,I,B,`⇃`,`\\downharpoonleft`,!0),M(N,F,B,`⊶`,`\\origof`,!0),M(N,F,B,`⊷`,`\\imageof`,!0),M(N,I,B,`⊸`,`\\multimap`,!0),M(N,I,B,`↭`,`\\leftrightsquigarrow`,!0),M(N,I,B,`⇉`,`\\rightrightarrows`,!0),M(N,I,B,`⇄`,`\\rightleftarrows`,!0),M(N,I,B,`↠`,`\\twoheadrightarrow`,!0),M(N,I,B,`↣`,`\\rightarrowtail`,!0),M(N,I,B,`↬`,`\\looparrowright`,!0),M(N,I,B,`↷`,`\\curvearrowright`,!0),M(N,I,B,`↻`,`\\circlearrowright`,!0),M(N,I,B,`↱`,`\\Rsh`,!0),M(N,I,B,`⇊`,`\\downdownarrows`,!0),M(N,I,B,`↾`,`\\upharpoonright`,!0),M(N,I,B,`⇂`,`\\downharpoonright`,!0),M(N,I,B,`⇝`,`\\rightsquigarrow`,!0),M(N,I,B,`⇝`,`\\leadsto`),M(N,I,B,`⇛`,`\\Rrightarrow`,!0),M(N,I,B,`↾`,`\\restriction`),M(N,F,V,`‘`,"`"),M(N,F,V,`$`,`\\$`),M(P,F,V,`$`,`\\$`),M(P,F,V,`$`,`\\textdollar`),M(N,F,V,`%`,`\\%`),M(P,F,V,`%`,`\\%`),M(N,F,V,`_`,`\\_`),M(P,F,V,`_`,`\\_`),M(P,F,V,`_`,`\\textunderscore`),M(N,F,V,`∠`,`\\angle`,!0),M(N,F,V,`∞`,`\\infty`,!0),M(N,F,V,`′`,`\\prime`),M(N,F,V,`△`,`\\triangle`),M(N,F,V,`Γ`,`\\Gamma`,!0),M(N,F,V,`Δ`,`\\Delta`,!0),M(N,F,V,`Θ`,`\\Theta`,!0),M(N,F,V,`Λ`,`\\Lambda`,!0),M(N,F,V,`Ξ`,`\\Xi`,!0),M(N,F,V,`Π`,`\\Pi`,!0),M(N,F,V,`Σ`,`\\Sigma`,!0),M(N,F,V,`Υ`,`\\Upsilon`,!0),M(N,F,V,`Φ`,`\\Phi`,!0),M(N,F,V,`Ψ`,`\\Psi`,!0),M(N,F,V,`Ω`,`\\Omega`,!0),M(N,F,V,`A`,`Α`),M(N,F,V,`B`,`Β`),M(N,F,V,`E`,`Ε`),M(N,F,V,`Z`,`Ζ`),M(N,F,V,`H`,`Η`),M(N,F,V,`I`,`Ι`),M(N,F,V,`K`,`Κ`),M(N,F,V,`M`,`Μ`),M(N,F,V,`N`,`Ν`),M(N,F,V,`O`,`Ο`),M(N,F,V,`P`,`Ρ`),M(N,F,V,`T`,`Τ`),M(N,F,V,`X`,`Χ`),M(N,F,V,`¬`,`\\neg`,!0),M(N,F,V,`¬`,`\\lnot`),M(N,F,V,`⊤`,`\\top`),M(N,F,V,`⊥`,`\\bot`),M(N,F,V,`∅`,`\\emptyset`),M(N,I,V,`∅`,`\\varnothing`),M(N,F,z,`α`,`\\alpha`,!0),M(N,F,z,`β`,`\\beta`,!0),M(N,F,z,`γ`,`\\gamma`,!0),M(N,F,z,`δ`,`\\delta`,!0),M(N,F,z,`ϵ`,`\\epsilon`,!0),M(N,F,z,`ζ`,`\\zeta`,!0),M(N,F,z,`η`,`\\eta`,!0),M(N,F,z,`θ`,`\\theta`,!0),M(N,F,z,`ι`,`\\iota`,!0),M(N,F,z,`κ`,`\\kappa`,!0),M(N,F,z,`λ`,`\\lambda`,!0),M(N,F,z,`μ`,`\\mu`,!0),M(N,F,z,`ν`,`\\nu`,!0),M(N,F,z,`ξ`,`\\xi`,!0),M(N,F,z,`ο`,`\\omicron`,!0),M(N,F,z,`π`,`\\pi`,!0),M(N,F,z,`ρ`,`\\rho`,!0),M(N,F,z,`σ`,`\\sigma`,!0),M(N,F,z,`τ`,`\\tau`,!0),M(N,F,z,`υ`,`\\upsilon`,!0),M(N,F,z,`ϕ`,`\\phi`,!0),M(N,F,z,`χ`,`\\chi`,!0),M(N,F,z,`ψ`,`\\psi`,!0),M(N,F,z,`ω`,`\\omega`,!0),M(N,F,z,`ε`,`\\varepsilon`,!0),M(N,F,z,`ϑ`,`\\vartheta`,!0),M(N,F,z,`ϖ`,`\\varpi`,!0),M(N,F,z,`ϱ`,`\\varrho`,!0),M(N,F,z,`ς`,`\\varsigma`,!0),M(N,F,z,`φ`,`\\varphi`,!0),M(N,F,R,`∗`,`*`,!0),M(N,F,R,`+`,`+`),M(N,F,R,`−`,`-`,!0),M(N,F,R,`⋅`,`\\cdot`,!0),M(N,F,R,`∘`,`\\circ`,!0),M(N,F,R,`÷`,`\\div`,!0),M(N,F,R,`±`,`\\pm`,!0),M(N,F,R,`×`,`\\times`,!0),M(N,F,R,`∩`,`\\cap`,!0),M(N,F,R,`∪`,`\\cup`,!0),M(N,F,R,`∖`,`\\setminus`,!0),M(N,F,R,`∧`,`\\land`),M(N,F,R,`∨`,`\\lor`),M(N,F,R,`∧`,`\\wedge`,!0),M(N,F,R,`∨`,`\\vee`,!0),M(N,F,V,`√`,`\\surd`),M(N,F,Pi,`⟨`,`\\langle`,!0),M(N,F,Pi,`∣`,`\\lvert`),M(N,F,Pi,`∥`,`\\lVert`),M(N,F,ji,`?`,`?`),M(N,F,ji,`!`,`!`),M(N,F,ji,`⟩`,`\\rangle`,!0),M(N,F,ji,`∣`,`\\rvert`),M(N,F,ji,`∥`,`\\rVert`),M(N,F,B,`=`,`=`),M(N,F,B,`:`,`:`),M(N,F,B,`≈`,`\\approx`,!0),M(N,F,B,`≅`,`\\cong`,!0),M(N,F,B,`≥`,`\\ge`),M(N,F,B,`≥`,`\\geq`,!0),M(N,F,B,`←`,`\\gets`),M(N,F,B,`>`,`\\gt`,!0),M(N,F,B,`∈`,`\\in`,!0),M(N,F,B,``,`\\@not`),M(N,F,B,`⊂`,`\\subset`,!0),M(N,F,B,`⊃`,`\\supset`,!0),M(N,F,B,`⊆`,`\\subseteq`,!0),M(N,F,B,`⊇`,`\\supseteq`,!0),M(N,I,B,`⊈`,`\\nsubseteq`,!0),M(N,I,B,`⊉`,`\\nsupseteq`,!0),M(N,F,B,`⊨`,`\\models`),M(N,F,B,`←`,`\\leftarrow`,!0),M(N,F,B,`≤`,`\\le`),M(N,F,B,`≤`,`\\leq`,!0),M(N,F,B,`<`,`\\lt`,!0),M(N,F,B,`→`,`\\rightarrow`,!0),M(N,F,B,`→`,`\\to`),M(N,I,B,`≱`,`\\ngeq`,!0),M(N,I,B,`≰`,`\\nleq`,!0),M(N,F,Ii,`\xA0`,`\\ `),M(N,F,Ii,`\xA0`,`\\space`),M(N,F,Ii,`\xA0`,`\\nobreakspace`),M(P,F,Ii,`\xA0`,`\\ `),M(P,F,Ii,`\xA0`,` `),M(P,F,Ii,`\xA0`,`\\space`),M(P,F,Ii,`\xA0`,`\\nobreakspace`),M(N,F,Ii,``,`\\nobreak`),M(N,F,Ii,``,`\\allowbreak`),M(N,F,Fi,`,`,`,`),M(N,F,Fi,`;`,`;`),M(N,I,R,`⊼`,`\\barwedge`,!0),M(N,I,R,`⊻`,`\\veebar`,!0),M(N,F,R,`⊙`,`\\odot`,!0),M(N,F,R,`⊕`,`\\oplus`,!0),M(N,F,R,`⊗`,`\\otimes`,!0),M(N,F,V,`∂`,`\\partial`,!0),M(N,F,R,`⊘`,`\\oslash`,!0),M(N,I,R,`⊚`,`\\circledcirc`,!0),M(N,I,R,`⊡`,`\\boxdot`,!0),M(N,F,R,`△`,`\\bigtriangleup`),M(N,F,R,`▽`,`\\bigtriangledown`),M(N,F,R,`†`,`\\dagger`),M(N,F,R,`⋄`,`\\diamond`),M(N,F,R,`⋆`,`\\star`),M(N,F,R,`◃`,`\\triangleleft`),M(N,F,R,`▹`,`\\triangleright`),M(N,F,Pi,`{`,`\\{`),M(P,F,V,`{`,`\\{`),M(P,F,V,`{`,`\\textbraceleft`),M(N,F,ji,`}`,`\\}`),M(P,F,V,`}`,`\\}`),M(P,F,V,`}`,`\\textbraceright`),M(N,F,Pi,`{`,`\\lbrace`),M(N,F,ji,`}`,`\\rbrace`),M(N,F,Pi,`[`,`\\lbrack`,!0),M(P,F,V,`[`,`\\lbrack`,!0),M(N,F,ji,`]`,`\\rbrack`,!0),M(P,F,V,`]`,`\\rbrack`,!0),M(N,F,Pi,`(`,`\\lparen`,!0),M(N,F,ji,`)`,`\\rparen`,!0),M(P,F,V,`<`,`\\textless`,!0),M(P,F,V,`>`,`\\textgreater`,!0),M(N,F,Pi,`⌊`,`\\lfloor`,!0),M(N,F,ji,`⌋`,`\\rfloor`,!0),M(N,F,Pi,`⌈`,`\\lceil`,!0),M(N,F,ji,`⌉`,`\\rceil`,!0),M(N,F,V,`\\`,`\\backslash`),M(N,F,V,`∣`,`|`),M(N,F,V,`∣`,`\\vert`),M(P,F,V,`|`,`\\textbar`,!0),M(N,F,V,`∥`,`\\|`),M(N,F,V,`∥`,`\\Vert`),M(P,F,V,`∥`,`\\textbardbl`),M(P,F,V,`~`,`\\textasciitilde`),M(P,F,V,`\\`,`\\textbackslash`),M(P,F,V,`^`,`\\textasciicircum`),M(N,F,B,`↑`,`\\uparrow`,!0),M(N,F,B,`⇑`,`\\Uparrow`,!0),M(N,F,B,`↓`,`\\downarrow`,!0),M(N,F,B,`⇓`,`\\Downarrow`,!0),M(N,F,B,`↕`,`\\updownarrow`,!0),M(N,F,B,`⇕`,`\\Updownarrow`,!0),M(N,F,Ni,`∐`,`\\coprod`),M(N,F,Ni,`⋁`,`\\bigvee`),M(N,F,Ni,`⋀`,`\\bigwedge`),M(N,F,Ni,`⨄`,`\\biguplus`),M(N,F,Ni,`⋂`,`\\bigcap`),M(N,F,Ni,`⋃`,`\\bigcup`),M(N,F,Ni,`∫`,`\\int`),M(N,F,Ni,`∫`,`\\intop`),M(N,F,Ni,`∬`,`\\iint`),M(N,F,Ni,`∭`,`\\iiint`),M(N,F,Ni,`∏`,`\\prod`),M(N,F,Ni,`∑`,`\\sum`),M(N,F,Ni,`⨂`,`\\bigotimes`),M(N,F,Ni,`⨁`,`\\bigoplus`),M(N,F,Ni,`⨀`,`\\bigodot`),M(N,F,Ni,`∮`,`\\oint`),M(N,F,Ni,`∯`,`\\oiint`),M(N,F,Ni,`∰`,`\\oiiint`),M(N,F,Ni,`⨆`,`\\bigsqcup`),M(N,F,Ni,`∫`,`\\smallint`),M(P,F,Mi,`…`,`\\textellipsis`),M(N,F,Mi,`…`,`\\mathellipsis`),M(P,F,Mi,`…`,`\\ldots`,!0),M(N,F,Mi,`…`,`\\ldots`,!0),M(N,F,Mi,`⋯`,`\\@cdots`,!0),M(N,F,Mi,`⋱`,`\\ddots`,!0),M(N,F,V,`⋮`,`\\varvdots`),M(P,F,V,`⋮`,`\\varvdots`),M(N,F,L,`ˊ`,`\\acute`),M(N,F,L,`ˋ`,`\\grave`),M(N,F,L,`¨`,`\\ddot`),M(N,F,L,`~`,`\\tilde`),M(N,F,L,`ˉ`,`\\bar`),M(N,F,L,`˘`,`\\breve`),M(N,F,L,`ˇ`,`\\check`),M(N,F,L,`^`,`\\hat`),M(N,F,L,`⃗`,`\\vec`),M(N,F,L,`˙`,`\\dot`),M(N,F,L,`˚`,`\\mathring`),M(N,F,z,``,`\\@imath`),M(N,F,z,``,`\\@jmath`),M(N,F,V,`ı`,`ı`),M(N,F,V,`ȷ`,`ȷ`),M(P,F,V,`ı`,`\\i`,!0),M(P,F,V,`ȷ`,`\\j`,!0),M(P,F,V,`ß`,`\\ss`,!0),M(P,F,V,`æ`,`\\ae`,!0),M(P,F,V,`œ`,`\\oe`,!0),M(P,F,V,`ø`,`\\o`,!0),M(P,F,V,`Æ`,`\\AE`,!0),M(P,F,V,`Œ`,`\\OE`,!0),M(P,F,V,`Ø`,`\\O`,!0),M(P,F,L,`ˊ`,`\\'`),M(P,F,L,`ˋ`,"\\`"),M(P,F,L,`ˆ`,`\\^`),M(P,F,L,`˜`,`\\~`),M(P,F,L,`ˉ`,`\\=`),M(P,F,L,`˘`,`\\u`),M(P,F,L,`˙`,`\\.`),M(P,F,L,`¸`,`\\c`),M(P,F,L,`˚`,`\\r`),M(P,F,L,`ˇ`,`\\v`),M(P,F,L,`¨`,`\\"`),M(P,F,L,`˝`,`\\H`),M(P,F,L,`◯`,`\\textcircled`);var Li={"--":!0,"---":!0,"``":!0,"''":!0};M(P,F,V,`–`,`--`,!0),M(P,F,V,`–`,`\\textendash`),M(P,F,V,`—`,`---`,!0),M(P,F,V,`—`,`\\textemdash`),M(P,F,V,`‘`,"`",!0),M(P,F,V,`‘`,`\\textquoteleft`),M(P,F,V,`’`,`'`,!0),M(P,F,V,`’`,`\\textquoteright`),M(P,F,V,`“`,"``",!0),M(P,F,V,`“`,`\\textquotedblleft`),M(P,F,V,`”`,`''`,!0),M(P,F,V,`”`,`\\textquotedblright`),M(N,F,V,`°`,`\\degree`,!0),M(P,F,V,`°`,`\\degree`),M(P,F,V,`°`,`\\textdegree`,!0),M(N,F,V,`£`,`\\pounds`),M(N,F,V,`£`,`\\mathsterling`,!0),M(P,F,V,`£`,`\\pounds`),M(P,F,V,`£`,`\\textsterling`,!0),M(N,I,V,`✠`,`\\maltese`),M(P,I,V,`✠`,`\\maltese`);for(var Ri=`0123456789/@."`,zi=0;zi<Ri.length;zi++){var Bi=Ri.charAt(zi);M(N,F,V,Bi,Bi)}for(var Vi=`0123456789!@*()-=+";:?/.,`,Hi=0;Hi<Vi.length;Hi++){var Ui=Vi.charAt(Hi);M(P,F,V,Ui,Ui)}for(var Wi=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`,Gi=0;Gi<Wi.length;Gi++){var Ki=Wi.charAt(Gi);M(N,F,z,Ki,Ki),M(P,F,V,Ki,Ki)}M(N,I,V,`C`,`ℂ`),M(P,I,V,`C`,`ℂ`),M(N,I,V,`H`,`ℍ`),M(P,I,V,`H`,`ℍ`),M(N,I,V,`N`,`ℕ`),M(P,I,V,`N`,`ℕ`),M(N,I,V,`P`,`ℙ`),M(P,I,V,`P`,`ℙ`),M(N,I,V,`Q`,`ℚ`),M(P,I,V,`Q`,`ℚ`),M(N,I,V,`R`,`ℝ`),M(P,I,V,`R`,`ℝ`),M(N,I,V,`Z`,`ℤ`),M(P,I,V,`Z`,`ℤ`),M(N,F,z,`h`,`ℎ`),M(P,F,z,`h`,`ℎ`);for(var H,qi=0;qi<Wi.length;qi++){var U=Wi.charAt(qi);H=String.fromCharCode(55349,56320+qi),M(N,F,z,U,H),M(P,F,V,U,H),H=String.fromCharCode(55349,56372+qi),M(N,F,z,U,H),M(P,F,V,U,H),H=String.fromCharCode(55349,56424+qi),M(N,F,z,U,H),M(P,F,V,U,H),H=String.fromCharCode(55349,56580+qi),M(N,F,z,U,H),M(P,F,V,U,H),H=String.fromCharCode(55349,56684+qi),M(N,F,z,U,H),M(P,F,V,U,H),H=String.fromCharCode(55349,56736+qi),M(N,F,z,U,H),M(P,F,V,U,H),H=String.fromCharCode(55349,56788+qi),M(N,F,z,U,H),M(P,F,V,U,H),H=String.fromCharCode(55349,56840+qi),M(N,F,z,U,H),M(P,F,V,U,H),H=String.fromCharCode(55349,56944+qi),M(N,F,z,U,H),M(P,F,V,U,H),qi<26&&(H=String.fromCharCode(55349,56632+qi),M(N,F,z,U,H),M(P,F,V,U,H),H=String.fromCharCode(55349,56476+qi),M(N,F,z,U,H),M(P,F,V,U,H))}H=String.fromCharCode(55349,56668),M(N,F,z,`k`,H),M(P,F,V,`k`,H);for(var Ji=0;Ji<10;Ji++){var Yi=Ji.toString();H=String.fromCharCode(55349,57294+Ji),M(N,F,z,Yi,H),M(P,F,V,Yi,H),H=String.fromCharCode(55349,57314+Ji),M(N,F,z,Yi,H),M(P,F,V,Yi,H),H=String.fromCharCode(55349,57324+Ji),M(N,F,z,Yi,H),M(P,F,V,Yi,H),H=String.fromCharCode(55349,57334+Ji),M(N,F,z,Yi,H),M(P,F,V,Yi,H)}for(var Xi=`ÐÞþ`,Zi=0;Zi<Xi.length;Zi++){var Qi=Xi.charAt(Zi);M(N,F,z,Qi,Qi),M(P,F,V,Qi,Qi)}var $i={mathClass:`mathbf`,textClass:`textbf`,font:`Main-Bold`},ea={mathClass:`mathnormal`,textClass:`textit`,font:`Math-Italic`},ta={mathClass:`boldsymbol`,textClass:`boldsymbol`,font:`Main-BoldItalic`},na={mathClass:`mathscr`,textClass:`textscr`,font:`Script-Regular`},ra={mathClass:``,textClass:``,font:``},ia={mathClass:`mathfrak`,textClass:`textfrak`,font:`Fraktur-Regular`},aa={mathClass:`mathbb`,textClass:`textbb`,font:`AMS-Regular`},oa={mathClass:`mathboldfrak`,textClass:`textboldfrak`,font:`Fraktur-Regular`},sa={mathClass:`mathsf`,textClass:`textsf`,font:`SansSerif-Regular`},ca={mathClass:`mathboldsf`,textClass:`textboldsf`,font:`SansSerif-Bold`},la={mathClass:`mathitsf`,textClass:`textitsf`,font:`SansSerif-Italic`},ua={mathClass:`mathtt`,textClass:`texttt`,font:`Typewriter-Regular`},da=[$i,$i,ea,ea,ta,ta,na,ra,ra,ra,ia,ia,aa,aa,oa,oa,sa,sa,ca,ca,la,la,ra,ra,ua,ua],fa=[$i,ra,sa,ca,ua],pa=e=>{var t=e.charCodeAt(0),n=e.charCodeAt(1),r=(t-55296)*1024+(n-56320)+65536;if(119808<=r&&r<120484){var i=Math.floor((r-119808)/26);return da[i]}else if(120782<=r&&r<=120831){var a=Math.floor((r-120782)/10);return fa[a]}else if(r===120485||r===120486)return da[0];else if(120486<r&&r<120782)return ra;else throw new D(`Unsupported character: `+e)},ma=function(e,t,n){if(j[n][e]){var r=j[n][e].replace;r&&(e=r)}return{value:e,metrics:Oi(e,t,n)}},ha=function(e,t,n,r,i){var a=ma(e,t,n),o=a.metrics;e=a.value;var s;if(o){var c=o.italic;(n===`text`||r&&r.font===`mathit`)&&(c=0),s=new _i(e,o.height,o.depth,c,o.skew,o.width,i)}else typeof console<`u`&&console.warn(`No character metrics `+(`for '`+e+`' in style '`+t+`' and mode '`+n+`'`)),s=new _i(e,0,0,0,0,0,i);if(r){s.maxFontSize=r.sizeMultiplier,r.style.isTight()&&s.classes.push(`mtight`);var l=r.getColor();l&&(s.style.color=l)}return s},ga=function(e,t,n,r){return r===void 0&&(r=[]),n.font===`boldsymbol`&&ma(e,`Main-Bold`,t).metrics?ha(e,`Main-Bold`,t,n,r.concat([`mathbf`])):e===`\\`||j[t][e].font===`main`?ha(e,`Main-Regular`,t,n,r):ha(e,`AMS-Regular`,t,n,r.concat([`amsrm`]))},_a=function(e,t,n){return n!==`textord`&&ma(e,`Math-BoldItalic`,t).metrics?{fontName:`Math-BoldItalic`,fontClass:`boldsymbol`}:{fontName:`Main-Bold`,fontClass:`mathbf`}},va=function(e,t,n){var r=e.mode,i=e.text,a=[`mord`],{font:o,fontFamily:s,fontWeight:c,fontShape:l}=t,u=r===`math`||r===`text`&&!!o,d=u?o:s,f=``,p=``;if(i.charCodeAt(0)===55349){var m=pa(i);f=m.font,p=m[r+`Class`]}if(f)return ha(i,f,r,t,a.concat(p));if(d){var h,g;if(d===`boldsymbol`){var _=_a(i,r,n);h=_.fontName,g=[_.fontClass]}else u?(h=Aa[o].fontName,g=[o]):(h=ka(s,c,l),g=[s,c,l]);if(ma(i,h,r).metrics)return ha(i,h,r,t,a.concat(g));if(Li.hasOwnProperty(i)&&h.slice(0,10)===`Typewriter`){for(var v=[],y=0;y<i.length;y++)v.push(ha(i[y],h,r,t,a.concat(g)));return Ta(v)}}if(n===`mathord`)return ha(i,`Math-Italic`,r,t,a.concat([`mathnormal`]));if(n===`textord`){var b=j[r][i]&&j[r][i].font;if(b===`ams`){var ee=ka(`amsrm`,c,l);return ha(i,ee,r,t,a.concat(`amsrm`,c,l))}else if(b===`main`||!b){var x=ka(`textrm`,c,l);return ha(i,x,r,t,a.concat(c,l))}else{var S=ka(b,c,l);return ha(i,S,r,t,a.concat(S,c,l))}}else throw Error(`unexpected type: `+n+` in makeOrd`)},ya=(e,t)=>{if(si(e.classes)!==si(t.classes)||e.skew!==t.skew||e.maxFontSize!==t.maxFontSize||e.italic!==0&&e.hasClass(`mathnormal`))return!1;if(e.classes.length===1){var n=e.classes[0];if(n===`mbin`||n===`mord`)return!1}for(var r of Object.keys(e.style))if(e.style[r]!==t.style[r])return!1;for(var i of Object.keys(t.style))if(e.style[i]!==t.style[i])return!1;return!0},ba=e=>{for(var t=0;t<e.length-1;t++){var n=e[t],r=e[t+1];n instanceof _i&&r instanceof _i&&ya(n,r)&&(n.text+=r.text,n.height=Math.max(n.height,r.height),n.depth=Math.max(n.depth,r.depth),n.italic=r.italic,e.splice(t+1,1),t--)}return e},xa=function(e){for(var t=0,n=0,r=0,i=0;i<e.children.length;i++){var a=e.children[i];a.height>t&&(t=a.height),a.depth>n&&(n=a.depth),a.maxFontSize>r&&(r=a.maxFontSize)}e.height=t,e.depth=n,e.maxFontSize=r},W=function(e,t,n,r){var i=new pi(e,t,n,r);return xa(i),i},Sa=(e,t,n,r)=>new pi(e,t,n,r),Ca=function(e,t,n){var r=W([e],[],t);return r.height=Math.max(n||t.fontMetrics().defaultRuleThickness,t.minRuleThickness),r.style.borderBottomWidth=A(r.height),r.maxFontSize=1,r},wa=function(e,t,n,r){var i=new mi(e,t,n,r);return xa(i),i},Ta=function(e){var t=new ri(e);return xa(t),t},Ea=function(e,t){return e instanceof ri?W([],[e],t):e},Da=function(e){if(e.positionType===`individualShift`){for(var t=e.children,n=[t[0]],r=-t[0].shift-t[0].elem.depth,i=r,a=1;a<t.length;a++){var o=-t[a].shift-i-t[a].elem.depth,s=o-(t[a-1].elem.height+t[a-1].elem.depth);i+=o,n.push({type:`kern`,size:s}),n.push(t[a])}return{children:n,depth:r}}var c;if(e.positionType===`top`){for(var l=e.positionData,u=0;u<e.children.length;u++){var d=e.children[u];l-=d.type===`kern`?d.size:d.elem.height+d.elem.depth}c=l}else if(e.positionType===`bottom`)c=-e.positionData;else{var f=e.children[0];if(f.type!==`elem`)throw Error(`First child must have type "elem".`);if(e.positionType===`shift`)c=-f.elem.depth-e.positionData;else if(e.positionType===`firstBaseline`)c=-f.elem.depth;else throw Error(`Invalid positionType `+e.positionType+`.`)}return{children:e.children,depth:c}},G=function(e,t){for(var{children:n,depth:r}=Da(e),i=0,a=0;a<n.length;a++){var o=n[a];if(o.type===`elem`){var s=o.elem;i=Math.max(i,s.maxFontSize,s.height)}}i+=2;var c=W([`pstrut`],[]);c.style.height=A(i);for(var l=[],u=r,d=r,f=r,p=0;p<n.length;p++){var m=n[p];if(m.type===`kern`)f+=m.size;else{var h=m.elem,g=m.wrapperClasses||[],_=m.wrapperStyle||{},v=W(g,[c,h],void 0,_);v.style.top=A(-i-f-h.depth),m.marginLeft&&(v.style.marginLeft=m.marginLeft),m.marginRight&&(v.style.marginRight=m.marginRight),l.push(v),f+=h.height+h.depth}u=Math.min(u,f),d=Math.max(d,f)}var y=W([`vlist`],l);y.style.height=A(d);var b;if(u<0){var ee=W([],[]),x=W([`vlist`],[ee]);x.style.height=A(-u);var S=W([`vlist-s`],[new _i(`​`)]);b=[W([`vlist-r`],[y,S]),W([`vlist-r`],[x])]}else b=[W([`vlist-r`],[y])];var C=W([`vlist-t`],b);return b.length===2&&C.classes.push(`vlist-t2`),C.height=d,C.depth=-u,C},Oa=(e,t)=>{var n=W([`mspace`],[],t),r=k(e,t);return n.style.marginRight=A(r),n},ka=(e,t,n)=>{var r,i;switch(e){case`amsrm`:r=`AMS`;break;case`textrm`:r=`Main`;break;case`textsf`:r=`SansSerif`;break;case`texttt`:r=`Typewriter`;break;default:r=e}return i=t===`textbf`&&n===`textit`?`BoldItalic`:t===`textbf`?`Bold`:n===`textit`?`Italic`:`Regular`,r+`-`+i},Aa={mathbf:{variant:`bold`,fontName:`Main-Bold`},mathrm:{variant:`normal`,fontName:`Main-Regular`},textit:{variant:`italic`,fontName:`Main-Italic`},mathit:{variant:`italic`,fontName:`Main-Italic`},mathnormal:{variant:`italic`,fontName:`Math-Italic`},mathsfit:{variant:`sans-serif-italic`,fontName:`SansSerif-Italic`},mathbb:{variant:`double-struck`,fontName:`AMS-Regular`},mathcal:{variant:`script`,fontName:`Caligraphic-Regular`},mathfrak:{variant:`fraktur`,fontName:`Fraktur-Regular`},mathscr:{variant:`script`,fontName:`Script-Regular`},mathsf:{variant:`sans-serif`,fontName:`SansSerif-Regular`},mathtt:{variant:`monospace`,fontName:`Typewriter-Regular`}},ja={vec:[`vec`,.471,.714],oiintSize1:[`oiintSize1`,.957,.499],oiintSize2:[`oiintSize2`,1.472,.659],oiiintSize1:[`oiiintSize1`,1.304,.499],oiiintSize2:[`oiiintSize2`,1.98,.659]},Ma=function(e,t){var[n,r,i]=ja[e],a=new yi(n),o=new vi([a],{width:A(r),height:A(i),style:`width:`+A(r),viewBox:`0 0 `+1e3*r+` `+1e3*i,preserveAspectRatio:`xMinYMin`}),s=Sa([`overlay`],[o],t);return s.height=i,s.style.height=A(i),s.style.width=A(r),s},K={number:3,unit:`mu`},Na={number:4,unit:`mu`},Pa={number:5,unit:`mu`},Fa={mord:{mop:K,mbin:Na,mrel:Pa,minner:K},mop:{mord:K,mop:K,mrel:Pa,minner:K},mbin:{mord:Na,mop:Na,mopen:Na,minner:Na},mrel:{mord:Pa,mop:Pa,mopen:Pa,minner:Pa},mopen:{},mclose:{mop:K,mbin:Na,mrel:Pa,minner:K},mpunct:{mord:K,mop:K,mrel:Pa,mopen:K,mclose:K,mpunct:K,minner:K},minner:{mord:K,mop:K,mbin:Na,mrel:Pa,mopen:K,mpunct:K,minner:K}},Ia={mord:{mop:K},mop:{mord:K,mop:K},mbin:{},mrel:{},mopen:{},mclose:{mop:K},mpunct:{},minner:{mop:K}},La={},Ra={},za={};function q(e){for(var{type:t,names:n,props:r,handler:i,htmlBuilder:a,mathmlBuilder:o}=e,s={type:t,numArgs:r.numArgs,argTypes:r.argTypes,allowedInArgument:!!r.allowedInArgument,allowedInText:!!r.allowedInText,allowedInMath:r.allowedInMath===void 0?!0:r.allowedInMath,numOptionalArgs:r.numOptionalArgs||0,infix:!!r.infix,primitive:!!r.primitive,handler:i},c=0;c<n.length;++c)La[n[c]]=s;t&&(a&&(Ra[t]=a),o&&(za[t]=o))}function Ba(e){var{type:t,htmlBuilder:n,mathmlBuilder:r}=e;q({type:t,names:[],props:{numArgs:0},handler(){throw Error(`Should never be called.`)},htmlBuilder:n,mathmlBuilder:r})}var Va=function(e){return e.type===`ordgroup`&&e.body.length===1?e.body[0]:e},J=function(e){return e.type===`ordgroup`?e.body:[e]},Ha=new Set([`leftmost`,`mbin`,`mopen`,`mrel`,`mop`,`mpunct`]),Ua=new Set([`rightmost`,`mrel`,`mclose`,`mpunct`]),Wa={display:O.DISPLAY,text:O.TEXT,script:O.SCRIPT,scriptscript:O.SCRIPTSCRIPT},Ga={mord:`mord`,mop:`mop`,mbin:`mbin`,mrel:`mrel`,mopen:`mopen`,mclose:`mclose`,mpunct:`mpunct`,minner:`minner`},Ka=function(e,t,n,r){r===void 0&&(r=[null,null]);for(var i=[],a=0;a<e.length;a++){var o=Y(e[a],t);if(o instanceof ri){var s=o.children;i.push(...s)}else i.push(o)}if(ba(i),!n)return i;var c=t;if(e.length===1){var l=e[0];l.type===`sizing`?c=t.havingSize(l.size):l.type===`styling`&&(c=t.havingStyle(Wa[l.style]))}var u=W([r[0]||`leftmost`],[],t),d=W([r[1]||`rightmost`],[],t),f=n===`root`;return qa(i,(e,t)=>{var n=t.classes[0],r=e.classes[0];n===`mbin`&&Ua.has(r)?t.classes[0]=`mord`:r===`mbin`&&Ha.has(n)&&(e.classes[0]=`mord`)},{node:u},d,f),qa(i,(e,t)=>{var n=Xa(t),r=Xa(e),i=n&&r?e.hasClass(`mtight`)?Ia[n]?.[r]:Fa[n]?.[r]:null;if(i)return Oa(i,c)},{node:u},d,f),i},qa=function(e,t,n,r,i){r&&e.push(r);for(var a=0;a<e.length;a++){var o=e[a],s=Ja(o);if(s){qa(s.children,t,n,null,i);continue}var c=!o.hasClass(`mspace`);if(c){var l=t(o,n.node);l&&(n.insertAfter?n.insertAfter(l):(e.unshift(l),a++))}c?n.node=o:i&&o.hasClass(`newline`)&&(n.node=W([`leftmost`])),n.insertAfter=(t=>n=>{e.splice(t+1,0,n),a++})(a)}r&&e.pop()},Ja=function(e){return e instanceof ri||e instanceof mi||e instanceof pi&&e.hasClass(`enclosing`)?e:null},Ya=function(e,t){var n=Ja(e);if(n){var r=n.children;if(r.length){if(t===`right`)return Ya(r[r.length-1],`right`);if(t===`left`)return Ya(r[0],`left`)}}return e},Xa=function(e,t){if(!e)return null;t&&(e=Ya(e,t));var n=e.classes[0];return Ga[n]||null},Za=function(e,t){var n=[`nulldelimiter`].concat(e.baseSizingClasses());return W(t.concat(n))},Y=function(e,t,n){if(!e)return W();if(Ra[e.type]){var r=Ra[e.type](e,t);if(n&&t.size!==n.size){r=W(t.sizingClasses(n),[r],t);var i=t.sizeMultiplier/n.sizeMultiplier;r.height*=i,r.depth*=i}return r}else throw new D(`Got group of unknown type: '`+e.type+`'`)};function Qa(e,t){var n=W([`base`],e,t),r=W([`strut`]);return r.style.height=A(n.height+n.depth),n.depth&&(r.style.verticalAlign=A(-n.depth)),n.children.unshift(r),n}function $a(e,t){var n=null;e.length===1&&e[0].type===`tag`&&(n=e[0].tag,e=e[0].body);var r=Ka(e,t,`root`),i;r.length===2&&r[1].hasClass(`tag`)&&(i=r.pop());for(var a=[],o=[],s=0;s<r.length;s++)if(o.push(r[s]),r[s].hasClass(`mbin`)||r[s].hasClass(`mrel`)||r[s].hasClass(`allowbreak`)){for(var c=!1;s<r.length-1&&r[s+1].hasClass(`mspace`)&&!r[s+1].hasClass(`newline`);)s++,o.push(r[s]),r[s].hasClass(`nobreak`)&&(c=!0);c||(a.push(Qa(o,t)),o=[])}else r[s].hasClass(`newline`)&&(o.pop(),o.length>0&&(a.push(Qa(o,t)),o=[]),a.push(r[s]));o.length>0&&a.push(Qa(o,t));var l;n?(l=Qa(Ka(n,t,!0),t),l.classes=[`tag`],a.push(l)):i&&a.push(i);var u=W([`katex-html`],a);if(u.setAttribute(`aria-hidden`,`true`),l){var d=l.children[0];d.style.height=A(u.height+u.depth),u.depth&&(d.style.verticalAlign=A(-u.depth))}return u}function eo(e){return new ri(e)}var X=class{constructor(e,t,n){this.type=void 0,this.attributes=void 0,this.children=void 0,this.classes=void 0,this.type=e,this.attributes={},this.children=t||[],this.classes=n||[]}setAttribute(e,t){this.attributes[e]=t}getAttribute(e){return this.attributes[e]}toNode(){var e=document.createElementNS(`http://www.w3.org/1998/Math/MathML`,this.type);for(var t in this.attributes)Object.prototype.hasOwnProperty.call(this.attributes,t)&&e.setAttribute(t,this.attributes[t]);this.classes.length>0&&(e.className=si(this.classes));for(var n=0;n<this.children.length;n++)if(this.children[n]instanceof to&&this.children[n+1]instanceof to){for(var r=this.children[n].toText()+this.children[++n].toText();this.children[n+1]instanceof to;)r+=this.children[++n].toText();e.appendChild(new to(r).toNode())}else e.appendChild(this.children[n].toNode());return e}toMarkup(){var e=`<`+this.type;for(var t in this.attributes)Object.prototype.hasOwnProperty.call(this.attributes,t)&&(e+=` `+t+`="`,e+=pr(this.attributes[t]),e+=`"`);this.classes.length>0&&(e+=` class ="`+pr(si(this.classes))+`"`),e+=`>`;for(var n=0;n<this.children.length;n++)e+=this.children[n].toMarkup();return e+=`</`+this.type+`>`,e}toText(){return this.children.map(e=>e.toText()).join(``)}},to=class{constructor(e){this.text=void 0,this.text=e}toNode(){return document.createTextNode(this.text)}toMarkup(){return pr(this.toText())}toText(){return this.text}},no=class{constructor(e){this.width=void 0,this.character=void 0,this.width=e,e>=.05555&&e<=.05556?this.character=` `:e>=.1666&&e<=.1667?this.character=` `:e>=.2222&&e<=.2223?this.character=` `:e>=.2777&&e<=.2778?this.character=`  `:e>=-.05556&&e<=-.05555?this.character=` ⁣`:e>=-.1667&&e<=-.1666?this.character=` ⁣`:e>=-.2223&&e<=-.2222?this.character=` ⁣`:e>=-.2778&&e<=-.2777?this.character=` ⁣`:this.character=null}toNode(){if(this.character)return document.createTextNode(this.character);var e=document.createElementNS(`http://www.w3.org/1998/Math/MathML`,`mspace`);return e.setAttribute(`width`,A(this.width)),e}toMarkup(){return this.character?`<mtext>`+this.character+`</mtext>`:`<mspace width="`+A(this.width)+`"/>`}toText(){return this.character?this.character:` `}},ro=new Set([`\\imath`,`\\jmath`]),io=new Set([`mrow`,`mtable`]),ao=function(e,t,n){return j[t][e]&&j[t][e].replace&&e.charCodeAt(0)!==55349&&!(Li.hasOwnProperty(e)&&n&&(n.fontFamily&&n.fontFamily.slice(4,6)===`tt`||n.font&&n.font.slice(4,6)===`tt`))&&(e=j[t][e].replace),new to(e)},oo=function(e){return e.length===1?e[0]:new X(`mrow`,e)},so={mathit:`italic`,boldsymbol:e=>e.type===`textord`?`bold`:`bold-italic`,mathbf:`bold`,mathbb:`double-struck`,mathsfit:`sans-serif-italic`,mathfrak:`fraktur`,mathscr:`script`,mathcal:`script`,mathsf:`sans-serif`,mathtt:`monospace`},co=(e,t)=>{if(e.mode===`text`){if(t.fontFamily===`texttt`)return`monospace`;if(t.fontFamily===`textsf`)return t.fontShape===`textit`&&t.fontWeight===`textbf`?`sans-serif-bold-italic`:t.fontShape===`textit`?`sans-serif-italic`:t.fontWeight===`textbf`?`bold-sans-serif`:`sans-serif`;if(t.fontShape===`textit`&&t.fontWeight===`textbf`)return`bold-italic`;if(t.fontShape===`textit`)return`italic`;if(t.fontWeight===`textbf`)return`bold`}var n=t.font;if(!n||n===`mathnormal`)return null;var r=e.mode,i=so[n];if(i)return typeof i==`function`?i(e):i;var a=e.text;if(ro.has(a))return null;if(j[r][a]){var o=j[r][a].replace;o&&(a=o)}var s=Aa[n].fontName;return Oi(a,s,r)?Aa[n].variant:null};function lo(e){if(!e)return!1;if(e.type===`mi`&&e.children.length===1){var t=e.children[0];return t instanceof to&&t.text===`.`}else if(e.type===`mo`&&e.children.length===1&&e.getAttribute(`separator`)===`true`&&e.getAttribute(`lspace`)===`0em`&&e.getAttribute(`rspace`)===`0em`){var n=e.children[0];return n instanceof to&&n.text===`,`}else return!1}var uo=function(e,t,n){if(e.length===1){var r=Z(e[0],t);return n&&r instanceof X&&r.type===`mo`&&(r.setAttribute(`lspace`,`0em`),r.setAttribute(`rspace`,`0em`)),[r]}for(var i=[],a,o=0;o<e.length;o++){var s=Z(e[o],t);if(s instanceof X&&a instanceof X){if(s.type===`mtext`&&a.type===`mtext`&&s.getAttribute(`mathvariant`)===a.getAttribute(`mathvariant`)){a.children.push(...s.children);continue}else if(s.type===`mn`&&a.type===`mn`){a.children.push(...s.children);continue}else if(lo(s)&&a.type===`mn`){a.children.push(...s.children);continue}else if(s.type===`mn`&&lo(a))s.children=[...a.children,...s.children],i.pop();else if((s.type===`msup`||s.type===`msub`)&&s.children.length>=1&&(a.type===`mn`||lo(a))){var c=s.children[0];c instanceof X&&c.type===`mn`&&(c.children=[...a.children,...c.children],i.pop())}else if(a.type===`mi`&&a.children.length===1){var l=a.children[0];if(l instanceof to&&l.text===`̸`&&(s.type===`mo`||s.type===`mi`||s.type===`mn`)){var u=s.children[0];u instanceof to&&u.text.length>0&&(u.text=u.text.slice(0,1)+`̸`+u.text.slice(1),i.pop())}}}i.push(s),a=s}return i},fo=function(e,t,n){return oo(uo(e,t,n))},Z=function(e,t){if(!e)return new X(`mrow`);if(za[e.type])return za[e.type](e,t);throw new D(`Got group of unknown type: '`+e.type+`'`)};function po(e,t,n,r,i){var a=uo(e,n),o=a.length===1&&a[0]instanceof X&&io.has(a[0].type)?a[0]:new X(`mrow`,a),s=new X(`annotation`,[new to(t)]);s.setAttribute(`encoding`,`application/x-tex`);var c=new X(`semantics`,[o,s]),l=new X(`math`,[c]);return l.setAttribute(`xmlns`,`http://www.w3.org/1998/Math/MathML`),r&&l.setAttribute(`display`,`block`),W([i?`katex`:`katex-mathml`],[l])}var mo=[[1,1,1],[2,1,1],[3,1,1],[4,2,1],[5,2,1],[6,3,1],[7,4,2],[8,6,3],[9,7,6],[10,8,7],[11,10,9]],ho=[.5,.6,.7,.8,.9,1,1.2,1.44,1.728,2.074,2.488],go=function(e,t){return t.size<2?e:mo[e-1][t.size-1]},_o=class e{constructor(t){this.style=void 0,this.color=void 0,this.size=void 0,this.textSize=void 0,this.phantom=void 0,this.font=void 0,this.fontFamily=void 0,this.fontWeight=void 0,this.fontShape=void 0,this.sizeMultiplier=void 0,this.maxSize=void 0,this.minRuleThickness=void 0,this._fontMetrics=void 0,this.style=t.style,this.color=t.color,this.size=t.size||e.BASESIZE,this.textSize=t.textSize||this.size,this.phantom=!!t.phantom,this.font=t.font||``,this.fontFamily=t.fontFamily||``,this.fontWeight=t.fontWeight||``,this.fontShape=t.fontShape||``,this.sizeMultiplier=ho[this.size-1],this.maxSize=t.maxSize,this.minRuleThickness=t.minRuleThickness,this._fontMetrics=void 0}extend(t){var n={style:this.style,size:this.size,textSize:this.textSize,color:this.color,phantom:this.phantom,font:this.font,fontFamily:this.fontFamily,fontWeight:this.fontWeight,fontShape:this.fontShape,maxSize:this.maxSize,minRuleThickness:this.minRuleThickness};return Object.assign(n,t),new e(n)}havingStyle(e){return this.style===e?this:this.extend({style:e,size:go(this.textSize,e)})}havingCrampedStyle(){return this.havingStyle(this.style.cramp())}havingSize(e){return this.size===e&&this.textSize===e?this:this.extend({style:this.style.text(),size:e,textSize:e,sizeMultiplier:ho[e-1]})}havingBaseStyle(t){t||=this.style.text();var n=go(e.BASESIZE,t);return this.size===n&&this.textSize===e.BASESIZE&&this.style===t?this:this.extend({style:t,size:n})}havingBaseSizing(){var e;switch(this.style.id){case 4:case 5:e=3;break;case 6:case 7:e=1;break;default:e=6}return this.extend({style:this.style.text(),size:e})}withColor(e){return this.extend({color:e})}withPhantom(){return this.extend({phantom:!0})}withFont(e){return this.extend({font:e})}withTextFontFamily(e){return this.extend({fontFamily:e,font:``})}withTextFontWeight(e){return this.extend({fontWeight:e,font:``})}withTextFontShape(e){return this.extend({fontShape:e,font:``})}sizingClasses(e){return e.size===this.size?[]:[`sizing`,`reset-size`+e.size,`size`+this.size]}baseSizingClasses(){return this.size===e.BASESIZE?[]:[`sizing`,`reset-size`+this.size,`size`+e.BASESIZE]}fontMetrics(){return this._fontMetrics||=Ai(this.size),this._fontMetrics}getColor(){return this.phantom?`transparent`:this.color}};_o.BASESIZE=6;var vo=function(e){return new _o({style:e.displayMode?O.DISPLAY:O.TEXT,maxSize:e.maxSize,minRuleThickness:e.minRuleThickness})},yo=function(e,t){if(t.displayMode){var n=[`katex-display`];t.leqno&&n.push(`leqno`),t.fleqn&&n.push(`fleqn`),e=W(n,[e])}return e},bo=function(e,t,n){var r=vo(n),i;if(n.output===`mathml`)return po(e,t,r,n.displayMode,!0);if(n.output===`html`){var a=$a(e,r);i=W([`katex`],[a])}else{var o=po(e,t,r,n.displayMode,!1),s=$a(e,r);i=W([`katex`],[o,s])}return yo(i,n)},xo=function(e,t,n){var r=vo(n),i=$a(e,r),a=W([`katex`],[i]);return yo(a,n)},So={widehat:`^`,widecheck:`ˇ`,widetilde:`~`,utilde:`~`,overleftarrow:`←`,underleftarrow:`←`,xleftarrow:`←`,overrightarrow:`→`,underrightarrow:`→`,xrightarrow:`→`,underbrace:`⏟`,overbrace:`⏞`,underbracket:`⎵`,overbracket:`⎴`,overgroup:`⏠`,undergroup:`⏡`,overleftrightarrow:`↔`,underleftrightarrow:`↔`,xleftrightarrow:`↔`,Overrightarrow:`⇒`,xRightarrow:`⇒`,overleftharpoon:`↼`,xleftharpoonup:`↼`,overrightharpoon:`⇀`,xrightharpoonup:`⇀`,xLeftarrow:`⇐`,xLeftrightarrow:`⇔`,xhookleftarrow:`↩`,xhookrightarrow:`↪`,xmapsto:`↦`,xrightharpoondown:`⇁`,xleftharpoondown:`↽`,xrightleftharpoons:`⇌`,xleftrightharpoons:`⇋`,xtwoheadleftarrow:`↞`,xtwoheadrightarrow:`↠`,xlongequal:`=`,xtofrom:`⇄`,xrightleftarrows:`⇄`,xrightequilibrium:`⇌`,xleftequilibrium:`⇋`,"\\cdrightarrow":`→`,"\\cdleftarrow":`←`,"\\cdlongequal":`=`},Co=function(e){var t=new X(`mo`,[new to(So[e.replace(/^\\/,``)])]);return t.setAttribute(`stretchy`,`true`),t},wo={overrightarrow:[[`rightarrow`],.888,522,`xMaxYMin`],overleftarrow:[[`leftarrow`],.888,522,`xMinYMin`],underrightarrow:[[`rightarrow`],.888,522,`xMaxYMin`],underleftarrow:[[`leftarrow`],.888,522,`xMinYMin`],xrightarrow:[[`rightarrow`],1.469,522,`xMaxYMin`],"\\cdrightarrow":[[`rightarrow`],3,522,`xMaxYMin`],xleftarrow:[[`leftarrow`],1.469,522,`xMinYMin`],"\\cdleftarrow":[[`leftarrow`],3,522,`xMinYMin`],Overrightarrow:[[`doublerightarrow`],.888,560,`xMaxYMin`],xRightarrow:[[`doublerightarrow`],1.526,560,`xMaxYMin`],xLeftarrow:[[`doubleleftarrow`],1.526,560,`xMinYMin`],overleftharpoon:[[`leftharpoon`],.888,522,`xMinYMin`],xleftharpoonup:[[`leftharpoon`],.888,522,`xMinYMin`],xleftharpoondown:[[`leftharpoondown`],.888,522,`xMinYMin`],overrightharpoon:[[`rightharpoon`],.888,522,`xMaxYMin`],xrightharpoonup:[[`rightharpoon`],.888,522,`xMaxYMin`],xrightharpoondown:[[`rightharpoondown`],.888,522,`xMaxYMin`],xlongequal:[[`longequal`],.888,334,`xMinYMin`],"\\cdlongequal":[[`longequal`],3,334,`xMinYMin`],xtwoheadleftarrow:[[`twoheadleftarrow`],.888,334,`xMinYMin`],xtwoheadrightarrow:[[`twoheadrightarrow`],.888,334,`xMaxYMin`],overleftrightarrow:[[`leftarrow`,`rightarrow`],.888,522],overbrace:[[`leftbrace`,`midbrace`,`rightbrace`],1.6,548],underbrace:[[`leftbraceunder`,`midbraceunder`,`rightbraceunder`],1.6,548],underleftrightarrow:[[`leftarrow`,`rightarrow`],.888,522],xleftrightarrow:[[`leftarrow`,`rightarrow`],1.75,522],xLeftrightarrow:[[`doubleleftarrow`,`doublerightarrow`],1.75,560],xrightleftharpoons:[[`leftharpoondownplus`,`rightharpoonplus`],1.75,716],xleftrightharpoons:[[`leftharpoonplus`,`rightharpoondownplus`],1.75,716],xhookleftarrow:[[`leftarrow`,`righthook`],1.08,522],xhookrightarrow:[[`lefthook`,`rightarrow`],1.08,522],overlinesegment:[[`leftlinesegment`,`rightlinesegment`],.888,522],underlinesegment:[[`leftlinesegment`,`rightlinesegment`],.888,522],overbracket:[[`leftbracketover`,`rightbracketover`],1.6,440],underbracket:[[`leftbracketunder`,`rightbracketunder`],1.6,410],overgroup:[[`leftgroup`,`rightgroup`],.888,342],undergroup:[[`leftgroupunder`,`rightgroupunder`],.888,342],xmapsto:[[`leftmapsto`,`rightarrow`],1.5,522],xtofrom:[[`leftToFrom`,`rightToFrom`],1.75,528],xrightleftarrows:[[`baraboveleftarrow`,`rightarrowabovebar`],1.75,901],xrightequilibrium:[[`baraboveshortleftharpoon`,`rightharpoonaboveshortbar`],1.75,716],xleftequilibrium:[[`shortbaraboveleftharpoon`,`shortrightharpoonabovebar`],1.75,716]},To=new Set([`widehat`,`widecheck`,`widetilde`,`utilde`]),Eo=function(e,t){function n(){var n=4e5,r=e.label.slice(1);if(To.has(r)&&`base`in e){var i=e.base.type===`ordgroup`?e.base.body.length:1,a,o,s;if(i>5)r===`widehat`||r===`widecheck`?(a=420,n=2364,s=.42,o=r+`4`):(a=312,n=2340,s=.34,o=`tilde4`);else{var c=[1,1,2,2,3,3][i];r===`widehat`||r===`widecheck`?(n=[0,1062,2364,2364,2364][c],a=[0,239,300,360,420][c],s=[0,.24,.3,.3,.36,.42][c],o=r+c):(n=[0,600,1033,2339,2340][c],a=[0,260,286,306,312][c],s=[0,.26,.286,.3,.306,.34][c],o=`tilde`+c)}var l=new yi(o),u=new vi([l],{width:`100%`,height:A(s),viewBox:`0 0 `+n+` `+a,preserveAspectRatio:`none`});return{span:Sa([],[u],t),minWidth:0,height:s}}else{var d=[],f=wo[r];if(!f)throw Error(`No SVG data for "`+r+`".`);var[p,m,h]=f,g=h/1e3,_=p.length,v,y;if(_===1){if(f.length!==4)throw Error(`Expected 4-tuple for single-path SVG data "`+r+`".`);v=[`hide-tail`],y=[f[3]]}else if(_===2)v=[`halfarrow-left`,`halfarrow-right`],y=[`xMinYMin`,`xMaxYMin`];else if(_===3)v=[`brace-left`,`brace-center`,`brace-right`],y=[`xMinYMin`,`xMidYMin`,`xMaxYMin`];else throw Error(`Correct katexImagesData or update code here to support
                    `+_+` children.`);for(var b=0;b<_;b++){var ee=new yi(p[b]),x=new vi([ee],{width:`400em`,height:A(g),viewBox:`0 0 `+n+` `+h,preserveAspectRatio:y[b]+` slice`}),S=Sa([v[b]],[x],t);if(_===1)return{span:S,minWidth:m,height:g};S.style.height=A(g),d.push(S)}return{span:W([`stretchy`],d,t),minWidth:m,height:g}}}var{span:r,minWidth:i,height:a}=n();return r.height=a,r.style.height=A(a),i>0&&(r.style.minWidth=A(i)),r},Do=function(e,t,n,r,i){var a,o=e.height+e.depth+n+r;if(/fbox|color|angl/.test(t)){if(a=W([`stretchy`,t],[],i),t===`fbox`){var s=i.color&&i.getColor();s&&(a.style.borderColor=s)}}else{var c=[];/^[bx]cancel$/.test(t)&&c.push(new bi({x1:`0`,y1:`0`,x2:`100%`,y2:`100%`,"stroke-width":`0.046em`})),/^x?cancel$/.test(t)&&c.push(new bi({x1:`0`,y1:`100%`,x2:`100%`,y2:`0`,"stroke-width":`0.046em`}));var l=new vi(c,{width:`100%`,height:A(o)});a=Sa([],[l],i)}return a.height=o,a.style.height=A(o),a},Oo={bin:1,close:1,inner:1,open:1,punct:1,rel:1},ko={"accent-token":1,mathord:1,"op-token":1,spacing:1,textord:1};function Ao(e){return e in Oo}function Q(e,t){if(!e||e.type!==t)throw Error(`Expected node of type `+t+`, but got `+(e?`node of type `+e.type:String(e)));return e}function jo(e){var t=Mo(e);if(!t)throw Error(`Expected node of symbol group type, but got `+(e?`node of type `+e.type:String(e)));return t}function Mo(e){return e&&(e.type===`atom`||ko.hasOwnProperty(e.type))?e:null}var No=e=>{if(e instanceof _i)return e;if(Ci(e)&&e.children.length===1)return No(e.children[0])},Po=(e,t)=>{var n,r,i;e&&e.type===`supsub`?(r=Q(e.base,`accent`),n=r.base,e.base=n,i=Si(Y(e,t)),e.base=r):(r=Q(e,`accent`),n=r.base);var a=Y(n,t.havingCrampedStyle()),o=r.isShifty&&gr(n),s=0;o&&(s=No(a)?.skew??0);var c=r.label===`\\c`,l=c?a.height+a.depth:Math.min(a.height,t.fontMetrics().xHeight),u;if(r.isStretchy)u=Eo(r,t),u=G({positionType:`firstBaseline`,children:[{type:`elem`,elem:a},{type:`elem`,elem:u,wrapperClasses:[`svg-align`],wrapperStyle:s>0?{width:`calc(100% - `+A(2*s)+`)`,marginLeft:A(2*s)}:void 0}]});else{var d,f;r.label===`\\vec`?(d=Ma(`vec`,t),f=ja.vec[1]):(d=va({type:`textord`,mode:r.mode,text:r.label},t,`textord`),d=xi(d),d.italic=0,f=d.width,c&&(l+=d.depth)),u=W([`accent-body`],[d]);var p=r.label===`\\textcircled`;p&&(u.classes.push(`accent-full`),l=a.height);var m=s;p||(m-=f/2),u.style.left=A(m),r.label===`\\textcircled`&&(u.style.top=`.2em`),u=G({positionType:`firstBaseline`,children:[{type:`elem`,elem:a},{type:`kern`,size:-l},{type:`elem`,elem:u}]})}var h=W([`mord`,`accent`],[u],t);return i?(i.children[0]=h,i.height=Math.max(h.height,i.height),i.classes[0]=`mord`,i):h},Fo=(e,t)=>{var n=e.isStretchy?Co(e.label):new X(`mo`,[ao(e.label,e.mode)]),r=new X(`mover`,[Z(e.base,t),n]);return r.setAttribute(`accent`,`true`),r},Io=new RegExp([`\\acute`,`\\grave`,`\\ddot`,`\\tilde`,`\\bar`,`\\breve`,`\\check`,`\\hat`,`\\vec`,`\\dot`,`\\mathring`].map(e=>`\\`+e).join(`|`));q({type:`accent`,names:[`\\acute`,`\\grave`,`\\ddot`,`\\tilde`,`\\bar`,`\\breve`,`\\check`,`\\hat`,`\\vec`,`\\dot`,`\\mathring`,`\\widecheck`,`\\widehat`,`\\widetilde`,`\\overrightarrow`,`\\overleftarrow`,`\\Overrightarrow`,`\\overleftrightarrow`,`\\overgroup`,`\\overlinesegment`,`\\overleftharpoon`,`\\overrightharpoon`],props:{numArgs:1},handler:(e,t)=>{var n=Va(t[0]),r=!Io.test(e.funcName),i=!r||e.funcName===`\\widehat`||e.funcName===`\\widetilde`||e.funcName===`\\widecheck`;return{type:`accent`,mode:e.parser.mode,label:e.funcName,isStretchy:r,isShifty:i,base:n}},htmlBuilder:Po,mathmlBuilder:Fo}),q({type:`accent`,names:[`\\'`,"\\`",`\\^`,`\\~`,`\\=`,`\\u`,`\\.`,`\\"`,`\\c`,`\\r`,`\\H`,`\\v`,`\\textcircled`],props:{numArgs:1,allowedInText:!0,allowedInMath:!0,argTypes:[`primitive`]},handler:(e,t)=>{var n=t[0],r=e.parser.mode;return r===`math`&&(e.parser.settings.reportNonstrict(`mathVsTextAccents`,`LaTeX's accent `+e.funcName+` works only in text mode`),r=`text`),{type:`accent`,mode:r,label:e.funcName,isStretchy:!1,isShifty:!0,base:n}},htmlBuilder:Po,mathmlBuilder:Fo}),q({type:`accentUnder`,names:[`\\underleftarrow`,`\\underrightarrow`,`\\underleftrightarrow`,`\\undergroup`,`\\underlinesegment`,`\\utilde`],props:{numArgs:1},handler:(e,t)=>{var{parser:n,funcName:r}=e,i=t[0];return{type:`accentUnder`,mode:n.mode,label:r,base:i}},htmlBuilder:(e,t)=>{var n=Y(e.base,t),r=Eo(e,t),i=e.label===`\\utilde`?.12:0,a=G({positionType:`top`,positionData:n.height,children:[{type:`elem`,elem:r,wrapperClasses:[`svg-align`]},{type:`kern`,size:i},{type:`elem`,elem:n}]});return W([`mord`,`accentunder`],[a],t)},mathmlBuilder:(e,t)=>{var n=Co(e.label),r=new X(`munder`,[Z(e.base,t),n]);return r.setAttribute(`accentunder`,`true`),r}});var Lo=e=>{var t=new X(`mpadded`,e?[e]:[]);return t.setAttribute(`width`,`+0.6em`),t.setAttribute(`lspace`,`0.3em`),t};q({type:`xArrow`,names:[`\\xleftarrow`,`\\xrightarrow`,`\\xLeftarrow`,`\\xRightarrow`,`\\xleftrightarrow`,`\\xLeftrightarrow`,`\\xhookleftarrow`,`\\xhookrightarrow`,`\\xmapsto`,`\\xrightharpoondown`,`\\xrightharpoonup`,`\\xleftharpoondown`,`\\xleftharpoonup`,`\\xrightleftharpoons`,`\\xleftrightharpoons`,`\\xlongequal`,`\\xtwoheadrightarrow`,`\\xtwoheadleftarrow`,`\\xtofrom`,`\\xrightleftarrows`,`\\xrightequilibrium`,`\\xleftequilibrium`,`\\\\cdrightarrow`,`\\\\cdleftarrow`,`\\\\cdlongequal`],props:{numArgs:1,numOptionalArgs:1},handler(e,t,n){var{parser:r,funcName:i}=e;return{type:`xArrow`,mode:r.mode,label:i,body:t[0],below:n[0]}},htmlBuilder(e,t){var n=t.style,r=t.havingStyle(n.sup()),i=Ea(Y(e.body,r,t),t),a=e.label.slice(0,2)===`\\x`?`x`:`cd`;i.classes.push(a+`-arrow-pad`);var o;e.below&&(r=t.havingStyle(n.sub()),o=Ea(Y(e.below,r,t),t),o.classes.push(a+`-arrow-pad`));var s=Eo(e,t),c=-t.fontMetrics().axisHeight+.5*s.height,l=-t.fontMetrics().axisHeight-.5*s.height-.111;(i.depth>.25||e.label===`\\xleftequilibrium`)&&(l-=i.depth);var u;if(o){var d=-t.fontMetrics().axisHeight+o.height+.5*s.height+.111;u=G({positionType:`individualShift`,children:[{type:`elem`,elem:i,shift:l},{type:`elem`,elem:s,shift:c,wrapperClasses:[`svg-align`]},{type:`elem`,elem:o,shift:d}]})}else u=G({positionType:`individualShift`,children:[{type:`elem`,elem:i,shift:l},{type:`elem`,elem:s,shift:c,wrapperClasses:[`svg-align`]}]});return W([`mrel`,`x-arrow`],[u],t)},mathmlBuilder(e,t){var n=Co(e.label);n.setAttribute(`minsize`,e.label.charAt(0)===`x`?`1.75em`:`3.0em`);var r;if(e.body){var i=Lo(Z(e.body,t));if(e.below){var a=Lo(Z(e.below,t));r=new X(`munderover`,[n,a,i])}else r=new X(`mover`,[n,i])}else if(e.below){var o=Lo(Z(e.below,t));r=new X(`munder`,[n,o])}else r=Lo(),r=new X(`mover`,[n,r]);return r}});function Ro(e,t){var n=Ka(e.body,t,!0);return W([e.mclass],n,t)}function zo(e,t){var n,r=uo(e.body,t);return e.mclass===`minner`?n=new X(`mpadded`,r):e.mclass===`mord`?e.isCharacterBox?(n=r[0],n.type=`mi`):n=new X(`mi`,r):(e.isCharacterBox?(n=r[0],n.type=`mo`):n=new X(`mo`,r),e.mclass===`mbin`?(n.attributes.lspace=`0.22em`,n.attributes.rspace=`0.22em`):e.mclass===`mpunct`?(n.attributes.lspace=`0em`,n.attributes.rspace=`0.17em`):e.mclass===`mopen`||e.mclass===`mclose`?(n.attributes.lspace=`0em`,n.attributes.rspace=`0em`):e.mclass===`minner`&&(n.attributes.lspace=`0.0556em`,n.attributes.width=`+0.1111em`)),n}q({type:`mclass`,names:[`\\mathord`,`\\mathbin`,`\\mathrel`,`\\mathopen`,`\\mathclose`,`\\mathpunct`,`\\mathinner`],props:{numArgs:1,primitive:!0},handler(e,t){var{parser:n,funcName:r}=e,i=t[0];return{type:`mclass`,mode:n.mode,mclass:`m`+r.slice(5),body:J(i),isCharacterBox:gr(i)}},htmlBuilder:Ro,mathmlBuilder:zo});var Bo=e=>{var t=e.type===`ordgroup`&&e.body.length?e.body[0]:e;return t.type===`atom`&&(t.family===`bin`||t.family===`rel`)?`m`+t.family:`mord`};q({type:`mclass`,names:[`\\@binrel`],props:{numArgs:2},handler(e,t){var{parser:n}=e;return{type:`mclass`,mode:n.mode,mclass:Bo(t[0]),body:J(t[1]),isCharacterBox:gr(t[1])}}}),q({type:`mclass`,names:[`\\stackrel`,`\\overset`,`\\underset`],props:{numArgs:2},handler(e,t){var{parser:n,funcName:r}=e,i=t[1],a=t[0],o=r===`\\stackrel`?`mrel`:Bo(i),s={type:`op`,mode:i.mode,limits:!0,alwaysHandleSupSub:!0,parentIsSupSub:!1,symbol:!1,suppressBaseShift:r!==`\\stackrel`,body:J(i)},c={type:`supsub`,mode:a.mode,base:s,sup:r===`\\underset`?null:a,sub:r===`\\underset`?a:null};return{type:`mclass`,mode:n.mode,mclass:o,body:[c],isCharacterBox:gr(c)}},htmlBuilder:Ro,mathmlBuilder:zo}),q({type:`pmb`,names:[`\\pmb`],props:{numArgs:1,allowedInText:!0},handler(e,t){var{parser:n}=e;return{type:`pmb`,mode:n.mode,mclass:Bo(t[0]),body:J(t[0])}},htmlBuilder(e,t){var n=Ka(e.body,t,!0),r=W([e.mclass],n,t);return r.style.textShadow=`0.02em 0.01em 0.04px`,r},mathmlBuilder(e,t){var n=uo(e.body,t),r=new X(`mstyle`,n);return r.setAttribute(`style`,`text-shadow: 0.02em 0.01em 0.04px`),r}});var Vo={">":`\\\\cdrightarrow`,"<":`\\\\cdleftarrow`,"=":`\\\\cdlongequal`,A:`\\uparrow`,V:`\\downarrow`,"|":`\\Vert`,".":`no arrow`},Ho=()=>({type:`styling`,body:[],mode:`math`,style:`display`,resetFont:!0}),Uo=e=>e.type===`textord`&&e.text===`@`,Wo=(e,t)=>(e.type===`mathord`||e.type===`atom`)&&e.text===t;function Go(e,t,n){var r=Vo[e];switch(r){case`\\\\cdrightarrow`:case`\\\\cdleftarrow`:return n.callFunction(r,[t[0]],[t[1]]);case`\\uparrow`:case`\\downarrow`:var i=n.callFunction(`\\\\cdleft`,[t[0]],[]),a={type:`atom`,text:r,mode:`math`,family:`rel`},o=n.callFunction(`\\Big`,[a],[]),s=n.callFunction(`\\\\cdright`,[t[1]],[]),c={type:`ordgroup`,mode:`math`,body:[i,o,s]};return n.callFunction(`\\\\cdparent`,[c],[]);case`\\\\cdlongequal`:return n.callFunction(`\\\\cdlongequal`,[],[]);case`\\Vert`:return n.callFunction(`\\Big`,[{type:`textord`,text:`\\Vert`,mode:`math`}],[]);default:return{type:`textord`,text:` `,mode:`math`}}}function Ko(e){var t=[];for(e.gullet.beginGroup(),e.gullet.macros.set(`\\cr`,`\\\\\\relax`),e.gullet.beginGroup();;){t.push(e.parseExpression(!1,`\\\\`)),e.gullet.endGroup(),e.gullet.beginGroup();var n=e.fetch().text;if(n===`&`||n===`\\\\`)e.consume();else if(n===`\\end`){t[t.length-1].length===0&&t.pop();break}else throw new D(`Expected \\\\ or \\cr or \\end`,e.nextToken)}for(var r=[],i=[r],a=0;a<t.length;a++){for(var o=t[a],s=Ho(),c=0;c<o.length;c++)if(!Uo(o[c]))s.body.push(o[c]);else{r.push(s),c+=1;var l=jo(o[c]).text,u=[,,];if(u[0]={type:`ordgroup`,mode:`math`,body:[]},u[1]={type:`ordgroup`,mode:`math`,body:[]},!`=|.`.includes(l))if(`<>AV`.includes(l))for(var d=0;d<2;d++){for(var f=!0,p=c+1;p<o.length;p++){if(Wo(o[p],l)){f=!1,c=p;break}if(Uo(o[p]))throw new D(`Missing a `+l+` character to complete a CD arrow.`,o[p]);u[d].body.push(o[p])}if(f)throw new D(`Missing a `+l+` character to complete a CD arrow.`,o[c])}else throw new D(`Expected one of "<>AV=|." after @`,o[c]);var m={type:`styling`,body:[Go(l,u,e)],mode:`math`,style:`display`,resetFont:!0};r.push(m),s=Ho()}a%2==0?r.push(s):r.shift(),r=[],i.push(r)}e.gullet.endGroup(),e.gullet.endGroup();var h=Array(i[0].length).fill({type:`align`,align:`c`,pregap:.25,postgap:.25});return{type:`array`,mode:`math`,body:i,arraystretch:1,addJot:!0,rowGaps:[null],cols:h,colSeparationType:`CD`,hLinesBeforeRow:Array(i.length+1).fill([])}}q({type:`cdlabel`,names:[`\\\\cdleft`,`\\\\cdright`],props:{numArgs:1},handler(e,t){var{parser:n,funcName:r}=e;return{type:`cdlabel`,mode:n.mode,side:r.slice(4),label:t[0]}},htmlBuilder(e,t){var n=t.havingStyle(t.style.sup()),r=Ea(Y(e.label,n,t),t);return r.classes.push(`cd-label-`+e.side),r.style.bottom=A(.8-r.depth),r.height=0,r.depth=0,r},mathmlBuilder(e,t){var n=new X(`mrow`,[Z(e.label,t)]);return n=new X(`mpadded`,[n]),n.setAttribute(`width`,`0`),e.side===`left`&&n.setAttribute(`lspace`,`-1width`),n.setAttribute(`voffset`,`0.7em`),n=new X(`mstyle`,[n]),n.setAttribute(`displaystyle`,`false`),n.setAttribute(`scriptlevel`,`1`),n}}),q({type:`cdlabelparent`,names:[`\\\\cdparent`],props:{numArgs:1},handler(e,t){var{parser:n}=e;return{type:`cdlabelparent`,mode:n.mode,fragment:t[0]}},htmlBuilder(e,t){var n=Ea(Y(e.fragment,t),t);return n.classes.push(`cd-vert-arrow`),n},mathmlBuilder(e,t){return new X(`mrow`,[Z(e.fragment,t)])}}),q({type:`textord`,names:[`\\@char`],props:{numArgs:1,allowedInText:!0},handler(e,t){for(var{parser:n}=e,r=Q(t[0],`ordgroup`).body,i=``,a=0;a<r.length;a++){var o=Q(r[a],`textord`);i+=o.text}var s=parseInt(i),c;if(isNaN(s))throw new D(`\\@char has non-numeric argument `+i);if(s<0||s>=1114111)throw new D(`\\@char with invalid code point `+i);return s<=65535?c=String.fromCharCode(s):(s-=65536,c=String.fromCharCode((s>>10)+55296,(s&1023)+56320)),{type:`textord`,mode:n.mode,text:c}}});var qo=(e,t)=>{var n=Ka(e.body,t.withColor(e.color),!1);return Ta(n)},Jo=(e,t)=>{var n=uo(e.body,t.withColor(e.color)),r=new X(`mstyle`,n);return r.setAttribute(`mathcolor`,e.color),r};q({type:`color`,names:[`\\textcolor`],props:{numArgs:2,allowedInText:!0,argTypes:[`color`,`original`]},handler(e,t){var{parser:n}=e,r=Q(t[0],`color-token`).color,i=t[1];return{type:`color`,mode:n.mode,color:r,body:J(i)}},htmlBuilder:qo,mathmlBuilder:Jo}),q({type:`color`,names:[`\\color`],props:{numArgs:1,allowedInText:!0,argTypes:[`color`]},handler(e,t){var{parser:n,breakOnTokenText:r}=e,i=Q(t[0],`color-token`).color;n.gullet.macros.set(`\\current@color`,i);var a=n.parseExpression(!0,r);return{type:`color`,mode:n.mode,color:i,body:a}},htmlBuilder:qo,mathmlBuilder:Jo}),q({type:`cr`,names:[`\\\\`],props:{numArgs:0,numOptionalArgs:0,allowedInText:!0},handler(e,t,n){var{parser:r}=e,i=r.gullet.future().text===`[`?r.parseSizeGroup(!0):null,a=!r.settings.displayMode||!r.settings.useStrictBehavior(`newLineInDisplayMode`,`In LaTeX, \\\\ or \\newline does nothing in display mode`);return{type:`cr`,mode:r.mode,newLine:a,size:i&&Q(i,`size`).value}},htmlBuilder(e,t){var n=W([`mspace`],[],t);return e.newLine&&(n.classes.push(`newline`),e.size&&(n.style.marginTop=A(k(e.size,t)))),n},mathmlBuilder(e,t){var n=new X(`mspace`);return e.newLine&&(n.setAttribute(`linebreak`,`newline`),e.size&&n.setAttribute(`height`,A(k(e.size,t)))),n}});var Yo={"\\global":`\\global`,"\\long":`\\\\globallong`,"\\\\globallong":`\\\\globallong`,"\\def":`\\gdef`,"\\gdef":`\\gdef`,"\\edef":`\\xdef`,"\\xdef":`\\xdef`,"\\let":`\\\\globallet`,"\\futurelet":`\\\\globalfuture`},Xo=e=>{var t=e.text;if(/^(?:[\\{}$&#^_]|EOF)$/.test(t))throw new D(`Expected a control sequence`,e);return t},Zo=e=>{var t=e.gullet.popToken();return t.text===`=`&&(t=e.gullet.popToken(),t.text===` `&&(t=e.gullet.popToken())),t},Qo=(e,t,n,r)=>{var i=e.gullet.macros.get(n.text);i??=(n.noexpand=!0,{tokens:[n],numArgs:0,unexpandable:!e.gullet.isExpandable(n.text)}),e.gullet.macros.set(t,i,r)};q({type:`internal`,names:[`\\global`,`\\long`,`\\\\globallong`],props:{numArgs:0,allowedInText:!0},handler(e){var{parser:t,funcName:n}=e;t.consumeSpaces();var r=t.fetch();if(Yo[r.text])return(n===`\\global`||n===`\\\\globallong`)&&(r.text=Yo[r.text]),Q(t.parseFunction(),`internal`);throw new D(`Invalid token after macro prefix`,r)}}),q({type:`internal`,names:[`\\def`,`\\gdef`,`\\edef`,`\\xdef`],props:{numArgs:0,allowedInText:!0,primitive:!0},handler(e){var{parser:t,funcName:n}=e,r=t.gullet.popToken(),i=r.text;if(/^(?:[\\{}$&#^_]|EOF)$/.test(i))throw new D(`Expected a control sequence`,r);for(var a=0,o,s=[[]];t.gullet.future().text!==`{`;)if(r=t.gullet.popToken(),r.text===`#`){if(t.gullet.future().text===`{`){o=t.gullet.future(),s[a].push(`{`);break}if(r=t.gullet.popToken(),!/^[1-9]$/.test(r.text))throw new D(`Invalid argument number "`+r.text+`"`);if(parseInt(r.text)!==a+1)throw new D(`Argument number "`+r.text+`" out of order`);a++,s.push([])}else if(r.text===`EOF`)throw new D(`Expected a macro definition`);else s[a].push(r.text);var{tokens:c}=t.gullet.consumeArg();return o&&c.unshift(o),(n===`\\edef`||n===`\\xdef`)&&(c=t.gullet.expandTokens(c),c.reverse()),t.gullet.macros.set(i,{tokens:c,numArgs:a,delimiters:s},n===Yo[n]),{type:`internal`,mode:t.mode}}}),q({type:`internal`,names:[`\\let`,`\\\\globallet`],props:{numArgs:0,allowedInText:!0,primitive:!0},handler(e){var{parser:t,funcName:n}=e,r=Xo(t.gullet.popToken());t.gullet.consumeSpaces();var i=Zo(t);return Qo(t,r,i,n===`\\\\globallet`),{type:`internal`,mode:t.mode}}}),q({type:`internal`,names:[`\\futurelet`,`\\\\globalfuture`],props:{numArgs:0,allowedInText:!0,primitive:!0},handler(e){var{parser:t,funcName:n}=e,r=Xo(t.gullet.popToken()),i=t.gullet.popToken(),a=t.gullet.popToken();return Qo(t,r,a,n===`\\\\globalfuture`),t.gullet.pushToken(a),t.gullet.pushToken(i),{type:`internal`,mode:t.mode}}});var $o=function(e,t,n){var r=j.math[e]&&j.math[e].replace,i=Oi(r||e,t,n);if(!i)throw Error(`Unsupported symbol `+e+` and font size `+t+`.`);return i},es=function(e,t,n,r){var i=n.havingBaseStyle(t),a=W(r.concat(i.sizingClasses(n)),[e],n),o=i.sizeMultiplier/n.sizeMultiplier;return a.height*=o,a.depth*=o,a.maxFontSize=i.sizeMultiplier,a},ts=function(e,t,n){var r=t.havingBaseStyle(n),i=(1-t.sizeMultiplier/r.sizeMultiplier)*t.fontMetrics().axisHeight;e.classes.push(`delimcenter`),e.style.top=A(i),e.height-=i,e.depth+=i},ns=function(e,t,n,r,i,a){var o=ha(e,`Main-Regular`,i,r),s=es(o,t,r,a);return n&&ts(s,r,t),s},rs=function(e,t,n,r){return ha(e,`Size`+t+`-Regular`,n,r)},os=function(e,t,n,r,i,a){var o=rs(e,t,i,r),s=es(W([`delimsizing`,`size`+t],[o],r),O.TEXT,r,a);return n&&ts(s,r,O.TEXT),s},ss=function(e,t,n){return{type:`elem`,elem:W([`delimsizinginner`,t===`Size1-Regular`?`delim-size1`:`delim-size4`],[W([],[ha(e,t,n)])])}},cs=function(e,t,n){var r=wi[`Size4-Regular`][e.charCodeAt(0)]?wi[`Size4-Regular`][e.charCodeAt(0)][4]:wi[`Size1-Regular`][e.charCodeAt(0)][4],i=new yi(`inner`,$r(e,Math.round(1e3*t))),a=new vi([i],{width:A(r),height:A(t),style:`width:`+A(r),viewBox:`0 0 `+1e3*r+` `+Math.round(1e3*t),preserveAspectRatio:`xMinYMin`}),o=Sa([],[a],n);return o.height=t,o.style.height=A(t),o.style.width=A(r),{type:`elem`,elem:o}},ls=.008,us={type:`kern`,size:-1*ls},ds=new Set([`|`,`\\lvert`,`\\rvert`,`\\vert`]),fs=new Set([`\\|`,`\\lVert`,`\\rVert`,`\\Vert`]),ps=function(e,t,n,r,i,a){var o,s,c,l,u=``,d=0;o=c=l=e,s=null;var f=`Size1-Regular`;e===`\\uparrow`?c=l=`⏐`:e===`\\Uparrow`?c=l=`‖`:e===`\\downarrow`?o=c=`⏐`:e===`\\Downarrow`?o=c=`‖`:e===`\\updownarrow`?(o=`\\uparrow`,c=`⏐`,l=`\\downarrow`):e===`\\Updownarrow`?(o=`\\Uparrow`,c=`‖`,l=`\\Downarrow`):ds.has(e)?(c=`∣`,u=`vert`,d=333):fs.has(e)?(c=`∥`,u=`doublevert`,d=556):e===`[`||e===`\\lbrack`?(o=`⎡`,c=`⎢`,l=`⎣`,f=`Size4-Regular`,u=`lbrack`,d=667):e===`]`||e===`\\rbrack`?(o=`⎤`,c=`⎥`,l=`⎦`,f=`Size4-Regular`,u=`rbrack`,d=667):e===`\\lfloor`||e===`⌊`?(c=o=`⎢`,l=`⎣`,f=`Size4-Regular`,u=`lfloor`,d=667):e===`\\lceil`||e===`⌈`?(o=`⎡`,c=l=`⎢`,f=`Size4-Regular`,u=`lceil`,d=667):e===`\\rfloor`||e===`⌋`?(c=o=`⎥`,l=`⎦`,f=`Size4-Regular`,u=`rfloor`,d=667):e===`\\rceil`||e===`⌉`?(o=`⎤`,c=l=`⎥`,f=`Size4-Regular`,u=`rceil`,d=667):e===`(`||e===`\\lparen`?(o=`⎛`,c=`⎜`,l=`⎝`,f=`Size4-Regular`,u=`lparen`,d=875):e===`)`||e===`\\rparen`?(o=`⎞`,c=`⎟`,l=`⎠`,f=`Size4-Regular`,u=`rparen`,d=875):e===`\\{`||e===`\\lbrace`?(o=`⎧`,s=`⎨`,l=`⎩`,c=`⎪`,f=`Size4-Regular`):e===`\\}`||e===`\\rbrace`?(o=`⎫`,s=`⎬`,l=`⎭`,c=`⎪`,f=`Size4-Regular`):e===`\\lgroup`||e===`⟮`?(o=`⎧`,l=`⎩`,c=`⎪`,f=`Size4-Regular`):e===`\\rgroup`||e===`⟯`?(o=`⎫`,l=`⎭`,c=`⎪`,f=`Size4-Regular`):e===`\\lmoustache`||e===`⎰`?(o=`⎧`,l=`⎭`,c=`⎪`,f=`Size4-Regular`):(e===`\\rmoustache`||e===`⎱`)&&(o=`⎫`,l=`⎩`,c=`⎪`,f=`Size4-Regular`);var p=$o(o,f,i),m=p.height+p.depth,h=$o(c,f,i),g=h.height+h.depth,_=$o(l,f,i),v=_.height+_.depth,y=0,b=1;if(s!==null){var ee=$o(s,f,i);y=ee.height+ee.depth,b=2}var x=m+v+y,S=Math.max(0,Math.ceil((t-x)/(b*g))),C=x+S*b*g,te=r.fontMetrics().axisHeight;n&&(te*=r.sizeMultiplier);var ne=C/2-te,re=[];if(u.length>0){var ie=C-m-v,ae=Math.round(C*1e3),oe=ti(u,Math.round(ie*1e3)),se=new yi(u,oe),ce=A(d/1e3),le=A(ae/1e3),ue=new vi([se],{width:ce,height:le,viewBox:`0 0 `+d+` `+ae}),de=Sa([],[ue],r);de.height=ae/1e3,de.style.width=ce,de.style.height=le,re.push({type:`elem`,elem:de})}else{if(re.push(ss(l,f,i)),re.push(us),s===null){var fe=C-m-v+2*ls;re.push(cs(c,fe,r))}else{var pe=(C-m-v-y)/2+2*ls;re.push(cs(c,pe,r)),re.push(us),re.push(ss(s,f,i)),re.push(us),re.push(cs(c,pe,r))}re.push(us),re.push(ss(o,f,i))}var me=r.havingBaseStyle(O.TEXT),he=G({positionType:`bottom`,positionData:ne,children:re});return es(W([`delimsizing`,`mult`],[he],me),O.TEXT,r,a)},ms=80,hs=.08,gs=function(e,t,n,r,i){var a=Qr(e,r,n),o=new yi(e,a),s=new vi([o],{width:`400em`,height:A(t),viewBox:`0 0 400000 `+n,preserveAspectRatio:`xMinYMin slice`});return Sa([`hide-tail`],[s],i)},_s=function(e,t){var n=t.havingBaseSizing(),r=Ds(`\\surd`,e*n.sizeMultiplier,Ts,n),i=n.sizeMultiplier,a=Math.max(0,t.minRuleThickness-t.fontMetrics().sqrtRuleThickness),o,s,c,l,u;return r.type===`small`?(l=1e3+1e3*a+ms,e<1?i=1:e<1.4&&(i=.7),s=(1+a+hs)/i,c=(1+a)/i,o=gs(`sqrtMain`,s,l,a,t),o.style.minWidth=`0.853em`,u=.833/i):r.type===`large`?(l=(1e3+ms)*xs[r.size],c=(xs[r.size]+a)/i,s=(xs[r.size]+a+hs)/i,o=gs(`sqrtSize`+r.size,s,l,a,t),o.style.minWidth=`1.02em`,u=1/i):(s=e+a+hs,c=e+a,l=Math.floor(1e3*e+a)+ms,o=gs(`sqrtTall`,s,l,a,t),o.style.minWidth=`0.742em`,u=1.056),o.height=c,o.style.height=A(s),{span:o,advanceWidth:u,ruleWidth:(t.fontMetrics().sqrtRuleThickness+a)*i}},vs=new Set([`(`,`\\lparen`,`)`,`\\rparen`,`[`,`\\lbrack`,`]`,`\\rbrack`,`\\{`,`\\lbrace`,`\\}`,`\\rbrace`,`\\lfloor`,`\\rfloor`,`⌊`,`⌋`,`\\lceil`,`\\rceil`,`⌈`,`⌉`,`\\surd`]),ys=new Set([`\\uparrow`,`\\downarrow`,`\\updownarrow`,`\\Uparrow`,`\\Downarrow`,`\\Updownarrow`,`|`,`\\|`,`\\vert`,`\\Vert`,`\\lvert`,`\\rvert`,`\\lVert`,`\\rVert`,`\\lgroup`,`\\rgroup`,`⟮`,`⟯`,`\\lmoustache`,`\\rmoustache`,`⎰`,`⎱`]),bs=new Set([`<`,`>`,`\\langle`,`\\rangle`,`/`,`\\backslash`,`\\lt`,`\\gt`]),xs=[0,1.2,1.8,2.4,3],Ss=function(e,t,n,r,i){if(e===`<`||e===`\\lt`||e===`⟨`?e=`\\langle`:(e===`>`||e===`\\gt`||e===`⟩`)&&(e=`\\rangle`),vs.has(e)||bs.has(e))return os(e,t,!1,n,r,i);if(ys.has(e))return ps(e,xs[t],!1,n,r,i);throw new D(`Illegal delimiter: '`+e+`'`)},Cs=[{type:`small`,style:O.SCRIPTSCRIPT},{type:`small`,style:O.SCRIPT},{type:`small`,style:O.TEXT},{type:`large`,size:1},{type:`large`,size:2},{type:`large`,size:3},{type:`large`,size:4}],ws=[{type:`small`,style:O.SCRIPTSCRIPT},{type:`small`,style:O.SCRIPT},{type:`small`,style:O.TEXT},{type:`stack`}],Ts=[{type:`small`,style:O.SCRIPTSCRIPT},{type:`small`,style:O.SCRIPT},{type:`small`,style:O.TEXT},{type:`large`,size:1},{type:`large`,size:2},{type:`large`,size:3},{type:`large`,size:4},{type:`stack`}],Es=function(e){if(e.type===`small`)return`Main-Regular`;if(e.type===`large`)return`Size`+e.size+`-Regular`;if(e.type===`stack`)return`Size4-Regular`;var t=e.type;throw Error(`Add support for delim type '`+t+`' here.`)},Ds=function(e,t,n,r){for(var i=Math.min(2,3-r.style.size);i<n.length;i++){var a=n[i];if(a.type===`stack`)break;var o=$o(e,Es(a),`math`),s=o.height+o.depth;if(a.type===`small`){var c=r.havingBaseStyle(a.style);s*=c.sizeMultiplier}if(s>t)return a}return n[n.length-1]},Os=function(e,t,n,r,i,a){e===`<`||e===`\\lt`||e===`⟨`?e=`\\langle`:(e===`>`||e===`\\gt`||e===`⟩`)&&(e=`\\rangle`);var o=bs.has(e)?Cs:vs.has(e)?Ts:ws,s=Ds(e,t,o,r);return s.type===`small`?ns(e,s.style,n,r,i,a):s.type===`large`?os(e,s.size,n,r,i,a):ps(e,t,n,r,i,a)},ks=function(e,t,n,r,i,a){var o=r.fontMetrics().axisHeight*r.sizeMultiplier,s=901,c=5/r.fontMetrics().ptPerEm,l=Math.max(t-o,n+o),u=Math.max(l/500*s,2*l-c);return Os(e,u,!0,r,i,a)},As={"\\bigl":{mclass:`mopen`,size:1},"\\Bigl":{mclass:`mopen`,size:2},"\\biggl":{mclass:`mopen`,size:3},"\\Biggl":{mclass:`mopen`,size:4},"\\bigr":{mclass:`mclose`,size:1},"\\Bigr":{mclass:`mclose`,size:2},"\\biggr":{mclass:`mclose`,size:3},"\\Biggr":{mclass:`mclose`,size:4},"\\bigm":{mclass:`mrel`,size:1},"\\Bigm":{mclass:`mrel`,size:2},"\\biggm":{mclass:`mrel`,size:3},"\\Biggm":{mclass:`mrel`,size:4},"\\big":{mclass:`mord`,size:1},"\\Big":{mclass:`mord`,size:2},"\\bigg":{mclass:`mord`,size:3},"\\Bigg":{mclass:`mord`,size:4}},js=new Set(`(,\\lparen,),\\rparen,[,\\lbrack,],\\rbrack,\\{,\\lbrace,\\},\\rbrace,\\lfloor,\\rfloor,⌊,⌋,\\lceil,\\rceil,⌈,⌉,<,>,\\langle,⟨,\\rangle,⟩,\\lt,\\gt,\\lvert,\\rvert,\\lVert,\\rVert,\\lgroup,\\rgroup,⟮,⟯,\\lmoustache,\\rmoustache,⎰,⎱,/,\\backslash,|,\\vert,\\|,\\Vert,\\uparrow,\\Uparrow,\\downarrow,\\Downarrow,\\updownarrow,\\Updownarrow,.`.split(`,`));function Ms(e){return`isMiddle`in e}function Ns(e,t){var n=Mo(e);if(n&&js.has(n.text))return n;throw n?new D(`Invalid delimiter '`+n.text+`' after '`+t.funcName+`'`,e):new D(`Invalid delimiter type '`+e.type+`'`,e)}q({type:`delimsizing`,names:[`\\bigl`,`\\Bigl`,`\\biggl`,`\\Biggl`,`\\bigr`,`\\Bigr`,`\\biggr`,`\\Biggr`,`\\bigm`,`\\Bigm`,`\\biggm`,`\\Biggm`,`\\big`,`\\Big`,`\\bigg`,`\\Bigg`],props:{numArgs:1,argTypes:[`primitive`]},handler:(e,t)=>{var n=Ns(t[0],e);return{type:`delimsizing`,mode:e.parser.mode,size:As[e.funcName].size,mclass:As[e.funcName].mclass,delim:n.text}},htmlBuilder:(e,t)=>e.delim===`.`?W([e.mclass]):Ss(e.delim,e.size,t,e.mode,[e.mclass]),mathmlBuilder:e=>{var t=[];e.delim!==`.`&&t.push(ao(e.delim,e.mode));var n=new X(`mo`,t);e.mclass===`mopen`||e.mclass===`mclose`?n.setAttribute(`fence`,`true`):n.setAttribute(`fence`,`false`),n.setAttribute(`stretchy`,`true`);var r=A(xs[e.size]);return n.setAttribute(`minsize`,r),n.setAttribute(`maxsize`,r),n}});function Ps(e){if(!e.body)throw Error(`Bug: The leftright ParseNode wasn't fully parsed.`)}q({type:`leftright-right`,names:[`\\right`],props:{numArgs:1,primitive:!0},handler:(e,t)=>{var n=e.parser.gullet.macros.get(`\\current@color`);if(n&&typeof n!=`string`)throw new D(`\\current@color set to non-string in \\right`);return{type:`leftright-right`,mode:e.parser.mode,delim:Ns(t[0],e).text,color:n}}}),q({type:`leftright`,names:[`\\left`],props:{numArgs:1,primitive:!0},handler:(e,t)=>{var n=Ns(t[0],e),r=e.parser;++r.leftrightDepth;var i=r.parseExpression(!1);--r.leftrightDepth,r.expect(`\\right`,!1);var a=Q(r.parseFunction(),`leftright-right`);return{type:`leftright`,mode:r.mode,body:i,left:n.text,right:a.delim,rightColor:a.color}},htmlBuilder:(e,t)=>{Ps(e);for(var n=Ka(e.body,t,!0,[`mopen`,`mclose`]),r=0,i=0,a=!1,o=0;o<n.length;o++){var s=n[o];Ms(s)?a=!0:(r=Math.max(n[o].height,r),i=Math.max(n[o].depth,i))}r*=t.sizeMultiplier,i*=t.sizeMultiplier;var c=e.left===`.`?Za(t,[`mopen`]):ks(e.left,r,i,t,e.mode,[`mopen`]);if(n.unshift(c),a)for(var l=1;l<n.length;l++){var u=n[l];if(Ms(u)){var d=u.isMiddle;n[l]=ks(d.delim,r,i,d.options,e.mode,[])}}var f;if(e.right===`.`)f=Za(t,[`mclose`]);else{var p=e.rightColor?t.withColor(e.rightColor):t;f=ks(e.right,r,i,p,e.mode,[`mclose`])}return n.push(f),W([`minner`],n,t)},mathmlBuilder:(e,t)=>{Ps(e);var n=uo(e.body,t);if(e.left!==`.`){var r=new X(`mo`,[ao(e.left,e.mode)]);r.setAttribute(`fence`,`true`),n.unshift(r)}if(e.right!==`.`){var i=new X(`mo`,[ao(e.right,e.mode)]);i.setAttribute(`fence`,`true`),e.rightColor&&i.setAttribute(`mathcolor`,e.rightColor),n.push(i)}return oo(n)}}),q({type:`middle`,names:[`\\middle`],props:{numArgs:1,primitive:!0},handler:(e,t)=>{var n=Ns(t[0],e);if(!e.parser.leftrightDepth)throw new D(`\\middle without preceding \\left`,n);return{type:`middle`,mode:e.parser.mode,delim:n.text}},htmlBuilder:(e,t)=>{var n;return e.delim===`.`?n=Za(t,[]):(n=Ss(e.delim,1,t,e.mode,[]),n.isMiddle={delim:e.delim,options:t}),n},mathmlBuilder:(e,t)=>{var n=e.delim===`\\vert`||e.delim===`|`?ao(`|`,`text`):ao(e.delim,e.mode),r=new X(`mo`,[n]);return r.setAttribute(`fence`,`true`),r.setAttribute(`lspace`,`0.05em`),r.setAttribute(`rspace`,`0.05em`),r}});var Fs=(e,t)=>{var n=Ea(Y(e.body,t),t),r=e.label.slice(1),i=t.sizeMultiplier,a,o,s=gr(e.body);if(r===`sout`)a=W([`stretchy`,`sout`]),a.height=t.fontMetrics().defaultRuleThickness/i,o=-.5*t.fontMetrics().xHeight;else if(r===`phase`){var c=k({number:.6,unit:`pt`},t),l=k({number:.35,unit:`ex`},t),u=t.havingBaseSizing();i/=u.sizeMultiplier;var d=n.height+n.depth+c+l;n.style.paddingLeft=A(d/2+c);var f=Math.floor(1e3*d*i),p=Xr(f),m=new vi([new yi(`phase`,p)],{width:`400em`,height:A(f/1e3),viewBox:`0 0 400000 `+f,preserveAspectRatio:`xMinYMin slice`});a=Sa([`hide-tail`],[m],t),a.style.height=A(d),o=n.depth+c+l}else{/cancel/.test(r)?s||n.classes.push(`cancel-pad`):r===`angl`?n.classes.push(`anglpad`):n.classes.push(`boxpad`);var h,g,_=0;/box/.test(r)?(_=Math.max(t.fontMetrics().fboxrule,t.minRuleThickness),h=t.fontMetrics().fboxsep+(r===`colorbox`?0:_),g=h):r===`angl`?(_=Math.max(t.fontMetrics().defaultRuleThickness,t.minRuleThickness),h=4*_,g=Math.max(0,.25-n.depth)):(h=s?.2:0,g=h),a=Do(n,r,h,g,t),/fbox|boxed|fcolorbox/.test(r)?(a.style.borderStyle=`solid`,a.style.borderWidth=A(_)):r===`angl`&&_!==.049&&(a.style.borderTopWidth=A(_),a.style.borderRightWidth=A(_)),o=n.depth+g,e.backgroundColor&&(a.style.backgroundColor=e.backgroundColor,e.borderColor&&(a.style.borderColor=e.borderColor))}var v;if(e.backgroundColor)v=G({positionType:`individualShift`,children:[{type:`elem`,elem:a,shift:o},{type:`elem`,elem:n,shift:0}]});else{var y=/cancel|phase/.test(r)?[`svg-align`]:[];v=G({positionType:`individualShift`,children:[{type:`elem`,elem:n,shift:0},{type:`elem`,elem:a,shift:o,wrapperClasses:y}]})}return/cancel/.test(r)&&(v.height=n.height,v.depth=n.depth),/cancel/.test(r)&&!s?W([`mord`,`cancel-lap`],[v],t):W([`mord`],[v],t)},Is=(e,t)=>{var n,r=new X(e.label.includes(`colorbox`)?`mpadded`:`menclose`,[Z(e.body,t)]);switch(e.label){case`\\cancel`:r.setAttribute(`notation`,`updiagonalstrike`);break;case`\\bcancel`:r.setAttribute(`notation`,`downdiagonalstrike`);break;case`\\phase`:r.setAttribute(`notation`,`phasorangle`);break;case`\\sout`:r.setAttribute(`notation`,`horizontalstrike`);break;case`\\fbox`:r.setAttribute(`notation`,`box`);break;case`\\angl`:r.setAttribute(`notation`,`actuarial`);break;case`\\fcolorbox`:case`\\colorbox`:if(n=t.fontMetrics().fboxsep*t.fontMetrics().ptPerEm,r.setAttribute(`width`,`+`+2*n+`pt`),r.setAttribute(`height`,`+`+2*n+`pt`),r.setAttribute(`lspace`,n+`pt`),r.setAttribute(`voffset`,n+`pt`),e.label===`\\fcolorbox`){var i=Math.max(t.fontMetrics().fboxrule,t.minRuleThickness);r.setAttribute(`style`,`border: `+A(i)+` solid `+e.borderColor)}break;case`\\xcancel`:r.setAttribute(`notation`,`updiagonalstrike downdiagonalstrike`);break}return e.backgroundColor&&r.setAttribute(`mathbackground`,e.backgroundColor),r};q({type:`enclose`,names:[`\\colorbox`],props:{numArgs:2,allowedInText:!0,argTypes:[`color`,`hbox`]},handler(e,t,n){var{parser:r,funcName:i}=e,a=Q(t[0],`color-token`).color,o=t[1];return{type:`enclose`,mode:r.mode,label:i,backgroundColor:a,body:o}},htmlBuilder:Fs,mathmlBuilder:Is}),q({type:`enclose`,names:[`\\fcolorbox`],props:{numArgs:3,allowedInText:!0,argTypes:[`color`,`color`,`hbox`]},handler(e,t,n){var{parser:r,funcName:i}=e,a=Q(t[0],`color-token`).color,o=Q(t[1],`color-token`).color,s=t[2];return{type:`enclose`,mode:r.mode,label:i,backgroundColor:o,borderColor:a,body:s}},htmlBuilder:Fs,mathmlBuilder:Is}),q({type:`enclose`,names:[`\\fbox`],props:{numArgs:1,argTypes:[`hbox`],allowedInText:!0},handler(e,t){var{parser:n}=e;return{type:`enclose`,mode:n.mode,label:`\\fbox`,body:t[0]}}}),q({type:`enclose`,names:[`\\cancel`,`\\bcancel`,`\\xcancel`,`\\phase`],props:{numArgs:1},handler(e,t){var{parser:n,funcName:r}=e,i=t[0];return{type:`enclose`,mode:n.mode,label:r,body:i}},htmlBuilder:Fs,mathmlBuilder:Is}),q({type:`enclose`,names:[`\\sout`],props:{numArgs:1,allowedInText:!0},handler(e,t){var{parser:n,funcName:r}=e;n.mode===`math`&&n.settings.reportNonstrict(`mathVsSout`,`LaTeX's \\sout works only in text mode`);var i=t[0];return{type:`enclose`,mode:n.mode,label:r,body:i}},htmlBuilder:Fs,mathmlBuilder:Is}),q({type:`enclose`,names:[`\\angl`],props:{numArgs:1,argTypes:[`hbox`],allowedInText:!1},handler(e,t){var{parser:n}=e;return{type:`enclose`,mode:n.mode,label:`\\angl`,body:t[0]}}});var Ls={};function Rs(e){for(var{type:t,names:n,props:r,handler:i,htmlBuilder:a,mathmlBuilder:o}=e,s={type:t,numArgs:r.numArgs||0,allowedInText:!1,numOptionalArgs:0,handler:i},c=0;c<n.length;++c)Ls[n[c]]=s;a&&(Ra[t]=a),o&&(za[t]=o)}var zs={};function $(e,t){zs[e]=t}var Bs=class e{constructor(e,t,n){this.lexer=void 0,this.start=void 0,this.end=void 0,this.lexer=e,this.start=t,this.end=n}static range(t,n){return n?!t||!t.loc||!n.loc||t.loc.lexer!==n.loc.lexer?null:new e(t.loc.lexer,t.loc.start,n.loc.end):t&&t.loc}},Vs=class e{constructor(e,t){this.text=void 0,this.loc=void 0,this.noexpand=void 0,this.treatAsRelax=void 0,this.text=e,this.loc=t}range(t,n){return new e(n,Bs.range(this,t))}};function Hs(e){var t=[];e.consumeSpaces();var n=e.fetch().text;for(n===`\\relax`&&(e.consume(),e.consumeSpaces(),n=e.fetch().text);n===`\\hline`||n===`\\hdashline`;)e.consume(),t.push(n===`\\hdashline`),e.consumeSpaces(),n=e.fetch().text;return t}var Us=e=>{if(!e.parser.settings.displayMode)throw new D(`{`+e.envName+`} can be used only in display mode.`)},Ws=new Set([`gather`,`gather*`]);function Gs(e){if(!e.includes(`ed`))return!e.includes(`*`)}function Ks(e,t,n){var{hskipBeforeAndAfter:r,addJot:i,cols:a,arraystretch:o,colSeparationType:s,autoTag:c,singleRow:l,emptySingleRow:u,maxNumCols:d,leqno:f}=t;if(e.gullet.beginGroup(),l||e.gullet.macros.set(`\\cr`,`\\\\\\relax`),!o){var p=e.gullet.expandMacroAsText(`\\arraystretch`);if(p==null)o=1;else if(o=parseFloat(p),!o||o<0)throw new D(`Invalid \\arraystretch: `+p)}e.gullet.beginGroup();var m=[],h=[m],g=[],_=[],v=c==null?void 0:[];function y(){c&&e.gullet.macros.set(`\\@eqnsw`,`1`,!0)}function b(){v&&(e.gullet.macros.get(`\\df@tag`)?(v.push(e.subparse([new Vs(`\\df@tag`)])),e.gullet.macros.set(`\\df@tag`,void 0,!0)):v.push(!!c&&e.gullet.macros.get(`\\@eqnsw`)===`1`))}for(y(),_.push(Hs(e));;){var ee=e.parseExpression(!1,l?`\\end`:`\\\\`);e.gullet.endGroup(),e.gullet.beginGroup();var x={type:`ordgroup`,mode:e.mode,body:ee};n&&(x={type:`styling`,mode:e.mode,style:n,resetFont:!0,body:[x]}),m.push(x);var S=e.fetch().text;if(S===`&`){if(d&&m.length===d){if(l||s)throw new D(`Too many tab characters: &`,e.nextToken);e.settings.reportNonstrict(`textEnv`,`Too few columns specified in the {array} column argument.`)}e.consume()}else if(S===`\\end`){b(),m.length===1&&x.type===`styling`&&x.body.length===1&&x.body[0].type===`ordgroup`&&x.body[0].body.length===0&&(h.length>1||!u)&&h.pop(),_.length<h.length+1&&_.push([]);break}else if(S===`\\\\`){e.consume();var C=void 0;e.gullet.future().text!==` `&&(C=e.parseSizeGroup(!0)),g.push(C?C.value:null),b(),_.push(Hs(e)),m=[],h.push(m),y()}else throw new D(`Expected & or \\\\ or \\cr or \\end`,e.nextToken)}return e.gullet.endGroup(),e.gullet.endGroup(),{type:`array`,mode:e.mode,addJot:i,arraystretch:o,body:h,cols:a,rowGaps:g,hskipBeforeAndAfter:r,hLinesBeforeRow:_,colSeparationType:s,tags:v,leqno:f}}function qs(e){return e.slice(0,1)===`d`?`display`:`text`}var Js=function(e,t){var n,r,i=e.body.length,a=e.hLinesBeforeRow,o=0,s=Array(i),c=[],l=Math.max(t.fontMetrics().arrayRuleWidth,t.minRuleThickness),u=1/t.fontMetrics().ptPerEm,d=5*u;e.colSeparationType&&e.colSeparationType===`small`&&(d=.2778*(t.havingStyle(O.SCRIPT).sizeMultiplier/t.sizeMultiplier));var f=e.colSeparationType===`CD`?k({number:3,unit:`ex`},t):12*u,p=3*u,m=e.arraystretch*f,h=.7*m,g=.3*m,_=0;function v(e){for(var t=0;t<e.length;++t)t>0&&(_+=.25),c.push({pos:_,isDashed:e[t]})}for(v(a[0]),n=0;n<e.body.length;++n){var y=e.body[n],b=h,ee=g;o<y.length&&(o=y.length);var x={cells:Array(y.length),height:0,depth:0,pos:0};for(r=0;r<y.length;++r){var S=Y(y[r],t);ee<S.depth&&(ee=S.depth),b<S.height&&(b=S.height),x.cells[r]=S}var C=e.rowGaps[n],te=0;C&&(te=k(C,t),te>0&&(te+=g,ee<te&&(ee=te),te=0)),e.addJot&&n<e.body.length-1&&(ee+=p),x.height=b,x.depth=ee,_+=b,x.pos=_,_+=ee+te,s[n]=x,v(a[n+1])}var ne=_/2+t.fontMetrics().axisHeight,re=e.cols||[],ie=[],ae,oe,se=[];if(e.tags&&e.tags.some(e=>e))for(n=0;n<i;++n){var ce=s[n],le=ce.pos-ne,ue=e.tags[n],de=void 0;de=ue===!0?W([`eqn-num`],[],t):ue===!1?W([],[],t):W([],Ka(ue,t,!0),t),de.depth=ce.depth,de.height=ce.height,se.push({type:`elem`,elem:de,shift:le})}for(r=0,oe=0;r<o||oe<re.length;++r,++oe){for(var fe=re[oe],pe=!0;(me=fe)?.type===`separator`;){var me;if(pe||(ae=W([`arraycolsep`],[]),ae.style.width=A(t.fontMetrics().doubleRuleSep),ie.push(ae)),fe.separator===`|`||fe.separator===`:`){var he=fe.separator===`|`?`solid`:`dashed`,ge=W([`vertical-separator`],[],t);ge.style.height=A(_),ge.style.borderRightWidth=A(l),ge.style.borderRightStyle=he,ge.style.margin=`0 `+A(-l/2);var _e=_-ne;_e&&(ge.style.verticalAlign=A(-_e)),ie.push(ge)}else throw new D(`Invalid separator type: `+fe.separator);oe++,fe=re[oe],pe=!1}if(!(r>=o)){var ve=void 0;(r>0||e.hskipBeforeAndAfter)&&(ve=fe?.pregap??d,ve!==0&&(ae=W([`arraycolsep`],[]),ae.style.width=A(ve),ie.push(ae)));var ye=[];for(n=0;n<i;++n){var be=s[n],xe=be.cells[r];if(xe){var Se=be.pos-ne;xe.depth=be.depth,xe.height=be.height,ye.push({type:`elem`,elem:xe,shift:Se})}}var Ce=G({positionType:`individualShift`,children:ye}),we=W([`col-align-`+(fe?.align||`c`)],[Ce]);ie.push(we),(r<o-1||e.hskipBeforeAndAfter)&&(ve=fe?.postgap??d,ve!==0&&(ae=W([`arraycolsep`],[]),ae.style.width=A(ve),ie.push(ae)))}}var Te=W([`mtable`],ie);if(c.length>0){for(var Ee=Ca(`hline`,t,l),De=Ca(`hdashline`,t,l),Oe=[{type:`elem`,elem:Te,shift:0}];c.length>0;){var ke=c.pop(),Ae=ke.pos-ne;ke.isDashed?Oe.push({type:`elem`,elem:De,shift:Ae}):Oe.push({type:`elem`,elem:Ee,shift:Ae})}Te=G({positionType:`individualShift`,children:Oe})}if(se.length===0)return W([`mord`],[Te],t);var je=G({positionType:`individualShift`,children:se}),Me=W([`tag`],[je],t);return Ta([Te,Me])},Ys={c:`center `,l:`left `,r:`right `},Xs=function(e,t){for(var n=[],r=new X(`mtd`,[],[`mtr-glue`]),i=new X(`mtd`,[],[`mml-eqn-num`]),a=0;a<e.body.length;a++){for(var o=e.body[a],s=[],c=0;c<o.length;c++)s.push(new X(`mtd`,[Z(o[c],t)]));e.tags&&e.tags[a]&&(s.unshift(r),s.push(r),e.leqno?s.unshift(i):s.push(i)),n.push(new X(`mtr`,s))}var l=new X(`mtable`,n),u=e.arraystretch===.5?.1:.16+e.arraystretch-1+(e.addJot?.09:0);l.setAttribute(`rowspacing`,A(u));var d=``,f=``;if(e.cols&&e.cols.length>0){var p=e.cols,m=``,h=!1,g=0,_=p.length;p[0].type===`separator`&&(d+=`top `,g=1),p[p.length-1].type===`separator`&&(d+=`bottom `,--_);for(var v=g;v<_;v++){var y=p[v];y.type===`align`?(f+=Ys[y.align],h&&(m+=`none `),h=!0):y.type===`separator`&&(h&&=(m+=y.separator===`|`?`solid `:`dashed `,!1))}l.setAttribute(`columnalign`,f.trim()),/[sd]/.test(m)&&l.setAttribute(`columnlines`,m.trim())}if(e.colSeparationType===`align`){for(var b=e.cols||[],ee=``,x=1;x<b.length;x++)ee+=x%2?`0em `:`1em `;l.setAttribute(`columnspacing`,ee.trim())}else e.colSeparationType===`alignat`||e.colSeparationType===`gather`?l.setAttribute(`columnspacing`,`0em`):e.colSeparationType===`small`?l.setAttribute(`columnspacing`,`0.2778em`):e.colSeparationType===`CD`?l.setAttribute(`columnspacing`,`0.5em`):l.setAttribute(`columnspacing`,`1em`);var S=``,C=e.hLinesBeforeRow;d+=C[0].length>0?`left `:``,d+=C[C.length-1].length>0?`right `:``;for(var te=1;te<C.length-1;te++)S+=C[te].length===0?`none `:C[te][0]?`dashed `:`solid `;return/[sd]/.test(S)&&l.setAttribute(`rowlines`,S.trim()),d!==``&&(l=new X(`menclose`,[l]),l.setAttribute(`notation`,d.trim())),e.arraystretch&&e.arraystretch<1&&(l=new X(`mstyle`,[l]),l.setAttribute(`scriptlevel`,`1`)),l},Zs=function(e,t){e.envName.includes(`ed`)||Us(e);var n=[],r=e.envName.includes(`at`)?`alignat`:`align`,i=e.envName===`split`,a=Ks(e.parser,{cols:n,addJot:!0,autoTag:i?void 0:Gs(e.envName),emptySingleRow:!0,colSeparationType:r,maxNumCols:i?2:void 0,leqno:e.parser.settings.leqno},`display`),o=0,s=0,c={type:`ordgroup`,mode:e.mode,body:[]};if(t[0]&&t[0].type===`ordgroup`){for(var l=``,u=0;u<t[0].body.length;u++){var d=Q(t[0].body[u],`textord`);l+=d.text}o=Number(l),s=o*2}var f=!s;a.body.forEach(function(e){for(var t=1;t<e.length;t+=2){var n=Q(e[t],`styling`);Q(n.body[0],`ordgroup`).body.unshift(c)}if(f)s<e.length&&(s=e.length);else{var r=e.length/2;if(o<r)throw new D(`Too many math in a row: `+(`expected `+o+`, but got `+r),e[0])}});for(var p=0;p<s;++p){var m=`r`,h=0;p%2==1?m=`l`:p>0&&f&&(h=1),n[p]={type:`align`,align:m,pregap:h,postgap:0}}return a.colSeparationType=f?`align`:`alignat`,a};Rs({type:`array`,names:[`array`,`darray`],props:{numArgs:1},handler(e,t){var n=(Mo(t[0])?[t[0]]:Q(t[0],`ordgroup`).body).map(function(e){var t=jo(e).text;if(`lcr`.includes(t))return{type:`align`,align:t};if(t===`|`)return{type:`separator`,separator:`|`};if(t===`:`)return{type:`separator`,separator:`:`};throw new D(`Unknown column alignment: `+t,e)}),r={cols:n,hskipBeforeAndAfter:!0,maxNumCols:n.length};return Ks(e.parser,r,qs(e.envName))},htmlBuilder:Js,mathmlBuilder:Xs}),Rs({type:`array`,names:[`matrix`,`pmatrix`,`bmatrix`,`Bmatrix`,`vmatrix`,`Vmatrix`,`matrix*`,`pmatrix*`,`bmatrix*`,`Bmatrix*`,`vmatrix*`,`Vmatrix*`],props:{numArgs:0},handler(e){var t={matrix:null,pmatrix:[`(`,`)`],bmatrix:[`[`,`]`],Bmatrix:[`\\{`,`\\}`],vmatrix:[`|`,`|`],Vmatrix:[`\\Vert`,`\\Vert`]}[e.envName.replace(`*`,``)],n=`c`,r={hskipBeforeAndAfter:!1,cols:[{type:`align`,align:n}]};if(e.envName.charAt(e.envName.length-1)===`*`){var i=e.parser;if(i.consumeSpaces(),i.fetch().text===`[`){if(i.consume(),i.consumeSpaces(),n=i.fetch().text,!`lcr`.includes(n))throw new D(`Expected l or c or r`,i.nextToken);i.consume(),i.consumeSpaces(),i.expect(`]`),i.consume(),r.cols=[{type:`align`,align:n}]}}var a=Ks(e.parser,r,qs(e.envName)),o=Math.max(0,...a.body.map(e=>e.length));return a.cols=Array(o).fill({type:`align`,align:n}),t?{type:`leftright`,mode:e.mode,body:[a],left:t[0],right:t[1],rightColor:void 0}:a},htmlBuilder:Js,mathmlBuilder:Xs}),Rs({type:`array`,names:[`smallmatrix`],props:{numArgs:0},handler(e){var t=Ks(e.parser,{arraystretch:.5},`script`);return t.colSeparationType=`small`,t},htmlBuilder:Js,mathmlBuilder:Xs}),Rs({type:`array`,names:[`subarray`],props:{numArgs:1},handler(e,t){var n=(Mo(t[0])?[t[0]]:Q(t[0],`ordgroup`).body).map(function(e){var t=jo(e).text;if(`lc`.includes(t))return{type:`align`,align:t};throw new D(`Unknown column alignment: `+t,e)});if(n.length>1)throw new D(`{subarray} can contain only one column`);var r={cols:n,hskipBeforeAndAfter:!1,arraystretch:.5},i=Ks(e.parser,r,`script`);if(i.body.length>0&&i.body[0].length>1)throw new D(`{subarray} can contain only one column`);return i},htmlBuilder:Js,mathmlBuilder:Xs}),Rs({type:`array`,names:[`cases`,`dcases`,`rcases`,`drcases`],props:{numArgs:0},handler(e){var t=Ks(e.parser,{arraystretch:1.2,cols:[{type:`align`,align:`l`,pregap:0,postgap:1},{type:`align`,align:`l`,pregap:0,postgap:0}]},qs(e.envName));return{type:`leftright`,mode:e.mode,body:[t],left:e.envName.includes(`r`)?`.`:`\\{`,right:e.envName.includes(`r`)?`\\}`:`.`,rightColor:void 0}},htmlBuilder:Js,mathmlBuilder:Xs}),Rs({type:`array`,names:[`align`,`align*`,`aligned`,`split`],props:{numArgs:0},handler:Zs,htmlBuilder:Js,mathmlBuilder:Xs}),Rs({type:`array`,names:[`gathered`,`gather`,`gather*`],props:{numArgs:0},handler(e){Ws.has(e.envName)&&Us(e);var t={cols:[{type:`align`,align:`c`}],addJot:!0,colSeparationType:`gather`,autoTag:Gs(e.envName),emptySingleRow:!0,leqno:e.parser.settings.leqno};return Ks(e.parser,t,`display`)},htmlBuilder:Js,mathmlBuilder:Xs}),Rs({type:`array`,names:[`alignat`,`alignat*`,`alignedat`],props:{numArgs:1},handler:Zs,htmlBuilder:Js,mathmlBuilder:Xs}),Rs({type:`array`,names:[`equation`,`equation*`],props:{numArgs:0},handler(e){Us(e);var t={autoTag:Gs(e.envName),emptySingleRow:!0,singleRow:!0,maxNumCols:1,leqno:e.parser.settings.leqno};return Ks(e.parser,t,`display`)},htmlBuilder:Js,mathmlBuilder:Xs}),Rs({type:`array`,names:[`CD`],props:{numArgs:0},handler(e){return Us(e),Ko(e.parser)},htmlBuilder:Js,mathmlBuilder:Xs}),$(`\\nonumber`,`\\gdef\\@eqnsw{0}`),$(`\\notag`,`\\nonumber`),q({type:`text`,names:[`\\hline`,`\\hdashline`],props:{numArgs:0,allowedInText:!0,allowedInMath:!0},handler(e,t){throw new D(e.funcName+` valid only within array environment`)}});var Qs=Ls;q({type:`environment`,names:[`\\begin`,`\\end`],props:{numArgs:1,argTypes:[`text`]},handler(e,t){var{parser:n,funcName:r}=e,i=t[0];if(i.type!==`ordgroup`)throw new D(`Invalid environment name`,i);for(var a=``,o=0;o<i.body.length;++o)a+=Q(i.body[o],`textord`).text;if(r===`\\begin`){if(!Qs.hasOwnProperty(a))throw new D(`No such environment: `+a,i);var s=Qs[a],{args:c,optArgs:l}=n.parseArguments(`\\begin{`+a+`}`,s),u={mode:n.mode,envName:a,parser:n},d=s.handler(u,c,l);n.expect(`\\end`,!1);var f=n.nextToken,p=Q(n.parseFunction(),`environment`);if(p.name!==a)throw new D(`Mismatch: \\begin{`+a+`} matched by \\end{`+p.name+`}`,f);return d}return{type:`environment`,mode:n.mode,name:a,nameGroup:i}}});var $s=(e,t)=>{var n=e.font,r=t.withFont(n);return Y(e.body,r)},ec=(e,t)=>{var n=e.font,r=t.withFont(n);return Z(e.body,r)},tc={"\\Bbb":`\\mathbb`,"\\bold":`\\mathbf`,"\\frak":`\\mathfrak`};q({type:`font`,names:[`\\mathrm`,`\\mathit`,`\\mathbf`,`\\mathnormal`,`\\mathsfit`,`\\mathbb`,`\\mathcal`,`\\mathfrak`,`\\mathscr`,`\\mathsf`,`\\mathtt`,`\\Bbb`,`\\bold`,`\\frak`],props:{numArgs:1,allowedInArgument:!0},handler:(e,t)=>{var{parser:n,funcName:r}=e,i=Va(t[0]),a=r;return a in tc&&(a=tc[a]),{type:`font`,mode:n.mode,font:a.slice(1),body:i}},htmlBuilder:$s,mathmlBuilder:ec}),q({type:`mclass`,names:[`\\boldsymbol`,`\\bm`],props:{numArgs:1},handler:(e,t)=>{var{parser:n}=e,r=t[0];return{type:`mclass`,mode:n.mode,mclass:Bo(r),body:[{type:`font`,mode:n.mode,font:`boldsymbol`,body:r}],isCharacterBox:gr(r)}}}),q({type:`font`,names:[`\\rm`,`\\sf`,`\\tt`,`\\bf`,`\\it`,`\\cal`],props:{numArgs:0,allowedInText:!0},handler:(e,t)=>{var{parser:n,funcName:r,breakOnTokenText:i}=e,{mode:a}=n,o=n.parseExpression(!0,i);return{type:`font`,mode:a,font:`math`+r.slice(1),body:{type:`ordgroup`,mode:n.mode,body:o}}},htmlBuilder:$s,mathmlBuilder:ec});var nc=(e,t)=>{var n=t.style,r=n.fracNum(),i=n.fracDen(),a=t.havingStyle(r),o=Y(e.numer,a,t);if(e.continued){var s=8.5/t.fontMetrics().ptPerEm,c=3.5/t.fontMetrics().ptPerEm;o.height=o.height<s?s:o.height,o.depth=o.depth<c?c:o.depth}a=t.havingStyle(i);var l=Y(e.denom,a,t),u,d,f;e.hasBarLine?(e.barSize?(d=k(e.barSize,t),u=Ca(`frac-line`,t,d)):u=Ca(`frac-line`,t),d=u.height,f=u.height):(u=null,d=0,f=t.fontMetrics().defaultRuleThickness);var p,m,h;n.size===O.DISPLAY.size?(p=t.fontMetrics().num1,m=d>0?3*f:7*f,h=t.fontMetrics().denom1):(d>0?(p=t.fontMetrics().num2,m=f):(p=t.fontMetrics().num3,m=3*f),h=t.fontMetrics().denom2);var g;if(u){var _=t.fontMetrics().axisHeight;p-o.depth-(_+.5*d)<m&&(p+=m-(p-o.depth-(_+.5*d))),_-.5*d-(l.height-h)<m&&(h+=m-(_-.5*d-(l.height-h)));var v=-(_-.5*d);g=G({positionType:`individualShift`,children:[{type:`elem`,elem:l,shift:h},{type:`elem`,elem:u,shift:v},{type:`elem`,elem:o,shift:-p}]})}else{var y=p-o.depth-(l.height-h);y<m&&(p+=.5*(m-y),h+=.5*(m-y)),g=G({positionType:`individualShift`,children:[{type:`elem`,elem:l,shift:h},{type:`elem`,elem:o,shift:-p}]})}a=t.havingStyle(n),g.height*=a.sizeMultiplier/t.sizeMultiplier,g.depth*=a.sizeMultiplier/t.sizeMultiplier;var b=n.size===O.DISPLAY.size?t.fontMetrics().delim1:n.size===O.SCRIPTSCRIPT.size?t.havingStyle(O.SCRIPT).fontMetrics().delim2:t.fontMetrics().delim2,ee=e.leftDelim==null?Za(t,[`mopen`]):Os(e.leftDelim,b,!0,t.havingStyle(n),e.mode,[`mopen`]),x=e.continued?W([]):e.rightDelim==null?Za(t,[`mclose`]):Os(e.rightDelim,b,!0,t.havingStyle(n),e.mode,[`mclose`]);return W([`mord`].concat(a.sizingClasses(t)),[ee,W([`mfrac`],[g]),x],t)},rc=(e,t)=>{var n=new X(`mfrac`,[Z(e.numer,t),Z(e.denom,t)]);if(!e.hasBarLine)n.setAttribute(`linethickness`,`0px`);else if(e.barSize){var r=k(e.barSize,t);n.setAttribute(`linethickness`,A(r))}if(e.leftDelim!=null||e.rightDelim!=null){var i=[];if(e.leftDelim!=null){var a=new X(`mo`,[new to(e.leftDelim.replace(`\\`,``))]);a.setAttribute(`fence`,`true`),i.push(a)}if(i.push(n),e.rightDelim!=null){var o=new X(`mo`,[new to(e.rightDelim.replace(`\\`,``))]);o.setAttribute(`fence`,`true`),i.push(o)}return oo(i)}return n},ic=(e,t)=>t?{type:`styling`,mode:e.mode,style:t,body:[e]}:e;q({type:`genfrac`,names:[`\\cfrac`,`\\dfrac`,`\\frac`,`\\tfrac`,`\\dbinom`,`\\binom`,`\\tbinom`,`\\\\atopfrac`,`\\\\bracefrac`,`\\\\brackfrac`],props:{numArgs:2,allowedInArgument:!0},handler:(e,t)=>{var{parser:n,funcName:r}=e,i=t[0],a=t[1],o,s=null,c=null;switch(r){case`\\cfrac`:case`\\dfrac`:case`\\frac`:case`\\tfrac`:o=!0;break;case`\\\\atopfrac`:o=!1;break;case`\\dbinom`:case`\\binom`:case`\\tbinom`:o=!1,s=`(`,c=`)`;break;case`\\\\bracefrac`:o=!1,s=`\\{`,c=`\\}`;break;case`\\\\brackfrac`:o=!1,s=`[`,c=`]`;break;default:throw Error(`Unrecognized genfrac command`)}var l=r===`\\cfrac`,u=null;return l||r.startsWith(`\\d`)?u=`display`:r.startsWith(`\\t`)&&(u=`text`),ic({type:`genfrac`,mode:n.mode,numer:i,denom:a,continued:l,hasBarLine:o,leftDelim:s,rightDelim:c,barSize:null},u)},htmlBuilder:nc,mathmlBuilder:rc}),q({type:`infix`,names:[`\\over`,`\\choose`,`\\atop`,`\\brace`,`\\brack`],props:{numArgs:0,infix:!0},handler(e){var{parser:t,funcName:n,token:r}=e,i;switch(n){case`\\over`:i=`\\frac`;break;case`\\choose`:i=`\\binom`;break;case`\\atop`:i=`\\\\atopfrac`;break;case`\\brace`:i=`\\\\bracefrac`;break;case`\\brack`:i=`\\\\brackfrac`;break;default:throw Error(`Unrecognized infix genfrac command`)}return{type:`infix`,mode:t.mode,replaceWith:i,token:r}}});var ac=[`display`,`text`,`script`,`scriptscript`],oc=function(e){var t=null;return e.length>0&&(t=e,t=t===`.`?null:t),t};q({type:`genfrac`,names:[`\\genfrac`],props:{numArgs:6,allowedInArgument:!0,argTypes:[`math`,`math`,`size`,`text`,`math`,`math`]},handler(e,t){var{parser:n}=e,r=t[4],i=t[5],a=Va(t[0]),o=a.type===`atom`&&a.family===`open`?oc(a.text):null,s=Va(t[1]),c=s.type===`atom`&&s.family===`close`?oc(s.text):null,l=Q(t[2],`size`),u,d=null;l.isBlank?u=!0:(d=l.value,u=d.number>0);var f=null,p=t[3];if(p.type===`ordgroup`){if(p.body.length>0){var m=Q(p.body[0],`textord`);f=ac[Number(m.text)]}}else p=Q(p,`textord`),f=ac[Number(p.text)];return ic({type:`genfrac`,mode:n.mode,numer:r,denom:i,continued:!1,hasBarLine:u,barSize:d,leftDelim:o,rightDelim:c},f)}}),q({type:`infix`,names:[`\\above`],props:{numArgs:1,argTypes:[`size`],infix:!0},handler(e,t){var{parser:n,funcName:r,token:i}=e;return{type:`infix`,mode:n.mode,replaceWith:`\\\\abovefrac`,size:Q(t[0],`size`).value,token:i}}}),q({type:`genfrac`,names:[`\\\\abovefrac`],props:{numArgs:3,argTypes:[`math`,`size`,`math`]},handler:(e,t)=>{var{parser:n,funcName:r}=e,i=t[0],a=Q(t[1],`infix`).size;if(!a)throw Error(`\\\\abovefrac expected size, but got `+String(a));var o=t[2],s=a.number>0;return{type:`genfrac`,mode:n.mode,numer:i,denom:o,continued:!1,hasBarLine:s,barSize:a,leftDelim:null,rightDelim:null}}});var sc=(e,t)=>{var n=t.style,r,i;e.type===`supsub`?(r=e.sup?Y(e.sup,t.havingStyle(n.sup()),t):Y(e.sub,t.havingStyle(n.sub()),t),i=Q(e.base,`horizBrace`)):i=Q(e,`horizBrace`);var a=Y(i.base,t.havingBaseStyle(O.DISPLAY)),o=Eo(i,t),s=i.isOver?G({positionType:`firstBaseline`,children:[{type:`elem`,elem:a},{type:`kern`,size:.1},{type:`elem`,elem:o,wrapperClasses:[`svg-align`]}]}):G({positionType:`bottom`,positionData:a.depth+.1+o.height,children:[{type:`elem`,elem:o,wrapperClasses:[`svg-align`]},{type:`kern`,size:.1},{type:`elem`,elem:a}]});if(r){var c=W([`minner`,i.isOver?`mover`:`munder`],[s],t);s=i.isOver?G({positionType:`firstBaseline`,children:[{type:`elem`,elem:c},{type:`kern`,size:.2},{type:`elem`,elem:r}]}):G({positionType:`bottom`,positionData:c.depth+.2+r.height+r.depth,children:[{type:`elem`,elem:r},{type:`kern`,size:.2},{type:`elem`,elem:c}]})}return W([`minner`,i.isOver?`mover`:`munder`],[s],t)};q({type:`horizBrace`,names:[`\\overbrace`,`\\underbrace`,`\\overbracket`,`\\underbracket`],props:{numArgs:1},handler(e,t){var{parser:n,funcName:r}=e;return{type:`horizBrace`,mode:n.mode,label:r,isOver:r.includes(`\\over`),base:t[0]}},htmlBuilder:sc,mathmlBuilder:(e,t)=>{var n=Co(e.label);return new X(e.isOver?`mover`:`munder`,[Z(e.base,t),n])}}),q({type:`href`,names:[`\\href`],props:{numArgs:2,argTypes:[`url`,`original`],allowedInText:!0},handler:(e,t)=>{var{parser:n}=e,r=t[1],i=Q(t[0],`url`).url;return n.settings.isTrusted({command:`\\href`,url:i})?{type:`href`,mode:n.mode,href:i,body:J(r)}:n.formatUnsupportedCmd(`\\href`)},htmlBuilder:(e,t)=>{var n=Ka(e.body,t,!1);return wa(e.href,[],n,t)},mathmlBuilder:(e,t)=>{var n=fo(e.body,t);return n instanceof X||(n=new X(`mrow`,[n])),n.setAttribute(`href`,e.href),n}}),q({type:`href`,names:[`\\url`],props:{numArgs:1,argTypes:[`url`],allowedInText:!0},handler:(e,t)=>{var{parser:n}=e,r=Q(t[0],`url`).url;if(!n.settings.isTrusted({command:`\\url`,url:r}))return n.formatUnsupportedCmd(`\\url`);for(var i=[],a=0;a<r.length;a++){var o=r[a];o===`~`&&(o=`\\textasciitilde`),i.push({type:`textord`,mode:`text`,text:o})}var s={type:`text`,mode:n.mode,font:`\\texttt`,body:i};return{type:`href`,mode:n.mode,href:r,body:J(s)}}}),q({type:`hbox`,names:[`\\hbox`],props:{numArgs:1,argTypes:[`text`],allowedInText:!0,primitive:!0},handler(e,t){var{parser:n}=e;return{type:`hbox`,mode:n.mode,body:J(t[0])}},htmlBuilder(e,t){var n=Ka(e.body,t.withFont(``),!1);return Ta(n)},mathmlBuilder(e,t){return new X(`mrow`,uo(e.body,t.withFont(``)))}}),q({type:`html`,names:[`\\htmlClass`,`\\htmlId`,`\\htmlStyle`,`\\htmlData`],props:{numArgs:2,argTypes:[`raw`,`original`],allowedInText:!0},handler:(e,t)=>{var{parser:n,funcName:r,token:i}=e,a=Q(t[0],`raw`).string,o=t[1];n.settings.strict&&n.settings.reportNonstrict(`htmlExtension`,`HTML extension is disabled on strict mode`);var s,c={};switch(r){case`\\htmlClass`:c.class=a,s={command:`\\htmlClass`,class:a};break;case`\\htmlId`:c.id=a,s={command:`\\htmlId`,id:a};break;case`\\htmlStyle`:c.style=a,s={command:`\\htmlStyle`,style:a};break;case`\\htmlData`:for(var l=a.split(`,`),u=0;u<l.length;u++){var d=l[u],f=d.indexOf(`=`);if(f<0)throw new D(`\\htmlData key/value '`+d+`' missing equals sign`);var p=d.slice(0,f),m=d.slice(f+1);c[`data-`+p.trim()]=m}s={command:`\\htmlData`,attributes:c};break;default:throw Error(`Unrecognized html command`)}return n.settings.isTrusted(s)?{type:`html`,mode:n.mode,attributes:c,body:J(o)}:n.formatUnsupportedCmd(r)},htmlBuilder:(e,t)=>{var n=Ka(e.body,t,!1),r=[`enclosing`];e.attributes.class&&r.push(...e.attributes.class.trim().split(/\s+/));var i=W(r,n,t);for(var a in e.attributes)a!==`class`&&e.attributes.hasOwnProperty(a)&&i.setAttribute(a,e.attributes[a]);return i},mathmlBuilder:(e,t)=>fo(e.body,t)}),q({type:`htmlmathml`,names:[`\\html@mathml`],props:{numArgs:2,allowedInArgument:!0,allowedInText:!0},handler:(e,t)=>{var{parser:n}=e;return{type:`htmlmathml`,mode:n.mode,html:J(t[0]),mathml:J(t[1])}},htmlBuilder:(e,t)=>{var n=Ka(e.html,t,!1);return Ta(n)},mathmlBuilder:(e,t)=>fo(e.mathml,t)});var cc=function(e){if(/^[-+]? *(\d+(\.\d*)?|\.\d+)$/.test(e))return{number:+e,unit:`bp`};var t=/([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(e);if(!t)throw new D(`Invalid size: '`+e+`' in \\includegraphics`);var n={number:+(t[1]+t[2]),unit:t[3]};if(!oi(n))throw new D(`Invalid unit: '`+n.unit+`' in \\includegraphics.`);return n};q({type:`includegraphics`,names:[`\\includegraphics`],props:{numArgs:1,numOptionalArgs:1,argTypes:[`raw`,`url`],allowedInText:!1},handler:(e,t,n)=>{var{parser:r}=e,i={number:0,unit:`em`},a={number:.9,unit:`em`},o={number:0,unit:`em`},s=``;if(n[0])for(var c=Q(n[0],`raw`).string.split(`,`),l=0;l<c.length;l++){var u=c[l].split(`=`);if(u.length===2){var d=u[1].trim();switch(u[0].trim()){case`alt`:s=d;break;case`width`:i=cc(d);break;case`height`:a=cc(d);break;case`totalheight`:o=cc(d);break;default:throw new D(`Invalid key: '`+u[0]+`' in \\includegraphics.`)}}}var f=Q(t[0],`url`).url;return s===``&&(s=f,s=s.replace(/^.*[\\/]/,``),s=s.substring(0,s.lastIndexOf(`.`))),r.settings.isTrusted({command:`\\includegraphics`,url:f})?{type:`includegraphics`,mode:r.mode,alt:s,width:i,height:a,totalheight:o,src:f}:r.formatUnsupportedCmd(`\\includegraphics`)},htmlBuilder:(e,t)=>{var n=k(e.height,t),r=0;e.totalheight.number>0&&(r=k(e.totalheight,t)-n);var i=0;e.width.number>0&&(i=k(e.width,t));var a={height:A(n+r)};i>0&&(a.width=A(i)),r>0&&(a.verticalAlign=A(-r));var o=new hi(e.src,e.alt,a);return o.height=n,o.depth=r,o},mathmlBuilder:(e,t)=>{var n=new X(`mglyph`,[]);n.setAttribute(`alt`,e.alt);var r=k(e.height,t),i=0;if(e.totalheight.number>0&&(i=k(e.totalheight,t)-r,n.setAttribute(`valign`,A(-i))),n.setAttribute(`height`,A(r+i)),e.width.number>0){var a=k(e.width,t);n.setAttribute(`width`,A(a))}return n.setAttribute(`src`,e.src),n}}),q({type:`kern`,names:[`\\kern`,`\\mkern`,`\\hskip`,`\\mskip`],props:{numArgs:1,argTypes:[`size`],primitive:!0,allowedInText:!0},handler(e,t){var{parser:n,funcName:r}=e,i=Q(t[0],`size`);if(n.settings.strict){var a=r[1]===`m`,o=i.value.unit===`mu`;a?(o||n.settings.reportNonstrict(`mathVsTextUnits`,`LaTeX's `+r+` supports only mu units, `+(`not `+i.value.unit+` units`)),n.mode!==`math`&&n.settings.reportNonstrict(`mathVsTextUnits`,`LaTeX's `+r+` works only in math mode`)):o&&n.settings.reportNonstrict(`mathVsTextUnits`,`LaTeX's `+r+` doesn't support mu units`)}return{type:`kern`,mode:n.mode,dimension:i.value}},htmlBuilder(e,t){return Oa(e.dimension,t)},mathmlBuilder(e,t){var n=k(e.dimension,t);return new no(n)}}),q({type:`lap`,names:[`\\mathllap`,`\\mathrlap`,`\\mathclap`],props:{numArgs:1,allowedInText:!0},handler:(e,t)=>{var{parser:n,funcName:r}=e,i=t[0];return{type:`lap`,mode:n.mode,alignment:r.slice(5),body:i}},htmlBuilder:(e,t)=>{var n;e.alignment===`clap`?(n=W([],[Y(e.body,t)]),n=W([`inner`],[n],t)):n=W([`inner`],[Y(e.body,t)]);var r=W([`fix`],[]),i=W([e.alignment],[n,r],t),a=W([`strut`]);return a.style.height=A(i.height+i.depth),i.depth&&(a.style.verticalAlign=A(-i.depth)),i.children.unshift(a),i=W([`thinbox`],[i],t),W([`mord`,`vbox`],[i],t)},mathmlBuilder:(e,t)=>{var n=new X(`mpadded`,[Z(e.body,t)]);if(e.alignment!==`rlap`){var r=e.alignment===`llap`?`-1`:`-0.5`;n.setAttribute(`lspace`,r+`width`)}return n.setAttribute(`width`,`0px`),n}}),q({type:`styling`,names:[`\\(`,`$`],props:{numArgs:0,allowedInText:!0,allowedInMath:!1},handler(e,t){var{funcName:n,parser:r}=e,i=r.mode;r.switchMode(`math`);var a=n===`\\(`?`\\)`:`$`,o=r.parseExpression(!1,a);return r.expect(a),r.switchMode(i),{type:`styling`,mode:r.mode,style:`text`,resetFont:!0,body:o}}}),q({type:`text`,names:[`\\)`,`\\]`],props:{numArgs:0,allowedInText:!0,allowedInMath:!1},handler(e,t){throw new D(`Mismatched `+e.funcName)}});var lc=(e,t)=>{switch(t.style.size){case O.DISPLAY.size:return e.display;case O.TEXT.size:return e.text;case O.SCRIPT.size:return e.script;case O.SCRIPTSCRIPT.size:return e.scriptscript;default:return e.text}};q({type:`mathchoice`,names:[`\\mathchoice`],props:{numArgs:4,primitive:!0},handler:(e,t)=>{var{parser:n}=e;return{type:`mathchoice`,mode:n.mode,display:J(t[0]),text:J(t[1]),script:J(t[2]),scriptscript:J(t[3])}},htmlBuilder:(e,t)=>{var n=lc(e,t),r=Ka(n,t,!1);return Ta(r)},mathmlBuilder:(e,t)=>{var n=lc(e,t);return fo(n,t)}});var uc=(e,t,n,r,i,a,o)=>{e=W([],[e]);var s=n&&gr(n),c,l;if(t){var u=Y(t,r.havingStyle(i.sup()),r);l={elem:u,kern:Math.max(r.fontMetrics().bigOpSpacing1,r.fontMetrics().bigOpSpacing3-u.depth)}}if(n){var d=Y(n,r.havingStyle(i.sub()),r);c={elem:d,kern:Math.max(r.fontMetrics().bigOpSpacing2,r.fontMetrics().bigOpSpacing4-d.height)}}var f;if(l&&c){var p=r.fontMetrics().bigOpSpacing5+c.elem.height+c.elem.depth+c.kern+e.depth+o;f=G({positionType:`bottom`,positionData:p,children:[{type:`kern`,size:r.fontMetrics().bigOpSpacing5},{type:`elem`,elem:c.elem,marginLeft:A(-a)},{type:`kern`,size:c.kern},{type:`elem`,elem:e},{type:`kern`,size:l.kern},{type:`elem`,elem:l.elem,marginLeft:A(a)},{type:`kern`,size:r.fontMetrics().bigOpSpacing5}]})}else if(c){var m=e.height-o;f=G({positionType:`top`,positionData:m,children:[{type:`kern`,size:r.fontMetrics().bigOpSpacing5},{type:`elem`,elem:c.elem,marginLeft:A(-a)},{type:`kern`,size:c.kern},{type:`elem`,elem:e}]})}else if(l){var h=e.depth+o;f=G({positionType:`bottom`,positionData:h,children:[{type:`elem`,elem:e},{type:`kern`,size:l.kern},{type:`elem`,elem:l.elem,marginLeft:A(a)},{type:`kern`,size:r.fontMetrics().bigOpSpacing5}]})}else return e;var g=[f];if(c&&a!==0&&!s){var _=W([`mspace`],[],r);_.style.marginRight=A(a),g.unshift(_)}return W([`mop`,`op-limits`],g,r)},dc=new Set([`\\smallint`]),fc=(e,t)=>{var n,r,i=!1,a;e.type===`supsub`?(n=e.sup,r=e.sub,a=Q(e.base,`op`),i=!0):a=Q(e,`op`);var o=t.style,s=!1;o.size===O.DISPLAY.size&&a.symbol&&!dc.has(a.name)&&(s=!0);var c,l;if(a.symbol){var u=s?`Size2-Regular`:`Size1-Regular`,d=``;if((a.name===`\\oiint`||a.name===`\\oiiint`)&&(d=a.name.slice(1),a.name=d===`oiint`?`\\iint`:`\\iiint`),c=ha(a.name,u,`math`,t,[`mop`,`op-symbol`,s?`large-op`:`small-op`]),l=c.italic,d.length>0){var f=Ma(d+`Size`+(s?`2`:`1`),t);c=G({positionType:`individualShift`,children:[{type:`elem`,elem:c,shift:0},{type:`elem`,elem:f,shift:s?.08:0}]}),a.name=`\\`+d,c.classes.unshift(`mop`),c.italic=l}}else if(a.body){var p=Ka(a.body,t,!0);p.length===1&&p[0]instanceof _i?(c=p[0],c.classes[0]=`mop`):c=W([`mop`],p,t)}else{for(var m=[],h=1;h<a.name.length;h++)m.push(ga(a.name[h],a.mode,t));c=W([`mop`],m,t)}var g=0,_=0;return(c instanceof _i||a.name===`\\oiint`||a.name===`\\oiiint`)&&!a.suppressBaseShift&&(g=(c.height-c.depth)/2-t.fontMetrics().axisHeight,_=c.italic??0),i?uc(c,n,r,t,o,_,g):(g&&(c.style.position=`relative`,c.style.top=A(g)),c)},pc=(e,t)=>{var n;if(e.symbol)n=new X(`mo`,[ao(e.name,e.mode)]),dc.has(e.name)&&n.setAttribute(`largeop`,`false`);else if(e.body)n=new X(`mo`,uo(e.body,t));else{n=new X(`mi`,[new to(e.name.slice(1))]);var r=new X(`mo`,[ao(`⁡`,`text`)]);n=e.parentIsSupSub?new X(`mrow`,[n,r]):eo([n,r])}return n},mc={"∏":`\\prod`,"∐":`\\coprod`,"∑":`\\sum`,"⋀":`\\bigwedge`,"⋁":`\\bigvee`,"⋂":`\\bigcap`,"⋃":`\\bigcup`,"⨀":`\\bigodot`,"⨁":`\\bigoplus`,"⨂":`\\bigotimes`,"⨄":`\\biguplus`,"⨆":`\\bigsqcup`};q({type:`op`,names:`\\coprod.\\bigvee.\\bigwedge.\\biguplus.\\bigcap.\\bigcup.\\intop.\\prod.\\sum.\\bigotimes.\\bigoplus.\\bigodot.\\bigsqcup.\\smallint.∏.∐.∑.⋀.⋁.⋂.⋃.⨀.⨁.⨂.⨄.⨆`.split(`.`),props:{numArgs:0},handler:(e,t)=>{var{parser:n,funcName:r}=e,i=r;return i.length===1&&(i=mc[i]),{type:`op`,mode:n.mode,limits:!0,parentIsSupSub:!1,symbol:!0,name:i}},htmlBuilder:fc,mathmlBuilder:pc}),q({type:`op`,names:[`\\mathop`],props:{numArgs:1,primitive:!0},handler:(e,t)=>{var{parser:n}=e,r=t[0];return{type:`op`,mode:n.mode,limits:!1,parentIsSupSub:!1,symbol:!1,body:J(r)}},htmlBuilder:fc,mathmlBuilder:pc});var hc={"∫":`\\int`,"∬":`\\iint`,"∭":`\\iiint`,"∮":`\\oint`,"∯":`\\oiint`,"∰":`\\oiiint`};q({type:`op`,names:`\\arcsin.\\arccos.\\arctan.\\arctg.\\arcctg.\\arg.\\ch.\\cos.\\cosec.\\cosh.\\cot.\\cotg.\\coth.\\csc.\\ctg.\\cth.\\deg.\\dim.\\exp.\\hom.\\ker.\\lg.\\ln.\\log.\\sec.\\sin.\\sinh.\\sh.\\tan.\\tanh.\\tg.\\th`.split(`.`),props:{numArgs:0},handler(e){var{parser:t,funcName:n}=e;return{type:`op`,mode:t.mode,limits:!1,parentIsSupSub:!1,symbol:!1,name:n}},htmlBuilder:fc,mathmlBuilder:pc}),q({type:`op`,names:[`\\det`,`\\gcd`,`\\inf`,`\\lim`,`\\max`,`\\min`,`\\Pr`,`\\sup`],props:{numArgs:0},handler(e){var{parser:t,funcName:n}=e;return{type:`op`,mode:t.mode,limits:!0,parentIsSupSub:!1,symbol:!1,name:n}},htmlBuilder:fc,mathmlBuilder:pc}),q({type:`op`,names:[`\\int`,`\\iint`,`\\iiint`,`\\oint`,`\\oiint`,`\\oiiint`,`∫`,`∬`,`∭`,`∮`,`∯`,`∰`],props:{numArgs:0,allowedInArgument:!0},handler(e){var{parser:t,funcName:n}=e,r=n;return r.length===1&&(r=hc[r]),{type:`op`,mode:t.mode,limits:!1,parentIsSupSub:!1,symbol:!0,name:r}},htmlBuilder:fc,mathmlBuilder:pc});var gc=(e,t)=>{var n,r,i=!1,a;e.type===`supsub`?(n=e.sup,r=e.sub,a=Q(e.base,`operatorname`),i=!0):a=Q(e,`operatorname`);var o;if(a.body.length>0){for(var s=a.body.map(e=>{var t=`text`in e?e.text:void 0;return typeof t==`string`?{type:`textord`,mode:e.mode,text:t}:e}),c=Ka(s,t.withFont(`mathrm`),!0),l=0;l<c.length;l++){var u=c[l];u instanceof _i&&(u.text=u.text.replace(/\u2212/,`-`).replace(/\u2217/,`*`))}o=W([`mop`],c,t)}else o=W([`mop`],[],t);return i?uc(o,n,r,t,t.style,0,0):o};q({type:`operatorname`,names:[`\\operatorname@`,`\\operatornamewithlimits`],props:{numArgs:1},handler:(e,t)=>{var{parser:n,funcName:r}=e,i=t[0];return{type:`operatorname`,mode:n.mode,body:J(i),alwaysHandleSupSub:r===`\\operatornamewithlimits`,limits:!1,parentIsSupSub:!1}},htmlBuilder:gc,mathmlBuilder:(e,t)=>{for(var n=uo(e.body,t.withFont(`mathrm`)),r=!0,i=0;i<n.length;i++){var a=n[i];if(!(a instanceof no))if(a instanceof X)switch(a.type){case`mi`:case`mn`:case`mspace`:case`mtext`:break;case`mo`:var o=a.children[0];a.children.length===1&&o instanceof to?o.text=o.text.replace(/\u2212/,`-`).replace(/\u2217/,`*`):r=!1;break;default:r=!1}else r=!1}if(r){var s=n.map(e=>e.toText()).join(``);n=[new to(s)]}var c=new X(`mi`,n);c.setAttribute(`mathvariant`,`normal`);var l=new X(`mo`,[ao(`⁡`,`text`)]);return e.parentIsSupSub?new X(`mrow`,[c,l]):eo([c,l])}}),$(`\\operatorname`,`\\@ifstar\\operatornamewithlimits\\operatorname@`),Ba({type:`ordgroup`,htmlBuilder(e,t){return e.semisimple?Ta(Ka(e.body,t,!1)):W([`mord`],Ka(e.body,t,!0),t)},mathmlBuilder(e,t){return fo(e.body,t,!0)}}),q({type:`overline`,names:[`\\overline`],props:{numArgs:1},handler(e,t){var{parser:n}=e,r=t[0];return{type:`overline`,mode:n.mode,body:r}},htmlBuilder(e,t){var n=Y(e.body,t.havingCrampedStyle()),r=Ca(`overline-line`,t),i=t.fontMetrics().defaultRuleThickness,a=G({positionType:`firstBaseline`,children:[{type:`elem`,elem:n},{type:`kern`,size:3*i},{type:`elem`,elem:r},{type:`kern`,size:i}]});return W([`mord`,`overline`],[a],t)},mathmlBuilder(e,t){var n=new X(`mo`,[new to(`‾`)]);n.setAttribute(`stretchy`,`true`);var r=new X(`mover`,[Z(e.body,t),n]);return r.setAttribute(`accent`,`true`),r}}),q({type:`phantom`,names:[`\\phantom`],props:{numArgs:1,allowedInText:!0},handler:(e,t)=>{var{parser:n}=e,r=t[0];return{type:`phantom`,mode:n.mode,body:J(r)}},htmlBuilder:(e,t)=>{var n=Ka(e.body,t.withPhantom(),!1);return Ta(n)},mathmlBuilder:(e,t)=>{var n=uo(e.body,t);return new X(`mphantom`,n)}}),$(`\\hphantom`,`\\smash{\\phantom{#1}}`),q({type:`vphantom`,names:[`\\vphantom`],props:{numArgs:1,allowedInText:!0},handler:(e,t)=>{var{parser:n}=e,r=t[0];return{type:`vphantom`,mode:n.mode,body:r}},htmlBuilder:(e,t)=>{var n=W([`inner`],[Y(e.body,t.withPhantom())]),r=W([`fix`],[]);return W([`mord`,`rlap`],[n,r],t)},mathmlBuilder:(e,t)=>{var n=uo(J(e.body),t),r=new X(`mphantom`,n),i=new X(`mpadded`,[r]);return i.setAttribute(`width`,`0px`),i}}),q({type:`raisebox`,names:[`\\raisebox`],props:{numArgs:2,argTypes:[`size`,`hbox`],allowedInText:!0},handler(e,t){var{parser:n}=e,r=Q(t[0],`size`).value,i=t[1];return{type:`raisebox`,mode:n.mode,dy:r,body:i}},htmlBuilder(e,t){var n=Y(e.body,t),r=k(e.dy,t);return G({positionType:`shift`,positionData:-r,children:[{type:`elem`,elem:n}]})},mathmlBuilder(e,t){var n=new X(`mpadded`,[Z(e.body,t)]),r=e.dy.number+e.dy.unit;return n.setAttribute(`voffset`,r),n}}),q({type:`internal`,names:[`\\relax`],props:{numArgs:0,allowedInText:!0,allowedInArgument:!0},handler(e){var{parser:t}=e;return{type:`internal`,mode:t.mode}}}),q({type:`rule`,names:[`\\rule`],props:{numArgs:2,numOptionalArgs:1,allowedInText:!0,allowedInMath:!0,argTypes:[`size`,`size`,`size`]},handler(e,t,n){var{parser:r}=e,i=n[0],a=Q(t[0],`size`),o=Q(t[1],`size`);return{type:`rule`,mode:r.mode,shift:i&&Q(i,`size`).value,width:a.value,height:o.value}},htmlBuilder(e,t){var n=W([`mord`,`rule`],[],t),r=k(e.width,t),i=k(e.height,t),a=e.shift?k(e.shift,t):0;return n.style.borderRightWidth=A(r),n.style.borderTopWidth=A(i),n.style.bottom=A(a),n.width=r,n.height=i+a,n.depth=-a,n.maxFontSize=i*1.125*t.sizeMultiplier,n},mathmlBuilder(e,t){var n=k(e.width,t),r=k(e.height,t),i=e.shift?k(e.shift,t):0,a=t.color&&t.getColor()||`black`,o=new X(`mspace`);o.setAttribute(`mathbackground`,a),o.setAttribute(`width`,A(n)),o.setAttribute(`height`,A(r));var s=new X(`mpadded`,[o]);return i>=0?s.setAttribute(`height`,A(i)):(s.setAttribute(`height`,A(i)),s.setAttribute(`depth`,A(-i))),s.setAttribute(`voffset`,A(i)),s}});function _c(e,t,n){for(var r=Ka(e,t,!1),i=t.sizeMultiplier/n.sizeMultiplier,a=0;a<r.length;a++){var o=r[a].classes.indexOf(`sizing`);o<0?Array.prototype.push.apply(r[a].classes,t.sizingClasses(n)):r[a].classes[o+1]===`reset-size`+t.size&&(r[a].classes[o+1]=`reset-size`+n.size),r[a].height*=i,r[a].depth*=i}return Ta(r)}var vc=[`\\tiny`,`\\sixptsize`,`\\scriptsize`,`\\footnotesize`,`\\small`,`\\normalsize`,`\\large`,`\\Large`,`\\LARGE`,`\\huge`,`\\Huge`];q({type:`sizing`,names:vc,props:{numArgs:0,allowedInText:!0},handler:(e,t)=>{var{breakOnTokenText:n,funcName:r,parser:i}=e,a=i.parseExpression(!1,n);return{type:`sizing`,mode:i.mode,size:vc.indexOf(r)+1,body:a}},htmlBuilder:(e,t)=>{var n=t.havingSize(e.size);return _c(e.body,n,t)},mathmlBuilder:(e,t)=>{var n=t.havingSize(e.size),r=uo(e.body,n),i=new X(`mstyle`,r);return i.setAttribute(`mathsize`,A(n.sizeMultiplier)),i}}),q({type:`smash`,names:[`\\smash`],props:{numArgs:1,numOptionalArgs:1,allowedInText:!0},handler:(e,t,n)=>{var{parser:r}=e,i=!1,a=!1,o=n[0]&&Q(n[0],`ordgroup`);if(o)for(var s,c=0;c<o.body.length;++c){var l=o.body[c];if(s=jo(l).text,s===`t`)i=!0;else if(s===`b`)a=!0;else{i=!1,a=!1;break}}else i=!0,a=!0;var u=t[0];return{type:`smash`,mode:r.mode,body:u,smashHeight:i,smashDepth:a}},htmlBuilder:(e,t)=>{var n=W([],[Y(e.body,t)]);if(!e.smashHeight&&!e.smashDepth)return n;if(e.smashHeight&&(n.height=0),e.smashDepth&&(n.depth=0),e.smashHeight&&e.smashDepth)return W([`mord`,`smash`],[n],t);if(n.children)for(var r=0;r<n.children.length;r++)e.smashHeight&&(n.children[r].height=0),e.smashDepth&&(n.children[r].depth=0);var i=G({positionType:`firstBaseline`,children:[{type:`elem`,elem:n}]});return W([`mord`],[i],t)},mathmlBuilder:(e,t)=>{var n=new X(`mpadded`,[Z(e.body,t)]);return e.smashHeight&&n.setAttribute(`height`,`0px`),e.smashDepth&&n.setAttribute(`depth`,`0px`),n}}),q({type:`sqrt`,names:[`\\sqrt`],props:{numArgs:1,numOptionalArgs:1},handler(e,t,n){var{parser:r}=e,i=n[0],a=t[0];return{type:`sqrt`,mode:r.mode,body:a,index:i}},htmlBuilder(e,t){var n=Y(e.body,t.havingCrampedStyle());n.height===0&&(n.height=t.fontMetrics().xHeight),n=Ea(n,t);var r=t.fontMetrics().defaultRuleThickness,i=r;t.style.id<O.TEXT.id&&(i=t.fontMetrics().xHeight);var a=r+i/4,o=n.height+n.depth+a+r,{span:s,ruleWidth:c,advanceWidth:l}=_s(o,t),u=s.height-c;u>n.height+n.depth+a&&(a=(a+u-n.height-n.depth)/2);var d=s.height-n.height-a-c;n.style.paddingLeft=A(l);var f=G({positionType:`firstBaseline`,children:[{type:`elem`,elem:n,wrapperClasses:[`svg-align`]},{type:`kern`,size:-(n.height+d)},{type:`elem`,elem:s},{type:`kern`,size:c}]});if(e.index){var p=t.havingStyle(O.SCRIPTSCRIPT),m=Y(e.index,p,t),h=.6*(f.height-f.depth),g=G({positionType:`shift`,positionData:-h,children:[{type:`elem`,elem:m}]}),_=W([`root`],[g]);return W([`mord`,`sqrt`],[_,f],t)}else return W([`mord`,`sqrt`],[f],t)},mathmlBuilder(e,t){var{body:n,index:r}=e;return r?new X(`mroot`,[Z(n,t),Z(r,t)]):new X(`msqrt`,[Z(n,t)])}});var yc={display:O.DISPLAY,text:O.TEXT,script:O.SCRIPT,scriptscript:O.SCRIPTSCRIPT};function bc(e){return e in yc}q({type:`styling`,names:[`\\displaystyle`,`\\textstyle`,`\\scriptstyle`,`\\scriptscriptstyle`],props:{numArgs:0,allowedInText:!0,primitive:!0},handler(e,t){var{breakOnTokenText:n,funcName:r,parser:i}=e,a=i.parseExpression(!0,n),o=r.slice(1,r.length-5);if(!bc(o))throw Error(`Unknown style: `+o);return{type:`styling`,mode:i.mode,style:o,body:a}},htmlBuilder(e,t){var n=yc[e.style],r=t.havingStyle(n);return e.resetFont&&(r=r.withFont(``)),_c(e.body,r,t)},mathmlBuilder(e,t){var n=yc[e.style],r=t.havingStyle(n);e.resetFont&&(r=r.withFont(``));var i=uo(e.body,r),a=new X(`mstyle`,i),o={display:[`0`,`true`],text:[`0`,`false`],script:[`1`,`false`],scriptscript:[`2`,`false`]}[e.style];return a.setAttribute(`scriptlevel`,o[0]),a.setAttribute(`displaystyle`,o[1]),a}});var xc=function(e,t){var n=e.base;return n?n.type===`op`?n.limits&&(t.style.size===O.DISPLAY.size||n.alwaysHandleSupSub)?fc:null:n.type===`operatorname`?n.alwaysHandleSupSub&&(t.style.size===O.DISPLAY.size||n.limits)?gc:null:n.type===`accent`?gr(n.base)?Po:null:n.type===`horizBrace`&&!e.sub===n.isOver?sc:null:null};Ba({type:`supsub`,htmlBuilder(e,t){var n=xc(e,t);if(n)return n(e,t);var{base:r,sup:i,sub:a}=e,o=Y(r,t),s,c,l=t.fontMetrics(),u=0,d=0,f=r&&gr(r);if(i){var p=t.havingStyle(t.style.sup());s=Y(i,p,t),f||(u=o.height-p.fontMetrics().supDrop*p.sizeMultiplier/t.sizeMultiplier)}if(a){var m=t.havingStyle(t.style.sub());c=Y(a,m,t),f||(d=o.depth+m.fontMetrics().subDrop*m.sizeMultiplier/t.sizeMultiplier)}var h=t.style===O.DISPLAY?l.sup1:t.style.cramped?l.sup3:l.sup2,g=t.sizeMultiplier,_=A(.5/l.ptPerEm/g),v=null;if(c){var y=e.base&&e.base.type===`op`&&e.base.name&&(e.base.name===`\\oiint`||e.base.name===`\\oiiint`);(o instanceof _i||y)&&(v=A(-(o.italic??0)))}var b;if(s&&c){u=Math.max(u,h,s.depth+.25*l.xHeight),d=Math.max(d,l.sub2);var ee=4*l.defaultRuleThickness;if(u-s.depth-(c.height-d)<ee){d=ee-(u-s.depth)+c.height;var x=.8*l.xHeight-(u-s.depth);x>0&&(u+=x,d-=x)}var S=[{type:`elem`,elem:c,shift:d,marginRight:_,marginLeft:v},{type:`elem`,elem:s,shift:-u,marginRight:_}];b=G({positionType:`individualShift`,children:S})}else if(c)d=Math.max(d,l.sub1,c.height-.8*l.xHeight),b=G({positionType:`shift`,positionData:d,children:[{type:`elem`,elem:c,marginLeft:v,marginRight:_}]});else if(s)u=Math.max(u,h,s.depth+.25*l.xHeight),b=G({positionType:`shift`,positionData:-u,children:[{type:`elem`,elem:s,marginRight:_}]});else throw Error(`supsub must have either sup or sub.`);var C=Xa(o,`right`)||`mord`;return W([C],[o,W([`msupsub`],[b])],t)},mathmlBuilder(e,t){var n=!1,r,i;e.base&&e.base.type===`horizBrace`&&(i=!!e.sup,i===e.base.isOver&&(n=!0,r=e.base.isOver)),e.base&&(e.base.type===`op`||e.base.type===`operatorname`)&&(e.base.parentIsSupSub=!0);var a=[Z(e.base,t)];e.sub&&a.push(Z(e.sub,t)),e.sup&&a.push(Z(e.sup,t));var o;if(n)o=r?`mover`:`munder`;else if(e.sub)if(e.sup){var s=e.base;o=s&&s.type===`op`&&s.limits&&t.style===O.DISPLAY||s&&s.type===`operatorname`&&s.alwaysHandleSupSub&&(t.style===O.DISPLAY||s.limits)?`munderover`:`msubsup`}else{var c=e.base;o=c&&c.type===`op`&&c.limits&&(t.style===O.DISPLAY||c.alwaysHandleSupSub)||c&&c.type===`operatorname`&&c.alwaysHandleSupSub&&(c.limits||t.style===O.DISPLAY)?`munder`:`msub`}else{var l=e.base;o=l&&l.type===`op`&&l.limits&&(t.style===O.DISPLAY||l.alwaysHandleSupSub)||l&&l.type===`operatorname`&&l.alwaysHandleSupSub&&(l.limits||t.style===O.DISPLAY)?`mover`:`msup`}return new X(o,a)}}),Ba({type:`atom`,htmlBuilder(e,t){return ga(e.text,e.mode,t,[`m`+e.family])},mathmlBuilder(e,t){var n=new X(`mo`,[ao(e.text,e.mode)]);if(e.family===`bin`){var r=co(e,t);r===`bold-italic`&&n.setAttribute(`mathvariant`,r)}else e.family===`punct`?n.setAttribute(`separator`,`true`):(e.family===`open`||e.family===`close`)&&n.setAttribute(`stretchy`,`false`);return n}});var Sc={mi:`italic`,mn:`normal`,mtext:`normal`};Ba({type:`mathord`,htmlBuilder(e,t){return va(e,t,`mathord`)},mathmlBuilder(e,t){var n=new X(`mi`,[ao(e.text,e.mode,t)]),r=co(e,t)||`italic`;return r!==Sc[n.type]&&n.setAttribute(`mathvariant`,r),n}}),Ba({type:`textord`,htmlBuilder(e,t){return va(e,t,`textord`)},mathmlBuilder(e,t){var n=ao(e.text,e.mode,t),r=co(e,t)||`normal`,i=e.mode===`text`?new X(`mtext`,[n]):/[0-9]/.test(e.text)?new X(`mn`,[n]):e.text===`\\prime`?new X(`mo`,[n]):new X(`mi`,[n]);return r!==Sc[i.type]&&i.setAttribute(`mathvariant`,r),i}});var Cc={"\\nobreak":`nobreak`,"\\allowbreak":`allowbreak`},wc={" ":{},"\\ ":{},"~":{className:`nobreak`},"\\space":{},"\\nobreakspace":{className:`nobreak`}};Ba({type:`spacing`,htmlBuilder(e,t){if(wc.hasOwnProperty(e.text)){var n=wc[e.text].className||``;if(e.mode===`text`){var r=va(e,t,`textord`);return r.classes.push(n),r}else return W([`mspace`,n],[ga(e.text,e.mode,t)],t)}else if(Cc.hasOwnProperty(e.text))return W([`mspace`,Cc[e.text]],[],t);else throw new D(`Unknown type of space "`+e.text+`"`)},mathmlBuilder(e,t){var n;if(wc.hasOwnProperty(e.text))n=new X(`mtext`,[new to(`\xA0`)]);else if(Cc.hasOwnProperty(e.text))return new X(`mspace`);else throw new D(`Unknown type of space "`+e.text+`"`);return n}});var Tc=()=>{var e=new X(`mtd`,[]);return e.setAttribute(`width`,`50%`),e};Ba({type:`tag`,mathmlBuilder(e,t){var n=new X(`mtable`,[new X(`mtr`,[Tc(),new X(`mtd`,[fo(e.body,t)]),Tc(),new X(`mtd`,[fo(e.tag,t)])])]);return n.setAttribute(`width`,`100%`),n}});var Ec={"\\text":void 0,"\\textrm":`textrm`,"\\textsf":`textsf`,"\\texttt":`texttt`,"\\textnormal":`textrm`},Dc={"\\textbf":`textbf`,"\\textmd":`textmd`},Oc={"\\textit":`textit`,"\\textup":`textup`},kc=(e,t)=>{var n=e.font;if(n){if(Ec[n])return t.withTextFontFamily(Ec[n]);if(Dc[n])return t.withTextFontWeight(Dc[n]);if(n===`\\emph`)return t.fontShape===`textit`?t.withTextFontShape(`textup`):t.withTextFontShape(`textit`)}else return t;return t.withTextFontShape(Oc[n])};q({type:`text`,names:[`\\text`,`\\textrm`,`\\textsf`,`\\texttt`,`\\textnormal`,`\\textbf`,`\\textmd`,`\\textit`,`\\textup`,`\\emph`],props:{numArgs:1,argTypes:[`text`],allowedInArgument:!0,allowedInText:!0},handler(e,t){var{parser:n,funcName:r}=e,i=t[0];return{type:`text`,mode:n.mode,body:J(i),font:r}},htmlBuilder(e,t){var n=kc(e,t),r=Ka(e.body,n,!0);return W([`mord`,`text`],r,n)},mathmlBuilder(e,t){var n=kc(e,t);return fo(e.body,n)}}),q({type:`underline`,names:[`\\underline`],props:{numArgs:1,allowedInText:!0},handler(e,t){var{parser:n}=e;return{type:`underline`,mode:n.mode,body:t[0]}},htmlBuilder(e,t){var n=Y(e.body,t),r=Ca(`underline-line`,t),i=t.fontMetrics().defaultRuleThickness,a=G({positionType:`top`,positionData:n.height,children:[{type:`kern`,size:i},{type:`elem`,elem:r},{type:`kern`,size:3*i},{type:`elem`,elem:n}]});return W([`mord`,`underline`],[a],t)},mathmlBuilder(e,t){var n=new X(`mo`,[new to(`‾`)]);n.setAttribute(`stretchy`,`true`);var r=new X(`munder`,[Z(e.body,t),n]);return r.setAttribute(`accentunder`,`true`),r}}),q({type:`vcenter`,names:[`\\vcenter`],props:{numArgs:1,argTypes:[`original`],allowedInText:!1},handler(e,t){var{parser:n}=e;return{type:`vcenter`,mode:n.mode,body:t[0]}},htmlBuilder(e,t){var n=Y(e.body,t),r=t.fontMetrics().axisHeight,i=.5*(n.height-r-(n.depth+r));return G({positionType:`shift`,positionData:i,children:[{type:`elem`,elem:n}]})},mathmlBuilder(e,t){var n=new X(`mpadded`,[Z(e.body,t)],[`vcenter`]);return new X(`mrow`,[n])}}),q({type:`verb`,names:[`\\verb`],props:{numArgs:0,allowedInText:!0},handler(e,t,n){throw new D(`\\verb ended by end of line instead of matching delimiter`)},htmlBuilder(e,t){for(var n=Ac(e),r=[],i=t.havingStyle(t.style.text()),a=0;a<n.length;a++){var o=n[a];o===`~`&&(o=`\\textasciitilde`),r.push(ha(o,`Typewriter-Regular`,e.mode,i,[`mord`,`texttt`]))}return W([`mord`,`text`].concat(i.sizingClasses(t)),ba(r),i)},mathmlBuilder(e,t){var n=new to(Ac(e)),r=new X(`mtext`,[n]);return r.setAttribute(`mathvariant`,`monospace`),r}});var Ac=e=>e.body.replace(/ /g,e.star?`␣`:`\xA0`),jc=La,Mc=`[ \r
	]`,Nc=`\\\\[a-zA-Z@]+`,Pc=`\\\\[^\ud800-\udfff]`,Fc=`(`+Nc+`)`+Mc+`*`,Ic=`\\\\(
|[ \r	]+
?)[ \r	]*`,Lc=`[̀-ͯ]`,Rc=RegExp(Lc+`+$`),zc=`(`+Mc+`+)|`+(Ic+`|`)+`([!-\\[\\]-‧‪-퟿豈-￿]`+(Lc+`*`)+`|[\ud800-\udbff][\udc00-\udfff]`+(Lc+`*`)+`|\\\\verb\\*([^]).*?\\4|\\\\verb([^*a-zA-Z]).*?\\5`+(`|`+Fc)+(`|`+Pc+`)`),Bc=class{constructor(e,t){this.input=void 0,this.settings=void 0,this.tokenRegex=void 0,this.catcodes=void 0,this.input=e,this.settings=t,this.tokenRegex=new RegExp(zc,`g`),this.catcodes={"%":14,"~":13}}setCatcode(e,t){this.catcodes[e]=t}lex(){var e=this.input,t=this.tokenRegex.lastIndex;if(t===e.length)return new Vs(`EOF`,new Bs(this,t,t));var n=this.tokenRegex.exec(e);if(n===null||n.index!==t)throw new D(`Unexpected character: '`+e[t]+`'`,new Vs(e[t],new Bs(this,t,t+1)));var r=n[6]||n[3]||(n[2]?`\\ `:` `);if(this.catcodes[r]===14){var i=e.indexOf(`
`,this.tokenRegex.lastIndex);return i===-1?(this.tokenRegex.lastIndex=e.length,this.settings.reportNonstrict(`commentAtEnd`,`% comment has no terminating newline; LaTeX would fail because of commenting the end of math mode (e.g. $)`)):this.tokenRegex.lastIndex=i+1,this.lex()}return new Vs(r,new Bs(this,t,this.tokenRegex.lastIndex))}},Vc=class{constructor(e,t){e===void 0&&(e={}),t===void 0&&(t={}),this.current=void 0,this.builtins=void 0,this.undefStack=void 0,this.current=t,this.builtins=e,this.undefStack=[]}beginGroup(){this.undefStack.push({})}endGroup(){if(this.undefStack.length===0)throw new D(`Unbalanced namespace destruction: attempt to pop global namespace; please report this as a bug`);var e=this.undefStack.pop();for(var t in e)e.hasOwnProperty(t)&&(e[t]==null?delete this.current[t]:this.current[t]=e[t])}endGroups(){for(;this.undefStack.length>0;)this.endGroup()}has(e){return this.current.hasOwnProperty(e)||this.builtins.hasOwnProperty(e)}get(e){return this.current.hasOwnProperty(e)?this.current[e]:this.builtins[e]}set(e,t,n){if(n===void 0&&(n=!1),n){for(var r=0;r<this.undefStack.length;r++)delete this.undefStack[r][e];this.undefStack.length>0&&(this.undefStack[this.undefStack.length-1][e]=t)}else{var i=this.undefStack[this.undefStack.length-1];i&&!i.hasOwnProperty(e)&&(i[e]=this.current[e])}t==null?delete this.current[e]:this.current[e]=t}},Hc=zs;$(`\\noexpand`,function(e){var t=e.popToken();return e.isExpandable(t.text)&&(t.noexpand=!0,t.treatAsRelax=!0),{tokens:[t],numArgs:0}}),$(`\\expandafter`,function(e){var t=e.popToken();return e.expandOnce(!0),{tokens:[t],numArgs:0}}),$(`\\@firstoftwo`,function(e){return{tokens:e.consumeArgs(2)[0],numArgs:0}}),$(`\\@secondoftwo`,function(e){return{tokens:e.consumeArgs(2)[1],numArgs:0}}),$(`\\@ifnextchar`,function(e){var t=e.consumeArgs(3);e.consumeSpaces();var n=e.future();return t[0].length===1&&t[0][0].text===n.text?{tokens:t[1],numArgs:0}:{tokens:t[2],numArgs:0}}),$(`\\@ifstar`,`\\@ifnextchar *{\\@firstoftwo{#1}}`),$(`\\TextOrMath`,function(e){var t=e.consumeArgs(2);return e.mode===`text`?{tokens:t[0],numArgs:0}:{tokens:t[1],numArgs:0}});var Uc={0:0,1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,a:10,A:10,b:11,B:11,c:12,C:12,d:13,D:13,e:14,E:14,f:15,F:15};$(`\\char`,function(e){var t=e.popToken(),n,r=0;if(t.text===`'`)n=8,t=e.popToken();else if(t.text===`"`)n=16,t=e.popToken();else if(t.text==="`")if(t=e.popToken(),t.text[0]===`\\`)r=t.text.charCodeAt(1);else if(t.text===`EOF`)throw new D("\\char` missing argument");else r=t.text.charCodeAt(0);else n=10;if(n){if(r=Uc[t.text],r==null||r>=n)throw new D(`Invalid base-`+n+` digit `+t.text);for(var i;(i=Uc[e.future().text])!=null&&i<n;)r*=n,r+=i,e.popToken()}return`\\@char{`+r+`}`});var Wc=(e,t,n,r)=>{var i=e.consumeArg().tokens;if(i.length!==1)throw new D(`\\newcommand's first argument must be a macro name`);var a=i[0].text,o=e.isDefined(a);if(o&&!t)throw new D(`\\newcommand{`+a+`} attempting to redefine `+(a+`; use \\renewcommand`));if(!o&&!n)throw new D(`\\renewcommand{`+a+`} when command `+a+` does not yet exist; use \\newcommand`);var s=0;if(i=e.consumeArg().tokens,i.length===1&&i[0].text===`[`){for(var c=``,l=e.expandNextToken();l.text!==`]`&&l.text!==`EOF`;)c+=l.text,l=e.expandNextToken();if(!c.match(/^\s*[0-9]+\s*$/))throw new D(`Invalid number of arguments: `+c);s=parseInt(c),i=e.consumeArg().tokens}return o&&r||e.macros.set(a,{tokens:i,numArgs:s}),``};$(`\\newcommand`,e=>Wc(e,!1,!0,!1)),$(`\\renewcommand`,e=>Wc(e,!0,!1,!1)),$(`\\providecommand`,e=>Wc(e,!0,!0,!0)),$(`\\message`,e=>{var t=e.consumeArgs(1)[0];return console.log(t.reverse().map(e=>e.text).join(``)),``}),$(`\\errmessage`,e=>{var t=e.consumeArgs(1)[0];return console.error(t.reverse().map(e=>e.text).join(``)),``}),$(`\\show`,e=>{var t=e.popToken(),n=t.text;return console.log(t,e.macros.get(n),jc[n],j.math[n],j.text[n]),``}),$(`\\bgroup`,`{`),$(`\\egroup`,`}`),$(`~`,`\\nobreakspace`),$(`\\lq`,"`"),$(`\\rq`,`'`),$(`\\aa`,`\\r a`),$(`\\AA`,`\\r A`),$(`\\textcopyright`,"\\html@mathml{\\textcircled{c}}{\\char`©}"),$(`\\copyright`,`\\TextOrMath{\\textcopyright}{\\text{\\textcopyright}}`),$(`\\textregistered`,"\\html@mathml{\\textcircled{\\scriptsize R}}{\\char`®}"),$(`ℬ`,`\\mathscr{B}`),$(`ℰ`,`\\mathscr{E}`),$(`ℱ`,`\\mathscr{F}`),$(`ℋ`,`\\mathscr{H}`),$(`ℐ`,`\\mathscr{I}`),$(`ℒ`,`\\mathscr{L}`),$(`ℳ`,`\\mathscr{M}`),$(`ℛ`,`\\mathscr{R}`),$(`ℭ`,`\\mathfrak{C}`),$(`ℌ`,`\\mathfrak{H}`),$(`ℨ`,`\\mathfrak{Z}`),$(`\\Bbbk`,`\\Bbb{k}`),$(`\\llap`,`\\mathllap{\\textrm{#1}}`),$(`\\rlap`,`\\mathrlap{\\textrm{#1}}`),$(`\\clap`,`\\mathclap{\\textrm{#1}}`),$(`\\mathstrut`,`\\vphantom{(}`),$(`\\underbar`,`\\underline{\\text{#1}}`),$(`\\not`,`\\html@mathml{\\mathrel{\\mathrlap\\@not}\\nobreak}{\\char"338}`),$(`\\neq`,"\\html@mathml{\\mathrel{\\not=}}{\\mathrel{\\char`≠}}"),$(`\\ne`,`\\neq`),$(`≠`,`\\neq`),$(`\\notin`,"\\html@mathml{\\mathrel{{\\in}\\mathllap{/\\mskip1mu}}}{\\mathrel{\\char`∉}}"),$(`∉`,`\\notin`),$(`≘`,"\\html@mathml{\\mathrel{=\\kern{-1em}\\raisebox{0.4em}{$\\scriptsize\\frown$}}}{\\mathrel{\\char`≘}}"),$(`≙`,"\\html@mathml{\\stackrel{\\tiny\\wedge}{=}}{\\mathrel{\\char`≘}}"),$(`≚`,"\\html@mathml{\\stackrel{\\tiny\\vee}{=}}{\\mathrel{\\char`≚}}"),$(`≛`,"\\html@mathml{\\stackrel{\\scriptsize\\star}{=}}{\\mathrel{\\char`≛}}"),$(`≝`,"\\html@mathml{\\stackrel{\\tiny\\mathrm{def}}{=}}{\\mathrel{\\char`≝}}"),$(`≞`,"\\html@mathml{\\stackrel{\\tiny\\mathrm{m}}{=}}{\\mathrel{\\char`≞}}"),$(`≟`,"\\html@mathml{\\stackrel{\\tiny?}{=}}{\\mathrel{\\char`≟}}"),$(`⟂`,`\\perp`),$(`‼`,`\\mathclose{!\\mkern-0.8mu!}`),$(`∌`,`\\notni`),$(`⌜`,`\\ulcorner`),$(`⌝`,`\\urcorner`),$(`⌞`,`\\llcorner`),$(`⌟`,`\\lrcorner`),$(`©`,`\\copyright`),$(`®`,`\\textregistered`),$(`\\ulcorner`,`\\html@mathml{\\@ulcorner}{\\mathop{\\char"231c}}`),$(`\\urcorner`,`\\html@mathml{\\@urcorner}{\\mathop{\\char"231d}}`),$(`\\llcorner`,`\\html@mathml{\\@llcorner}{\\mathop{\\char"231e}}`),$(`\\lrcorner`,`\\html@mathml{\\@lrcorner}{\\mathop{\\char"231f}}`),$(`\\vdots`,`{\\varvdots\\rule{0pt}{15pt}}`),$(`⋮`,`\\vdots`),$(`\\varGamma`,`\\mathit{\\Gamma}`),$(`\\varDelta`,`\\mathit{\\Delta}`),$(`\\varTheta`,`\\mathit{\\Theta}`),$(`\\varLambda`,`\\mathit{\\Lambda}`),$(`\\varXi`,`\\mathit{\\Xi}`),$(`\\varPi`,`\\mathit{\\Pi}`),$(`\\varSigma`,`\\mathit{\\Sigma}`),$(`\\varUpsilon`,`\\mathit{\\Upsilon}`),$(`\\varPhi`,`\\mathit{\\Phi}`),$(`\\varPsi`,`\\mathit{\\Psi}`),$(`\\varOmega`,`\\mathit{\\Omega}`),$(`\\substack`,`\\begin{subarray}{c}#1\\end{subarray}`),$(`\\colon`,`\\nobreak\\mskip2mu\\mathpunct{}\\mathchoice{\\mkern-3mu}{\\mkern-3mu}{}{}{:}\\mskip6mu\\relax`),$(`\\boxed`,`\\fbox{$\\displaystyle{#1}$}`),$(`\\iff`,`\\DOTSB\\;\\Longleftrightarrow\\;`),$(`\\implies`,`\\DOTSB\\;\\Longrightarrow\\;`),$(`\\impliedby`,`\\DOTSB\\;\\Longleftarrow\\;`),$(`\\dddot`,`{\\overset{\\raisebox{-0.1ex}{\\normalsize ...}}{#1}}`),$(`\\ddddot`,`{\\overset{\\raisebox{-0.1ex}{\\normalsize ....}}{#1}}`);var Gc={",":`\\dotsc`,"\\not":`\\dotsb`,"+":`\\dotsb`,"=":`\\dotsb`,"<":`\\dotsb`,">":`\\dotsb`,"-":`\\dotsb`,"*":`\\dotsb`,":":`\\dotsb`,"\\DOTSB":`\\dotsb`,"\\coprod":`\\dotsb`,"\\bigvee":`\\dotsb`,"\\bigwedge":`\\dotsb`,"\\biguplus":`\\dotsb`,"\\bigcap":`\\dotsb`,"\\bigcup":`\\dotsb`,"\\prod":`\\dotsb`,"\\sum":`\\dotsb`,"\\bigotimes":`\\dotsb`,"\\bigoplus":`\\dotsb`,"\\bigodot":`\\dotsb`,"\\bigsqcup":`\\dotsb`,"\\And":`\\dotsb`,"\\longrightarrow":`\\dotsb`,"\\Longrightarrow":`\\dotsb`,"\\longleftarrow":`\\dotsb`,"\\Longleftarrow":`\\dotsb`,"\\longleftrightarrow":`\\dotsb`,"\\Longleftrightarrow":`\\dotsb`,"\\mapsto":`\\dotsb`,"\\longmapsto":`\\dotsb`,"\\hookrightarrow":`\\dotsb`,"\\doteq":`\\dotsb`,"\\mathbin":`\\dotsb`,"\\mathrel":`\\dotsb`,"\\relbar":`\\dotsb`,"\\Relbar":`\\dotsb`,"\\xrightarrow":`\\dotsb`,"\\xleftarrow":`\\dotsb`,"\\DOTSI":`\\dotsi`,"\\int":`\\dotsi`,"\\oint":`\\dotsi`,"\\iint":`\\dotsi`,"\\iiint":`\\dotsi`,"\\iiiint":`\\dotsi`,"\\idotsint":`\\dotsi`,"\\DOTSX":`\\dotsx`},Kc=new Set([`bin`,`rel`]);$(`\\dots`,function(e){var t=`\\dotso`,n=e.expandAfterFuture().text;return n in Gc?t=Gc[n]:(n.slice(0,4)===`\\not`||n in j.math&&Kc.has(j.math[n].group))&&(t=`\\dotsb`),t});var qc={")":!0,"]":!0,"\\rbrack":!0,"\\}":!0,"\\rbrace":!0,"\\rangle":!0,"\\rceil":!0,"\\rfloor":!0,"\\rgroup":!0,"\\rmoustache":!0,"\\right":!0,"\\bigr":!0,"\\biggr":!0,"\\Bigr":!0,"\\Biggr":!0,$:!0,";":!0,".":!0,",":!0};$(`\\dotso`,function(e){return e.future().text in qc?`\\ldots\\,`:`\\ldots`}),$(`\\dotsc`,function(e){var t=e.future().text;return t in qc&&t!==`,`?`\\ldots\\,`:`\\ldots`}),$(`\\cdots`,function(e){return e.future().text in qc?`\\@cdots\\,`:`\\@cdots`}),$(`\\dotsb`,`\\cdots`),$(`\\dotsm`,`\\cdots`),$(`\\dotsi`,`\\!\\cdots`),$(`\\dotsx`,`\\ldots\\,`),$(`\\DOTSI`,`\\relax`),$(`\\DOTSB`,`\\relax`),$(`\\DOTSX`,`\\relax`),$(`\\tmspace`,`\\TextOrMath{\\kern#1#3}{\\mskip#1#2}\\relax`),$(`\\,`,`\\tmspace+{3mu}{.1667em}`),$(`\\thinspace`,`\\,`),$(`\\>`,`\\mskip{4mu}`),$(`\\:`,`\\tmspace+{4mu}{.2222em}`),$(`\\medspace`,`\\:`),$(`\\;`,`\\tmspace+{5mu}{.2777em}`),$(`\\thickspace`,`\\;`),$(`\\!`,`\\tmspace-{3mu}{.1667em}`),$(`\\negthinspace`,`\\!`),$(`\\negmedspace`,`\\tmspace-{4mu}{.2222em}`),$(`\\negthickspace`,`\\tmspace-{5mu}{.277em}`),$(`\\enspace`,`\\kern.5em `),$(`\\enskip`,`\\hskip.5em\\relax`),$(`\\quad`,`\\hskip1em\\relax`),$(`\\qquad`,`\\hskip2em\\relax`),$(`\\tag`,`\\@ifstar\\tag@literal\\tag@paren`),$(`\\tag@paren`,`\\tag@literal{({#1})}`),$(`\\tag@literal`,e=>{if(e.macros.get(`\\df@tag`))throw new D(`Multiple \\tag`);return`\\gdef\\df@tag{\\text{#1}}`}),$(`\\bmod`,`\\mathchoice{\\mskip1mu}{\\mskip1mu}{\\mskip5mu}{\\mskip5mu}\\mathbin{\\rm mod}\\mathchoice{\\mskip1mu}{\\mskip1mu}{\\mskip5mu}{\\mskip5mu}`),$(`\\pod`,`\\allowbreak\\mathchoice{\\mkern18mu}{\\mkern8mu}{\\mkern8mu}{\\mkern8mu}(#1)`),$(`\\pmod`,`\\pod{{\\rm mod}\\mkern6mu#1}`),$(`\\mod`,`\\allowbreak\\mathchoice{\\mkern18mu}{\\mkern12mu}{\\mkern12mu}{\\mkern12mu}{\\rm mod}\\,\\,#1`),$(`\\newline`,`\\\\\\relax`),$(`\\TeX`,`\\textrm{\\html@mathml{T\\kern-.1667em\\raisebox{-.5ex}{E}\\kern-.125emX}{TeX}}`);var Jc=A(wi[`Main-Regular`][84][1]-.7*wi[`Main-Regular`][65][1]);$(`\\LaTeX`,`\\textrm{\\html@mathml{`+(`L\\kern-.36em\\raisebox{`+Jc+`}{\\scriptstyle A}`)+`\\kern-.15em\\TeX}{LaTeX}}`),$(`\\KaTeX`,`\\textrm{\\html@mathml{`+(`K\\kern-.17em\\raisebox{`+Jc+`}{\\scriptstyle A}`)+`\\kern-.15em\\TeX}{KaTeX}}`),$(`\\hspace`,`\\@ifstar\\@hspacer\\@hspace`),$(`\\@hspace`,`\\hskip #1\\relax`),$(`\\@hspacer`,`\\rule{0pt}{0pt}\\hskip #1\\relax`),$(`\\ordinarycolon`,`:`),$(`\\vcentcolon`,`\\mathrel{\\mathop\\ordinarycolon}`),$(`\\dblcolon`,`\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-.9mu}\\vcentcolon}}{\\mathop{\\char"2237}}`),$(`\\coloneqq`,`\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}=}}{\\mathop{\\char"2254}}`),$(`\\Coloneqq`,`\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}=}}{\\mathop{\\char"2237\\char"3d}}`),$(`\\coloneq`,`\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}}}{\\mathop{\\char"3a\\char"2212}}`),$(`\\Coloneq`,`\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}}}{\\mathop{\\char"2237\\char"2212}}`),$(`\\eqqcolon`,`\\html@mathml{\\mathrel{=\\mathrel{\\mkern-1.2mu}\\vcentcolon}}{\\mathop{\\char"2255}}`),$(`\\Eqqcolon`,`\\html@mathml{\\mathrel{=\\mathrel{\\mkern-1.2mu}\\dblcolon}}{\\mathop{\\char"3d\\char"2237}}`),$(`\\eqcolon`,`\\html@mathml{\\mathrel{\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\vcentcolon}}{\\mathop{\\char"2239}}`),$(`\\Eqcolon`,`\\html@mathml{\\mathrel{\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\dblcolon}}{\\mathop{\\char"2212\\char"2237}}`),$(`\\colonapprox`,`\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\approx}}{\\mathop{\\char"3a\\char"2248}}`),$(`\\Colonapprox`,`\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\approx}}{\\mathop{\\char"2237\\char"2248}}`),$(`\\colonsim`,`\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\sim}}{\\mathop{\\char"3a\\char"223c}}`),$(`\\Colonsim`,`\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\sim}}{\\mathop{\\char"2237\\char"223c}}`),$(`∷`,`\\dblcolon`),$(`∹`,`\\eqcolon`),$(`≔`,`\\coloneqq`),$(`≕`,`\\eqqcolon`),$(`⩴`,`\\Coloneqq`),$(`\\ratio`,`\\vcentcolon`),$(`\\coloncolon`,`\\dblcolon`),$(`\\colonequals`,`\\coloneqq`),$(`\\coloncolonequals`,`\\Coloneqq`),$(`\\equalscolon`,`\\eqqcolon`),$(`\\equalscoloncolon`,`\\Eqqcolon`),$(`\\colonminus`,`\\coloneq`),$(`\\coloncolonminus`,`\\Coloneq`),$(`\\minuscolon`,`\\eqcolon`),$(`\\minuscoloncolon`,`\\Eqcolon`),$(`\\coloncolonapprox`,`\\Colonapprox`),$(`\\coloncolonsim`,`\\Colonsim`),$(`\\simcolon`,`\\mathrel{\\sim\\mathrel{\\mkern-1.2mu}\\vcentcolon}`),$(`\\simcoloncolon`,`\\mathrel{\\sim\\mathrel{\\mkern-1.2mu}\\dblcolon}`),$(`\\approxcolon`,`\\mathrel{\\approx\\mathrel{\\mkern-1.2mu}\\vcentcolon}`),$(`\\approxcoloncolon`,`\\mathrel{\\approx\\mathrel{\\mkern-1.2mu}\\dblcolon}`),$(`\\notni`,"\\html@mathml{\\not\\ni}{\\mathrel{\\char`∌}}"),$(`\\limsup`,`\\DOTSB\\operatorname*{lim\\,sup}`),$(`\\liminf`,`\\DOTSB\\operatorname*{lim\\,inf}`),$(`\\injlim`,`\\DOTSB\\operatorname*{inj\\,lim}`),$(`\\projlim`,`\\DOTSB\\operatorname*{proj\\,lim}`),$(`\\varlimsup`,`\\DOTSB\\operatorname*{\\overline{lim}}`),$(`\\varliminf`,`\\DOTSB\\operatorname*{\\underline{lim}}`),$(`\\varinjlim`,`\\DOTSB\\operatorname*{\\underrightarrow{lim}}`),$(`\\varprojlim`,`\\DOTSB\\operatorname*{\\underleftarrow{lim}}`),$(`\\gvertneqq`,`\\html@mathml{\\@gvertneqq}{≩}`),$(`\\lvertneqq`,`\\html@mathml{\\@lvertneqq}{≨}`),$(`\\ngeqq`,`\\html@mathml{\\@ngeqq}{≱}`),$(`\\ngeqslant`,`\\html@mathml{\\@ngeqslant}{≱}`),$(`\\nleqq`,`\\html@mathml{\\@nleqq}{≰}`),$(`\\nleqslant`,`\\html@mathml{\\@nleqslant}{≰}`),$(`\\nshortmid`,`\\html@mathml{\\@nshortmid}{∤}`),$(`\\nshortparallel`,`\\html@mathml{\\@nshortparallel}{∦}`),$(`\\nsubseteqq`,`\\html@mathml{\\@nsubseteqq}{⊈}`),$(`\\nsupseteqq`,`\\html@mathml{\\@nsupseteqq}{⊉}`),$(`\\varsubsetneq`,`\\html@mathml{\\@varsubsetneq}{⊊}`),$(`\\varsubsetneqq`,`\\html@mathml{\\@varsubsetneqq}{⫋}`),$(`\\varsupsetneq`,`\\html@mathml{\\@varsupsetneq}{⊋}`),$(`\\varsupsetneqq`,`\\html@mathml{\\@varsupsetneqq}{⫌}`),$(`\\imath`,`\\html@mathml{\\@imath}{ı}`),$(`\\jmath`,`\\html@mathml{\\@jmath}{ȷ}`),$(`\\llbracket`,"\\html@mathml{\\mathopen{[\\mkern-3.2mu[}}{\\mathopen{\\char`⟦}}"),$(`\\rrbracket`,"\\html@mathml{\\mathclose{]\\mkern-3.2mu]}}{\\mathclose{\\char`⟧}}"),$(`⟦`,`\\llbracket`),$(`⟧`,`\\rrbracket`),$(`\\lBrace`,"\\html@mathml{\\mathopen{\\{\\mkern-3.2mu[}}{\\mathopen{\\char`⦃}}"),$(`\\rBrace`,"\\html@mathml{\\mathclose{]\\mkern-3.2mu\\}}}{\\mathclose{\\char`⦄}}"),$(`⦃`,`\\lBrace`),$(`⦄`,`\\rBrace`),$(`\\minuso`,"\\mathbin{\\html@mathml{{\\mathrlap{\\mathchoice{\\kern{0.145em}}{\\kern{0.145em}}{\\kern{0.1015em}}{\\kern{0.0725em}}\\circ}{-}}}{\\char`⦵}}"),$(`⦵`,`\\minuso`),$(`\\darr`,`\\downarrow`),$(`\\dArr`,`\\Downarrow`),$(`\\Darr`,`\\Downarrow`),$(`\\lang`,`\\langle`),$(`\\rang`,`\\rangle`),$(`\\uarr`,`\\uparrow`),$(`\\uArr`,`\\Uparrow`),$(`\\Uarr`,`\\Uparrow`),$(`\\N`,`\\mathbb{N}`),$(`\\R`,`\\mathbb{R}`),$(`\\Z`,`\\mathbb{Z}`),$(`\\alef`,`\\aleph`),$(`\\alefsym`,`\\aleph`),$(`\\Alpha`,`\\mathrm{A}`),$(`\\Beta`,`\\mathrm{B}`),$(`\\bull`,`\\bullet`),$(`\\Chi`,`\\mathrm{X}`),$(`\\clubs`,`\\clubsuit`),$(`\\cnums`,`\\mathbb{C}`),$(`\\Complex`,`\\mathbb{C}`),$(`\\Dagger`,`\\ddagger`),$(`\\diamonds`,`\\diamondsuit`),$(`\\empty`,`\\emptyset`),$(`\\Epsilon`,`\\mathrm{E}`),$(`\\Eta`,`\\mathrm{H}`),$(`\\exist`,`\\exists`),$(`\\harr`,`\\leftrightarrow`),$(`\\hArr`,`\\Leftrightarrow`),$(`\\Harr`,`\\Leftrightarrow`),$(`\\hearts`,`\\heartsuit`),$(`\\image`,`\\Im`),$(`\\infin`,`\\infty`),$(`\\Iota`,`\\mathrm{I}`),$(`\\isin`,`\\in`),$(`\\Kappa`,`\\mathrm{K}`),$(`\\larr`,`\\leftarrow`),$(`\\lArr`,`\\Leftarrow`),$(`\\Larr`,`\\Leftarrow`),$(`\\lrarr`,`\\leftrightarrow`),$(`\\lrArr`,`\\Leftrightarrow`),$(`\\Lrarr`,`\\Leftrightarrow`),$(`\\Mu`,`\\mathrm{M}`),$(`\\natnums`,`\\mathbb{N}`),$(`\\Nu`,`\\mathrm{N}`),$(`\\Omicron`,`\\mathrm{O}`),$(`\\plusmn`,`\\pm`),$(`\\rarr`,`\\rightarrow`),$(`\\rArr`,`\\Rightarrow`),$(`\\Rarr`,`\\Rightarrow`),$(`\\real`,`\\Re`),$(`\\reals`,`\\mathbb{R}`),$(`\\Reals`,`\\mathbb{R}`),$(`\\Rho`,`\\mathrm{P}`),$(`\\sdot`,`\\cdot`),$(`\\sect`,`\\S`),$(`\\spades`,`\\spadesuit`),$(`\\sub`,`\\subset`),$(`\\sube`,`\\subseteq`),$(`\\supe`,`\\supseteq`),$(`\\Tau`,`\\mathrm{T}`),$(`\\thetasym`,`\\vartheta`),$(`\\weierp`,`\\wp`),$(`\\Zeta`,`\\mathrm{Z}`),$(`\\argmin`,`\\DOTSB\\operatorname*{arg\\,min}`),$(`\\argmax`,`\\DOTSB\\operatorname*{arg\\,max}`),$(`\\plim`,`\\DOTSB\\mathop{\\operatorname{plim}}\\limits`),$(`\\bra`,`\\mathinner{\\langle{#1}|}`),$(`\\ket`,`\\mathinner{|{#1}\\rangle}`),$(`\\braket`,`\\mathinner{\\langle{#1}\\rangle}`),$(`\\Bra`,`\\left\\langle#1\\right|`),$(`\\Ket`,`\\left|#1\\right\\rangle`);var Yc=e=>t=>{var n=t.consumeArg().tokens,r=t.consumeArg().tokens,i=t.consumeArg().tokens,a=t.consumeArg().tokens,o=t.macros.get(`|`),s=t.macros.get(`\\|`);t.macros.beginGroup();var c=t=>n=>{e&&(n.macros.set(`|`,o),i.length&&n.macros.set(`\\|`,s));var a=t;return!t&&i.length&&n.future().text===`|`&&(n.popToken(),a=!0),{tokens:a?i:r,numArgs:0}};t.macros.set(`|`,c(!1)),i.length&&t.macros.set(`\\|`,c(!0));var l=t.consumeArg().tokens,u=t.expandTokens([...a,...l,...n]);return t.macros.endGroup(),{tokens:u.reverse(),numArgs:0}};$(`\\bra@ket`,Yc(!1)),$(`\\bra@set`,Yc(!0)),$(`\\Braket`,`\\bra@ket{\\left\\langle}{\\,\\middle\\vert\\,}{\\,\\middle\\vert\\,}{\\right\\rangle}`),$(`\\Set`,`\\bra@set{\\left\\{\\:}{\\;\\middle\\vert\\;}{\\;\\middle\\Vert\\;}{\\:\\right\\}}`),$(`\\set`,`\\bra@set{\\{\\,}{\\mid}{}{\\,\\}}`),$(`\\angln`,`{\\angl n}`),$(`\\blue`,`\\textcolor{##6495ed}{#1}`),$(`\\orange`,`\\textcolor{##ffa500}{#1}`),$(`\\pink`,`\\textcolor{##ff00af}{#1}`),$(`\\red`,`\\textcolor{##df0030}{#1}`),$(`\\green`,`\\textcolor{##28ae7b}{#1}`),$(`\\gray`,`\\textcolor{gray}{#1}`),$(`\\purple`,`\\textcolor{##9d38bd}{#1}`),$(`\\blueA`,`\\textcolor{##ccfaff}{#1}`),$(`\\blueB`,`\\textcolor{##80f6ff}{#1}`),$(`\\blueC`,`\\textcolor{##63d9ea}{#1}`),$(`\\blueD`,`\\textcolor{##11accd}{#1}`),$(`\\blueE`,`\\textcolor{##0c7f99}{#1}`),$(`\\tealA`,`\\textcolor{##94fff5}{#1}`),$(`\\tealB`,`\\textcolor{##26edd5}{#1}`),$(`\\tealC`,`\\textcolor{##01d1c1}{#1}`),$(`\\tealD`,`\\textcolor{##01a995}{#1}`),$(`\\tealE`,`\\textcolor{##208170}{#1}`),$(`\\greenA`,`\\textcolor{##b6ffb0}{#1}`),$(`\\greenB`,`\\textcolor{##8af281}{#1}`),$(`\\greenC`,`\\textcolor{##74cf70}{#1}`),$(`\\greenD`,`\\textcolor{##1fab54}{#1}`),$(`\\greenE`,`\\textcolor{##0d923f}{#1}`),$(`\\goldA`,`\\textcolor{##ffd0a9}{#1}`),$(`\\goldB`,`\\textcolor{##ffbb71}{#1}`),$(`\\goldC`,`\\textcolor{##ff9c39}{#1}`),$(`\\goldD`,`\\textcolor{##e07d10}{#1}`),$(`\\goldE`,`\\textcolor{##a75a05}{#1}`),$(`\\redA`,`\\textcolor{##fca9a9}{#1}`),$(`\\redB`,`\\textcolor{##ff8482}{#1}`),$(`\\redC`,`\\textcolor{##f9685d}{#1}`),$(`\\redD`,`\\textcolor{##e84d39}{#1}`),$(`\\redE`,`\\textcolor{##bc2612}{#1}`),$(`\\maroonA`,`\\textcolor{##ffbde0}{#1}`),$(`\\maroonB`,`\\textcolor{##ff92c6}{#1}`),$(`\\maroonC`,`\\textcolor{##ed5fa6}{#1}`),$(`\\maroonD`,`\\textcolor{##ca337c}{#1}`),$(`\\maroonE`,`\\textcolor{##9e034e}{#1}`),$(`\\purpleA`,`\\textcolor{##ddd7ff}{#1}`),$(`\\purpleB`,`\\textcolor{##c6b9fc}{#1}`),$(`\\purpleC`,`\\textcolor{##aa87ff}{#1}`),$(`\\purpleD`,`\\textcolor{##7854ab}{#1}`),$(`\\purpleE`,`\\textcolor{##543b78}{#1}`),$(`\\mintA`,`\\textcolor{##f5f9e8}{#1}`),$(`\\mintB`,`\\textcolor{##edf2df}{#1}`),$(`\\mintC`,`\\textcolor{##e0e5cc}{#1}`),$(`\\grayA`,`\\textcolor{##f6f7f7}{#1}`),$(`\\grayB`,`\\textcolor{##f0f1f2}{#1}`),$(`\\grayC`,`\\textcolor{##e3e5e6}{#1}`),$(`\\grayD`,`\\textcolor{##d6d8da}{#1}`),$(`\\grayE`,`\\textcolor{##babec2}{#1}`),$(`\\grayF`,`\\textcolor{##888d93}{#1}`),$(`\\grayG`,`\\textcolor{##626569}{#1}`),$(`\\grayH`,`\\textcolor{##3b3e40}{#1}`),$(`\\grayI`,`\\textcolor{##21242c}{#1}`),$(`\\kaBlue`,`\\textcolor{##314453}{#1}`),$(`\\kaGreen`,`\\textcolor{##71B307}{#1}`);var Xc={"^":!0,_:!0,"\\limits":!0,"\\nolimits":!0},Zc=class{constructor(e,t,n){this.settings=void 0,this.expansionCount=void 0,this.lexer=void 0,this.macros=void 0,this.stack=void 0,this.mode=void 0,this.settings=t,this.expansionCount=0,this.feed(e),this.macros=new Vc(Hc,t.macros),this.mode=n,this.stack=[]}feed(e){this.lexer=new Bc(e,this.settings)}switchMode(e){this.mode=e}beginGroup(){this.macros.beginGroup()}endGroup(){this.macros.endGroup()}endGroups(){this.macros.endGroups()}future(){return this.stack.length===0&&this.pushToken(this.lexer.lex()),this.stack[this.stack.length-1]}popToken(){return this.future(),this.stack.pop()}pushToken(e){this.stack.push(e)}pushTokens(e){this.stack.push(...e)}scanArgument(e){var t,n,r;if(e){if(this.consumeSpaces(),this.future().text!==`[`)return null;t=this.popToken(),{tokens:r,end:n}=this.consumeArg([`]`])}else ({tokens:r,start:t,end:n}=this.consumeArg());return this.pushToken(new Vs(`EOF`,n.loc)),this.pushTokens(r),new Vs(``,Bs.range(t,n))}consumeSpaces(){for(;this.future().text===` `;)this.stack.pop()}consumeArg(e){var t=[],n=e&&e.length>0;n||this.consumeSpaces();var r=this.future(),i,a=0,o=0;do{if(i=this.popToken(),t.push(i),i.text===`{`)++a;else if(i.text===`}`){if(--a,a===-1)throw new D(`Extra }`,i)}else if(i.text===`EOF`)throw new D(`Unexpected end of input in a macro argument, expected '`+(e&&n?e[o]:`}`)+`'`,i);if(e&&n)if((a===0||a===1&&e[o]===`{`)&&i.text===e[o]){if(++o,o===e.length){t.splice(-o,o);break}}else o=0}while(a!==0||n);return r.text===`{`&&t[t.length-1].text===`}`&&(t.pop(),t.shift()),t.reverse(),{tokens:t,start:r,end:i}}consumeArgs(e,t){if(t){if(t.length!==e+1)throw new D(`The length of delimiters doesn't match the number of args!`);for(var n=t[0],r=0;r<n.length;r++){var i=this.popToken();if(n[r]!==i.text)throw new D(`Use of the macro doesn't match its definition`,i)}}for(var a=[],o=0;o<e;o++)a.push(this.consumeArg(t&&t[o+1]).tokens);return a}countExpansion(e){if(this.expansionCount+=e,this.expansionCount>this.settings.maxExpand)throw new D(`Too many expansions: infinite loop or need to increase maxExpand setting`)}expandOnce(e){var t=this.popToken(),n=t.text,r=t.noexpand?null:this._getExpansion(n);if(r==null||e&&r.unexpandable){if(e&&r==null&&n[0]===`\\`&&!this.isDefined(n))throw new D(`Undefined control sequence: `+n);return this.pushToken(t),!1}this.countExpansion(1);var i=r.tokens,a=this.consumeArgs(r.numArgs,r.delimiters);if(r.numArgs){i=i.slice();for(var o=i.length-1;o>=0;--o){var s=i[o];if(s.text===`#`){if(o===0)throw new D(`Incomplete placeholder at end of macro body`,s);if(s=i[--o],s.text===`#`)i.splice(o+1,1);else if(/^[1-9]$/.test(s.text))i.splice(o,2,...a[s.text-1]);else throw new D(`Not a valid argument number`,s)}}}return this.pushTokens(i),i.length}expandAfterFuture(){return this.expandOnce(),this.future()}expandNextToken(){for(;;)if(this.expandOnce()===!1){var e=this.stack.pop();return e.treatAsRelax&&(e.text=`\\relax`),e}}expandMacro(e){return this.macros.has(e)?this.expandTokens([new Vs(e)]):void 0}expandTokens(e){var t=[],n=this.stack.length;for(this.pushTokens(e);this.stack.length>n;)if(this.expandOnce(!0)===!1){var r=this.stack.pop();r.treatAsRelax&&=(r.noexpand=!1,!1),t.push(r)}return this.countExpansion(t.length),t}expandMacroAsText(e){var t=this.expandMacro(e);return t&&t.map(e=>e.text).join(``)}_getExpansion(e){var t=this.macros.get(e);if(t==null)return t;if(e.length===1){var n=this.lexer.catcodes[e];if(n!=null&&n!==13)return}var r=typeof t==`function`?t(this):t;if(typeof r==`string`){var i=0;if(r.includes(`#`))for(var a=r.replace(/##/g,``);a.includes(`#`+(i+1));)++i;for(var o=new Bc(r,this.settings),s=[],c=o.lex();c.text!==`EOF`;)s.push(c),c=o.lex();return s.reverse(),{tokens:s,numArgs:i}}return r}isDefined(e){return this.macros.has(e)||jc.hasOwnProperty(e)||j.math.hasOwnProperty(e)||j.text.hasOwnProperty(e)||Xc.hasOwnProperty(e)}isExpandable(e){var t=this.macros.get(e);return t==null?jc.hasOwnProperty(e)&&!jc[e].primitive:typeof t==`string`||typeof t==`function`||!t.unexpandable}},Qc=/^[₊₋₌₍₎₀₁₂₃₄₅₆₇₈₉ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓᵦᵧᵨᵩᵪ]/,$c=Object.freeze({"₊":`+`,"₋":`-`,"₌":`=`,"₍":`(`,"₎":`)`,"₀":`0`,"₁":`1`,"₂":`2`,"₃":`3`,"₄":`4`,"₅":`5`,"₆":`6`,"₇":`7`,"₈":`8`,"₉":`9`,ₐ:`a`,ₑ:`e`,ₕ:`h`,ᵢ:`i`,ⱼ:`j`,ₖ:`k`,ₗ:`l`,ₘ:`m`,ₙ:`n`,ₒ:`o`,ₚ:`p`,ᵣ:`r`,ₛ:`s`,ₜ:`t`,ᵤ:`u`,ᵥ:`v`,ₓ:`x`,ᵦ:`β`,ᵧ:`γ`,ᵨ:`ρ`,ᵩ:`ϕ`,ᵪ:`χ`,"⁺":`+`,"⁻":`-`,"⁼":`=`,"⁽":`(`,"⁾":`)`,"⁰":`0`,"¹":`1`,"²":`2`,"³":`3`,"⁴":`4`,"⁵":`5`,"⁶":`6`,"⁷":`7`,"⁸":`8`,"⁹":`9`,ᴬ:`A`,ᴮ:`B`,ᴰ:`D`,ᴱ:`E`,ᴳ:`G`,ᴴ:`H`,ᴵ:`I`,ᴶ:`J`,ᴷ:`K`,ᴸ:`L`,ᴹ:`M`,ᴺ:`N`,ᴼ:`O`,ᴾ:`P`,ᴿ:`R`,ᵀ:`T`,ᵁ:`U`,ⱽ:`V`,ᵂ:`W`,ᵃ:`a`,ᵇ:`b`,ᶜ:`c`,ᵈ:`d`,ᵉ:`e`,ᶠ:`f`,ᵍ:`g`,ʰ:`h`,ⁱ:`i`,ʲ:`j`,ᵏ:`k`,ˡ:`l`,ᵐ:`m`,ⁿ:`n`,ᵒ:`o`,ᵖ:`p`,ʳ:`r`,ˢ:`s`,ᵗ:`t`,ᵘ:`u`,ᵛ:`v`,ʷ:`w`,ˣ:`x`,ʸ:`y`,ᶻ:`z`,ᵝ:`β`,ᵞ:`γ`,ᵟ:`δ`,ᵠ:`ϕ`,ᵡ:`χ`,ᶿ:`θ`}),el={"́":{text:`\\'`,math:`\\acute`},"̀":{text:"\\`",math:`\\grave`},"̈":{text:`\\"`,math:`\\ddot`},"̃":{text:`\\~`,math:`\\tilde`},"̄":{text:`\\=`,math:`\\bar`},"̆":{text:`\\u`,math:`\\breve`},"̌":{text:`\\v`,math:`\\check`},"̂":{text:`\\^`,math:`\\hat`},"̇":{text:`\\.`,math:`\\dot`},"̊":{text:`\\r`,math:`\\mathring`},"̋":{text:`\\H`},"̧":{text:`\\c`}},tl={á:`á`,à:`à`,ä:`ä`,ǟ:`ǟ`,ã:`ã`,ā:`ā`,ă:`ă`,ắ:`ắ`,ằ:`ằ`,ẵ:`ẵ`,ǎ:`ǎ`,â:`â`,ấ:`ấ`,ầ:`ầ`,ẫ:`ẫ`,ȧ:`ȧ`,ǡ:`ǡ`,å:`å`,ǻ:`ǻ`,ḃ:`ḃ`,ć:`ć`,ḉ:`ḉ`,č:`č`,ĉ:`ĉ`,ċ:`ċ`,ç:`ç`,ď:`ď`,ḋ:`ḋ`,ḑ:`ḑ`,é:`é`,è:`è`,ë:`ë`,ẽ:`ẽ`,ē:`ē`,ḗ:`ḗ`,ḕ:`ḕ`,ĕ:`ĕ`,ḝ:`ḝ`,ě:`ě`,ê:`ê`,ế:`ế`,ề:`ề`,ễ:`ễ`,ė:`ė`,ȩ:`ȩ`,ḟ:`ḟ`,ǵ:`ǵ`,ḡ:`ḡ`,ğ:`ğ`,ǧ:`ǧ`,ĝ:`ĝ`,ġ:`ġ`,ģ:`ģ`,ḧ:`ḧ`,ȟ:`ȟ`,ĥ:`ĥ`,ḣ:`ḣ`,ḩ:`ḩ`,í:`í`,ì:`ì`,ï:`ï`,ḯ:`ḯ`,ĩ:`ĩ`,ī:`ī`,ĭ:`ĭ`,ǐ:`ǐ`,î:`î`,ǰ:`ǰ`,ĵ:`ĵ`,ḱ:`ḱ`,ǩ:`ǩ`,ķ:`ķ`,ĺ:`ĺ`,ľ:`ľ`,ļ:`ļ`,ḿ:`ḿ`,ṁ:`ṁ`,ń:`ń`,ǹ:`ǹ`,ñ:`ñ`,ň:`ň`,ṅ:`ṅ`,ņ:`ņ`,ó:`ó`,ò:`ò`,ö:`ö`,ȫ:`ȫ`,õ:`õ`,ṍ:`ṍ`,ṏ:`ṏ`,ȭ:`ȭ`,ō:`ō`,ṓ:`ṓ`,ṑ:`ṑ`,ŏ:`ŏ`,ǒ:`ǒ`,ô:`ô`,ố:`ố`,ồ:`ồ`,ỗ:`ỗ`,ȯ:`ȯ`,ȱ:`ȱ`,ő:`ő`,ṕ:`ṕ`,ṗ:`ṗ`,ŕ:`ŕ`,ř:`ř`,ṙ:`ṙ`,ŗ:`ŗ`,ś:`ś`,ṥ:`ṥ`,š:`š`,ṧ:`ṧ`,ŝ:`ŝ`,ṡ:`ṡ`,ş:`ş`,ẗ:`ẗ`,ť:`ť`,ṫ:`ṫ`,ţ:`ţ`,ú:`ú`,ù:`ù`,ü:`ü`,ǘ:`ǘ`,ǜ:`ǜ`,ǖ:`ǖ`,ǚ:`ǚ`,ũ:`ũ`,ṹ:`ṹ`,ū:`ū`,ṻ:`ṻ`,ŭ:`ŭ`,ǔ:`ǔ`,û:`û`,ů:`ů`,ű:`ű`,ṽ:`ṽ`,ẃ:`ẃ`,ẁ:`ẁ`,ẅ:`ẅ`,ŵ:`ŵ`,ẇ:`ẇ`,ẘ:`ẘ`,ẍ:`ẍ`,ẋ:`ẋ`,ý:`ý`,ỳ:`ỳ`,ÿ:`ÿ`,ỹ:`ỹ`,ȳ:`ȳ`,ŷ:`ŷ`,ẏ:`ẏ`,ẙ:`ẙ`,ź:`ź`,ž:`ž`,ẑ:`ẑ`,ż:`ż`,Á:`Á`,À:`À`,Ä:`Ä`,Ǟ:`Ǟ`,Ã:`Ã`,Ā:`Ā`,Ă:`Ă`,Ắ:`Ắ`,Ằ:`Ằ`,Ẵ:`Ẵ`,Ǎ:`Ǎ`,Â:`Â`,Ấ:`Ấ`,Ầ:`Ầ`,Ẫ:`Ẫ`,Ȧ:`Ȧ`,Ǡ:`Ǡ`,Å:`Å`,Ǻ:`Ǻ`,Ḃ:`Ḃ`,Ć:`Ć`,Ḉ:`Ḉ`,Č:`Č`,Ĉ:`Ĉ`,Ċ:`Ċ`,Ç:`Ç`,Ď:`Ď`,Ḋ:`Ḋ`,Ḑ:`Ḑ`,É:`É`,È:`È`,Ë:`Ë`,Ẽ:`Ẽ`,Ē:`Ē`,Ḗ:`Ḗ`,Ḕ:`Ḕ`,Ĕ:`Ĕ`,Ḝ:`Ḝ`,Ě:`Ě`,Ê:`Ê`,Ế:`Ế`,Ề:`Ề`,Ễ:`Ễ`,Ė:`Ė`,Ȩ:`Ȩ`,Ḟ:`Ḟ`,Ǵ:`Ǵ`,Ḡ:`Ḡ`,Ğ:`Ğ`,Ǧ:`Ǧ`,Ĝ:`Ĝ`,Ġ:`Ġ`,Ģ:`Ģ`,Ḧ:`Ḧ`,Ȟ:`Ȟ`,Ĥ:`Ĥ`,Ḣ:`Ḣ`,Ḩ:`Ḩ`,Í:`Í`,Ì:`Ì`,Ï:`Ï`,Ḯ:`Ḯ`,Ĩ:`Ĩ`,Ī:`Ī`,Ĭ:`Ĭ`,Ǐ:`Ǐ`,Î:`Î`,İ:`İ`,Ĵ:`Ĵ`,Ḱ:`Ḱ`,Ǩ:`Ǩ`,Ķ:`Ķ`,Ĺ:`Ĺ`,Ľ:`Ľ`,Ļ:`Ļ`,Ḿ:`Ḿ`,Ṁ:`Ṁ`,Ń:`Ń`,Ǹ:`Ǹ`,Ñ:`Ñ`,Ň:`Ň`,Ṅ:`Ṅ`,Ņ:`Ņ`,Ó:`Ó`,Ò:`Ò`,Ö:`Ö`,Ȫ:`Ȫ`,Õ:`Õ`,Ṍ:`Ṍ`,Ṏ:`Ṏ`,Ȭ:`Ȭ`,Ō:`Ō`,Ṓ:`Ṓ`,Ṑ:`Ṑ`,Ŏ:`Ŏ`,Ǒ:`Ǒ`,Ô:`Ô`,Ố:`Ố`,Ồ:`Ồ`,Ỗ:`Ỗ`,Ȯ:`Ȯ`,Ȱ:`Ȱ`,Ő:`Ő`,Ṕ:`Ṕ`,Ṗ:`Ṗ`,Ŕ:`Ŕ`,Ř:`Ř`,Ṙ:`Ṙ`,Ŗ:`Ŗ`,Ś:`Ś`,Ṥ:`Ṥ`,Š:`Š`,Ṧ:`Ṧ`,Ŝ:`Ŝ`,Ṡ:`Ṡ`,Ş:`Ş`,Ť:`Ť`,Ṫ:`Ṫ`,Ţ:`Ţ`,Ú:`Ú`,Ù:`Ù`,Ü:`Ü`,Ǘ:`Ǘ`,Ǜ:`Ǜ`,Ǖ:`Ǖ`,Ǚ:`Ǚ`,Ũ:`Ũ`,Ṹ:`Ṹ`,Ū:`Ū`,Ṻ:`Ṻ`,Ŭ:`Ŭ`,Ǔ:`Ǔ`,Û:`Û`,Ů:`Ů`,Ű:`Ű`,Ṽ:`Ṽ`,Ẃ:`Ẃ`,Ẁ:`Ẁ`,Ẅ:`Ẅ`,Ŵ:`Ŵ`,Ẇ:`Ẇ`,Ẍ:`Ẍ`,Ẋ:`Ẋ`,Ý:`Ý`,Ỳ:`Ỳ`,Ÿ:`Ÿ`,Ỹ:`Ỹ`,Ȳ:`Ȳ`,Ŷ:`Ŷ`,Ẏ:`Ẏ`,Ź:`Ź`,Ž:`Ž`,Ẑ:`Ẑ`,Ż:`Ż`,ά:`ά`,ὰ:`ὰ`,ᾱ:`ᾱ`,ᾰ:`ᾰ`,έ:`έ`,ὲ:`ὲ`,ή:`ή`,ὴ:`ὴ`,ί:`ί`,ὶ:`ὶ`,ϊ:`ϊ`,ΐ:`ΐ`,ῒ:`ῒ`,ῑ:`ῑ`,ῐ:`ῐ`,ό:`ό`,ὸ:`ὸ`,ύ:`ύ`,ὺ:`ὺ`,ϋ:`ϋ`,ΰ:`ΰ`,ῢ:`ῢ`,ῡ:`ῡ`,ῠ:`ῠ`,ώ:`ώ`,ὼ:`ὼ`,Ύ:`Ύ`,Ὺ:`Ὺ`,Ϋ:`Ϋ`,Ῡ:`Ῡ`,Ῠ:`Ῠ`,Ώ:`Ώ`,Ὼ:`Ὼ`},nl=class e{constructor(e,t){this.mode=void 0,this.gullet=void 0,this.settings=void 0,this.leftrightDepth=void 0,this.nextToken=void 0,this.mode=`math`,this.gullet=new Zc(e,t,this.mode),this.settings=t,this.leftrightDepth=0,this.nextToken=null}expect(e,t){if(t===void 0&&(t=!0),this.fetch().text!==e)throw new D(`Expected '`+e+`', got '`+this.fetch().text+`'`,this.fetch());t&&this.consume()}consume(){this.nextToken=null}fetch(){return this.nextToken??=this.gullet.expandNextToken(),this.nextToken}switchMode(e){this.mode=e,this.gullet.switchMode(e)}parse(){this.settings.globalGroup||this.gullet.beginGroup(),this.settings.colorIsTextColor&&this.gullet.macros.set(`\\color`,`\\textcolor`);try{var e=this.parseExpression(!1);return this.expect(`EOF`),this.settings.globalGroup||this.gullet.endGroup(),e}finally{this.gullet.endGroups()}}subparse(e){var t=this.nextToken;this.consume(),this.gullet.pushToken(new Vs(`}`)),this.gullet.pushTokens(e);var n=this.parseExpression(!1);return this.expect(`}`),this.nextToken=t,n}parseExpression(t,n){for(var r=[];;){this.mode===`math`&&this.consumeSpaces();var i=this.fetch();if(e.endOfExpression.has(i.text)||n&&i.text===n||t&&jc[i.text]&&jc[i.text].infix)break;var a=this.parseAtom(n);if(a){if(a.type===`internal`)continue}else break;r.push(a)}return this.mode===`text`&&this.formLigatures(r),this.handleInfixNodes(r)}handleInfixNodes(e){for(var t=-1,n,r=0;r<e.length;r++){var i=e[r];if(i.type===`infix`){if(t!==-1)throw new D(`only one infix operator per group`,i.token);t=r,n=i.replaceWith}}if(t!==-1&&n){var a,o,s=e.slice(0,t),c=e.slice(t+1);return a=s.length===1&&s[0].type===`ordgroup`?s[0]:{type:`ordgroup`,mode:this.mode,body:s},o=c.length===1&&c[0].type===`ordgroup`?c[0]:{type:`ordgroup`,mode:this.mode,body:c},[n===`\\\\abovefrac`?this.callFunction(n,[a,e[t],o],[]):this.callFunction(n,[a,o],[])]}else return e}handleSupSubscript(e){var t=this.fetch(),n=t.text;this.consume(),this.consumeSpaces();var r;do r=this.parseGroup(e);while(r?.type===`internal`);if(!r)throw new D(`Expected group after '`+n+`'`,t);return r}formatUnsupportedCmd(e){for(var t=[],n=0;n<e.length;n++)t.push({type:`textord`,mode:`text`,text:e[n]});var r={type:`text`,mode:this.mode,body:t};return{type:`color`,mode:this.mode,color:this.settings.errorColor,body:[r]}}parseAtom(e){var t=this.parseGroup(`atom`,e);if(t?.type===`internal`||this.mode===`text`)return t;for(var n,r;;){this.consumeSpaces();var i=this.fetch();if(i.text===`\\limits`||i.text===`\\nolimits`){if(t&&t.type===`op`)t.limits=i.text===`\\limits`,t.alwaysHandleSupSub=!0;else if(t&&t.type===`operatorname`)t.alwaysHandleSupSub&&(t.limits=i.text===`\\limits`);else throw new D(`Limit controls must follow a math operator`,i);this.consume()}else if(i.text===`^`){if(n)throw new D(`Double superscript`,i);n=this.handleSupSubscript(`superscript`)}else if(i.text===`_`){if(r)throw new D(`Double subscript`,i);r=this.handleSupSubscript(`subscript`)}else if(i.text===`'`){if(n)throw new D(`Double superscript`,i);var a={type:`textord`,mode:this.mode,text:`\\prime`},o=[a];for(this.consume();this.fetch().text===`'`;)o.push(a),this.consume();this.fetch().text===`^`&&o.push(this.handleSupSubscript(`superscript`)),n={type:`ordgroup`,mode:this.mode,body:o}}else if($c[i.text]){var s=Qc.test(i.text),c=[];for(c.push(new Vs($c[i.text])),this.consume();;){var l=this.fetch().text;if(!$c[l]||Qc.test(l)!==s)break;c.unshift(new Vs($c[l])),this.consume()}var u=this.subparse(c);s?r={type:`ordgroup`,mode:`math`,body:u}:n={type:`ordgroup`,mode:`math`,body:u}}else break}return n||r?{type:`supsub`,mode:this.mode,base:t,sup:n,sub:r}:t}parseFunction(e,t){var n=this.fetch(),r=n.text,i=jc[r];if(!i)return null;if(this.consume(),t&&t!==`atom`&&!i.allowedInArgument)throw new D(`Got function '`+r+`' with no arguments`+(t?` as `+t:``),n);if(this.mode===`text`&&!i.allowedInText)throw new D(`Can't use function '`+r+`' in text mode`,n);if(this.mode===`math`&&i.allowedInMath===!1)throw new D(`Can't use function '`+r+`' in math mode`,n);var{args:a,optArgs:o}=this.parseArguments(r,i);return this.callFunction(r,a,o,n,e)}callFunction(e,t,n,r,i){var a={funcName:e,parser:this,token:r,breakOnTokenText:i},o=jc[e];if(o&&o.handler)return o.handler(a,t,n);throw new D(`No function handler for `+e)}parseArguments(e,t){var n=t.numArgs+t.numOptionalArgs;if(n===0)return{args:[],optArgs:[]};for(var r=[],i=[],a=0;a<n;a++){var o=t.argTypes&&t.argTypes[a],s=a<t.numOptionalArgs;(`primitive`in t&&t.primitive&&o==null||t.type===`sqrt`&&a===1&&i[0]==null)&&(o=`primitive`);var c=this.parseGroupOfType(`argument to '`+e+`'`,o,s);if(s)i.push(c);else if(c!=null)r.push(c);else throw new D(`Null argument, please report this as a bug`)}return{args:r,optArgs:i}}parseGroupOfType(e,t,n){switch(t){case`color`:return this.parseColorGroup(n);case`size`:return this.parseSizeGroup(n);case`url`:return this.parseUrlGroup(n);case`math`:case`text`:return this.parseArgumentGroup(n,t);case`hbox`:var r=this.parseArgumentGroup(n,`text`);return r==null?null:{type:`styling`,mode:r.mode,body:[r],style:`text`,resetFont:!0};case`raw`:var i=this.parseStringGroup(`raw`,n);return i==null?null:{type:`raw`,mode:`text`,string:i.text};case`primitive`:if(n)throw new D(`A primitive argument cannot be optional`);var a=this.parseGroup(e);if(a==null)throw new D(`Expected group as `+e,this.fetch());return a;case`original`:case null:case void 0:return this.parseArgumentGroup(n);default:throw new D(`Unknown group type as `+e,this.fetch())}}consumeSpaces(){for(;this.fetch().text===` `;)this.consume()}parseStringGroup(e,t){var n=this.gullet.scanArgument(t);if(n==null)return null;for(var r=``,i;(i=this.fetch()).text!==`EOF`;)r+=i.text,this.consume();return this.consume(),n.text=r,n}parseRegexGroup(e,t){for(var n=this.fetch(),r=n,i=``,a;(a=this.fetch()).text!==`EOF`&&e.test(i+a.text);)r=a,i+=r.text,this.consume();if(i===``)throw new D(`Invalid `+t+`: '`+n.text+`'`,n);return n.range(r,i)}parseColorGroup(e){var t=this.parseStringGroup(`color`,e);if(t==null)return null;var n=/^(#[a-f0-9]{3,4}|#[a-f0-9]{6}|#[a-f0-9]{8}|[a-f0-9]{6}|[a-z]+)$/i.exec(t.text);if(!n)throw new D(`Invalid color: '`+t.text+`'`,t);var r=n[0];return/^[0-9a-f]{6}$/i.test(r)&&(r=`#`+r),{type:`color-token`,mode:this.mode,color:r}}parseSizeGroup(e){var t,n=!1;if(this.gullet.consumeSpaces(),t=!e&&this.gullet.future().text!==`{`?this.parseRegexGroup(/^[-+]? *(?:$|\d+|\d+\.\d*|\.\d*) *[a-z]{0,2} *$/,`size`):this.parseStringGroup(`size`,e),!t)return null;!e&&t.text.length===0&&(t.text=`0pt`,n=!0);var r=/([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(t.text);if(!r)throw new D(`Invalid size: '`+t.text+`'`,t);var i={number:+(r[1]+r[2]),unit:r[3]};if(!oi(i))throw new D(`Invalid unit: '`+i.unit+`'`,t);return{type:`size`,mode:this.mode,value:i,isBlank:n}}parseUrlGroup(e){this.gullet.lexer.setCatcode(`%`,13),this.gullet.lexer.setCatcode(`~`,12);var t=this.parseStringGroup(`url`,e);if(this.gullet.lexer.setCatcode(`%`,14),this.gullet.lexer.setCatcode(`~`,13),t==null)return null;var n=t.text.replace(/\\([#$%&~_^{}])/g,`$1`);return{type:`url`,mode:this.mode,url:n}}parseArgumentGroup(e,t){var n=this.gullet.scanArgument(e);if(n==null)return null;var r=this.mode;t&&this.switchMode(t),this.gullet.beginGroup();var i=this.parseExpression(!1,`EOF`);this.expect(`EOF`),this.gullet.endGroup();var a={type:`ordgroup`,mode:this.mode,loc:n.loc,body:i};return t&&this.switchMode(r),a}parseGroup(e,t){var n=this.fetch(),r=n.text,i;if(r===`{`||r===`\\begingroup`){this.consume();var a=r===`{`?`}`:`\\endgroup`;this.gullet.beginGroup();var o=this.parseExpression(!1,a),s=this.fetch();this.expect(a),this.gullet.endGroup(),i={type:`ordgroup`,mode:this.mode,loc:Bs.range(n,s),body:o,semisimple:r===`\\begingroup`||void 0}}else if(i=this.parseFunction(t,e)||this.parseSymbol(),i==null&&r[0]===`\\`&&!Xc.hasOwnProperty(r)){if(this.settings.throwOnError)throw new D(`Undefined control sequence: `+r,n);i=this.formatUnsupportedCmd(r),this.consume()}return i}formLigatures(e){for(var t=e.length-1,n=0;n<t;++n){var r=e[n];if(r.type===`textord`){var i=r.text,a=e[n+1];if(!(!a||a.type!==`textord`)){if(i===`-`&&a.text===`-`){var o=e[n+2];n+1<t&&o&&o.type===`textord`&&o.text===`-`?(e.splice(n,3,{type:`textord`,mode:`text`,loc:Bs.range(r,o),text:`---`}),t-=2):(e.splice(n,2,{type:`textord`,mode:`text`,loc:Bs.range(r,a),text:`--`}),--t)}(i===`'`||i==="`")&&a.text===i&&(e.splice(n,2,{type:`textord`,mode:`text`,loc:Bs.range(r,a),text:i+i}),--t)}}}}parseSymbol(){var e=this.fetch(),t=e.text;if(/^\\verb[^a-zA-Z]/.test(t)){this.consume();var n=t.slice(5),r=n.charAt(0)===`*`;if(r&&(n=n.slice(1)),n.length<2||n.charAt(0)!==n.slice(-1))throw new D(`\\verb assertion failed --
                    please report what input caused this bug`);return n=n.slice(1,-1),{type:`verb`,mode:`text`,body:n,star:r}}tl.hasOwnProperty(t[0])&&!j[this.mode][t[0]]&&(this.settings.strict&&this.mode===`math`&&this.settings.reportNonstrict(`unicodeTextInMathMode`,`Accented Unicode text character "`+t[0]+`" used in math mode`,e),t=tl[t[0]]+t.slice(1));var i=Rc.exec(t);i&&(t=t.substring(0,i.index),t===`i`?t=`ı`:t===`j`&&(t=`ȷ`));var a;if(j[this.mode][t]){this.settings.strict&&this.mode===`math`&&Xi.includes(t)&&this.settings.reportNonstrict(`unicodeTextInMathMode`,`Latin-1/Unicode text character "`+t[0]+`" used in math mode`,e);var o=j[this.mode][t].group,s=Bs.range(e);a=Ao(o)?{type:`atom`,mode:this.mode,family:o,loc:s,text:t}:{type:o,mode:this.mode,loc:s,text:t}}else if(t.charCodeAt(0)>=128)this.settings.strict&&(Hr(t.charCodeAt(0))?this.mode===`math`&&this.settings.reportNonstrict(`unicodeTextInMathMode`,`Unicode text character "`+t[0]+`" used in math mode`,e):this.settings.reportNonstrict(`unknownSymbol`,`Unrecognized Unicode character "`+t[0]+`"`+(` (`+t.charCodeAt(0)+`)`),e)),a={type:`textord`,mode:`text`,loc:Bs.range(e),text:t};else return null;if(this.consume(),i)for(var c=0;c<i[0].length;c++){var l=i[0][c];if(!el[l])throw new D(`Unknown accent ' `+l+`'`,e);var u=el[l][this.mode]||el[l].text;if(!u)throw new D(`Accent `+l+` unsupported in `+this.mode+` mode`,e);a={type:`accent`,mode:this.mode,loc:Bs.range(e),label:u,isStretchy:!1,isShifty:!0,base:a}}return a}};nl.endOfExpression=new Set([`}`,`\\endgroup`,`\\end`,`\\right`,`&`]);var rl=function(e,t){if(!(typeof e==`string`||e instanceof String))throw TypeError(`KaTeX can only parse string typed expression`);var n=new nl(e,t);delete n.gullet.macros.current[`\\df@tag`];var r=n.parse();if(delete n.gullet.macros.current[`\\current@color`],delete n.gullet.macros.current[`\\color`],n.gullet.macros.get(`\\df@tag`)){if(!t.displayMode)throw new D(`\\tag works only in display equations`);r=[{type:`tag`,mode:`text`,body:r,tag:n.subparse([new Vs(`\\df@tag`)])}]}return r},il=function(e,t,n){t.textContent=``;var r=cl(e,n).toNode();t.appendChild(r)};typeof document<`u`&&document.compatMode!==`CSS1Compat`&&(typeof console<`u`&&console.warn(`Warning: KaTeX doesn't work in quirks mode. Make sure your website has a suitable doctype.`),il=function(){throw new D(`KaTeX doesn't work in quirks mode.`)});var al=function(e,t){return cl(e,t).toMarkup()},ol=function(e,t){var n=new Sr(t);return rl(e,n)},sl=function(e,t,n){if(n.throwOnError||!(e instanceof D))throw e;var r=W([`katex-error`],[new _i(t)]);return r.setAttribute(`title`,e.toString()),r.setAttribute(`style`,`color:`+n.errorColor),r},cl=function(e,t){var n=new Sr(t);try{var r=rl(e,n);return bo(r,e,n)}catch(t){return sl(t,e,n)}},ll={version:`0.16.47`,render:il,renderToString:al,ParseError:D,SETTINGS_SCHEMA:vr,__parse:ol,__renderToDomTree:cl,__renderToHTMLTree:function(e,t){var n=new Sr(t);try{var r=rl(e,n);return xo(r,e,n)}catch(t){return sl(t,e,n)}},__setFontMetrics:Di,__defineSymbol:M,__defineFunction:q,__defineMacro:$,__domTree:{Span:pi,Anchor:mi,SymbolNode:_i,SvgNode:vi,PathNode:yi,LineNode:bi}},ul=/^(\${1,2})(?!\$)((?:\\.|[^\\\n])*?(?:\\.|[^\\\n\$]))\1(?=[\s?!\.,:？！。，：]|$)/,dl=/^(\${1,2})(?!\$)((?:\\.|[^\\\n])*?(?:\\.|[^\\\n\$]))\1/,fl=/^(\${1,2})\n((?:\\[^]|[^\\])+?)\n\1(?:\n|$)/;function pl(e={}){return{extensions:[hl(e,ml(e,!1)),gl(e,ml(e,!0))]}}function ml(e,t){return n=>ll.renderToString(n.text,{...e,displayMode:n.displayMode})+(t?`
`:``)}function hl(e,t){let n=e&&e.nonStandard,r=n?dl:ul;return{name:`inlineKatex`,level:`inline`,start(e){let t,i=e;for(;i;){if(t=i.indexOf(`$`),t===-1)return;if((n?t>-1:t===0||i.charAt(t-1)===` `)&&i.substring(t).match(r))return t;i=i.substring(t+1).replace(/^\$+/,``)}},tokenizer(e,t){let n=e.match(r);if(n)return{type:`inlineKatex`,raw:n[0],text:n[2].trim(),displayMode:n[1].length===2}},renderer:t}}function gl(e,t){return{name:`blockKatex`,level:`block`,tokenizer(e,t){let n=e.match(fl);if(n)return{type:`blockKatex`,raw:n[0],text:n[2].trim(),displayMode:n[1].length===2}},renderer:t}}var _l=`/* stylelint-disable font-family-no-missing-generic-family-keyword */
@font-face {
  font-family: "KaTeX_AMS";
  src: url(fonts/KaTeX_AMS-Regular.woff2) format("woff2"), url(fonts/KaTeX_AMS-Regular.woff) format("woff"), url(fonts/KaTeX_AMS-Regular.ttf) format("truetype");
  font-weight: normal;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: "KaTeX_Caligraphic";
  src: url(fonts/KaTeX_Caligraphic-Bold.woff2) format("woff2"), url(fonts/KaTeX_Caligraphic-Bold.woff) format("woff"), url(fonts/KaTeX_Caligraphic-Bold.ttf) format("truetype");
  font-weight: bold;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: "KaTeX_Caligraphic";
  src: url(fonts/KaTeX_Caligraphic-Regular.woff2) format("woff2"), url(fonts/KaTeX_Caligraphic-Regular.woff) format("woff"), url(fonts/KaTeX_Caligraphic-Regular.ttf) format("truetype");
  font-weight: normal;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: "KaTeX_Fraktur";
  src: url(fonts/KaTeX_Fraktur-Bold.woff2) format("woff2"), url(fonts/KaTeX_Fraktur-Bold.woff) format("woff"), url(fonts/KaTeX_Fraktur-Bold.ttf) format("truetype");
  font-weight: bold;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: "KaTeX_Fraktur";
  src: url(fonts/KaTeX_Fraktur-Regular.woff2) format("woff2"), url(fonts/KaTeX_Fraktur-Regular.woff) format("woff"), url(fonts/KaTeX_Fraktur-Regular.ttf) format("truetype");
  font-weight: normal;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: "KaTeX_Main";
  src: url(fonts/KaTeX_Main-Bold.woff2) format("woff2"), url(fonts/KaTeX_Main-Bold.woff) format("woff"), url(fonts/KaTeX_Main-Bold.ttf) format("truetype");
  font-weight: bold;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: "KaTeX_Main";
  src: url(fonts/KaTeX_Main-BoldItalic.woff2) format("woff2"), url(fonts/KaTeX_Main-BoldItalic.woff) format("woff"), url(fonts/KaTeX_Main-BoldItalic.ttf) format("truetype");
  font-weight: bold;
  font-style: italic;
  font-display: block;
}
@font-face {
  font-family: "KaTeX_Main";
  src: url(fonts/KaTeX_Main-Italic.woff2) format("woff2"), url(fonts/KaTeX_Main-Italic.woff) format("woff"), url(fonts/KaTeX_Main-Italic.ttf) format("truetype");
  font-weight: normal;
  font-style: italic;
  font-display: block;
}
@font-face {
  font-family: "KaTeX_Main";
  src: url(fonts/KaTeX_Main-Regular.woff2) format("woff2"), url(fonts/KaTeX_Main-Regular.woff) format("woff"), url(fonts/KaTeX_Main-Regular.ttf) format("truetype");
  font-weight: normal;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: "KaTeX_Math";
  src: url(fonts/KaTeX_Math-BoldItalic.woff2) format("woff2"), url(fonts/KaTeX_Math-BoldItalic.woff) format("woff"), url(fonts/KaTeX_Math-BoldItalic.ttf) format("truetype");
  font-weight: bold;
  font-style: italic;
  font-display: block;
}
@font-face {
  font-family: "KaTeX_Math";
  src: url(fonts/KaTeX_Math-Italic.woff2) format("woff2"), url(fonts/KaTeX_Math-Italic.woff) format("woff"), url(fonts/KaTeX_Math-Italic.ttf) format("truetype");
  font-weight: normal;
  font-style: italic;
  font-display: block;
}
@font-face {
  font-family: "KaTeX_SansSerif";
  src: url(fonts/KaTeX_SansSerif-Bold.woff2) format("woff2"), url(fonts/KaTeX_SansSerif-Bold.woff) format("woff"), url(fonts/KaTeX_SansSerif-Bold.ttf) format("truetype");
  font-weight: bold;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: "KaTeX_SansSerif";
  src: url(fonts/KaTeX_SansSerif-Italic.woff2) format("woff2"), url(fonts/KaTeX_SansSerif-Italic.woff) format("woff"), url(fonts/KaTeX_SansSerif-Italic.ttf) format("truetype");
  font-weight: normal;
  font-style: italic;
  font-display: block;
}
@font-face {
  font-family: "KaTeX_SansSerif";
  src: url(fonts/KaTeX_SansSerif-Regular.woff2) format("woff2"), url(fonts/KaTeX_SansSerif-Regular.woff) format("woff"), url(fonts/KaTeX_SansSerif-Regular.ttf) format("truetype");
  font-weight: normal;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: "KaTeX_Script";
  src: url(fonts/KaTeX_Script-Regular.woff2) format("woff2"), url(fonts/KaTeX_Script-Regular.woff) format("woff"), url(fonts/KaTeX_Script-Regular.ttf) format("truetype");
  font-weight: normal;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: "KaTeX_Size1";
  src: url(fonts/KaTeX_Size1-Regular.woff2) format("woff2"), url(fonts/KaTeX_Size1-Regular.woff) format("woff"), url(fonts/KaTeX_Size1-Regular.ttf) format("truetype");
  font-weight: normal;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: "KaTeX_Size2";
  src: url(fonts/KaTeX_Size2-Regular.woff2) format("woff2"), url(fonts/KaTeX_Size2-Regular.woff) format("woff"), url(fonts/KaTeX_Size2-Regular.ttf) format("truetype");
  font-weight: normal;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: "KaTeX_Size3";
  src: url(fonts/KaTeX_Size3-Regular.woff2) format("woff2"), url(fonts/KaTeX_Size3-Regular.woff) format("woff"), url(fonts/KaTeX_Size3-Regular.ttf) format("truetype");
  font-weight: normal;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: "KaTeX_Size4";
  src: url(fonts/KaTeX_Size4-Regular.woff2) format("woff2"), url(fonts/KaTeX_Size4-Regular.woff) format("woff"), url(fonts/KaTeX_Size4-Regular.ttf) format("truetype");
  font-weight: normal;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: "KaTeX_Typewriter";
  src: url(fonts/KaTeX_Typewriter-Regular.woff2) format("woff2"), url(fonts/KaTeX_Typewriter-Regular.woff) format("woff"), url(fonts/KaTeX_Typewriter-Regular.ttf) format("truetype");
  font-weight: normal;
  font-style: normal;
  font-display: block;
}
/* stylelint-disable font-family-no-missing-generic-family-keyword */
.katex {
  font: normal 1.21em KaTeX_Main, Times New Roman, serif;
  line-height: 1.2;
  position: relative;
  text-indent: 0;
  text-rendering: auto;
}
.katex * {
  -ms-high-contrast-adjust: none !important;
}
.katex * {
  border-color: currentColor;
}
.katex .katex-version::after {
  content: "0.16.47";
}
.katex .katex-mathml {
  /* Accessibility hack to only show to screen readers
   Found at: http://a11yproject.com/posts/how-to-hide-content/ */
  position: absolute;
  -webkit-clip-path: inset(50%);
          clip-path: inset(50%);
  padding: 0;
  border: 0;
  height: 1px;
  width: 1px;
  overflow: hidden;
}
.katex .katex-html {
  /* \\newline is an empty block at top level, between .base elements */
}
.katex .katex-html > .newline {
  display: block;
}
.katex .base {
  position: relative;
  display: inline-block;
  white-space: nowrap;
  width: -webkit-min-content;
  width: -moz-min-content;
  width: min-content;
}
.katex .strut {
  display: inline-block;
}
.katex .textbf {
  font-weight: bold;
}
.katex .textit {
  font-style: italic;
}
.katex .textrm {
  font-family: KaTeX_Main;
}
.katex .textsf {
  font-family: KaTeX_SansSerif;
}
.katex .texttt {
  font-family: KaTeX_Typewriter;
}
.katex .mathnormal {
  font-family: KaTeX_Math;
  font-style: italic;
}
.katex .mathit {
  font-family: KaTeX_Main;
  font-style: italic;
}
.katex .mathrm {
  font-style: normal;
}
.katex .mathbf {
  font-family: KaTeX_Main;
  font-weight: bold;
}
.katex .boldsymbol {
  font-family: KaTeX_Math;
  font-weight: bold;
  font-style: italic;
}
.katex .amsrm {
  font-family: KaTeX_AMS;
}
.katex .mathbb,
.katex .textbb {
  font-family: KaTeX_AMS;
}
.katex .mathcal {
  font-family: KaTeX_Caligraphic;
}
.katex .mathfrak,
.katex .textfrak {
  font-family: KaTeX_Fraktur;
}
.katex .mathboldfrak,
.katex .textboldfrak {
  font-family: KaTeX_Fraktur;
  font-weight: bold;
}
.katex .mathtt {
  font-family: KaTeX_Typewriter;
}
.katex .mathscr,
.katex .textscr {
  font-family: KaTeX_Script;
}
.katex .mathsf,
.katex .textsf {
  font-family: KaTeX_SansSerif;
}
.katex .mathboldsf,
.katex .textboldsf {
  font-family: KaTeX_SansSerif;
  font-weight: bold;
}
.katex .mathsfit,
.katex .mathitsf,
.katex .textitsf {
  font-family: KaTeX_SansSerif;
  font-style: italic;
}
.katex .mainrm {
  font-family: KaTeX_Main;
  font-style: normal;
}
.katex .vlist-t {
  display: inline-table;
  table-layout: fixed;
  border-collapse: collapse;
}
.katex .vlist-r {
  display: table-row;
}
.katex .vlist {
  display: table-cell;
  vertical-align: bottom;
  position: relative;
}
.katex .vlist > span {
  display: block;
  height: 0;
  position: relative;
}
.katex .vlist > span > span {
  display: inline-block;
}
.katex .vlist > span > .pstrut {
  overflow: hidden;
  width: 0;
}
.katex .vlist-t2 {
  margin-right: -2px;
}
.katex .vlist-s {
  display: table-cell;
  vertical-align: bottom;
  font-size: 1px;
  width: 2px;
  min-width: 2px;
}
.katex .vbox {
  display: inline-flex;
  flex-direction: column;
  align-items: baseline;
}
.katex .hbox {
  display: inline-flex;
  flex-direction: row;
  width: 100%;
}
.katex .thinbox {
  display: inline-flex;
  flex-direction: row;
  width: 0;
  max-width: 0;
}
.katex .msupsub {
  text-align: left;
}
.katex .mfrac > span > span {
  text-align: center;
}
.katex .mfrac .frac-line {
  display: inline-block;
  width: 100%;
  border-bottom-style: solid;
}
.katex .mfrac .frac-line,
.katex .overline .overline-line,
.katex .underline .underline-line,
.katex .hline,
.katex .hdashline,
.katex .rule {
  min-height: 1px;
}
.katex .mspace {
  display: inline-block;
}
.katex .smash {
  display: inline;
  line-height: 0;
}
.katex .llap,
.katex .rlap,
.katex .clap {
  width: 0;
  position: relative;
}
.katex .llap > .inner,
.katex .rlap > .inner,
.katex .clap > .inner {
  position: absolute;
}
.katex .llap > .fix,
.katex .rlap > .fix,
.katex .clap > .fix {
  display: inline-block;
}
.katex .llap > .inner {
  right: 0;
}
.katex .rlap > .inner,
.katex .clap > .inner {
  left: 0;
}
.katex .clap > .inner > span {
  margin-left: -50%;
  margin-right: 50%;
}
.katex .rule {
  display: inline-block;
  border: solid 0;
  position: relative;
}
.katex .overline .overline-line,
.katex .underline .underline-line,
.katex .hline {
  display: inline-block;
  width: 100%;
  border-bottom-style: solid;
}
.katex .hdashline {
  display: inline-block;
  width: 100%;
  border-bottom-style: dashed;
}
.katex .sqrt > .root {
  /* These values are taken from the definition of \`\\r@@t\`,
   \`\\mkern 5mu\` and \`\\mkern -10mu\`. */
  /* stylelint-disable-next-line declaration-property-value-no-unknown */
  margin-left: 0.2777777778em;
  /* stylelint-disable-next-line declaration-property-value-no-unknown */
  margin-right: -0.5555555556em;
}
.katex .sizing.reset-size1.size1,
.katex .fontsize-ensurer.reset-size1.size1 {
  /* stylelint-disable-next-line */
  font-size: 1em;
}
.katex .sizing.reset-size1.size2,
.katex .fontsize-ensurer.reset-size1.size2 {
  /* stylelint-disable-next-line */
  font-size: 1.2em;
}
.katex .sizing.reset-size1.size3,
.katex .fontsize-ensurer.reset-size1.size3 {
  /* stylelint-disable-next-line */
  font-size: 1.4em;
}
.katex .sizing.reset-size1.size4,
.katex .fontsize-ensurer.reset-size1.size4 {
  /* stylelint-disable-next-line */
  font-size: 1.6em;
}
.katex .sizing.reset-size1.size5,
.katex .fontsize-ensurer.reset-size1.size5 {
  /* stylelint-disable-next-line */
  font-size: 1.8em;
}
.katex .sizing.reset-size1.size6,
.katex .fontsize-ensurer.reset-size1.size6 {
  /* stylelint-disable-next-line */
  font-size: 2em;
}
.katex .sizing.reset-size1.size7,
.katex .fontsize-ensurer.reset-size1.size7 {
  /* stylelint-disable-next-line */
  font-size: 2.4em;
}
.katex .sizing.reset-size1.size8,
.katex .fontsize-ensurer.reset-size1.size8 {
  /* stylelint-disable-next-line */
  font-size: 2.88em;
}
.katex .sizing.reset-size1.size9,
.katex .fontsize-ensurer.reset-size1.size9 {
  /* stylelint-disable-next-line */
  font-size: 3.456em;
}
.katex .sizing.reset-size1.size10,
.katex .fontsize-ensurer.reset-size1.size10 {
  /* stylelint-disable-next-line */
  font-size: 4.148em;
}
.katex .sizing.reset-size1.size11,
.katex .fontsize-ensurer.reset-size1.size11 {
  /* stylelint-disable-next-line */
  font-size: 4.976em;
}
.katex .sizing.reset-size2.size1,
.katex .fontsize-ensurer.reset-size2.size1 {
  /* stylelint-disable-next-line */
  font-size: 0.8333333333em;
}
.katex .sizing.reset-size2.size2,
.katex .fontsize-ensurer.reset-size2.size2 {
  /* stylelint-disable-next-line */
  font-size: 1em;
}
.katex .sizing.reset-size2.size3,
.katex .fontsize-ensurer.reset-size2.size3 {
  /* stylelint-disable-next-line */
  font-size: 1.1666666667em;
}
.katex .sizing.reset-size2.size4,
.katex .fontsize-ensurer.reset-size2.size4 {
  /* stylelint-disable-next-line */
  font-size: 1.3333333333em;
}
.katex .sizing.reset-size2.size5,
.katex .fontsize-ensurer.reset-size2.size5 {
  /* stylelint-disable-next-line */
  font-size: 1.5em;
}
.katex .sizing.reset-size2.size6,
.katex .fontsize-ensurer.reset-size2.size6 {
  /* stylelint-disable-next-line */
  font-size: 1.6666666667em;
}
.katex .sizing.reset-size2.size7,
.katex .fontsize-ensurer.reset-size2.size7 {
  /* stylelint-disable-next-line */
  font-size: 2em;
}
.katex .sizing.reset-size2.size8,
.katex .fontsize-ensurer.reset-size2.size8 {
  /* stylelint-disable-next-line */
  font-size: 2.4em;
}
.katex .sizing.reset-size2.size9,
.katex .fontsize-ensurer.reset-size2.size9 {
  /* stylelint-disable-next-line */
  font-size: 2.88em;
}
.katex .sizing.reset-size2.size10,
.katex .fontsize-ensurer.reset-size2.size10 {
  /* stylelint-disable-next-line */
  font-size: 3.4566666667em;
}
.katex .sizing.reset-size2.size11,
.katex .fontsize-ensurer.reset-size2.size11 {
  /* stylelint-disable-next-line */
  font-size: 4.1466666667em;
}
.katex .sizing.reset-size3.size1,
.katex .fontsize-ensurer.reset-size3.size1 {
  /* stylelint-disable-next-line */
  font-size: 0.7142857143em;
}
.katex .sizing.reset-size3.size2,
.katex .fontsize-ensurer.reset-size3.size2 {
  /* stylelint-disable-next-line */
  font-size: 0.8571428571em;
}
.katex .sizing.reset-size3.size3,
.katex .fontsize-ensurer.reset-size3.size3 {
  /* stylelint-disable-next-line */
  font-size: 1em;
}
.katex .sizing.reset-size3.size4,
.katex .fontsize-ensurer.reset-size3.size4 {
  /* stylelint-disable-next-line */
  font-size: 1.1428571429em;
}
.katex .sizing.reset-size3.size5,
.katex .fontsize-ensurer.reset-size3.size5 {
  /* stylelint-disable-next-line */
  font-size: 1.2857142857em;
}
.katex .sizing.reset-size3.size6,
.katex .fontsize-ensurer.reset-size3.size6 {
  /* stylelint-disable-next-line */
  font-size: 1.4285714286em;
}
.katex .sizing.reset-size3.size7,
.katex .fontsize-ensurer.reset-size3.size7 {
  /* stylelint-disable-next-line */
  font-size: 1.7142857143em;
}
.katex .sizing.reset-size3.size8,
.katex .fontsize-ensurer.reset-size3.size8 {
  /* stylelint-disable-next-line */
  font-size: 2.0571428571em;
}
.katex .sizing.reset-size3.size9,
.katex .fontsize-ensurer.reset-size3.size9 {
  /* stylelint-disable-next-line */
  font-size: 2.4685714286em;
}
.katex .sizing.reset-size3.size10,
.katex .fontsize-ensurer.reset-size3.size10 {
  /* stylelint-disable-next-line */
  font-size: 2.9628571429em;
}
.katex .sizing.reset-size3.size11,
.katex .fontsize-ensurer.reset-size3.size11 {
  /* stylelint-disable-next-line */
  font-size: 3.5542857143em;
}
.katex .sizing.reset-size4.size1,
.katex .fontsize-ensurer.reset-size4.size1 {
  /* stylelint-disable-next-line */
  font-size: 0.625em;
}
.katex .sizing.reset-size4.size2,
.katex .fontsize-ensurer.reset-size4.size2 {
  /* stylelint-disable-next-line */
  font-size: 0.75em;
}
.katex .sizing.reset-size4.size3,
.katex .fontsize-ensurer.reset-size4.size3 {
  /* stylelint-disable-next-line */
  font-size: 0.875em;
}
.katex .sizing.reset-size4.size4,
.katex .fontsize-ensurer.reset-size4.size4 {
  /* stylelint-disable-next-line */
  font-size: 1em;
}
.katex .sizing.reset-size4.size5,
.katex .fontsize-ensurer.reset-size4.size5 {
  /* stylelint-disable-next-line */
  font-size: 1.125em;
}
.katex .sizing.reset-size4.size6,
.katex .fontsize-ensurer.reset-size4.size6 {
  /* stylelint-disable-next-line */
  font-size: 1.25em;
}
.katex .sizing.reset-size4.size7,
.katex .fontsize-ensurer.reset-size4.size7 {
  /* stylelint-disable-next-line */
  font-size: 1.5em;
}
.katex .sizing.reset-size4.size8,
.katex .fontsize-ensurer.reset-size4.size8 {
  /* stylelint-disable-next-line */
  font-size: 1.8em;
}
.katex .sizing.reset-size4.size9,
.katex .fontsize-ensurer.reset-size4.size9 {
  /* stylelint-disable-next-line */
  font-size: 2.16em;
}
.katex .sizing.reset-size4.size10,
.katex .fontsize-ensurer.reset-size4.size10 {
  /* stylelint-disable-next-line */
  font-size: 2.5925em;
}
.katex .sizing.reset-size4.size11,
.katex .fontsize-ensurer.reset-size4.size11 {
  /* stylelint-disable-next-line */
  font-size: 3.11em;
}
.katex .sizing.reset-size5.size1,
.katex .fontsize-ensurer.reset-size5.size1 {
  /* stylelint-disable-next-line */
  font-size: 0.5555555556em;
}
.katex .sizing.reset-size5.size2,
.katex .fontsize-ensurer.reset-size5.size2 {
  /* stylelint-disable-next-line */
  font-size: 0.6666666667em;
}
.katex .sizing.reset-size5.size3,
.katex .fontsize-ensurer.reset-size5.size3 {
  /* stylelint-disable-next-line */
  font-size: 0.7777777778em;
}
.katex .sizing.reset-size5.size4,
.katex .fontsize-ensurer.reset-size5.size4 {
  /* stylelint-disable-next-line */
  font-size: 0.8888888889em;
}
.katex .sizing.reset-size5.size5,
.katex .fontsize-ensurer.reset-size5.size5 {
  /* stylelint-disable-next-line */
  font-size: 1em;
}
.katex .sizing.reset-size5.size6,
.katex .fontsize-ensurer.reset-size5.size6 {
  /* stylelint-disable-next-line */
  font-size: 1.1111111111em;
}
.katex .sizing.reset-size5.size7,
.katex .fontsize-ensurer.reset-size5.size7 {
  /* stylelint-disable-next-line */
  font-size: 1.3333333333em;
}
.katex .sizing.reset-size5.size8,
.katex .fontsize-ensurer.reset-size5.size8 {
  /* stylelint-disable-next-line */
  font-size: 1.6em;
}
.katex .sizing.reset-size5.size9,
.katex .fontsize-ensurer.reset-size5.size9 {
  /* stylelint-disable-next-line */
  font-size: 1.92em;
}
.katex .sizing.reset-size5.size10,
.katex .fontsize-ensurer.reset-size5.size10 {
  /* stylelint-disable-next-line */
  font-size: 2.3044444444em;
}
.katex .sizing.reset-size5.size11,
.katex .fontsize-ensurer.reset-size5.size11 {
  /* stylelint-disable-next-line */
  font-size: 2.7644444444em;
}
.katex .sizing.reset-size6.size1,
.katex .fontsize-ensurer.reset-size6.size1 {
  /* stylelint-disable-next-line */
  font-size: 0.5em;
}
.katex .sizing.reset-size6.size2,
.katex .fontsize-ensurer.reset-size6.size2 {
  /* stylelint-disable-next-line */
  font-size: 0.6em;
}
.katex .sizing.reset-size6.size3,
.katex .fontsize-ensurer.reset-size6.size3 {
  /* stylelint-disable-next-line */
  font-size: 0.7em;
}
.katex .sizing.reset-size6.size4,
.katex .fontsize-ensurer.reset-size6.size4 {
  /* stylelint-disable-next-line */
  font-size: 0.8em;
}
.katex .sizing.reset-size6.size5,
.katex .fontsize-ensurer.reset-size6.size5 {
  /* stylelint-disable-next-line */
  font-size: 0.9em;
}
.katex .sizing.reset-size6.size6,
.katex .fontsize-ensurer.reset-size6.size6 {
  /* stylelint-disable-next-line */
  font-size: 1em;
}
.katex .sizing.reset-size6.size7,
.katex .fontsize-ensurer.reset-size6.size7 {
  /* stylelint-disable-next-line */
  font-size: 1.2em;
}
.katex .sizing.reset-size6.size8,
.katex .fontsize-ensurer.reset-size6.size8 {
  /* stylelint-disable-next-line */
  font-size: 1.44em;
}
.katex .sizing.reset-size6.size9,
.katex .fontsize-ensurer.reset-size6.size9 {
  /* stylelint-disable-next-line */
  font-size: 1.728em;
}
.katex .sizing.reset-size6.size10,
.katex .fontsize-ensurer.reset-size6.size10 {
  /* stylelint-disable-next-line */
  font-size: 2.074em;
}
.katex .sizing.reset-size6.size11,
.katex .fontsize-ensurer.reset-size6.size11 {
  /* stylelint-disable-next-line */
  font-size: 2.488em;
}
.katex .sizing.reset-size7.size1,
.katex .fontsize-ensurer.reset-size7.size1 {
  /* stylelint-disable-next-line */
  font-size: 0.4166666667em;
}
.katex .sizing.reset-size7.size2,
.katex .fontsize-ensurer.reset-size7.size2 {
  /* stylelint-disable-next-line */
  font-size: 0.5em;
}
.katex .sizing.reset-size7.size3,
.katex .fontsize-ensurer.reset-size7.size3 {
  /* stylelint-disable-next-line */
  font-size: 0.5833333333em;
}
.katex .sizing.reset-size7.size4,
.katex .fontsize-ensurer.reset-size7.size4 {
  /* stylelint-disable-next-line */
  font-size: 0.6666666667em;
}
.katex .sizing.reset-size7.size5,
.katex .fontsize-ensurer.reset-size7.size5 {
  /* stylelint-disable-next-line */
  font-size: 0.75em;
}
.katex .sizing.reset-size7.size6,
.katex .fontsize-ensurer.reset-size7.size6 {
  /* stylelint-disable-next-line */
  font-size: 0.8333333333em;
}
.katex .sizing.reset-size7.size7,
.katex .fontsize-ensurer.reset-size7.size7 {
  /* stylelint-disable-next-line */
  font-size: 1em;
}
.katex .sizing.reset-size7.size8,
.katex .fontsize-ensurer.reset-size7.size8 {
  /* stylelint-disable-next-line */
  font-size: 1.2em;
}
.katex .sizing.reset-size7.size9,
.katex .fontsize-ensurer.reset-size7.size9 {
  /* stylelint-disable-next-line */
  font-size: 1.44em;
}
.katex .sizing.reset-size7.size10,
.katex .fontsize-ensurer.reset-size7.size10 {
  /* stylelint-disable-next-line */
  font-size: 1.7283333333em;
}
.katex .sizing.reset-size7.size11,
.katex .fontsize-ensurer.reset-size7.size11 {
  /* stylelint-disable-next-line */
  font-size: 2.0733333333em;
}
.katex .sizing.reset-size8.size1,
.katex .fontsize-ensurer.reset-size8.size1 {
  /* stylelint-disable-next-line */
  font-size: 0.3472222222em;
}
.katex .sizing.reset-size8.size2,
.katex .fontsize-ensurer.reset-size8.size2 {
  /* stylelint-disable-next-line */
  font-size: 0.4166666667em;
}
.katex .sizing.reset-size8.size3,
.katex .fontsize-ensurer.reset-size8.size3 {
  /* stylelint-disable-next-line */
  font-size: 0.4861111111em;
}
.katex .sizing.reset-size8.size4,
.katex .fontsize-ensurer.reset-size8.size4 {
  /* stylelint-disable-next-line */
  font-size: 0.5555555556em;
}
.katex .sizing.reset-size8.size5,
.katex .fontsize-ensurer.reset-size8.size5 {
  /* stylelint-disable-next-line */
  font-size: 0.625em;
}
.katex .sizing.reset-size8.size6,
.katex .fontsize-ensurer.reset-size8.size6 {
  /* stylelint-disable-next-line */
  font-size: 0.6944444444em;
}
.katex .sizing.reset-size8.size7,
.katex .fontsize-ensurer.reset-size8.size7 {
  /* stylelint-disable-next-line */
  font-size: 0.8333333333em;
}
.katex .sizing.reset-size8.size8,
.katex .fontsize-ensurer.reset-size8.size8 {
  /* stylelint-disable-next-line */
  font-size: 1em;
}
.katex .sizing.reset-size8.size9,
.katex .fontsize-ensurer.reset-size8.size9 {
  /* stylelint-disable-next-line */
  font-size: 1.2em;
}
.katex .sizing.reset-size8.size10,
.katex .fontsize-ensurer.reset-size8.size10 {
  /* stylelint-disable-next-line */
  font-size: 1.4402777778em;
}
.katex .sizing.reset-size8.size11,
.katex .fontsize-ensurer.reset-size8.size11 {
  /* stylelint-disable-next-line */
  font-size: 1.7277777778em;
}
.katex .sizing.reset-size9.size1,
.katex .fontsize-ensurer.reset-size9.size1 {
  /* stylelint-disable-next-line */
  font-size: 0.2893518519em;
}
.katex .sizing.reset-size9.size2,
.katex .fontsize-ensurer.reset-size9.size2 {
  /* stylelint-disable-next-line */
  font-size: 0.3472222222em;
}
.katex .sizing.reset-size9.size3,
.katex .fontsize-ensurer.reset-size9.size3 {
  /* stylelint-disable-next-line */
  font-size: 0.4050925926em;
}
.katex .sizing.reset-size9.size4,
.katex .fontsize-ensurer.reset-size9.size4 {
  /* stylelint-disable-next-line */
  font-size: 0.462962963em;
}
.katex .sizing.reset-size9.size5,
.katex .fontsize-ensurer.reset-size9.size5 {
  /* stylelint-disable-next-line */
  font-size: 0.5208333333em;
}
.katex .sizing.reset-size9.size6,
.katex .fontsize-ensurer.reset-size9.size6 {
  /* stylelint-disable-next-line */
  font-size: 0.5787037037em;
}
.katex .sizing.reset-size9.size7,
.katex .fontsize-ensurer.reset-size9.size7 {
  /* stylelint-disable-next-line */
  font-size: 0.6944444444em;
}
.katex .sizing.reset-size9.size8,
.katex .fontsize-ensurer.reset-size9.size8 {
  /* stylelint-disable-next-line */
  font-size: 0.8333333333em;
}
.katex .sizing.reset-size9.size9,
.katex .fontsize-ensurer.reset-size9.size9 {
  /* stylelint-disable-next-line */
  font-size: 1em;
}
.katex .sizing.reset-size9.size10,
.katex .fontsize-ensurer.reset-size9.size10 {
  /* stylelint-disable-next-line */
  font-size: 1.2002314815em;
}
.katex .sizing.reset-size9.size11,
.katex .fontsize-ensurer.reset-size9.size11 {
  /* stylelint-disable-next-line */
  font-size: 1.4398148148em;
}
.katex .sizing.reset-size10.size1,
.katex .fontsize-ensurer.reset-size10.size1 {
  /* stylelint-disable-next-line */
  font-size: 0.2410800386em;
}
.katex .sizing.reset-size10.size2,
.katex .fontsize-ensurer.reset-size10.size2 {
  /* stylelint-disable-next-line */
  font-size: 0.2892960463em;
}
.katex .sizing.reset-size10.size3,
.katex .fontsize-ensurer.reset-size10.size3 {
  /* stylelint-disable-next-line */
  font-size: 0.337512054em;
}
.katex .sizing.reset-size10.size4,
.katex .fontsize-ensurer.reset-size10.size4 {
  /* stylelint-disable-next-line */
  font-size: 0.3857280617em;
}
.katex .sizing.reset-size10.size5,
.katex .fontsize-ensurer.reset-size10.size5 {
  /* stylelint-disable-next-line */
  font-size: 0.4339440694em;
}
.katex .sizing.reset-size10.size6,
.katex .fontsize-ensurer.reset-size10.size6 {
  /* stylelint-disable-next-line */
  font-size: 0.4821600771em;
}
.katex .sizing.reset-size10.size7,
.katex .fontsize-ensurer.reset-size10.size7 {
  /* stylelint-disable-next-line */
  font-size: 0.5785920926em;
}
.katex .sizing.reset-size10.size8,
.katex .fontsize-ensurer.reset-size10.size8 {
  /* stylelint-disable-next-line */
  font-size: 0.6943105111em;
}
.katex .sizing.reset-size10.size9,
.katex .fontsize-ensurer.reset-size10.size9 {
  /* stylelint-disable-next-line */
  font-size: 0.8331726133em;
}
.katex .sizing.reset-size10.size10,
.katex .fontsize-ensurer.reset-size10.size10 {
  /* stylelint-disable-next-line */
  font-size: 1em;
}
.katex .sizing.reset-size10.size11,
.katex .fontsize-ensurer.reset-size10.size11 {
  /* stylelint-disable-next-line */
  font-size: 1.1996142719em;
}
.katex .sizing.reset-size11.size1,
.katex .fontsize-ensurer.reset-size11.size1 {
  /* stylelint-disable-next-line */
  font-size: 0.2009646302em;
}
.katex .sizing.reset-size11.size2,
.katex .fontsize-ensurer.reset-size11.size2 {
  /* stylelint-disable-next-line */
  font-size: 0.2411575563em;
}
.katex .sizing.reset-size11.size3,
.katex .fontsize-ensurer.reset-size11.size3 {
  /* stylelint-disable-next-line */
  font-size: 0.2813504823em;
}
.katex .sizing.reset-size11.size4,
.katex .fontsize-ensurer.reset-size11.size4 {
  /* stylelint-disable-next-line */
  font-size: 0.3215434084em;
}
.katex .sizing.reset-size11.size5,
.katex .fontsize-ensurer.reset-size11.size5 {
  /* stylelint-disable-next-line */
  font-size: 0.3617363344em;
}
.katex .sizing.reset-size11.size6,
.katex .fontsize-ensurer.reset-size11.size6 {
  /* stylelint-disable-next-line */
  font-size: 0.4019292605em;
}
.katex .sizing.reset-size11.size7,
.katex .fontsize-ensurer.reset-size11.size7 {
  /* stylelint-disable-next-line */
  font-size: 0.4823151125em;
}
.katex .sizing.reset-size11.size8,
.katex .fontsize-ensurer.reset-size11.size8 {
  /* stylelint-disable-next-line */
  font-size: 0.578778135em;
}
.katex .sizing.reset-size11.size9,
.katex .fontsize-ensurer.reset-size11.size9 {
  /* stylelint-disable-next-line */
  font-size: 0.6945337621em;
}
.katex .sizing.reset-size11.size10,
.katex .fontsize-ensurer.reset-size11.size10 {
  /* stylelint-disable-next-line */
  font-size: 0.8336012862em;
}
.katex .sizing.reset-size11.size11,
.katex .fontsize-ensurer.reset-size11.size11 {
  /* stylelint-disable-next-line */
  font-size: 1em;
}
.katex .delimsizing.size1 {
  font-family: KaTeX_Size1;
}
.katex .delimsizing.size2 {
  font-family: KaTeX_Size2;
}
.katex .delimsizing.size3 {
  font-family: KaTeX_Size3;
}
.katex .delimsizing.size4 {
  font-family: KaTeX_Size4;
}
.katex .delimsizing.mult .delim-size1 > span {
  font-family: KaTeX_Size1;
}
.katex .delimsizing.mult .delim-size4 > span {
  font-family: KaTeX_Size4;
}
.katex .nulldelimiter {
  display: inline-block;
  width: 0.12em;
}
.katex .delimcenter {
  position: relative;
}
.katex .op-symbol {
  position: relative;
}
.katex .op-symbol.small-op {
  font-family: KaTeX_Size1;
}
.katex .op-symbol.large-op {
  font-family: KaTeX_Size2;
}
.katex .op-limits > .vlist-t {
  text-align: center;
}
.katex .accent > .vlist-t {
  text-align: center;
}
.katex .accent .accent-body {
  position: relative;
}
.katex .accent .accent-body:not(.accent-full) {
  width: 0;
}
.katex .overlay {
  display: block;
}
.katex .mtable .vertical-separator {
  display: inline-block;
  min-width: 1px;
}
.katex .mtable .arraycolsep {
  display: inline-block;
}
.katex .mtable .col-align-c > .vlist-t {
  text-align: center;
}
.katex .mtable .col-align-l > .vlist-t {
  text-align: left;
}
.katex .mtable .col-align-r > .vlist-t {
  text-align: right;
}
.katex .svg-align {
  text-align: left;
}
.katex svg {
  display: block;
  position: absolute;
  width: 100%;
  height: inherit;
  fill: currentColor;
  stroke: currentColor;
}
.katex svg path {
  stroke: none;
}
.katex svg {
  fill-rule: nonzero;
  fill-opacity: 1;
  stroke-width: 1;
  stroke-linecap: butt;
  stroke-linejoin: miter;
  stroke-miterlimit: 4;
  stroke-dasharray: none;
  stroke-dashoffset: 0;
  stroke-opacity: 1;
}
.katex img {
  border-style: none;
  min-width: 0;
  min-height: 0;
  max-width: none;
  max-height: none;
}
.katex .stretchy {
  width: 100%;
  display: block;
  position: relative;
  overflow: hidden;
}
.katex .stretchy::before, .katex .stretchy::after {
  content: "";
}
.katex .hide-tail {
  width: 100%;
  position: relative;
  overflow: hidden;
}
.katex .halfarrow-left {
  position: absolute;
  left: 0;
  width: 50.2%;
  overflow: hidden;
}
.katex .halfarrow-right {
  position: absolute;
  right: 0;
  width: 50.2%;
  overflow: hidden;
}
.katex .brace-left {
  position: absolute;
  left: 0;
  width: 25.1%;
  overflow: hidden;
}
.katex .brace-center {
  position: absolute;
  left: 25%;
  width: 50%;
  overflow: hidden;
}
.katex .brace-right {
  position: absolute;
  right: 0;
  width: 25.1%;
  overflow: hidden;
}
.katex .x-arrow-pad {
  padding: 0 0.5em;
}
.katex .cd-arrow-pad {
  padding: 0 0.55556em 0 0.27778em;
}
.katex .x-arrow,
.katex .mover,
.katex .munder {
  text-align: center;
}
.katex .boxpad {
  padding: 0 0.3em;
}
.katex .fbox,
.katex .fcolorbox {
  box-sizing: border-box;
  border: 0.04em solid;
}
.katex .cancel-pad {
  padding: 0 0.2em;
}
.katex .cancel-lap {
  margin-left: -0.2em;
  margin-right: -0.2em;
}
.katex .sout {
  border-bottom-style: solid;
  border-bottom-width: 0.08em;
}
.katex .angl {
  box-sizing: border-box;
  border-top: 0.049em solid;
  border-right: 0.049em solid;
  margin-right: 0.03889em;
}
.katex .anglpad {
  padding: 0 0.03889em;
}
.katex .eqn-num::before {
  counter-increment: katexEqnNo;
  content: "(" counter(katexEqnNo) ")";
}
.katex .mml-eqn-num::before {
  counter-increment: mmlEqnNo;
  content: "(" counter(mmlEqnNo) ")";
}
.katex .mtr-glue {
  width: 50%;
}
.katex .cd-vert-arrow {
  display: inline-block;
  position: relative;
}
.katex .cd-label-left {
  display: inline-block;
  position: absolute;
  right: calc(50% + 0.3em);
  text-align: left;
}
.katex .cd-label-right {
  display: inline-block;
  position: absolute;
  left: calc(50% + 0.3em);
  text-align: right;
}

.katex-display {
  display: block;
  margin: 1em 0;
  text-align: center;
}
.katex-display > .katex {
  display: block;
  text-align: center;
  white-space: nowrap;
}
.katex-display > .katex > .katex-html {
  display: block;
  position: relative;
}
.katex-display > .katex > .katex-html > .tag {
  position: absolute;
  right: 0;
}

.katex-display.leqno > .katex > .katex-html > .tag {
  left: 0;
  right: auto;
}

.katex-display.fleqn > .katex {
  text-align: left;
  padding-left: 2em;
}

body {
  counter-reset: katexEqnNo mmlEqnNo;
}
`,vl=`.lightbox {
    position: fixed;
    inset: 0;
    z-index: 99999;
    display: none;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    opacity: 0;
    transition: opacity 0.15s ease-out;
}

.lightbox.open {
    display: flex;
    opacity: 1;
}

.lightbox-content {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.lightbox-content img {
    max-width: 90vw;
    max-height: 90vh;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.lightbox-content iframe {
    width: min(90vw, calc(90vh * 16 / 9));
    height: min(90vh, calc(90vw * 9 / 16));
    border: none;
    border-radius: 8px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    background: #000;
}

.lightbox-close {
    position: absolute;
    top: -42px;
    right: -4px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
    border: none;
    border-radius: 50%;
    font-size: 20px;
    line-height: 1;
    cursor: pointer;
    transition: background 0.15s ease-out;
}

.lightbox-close:hover {
    background: rgba(255, 255, 255, 0.25);
}
`,yl=class e extends i{static singleton=null;payload=null;isOpen=!1;keydownHandler=null;constructor(){super(`plain-lightbox`,vl),e.singleton=this}template(){if(!this.isOpen||!this.payload)return this.html`<div class="lightbox" aria-hidden="true"></div>`;let e;if(this.payload.kind===`image`)e=this.html`<img src="${this.payload.src}" alt="${this.payload.alt??``}">`;else{let t=this.payload.start?`&start=${this.payload.start}`:``;e=this.html`<iframe
                src="https://www.youtube-nocookie.com/embed/${this.payload.videoId}?autoplay=1${t}"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>`}return this.html`
            <div class="lightbox open" role="dialog" aria-modal="true">
                <div class="lightbox-content">
                    <button class="lightbox-close" aria-label="Close">&times;</button>
                    ${e}
                </div>
            </div>
        `}afterRender(){if(!this.isOpen)return;let e=this.$(`.lightbox`),t=this.$(`.lightbox-close`),n=this.$(`.lightbox-content`);e?.addEventListener(`click`,e=>{n?.contains(e.target)||this.close()}),t?.addEventListener(`click`,()=>this.close())}open(e){this.payload=e,this.isOpen=!0,this.keydownHandler=e=>{e.key===`Escape`&&this.close()},document.addEventListener(`keydown`,this.keydownHandler),this.render()}close(){this.isOpen=!1,this.payload=null,this.keydownHandler&&=(document.removeEventListener(`keydown`,this.keydownHandler),null),this.render()}static show(t){if(!e.singleton){let e=document.createElement(`plain-lightbox`);document.body.appendChild(e)}e.singleton?.open(t)}};window.customElements.define(`plain-lightbox`,yl),E.use(pl({throwOnError:!1,nonStandard:!0}));var bl=/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/i,xl=/[?&](?:t|start)=([^&#]+)/i,Sl=/\.(png|jpe?g|gif|webp|avif)(?:\?[^\s)]*)?$/i;function Cl(e){if(/^\d+$/.test(e))return parseInt(e,10);let t=e.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/i);if(!t||!t[1]&&!t[2]&&!t[3])return null;let n=parseInt(t[1]||`0`,10),r=parseInt(t[2]||`0`,10),i=parseInt(t[3]||`0`,10);return n*3600+r*60+i}function wl(e){let t=e.match(bl);if(!t)return null;let n=e.match(xl),r=n?Cl(n[1]):null;return{id:t[1],start:r}}function Tl(e){return Sl.test(e)}var El=class extends i{chatContext;resultContext;companyContext;isLoading=!1;streamingMessage=``;showFetchingLabel=!1;isFadingOut=!1;fadeOutTimer=null;mediaClickHandler=null;isExpanded=!1;streamingReasoning=``;constructor(){super(`plain-chat-window`,`${_l}\n${It}`),this.chatContext=this.useContext(g.CHAT,!0),this.resultContext=this.useContext(g.RESULT,!0),this.companyContext=this.useContext(g.COMPANY),this.signals=this.useSignals(),this.signals.register(w.CHAT_EXPAND_TOGGLED),this.signals.register(w.CHAT_RETRY_REQUESTED)}template(){let e=this.chatContext.get(`history`)||[],t=this.resultContext.get(`data`)||[],n=this.companyContext.get(`name`)||`the Agora`,r=this.companyContext.get(`primaryColor`)||`#7c3aed`,i=t.length>0,a=`<svg class="reasoning-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`,o=bt();return this.html`
            <div class="chat-window ${this.isExpanded?`expanded`:``}" style="--company-primary-color: ${r};">
                <div class="chat-header">
                    <button
                        class="chat-expand-btn"
                        title="${this.isExpanded?`Restore chat size`:`Expand chat`}"
                        aria-label="${this.isExpanded?`Restore chat size`:`Expand chat`}"
                    >
                        ${this.isExpanded?`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>`:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>`}
                    </button>
                </div>
                <div class="chat-messages">
                    ${e.length===0?this.html`
                            <div class="empty-state">
                                <div class="empty-text-container">
                                    <div class="flying-dot">
                                        <div class="pulse-ring"></div>
                                        <div class="pulse-ring pulse-ring-2"></div>
                                        <div class="pulse-ring pulse-ring-3"></div>
                                    </div>
                                    ${i?this.html`
                                            <span class="empty-text">Curious about these results?</span>
                                            <span class="empty-hint">Use @ to reference them</span>
                                        `:this.html`
                                            <span class="empty-text">Welcome to ${n}</span>
                                            <span class="empty-hint">How can I help you today?</span>
                                        `}
                                </div>
                            </div>
                        `:e.map((e,t)=>e.isError?this.html`
                                <div class="message ai error">
                                    <span class="message-author">Aida</span>
                                    <div class="message-text">${e.content}</div>
                                    <button class="retry-btn" data-index="${t}" title="Retry">
                                        ${`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>`}
                                        <span>Retry</span>
                                    </button>
                                </div>
                            `:this.html`
                                <div class="message ${e.author}">
                                    <span class="message-author">${e.author===`user`?`You`:`Aida`}</span>
                                    ${o&&e.author===`ai`&&e.reasoning?this.html`
                                        <details class="reasoning-block">
                                            <summary><span>Reasoning</span>${a}</summary>
                                            <pre class="reasoning-content">${e.reasoning}</pre>
                                        </details>
                                    `:``}
                                    <div class="message-text">${this.formatMessage(e.content,e.author===`ai`)}</div>
                                </div>
                            `).join(``)}
                    ${this.isLoading||this.streamingMessage?this.html`
                        <div class="message ai ${this.streamingMessage?`streaming`:`loading`}">
                            <span class="message-author">
                                Aida
                                ${this.showFetchingLabel?this.html`
                                    <span class="fetching-label ${this.isFadingOut?`fade-out`:``}">Fetching results...</span>
                                `:``}
                            </span>
                            ${o&&this.streamingReasoning?this.html`
                                <details class="reasoning-block streaming-reasoning" open>
                                    <summary><span>Reasoning</span>${a}</summary>
                                    <pre class="reasoning-content">${this.streamingReasoning}</pre>
                                </details>
                            `:``}
                            <div class="message-text">
                                ${this.streamingMessage?this.formatMessage(this.streamingMessage):this.html`
                                        <span class="typing-indicator">
                                            <span></span><span></span><span></span>
                                        </span>
                                    `}
                            </div>
                        </div>
                    `:``}
                </div>
            </div>
        `}handleUserMessage(){this.isLoading=!0,this.streamingMessage=``,this.streamingReasoning=``,this.showFetchingLabel=!1,this.isFadingOut=!1,this.fadeOutTimer&&=(clearTimeout(this.fadeOutTimer),null),this.render(),this.scrollToBottom()}handleMessageChunk(e){this.streamingMessage=e.fullMessage,e.fullMessage&&(this.isLoading=!1),this.updateStreamingBubble(e.fullMessage)}handleMessageComplete(){this.streamingMessage=``,this.streamingReasoning=``,this.isLoading=!1,this.render(),this.scrollToBottom(),Pe({source:`chat-message-complete`,debounceMs:180})}handleReasoningChunk(e){if(!bt())return;this.streamingReasoning=e.fullReasoning;let t=this.$(`.streaming-reasoning .reasoning-content`);t?(t.textContent=this.streamingReasoning,this.scrollToBottom()):(this.render(),this.scrollToBottom())}handleFetchingResults(e){if(e&&!this.showFetchingLabel&&(this.showFetchingLabel=!0,this.isFadingOut=!1,this.fadeOutTimer&&=(clearTimeout(this.fadeOutTimer),null),this.render()),!e&&this.showFetchingLabel&&!this.isFadingOut){this.isFadingOut=!0;let e=this.$(`.fetching-label`);e&&e.classList.add(`fade-out`),this.fadeOutTimer=setTimeout(()=>{this.showFetchingLabel=!1,this.isFadingOut=!1,this.fadeOutTimer=null,this.render()},1500)}this.scrollToBottom()}formatMessage(e,t=!1){let n=E.parse(e,{async:!1,breaks:!0});return t?this.rewriteMediaLinks(n):n}rewriteMediaLinks(e){let t=document.createElement(`template`);return t.innerHTML=e,t.content.querySelectorAll(`a[href]`).forEach(e=>{let t=e.getAttribute(`href`)||``,n=wl(t);if(n){e.replaceWith(this.buildYouTubeEmbed(n.id,n.start));return}Tl(t)&&e.replaceWith(this.buildImageEmbed(t,e.textContent||``))}),t.content.querySelectorAll(`img`).forEach(e=>{e.classList.add(`chat-media-image`);let t=e.getAttribute(`src`)||``;e.setAttribute(`data-src`,t),e.setAttribute(`loading`,`lazy`)}),t.innerHTML}buildYouTubeEmbed(e,t){let n=document.createElement(`div`);n.className=`chat-media chat-media-youtube`,n.setAttribute(`data-yt-id`,e),t&&n.setAttribute(`data-yt-start`,String(t));let r=t?`?start=${t}`:``;return n.innerHTML=`
            <iframe
                src="https://www.youtube-nocookie.com/embed/${e}${r}"
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
        `,n}buildImageEmbed(e,t){let n=document.createElement(`img`);return n.className=`chat-media-image`,n.src=e,n.alt=t,n.loading=`lazy`,n.setAttribute(`data-src`,e),n}attachMediaClickHandler(){if(this.mediaClickHandler)return;let e=this.$(`.chat-messages`);e&&(this.mediaClickHandler=e=>{let t=e.target,n=t.closest(`.chat-media-youtube`);if(n){let e=n.getAttribute(`data-yt-id`),t=n.getAttribute(`data-yt-start`),r=t?parseInt(t,10):null;e&&yl.show({kind:`youtube`,videoId:e,start:r});return}let r=t.closest(`.chat-media-image`);if(r){let e=r.getAttribute(`data-src`)||r.src;e&&yl.show({kind:`image`,src:e,alt:r.alt})}},e.addEventListener(`click`,this.mediaClickHandler))}updateStreamingBubble(e){let t=this.$(`.message.streaming .message-text`);t?(t.innerHTML=this.formatMessage(e),this.scrollToBottom()):(this.render(),this.scrollToBottom())}setLoading(e){this.isLoading=e,this.render(),e&&this.scrollToBottom()}scrollToBottom(){let e=this.$(`.chat-messages`);e&&(e.scrollTop=e.scrollHeight)}listeners(){let e=this.$(`.chat-expand-btn`);e&&(e.onclick=e=>{e.stopPropagation(),this.isExpanded=!this.isExpanded,this.signals?.emit(w.CHAT_EXPAND_TOGGLED,this.isExpanded),this.render()}),this.$$(`.retry-btn`).forEach(e=>{e.onclick=t=>{t.stopPropagation();let n=parseInt(e.dataset.index||`-1`,10);this.handleRetryClick(n)}})}handleRetryClick(e){let t=this.chatContext.get(`history`)||[];if(e<0||e>=t.length)return;let n=null;for(let r=e-1;r>=0;r--)if(t[r].author===`user`){n=t[r].content;break}if(!n)return;let r=t.slice();r.splice(e,1),this.chatContext.set(r,`history`),this.signals?.emit(w.CHAT_RETRY_REQUESTED,{message:n})}afterRender(){this.mediaClickHandler=null,this.attachMediaClickHandler(),this.scrollToBottom()}};window.customElements.define(`plain-chat-window`,El);const Dl={REQUESTED:`requested`,DEVELOPMENT:`development`,ACTIVE:`active`,INACTIVE:`inactive`,ARCHIVED:`archived`};function Ol(e){return vt({services:e},`model`).map(e=>e.model)}function kl(e){return e.reduce((e,t)=>{let n=vt(t.fields,`model`);return e[t.fields.name]={models:n.map(e=>e.model),description:t.fields.description},e},{})}function Al(e){return e.filter(e=>e.fields.stage===Dl.ACTIVE)}function jl(e){return[...e].sort((e,t)=>e.fields.name.localeCompare(t.fields.name))}function Ml(e,t){return[...e].sort((e,n)=>{let r=t.get(e.fields.name)??2**53-1,i=t.get(n.fields.name)??2**53-1;return r-i})}function Nl(e){return Object.entries(e).reduce((e,[t,n])=>{let r=(Array.isArray(n)?n:[n]).filter(e=>e?.fields?.stage===Dl.ACTIVE).flatMap(e=>vt(e.fields,`model`).map(e=>e.model));return r.length>0&&(e[t]=[...new Set(r)]),e},{})}function Pl(e,t){return`'${(typeof e==`string`&&e.trim().length>0?e.trim():t).replace(/'/g,`\\'`)}'`}function Fl(e){let t=document.head;e.forEach(e=>{try{let n=new URL(e).origin;if(t.querySelector(`link[rel="preconnect"][href="${n}"]`))return;let r=document.createElement(`link`);r.rel=`dns-prefetch`,r.href=n,t.appendChild(r);let i=document.createElement(`link`);i.rel=`preconnect`,i.href=n,i.crossOrigin=`anonymous`,t.appendChild(i)}catch(t){console.warn(`Invalid URL for preconnect: ${e}`,t)}})}var Il=class{deps;visualCompanyColorOverrides={};constructor(e){this.deps=e}async initializeAll(){this.initConfig(),this.initVisualConfig(),this.initPromptConfig();let e=this.deps.configContext.get(`API_HOST`),t=this.deps.configContext.get(`AI_HOST`),n=[e];if(t&&n.push(t),Fl(n),this.deps.configContext.get(`IS_METAGORA`))this.initMetagoraCompanyContext(),await this.initMetagoraServiceContext(),await this.initAidaApiKeyForMetagora();else{let e=await this.initServiceContext();this.initCompanyContext(e),await this.initAidaApiKey()}this.initModalContext()}initConfig(){let e={APP_NAME:this.deps.getAttribute(`name`)??v.APP_NAME,VERSION:v.VERSION,API_HOST:this.deps.getAttribute(`host`)??window.location.origin??v.API_HOST,AI_HOST:this.deps.getAttribute(`ai_host`)??v.AI_HOST,TRANSLATION_HOST:this.deps.getAttribute(`translation_host`)??v.TRANSLATION_HOST,ENABLED_AI:this.deps.hasAttribute(`enabled_ai`)??v.ENABLED_AI,DEBUG_MODE:this.deps.hasAttribute(`debug_mode`)??v.DEBUG_MODE,IS_METAGORA:v.IS_METAGORA,MAX_HEIGHT:this.deps.getAttribute(`max_height`)??v.MAX_HEIGHT,VISIBLE_LOGO:this.deps.getAttribute(`visible_logo`)===`false`?!1:v.VISIBLE_LOGO,PROMPT_CONFIG_ID:null};this.deps.configContext.set(e)}async initPromptConfig(){try{let e=this.deps.configContext.get(`API_HOST`),t=await _t.GET_ACTIVE_PROMPT_CONFIG(e);t&&this.deps.configContext.set(t,`PROMPT_CONFIG_ID`)}catch{}}async initVisualConfig(){let e=this.deps.configContext.get(`API_HOST`),t={},n=this.deps.getAttribute(`primary_color`);n&&(t.primary_color=n);let r=this.deps.getAttribute(`secondary_color`);r&&(t.secondary_color=r);let i=this.deps.getAttribute(`greeting_headline`);i!==null&&(i===`false`?t.greeting_headline=!1:i.trim().length>0&&(t.greeting_headline=i));let a=this.deps.getAttribute(`searchbar_placeholder`);a!==null&&(a===`false`?t.searchbar_placeholder=!1:a.trim().length>0&&(t.searchbar_placeholder=a));let o=this.deps.getAttribute(`agora_or_datagora`);o&&(t.agora_or_datagora=o);try{let n=await _t.GET_HOME_VISUAL_CONFIG(e);if(n){let e={};for(let[t,r]of Object.entries(n))r!=null&&(Array.isArray(r)&&r.length===0||typeof r==`string`&&r.trim().length===0||(e[t]=r));let r={...y,...t,...e};this.deps.visualConfigContext.set(r,!0),this.visualCompanyColorOverrides=this.extractCompanyColorOverrides(e,t),this.applyCompanyColorOverrides(this.visualCompanyColorOverrides)}else this.deps.visualConfigContext.set({...y,...t},!0),this.visualCompanyColorOverrides=this.extractCompanyColorOverrides({},t),this.applyCompanyColorOverrides(this.visualCompanyColorOverrides)}catch{this.deps.visualConfigContext.set({...y,...t},!0),this.visualCompanyColorOverrides=this.extractCompanyColorOverrides({},t),this.applyCompanyColorOverrides(this.visualCompanyColorOverrides)}}extractCompanyColorOverrides(e,t){let n=e.primary_color??t.primary_color,r=e.secondary_color??t.secondary_color,i={};return typeof n==`string`&&n.trim().length>0&&(i.primaryColor=n),typeof r==`string`&&r.trim().length>0&&(i.secondaryColor=r),i}applyCompanyColorOverrides(e){if(!e.primaryColor&&!e.secondaryColor)return;let t=this.deps.companyContext.get();t&&this.deps.companyContext.set({...t,...e},!0)}async initServiceContext(){let e=await this.fetchServices(this.deps.configContext.get(`API_HOST`)),t=e.items[0],n=t.fields.sub_acceleration_services instanceof Array?[...t.fields.sub_acceleration_services]:[t.fields.sub_acceleration_services],r=new Map(e.order.map(e=>[e.name,e.sequence]));n=Ml(n,r),n=Al(n);let i=Ol(n),a=kl(n),o={services:n,models:i,modelsByService:a};return this.deps.serviceContext.set(o,!0),t}async initMetagoraServiceContext(){let e=await _t.GET_ALL_AGORA_URLS();Fl(e);let t=[],n=await Promise.all(e.map(async e=>{try{let n=await this.fetchServices(e);n.total===0&&console.warn(`No services found for Agora at ${e}`);let r=n.items[0],i={host:e,name:r.fields.company.fields.name,primaryColor:r.fields.primary_color,secondaryColor:r.fields.secondary_color};return t.push(i),[e,r.fields.sub_acceleration_services]}catch(t){return console.error(`Error fetching services from ${e}:`,t),[e,{total:0,items:[],order:[]}]}})),r=Object.fromEntries(n);this.deps.metagoraContext.set({agoras:t},!0);let i=[];Object.entries(r).forEach(([e,t])=>{let n=(Array.isArray(t)?t:[t]).map(t=>({...t,_sourceHost:e}));i.push(...n)}),i=jl(i),i=Al(i);let a=Ol(i),o=kl(i),s=Nl(r);this.deps.serviceContext.set({services:i,models:a,modelsByAgora:s,modelsByService:o},!0)}initCompanyContext(e){let t={name:e.fields.name,primaryColor:e.fields.primary_color,secondaryColor:e.fields.secondary_color};this.deps.companyContext.set({...t,...this.visualCompanyColorOverrides},!0)}initMetagoraCompanyContext(){this.deps.companyContext.set({name:`Metagora`,primaryColor:`#3a85fe`,secondaryColor:`#00AAFF`,...this.visualCompanyColorOverrides},!0)}initModalContext(){this.deps.modalContext.set({isOpen:!1,element:null})}async initAidaApiKey(){try{let e=this.deps.serviceContext.get(`models`)||[],t=await _t.GET_AIDA_API_KEY(this.deps.configContext.get(`API_HOST`),e);if(!t?.token?.jwt_token){console.warn(`There was an error while retrieving the assistant API key.
Please, contact the administrator.`);return}localStorage.setItem(`aida_ak`,t.token.jwt_token)}catch(e){console.warn(`Error retrieving assistant API key: ${e}`)}}async initAidaApiKeyForMetagora(){try{let e=(this.deps.metagoraContext.get(`agoras`)||[]).map(e=>e.host),t=this.deps.serviceContext.get(`modelsByAgora`)||[],n=await _t.GET_MULTIPLE_AIDA_API_KEYS(e,t);localStorage.setItem(`aida_multiple_ak`,JSON.stringify(n)||`{}`)}catch(e){console.warn(`Error retrieving Metagora API keys: ${e}`)}}async fetchServices(e){return await _t.GET_AGORA_SERVICES(e)}},Ll=class{deps;callbacks;mql=window.matchMedia(`(max-width: 1024px)`);hasAutoCollapsedForResults=!1;isChatExpanded=!1;constructor(e,t){this.deps=e,this.callbacks=t}initializeLayout(){this.deps.resultContext.get(`data`)&&this.deps.resultContext.get(`data`).length>0?this.updateVisibility(this.deps.resultContext.get().data):this.deps.$(`.right-panel`)?.classList.add(`collapsed`);let e=this.deps.chatContext.get(`history`);if(e&&e.length>0){this.callbacks.setCurrentMode(`chat`),this.showChatWindow();let e=this.deps.$(`plain-agora-input`);e?.toggleMode&&e.toggleMode(`chat`,new Event(`init`))}}updateVisibility(e){let t=this.getLayoutElements();if(e===null){this.handleNoResults(t),Pe({source:`layout-no-results`,debounceMs:260});return}e.length>0?this.handleHasResults(t):this.handleEmptyResults(t),Pe({source:`layout-results`,debounceMs:260})}showChatWindow(){let e=this.deps.$(`plain-chat-window`),t=this.deps.$(`.content-left`),n=this.deps.$(`.content-right plain-carousel`),r=this.deps.$(`.left-panel--footer plain-carousel`),i=this.deps.$(`plain-greetings`),a=this.deps.$(`.main-panel--header`);e?.classList.add(`faded-in`),e?.classList.remove(`faded-out`),t?.classList.add(`has-content`),n?.classList.add(`faded-out`),n?.classList.remove(`faded-in`),r?.classList.add(`faded-in`),r?.classList.remove(`faded-out`),this.mql.matches?(a?.classList.add(`collapsed`),i?.classList.add(`display-none`),i?.classList.add(`faded-out`)):(i?.classList.add(`faded-out`),setTimeout(()=>{i?.classList.contains(`faded-out`)&&(a?.classList.add(`collapsed`),i?.classList.add(`display-none`))},500))}resetToInitialState(){let e=this.deps.$(`.content-right plain-carousel`)||this.deps.$(`.content-right plain-metagora-carousel`),t=this.deps.$(`plain-artifact-display`),n=this.deps.$(`.left-panel--footer plain-carousel`),r=this.deps.$(`plain-greetings`),i=this.deps.$(`.main-panel--header`),a=this.deps.$(`plain-chat-window`),o=this.deps.$(`.content-left`),s=this.deps.$(`.content-right`),c=this.deps.$(`.right-panel`),l=(this.deps.resultContext.get(`data`)||[]).length>0;if(e?.classList.add(`faded-out`),e?.classList.remove(`faded-in`),n?.classList.add(`faded-in`),n?.classList.remove(`faded-out`),this.mql.matches?(i?.classList.add(`collapsed`),r?.classList.add(`display-none`),r?.classList.add(`faded-out`)):(r?.classList.add(`faded-out`),setTimeout(()=>{r?.classList.contains(`faded-out`)&&(i?.classList.add(`collapsed`),r?.classList.add(`display-none`))},500)),a?.classList.add(`faded-in`),a?.classList.remove(`faded-out`),o?.classList.add(`has-content`),l){let e=this.hasDisplayableFilters();this.mql.matches?(c?.classList.add(`collapsed`),e?this.callbacks.getPanelHandler().showFilterFab():this.callbacks.getPanelHandler().hideFilterFab()):this.isChatExpanded?c?.classList.add(`collapsed`):e?c?.classList.remove(`collapsed`):c?.classList.add(`collapsed`),t?.classList.add(`faded-in`),t?.classList.remove(`faded-out`),s?.classList.add(`has-results`)}else c?.classList.add(`collapsed`),this.callbacks.getPanelHandler().hideFilterFab(),t?.classList.remove(`faded-in`),t?.classList.add(`faded-out`),s?.classList.remove(`has-results`)}handleModeSwitch(e){this.callbacks.setCurrentMode(e);let t=this.getLayoutElements(),n=(this.deps.resultContext.get(`data`)||[]).length>0;e===`search`?this.switchToSearchMode(t,n):this.switchToChatMode(t,n)}getLayoutElements(){return{centralCarousel:this.deps.$(`.content-right plain-carousel`)||this.deps.$(`.content-right plain-metagora-hero`),artifactDisplay:this.deps.$(`plain-artifact-display`),leftCarousel:this.deps.$(`.left-panel--footer plain-carousel`),greetings:this.deps.$(`plain-greetings`),mainHeader:this.deps.$(`.main-panel--header`),chatWindow:this.deps.$(`plain-chat-window`),contentLeft:this.deps.$(`.content-left`),contentRight:this.deps.$(`.content-right`),rightPanel:this.deps.$(`.right-panel`),rightHoverZone:this.deps.$(`.right-panel-hover-zone`)}}handleNoResults(e){let t=(this.deps.chatContext.get(`history`)||[]).length>0;e.rightPanel?.classList.add(`collapsed`),e.rightHoverZone?.classList.remove(`active`),this.callbacks.getPanelHandler().hideFilterFab(),t?(e.artifactDisplay?.classList.remove(`faded-in`),e.artifactDisplay?.classList.add(`faded-out`),e.contentRight?.classList.remove(`has-results`)):(setTimeout(()=>{e.centralCarousel?.classList.remove(`faded-out`),e.centralCarousel?.classList.add(`faded-in`)},200),e.artifactDisplay?.classList.remove(`faded-in`),e.artifactDisplay?.classList.add(`faded-out`),e.leftCarousel?.classList.remove(`faded-in`),e.leftCarousel?.classList.add(`faded-out`),e.greetings?.classList.remove(`faded-out`),e.greetings?.classList.add(`faded-in`),e.mainHeader?.classList.remove(`collapsed`),e.greetings?.classList.remove(`display-none`),e.chatWindow?.classList.remove(`faded-in`),e.chatWindow?.classList.add(`faded-out`),e.contentLeft?.classList.remove(`has-content`),e.contentRight?.classList.remove(`has-results`))}handleHasResults(e){!this.hasAutoCollapsedForResults&&!this.mql.matches&&(this.callbacks.getPanelHandler().collapseNavIfExpanded(),this.hasAutoCollapsedForResults=!0);let t=this.hasDisplayableFilters();this.mql.matches?(e.rightPanel?.classList.add(`collapsed`),t?this.callbacks.getPanelHandler().showFilterFab():this.callbacks.getPanelHandler().hideFilterFab()):this.isChatExpanded?e.rightPanel?.classList.add(`collapsed`):t?e.rightPanel?.classList.remove(`collapsed`):e.rightPanel?.classList.add(`collapsed`),e.centralCarousel?.classList.add(`faded-out`),e.centralCarousel?.classList.remove(`faded-in`),e.artifactDisplay?.classList.add(`faded-in`),e.artifactDisplay?.classList.remove(`faded-out`),e.leftCarousel?.classList.add(`faded-in`),e.leftCarousel?.classList.remove(`faded-out`),this.mql.matches?(e.mainHeader?.classList.add(`collapsed`),e.greetings?.classList.add(`display-none`),e.greetings?.classList.add(`faded-out`)):(e.greetings?.classList.add(`faded-out`),setTimeout(()=>{e.greetings?.classList.contains(`faded-out`)&&(e.mainHeader?.classList.add(`collapsed`),e.greetings?.classList.add(`display-none`))},500)),this.callbacks.getCurrentMode()===`chat`?(e.chatWindow?.classList.add(`faded-in`),e.chatWindow?.classList.remove(`faded-out`),e.contentLeft?.classList.add(`has-content`),e.contentRight?.classList.add(`has-results`)):(e.chatWindow?.classList.remove(`faded-in`),e.chatWindow?.classList.add(`faded-out`),e.contentLeft?.classList.remove(`has-content`),e.contentRight?.classList.remove(`has-results`))}handleEmptyResults(e){e.rightPanel?.classList.add(`collapsed`),this.callbacks.getPanelHandler().hideFilterFab(),e.centralCarousel?.classList.add(`faded-out`),e.centralCarousel?.classList.remove(`faded-in`),e.artifactDisplay?.classList.add(`faded-in`),e.artifactDisplay?.classList.remove(`faded-out`),e.leftCarousel?.classList.add(`faded-in`),e.leftCarousel?.classList.remove(`faded-out`),e.mainHeader?.classList.remove(`collapsed`),e.greetings?.classList.remove(`display-none`),requestAnimationFrame(()=>{e.greetings?.classList.remove(`faded-out`)}),this.callbacks.getCurrentMode()===`chat`?(e.chatWindow?.classList.add(`faded-in`),e.chatWindow?.classList.remove(`faded-out`),e.contentLeft?.classList.add(`has-content`)):(e.chatWindow?.classList.remove(`faded-in`),e.chatWindow?.classList.add(`faded-out`),e.contentLeft?.classList.remove(`has-content`)),e.contentRight?.classList.remove(`has-results`)}switchToSearchMode(e,t){if(e.chatWindow?.classList.remove(`faded-in`),e.chatWindow?.classList.add(`faded-out`),e.contentLeft?.classList.remove(`has-content`),t){let t=this.hasDisplayableFilters();this.mql.matches?(e.rightPanel?.classList.add(`collapsed`),t?this.callbacks.getPanelHandler().showFilterFab():this.callbacks.getPanelHandler().hideFilterFab()):this.isChatExpanded?e.rightPanel?.classList.add(`collapsed`):t?e.rightPanel?.classList.remove(`collapsed`):e.rightPanel?.classList.add(`collapsed`),e.artifactDisplay?.classList.add(`faded-in`),e.artifactDisplay?.classList.remove(`faded-out`),e.contentRight?.classList.add(`has-results`)}else e.rightPanel?.classList.add(`collapsed`),this.callbacks.getPanelHandler().hideFilterFab(),e.centralCarousel?.classList.remove(`faded-out`),e.centralCarousel?.classList.add(`faded-in`),e.leftCarousel?.classList.remove(`faded-in`),e.leftCarousel?.classList.add(`faded-out`),e.greetings?.classList.remove(`faded-out`),e.greetings?.classList.add(`faded-in`),e.mainHeader?.classList.remove(`collapsed`),e.greetings?.classList.remove(`display-none`)}switchToChatMode(e,t){if(e.chatWindow?.classList.add(`faded-in`),e.chatWindow?.classList.remove(`faded-out`),e.contentLeft?.classList.add(`has-content`),e.centralCarousel?.classList.add(`faded-out`),e.centralCarousel?.classList.remove(`faded-in`),e.leftCarousel?.classList.add(`faded-in`),e.leftCarousel?.classList.remove(`faded-out`),this.mql.matches?(e.mainHeader?.classList.add(`collapsed`),e.greetings?.classList.add(`display-none`),e.greetings?.classList.add(`faded-out`)):(e.greetings?.classList.add(`faded-out`),setTimeout(()=>{e.greetings?.classList.contains(`faded-out`)&&(e.mainHeader?.classList.add(`collapsed`),e.greetings?.classList.add(`display-none`))},500)),t){let t=this.hasDisplayableFilters();this.mql.matches?(e.rightPanel?.classList.add(`collapsed`),t?this.callbacks.getPanelHandler().showFilterFab():this.callbacks.getPanelHandler().hideFilterFab()):this.isChatExpanded?e.rightPanel?.classList.add(`collapsed`):t?e.rightPanel?.classList.remove(`collapsed`):e.rightPanel?.classList.add(`collapsed`),e.contentRight?.classList.add(`has-results`)}else e.rightPanel?.classList.add(`collapsed`),this.callbacks.getPanelHandler().hideFilterFab(),e.contentRight?.classList.remove(`has-results`)}hasDisplayableFilters(){return!!this.deps.$(`plain-filter-widget`)?.classList.contains(`has-filters`)}refreshFilterAvailability(){let e=this.deps.resultContext.get(`data`)||[];e.length!==0&&this.updateVisibility(e)}setChatExpanded(e){this.isChatExpanded=e,this.deps.$(`.content-split`)?.classList.toggle(`chat-expanded`,e);let t=this.deps.resultContext.get(`data`)||[];e?(this.deps.$(`.right-panel`)?.classList.add(`collapsed`),this.callbacks.getPanelHandler().hideFilterFab()):t.length>0&&this.updateVisibility(t)}},Rl=class{deps;state;mql=window.matchMedia(`(max-width: 1024px)`);isDrawerOpen=!1;constructor(e){this.deps=e,this.state={isNavCollapsed:!1,isRightPanelCollapsed:!1}}getState(){return{...this.state}}isMobile(){return this.mql.matches}setupEventListeners(){this.setupNavCollapseButton(),this.setupNavHoverZone(),this.setupRightPanelCollapseButton(),this.setupRightPanelHoverZone(),this.setupResponsive(),this.setupDrawer(),this.setupFilterFab(),this.setupRightPanelCloseButton()}toggleNavCollapse(){if(this.mql.matches){this.toggleDrawer();return}let e=this.deps.$(`.left-panel`),t=this.deps.$(`.nav-hover-zone`),n=this.deps.$(`.nav-collapse-btn`),r=e?.classList.contains(`nav-hover-expanded`);this.state.isNavCollapsed=!this.state.isNavCollapsed,e&&(r&&!this.state.isNavCollapsed?(e.classList.add(`no-transition`),e.classList.remove(`nav-hover-expanded`),e.classList.remove(`nav-collapsed`),requestAnimationFrame(()=>{e.classList.remove(`no-transition`)})):(e.classList.toggle(`nav-collapsed`,this.state.isNavCollapsed),e.classList.remove(`nav-hover-expanded`))),t&&t.classList.toggle(`active`,this.state.isNavCollapsed),n&&(n.innerHTML=this.state.isNavCollapsed?fe:de)}collapseNavIfExpanded(){this.mql.matches||this.state.isNavCollapsed||this.toggleNavCollapse()}toggleRightPanelCollapse(){let e=this.deps.$(`.right-panel`),t=this.deps.$(`.right-panel-hover-zone`),n=this.deps.$(`.right-panel-collapse-btn`),r=e?.classList.contains(`panel-hover-expanded`);this.state.isRightPanelCollapsed=!this.state.isRightPanelCollapsed,e&&(r&&!this.state.isRightPanelCollapsed?(e.classList.add(`no-transition`),e.classList.remove(`panel-hover-expanded`),e.classList.remove(`panel-collapsed`),requestAnimationFrame(()=>{e.classList.remove(`no-transition`)})):(e.classList.toggle(`panel-collapsed`,this.state.isRightPanelCollapsed),e.classList.remove(`panel-hover-expanded`))),t&&t.classList.toggle(`active`,this.state.isRightPanelCollapsed),n&&(n.innerHTML=this.state.isRightPanelCollapsed?de:fe)}showFilterFab(){let e=this.deps.$(`.filter-fab`);e&&this.mql.matches&&e.classList.add(`visible`)}hideFilterFab(){this.deps.$(`.filter-fab`)?.classList.remove(`visible`)}openDrawer(){let e=this.deps.$(`.left-panel`),t=this.deps.$(`.drawer-backdrop`);e?.classList.add(`drawer-open`),t?.classList.add(`active`),this.isDrawerOpen=!0,document.body.style.overflow=`hidden`}closeDrawer(){let e=this.deps.$(`.left-panel`),t=this.deps.$(`.drawer-backdrop`);e?.classList.remove(`drawer-open`),t?.classList.remove(`active`),this.isDrawerOpen=!1,document.body.style.overflow=``}toggleDrawer(){this.isDrawerOpen?this.closeDrawer():this.openDrawer()}setupResponsive(){this.mql.addEventListener(`change`,()=>{this.mql.matches||(this.closeDrawer(),this.hideFilterFab())})}setupDrawer(){let e=this.deps.$(`.hamburger-btn`),t=this.deps.$(`.drawer-backdrop`),n=this.deps.$(`.drawer-close-btn`);e?.addEventListener(`click`,()=>this.toggleDrawer()),t?.addEventListener(`click`,()=>this.closeDrawer()),n?.addEventListener(`click`,()=>this.closeDrawer())}setupFilterFab(){let e=this.deps.$(`.filter-fab`);e&&e.addEventListener(`click`,()=>{let e=this.deps.$(`.right-panel`);e?.classList.remove(`collapsed`),e?.classList.remove(`panel-collapsed`),this.hideFilterFab()})}setupRightPanelCloseButton(){let e=this.deps.$(`.right-panel-close-btn`);e&&e.addEventListener(`click`,()=>{this.deps.$(`.right-panel`)?.classList.add(`collapsed`),(this.deps.resultContext.get(`data`)||[]).length>0&&this.mql.matches&&this.showFilterFab()})}setupNavCollapseButton(){let e=this.deps.$(`.nav-collapse-btn`);e&&e.addEventListener(`click`,()=>this.toggleNavCollapse())}setupNavHoverZone(){let e=this.deps.$(`.nav-hover-zone`),t=this.deps.$(`.left-panel`);e&&t&&(e.addEventListener(`mouseenter`,()=>{this.state.isNavCollapsed&&(t.classList.remove(`nav-collapsed`),t.classList.add(`nav-hover-expanded`))}),t.addEventListener(`mouseleave`,()=>{this.state.isNavCollapsed&&(t.classList.add(`nav-collapsing`),t.classList.remove(`nav-hover-expanded`),setTimeout(()=>{this.state.isNavCollapsed&&!t.classList.contains(`nav-hover-expanded`)&&(t.classList.remove(`nav-collapsing`),t.classList.add(`nav-collapsed`))},300))}))}setupRightPanelCollapseButton(){let e=this.deps.$(`.right-panel-collapse-btn`);e&&e.addEventListener(`click`,()=>this.toggleRightPanelCollapse())}setupRightPanelHoverZone(){let e=this.deps.$(`.right-panel-hover-zone`),t=this.deps.$(`.right-panel`);e&&t&&(e.addEventListener(`mouseenter`,()=>{let e=(this.deps.resultContext.get(`data`)||[]).length>0;this.state.isRightPanelCollapsed&&e&&(t.classList.remove(`panel-collapsed`),t.classList.add(`panel-hover-expanded`))}),t.addEventListener(`mouseleave`,()=>{this.state.isRightPanelCollapsed&&(t.classList.add(`panel-collapsing`),t.classList.remove(`panel-hover-expanded`),setTimeout(()=>{this.state.isRightPanelCollapsed&&!t.classList.contains(`panel-hover-expanded`)&&(t.classList.remove(`panel-collapsing`),t.classList.add(`panel-collapsed`))},300))}))}},zl=class extends i{companyContext;configContext;serviceContext;resultContext;modalContext;chatContext;metagoraContext;visualConfigContext;contextHandler;layoutHandler;panelHandler;currentMode=`search`;constructor(){super(`agora-app`,[a,o,s,c,l,u,d,f,p,m].join(`
`)),this.companyContext=this.useContext(g.COMPANY),this.configContext=this.useContext(g.CONFIG),this.serviceContext=this.useContext(g.SERVICE),this.resultContext=this.useContext(g.RESULT),this.modalContext=this.useContext(g.MODAL),this.chatContext=this.useContext(g.CHAT),this.metagoraContext=this.useContext(g.METAGORA),this.visualConfigContext=this.useContext(g.VISUAL_CONFIG),this.signals=this.useSignals(),this.initializeHandlers(),this.init()}template(){let e=this.companyContext.get(`primaryColor`)||`#000`,t=this.visualConfigContext.get(`agora_name_visible`),n=this.getAttribute(`label-service`)||``,r=this.getAttribute(`label-read-more`)||``,i=this.getAttribute(`label-search`)||``,a=this.getAttribute(`label-assistant`)||``,o=this.getAttribute(`label-view-details`)||``,s=this.getAttribute(`label-source`)||``,c=this.getAttribute(`label-details`)||``;return this.html`
            <!-- This was an intro animation screen that we decided to remove -->
            ${!this.serviceContext.get(`services`)||this.serviceContext.get(`services`).length===0?this.html`<!-- <plain-intro-animation></plain-intro-animation> -->`:``}
            <header class="mobile-header">
                ${t?this.html`<plain-logo></plain-logo>`:``}
                <button 
                    class="hamburger-btn" 
                    title="Open menu"
                    style="border-color: ${e};color: ${e};"
                >
                    Services
                </button>
            </header>
            <div class="drawer-backdrop"></div>
            <div class="nav-hover-zone"></div>
            <aside class="left-panel">
                <header class="left-panel--header">
                    <button class="drawer-close-btn" title="Close menu">
                        ${le}
                    </button>
                    <button class="nav-collapse-btn" title="Toggle sidebar">
                        ${de}
                    </button>
                    ${t?this.html`<plain-logo></plain-logo>`:``}
                </header>
                <nav class="left-panel--nav">
                    ${this.configContext.get(`IS_METAGORA`)?this.html`<plain-metagora-nav-menu></plain-metagora-nav-menu>`:this.html`<plain-nav-menu></plain-nav-menu>`}
                </nav>
                <footer class="left-panel--footer">
                    <plain-carousel
                        variant="small"
                        class="faded-out"
                        ${n?`label-service="${n}"`:``}
                        ${r?`label-read-more="${r}"`:``}
                    ></plain-carousel>
                </footer>
            </aside>

            <main class="main-panel">
                <header class="main-panel--header" style="${this.configContext.get(`IS_METAGORA`)?`display: none !important;`:``}">
                    <plain-greetings></plain-greetings>
                </header>
                <section class="main-panel--content">
                    <div class="content-split">
                        <div class="content-left">
                            <plain-chat-window class="faded-out"></plain-chat-window>
                        </div>
                        <div class="content-right">
                            ${this.configContext.get(`IS_METAGORA`)?this.html`<plain-metagora-hero class="faded-in"></plain-metagora-hero>`:this.html`<plain-carousel class="faded-in" ${n?`label-service="${n}"`:``} ${r?`label-read-more="${r}"`:``}></plain-carousel>`}
                            <plain-artifact-display class="faded-out"></plain-artifact-display>
                        </div>
                    </div>
                </section>
                <footer class="main-panel--footer">
                    <plain-agora-input
                        ${i?`label-search="${i}"`:``}
                        ${a?`label-assistant="${a}"`:``}
                    ></plain-agora-input>
                </footer>
            </main>

            <aside class="right-panel collapsed">
                <header class="right-panel--header">
                    <button class="right-panel-close-btn" title="Close filters">
                        ${le}
                    </button>
                    <button class="right-panel-collapse-btn" title="Toggle filter panel">
                        ${fe}
                    </button>
                </header>
                <div class="right-panel--content">
                    <plain-filter-widget></plain-filter-widget>
                </div>
            </aside>
            <div class="right-panel-hover-zone"></div>
            <button class="filter-fab" title="Open filters">
                ${`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
`}
                Filters
            </button>
            <plain-detail-modal
                ${o?`label-view-details="${o}"`:``}
                ${s?`label-source="${s}"`:``}
                ${c?`label-details="${c}"`:``}
            ></plain-detail-modal>
            <toast-container></toast-container>
        `}initializeHandlers(){this.contextHandler=new Il({configContext:this.configContext,companyContext:this.companyContext,serviceContext:this.serviceContext,modalContext:this.modalContext,metagoraContext:this.metagoraContext,visualConfigContext:this.visualConfigContext,getAttribute:e=>this.getAttribute(e),hasAttribute:e=>this.hasAttribute(e)}),this.layoutHandler=new Ll({resultContext:this.resultContext,chatContext:this.chatContext,$:e=>this.$(e)},{getCurrentMode:()=>this.currentMode,setCurrentMode:e=>{this.currentMode=e},getPanelHandler:()=>this.panelHandler}),this.panelHandler=new Rl({resultContext:this.resultContext,$:e=>this.$(e)})}async init(){await this.contextHandler.initializeAll()}afterRender(){let e=this.configContext.get(`MAX_HEIGHT`),t=this.visualConfigContext.get(`background_image`),n=this.visualConfigContext.get(`title_font`),r=this.visualConfigContext.get(`body_font`),i=typeof t==`string`&&t.trim().length>0,a=this.shadowRoot?.querySelector(`.agora-app-wrapper`);a&&(e&&(a.style.maxHeight=e),a.style.setProperty(`--agora-font-title`,Pl(n,`Sora`)),a.style.setProperty(`--agora-font-body`,Pl(r,`Geist`)),i?(a.classList.add(`agora-app-wrapper--with-background`),a.style.setProperty(`--agora-wrapper-bg-image`,`url('${encodeURI(t.trim())}')`)):(a.classList.remove(`agora-app-wrapper--with-background`),a.style.removeProperty(`--agora-wrapper-bg-image`)))}connectors(){this.setupSignalConnections(),this.panelHandler.setupEventListeners(),this.layoutHandler.initializeLayout()}setupSignalConnections(){let e=this.$(`plain-agora-input`),t=this.$(`plain-chat-window`),n=this.$(`plain-filter-widget`);n&&this.signals.connect(n,w.FILTERS_AVAILABILITY_CHANGED,()=>this.layoutHandler.refreshFilterAvailability()),t&&(this.signals.connect(t,w.CHAT_EXPAND_TOGGLED,e=>this.layoutHandler.setChatExpanded(e)),this.signals.connect(t,w.CHAT_RETRY_REQUESTED,t=>{t?.message&&e&&e.retryChat(t.message)})),e&&(this.signals.connect(e,w.RESULTS_FETCHED,e=>this.layoutHandler.updateVisibility(e)),this.signals.connect(e,w.RESULTS_CLEARED,()=>this.layoutHandler.updateVisibility(null))),t&&(this.signals.connect(e,w.CHAT_USER_MESSAGE,()=>{t.handleUserMessage()}),this.signals.connect(e,w.CHAT_MESSAGE_CHUNK,e=>{t.handleMessageChunk(e)}),this.signals.connect(e,w.CHAT_REASONING_CHUNK,e=>{t.handleReasoningChunk(e)}),this.signals.connect(e,w.CHAT_MESSAGE_COMPLETE,()=>{t.handleMessageComplete()}),this.signals.connect(e,w.CHAT_FETCHING_RESULTS,e=>{t.handleFetchingResults(e)}),this.signals.connect(e,w.CHAT_STARTED,()=>{this.layoutHandler.showChatWindow()}),this.signals.connect(e,w.NEW_CHAT,()=>{this.layoutHandler.resetToInitialState(),t.render()}),this.signals.connect(e,w.MODE_SWITCH,e=>{this.layoutHandler.handleModeSwitch(e),Pe({source:`mode-switch-${e}`,debounceMs:320})}))}};window.customElements.define(`${v.IS_METAGORA?`metagora`:`agora`}-app-v2`,zl);