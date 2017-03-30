(function(name, context, definition){
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = definition();
  } else if (typeof define === 'function' && define.amd) {
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
  undefinedString = 'undefined',
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
    if (selector === null || typeof selector === undefinedString) {
      // Nothing to search for, so let's return an empty array

      return [];
    } else if (selector.nodeType || selector === selector.window) {
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

    if (typeof string !== 'string') {
      return string;
    }

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
   * @param {*=} selector - Query to search for
   * @param {Element=} context - Item in which we look for 'selector'
   * @return {Seht} An old or new Seht object
   */
  function seht(selector, context) {
    if (selector instanceof Seht) {
      // The selector is a Seht object, so let's return it as-is

      return selector;
    }

    // Call the constructor for Seht
    return new Seht(selector || null, context || doc);
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
    length: 0,

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
     * Insert HTML after elements.
     *
     * @param {String} string - HTML to insert
     * @return {Seht} The original object
     */
    after: function (string) {
      var
      html,
      next;

      // Turn the string into actual HTML
      html = htmlify(string);

      return each(this, function (element) {
        // Define where to insert the HTML
        next = element.nextSibling;

        each(html, function (item) {
          element.parentNode.insertBefore(item.cloneNode(true), next);
        });
      });
    },

    /**
     * Append HTML to elements.
     *
     * @param {String} string - HTML to append
     * @return {Seht} The original object
     */
    append: function (string) {
      var
      html;

      // Turn the string into actual HTML
      html = htmlify(string);

      return each(this, function (element) {
        each(html, function (item) {
          element.appendChild(item.cloneNode(true));
        })
      });
    },

    /**
     * Append a Seht object to a selector.
     *
     * @param {*} selector - Query to search for
     * @return {Seht} The new object
     */
    appendTo: function (selector) {
      return seht(selector).append(this);
    },

    /**
     * Get or set attributes for elements.
     *
     * @param {String} name - Name of attribute
     * @param {String=} value - New value for attribute
     * @return {Seht|String} The original object or value of attribute
     */
    attr: function (name, value) {
      if (typeof name !== undefinedString && typeof value !== undefinedString) {
        return each(this, function (element) {
          element.setAttribute(name, value);
        });
      } else if (this.length > 0) {
        return this[0].getAttribute(name);
      }

      return null;
    },

    /**
     * Insert HTML before elements.
     *
     * @param {String} string - HTML to insert
     * @return {Seht} The original object
     */
    before: function (string) {
      var
      html;

      // Turn the string into actual HTML
      html = htmlify(string);

      return each(this, function (element) {
        each(html, function (item) {
          element.parentNode.insertBefore(item.cloneNode(true), element);
        });
      });
    },

    /**
     * Get or set data-attributes for elements.
     *
     * @param {String} name - Name of attribute
     * @param {String=} value - New value for attribute
     * @return {Seht|String} The original object or value of attribute
     */
    data: function (name, value) {
      // Define a proper data name
      name = typeof name === undefinedString ? null : 'data-' + name;

      if (name && typeof value !== undefinedString) {
        // Convert a JS object to a JSON string
        value = JSON.stringify(value);

        return each(this, function (element) {
          element.setAttribute(name, value);
        });
      } else if (this.length > 0) {
        value = this[0].getAttribute(name);

        // Return a parsed JSON string
        return JSON.parse(value);
      }

      return null;
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
     * Create a Seht object containing only
     * the element at a specific position.
     *
     * @param {Number} index - Index for element
     * @return {Seht|Null} The new object or null
     */
    eq: function (index) {
      return seht(index >= 0 && index < this.length ? this[index] : null);
    },

    /**
     * Create a Seht object containing only the first element.
     *
     * @return {Seht|Null} The new object or null
     */
    first: function () {
      return this.eq(0);
    },

    /**
     * Get an actual element in the Seht object
     * from a specific position.
     */
    get: function (index) {
      if (index >= 0 && index < this.length) {
        return this[index];
      }

      return null;
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
     * @param {String=} string - new HTML for elements
     * @return {Seht} The original object
     */
    html: function (string) {
      if (typeof string !== undefinedString) {
        if (string instanceof Seht) {
          // The supplied string is actually Seht
          // object, so let's flatten it.

          string = this.toString();
        }

        return each(this, function (element) {
          element.innerHTML = string;
        });
      } else if (this.length > 0) {
        return this[0].innerHTML;
      }

      return null;
    },

    /**
     * Create a Seht object containing only the last element.
     *
     * @return {Seht|Null} The new object or null
     */
    last: function () {
      return this.eq(this.length - 1);
    },

    /**
     * Prepend HTML to elements.
     *
     * @param {String} string - HTML to prepend
     * @return {Seht} The original object
     */
    prepend: function (string) {
      var
      first,
      html;

      // Turn the string into actual HTML
      html = htmlify(string);

      return each(this, function (element) {
        // Define where to insert the HTML
        first = element.firstChild;

        each(html, function (item) {
          element.insertBefore(item.cloneNode(true), first);
        });
      });
    },

    /**
     * Prepend a Seht object to a selector.
     *
     * @param {*} selector - Query to search for
     * @return {Seht} The new object
     */
    prependTo: function (selector) {
      return seht(selector).prepend(this);
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
     * @param {String=} string - New text for elements
     * @return {Seht} The original object
     */
    text: function (string) {
      if (typeof string !== undefinedString) {
        return each(this, function (element) {
          element.textContent = string;
        });
      } else if (this.length > 0) {
        return this[0].textContent;
      }

      return null;
    },

    /**
     * Toggle class names for elements.
     *
     * @param {...String} Class names
     * @return {Seht} The original object
     */
    toggleClass: function () {
      return each(this, Classes.toggle, arguments);
    },

    /**
     * Convert the Seht object to a regular array.
     *
     * @return {Array} Array of elements
     */
    toArray: function () {
      return arrayProto.slice.call(this);
    },

    /**
     * Flatten the Seht object and combine
     * all elements' HTML.
     *
     * @return {String} The combined HTML
     */
    toString: function () {
      var
      string;

      string = '';

      each(this, function (element) {
        string += element.innerHTML;
      });

      return string;
    },

    /**
     * Set the value for an element.
     *
     * @param {String=} value - New value for elements
     * @return {Seht} The original object
     */
    value: function (value) {
      if (typeof value !== undefinedString) {
        return each(this, function (element) {
          element.value = value;
        });
      } else if (this.length > 0) {
        return this[0].value;
      }

      return null;
    }
  };

  seht.each = each;
  seht.ready = Events.ready;

  return seht;
});