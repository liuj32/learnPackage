/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/proxyTrackIndex.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/proxyTrack.js":
/*!***************************!*\
  !*** ./src/proxyTrack.js ***!
  \***************************/
/*! exports provided: proxyTrack */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"proxyTrack\", function() { return proxyTrack; });\nconst callerMap = {};\r\n\r\nfunction getCaller(error) {\r\n    if (error && error.stack) {\r\n        const lines = error.stack.split('\\n');\r\n        if (lines.length > 2) {\r\n            let match = lines[2].match(/at ([a-zA-Z\\-_$.]+) (.*)/);\r\n            if (match) {\r\n                return {\r\n                    name: match[1].replace(/^Proxy\\./, ''),\r\n                    file: match[2],\r\n                };\r\n            } else {\r\n                match = lines[2].match(/at (.*)/);\r\n                if (match) {\r\n                    return {\r\n                        name: 'unknown',\r\n                        file: match[1],\r\n                    };\r\n                }\r\n            }\r\n        }\r\n    }\r\n    return {\r\n        name: 'unknown',\r\n        file: '',\r\n    };\r\n}\r\n\r\nfunction getFunctionName(fn, context) {\r\n    let contextName = '';\r\n    if (typeof context === 'function') {\r\n        contextName = `{context.name}.`;\r\n    } else if (context && context.constructor && context.constructor.name !== 'Object') {\r\n        contextName = `${context.constructor.name}.`;\r\n    }\r\n    return `${contextName}${fn.name}`;\r\n}\r\n\r\nfunction trackFunctionCall(options = {}) {\r\n    return function(target, thisArg, argumentsList) {\r\n        const { trackTime, trackCaller, trackCount, stdout, filter } = options;\r\n        const error = trackCaller && new Error();\r\n        const caller = getCaller(error);\r\n        const name = getFunctionName(target, thisArg);\r\n        if (trackCount) {\r\n            if (!callerMap[name]) {\r\n                callerMap[name] = 1;\r\n            } else {\r\n                callerMap[name]++;\r\n            }\r\n        }\r\n        let start, end;\r\n        if (trackTime) {\r\n            start = Date.now();\r\n        }\r\n        const retVal = target.apply(thisArg, argumentsList);\r\n        if (trackTime) {\r\n            end = Date.now();\r\n        }\r\n        let output = `${name} was called`;\r\n        if (trackCaller) {\r\n            output += ` by ${caller.name}`;\r\n        }\r\n        if (trackCount) {\r\n            output += ` for the ${callerMap[name]} time`;\r\n        }\r\n        if (trackTime) {\r\n            output += ` and took ${end-start} mils.`;\r\n        }\r\n        let canReport = true;\r\n        if (filter) {\r\n            canReport = filter({\r\n                type: 'function',\r\n                name,\r\n                caller,\r\n                count: callerMap[name],\r\n                time: end - start,\r\n            });\r\n        }\r\n        if (canReport) {\r\n            if (stdout) {\r\n                stdout(output);\r\n            } else {\r\n                console.log(output);\r\n            }\r\n        }\r\n        return retVal;\r\n    };\r\n}\r\n\r\nfunction trackPropertySet(options = {}) {\r\n    return function set(target, prop, value, receiver) {\r\n        const { trackCaller, trackCount, stdout, filter } = options;\r\n        const error = trackCaller && new Error();\r\n        const caller = getCaller(error);\r\n        const contextName = target.constructor.name === 'Object' ? '' : `${target.constructor.name}.`;\r\n        const name = `${contextName}${prop}`;\r\n        const hashKey = `set_${name}`;\r\n        if (trackCount) {\r\n            if (!callerMap[hashKey]) {\r\n                callerMap[hashKey] = 1;\r\n            } else {\r\n                callerMap[hashKey]++;\r\n            }\r\n        }\r\n        let output = `${name} is being set`;\r\n        if (trackCaller) {\r\n            output += ` by ${caller.name}`;\r\n        }\r\n        if (trackCount) {\r\n            output += ` for the ${callerMap[hashKey]} time`;\r\n        }\r\n        let canReport = true;\r\n        if (filter) {\r\n            canReport = filter({\r\n                type: 'get',\r\n                prop,\r\n                name,\r\n                caller,\r\n                count: callerMap[hashKey],\r\n                value,\r\n            });\r\n        }\r\n        if (canReport) {\r\n            if (stdout) {\r\n                stdout(output);\r\n            } else {\r\n                console.log(output);\r\n            }\r\n        }\r\n        return Reflect.set(target, prop, value, receiver);\r\n    };\r\n}\r\n\r\nfunction trackPropertyGet(options = {}) {\r\n    return function get(target, prop, receiver) {\r\n        const { trackCaller, trackCount, stdout, filter } = options;\r\n        if (typeof target[prop] === 'function' || prop === 'prototype') {\r\n            return target[prop];\r\n        }\r\n        const error = trackCaller && new Error();\r\n        const caller = getCaller(error);\r\n        const contextName = target.constructor.name === 'Object' ? '' : `${target.constructor.name}.`;\r\n        const name = `${contextName}${prop}`;\r\n        const hashKey = `get_${name}`;\r\n\r\n        if (trackCount) {\r\n            if (!callerMap[hashKey]) {\r\n                callerMap[hashKey] = 1;\r\n            } else {\r\n                callerMap[hashKey]++;\r\n            }\r\n        }\r\n        let output = `${name} is being get`;\r\n        if (trackCaller) {\r\n            output += ` by ${caller.name}`;\r\n        }\r\n        if (trackCount) {\r\n            output += ` for the ${callerMap[hashKey]} time`;\r\n        }\r\n        let canReport = true;\r\n        if (filter) {\r\n            canReport = filter({\r\n                type: 'get',\r\n                prop,\r\n                name,\r\n                caller,\r\n                count: callerMap[hashKey],\r\n            });\r\n        }\r\n        if (canReport) {\r\n            if (stdout) {\r\n                stdout(output);\r\n            } else {\r\n                console.log(output);\r\n            }\r\n        }\r\n        return target[prop];\r\n    };\r\n}\r\n\r\nfunction proxyFunctions(trackedEntity, options) {\r\n    if (typeof trackedEntity === 'function') return;\r\n    Object.getOwnPropertyNames(trackedEntity).forEach((name) => {\r\n        if (typeof trackedEntity[name] === 'function') {\r\n            trackedEntity[name] = new Proxy(trackedEntity[name], {\r\n                apply: trackFunctionCall(options),\r\n            });\r\n        }\r\n    });\r\n}\r\n\r\nfunction trackObject(obj, options = {}) {\r\n    const { trackFunctions, trackProps } = options;\r\n\r\n    let resultObj = obj;\r\n    if (trackFunctions) {\r\n        proxyFunctions(resultObj, options);\r\n    }\r\n    if (trackProps) {\r\n        resultObj = new Proxy(resultObj, {\r\n            get: trackPropertyGet(options),\r\n            set: trackPropertySet(options),\r\n        });\r\n    }\r\n    return resultObj;\r\n}\r\n\r\nconst defaultOptions = {\r\n    trackFunctions: true,\r\n    trackProps: true,\r\n    trackTime: true,\r\n    trackCaller: true,\r\n    trackCount: true,\r\n    filter: null,\r\n};\r\n\r\n\r\nfunction trackClass(cls, options = {}) {\r\n    cls.prototype = trackObject(cls.prototype, options);\r\n    cls.prototype.constructor = cls;\r\n\r\n    return new Proxy(cls, {\r\n        construct(target, args) {\r\n            const obj = new target(...args);\r\n            return new Proxy(obj, {\r\n                get: trackPropertyGet(options),\r\n                set: trackPropertySet(options),\r\n            });\r\n        },\r\n        apply: trackFunctionCall(options),\r\n    });\r\n}\r\n\r\nfunction proxyTrack(entity, options = defaultOptions) {\r\n    if (typeof entity === 'function') return trackClass(entity, options);\r\n    return trackObject(entity, options);\r\n}\n\n//# sourceURL=webpack:///./src/proxyTrack.js?");

/***/ }),

/***/ "./src/proxyTrackIndex.js":
/*!********************************!*\
  !*** ./src/proxyTrackIndex.js ***!
  \********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _proxyTrack_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./proxyTrack.js */ \"./src/proxyTrack.js\");\n\r\n\r\n/***/\r\n\r\nfunction MyClass() {}\r\n\r\nMyClass.prototype = {\r\n    isPrime: function() {\r\n        const num = this.num;\r\n        for(var i = 2; i < num; i++)\r\n            if(num % i === 0) return false;\r\n        return num !== 1 && num !== 0;\r\n    },\r\n\r\n    num: null,\r\n};\r\n\r\nMyClass.prototype.constructor = MyClass;\r\n\r\nconst trackedClass = Object(_proxyTrack_js__WEBPACK_IMPORTED_MODULE_0__[\"proxyTrack\"])(MyClass);\r\n\r\nfunction start() {\r\n    const my = new trackedClass();\r\n    my.num = 573723653;\r\n    if (!my.isPrime()) {\r\n        return `${my.num} is not prime`;\r\n    }\r\n}\r\n\r\nfunction main() {\r\n    start();\r\n}\r\n\r\nmain();\r\n\n\n//# sourceURL=webpack:///./src/proxyTrackIndex.js?");

/***/ })

/******/ });