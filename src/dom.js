import Utils from './utils';
import { doc, regexes } from './consts';

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

// Export collection of methods
export default DOM;
