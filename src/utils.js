import { arrayPrototype } from './consts';

/**
 * Collection of utility methods.
 */
const Utils = {
  /**
   * Method for looping through arrays and object
   * with a callback for each element within.
   * @param {Array|Object} obj
   * @param {Function} handler
   * @param {*} scope
   * @returns {Array|Object} The original array or object
   */
  each(obj, handler, scope) {
    if (typeof obj === 'object' && typeof obj.length === 'number') {
      arrayPrototype.forEach.call(obj, (value, index) => {
        handler.call(scope || value, value, index, obj);
      });
    } else {
      arrayPrototype.forEach.call(Object.keys(obj), (key) => {
        handler.call(scope || obj[key], obj[key], obj);
      });
    }

    return obj;
  },

  /**
   * Method for remapping an array or object based on a callback.
   * @param {Array|Object} obj
   * @param {Function} handler
   * @param {*} scope
   * @returns {Array|Object} The original array or object
   */
  map(obj, handler, scope) {
    return arrayPrototype.forEach.call(obj, (value, index) => {
      return handler.call(scope || value, value, index, obj);
    });
  },

  /**
   * Method for converting an array-like object to an array.
   * @param {Object} obj
   * @returns {Array} New array
   */
  toArray(obj) {
    return arrayPrototype.slice.call(obj);
  },

  /**
   * Method for removing duplicates in an array.
   * @param {Array} array
   * @returns {Array} A duplicate-free array
   */
  unique(array) {
    // Return the original array if it is unable to contain duplicates
    if (array.length <= 1) {
      return array;
    }

    return arrayPrototype.filter.call(array, (value, index, original) => {
      return arrayPrototype.indexOf.call(original, value) === index;
    });
  },
};

export default Utils;
