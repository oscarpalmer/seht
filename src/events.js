import { doc } from './consts';
import Utils from './utils';

/**
 * Collection of event-related methods.
 */
const Events = {
  /**
   * Method for adding a callback for when the DOM has loaded.
   * @param {Function} handler
   */
  ready(handler) {
    doc.addEventListener('DOMContentLoaded', handler);
  },

  /**
   * Method for triggering events on an element.
   * @param {Element} element
   * @param {Array} types
   */
  trigger(element, types) {
    let event;

    Utils.each(types, (type) => {
      // Create custom event
      event = doc.createEvent('CustomEvent');

      // Set properties of custom event
      event.initCustomEvent(type, true, true);

      // Dispatch (trigger) event on element
      element.dispatchEvent(event);
    });
  }
};

// Export collection of methods
export default Events;