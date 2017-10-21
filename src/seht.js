(function (name, context, definition) {
  // window.seht
  context[name] = definition();

  // and window.$
  if (typeof context.$ === "undefined") {
    context.$ = context[name];
  }
})("seht", this, function () {
  const
  win             = window,
  doc             = win.document,
  objectProto     = Object.prototype,
  arrayProto      = Array.prototype,
  undefinedString = "undefined",
  Regex = {
    HTML: /^\s*<([^\s>]+)/,
    ID: /^#[\w-]+$/
  },
  Events = {
    /**
     * Event handler for when the document is ready.
     *
     * @param {Function} handler - Function to call when ready
     */
    ready (handler) {
      doc.addEventListener("DOMContentLoaded", handler);
    },

    /**
     * Trigger events for an element or object.
     */
    trigger (element, types) {
      let
      event;

      each(types, function (type) {
        event = doc.createEvent("CustomEvent");

        event.initEvent(type, true, true);

        element.dispatchEvent(event);
      });
    }
  };

  /**
   * Functions.
   */

  /**
   * Call a function for each value in an array or object.
   *
   * @param {Array|Object} obj - An array or object
   * @param {Function} handler - Function to call for each value
   * @param {*} scope - Variable to access as "this" in handler-function
   * @return {Array|Object} The original array or object
   */
  function each (obj, handler, scope) {
    let
    property;

    if (isFinite(obj.length)) {
      // The object looks like an array

      arrayProto.forEach.call(obj, function (value, index) {
        handler.call(scope || value, value, index, obj);
      });
    } else {
      // The object is presumed to be a regular object

      for (property in obj) {
        if (objectProto.hasOwnProperty.call(obj, property)) {
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
  function find (selector, context) {
    if (selector === null || typeof selector === undefinedString) {
      // Nothing to search for, so let's return an empty array

      return [];
    } else if (selector.nodeType || selector === selector.window) {
      // The selector is an element or "window"

      return [selector];
    } else if (typeof selector === "object" && isFinite(selector.length)) {
      // The selector is an array

      return selector;
    } else if (typeof selector === "string") {
      // The selector is a search query, so let's "query" it

      return query(selector, context);
    }

    // Nothing to search for, so let's return an empty array
    return [];
  }

  /**
   * Create HTML elements from a string.
   */
  function htmlify (string) {
    if (typeof string !== "string") {
      return string;
    }

    // Create a new HTML document,
    const html = doc.implementation.createHTMLDocument();

    // and set its content to the value of the supplied string
    html.body.innerHTML = string;

    // Return the bodys child elements
    return html.body.children;
  }

  /**
   * Create a new array based on result from
   * a function called on old values.
   */
  function map (obj, handler, scope) {
    return arrayProto.map.call(obj, function (value, index) {
      return handler.call(scope || value, value, index);
    });
  }

  /**
   * Search for, or create HTML elements.
   */
  function query (selector, context) {
    if (Regex.ID.test(selector)) {
      // The string matches the regex for an ID-search

      return [context.getElementById(selector.slice(1))];
    } else if (Regex.HTML.test(selector)) {
      // The string matches the regex for HTML, so let's "htmlify" it

      return htmlify(selector);
    }

    // Default selector search
    return context.querySelectorAll(selector);
  }

  /**
   * Convert an array-like object to a proper array.
   */
  function toArray (obj) {
    return arrayProto.slice.call(obj);
  }

  /**
   * Remove duplicate values in an array.
   */
  function unique (array) {
    return arrayProto.filter.call(array, function (value, index, self) {
      return arrayProto.indexOf.call(self, value) === index;
    });
  }

  /**
   * Seht.
   */

  /**
   * Function to call Sehts constructor.
   *
   * @param {*=} selector - Query to search for
   * @param {Element=} context - Item in which we look for "selector"
   * @return {Seht} An old or new Seht object
   */
  function seht (selector, context) {
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
   * @param {Element} context - Item in which we search for "selector"
   */
  function Seht (selector, context) {
    let
    elements;

    // Find elements
    elements = find(selector, context);

    // Remove duplicate elements
    elements = unique(elements);

    // Set length for the current object
    this.length = elements.length;

    // Add each element to the current object
    each(elements, function (element, index) {
      this[index] = element;
    }, this);
  }

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
    addClass () {
      const args = arguments;

      return each(this, function (element) {
        each(args, function (name) {
          element.classList.add(name);
        });
      });
    },

    /**
     * Insert HTML after elements.
     *
     * @param {String} string - HTML to insert
     * @return {Seht} The original object
     */
    after (string) {
      return each(this, function (element) {
        element.insertAdjacentHTML("afterend", string);
      });
    },

    /**
     * Append HTML to elements.
     *
     * @param {String} string - HTML to append
     * @return {Seht} The original object
     */
    append (string) {
      // Turn the string into actual HTML
      const html = htmlify(string);

      return each(this, function (element) {
        each(html, function (item) {
          element.appendChild(item.cloneNode(true));
        });
      });
    },

    /**
     * Append a Seht object to a selector.
     *
     * @param {*} selector - Query to search for
     * @return {Seht} The new object
     */
    appendTo (selector) {
      return seht(selector).append(this);
    },

    /**
     * Get or set attributes for elements.
     *
     * @param {String} name - Name of attribute
     * @param {String=} value - New value for attribute
     * @return {Seht|String} The original object or value of attribute
     */
    attr (name, value) {
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
    before (string) {
      return each(this, function (element) {
        element.insertAdjacentHTML("beforebegin", string);
      });
    },

    /**
     * Get or set data-attributes for elements.
     *
     * @param {String} name - Name of attribute
     * @param {String=} value - New value for attribute
     * @return {Seht|String} The original object or value of attribute
     */
    data (name, value) {
      // Define a proper data name
      name = typeof name === undefinedString ? null : "data-" + name;

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
     * @param {Function} handler - Handler to call on each element
     * @return {Seht} The original object
     */
    each (handler) {
      return each(this, handler);
    },

    /**
     * Empty an elements contents.
     *
     * @return {Seht} The original object
     */
    empty () {
      return each(this, function (element) {
        element.innerHTML = "";
      });
    },

    /**
     * Create a Seht object containing only
     * the element at a specific position.
     *
     * @param {Number} index - Index for element
     * @return {Seht|Null} The new object or null
     */
    eq (index) {
      return seht(index >= 0 && index < this.length ? this[index] : null);
    },

    /**
     * Create a Seht object containing only the first element.
     *
     * @return {Seht|Null} The new object or null
     */
    first () {
      return this.eq(0);
    },

    /**
     * Verify if an element has a specific class name.
     *
     * @param {String} string - Class name to verify
     * @return {Boolean}
     */
    hasClass (string) {
      return this[0].classList.contains(string);
    },

    /**
     * Get or set the HTML for elements.
     *
     * @param {String=} string - new HTML for elements
     * @return {Seht} The original object
     */
    html (string) {
      if (typeof string !== undefinedString) {
        if (string instanceof Seht) {
          // The supplied string is actually a
          // Seht object, so let's flatten it.

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
    last () {
      return this.eq(this.length - 1);
    },

    /**
     * Create a new Seht object based on result from
     * handlers called on old elements.
     *
     * @param {Function} handler - Handler to call on each element
     * @return {Seht} The new object
     */
    map (handler) {
      return seht(map(this, handler));
    },

    /**
     * Remove an event handler from element(s).
     *
     * @param {...String} Event type
     * @param {Function} Function to remove for event
     * @return {Seht} The original object
     */
    off (type, fn) {
      return each(this, function (element) {
        element.removeEventListener(type, fn);
      });
    },

    /**
     * Add an event handler to one or more element.
     *
     * @param {String} Event type
     * @param {Function} Function to call for event
     * @return {Seht} The original object
     */
    on (type, fn) {
      return each(this, function (element) {
        element.addEventListener(type, fn);
      });
    },

    /**
     * Create a Seht object based on elements' parents.
     *
     * @return {Seht} The new object
     */
    parent () {
      return seht(map(this, function (element) {
        return element.parentNode;
      }));
    },

    /**
     * Prepend HTML to elements.
     *
     * @param {String} string - HTML to prepend
     * @return {Seht} The original object
     */
    prepend (string) {
      let
      first;

      // Turn the string into actual HTML
      const html = htmlify(string);

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
    prependTo (selector) {
      return seht(selector).prepend(this);
    },

    /**
     * Remove elements from its context;
     * returns their parents in a new Seht object.
     *
     * @return {Seht} The new object
     */
    remove () {
      const parents = this.parent();

      each(this, function (element) {
        element.parentNode.removeChild(element);
      });

      return parents;
    },

    /**
     * Remove class names from elements.
     *
     * @param {...String} Class names
     * @return {Seht} The original object
     */
    removeClass () {
      const args = arguments;

      return each(this, function (element) {
        each(args, function (name) {
          element.classList.remove(name);
        });
      });
    },

    /**
     * Get or set the text for elements.
     *
     * @param {String=} string - New text for elements
     * @return {Seht} The original object
     */
    text (string) {
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
     * Convert the Seht object to a regular array.
     *
     * @return {Array} Array of elements
     */
    toArray () {
      return toArray(this);
    },

    /**
     * Toggle class names for elements.
     *
     * @param {...String} Class names
     * @return {Seht} The original object
     */
    toggleClass () {
      const args = arguments;

      return each(this, function (element) {
        each(args, function (name) {
          element.classList.toggle(name);
        });
      });
    },

    /**
     * Flatten the Seht object and combine
     * all elements' HTML.
     *
     * @return {String} The combined HTML
     */
    toString () {
      let
      string = "";

      each(this, function (element) {
        string += element.outerHTML;
      });

      return string;
    },

    /**
     * Trigger one or more events for
     * each element in the Seht object.
     *
     * @param {...String} Event types
     * @return {Seht} The original object
     */
    trigger () {
      // Allow for multiple event types
      const args = arguments;

      return each(this, function (element) {
        Events.trigger(element, args);
      });
    },

    /**
     * Get or set the value for an element.
     *
     * @param {String=} value - New value for elements
     * @return {Seht} The original object
     */
    value (value) {
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

  /**
   * Useful functions to access outside of Seht's core.
   */

  seht.each    = each;
  seht.map     = map;
  seht.ready   = Events.ready;
  seht.toArray = toArray;
  seht.unique  = unique;

  /**
   * Expose the prototype for easy extension.
   */

  seht.fn = Seht.prototype;

  /**
   * Return Seht to the global scope, loaders, etc.
   */

  return seht;
});