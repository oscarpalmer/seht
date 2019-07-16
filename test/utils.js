// Name of group of tests
QUnit.module('Utility tests');

// Accessible properties should be functions
QUnit.test('Verify definitions of utility methods', (assert) => {
  assert.ok(
    typeof seht.each === 'function',
    '\'seht.each\' is a function');

  assert.ok(
    typeof seht.map === 'function',
    '\'seht.map\' is a function');

  assert.ok(
    typeof seht.toArray === 'function',
    '\'seht.toArray\' is a function');

  assert.ok(
    typeof seht.unique === 'function',
    '\'seht.unique\' is a function');
});

// Collection of tests for looping an array with 'each'
QUnit.test('Looping array with \'each\'', (assert) => {
  // Base array
  const array = ['a', 'b', 'c', 'd', 'e'];
  // Comparison index
  let comparisonIndex = 0;

  seht.each(array, (value, index) => {
    // Prefix for result log
    const prefix = `Loop ${index + 1}`;

    // Index value should match expected index value
    assert.strictEqual(
      index,
      comparisonIndex,
      `${prefix}: index, \'${index}\', matches expected number, \'${comparisonIndex}\'`);

    // Value for index should match expected value for index
    assert.strictEqual(
      value,
      array[index],
      `${prefix}: value, \'${value}\', matches expected value, \'${array[index]}\'`);

    // Add on to our comparison index
    comparisonIndex++;
  });
});

QUnit.test('"Looping" object with \'each\'', (assert) => {
  // Base keys
  const keys = ['a', 'b', 'c', 'd', 'e'];
  // Base values
  const values = [1, 2, 3, 4, 5];

  // Base object
  const obj = {
    [keys[0]]: values[0],
    [keys[1]]: values[1],
    [keys[2]]: values[2],
    [keys[3]]: values[3],
    [keys[4]]: values[4]
  };

  // Comparison index
  let index = 0;

  seht.each(obj, (value, key) => {
    // Prefix for result log
    const prefix = `Property '${index}'`;

    // Key for property should match expected value
    assert.strictEqual(
      key,
      keys[index],
      `${prefix}: key value, \'${key}\, matches expected key value, '${keys[index]}'`);

    // Value of property should match expected value
    assert.strictEqual(
      value,
      values[index],
      `${prefix}: value for key, \'${value}\, matches expected value for key, '${values[index]}'`);

    // Add on to our comparison index
    index++;
  });
});

QUnit.test('"Mapping" array with \'map\'', (assert) => {
  // Base array of values
  const original = [1, 2, 3, 4, 5];
  // Expected array of values
  const expected = [1, 4, 9, 16, 25];

  // Remap values of the original array with their values squared
  const ret = seht.map(original, value => value ** 2);

  // Value for index should match expected value for index
  seht.each(ret, (value, index) => {
    assert.strictEqual(
      value,
      expected[index],
      `Loop ${index + 1}: mapped value, '${value}', matches expected value, '${expected[index]}'`);
  });
});

QUnit.test('"Mapping" object with \'map\'', (assert) => {
  const original = { a: 1, b: 2, c: 3, d: 4, e: 5 };
  const expected = { a: 1, b: 4, c: 9, d: 16, e: 25 };

  // Remap values of the original object with their values squared
  seht.map(original, value => value ** 2);

  // Value of property should match expected value
  seht.each(original, (value, key) => {
    assert.strictEqual(
      value,
      expected[key],
      `Property ${key}: mapped value, '${value}', matches expected value, '${expected[key]}'`);
  });
});

QUnit.test('Conversion with \'toArray\' on items', (assert) => {
  const types = {
    'array': {
      original: [1, 2, 3, 4, 5],
      expected: [1, 2, 3, 4, 5]
    },
    'array-like-object': {
      original: { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, length: 5 },
      expected: [1, 2, 3, 4, 5]
    },
    'object': {
      original: { a: 1, b: 2, c: 3, d: 4, e: 5 },
      expected: []
    },
    'string': {
      original: 'a string of words',
      expected: ['a', ' ', 's', 't', 'r', 'i', 'n', 'g', ' ', 'o', 'f', ' ', 'w', 'o', 'r', 'd', 's']
    },
    'function': {
      original: function () {},
      expected: [],
    },
    'null': {
      original: null,
      expected: []
    }
  };

  seht.each(types, (value, key) => {
    // Get value of method call
    const toArray = seht.toArray(value.original);
    // Variable for assertion; >0 indicates failure
    let result = 0;

    // Loop through converted array
    seht.each(toArray, (v, index) => {
      // Match with expected values
      // If no match, add on to our result variable
      if (v !== value.expected[index]) result++;
    });

    // Loop through expected array
    seht.each(value.expected, (v, index) => {
      // Match with converted values
      // If no match, add on to our result variable
      if (v !== toArray[index]) result++;
    });

    // Length of array should match, and assertion variable should be nil
    assert.ok(
      toArray.length === value.expected.length && result === 0,
      `Converting to array with "toArray" for '${key}' results in expected values and length`);
  });
});

QUnit.test('Removing duplicats with "unique"', (assert) => {
  const items = {
    'array': {
      original: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5],
      expected: [1, 2, 3, 4, 5]
    },
    'array-like object': {
      original: { 0: 1, 1: 1, 2: 2, 3: 2, 4: 3, 5: 3, 6: 4, 7: 4, 8: 5, 9: 5, length: 10 },
      expected: [1, 2, 3, 4, 5]
    },
    'object': {
      original: { a: 1, b: 2, c: 3, d: 4, e: 5 },
      expected: [],
    },
    'string': {
      original: 'a string of words',
      expected: ['a', ' ', 's', 't', 'r', 'i', 'n', 'g', 'o', 'f', 'w', 'd']
    },
    'null': {
      original: null,
      expected: []
    }
  };

  seht.each(items, (value, key) => {
    // Get value of method call
    const unique = seht.unique(value.original);
    // Variable for assertion; >0 indicates failure
    let result = 0;

    // Loop through converted array
    seht.each(unique, (v, index) => {
      // Match with expected values
      // If no match, add on to our result variable
      if (v !== value.expected[index]) result++;
    });

    // Loop through expected array
    seht.each(value.expected, (v, index) => {
      // Match with converted values
      // If no match, add on to our result variable
      if (v !== unique[index]) result++;
    });

    // Length of array should match, and assertion variable should be nil
    assert.ok(
      unique.length === value.expected.length && result === 0,
      `Removing duplicates with "each" for '${key}' results in expected values and length`);
  });
});