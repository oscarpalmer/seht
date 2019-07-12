const win = window;
const doc = win.document;
const arrayPrototype = Array.prototype;

const Regex = {
  html: /^\s*<([^\s>]+)/,
  id: /^#[\w-]+$/,
};

const Events = {
  /**
   * Event handler for when the document is ready.
   * @param  {Function} handler - Function to call when ready
   */
  ready: (handler) => {
    doc.addEventListener('DOMContentLoaded', handler);
  },

  /**
   * Trigger events for an element or object.
   */
  trigger: (element, types) => {
    let event;

    each(types, (type) => {
      event = doc.createEvent('CustomEvent');

      event.initEvent(type, true, true);

      element.dispatchEvent(event);
    });
  },
};

/**
 * Define the context for a selector query.
 */
function defineContext(context) {
  if (typeof context === 'undefined') {
    // No context; defaults to document
    return doc;
  }

  if (context instanceof Seht || context.nodeType) {
    // A Seht object or a regular element
    return context;
  }

  if (typeof context === 'string') {
    // Context is also a selector
    return query(context, doc);
  }

  if (win.isFinite(context.length)) {
    // Context is an array or array-like object
    return context;
  }

  // Bad context; defaults to document
  return doc;
}

/**
 * Call a function for each value in an array or object.
 * @param  {Array|Object} obj     - An array or object
 * @param  {Function}     handler - Function to call for each value
 * @param  {*}            scope   - Variable to access as 'this' in handler
 * @return {Array|Object} The original array or object
 */
function each(obj, handler, scope) {
  if (win.isFinite(obj.length)) {
    // The object looks like an array
    arrayPrototype.forEach.call(obj, (value, index) => {
      handler.call(scope || value, value, index, obj);
    });
  } else {
    // The object is presumed to be a regular object
    arrayPrototype.forEach.call(Object.keys(obj), (key) => {
      handler.call(scope || obj[key], obj[key], key, obj);
    });
  }

  // Return the object for future use
  return obj;
}

/**
 * Find elements based on variables.
 */
function find(selector, context) {
  if (selector === null || typeof selector === 'undefined') {
    // Nothing to search for, so let's return an empty array
    return [];
  }

  if (selector.nodeType || selector === selector.window) {
    // The selector is an element or 'window'
    return [selector];
  }

  if (typeof selector === 'object' && win.isFinite(selector.length)) {
    // The selector is an array
    return selector;
  }

  if (typeof selector === 'string') {
    // The selector is a search query, so let's search for it
    return query(selector, context);
  }

  // Nothing to search for, so let's return an empty array
  return [];
}

/**
 * Create HTML elements from a string.
 */
function htmlify(string) {
  if (typeof string !== 'string') {
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
 * Insert HTML relative to elements' position
 */
function insertAdjacentHTML(elements, position, html) {
  if (html instanceof Seht) {
    // The supplied string is actually a
    // Seht object, so let's flatten it.
    html = html.toString();
  }

  return elements.each((element) => {
    element.insertAdjacentHTML(position, html);
  });
}

/**
 * Create a new array based on result from
 * a function called on old values.
 * @param  {Array|Object} obj     - An array or object
 * @param  {Function}     handler - Function to call for each value
 * @param  {*}            scope   - Variable to access as 'this' in handler
 * @return {Array}        A new array based on old values and handler-results
 */
function map(obj, handler, scope) {
  return arrayPrototype.map.call(obj, (v, i) => handler.call(scope || v, v, i));
}

/**
 * Search for, or create HTML elements.
 */
function query(selector, context) {
  // Define a context for the query
  context = defineContext(context);

  if (win.isFinite(context.length)) {
    // Multiple contexts, so let's search them all
    let returnable = [];

    each(context, (ctx) => {
      // Search each context and concatenate
      // the result to a new array
      returnable = returnable.concat(toArray(query(selector, ctx)));
    });

    return returnable;
  }

  if (Regex.id.test(selector)) {
    // The string matches the regex for an ID-search
    return [context.getElementById(selector.slice(1))];
  }

  if (Regex.html.test(selector)) {
    // The string matches the regex for HTML, so let's 'htmlify' it
    return htmlify(selector);
  }

  // Default selector search
  return context.querySelectorAll(selector);
}

/**
 * Convert an array-like object to a proper array.
 * @param  {Array|Object} obj - An array or object
 * @return {Array}        A new clean array based on the old one
 */
function toArray(obj) {
  return arrayPrototype.slice.call(obj);
}

/**
 * Remove duplicate values in an array or array-like object.
 * @param  {Array|Object} obj - An array or object
 * @return {Array}        A duplicate-free array based on the old one
 */
function unique(obj) {
  if (obj.length <= 1) {
    // It should already be unique, right
    return toArray(obj);
  }

  return arrayPrototype.filter.call(obj, (v, i, s) => arrayPrototype.indexOf.call(s, v) === i);
}

/**
 * Publicly accessible function to call Sehts constructor.
 * @param  {*=}       selector - Query to search for
 * @param  {Element=} context  - Item in which we look for 'selector'
 * @return {Seht}     An old or new Seht object
 */
function seht(selector, context) {
  if (selector instanceof Seht) {
    // The selector is a Seht object, so let's return it as-is
    return selector;
  }

  // Call the constructor for Seht
  return new Seht(selector, context);
}

/**
 * Constructor for Seht.
 * @constructor
 * @param  {*}       selector - Query to search for
 * @param  {Element} context  - Item in which we search for 'selector'
 * @return {Seht}    A new Seht object
 */
function Seht(selector, context) {
  let elements;

  // Find elements
  elements = find(selector, context);

  // Remove duplicate elements
  elements = unique(elements);

  // Set length for the current object
  this.length = elements.length;

  each(elements, (element, index) => {
    // Add each element to the current object
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
   * @param  {...String} args - Class names
   * @return {Seht}      The original object
   */
  addClass(...args) {
    return each(this, (element) => {
      each(args, (name) => {
        element.classList.add(name);
      });
    });
  },

  /**
   * Insert HTML after elements.
   * @param  {String} html - HTML to insert
   * @return {Seht}   The original object
   */
  after(html) {
    return insertAdjacentHTML(this, 'afterend', html);
  },

  /**
   * Append HTML to elements.
   * @param  {String} html - HTML to append
   * @return {Seht}   The original object
   */
  append(html) {
    return insertAdjacentHTML(this, 'beforeend', html);
  },

  /**
   * Append a Seht object to a selector.
   * @param  {*}    selector - Query to search for
   * @return {Seht} The new object
   */
  appendTo(selector) {
    return seht(selector).append(this);
  },

  /**
   * Get or set attributes for elements.
   * @param  {String}      name  - Name of attribute
   * @param  {String=}     value - New value for attribute
   * @return {Seht|String} The original object or value of attribute
   */
  attr(name, value) {
    if (typeof name !== 'undefined' && typeof value !== 'undefined') {
      return each(this, (element) => {
        element.setAttribute(name, value);
      });
    }

    if (this.length > 0) {
      return this[0].getAttribute(name);
    }

    return null;
  },

  /**
   * Insert HTML before elements.
   * @param  {String} html - HTML to insert
   * @return {Seht}   The original object
   */
  before(html) {
    return insertAdjacentHTML(this, 'beforebegin', html);
  },

  /**
   * Get or set data-attributes for elements.
   * @param  {String}      name  - Name of attribute
   * @param  {String=}     value - New value for attribute
   * @return {Seht|String} The original object or value of attribute
   */
  data(name, value) {
    // Define a proper data name
    name = typeof name === 'undefined' ? null : `data-${name}`;

    if (name && typeof value !== 'undefined') {
      // Convert a JS object to a JSON string
      value = JSON.stringify(value);

      return each(this, (element) => {
        element.setAttribute(name, value);
      });
    }

    if (this.length > 0) {
      // Return a parsed JSON string
      return JSON.parse(this[0].getAttribute(name));
    }

    return null;
  },

  /**
   * Call a handler for each element in the Seht object.
   * @param  {Function} handler - Handler to call on each element
   * @return {Seht}     The original object
   */
  each(handler) {
    return each(this, handler);
  },

  /**
   * Empty an elements contents.
   * @return {Seht} The original object
   */
  empty() {
    return each(this, (element) => {
      element.innerHTML = '';
    });
  },

  /**
   * Create a Seht object containing only
   * the element at a specific position.
   * @param  {Number}    index - Index for element
   * @return {Seht|Null} The new object or null
   */
  eq(index) {
    return seht(index >= 0 && index < this.length ? this[index] : null);
  },

  /**
   * Create a Seht object containing only the first element.
   * @return {Seht|Null} The new object or null
   */
  first() {
    return this.eq(0);
  },

  /**
   * Verify if an element has a specific class name.
   * @param  {String}  string - Class name to verify
   * @return {Boolean}
   */
  hasClass(string) {
    return this[0].classList.contains(string);
  },

  /**
   * Get or set the HTML for elements.
   * @param  {String=} string - Optional new HTML for elements
   * @return {Seht}    The original object or element's HTML
   */
  html(string) {
    if (typeof string !== 'undefined') {
      if (string instanceof Seht) {
        // The supplied string is actually a
        // Seht object, so let's flatten it.
        string = this.toString();
      }

      return each(this, (element) => {
        element.innerHTML = string;
      });
    }

    if (this.length > 0) {
      return this[0].innerHTML;
    }

    return null;
  },

  /**
   * Create a Seht object containing only the last element.
   * @return {Seht|Null} The new object or null
   */
  last() {
    return this.eq(this.length - 1);
  },

  /**
   * Create a new Seht object based on result from
   * handlers called on old elements.
   * @param  {Function} handler - Handler to call on each element
   * @return {Seht}     The new object
   */
  map(handler) {
    return seht(map(this, handler));
  },

  /**
   * Remove an event handler from element(s).
   * @param  {String}   type    - Event type
   * @param  {Function} handler - Function to remove for event
   * @return {Seht}     The original object
   */
  off(type, handler) {
    return each(this, (element) => {
      element.removeEventListener(type, handler);
    });
  },

  /**
   * Add an event handler to one or more element.
   * @param  {String}   type    - Event type
   * @param  {Function} handler - Function to call for event
   * @return {Seht}     The original object
   */
  on(type, handler) {
    return each(this, (element) => {
      element.addEventListener(type, handler);
    });
  },

  /**
   * Create a Seht object based on elements' parents.
   * @return {Seht} The new object
   */
  parent() {
    return seht(map(this, element => element.parentNode));
  },

  /**
   * Prepend HTML to elements.
   * @param  {String} html - HTML to prepend
   * @return {Seht}   The original object
   */
  prepend(html) {
    return insertAdjacentHTML(this, 'afterbegin', html);
  },

  /**
   * Prepend a Seht object to a selector.
   * @param  {*}    selector - Query to search for
   * @return {Seht} The new object
   */
  prependTo(selector) {
    return seht(selector).prepend(this);
  },

  /**
   * Remove elements from its context;
   * returns their parents in a new Seht object.
   * @return {Seht} The new object
   */
  remove() {
    const parents = this.parent();

    each(this, (element) => {
      element.parentNode.removeChild(element);
    });

    return parents;
  },

  /**
   * Remove class names from elements.
   * @param  {...String} Class names
   * @return {Seht}      The original object
   */
  removeClass(...args) {
    return each(this, (element) => {
      each(args, (name) => {
        element.classList.remove(name);
      });
    });
  },

  /**
   * Get or set the text for elements.
   * @param  {String=}     string - Optional new text for elements
   * @return {Seht|String} The original object or element's text
   */
  text(string) {
    if (typeof string !== 'undefined') {
      return each(this, (element) => {
        element.textContent = string;
      });
    }

    if (this.length > 0) {
      return this[0].textContent;
    }

    return null;
  },

  /**
   * Convert the Seht object to a regular array.
   * @return {Array} Array of elements
   */
  toArray() {
    return toArray(this);
  },

  /**
   * Toggle class names for elements.
   * @param  {...String} Class names
   * @return {Seht}      The original object
   */
  toggleClass(...args) {
    return each(this, (element) => {
      each(args, (name) => {
        element.classList.toggle(name);
      });
    });
  },

  /**
   * Flatten the Seht object and combine
   * all elements' HTML.
   * @return {String} The combined HTML
   */
  toString() {
    let string = '';

    each(this, (element) => {
      string += element.outerHTML;
    });

    return string;
  },

  /**
   * Trigger one or more events for
   * each element in the Seht object.
   * @param  {...String} Event types
   * @return {Seht}      The original object
   */
  trigger(...args) {
    return each(this, (element) => {
      Events.trigger(element, args);
    });
  },

  /**
   * Get or set the value for an element.
   * @param  {String=} value - Optional new value for elements
   * @return {Seht}    The original object or element's value
   */
  value(value) {
    if (typeof value !== 'undefined') {
      return each(this, (element) => {
        element.value = value;
      });
    }

    if (this.length > 0) {
      return this[0].value;
    }

    return null;
  },
};

seht.each = each;
seht.map = map;
seht.ready = Events.ready;
seht.toArray = toArray;
seht.unique = unique;

seht.fn = Seht.prototype;

export default seht;
