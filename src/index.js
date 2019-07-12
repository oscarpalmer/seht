import Events from './events';
import Utils from './utils';
import Seht from './seht';

/**
 * Method for creating a new instance of Seht.
 * @param {*=} selector
 * @param {*=} context
 * @returns {Seht} A new Seht object
 */
const seht = (selector, context) => {
  if (selector instanceof Seht) {
    return selector;
  }

  return new Seht(selector, context);
};

// Expose useful event and utility methods for outside use
seht.each = Utils.each;
seht.map = Utils.map;
seht.ready = Events.ready;
seht.toArray = Utils.toArray;
seht.unique = Utils.unique;

// Export method
export default seht;