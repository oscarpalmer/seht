import Events from './events';
import Utils from './utils';
import Seht from './seht';
import { win } from './consts';

/**
 * Method for creating a new instance of Seht.
 * @param {*=} selector Selector for elements
 * @param {*=} context Context of elements
 * @returns {Seht} A new Seht object
 */
const seht = (selector, context) => {
  if (selector instanceof Seht) {
    return selector;
  }

  return new Seht(selector, context);
};

// Expose the prototype for extensions and custom methods
seht.fn = Seht.prototype;
seht.prototype = Seht.prototype;

// Expose useful event and utility methods for outside use
seht.each = Utils.each;
seht.map = Utils.map;
seht.ready = Events.ready;
seht.toArray = Utils.toArray;
seht.unique = Utils.unique;

// Export Seht's class, both for advanced usage and testing
win.Seht = Seht;

// Export a jQuery-like method when possible
if (win.$ == null) {
  win.$ = seht;
}

// Export method
export default seht;
