/*!
 * Seht, v0.13.0 - a JavaScript library, like jQuery or Zepto!
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
     * Method for looping through arrays, array-like objects,
     * and object with a callback for each item or property within.
     * @param {Array|Object} obj Object to loop within
     * @param {Function} callback Callback for loop
     * @param {*=} scope Scope of callback, i.e. 'this'
     * @returns {Array|Object} The original array or object
     */
    each(obj, callback, scope) {
      if (Utils.isArrayLike(obj)) {
        // Object is an array or like an array
        arrayPrototype.forEach.call(obj, callback, scope);
      } else if (typeof obj === 'object') {
        // Object is a regular object
        Object.keys(obj).forEach((key) => {
          callback.call(scope || obj[key], obj[key], key, obj);
        });
      }

      // Return original array, array-like object, or object
      return obj;
    },

    /**
     * Method for verifying if an object is or is like an array.
     * @param {*} obj Object to verify
     * @returns {Boolean} True if it is or is like an array
     */
    isArrayLike(obj) {
      // Obvious types that are not arrays or like arrays
      if (obj == null || obj === obj.window || typeof obj !== 'object') {
        return false;
      }

      // Get the lenght of the array or array-like object
      const length = 'length' in obj && obj.length;

      return typeof length === 'number' // Valid length
          && (length === 0 // Empty array or array-like object
            || (length > 0 // Array or array-like object has length…
            && (length - 1) in obj)); // … and its last item exists
    },

    /**
     * Method for remapping an array, array-like object,
     * or object based on a callback.
     * @param {Array|Object} obj Object to map values for
     * @param {Function} callback Callback for mapping
     * @param {*=} scope Scope of callback, i.e. 'this'
     * @returns {Array|Object} The original array or object
     */
    map(obj, callback, scope) {
      // Object is an array or like an array
      if (Utils.isArrayLike(obj)) {
        // Call the built-in map function with the callback and return the result
        return arrayPrototype.map.call(obj, callback, scope);
      }

      // Object is a regular object
      if (obj && typeof obj === 'object') {
        // Create a return object from previous object
        const returnObject = obj;
        // Loop through the object and overwrite keys with result of callback
        Object.keys(obj).forEach((key) => {
          returnObject[key] = callback.call(scope || obj[key], obj[key], key, obj);
        });
      }

      // Return array-like object or object
      return obj;
    },

    /**
     * Method for converting an array-like object or strings to an array.
     * @param {Object|String} obj Object to convert
     * @returns {Array} New array
     */
    toArray(obj) {
      return typeof obj === 'string' || Utils.isArrayLike(obj)
        ? arrayPrototype.slice.call(obj) // Possible to convert to array
        : []; // Not possible; return empty array
    },

    /**
     * Method for removing duplicates in an array or array-like object.
     * @param {Array|Object} obj Object to remove duplicates for
     * @returns {Array} A duplicate-free array or the original object
     */
    unique(obj) {
      // Only filter through arrays or array-like objects
      if (typeof obj === 'string' || Utils.isArrayLike(obj)) {
        // Return the original array if it is unable to contain duplicates
        if (obj.length <= 1) {
          return obj;
        }

        // Filter through array or array-like object and
        // check for each item's existence in new array
        return arrayPrototype.filter.call(obj, (v, i) => arrayPrototype.indexOf.call(obj, v) === i);
      }

      // Nothing to filter through; return empty array
      return [];
    },
  };

  /**
   * Collection of event-related methods.
   */
  const Events = {
    /**
     * Method for adding a callback for when the DOM has loaded.
     * @param {Function} callback Function to call when document is ready
     * @param {Boolean=} capture True or false to capture this event callback before others
     */
    ready(callback, capture) {
      doc.addEventListener('DOMContentLoaded', callback, capture || false);
    },

    /**
     * Method for triggering events on an element.
     * @param {Element} element Element on which to trigger events
     * @param {Array} types Array of strings representing event names
     */
    trigger(element, types) {
      let event;

      Utils.each(types, (type) => {
        // Create custom event
        event = doc.createEvent('Event');

        // Set properties of custom event
        event.initEvent(type, true, true);

        // Dispatch (trigger) event on element
        element.dispatchEvent(event);
      });
    },
  };

  /**
   * Collection of DOM-related methods.
   */
  const DOM = {
    /**
     * Method for defining the context of a search query.
     * @param {*=} context Context to be defined
     * @returns {Array|Element|Seht} Seht, a single element or an array of elements
     */
    defineContext(context) {
      // No context; defaults to document
      if (context == null || context === '') {
        return doc;
      }

      // Context is an element or is an array or array-like object
      if (context.nodeType || Utils.isArrayLike(context)) {
        return context;
      }

      // Context is also a selector
      if (typeof context === 'string') {
        return DOM.query(context, doc);
      }

      // Bad context; defaults to document
      return doc;
    },

    /**
     * Method for finding elements based on a selector and context.
     * @param {*=} selector Selector to find
     * @param {*=} context Context to find selector within
     * @returns {Array} Array of elements
     */
    find(selector, context) {
      // Nothing to search for, so let's return an empty array
      if (selector == null || selector === '') {
        return [];
      }

      // The selector is an element or 'window'
      if (selector.nodeType || selector === selector.window) {
        return [selector];
      }

      // The selector is an array
      if (Utils.isArrayLike(selector)) {
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
     * @param {String} string String to convert to HTML elements
     * @returns {Array} Array of elements
     */
    htmlify(string) {
      // Parameter is not a string, so let's return an empty array
      if (typeof string !== 'string') {
        return [];
      }

      // Create a new HTML document…
      const html = doc.implementation.createHTMLDocument();

      // … and set its content to the value of the parameter
      html.body.innerHTML = string;

      // Return the body's child elements
      return html.body.children;
    },

    /**
     * Method for inserting HTML content relative to elements' position.
     * @param {Seht} elements Seht object of elements
     * @param {String} position Position for HTML content
     * @param {Seht|String} html HTML content to insert
     * @returns {Seht} The original Seht object
     */
    insertAdjacentHTML(elements, position, html) {
      // Cast parameter to a string value if needed
      const value = typeof html === 'string' ? html : `${html}`;

      return Utils.each(elements, (element) => {
        element.insertAdjacentHTML(position, value);
      });
    },

    /**
     * Method for finding elements based on a search query and context.
     * @param {String} selector Selector to search for
     * @param {*} context Context to search within
     * @returns {Array} Array of elements
     */
    query(selector, context) {
      // Define a context for the query
      const definedContext = DOM.defineContext(context);

      // Multiple contexts, so let's search them all
      if (Utils.isArrayLike(definedContext)) {
        let returnable = [];

        Utils.each(definedContext, (ctx) => {
          // Search each context and concatenate the result to the new array
          returnable = returnable.concat(Utils.toArray(DOM.query(selector, ctx)));
        });

        return returnable;
      }

      if (regexes.id.test(selector) && definedContext.getElementById) {
        // The string matches the regex for an ID-search
        return [definedContext.getElementById(selector.slice(1))];
      }

      if (regexes.html.test(selector)) {
        // The string matches the regex for HTML, so let's 'htmlify' it
        return DOM.htmlify(selector);
      }

      // Default selector search
      return definedContext.querySelectorAll(selector);
    },

    /**
     * Method for setting or removing a value for an attribute on an element.
     * @param {Element} element Element to set or unset attribute for
     * @param {String} name Name of attribute
     * @param {String=} value Value for attribute
     */
    setAttribute(element, name, value) {
      if (value != null) {
        element.setAttribute(name, value);
      } else {
        element.removeAttribute(name);
      }
    },
  };

  /**
   * Seht!
   */
  class Seht {
    /**
     * Constructor for Seht.
     * @param {*=} selector Selector for elements
     * @param {*=} context Context of elements
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
     * @param {...String} classNames Comma separated strings representing class names
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
     * @param {Seht|String} html HTML content to insert
     * @return {Seht} The original Seht object
     */
    after(html) {
      return DOM.insertAdjacentHTML(this, 'afterend', html);
    }

    /**
     * Method for appending HTML content to elements.
     * @param {Seht|String} html HTML content to insert
     * @return {Seht} The original Seht object
     */
    append(html) {
      return DOM.insertAdjacentHTML(this, 'beforeend', html);
    }

    /**
     * Method for appending a Seht object to a selector.
     * @param {*} selector Selector for elements to append to
     * @param {*=} context Context of elements
     * @return {Seht} A new Seht object
     */
    appendTo(selector, context) {
      return (new Seht(selector, context)).append(this);
    }

    /**
     * Method for retrieving or setting attributes for elements.
     * @param {String} name Name of attribute
     * @param {String=} value Value for attribute
     * @return {Seht|String} The original Seht object or value of attribute
     */
    attr(name, value) {
      // Set or unset an attribute with 'name' and 'value'
      if (name != null && value !== undefined && this.length > 0) {
        return Utils.each(this, (element) => {
          DOM.setAttribute(element, name, value);
        });
      }

      // Return value for attribute in element
      if (name != null && this.length > 0) {
        return this[0].getAttribute(name);
      }

      // No parameters; return nothing
      return null;
    }

    /**
     * Method for inserting HTML content before elements.
     * @param {String} html HTML content to insert
     * @return {Seht} The original Seht object
     */
    before(html) {
      return DOM.insertAdjacentHTML(this, 'beforebegin', html);
    }

    /**
     * Method for retrieving or setting data-attributes for elements.
     * @param {String} name Name of attribute
     * @param {String=} value Value for attribute
     * @return {Seht|String} The original Seht object or value of attribute
     */
    data(name, value) {
      // Define a proper data-name
      const atttribute = name == null ? name : `data-${name}`;

      // Set or unset an attribute with 'name' and 'value'
      if (atttribute != null && value !== undefined && this.length > 0) {
        // Convert a JS object to a JSON string
        const json = JSON.stringify(value);

        return Utils.each(this, (element) => {
          DOM.setAttribute(element, atttribute, json);
        });
      }

      // Return value for attribute in element
      if (atttribute && this.length > 0) {
        // Return a parsed JSON string
        return JSON.parse(this[0].getAttribute(atttribute));
      }

      // No parameters; return nothing
      return null;
    }

    /**
     * Method for calling a callback for each element in the Seht object.
     * @param {Function} callback Function to call for each item
     * @return {Seht} The original Seht object
     */
    each(callback) {
      return Utils.each(this, callback);
    }

    /**
     * Method for emptying elements of a Seht object.
     * @return {Seht} The original Seht object
     */
    empty() {
      return Utils.each(this, (element) => {
        const el = element;

        el.innerHTML = '';
      });
    }

    /**
     * Method for creating a new Seht object containing
     * only the element at a specific position.
     * @param {Number} index Numerical value representing a position in Seht object
     * @return {Seht|Null} A new Seht object or null
     */
    eq(index) {
      // Return Seht object with single element matching index when possible, or nothing
      if (index != null && typeof index === 'number') {
        return index >= 0 && index < this.length ? new Seht(this[index]) : null;
      }

      // No match; return nothing
      return null;
    }

    /**
     * Method for creating a new Seht object containing only the first element.
     * @return {Seht|Null} A new Seht object or null
     */
    first() {
      return this.eq(0);
    }

    /**
     * Method for retrieving an element at a specific position.
     * @param {Number} index Numerical value representing a position in Seht object
     * @return {Element|Null} A found element or null
     */
    get(index) {
      // Return single element matching index when possible, or nothing
      if (index != null && typeof index === 'number') {
        return index >= 0 && index < this.length ? this[index] : null;
      }

      // No match; return nothing
      return null;
    }

    /**
     * Method for verifying if an element has a specific class name.
     * @param {String} string Name of class to check for
     * @return {Boolean}
     */
    hasClass(name) {
      // Class name is not empty, is a string, and Seht object has at least one element
      if (name != null && typeof name === 'string' && this.length > 0) {
        // Return value of 'contains'-call on 'classList'
        return this[0].classList.contains(name);
      }

      // Nothing to check; return nothing
      return null;
    }

    /**
     * Metho for retrieving or setting the HTML for elements.
     * @param {String=} value HTML content to insert
     * @return {Seht} The original Seht object or the first element's HTML
     */
    html(value) {
      // Set HTML content with value
      if (value != null) {
        // Cast parameter to a string value if needed
        const html = typeof value === 'string' ? value : `${value}`;

        return Utils.each(this, (element) => {
          const el = element;

          el.innerHTML = html;
        });
      }

      // Return HTML content of first element if possible
      if (this.length > 0) {
        return this[0].innerHTML;
      }

      // No value to set or retrieve; return nothing
      return null;
    }

    /**
     * Method for creating a new Seht object containing only the last element.
     * @return {Seht|Null} A new Seht object or null
     */
    last() {
      return this.eq(this.length - 1);
    }

    /**
     * Method for creating a new Seht object based on
     * results from callbacks called on old elements.
     * @param {Function} callback Function to call for each item
     * @return {Seht} A new Seht object
     */
    map(callback) {
      return new Seht(Utils.map(this, callback));
    }

    /**
     * Method for removing an event callback from elements.
     * @param {String} type Name of event type
     * @param {Function} callback Function to call for event
     * @param {Boolean=} capture True or false; must match value of previous 'on'-call
     * @return {Seht} The original Seht object
     */
    off(type, callback, capture) {
      return Utils.each(this, (element) => {
        element.removeEventListener(type, callback, capture || false);
      });
    }

    /**
     * Method for adding an event callback to elements.
     * @param {String} type Name of event type
     * @param {Function} callback Function to call for event
     * @param {Boolean=} capture True or false to capture this event callback before others
     * @return {Seht} The original Seht object
     */
    on(type, callback, capture) {
      return Utils.each(this, (element) => {
        element.addEventListener(type, callback, capture || false);
      });
    }

    /**
     * Method for creating a new Seht object based on elements' parents.
     * @return {Seht} A new Seht object
     */
    parent() {
      return this.map(element => element.parentNode);
    }

    /**
     * Method for prepending HTML content to elements.
     * @param {String} html HTML content to insert
     * @return {Seht} The original Seht object
     */
    prepend(html) {
      return DOM.insertAdjacentHTML(this, 'afterbegin', html);
    }

    /**
     * Method for prepending a Seht object to a selector.
     * @param {*} selector Selector for elements to prepend to
     * @param {*=} context Context of elements
     * @return {Seht} A new Seht object
     */
    prependTo(selector, context) {
      return (new Seht(selector, context)).prepend(this);
    }

    /**
     * Method for removing elements from its context;
     * returns their parents in a new Seht object.
     * @return {Seht} A new Seht object
     */
    remove() {
      return this.each((element) => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
    }

    /**
     * Method for removing class names from elements.
     * @param {...String} classNames Comma separated strings representing class names
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
     * @param {String=} value String to insert
     * @return {Seht|String} The original Seht object or the first element's text content
     */
    text(value) {
      // Set text content with value
      if (value != null) {
        // Cast parameter to a string value if needed
        const text = typeof value === 'string' ? value : `${value}`;

        return Utils.each(this, (element) => {
          const el = element;

          el.textContent = text;
        });
      }

      // Return text content of first element if possible
      if (this.length > 0) {
        return this[0].textContent;
      }

      // No value to set or retrieve; return nothing
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
     * @param {...String} classNames Comma separated strings representing class names
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
      return Utils.map(this, element => element.outerHTML).join();
    }

    /**
     * Method for triggering events for
     * each element in the Seht object.
     * @param {...String} events Comma separated strings representing event types
     * @return {Seht} The original Seht object
     */
    trigger(...events) {
      return Utils.each(this, (element) => {
        Events.trigger(element, events);
      });
    }

    /**
     * Method for retrieving or setting the value for an element.
     * @param {String=} value Value to insert
     * @return {Seht} The original Seht object or the first element's value
     */
    value(value) {
      // Set value property with value
      if (value != null) {
        // Cast parameter to a string value if needed
        const val = typeof value === 'string' ? value : `${value}`;

        return Utils.each(this, (element) => {
          const el = element;

          el.value = val;
        });
      }

      // Return value of first element if possible
      if (this.length > 0) {
        return this[0].value;
      }

      // No value to set or retrieve; return nothing
      return null;
    }
  }

  /**
   * Method for creating a new instance of Seht.
   * @param {*=} selector Selector for elements
   * @param {*=} context Context of elements
   * @returns {Seht} A new Seht object
   */
  const seht = (selector, context) => {
    if (selector instanceof Seht) {
      return selector;
    }

    return new Seht(selector, context);
  };

  // Expose the prototype for extensions and custom methods
  seht.fn = Seht.prototype;
  seht.prototype = Seht.prototype;

  // Expose useful event and utility methods for outside use
  seht.each = Utils.each;
  seht.map = Utils.map;
  seht.ready = Events.ready;
  seht.toArray = Utils.toArray;
  seht.unique = Utils.unique;

  // Export Seht's class, both for advanced usage and testing
  win.Seht = Seht;

  // Export a jQuery-like method when possible
  if (win.$ == null) {
    win.$ = seht;
  }

  return seht;

}());
