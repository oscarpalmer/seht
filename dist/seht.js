/*!
 * Seht, v0.12.0 - a JavaScript library, like jQuery or Zepto!
 * https://github.com/oscarpalmer/seht
 * (c) Oscar Palmér, 2019, MIT @license
 */
const seht = (function () {
  'use strict';

  // Reference to window
  const win = window;

  // Reference to document
  const doc = win.document;

  // Reference to prototypal functions of an array
  const arrayPrototype = Array.prototype;

  // Reference to common regexes within Seht
  const regexes = {
    html: /^\s*<([^\s>]+)/,
    id: /^#[\w-]+$/,
  };

  /**
   * Collection of utility methods.
   */
  const Utils = {
    /**
     * Method for looping through arrays and object
     * with a callback for each element within.
     * @param {Array|Object} obj
     * @param {Function} handler
     * @param {*} scope
     * @returns {Array|Object} The original array or object
     */
    each(obj, handler, scope) {
      if (typeof obj === 'object' && typeof obj.length === 'number') {
        arrayPrototype.forEach.call(obj, (value, index) => {
          handler.call(scope || value, value, index, obj);
        });
      } else {
        arrayPrototype.forEach.call(Object.keys(obj), (key) => {
          handler.call(scope || obj[key], obj[key], obj);
        });
      }

      return obj;
    },

    /**
     * Method for remapping an array or object based on a callback.
     * @param {Array|Object} obj
     * @param {Function} handler
     * @param {*} scope
     * @returns {Array|Object} The original array or object
     */
    map(obj, handler, scope) {
      return arrayPrototype.forEach.call(obj, (value, index) => {
        return handler.call(scope || value, value, index, obj);
      });
    },

    /**
     * Method for converting an array-like object to an array.
     * @param {Object} obj
     * @returns {Array} New array
     */
    toArray(obj) {
      return arrayPrototype.slice.call(obj);
    },

    /**
     * Method for removing duplicates in an array.
     * @param {Array} array
     * @returns {Array} A duplicate-free array
     */
    unique(array) {
      // Return the original array if it is unable to contain duplicates
      if (array.length <= 1) {
        return array;
      }

      return arrayPrototype.filter.call(array, (value, index, original) => {
        return arrayPrototype.indexOf.call(original, value) === index;
      });
    },
  };

  /**
   * Collection of event-related methods.
   */
  const Events = {
    /**
     * Method for adding a callback for when the DOM has loaded.
     * @param {Function} handler
     */
    ready(handler) {
      doc.addEventListener('DOMContentLoaded', handler);
    },

    /**
     * Method for triggering events on an element.
     * @param {Element} element
     * @param {Array} types
     */
    trigger(element, types) {
      let event;

      Utils.each(types, (type) => {
        // Create custom event
        event = doc.createEvent('CustomEvent');

        // Set properties of custom event
        event.initCustomEvent(type, true, true);

        // Dispatch (trigger) event on element
        element.dispatchEvent(event);
      });
    }
  };

  /**
   * Collection of DOM-related methods.
   */
  const DOM = {
    /**
     * Method for defining the context of a search query.
     * @param {*=} context
     * @returns {Array|Element|Seht} Seht, a single element or an array of elements
     */
    defineContext(context) {
      // No context; defaults to document
      if (typeof context === 'undefined') {
        return doc;
      }

      // Context is an element
      if (context.nodeType) {
        return context;
      }

      // Context is also a selector
      if (typeof context === 'string') {
        return DOM.query(context, doc);
      }

      // Context is an array or array-like object
      if (typeof context === 'object' && typeof context.length === 'number') {
        return context;
      }

      // Bad context; defaults to document
      return doc;
    },

    /**
     * Method for finding elements based on a selector and context.
     * @param {*=} selector 
     * @param {*=} context 
     * @returns {Array} Array of elements
     */
    find(selector, context) {
      // Nothing to search for, so let's return an empty array
      if (selector === null || typeof selector === 'undefined') {
        return [];
      }

      // The selector is an element or 'window'
      if (selector.nodeType || selector === selector.window) {
        return [selector];
      }

      // The selector is an array
      if (typeof selector === 'object' && typeof selector.length === 'number') {
        return selector;
      }

      // The selector is a search query, so let's search for it
      if (typeof selector === 'string') {
        return DOM.query(selector, context);
      }

      // Nothing to search for, so let's return an empty array
      return [];
    },

    /**
     * Method for creating HTML elements based on a string.
     * @param {String} string
     * @returns {Array} Array of elements
     */
    htmlify(string) {
      // Parameter is not a string, so let's return an empty array
      if (typeof string !== 'string') {
        return [];
      }

      // Create a new HTML document,
      const html = doc.implementation.createHTMLDocument();

      // and set its content to the value of the supplied string
      html.body.innerHTML = string;

      // Return the bodys child elements
      return html.body.children;
    },

    /**
     * Method for inserting HTML content relative to elements' position.
     * @param {Seht} elements
     * @param {String} position
     * @param {Seht|String} html
     * @returns {Seht} The original Seht object
     */
    insertAdjacentHTML(elements, position, html) {
      html = html.toString() || html;

      return Utils.each(elements, (element) => {
        element.insertAdjacentHTML(position, html);
      });
    },

    /**
     * Method for finding elements based on a search query and context.
     * @param {String} selector
     * @param {*} context
     * @returns {Array} Array of elements
     */
    query(selector, context) {
      // Define a context for the query
      context = DOM.defineContext(context);

      // Multiple contexts, so let's search them all
      if (typeof context === 'object' && typeof context.length === 'number') {
        let returnable = [];

        Utils.each(context, (ctx) => {
          // Search each context and concatenate the result to a new array
          returnable = returnable.concat(Utils.toArray(DOM.query(selector, ctx)));
        });

        return returnable;
      }

      if (regexes.id.test(selector)) {
        // The string matches the regex for an ID-search
        return [context.getElementById(selector.slice(1))];
      }

      if (regexes.html.test(selector)) {
        // The string matches the regex for HTML, so let's 'htmlify' it
        return DOM.htmlify(selector);
      }

      // Default selector search
      return context.querySelectorAll(selector);
    },
  };

  /**
   * Seht!
   */
  class Seht {
    /**
     * Constructor for Seht.
     * @param {*=} selector
     * @param {*=} context
     */
    constructor(selector, context) {
      let elements;

      // Find elements based on selector and context
      elements = DOM.find(selector, context);

      // Remove duplicates from the list of elements
      elements = Utils.unique(elements);

      // Set the current Seht object's length to length of elements
      this.length = elements.length;

      // For each element, set it to occupy the same index in the Seht object
      Utils.each(elements, (element, index) => {
        this[index] = element;
      }, this);
    }

    /**
     * Method for adding class names to elements.
     * @param {...String} classNames
     * @return {Seht} The original Seht object
     */
    addClass(...classNames) {
      return Utils.each(this, (element) => {
        Utils.each(classNames, (name) => {
          element.classList.add(name);
        });
      });
    }

    /**
     * Method for inserting HTML content after elements.
     * @param {Seht|String} html
     * @return {Seht} The original Seht object
     */
    after(html) {
      return DOM.insertAdjacentHTML(this, 'afterend', html);
    }

    /**
     * Method for appending HTML content to elements.
     * @param {Seht|String} html
     * @return {Seht} The original Seht object
     */
    append(html) {
      return DOM.insertAdjacentHTML(this, 'beforeend', html);
    }

    /**
     * Method for appending a Seht object to a selector.
     * @param {*=} selector
     * @return {Seht} The new Seht object
     */
    appendTo(selector) {
      return seht(selector).append(this);
    }

    /**
     * Method for retrieving or setting attributes for elements.
     * @param {String} name
     * @param {String=} value
     * @return {Seht|String} The original Seht object or value of attribute
     */
    attr(name, value) {
      if (typeof name !== 'undefined' && typeof value !== 'undefined') {
        return Utils.each(this, (element) => {
          element.setAttribute(name, value);
        });
      }

      if (this.length > 0) {
        return this[0].getAttribute(name);
      }

      return null;
    }

    /**
     * Method for inserting HTML content before elements.
     * @param {String} html
     * @return {Seht} The original Seht object
     */
    before(html) {
      return DOM.insertAdjacentHTML(this, 'beforebegin', html);
    }

    /**
     * Method for retrieving or setting data-attributes for elements.
     * @param {String} name
     * @param {String=} value
     * @return {Seht|String} The original Seht object or value of attribute
     */
    data(name, value) {
      // Define a proper data name
      name = typeof name === 'undefined' ? null : `data-${name}`;

      if (name && typeof value !== 'undefined') {
        // Convert a JS object to a JSON string
        value = JSON.stringify(value);

        return Utils.each(this, (element) => {
          element.setAttribute(name, value);
        });
      }

      if (this.length > 0) {
        // Return a parsed JSON string
        return JSON.parse(this[0].getAttribute(name));
      }

      return null;
    }

    /**
     * Method for calling a handler for each element in the Seht object.
     * @param {Function} handler
     * @return {Seht} The original Seht object
     */
    each(handler) {
      return Utils.each(this, handler);
    }

    /**
     * Method for emptying elements of a Seht object.
     * @return {Seht} The original Seht object
     */
    empty() {
      return Utils.each(this, (element) => {
        element.innerHTML = '';
      });
    }

    /**
     * Method for creating a new Seht object containing
     * only the element at a specific position.
     * @param {Number} index
     * @return {Seht|Null} The new Seht object or null
     */
    eq(index) {
      return seht(index >= 0 && index < this.length ? this[index] : null);
    }

    /**
     * Method for creating a new Seht object containing only the first element.
     * @return {Seht|Null} The new Seht object or null
     */
    first() {
      return this.eq(0);
    }

    /**
     * Method for verifying if an element has a specific class name.
     * @param {String} string
     * @return {Boolean}
     */
    hasClass(string) {
      return this[0].classList.contains(string);
    }

    /**
     * Metho for retrieving or setting the HTML for elements.
     * @param {String=} string
     * @return {Seht} The original Seht object or the first element's HTML
     */
    html(string) {
      if (typeof string !== 'undefined') {
        if (string instanceof Seht) {
          // The supplied string is actually a
          // Seht object, so let's flatten it.
          string = this.toString();
        }

        return Utils.each(this, (element) => {
          element.innerHTML = string;
        });
      }

      if (this.length > 0) {
        return this[0].innerHTML;
      }

      return null;
    }

    /**
     * Method for creating a new Seht object containing only the last element.
     * @return {Seht|Null} The new Seht object or null
     */
    last() {
      return this.eq(this.length);
    }

    /**
     * Method for creating a new Seht object based on
     * results from handlers called on old elements.
     * @param {Function} handler
     * @return {Seht} The new Seht object
     */
    map(handler) {
      return seht(Utils.map(this, handler));
    }

    /**
     * Method for removing an event handler from elements.
     * @param {String} type
     * @param {Function} handler
     * @return {Seht} The original Seht object
     */
    off(type, handler) {
      return Utils.each(this, (element) => {
        element.removeEventListener(type, handler);
      });
    }

    /**
     * Method for adding an event handler to elements.
     * @param {String} type
     * @param {Function} handler
     * @return {Seht} The original Seht object
     */
    on(type, handler) {
      return Utils.each(this, (element) => {
        element.addEventListener(type, handler);
      });
    }

    /**
     * Method for creating a new Seht object based on elements' parents.
     * @return {Seht} The new Seht object
     */
    parent() {
      return seht(Utils.map(this, element => element.parentNode));
    }

    /**
     * Method for prepending HTML content to elements.
     * @param {String} html
     * @return {Seht} The original Seht object
     */
    prepend(html) {
      return DOM.insertAdjacentHTML(this, 'afterbegin', html);
    }

    /**
     * Method for prepending a Seht object to a selector.
     * @param {*} selector
     * @return {Seht} The new Seht object
     */
    prependTo(selector) {
      return seht(selector).prepend(this);
    }

    /**
     * Method for removing elements from its context;
     * returns their parents in a new Seht object.
     * @return {Seht} The new Seht object
     */
    remove() {
      const parents = this.parent();

      Utils.each(this, (element) => {
        element.parentNode.removeChild(element);
      });

      return parents;
    }

    /**
     * Method for removing class names from elements.
     * @param {...String} classNames
     * @return {Seht} The original Seht object
     */
    removeClass(...classNames) {
      return Utils.each(this, (element) => {
        Utils.each(classNames, (name) => {
          element.classList.remove(name);
        });
      });
    }

    /**
     * Method for retrieving or setting the text for elements.
     * @param {String=} string
     * @return {Seht|String} The original Seht object or the first element's text content
     */
    text(string) {
      if (typeof string !== 'undefined') {
        return Utils.each(this, (element) => {
          element.textContent = string;
        });
      }

      if (this.length > 0) {
        return this[0].textContent;
      }

      return null;
    }

    /**
     * Method for converting the Seht object to a regular array.
     * @return {Array} Array of elements
     */
    toArray() {
      return Utils.toArray(this);
    }

    /**
     * Method for toggling class names for elements.
     * @param {...String} classNames
     * @return {Seht} The original Seht object
     */
    toggleClass(...classNames) {
      return Utils.each(this, (element) => {
        Utils.each(classNames, (name) => {
          element.classList.toggle(name);
        });
      });
    }

    /**
     * Method for flattening the Seht object and
     * combining all elements' HTML content.
     * @return {String} The combined HTML content
     */
    toString() {
      let string = '';

      Utils.each(this, (element) => {
        string += element.outerHTML;
      });

      return string;
    }

    /**
     * Method for triggering events for
     * each element in the Seht object.
     * @param {...String} events
     * @return {Seht} The original Seht object
     */
    trigger(...events) {
      return Utils.each(this, (element) => {
        Events.trigger(element, events);
      });
    }

    /**
     * Method for retrieving or setting the value for an element.
     * @param {String=} value
     * @return {Seht} The original Seht object or the first element's value
     */
    value(value) {
      if (typeof value !== 'undefined') {
        return Utils.each(this, (element) => {
          element.value = value;
        });
      }

      if (this.length > 0) {
        return this[0].value;
      }

      return null;
    }
  }

  const seht$1 = (selector, context) => {
    if (selector instanceof Seht) {
      return selector;
    }

    return new Seht(selector, context);
  };

  seht$1.each = Utils.each;
  seht$1.map = Utils.map;
  seht$1.ready = Events.ready;
  seht$1.toArray = Utils.toArray;
  seht$1.unique = Utils.unique;

  return seht$1;

}());
