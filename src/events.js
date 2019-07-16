import Utils from './utils';
import { doc } from './consts';

/**
 * Collection of event-related methods.
 */
const Events = {
  /**
   * Method for adding a callback for when the DOM has loaded.
   * @param {Function} callback Function to call when document is ready
   * @param {Boolean=} capture True or false to capture this event callback before others
   */
  ready(callback, capture) {
    doc.addEventListener('DOMContentLoaded', callback, capture || false);
  },

  /**
   * Method for triggering events on an element.
   * @param {Element} element Element on which to trigger events
   * @param {Array} types Array of strings representing event names
   */
  trigger(element, types) {
    let event;

    Utils.each(types, (type) => {
      // Create custom event
      event = doc.createEvent('Event');

      // Set properties of custom event
      event.initEvent(type, true, true);

      // Dispatch (trigger) event on element
      element.dispatchEvent(event);
    });
  },
};

// Export collection of methods
export default Events;
