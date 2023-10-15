import { r as reactExports } from './__federation_shared_react-2436d585.js';
import { r as reactDomExports } from './__federation_shared_react-dom-6fc2ee8d.js';

const scriptRel = (function detectScriptRel() {
    const relList = typeof document !== 'undefined' && document.createElement('link').relList;
    return relList && relList.supports && relList.supports('modulepreload')
        ? 'modulepreload'
        : 'preload';
})();const assetsURL = function(dep) { return "/"+dep };const seen = {};const __vitePreload = function preload(baseModule, deps, importerUrl) {
    // @ts-expect-error true will be replaced with boolean later
    if (!true || !deps || deps.length === 0) {
        return baseModule();
    }
    const links = document.getElementsByTagName('link');
    return Promise.all(deps.map((dep) => {
        // @ts-expect-error assetsURL is declared before preload.toString()
        dep = assetsURL(dep);
        if (dep in seen)
            return;
        seen[dep] = true;
        const isCss = dep.endsWith('.css');
        const cssSelector = isCss ? '[rel="stylesheet"]' : '';
        const isBaseRelative = !!importerUrl;
        // check if the file is already preloaded by SSR markup
        if (isBaseRelative) {
            // When isBaseRelative is true then we have `importerUrl` and `dep` is
            // already converted to an absolute URL by the `assetsURL` function
            for (let i = links.length - 1; i >= 0; i--) {
                const link = links[i];
                // The `links[i].href` is an absolute URL thanks to browser doing the work
                // for us. See https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes:idl-domstring-5
                if (link.href === dep && (!isCss || link.rel === 'stylesheet')) {
                    return;
                }
            }
        }
        else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
            return;
        }
        const link = document.createElement('link');
        link.rel = isCss ? 'stylesheet' : scriptRel;
        if (!isCss) {
            link.as = 'script';
            link.crossOrigin = '';
        }
        link.href = dep;
        document.head.appendChild(link);
        if (isCss) {
            return new Promise((res, rej) => {
                link.addEventListener('load', res);
                link.addEventListener('error', () => rej(new Error(`Unable to preload CSS for ${dep}`)));
            });
        }
    }))
        .then(() => baseModule())
        .catch((err) => {
        const e = new Event('vite:preloadError', { cancelable: true });
        // @ts-expect-error custom payload
        e.payload = err;
        window.dispatchEvent(e);
        if (!e.defaultPrevented) {
            throw err;
        }
    });
};

const buildIdentifier = "[0-9A-Za-z-]+";
const build = `(?:\\+(${buildIdentifier}(?:\\.${buildIdentifier})*))`;
const numericIdentifier = "0|[1-9]\\d*";
const numericIdentifierLoose = "[0-9]+";
const nonNumericIdentifier = "\\d*[a-zA-Z-][a-zA-Z0-9-]*";
const preReleaseIdentifierLoose = `(?:${numericIdentifierLoose}|${nonNumericIdentifier})`;
const preReleaseLoose = `(?:-?(${preReleaseIdentifierLoose}(?:\\.${preReleaseIdentifierLoose})*))`;
const preReleaseIdentifier = `(?:${numericIdentifier}|${nonNumericIdentifier})`;
const preRelease = `(?:-(${preReleaseIdentifier}(?:\\.${preReleaseIdentifier})*))`;
const xRangeIdentifier = `${numericIdentifier}|x|X|\\*`;
const xRangePlain = `[v=\\s]*(${xRangeIdentifier})(?:\\.(${xRangeIdentifier})(?:\\.(${xRangeIdentifier})(?:${preRelease})?${build}?)?)?`;
const hyphenRange = `^\\s*(${xRangePlain})\\s+-\\s+(${xRangePlain})\\s*$`;
const mainVersionLoose = `(${numericIdentifierLoose})\\.(${numericIdentifierLoose})\\.(${numericIdentifierLoose})`;
const loosePlain = `[v=\\s]*${mainVersionLoose}${preReleaseLoose}?${build}?`;
const gtlt = "((?:<|>)?=?)";
const comparatorTrim = `(\\s*)${gtlt}\\s*(${loosePlain}|${xRangePlain})`;
const loneTilde = "(?:~>?)";
const tildeTrim = `(\\s*)${loneTilde}\\s+`;
const loneCaret = "(?:\\^)";
const caretTrim = `(\\s*)${loneCaret}\\s+`;
const star = "(<|>)?=?\\s*\\*";
const caret = `^${loneCaret}${xRangePlain}$`;
const mainVersion = `(${numericIdentifier})\\.(${numericIdentifier})\\.(${numericIdentifier})`;
const fullPlain = `v?${mainVersion}${preRelease}?${build}?`;
const tilde = `^${loneTilde}${xRangePlain}$`;
const xRange = `^${gtlt}\\s*${xRangePlain}$`;
const comparator = `^${gtlt}\\s*(${fullPlain})$|^$`;
const gte0 = "^\\s*>=\\s*0.0.0\\s*$";
function parseRegex(source) {
  return new RegExp(source);
}
function isXVersion(version) {
  return !version || version.toLowerCase() === "x" || version === "*";
}
function pipe(...fns) {
  return (x) => {
    return fns.reduce((v, f) => f(v), x);
  };
}
function extractComparator(comparatorString) {
  return comparatorString.match(parseRegex(comparator));
}
function combineVersion(major, minor, patch, preRelease2) {
  const mainVersion2 = `${major}.${minor}.${patch}`;
  if (preRelease2) {
    return `${mainVersion2}-${preRelease2}`;
  }
  return mainVersion2;
}
function parseHyphen(range) {
  return range.replace(
    parseRegex(hyphenRange),
    (_range, from, fromMajor, fromMinor, fromPatch, _fromPreRelease, _fromBuild, to, toMajor, toMinor, toPatch, toPreRelease) => {
      if (isXVersion(fromMajor)) {
        from = "";
      } else if (isXVersion(fromMinor)) {
        from = `>=${fromMajor}.0.0`;
      } else if (isXVersion(fromPatch)) {
        from = `>=${fromMajor}.${fromMinor}.0`;
      } else {
        from = `>=${from}`;
      }
      if (isXVersion(toMajor)) {
        to = "";
      } else if (isXVersion(toMinor)) {
        to = `<${+toMajor + 1}.0.0-0`;
      } else if (isXVersion(toPatch)) {
        to = `<${toMajor}.${+toMinor + 1}.0-0`;
      } else if (toPreRelease) {
        to = `<=${toMajor}.${toMinor}.${toPatch}-${toPreRelease}`;
      } else {
        to = `<=${to}`;
      }
      return `${from} ${to}`.trim();
    }
  );
}
function parseComparatorTrim(range) {
  return range.replace(parseRegex(comparatorTrim), "$1$2$3");
}
function parseTildeTrim(range) {
  return range.replace(parseRegex(tildeTrim), "$1~");
}
function parseCaretTrim(range) {
  return range.replace(parseRegex(caretTrim), "$1^");
}
function parseCarets(range) {
  return range.trim().split(/\s+/).map((rangeVersion) => {
    return rangeVersion.replace(
      parseRegex(caret),
      (_, major, minor, patch, preRelease2) => {
        if (isXVersion(major)) {
          return "";
        } else if (isXVersion(minor)) {
          return `>=${major}.0.0 <${+major + 1}.0.0-0`;
        } else if (isXVersion(patch)) {
          if (major === "0") {
            return `>=${major}.${minor}.0 <${major}.${+minor + 1}.0-0`;
          } else {
            return `>=${major}.${minor}.0 <${+major + 1}.0.0-0`;
          }
        } else if (preRelease2) {
          if (major === "0") {
            if (minor === "0") {
              return `>=${major}.${minor}.${patch}-${preRelease2} <${major}.${minor}.${+patch + 1}-0`;
            } else {
              return `>=${major}.${minor}.${patch}-${preRelease2} <${major}.${+minor + 1}.0-0`;
            }
          } else {
            return `>=${major}.${minor}.${patch}-${preRelease2} <${+major + 1}.0.0-0`;
          }
        } else {
          if (major === "0") {
            if (minor === "0") {
              return `>=${major}.${minor}.${patch} <${major}.${minor}.${+patch + 1}-0`;
            } else {
              return `>=${major}.${minor}.${patch} <${major}.${+minor + 1}.0-0`;
            }
          }
          return `>=${major}.${minor}.${patch} <${+major + 1}.0.0-0`;
        }
      }
    );
  }).join(" ");
}
function parseTildes(range) {
  return range.trim().split(/\s+/).map((rangeVersion) => {
    return rangeVersion.replace(
      parseRegex(tilde),
      (_, major, minor, patch, preRelease2) => {
        if (isXVersion(major)) {
          return "";
        } else if (isXVersion(minor)) {
          return `>=${major}.0.0 <${+major + 1}.0.0-0`;
        } else if (isXVersion(patch)) {
          return `>=${major}.${minor}.0 <${major}.${+minor + 1}.0-0`;
        } else if (preRelease2) {
          return `>=${major}.${minor}.${patch}-${preRelease2} <${major}.${+minor + 1}.0-0`;
        }
        return `>=${major}.${minor}.${patch} <${major}.${+minor + 1}.0-0`;
      }
    );
  }).join(" ");
}
function parseXRanges(range) {
  return range.split(/\s+/).map((rangeVersion) => {
    return rangeVersion.trim().replace(
      parseRegex(xRange),
      (ret, gtlt2, major, minor, patch, preRelease2) => {
        const isXMajor = isXVersion(major);
        const isXMinor = isXMajor || isXVersion(minor);
        const isXPatch = isXMinor || isXVersion(patch);
        if (gtlt2 === "=" && isXPatch) {
          gtlt2 = "";
        }
        preRelease2 = "";
        if (isXMajor) {
          if (gtlt2 === ">" || gtlt2 === "<") {
            return "<0.0.0-0";
          } else {
            return "*";
          }
        } else if (gtlt2 && isXPatch) {
          if (isXMinor) {
            minor = 0;
          }
          patch = 0;
          if (gtlt2 === ">") {
            gtlt2 = ">=";
            if (isXMinor) {
              major = +major + 1;
              minor = 0;
              patch = 0;
            } else {
              minor = +minor + 1;
              patch = 0;
            }
          } else if (gtlt2 === "<=") {
            gtlt2 = "<";
            if (isXMinor) {
              major = +major + 1;
            } else {
              minor = +minor + 1;
            }
          }
          if (gtlt2 === "<") {
            preRelease2 = "-0";
          }
          return `${gtlt2 + major}.${minor}.${patch}${preRelease2}`;
        } else if (isXMinor) {
          return `>=${major}.0.0${preRelease2} <${+major + 1}.0.0-0`;
        } else if (isXPatch) {
          return `>=${major}.${minor}.0${preRelease2} <${major}.${+minor + 1}.0-0`;
        }
        return ret;
      }
    );
  }).join(" ");
}
function parseStar(range) {
  return range.trim().replace(parseRegex(star), "");
}
function parseGTE0(comparatorString) {
  return comparatorString.trim().replace(parseRegex(gte0), "");
}
function compareAtom(rangeAtom, versionAtom) {
  rangeAtom = +rangeAtom || rangeAtom;
  versionAtom = +versionAtom || versionAtom;
  if (rangeAtom > versionAtom) {
    return 1;
  }
  if (rangeAtom === versionAtom) {
    return 0;
  }
  return -1;
}
function comparePreRelease(rangeAtom, versionAtom) {
  const { preRelease: rangePreRelease } = rangeAtom;
  const { preRelease: versionPreRelease } = versionAtom;
  if (rangePreRelease === void 0 && !!versionPreRelease) {
    return 1;
  }
  if (!!rangePreRelease && versionPreRelease === void 0) {
    return -1;
  }
  if (rangePreRelease === void 0 && versionPreRelease === void 0) {
    return 0;
  }
  for (let i = 0, n = rangePreRelease.length; i <= n; i++) {
    const rangeElement = rangePreRelease[i];
    const versionElement = versionPreRelease[i];
    if (rangeElement === versionElement) {
      continue;
    }
    if (rangeElement === void 0 && versionElement === void 0) {
      return 0;
    }
    if (!rangeElement) {
      return 1;
    }
    if (!versionElement) {
      return -1;
    }
    return compareAtom(rangeElement, versionElement);
  }
  return 0;
}
function compareVersion(rangeAtom, versionAtom) {
  return compareAtom(rangeAtom.major, versionAtom.major) || compareAtom(rangeAtom.minor, versionAtom.minor) || compareAtom(rangeAtom.patch, versionAtom.patch) || comparePreRelease(rangeAtom, versionAtom);
}
function eq(rangeAtom, versionAtom) {
  return rangeAtom.version === versionAtom.version;
}
function compare(rangeAtom, versionAtom) {
  switch (rangeAtom.operator) {
    case "":
    case "=":
      return eq(rangeAtom, versionAtom);
    case ">":
      return compareVersion(rangeAtom, versionAtom) < 0;
    case ">=":
      return eq(rangeAtom, versionAtom) || compareVersion(rangeAtom, versionAtom) < 0;
    case "<":
      return compareVersion(rangeAtom, versionAtom) > 0;
    case "<=":
      return eq(rangeAtom, versionAtom) || compareVersion(rangeAtom, versionAtom) > 0;
    case void 0: {
      return true;
    }
    default:
      return false;
  }
}
function parseComparatorString(range) {
  return pipe(
    parseCarets,
    parseTildes,
    parseXRanges,
    parseStar
  )(range);
}
function parseRange(range) {
  return pipe(
    parseHyphen,
    parseComparatorTrim,
    parseTildeTrim,
    parseCaretTrim
  )(range.trim()).split(/\s+/).join(" ");
}
function satisfy(version, range) {
  if (!version) {
    return false;
  }
  const parsedRange = parseRange(range);
  const parsedComparator = parsedRange.split(" ").map((rangeVersion) => parseComparatorString(rangeVersion)).join(" ");
  const comparators = parsedComparator.split(/\s+/).map((comparator2) => parseGTE0(comparator2));
  const extractedVersion = extractComparator(version);
  if (!extractedVersion) {
    return false;
  }
  const [
    ,
    versionOperator,
    ,
    versionMajor,
    versionMinor,
    versionPatch,
    versionPreRelease
  ] = extractedVersion;
  const versionAtom = {
    operator: versionOperator,
    version: combineVersion(
      versionMajor,
      versionMinor,
      versionPatch,
      versionPreRelease
    ),
    major: versionMajor,
    minor: versionMinor,
    patch: versionPatch,
    preRelease: versionPreRelease == null ? void 0 : versionPreRelease.split(".")
  };
  for (const comparator2 of comparators) {
    const extractedComparator = extractComparator(comparator2);
    if (!extractedComparator) {
      return false;
    }
    const [
      ,
      rangeOperator,
      ,
      rangeMajor,
      rangeMinor,
      rangePatch,
      rangePreRelease
    ] = extractedComparator;
    const rangeAtom = {
      operator: rangeOperator,
      version: combineVersion(
        rangeMajor,
        rangeMinor,
        rangePatch,
        rangePreRelease
      ),
      major: rangeMajor,
      minor: rangeMinor,
      patch: rangePatch,
      preRelease: rangePreRelease == null ? void 0 : rangePreRelease.split(".")
    };
    if (!compare(rangeAtom, versionAtom)) {
      return false;
    }
  }
  return true;
}

// eslint-disable-next-line no-undef
const moduleMap = {'react':{get:()=>()=>__federation_import$1(new URL('__federation_shared_react-2436d585.js', import.meta.url).href),import:true},'react-dom':{get:()=>()=>__federation_import$1(new URL('__federation_shared_react-dom-6fc2ee8d.js', import.meta.url).href),import:true}};
const moduleCache = Object.create(null);
async function importShared(name, shareScope = 'default') {
  return moduleCache[name]
    ? new Promise((r) => r(moduleCache[name]))
    : (await getSharedFromRuntime(name, shareScope)) || getSharedFromLocal(name)
}
// eslint-disable-next-line
async function __federation_import$1(name) {
  return __vitePreload(() => import(name),true?[]:void 0)
}
async function getSharedFromRuntime(name, shareScope) {
  let module = null;
  if (globalThis?.__federation_shared__?.[shareScope]?.[name]) {
    const versionObj = globalThis.__federation_shared__[shareScope][name];
    const versionKey = Object.keys(versionObj)[0];
    const versionValue = Object.values(versionObj)[0];
    if (moduleMap[name]?.requiredVersion) {
      // judge version satisfy
      if (satisfy(versionKey, moduleMap[name].requiredVersion)) {
        module = await (await versionValue.get())();
      } else {
        console.log(
          `provider support ${name}(${versionKey}) is not satisfied requiredVersion(\${moduleMap[name].requiredVersion})`
        );
      }
    } else {
      module = await (await versionValue.get())();
    }
  }
  if (module) {
    return flattenModule(module, name)
  }
}
async function getSharedFromLocal(name) {
  if (moduleMap[name]?.import) {
    let module = await (await moduleMap[name].get())();
    return flattenModule(module, name)
  } else {
    console.error(
      `consumer config import=false,so cant use callback shared module`
    );
  }
}
function flattenModule(module, name) {
  if (module.default) module = Object.assign({}, module.default, module);
  moduleCache[name] = module;
  return module
}

var jsxRuntime = {exports: {}};

var reactJsxRuntime_production_min = {};

/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f$8=reactExports,k=Symbol.for("react.element"),l$9=Symbol.for("react.fragment"),m$9=Object.prototype.hasOwnProperty,n$5=f$8.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p$5={key:!0,ref:!0,__self:!0,__source:!0};
function q(c,a,g){var b,d={},e=null,h=null;void 0!==g&&(e=""+g);void 0!==a.key&&(e=""+a.key);void 0!==a.ref&&(h=a.ref);for(b in a)m$9.call(a,b)&&!p$5.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a)void 0===d[b]&&(d[b]=a[b]);return {$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n$5.current}}reactJsxRuntime_production_min.Fragment=l$9;reactJsxRuntime_production_min.jsx=q;reactJsxRuntime_production_min.jsxs=q;

{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}

var jsxRuntimeExports = jsxRuntime.exports;

const Fragment = jsxRuntimeExports.Fragment;
const jsx = jsxRuntimeExports.jsx;
const jsxs = jsxRuntimeExports.jsxs;

var client = {};

var m$8 = reactDomExports;
{
  client.createRoot = m$8.createRoot;
  client.hydrateRoot = m$8.hydrateRoot;
}

var i$3=Object.defineProperty;var d$9=(t,e,n)=>e in t?i$3(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var r$5=(t,e,n)=>(d$9(t,typeof e!="symbol"?e+"":e,n),n);let o$5 = class o{constructor(){r$5(this,"current",this.detect());r$5(this,"handoffState","pending");r$5(this,"currentId",0);}set(e){this.current!==e&&(this.handoffState="pending",this.currentId=0,this.current=e);}reset(){this.set(this.detect());}nextId(){return ++this.currentId}get isServer(){return this.current==="server"}get isClient(){return this.current==="client"}detect(){return typeof window=="undefined"||typeof document=="undefined"?"server":"client"}handoff(){this.handoffState==="pending"&&(this.handoffState="complete");}get isHandoffComplete(){return this.handoffState==="complete"}};let s$b=new o$5;

const {useLayoutEffect:t$d,useEffect:c$a} = await importShared('react');
let l$8=(e,f)=>{s$b.isServer?c$a(e,f):t$d(e,f);};

const {useRef:t$c} = await importShared('react');
function s$a(e){let r=t$c(e);return l$8(()=>{r.current=e;},[e]),r}

function t$b(e){typeof queueMicrotask=="function"?queueMicrotask(e):Promise.resolve().then(e).catch(o=>setTimeout(()=>{throw o}));}

function o$4(){let n=[],r={addEventListener(e,t,s,a){return e.addEventListener(t,s,a),r.add(()=>e.removeEventListener(t,s,a))},requestAnimationFrame(...e){let t=requestAnimationFrame(...e);return r.add(()=>cancelAnimationFrame(t))},nextFrame(...e){return r.requestAnimationFrame(()=>r.requestAnimationFrame(...e))},setTimeout(...e){let t=setTimeout(...e);return r.add(()=>clearTimeout(t))},microTask(...e){let t={current:!0};return t$b(()=>{t.current&&e[0]();}),r.add(()=>{t.current=!1;})},style(e,t,s){let a=e.style.getPropertyValue(t);return Object.assign(e.style,{[t]:s}),this.add(()=>{Object.assign(e.style,{[t]:a});})},group(e){let t=o$4();return e(t),this.add(()=>t.dispose())},add(e){return n.push(e),()=>{let t=n.indexOf(e);if(t>=0)for(let s of n.splice(t,1))s();}},dispose(){for(let e of n.splice(0))e();}};return r}

const {useState:s$9,useEffect:o$3} = await importShared('react');
function p$4(){let[e]=s$9(o$4);return o$3(()=>()=>e.dispose(),[e]),e}

const a$7 = await importShared('react');
let o$2=function(t){let e=s$a(t);return a$7.useCallback((...r)=>e.current(...r),[e])};

const t$a = await importShared('react');
function s$8(){let r=typeof document=="undefined";return "useSyncExternalStore"in t$a?(o=>o.useSyncExternalStore)(t$a)(()=>()=>{},()=>!1,()=>!r):!1}function l$7(){let r=s$8(),[e,n]=t$a.useState(s$b.isHandoffComplete);return e&&s$b.isHandoffComplete===!1&&n(!1),t$a.useEffect(()=>{e!==!0&&n(!0);},[e]),t$a.useEffect(()=>s$b.handoff(),[]),r?!1:e}

var o$1;const t$9 = await importShared('react');
let I$3=(o$1=t$9.useId)!=null?o$1:function(){let n=l$7(),[e,u]=t$9.useState(n?()=>s$b.nextId():null);return l$8(()=>{e===null&&u(s$b.nextId());},[e]),e!=null?""+e:void 0};

function u$6(r,n,...a){if(r in n){let e=n[r];return typeof e=="function"?e(...a):e}let t=new Error(`Tried to handle "${r}" but there is no handler defined. Only defined handlers are: ${Object.keys(n).map(e=>`"${e}"`).join(", ")}.`);throw Error.captureStackTrace&&Error.captureStackTrace(t,u$6),t}

function e$2(r){return s$b.isServer?null:r instanceof Node?r.ownerDocument:r!=null&&r.hasOwnProperty("current")&&r.current instanceof Node?r.current.ownerDocument:document}

let c$9=["[contentEditable=true]","[tabindex]","a[href]","area[href]","button:not([disabled])","iframe","input:not([disabled])","select:not([disabled])","textarea:not([disabled])"].map(e=>`${e}:not([tabindex='-1'])`).join(",");var M$4=(n=>(n[n.First=1]="First",n[n.Previous=2]="Previous",n[n.Next=4]="Next",n[n.Last=8]="Last",n[n.WrapAround=16]="WrapAround",n[n.NoScroll=32]="NoScroll",n))(M$4||{}),N$2=(o=>(o[o.Error=0]="Error",o[o.Overflow=1]="Overflow",o[o.Success=2]="Success",o[o.Underflow=3]="Underflow",o))(N$2||{}),F$2=(t=>(t[t.Previous=-1]="Previous",t[t.Next=1]="Next",t))(F$2||{});function f$7(e=document.body){return e==null?[]:Array.from(e.querySelectorAll(c$9)).sort((r,t)=>Math.sign((r.tabIndex||Number.MAX_SAFE_INTEGER)-(t.tabIndex||Number.MAX_SAFE_INTEGER)))}var T$5=(t=>(t[t.Strict=0]="Strict",t[t.Loose=1]="Loose",t))(T$5||{});function h$6(e,r=0){var t;return e===((t=e$2(e))==null?void 0:t.body)?!1:u$6(r,{[0](){return e.matches(c$9)},[1](){let l=e;for(;l!==null;){if(l.matches(c$9))return !0;l=l.parentElement;}return !1}})}var w$2=(t=>(t[t.Keyboard=0]="Keyboard",t[t.Mouse=1]="Mouse",t))(w$2||{});typeof window!="undefined"&&typeof document!="undefined"&&(document.addEventListener("keydown",e=>{e.metaKey||e.altKey||e.ctrlKey||(document.documentElement.dataset.headlessuiFocusVisible="");},!0),document.addEventListener("click",e=>{e.detail===1?delete document.documentElement.dataset.headlessuiFocusVisible:e.detail===0&&(document.documentElement.dataset.headlessuiFocusVisible="");},!0));function y$4(e){e==null||e.focus({preventScroll:!0});}let S$6=["textarea","input"].join(",");function H$1(e){var r,t;return (t=(r=e==null?void 0:e.matches)==null?void 0:r.call(e,S$6))!=null?t:!1}function I$2(e,r=t=>t){return e.slice().sort((t,l)=>{let o=r(t),i=r(l);if(o===null||i===null)return 0;let n=o.compareDocumentPosition(i);return n&Node.DOCUMENT_POSITION_FOLLOWING?-1:n&Node.DOCUMENT_POSITION_PRECEDING?1:0})}function O(e,r,{sorted:t=!0,relativeTo:l=null,skipElements:o=[]}={}){let i=Array.isArray(e)?e.length>0?e[0].ownerDocument:document:e.ownerDocument,n=Array.isArray(e)?t?I$2(e):e:f$7(e);o.length>0&&n.length>1&&(n=n.filter(s=>!o.includes(s))),l=l!=null?l:i.activeElement;let E=(()=>{if(r&5)return 1;if(r&10)return -1;throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last")})(),x=(()=>{if(r&1)return 0;if(r&2)return Math.max(0,n.indexOf(l))-1;if(r&4)return Math.max(0,n.indexOf(l))+1;if(r&8)return n.length-1;throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last")})(),p=r&32?{preventScroll:!0}:{},d=0,a=n.length,u;do{if(d>=a||d+a<=0)return 0;let s=x+d;if(r&16)s=(s+a)%a;else {if(s<0)return 3;if(s>=a)return 1}u=n[s],u==null||u.focus(p),d+=E;}while(u!==i.activeElement);return r&6&&H$1(u)&&u.select(),2}

const {useEffect:m$7} = await importShared('react');
function d$8(e,r,n){let o=s$a(r);m$7(()=>{function t(u){o.current(u);}return document.addEventListener(e,t,n),()=>document.removeEventListener(e,t,n)},[e,n]);}

const {useEffect:d$7} = await importShared('react');
function s$7(e,r,n){let o=s$a(r);d$7(()=>{function t(i){o.current(i);}return window.addEventListener(e,t,n),()=>window.removeEventListener(e,t,n)},[e,n]);}

const {useEffect:d$6,useRef:f$6} = await importShared('react');
function h$5(s,m,a=!0){let i=f$6(!1);d$6(()=>{requestAnimationFrame(()=>{i.current=a;});},[a]);function c(e,r){if(!i.current||e.defaultPrevented)return;let t=r(e);if(t===null||!t.getRootNode().contains(t)||!t.isConnected)return;let E=function u(n){return typeof n=="function"?u(n()):Array.isArray(n)||n instanceof Set?n:[n]}(s);for(let u of E){if(u===null)continue;let n=u instanceof HTMLElement?u:u.current;if(n!=null&&n.contains(t)||e.composed&&e.composedPath().includes(n))return}return !h$6(t,T$5.Loose)&&t.tabIndex!==-1&&e.preventDefault(),m(e,t)}let o=f$6(null);d$8("pointerdown",e=>{var r,t;i.current&&(o.current=((t=(r=e.composedPath)==null?void 0:r.call(e))==null?void 0:t[0])||e.target);},!0),d$8("mousedown",e=>{var r,t;i.current&&(o.current=((t=(r=e.composedPath)==null?void 0:r.call(e))==null?void 0:t[0])||e.target);},!0),d$8("click",e=>{o.current&&(c(e,()=>o.current),o.current=null);},!0),d$8("touchend",e=>c(e,()=>e.target instanceof HTMLElement?e.target:null),!0),s$7("blur",e=>c(e,()=>window.document.activeElement instanceof HTMLIFrameElement?window.document.activeElement:null),!0);}

const {useRef:l$6,useEffect:i$2} = await importShared('react');
let u$5=Symbol();function T$4(t,n=!0){return Object.assign(t,{[u$5]:n})}function y$3(...t){let n=l$6(t);i$2(()=>{n.current=t;},[t]);let c=o$2(e=>{for(let o of n.current)o!=null&&(typeof o=="function"?o(e):o.current=e);});return t.every(e=>e==null||(e==null?void 0:e[u$5]))?void 0:c}

function t$8(...r){return Array.from(new Set(r.flatMap(n=>typeof n=="string"?n.split(" "):[]))).filter(Boolean).join(" ")}

const {Fragment:T$3,cloneElement:x$1,createElement:E$4,forwardRef:b$3,isValidElement:h$4} = await importShared('react');
var S$5=(a=>(a[a.None=0]="None",a[a.RenderStrategy=1]="RenderStrategy",a[a.Static=2]="Static",a))(S$5||{}),j$3=(e=>(e[e.Unmount=0]="Unmount",e[e.Hidden=1]="Hidden",e))(j$3||{});function X$1({ourProps:r,theirProps:t,slot:e,defaultTag:a,features:s,visible:n=!0,name:f}){let o=N$1(t,r);if(n)return c$8(o,e,a,f);let u=s!=null?s:0;if(u&2){let{static:l=!1,...p}=o;if(l)return c$8(p,e,a,f)}if(u&1){let{unmount:l=!0,...p}=o;return u$6(l?0:1,{[0](){return null},[1](){return c$8({...p,hidden:!0,style:{display:"none"}},e,a,f)}})}return c$8(o,e,a,f)}function c$8(r,t={},e,a){let{as:s=e,children:n,refName:f="ref",...o}=g$2(r,["unmount","static"]),u=r.ref!==void 0?{[f]:r.ref}:{},l=typeof n=="function"?n(t):n;"className"in o&&o.className&&typeof o.className=="function"&&(o.className=o.className(t));let p={};if(t){let i=!1,m=[];for(let[y,d]of Object.entries(t))typeof d=="boolean"&&(i=!0),d===!0&&m.push(y);i&&(p["data-headlessui-state"]=m.join(" "));}if(s===T$3&&Object.keys(R$1(o)).length>0){if(!h$4(l)||Array.isArray(l)&&l.length>1)throw new Error(['Passing props on "Fragment"!',"",`The current component <${a} /> is rendering a "Fragment".`,"However we need to passthrough the following props:",Object.keys(o).map(d=>`  - ${d}`).join(`
`),"","You can apply a few solutions:",['Add an `as="..."` prop, to ensure that we render an actual element instead of a "Fragment".',"Render a single element as the child so that we can forward the props onto that element."].map(d=>`  - ${d}`).join(`
`)].join(`
`));let i=l.props,m=typeof(i==null?void 0:i.className)=="function"?(...d)=>t$8(i==null?void 0:i.className(...d),o.className):t$8(i==null?void 0:i.className,o.className),y=m?{className:m}:{};return x$1(l,Object.assign({},N$1(l.props,R$1(g$2(o,["ref"]))),p,u,w$1(l.ref,u.ref),y))}return E$4(s,Object.assign({},g$2(o,["ref"]),s!==T$3&&u,s!==T$3&&p),l)}function w$1(...r){return {ref:r.every(t=>t==null)?void 0:t=>{for(let e of r)e!=null&&(typeof e=="function"?e(t):e.current=t);}}}function N$1(...r){if(r.length===0)return {};if(r.length===1)return r[0];let t={},e={};for(let s of r)for(let n in s)n.startsWith("on")&&typeof s[n]=="function"?((e[n])!=null||(e[n]=[]),e[n].push(s[n])):t[n]=s[n];if(t.disabled||t["aria-disabled"])return Object.assign(t,Object.fromEntries(Object.keys(e).map(s=>[s,void 0])));for(let s in e)Object.assign(t,{[s](n,...f){let o=e[s];for(let u of o){if((n instanceof Event||(n==null?void 0:n.nativeEvent)instanceof Event)&&n.defaultPrevented)return;u(n,...f);}}});return t}function D$2(r){var t;return Object.assign(b$3(r),{displayName:(t=r.displayName)!=null?t:r.name})}function R$1(r){let t=Object.assign({},r);for(let e in t)t[e]===void 0&&delete t[e];return t}function g$2(r,t=[]){let e=Object.assign({},r);for(let a of t)a in e&&delete e[a];return e}

function r$4(n){let e=n.parentElement,l=null;for(;e&&!(e instanceof HTMLFieldSetElement);)e instanceof HTMLLegendElement&&(l=e),e=e.parentElement;let t=(e==null?void 0:e.getAttribute("disabled"))==="";return t&&i$1(l)?!1:t}function i$1(n){if(!n)return !1;let e=n.previousElementSibling;for(;e!==null;){if(e instanceof HTMLLegendElement)return !1;e=e.previousElementSibling;}return !0}

let a$6="div";var p$3=(e=>(e[e.None=1]="None",e[e.Focusable=2]="Focusable",e[e.Hidden=4]="Hidden",e))(p$3||{});function s$6(t,o){let{features:n=1,...e}=t,d={ref:o,"aria-hidden":(n&2)===2?!0:void 0,style:{position:"fixed",top:1,left:1,width:1,height:0,padding:0,margin:-1,overflow:"hidden",clip:"rect(0, 0, 0, 0)",whiteSpace:"nowrap",borderWidth:"0",...(n&4)===4&&(n&2)!==2&&{display:"none"}}};return X$1({ourProps:d,theirProps:e,slot:{},defaultTag:a$6,name:"Hidden"})}let c$7=D$2(s$6);

const l$5 = await importShared('react');
const {createContext:t$7,useContext:p$2} = l$5;
let n$4=t$7(null);n$4.displayName="OpenClosedContext";var d$5=(e=>(e[e.Open=1]="Open",e[e.Closed=2]="Closed",e[e.Closing=4]="Closing",e[e.Opening=8]="Opening",e))(d$5||{});function C$1(){return p$2(n$4)}function c$6({value:o,children:r}){return l$5.createElement(n$4.Provider,{value:o},r)}

var o=(r=>(r.Space=" ",r.Enter="Enter",r.Escape="Escape",r.Backspace="Backspace",r.Delete="Delete",r.ArrowLeft="ArrowLeft",r.ArrowUp="ArrowUp",r.ArrowRight="ArrowRight",r.ArrowDown="ArrowDown",r.Home="Home",r.End="End",r.PageUp="PageUp",r.PageDown="PageDown",r.Tab="Tab",r))(o||{});

const {useEffect:s$5,useRef:f$5} = await importShared('react');
function m$6(u,t){let e=f$5([]),r=o$2(u);s$5(()=>{let o=[...e.current];for(let[n,a]of t.entries())if(e.current[n]!==a){let l=r(t,o);return e.current=t,l}},[r,...t]);}

function t$6(){return /iPhone/gi.test(window.navigator.platform)||/Mac/gi.test(window.navigator.platform)&&window.navigator.maxTouchPoints>0}

const {useMemo:t$5} = await importShared('react');
function n$3(...e){return t$5(()=>e$2(...e),[...e])}

const {useRef:t$4} = await importShared('react');
var s$4=(r=>(r[r.Forwards=0]="Forwards",r[r.Backwards=1]="Backwards",r))(s$4||{});function n$2(){let e=t$4(0);return s$7("keydown",o=>{o.key==="Tab"&&(e.current=o.shiftKey?1:0);},!0),e}

const {useRef:r$3} = await importShared('react');
function f$4(){let e=r$3(!1);return l$8(()=>(e.current=!0,()=>{e.current=!1;}),[]),e}

const {useEffect:d$4} = await importShared('react');
function E$3(n,e,a,t){let i=s$a(a);d$4(()=>{n=n!=null?n:window;function r(o){i.current(o);}return n.addEventListener(e,r,t),()=>n.removeEventListener(e,r,t)},[n,e,t]);}

function t$3(n){function e(){document.readyState!=="loading"&&(n(),document.removeEventListener("DOMContentLoaded",e));}typeof window!="undefined"&&typeof document!="undefined"&&(document.addEventListener("DOMContentLoaded",e),e());}

const {useRef:u$4,useEffect:n$1} = await importShared('react');
function c$5(t){let r=o$2(t),e=u$4(!1);n$1(()=>(e.current=!1,()=>{e.current=!0,t$b(()=>{e.current&&r();});}),[r]);}

const E$2 = await importShared('react');
const {useRef:L} = E$2;
function P$2(t){if(!t)return new Set;if(typeof t=="function")return new Set(t());let r=new Set;for(let e of t.current)e.current instanceof HTMLElement&&r.add(e.current);return r}let J$1="div";var h$3=(n=>(n[n.None=1]="None",n[n.InitialFocus=2]="InitialFocus",n[n.TabLock=4]="TabLock",n[n.FocusLock=8]="FocusLock",n[n.RestoreFocus=16]="RestoreFocus",n[n.All=30]="All",n))(h$3||{});function X(t,r){let e=L(null),o=y$3(e,r),{initialFocus:u,containers:i,features:n=30,...l}=t;l$7()||(n=1);let m=n$3(e);Y$1({ownerDocument:m},Boolean(n&16));let c=Z$1({ownerDocument:m,container:e,initialFocus:u},Boolean(n&2));$$1({ownerDocument:m,container:e,containers:i,previousActiveElement:c},Boolean(n&8));let v=n$2(),y=o$2(s=>{let T=e.current;if(!T)return;(B=>B())(()=>{u$6(v.current,{[s$4.Forwards]:()=>{O(T,M$4.First,{skipElements:[s.relatedTarget]});},[s$4.Backwards]:()=>{O(T,M$4.Last,{skipElements:[s.relatedTarget]});}});});}),_=p$4(),b=L(!1),j={ref:o,onKeyDown(s){s.key=="Tab"&&(b.current=!0,_.requestAnimationFrame(()=>{b.current=!1;}));},onBlur(s){let T=P$2(i);e.current instanceof HTMLElement&&T.add(e.current);let d=s.relatedTarget;d instanceof HTMLElement&&d.dataset.headlessuiFocusGuard!=="true"&&(S$4(T,d)||(b.current?O(e.current,u$6(v.current,{[s$4.Forwards]:()=>M$4.Next,[s$4.Backwards]:()=>M$4.Previous})|M$4.WrapAround,{relativeTo:s.target}):s.target instanceof HTMLElement&&y$4(s.target)));}};return E$2.createElement(E$2.Fragment,null,Boolean(n&4)&&E$2.createElement(c$7,{as:"button",type:"button","data-headlessui-focus-guard":!0,onFocus:y,features:p$3.Focusable}),X$1({ourProps:j,theirProps:l,defaultTag:J$1,name:"FocusTrap"}),Boolean(n&4)&&E$2.createElement(c$7,{as:"button",type:"button","data-headlessui-focus-guard":!0,onFocus:y,features:p$3.Focusable}))}let z=D$2(X),ge=Object.assign(z,{features:h$3}),a$5=[];t$3(()=>{function t(r){r.target instanceof HTMLElement&&r.target!==document.body&&a$5[0]!==r.target&&(a$5.unshift(r.target),a$5=a$5.filter(e=>e!=null&&e.isConnected),a$5.splice(10));}window.addEventListener("click",t,{capture:!0}),window.addEventListener("mousedown",t,{capture:!0}),window.addEventListener("focus",t,{capture:!0}),document.body.addEventListener("click",t,{capture:!0}),document.body.addEventListener("mousedown",t,{capture:!0}),document.body.addEventListener("focus",t,{capture:!0});});function Q(t=!0){let r=L(a$5.slice());return m$6(([e],[o])=>{o===!0&&e===!1&&t$b(()=>{r.current.splice(0);}),o===!1&&e===!0&&(r.current=a$5.slice());},[t,a$5,r]),o$2(()=>{var e;return (e=r.current.find(o=>o!=null&&o.isConnected))!=null?e:null})}function Y$1({ownerDocument:t},r){let e=Q(r);m$6(()=>{r||(t==null?void 0:t.activeElement)===(t==null?void 0:t.body)&&y$4(e());},[r]),c$5(()=>{r&&y$4(e());});}function Z$1({ownerDocument:t,container:r,initialFocus:e},o){let u=L(null),i=f$4();return m$6(()=>{if(!o)return;let n=r.current;n&&t$b(()=>{if(!i.current)return;let l=t==null?void 0:t.activeElement;if(e!=null&&e.current){if((e==null?void 0:e.current)===l){u.current=l;return}}else if(n.contains(l)){u.current=l;return}e!=null&&e.current?y$4(e.current):O(n,M$4.First)===N$2.Error&&console.warn("There are no focusable elements inside the <FocusTrap />"),u.current=t==null?void 0:t.activeElement;});},[o]),u}function $$1({ownerDocument:t,container:r,containers:e,previousActiveElement:o},u){let i=f$4();E$3(t==null?void 0:t.defaultView,"focus",n=>{if(!u||!i.current)return;let l=P$2(e);r.current instanceof HTMLElement&&l.add(r.current);let m=o.current;if(!m)return;let c=n.target;c&&c instanceof HTMLElement?S$4(l,c)?(o.current=c,y$4(c)):(n.preventDefault(),n.stopPropagation(),y$4(m)):y$4(o.current);},!0);}function S$4(t,r){for(let e of t)if(e.contains(r))return !0;return !1}

const t$2 = await importShared('react');
const {createContext:r$2,useContext:c$4} = t$2;
let e$1=r$2(!1);function l$4(){return c$4(e$1)}function P$1(o){return t$2.createElement(e$1.Provider,{value:o.force},o.children)}

const T$2 = await importShared('react');
const {Fragment:P,createContext:m$5,useContext:s$3,useEffect:d$3,useRef:g$1,useState:R,useMemo:E$1} = T$2;
const {createPortal:H} = await importShared('react-dom');
function F$1(p){let l=l$4(),n=s$3(v$1),e=n$3(p),[a,o]=R(()=>{if(!l&&n!==null||s$b.isServer)return null;let t=e==null?void 0:e.getElementById("headlessui-portal-root");if(t)return t;if(e===null)return null;let r=e.createElement("div");return r.setAttribute("id","headlessui-portal-root"),e.body.appendChild(r)});return d$3(()=>{a!==null&&(e!=null&&e.body.contains(a)||e==null||e.body.appendChild(a));},[a,e]),d$3(()=>{l||n!==null&&o(n.current);},[n,o,l]),a}let U$1=P;function N(p,l){let n=p,e=g$1(null),a=y$3(T$4(u=>{e.current=u;}),l),o=n$3(e),t=F$1(e),[r]=R(()=>{var u;return s$b.isServer?null:(u=o==null?void 0:o.createElement("div"))!=null?u:null}),i=s$3(f$3),C=l$7();return l$8(()=>{!t||!r||t.contains(r)||(r.setAttribute("data-headlessui-portal",""),t.appendChild(r));},[t,r]),l$8(()=>{if(r&&i)return i.register(r)},[i,r]),c$5(()=>{var u;!t||!r||(r instanceof Node&&t.contains(r)&&t.removeChild(r),t.childNodes.length<=0&&((u=t.parentElement)==null||u.removeChild(t)));}),C?!t||!r?null:H(X$1({ourProps:{ref:a},theirProps:n,defaultTag:U$1,name:"Portal"}),r):null}let S$3=P,v$1=m$5(null);function j$2(p,l){let{target:n,...e}=p,o={ref:y$3(l)};return T$2.createElement(v$1.Provider,{value:n},X$1({ourProps:o,theirProps:e,defaultTag:S$3,name:"Popover.Group"}))}let f$3=m$5(null);function ae$1(){let p=s$3(f$3),l=g$1([]),n=o$2(o=>(l.current.push(o),p&&p.register(o),()=>e(o))),e=o$2(o=>{let t=l.current.indexOf(o);t!==-1&&l.current.splice(t,1),p&&p.unregister(o);}),a=E$1(()=>({register:n,unregister:e,portals:l}),[n,e,l]);return [l,E$1(()=>function({children:t}){return T$2.createElement(f$3.Provider,{value:a},t)},[a])]}let D$1=D$2(N),I$1=D$2(j$2),pe=Object.assign(D$1,{Group:I$1});

const u$3 = await importShared('react');
const {createContext:m$4,useContext:D,useMemo:l$3,useState:T$1} = u$3;
let d$2=m$4(null);function f$2(){let r=D(d$2);if(r===null){let t=new Error("You used a <Description /> component, but it is not inside a relevant parent.");throw Error.captureStackTrace&&Error.captureStackTrace(t,f$2),t}return r}function M$3(){let[r,t]=T$1([]);return [r.length>0?r.join(" "):void 0,l$3(()=>function(e){let i=o$2(s=>(t(o=>[...o,s]),()=>t(o=>{let p=o.slice(),c=p.indexOf(s);return c!==-1&&p.splice(c,1),p}))),n=l$3(()=>({register:i,slot:e.slot,name:e.name,props:e.props}),[i,e.slot,e.name,e.props]);return u$3.createElement(d$2.Provider,{value:n},e.children)},[t])]}let S$2="p";function h$2(r,t){let a=I$3(),{id:e=`headlessui-description-${a}`,...i}=r,n=f$2(),s=y$3(t);l$8(()=>n.register(e),[e,n.register]);let o={ref:s,...n.props,id:e};return X$1({ourProps:o,theirProps:i,slot:n.slot||{},defaultTag:S$2,name:n.name||"Description"})}let y$2=D$2(h$2),b$2=Object.assign(y$2,{});

const d$1 = await importShared('react');
const {createContext:c$3,useContext:m$3} = d$1;
let a$4=c$3(()=>{});a$4.displayName="StackContext";var s$2=(e=>(e[e.Add=0]="Add",e[e.Remove=1]="Remove",e))(s$2||{});function x(){return m$3(a$4)}function M$2({children:i,onUpdate:r,type:e,element:n,enabled:u}){let l=x(),o=o$2((...t)=>{r==null||r(...t),l(...t);});return l$8(()=>{let t=u===void 0||u===!0;return t&&o(0,e,n),()=>{t&&o(1,e,n);}},[o,e,n,u]),d$1.createElement(a$4.Provider,{value:o},i)}

const l$2 = await importShared('react');
function i(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}const d=typeof Object.is=="function"?Object.is:i,{useState:u$2,useEffect:h$1,useLayoutEffect:f$1,useDebugValue:p$1}=l$2;function y$1(e,t,c){const a=t(),[{inst:n},o]=u$2({inst:{value:a,getSnapshot:t}});return f$1(()=>{n.value=a,n.getSnapshot=t,r$1(n)&&o({inst:n});},[e,a,t]),h$1(()=>(r$1(n)&&o({inst:n}),e(()=>{r$1(n)&&o({inst:n});})),[e]),p$1(a),a}function r$1(e){const t=e.getSnapshot,c=e.value;try{const a=t();return !d(c,a)}catch{return !0}}

function t$1(r,e,n){return e()}

const e = await importShared('react');
const r=typeof window!="undefined"&&typeof window.document!="undefined"&&typeof window.document.createElement!="undefined",s$1=!r,c$2=s$1?t$1:y$1,a$3="useSyncExternalStore"in e?(n=>n.useSyncExternalStore)(e):c$2;

function S$1(t){return a$3(t.subscribe,t.getSnapshot,t.getSnapshot)}

function a$2(o,r){let t=o(),n=new Set;return {getSnapshot(){return t},subscribe(e){return n.add(e),()=>n.delete(e)},dispatch(e,...s){let i=r[e].call(t,...s);i&&(t=i,n.forEach(c=>c()));}}}

function c$1(){let o;return {before({doc:e}){var l;let n=e.documentElement;o=((l=e.defaultView)!=null?l:window).innerWidth-n.clientWidth;},after({doc:e,d:n}){let t=e.documentElement,l=t.clientWidth-t.offsetWidth,r=o-l;n.style(t,"paddingRight",`${r}px`);}}}

function T(){if(!t$6())return {};let l;return {before(){l=window.pageYOffset;},after({doc:o,d:t,meta:s}){function i(n){return s.containers.flatMap(e=>e()).some(e=>e.contains(n))}t.microTask(()=>{if(window.getComputedStyle(o.documentElement).scrollBehavior!=="auto"){let e=o$4();e.style(o.documentElement,"scroll-behavior","auto"),t.add(()=>t.microTask(()=>e.dispose()));}t.style(o.body,"marginTop",`-${l}px`),window.scrollTo(0,0);let n=null;t.addEventListener(o,"click",e=>{if(e.target instanceof HTMLElement)try{let r=e.target.closest("a");if(!r)return;let{hash:c}=new URL(r.href),a=o.querySelector(c);a&&!i(a)&&(n=a);}catch{}},!0),t.addEventListener(o,"touchmove",e=>{e.target instanceof HTMLElement&&!i(e.target)&&e.preventDefault();},{passive:!1}),t.add(()=>{window.scrollTo(0,window.pageYOffset+l),n&&n.isConnected&&(n.scrollIntoView({block:"nearest"}),n=null);});});}}}

function l$1(){return {before({doc:e,d:o}){o.style(e.documentElement,"overflow","hidden");}}}

function m$2(e){let n={};for(let t of e)Object.assign(n,t(n));return n}let a$1=a$2(()=>new Map,{PUSH(e,n){var o;let t=(o=this.get(e))!=null?o:{doc:e,count:0,d:o$4(),meta:new Set};return t.count++,t.meta.add(n),this.set(e,t),this},POP(e,n){let t=this.get(e);return t&&(t.count--,t.meta.delete(n)),this},SCROLL_PREVENT({doc:e,d:n,meta:t}){let o={doc:e,d:n,meta:m$2(t)},c=[T(),c$1(),l$1()];c.forEach(({before:r})=>r==null?void 0:r(o)),c.forEach(({after:r})=>r==null?void 0:r(o));},SCROLL_ALLOW({d:e}){e.dispose();},TEARDOWN({doc:e}){this.delete(e);}});a$1.subscribe(()=>{let e=a$1.getSnapshot(),n=new Map;for(let[t]of e)n.set(t,t.documentElement.style.overflow);for(let t of e.values()){let o=n.get(t.doc)==="hidden",c=t.count!==0;(c&&!o||!c&&o)&&a$1.dispatch(t.count>0?"SCROLL_PREVENT":"SCROLL_ALLOW",t),t.count===0&&a$1.dispatch("TEARDOWN",t);}});

function p(e,r,n){let f=S$1(a$1),o=e?f.get(e):void 0,i=o?o.count>0:!1;return l$8(()=>{if(!(!e||!r))return a$1.dispatch("PUSH",e,n),()=>a$1.dispatch("POP",e,n)},[r,e]),i}

let u$1=new Map,t=new Map;function h(r,l=!0){l$8(()=>{var o;if(!l)return;let e=typeof r=="function"?r():r.current;if(!e)return;function a(){var d;if(!e)return;let i=(d=t.get(e))!=null?d:1;if(i===1?t.delete(e):t.set(e,i-1),i!==1)return;let n=u$1.get(e);n&&(n["aria-hidden"]===null?e.removeAttribute("aria-hidden"):e.setAttribute("aria-hidden",n["aria-hidden"]),e.inert=n.inert,u$1.delete(e));}let f=(o=t.get(e))!=null?o:0;return t.set(e,f+1),f!==0||(u$1.set(e,{"aria-hidden":e.getAttribute("aria-hidden"),inert:e.inert}),e.setAttribute("aria-hidden","true"),e.inert=!0),a},[r,l]);}

const s = await importShared('react');
const {useRef:a,useMemo:m$1} = s;
function j$1({defaultContainers:t=[],portals:r,mainTreeNodeRef:u}={}){var c;let o=a((c=u==null?void 0:u.current)!=null?c:null),l=n$3(o),f=o$2(()=>{var i;let n=[];for(let e of t)e!==null&&(e instanceof HTMLElement?n.push(e):"current"in e&&e.current instanceof HTMLElement&&n.push(e.current));if(r!=null&&r.current)for(let e of r.current)n.push(e);for(let e of (i=l==null?void 0:l.querySelectorAll("html > *, body > *"))!=null?i:[])e!==document.body&&e!==document.head&&e instanceof HTMLElement&&e.id!=="headlessui-portal-root"&&(e.contains(o.current)||n.some(T=>e.contains(T))||n.push(e));return n});return {resolveContainers:f,contains:o$2(n=>f().some(i=>i.contains(n))),mainTreeNodeRef:o,MainTreeNode:m$1(()=>function(){return u!=null?null:s.createElement(c$7,{features:p$3.Hidden,ref:o})},[o,u])}}

const u = await importShared('react');
const {createContext:ce,createRef:De$1,useCallback:j,useContext:K,useEffect:w,useMemo:y,useReducer:me,useRef:Pe$1,useState:ye$1} = u;
var _e=(o=>(o[o.Open=0]="Open",o[o.Closed=1]="Closed",o))(_e||{}),Ie=(e=>(e[e.SetTitleId=0]="SetTitleId",e))(Ie||{});let Me={[0](t,e){return t.titleId===e.id?t:{...t,titleId:e.id}}},I=ce(null);I.displayName="DialogContext";function b$1(t){let e=K(I);if(e===null){let o=new Error(`<${t} /> is missing a parent <Dialog /> component.`);throw Error.captureStackTrace&&Error.captureStackTrace(o,b$1),o}return e}function we(t,e,o=()=>[document.body]){p(t,e,i=>{var n;return {containers:[...(n=i.containers)!=null?n:[],o]}});}function Be(t,e){return u$6(e.type,Me,t,e)}let He$1="div",Ge=S$5.RenderStrategy|S$5.Static;function Ne$1(t,e){var X;let o$1=I$3(),{id:i=`headlessui-dialog-${o$1}`,open:n,onClose:l,initialFocus:s,__demoMode:g=!1,...T}=t,[m,h$1]=ye$1(0),a=C$1();n===void 0&&a!==null&&(n=(a&d$5.Open)===d$5.Open);let D=Pe$1(null),Q=y$3(D,e),f=n$3(D),N=t.hasOwnProperty("open")||a!==null,U=t.hasOwnProperty("onClose");if(!N&&!U)throw new Error("You have to provide an `open` and an `onClose` prop to the `Dialog` component.");if(!N)throw new Error("You provided an `onClose` prop to the `Dialog`, but forgot an `open` prop.");if(!U)throw new Error("You provided an `open` prop to the `Dialog`, but forgot an `onClose` prop.");if(typeof n!="boolean")throw new Error(`You provided an \`open\` prop to the \`Dialog\`, but the value is not a boolean. Received: ${n}`);if(typeof l!="function")throw new Error(`You provided an \`onClose\` prop to the \`Dialog\`, but the value is not a function. Received: ${l}`);let p=n?0:1,[S,Z]=me(Be,{titleId:null,descriptionId:null,panelRef:De$1()}),P=o$2(()=>l(!1)),W=o$2(r=>Z({type:0,id:r})),L=l$7()?g?!1:p===0:!1,F=m>1,Y=K(I)!==null,[ee,te]=ae$1(),{resolveContainers:M,mainTreeNodeRef:k,MainTreeNode:oe}=j$1({portals:ee,defaultContainers:[(X=S.panelRef.current)!=null?X:D.current]}),re=F?"parent":"leaf",$=a!==null?(a&d$5.Closing)===d$5.Closing:!1,ne=(()=>Y||$?!1:L)(),le=j(()=>{var r,c;return (c=Array.from((r=f==null?void 0:f.querySelectorAll("body > *"))!=null?r:[]).find(d=>d.id==="headlessui-portal-root"?!1:d.contains(k.current)&&d instanceof HTMLElement))!=null?c:null},[k]);h(le,ne);let ae=(()=>F?!0:L)(),ie=j(()=>{var r,c;return (c=Array.from((r=f==null?void 0:f.querySelectorAll("[data-headlessui-portal]"))!=null?r:[]).find(d=>d.contains(k.current)&&d instanceof HTMLElement))!=null?c:null},[k]);h(ie,ae);let se=(()=>!(!L||F))();h$5(M,P,se);let pe$1=(()=>!(F||p!==0))();E$3(f==null?void 0:f.defaultView,"keydown",r=>{pe$1&&(r.defaultPrevented||r.key===o.Escape&&(r.preventDefault(),r.stopPropagation(),P()));});let de=(()=>!($||p!==0||Y))();we(f,de,M),w(()=>{if(p!==0||!D.current)return;let r=new ResizeObserver(c=>{for(let d of c){let x=d.target.getBoundingClientRect();x.x===0&&x.y===0&&x.width===0&&x.height===0&&P();}});return r.observe(D.current),()=>r.disconnect()},[p,D,P]);let[ue,fe]=M$3(),ge$1=y(()=>[{dialogState:p,close:P,setTitleId:W},S],[p,S,P,W]),J=y(()=>({open:p===0}),[p]),Te={ref:Q,id:i,role:"dialog","aria-modal":p===0?!0:void 0,"aria-labelledby":S.titleId,"aria-describedby":ue};return u.createElement(M$2,{type:"Dialog",enabled:p===0,element:D,onUpdate:o$2((r,c)=>{c==="Dialog"&&u$6(r,{[s$2.Add]:()=>h$1(d=>d+1),[s$2.Remove]:()=>h$1(d=>d-1)});})},u.createElement(P$1,{force:!0},u.createElement(pe,null,u.createElement(I.Provider,{value:ge$1},u.createElement(pe.Group,{target:D},u.createElement(P$1,{force:!1},u.createElement(fe,{slot:J,name:"Dialog.Description"},u.createElement(ge,{initialFocus:s,containers:M,features:L?u$6(re,{parent:ge.features.RestoreFocus,leaf:ge.features.All&~ge.features.FocusLock}):ge.features.None},u.createElement(te,null,X$1({ourProps:Te,theirProps:T,slot:J,defaultTag:He$1,features:Ge,visible:p===0,name:"Dialog"}))))))))),u.createElement(oe,null))}let Ue="div";function We(t,e){let o=I$3(),{id:i=`headlessui-dialog-overlay-${o}`,...n}=t,[{dialogState:l,close:s}]=b$1("Dialog.Overlay"),g=y$3(e),T=o$2(a=>{if(a.target===a.currentTarget){if(r$4(a.currentTarget))return a.preventDefault();a.preventDefault(),a.stopPropagation(),s();}}),m=y(()=>({open:l===0}),[l]);return X$1({ourProps:{ref:g,id:i,"aria-hidden":!0,onClick:T},theirProps:n,slot:m,defaultTag:Ue,name:"Dialog.Overlay"})}let Ye="div";function $e(t,e){let o=I$3(),{id:i=`headlessui-dialog-backdrop-${o}`,...n}=t,[{dialogState:l},s]=b$1("Dialog.Backdrop"),g=y$3(e);w(()=>{if(s.panelRef.current===null)throw new Error("A <Dialog.Backdrop /> component is being used, but a <Dialog.Panel /> component is missing.")},[s.panelRef]);let T=y(()=>({open:l===0}),[l]);return u.createElement(P$1,{force:!0},u.createElement(pe,null,X$1({ourProps:{ref:g,id:i,"aria-hidden":!0},theirProps:n,slot:T,defaultTag:Ye,name:"Dialog.Backdrop"})))}let Je="div";function Xe(t,e){let o=I$3(),{id:i=`headlessui-dialog-panel-${o}`,...n}=t,[{dialogState:l},s]=b$1("Dialog.Panel"),g=y$3(e,s.panelRef),T=y(()=>({open:l===0}),[l]),m=o$2(a=>{a.stopPropagation();});return X$1({ourProps:{ref:g,id:i,onClick:m},theirProps:n,slot:T,defaultTag:Je,name:"Dialog.Panel"})}let je="h2";function Ke(t,e){let o=I$3(),{id:i=`headlessui-dialog-title-${o}`,...n}=t,[{dialogState:l,setTitleId:s}]=b$1("Dialog.Title"),g=y$3(e);w(()=>(s(i),()=>s(null)),[i,s]);let T=y(()=>({open:l===0}),[l]);return X$1({ourProps:{ref:g,id:i},theirProps:n,slot:T,defaultTag:je,name:"Dialog.Title"})}let Ve=D$2(Ne$1),qe=D$2($e),ze=D$2(Xe),Qe=D$2(We),Ze=D$2(Ke),_t=Object.assign(Ve,{Backdrop:qe,Panel:ze,Overlay:Qe,Title:Ze,Description:b$2});

const {useState:f,useCallback:n} = await importShared('react');
function c(a=0){let[l,r]=f(a),t=f$4(),o=n(e=>{t.current&&r(u=>u|e);},[l,t]),m=n(e=>Boolean(l&e),[l]),s=n(e=>{t.current&&r(u=>u&~e);},[r,t]),g=n(e=>{t.current&&r(u=>u^e);},[r]);return {flags:l,addFlag:o,hasFlag:m,removeFlag:s,toggleFlag:g}}

function l(r){let e={called:!1};return (...t)=>{if(!e.called)return e.called=!0,r(...t)}}

function g(t,...e){t&&e.length>0&&t.classList.add(...e);}function v(t,...e){t&&e.length>0&&t.classList.remove(...e);}function b(t,e){let n=o$4();if(!t)return n.dispose;let{transitionDuration:m,transitionDelay:a}=getComputedStyle(t),[u,p]=[m,a].map(l=>{let[r=0]=l.split(",").filter(Boolean).map(i=>i.includes("ms")?parseFloat(i):parseFloat(i)*1e3).sort((i,T)=>T-i);return r}),o=u+p;if(o!==0){n.group(r=>{r.setTimeout(()=>{e(),r.dispose();},o),r.addEventListener(t,"transitionrun",i=>{i.target===i.currentTarget&&r.dispose();});});let l=n.addEventListener(t,"transitionend",r=>{r.target===r.currentTarget&&(e(),l());});}else e();return n.add(()=>e()),n.dispose}function M$1(t,e,n,m){let a=n?"enter":"leave",u=o$4(),p=m!==void 0?l(m):()=>{};a==="enter"&&(t.removeAttribute("hidden"),t.style.display="");let o=u$6(a,{enter:()=>e.enter,leave:()=>e.leave}),l$1=u$6(a,{enter:()=>e.enterTo,leave:()=>e.leaveTo}),r=u$6(a,{enter:()=>e.enterFrom,leave:()=>e.leaveFrom});return v(t,...e.base,...e.enter,...e.enterTo,...e.enterFrom,...e.leave,...e.leaveFrom,...e.leaveTo,...e.entered),g(t,...e.base,...o,...r),u.nextFrame(()=>{v(t,...e.base,...o,...r),g(t,...e.base,...o,...l$1),b(t,()=>(v(t,...e.base,...o),g(t,...e.base,...e.entered),p()));}),u.dispose}

function E({immediate:t,container:s,direction:n,classes:u,onStart:a,onStop:c}){let l=f$4(),d=p$4(),e=s$a(n);l$8(()=>{t&&(e.current="enter");},[t]),l$8(()=>{let r=o$4();d.add(r.dispose);let i=s.current;if(i&&e.current!=="idle"&&l.current)return r.dispose(),a.current(e.current),r.add(M$1(i,u.current,e.current==="enter",()=>{r.dispose(),c.current(e.current);})),r.dispose},[n]);}

const m = await importShared('react');
const {Fragment:Y,createContext:Z,useContext:B,useEffect:F,useMemo:$,useRef:C,useState:J} = m;
function S(t=""){return t.split(" ").filter(n=>n.trim().length>1)}let _=Z(null);_.displayName="TransitionContext";var be=(r=>(r.Visible="visible",r.Hidden="hidden",r))(be||{});function Se(){let t=B(_);if(t===null)throw new Error("A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.");return t}function Ne(){let t=B(M);if(t===null)throw new Error("A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.");return t}let M=Z(null);M.displayName="NestingContext";function U(t){return "children"in t?U(t.children):t.current.filter(({el:n})=>n.current!==null).filter(({state:n})=>n==="visible").length>0}function oe(t,n){let r=s$a(t),s=C([]),y=f$4(),D=p$4(),c=o$2((i,e=j$3.Hidden)=>{let a=s.current.findIndex(({el:o})=>o===i);a!==-1&&(u$6(e,{[j$3.Unmount](){s.current.splice(a,1);},[j$3.Hidden](){s.current[a].state="hidden";}}),D.microTask(()=>{var o;!U(s)&&y.current&&((o=r.current)==null||o.call(r));}));}),x=o$2(i=>{let e=s.current.find(({el:a})=>a===i);return e?e.state!=="visible"&&(e.state="visible"):s.current.push({el:i,state:"visible"}),()=>c(i,j$3.Unmount)}),p=C([]),h=C(Promise.resolve()),u=C({enter:[],leave:[],idle:[]}),v=o$2((i,e,a)=>{p.current.splice(0),n&&(n.chains.current[e]=n.chains.current[e].filter(([o])=>o!==i)),n==null||n.chains.current[e].push([i,new Promise(o=>{p.current.push(o);})]),n==null||n.chains.current[e].push([i,new Promise(o=>{Promise.all(u.current[e].map(([f,P])=>P)).then(()=>o());})]),e==="enter"?h.current=h.current.then(()=>n==null?void 0:n.wait.current).then(()=>a(e)):a(e);}),d=o$2((i,e,a)=>{Promise.all(u.current[e].splice(0).map(([o,f])=>f)).then(()=>{var o;(o=p.current.shift())==null||o();}).then(()=>a(e));});return $(()=>({children:s,register:x,unregister:c,onStart:v,onStop:d,wait:h,chains:u}),[x,c,s,v,d,u,h])}function xe(){}let Pe=["beforeEnter","afterEnter","beforeLeave","afterLeave"];function se(t){var r;let n={};for(let s of Pe)n[s]=(r=t[s])!=null?r:xe;return n}function Re(t){let n=C(se(t));return F(()=>{n.current=se(t);},[t]),n}let ye="div",ae=S$5.RenderStrategy;function De(t,n){var K,Q;let{beforeEnter:r,afterEnter:s,beforeLeave:y,afterLeave:D,enter:c$1,enterFrom:x,enterTo:p,entered:h,leave:u,leaveFrom:v,leaveTo:d,...i}=t,e=C(null),a=y$3(e,n),o=(K=i.unmount)==null||K?j$3.Unmount:j$3.Hidden,{show:f,appear:P,initial:T}=Se(),[l,j]=J(f?"visible":"hidden"),q=Ne(),{register:O,unregister:V}=q;F(()=>O(e),[O,e]),F(()=>{if(o===j$3.Hidden&&e.current){if(f&&l!=="visible"){j("visible");return}return u$6(l,{["hidden"]:()=>V(e),["visible"]:()=>O(e)})}},[l,e,O,V,f,o]);let k=s$a({base:S(i.className),enter:S(c$1),enterFrom:S(x),enterTo:S(p),entered:S(h),leave:S(u),leaveFrom:S(v),leaveTo:S(d)}),w=Re({beforeEnter:r,afterEnter:s,beforeLeave:y,afterLeave:D}),G=l$7();F(()=>{if(G&&l==="visible"&&e.current===null)throw new Error("Did you forget to passthrough the `ref` to the actual DOM node?")},[e,l,G]);let ue=T&&!P,z=P&&f&&T,Te=(()=>!G||ue?"idle":f?"enter":"leave")(),H=c(0),de=o$2(g=>u$6(g,{enter:()=>{H.addFlag(d$5.Opening),w.current.beforeEnter();},leave:()=>{H.addFlag(d$5.Closing),w.current.beforeLeave();},idle:()=>{}})),fe=o$2(g=>u$6(g,{enter:()=>{H.removeFlag(d$5.Opening),w.current.afterEnter();},leave:()=>{H.removeFlag(d$5.Closing),w.current.afterLeave();},idle:()=>{}})),A=oe(()=>{j("hidden"),V(e);},q);E({immediate:z,container:e,classes:k,direction:Te,onStart:s$a(g=>{A.onStart(e,g,de);}),onStop:s$a(g=>{A.onStop(e,g,fe),g==="leave"&&!U(A)&&(j("hidden"),V(e));})});let R=i,me={ref:a};return z?R={...R,className:t$8(i.className,...k.current.enter,...k.current.enterFrom)}:(R.className=t$8(i.className,(Q=e.current)==null?void 0:Q.className),R.className===""&&delete R.className),m.createElement(M.Provider,{value:A},m.createElement(c$6,{value:u$6(l,{["visible"]:d$5.Open,["hidden"]:d$5.Closed})|H.flags},X$1({ourProps:me,theirProps:R,defaultTag:ye,features:ae,visible:l==="visible",name:"Transition.Child"})))}function He(t,n){let{show:r,appear:s=!1,unmount:y=!0,...D}=t,c=C(null),x=y$3(c,n);l$7();let p=C$1();if(r===void 0&&p!==null&&(r=(p&d$5.Open)===d$5.Open),![!0,!1].includes(r))throw new Error("A <Transition /> is used but it is missing a `show={true | false}` prop.");let[h,u]=J(r?"visible":"hidden"),v=oe(()=>{u("hidden");}),[d,i]=J(!0),e=C([r]);l$8(()=>{d!==!1&&e.current[e.current.length-1]!==r&&(e.current.push(r),i(!1));},[e,r]);let a=$(()=>({show:r,appear:s,initial:d}),[r,s,d]);F(()=>{if(r)u("visible");else if(!U(v))u("hidden");else {let T=c.current;if(!T)return;let l=T.getBoundingClientRect();l.x===0&&l.y===0&&l.width===0&&l.height===0&&u("hidden");}},[r,v]);let o={unmount:y},f=o$2(()=>{var T;d&&i(!1),(T=t.beforeEnter)==null||T.call(t);}),P=o$2(()=>{var T;d&&i(!1),(T=t.beforeLeave)==null||T.call(t);});return m.createElement(M.Provider,{value:v},m.createElement(_.Provider,{value:a},X$1({ourProps:{...o,as:Y,children:m.createElement(le,{ref:x,...o,...D,beforeEnter:f,beforeLeave:P})},theirProps:{},defaultTag:Y,features:ae,visible:h==="visible",name:"Transition"})))}function Fe(t,n){let r=B(_)!==null,s=C$1()!==null;return m.createElement(m.Fragment,null,!r&&s?m.createElement(W,{ref:n,...t}):m.createElement(le,{ref:n,...t}))}let W=D$2(He),le=D$2(De),Le=D$2(Fe),tt=Object.assign(W,{Child:Le,Root:W});

const React$9 = await importShared('react');

function Bars3Icon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/React$9.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/React$9.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/React$9.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
  }));
}
const ForwardRef$5 = React$9.forwardRef(Bars3Icon);
const Bars3Icon$1 = ForwardRef$5;

const React$8 = await importShared('react');

function BellIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/React$8.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/React$8.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/React$8.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
  }));
}
const ForwardRef$4 = React$8.forwardRef(BellIcon);
const BellIcon$1 = ForwardRef$4;

const React$7 = await importShared('react');

function Cog6ToothIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/React$7.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/React$7.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/React$7.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
  }), /*#__PURE__*/React$7.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
  }));
}
const ForwardRef$3 = React$7.forwardRef(Cog6ToothIcon);
const Cog6ToothIcon$1 = ForwardRef$3;

const React$6 = await importShared('react');

function HomeIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/React$6.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/React$6.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/React$6.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
  }));
}
const ForwardRef$2 = React$6.forwardRef(HomeIcon);
const HomeIcon$1 = ForwardRef$2;

const React$5 = await importShared('react');

function UsersIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/React$5.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/React$5.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/React$5.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
  }));
}
const ForwardRef$1 = React$5.forwardRef(UsersIcon);
const UsersIcon$1 = ForwardRef$1;

const React$4 = await importShared('react');

function XMarkIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/React$4.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/React$4.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/React$4.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M6 18L18 6M6 6l12 12"
  }));
}
const ForwardRef = React$4.forwardRef(XMarkIcon);
const XMarkIcon$1 = ForwardRef;

await importShared('react');

function LocalPage() {
  return /* @__PURE__ */ jsx("div", { children: "Local page in host project" });
}

const remotesMap = {
'remoteApp':{url:'http://localhost:8001/assets/remoteEntry.js',format:'esm',from:'vite'}
};
                const loadJS = async (url, fn) => {
                    const resolvedUrl = typeof url === 'function' ? await url() : url;
                    const script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.onload = fn;
                    script.src = resolvedUrl;
                    document.getElementsByTagName('head')[0].appendChild(script);
                };

                function get(name, remoteFrom) {
                    return __federation_import(name).then(module => () => {
                        if (remoteFrom === 'webpack') {
                            return Object.prototype.toString.call(module).indexOf('Module') > -1 && module.default ? module.default : module
                        }
                        return module
                    })
                }

                const wrapShareModule = remoteFrom => {
                    return {
                        'react':{'18.2.0':{get:()=>get(new URL('__federation_shared_react-2436d585.js', import.meta.url).href, remoteFrom), loaded:1}},'react-dom':{'18.2.0':{get:()=>get(new URL('__federation_shared_react-dom-6fc2ee8d.js', import.meta.url).href, remoteFrom), loaded:1}}
                    }
                };

                async function __federation_import(name) {
                    return __vitePreload(() => import(name),true?[]:void 0);
                }

                async function __federation_method_ensure(remoteId) {
                    const remote = remotesMap[remoteId];
                    if (!remote.inited) {
                        if ('var' === remote.format) {
                            // loading js with script tag
                            return new Promise(resolve => {
                                const callback = () => {
                                    if (!remote.inited) {
                                        remote.lib = window[remoteId];
                                        remote.lib.init(wrapShareModule(remote.from));
                                        remote.inited = true;
                                    }
                                    resolve(remote.lib);
                                };
                                return loadJS(remote.url, callback);
                            });
                        } else if (['esm', 'systemjs'].includes(remote.format)) {
                            // loading js with import(...)
                            return new Promise((resolve, reject) => {
                                const getUrl = typeof remote.url === 'function' ? remote.url : () => Promise.resolve(remote.url);
                                getUrl().then(url => {
                                    __vitePreload(() => import(/* @vite-ignore */ url),true?[]:void 0).then(lib => {
                                        if (!remote.inited) {
                                            const shareScope = wrapShareModule(remote.from);
                                            lib.init(shareScope);
                                            remote.lib = lib;
                                            remote.lib.init(shareScope);
                                            remote.inited = true;
                                        }
                                        resolve(remote.lib);
                                    }).catch(reject);
                                });
                            })
                        }
                    } else {
                        return remote.lib;
                    }
                }

                function __federation_method_wrapDefault(module, need) {
                    if (!module?.default && need) {
                        let obj = Object.create(null);
                        obj.default = module;
                        obj.__esModule = true;
                        return obj;
                    }
                    return module;
                }

                function __federation_method_getRemote(remoteName, componentName) {
                    return __federation_method_ensure(remoteName).then((remote) => remote.get(componentName).then(factory => factory()));
                }

const {createContext,Component,isValidElement,createElement,useContext,useState: useState$1,useMemo,forwardRef} = await importShared('react');


const ErrorBoundaryContext = createContext(null);

const initialState = {
  didCatch: false,
  error: null
};
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.resetErrorBoundary = this.resetErrorBoundary.bind(this);
    this.state = initialState;
  }
  static getDerivedStateFromError(error) {
    return {
      didCatch: true,
      error
    };
  }
  resetErrorBoundary() {
    const {
      error
    } = this.state;
    if (error !== null) {
      var _this$props$onReset, _this$props;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      (_this$props$onReset = (_this$props = this.props).onReset) === null || _this$props$onReset === void 0 ? void 0 : _this$props$onReset.call(_this$props, {
        args,
        reason: "imperative-api"
      });
      this.setState(initialState);
    }
  }
  componentDidCatch(error, info) {
    var _this$props$onError, _this$props2;
    (_this$props$onError = (_this$props2 = this.props).onError) === null || _this$props$onError === void 0 ? void 0 : _this$props$onError.call(_this$props2, error, info);
  }
  componentDidUpdate(prevProps, prevState) {
    const {
      didCatch
    } = this.state;
    const {
      resetKeys
    } = this.props;

    // There's an edge case where if the thing that triggered the error happens to *also* be in the resetKeys array,
    // we'd end up resetting the error boundary immediately.
    // This would likely trigger a second error to be thrown.
    // So we make sure that we don't check the resetKeys on the first call of cDU after the error is set.

    if (didCatch && prevState.error !== null && hasArrayChanged(prevProps.resetKeys, resetKeys)) {
      var _this$props$onReset2, _this$props3;
      (_this$props$onReset2 = (_this$props3 = this.props).onReset) === null || _this$props$onReset2 === void 0 ? void 0 : _this$props$onReset2.call(_this$props3, {
        next: resetKeys,
        prev: prevProps.resetKeys,
        reason: "keys"
      });
      this.setState(initialState);
    }
  }
  render() {
    const {
      children,
      fallbackRender,
      FallbackComponent,
      fallback
    } = this.props;
    const {
      didCatch,
      error
    } = this.state;
    let childToRender = children;
    if (didCatch) {
      const props = {
        error,
        resetErrorBoundary: this.resetErrorBoundary
      };
      if (isValidElement(fallback)) {
        childToRender = fallback;
      } else if (typeof fallbackRender === "function") {
        childToRender = fallbackRender(props);
      } else if (FallbackComponent) {
        childToRender = createElement(FallbackComponent, props);
      } else {
        throw error;
      }
    }
    return createElement(ErrorBoundaryContext.Provider, {
      value: {
        didCatch,
        error,
        resetErrorBoundary: this.resetErrorBoundary
      }
    }, childToRender);
  }
}
function hasArrayChanged() {
  let a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  let b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return a.length !== b.length || a.some((item, index) => !Object.is(item, b[index]));
}

const React$3 = await importShared('react');

const {Suspense: Suspense$1,lazt} = await importShared('react');
const KeysToComponentMap = {
  sample1: React$3.lazy(() => __federation_method_getRemote("remoteApp" , "./Sample1").then(module=>__federation_method_wrapDefault(module, true))),
  sample2: React$3.lazy(() => __federation_method_getRemote("remoteApp" , "./Sample2").then(module=>__federation_method_wrapDefault(module, true)))
};
function remotePageRenderer(componentName) {
  if (typeof KeysToComponentMap[componentName.toLowerCase()] !== "undefined") {
    return /* @__PURE__ */ jsx(ErrorBoundary, { fallback: /* @__PURE__ */ jsx(Fragment, { children: "Oops,we cant load that page right now :( " }), children: /* @__PURE__ */ jsx(Suspense$1, { fallback: "loading....", children: React$3.createElement(KeysToComponentMap[componentName.toLowerCase()]) }) });
  }
}

/**
 * @remix-run/router v1.9.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends$2() {
  _extends$2 = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$2.apply(this, arguments);
}

////////////////////////////////////////////////////////////////////////////////
//#region Types and Constants
////////////////////////////////////////////////////////////////////////////////
/**
 * Actions represent the type of change to a location value.
 */
var Action;
(function (Action) {
  /**
   * A POP indicates a change to an arbitrary index in the history stack, such
   * as a back or forward navigation. It does not describe the direction of the
   * navigation, only that the current index changed.
   *
   * Note: This is the default action for newly created history objects.
   */
  Action["Pop"] = "POP";
  /**
   * A PUSH indicates a new entry being added to the history stack, such as when
   * a link is clicked and a new page loads. When this happens, all subsequent
   * entries in the stack are lost.
   */
  Action["Push"] = "PUSH";
  /**
   * A REPLACE indicates the entry at the current index in the history stack
   * being replaced by a new one.
   */
  Action["Replace"] = "REPLACE";
})(Action || (Action = {}));
const PopStateEventType = "popstate";
/**
 * Browser history stores the location in regular URLs. This is the standard for
 * most web apps, but it requires some configuration on the server to ensure you
 * serve the same app at multiple URLs.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#createbrowserhistory
 */
function createBrowserHistory(options) {
  if (options === void 0) {
    options = {};
  }
  function createBrowserLocation(window, globalHistory) {
    let {
      pathname,
      search,
      hash
    } = window.location;
    return createLocation("", {
      pathname,
      search,
      hash
    },
    // state defaults to `null` because `window.history.state` does
    globalHistory.state && globalHistory.state.usr || null, globalHistory.state && globalHistory.state.key || "default");
  }
  function createBrowserHref(window, to) {
    return typeof to === "string" ? to : createPath(to);
  }
  return getUrlBasedHistory(createBrowserLocation, createBrowserHref, null, options);
}
function invariant(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}
function warning(cond, message) {
  if (!cond) {
    // eslint-disable-next-line no-console
    if (typeof console !== "undefined") console.warn(message);
    try {
      // Welcome to debugging history!
      //
      // This error is thrown as a convenience, so you can more easily
      // find the source for a warning that appears in the console by
      // enabling "pause on exceptions" in your JavaScript debugger.
      throw new Error(message);
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
}
function createKey() {
  return Math.random().toString(36).substr(2, 8);
}
/**
 * For browser-based histories, we combine the state and key into an object
 */
function getHistoryState(location, index) {
  return {
    usr: location.state,
    key: location.key,
    idx: index
  };
}
/**
 * Creates a Location object with a unique key from the given Path
 */
function createLocation(current, to, state, key) {
  if (state === void 0) {
    state = null;
  }
  let location = _extends$2({
    pathname: typeof current === "string" ? current : current.pathname,
    search: "",
    hash: ""
  }, typeof to === "string" ? parsePath(to) : to, {
    state,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: to && to.key || key || createKey()
  });
  return location;
}
/**
 * Creates a string URL path from the given pathname, search, and hash components.
 */
function createPath(_ref) {
  let {
    pathname = "/",
    search = "",
    hash = ""
  } = _ref;
  if (search && search !== "?") pathname += search.charAt(0) === "?" ? search : "?" + search;
  if (hash && hash !== "#") pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
  return pathname;
}
/**
 * Parses a string URL path into its separate pathname, search, and hash components.
 */
function parsePath(path) {
  let parsedPath = {};
  if (path) {
    let hashIndex = path.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = path.substr(hashIndex);
      path = path.substr(0, hashIndex);
    }
    let searchIndex = path.indexOf("?");
    if (searchIndex >= 0) {
      parsedPath.search = path.substr(searchIndex);
      path = path.substr(0, searchIndex);
    }
    if (path) {
      parsedPath.pathname = path;
    }
  }
  return parsedPath;
}
function getUrlBasedHistory(getLocation, createHref, validateLocation, options) {
  if (options === void 0) {
    options = {};
  }
  let {
    window = document.defaultView,
    v5Compat = false
  } = options;
  let globalHistory = window.history;
  let action = Action.Pop;
  let listener = null;
  let index = getIndex();
  // Index should only be null when we initialize. If not, it's because the
  // user called history.pushState or history.replaceState directly, in which
  // case we should log a warning as it will result in bugs.
  if (index == null) {
    index = 0;
    globalHistory.replaceState(_extends$2({}, globalHistory.state, {
      idx: index
    }), "");
  }
  function getIndex() {
    let state = globalHistory.state || {
      idx: null
    };
    return state.idx;
  }
  function handlePop() {
    action = Action.Pop;
    let nextIndex = getIndex();
    let delta = nextIndex == null ? null : nextIndex - index;
    index = nextIndex;
    if (listener) {
      listener({
        action,
        location: history.location,
        delta
      });
    }
  }
  function push(to, state) {
    action = Action.Push;
    let location = createLocation(history.location, to, state);
    if (validateLocation) validateLocation(location, to);
    index = getIndex() + 1;
    let historyState = getHistoryState(location, index);
    let url = history.createHref(location);
    // try...catch because iOS limits us to 100 pushState calls :/
    try {
      globalHistory.pushState(historyState, "", url);
    } catch (error) {
      // If the exception is because `state` can't be serialized, let that throw
      // outwards just like a replace call would so the dev knows the cause
      // https://html.spec.whatwg.org/multipage/nav-history-apis.html#shared-history-push/replace-state-steps
      // https://html.spec.whatwg.org/multipage/structured-data.html#structuredserializeinternal
      if (error instanceof DOMException && error.name === "DataCloneError") {
        throw error;
      }
      // They are going to lose state here, but there is no real
      // way to warn them about it since the page will refresh...
      window.location.assign(url);
    }
    if (v5Compat && listener) {
      listener({
        action,
        location: history.location,
        delta: 1
      });
    }
  }
  function replace(to, state) {
    action = Action.Replace;
    let location = createLocation(history.location, to, state);
    if (validateLocation) validateLocation(location, to);
    index = getIndex();
    let historyState = getHistoryState(location, index);
    let url = history.createHref(location);
    globalHistory.replaceState(historyState, "", url);
    if (v5Compat && listener) {
      listener({
        action,
        location: history.location,
        delta: 0
      });
    }
  }
  function createURL(to) {
    // window.location.origin is "null" (the literal string value) in Firefox
    // under certain conditions, notably when serving from a local HTML file
    // See https://bugzilla.mozilla.org/show_bug.cgi?id=878297
    let base = window.location.origin !== "null" ? window.location.origin : window.location.href;
    let href = typeof to === "string" ? to : createPath(to);
    invariant(base, "No window.location.(origin|href) available to create URL for href: " + href);
    return new URL(href, base);
  }
  let history = {
    get action() {
      return action;
    },
    get location() {
      return getLocation(window, globalHistory);
    },
    listen(fn) {
      if (listener) {
        throw new Error("A history only accepts one active listener");
      }
      window.addEventListener(PopStateEventType, handlePop);
      listener = fn;
      return () => {
        window.removeEventListener(PopStateEventType, handlePop);
        listener = null;
      };
    },
    createHref(to) {
      return createHref(window, to);
    },
    createURL,
    encodeLocation(to) {
      // Encode a Location the same way window.location would
      let url = createURL(to);
      return {
        pathname: url.pathname,
        search: url.search,
        hash: url.hash
      };
    },
    push,
    replace,
    go(n) {
      return globalHistory.go(n);
    }
  };
  return history;
}
//#endregion

var ResultType;
(function (ResultType) {
  ResultType["data"] = "data";
  ResultType["deferred"] = "deferred";
  ResultType["redirect"] = "redirect";
  ResultType["error"] = "error";
})(ResultType || (ResultType = {}));
/**
 * Matches the given routes to a location and returns the match data.
 *
 * @see https://reactrouter.com/utils/match-routes
 */
function matchRoutes(routes, locationArg, basename) {
  if (basename === void 0) {
    basename = "/";
  }
  let location = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
  let pathname = stripBasename(location.pathname || "/", basename);
  if (pathname == null) {
    return null;
  }
  let branches = flattenRoutes(routes);
  rankRouteBranches(branches);
  let matches = null;
  for (let i = 0; matches == null && i < branches.length; ++i) {
    matches = matchRouteBranch(branches[i],
    // Incoming pathnames are generally encoded from either window.location
    // or from router.navigate, but we want to match against the unencoded
    // paths in the route definitions.  Memory router locations won't be
    // encoded here but there also shouldn't be anything to decode so this
    // should be a safe operation.  This avoids needing matchRoutes to be
    // history-aware.
    safelyDecodeURI(pathname));
  }
  return matches;
}
function flattenRoutes(routes, branches, parentsMeta, parentPath) {
  if (branches === void 0) {
    branches = [];
  }
  if (parentsMeta === void 0) {
    parentsMeta = [];
  }
  if (parentPath === void 0) {
    parentPath = "";
  }
  let flattenRoute = (route, index, relativePath) => {
    let meta = {
      relativePath: relativePath === undefined ? route.path || "" : relativePath,
      caseSensitive: route.caseSensitive === true,
      childrenIndex: index,
      route
    };
    if (meta.relativePath.startsWith("/")) {
      invariant(meta.relativePath.startsWith(parentPath), "Absolute route path \"" + meta.relativePath + "\" nested under path " + ("\"" + parentPath + "\" is not valid. An absolute child route path ") + "must start with the combined path of all its parent routes.");
      meta.relativePath = meta.relativePath.slice(parentPath.length);
    }
    let path = joinPaths([parentPath, meta.relativePath]);
    let routesMeta = parentsMeta.concat(meta);
    // Add the children before adding this route to the array, so we traverse the
    // route tree depth-first and child routes appear before their parents in
    // the "flattened" version.
    if (route.children && route.children.length > 0) {
      invariant(
      // Our types know better, but runtime JS may not!
      // @ts-expect-error
      route.index !== true, "Index routes must not have child routes. Please remove " + ("all child routes from route path \"" + path + "\"."));
      flattenRoutes(route.children, branches, routesMeta, path);
    }
    // Routes without a path shouldn't ever match by themselves unless they are
    // index routes, so don't add them to the list of possible branches.
    if (route.path == null && !route.index) {
      return;
    }
    branches.push({
      path,
      score: computeScore(path, route.index),
      routesMeta
    });
  };
  routes.forEach((route, index) => {
    var _route$path;
    // coarse-grain check for optional params
    if (route.path === "" || !((_route$path = route.path) != null && _route$path.includes("?"))) {
      flattenRoute(route, index);
    } else {
      for (let exploded of explodeOptionalSegments(route.path)) {
        flattenRoute(route, index, exploded);
      }
    }
  });
  return branches;
}
/**
 * Computes all combinations of optional path segments for a given path,
 * excluding combinations that are ambiguous and of lower priority.
 *
 * For example, `/one/:two?/three/:four?/:five?` explodes to:
 * - `/one/three`
 * - `/one/:two/three`
 * - `/one/three/:four`
 * - `/one/three/:five`
 * - `/one/:two/three/:four`
 * - `/one/:two/three/:five`
 * - `/one/three/:four/:five`
 * - `/one/:two/three/:four/:five`
 */
function explodeOptionalSegments(path) {
  let segments = path.split("/");
  if (segments.length === 0) return [];
  let [first, ...rest] = segments;
  // Optional path segments are denoted by a trailing `?`
  let isOptional = first.endsWith("?");
  // Compute the corresponding required segment: `foo?` -> `foo`
  let required = first.replace(/\?$/, "");
  if (rest.length === 0) {
    // Intepret empty string as omitting an optional segment
    // `["one", "", "three"]` corresponds to omitting `:two` from `/one/:two?/three` -> `/one/three`
    return isOptional ? [required, ""] : [required];
  }
  let restExploded = explodeOptionalSegments(rest.join("/"));
  let result = [];
  // All child paths with the prefix.  Do this for all children before the
  // optional version for all children, so we get consistent ordering where the
  // parent optional aspect is preferred as required.  Otherwise, we can get
  // child sections interspersed where deeper optional segments are higher than
  // parent optional segments, where for example, /:two would explode _earlier_
  // then /:one.  By always including the parent as required _for all children_
  // first, we avoid this issue
  result.push(...restExploded.map(subpath => subpath === "" ? required : [required, subpath].join("/")));
  // Then, if this is an optional value, add all child versions without
  if (isOptional) {
    result.push(...restExploded);
  }
  // for absolute paths, ensure `/` instead of empty segment
  return result.map(exploded => path.startsWith("/") && exploded === "" ? "/" : exploded);
}
function rankRouteBranches(branches) {
  branches.sort((a, b) => a.score !== b.score ? b.score - a.score // Higher score first
  : compareIndexes(a.routesMeta.map(meta => meta.childrenIndex), b.routesMeta.map(meta => meta.childrenIndex)));
}
const paramRe = /^:\w+$/;
const dynamicSegmentValue = 3;
const indexRouteValue = 2;
const emptySegmentValue = 1;
const staticSegmentValue = 10;
const splatPenalty = -2;
const isSplat = s => s === "*";
function computeScore(path, index) {
  let segments = path.split("/");
  let initialScore = segments.length;
  if (segments.some(isSplat)) {
    initialScore += splatPenalty;
  }
  if (index) {
    initialScore += indexRouteValue;
  }
  return segments.filter(s => !isSplat(s)).reduce((score, segment) => score + (paramRe.test(segment) ? dynamicSegmentValue : segment === "" ? emptySegmentValue : staticSegmentValue), initialScore);
}
function compareIndexes(a, b) {
  let siblings = a.length === b.length && a.slice(0, -1).every((n, i) => n === b[i]);
  return siblings ?
  // If two routes are siblings, we should try to match the earlier sibling
  // first. This allows people to have fine-grained control over the matching
  // behavior by simply putting routes with identical paths in the order they
  // want them tried.
  a[a.length - 1] - b[b.length - 1] :
  // Otherwise, it doesn't really make sense to rank non-siblings by index,
  // so they sort equally.
  0;
}
function matchRouteBranch(branch, pathname) {
  let {
    routesMeta
  } = branch;
  let matchedParams = {};
  let matchedPathname = "/";
  let matches = [];
  for (let i = 0; i < routesMeta.length; ++i) {
    let meta = routesMeta[i];
    let end = i === routesMeta.length - 1;
    let remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/";
    let match = matchPath({
      path: meta.relativePath,
      caseSensitive: meta.caseSensitive,
      end
    }, remainingPathname);
    if (!match) return null;
    Object.assign(matchedParams, match.params);
    let route = meta.route;
    matches.push({
      // TODO: Can this as be avoided?
      params: matchedParams,
      pathname: joinPaths([matchedPathname, match.pathname]),
      pathnameBase: normalizePathname(joinPaths([matchedPathname, match.pathnameBase])),
      route
    });
    if (match.pathnameBase !== "/") {
      matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
    }
  }
  return matches;
}
/**
 * Performs pattern matching on a URL pathname and returns information about
 * the match.
 *
 * @see https://reactrouter.com/utils/match-path
 */
function matchPath(pattern, pathname) {
  if (typeof pattern === "string") {
    pattern = {
      path: pattern,
      caseSensitive: false,
      end: true
    };
  }
  let [matcher, paramNames] = compilePath(pattern.path, pattern.caseSensitive, pattern.end);
  let match = pathname.match(matcher);
  if (!match) return null;
  let matchedPathname = match[0];
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
  let captureGroups = match.slice(1);
  let params = paramNames.reduce((memo, paramName, index) => {
    // We need to compute the pathnameBase here using the raw splat value
    // instead of using params["*"] later because it will be decoded then
    if (paramName === "*") {
      let splatValue = captureGroups[index] || "";
      pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
    }
    memo[paramName] = safelyDecodeURIComponent(captureGroups[index] || "", paramName);
    return memo;
  }, {});
  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern
  };
}
function compilePath(path, caseSensitive, end) {
  if (caseSensitive === void 0) {
    caseSensitive = false;
  }
  if (end === void 0) {
    end = true;
  }
  warning(path === "*" || !path.endsWith("*") || path.endsWith("/*"), "Route path \"" + path + "\" will be treated as if it were " + ("\"" + path.replace(/\*$/, "/*") + "\" because the `*` character must ") + "always follow a `/` in the pattern. To get rid of this warning, " + ("please change the route path to \"" + path.replace(/\*$/, "/*") + "\"."));
  let paramNames = [];
  let regexpSource = "^" + path.replace(/\/*\*?$/, "") // Ignore trailing / and /*, we'll handle it below
  .replace(/^\/*/, "/") // Make sure it has a leading /
  .replace(/[\\.*+^$?{}|()[\]]/g, "\\$&") // Escape special regex chars
  .replace(/\/:(\w+)/g, (_, paramName) => {
    paramNames.push(paramName);
    return "/([^\\/]+)";
  });
  if (path.endsWith("*")) {
    paramNames.push("*");
    regexpSource += path === "*" || path === "/*" ? "(.*)$" // Already matched the initial /, just match the rest
    : "(?:\\/(.+)|\\/*)$"; // Don't include the / in params["*"]
  } else if (end) {
    // When matching to the end, ignore trailing slashes
    regexpSource += "\\/*$";
  } else if (path !== "" && path !== "/") {
    // If our path is non-empty and contains anything beyond an initial slash,
    // then we have _some_ form of path in our regex, so we should expect to
    // match only if we find the end of this path segment.  Look for an optional
    // non-captured trailing slash (to match a portion of the URL) or the end
    // of the path (if we've matched to the end).  We used to do this with a
    // word boundary but that gives false positives on routes like
    // /user-preferences since `-` counts as a word boundary.
    regexpSource += "(?:(?=\\/|$))";
  } else ;
  let matcher = new RegExp(regexpSource, caseSensitive ? undefined : "i");
  return [matcher, paramNames];
}
function safelyDecodeURI(value) {
  try {
    return decodeURI(value);
  } catch (error) {
    warning(false, "The URL path \"" + value + "\" could not be decoded because it is is a " + "malformed URL segment. This is probably due to a bad percent " + ("encoding (" + error + ")."));
    return value;
  }
}
function safelyDecodeURIComponent(value, paramName) {
  try {
    return decodeURIComponent(value);
  } catch (error) {
    warning(false, "The value for the URL param \"" + paramName + "\" will not be decoded because" + (" the string \"" + value + "\" is a malformed URL segment. This is probably") + (" due to a bad percent encoding (" + error + ")."));
    return value;
  }
}
/**
 * @private
 */
function stripBasename(pathname, basename) {
  if (basename === "/") return pathname;
  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }
  // We want to leave trailing slash behavior in the user's control, so if they
  // specify a basename with a trailing slash, we should support it
  let startIndex = basename.endsWith("/") ? basename.length - 1 : basename.length;
  let nextChar = pathname.charAt(startIndex);
  if (nextChar && nextChar !== "/") {
    // pathname does not start with basename/
    return null;
  }
  return pathname.slice(startIndex) || "/";
}
/**
 * Returns a resolved path object relative to the given pathname.
 *
 * @see https://reactrouter.com/utils/resolve-path
 */
function resolvePath(to, fromPathname) {
  if (fromPathname === void 0) {
    fromPathname = "/";
  }
  let {
    pathname: toPathname,
    search = "",
    hash = ""
  } = typeof to === "string" ? parsePath(to) : to;
  let pathname = toPathname ? toPathname.startsWith("/") ? toPathname : resolvePathname(toPathname, fromPathname) : fromPathname;
  return {
    pathname,
    search: normalizeSearch(search),
    hash: normalizeHash(hash)
  };
}
function resolvePathname(relativePath, fromPathname) {
  let segments = fromPathname.replace(/\/+$/, "").split("/");
  let relativeSegments = relativePath.split("/");
  relativeSegments.forEach(segment => {
    if (segment === "..") {
      // Keep the root "" segment so the pathname starts at /
      if (segments.length > 1) segments.pop();
    } else if (segment !== ".") {
      segments.push(segment);
    }
  });
  return segments.length > 1 ? segments.join("/") : "/";
}
function getInvalidPathError(char, field, dest, path) {
  return "Cannot include a '" + char + "' character in a manually specified " + ("`to." + field + "` field [" + JSON.stringify(path) + "].  Please separate it out to the ") + ("`to." + dest + "` field. Alternatively you may provide the full path as ") + "a string in <Link to=\"...\"> and the router will parse it for you.";
}
/**
 * @private
 *
 * When processing relative navigation we want to ignore ancestor routes that
 * do not contribute to the path, such that index/pathless layout routes don't
 * interfere.
 *
 * For example, when moving a route element into an index route and/or a
 * pathless layout route, relative link behavior contained within should stay
 * the same.  Both of the following examples should link back to the root:
 *
 *   <Route path="/">
 *     <Route path="accounts" element={<Link to=".."}>
 *   </Route>
 *
 *   <Route path="/">
 *     <Route path="accounts">
 *       <Route element={<AccountsLayout />}>       // <-- Does not contribute
 *         <Route index element={<Link to=".."} />  // <-- Does not contribute
 *       </Route
 *     </Route>
 *   </Route>
 */
function getPathContributingMatches(matches) {
  return matches.filter((match, index) => index === 0 || match.route.path && match.route.path.length > 0);
}
/**
 * @private
 */
function resolveTo(toArg, routePathnames, locationPathname, isPathRelative) {
  if (isPathRelative === void 0) {
    isPathRelative = false;
  }
  let to;
  if (typeof toArg === "string") {
    to = parsePath(toArg);
  } else {
    to = _extends$2({}, toArg);
    invariant(!to.pathname || !to.pathname.includes("?"), getInvalidPathError("?", "pathname", "search", to));
    invariant(!to.pathname || !to.pathname.includes("#"), getInvalidPathError("#", "pathname", "hash", to));
    invariant(!to.search || !to.search.includes("#"), getInvalidPathError("#", "search", "hash", to));
  }
  let isEmptyPath = toArg === "" || to.pathname === "";
  let toPathname = isEmptyPath ? "/" : to.pathname;
  let from;
  // Routing is relative to the current pathname if explicitly requested.
  //
  // If a pathname is explicitly provided in `to`, it should be relative to the
  // route context. This is explained in `Note on `<Link to>` values` in our
  // migration guide from v5 as a means of disambiguation between `to` values
  // that begin with `/` and those that do not. However, this is problematic for
  // `to` values that do not provide a pathname. `to` can simply be a search or
  // hash string, in which case we should assume that the navigation is relative
  // to the current location's pathname and *not* the route pathname.
  if (isPathRelative || toPathname == null) {
    from = locationPathname;
  } else {
    let routePathnameIndex = routePathnames.length - 1;
    if (toPathname.startsWith("..")) {
      let toSegments = toPathname.split("/");
      // Each leading .. segment means "go up one route" instead of "go up one
      // URL segment".  This is a key difference from how <a href> works and a
      // major reason we call this a "to" value instead of a "href".
      while (toSegments[0] === "..") {
        toSegments.shift();
        routePathnameIndex -= 1;
      }
      to.pathname = toSegments.join("/");
    }
    // If there are more ".." segments than parent routes, resolve relative to
    // the root / URL.
    from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : "/";
  }
  let path = resolvePath(to, from);
  // Ensure the pathname has a trailing slash if the original "to" had one
  let hasExplicitTrailingSlash = toPathname && toPathname !== "/" && toPathname.endsWith("/");
  // Or if this was a link to the current path which has a trailing slash
  let hasCurrentTrailingSlash = (isEmptyPath || toPathname === ".") && locationPathname.endsWith("/");
  if (!path.pathname.endsWith("/") && (hasExplicitTrailingSlash || hasCurrentTrailingSlash)) {
    path.pathname += "/";
  }
  return path;
}
/**
 * @private
 */
const joinPaths = paths => paths.join("/").replace(/\/\/+/g, "/");
/**
 * @private
 */
const normalizePathname = pathname => pathname.replace(/\/+$/, "").replace(/^\/*/, "/");
/**
 * @private
 */
const normalizeSearch = search => !search || search === "?" ? "" : search.startsWith("?") ? search : "?" + search;
/**
 * @private
 */
const normalizeHash = hash => !hash || hash === "#" ? "" : hash.startsWith("#") ? hash : "#" + hash;
class AbortedDeferredError extends Error {}
/**
 * Check if the given error is an ErrorResponse generated from a 4xx/5xx
 * Response thrown from an action/loader
 */
function isRouteErrorResponse(error) {
  return error != null && typeof error.status === "number" && typeof error.statusText === "string" && typeof error.internal === "boolean" && "data" in error;
}

const validMutationMethodsArr = ["post", "put", "patch", "delete"];
new Set(validMutationMethodsArr);
const validRequestMethodsArr = ["get", ...validMutationMethodsArr];
new Set(validRequestMethodsArr);

/**
 * React Router v6.16.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
const React$2 = await importShared('react');

function _extends$1() {
  _extends$1 = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$1.apply(this, arguments);
}

// Create react-specific types from the agnostic types in @remix-run/router to
// export from react-router
const DataRouterContext = /*#__PURE__*/React$2.createContext(null);
const DataRouterStateContext = /*#__PURE__*/React$2.createContext(null);
const AwaitContext = /*#__PURE__*/React$2.createContext(null);

/**
 * A Navigator is a "location changer"; it's how you get to different locations.
 *
 * Every history instance conforms to the Navigator interface, but the
 * distinction is useful primarily when it comes to the low-level <Router> API
 * where both the location and a navigator must be provided separately in order
 * to avoid "tearing" that may occur in a suspense-enabled app if the action
 * and/or location were to be read directly from the history instance.
 */

const NavigationContext = /*#__PURE__*/React$2.createContext(null);
const LocationContext = /*#__PURE__*/React$2.createContext(null);
const RouteContext = /*#__PURE__*/React$2.createContext({
  outlet: null,
  matches: [],
  isDataRoute: false
});
const RouteErrorContext = /*#__PURE__*/React$2.createContext(null);

/**
 * Returns the full href for the given "to" value. This is useful for building
 * custom links that are also accessible and preserve right-click behavior.
 *
 * @see https://reactrouter.com/hooks/use-href
 */
function useHref(to, _temp) {
  let {
    relative
  } = _temp === void 0 ? {} : _temp;
  !useInRouterContext() ? invariant(false) : void 0;
  let {
    basename,
    navigator
  } = React$2.useContext(NavigationContext);
  let {
    hash,
    pathname,
    search
  } = useResolvedPath(to, {
    relative
  });
  let joinedPathname = pathname;

  // If we're operating within a basename, prepend it to the pathname prior
  // to creating the href.  If this is a root navigation, then just use the raw
  // basename which allows the basename to have full control over the presence
  // of a trailing slash on root links
  if (basename !== "/") {
    joinedPathname = pathname === "/" ? basename : joinPaths([basename, pathname]);
  }
  return navigator.createHref({
    pathname: joinedPathname,
    search,
    hash
  });
}

/**
 * Returns true if this component is a descendant of a <Router>.
 *
 * @see https://reactrouter.com/hooks/use-in-router-context
 */
function useInRouterContext() {
  return React$2.useContext(LocationContext) != null;
}

/**
 * Returns the current location object, which represents the current URL in web
 * browsers.
 *
 * Note: If you're using this it may mean you're doing some of your own
 * "routing" in your app, and we'd like to know what your use case is. We may
 * be able to provide something higher-level to better suit your needs.
 *
 * @see https://reactrouter.com/hooks/use-location
 */
function useLocation() {
  !useInRouterContext() ? invariant(false) : void 0;
  return React$2.useContext(LocationContext).location;
}

// Mute warnings for calls to useNavigate in SSR environments
function useIsomorphicLayoutEffect(cb) {
  let isStatic = React$2.useContext(NavigationContext).static;
  if (!isStatic) {
    // We should be able to get rid of this once react 18.3 is released
    // See: https://github.com/facebook/react/pull/26395
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React$2.useLayoutEffect(cb);
  }
}

/**
 * Returns an imperative method for changing the location. Used by <Link>s, but
 * may also be used by other elements to change the location.
 *
 * @see https://reactrouter.com/hooks/use-navigate
 */
function useNavigate() {
  let {
    isDataRoute
  } = React$2.useContext(RouteContext);
  // Conditional usage is OK here because the usage of a data router is static
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return isDataRoute ? useNavigateStable() : useNavigateUnstable();
}
function useNavigateUnstable() {
  !useInRouterContext() ? invariant(false) : void 0;
  let dataRouterContext = React$2.useContext(DataRouterContext);
  let {
    basename,
    navigator
  } = React$2.useContext(NavigationContext);
  let {
    matches
  } = React$2.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let routePathnamesJson = JSON.stringify(getPathContributingMatches(matches).map(match => match.pathnameBase));
  let activeRef = React$2.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = React$2.useCallback(function (to, options) {
    if (options === void 0) {
      options = {};
    }

    // Short circuit here since if this happens on first render the navigate
    // is useless because we haven't wired up our history listener yet
    if (!activeRef.current) return;
    if (typeof to === "number") {
      navigator.go(to);
      return;
    }
    let path = resolveTo(to, JSON.parse(routePathnamesJson), locationPathname, options.relative === "path");

    // If we're operating within a basename, prepend it to the pathname prior
    // to handing off to history (but only if we're not in a data router,
    // otherwise it'll prepend the basename inside of the router).
    // If this is a root navigation, then we navigate to the raw basename
    // which allows the basename to have full control over the presence of a
    // trailing slash on root links
    if (dataRouterContext == null && basename !== "/") {
      path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
    }
    (!!options.replace ? navigator.replace : navigator.push)(path, options.state, options);
  }, [basename, navigator, routePathnamesJson, locationPathname, dataRouterContext]);
  return navigate;
}
const OutletContext = /*#__PURE__*/React$2.createContext(null);

/**
 * Returns the element for the child route at this level of the route
 * hierarchy. Used internally by <Outlet> to render child routes.
 *
 * @see https://reactrouter.com/hooks/use-outlet
 */
function useOutlet(context) {
  let outlet = React$2.useContext(RouteContext).outlet;
  if (outlet) {
    return /*#__PURE__*/React$2.createElement(OutletContext.Provider, {
      value: context
    }, outlet);
  }
  return outlet;
}

/**
 * Resolves the pathname of the given `to` value against the current location.
 *
 * @see https://reactrouter.com/hooks/use-resolved-path
 */
function useResolvedPath(to, _temp2) {
  let {
    relative
  } = _temp2 === void 0 ? {} : _temp2;
  let {
    matches
  } = React$2.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let routePathnamesJson = JSON.stringify(getPathContributingMatches(matches).map(match => match.pathnameBase));
  return React$2.useMemo(() => resolveTo(to, JSON.parse(routePathnamesJson), locationPathname, relative === "path"), [to, routePathnamesJson, locationPathname, relative]);
}

/**
 * Returns the element of the route that matched the current location, prepared
 * with the correct context to render the remainder of the route tree. Route
 * elements in the tree must render an <Outlet> to render their child route's
 * element.
 *
 * @see https://reactrouter.com/hooks/use-routes
 */
function useRoutes(routes, locationArg) {
  return useRoutesImpl(routes, locationArg);
}

// Internal implementation with accept optional param for RouterProvider usage
function useRoutesImpl(routes, locationArg, dataRouterState) {
  !useInRouterContext() ? invariant(false) : void 0;
  let {
    navigator
  } = React$2.useContext(NavigationContext);
  let {
    matches: parentMatches
  } = React$2.useContext(RouteContext);
  let routeMatch = parentMatches[parentMatches.length - 1];
  let parentParams = routeMatch ? routeMatch.params : {};
  routeMatch ? routeMatch.pathname : "/";
  let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
  routeMatch && routeMatch.route;
  let locationFromContext = useLocation();
  let location;
  if (locationArg) {
    var _parsedLocationArg$pa;
    let parsedLocationArg = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
    !(parentPathnameBase === "/" || ((_parsedLocationArg$pa = parsedLocationArg.pathname) == null ? void 0 : _parsedLocationArg$pa.startsWith(parentPathnameBase))) ? invariant(false) : void 0;
    location = parsedLocationArg;
  } else {
    location = locationFromContext;
  }
  let pathname = location.pathname || "/";
  let remainingPathname = parentPathnameBase === "/" ? pathname : pathname.slice(parentPathnameBase.length) || "/";
  let matches = matchRoutes(routes, {
    pathname: remainingPathname
  });
  let renderedMatches = _renderMatches(matches && matches.map(match => Object.assign({}, match, {
    params: Object.assign({}, parentParams, match.params),
    pathname: joinPaths([parentPathnameBase,
    // Re-encode pathnames that were decoded inside matchRoutes
    navigator.encodeLocation ? navigator.encodeLocation(match.pathname).pathname : match.pathname]),
    pathnameBase: match.pathnameBase === "/" ? parentPathnameBase : joinPaths([parentPathnameBase,
    // Re-encode pathnames that were decoded inside matchRoutes
    navigator.encodeLocation ? navigator.encodeLocation(match.pathnameBase).pathname : match.pathnameBase])
  })), parentMatches, dataRouterState);

  // When a user passes in a `locationArg`, the associated routes need to
  // be wrapped in a new `LocationContext.Provider` in order for `useLocation`
  // to use the scoped location instead of the global location.
  if (locationArg && renderedMatches) {
    return /*#__PURE__*/React$2.createElement(LocationContext.Provider, {
      value: {
        location: _extends$1({
          pathname: "/",
          search: "",
          hash: "",
          state: null,
          key: "default"
        }, location),
        navigationType: Action.Pop
      }
    }, renderedMatches);
  }
  return renderedMatches;
}
function DefaultErrorComponent() {
  let error = useRouteError();
  let message = isRouteErrorResponse(error) ? error.status + " " + error.statusText : error instanceof Error ? error.message : JSON.stringify(error);
  let stack = error instanceof Error ? error.stack : null;
  let lightgrey = "rgba(200,200,200, 0.5)";
  let preStyles = {
    padding: "0.5rem",
    backgroundColor: lightgrey
  };
  let devInfo = null;
  return /*#__PURE__*/React$2.createElement(React$2.Fragment, null, /*#__PURE__*/React$2.createElement("h2", null, "Unexpected Application Error!"), /*#__PURE__*/React$2.createElement("h3", {
    style: {
      fontStyle: "italic"
    }
  }, message), stack ? /*#__PURE__*/React$2.createElement("pre", {
    style: preStyles
  }, stack) : null, devInfo);
}
const defaultErrorElement = /*#__PURE__*/React$2.createElement(DefaultErrorComponent, null);
class RenderErrorBoundary extends React$2.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: props.location,
      revalidation: props.revalidation,
      error: props.error
    };
  }
  static getDerivedStateFromError(error) {
    return {
      error: error
    };
  }
  static getDerivedStateFromProps(props, state) {
    // When we get into an error state, the user will likely click "back" to the
    // previous page that didn't have an error. Because this wraps the entire
    // application, that will have no effect--the error page continues to display.
    // This gives us a mechanism to recover from the error when the location changes.
    //
    // Whether we're in an error state or not, we update the location in state
    // so that when we are in an error state, it gets reset when a new location
    // comes in and the user recovers from the error.
    if (state.location !== props.location || state.revalidation !== "idle" && props.revalidation === "idle") {
      return {
        error: props.error,
        location: props.location,
        revalidation: props.revalidation
      };
    }

    // If we're not changing locations, preserve the location but still surface
    // any new errors that may come through. We retain the existing error, we do
    // this because the error provided from the app state may be cleared without
    // the location changing.
    return {
      error: props.error || state.error,
      location: state.location,
      revalidation: props.revalidation || state.revalidation
    };
  }
  componentDidCatch(error, errorInfo) {
    console.error("React Router caught the following error during render", error, errorInfo);
  }
  render() {
    return this.state.error ? /*#__PURE__*/React$2.createElement(RouteContext.Provider, {
      value: this.props.routeContext
    }, /*#__PURE__*/React$2.createElement(RouteErrorContext.Provider, {
      value: this.state.error,
      children: this.props.component
    })) : this.props.children;
  }
}
function RenderedRoute(_ref) {
  let {
    routeContext,
    match,
    children
  } = _ref;
  let dataRouterContext = React$2.useContext(DataRouterContext);

  // Track how deep we got in our render pass to emulate SSR componentDidCatch
  // in a DataStaticRouter
  if (dataRouterContext && dataRouterContext.static && dataRouterContext.staticContext && (match.route.errorElement || match.route.ErrorBoundary)) {
    dataRouterContext.staticContext._deepestRenderedBoundaryId = match.route.id;
  }
  return /*#__PURE__*/React$2.createElement(RouteContext.Provider, {
    value: routeContext
  }, children);
}
function _renderMatches(matches, parentMatches, dataRouterState) {
  var _dataRouterState2;
  if (parentMatches === void 0) {
    parentMatches = [];
  }
  if (dataRouterState === void 0) {
    dataRouterState = null;
  }
  if (matches == null) {
    var _dataRouterState;
    if ((_dataRouterState = dataRouterState) != null && _dataRouterState.errors) {
      // Don't bail if we have data router errors so we can render them in the
      // boundary.  Use the pre-matched (or shimmed) matches
      matches = dataRouterState.matches;
    } else {
      return null;
    }
  }
  let renderedMatches = matches;

  // If we have data errors, trim matches to the highest error boundary
  let errors = (_dataRouterState2 = dataRouterState) == null ? void 0 : _dataRouterState2.errors;
  if (errors != null) {
    let errorIndex = renderedMatches.findIndex(m => m.route.id && (errors == null ? void 0 : errors[m.route.id]));
    !(errorIndex >= 0) ? invariant(false) : void 0;
    renderedMatches = renderedMatches.slice(0, Math.min(renderedMatches.length, errorIndex + 1));
  }
  return renderedMatches.reduceRight((outlet, match, index) => {
    let error = match.route.id ? errors == null ? void 0 : errors[match.route.id] : null;
    // Only data routers handle errors
    let errorElement = null;
    if (dataRouterState) {
      errorElement = match.route.errorElement || defaultErrorElement;
    }
    let matches = parentMatches.concat(renderedMatches.slice(0, index + 1));
    let getChildren = () => {
      let children;
      if (error) {
        children = errorElement;
      } else if (match.route.Component) {
        // Note: This is a de-optimized path since React won't re-use the
        // ReactElement since it's identity changes with each new
        // React.createElement call.  We keep this so folks can use
        // `<Route Component={...}>` in `<Routes>` but generally `Component`
        // usage is only advised in `RouterProvider` when we can convert it to
        // `element` ahead of time.
        children = /*#__PURE__*/React$2.createElement(match.route.Component, null);
      } else if (match.route.element) {
        children = match.route.element;
      } else {
        children = outlet;
      }
      return /*#__PURE__*/React$2.createElement(RenderedRoute, {
        match: match,
        routeContext: {
          outlet,
          matches,
          isDataRoute: dataRouterState != null
        },
        children: children
      });
    };
    // Only wrap in an error boundary within data router usages when we have an
    // ErrorBoundary/errorElement on this route.  Otherwise let it bubble up to
    // an ancestor ErrorBoundary/errorElement
    return dataRouterState && (match.route.ErrorBoundary || match.route.errorElement || index === 0) ? /*#__PURE__*/React$2.createElement(RenderErrorBoundary, {
      location: dataRouterState.location,
      revalidation: dataRouterState.revalidation,
      component: errorElement,
      error: error,
      children: getChildren(),
      routeContext: {
        outlet: null,
        matches,
        isDataRoute: true
      }
    }) : getChildren();
  }, null);
}
var DataRouterHook$1 = /*#__PURE__*/function (DataRouterHook) {
  DataRouterHook["UseBlocker"] = "useBlocker";
  DataRouterHook["UseRevalidator"] = "useRevalidator";
  DataRouterHook["UseNavigateStable"] = "useNavigate";
  return DataRouterHook;
}(DataRouterHook$1 || {});
var DataRouterStateHook$1 = /*#__PURE__*/function (DataRouterStateHook) {
  DataRouterStateHook["UseBlocker"] = "useBlocker";
  DataRouterStateHook["UseLoaderData"] = "useLoaderData";
  DataRouterStateHook["UseActionData"] = "useActionData";
  DataRouterStateHook["UseRouteError"] = "useRouteError";
  DataRouterStateHook["UseNavigation"] = "useNavigation";
  DataRouterStateHook["UseRouteLoaderData"] = "useRouteLoaderData";
  DataRouterStateHook["UseMatches"] = "useMatches";
  DataRouterStateHook["UseRevalidator"] = "useRevalidator";
  DataRouterStateHook["UseNavigateStable"] = "useNavigate";
  DataRouterStateHook["UseRouteId"] = "useRouteId";
  return DataRouterStateHook;
}(DataRouterStateHook$1 || {});
function useDataRouterContext(hookName) {
  let ctx = React$2.useContext(DataRouterContext);
  !ctx ? invariant(false) : void 0;
  return ctx;
}
function useDataRouterState(hookName) {
  let state = React$2.useContext(DataRouterStateContext);
  !state ? invariant(false) : void 0;
  return state;
}
function useRouteContext(hookName) {
  let route = React$2.useContext(RouteContext);
  !route ? invariant(false) : void 0;
  return route;
}

// Internal version with hookName-aware debugging
function useCurrentRouteId(hookName) {
  let route = useRouteContext();
  let thisRoute = route.matches[route.matches.length - 1];
  !thisRoute.route.id ? invariant(false) : void 0;
  return thisRoute.route.id;
}

/**
 * Returns the nearest ancestor Route error, which could be a loader/action
 * error or a render error.  This is intended to be called from your
 * ErrorBoundary/errorElement to display a proper error message.
 */
function useRouteError() {
  var _state$errors;
  let error = React$2.useContext(RouteErrorContext);
  let state = useDataRouterState(DataRouterStateHook$1.UseRouteError);
  let routeId = useCurrentRouteId(DataRouterStateHook$1.UseRouteError);

  // If this was a render error, we put it in a RouteError context inside
  // of RenderErrorBoundary
  if (error) {
    return error;
  }

  // Otherwise look for errors from our data router state
  return (_state$errors = state.errors) == null ? void 0 : _state$errors[routeId];
}

/**
 * Stable version of useNavigate that is used when we are in the context of
 * a RouterProvider.
 */
function useNavigateStable() {
  let {
    router
  } = useDataRouterContext(DataRouterHook$1.UseNavigateStable);
  let id = useCurrentRouteId(DataRouterStateHook$1.UseNavigateStable);
  let activeRef = React$2.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = React$2.useCallback(function (to, options) {
    if (options === void 0) {
      options = {};
    }

    // Short circuit here since if this happens on first render the navigate
    // is useless because we haven't wired up our router subscriber yet
    if (!activeRef.current) return;
    if (typeof to === "number") {
      router.navigate(to);
    } else {
      router.navigate(to, _extends$1({
        fromRouteId: id
      }, options));
    }
  }, [router, id]);
  return navigate;
}

/**
  Webpack + React 17 fails to compile on any of the following because webpack
  complains that `startTransition` doesn't exist in `React`:
  * import { startTransition } from "react"
  * import * as React from from "react";
    "startTransition" in React ? React.startTransition(() => setState()) : setState()
  * import * as React from from "react";
    "startTransition" in React ? React["startTransition"](() => setState()) : setState()

  Moving it to a constant such as the following solves the Webpack/React 17 issue:
  * import * as React from from "react";
    const START_TRANSITION = "startTransition";
    START_TRANSITION in React ? React[START_TRANSITION](() => setState()) : setState()

  However, that introduces webpack/terser minification issues in production builds
  in React 18 where minification/obfuscation ends up removing the call of
  React.startTransition entirely from the first half of the ternary.  Grabbing
  this exported reference once up front resolves that issue.

  See https://github.com/remix-run/react-router/issues/10579
*/
const START_TRANSITION$1 = "startTransition";
React$2[START_TRANSITION$1];
/**
 * Renders the child route's element, if there is one.
 *
 * @see https://reactrouter.com/components/outlet
 */
function Outlet(props) {
  return useOutlet(props.context);
}
/**
 * Declares an element that should be rendered at a certain URL path.
 *
 * @see https://reactrouter.com/components/route
 */
function Route(_props) {
  invariant(false) ;
}
/**
 * Provides location context for the rest of the app.
 *
 * Note: You usually won't render a <Router> directly. Instead, you'll render a
 * router that is more specific to your environment such as a <BrowserRouter>
 * in web browsers or a <StaticRouter> for server rendering.
 *
 * @see https://reactrouter.com/router-components/router
 */
function Router(_ref5) {
  let {
    basename: basenameProp = "/",
    children = null,
    location: locationProp,
    navigationType = Action.Pop,
    navigator,
    static: staticProp = false
  } = _ref5;
  !!useInRouterContext() ? invariant(false) : void 0;

  // Preserve trailing slashes on basename, so we can let the user control
  // the enforcement of trailing slashes throughout the app
  let basename = basenameProp.replace(/^\/*/, "/");
  let navigationContext = React$2.useMemo(() => ({
    basename,
    navigator,
    static: staticProp
  }), [basename, navigator, staticProp]);
  if (typeof locationProp === "string") {
    locationProp = parsePath(locationProp);
  }
  let {
    pathname = "/",
    search = "",
    hash = "",
    state = null,
    key = "default"
  } = locationProp;
  let locationContext = React$2.useMemo(() => {
    let trailingPathname = stripBasename(pathname, basename);
    if (trailingPathname == null) {
      return null;
    }
    return {
      location: {
        pathname: trailingPathname,
        search,
        hash,
        state,
        key
      },
      navigationType
    };
  }, [basename, pathname, search, hash, state, key, navigationType]);
  if (locationContext == null) {
    return null;
  }
  return /*#__PURE__*/React$2.createElement(NavigationContext.Provider, {
    value: navigationContext
  }, /*#__PURE__*/React$2.createElement(LocationContext.Provider, {
    children: children,
    value: locationContext
  }));
}
/**
 * A container for a nested tree of <Route> elements that renders the branch
 * that best matches the current location.
 *
 * @see https://reactrouter.com/components/routes
 */
function Routes(_ref6) {
  let {
    children,
    location
  } = _ref6;
  return useRoutes(createRoutesFromChildren(children), location);
}
var AwaitRenderStatus = /*#__PURE__*/function (AwaitRenderStatus) {
  AwaitRenderStatus[AwaitRenderStatus["pending"] = 0] = "pending";
  AwaitRenderStatus[AwaitRenderStatus["success"] = 1] = "success";
  AwaitRenderStatus[AwaitRenderStatus["error"] = 2] = "error";
  return AwaitRenderStatus;
}(AwaitRenderStatus || {});
const neverSettledPromise = new Promise(() => {});
class AwaitErrorBoundary extends React$2.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
  }
  static getDerivedStateFromError(error) {
    return {
      error
    };
  }
  componentDidCatch(error, errorInfo) {
    console.error("<Await> caught the following error during render", error, errorInfo);
  }
  render() {
    let {
      children,
      errorElement,
      resolve
    } = this.props;
    let promise = null;
    let status = AwaitRenderStatus.pending;
    if (!(resolve instanceof Promise)) {
      // Didn't get a promise - provide as a resolved promise
      status = AwaitRenderStatus.success;
      promise = Promise.resolve();
      Object.defineProperty(promise, "_tracked", {
        get: () => true
      });
      Object.defineProperty(promise, "_data", {
        get: () => resolve
      });
    } else if (this.state.error) {
      // Caught a render error, provide it as a rejected promise
      status = AwaitRenderStatus.error;
      let renderError = this.state.error;
      promise = Promise.reject().catch(() => {}); // Avoid unhandled rejection warnings
      Object.defineProperty(promise, "_tracked", {
        get: () => true
      });
      Object.defineProperty(promise, "_error", {
        get: () => renderError
      });
    } else if (resolve._tracked) {
      // Already tracked promise - check contents
      promise = resolve;
      status = promise._error !== undefined ? AwaitRenderStatus.error : promise._data !== undefined ? AwaitRenderStatus.success : AwaitRenderStatus.pending;
    } else {
      // Raw (untracked) promise - track it
      status = AwaitRenderStatus.pending;
      Object.defineProperty(resolve, "_tracked", {
        get: () => true
      });
      promise = resolve.then(data => Object.defineProperty(resolve, "_data", {
        get: () => data
      }), error => Object.defineProperty(resolve, "_error", {
        get: () => error
      }));
    }
    if (status === AwaitRenderStatus.error && promise._error instanceof AbortedDeferredError) {
      // Freeze the UI by throwing a never resolved promise
      throw neverSettledPromise;
    }
    if (status === AwaitRenderStatus.error && !errorElement) {
      // No errorElement, throw to the nearest route-level error boundary
      throw promise._error;
    }
    if (status === AwaitRenderStatus.error) {
      // Render via our errorElement
      return /*#__PURE__*/React$2.createElement(AwaitContext.Provider, {
        value: promise,
        children: errorElement
      });
    }
    if (status === AwaitRenderStatus.success) {
      // Render children with resolved value
      return /*#__PURE__*/React$2.createElement(AwaitContext.Provider, {
        value: promise,
        children: children
      });
    }

    // Throw to the suspense boundary
    throw promise;
  }
}

///////////////////////////////////////////////////////////////////////////////
// UTILS
///////////////////////////////////////////////////////////////////////////////

/**
 * Creates a route config from a React "children" object, which is usually
 * either a `<Route>` element or an array of them. Used internally by
 * `<Routes>` to create a route config from its children.
 *
 * @see https://reactrouter.com/utils/create-routes-from-children
 */
function createRoutesFromChildren(children, parentPath) {
  if (parentPath === void 0) {
    parentPath = [];
  }
  let routes = [];
  React$2.Children.forEach(children, (element, index) => {
    if (! /*#__PURE__*/React$2.isValidElement(element)) {
      // Ignore non-elements. This allows people to more easily inline
      // conditionals in their route config.
      return;
    }
    let treePath = [...parentPath, index];
    if (element.type === React$2.Fragment) {
      // Transparently support React.Fragment and its children.
      routes.push.apply(routes, createRoutesFromChildren(element.props.children, treePath));
      return;
    }
    !(element.type === Route) ? invariant(false) : void 0;
    !(!element.props.index || !element.props.children) ? invariant(false) : void 0;
    let route = {
      id: element.props.id || treePath.join("-"),
      caseSensitive: element.props.caseSensitive,
      element: element.props.element,
      Component: element.props.Component,
      index: element.props.index,
      path: element.props.path,
      loader: element.props.loader,
      action: element.props.action,
      errorElement: element.props.errorElement,
      ErrorBoundary: element.props.ErrorBoundary,
      hasErrorBoundary: element.props.ErrorBoundary != null || element.props.errorElement != null,
      shouldRevalidate: element.props.shouldRevalidate,
      handle: element.props.handle,
      lazy: element.props.lazy
    };
    if (element.props.children) {
      route.children = createRoutesFromChildren(element.props.children, treePath);
    }
    routes.push(route);
  });
  return routes;
}

/**
 * React Router DOM v6.16.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
const React$1 = await importShared('react');

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
function shouldProcessLinkClick(event, target) {
  return event.button === 0 && (
  // Ignore everything but left clicks
  !target || target === "_self") &&
  // Let browser handle "target=_blank" etc.
  !isModifiedEvent(event) // Ignore clicks with modifier keys
  ;
}

const _excluded = ["onClick", "relative", "reloadDocument", "replace", "state", "target", "to", "preventScrollReset"];
//#endregion
////////////////////////////////////////////////////////////////////////////////
//#region Components
////////////////////////////////////////////////////////////////////////////////
/**
  Webpack + React 17 fails to compile on any of the following because webpack
  complains that `startTransition` doesn't exist in `React`:
  * import { startTransition } from "react"
  * import * as React from from "react";
    "startTransition" in React ? React.startTransition(() => setState()) : setState()
  * import * as React from from "react";
    "startTransition" in React ? React["startTransition"](() => setState()) : setState()

  Moving it to a constant such as the following solves the Webpack/React 17 issue:
  * import * as React from from "react";
    const START_TRANSITION = "startTransition";
    START_TRANSITION in React ? React[START_TRANSITION](() => setState()) : setState()

  However, that introduces webpack/terser minification issues in production builds
  in React 18 where minification/obfuscation ends up removing the call of
  React.startTransition entirely from the first half of the ternary.  Grabbing
  this exported reference once up front resolves that issue.

  See https://github.com/remix-run/react-router/issues/10579
*/
const START_TRANSITION = "startTransition";
const startTransitionImpl = React$1[START_TRANSITION];
/**
 * A `<Router>` for use in web browsers. Provides the cleanest URLs.
 */
function BrowserRouter(_ref) {
  let {
    basename,
    children,
    future,
    window
  } = _ref;
  let historyRef = React$1.useRef();
  if (historyRef.current == null) {
    historyRef.current = createBrowserHistory({
      window,
      v5Compat: true
    });
  }
  let history = historyRef.current;
  let [state, setStateImpl] = React$1.useState({
    action: history.action,
    location: history.location
  });
  let {
    v7_startTransition
  } = future || {};
  let setState = React$1.useCallback(newState => {
    v7_startTransition && startTransitionImpl ? startTransitionImpl(() => setStateImpl(newState)) : setStateImpl(newState);
  }, [setStateImpl, v7_startTransition]);
  React$1.useLayoutEffect(() => history.listen(setState), [history, setState]);
  return /*#__PURE__*/React$1.createElement(Router, {
    basename: basename,
    children: children,
    location: state.location,
    navigationType: state.action,
    navigator: history
  });
}
const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
const ABSOLUTE_URL_REGEX = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
/**
 * The public API for rendering a history-aware <a>.
 */
const Link = /*#__PURE__*/React$1.forwardRef(function LinkWithRef(_ref4, ref) {
  let {
      onClick,
      relative,
      reloadDocument,
      replace,
      state,
      target,
      to,
      preventScrollReset
    } = _ref4,
    rest = _objectWithoutPropertiesLoose(_ref4, _excluded);
  let {
    basename
  } = React$1.useContext(NavigationContext);
  // Rendered into <a href> for absolute URLs
  let absoluteHref;
  let isExternal = false;
  if (typeof to === "string" && ABSOLUTE_URL_REGEX.test(to)) {
    // Render the absolute href server- and client-side
    absoluteHref = to;
    // Only check for external origins client-side
    if (isBrowser) {
      try {
        let currentUrl = new URL(window.location.href);
        let targetUrl = to.startsWith("//") ? new URL(currentUrl.protocol + to) : new URL(to);
        let path = stripBasename(targetUrl.pathname, basename);
        if (targetUrl.origin === currentUrl.origin && path != null) {
          // Strip the protocol/origin/basename for same-origin absolute URLs
          to = path + targetUrl.search + targetUrl.hash;
        } else {
          isExternal = true;
        }
      } catch (e) {
      }
    }
  }
  // Rendered into <a href> for relative URLs
  let href = useHref(to, {
    relative
  });
  let internalOnClick = useLinkClickHandler(to, {
    replace,
    state,
    target,
    preventScrollReset,
    relative
  });
  function handleClick(event) {
    if (onClick) onClick(event);
    if (!event.defaultPrevented) {
      internalOnClick(event);
    }
  }
  return (
    /*#__PURE__*/
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    React$1.createElement("a", _extends({}, rest, {
      href: absoluteHref || href,
      onClick: isExternal || reloadDocument ? onClick : handleClick,
      ref: ref,
      target: target
    }))
  );
});
//#endregion
////////////////////////////////////////////////////////////////////////////////
//#region Hooks
////////////////////////////////////////////////////////////////////////////////
var DataRouterHook;
(function (DataRouterHook) {
  DataRouterHook["UseScrollRestoration"] = "useScrollRestoration";
  DataRouterHook["UseSubmit"] = "useSubmit";
  DataRouterHook["UseSubmitFetcher"] = "useSubmitFetcher";
  DataRouterHook["UseFetcher"] = "useFetcher";
})(DataRouterHook || (DataRouterHook = {}));
var DataRouterStateHook;
(function (DataRouterStateHook) {
  DataRouterStateHook["UseFetchers"] = "useFetchers";
  DataRouterStateHook["UseScrollRestoration"] = "useScrollRestoration";
})(DataRouterStateHook || (DataRouterStateHook = {}));
/**
 * Handles the click behavior for router `<Link>` components. This is useful if
 * you need to create custom `<Link>` components with the same click behavior we
 * use in our exported `<Link>`.
 */
function useLinkClickHandler(to, _temp) {
  let {
    target,
    replace: replaceProp,
    state,
    preventScrollReset,
    relative
  } = _temp === void 0 ? {} : _temp;
  let navigate = useNavigate();
  let location = useLocation();
  let path = useResolvedPath(to, {
    relative
  });
  return React$1.useCallback(event => {
    if (shouldProcessLinkClick(event, target)) {
      event.preventDefault();
      // If the URL hasn't changed, a regular <a> will do a replace instead of
      // a push, so do the same here unless the replace prop is explicitly set
      let replace = replaceProp !== undefined ? replaceProp : createPath(location) === createPath(path);
      navigate(to, {
        replace,
        state,
        preventScrollReset,
        relative
      });
    }
  }, [location, navigate, path, replaceProp, state, target, to, preventScrollReset, relative]);
}

const navigation = [
  {
    idx: 0,
    name: "Sample1",
    href: "/Sample1?this=234#",
    icon: HomeIcon$1,
    current: true
  },
  {
    idx: 1,
    name: "Sample2",
    href: "/Sample2",
    icon: UsersIcon$1,
    current: false
  },
  {
    idx: 2,
    name: "Sample3",
    href: "/Sample3",
    icon: BellIcon$1,
    current: false
  }
];

const react = await importShared('react');
const {Fragment:Fragment2,useState,lazy,Suspense} = react;
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pageContent, setPageContent] = useState(/* @__PURE__ */ jsx(Fragment, { children: "No content to show" }));
  const setContent = (item) => {
    setPageContent(item);
    navigation.forEach((nav) => nav.current = false);
    navigation[item.idx].current = true;
    setSettingsOpen(false);
  };
  const openSettings = () => {
    navigation.forEach((nav) => nav.current = false);
    setPageContent(LocalPage);
    console.log((typeof pageContent).toString());
    setSettingsOpen(true);
  };
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(tt.Root, { show: sidebarOpen, as: Fragment2, children: /* @__PURE__ */ jsxs(
      _t,
      {
        as: "div",
        className: "relative z-50 lg:hidden",
        onClose: setSidebarOpen,
        children: [
          /* @__PURE__ */ jsx(
            tt.Child,
            {
              as: Fragment2,
              enter: "transition-opacity ease-linear duration-300",
              enterFrom: "opacity-0",
              enterTo: "opacity-100",
              leave: "transition-opacity ease-linear duration-300",
              leaveFrom: "opacity-100",
              leaveTo: "opacity-0",
              children: /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-gray-900/80" })
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "fixed inset-0 flex", children: /* @__PURE__ */ jsx(
            tt.Child,
            {
              as: Fragment2,
              enter: "transition ease-in-out duration-300 transform",
              enterFrom: "-translate-x-full",
              enterTo: "translate-x-0",
              leave: "transition ease-in-out duration-300 transform",
              leaveFrom: "translate-x-0",
              leaveTo: "-translate-x-full",
              children: /* @__PURE__ */ jsxs(_t.Panel, { className: "relative mr-16 flex w-full max-w-xs flex-1", children: [
                /* @__PURE__ */ jsx(
                  tt.Child,
                  {
                    as: Fragment2,
                    enter: "ease-in-out duration-300",
                    enterFrom: "opacity-0",
                    enterTo: "opacity-100",
                    leave: "ease-in-out duration-300",
                    leaveFrom: "opacity-100",
                    leaveTo: "opacity-0",
                    children: /* @__PURE__ */ jsx("div", { className: "absolute left-full top-0 flex w-16 justify-center pt-5", children: /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        className: "-m-2.5 p-2.5",
                        onClick: () => setSidebarOpen(false),
                        children: [
                          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close sidebar" }),
                          /* @__PURE__ */ jsx(
                            XMarkIcon$1,
                            {
                              className: "h-6 w-6 text-white",
                              "aria-hidden": "true"
                            }
                          )
                        ]
                      }
                    ) })
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4", children: [
                  /* @__PURE__ */ jsx("div", { className: "flex h-16 shrink-0 items-center", children: /* @__PURE__ */ jsx(
                    "img",
                    {
                      className: "h-8 w-auto",
                      src: "https://tailwindui.com/img/logos/mark.svg?color=white",
                      alt: "Your Company"
                    }
                  ) }),
                  /* @__PURE__ */ jsx("nav", { className: "flex flex-1 flex-col", children: /* @__PURE__ */ jsx("ul", { role: "list", className: "flex flex-1 flex-col gap-y-7", children: /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("ul", { role: "list", className: "-mx-2 space-y-1", children: navigation.map((item) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
                    Link,
                    {
                      to: item.href,
                      onClick: () => setContent(item),
                      className: classNames(
                        item.current ? "bg-indigo-700 text-white" : "text-indigo-200 hover:text-white hover:bg-indigo-700",
                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                      ),
                      children: [
                        /* @__PURE__ */ jsx(
                          item.icon,
                          {
                            className: classNames(
                              item.current ? "text-white" : "text-indigo-200 group-hover:text-white",
                              "h-6 w-6 shrink-0"
                            ),
                            "aria-hidden": "true"
                          }
                        ),
                        item.name
                      ]
                    }
                  ) }, item.name)) }) }) }) })
                ] })
              ] })
            }
          ) })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col", children: /* @__PURE__ */ jsxs("div", { className: "flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex h-16 shrink-0 items-center", children: /* @__PURE__ */ jsx(
        "img",
        {
          className: "h-8 w-auto",
          src: "https://tailwindui.com/img/logos/mark.svg?color=white",
          alt: "Your Company"
        }
      ) }),
      /* @__PURE__ */ jsx("nav", { className: "flex flex-1 flex-col", children: /* @__PURE__ */ jsxs("ul", { role: "list", className: "flex flex-1 flex-col gap-y-7", children: [
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("ul", { role: "list", className: "-mx-2 space-y-1", children: navigation.map((item) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
          Link,
          {
            onClick: () => setContent(item),
            to: item.href,
            className: classNames(
              item.current ? "bg-indigo-700 text-white" : "text-indigo-200 hover:text-white hover:bg-indigo-700",
              "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
            ),
            children: [
              /* @__PURE__ */ jsx(
                item.icon,
                {
                  className: classNames(
                    item.current ? "text-white" : "text-indigo-200 group-hover:text-white",
                    "h-6 w-6 shrink-0"
                  ),
                  "aria-hidden": "true"
                }
              ),
              item.name
            ]
          }
        ) }, item.name)) }) }),
        /* @__PURE__ */ jsx("li", { className: "mt-auto", children: /* @__PURE__ */ jsxs(
          Link,
          {
            onClick: () => openSettings(),
            to: "/Settings",
            className: classNames(
              settingsOpen ? "bg-indigo-700 text-white" : "text-indigo-200 hover:text-white hover:bg-indigo-700",
              "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
            ),
            children: [
              /* @__PURE__ */ jsx(
                Cog6ToothIcon$1,
                {
                  className: "h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white",
                  "aria-hidden": "true"
                }
              ),
              "Settings"
            ]
          }
        ) })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "lg:pl-72", children: [
      /* @__PURE__ */ jsx("div", { className: "sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4  bg-white px-4  sm:gap-x-6 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          className: "-m-2.5 p-2.5 text-gray-700 lg:hidden",
          onClick: () => setSidebarOpen(true),
          children: [
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Open sidebar" }),
            /* @__PURE__ */ jsx(Bars3Icon$1, { className: "h-6 w-6", "aria-hidden": "true" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsx("main", { className: "py-10 ", children: /* @__PURE__ */ jsx("div", { className: "px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx(Outlet, {}) }) })
    ] })
  ] }) });
}

const autogenerated = '';

await importShared('react');

function Home() {
  return /* @__PURE__ */ jsx("div", { children: "Home" });
}

function AppRoutes() {
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(Routes, { children: /* @__PURE__ */ jsxs(Route, { path: "/", element: /* @__PURE__ */ jsx(App, {}), children: [
    /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(Home, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "Settings", element: /* @__PURE__ */ jsx(LocalPage, {}) }),
    navigation.map((nav) => /* @__PURE__ */ jsx(Route, { path: nav.name, element: remotePageRenderer(nav.name) })),
    /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(Home, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(Home, {}) })
  ] }) }) });
}

const React = await importShared('react');
client.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsx(React.StrictMode, { children: /* @__PURE__ */ jsx(BrowserRouter, { children: /* @__PURE__ */ jsx(AppRoutes, {}) }) })
);
