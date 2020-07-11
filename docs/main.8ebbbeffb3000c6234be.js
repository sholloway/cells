var Conways =
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
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "defaultConverter", function() { return /* reexport */ defaultConverter; });
__webpack_require__.d(__webpack_exports__, "notEqual", function() { return /* reexport */ notEqual; });
__webpack_require__.d(__webpack_exports__, "UpdatingElement", function() { return /* reexport */ UpdatingElement; });
__webpack_require__.d(__webpack_exports__, "customElement", function() { return /* reexport */ customElement; });
__webpack_require__.d(__webpack_exports__, "property", function() { return /* reexport */ property; });
__webpack_require__.d(__webpack_exports__, "internalProperty", function() { return /* reexport */ internalProperty; });
__webpack_require__.d(__webpack_exports__, "query", function() { return /* reexport */ query; });
__webpack_require__.d(__webpack_exports__, "queryAsync", function() { return /* reexport */ queryAsync; });
__webpack_require__.d(__webpack_exports__, "queryAll", function() { return /* reexport */ queryAll; });
__webpack_require__.d(__webpack_exports__, "eventOptions", function() { return /* reexport */ eventOptions; });
__webpack_require__.d(__webpack_exports__, "queryAssignedNodes", function() { return /* reexport */ queryAssignedNodes; });
__webpack_require__.d(__webpack_exports__, "html", function() { return /* reexport */ lit_html_html; });
__webpack_require__.d(__webpack_exports__, "svg", function() { return /* reexport */ svg; });
__webpack_require__.d(__webpack_exports__, "TemplateResult", function() { return /* reexport */ template_result_TemplateResult; });
__webpack_require__.d(__webpack_exports__, "SVGTemplateResult", function() { return /* reexport */ template_result_SVGTemplateResult; });
__webpack_require__.d(__webpack_exports__, "supportsAdoptingStyleSheets", function() { return /* reexport */ supportsAdoptingStyleSheets; });
__webpack_require__.d(__webpack_exports__, "CSSResult", function() { return /* reexport */ CSSResult; });
__webpack_require__.d(__webpack_exports__, "unsafeCSS", function() { return /* reexport */ unsafeCSS; });
__webpack_require__.d(__webpack_exports__, "css", function() { return /* reexport */ css; });
__webpack_require__.d(__webpack_exports__, "LitElement", function() { return /* binding */ lit_element_LitElement; });

// CONCATENATED MODULE: ./node_modules/lit-html/lib/dom.js
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * True if the custom elements polyfill is in use.
 */
const isCEPolyfill = typeof window !== 'undefined' &&
    window.customElements != null &&
    window.customElements.polyfillWrapFlushCallback !==
        undefined;
/**
 * Reparents nodes, starting from `start` (inclusive) to `end` (exclusive),
 * into another container (could be the same container), before `before`. If
 * `before` is null, it appends the nodes to the container.
 */
const reparentNodes = (container, start, end = null, before = null) => {
    while (start !== end) {
        const n = start.nextSibling;
        container.insertBefore(start, before);
        start = n;
    }
};
/**
 * Removes nodes, starting from `start` (inclusive) to `end` (exclusive), from
 * `container`.
 */
const removeNodes = (container, start, end = null) => {
    while (start !== end) {
        const n = start.nextSibling;
        container.removeChild(start);
        start = n;
    }
};
//# sourceMappingURL=dom.js.map
// CONCATENATED MODULE: ./node_modules/lit-html/lib/template.js
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * An expression marker with embedded unique key to avoid collision with
 * possible text in templates.
 */
const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
/**
 * An expression marker used text-positions, multi-binding attributes, and
 * attributes with markup-like text values.
 */
const nodeMarker = `<!--${marker}-->`;
const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
/**
 * Suffix appended to all bound attribute names.
 */
const boundAttributeSuffix = '$lit$';
/**
 * An updatable Template that tracks the location of dynamic parts.
 */
class Template {
    constructor(result, element) {
        this.parts = [];
        this.element = element;
        const nodesToRemove = [];
        const stack = [];
        // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
        const walker = document.createTreeWalker(element.content, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
        // Keeps track of the last index associated with a part. We try to delete
        // unnecessary nodes, but we never want to associate two different parts
        // to the same index. They must have a constant node between.
        let lastPartIndex = 0;
        let index = -1;
        let partIndex = 0;
        const { strings, values: { length } } = result;
        while (partIndex < length) {
            const node = walker.nextNode();
            if (node === null) {
                // We've exhausted the content inside a nested template element.
                // Because we still have parts (the outer for-loop), we know:
                // - There is a template in the stack
                // - The walker will find a nextNode outside the template
                walker.currentNode = stack.pop();
                continue;
            }
            index++;
            if (node.nodeType === 1 /* Node.ELEMENT_NODE */) {
                if (node.hasAttributes()) {
                    const attributes = node.attributes;
                    const { length } = attributes;
                    // Per
                    // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
                    // attributes are not guaranteed to be returned in document order.
                    // In particular, Edge/IE can return them out of order, so we cannot
                    // assume a correspondence between part index and attribute index.
                    let count = 0;
                    for (let i = 0; i < length; i++) {
                        if (endsWith(attributes[i].name, boundAttributeSuffix)) {
                            count++;
                        }
                    }
                    while (count-- > 0) {
                        // Get the template literal section leading up to the first
                        // expression in this attribute
                        const stringForPart = strings[partIndex];
                        // Find the attribute name
                        const name = lastAttributeNameRegex.exec(stringForPart)[2];
                        // Find the corresponding attribute
                        // All bound attributes have had a suffix added in
                        // TemplateResult#getHTML to opt out of special attribute
                        // handling. To look up the attribute value we also need to add
                        // the suffix.
                        const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
                        const attributeValue = node.getAttribute(attributeLookupName);
                        node.removeAttribute(attributeLookupName);
                        const statics = attributeValue.split(markerRegex);
                        this.parts.push({ type: 'attribute', index, name, strings: statics });
                        partIndex += statics.length - 1;
                    }
                }
                if (node.tagName === 'TEMPLATE') {
                    stack.push(node);
                    walker.currentNode = node.content;
                }
            }
            else if (node.nodeType === 3 /* Node.TEXT_NODE */) {
                const data = node.data;
                if (data.indexOf(marker) >= 0) {
                    const parent = node.parentNode;
                    const strings = data.split(markerRegex);
                    const lastIndex = strings.length - 1;
                    // Generate a new text node for each literal section
                    // These nodes are also used as the markers for node parts
                    for (let i = 0; i < lastIndex; i++) {
                        let insert;
                        let s = strings[i];
                        if (s === '') {
                            insert = createMarker();
                        }
                        else {
                            const match = lastAttributeNameRegex.exec(s);
                            if (match !== null && endsWith(match[2], boundAttributeSuffix)) {
                                s = s.slice(0, match.index) + match[1] +
                                    match[2].slice(0, -boundAttributeSuffix.length) + match[3];
                            }
                            insert = document.createTextNode(s);
                        }
                        parent.insertBefore(insert, node);
                        this.parts.push({ type: 'node', index: ++index });
                    }
                    // If there's no text, we must insert a comment to mark our place.
                    // Else, we can trust it will stick around after cloning.
                    if (strings[lastIndex] === '') {
                        parent.insertBefore(createMarker(), node);
                        nodesToRemove.push(node);
                    }
                    else {
                        node.data = strings[lastIndex];
                    }
                    // We have a part for each match found
                    partIndex += lastIndex;
                }
            }
            else if (node.nodeType === 8 /* Node.COMMENT_NODE */) {
                if (node.data === marker) {
                    const parent = node.parentNode;
                    // Add a new marker node to be the startNode of the Part if any of
                    // the following are true:
                    //  * We don't have a previousSibling
                    //  * The previousSibling is already the start of a previous part
                    if (node.previousSibling === null || index === lastPartIndex) {
                        index++;
                        parent.insertBefore(createMarker(), node);
                    }
                    lastPartIndex = index;
                    this.parts.push({ type: 'node', index });
                    // If we don't have a nextSibling, keep this node so we have an end.
                    // Else, we can remove it to save future costs.
                    if (node.nextSibling === null) {
                        node.data = '';
                    }
                    else {
                        nodesToRemove.push(node);
                        index--;
                    }
                    partIndex++;
                }
                else {
                    let i = -1;
                    while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
                        // Comment node has a binding marker inside, make an inactive part
                        // The binding won't work, but subsequent bindings will
                        // TODO (justinfagnani): consider whether it's even worth it to
                        // make bindings in comments work
                        this.parts.push({ type: 'node', index: -1 });
                        partIndex++;
                    }
                }
            }
        }
        // Remove text binding nodes after the walk to not disturb the TreeWalker
        for (const n of nodesToRemove) {
            n.parentNode.removeChild(n);
        }
    }
}
const endsWith = (str, suffix) => {
    const index = str.length - suffix.length;
    return index >= 0 && str.slice(index) === suffix;
};
const isTemplatePartActive = (part) => part.index !== -1;
// Allows `document.createComment('')` to be renamed for a
// small manual size-savings.
const createMarker = () => document.createComment('');
/**
 * This regex extracts the attribute name preceding an attribute-position
 * expression. It does this by matching the syntax allowed for attributes
 * against the string literal directly preceding the expression, assuming that
 * the expression is in an attribute-value position.
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#elements-attributes
 *
 * " \x09\x0a\x0c\x0d" are HTML space characters:
 * https://www.w3.org/TR/html5/infrastructure.html#space-characters
 *
 * "\0-\x1F\x7F-\x9F" are Unicode control characters, which includes every
 * space character except " ".
 *
 * So an attribute is:
 *  * The name: any character except a control character, space character, ('),
 *    ("), ">", "=", or "/"
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */
const lastAttributeNameRegex = 
// eslint-disable-next-line no-control-regex
/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
//# sourceMappingURL=template.js.map
// CONCATENATED MODULE: ./node_modules/lit-html/lib/modify-template.js
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * @module shady-render
 */

const walkerNodeFilter = 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */;
/**
 * Removes the list of nodes from a Template safely. In addition to removing
 * nodes from the Template, the Template part indices are updated to match
 * the mutated Template DOM.
 *
 * As the template is walked the removal state is tracked and
 * part indices are adjusted as needed.
 *
 * div
 *   div#1 (remove) <-- start removing (removing node is div#1)
 *     div
 *       div#2 (remove)  <-- continue removing (removing node is still div#1)
 *         div
 * div <-- stop removing since previous sibling is the removing node (div#1,
 * removed 4 nodes)
 */
function removeNodesFromTemplate(template, nodesToRemove) {
    const { element: { content }, parts } = template;
    const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
    let partIndex = nextActiveIndexInTemplateParts(parts);
    let part = parts[partIndex];
    let nodeIndex = -1;
    let removeCount = 0;
    const nodesToRemoveInTemplate = [];
    let currentRemovingNode = null;
    while (walker.nextNode()) {
        nodeIndex++;
        const node = walker.currentNode;
        // End removal if stepped past the removing node
        if (node.previousSibling === currentRemovingNode) {
            currentRemovingNode = null;
        }
        // A node to remove was found in the template
        if (nodesToRemove.has(node)) {
            nodesToRemoveInTemplate.push(node);
            // Track node we're removing
            if (currentRemovingNode === null) {
                currentRemovingNode = node;
            }
        }
        // When removing, increment count by which to adjust subsequent part indices
        if (currentRemovingNode !== null) {
            removeCount++;
        }
        while (part !== undefined && part.index === nodeIndex) {
            // If part is in a removed node deactivate it by setting index to -1 or
            // adjust the index as needed.
            part.index = currentRemovingNode !== null ? -1 : part.index - removeCount;
            // go to the next active part.
            partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
            part = parts[partIndex];
        }
    }
    nodesToRemoveInTemplate.forEach((n) => n.parentNode.removeChild(n));
}
const countNodes = (node) => {
    let count = (node.nodeType === 11 /* Node.DOCUMENT_FRAGMENT_NODE */) ? 0 : 1;
    const walker = document.createTreeWalker(node, walkerNodeFilter, null, false);
    while (walker.nextNode()) {
        count++;
    }
    return count;
};
const nextActiveIndexInTemplateParts = (parts, startIndex = -1) => {
    for (let i = startIndex + 1; i < parts.length; i++) {
        const part = parts[i];
        if (isTemplatePartActive(part)) {
            return i;
        }
    }
    return -1;
};
/**
 * Inserts the given node into the Template, optionally before the given
 * refNode. In addition to inserting the node into the Template, the Template
 * part indices are updated to match the mutated Template DOM.
 */
function insertNodeIntoTemplate(template, node, refNode = null) {
    const { element: { content }, parts } = template;
    // If there's no refNode, then put node at end of template.
    // No part indices need to be shifted in this case.
    if (refNode === null || refNode === undefined) {
        content.appendChild(node);
        return;
    }
    const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
    let partIndex = nextActiveIndexInTemplateParts(parts);
    let insertCount = 0;
    let walkerIndex = -1;
    while (walker.nextNode()) {
        walkerIndex++;
        const walkerNode = walker.currentNode;
        if (walkerNode === refNode) {
            insertCount = countNodes(node);
            refNode.parentNode.insertBefore(node, refNode);
        }
        while (partIndex !== -1 && parts[partIndex].index === walkerIndex) {
            // If we've inserted the node, simply adjust all subsequent parts
            if (insertCount > 0) {
                while (partIndex !== -1) {
                    parts[partIndex].index += insertCount;
                    partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
                }
                return;
            }
            partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
        }
    }
}
//# sourceMappingURL=modify-template.js.map
// CONCATENATED MODULE: ./node_modules/lit-html/lib/directive.js
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const directives = new WeakMap();
/**
 * Brands a function as a directive factory function so that lit-html will call
 * the function during template rendering, rather than passing as a value.
 *
 * A _directive_ is a function that takes a Part as an argument. It has the
 * signature: `(part: Part) => void`.
 *
 * A directive _factory_ is a function that takes arguments for data and
 * configuration and returns a directive. Users of directive usually refer to
 * the directive factory as the directive. For example, "The repeat directive".
 *
 * Usually a template author will invoke a directive factory in their template
 * with relevant arguments, which will then return a directive function.
 *
 * Here's an example of using the `repeat()` directive factory that takes an
 * array and a function to render an item:
 *
 * ```js
 * html`<ul><${repeat(items, (item) => html`<li>${item}</li>`)}</ul>`
 * ```
 *
 * When `repeat` is invoked, it returns a directive function that closes over
 * `items` and the template function. When the outer template is rendered, the
 * return directive function is called with the Part for the expression.
 * `repeat` then performs it's custom logic to render multiple items.
 *
 * @param f The directive factory function. Must be a function that returns a
 * function of the signature `(part: Part) => void`. The returned function will
 * be called with the part object.
 *
 * @example
 *
 * import {directive, html} from 'lit-html';
 *
 * const immutable = directive((v) => (part) => {
 *   if (part.value !== v) {
 *     part.setValue(v)
 *   }
 * });
 */
const directive_directive = (f) => ((...args) => {
    const d = f(...args);
    directives.set(d, true);
    return d;
});
const isDirective = (o) => {
    return typeof o === 'function' && directives.has(o);
};
//# sourceMappingURL=directive.js.map
// CONCATENATED MODULE: ./node_modules/lit-html/lib/part.js
/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */
const noChange = {};
/**
 * A sentinel value that signals a NodePart to fully clear its content.
 */
const nothing = {};
//# sourceMappingURL=part.js.map
// CONCATENATED MODULE: ./node_modules/lit-html/lib/template-instance.js
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * @module lit-html
 */


/**
 * An instance of a `Template` that can be attached to the DOM and updated
 * with new values.
 */
class template_instance_TemplateInstance {
    constructor(template, processor, options) {
        this.__parts = [];
        this.template = template;
        this.processor = processor;
        this.options = options;
    }
    update(values) {
        let i = 0;
        for (const part of this.__parts) {
            if (part !== undefined) {
                part.setValue(values[i]);
            }
            i++;
        }
        for (const part of this.__parts) {
            if (part !== undefined) {
                part.commit();
            }
        }
    }
    _clone() {
        // There are a number of steps in the lifecycle of a template instance's
        // DOM fragment:
        //  1. Clone - create the instance fragment
        //  2. Adopt - adopt into the main document
        //  3. Process - find part markers and create parts
        //  4. Upgrade - upgrade custom elements
        //  5. Update - set node, attribute, property, etc., values
        //  6. Connect - connect to the document. Optional and outside of this
        //     method.
        //
        // We have a few constraints on the ordering of these steps:
        //  * We need to upgrade before updating, so that property values will pass
        //    through any property setters.
        //  * We would like to process before upgrading so that we're sure that the
        //    cloned fragment is inert and not disturbed by self-modifying DOM.
        //  * We want custom elements to upgrade even in disconnected fragments.
        //
        // Given these constraints, with full custom elements support we would
        // prefer the order: Clone, Process, Adopt, Upgrade, Update, Connect
        //
        // But Safari does not implement CustomElementRegistry#upgrade, so we
        // can not implement that order and still have upgrade-before-update and
        // upgrade disconnected fragments. So we instead sacrifice the
        // process-before-upgrade constraint, since in Custom Elements v1 elements
        // must not modify their light DOM in the constructor. We still have issues
        // when co-existing with CEv0 elements like Polymer 1, and with polyfills
        // that don't strictly adhere to the no-modification rule because shadow
        // DOM, which may be created in the constructor, is emulated by being placed
        // in the light DOM.
        //
        // The resulting order is on native is: Clone, Adopt, Upgrade, Process,
        // Update, Connect. document.importNode() performs Clone, Adopt, and Upgrade
        // in one step.
        //
        // The Custom Elements v1 polyfill supports upgrade(), so the order when
        // polyfilled is the more ideal: Clone, Process, Adopt, Upgrade, Update,
        // Connect.
        const fragment = isCEPolyfill ?
            this.template.element.content.cloneNode(true) :
            document.importNode(this.template.element.content, true);
        const stack = [];
        const parts = this.template.parts;
        // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
        const walker = document.createTreeWalker(fragment, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
        let partIndex = 0;
        let nodeIndex = 0;
        let part;
        let node = walker.nextNode();
        // Loop through all the nodes and parts of a template
        while (partIndex < parts.length) {
            part = parts[partIndex];
            if (!isTemplatePartActive(part)) {
                this.__parts.push(undefined);
                partIndex++;
                continue;
            }
            // Progress the tree walker until we find our next part's node.
            // Note that multiple parts may share the same node (attribute parts
            // on a single element), so this loop may not run at all.
            while (nodeIndex < part.index) {
                nodeIndex++;
                if (node.nodeName === 'TEMPLATE') {
                    stack.push(node);
                    walker.currentNode = node.content;
                }
                if ((node = walker.nextNode()) === null) {
                    // We've exhausted the content inside a nested template element.
                    // Because we still have parts (the outer for-loop), we know:
                    // - There is a template in the stack
                    // - The walker will find a nextNode outside the template
                    walker.currentNode = stack.pop();
                    node = walker.nextNode();
                }
            }
            // We've arrived at our part's node.
            if (part.type === 'node') {
                const part = this.processor.handleTextExpression(this.options);
                part.insertAfterNode(node.previousSibling);
                this.__parts.push(part);
            }
            else {
                this.__parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
            }
            partIndex++;
        }
        if (isCEPolyfill) {
            document.adoptNode(fragment);
            customElements.upgrade(fragment);
        }
        return fragment;
    }
}
//# sourceMappingURL=template-instance.js.map
// CONCATENATED MODULE: ./node_modules/lit-html/lib/template-result.js
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * @module lit-html
 */


const commentMarker = ` ${marker} `;
/**
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 */
class template_result_TemplateResult {
    constructor(strings, values, type, processor) {
        this.strings = strings;
        this.values = values;
        this.type = type;
        this.processor = processor;
    }
    /**
     * Returns a string of HTML used to create a `<template>` element.
     */
    getHTML() {
        const l = this.strings.length - 1;
        let html = '';
        let isCommentBinding = false;
        for (let i = 0; i < l; i++) {
            const s = this.strings[i];
            // For each binding we want to determine the kind of marker to insert
            // into the template source before it's parsed by the browser's HTML
            // parser. The marker type is based on whether the expression is in an
            // attribute, text, or comment position.
            //   * For node-position bindings we insert a comment with the marker
            //     sentinel as its text content, like <!--{{lit-guid}}-->.
            //   * For attribute bindings we insert just the marker sentinel for the
            //     first binding, so that we support unquoted attribute bindings.
            //     Subsequent bindings can use a comment marker because multi-binding
            //     attributes must be quoted.
            //   * For comment bindings we insert just the marker sentinel so we don't
            //     close the comment.
            //
            // The following code scans the template source, but is *not* an HTML
            // parser. We don't need to track the tree structure of the HTML, only
            // whether a binding is inside a comment, and if not, if it appears to be
            // the first binding in an attribute.
            const commentOpen = s.lastIndexOf('<!--');
            // We're in comment position if we have a comment open with no following
            // comment close. Because <-- can appear in an attribute value there can
            // be false positives.
            isCommentBinding = (commentOpen > -1 || isCommentBinding) &&
                s.indexOf('-->', commentOpen + 1) === -1;
            // Check to see if we have an attribute-like sequence preceding the
            // expression. This can match "name=value" like structures in text,
            // comments, and attribute values, so there can be false-positives.
            const attributeMatch = lastAttributeNameRegex.exec(s);
            if (attributeMatch === null) {
                // We're only in this branch if we don't have a attribute-like
                // preceding sequence. For comments, this guards against unusual
                // attribute values like <div foo="<!--${'bar'}">. Cases like
                // <!-- foo=${'bar'}--> are handled correctly in the attribute branch
                // below.
                html += s + (isCommentBinding ? commentMarker : nodeMarker);
            }
            else {
                // For attributes we use just a marker sentinel, and also append a
                // $lit$ suffix to the name to opt-out of attribute-specific parsing
                // that IE and Edge do for style and certain SVG attributes.
                html += s.substr(0, attributeMatch.index) + attributeMatch[1] +
                    attributeMatch[2] + boundAttributeSuffix + attributeMatch[3] +
                    marker;
            }
        }
        html += this.strings[l];
        return html;
    }
    getTemplateElement() {
        const template = document.createElement('template');
        template.innerHTML = this.getHTML();
        return template;
    }
}
/**
 * A TemplateResult for SVG fragments.
 *
 * This class wraps HTML in an `<svg>` tag in order to parse its contents in the
 * SVG namespace, then modifies the template to remove the `<svg>` tag so that
 * clones only container the original fragment.
 */
class template_result_SVGTemplateResult extends template_result_TemplateResult {
    getHTML() {
        return `<svg>${super.getHTML()}</svg>`;
    }
    getTemplateElement() {
        const template = super.getTemplateElement();
        const content = template.content;
        const svgElement = content.firstChild;
        content.removeChild(svgElement);
        reparentNodes(content, svgElement.firstChild);
        return template;
    }
}
//# sourceMappingURL=template-result.js.map
// CONCATENATED MODULE: ./node_modules/lit-html/lib/parts.js
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * @module lit-html
 */






const isPrimitive = (value) => {
    return (value === null ||
        !(typeof value === 'object' || typeof value === 'function'));
};
const isIterable = (value) => {
    return Array.isArray(value) ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        !!(value && value[Symbol.iterator]);
};
/**
 * Writes attribute values to the DOM for a group of AttributeParts bound to a
 * single attribute. The value is only set once even if there are multiple parts
 * for an attribute.
 */
class AttributeCommitter {
    constructor(element, name, strings) {
        this.dirty = true;
        this.element = element;
        this.name = name;
        this.strings = strings;
        this.parts = [];
        for (let i = 0; i < strings.length - 1; i++) {
            this.parts[i] = this._createPart();
        }
    }
    /**
     * Creates a single part. Override this to create a differnt type of part.
     */
    _createPart() {
        return new parts_AttributePart(this);
    }
    _getValue() {
        const strings = this.strings;
        const l = strings.length - 1;
        let text = '';
        for (let i = 0; i < l; i++) {
            text += strings[i];
            const part = this.parts[i];
            if (part !== undefined) {
                const v = part.value;
                if (isPrimitive(v) || !isIterable(v)) {
                    text += typeof v === 'string' ? v : String(v);
                }
                else {
                    for (const t of v) {
                        text += typeof t === 'string' ? t : String(t);
                    }
                }
            }
        }
        text += strings[l];
        return text;
    }
    commit() {
        if (this.dirty) {
            this.dirty = false;
            this.element.setAttribute(this.name, this._getValue());
        }
    }
}
/**
 * A Part that controls all or part of an attribute value.
 */
class parts_AttributePart {
    constructor(committer) {
        this.value = undefined;
        this.committer = committer;
    }
    setValue(value) {
        if (value !== noChange && (!isPrimitive(value) || value !== this.value)) {
            this.value = value;
            // If the value is a not a directive, dirty the committer so that it'll
            // call setAttribute. If the value is a directive, it'll dirty the
            // committer if it calls setValue().
            if (!isDirective(value)) {
                this.committer.dirty = true;
            }
        }
    }
    commit() {
        while (isDirective(this.value)) {
            const directive = this.value;
            this.value = noChange;
            directive(this);
        }
        if (this.value === noChange) {
            return;
        }
        this.committer.commit();
    }
}
/**
 * A Part that controls a location within a Node tree. Like a Range, NodePart
 * has start and end locations and can set and update the Nodes between those
 * locations.
 *
 * NodeParts support several value types: primitives, Nodes, TemplateResults,
 * as well as arrays and iterables of those types.
 */
class parts_NodePart {
    constructor(options) {
        this.value = undefined;
        this.__pendingValue = undefined;
        this.options = options;
    }
    /**
     * Appends this part into a container.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    appendInto(container) {
        this.startNode = container.appendChild(createMarker());
        this.endNode = container.appendChild(createMarker());
    }
    /**
     * Inserts this part after the `ref` node (between `ref` and `ref`'s next
     * sibling). Both `ref` and its next sibling must be static, unchanging nodes
     * such as those that appear in a literal section of a template.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    insertAfterNode(ref) {
        this.startNode = ref;
        this.endNode = ref.nextSibling;
    }
    /**
     * Appends this part into a parent part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    appendIntoPart(part) {
        part.__insert(this.startNode = createMarker());
        part.__insert(this.endNode = createMarker());
    }
    /**
     * Inserts this part after the `ref` part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    insertAfterPart(ref) {
        ref.__insert(this.startNode = createMarker());
        this.endNode = ref.endNode;
        ref.endNode = this.startNode;
    }
    setValue(value) {
        this.__pendingValue = value;
    }
    commit() {
        if (this.startNode.parentNode === null) {
            return;
        }
        while (isDirective(this.__pendingValue)) {
            const directive = this.__pendingValue;
            this.__pendingValue = noChange;
            directive(this);
        }
        const value = this.__pendingValue;
        if (value === noChange) {
            return;
        }
        if (isPrimitive(value)) {
            if (value !== this.value) {
                this.__commitText(value);
            }
        }
        else if (value instanceof template_result_TemplateResult) {
            this.__commitTemplateResult(value);
        }
        else if (value instanceof Node) {
            this.__commitNode(value);
        }
        else if (isIterable(value)) {
            this.__commitIterable(value);
        }
        else if (value === nothing) {
            this.value = nothing;
            this.clear();
        }
        else {
            // Fallback, will render the string representation
            this.__commitText(value);
        }
    }
    __insert(node) {
        this.endNode.parentNode.insertBefore(node, this.endNode);
    }
    __commitNode(value) {
        if (this.value === value) {
            return;
        }
        this.clear();
        this.__insert(value);
        this.value = value;
    }
    __commitText(value) {
        const node = this.startNode.nextSibling;
        value = value == null ? '' : value;
        // If `value` isn't already a string, we explicitly convert it here in case
        // it can't be implicitly converted - i.e. it's a symbol.
        const valueAsString = typeof value === 'string' ? value : String(value);
        if (node === this.endNode.previousSibling &&
            node.nodeType === 3 /* Node.TEXT_NODE */) {
            // If we only have a single text node between the markers, we can just
            // set its value, rather than replacing it.
            // TODO(justinfagnani): Can we just check if this.value is primitive?
            node.data = valueAsString;
        }
        else {
            this.__commitNode(document.createTextNode(valueAsString));
        }
        this.value = value;
    }
    __commitTemplateResult(value) {
        const template = this.options.templateFactory(value);
        if (this.value instanceof template_instance_TemplateInstance &&
            this.value.template === template) {
            this.value.update(value.values);
        }
        else {
            // Make sure we propagate the template processor from the TemplateResult
            // so that we use its syntax extension, etc. The template factory comes
            // from the render function options so that it can control template
            // caching and preprocessing.
            const instance = new template_instance_TemplateInstance(template, value.processor, this.options);
            const fragment = instance._clone();
            instance.update(value.values);
            this.__commitNode(fragment);
            this.value = instance;
        }
    }
    __commitIterable(value) {
        // For an Iterable, we create a new InstancePart per item, then set its
        // value to the item. This is a little bit of overhead for every item in
        // an Iterable, but it lets us recurse easily and efficiently update Arrays
        // of TemplateResults that will be commonly returned from expressions like:
        // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
        // If _value is an array, then the previous render was of an
        // iterable and _value will contain the NodeParts from the previous
        // render. If _value is not an array, clear this part and make a new
        // array for NodeParts.
        if (!Array.isArray(this.value)) {
            this.value = [];
            this.clear();
        }
        // Lets us keep track of how many items we stamped so we can clear leftover
        // items from a previous render
        const itemParts = this.value;
        let partIndex = 0;
        let itemPart;
        for (const item of value) {
            // Try to reuse an existing part
            itemPart = itemParts[partIndex];
            // If no existing part, create a new one
            if (itemPart === undefined) {
                itemPart = new parts_NodePart(this.options);
                itemParts.push(itemPart);
                if (partIndex === 0) {
                    itemPart.appendIntoPart(this);
                }
                else {
                    itemPart.insertAfterPart(itemParts[partIndex - 1]);
                }
            }
            itemPart.setValue(item);
            itemPart.commit();
            partIndex++;
        }
        if (partIndex < itemParts.length) {
            // Truncate the parts array so _value reflects the current state
            itemParts.length = partIndex;
            this.clear(itemPart && itemPart.endNode);
        }
    }
    clear(startNode = this.startNode) {
        removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
    }
}
/**
 * Implements a boolean attribute, roughly as defined in the HTML
 * specification.
 *
 * If the value is truthy, then the attribute is present with a value of
 * ''. If the value is falsey, the attribute is removed.
 */
class parts_BooleanAttributePart {
    constructor(element, name, strings) {
        this.value = undefined;
        this.__pendingValue = undefined;
        if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
            throw new Error('Boolean attributes can only contain a single expression');
        }
        this.element = element;
        this.name = name;
        this.strings = strings;
    }
    setValue(value) {
        this.__pendingValue = value;
    }
    commit() {
        while (isDirective(this.__pendingValue)) {
            const directive = this.__pendingValue;
            this.__pendingValue = noChange;
            directive(this);
        }
        if (this.__pendingValue === noChange) {
            return;
        }
        const value = !!this.__pendingValue;
        if (this.value !== value) {
            if (value) {
                this.element.setAttribute(this.name, '');
            }
            else {
                this.element.removeAttribute(this.name);
            }
            this.value = value;
        }
        this.__pendingValue = noChange;
    }
}
/**
 * Sets attribute values for PropertyParts, so that the value is only set once
 * even if there are multiple parts for a property.
 *
 * If an expression controls the whole property value, then the value is simply
 * assigned to the property under control. If there are string literals or
 * multiple expressions, then the strings are expressions are interpolated into
 * a string first.
 */
class PropertyCommitter extends AttributeCommitter {
    constructor(element, name, strings) {
        super(element, name, strings);
        this.single =
            (strings.length === 2 && strings[0] === '' && strings[1] === '');
    }
    _createPart() {
        return new PropertyPart(this);
    }
    _getValue() {
        if (this.single) {
            return this.parts[0].value;
        }
        return super._getValue();
    }
    commit() {
        if (this.dirty) {
            this.dirty = false;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.element[this.name] = this._getValue();
        }
    }
}
class PropertyPart extends parts_AttributePart {
}
// Detect event listener options support. If the `capture` property is read
// from the options object, then options are supported. If not, then the third
// argument to add/removeEventListener is interpreted as the boolean capture
// value so we should only pass the `capture` property.
let eventOptionsSupported = false;
// Wrap into an IIFE because MS Edge <= v41 does not support having try/catch
// blocks right into the body of a module
(() => {
    try {
        const options = {
            get capture() {
                eventOptionsSupported = true;
                return false;
            }
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.addEventListener('test', options, options);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.removeEventListener('test', options, options);
    }
    catch (_e) {
        // event options not supported
    }
})();
class parts_EventPart {
    constructor(element, eventName, eventContext) {
        this.value = undefined;
        this.__pendingValue = undefined;
        this.element = element;
        this.eventName = eventName;
        this.eventContext = eventContext;
        this.__boundHandleEvent = (e) => this.handleEvent(e);
    }
    setValue(value) {
        this.__pendingValue = value;
    }
    commit() {
        while (isDirective(this.__pendingValue)) {
            const directive = this.__pendingValue;
            this.__pendingValue = noChange;
            directive(this);
        }
        if (this.__pendingValue === noChange) {
            return;
        }
        const newListener = this.__pendingValue;
        const oldListener = this.value;
        const shouldRemoveListener = newListener == null ||
            oldListener != null &&
                (newListener.capture !== oldListener.capture ||
                    newListener.once !== oldListener.once ||
                    newListener.passive !== oldListener.passive);
        const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);
        if (shouldRemoveListener) {
            this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options);
        }
        if (shouldAddListener) {
            this.__options = getOptions(newListener);
            this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options);
        }
        this.value = newListener;
        this.__pendingValue = noChange;
    }
    handleEvent(event) {
        if (typeof this.value === 'function') {
            this.value.call(this.eventContext || this.element, event);
        }
        else {
            this.value.handleEvent(event);
        }
    }
}
// We copy options because of the inconsistent behavior of browsers when reading
// the third argument of add/removeEventListener. IE11 doesn't support options
// at all. Chrome 41 only reads `capture` if the argument is an object.
const getOptions = (o) => o &&
    (eventOptionsSupported ?
        { capture: o.capture, passive: o.passive, once: o.once } :
        o.capture);
//# sourceMappingURL=parts.js.map
// CONCATENATED MODULE: ./node_modules/lit-html/lib/template-factory.js
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * The default TemplateFactory which caches Templates keyed on
 * result.type and result.strings.
 */
function templateFactory(result) {
    let templateCache = templateCaches.get(result.type);
    if (templateCache === undefined) {
        templateCache = {
            stringsArray: new WeakMap(),
            keyString: new Map()
        };
        templateCaches.set(result.type, templateCache);
    }
    let template = templateCache.stringsArray.get(result.strings);
    if (template !== undefined) {
        return template;
    }
    // If the TemplateStringsArray is new, generate a key from the strings
    // This key is shared between all templates with identical content
    const key = result.strings.join(marker);
    // Check if we already have a Template for this key
    template = templateCache.keyString.get(key);
    if (template === undefined) {
        // If we have not seen this key before, create a new Template
        template = new Template(result, result.getTemplateElement());
        // Cache the Template for this key
        templateCache.keyString.set(key, template);
    }
    // Cache all future queries for this TemplateStringsArray
    templateCache.stringsArray.set(result.strings, template);
    return template;
}
const templateCaches = new Map();
//# sourceMappingURL=template-factory.js.map
// CONCATENATED MODULE: ./node_modules/lit-html/lib/render.js
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * @module lit-html
 */



const render_parts = new WeakMap();
/**
 * Renders a template result or other value to a container.
 *
 * To update a container with new values, reevaluate the template literal and
 * call `render` with the new result.
 *
 * @param result Any value renderable by NodePart - typically a TemplateResult
 *     created by evaluating a template tag like `html` or `svg`.
 * @param container A DOM parent to render to. The entire contents are either
 *     replaced, or efficiently updated if the same result type was previous
 *     rendered there.
 * @param options RenderOptions for the entire render tree rendered to this
 *     container. Render options must *not* change between renders to the same
 *     container, as those changes will not effect previously rendered DOM.
 */
const render = (result, container, options) => {
    let part = render_parts.get(container);
    if (part === undefined) {
        removeNodes(container, container.firstChild);
        render_parts.set(container, part = new parts_NodePart(Object.assign({ templateFactory: templateFactory }, options)));
        part.appendInto(container);
    }
    part.setValue(result);
    part.commit();
};
//# sourceMappingURL=render.js.map
// CONCATENATED MODULE: ./node_modules/lit-html/lib/default-template-processor.js
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * Creates Parts when a template is instantiated.
 */
class default_template_processor_DefaultTemplateProcessor {
    /**
     * Create parts for an attribute-position binding, given the event, attribute
     * name, and string literals.
     *
     * @param element The element containing the binding
     * @param name  The attribute name
     * @param strings The string literals. There are always at least two strings,
     *   event for fully-controlled bindings with a single expression.
     */
    handleAttributeExpressions(element, name, strings, options) {
        const prefix = name[0];
        if (prefix === '.') {
            const committer = new PropertyCommitter(element, name.slice(1), strings);
            return committer.parts;
        }
        if (prefix === '@') {
            return [new parts_EventPart(element, name.slice(1), options.eventContext)];
        }
        if (prefix === '?') {
            return [new parts_BooleanAttributePart(element, name.slice(1), strings)];
        }
        const committer = new AttributeCommitter(element, name, strings);
        return committer.parts;
    }
    /**
     * Create parts for a text-position binding.
     * @param templateFactory
     */
    handleTextExpression(options) {
        return new parts_NodePart(options);
    }
}
const defaultTemplateProcessor = new default_template_processor_DefaultTemplateProcessor();
//# sourceMappingURL=default-template-processor.js.map
// CONCATENATED MODULE: ./node_modules/lit-html/lit-html.js
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 *
 * Main lit-html module.
 *
 * Main exports:
 *
 * -  [[html]]
 * -  [[svg]]
 * -  [[render]]
 *
 * @module lit-html
 * @preferred
 */
/**
 * Do not remove this comment; it keeps typedoc from misplacing the module
 * docs.
 */




// TODO(justinfagnani): remove line when we get NodePart moving methods








// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for lit-html usage.
// TODO(justinfagnani): inject version number at build time
if (typeof window !== 'undefined') {
    (window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.2.1');
}
/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 */
const lit_html_html = (strings, ...values) => new template_result_TemplateResult(strings, values, 'html', defaultTemplateProcessor);
/**
 * Interprets a template literal as an SVG template that can efficiently
 * render to and update a container.
 */
const svg = (strings, ...values) => new template_result_SVGTemplateResult(strings, values, 'svg', defaultTemplateProcessor);
//# sourceMappingURL=lit-html.js.map
// CONCATENATED MODULE: ./node_modules/lit-html/lib/shady-render.js
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * Module to add shady DOM/shady CSS polyfill support to lit-html template
 * rendering. See the [[render]] method for details.
 *
 * @module shady-render
 * @preferred
 */
/**
 * Do not remove this comment; it keeps typedoc from misplacing the module
 * docs.
 */







// Get a key to lookup in `templateCaches`.
const getTemplateCacheKey = (type, scopeName) => `${type}--${scopeName}`;
let compatibleShadyCSSVersion = true;
if (typeof window.ShadyCSS === 'undefined') {
    compatibleShadyCSSVersion = false;
}
else if (typeof window.ShadyCSS.prepareTemplateDom === 'undefined') {
    console.warn(`Incompatible ShadyCSS version detected. ` +
        `Please update to at least @webcomponents/webcomponentsjs@2.0.2 and ` +
        `@webcomponents/shadycss@1.3.1.`);
    compatibleShadyCSSVersion = false;
}
/**
 * Template factory which scopes template DOM using ShadyCSS.
 * @param scopeName {string}
 */
const shadyTemplateFactory = (scopeName) => (result) => {
    const cacheKey = getTemplateCacheKey(result.type, scopeName);
    let templateCache = templateCaches.get(cacheKey);
    if (templateCache === undefined) {
        templateCache = {
            stringsArray: new WeakMap(),
            keyString: new Map()
        };
        templateCaches.set(cacheKey, templateCache);
    }
    let template = templateCache.stringsArray.get(result.strings);
    if (template !== undefined) {
        return template;
    }
    const key = result.strings.join(marker);
    template = templateCache.keyString.get(key);
    if (template === undefined) {
        const element = result.getTemplateElement();
        if (compatibleShadyCSSVersion) {
            window.ShadyCSS.prepareTemplateDom(element, scopeName);
        }
        template = new Template(result, element);
        templateCache.keyString.set(key, template);
    }
    templateCache.stringsArray.set(result.strings, template);
    return template;
};
const TEMPLATE_TYPES = ['html', 'svg'];
/**
 * Removes all style elements from Templates for the given scopeName.
 */
const removeStylesFromLitTemplates = (scopeName) => {
    TEMPLATE_TYPES.forEach((type) => {
        const templates = templateCaches.get(getTemplateCacheKey(type, scopeName));
        if (templates !== undefined) {
            templates.keyString.forEach((template) => {
                const { element: { content } } = template;
                // IE 11 doesn't support the iterable param Set constructor
                const styles = new Set();
                Array.from(content.querySelectorAll('style')).forEach((s) => {
                    styles.add(s);
                });
                removeNodesFromTemplate(template, styles);
            });
        }
    });
};
const shadyRenderSet = new Set();
/**
 * For the given scope name, ensures that ShadyCSS style scoping is performed.
 * This is done just once per scope name so the fragment and template cannot
 * be modified.
 * (1) extracts styles from the rendered fragment and hands them to ShadyCSS
 * to be scoped and appended to the document
 * (2) removes style elements from all lit-html Templates for this scope name.
 *
 * Note, <style> elements can only be placed into templates for the
 * initial rendering of the scope. If <style> elements are included in templates
 * dynamically rendered to the scope (after the first scope render), they will
 * not be scoped and the <style> will be left in the template and rendered
 * output.
 */
const prepareTemplateStyles = (scopeName, renderedDOM, template) => {
    shadyRenderSet.add(scopeName);
    // If `renderedDOM` is stamped from a Template, then we need to edit that
    // Template's underlying template element. Otherwise, we create one here
    // to give to ShadyCSS, which still requires one while scoping.
    const templateElement = !!template ? template.element : document.createElement('template');
    // Move styles out of rendered DOM and store.
    const styles = renderedDOM.querySelectorAll('style');
    const { length } = styles;
    // If there are no styles, skip unnecessary work
    if (length === 0) {
        // Ensure prepareTemplateStyles is called to support adding
        // styles via `prepareAdoptedCssText` since that requires that
        // `prepareTemplateStyles` is called.
        //
        // ShadyCSS will only update styles containing @apply in the template
        // given to `prepareTemplateStyles`. If no lit Template was given,
        // ShadyCSS will not be able to update uses of @apply in any relevant
        // template. However, this is not a problem because we only create the
        // template for the purpose of supporting `prepareAdoptedCssText`,
        // which doesn't support @apply at all.
        window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
        return;
    }
    const condensedStyle = document.createElement('style');
    // Collect styles into a single style. This helps us make sure ShadyCSS
    // manipulations will not prevent us from being able to fix up template
    // part indices.
    // NOTE: collecting styles is inefficient for browsers but ShadyCSS
    // currently does this anyway. When it does not, this should be changed.
    for (let i = 0; i < length; i++) {
        const style = styles[i];
        style.parentNode.removeChild(style);
        condensedStyle.textContent += style.textContent;
    }
    // Remove styles from nested templates in this scope.
    removeStylesFromLitTemplates(scopeName);
    // And then put the condensed style into the "root" template passed in as
    // `template`.
    const content = templateElement.content;
    if (!!template) {
        insertNodeIntoTemplate(template, condensedStyle, content.firstChild);
    }
    else {
        content.insertBefore(condensedStyle, content.firstChild);
    }
    // Note, it's important that ShadyCSS gets the template that `lit-html`
    // will actually render so that it can update the style inside when
    // needed (e.g. @apply native Shadow DOM case).
    window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
    const style = content.querySelector('style');
    if (window.ShadyCSS.nativeShadow && style !== null) {
        // When in native Shadow DOM, ensure the style created by ShadyCSS is
        // included in initially rendered output (`renderedDOM`).
        renderedDOM.insertBefore(style.cloneNode(true), renderedDOM.firstChild);
    }
    else if (!!template) {
        // When no style is left in the template, parts will be broken as a
        // result. To fix this, we put back the style node ShadyCSS removed
        // and then tell lit to remove that node from the template.
        // There can be no style in the template in 2 cases (1) when Shady DOM
        // is in use, ShadyCSS removes all styles, (2) when native Shadow DOM
        // is in use ShadyCSS removes the style if it contains no content.
        // NOTE, ShadyCSS creates its own style so we can safely add/remove
        // `condensedStyle` here.
        content.insertBefore(condensedStyle, content.firstChild);
        const removes = new Set();
        removes.add(condensedStyle);
        removeNodesFromTemplate(template, removes);
    }
};
/**
 * Extension to the standard `render` method which supports rendering
 * to ShadowRoots when the ShadyDOM (https://github.com/webcomponents/shadydom)
 * and ShadyCSS (https://github.com/webcomponents/shadycss) polyfills are used
 * or when the webcomponentsjs
 * (https://github.com/webcomponents/webcomponentsjs) polyfill is used.
 *
 * Adds a `scopeName` option which is used to scope element DOM and stylesheets
 * when native ShadowDOM is unavailable. The `scopeName` will be added to
 * the class attribute of all rendered DOM. In addition, any style elements will
 * be automatically re-written with this `scopeName` selector and moved out
 * of the rendered DOM and into the document `<head>`.
 *
 * It is common to use this render method in conjunction with a custom element
 * which renders a shadowRoot. When this is done, typically the element's
 * `localName` should be used as the `scopeName`.
 *
 * In addition to DOM scoping, ShadyCSS also supports a basic shim for css
 * custom properties (needed only on older browsers like IE11) and a shim for
 * a deprecated feature called `@apply` that supports applying a set of css
 * custom properties to a given location.
 *
 * Usage considerations:
 *
 * * Part values in `<style>` elements are only applied the first time a given
 * `scopeName` renders. Subsequent changes to parts in style elements will have
 * no effect. Because of this, parts in style elements should only be used for
 * values that will never change, for example parts that set scope-wide theme
 * values or parts which render shared style elements.
 *
 * * Note, due to a limitation of the ShadyDOM polyfill, rendering in a
 * custom element's `constructor` is not supported. Instead rendering should
 * either done asynchronously, for example at microtask timing (for example
 * `Promise.resolve()`), or be deferred until the first time the element's
 * `connectedCallback` runs.
 *
 * Usage considerations when using shimmed custom properties or `@apply`:
 *
 * * Whenever any dynamic changes are made which affect
 * css custom properties, `ShadyCSS.styleElement(element)` must be called
 * to update the element. There are two cases when this is needed:
 * (1) the element is connected to a new parent, (2) a class is added to the
 * element that causes it to match different custom properties.
 * To address the first case when rendering a custom element, `styleElement`
 * should be called in the element's `connectedCallback`.
 *
 * * Shimmed custom properties may only be defined either for an entire
 * shadowRoot (for example, in a `:host` rule) or via a rule that directly
 * matches an element with a shadowRoot. In other words, instead of flowing from
 * parent to child as do native css custom properties, shimmed custom properties
 * flow only from shadowRoots to nested shadowRoots.
 *
 * * When using `@apply` mixing css shorthand property names with
 * non-shorthand names (for example `border` and `border-width`) is not
 * supported.
 */
const shady_render_render = (result, container, options) => {
    if (!options || typeof options !== 'object' || !options.scopeName) {
        throw new Error('The `scopeName` option is required.');
    }
    const scopeName = options.scopeName;
    const hasRendered = render_parts.has(container);
    const needsScoping = compatibleShadyCSSVersion &&
        container.nodeType === 11 /* Node.DOCUMENT_FRAGMENT_NODE */ &&
        !!container.host;
    // Handle first render to a scope specially...
    const firstScopeRender = needsScoping && !shadyRenderSet.has(scopeName);
    // On first scope render, render into a fragment; this cannot be a single
    // fragment that is reused since nested renders can occur synchronously.
    const renderContainer = firstScopeRender ? document.createDocumentFragment() : container;
    render(result, renderContainer, Object.assign({ templateFactory: shadyTemplateFactory(scopeName) }, options));
    // When performing first scope render,
    // (1) We've rendered into a fragment so that there's a chance to
    // `prepareTemplateStyles` before sub-elements hit the DOM
    // (which might cause them to render based on a common pattern of
    // rendering in a custom element's `connectedCallback`);
    // (2) Scope the template with ShadyCSS one time only for this scope.
    // (3) Render the fragment into the container and make sure the
    // container knows its `part` is the one we just rendered. This ensures
    // DOM will be re-used on subsequent renders.
    if (firstScopeRender) {
        const part = render_parts.get(renderContainer);
        render_parts.delete(renderContainer);
        // ShadyCSS might have style sheets (e.g. from `prepareAdoptedCssText`)
        // that should apply to `renderContainer` even if the rendered value is
        // not a TemplateInstance. However, it will only insert scoped styles
        // into the document if `prepareTemplateStyles` has already been called
        // for the given scope name.
        const template = part.value instanceof template_instance_TemplateInstance ?
            part.value.template :
            undefined;
        prepareTemplateStyles(scopeName, renderContainer, template);
        removeNodes(container, container.firstChild);
        container.appendChild(renderContainer);
        render_parts.set(container, part);
    }
    // After elements have hit the DOM, update styling if this is the
    // initial render to this container.
    // This is needed whenever dynamic changes are made so it would be
    // safest to do every render; however, this would regress performance
    // so we leave it up to the user to call `ShadyCSS.styleElement`
    // for dynamic changes.
    if (!hasRendered && needsScoping) {
        window.ShadyCSS.styleElement(container.host);
    }
};
//# sourceMappingURL=shady-render.js.map
// CONCATENATED MODULE: ./node_modules/lit-element/lib/updating-element.js
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
var _a;
/**
 * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
 * replaced at compile time by the munged name for object[property]. We cannot
 * alias this function, so we have to use a small shim that has the same
 * behavior when not compiling.
 */
window.JSCompiler_renameProperty =
    (prop, _obj) => prop;
const defaultConverter = {
    toAttribute(value, type) {
        switch (type) {
            case Boolean:
                return value ? '' : null;
            case Object:
            case Array:
                // if the value is `null` or `undefined` pass this through
                // to allow removing/no change behavior.
                return value == null ? value : JSON.stringify(value);
        }
        return value;
    },
    fromAttribute(value, type) {
        switch (type) {
            case Boolean:
                return value !== null;
            case Number:
                return value === null ? null : Number(value);
            case Object:
            case Array:
                return JSON.parse(value);
        }
        return value;
    }
};
/**
 * Change function that returns true if `value` is different from `oldValue`.
 * This method is used as the default for a property's `hasChanged` function.
 */
const notEqual = (value, old) => {
    // This ensures (old==NaN, value==NaN) always returns false
    return old !== value && (old === old || value === value);
};
const defaultPropertyDeclaration = {
    attribute: true,
    type: String,
    converter: defaultConverter,
    reflect: false,
    hasChanged: notEqual
};
const STATE_HAS_UPDATED = 1;
const STATE_UPDATE_REQUESTED = 1 << 2;
const STATE_IS_REFLECTING_TO_ATTRIBUTE = 1 << 3;
const STATE_IS_REFLECTING_TO_PROPERTY = 1 << 4;
/**
 * The Closure JS Compiler doesn't currently have good support for static
 * property semantics where "this" is dynamic (e.g.
 * https://github.com/google/closure-compiler/issues/3177 and others) so we use
 * this hack to bypass any rewriting by the compiler.
 */
const finalized = 'finalized';
/**
 * Base element class which manages element properties and attributes. When
 * properties change, the `update` method is asynchronously called. This method
 * should be supplied by subclassers to render updates as desired.
 */
class UpdatingElement extends HTMLElement {
    constructor() {
        super();
        this._updateState = 0;
        this._instanceProperties = undefined;
        // Initialize to an unresolved Promise so we can make sure the element has
        // connected before first update.
        this._updatePromise = new Promise((res) => this._enableUpdatingResolver = res);
        /**
         * Map with keys for any properties that have changed since the last
         * update cycle with previous values.
         */
        this._changedProperties = new Map();
        /**
         * Map with keys of properties that should be reflected when updated.
         */
        this._reflectingProperties = undefined;
        this.initialize();
    }
    /**
     * Returns a list of attributes corresponding to the registered properties.
     * @nocollapse
     */
    static get observedAttributes() {
        // note: piggy backing on this to ensure we're finalized.
        this.finalize();
        const attributes = [];
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        this._classProperties.forEach((v, p) => {
            const attr = this._attributeNameForProperty(p, v);
            if (attr !== undefined) {
                this._attributeToPropertyMap.set(attr, p);
                attributes.push(attr);
            }
        });
        return attributes;
    }
    /**
     * Ensures the private `_classProperties` property metadata is created.
     * In addition to `finalize` this is also called in `createProperty` to
     * ensure the `@property` decorator can add property metadata.
     */
    /** @nocollapse */
    static _ensureClassProperties() {
        // ensure private storage for property declarations.
        if (!this.hasOwnProperty(JSCompiler_renameProperty('_classProperties', this))) {
            this._classProperties = new Map();
            // NOTE: Workaround IE11 not supporting Map constructor argument.
            const superProperties = Object.getPrototypeOf(this)._classProperties;
            if (superProperties !== undefined) {
                superProperties.forEach((v, k) => this._classProperties.set(k, v));
            }
        }
    }
    /**
     * Creates a property accessor on the element prototype if one does not exist
     * and stores a PropertyDeclaration for the property with the given options.
     * The property setter calls the property's `hasChanged` property option
     * or uses a strict identity check to determine whether or not to request
     * an update.
     *
     * This method may be overridden to customize properties; however,
     * when doing so, it's important to call `super.createProperty` to ensure
     * the property is setup correctly. This method calls
     * `getPropertyDescriptor` internally to get a descriptor to install.
     * To customize what properties do when they are get or set, override
     * `getPropertyDescriptor`. To customize the options for a property,
     * implement `createProperty` like this:
     *
     * static createProperty(name, options) {
     *   options = Object.assign(options, {myOption: true});
     *   super.createProperty(name, options);
     * }
     *
     * @nocollapse
     */
    static createProperty(name, options = defaultPropertyDeclaration) {
        // Note, since this can be called by the `@property` decorator which
        // is called before `finalize`, we ensure storage exists for property
        // metadata.
        this._ensureClassProperties();
        this._classProperties.set(name, options);
        // Do not generate an accessor if the prototype already has one, since
        // it would be lost otherwise and that would never be the user's intention;
        // Instead, we expect users to call `requestUpdate` themselves from
        // user-defined accessors. Note that if the super has an accessor we will
        // still overwrite it
        if (options.noAccessor || this.prototype.hasOwnProperty(name)) {
            return;
        }
        const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
        const descriptor = this.getPropertyDescriptor(name, key, options);
        if (descriptor !== undefined) {
            Object.defineProperty(this.prototype, name, descriptor);
        }
    }
    /**
     * Returns a property descriptor to be defined on the given named property.
     * If no descriptor is returned, the property will not become an accessor.
     * For example,
     *
     *   class MyElement extends LitElement {
     *     static getPropertyDescriptor(name, key, options) {
     *       const defaultDescriptor =
     *           super.getPropertyDescriptor(name, key, options);
     *       const setter = defaultDescriptor.set;
     *       return {
     *         get: defaultDescriptor.get,
     *         set(value) {
     *           setter.call(this, value);
     *           // custom action.
     *         },
     *         configurable: true,
     *         enumerable: true
     *       }
     *     }
     *   }
     *
     * @nocollapse
     */
    static getPropertyDescriptor(name, key, _options) {
        return {
            // tslint:disable-next-line:no-any no symbol in index
            get() {
                return this[key];
            },
            set(value) {
                const oldValue = this[name];
                this[key] = value;
                this._requestUpdate(name, oldValue);
            },
            configurable: true,
            enumerable: true
        };
    }
    /**
     * Returns the property options associated with the given property.
     * These options are defined with a PropertyDeclaration via the `properties`
     * object or the `@property` decorator and are registered in
     * `createProperty(...)`.
     *
     * Note, this method should be considered "final" and not overridden. To
     * customize the options for a given property, override `createProperty`.
     *
     * @nocollapse
     * @final
     */
    static getPropertyOptions(name) {
        return this._classProperties && this._classProperties.get(name) ||
            defaultPropertyDeclaration;
    }
    /**
     * Creates property accessors for registered properties and ensures
     * any superclasses are also finalized.
     * @nocollapse
     */
    static finalize() {
        // finalize any superclasses
        const superCtor = Object.getPrototypeOf(this);
        if (!superCtor.hasOwnProperty(finalized)) {
            superCtor.finalize();
        }
        this[finalized] = true;
        this._ensureClassProperties();
        // initialize Map populated in observedAttributes
        this._attributeToPropertyMap = new Map();
        // make any properties
        // Note, only process "own" properties since this element will inherit
        // any properties defined on the superClass, and finalization ensures
        // the entire prototype chain is finalized.
        if (this.hasOwnProperty(JSCompiler_renameProperty('properties', this))) {
            const props = this.properties;
            // support symbols in properties (IE11 does not support this)
            const propKeys = [
                ...Object.getOwnPropertyNames(props),
                ...(typeof Object.getOwnPropertySymbols === 'function') ?
                    Object.getOwnPropertySymbols(props) :
                    []
            ];
            // This for/of is ok because propKeys is an array
            for (const p of propKeys) {
                // note, use of `any` is due to TypeSript lack of support for symbol in
                // index types
                // tslint:disable-next-line:no-any no symbol in index
                this.createProperty(p, props[p]);
            }
        }
    }
    /**
     * Returns the property name for the given attribute `name`.
     * @nocollapse
     */
    static _attributeNameForProperty(name, options) {
        const attribute = options.attribute;
        return attribute === false ?
            undefined :
            (typeof attribute === 'string' ?
                attribute :
                (typeof name === 'string' ? name.toLowerCase() : undefined));
    }
    /**
     * Returns true if a property should request an update.
     * Called when a property value is set and uses the `hasChanged`
     * option for the property if present or a strict identity check.
     * @nocollapse
     */
    static _valueHasChanged(value, old, hasChanged = notEqual) {
        return hasChanged(value, old);
    }
    /**
     * Returns the property value for the given attribute value.
     * Called via the `attributeChangedCallback` and uses the property's
     * `converter` or `converter.fromAttribute` property option.
     * @nocollapse
     */
    static _propertyValueFromAttribute(value, options) {
        const type = options.type;
        const converter = options.converter || defaultConverter;
        const fromAttribute = (typeof converter === 'function' ? converter : converter.fromAttribute);
        return fromAttribute ? fromAttribute(value, type) : value;
    }
    /**
     * Returns the attribute value for the given property value. If this
     * returns undefined, the property will *not* be reflected to an attribute.
     * If this returns null, the attribute will be removed, otherwise the
     * attribute will be set to the value.
     * This uses the property's `reflect` and `type.toAttribute` property options.
     * @nocollapse
     */
    static _propertyValueToAttribute(value, options) {
        if (options.reflect === undefined) {
            return;
        }
        const type = options.type;
        const converter = options.converter;
        const toAttribute = converter && converter.toAttribute ||
            defaultConverter.toAttribute;
        return toAttribute(value, type);
    }
    /**
     * Performs element initialization. By default captures any pre-set values for
     * registered properties.
     */
    initialize() {
        this._saveInstanceProperties();
        // ensures first update will be caught by an early access of
        // `updateComplete`
        this._requestUpdate();
    }
    /**
     * Fixes any properties set on the instance before upgrade time.
     * Otherwise these would shadow the accessor and break these properties.
     * The properties are stored in a Map which is played back after the
     * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
     * (<=41), properties created for native platform properties like (`id` or
     * `name`) may not have default values set in the element constructor. On
     * these browsers native properties appear on instances and therefore their
     * default value will overwrite any element default (e.g. if the element sets
     * this.id = 'id' in the constructor, the 'id' will become '' since this is
     * the native platform default).
     */
    _saveInstanceProperties() {
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        this.constructor
            ._classProperties.forEach((_v, p) => {
            if (this.hasOwnProperty(p)) {
                const value = this[p];
                delete this[p];
                if (!this._instanceProperties) {
                    this._instanceProperties = new Map();
                }
                this._instanceProperties.set(p, value);
            }
        });
    }
    /**
     * Applies previously saved instance properties.
     */
    _applyInstanceProperties() {
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        // tslint:disable-next-line:no-any
        this._instanceProperties.forEach((v, p) => this[p] = v);
        this._instanceProperties = undefined;
    }
    connectedCallback() {
        // Ensure first connection completes an update. Updates cannot complete
        // before connection.
        this.enableUpdating();
    }
    enableUpdating() {
        if (this._enableUpdatingResolver !== undefined) {
            this._enableUpdatingResolver();
            this._enableUpdatingResolver = undefined;
        }
    }
    /**
     * Allows for `super.disconnectedCallback()` in extensions while
     * reserving the possibility of making non-breaking feature additions
     * when disconnecting at some point in the future.
     */
    disconnectedCallback() {
    }
    /**
     * Synchronizes property values when attributes change.
     */
    attributeChangedCallback(name, old, value) {
        if (old !== value) {
            this._attributeToProperty(name, value);
        }
    }
    _propertyToAttribute(name, value, options = defaultPropertyDeclaration) {
        const ctor = this.constructor;
        const attr = ctor._attributeNameForProperty(name, options);
        if (attr !== undefined) {
            const attrValue = ctor._propertyValueToAttribute(value, options);
            // an undefined value does not change the attribute.
            if (attrValue === undefined) {
                return;
            }
            // Track if the property is being reflected to avoid
            // setting the property again via `attributeChangedCallback`. Note:
            // 1. this takes advantage of the fact that the callback is synchronous.
            // 2. will behave incorrectly if multiple attributes are in the reaction
            // stack at time of calling. However, since we process attributes
            // in `update` this should not be possible (or an extreme corner case
            // that we'd like to discover).
            // mark state reflecting
            this._updateState = this._updateState | STATE_IS_REFLECTING_TO_ATTRIBUTE;
            if (attrValue == null) {
                this.removeAttribute(attr);
            }
            else {
                this.setAttribute(attr, attrValue);
            }
            // mark state not reflecting
            this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_ATTRIBUTE;
        }
    }
    _attributeToProperty(name, value) {
        // Use tracking info to avoid deserializing attribute value if it was
        // just set from a property setter.
        if (this._updateState & STATE_IS_REFLECTING_TO_ATTRIBUTE) {
            return;
        }
        const ctor = this.constructor;
        // Note, hint this as an `AttributeMap` so closure clearly understands
        // the type; it has issues with tracking types through statics
        // tslint:disable-next-line:no-unnecessary-type-assertion
        const propName = ctor._attributeToPropertyMap.get(name);
        if (propName !== undefined) {
            const options = ctor.getPropertyOptions(propName);
            // mark state reflecting
            this._updateState = this._updateState | STATE_IS_REFLECTING_TO_PROPERTY;
            this[propName] =
                // tslint:disable-next-line:no-any
                ctor._propertyValueFromAttribute(value, options);
            // mark state not reflecting
            this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_PROPERTY;
        }
    }
    /**
     * This private version of `requestUpdate` does not access or return the
     * `updateComplete` promise. This promise can be overridden and is therefore
     * not free to access.
     */
    _requestUpdate(name, oldValue) {
        let shouldRequestUpdate = true;
        // If we have a property key, perform property update steps.
        if (name !== undefined) {
            const ctor = this.constructor;
            const options = ctor.getPropertyOptions(name);
            if (ctor._valueHasChanged(this[name], oldValue, options.hasChanged)) {
                if (!this._changedProperties.has(name)) {
                    this._changedProperties.set(name, oldValue);
                }
                // Add to reflecting properties set.
                // Note, it's important that every change has a chance to add the
                // property to `_reflectingProperties`. This ensures setting
                // attribute + property reflects correctly.
                if (options.reflect === true &&
                    !(this._updateState & STATE_IS_REFLECTING_TO_PROPERTY)) {
                    if (this._reflectingProperties === undefined) {
                        this._reflectingProperties = new Map();
                    }
                    this._reflectingProperties.set(name, options);
                }
            }
            else {
                // Abort the request if the property should not be considered changed.
                shouldRequestUpdate = false;
            }
        }
        if (!this._hasRequestedUpdate && shouldRequestUpdate) {
            this._updatePromise = this._enqueueUpdate();
        }
    }
    /**
     * Requests an update which is processed asynchronously. This should
     * be called when an element should update based on some state not triggered
     * by setting a property. In this case, pass no arguments. It should also be
     * called when manually implementing a property setter. In this case, pass the
     * property `name` and `oldValue` to ensure that any configured property
     * options are honored. Returns the `updateComplete` Promise which is resolved
     * when the update completes.
     *
     * @param name {PropertyKey} (optional) name of requesting property
     * @param oldValue {any} (optional) old value of requesting property
     * @returns {Promise} A Promise that is resolved when the update completes.
     */
    requestUpdate(name, oldValue) {
        this._requestUpdate(name, oldValue);
        return this.updateComplete;
    }
    /**
     * Sets up the element to asynchronously update.
     */
    async _enqueueUpdate() {
        this._updateState = this._updateState | STATE_UPDATE_REQUESTED;
        try {
            // Ensure any previous update has resolved before updating.
            // This `await` also ensures that property changes are batched.
            await this._updatePromise;
        }
        catch (e) {
            // Ignore any previous errors. We only care that the previous cycle is
            // done. Any error should have been handled in the previous update.
        }
        const result = this.performUpdate();
        // If `performUpdate` returns a Promise, we await it. This is done to
        // enable coordinating updates with a scheduler. Note, the result is
        // checked to avoid delaying an additional microtask unless we need to.
        if (result != null) {
            await result;
        }
        return !this._hasRequestedUpdate;
    }
    get _hasRequestedUpdate() {
        return (this._updateState & STATE_UPDATE_REQUESTED);
    }
    get hasUpdated() {
        return (this._updateState & STATE_HAS_UPDATED);
    }
    /**
     * Performs an element update. Note, if an exception is thrown during the
     * update, `firstUpdated` and `updated` will not be called.
     *
     * You can override this method to change the timing of updates. If this
     * method is overridden, `super.performUpdate()` must be called.
     *
     * For instance, to schedule updates to occur just before the next frame:
     *
     * ```
     * protected async performUpdate(): Promise<unknown> {
     *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
     *   super.performUpdate();
     * }
     * ```
     */
    performUpdate() {
        // Mixin instance properties once, if they exist.
        if (this._instanceProperties) {
            this._applyInstanceProperties();
        }
        let shouldUpdate = false;
        const changedProperties = this._changedProperties;
        try {
            shouldUpdate = this.shouldUpdate(changedProperties);
            if (shouldUpdate) {
                this.update(changedProperties);
            }
            else {
                this._markUpdated();
            }
        }
        catch (e) {
            // Prevent `firstUpdated` and `updated` from running when there's an
            // update exception.
            shouldUpdate = false;
            // Ensure element can accept additional updates after an exception.
            this._markUpdated();
            throw e;
        }
        if (shouldUpdate) {
            if (!(this._updateState & STATE_HAS_UPDATED)) {
                this._updateState = this._updateState | STATE_HAS_UPDATED;
                this.firstUpdated(changedProperties);
            }
            this.updated(changedProperties);
        }
    }
    _markUpdated() {
        this._changedProperties = new Map();
        this._updateState = this._updateState & ~STATE_UPDATE_REQUESTED;
    }
    /**
     * Returns a Promise that resolves when the element has completed updating.
     * The Promise value is a boolean that is `true` if the element completed the
     * update without triggering another update. The Promise result is `false` if
     * a property was set inside `updated()`. If the Promise is rejected, an
     * exception was thrown during the update.
     *
     * To await additional asynchronous work, override the `_getUpdateComplete`
     * method. For example, it is sometimes useful to await a rendered element
     * before fulfilling this Promise. To do this, first await
     * `super._getUpdateComplete()`, then any subsequent state.
     *
     * @returns {Promise} The Promise returns a boolean that indicates if the
     * update resolved without triggering another update.
     */
    get updateComplete() {
        return this._getUpdateComplete();
    }
    /**
     * Override point for the `updateComplete` promise.
     *
     * It is not safe to override the `updateComplete` getter directly due to a
     * limitation in TypeScript which means it is not possible to call a
     * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
     * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
     * This method should be overridden instead. For example:
     *
     *   class MyElement extends LitElement {
     *     async _getUpdateComplete() {
     *       await super._getUpdateComplete();
     *       await this._myChild.updateComplete;
     *     }
     *   }
     */
    _getUpdateComplete() {
        return this._updatePromise;
    }
    /**
     * Controls whether or not `update` should be called when the element requests
     * an update. By default, this method always returns `true`, but this can be
     * customized to control when to update.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    shouldUpdate(_changedProperties) {
        return true;
    }
    /**
     * Updates the element. This method reflects property values to attributes.
     * It can be overridden to render and keep updated element DOM.
     * Setting properties inside this method will *not* trigger
     * another update.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    update(_changedProperties) {
        if (this._reflectingProperties !== undefined &&
            this._reflectingProperties.size > 0) {
            // Use forEach so this works even if for/of loops are compiled to for
            // loops expecting arrays
            this._reflectingProperties.forEach((v, k) => this._propertyToAttribute(k, this[k], v));
            this._reflectingProperties = undefined;
        }
        this._markUpdated();
    }
    /**
     * Invoked whenever the element is updated. Implement to perform
     * post-updating tasks via DOM APIs, for example, focusing an element.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    updated(_changedProperties) {
    }
    /**
     * Invoked when the element is first updated. Implement to perform one time
     * work on the element after update.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    firstUpdated(_changedProperties) {
    }
}
_a = finalized;
/**
 * Marks class as having finished creating properties.
 */
UpdatingElement[_a] = true;
//# sourceMappingURL=updating-element.js.map
// CONCATENATED MODULE: ./node_modules/lit-element/lib/decorators.js
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const legacyCustomElement = (tagName, clazz) => {
    window.customElements.define(tagName, clazz);
    // Cast as any because TS doesn't recognize the return type as being a
    // subtype of the decorated class when clazz is typed as
    // `Constructor<HTMLElement>` for some reason.
    // `Constructor<HTMLElement>` is helpful to make sure the decorator is
    // applied to elements however.
    // tslint:disable-next-line:no-any
    return clazz;
};
const standardCustomElement = (tagName, descriptor) => {
    const { kind, elements } = descriptor;
    return {
        kind,
        elements,
        // This callback is called once the class is otherwise fully defined
        finisher(clazz) {
            window.customElements.define(tagName, clazz);
        }
    };
};
/**
 * Class decorator factory that defines the decorated class as a custom element.
 *
 * ```
 * @customElement('my-element')
 * class MyElement {
 *   render() {
 *     return html``;
 *   }
 * }
 * ```
 *
 * @param tagName The name of the custom element to define.
 */
const customElement = (tagName) => (classOrDescriptor) => (typeof classOrDescriptor === 'function') ?
    legacyCustomElement(tagName, classOrDescriptor) :
    standardCustomElement(tagName, classOrDescriptor);
const standardProperty = (options, element) => {
    // When decorating an accessor, pass it through and add property metadata.
    // Note, the `hasOwnProperty` check in `createProperty` ensures we don't
    // stomp over the user's accessor.
    if (element.kind === 'method' && element.descriptor &&
        !('value' in element.descriptor)) {
        return Object.assign(Object.assign({}, element), { finisher(clazz) {
                clazz.createProperty(element.key, options);
            } });
    }
    else {
        // createProperty() takes care of defining the property, but we still
        // must return some kind of descriptor, so return a descriptor for an
        // unused prototype field. The finisher calls createProperty().
        return {
            kind: 'field',
            key: Symbol(),
            placement: 'own',
            descriptor: {},
            // When @babel/plugin-proposal-decorators implements initializers,
            // do this instead of the initializer below. See:
            // https://github.com/babel/babel/issues/9260 extras: [
            //   {
            //     kind: 'initializer',
            //     placement: 'own',
            //     initializer: descriptor.initializer,
            //   }
            // ],
            initializer() {
                if (typeof element.initializer === 'function') {
                    this[element.key] = element.initializer.call(this);
                }
            },
            finisher(clazz) {
                clazz.createProperty(element.key, options);
            }
        };
    }
};
const legacyProperty = (options, proto, name) => {
    proto.constructor
        .createProperty(name, options);
};
/**
 * A property decorator which creates a LitElement property which reflects a
 * corresponding attribute value. A `PropertyDeclaration` may optionally be
 * supplied to configure property features.
 *
 * This decorator should only be used for public fields. Private or protected
 * fields should use the internalProperty decorator.
 *
 * @example
 *
 *     class MyElement {
 *       @property({ type: Boolean })
 *       clicked = false;
 *     }
 *
 * @ExportDecoratedItems
 */
function property(options) {
    // tslint:disable-next-line:no-any decorator
    return (protoOrDescriptor, name) => (name !== undefined) ?
        legacyProperty(options, protoOrDescriptor, name) :
        standardProperty(options, protoOrDescriptor);
}
/**
 * Declares a private or protected property that still triggers updates to the
 * element when it changes.
 *
 * Properties declared this way must not be used from HTML or HTML templating
 * systems, they're solely for properties internal to the element. These
 * properties may be renamed by optimization tools like closure compiler.
 */
function internalProperty(options) {
    return property({ attribute: false, hasChanged: options === null || options === void 0 ? void 0 : options.hasChanged });
}
/**
 * A property decorator that converts a class property into a getter that
 * executes a querySelector on the element's renderRoot.
 *
 * @param selector A DOMString containing one or more selectors to match.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
 *
 * @example
 *
 *     class MyElement {
 *       @query('#first')
 *       first;
 *
 *       render() {
 *         return html`
 *           <div id="first"></div>
 *           <div id="second"></div>
 *         `;
 *       }
 *     }
 *
 */
function query(selector) {
    return (protoOrDescriptor, 
    // tslint:disable-next-line:no-any decorator
    name) => {
        const descriptor = {
            get() {
                return this.renderRoot.querySelector(selector);
            },
            enumerable: true,
            configurable: true,
        };
        return (name !== undefined) ?
            legacyQuery(descriptor, protoOrDescriptor, name) :
            standardQuery(descriptor, protoOrDescriptor);
    };
}
// Note, in the future, we may extend this decorator to support the use case
// where the queried element may need to do work to become ready to interact
// with (e.g. load some implementation code). If so, we might elect to
// add a second argument defining a function that can be run to make the
// queried element loaded/updated/ready.
/**
 * A property decorator that converts a class property into a getter that
 * returns a promise that resolves to the result of a querySelector on the
 * element's renderRoot done after the element's `updateComplete` promise
 * resolves. When the queried property may change with element state, this
 * decorator can be used instead of requiring users to await the
 * `updateComplete` before accessing the property.
 *
 * @param selector A DOMString containing one or more selectors to match.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
 *
 * @example
 *
 *     class MyElement {
 *       @queryAsync('#first')
 *       first;
 *
 *       render() {
 *         return html`
 *           <div id="first"></div>
 *           <div id="second"></div>
 *         `;
 *       }
 *     }
 *
 *     // external usage
 *     async doSomethingWithFirst() {
 *      (await aMyElement.first).doSomething();
 *     }
 */
function queryAsync(selector) {
    return (protoOrDescriptor, 
    // tslint:disable-next-line:no-any decorator
    name) => {
        const descriptor = {
            async get() {
                await this.updateComplete;
                return this.renderRoot.querySelector(selector);
            },
            enumerable: true,
            configurable: true,
        };
        return (name !== undefined) ?
            legacyQuery(descriptor, protoOrDescriptor, name) :
            standardQuery(descriptor, protoOrDescriptor);
    };
}
/**
 * A property decorator that converts a class property into a getter
 * that executes a querySelectorAll on the element's renderRoot.
 *
 * @param selector A DOMString containing one or more selectors to match.
 *
 * See:
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll
 *
 * @example
 *
 *     class MyElement {
 *       @queryAll('div')
 *       divs;
 *
 *       render() {
 *         return html`
 *           <div id="first"></div>
 *           <div id="second"></div>
 *         `;
 *       }
 *     }
 */
function queryAll(selector) {
    return (protoOrDescriptor, 
    // tslint:disable-next-line:no-any decorator
    name) => {
        const descriptor = {
            get() {
                return this.renderRoot.querySelectorAll(selector);
            },
            enumerable: true,
            configurable: true,
        };
        return (name !== undefined) ?
            legacyQuery(descriptor, protoOrDescriptor, name) :
            standardQuery(descriptor, protoOrDescriptor);
    };
}
const legacyQuery = (descriptor, proto, name) => {
    Object.defineProperty(proto, name, descriptor);
};
const standardQuery = (descriptor, element) => ({
    kind: 'method',
    placement: 'prototype',
    key: element.key,
    descriptor,
});
const standardEventOptions = (options, element) => {
    return Object.assign(Object.assign({}, element), { finisher(clazz) {
            Object.assign(clazz.prototype[element.key], options);
        } });
};
const legacyEventOptions = 
// tslint:disable-next-line:no-any legacy decorator
(options, proto, name) => {
    Object.assign(proto[name], options);
};
/**
 * Adds event listener options to a method used as an event listener in a
 * lit-html template.
 *
 * @param options An object that specifies event listener options as accepted by
 * `EventTarget#addEventListener` and `EventTarget#removeEventListener`.
 *
 * Current browsers support the `capture`, `passive`, and `once` options. See:
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters
 *
 * @example
 *
 *     class MyElement {
 *       clicked = false;
 *
 *       render() {
 *         return html`
 *           <div @click=${this._onClick}`>
 *             <button></button>
 *           </div>
 *         `;
 *       }
 *
 *       @eventOptions({capture: true})
 *       _onClick(e) {
 *         this.clicked = true;
 *       }
 *     }
 */
function eventOptions(options) {
    // Return value typed as any to prevent TypeScript from complaining that
    // standard decorator function signature does not match TypeScript decorator
    // signature
    // TODO(kschaaf): unclear why it was only failing on this decorator and not
    // the others
    return ((protoOrDescriptor, name) => (name !== undefined) ?
        legacyEventOptions(options, protoOrDescriptor, name) :
        standardEventOptions(options, protoOrDescriptor));
}
/**
 * A property decorator that converts a class property into a getter that
 * returns the `assignedNodes` of the given named `slot`. Note, the type of
 * this property should be annotated as `NodeListOf<HTMLElement>`.
 *
 */
function queryAssignedNodes(slotName = '', flatten = false) {
    return (protoOrDescriptor, 
    // tslint:disable-next-line:no-any decorator
    name) => {
        const descriptor = {
            get() {
                const selector = `slot${slotName ? `[name=${slotName}]` : ''}`;
                const slot = this.renderRoot.querySelector(selector);
                return slot && slot.assignedNodes({ flatten });
            },
            enumerable: true,
            configurable: true,
        };
        return (name !== undefined) ?
            legacyQuery(descriptor, protoOrDescriptor, name) :
            standardQuery(descriptor, protoOrDescriptor);
    };
}
//# sourceMappingURL=decorators.js.map
// CONCATENATED MODULE: ./node_modules/lit-element/lib/css-tag.js
/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
const supportsAdoptingStyleSheets = ('adoptedStyleSheets' in Document.prototype) &&
    ('replace' in CSSStyleSheet.prototype);
const constructionToken = Symbol();
class CSSResult {
    constructor(cssText, safeToken) {
        if (safeToken !== constructionToken) {
            throw new Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
        }
        this.cssText = cssText;
    }
    // Note, this is a getter so that it's lazy. In practice, this means
    // stylesheets are not created until the first element instance is made.
    get styleSheet() {
        if (this._styleSheet === undefined) {
            // Note, if `adoptedStyleSheets` is supported then we assume CSSStyleSheet
            // is constructable.
            if (supportsAdoptingStyleSheets) {
                this._styleSheet = new CSSStyleSheet();
                this._styleSheet.replaceSync(this.cssText);
            }
            else {
                this._styleSheet = null;
            }
        }
        return this._styleSheet;
    }
    toString() {
        return this.cssText;
    }
}
/**
 * Wrap a value for interpolation in a css tagged template literal.
 *
 * This is unsafe because untrusted CSS text can be used to phone home
 * or exfiltrate data to an attacker controlled site. Take care to only use
 * this with trusted input.
 */
const unsafeCSS = (value) => {
    return new CSSResult(String(value), constructionToken);
};
const textFromCSSResult = (value) => {
    if (value instanceof CSSResult) {
        return value.cssText;
    }
    else if (typeof value === 'number') {
        return value;
    }
    else {
        throw new Error(`Value passed to 'css' function must be a 'css' function result: ${value}. Use 'unsafeCSS' to pass non-literal values, but
            take care to ensure page security.`);
    }
};
/**
 * Template tag which which can be used with LitElement's `style` property to
 * set element styles. For security reasons, only literal string values may be
 * used. To incorporate non-literal values `unsafeCSS` may be used inside a
 * template string part.
 */
const css = (strings, ...values) => {
    const cssText = values.reduce((acc, v, idx) => acc + textFromCSSResult(v) + strings[idx + 1], strings[0]);
    return new CSSResult(cssText, constructionToken);
};
//# sourceMappingURL=css-tag.js.map
// CONCATENATED MODULE: ./node_modules/lit-element/lit-element.js
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */







// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for LitElement usage.
// TODO(justinfagnani): inject version number at build time
(window['litElementVersions'] || (window['litElementVersions'] = []))
    .push('2.3.1');
/**
 * Sentinal value used to avoid calling lit-html's render function when
 * subclasses do not implement `render`
 */
const renderNotImplemented = {};
class lit_element_LitElement extends UpdatingElement {
    /**
     * Return the array of styles to apply to the element.
     * Override this method to integrate into a style management system.
     *
     * @nocollapse
     */
    static getStyles() {
        return this.styles;
    }
    /** @nocollapse */
    static _getUniqueStyles() {
        // Only gather styles once per class
        if (this.hasOwnProperty(JSCompiler_renameProperty('_styles', this))) {
            return;
        }
        // Take care not to call `this.getStyles()` multiple times since this
        // generates new CSSResults each time.
        // TODO(sorvell): Since we do not cache CSSResults by input, any
        // shared styles will generate new stylesheet objects, which is wasteful.
        // This should be addressed when a browser ships constructable
        // stylesheets.
        const userStyles = this.getStyles();
        if (userStyles === undefined) {
            this._styles = [];
        }
        else if (Array.isArray(userStyles)) {
            // De-duplicate styles preserving the _last_ instance in the set.
            // This is a performance optimization to avoid duplicated styles that can
            // occur especially when composing via subclassing.
            // The last item is kept to try to preserve the cascade order with the
            // assumption that it's most important that last added styles override
            // previous styles.
            const addStyles = (styles, set) => styles.reduceRight((set, s) => 
            // Note: On IE set.add() does not return the set
            Array.isArray(s) ? addStyles(s, set) : (set.add(s), set), set);
            // Array.from does not work on Set in IE, otherwise return
            // Array.from(addStyles(userStyles, new Set<CSSResult>())).reverse()
            const set = addStyles(userStyles, new Set());
            const styles = [];
            set.forEach((v) => styles.unshift(v));
            this._styles = styles;
        }
        else {
            this._styles = [userStyles];
        }
    }
    /**
     * Performs element initialization. By default this calls `createRenderRoot`
     * to create the element `renderRoot` node and captures any pre-set values for
     * registered properties.
     */
    initialize() {
        super.initialize();
        this.constructor._getUniqueStyles();
        this.renderRoot =
            this.createRenderRoot();
        // Note, if renderRoot is not a shadowRoot, styles would/could apply to the
        // element's getRootNode(). While this could be done, we're choosing not to
        // support this now since it would require different logic around de-duping.
        if (window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot) {
            this.adoptStyles();
        }
    }
    /**
     * Returns the node into which the element should render and by default
     * creates and returns an open shadowRoot. Implement to customize where the
     * element's DOM is rendered. For example, to render into the element's
     * childNodes, return `this`.
     * @returns {Element|DocumentFragment} Returns a node into which to render.
     */
    createRenderRoot() {
        return this.attachShadow({ mode: 'open' });
    }
    /**
     * Applies styling to the element shadowRoot using the `static get styles`
     * property. Styling will apply using `shadowRoot.adoptedStyleSheets` where
     * available and will fallback otherwise. When Shadow DOM is polyfilled,
     * ShadyCSS scopes styles and adds them to the document. When Shadow DOM
     * is available but `adoptedStyleSheets` is not, styles are appended to the
     * end of the `shadowRoot` to [mimic spec
     * behavior](https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets).
     */
    adoptStyles() {
        const styles = this.constructor._styles;
        if (styles.length === 0) {
            return;
        }
        // There are three separate cases here based on Shadow DOM support.
        // (1) shadowRoot polyfilled: use ShadyCSS
        // (2) shadowRoot.adoptedStyleSheets available: use it.
        // (3) shadowRoot.adoptedStyleSheets polyfilled: append styles after
        // rendering
        if (window.ShadyCSS !== undefined && !window.ShadyCSS.nativeShadow) {
            window.ShadyCSS.ScopingShim.prepareAdoptedCssText(styles.map((s) => s.cssText), this.localName);
        }
        else if (supportsAdoptingStyleSheets) {
            this.renderRoot.adoptedStyleSheets =
                styles.map((s) => s.styleSheet);
        }
        else {
            // This must be done after rendering so the actual style insertion is done
            // in `update`.
            this._needsShimAdoptedStyleSheets = true;
        }
    }
    connectedCallback() {
        super.connectedCallback();
        // Note, first update/render handles styleElement so we only call this if
        // connected after first update.
        if (this.hasUpdated && window.ShadyCSS !== undefined) {
            window.ShadyCSS.styleElement(this);
        }
    }
    /**
     * Updates the element. This method reflects property values to attributes
     * and calls `render` to render DOM via lit-html. Setting properties inside
     * this method will *not* trigger another update.
     * @param _changedProperties Map of changed properties with old values
     */
    update(changedProperties) {
        // Setting properties in `render` should not trigger an update. Since
        // updates are allowed after super.update, it's important to call `render`
        // before that.
        const templateResult = this.render();
        super.update(changedProperties);
        // If render is not implemented by the component, don't call lit-html render
        if (templateResult !== renderNotImplemented) {
            this.constructor
                .render(templateResult, this.renderRoot, { scopeName: this.localName, eventContext: this });
        }
        // When native Shadow DOM is used but adoptedStyles are not supported,
        // insert styling after rendering to ensure adoptedStyles have highest
        // priority.
        if (this._needsShimAdoptedStyleSheets) {
            this._needsShimAdoptedStyleSheets = false;
            this.constructor._styles.forEach((s) => {
                const style = document.createElement('style');
                style.textContent = s.cssText;
                this.renderRoot.appendChild(style);
            });
        }
    }
    /**
     * Invoked on each update to perform rendering tasks. This method may return
     * any value renderable by lit-html's NodePart - typically a TemplateResult.
     * Setting properties inside this method will *not* trigger the element to
     * update.
     */
    render() {
        return renderNotImplemented;
    }
}
/**
 * Ensure this class is marked as `finalized` as an optimization ensuring
 * it will not needlessly try to `finalize`.
 *
 * Note this property name is a string to prevent breaking Closure JS Compiler
 * optimizations. See updating-element.ts for more information.
 */
lit_element_LitElement['finalized'] = true;
/**
 * Render method used to render the value to the element's DOM.
 * @param result The value to render.
 * @param container Node into which to render.
 * @param options Element name.
 * @nocollapse
 */
lit_element_LitElement.render = shady_render_render;
//# sourceMappingURL=lit-element.js.map

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * A module for defining render-able entities with traits.
 * @module entity_system
 */

const CellStates = __webpack_require__(10);

/**
 * A render-able entity. The entity is defined by registering traits.
 */
class Entity {
	/**
	 * Create a new Entity.
	 */
	constructor() {
		this.traits = [];
		this.className = 'Entity';
	}

	/**
	 * Process all register traits.
	 * @param {HTMLCanvasContext} rendererContext
	 */
	render(rendererContext) {
		let context = {
			rendererContext: rendererContext,
			entity: this,
		};
		this.traits.forEach((trait) => {
			trait.process(context);
		});
	}

	/**
	 * Expands the definition of the entity by registering traits.
	 * @param {Trait} trait - An implementation of the Trait abstract class.
	 */
	register(trait) {
		this.traits.push(trait);
		return this;
	}

	/**
	 * Automatically called by JSON.stringify().
	 * Injects the original class name as a property when serialized
	 * which an be used to rebuild a Scene after communicated from a thread.
	 * @returns Entity
	 */
	toJSON() {
		this.className = this.constructor.name;
		return this;
	}

	copyParams(original) {
		for (var key in original) {
			if (key != 'className' && key != 'traits') {
				this[key] = original[key];
			}
		}
		return this;
	}

	initTraits(original, traitBuilderFactory) {
		this.traits = original.traits.map((traitLit) => {
			var traitBuilder = traitBuilderFactory(traitLit.className);
			return traitBuilder ? traitBuilder(traitLit) : new Trait();
		});
		return this;
	}
}

class EntityBatch extends Entity {
	constructor() {
		super();
		this.entities = [];
	}

	add(entity) {
		if (entity && Array.isArray(entity) && entity.length > 0) {
			this.entities = this.entities.concat(entity);
		} else {
			entity && this.entities.push(entity);
		}
		return this;
	}
}

class EntityBatchArrayBuffer extends Entity {
	constructor(buffer, offset, numberOfEntities, entityFieldsCount) {
		super();
		this.buffer = buffer;
		this.initialOffset = offset;
		this.bufferEnd = offset + numberOfEntities * entityFieldsCount;
		this.numberOfEntities = numberOfEntities;
		this.entityFieldsCount = entityFieldsCount;
	}
}

const CELL_WIDTH = 1;
const CELL_HEIGHT = 1;

/**
 * Represents a single unit on an abstract 2D grid.
 *
 * The width and height of the cell are the equal.
 * The grid is uniform.
 * @extends Entity
 */
class Cell extends Entity {
	/**
	 * Create a new cell.
	 * @param {number} row - The horizontal location of the cell on a grid.
	 * @param {number} col - The vertical location of the cell on a grid.
	 */
	constructor(row, col, state = CellStates.ACTIVE) {
		super();
		this.className = 'Cell';
		this.row = row;
		this.col = col;
		this.state = state;
	}

	/**
	 * Intersection Test. Is the cell inside of a provided rectangle.
	 * @param {number} x
	 * @param {number} y
	 * @param {number} xx
	 * @param {number} yy
	 * @returns {boolean}
	 */
	isInsideRect(x, y, xx, yy) {
		return x <= this.row && this.row <= xx && y <= this.col && this.col <= yy;
	}

	/**
	 * Create a deep copy of the cell.
	 * @returns {Cell}
	 */
	clone() {
		return new Cell(this.row, this.col);
	}

	rightBoundary() {
		return this.row + CELL_WIDTH;
	}

	lowerBoundary() {
		return this.col + CELL_HEIGHT;
	}

	static buildInstance(params) {
		return new Cell().copyParams(params);
	}

	static mergeObjsWithCells(cells, objs) {
		objs.forEach((obj) => {
			//Don't include any boxes.
			if (
				obj.className === 'Cell' &&
				!cells.some((c) => c.row == obj.row && c.col == obj.col)
			) {
				cells.push(this.buildInstance(obj));
			}
		});
	}
}

class DeadCell extends Cell {
	constructor(row, col) {
		super(row, col);
	}

	getState() {
		return CellStates.DEAD;
	}
}

/**
 * A grid.
 */
class GridEntity extends Entity {
	/**
	 * Creates a new grid entity
	 * @param {number} width - The total width of the grid.
	 * @param {number} height - The total height of the grid.
	 * @param {number} cWidth - The width of a grid cell.
	 * @param {number} cHeight - The height of a grid cell.
	 */
	constructor(width = null, height = null, cWidth = null, cHeight = null) {
		super();
		this.width = width;
		this.height = height;
		this.cell = { width: cWidth, height: cHeight };
		this.className = 'GridEntity';
	}

	static buildInstance(params, traitBuilderMap = null) {
		let entity = new GridEntity().copyParams(params);
		traitBuilderMap && entity.initTraits(params, traitBuilderMap);
		return entity;
	}
}

/**
 * Represents a box that can be processed via Traits.
 */
class Box extends Entity {
	/**
	 * Creates a new Box.
	 * @param {number} x - Left most X coordinate.
	 * @param {number} y - Upper most Y coordinate.
	 * @param {number} xx - Right most X coordinate.
	 * @param {number} yy - Lower most Y coordinate.
	 * @param {boolean} alive - If the cell is alive or not.
	 */
	constructor(x = null, y = null, xx = null, yy = null, alive = null) {
		super();
		this.x = x;
		this.y = y;
		this.xx = xx;
		this.yy = yy;
		this.alive = alive;
		this.className = 'Box';
	}

	static buildInstance(params, traitBuilderMap = null) {
		let box = new Box().copyParams(params);
		traitBuilderMap && box.initTraits(params, traitBuilderMap);
		return box;
	}
}

module.exports = {
	Box,
	Cell,
	DeadCell,
	Entity,
	EntityBatch,
	EntityBatchArrayBuffer,
	GridEntity,
	CELL_HEIGHT,
	CELL_WIDTH,
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = {
	GRID: 'GRID',
	DRAWING: 'DRAWING',
	SIM: 'SIMULATION',
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/**
 * Helper function for finding elements on the document.
 * @param {*} id The ID of the element to fetch.
 * Throws an error if the element could not be found.
 */
function getElementById(id) {
	let element = document.getElementById(id);
	if (!element) {
		throw new Error(`No element could be found with the ID of ${id}`);
	}
	return element;
}

/**
 * Helper function for setting an elements value.
 * @param {string} id
 * @param {*} value
 */
function setElementValue(id, value) {
	getElementById(id).value = value;
}

function querySelector(query) {
	return document.querySelector(query);
}

function querySelectorAll(query) {
	return document.querySelectorAll(query);
}

module.exports = {
	getElementById,
	querySelector,
	querySelectorAll,
	setElementValue,
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const { css } = __webpack_require__(0);
const buttons = css`
	button {
		cursor: pointer;
		height: 25px;
		border-radius: 5px;
		border: 1px;
		border-style: solid;
		border-color: rgb(216, 216, 216);
		margin-left: 2px;
		margin-right: 2px;
	}

	button:focus {
		outline: none;
		border: 2px solid #039be5;
	}
`;

const grid = css`
	.container {
		display: flex;
		background-color: #e1e2e1;
	}

	.col {
		flex-direction: column;
	}

	.row {
		flex-direction: row;
		padding-top: 10px;
	}
`;

module.exports = {
	buttons,
	grid
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

const handler = {
	get: function (obj, prop) {
		return prop in obj ? obj[prop] : 'Undefined Command';
	},
};

module.exports = new Proxy(
	{
		LifeCycle: new Proxy(
			{
				START: 'START',
				STOP: 'STOP',
				PAUSE: 'PAUSE',
				PROCESS_CYCLE: 'PROCESS_CYCLE',
			},
			handler
		),
		DrawingSystemCommands: new Proxy(
			{
				SET_CELLS: 'SET_CELLS',
				SET_CELL_SIZE: 'SET_CELL_SIZE',
				SEND_CELLS: 'SEND_CELLS',
				RESET: 'RESET',
				TOGGLE_CELL: 'TOGGLE_CELL',
				DISPLAY_STORAGE: 'DISPLAY_STORAGE',
				DRAW_TEMPLATE: 'DRAW_TEMPLATE',
				DRAW_LINEAR_ELEMENTRY_CA: 'DRAW_LINEAR_ELEMENTRY_CA',
			},
			handler
		),
		LifeSystemCommands: new Proxy(
			{
				DISPLAY_STORAGE: 'DISPLAY_STORAGE',
				RESET: 'RESET',
				SEND_ALIVE_CELLS_COUNT: 'SEND_ALIVE_CELLS_COUNT',
				SEND_CELLS: 'SEND_CELLS',
				SEND_SIMULATION_ITERATIONS_COUNT: 'SEND_SIMULATION_ITERATIONS_COUNT',
				SET_CELL_SIZE: 'SET_CELL_SIZE',
				SET_CONFIG: 'SET_CONFIG',
				SET_SEEDER: 'SET_SEEDER',
			},
			handler
		),
	},
	handler
);


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const { CELL_HEIGHT, CELL_WIDTH } = __webpack_require__(1);
/**
 * Selects a color based on the provided age.
 * @param {number} age
 * @returns {string} color
 */
function fillStyle(age) {
	if (typeof age !== 'number') {
		throw new Error(
			'The trait ageBasedColor requires a property "age" be set to a number.'
		);
	}

	let color = null;
	switch (true) {
		case age <= 1:
			color = '#e3f2fd';
			break;
		case age == 2:
			color = '#bbdefb';
			break;
		case age == 3:
			color = '#90caf9';
			break;
		case age > 3 && age <= 5:
			color = '#64b5f6';
			break;
		case age > 5 && age <= 8:
			color = '#42a5f5';
			break;
		case age > 8 && age <= 13:
			color = '#2196f3';
			break;
		case age > 13 && age <= 21:
			color = '#1e88e5';
			break;
		case age > 21 && age <= 34:
			color = '#1976d2';
			break;
		case age > 34 && age <= 55:
			color = '#1565c0';
			break;
		case age > 55 && age <= 89:
			color = '#0d47a1';
			break;
		case age > 89 && age <= 144:
			color = '#263238'; //Dark Blue Grey
			break;
		case age > 144 && age <= 233:
			color = '#870000'; //Dark Orange
			break;
		case age > 233 && age <= 377:
			color = '#bf360c';
			break;
		case age > 377:
			color = '#ffeb3b'; //Bright Yellow
			break;
		default:
			throw new Error(`Unexpected Age: ${age}`);
	}
	return color;
}

const TWO_PI = Math.PI * 2;
const DEFAULT_CIRCLE_FILL_STYLE = 'rgb(44, 193, 59)';
const DEFAULT_CIRCLE_STROKE_STYLE = 'rgb(0, 0, 0)';

/**
 * Abstract class. Defines a render-able trait that can be processed.
 */
class Trait {
	/**
	 * Creates a new trait.
	 */
	constructor() {}
	/**
	 * Function that controls what the trait does.
	 * @abstract
	 * @param {object} context - The render context.
	 */
	process(context) {
		throw new Error('Traits must implement a process method.');
	}

	/**
	 * Automatically called by JSON.stringify().
	 * Injects the original class name as a property when serialized
	 * which an be used to rebuild a Scene after communicated from a thread.
	 * @returns Trait
	 */
	toJSON() {
		this.className = this.constructor.name;
		return this;
	}
}

/**
 * Sets the fill and stroke style by the entity's age.
 */
class ColorByAgeTrait extends Trait {
	constructor() {
		super();
	}

	process(context) {
		context.fillStyle = fillStyle(context.entity.age);
		context.strokeStyle = 'rgb(0, 0, 0)';
	}
}

/**
 * Creates a new render-able entity in the rendering context.
 */
class GridCellToRenderingEntity extends Trait {
	constructor() {
		super();
	}

	process(context) {
		context.rendering = context.rendering || {};
		context.rendering.entity = {};

		//Define Upper Left Corner (X,Y)
		context.rendering.entity.x = context.entity.row;
		context.rendering.entity.y = context.entity.col;

		//Define width & height
		context.rendering.entity.width = CELL_WIDTH;
		context.rendering.entity.height = CELL_HEIGHT;
	}
}

/**
 * Scales a rendering entity by a constant scaling factor.
 */
class ScaleTransformer extends Trait {
	/**
	 * Create a new scale transformer.
	 * @param {number} scalingFactor
	 */
	constructor(scalingFactor) {
		super();
		this.scalingFactor = scalingFactor;
	}

	process(context) {
		if (
			typeof context.rendering === 'undefined' ||
			typeof context.rendering.entity === 'undefined'
		) {
			throw new Error(
				'ScaleTransformer attempted to process an entity that did not have context.rendering or context.rendering.entity defined.'
			);
		}
		context.rendering.entity.x *= this.scalingFactor;
		context.rendering.entity.y *= this.scalingFactor;
		context.rendering.entity.width *= this.scalingFactor;
		context.rendering.entity.height *= this.scalingFactor;
	}
}

/**
 * Draws a filled in circle with a stroke.
 */
class CircleTrait extends Trait {
	constructor() {
		super();
	}

	process(context) {
		//find center
		//this.x, this.y, this.width, this.height
		let cx = context.rendering.entity.x + context.rendering.entity.width / 2;
		let cy = context.rendering.entity.y + context.rendering.entity.height / 2;
		let radius = context.rendering.entity.width / 2;

		context.rendererContext.fillStyle =
			context.fillStyle || DEFAULT_CIRCLE_FILL_STYLE;
		context.rendererContext.strokeStyle =
			context.strokeStyle || DEFAULT_CIRCLE_STROKE_STYLE;
		context.rendererContext.beginPath();
		context.rendererContext.arc(cx, cy, radius, 0, TWO_PI, true);
		context.rendererContext.fill();
		context.rendererContext.stroke();
	}
}

/**
 * Creates a new render-able entity.
 */
class ProcessBoxAsRect extends Trait {
	constructor() {
		super();
	}

	process(context) {
		context.rendering = context.rendering || {};
		context.rendering.entity = {};
		context.rendering.entity.x = context.entity.x;
		context.rendering.entity.y = context.entity.y;
		context.rendering.entity.width = context.entity.xx - context.entity.x;
		context.rendering.entity.height = context.entity.yy - context.entity.y;
	}
}

/**
 * Defines the stroke style based on if an entity is alive.
 */
class ColorByContents extends Trait {
	constructor() {
		super();
	}

	process(context) {
		context.lineWidth = 2;
		context.strokeStyle = context.entity.alive ? '#c41c00' : '#0d47a1';
	}
}

/**
 * Defines a dark fill and stroke style.
 */
class DarkFillTrait extends Trait {
	constructor() {
		super();
	}

	process(context) {
		context.fillStyle = '#263238';
		context.strokeStyle = '#263238';
	}
}

/**
 * Stroke style pass through.
 */
class StrokeStyle extends Trait {
	constructor(strokeStyle) {
		super();
		this.strokeStyle = strokeStyle;
	}

	process(context) {
		context.strokeStyle = this.strokeStyle;
	}
}

/**
 * Fill Style pass through.
 */
class FillStyle extends Trait {
	constructor(fillStyle) {
		super();
		this.fillStyle = fillStyle;
	}

	process(context) {
		context.fillStyle = this.fillStyle;
	}
}

/** Draws a rectangle. */
class RectOutlineTrait extends Trait {
	constructor() {
		super();
	}

	process(context) {
		context.rendererContext.strokeStyle =
			context.strokeStyle || DEFAULT_CIRCLE_STROKE_STYLE;
		context.rendererContext.strokeRect(
			context.rendering.entity.x,
			context.rendering.entity.y,
			context.rendering.entity.width,
			context.rendering.entity.height
		);
	}
}

/**
 * Fills a rectangle.
 */
class FilledRectTrait extends Trait {
	constructor() {
		super();
	}

	process(context) {
		context.rendererContext.fillStyle =
			context.fillStyle || DEFAULT_CIRCLE_FILL_STYLE;
		context.rendererContext.fillRect(
			context.rendering.entity.x,
			context.rendering.entity.y,
			context.rendering.entity.width,
			context.rendering.entity.height
		);
	}
}

/**
 * Sets the stroke style to a thin, dark line.
 */
class DarkThinLines extends Trait {
	constructor() {
		super();
	}

	process(context) {
		context.rendererContext.strokeStyle = '#757575';
		context.rendererContext.lineWidth = 0.5;
	}
}

/**
 * Draws a grid.
 */
class GridPattern extends Trait {
	constructor() {
		super();
	}

	process(context) {
		//Draw vertical lines
		context.rendererContext.beginPath();
		for (let x = 0; x < context.entity.width; x += context.entity.cell.width) {
			context.rendererContext.moveTo(x, 0);
			context.rendererContext.lineTo(x, context.entity.height);
		}

		//Draw horizontal lines
		for (
			let y = 0;
			y < context.entity.height;
			y += context.entity.cell.height
		) {
			context.rendererContext.moveTo(0, y);
			context.rendererContext.lineTo(context.entity.width, y);
		}

		//Render all lines at once.
		context.rendererContext.stroke();
	}
}

class BatchDrawingCells extends Trait {
	constructor(scalingFactor, strokeThreashold, shape) {
		super();
		this.scalingFactor = scalingFactor;
		this.strokeThreashold = strokeThreashold;
		this.shape = shape;
	}

	process(context) {
		switch (this.shape) {
			case 'circle':
				this.drawCircles(context);
				break;
			case 'square':
				this.drawSquares(context);
				break;
			default:
				throw new Error('Unsupported shape: ' + this.shape);
		}
	}

	drawSquares(context) {
		let cell;
		context.rendererContext.beginPath();
		for (let index = 0; index < context.entity.entities.length; index++) {
			cell = context.entity.entities[index];
			//scale and add a rect to the path.
			if (cell) {
				context.rendererContext.rect(
					cell.row * this.scalingFactor,
					cell.col * this.scalingFactor,
					CELL_WIDTH * this.scalingFactor,
					CELL_HEIGHT * this.scalingFactor
				);
			}
		}
		context.rendererContext.fill();

		//Drawing strokes takes time. Only do it for when we're zoomed out.
		if (this.scalingFactor > this.strokeThreashold) {
			context.rendererContext.stroke();
		}
	}

	//Note: It's more expensive to draw circles than rectangles.
	drawCircles(context) {
		let radius = this.scalingFactor / 2;
		let cell;
		context.rendererContext.beginPath();
		for (let index = 0; index < context.entity.entities.length; index++) {
			cell = context.entity.entities[index];
			if (cell) {
				let cx = cell.row * this.scalingFactor + radius;
				let cy = cell.col * this.scalingFactor + radius;
				context.rendererContext.moveTo(cx + radius, cy);
				context.rendererContext.arc(cx, cy, radius, 0, TWO_PI, true);
			}
		}
		context.rendererContext.fill();
		if (this.scalingFactor > this.strokeThreashold) {
			context.rendererContext.stroke();
		}
	}
}

const missingStateHandler = {
	get: function (obj, prop) {
		return prop in obj ? obj[prop] : '#f52811'; //Redish
	},
};

class MapWithDefault extends Map {
	constructor(defaultValue, entries) {
		super(entries);
		this.defaultValue = defaultValue;
	}

	/**
	 * Overrides get(key) to provide a default value.
	 * @param {*} key
	 * @override
	 */
	get(key) {
		return this.has(key) ? super.get(key) : this.defaultValue;
	}
}

class BatchDrawingCellsFromBuffer extends Trait {
	constructor(scalingFactor, strokeThreashold, shape) {
		super();
		this.scalingFactor = scalingFactor;
		this.strokeThreashold = strokeThreashold;
		this.shape = shape;

		//TODO: Refactor
		//Only changing colors on the fib seq numbers.
		this.colors = new MapWithDefault('#f52811'); //Default Red-ish
		this.colors.set(1, '#263238'); //Active
		this.colors.set(2, '#77a1b5'); //Begin Aging
		this.colors.set(3, '#a8e4ff'); //Fib Change
		this.colors.set(4, '#a8e4ff');
		this.colors.set(5, '#a8fff3'); //Fib Change
		this.colors.set(6, '#a8fff3');
		this.colors.set(7, '#a8fff3');
		this.colors.set(8, '#a8ffaf'); //Fib Change
		this.colors.set(9, '#a8ffaf');
		this.colors.set(10, '#a8ffaf');
		this.colors.set(11, '#a8ffaf');
		this.colors.set(12, '#a8ffaf');
		this.colors.set(13, '#feffa8'); //Fib Change
		this.colors.set(14, '#feffa8');
		this.colors.set(15, '#feffa8');
		this.colors.set(16, '#feffa8');
		this.colors.set(17, '#feffa8');
		this.colors.set(18, '#feffa8');
		this.colors.set(19, '#feffa8');
		this.colors.set(20, '#feffa8');
		this.colors.set(21, '#ffa8a8'); //Fib Change
	}

	process(context) {
		let row, col, state;
		context.rendererContext.beginPath();

		let firstState = context.entity.initialOffset + 2;
		let currentState = context.entity.buffer[firstState];
		context.rendererContext.fillStyle = this.colors.get(currentState);

		for (
			let index = context.entity.initialOffset;
			index < context.entity.bufferEnd;
			index += context.entity.entityFieldsCount
		) {
			row = context.entity.buffer[index];
			col = context.entity.buffer[index + 1];
			state = context.entity.buffer[index + 2];

			if (currentState != state) {
				context.rendererContext.fill(); //Render the existing
				context.rendererContext.beginPath();
				currentState = state;
				context.rendererContext.fillStyle = this.colors.get(currentState);
			}

			//scale and add a rect to the path.
			context.rendererContext.rect(
				row * this.scalingFactor,
				col * this.scalingFactor,
				CELL_WIDTH * this.scalingFactor,
				CELL_HEIGHT * this.scalingFactor
			);
		}
		context.rendererContext.fill();
	}
}

class BatchDrawingBoxesFromBuffer extends Trait {
	constructor(scalingFactor) {
		super();
		this.scalingFactor = scalingFactor;
	}

	process(context) {
		let x, y, xx, yy;
		context.rendererContext.beginPath();
		for (
			let index = context.entity.initialOffset;
			index < context.entity.bufferEnd;
			index += context.entity.entityFieldsCount
		) {
			x = context.entity.buffer[index] * this.scalingFactor;
			y = context.entity.buffer[index + 1] * this.scalingFactor;
			xx = context.entity.buffer[index + 2] * this.scalingFactor;
			yy = context.entity.buffer[index + 3] * this.scalingFactor;
			context.rendererContext.rect(x, y, xx - x, yy - y);
		}
		context.rendererContext.stroke();
	}
}

class BatchDrawingBoxes extends Trait {
	constructor(scalingFactor) {
		super();
		this.scalingFactor = scalingFactor;
	}

	process(context) {
		context.rendererContext.beginPath();
		let box;
		for (let index = 0; index < context.entity.entities.length; index++) {
			box = context.entity.entities[index];
			context.rendererContext.rect(
				box.x * this.scalingFactor,
				box.y * this.scalingFactor,
				(box.xx - box.x) * this.scalingFactor,
				(box.yy - box.y) * this.scalingFactor
			);
		}
		context.rendererContext.stroke();
	}
}

class OutlineStyle extends Trait {
	constructor(lineWidth, strokeStyle) {
		super();
		this.lineWidth = lineWidth;
		this.strokeStyle = strokeStyle;
	}

	process(context) {
		context.rendererContext.lineWidth = this.lineWidth;
		context.rendererContext.strokeStyle = this.strokeStyle;
	}
}

/**
 * Clears an area of a context defined by x,y, width, height.
 */
class ClearArea extends Trait {
	constructor() {
		super();
	}

	process(context) {
		context.rendererContext.clearRect(
			context.rendering.entity.x,
			context.rendering.entity.y,
			context.rendering.entity.width,
			context.rendering.entity.height
		);
	}
}

module.exports = {
	BatchDrawingBoxes,
	BatchDrawingBoxesFromBuffer,
	BatchDrawingCells,
	BatchDrawingCellsFromBuffer,
	CircleTrait,
	ClearArea,
	ColorByAgeTrait,
	ColorByContents,
	DarkFillTrait,
	DarkThinLines,
	FilledRectTrait,
	FillStyle,
	GridCellToRenderingEntity,
	GridPattern,
	OutlineStyle,
	ProcessBoxAsRect,
	RectOutlineTrait,
	ScaleTransformer,
	StrokeStyle,
	Trait,
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const { getElementById } = __webpack_require__(3);

/**
 * Calculate the new height of the canvas elements.
 * @returns {number} The intended canvas height.
 */
function calculateConfiguredCanvasHeight() {
	// Note: This will use the same padding/margins as the HTML Body.
	let blockElement = getElementById('block');
	let headerElement = getElementById('header');
	let controlBarElement = getElementById('control_bar');
	let statusBarElement = getElementById('status_bar');
	let bodyMargin = 8 * 2; //Padding on body element in CSS is 8 top and bottom.

	return (
		window.innerHeight -
		bodyMargin -
		(blockElement.offsetHeight +
			headerElement.offsetHeight +
			controlBarElement.offsetHeight +
			statusBarElement.offsetHeight)
	);
}

function calculateFullScreenHeight() {
	return screen.height;
}

function isFullscreen() {
	return document.fullscreenElement != null;
}

/**
 * Override the current configuration to size the HTML Canvas
 * to fit the document.
 * @param {*} config
 */
function sizeCanvas(game) {
	game.config.canvas.height = isFullscreen()
		? calculateFullScreenHeight()
		: calculateConfiguredCanvasHeight();

	let canvasContainerDiv = getElementById('canvas_container');

	//WARNING: Setting the canvas height changes the body
	//width so always set the height before the width.
	canvasContainerDiv.style.height = `${game.config.canvas.height}px`;
	game.gridCanvas.setAttribute('height', game.config.canvas.height);
	game.simCanvas.setAttribute('height', game.config.canvas.height);
	game.drawCanvas.setAttribute('height', game.config.canvas.height);

	game.config.canvas.width = isFullscreen() ? window.innerWidth : document.body.clientWidth;
	canvasContainerDiv.style.width = `${game.config.canvas.width}px`;
	game.gridCanvas.setAttribute('width', game.config.canvas.width);
	game.simCanvas.setAttribute('width', game.config.canvas.width);
	game.drawCanvas.setAttribute('width', game.config.canvas.width);
	return game;
}

function convertToCell(clickEvent, boundary, scale) {
	let px = clickEvent.clientX - boundary.left;
	let py = clickEvent.clientY - boundary.top;

	//Project to a Cell
	let cellLocation = {};
	cellLocation.x = Math.floor(px / scale);
	cellLocation.y = Math.floor(py / scale);
	return cellLocation;
}

module.exports = { convertToCell, sizeCanvas };


/***/ }),
/* 8 */
/***/ (function(module, exports) {

/**
 * Data structure for storing the entities ready to render.
 */
class SceneManager {
	/**
	 * Create a new SceneManager
	 */
	constructor() {
		this.stack = [];
	}

	/**
	 * Add a a single entity or an array of entities to the scene to be rendered.
	 * @param {Entity | Entity[]} entity
	 * @return {SceneManager} Returns the instance of the SceneManager.
	 */
	push(entity) {
		if (Array.isArray(entity)) {
			this.stack = this.stack.concat(entity);
		} else {
			this.stack.push(entity);
		}
		return this;
	}

	/**
	 * Pop the next entity off the scene's stack.
	 * @returns {Entity} The next entity to render.
	 */
	nextEntity() {
		return this.stack.shift();
	}

	/**
	 * Determine if the stack is empty or not.
	 * @returns {boolean}
	 */
	fullyRendered() {
		return !(this.stack.length > 0);
	}

	/**
	 * Removes all entities from the stack.
	 */
	clear() {
		this.stack = [];
	}

	getStack() {
		return this.stack;
	}

	serializeStack() {
		return JSON.stringify(this.stack);
	}
}

module.exports = SceneManager;


/***/ }),
/* 9 */
/***/ (function(module, exports) {

/**
 * @private
 */
function clearCanvas(ctx) {
	ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
}

/**
 * Responsible rendering a scene.
 */
class HTMLCanvasRenderer {
	/**
	 * Initializes a new HTMLRenderer
	 * @param {HTMLCanvasContext} htmlCanvasContext
	 */
	constructor(htmlCanvasContext) {
		this.htmlCanvasContext = htmlCanvasContext;
	}

	/**
	 * Renders one frame of the scene.
	 * @param {SceneManager} scene - The scene to render.
	 */
	render(scene) {
		this.clear();
		while (!scene.fullyRendered()) {
			let entity = scene.nextEntity();
			entity.render(this.htmlCanvasContext);
		}
	}

	/**
	 * Erases the entire canvas.
	 */
	clear() {
		clearCanvas(this.htmlCanvasContext);
	}

	/**
	 *
	 * @param {Function} draw - A function that works with the HTMLCanvasContext
	 */
	processCanvas(draw) {
		draw(this.this.htmlCanvasContext);
	}
}

module.exports = HTMLCanvasRenderer;


/***/ }),
/* 10 */
/***/ (function(module, exports) {

/**
 * Defines the possible states a Cell can have.
 */
const CellStates = {
	DEAD: 0,
	ACTIVE: 1,
	RETIRED: 2
};

module.exports = CellStates;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const { getElementById } = __webpack_require__(3);

/**
 * Updates the zoom setting all threads should use.
 */
function updateConfiguredZoom(config) {
	config.zoom = getCellSize();
}

/**
 * Updates the landscape dimensions all threads should use.
 */
function updateConfiguredLandscape(config) {
	config.landscape.width = config.canvas.width / config.zoom;
	config.landscape.height = config.canvas.height / config.zoom;
}

/**
 * Helper function for finding the cell size as a number.
 * @returns {number} The cell size.
 */
function getCellSize() {
	return Number.parseInt(getElementById('cell_size').value);
}

module.exports = {
	updateConfiguredZoom,
	updateConfiguredLandscape,
	getCellSize,
};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

/*
Array.includes is slow. 
It would be better to have explicit branching. But can't serialize that.
On strategy would be to define lambda functions here, doen't serialize them,
and look up the function on the worker side.

Steps
1. Make it work with Array.includes.
2. Optimize...

Questions
- Can we transfer a Set rather than arrays?
- Is checking a Set faster than Array.includes for small arrays?
*/
const Games = [
	{
		key: 'conways-game-of-life',
		label: 'Life',
		born: [3],
		survive: [2, 3],
	},
	{
		key: 'high-life',
		label: 'High Life',
		born: [3, 6],
		survive: [2, 3],
	},
	{
		key: 'maze',
		label: 'Maze',
		born: [3],
		survive: [1, 2, 3, 4, 5],
	},
	{
		key: 'mazectric',
		label: 'Mazectric',
		born: [3],
		survive: [1, 2, 3, 4],
	},
	{
		key: 'brians-brain',
		label: 'Brain',
		born: [2],
		survive: [], //Brain spends just once cycle in the Active state.
		maxAge: 2,
	},
	{
		key: 'bloomerang',
		label: 'Bloomerang',
		born: [3, 4, 6, 7, 8],
		survive: [2, 3, 4],
		maxAge: 24,
	},
	{
		key: 'caterpillars',
		label: 'Caterpillars',
		born: [3, 7, 8],
		survive: [1, 2, 4, 5, 6, 7],
		maxAge: 4,
	},
	{
		key: 'fireworks',
		label: 'Fireworks',
		born: [1, 3],
		survive: [2],
		maxAge: 21,
	},
	{
		key: 'worms',
		label: 'Worms',
		born: [2, 5],
		survive: [3, 4, 6, 7],
		maxAge: 6,
	},
	{
		key: 'star-wars',
		label: 'Star Wars',
		born: [2],
		survive: [3, 4, 5, 7],
		maxAge: 4,
	},
	{
		key: 'swirl',
		label: 'Swirl',
		born: [3, 4],
		survive: [2, 3],
		maxAge: 8,
	},
];

module.exports = Games;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(14);
__webpack_require__(15);


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(16);
__webpack_require__(32);
__webpack_require__(33);
__webpack_require__(35);
__webpack_require__(36);
__webpack_require__(37);
__webpack_require__(38);
//require('./NumberDisplay.js');
//require('./ShapePicker.js');
__webpack_require__(39);
__webpack_require__(40);
__webpack_require__(41);


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

const Layers = __webpack_require__(2);
const { LitElement, html, css } = __webpack_require__(0);
const { grid } = __webpack_require__(4);
const { convertToCell } = __webpack_require__(7);
const WorkerCommands = __webpack_require__(5);
const AppBuilder = __webpack_require__(17);

const {
	updateConfiguredLandscape,
} = __webpack_require__(11);

const DISPLAY_TRANSITION_ERR_MSG =
	'There was an error attempting to change display modes.';

/**
 * The top level component for the app.
 */
class AppComponent extends LitElement {
	constructor() {
		super();
		AppBuilder.buildApp(this);
	}

	/**
	 * Life Cycle Method: Invoked when a component is added to the document’s DOM.
	 */
	connectedCallback() {
		super.connectedCallback();
		window.addEventListener('load', this.handlePageLoad.bind(this));
		window.addEventListener('resize', this.handlePageResize.bind(this));
		this.stateManager.startMainLoop(); //TODO: Might need to be in firstUpdated or constructor.
	}

	/**
	 * Life Cycle Method: Invoked when a component is removed from the document’s DOM.
	 */
	disconnectedCallback() {
		window.removeEventListener('load', this.handlePageLoad);
		window.removeEventListener('resize', this.handlePageResize);
		super.disconnectedCallback();
	}

	/**
	 * The CSS styles for the component.
	 * @returns {string}
	 */
	static get styles() {
		return [
			grid,
			css`
				#block {
					height: 24px;
					background-color: #006db3;
				}

				#header {
					background-color: #039be5;
					border-top-width: 1px;
					border-top-color: #3fafe8;
					border-top-style: solid;
				}

				#canvas_container {
					background-color: #ffffff;
					border: 1px solid black;
					z-index: 0;
					position: relative;
				}

				#grid_canvas {
					z-index: 1;
					position: absolute;
				}

				#sim_canvas {
					z-index: 2;
					position: absolute;
				}

				#draw_canvas {
					z-index: 3;
					position: absolute;
				}
			`,
		];
	}

	/**
	 * Life Cycle Method: Draws the component when a property has changed
	 */
	render() {
		return html`
			<div class="container col">
				<div id="block"></div>
				<div id="header">
					<h1>Conway's Game Of Life</h1>
				</div>
				<div id="control_bar">
					<div class="container row">
						<game-selector
							event="game-changed"
							@game-changed=${this.handleGameChanged}
						></game-selector>
						<cell-size-control
							event="cell-size-changed"
							min="5"
							max="100"
							value="20"
							@cell-size-changed=${this.changedCellSize}
						></cell-size-control>
						<start-button
							state="IDLE"
							@sim-event-start-requested=${this.handleStartButtonClicked}
							@sim-event-pause-requested=${this.handlePauseButtonClicked}
							@sim-event-resume-requested=${this.handleResumeButtonClicked}
						></start-button>
						<event-button
							id="reset_button"
							event="sim-reset-requested"
							@sim-reset-requested=${this.resetSimulation}
						>
							Reset
						</event-button>
						<event-button
							id="fullscreen_button"
							event="fullscreen-requested"
							@fullscreen-requested=${this.launchFullScreen}
						>
							Fullscreen
						</event-button>
					</div>
					<div class="container row">
						<event-checkbox
							id="display_grid"
							event="dispay-grid-toggle"
							@dispay-grid-toggle=${this.handleGridBackgroundClicked}
						>
							Display Grid
						</event-checkbox>

						<event-checkbox
							id="display_fullscreen"
							event="enable-fullscreen-toggle"
							@enable-fullscreen-toggle=${this.handleFullScreenClicked}
						>
							Fullscreen
						</event-checkbox>

						<event-checkbox
							id="random_start"
							event="random-start-toggle"
							@random-start-toggle=${this.handleRandomStartClicked}
						>
							Random Start
						</event-checkbox>
					</div>
				</div>
				<div id="canvas_container" @contextmenu="${this.displayContextMenu}">
					<canvas id="grid_canvas"></canvas>
					<canvas id="sim_canvas"></canvas>
					<canvas
						id="draw_canvas"
						@click=${this.handleDrawCanvasClicked}
						@mousemove=${this.handleDrawCanvasMouseMoved}
					></canvas>
					<context-menu
						event="context-menu-command"
						@context-menu-command=${this.handleContextMenuCommand}
					></context-menu>
				</div>
				<div id="status_bar">
					<number-display
						id="alive_cells_count"
						label="Alive Cells"
					></number-display>
					<number-display
						id="sim_generation_count"
						label="Generation"
					></number-display>
				</div>
			</div>
		`;
	}

	/**
	 * Event handler for reacting to when the hosting web page is loaded.
	 * @param {*} event
	 * @private
	 */
	handlePageLoad(event) {
		this.sizeCanvas();
		updateConfiguredLandscape(this.config);
		AppBuilder.setupRenderers(this);
		let now = window.performance.now();
		this.stateManager.start(now);
	}

	sizeCanvas() {
		let fullscreen = this.isFullscreen();
		this.config.canvas.height = fullscreen
			? screen.height
			: this.calculateConfiguredCanvasHeight();

		let canvasContainerDiv = this.shadowRoot.getElementById('canvas_container');

		//WARNING: Setting the canvas height changes the body
		//width so always set the height before the width.
		canvasContainerDiv.style.height = `${this.config.canvas.height}px`;
		let canvases = this.shadowRoot.querySelectorAll('canvas');
		canvases.forEach((c) =>
			c.setAttribute('height', this.config.canvas.height)
		);

		this.config.canvas.width = fullscreen
			? window.innerWidth
			: document.body.clientWidth;

		canvasContainerDiv.style.width = `${this.config.canvas.width}px`;
		canvases.forEach((c) => c.setAttribute('width', this.config.canvas.width));
	}

	isFullscreen() {
		return document.fullscreenElement != null;
	}

	calculateConfiguredCanvasHeight() {
		// Note: This will use the same padding/margins as the HTML Body.
		let blockElement = this.shadowRoot.getElementById('block');
		let headerElement = this.shadowRoot.getElementById('header');
		let controlBarElement = this.shadowRoot.getElementById('control_bar');
		let statusBarElement = this.shadowRoot.getElementById('status_bar');
		let bodyMargin = 8 * 2; //Padding on body element in CSS is 8 top and bottom.

		return (
			window.innerHeight -
			bodyMargin -
			(blockElement.offsetHeight +
				headerElement.offsetHeight +
				controlBarElement.offsetHeight +
				statusBarElement.offsetHeight)
		);
	}

	/**
	 * Event handler for reacting to when the hosting web page is resized.
	 * @param {*} event
	 * @private
	 */
	handlePageResize(event) {
		this.sizeCanvas();
		updateConfiguredLandscape(this.config);
		this.refreshGrid();
		this.setflagAsDirty(Layers.DRAWING);
	}

	refreshGrid() {
		this.stateManager.displayGrid
			? this.requestToDrawGrid()
			: this.stateManager.clearRender(Layers.GRID);
	}

	/**
	 * Requests the grid worker to generate a grid scene.
	 * @private
	 */
	requestToDrawGrid() {
		this.stateManager.sendWorkerMessage(Layers.GRID, {
			command: WorkerCommands.LifeCycle.PROCESS_CYCLE,
			parameters: {
				cellWidth: this.config.zoom,
				cellHeight: this.config.zoom,
				gridWidth: this.config.canvas.width,
				gridHeight: this.config.canvas.height,
			},
		});
	}

	/**
	 * Updates the UI based on a message sent from a web worker.
	 * If the value is present in the message, the corrisponding UI component is updated.
	 * @param {*} message
	 * @returns {App} The instance.
	 */
	updateUI(message) {
		message.aliveCellsCount && this.setAliveCellsCount(message.aliveCellsCount);

		message.numberOfSimulationIterations &&
			this.setSimGenerationCountComponent(message.numberOfSimulationIterations);

		if (message.origin && message.origin == Layers.DRAWING && message.stack) {
			this.manageStartButtonEnablement(
				this.stateManager.getDrawingCellsCount(),
				message.stack.length
			);
			this.stateManager.setDrawingCellsCount(message.stack.length);
		}

		if (message.simulationStopped) {
			document && document.fullscreenElement && document.exitFullscreen();
			this.resetSimulation();
		}
		return this;
	}

	/** 
		Enables or disables the start button based on if the drawing contains
		any cells. 

   	Rules: 
    	- When the drawing cell count drops to zero, disable Start Button.
    	- When the drawing cell count increases past zero enable the start button.
	*/
	manageStartButtonEnablement(currentDrawingCellsCount, nextDrawingCellsCount) {
		if (currentDrawingCellsCount == 0 && nextDrawingCellsCount > 0) {
			this.shadowRoot.querySelector('start-button').enabled = true;
		} else if (currentDrawingCellsCount > 0 && nextDrawingCellsCount == 0) {
			this.shadowRoot.querySelector('start-button').enabled = false;
		}
	}

	/**
	 * Resets all web workers and the UI.
	 */
	resetSimulation() {
		this.stateManager.stopSimulation();
		this.shadowRoot.querySelector(
			'context-menu'
		).updateCommandState = JSON.stringify({
			key: 'runSim',
			activeState: 'start',
		});
		this.transitionToTheStartButton()
			.setAliveCellsCount(0)
			.setSimGenerationCountComponent(0);
		return this.stateManager.allowDrawing().resetSimulation();
	}

	/**
	 * Changes the current state of the simulation button.
	 * @private
	 * @returns {Main} Returns the instance of the main thread being modified.
	 */
	transitionToTheStartButton() {
		this.shadowRoot.querySelector('start-button').state = 'IDLE';
		return this;
	}

	setAliveCellsCount(count) {
		this.shadowRoot
			.getElementById('alive_cells_count')
			.setAttribute('value', count);
		return this;
	}

	setSimGenerationCountComponent(count) {
		this.shadowRoot
			.getElementById('sim_generation_count')
			.setAttribute('value', count);
		return this;
	}

	getCanvasContext(elementId) {
		let canvas = this.shadowRoot.getElementById(elementId);
		if (!canvas) {
			throw new Error(`Could not find a canvas element with ID: ${elementId}`);
		}
		return canvas.getContext('2d');
	}

	/**
	 * Event handler for processing a user click when in drawing mode.
	 * @param {Event} clickEvent Event generated when the draw canvas is clicked.
	 */
	handleDrawCanvasClicked(clickEvent) {
		let menu = this.shadowRoot.querySelector('context-menu');
		if (menu.display) {
			menu.display = false;
			return;
		}

		if (this.stateManager.isDrawingAllowed()) {
			let boundary = this.shadowRoot
				.getElementById('draw_canvas')
				.getBoundingClientRect();
			let cellLocation = convertToCell(clickEvent, boundary, this.config.zoom);
			this.setflagAsDirty(Layers.DRAWING);
			this.stateManager.sendWorkerMessage(Layers.DRAWING, {
				command: WorkerCommands.DrawingSystemCommands.TOGGLE_CELL,
				cx: cellLocation.x,
				cy: cellLocation.y,
			});
		}
	}

	displayContextMenu(clickEvent) {
		clickEvent.preventDefault();
		let boundary = this.shadowRoot
			.getElementById('draw_canvas')
			.getBoundingClientRect();
		let contextMenu = this.shadowRoot.querySelector('context-menu');

		contextMenu.menuPosition = {
			clickEvent: clickEvent,
			boundary: boundary,
			zoom: this.config.zoom,
		};

		contextMenu.display = true;
		return false;
	}

	handleDrawCanvasMouseMoved(event) {
		let boundary = this.shadowRoot
			.getElementById('draw_canvas')
			.getBoundingClientRect();
		let cellLocation = convertToCell(event, boundary, this.config.zoom);
		this.stateManager.setActiveCell(cellLocation);
	}

	handleStartButtonClicked() {
		this.shadowRoot.querySelector(
			'context-menu'
		).updateCommandState = JSON.stringify({
			key: 'runSim',
			activeState: 'pause',
		});
		return new Promise((resolve, reject) => {
			Promise.resolve(
				this.displayManager.setDisplayMode(
					this.stateManager.getDisplayPreference()
				)
			)
				.catch((reason) => {
					console.error(DISPLAY_TRANSITION_ERR_MSG);
					console.error(reason);
				})
				.then(() => {
					document.fullscreenElement && this.handlePageResize();
					this.stateManager.preventDrawing();
					this.stateManager.startSimulation();
				});
		});
	}

	handlePauseButtonClicked() {
		this.stateManager.stopSimulation();
		this.stateManager.pauseSimulationInDrawingMode();
		this.shadowRoot.querySelector(
			'context-menu'
		).updateCommandState = JSON.stringify({
			key: 'runSim',
			activeState: 'resume',
		});
		this.setflagAsDirty(Layers.DRAWING);
	}

	handleResumeButtonClicked() {
		this.shadowRoot.querySelector(
			'context-menu'
		).updateCommandState = JSON.stringify({
			key: 'runSim',
			activeState: 'pause',
		});
		Promise.resolve(
			this.displayManager.setDisplayMode(
				this.stateManager.getDisplayPreference()
			)
		)
			.catch((reason) => {
				console.error(DISPLAY_TRANSITION_ERR_MSG);
				console.error(reason);
			})
			.then(() => {
				document.fullscreenElement && this.handlePageResize();
				this.stateManager.preventDrawing();
				this.stateManager.startSimulation();
			});
	}

	launchFullScreen() {
		return new Promise((resolve, reject) => {
			let container = this.shadowRoot.getElementById('canvas_container');
			Promise.resolve(this.displayManager.setDisplayMode(true, container))
				.catch((reason) => {
					console.error(DISPLAY_TRANSITION_ERR_MSG);
					console.error(reason);
					reject();
				})
				.then(() => {
					document.fullscreenElement && this.handlePageResize();
					resolve();
				});
		});
	}

	setCellShapeOption(event) {
		this.config.cell.shape = event.detail.shape;
	}

	/**
	 * Command all registered workers to set their cell size.
	 */
	changedCellSize(event) {
		this.config.zoom = event.detail.cellSize;
		//Inform the drawing system and Life Simulation of the change.
		this.stateManager.broadcast({
			command: WorkerCommands.LifeSystemCommands.SET_CELL_SIZE,
			cellSize: this.config.zoom,
		});
		this.refreshGrid();
	}

	/**
	 * Event handler for when the grid checkbox is clicked.
	 */
	handleGridBackgroundClicked(event) {
		this.stateManager.displayGrid = event.detail.checked;
		this.refreshGrid();
	}

	handleFullScreenClicked(event) {
		this.stateManager.setDisplayPreference(event.detail.checked);
	}

	handleRandomStartClicked(event) {
		this.stateManager.setRandomStartPreference(event.detail.checked);
	}

	/**
	 * Handles processing the context menu item clicked.
	 * @param {number} row - The horizontal coordinate of the cell clicked.
	 * @param {number} col - The vertical coordinate of the cell clicked.
	 * @param {string} cmdName - The command clicked in the context menu
	 */
	handleContextMenuCommand(event) {
		event.detail.simCommand
			? this.processContextMenuSimCommand(event)
			: this.generateTemplate(event);
	}

	generateTemplate(event) {
		this.config.elementaryCAs.useRandomStart = this.stateManager.getRandomStartPreference();
		this.stateManager.sendWorkerMessage(Layers.DRAWING, {
			command: WorkerCommands.DrawingSystemCommands.DRAW_TEMPLATE,
			templateName: event.detail.command,
			row: event.detail.row,
			col: event.detail.col,
			config: this.config,
		});
		this.setflagAsDirty(Layers.DRAWING);
	}

	setflagAsDirty(workerName) {
		this.stateManager.workerSystem.setWorkerDirtyFlag(workerName, true);
		return this;
	}

	processContextMenuSimCommand(event) {
		let startButton = this.shadowRoot.querySelector('start-button');
		switch (event.detail.command) {
			case 'start-sim':
				startButton.state = 'RUNNING';
				this.handleStartButtonClicked();
				break;
			case 'pause-sim':
				startButton.state = 'PAUSED';
				this.handlePauseButtonClicked();
				break;
			case 'resume-sim':
				startButton.state = 'RUNNING';
				this.handleResumeButtonClicked();
				break;
			case 'reset':
				this.resetSimulation();
				break;
			default:
				throw new Error('Unknown context menu command.');
		}
		return;
	}

	handleGameChanged(event) {
		this.config.game.activeGame = event.detail.game;
		this.stateManager.sendWorkerMessage(Layers.SIM, {
			command: WorkerCommands.LifeSystemCommands.SET_CONFIG,
			config: this.config,
		});
	}
}

customElements.define('conways-game', AppComponent);


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__webpack__worker__0, __webpack__worker__1, __webpack__worker__2) {const {
	AppStateManager,
	AppStateManagerEvents,
} = __webpack_require__(21);
const DefaultConfig = __webpack_require__(26);
const Layers = __webpack_require__(2);

const DrawingSceneBuilder = __webpack_require__(27);
const GridSceneBuilder = __webpack_require__(28);
const LifeSceneBuilder = __webpack_require__(29);
const DisplayManager = __webpack_require__(30);

// const {
// 	GridSystemWorker,
// 	DrawingSystemWorker,
// 	LifeSystemWorker,
// } = require('../workers/WorkersLoader');

const {
	handleMessageFromGridWorker,
	handleMsgFromDrawingWorker,
	handleMessageFromLifeWorker,
	setThreadFlagToClean,
} = __webpack_require__(31);

class AppBuilder {
	static buildApp(app) {
		this.setupProperties(app);
		this.setupScenes(app);
		return this.setupWorkers(app);
	}

	/**
	 * Initialize all properties for the main thread.
	 * @param {App} - The App to configure.
	 * @returns {App} Returns the instance of the main thread being modified.
	 */
	static setupProperties(app) {
		app.config = DefaultConfig;
		app.stateManager = new AppStateManager(app.config);
		app.stateManager.subscribe(
			AppStateManagerEvents.UI_CHANGES,
			app.updateUI.bind(app)
		);

		app.stateManager.subscribe(
			AppStateManagerEvents.UI_CHANGES,
			setThreadFlagToClean.bind(app.stateManager)
		);

		app.displayManager = new DisplayManager();

		return app;
	}

	/**
	 * Establishes the renderers.
	 * @returns {App} Returns the instance of the main thread being modified.
	 */
	static setupRenderers(app) {
		app.stateManager
			.registerRenderer(Layers.GRID, app.getCanvasContext('grid_canvas'))
			.registerRenderer(Layers.DRAWING, app.getCanvasContext('draw_canvas'))
			.registerRenderer(Layers.SIM, app.getCanvasContext('sim_canvas'));
		return app;
	}

	/**
	 * Sets up the scenes.
	 * @returns {App} Returns the instance of the main thread being modified.
	 */
	static setupScenes(app) {
		//Move these to the AppStateManager
		app.stateManager
			.createScene(Layers.GRID, GridSceneBuilder.buildScene)
			.createScene(Layers.DRAWING, DrawingSceneBuilder.buildScene)
			.createScene(Layers.SIM, LifeSceneBuilder.buildScene);
		return app;
	}

	/**
	 * Initializes and configures the web workers.
	 * @returns {App} Returns the instance of the main thread being modified.
	 */
	static setupWorkers(app) {
		app.stateManager
			.createWorker(
				Layers.GRID,
				new Worker(__webpack__worker__0, undefined), //GridSystemWorker,
				handleMessageFromGridWorker.bind(app.stateManager),
				false
			)
			.createWorker(
				Layers.DRAWING,
				new Worker(__webpack__worker__1, undefined), //DrawingSystemWorker,
				handleMsgFromDrawingWorker.bind(app.stateManager)
			)
			.createWorker(
				Layers.SIM,
				new Worker(__webpack__worker__2, undefined), //LifeSystemWorker,
				handleMessageFromLifeWorker.bind(app.stateManager)
			);

		return app;
	}
}

module.exports = AppBuilder;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(18), __webpack_require__(19), __webpack_require__(20)))

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "0.3bc0679dcde76d0af99b.worker.js"

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "1.cf60ffdef3cb1f37e5db.worker.js"

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "2.f7e82d3e535da9f8882a.worker.js"

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

const SceneManager = __webpack_require__(8);
const HTMLCanvasRenderer = __webpack_require__(9);
const WorkerSystem = __webpack_require__(22);
const WorkerCommands = __webpack_require__(5);
const { SeederModels } = __webpack_require__(25);

const Layers = __webpack_require__(2);
const { getElementById } = __webpack_require__(3);

const {
	updateConfiguredZoom,
	updateConfiguredLandscape,
} = __webpack_require__(11);

const SEEDER_CREATION_ERR_MSG = 'There was an error trying to build the seeder';
const PROCESS_CYCLE_MESSAGE_ERR_MSG =
	'AppStateManager.processCycleMessage: Can only process messages that are PROCESS_CYCLE and contain a stack.';
const MISSING_CELLS = 'Cells were not provided.';
const PAUSE_SIM_IN_DRAWING_MODE_ERR =
	'There was an error trying to pause the simulation.';

/**
 * The supported events the state manager notifies on.
 */
const AppStateManagerEvents = {
	UI_CHANGES: 'ticked',
};

/**
 * Manages the application state and orchestrate communication between the App and Workers.
 */
class AppStateManager {
	constructor(config) {
		this.config = config;
		this.config.activeCell = { row: 0, col: 0 };
		this.observers = new Map();
		this.drawingAllowed = true;
		this.drawingCellsCount = 0;
		this.displayGrid = false;
		this.fullScreenDesired = false;
		this.useRandomStart = false;
		this.renderers = new Map();
		this.scenes = new Map();
		this.sceneBuilders = new Map();
		this.workers = new Map();
		this.workerSystem = new WorkerSystem(this.getWindow(), config);
	}

	/**
	 * Manages the change in state based on many drawing cells there are.
	 * When the drawing cell count drops to zero, disable Start Button.
	 * When the drawing cell count increases past zero enable the start button.
	 * @param {number} cellsCount
	 */
	setDrawingCellsCount(cellsCount) {
		this.drawingCellsCount = cellsCount;
	}

	getDrawingCellsCount() {
		return this.drawingCellsCount;
	}

	setActiveCell(cellLocation) {
		this.config.activeCell = cellLocation;
	}

	getWindow() {
		return typeof window === 'undefined' ? this.window : window;
	}

	/**
	 * Signals if drawing mode is enabled.
	 * @returns {boolean} Is drawing allowed.
	 */
	isDrawingAllowed() {
		return this.drawingAllowed;
	}

	/**
	 * Creates an HTMLCanvasRender for a layer.
	 * @param {string} name - The name of the renderer.
	 * @param {CanvasRenderingContext2D} canvasContext - The rendering context.
	 * @returns {AppStateManager} The instance.
	 */
	registerRenderer(name, canvasContext) {
		!this.renderers.has(name) &&
			this.renderers.set(name, new HTMLCanvasRenderer(canvasContext));
		return this;
	}

	/**
	 * Creates a SceneManager for a layer.
	 * @param {*} name - The name of layer.
	 * @param {*} sceneBuilder - The function that builds the scene.
	 * @returns {AppStateManager} The instance.
	 */
	createScene(name, sceneBuilder) {
		if (!this.scenes.has(name)) {
			this.scenes.set(name, new SceneManager());
			this.sceneBuilders.set(name, sceneBuilder);
		}
		return this;
	}

	/**
	 * Creates a web worker for a layer.
	 * @param {string} name - The name of the layer.
	 * @param {Constructor} workerConstructor - The web worker's constructor.
	 * @param {Function} messageHandler - A function handler to be invoked when a message is sent by the worker.
	 * @param {boolean} registerForBroadcastMessages - Should this worker recieve PROCESS_CYCLE broadcasts.
	 * @returns {AppStateManager} The instance.
	 */
	createWorker(
		name,
		worker,
		messageHandler,
		registerForBroadcastMessages = true
	) {
		if (!this.workers.has(name)) {
			// let worker = new workerConstructor();
			worker.onmessage = messageHandler;
			registerForBroadcastMessages
				? this.workerSystem.registerWorker(name, worker)
				: (worker.onerror = this.workerSystem.workerErrorHandler.bind(
						this.workerSystem
				  ));
			this.workers.set(name, worker);
		}
		return this;
	}

	/**
	 * Starts the worker system's process cycle.
	 * @param {DOMHighResTimeStamp} - The current time.
	 * @returns {AppStateManager} The AppStateManager instance being started.
	 */
	start(time) {
		this.workerSystem.main(time);
		return this.allowDrawing();
	}

	/**
	 * Starts the main loop if it's not already running.
	 */
	startMainLoop() {
		this.workerSystem.start();
	}

	/**
	 * Notifies a worker to start.
	 * @param {string} name - The layer name.
	 * @returns {AppStateManager} The instance.
	 */
	startWorker(name) {
		if (this.workers.has(name)) {
			this.workers.get(name).postMessage({
				command: WorkerCommands.LifeCycle.START,
			});
		}
		return this;
	}

	/**
	 * Notifies a worker to stop.
	 * @param {string} name - The layer name.
	 * @returns {AppStateManager} The instance.
	 */
	stopWorker(name) {
		if (this.workers.has(name)) {
			this.workers.get(name).postMessage({
				command: WorkerCommands.LifeCycle.STOP,
			});
		}
		return this;
	}

	/**
	 * Commands a renderer to render.
	 * @param {string} name - The layer name.
	 * @returns {AppStateManager} The instance.
	 */
	render(name) {
		if (this.renderers.has(name) && this.scenes.has(name)) {
			this.renderers.get(name).render(this.getScene(name));
		}
		return this;
	}

	updateUI(message) {
		this.notify(AppStateManagerEvents.UI_CHANGES, message);
	}

	/**
	 * The internal method for notifying all System event subscribers.
	 * @private
	 */
	notify(eventName, message) {
		if (!this.observers.has(eventName)) {
			return;
		}
		this.observers.get(eventName).forEach((observer) => observer(message));
	}

	/**
	 * Implementation of the observer pattern. Provides the ability
	 * to register an event lister.
	 * @param {string} eventName - The event to subscribe to.
	 * @param {function} observer - The function to be invoked when the event occurs.
	 */
	subscribe(eventName, observer) {
		!this.observers.has(eventName) && this.observers.set(eventName, []);
		this.observers.get(eventName).push(observer);
	}

	/**
	 * Commands a render to clear.
	 * @param {string} name - The layer name.
	 * @returns {AppStateManager} The instance.
	 */
	clearRender(name) {
		this.renderers.get(name).clear();
		return this;
	}

	/**
	 * Commands a layer's scene to clear.
	 * @param {string} name - The layer name.
	 * @returns {AppStateManager} The instance.
	 */
	clearScene(name) {
		this.scenes.get(name).clear();
		return this;
	}

	/**
	 * Finds a scene by its layer name.
	 * @param {string} name - The layer name.
	 * @returns {SceneManager} The scene.
	 */
	getScene(name) {
		return this.scenes.get(name);
	}

	/**
	 * Builds a scene for a layer using its registered scene builder.
	 * @param {string} name - The layer name.
	 * @param {Entity[]} stack - An array of entities to render.
	 * @returns {AppStateManager} The instance.
	 */
	buildScene(name, stack, message) {
		if (this.sceneBuilders.has(name) && this.scenes.has(name)) {
			this.sceneBuilders.get(name)(
				this.getScene(name),
				this.config,
				stack,
				message
			);
		}
		return this;
	}

	/**
	 * Sends a message to a layer's web worker.
	 * @param {string} name - The layer name.
	 * @param {*} msg - The message to send.
	 * @returns {AppStateManager} The instance.
	 */
	sendWorkerMessage(name, msg, transferList) {
		if (this.workers.has(name)) {
			this.workers.get(name).postMessage(msg, transferList);
		}
		return this;
	}

	promiseResponse(name, command, params) {
		return this.workerSystem.promiseResponse(name, command, params);
	}

	/**
	 * Sends a message to every registered worker.
	 * @param {*} msg - The message to send.
	 * @returns {AppStateManager} The instance.
	 */
	broadcast(msg) {
		this.workerSystem.broadcast(msg);
		return this;
	}

	/**
	 * Process rendering a frame for a layer. The frame's scene contents are
	 * sent from a web worker.
	 * @param {string} name - The layer name.
	 * @param {*} message - The message to process.
	 */
	processCycleMessage(name, message) {
		if (message && message.command === 'PROCESS_CYCLE' && message.stack) {
			this.clearScene(name)
				.buildScene(name, message.stack, message)
				.render(name)
				.updateUI(message);
		} else {
			throw new Error(PROCESS_CYCLE_MESSAGE_ERR_MSG);
		}
	}

	// processOptimizedMessage

	/**
	 * Enables the drawing mode.
	 * @returns {AppStateManager} Returns the instance of the main thread being modified.
	 */
	allowDrawing() {
		this.drawingAllowed = true;
		return this.startWorker(Layers.DRAWING);
	}

	/**
	 * Disables drawing mode.
	 * @returns {AppStateManager} Returns the instance of the main thread being modified.
	 */
	preventDrawing() {
		this.drawingAllowed = false;
		return this.stopWorker(Layers.DRAWING);
	}

	/**
	 * Starts the simulation.
	 * @returns {Promise}
	 */
	startSimulation() {
		return this.workerSystem
			.promiseResponse(
				//First get the Cells from the Drawing Worker
				Layers.DRAWING,
				WorkerCommands.DrawingSystemCommands.SEND_CELLS
			)
			.then((response) => {
				this.processCycleMessage(Layers.SIM, {
					//2nd, render the drawing cells the Sim so there is no flicker.
					command: 'PROCESS_CYCLE',
					stack: response.stack,
					numberOfCells: response.numberOfCells,
					cellFieldsCount: response.cellFieldsCount,
					numberOfStorageBoxes: response.numberOfStorageBoxes,
					boxFieldCount: response.boxFieldCount,
				});
				//3rd Configure the Life Sim.
				updateConfiguredLandscape(this.config);
				return this.setSeederOnLifeSystem(
					response.stack,
					response.numberOfCells
				);
			})
			.then(() => {
				//4th Start the Life Sim
				this.startWorker(Layers.SIM);
				this.clearRender(Layers.DRAWING);
			})
			.catch((reason) => {
				console.error('AppStateManager.startSimulation(): There was an error.');
				console.error(reason);
				throw new Error(`${SEEDER_CREATION_ERR_MSG}.\n${reason}`);
			});
	}

	/**
	 * Orchestrates the drawing and life web workers to pause both systems.
	 * @returns {Promise}
	 */
	pauseSimulationInDrawingMode() {
		return this.workerSystem
			.promiseResponse(Layers.SIM, WorkerCommands.LifeSystemCommands.SEND_CELLS)
			.then((response) => {
				let drawCellsMessage = {
					command: WorkerCommands.DrawingSystemCommands.SET_CELLS,
					numberOfCells: response.numberOfCells,
					cells: response.cells,
				};
				this.sendWorkerMessage(Layers.DRAWING, drawCellsMessage, [
					drawCellsMessage.cells.buffer,
				]).sendWorkerMessage(Layers.SIM, {
					command: WorkerCommands.LifeSystemCommands.RESET,
					config: this.config,
				});
			})
			.catch((reason) => {
				throw new Error(`${PAUSE_SIM_IN_DRAWING_MODE_ERR}\n${reason}`);
			})
			.finally(() => {
				this.clearRender(Layers.SIM).allowDrawing();
			});
	}

	/**
	 * Command the drawing system to reset with the provided configuration.
	 * @private
	 * @param {*} msg - An object that should contain an array of cells.
	 * @returns {Promise} Promise to invoke the drawing system worker.
	 */
	resetDrawingSystem(msg) {
		return new Promise((resolve) => {
			this.sendWorkerMessage(Layers.DRAWING).clearRender(Layers.DRAWING);
			resolve();
		});
	}

	/**
	 * Send configuration and cells to the life system worker to initialize the seeder with.
	 * @private
	 * @param {Uint16Array} drawingCells The cells to populate the seeder with.
	 * @returns {Promise} Promise to invoke the life system worker.
	 */
	setSeederOnLifeSystem(drawingCells, numberOfCells) {
		return this.workerSystem.promiseResponse(
			Layers.SIM,
			WorkerCommands.LifeSystemCommands.SET_SEEDER,
			{
				seedSetting: SeederModels.DRAWING,
				config: this.config,
				numberOfCells: numberOfCells,
				cellsBuffer: drawingCells,
			},
			[drawingCells.buffer]
		);
	}

	/**
	 * Command the life worker to stop the simulation.
	 * @returns {AppStateManager} The instance.
	 */
	stopSimulation() {
		return this.stopWorker(Layers.SIM);
	}

	/**
	 * Command the life worker to start the simulation.
	 * @returns {AppStateManager} The instance.
	 */
	resumeSimulation() {
		return this.startWorker(Layers.SIM);
	}

	/**
	 * Commands the simulation layer to reset and clears the simulation and drawing layer.
	 */
	resetSimulation() {
		let promisedResponses = this.workerSystem.promiseResponses(
			WorkerCommands.LifeSystemCommands.RESET,
			{ config: this.config }
		);

		return Promise.all(promisedResponses).then(() => {
			this.clearScene(Layers.SIM)
				.clearRender(Layers.SIM)
				.clearRender(Layers.DRAWING);
		});
	}

	setDisplayPreference(pref) {
		this.fullScreenDesired = pref;
	}

	setRandomStartPreference(pref) {
		this.useRandomStart = pref;
	}

	getRandomStartPreference() {
		return this.useRandomStart;
	}

	getDisplayPreference() {
		return this.fullScreenDesired;
	}
}

module.exports = { AppStateManager, AppStateManagerEvents };


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * An animation system for orchestrating multiple web workers.
 * Requests the updated scene from all registered workers on a timer.
 *
 * @module system/worker
 */

const { BrowserSystem } = __webpack_require__(23);

const WorkerCommands = __webpack_require__(5).LifeCycle;

const { nanoid } = __webpack_require__(24);

const PROCESS_CYCLE_MSG = {
	command: WorkerCommands.PROCESS_CYCLE,
};

/**
 * Challenges
 * Need to associate multiple web workers that have already been intialized.
 * Each worker should be pinged during the update cycle.
 * Need to notify each renderer that the relevant threads have new stuff to render.
 *   This isn't a given though.
 *
 * register worker
 * register renderer function? On receiving a message from a worker, this could execute the correct renderer.
 *
 * Worker System -> Workers: SEND_SCENE
 */
class WorkerSystem extends BrowserSystem {
	constructor(window, config) {
		super(window, config);
		this.workers = new Map(); //Pattern: name|{thread: worker instance, dirty: Boolean}
		this.promisedMessages = new Map();
	}

	/**
	 * Register a worker. All registered workers will be sent a SEND_SCENE message per tick.
	 * @param {string} name - The worker name.
	 * @param {WebWorker} worker - the worker to ping for update.
	 */
	registerWorker(name, worker) {
		this.workers.set(name, { thread: worker, dirty: true });
		worker.onerror = this.workerErrorHandler.bind(this);
		return this;
	}

	setWorkerDirtyFlag(workerName, flag) {
		if (!this.workers.has(workerName)) {
			throw new Error(
				`Attempted to set the dirty flag on an unregisterd web worker. ${workerName}`
			);
		}
		this.workers.get(workerName).dirty = flag;
	}

	workerErrorHandler(error) {
		this.stop(); //Stop the simulation.
		console.error('The simulation has been stopped.');
		console.group('A web worker had an issue.');
		console.error(`Worker: ${error.filename} Line: ${error.lineno}`);
		console.error(error.message);
		console.groupEnd();
	}

	/**
	 * Override parent
	 * Sends an update notifican to each registered web worker.
	 * @private
	 */
	update(frame) {
		this.workers.forEach((worker, name) => {
			worker.dirty && worker.thread.postMessage(PROCESS_CYCLE_MSG);
		});
	}

	broadcast(msg) {
		this.workers.forEach((worker, name) => {
			worker.thread.postMessage(msg);
		});
	}

	promiseResponse(workerName, command, params, transferList) {
		if (!this.workers.has(workerName)) {
			throw new Error(
				`Attempted to send a message to an unregisterd web worker. ${workerName}`
			);
		}
		let message = {
			id: nanoid(),
			promisedResponse: true,
			command: command,
			params: params,
		};
		return new Promise((resolve, reject) => {
			this.promisedMessages.set(message.id, {
				resolve: resolve,
				reject: reject,
			});
			this.workers.get(workerName).thread.postMessage(message, transferList);
		});
	}

	promiseResponses(command, params) {
		let promises = [];
		this.workers.forEach((worker, name) => {
			promises.push(this.promiseResponse(name, command, params));
		});
		return promises;
	}

	attemptToProcessPendingWork(message) {
		if (this.promisedMessages.has(message.id)) {
			let work = this.promisedMessages.get(message.id);
			if (work.error) {
				work.reject(work.error);
			} else {
				work.resolve(message);
			}
			this.promisedMessages.delete(message.id);
		} else {
			throw new Error(`Could not find the promised message ${message}`);
		}
	}

	/**
	 * Perform post system update logic (e.g. rendering changes).
	 */
	afterUpdates() {
		//TBD: Not sure yet if this makes sense in the worker world.
	}
}

module.exports = WorkerSystem;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * An animation system for drawing to an HTML Canvas.
 * @module system/canvas
 */

const HTMLCanvasRenderer = __webpack_require__(9);
const SceneManager = __webpack_require__(8);

/**
 * The possible states the drawing system can be in.
 * @private
 */
const SystemState = {
	STOPPED: 1,
	PAUSED: 2,
	RUNNING: 3,
};

/**
 * The supported events the system notifies on.
 */
const SystemEvents = {
	TICKED: 'ticked',
};

/**
 * Runs the simulation for the required number of ticks.
 * @private
 * @param {number} numTicks - The number of times to update the simulation.
 */
function queueUpdates(numTicks) {
	for (var i = 0; i < numTicks; i++) {
		this.lastTick = this.lastTick + this.config.game.tickLength;
		this.simIterationCounter++;
		this.update(this.lastTick);
		notify.bind(this)(SystemEvents.TICKED);
	}
}

/**
 * The internal method for notifying all System event subscribers.
 * @private
 */
function notify(eventName) {
	if (!this.observers.has(eventName)) {
		return;
	}
	this.observers.get(eventName).forEach((observer) => observer(this));
}

/**
 * Abstract class.
 */
class BrowserSystem {
	/**
	 * Creates a playable system in the context of a browser.
	 * @param {Window} window - The DOM's window object.
	 */
	constructor(window, config) {
		this.window = window;
		this.state = SystemState.STOPPED;
		this.simIterationCounter = 0;
		this.requiredTicks = 0;
		this.observers = new Map();
		this.config = config;
	}

	/**
	 * Provides the current simulation tick.
	 * @returns {number}
	 */
	numberOfSimulationIterations() {
		return this.simIterationCounter;
	}

	/**
	 * An optional initialization method that is invoked when start() is called.
	 * @abstract
	 */
	initializeSimulation() {
		//optional. Override if desired.
	}

	/**
	 * Begins the simulation
	 */
	start() {
		if (this.state == SystemState.STOPPED) {
			this.initializeSimulation();
			this.lastTick = this.window.performance.now();
			// Pretend the first draw was on first update.
			this.lastRender = this.lastTick;
			this.state = SystemState.RUNNING;
			this.simIterationCounter = 0;
		}
	}

	/**
	 * Stops the system. Not intended to be restarted.
	 */
	stop() {
		if (this.state == SystemState.RUNNING) {
			this.state = SystemState.STOPPED;
		}
	}

	/**
	 * Pauses the system. Can be restarted.
	 */
	pause() {
		if (this.state == SystemState.RUNNING) {
			this.lastTick = this.window.performance.now();
			this.state = SystemState.PAUSED;
		}
	}

	/**
	 * Continue the system.
	 */
	resume() {
		if (this.state == SystemState.STOPPED || this.state == SystemState.PAUSED) {
			this.state = SystemState.RUNNING;
			this.lastTick = this.window.performance.now();
		}
	}

	/**
	 * The main loop of the simulation.
	 * @param {number} tFrame - The current frame.
	 */
	main(tFrame) {
		// Looping via callback. Will pass the current time.
		// Can use window.cancelAnimationFrame() to stop if needed.
		this.stopMain = this.window.requestAnimationFrame(this.main.bind(this));
		if (this.state == SystemState.RUNNING) {
			var nextTick = this.lastTick + this.config.game.tickLength;
			this.requiredTicks = 0;

			// If tFrame < nextTick then 0 ticks need to be updated (0 is default for numTicks).
			// If tFrame = nextTick then 1 tick needs to be updated (and so forth).
			// If requiredTicks is large, then either the game was asleep, or the machine cannot keep up.
			if (tFrame > nextTick) {
				var timeSinceTick = tFrame - this.lastTick;
				this.requiredTicks = Math.floor(
					timeSinceTick / this.config.game.tickLength
				);
			}

			queueUpdates.bind(this)(this.requiredTicks);
			this.afterUpdates();
			this.lastRender = tFrame;
		}
	}

	/**
	 * Progresses the simulation forward by one tick.
	 * @abstract
	 * @param {number} frame - Reserved. Not currently used.
	 */
	update(frame) {
		throw new Error(
			'Children of BrowserSystem must implement an update() method'
		);
	}

	/**
	 * Perform post system update logic (e.g. rendering changes).
	 * @abstract
	 */
	afterUpdates() {
		throw new Error('Children of BrowserSystem must implement afterUpdates().');
	}

	/**
	 * Implementation of the observer pattern. Provides the ability
	 * to register an event lister.
	 * @param {string} eventName - The event to subscribe to.
	 * @param {function} observer - The function to be invoked when the event occurs.
	 */
	subscribe(eventName, observer) {
		if (!this.observers.has(eventName)) {
			this.observers.set(eventName, []);
		}
		this.observers.get(eventName).push(observer);
	}
}

/**
 * Abstract class. Runs an animation on an HTML Canvas.
 * @extends BrowserSystem
 */
class CanvasBasedSystem extends BrowserSystem {
	/**
	 *
	 * @param {Window} window - The DOM's window object.
	 * @param {HTMLCanvasContext} htmlCanvasContext - An HTML5 Canvas 2D context.
	 * @param {object} config - A configuration object.
	 */
	constructor(window, htmlCanvasContext, config) {
		super(window, config);
		this.htmlCanvasContext = htmlCanvasContext;
		this.scene = new SceneManager();
		this.renderer = new HTMLCanvasRenderer(this.htmlCanvasContext, this.config);
		this.displayStorageStructure = false;
	}

	/**
	 * Returns the state manager.
	 * @abstract
	 */
	getStateManager() {
		throw new Error(
			'Children of CanvasBasedSystem must implement getStateManager()'
		);
	}

	afterUpdates() {
		if (!this.scene.fullyRendered()) {
			this.renderer.render(this.scene);
		}
	}

	/**
	 * Provides a deep copy of the currently alive cells.
	 * @returns {Cell[]}
	 */
	getCells() {
		return this.getStateManager().getCells();
	}

	/**
	 * Sets the cell size to use.
	 * @param {number} size
	 */
	setCellSize(size) {
		this.config.zoom = size;
	}

	/**
	 * Sets whether to draw the quad tree.
	 * @param {boolean} display
	 */
	displayStorage(display) {
		this.displayStorageStructure = display;
	}

	/**
	 * Clears the simulation.
	 */
	reset() {
		this.scene.clear();
		this.getStateManager().clear();
		this.renderer.clear();
	}
}

module.exports = {
	BrowserSystem,
	CanvasBasedSystem,
	SystemEvents,
	SystemState,
};


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "nanoid", function() { return nanoid; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "customAlphabet", function() { return customAlphabet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "customRandom", function() { return customRandom; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "urlAlphabet", function() { return urlAlphabet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "random", function() { return random; });
// This file replaces `index.js` in bundlers like webpack or Rollup,
// according to `browser` config in `package.json`.

if (false) {}

// This alphabet uses `A-Za-z0-9_-` symbols. The genetic algorithm helped
// optimize the gzip compression for this alphabet.
let urlAlphabet =
  'ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW'

let random = bytes => crypto.getRandomValues(new Uint8Array(bytes))

let customRandom = (alphabet, size, getRandom) => {
  // First, a bitmask is necessary to generate the ID. The bitmask makes bytes
  // values closer to the alphabet size. The bitmask calculates the closest
  // `2^31 - 1` number, which exceeds the alphabet size.
  // For example, the bitmask for the alphabet size 30 is 31 (00011111).
  // `Math.clz32` is not used, because it is not available in browsers.
  let mask = (2 << Math.log(alphabet.length - 1) / Math.LN2) - 1
  // Though, the bitmask solution is not perfect since the bytes exceeding
  // the alphabet size are refused. Therefore, to reliably generate the ID,
  // the random bytes redundancy has to be satisfied.

  // Note: every hardware random generator call is performance expensive,
  // because the system call for entropy collection takes a lot of time.
  // So, to avoid additional system calls, extra bytes are requested in advance.

  // Next, a step determines how many random bytes to generate.
  // The number of random bytes gets decided upon the ID size, mask,
  // alphabet size, and magic number 1.6 (using 1.6 peaks at performance
  // according to benchmarks).

  // `-~f => Math.ceil(f)` if f is a float
  // `-~i => i + 1` if i is an integer
  let step = -~(1.6 * mask * size / alphabet.length)

  return () => {
    let id = ''
    while (true) {
      let bytes = getRandom(step)
      // A compact alternative for `for (var i = 0; i < step; i++)`.
      let j = step
      while (j--) {
        // Adding `|| ''` refuses a random byte that exceeds the alphabet size.
        id += alphabet[bytes[j] & mask] || ''
        // `id.length + 1 === size` is a more compact option.
        if (id.length === +size) return id
      }
    }
  }
}

let customAlphabet = (alphabet, size) => customRandom(alphabet, size, random)

let nanoid = (size = 21) => {
  let id = ''
  let bytes = crypto.getRandomValues(new Uint8Array(size))

  // A compact alternative for `for (var i = 0; i < step; i++)`.
  while (size--) {
    // It is incorrect to use bytes exceeding the alphabet size.
    // The following mask reduces the random byte in the 0-255 value
    // range to the 0-63 value range. Therefore, adding hacks, such
    // as empty string fallback or magic numbers, is unneccessary because
    // the bitmask trims bytes down to the alphabet size.
    let byte = bytes[size] & 63
    if (byte < 36) {
      // `0-9a-z`
      id += byte.toString(36)
    } else if (byte < 62) {
      // `A-Z`
      id += (byte - 26).toString(36).toUpperCase()
    } else if (byte < 63) {
      id += '_'
    } else {
      id += '-'
    }
  }
  return id
}




/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Conway's Game Initial State Seeder Module
 * @module seeders
 */
const CellStates = __webpack_require__(10);
const { Cell } = __webpack_require__(1);

/**
 * Randomly selects 0 or 1.
 * @private
 * @returns {number}
 */
function randomAliveOrDead() {
	return getRandomIntInclusive(CellStates.DEAD, CellStates.ACTIVE);
}

/**
 * Finds a random integer in the set defined by two bounds.
 * @private
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

/**
 * Abstract class. Defines a seeder.
 */
class Seeder {
	/**
	 * Initialize a new seeder.
	 */
	constructor() {
		this.cells = [];
	}

	/**
	 * The algorithm to seed the simulation with.
	 * @abstract
	 * @param {number} width
	 * @param {number} height
	 */
	seed(width, height) {
		throw new Error(
			'Seeder implementations must implement the seed(width, height) method.'
		);
	}

	/**
	 * Initial cells to use by the seeder.
	 * @param {Cell[]} cells
	 */
	setCells(cells) {
		this.cells = cells;
		return this;
	}
}

/**
 * Seeds a simulation with randomly selecting alive or dead for each cell.
 * @extends Seeder
 */
class RandomSeeder extends Seeder {
	constructor() {
		super();
	}

	seed(width, height) {
		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {
				let birthChance = randomAliveOrDead();
				if (birthChance == 1) {
					this.cells.push(new Cell(x, y, 1));
				}
			}
		}
		return this.cells;
	}
}

/**
 * Seeds a simulation with a provided set of alive cells.
 * @extends Seeder
 */
class StaticCellsSeeder extends Seeder {
	constructor() {
		super();
	}

	seed(width, height) {
		return this.cells;
	}
}

/**
 * The set of supported seeder models.
 */
SeederModels = {
	DRAWING: 'draw',
	RANDOM: 'random',
};

/**
 * Creates a new seeder based on a specified seeder model name.
 */
class SeederFactory {
	/**
	 * Initializes a new seeder.
	 * @param {string} modelName
	 * @returns {Seeder}
	 */
	static build(modelName) {
		let seeder = null;
		switch (modelName) {
			case SeederModels.RANDOM:
				seeder = new RandomSeeder();
				break;
			case SeederModels.DRAWING:
				seeder = new StaticCellsSeeder();
				break;
			default:
				throw new Error(`Unknown seeder model name: ${modelName}`);
		}
		return seeder;
	}
}

module.exports = { Seeder, SeederFactory, SeederModels };


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

const Games = __webpack_require__(12);
let DefaultConfig = {
	canvas: {
		width: 600,
		height: 400,
	},
	cell: {
		shape: 'square',
	},
	game: {
		/*
		tickLength controls the target frames per second.
		1 second = 1000 ms
		A tickLength of 125 is 1000/125 = 8 FPS
		A tickLength of 125 is 1000/62 = 16 FPS
		A tickLength of 125 is 1000/41 = 24 FPS
		*/
		tickLength: 41, // Sets the simulation to run at 20Hz (Every 50ms)
		rules: {
			birth: [3],
			survive: [2, 3],
		},
		activeGame: Games[0], //The CA the user picked to run. The default is the first one.
	},
	landscape: {
		//used by quad tree implementation.
		width: 30,
		height: 20,
		topology: 'finite-plane',
	},
	zoom: 20, //The projection amount to convert a 1x1 grid cell to something that is viewable on the HTML Canvas.
	elementaryCAs: {
		useRandomStart: false,
	},
};

module.exports = DefaultConfig;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

const {
	Cell,
	EntityBatch,
	EntityBatchArrayBuffer,
} = __webpack_require__(1);

const {
	BatchDrawingBoxes,
	BatchDrawingCells,
	BatchDrawingCellsFromBuffer,
	FillStyle,
	GridCellToRenderingEntity,
	OutlineStyle,
	RectOutlineTrait,
	ScaleTransformer,
	StrokeStyle,
} = __webpack_require__(6);

class DrawingSceneBuilder {
	//TODO: Remove stack as a parameter. It is redundant
	static buildScene(scene, config, stack, message) {
		if (stack && ArrayBuffer.isView(stack)) {
			let cellBatch = new EntityBatchArrayBuffer(
				stack,
				0,
				message.numberOfCells,
				message.cellFieldsCount
			);
			cellBatch
				.register(new OutlineStyle(2, '#0d47a1'))
				.register(new FillStyle('#263238'))
				.register(
					new BatchDrawingCellsFromBuffer(config.zoom, 10, config.cell.shape)
				);
			scene.push(cellBatch);
		}

		//Highlight which cell the mouse is over, if any.
		if (config.activeCell) {
			let activeCell = new Cell(config.activeCell.x, config.activeCell.y);
			activeCell
				.register(new GridCellToRenderingEntity())
				.register(new ScaleTransformer(config.zoom))
				.register(new StrokeStyle('#f3fc53')) //yellow
				.register(new RectOutlineTrait());
			scene.push(activeCell);
		}
	}
}
module.exports = DrawingSceneBuilder;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

const { Entity, GridEntity } = __webpack_require__(1);
const { GridPattern, DarkThinLines } = __webpack_require__(6);

class GridSceneBuilder {
	static buildScene(scene, config, objs) {
		let entities = objs.map((obj) => {
			let entity;
			if (obj.className === 'GridEntity') {
				entity = GridEntity.buildInstance(obj);
				entity.register(new DarkThinLines()).register(new GridPattern());
			} else {
				entity = new Entity();
			}
			return entity;
		});
		scene.push(entities);
	}
}

module.exports = GridSceneBuilder;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

const { EntityBatchArrayBuffer } = __webpack_require__(1);
const {
	BatchDrawingCellsFromBuffer,
	FillStyle,
	OutlineStyle,
} = __webpack_require__(6);

class LifeSceneBuilder {
	//TODO: Remove stack as a parameter. It is redundant
	static buildScene(scene, config, stack, message) {
		if (stack && ArrayBuffer.isView(stack)) {
			let cellBatch = new EntityBatchArrayBuffer(
				stack,
				0,
				message.numberOfCells,
				message.cellFieldsCount
			);
			cellBatch
				.register(new OutlineStyle(2, '#0d47a1'))
				.register(new FillStyle('#263238'))
				.register(
					new BatchDrawingCellsFromBuffer(config.zoom, 10, config.cell.shape)
				);
			scene.push(cellBatch);
		}
	}
}

module.exports = LifeSceneBuilder;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

const { getElementById } = __webpack_require__(3);

class DisplayManager {
	setDisplayMode(perf, element) {
		if (perf) {
			let requestFullscreen =
				element.requestFullscreen || // Fullscreen API
				element.mozRequestFullScreen || // Old Firefox
				element.webkitRequestFullscreen || // Old Chrome, Safari and Opera
				element.msRequestFullscreen || // Old IE/Edge
				(() => Promise.reject('Could not find a fullscreen method.')); //Otherwise create a function that will resolve a rejected promise.

			return requestFullscreen.call(element);
			//TODO: Need to unit test the above failure scenario. Might need to use the below code instead.
			// return requestFullscreen
			// 	? requestFullscreen.call(container)
			// 	: Promise.reject('Could not find a fullscreen method.');
		} else {
			return Promise.resolve();
		}
	}
}

module.exports = DisplayManager;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

const Layers = __webpack_require__(2);

/**
 * Processes a message received from the grid web worker.
 * This is ran in the context of the AppStateManager.
 * @param {*} envelope - The message to be processed.
 */
function handleMessageFromGridWorker(envelope) {
	if (envelope && envelope.data) {
		envelope.data.promisedResponse
			? this.workerSystem.attemptToProcessPendingWork(envelope.data)
			: this.processCycleMessage(Layers.GRID, envelope.data);
	}
}

/**
 * Process a message received from the drawing system web worker.
 * This is ran in the context of the AppStateManager.
 * @param {*} envelope - The message sent.
 */
function handleMsgFromDrawingWorker(envelope) {
	if (envelope && envelope.data) {
		envelope.data.promisedResponse
			? this.workerSystem.attemptToProcessPendingWork(envelope.data)
			: this.processCycleMessage(Layers.DRAWING, envelope.data);
	}
}

/**
 * Process a message received from the life system web worker.
 * This is ran in the context of the AppStateManager.
 * @param {*} envelope - The message sent.
 */
function handleMessageFromLifeWorker(envelope) {
	if (envelope && envelope.data) {
		envelope.data.promisedResponse
			? this.workerSystem.attemptToProcessPendingWork(envelope.data)
			: this.processCycleMessage(Layers.SIM, envelope.data);
	}
}

function setThreadFlagToClean(message) {
	if (message.origin && message.origin == Layers.DRAWING) {
		this.workerSystem.setWorkerDirtyFlag(message.origin, false);
	}
}

module.exports = {
	handleMessageFromGridWorker,
	handleMsgFromDrawingWorker,
	handleMessageFromLifeWorker,
	setThreadFlagToClean,
};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

const { LitElement, html, css } = __webpack_require__(0);

class CellSizeControl extends LitElement {
	constructor() {
		super();
		this.eventBubbles = true;
		this.currentCellSize = this.value;
	}

	/**
	 * The properties of the component.
	 * @returns {object}
	 */
	static get properties() {
		return {
			event: { type: String },
			min: { type: Number },
			max: { type: Number },
			value: { type: Number },
		};
	}

	/**
	 * The CSS styles for the component.
	 * @returns {string}
	 */
	static get styles() {
		return css`
			:host {
				margin-left: 2px;
				margin-right: 2px;
			}
		`;
	}

	render() {
		return html`
			<label>
				Cell Size
				<input
					type="range"
					min=${this.min}
					max=${this.max}
					value=${this.value}
					step="1"
					@change="${this.handleChange}"
				/>
			</label>
		`;
	}

	handleChange(event) {
		let inputElement = this.shadowRoot.querySelector('input');
		let newValue = inputElement.valueAsNumber;

		//Don't allow transmitting a non-number
		if (Number.isNaN(newValue)) {
			inputElement.value = this.currentCellSize; //use the pervious value.
		} else {
			this.currentCellSize = newValue;
			this.dispatchEvent(
				new CustomEvent(this.event, {
					bubbles: this.eventBubbles,
					composed: this.eventBubbles,
					detail: {
						cellSize: newValue,
					},
				})
			);
		}
	}
}

customElements.define('cell-size-control', CellSizeControl);


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

const { LitElement, html, css, nothing } = __webpack_require__(0);

const { convertToCell } = __webpack_require__(7);
const {Commands, Submenus} = __webpack_require__(34);

const MenuStates = {
	SHOW: 'SHOW',
	HIDE: 'HIDE',
};

class ContextMenu extends LitElement {
	constructor() {
		super();
		this.eventBubbles = true;
		this.display = false;
		this.state = MenuStates.HIDE;

		this.menuHeight = 407;
		this.menuWidth = 160;
		this.activeCell = null;
		this._menuPosition = { x: 0, y: 0 };

		this.commands = new Map();
		this.commands.set('runSim', Commands.runSimulation);
		this.commands.set('reset', Commands.reset);
		this.primatives = Submenus.primatives
		this.elementaryCAs = Submenus.elementaryCAs
	}

	/**
	 * The properties of the component.
	 * @returns {object}
	 */
	static get properties() {
		return {
			event: { type: String },
			eventBubbles: { type: Boolean },
			display: { type: Boolean },
			state: { type: String },
			menuPosition: { type: Object },
			updateCommandState: { type: Object },
		};
	}

	set updateCommandState(cmdToChangeStr) {
		let cmdToChange = JSON.parse(cmdToChangeStr);
		this.commands.get(cmdToChange.key).activeState = cmdToChange.activeState;
	}

	get menuPosition() {
		return this._menuPosition;
	}

	set menuPosition(input) {
		const oldValue = this._menuPosition;

		this.activeCell = convertToCell(
			input.clickEvent,
			input.boundary,
			input.zoom
		);

		let situation = this.findMenuScenario(input.clickEvent, input.boundary);
		this._menuPosition = this.findMenuLocation(
			input.clickEvent,
			input.boundary,
			situation
		);

		this.positionSubMenus(situation);

		this.requestUpdate('menuPostion', oldValue);
	}

	findMenuScenario(clickEvent, boundary) {
		let distFromBottom = boundary.bottom - clickEvent.clientY;
		let distFromRight = boundary.right - clickEvent.clientX;
		let tooCloseToRight = distFromRight < this.menuWidth;
		let willSubMenuFit = distFromRight > this.menuWidth * 2;
		return {
			distFromBottom: distFromBottom,
			tooCloseToRight: tooCloseToRight,
			willSubMenuFit: willSubMenuFit,
		};
	}

	//The menu should only be displayed inside of the canvas
	findMenuLocation(clickEvent, boundary, situation) {
		//Make sure there is room from the bottom.
		let py =
			situation.distFromBottom >= this.menuHeight
				? clickEvent.clientY
				: boundary.bottom - this.menuHeight;

		//Make sure there is room from the right boundary.
		let px;
		if (situation.tooCloseToRight) {
			px = boundary.right - this.menuWidth; //Align the menu to the right boundary.
		} else {
			px = clickEvent.clientX;
		}
		return { x: px, y: py };
	}

	positionSubMenus(situation) {
		let direction = situation.willSubMenuFit ? 'right' : 'left';
		this.primatives.forEach((menu) => {
			menu.direction = direction;
		});
		this.elementaryCAs.forEach((menu) => {
			menu.direction = direction;
		});
	}

	/**
	 * The CSS styles for the component.
	 * @returns {string}
	 */
	static get styles() {
		return css`
			.context-menu {
				width: 160px;
				border-radius: 10px;
				background-color: #edefed;
				box-shadow: 0 4px 5px 3px rgba(0, 0, 0, 0.2);
				position: fixed;
				z-index: 4;
				display: block;
				transition: 0.2s display ease-in;
			}

			.context-menu hr {
				border: 0;
				background: #dddddd;
				height: 1px;
			}

			.menu-options {
				list-style: none;
				padding: 10px 0;
				margin: 0;
			}
		`;
	}

	/**
	 * Life Cycle Method: Draws the component.
	 */
	render() {
		return this.display ? this.menuTemplate() : nothing;
	}

	menuTemplate() {
		return html`
			<div
				class="context-menu"
				style="left: ${this._menuPosition.x}px; top: ${this._menuPosition.y}px;"
			>
				<ul class="menu-options">
					${Array.from(this.commands.values()).map((c) =>
						this.renderStatefulMenuItem(c)
					)}
					<hr />
					${Submenus.topLevelOptions.map((c) => this.renderMenuItem(c))}
					<hr />
					${this.primatives.map((sm) => this.renderSubMenu(sm))}
					<hr />
					${this.elementaryCAs.map((sm) => this.renderSubMenu(sm))}
				</ul>
			</div>
		`;
	}

	renderStatefulMenuItem(item) {
		return html`<stateful-menu-item
			key=${item.key}
			activeState=${item.activeState}
			next=${item.states[item.activeState].next}
			label=${item.states[item.activeState].label}
			command=${item.states[item.activeState].command}
			@menu-item-clicked="${this.handleCommandClicked}"
		></stateful-menu-item>`;
	}

	renderMenuItem(item) {
		return html`
			<menu-item
				command="${item.command}"
				label="${item.label}"
				@menu-item-clicked="${this.handleMenuItems}"
			></menu-item>
		`;
	}

	renderSubMenu(submenu) {
		return html`
			<context-submenu
				label=${submenu.label}
				items=${JSON.stringify(submenu.items)}
				direction=${submenu.direction}
				@submenu-item-clicked=${this.handleMenuItems}
			></context-submenu>
		`;
	}

	handleMenuItems(event) {
		event.stopPropagation();
		this.dispatchEvent(
			new CustomEvent(this.event, {
				bubbles: this.eventBubbles,
				composed: this.eventBubbles,
				cancelable: true,
				detail: {
					row: this.activeCell.x,
					col: this.activeCell.y,
					command: event.detail.command,
				},
			})
		);
		this.display = false;
	}

	handleCommandClicked(event) {
		event.stopPropagation();
		this.dispatchEvent(
			new CustomEvent(this.event, {
				bubbles: this.eventBubbles,
				composed: this.eventBubbles,
				cancelable: true,
				detail: {
					row: this.activeCell.x,
					col: this.activeCell.y,
					command: event.detail.command,
					simCommand: true,
				},
			})
		);
		this.commands.get(event.detail.key).activeState = event.detail.next;
		this.display = false;
	}
}

customElements.define('context-menu', ContextMenu);


/***/ }),
/* 34 */
/***/ (function(module, exports) {

const Submenus = {
	topLevelOptions: [{ command: 'dice-roll', label: 'Dice Roll' }],
	primatives: [
		{
			label: 'Static Objects',
			items: [{ command: 'da-block', label: 'Block' }],
		},
		{
			label: 'Oscillators',
			items: [
				{ command: 'vert-spinner', label: 'V-Spinner' },
				{ command: 'horiz-spinner', label: 'H-Spinner' },
				{ command: 'toad', label: 'Toad' },
			],
		},
		{
			label: 'Ships & Stuff',
			items: [
				{ command: 'glider', label: 'Glider' },
				{ command: 'light-ship', label: 'Light Space Ship' },
				{ command: 'conways-memorial', label: 'The Man' },
			],
		},
	],
	elementaryCAs: [
		{
			label: 'Complex',
			items: [
				{ command: 'wr-rule-73', label: '73' },
				{ command: 'wr-rule-75', label: '75' },
				{ command: 'wr-rule-89', label: '89' },
				{ command: 'wr-rule-101', label: '101' },
				{ command: 'wr-rule-110', label: '110' },
				{ command: 'wr-rule-133', label: '133' },
				{ command: 'wr-rule-169', label: '169' },
				{ command: 'wr-rule-225', label: '225' },
			],
		},
		{
			label: 'Peaks',
			items: [
				{ command: 'wr-rule-54', label: '54' },
				{ command: 'wr-rule-62', label: '62' },
				{ command: 'wr-rule-94', label: '94' },
				{ command: 'wr-rule-118', label: '118' },
				{ command: 'wr-rule-131', label: '131' },
				{ command: 'wr-rule-246', label: '246' },
				{ command: 'wr-rule-250', label: '250' },
				{ command: 'wr-rule-254', label: '254' },
			],
		},
		{
			label: 'Lines',
			items: [
				{ command: 'wr-rule-57', label: '57' },
				{ command: 'wr-rule-63', label: '63' },
				{ command: 'wr-rule-69', label: '69' },
				{ command: 'wr-rule-77', label: '77' },
				{ command: 'wr-rule-78', label: '78' },
				{ command: 'wr-rule-79', label: '79' },
				{ command: 'wr-rule-99', label: '99' },
				{ command: 'wr-rule-105', label: '105' },
				{ command: 'wr-rule-106', label: '106' },
				{ command: 'wr-rule-109', label: '109' },
			],
		},
		{
			label: 'Random',
			items: [
				{ command: 'wr-rule-30', label: '30' },
				{ command: 'wr-rule-45', label: '45' },
				{ command: 'wr-rule-60', label: '60' },
				{ command: 'wr-rule-74', label: '74' },
				{ command: 'wr-rule-76', label: '76' },
				{ command: 'wr-rule-86', label: '86' },
				{ command: 'wr-rule-124', label: '124' },
				{ command: 'wr-rule-135', label: '135' },
				{ command: 'wr-rule-137', label: '137' },
				{ command: 'wr-rule-193', label: '193' },
			],
		},
		{
			label: 'Triangles',
			items: [
				{ command: 'wr-rule-90', label: '90' },
				{ command: 'wr-rule-102', label: '102' },
				{ command: 'wr-rule-129', label: '129' },
				{ command: 'wr-rule-151', label: '151' },
				{ command: 'wr-rule-153', label: '153' },
				{ command: 'wr-rule-181', label: '181' },
				{ command: 'wr-rule-182', label: '182' },
				{ command: 'wr-rule-183', label: '183' },
				{ command: 'wr-rule-195', label: '195' },
			],
		},
	],
};

const Commands = {
	runSimulation: {
		key: 'runSim',
		activeState: 'start',
		states: {
			start: { label: 'Start', next: 'pause', command: 'start-sim' },
			pause: { label: 'Pause', next: 'resume', command: 'pause-sim' },
			resume: { label: 'Resume', next: 'pause', command: 'resume-sim' },
		},
	},
	reset: {
		key: 'reset',
		activeState: 'reset',
		states: { reset: { label: 'Reset', next: 'reset', command: 'reset' } },
	},
};
module.exports = { Submenus, Commands };


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

const { LitElement, html, css } = __webpack_require__(0);
const { buttons } = __webpack_require__(4);
/**
 * A simple button that fires an event when clicked.
 */
class EventButton extends LitElement {
	constructor() {
		super();
		this.eventBubbles = true;
	}

	/**
	 * The properties of the component.
	 * @returns {object}
	 */
	static get properties() {
		return {
			event: { type: String },
			eventBubbles: { type: Boolean },
		};
	}

	/**
	 * The CSS styles for the component.
	 * @returns {string}
	 */
	static get styles() {
		return [buttons, css``];
	}

	/**
	 * Life Cycle Method: Draws the component.
	 */
	render() {
		return html`<button type="button" @click="${this.handleClick}">
			<slot></slot>
		</button>`;
	}

	/**
	 * Event handler for when the button is clicked.
	 * @private
	 */
	handleClick() {
		this.dispatchEvent(
			new CustomEvent(this.event, {
				bubbles: this.eventBubbles,
				composed: this.eventBubbles,
			})
		);
	}
}

module.exports = EventButton;

customElements.define('event-button', EventButton);


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

const { LitElement, html, css } = __webpack_require__(0);

/**
 * A simple checkbox with label that fires an event when clicked.
 */
class EventCheckbox extends LitElement {
	constructor() {
		super();
		this.eventBubbles = true;
	}

	/**
	 * The properties of the component.
	 * @returns {object}
	 */
	static get properties() {
		return {
			event: { type: String },
			eventBubbles: { type: Boolean },
		};
	}

	/**
	 * The CSS styles for the component.
	 * @returns {string}
	 */
	static get styles() {
		return css`
			:host {
				margin-left: 2px;
				margin-right: 2px;
			}
		`;
	}

	/**
	 * Life Cycle Method: Draws the component.
	 */
	render() {
		return html`
			<label>
				<input type="checkbox" @click="${this.handleClick}" />
				<slot></slot>
			</label>
		`;
	}

	/**
	 * Event handler for when the button is clicked.
	 * @private
	 */
	handleClick() {
		this.dispatchEvent(
			new CustomEvent(this.event, {
				bubbles: this.eventBubbles,
				composed: this.eventBubbles,
				detail: {
					checked: this.shadowRoot.querySelector('input').checked,
				},
			})
		);
	}
}

customElements.define('event-checkbox', EventCheckbox);


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

const { LitElement, html, css } = __webpack_require__(0);
const Games = __webpack_require__(12);

class GameSelector extends LitElement {
	constructor() {
		super();
		this.eventBubbles = true;
	}

	/**
	 * The properties of the component.
	 * @returns {object}
	 */
	static get properties() {
		return {
			event: { type: String },
		};
	}

	/**
	 * The CSS styles for the component.
	 * @returns {string}
	 */
	static get styles() {
		return css`
			:host {
				margin-left: 2px;
				margin-right: 2px;
			}
			select {
				height: 25px;
			}
			select:focus {
				outline: none !important;
				border: 2px solid #039be5;
			}
		`;
	}

	render() {
		return html`
			<label>
				Game
				<select @change="${this.handleChange}">
					${Games.map((game) => this.renderGameOption(game))}
				</select>
			</label>
		`;
	}
	renderGameOption(game) {
		return html`<option value=${game.key}>${game.label}</option>`;
	}

	handleChange(event) {
		let selectElement = this.shadowRoot.querySelector('select');
		let game = Games.find((game) => game.key === selectElement.value);
		this.dispatchEvent(
			new CustomEvent(this.event, {
				bubbles: this.eventBubbles,
				composed: this.eventBubbles,
				detail: {
					game: game,
				},
			})
		);
	}
}

customElements.define('game-selector', GameSelector);


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

const { LitElement, html, css, nothing } = __webpack_require__(0);

class MenuItem extends LitElement {
	constructor() {
		super();
		this.eventBubbles = true;
		this.display = true;
		this.event = 'menu-item-clicked';
	}

	/**
	 * The properties of the component.
	 * @returns {object}
	 */
	static get properties() {
		return {
			event: { type: String },
			eventBubbles: { type: Boolean },
			display: { type: Boolean },
			command: { type: String },
			label: { type: String },
		};
	}

	/**
	 * The CSS styles for the component.
	 * @returns {string}
	 */
	static get styles() {
		return css`
			.menu-option {
				font-weight: 500;
				font-size: 14px;
				padding: 10px 40px 10px 20px;
				cursor: pointer;
			}

			.menu-option:hover {
				background: rgba(0, 0, 0, 0.2);
			}
		`;
	}

	/**
	 * Life Cycle Method: Draws the component.
	 */
	render() {
		return this.display ? this.template() : nothing;
	}

	template() {
		return html`<li class="menu-option" @click=${this.handleClick}>
			${this.label}
		</li>`;
	}

	handleClick(event) {
		this.dispatchEvent(
			new CustomEvent(this.event, {
				bubbles: this.eventBubbles,
				composed: this.eventBubbles,
				cancelable: true,
				detail: {
					command: this.command,
				},
			})
		);
	}
}

customElements.define('menu-item', MenuItem);


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

const { LitElement, html, css, nothing } = __webpack_require__(0);

class StatefulMenuItem extends LitElement {
	constructor() {
		super();
		this.eventBubbles = true;
		this.display = true;
		this.event = 'menu-item-clicked';
	}

	/**
	 * The properties of the component.
	 * @returns {object}
	 */
	static get properties() {
		return {
			event: { type: String },
			eventBubbles: { type: Boolean },
			display: { type: Boolean },
			key: { type: String },
			next: { type: String },
			label: { type: String },
			command: { type: String },
		};
	}

	/**
	 * The CSS styles for the component.
	 * @returns {string}
	 */
	static get styles() {
		return css`
			.menu-option {
				font-weight: 500;
				font-size: 14px;
				padding: 10px 40px 10px 20px;
				cursor: pointer;
			}

			.menu-option:hover {
				background: rgba(0, 0, 0, 0.2);
			}
		`;
	}

	/**
	 * Life Cycle Method: Draws the component.
	 */
	render() {
		return this.display ? this.template() : nothing;
	}

	template() {
		return html` <li class="menu-option" @click=${this.handleClick}>
			${this.label}
		</li>`;
	}

	handleClick(event) {
		this.dispatchEvent(
			new CustomEvent(this.event, {
				bubbles: this.eventBubbles,
				composed: this.eventBubbles,
				cancelable: true,
				detail: {
					command: this.command,
					next: this.next,
					key: this.key,
				},
			})
		);
	}
}

customElements.define('stateful-menu-item', StatefulMenuItem);


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

const { LitElement, html, css } = __webpack_require__(0);

const { buttons } = __webpack_require__(4);

const ButtonStates = {
	IDLE: {
		name: 'IDLE',
		buttonTitle: 'Start',
		nextState: 'RUNNING',
		event: 'sim-event-start-requested',
	},
	RUNNING: {
		name: 'RUNNING',
		buttonTitle: 'Pause',
		nextState: 'PAUSED',
		event: 'sim-event-pause-requested',
	},
	PAUSED: {
		name: 'PAUSED',
		buttonTitle: 'Resume',
		nextState: 'RUNNING',
		event: 'sim-event-resume-requested',
	},
};

/**
 * A multi-state button.
 */
class StartButton extends LitElement {
	constructor() {
		super();
		this.enabled = false;
	}

	/**
	 * The properties of the component.
	 * @returns {object}
	 */
	static get properties() {
		return {
			state: { type: String },
			enabled: { type: Boolean },
		};
	}

	/**
	 * The CSS styles for the component.
	 * @returns {string}
	 */
	static get styles() {
		return [buttons, css``];
	}

	/**
	 * Life Cycle Method: Draws the component.
	 */
	render() {
		return html`<button
			type="button"
			@click="${this.handleClick}"
			?disabled="${!this.enabled}"
		>
			${ButtonStates[this.state].buttonTitle}
		</button>`;
	}

	/**
	 * Event handler for when the button is clicked.
	 * @private
	 */
	handleClick() {
		this.dispatchEvent(
			new CustomEvent(ButtonStates[this.state].event, {
				bubbles: true,
				composed: true,
			})
		);
		this.state = ButtonStates[this.state].nextState;
	}
}

customElements.define('start-button', StartButton);


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

const { LitElement, html, css, nothing } = __webpack_require__(0);

const ArrowIcons = {
	right: 'arrow_right',
	left: 'arrow_left',
};

class SubMenu extends LitElement {
	constructor() {
		super();
		this.eventBubbles = true;
		this.display = true;
		this.event = 'submenu-item-clicked';
	}

	/**
	 * The properties of the component.
	 * @returns {object}
	 */
	static get properties() {
		return {
			event: { type: String },
			eventBubbles: { type: Boolean },
			display: { type: Boolean },
			items: { type: Array },
			label: { type: String },
			direction: { type: String }, //left || right
		};
	}

	/**
	 * The CSS styles for the component.
	 * @returns {string}
	 */
	static get styles() {
		return css`
			:host {
			}

			.submenu {
				position: relative;
				padding-left: 20px;
				margin-top: 10px;
				margin-bottom: 10px;
			}

			.submenu:hover {
				background: rgba(0, 0, 0, 0.2);
				cursor: pointer;
			}

			.submenu span {
				font-weight: 500;
				font-size: 14px;
			}

			/* 
      Use the Google Icon: arrow-right for span:after 
      CSS Trick Ref: https://css-tricks.com/ligature-icons/
      */
			[arrow-icon]::after {
				content: attr(arrow-icon);
				font-family: 'Material Icons';
				font-weight: normal;
				font-style: normal;
				font-size: 24px;
				vertical-align: middle;
				width: 1em;
				height: 1em;
				line-height: 1;
				text-transform: none;
				letter-spacing: normal;
				word-wrap: normal;
				white-space: nowrap;
				direction: ltr;
				float: right;

				/* Support for all WebKit browsers. */
				-webkit-font-smoothing: antialiased;

				/* Support for Safari and Chrome. */
				text-rendering: optimizeLegibility;

				/* Support for Firefox. */
				-moz-osx-font-smoothing: grayscale;

				/* Support for IE. */
				font-feature-settings: 'liga';
			}

			[arrow-icon='arrow_left']::after {
				float: left;
			}

			.menu-options {
				list-style: none;
				padding: 10px 0;
				margin: 0;
			}

			/* Happy Path */
			.submenu:hover .menu-options.right {
				display: block;
				width: 160px;
				left: 160px;
				bottom: -20px;
			}

			/* Menu open to the left*/
			.submenu:hover .menu-options.left {
				display: block;
				width: 160px;
				right: 160px;
				bottom: -20px;
			}

			.submenu ul {
				background-color: #edefed;
				box-shadow: 0 4px 5px 3px rgba(0, 0, 0, 0.2);
				position: absolute;
				display: none;
				transition: 0.2s display ease-in;

				border-top-left-radius: 10px;
				border-top-right-radius: 10px;
				border-bottom-right-radius: 10px;
				border-bottom-left-radius: 10px;
			}
		`;
	}

	/**
	 * Life Cycle Method: Draws the component.
	 */
	render() {
		return this.display ? this.template() : nothing;
	}

	template() {
		return html`
			<li
				class="submenu"
				arrow-icon=${ArrowIcons[this.direction]}
				direction=${this.direction}
			>
				<span>${this.label}</span>
				<ul class="menu-options ${this.direction}">
					${this.items.map((i) => this.renderMenuItem(i))}
				</ul>
			</li>
		`;
	}

	renderMenuItem(item) {
		return html`
			<menu-item
				command="${item.command}"
				label="${item.label}"
				@menu-item-clicked="${this.handleMenuItems}"
			></menu-item>
		`;
	}

	handleMenuItems(event) {
		event.stopPropagation();
		this.dispatchEvent(
			new CustomEvent(this.event, {
				bubbles: this.eventBubbles,
				composed: this.eventBubbles,
				cancelable: true,
				detail: {
					command: event.detail.command,
				},
			})
		);
	}
}

customElements.define('context-submenu', SubMenu);


/***/ })
/******/ ]);
//# sourceMappingURL=main.8ebbbeffb3000c6234be.js.map