import { doc, regexes } from './consts';
import Utils from './utils';

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

// Export collection of methods
export default DOM;
