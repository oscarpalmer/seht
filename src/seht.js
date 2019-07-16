import DOM from './dom';
import Events from './events';
import Utils from './utils';

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

export default Seht;
