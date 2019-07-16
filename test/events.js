// Name of group of tests
QUnit.module('Event tests');

QUnit.test('Ready event', (assert) => {
  // Accessible property should be a function
  assert.ok(
    typeof seht.ready === 'function',
    '\'seht.ready\' is a function');

  // Assert that previously used 'seht.ready'-calls resulted in expected values
  assert.ok(
    domReady != null
      && domReady.event instanceof Event 
      && domReady.event.type === 'DOMContentLoaded'
      && domReady.index === 2
      && domReady.loaded === true,
    '\'seht.ready\' was called and its callback resulted in expected values');
});

QUnit.test('\'off\', \'on\', and \'trigger\'', (assert) => {
  // Element for testing
  const element = seht('<p>Event element</p');

  // Variable for assertion
  let result = 0;

  // Callback to set, unset, and trigger
  const callback = (event) => {
    result++;

    // Assert that event parameter is an event
    assert.ok(
      event instanceof Event
      && event.type === 'click',
    'Event parameter is of type \'Event\' and type matches expected value');
  };

  // Trigger a click-event on element…
  element.trigger('click');

  // … but nothing should have triggered
  assert.strictEqual(
    result,
    0,
    'Triggering a missing event results in nothing');

  // Set the event callback for clicks on the element
  element.on('click', callback);

  // Trigger a click-event on element…
  element.trigger('click');

  // … and assert that the assertion variable has updated
  assert.strictEqual(
    result,
    1,
    'Triggering a set event results in callback being called');

  // Unset the event callback for clicks on the element
  element.off('click', callback);

  // Attempt to trigger the now-removed event on the element…
  seht.each([0, 1, 2], () => {
    element.trigger('click');
  });

  // … but nothing should have triggered
  assert.strictEqual(
    result,
    1,
    'Triggering an unset event results in nothing');
});