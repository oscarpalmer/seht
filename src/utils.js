import { arrayPrototype } from './consts';

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

export default Utils;
