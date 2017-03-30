(function(name, context, definition){
  if (typeof module !== "undefined" && module.exports) {
    module.exports = definition();
  } else if (typeof define === "function" && define.amd) {
    define(definition);
  } else {
    context[name] = definition();

    if (typeof context['$'] === 'undefined') {
      context['$'] = definition();
    }
  }
})('seht', this, function () {
  var
  win = window,
  doc = win.document,
  arrayProto = Array.prototype,
  Regex = {
    HTML: /^\s*<([^\s>]+)/,
    ID: /^\#[\w\-]+$/,
    Ready: /(complete|interactive|loaded)/
  },
  Classes,
  Events,
  Seht;

  /**
   * Functions.
   */

  /**
   * Call a handler for each item in an array or object.
   *
   * @param {Array|Object} obj - An array or object
   * @param {Function} handler - Function to run for each item
   * @param {*} scope - Variable to access as 'this' in handler-function
   * @return {Array|Object} The iterated array or object
   */
  function each(obj, handler, scope) {
    var
    property;

    if (isFinite(obj.length)) {
      // The object looks like an array

      arrayProto.forEach.call(obj, function (item, index) {
        handler.call(scope || item, item, index, obj);
      });
    } else {
      // The object is presumed to be a regular object

      for (property in obj) {
        if (obj.hasOwnProperty(property)) {
          handler.call(scope || obj[property], obj[property], property, obj);
        }
      }
    }

    // Return the object for future use
    return obj;
  }

  /**
   * Find elements based on variables.
   */
  function find(selector, context) {
    if (selector.nodeType || selector === selector.window) {
      // The selector is an element or 'window'

      return [selector];
    } else if (typeof selector === 'object' && isFinite(selector.length)) {
      // The selector is an array

      return selector;
    } else if (typeof selector === 'string') {
      // The selector is a search query, so let's 'query' it

      return query(selector, context);
    }

    // Nothing to search for, so let's return an empty array
    return [];
  }

  /**
   * Create HTML elements from a string.
   */
  function htmlify(string) {
    var
    html;

    // Create a new HTML document,
    html = doc.implementation.createHTMLDocument();
    // and set its content to the value of the supplied string
    html.body.innerHTML = string;

    // Return the bodys child elements
    return html.body.children;
  }

  /**
   * Search for elements or create HTML elements.
   */
  function query(selector, context) {
    if (Regex.ID.test(selector)) {
      // The string matches the regex for an ID-search

      return [context.getElementById(selector.slice(1))]
    } else if (Regex.HTML.test(selector)) {
      // The string matches the regex for HTML, so let's 'htmlify' it

      return htmlify(selector);
    }

    // Default …
    return context.querySelectorAll(selector);
  }

  /**
   * Trim and clean a string.
   */
  function trim(string) {
    return string.trim().replace(/\s+/g, ' ');
  }

  /**
   * Objects.
   */

  /**
   * Object for handling element classes.
   */
  Classes = {

    /**
     * Add class names to an element.
     *
     * @this {Array} Array of class names
     * @param {Element} element - Element to modify
     */
    add: function (element) {
      each(this, function (name) {
        if (Classes.contains(element, name) === false) {
          Classes.addClass(element, name);
        }
      });

      element.className = trim(element.className);
    },

    /**
     * Add a single class name to an element.
     */
    addClass: function (element, name) {
      element.className += ' ' + name;
    },

    /**
     * Verify if an element has a specific class name.
     */
    contains: function (element, string) {
      return Classes.regExp(string).test(element.className);
    },

    /**
     * Create the regular expression for a class name.
     */
    regExp: function (string) {
      return new RegExp('(^|\\s+)' + string + '(\\s+|$)');
    },

    /**
     * Remove class names from an element.
     *
     * @this {Array} Array of class names
     * @param {Element} element - Element to modify
     */
    remove: function (element, names) {
      each(this, function (name) {
        if (Classes.contains(element, name)) {
          Classes.removeClass(element, name);
        }
      });

      element.className = trim(element.className);
    },

    /**
     * Remove a single class name from an element.
     */
    removeClass: function (element, name) {
      element.className = element.className.replace(Classes.regExp(name), '');
    },

    /**
     * Toggle classes for an element.
     *
     * @this {Array} Array of class names
     * @param {Element} element - Element to modify
     */
    toggle: function (element) {
      each(this, function (name) {
        if (Classes.contains(element, name)) {
          Classes.removeClass(element, name);
        } else {
          Classes.addClass(element, name);
        }
      });

      element.className = trim(element.className);
    }
  };

  /**
   * Object for handling events.
   */
  Events = {

    /**
     * Event handler for when the document is ready.
     *
     * @param {Function} handler - Handler to call when ready
     */
    ready: function (handler) {
      if (Regex.Ready.test(doc.readyState)) {
        // Old-school ready-event

        handler.call(doc);
      } else {
        // Modern ready-event

        doc.addEventListener('DOMContentLoaded', handler);
      }
    }
  };

  /**
   * Seht.
   */

  /**
   * Function to call Sehts constructor.
   *
   * @param {*} selector - Query to search for
   * @param {Element=} context - Item in which we look for 'selector'
   * @return {Seht} An old or new Seht object
   */
  function seht(selector, context) {
    if (selector instanceof Seht) {
      // The selector is a Seht object, so let's return it as-is

      return selector;
    }

    // Call the constructor for Seht
    return new Seht(selector, context || doc);
  }

  /**
   * Initiates a Seht object.
   *
   * @constructor
   * @param {*} selector - Query to search for
   * @param {Element} context - Item in which we search for 'selector'
   */
  Seht = function (selector, context) {
    var
    elements;

    // Find elements
    elements = find(selector, context);

    // Set length for the current object
    this.length = elements.length;

    // Add each element to the current object
    each(elements, function (element, index) {
      this[index] = element;
    }, this);
  };

  /**
   * Prototypal methods or properties for Seht.
   */
  Seht.prototype = {

    /**
     * Default length for a Seht object.
     */
    length: null,

    /**
     * Add class names to elements.
     *
     * @param {...String} Class names
     * @return {Seht} The original object
     */
    addClass: function() {
      return each(this, Classes.add, arguments);
    },

    /**
     * Call a handler for each element in the Seht object.
     *
     * @param {Function} handler
     * @return {Seht} The original object
     */
    each: function (handler) {
      return each(this, handler);
    },

    /**
     * Verify if an element has a specific class name.
     *
     * @param {String} string - Class name to verify
     * @return {Boolean}
     */
    hasClass: function (string) {
      return Classes.contains(this[0], string);
    },

    /**
     * Get or set the HTML for elements.
     *
     * @param {String=} string
     * @return {Seht} The original object
     */
    html: function (string) {
      if (typeof string !== 'undefined') {
        return each(this, function (element) {
          element.innerHTML = string;
        });
      }

      return this[0].innerHTML;
    },

    /**
     * Remove class names from elements.
     *
     * @param {...String} Class names
     * @return {Seht} The original object
     */
    removeClass: function () {
      return each(this, Classes.remove, arguments);
    },

    /**
     * Get or set the text for elements.
     *
     * @param {String=} string
     * @return {Seht} The original object
     */
    text: function (string) {
      if (typeof string !== 'undefined') {
        return each(this, function (element) {
          element.textContent = string;
        });
      }

      return this[0].textContent;
    },

    /**
     * Toggle class names for elements.
     *
     * @param {...String} Class names
     * @return {Seht} The original object
     */
    toggleClass: function () {
      return each(this, Classes.toggle, arguments);
    }
  };

  seht.each = each;
  seht.ready = Events.ready;

  return seht;
});