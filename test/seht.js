QUnit.module('Seht tests');

QUnit.test('Add, remove, toggle and checking for class names', (assert) => {
  // Array of test classes
  const classes = ['one', 'two', 'three'];
  // Element to work with
  const element = seht('ul', doc.body);

  // Assert that all functions exist
  seht.each(['add', 'has', 'remove', 'toggle'], (value) => {
    assert.strictEqual(
      typeof element[`${value}Class`], 
      'function',
      `'${value}Class' is a function`);
  });

  // Add classes to element with 'addClass'…
  element.addClass(...classes);

  // … and assert that they exist in its 'className' property
  assert.strictEqual(
    element[0].className,
    classes.join(' ').trim(),
    'Classes added with \'addClass\' are added to the element\'s object properly');

  // Variable for assertion; >0 indicates failure
  let result = 0;

  // For each predetermined class…
  seht.each(classes, (value) => {
    // … add on to our result variable if the class does not exist
    if (element.hasClass(value) === false) result++;
  });

  // Assert that all classes exist with 'hasClass';
  // assertion variable should be nil
  assert.strictEqual(
    result,
    0,
    'Classes can be verified with \'hasClass\'');

  // Remove a specific class from element with 'removeClass'…
  element.removeClass(classes[1]);

  // … and assert that its 'className' property has updated properly
  assert.strictEqual(
    element[0].className,
    `${classes[0]} ${classes[2]}`,
    'Classes removed with \'removeClass\' are removed from the element\'s object properly');

  // Toggle the previously removed class with 'toggleClass'…
  element.toggleClass(classes[1]);

  // … and assert that the element's 'className' property has updated properly
  assert.strictEqual(
    element[0].className,
    `${classes[0]} ${classes[2]} ${classes[1]}`,
    'Classes toggled with \'toggleClass\' can be added to the element\'s object properly');

  // Toggle the two other classes with 'toggleClass'…
  element.toggleClass(classes[0], classes[2]);

  // … and assert that the element's 'className' property has updated properly
  assert.strictEqual(
    element[0].className,
    classes[1],
    'Classes toggled with \'toggleClass\' can be removed from the element\'s object properly');
  
  assert.ok(
    element.hasClass() === null
    && seht('p', doc.body).hasClass('name') === null,
    'Bad parameters when using \'hasClass\' results in null');
});

QUnit.test('HTML and content modifications with \'after\', \'append\', \'appendTo\', \'before\', \'empty\', \'html\', \'prepend\', \'prependTo\', \'remove\', \'text\', \'value\'', (assert) => {
  let element;
  let parent;

  // Method to run before each individual test
  // to sanitise the HTML and set the correct elements
  const before = () => {
    doc.body.innerHTML = html;

    element = seht('ul', doc.body);
    parent = seht('main', doc.body);
  };

  // Information for all test
  const tests = {
    'after': {
      content: '<p>a paragraph</p>',
      expected: '<ul><li>List-item 1</li><li>List-item 2</li><li>List-item 3</li></ul><p>a paragraph</p>'
    },
    'append': {
      content: '<li>List-item 4</li>',
      expected: '<li>List-item 1</li><li>List-item 2</li><li>List-item 3</li><li>List-item 4</li>'
    },
    'appendTo': {
      content: '<li>List-item 4</li>',
      expected: '<li>List-item 1</li><li>List-item 2</li><li>List-item 3</li><li>List-item 4</li>'
    },
    'before': {
      content: '<p>a paragraph</p>',
      expected: '<p>a paragraph</p><ul><li>List-item 1</li><li>List-item 2</li><li>List-item 3</li></ul>'
    },
    'empty': {
      expected: ''
    },
    'html': {
      content: '<li>New list-item 1</li><li>New list-item 2</li><li>New list-item 3</li>',
      expected: '<li>New list-item 1</li><li>New list-item 2</li><li>New list-item 3</li>'
    },
    'prepend': {
      content: '<li>List-item 4</li>',
      expected: '<li>List-item 4</li><li>List-item 1</li><li>List-item 2</li><li>List-item 3</li>'
    },
    'prependTo': {
      content: '<li>List-item 4</li>',
      expected: '<li>List-item 4</li><li>List-item 1</li><li>List-item 2</li><li>List-item 3</li>'
    },
    'remove': {
      expected: ''
    },
    'text': {
      content: 'Some kind of text to be inserted',
      expected: 'Some kind of text to be inserted'
    },
    'value': {
      content: 'test value',
      expected: 'test value'
    }
  };

  seht.each(tests, (value, key) => {
    // Sanitise and set up test
    before();

    let result;

    if (key === 'remove') {
      // 'remove'-method
      element.remove();
      result = parent.html();

    } else if (['appendTo', 'prependTo'].indexOf(key) > -1) {
      // Appending or prepending to a selector
      result = seht(value.content)[key](element).html();

    } else {
      // Normal content methods
      element[key](value.content);

      if (key === 'after' || key === 'before') {
        // Verify content insertion with parent
        result = parent.html();

      } else {
        // Use the correct method to retrieve the content
        result = element[key === 'text' ? 'text' : (key === 'value' ? 'value' :'html')]();
      }
    }

    // Assert that actual content matches expected content
    assert.strictEqual(
      result,
      value.expected,
      `Modifying HTML and content with '${key}' results in an expected value`);
  });
});

QUnit.test('Attribute and data-attributes', (assert) => {
  // Element to use for attribute testing
  const element = seht('ul', doc.body);

  // Simple attribute
  const attribute = {
    key: 'id',
    value: 'a-unique-value'
  };

  // Set value for attribute
  element.attr(attribute.key, attribute.value);

  // Assert that attribute exists and that its value matches expected value
  assert.ok(
    element[0].hasAttribute(attribute.key)
      && element.attr(attribute.key) === attribute.value,
    'Value for attribute exists on element and matches expected value');

  // Unset/remove value for attribute
  element.attr(attribute.key, null);

  // Assert that attribute no longer has a value
  assert.ok(
    element[0].hasAttribute(attribute.key) === false
      && element.attr(attribute.key) === null,
    'Value for attribute has been removed and no longer exists on element');

  // Data attribute
  const dataAttribute = {
    key: 'json-object',
    value: {
      a: 1,
      b: 2,
      c: 3
    }
  };

  // Set value for data attribute
  element.data(dataAttribute.key, dataAttribute.value);

  // Assert that data attribute exists and that its value matches expected value
  assert.ok(
    element[0].hasAttribute(`data-${dataAttribute.key}`)
      && JSON.stringify(element.data(dataAttribute.key))
         === JSON.stringify(dataAttribute.value),
    'Value for data attribute exists on element and matches expected value');

  // Unset/remove value for data attribute
  element.data(dataAttribute.key, null);

  // Assert that data attribute no longer has a value
  assert.ok(
    element.data(dataAttribute.key) === null
      && element[0].hasAttribute(dataAttribute.key) === false,
    'Value for data attribute has been removed and no longer exists on element');
  
  // Verify that all faulty parameters result in a null-return
  assert.ok(
    seht('p', doc.body).attr('id', 'value') === null
      && seht('p', doc.body).attr('id') === null
      && seht('p', doc.body).attr() === null,
    'Bad parameters for getting and setting attributes result in \'null\'');
  
  // Verify that all faulty parameters result in a null-return
  assert.ok(
    seht('p', doc.body).data('id', 'value') === null
      && seht('p', doc.body).data('id') === null
      && seht('p', doc.body).data() === null,
    'Bad parameters for getting and setting data attributes result in \'null\'');
});

QUnit.test('"Traversal" with \'eq\', \'first\', \'get\', \'last\', \'parent\'', (assert) => {
  const element = seht('<li>A</li><li>B</li><li>C</li>');

  assert.ok(
    element.eq(0) instanceof Seht
      && element.eq(0).length === 1
      && element.eq(0).html() === 'A'
      && element.eq(1).html() === 'B'
      && element.eq(2).html() === 'C',
    '\'eq\' returns Seht object containing value that matches expected value');
  
  assert.ok(
    element.first() instanceof Seht
      && element.first().length === 1
      && element.first().html() === 'A',
    '\'first\' returns Seht object containing value that matches expected value');
  
  assert.ok(
    element.last() instanceof Seht
      && element.last().length === 1
      && element.last().html() === 'C',
    '\'last\' returns Seht object containing value that matches expected value');
  
  assert.ok(
    element.get(0) instanceof Element
      && element.get(0).innerHTML === 'A'
      && element.get(1).innerHTML === 'B'
      && element.get(2).innerHTML === 'C',
    '\'get\' returns value that match expected value');
  
  assert.ok(
    element.eq(3) === null && element.eq() === null
      && seht().first() === null
      && element.get(3) === null && element.get() === null
      && seht().last() === null,
    '\'eq\', \'first\', \'get\' and \'last\' returns \'null\' for out-of-bound indexes, bad parameters, and empty Seht objects');

  const parent = seht('main', doc.body);
  const newParent = seht('ul', doc.body).parent();

  assert.ok(
    parent.get(0).tagName.toLowerCase() === 'main'
      && newParent.get(0).tagName.toLowerCase() === 'main'
      && JSON.stringify(parent) === JSON.stringify(newParent),
    '\'parent\' returns Seht object containing value that matches expected value');
});

QUnit.test('\'toArray\' and \'toString\'', (assert) => {
  const elements = ['<li>A</li>', '<li>B</li>', '<li>C</li>'];
  const element = seht(elements.join());

  const array = element.toArray();

  assert.ok(
    array.length === elements.length
      && array[0] instanceof Element && array[0].outerHTML === elements[0]
      && array[1] instanceof Element && array[1].outerHTML === elements[1]
      && array[1] instanceof Element && array[1].outerHTML === elements[1],
    '\'toArray\' returns array of values that match expected values');

  assert.ok(
    element.toString() === elements.join(),
    '\'toString\' return string value that matches expected value');
});