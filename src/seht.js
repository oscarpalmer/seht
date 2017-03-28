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
    ID: /^\#[\w\-]+$/
  },
  Seht;

  //

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

  //

  /**
   * Function to call Sehts constructor.
   *
   * @param {*} selector - Query to search for
   * @param {Element=} context - Item in which we look for 'selector'
   * @return {Seht} An old or new Seht-object
   */
  function seht(selector, context) {
    if (selector instanceof Seht) {
      // The selector is a Seht-object, so let's return it as-is

      return selector;
    }

    // Call the constructor for Seht
    return new Seht(selector, context || doc);
  }

  /**
   * Initiates a Seht-object.
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

    // Add each element to the current object
    each(elements, function (node, index) {
      this[index] = node;
    }, this);
  };

  //

  seht.each = each;

  //

  return seht;
});