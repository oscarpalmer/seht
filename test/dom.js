// HTML content for testing queries
const html = JSON.parse(JSON.stringify('<header><h1 id="title">Test</h1></header><main><ul><li>List-item 1</li><li>List-item 2</li><li>List-item 3</li></ul></main>'));

// Document element for testing queries
const doc = document.implementation.createHTMLDocument();
      doc.body.innerHTML = html;

// Name of group of tests
QUnit.module('DOM tests');

QUnit.test('Basic querying', (assert) => {
  doc.body.innerHTML = html;

  // Query for test
  const query = seht('li', doc.body);

  // Result of query should be a Seht object
  assert.ok(
    query instanceof Seht,
    'Query is an instance of Seht');

  // Length/size of result should match expected value
  assert.strictEqual(
    query.length,
    3,
    'Query has expected length/size of 3');
});

QUnit.test('Advanced querying', (assert) => {
  doc.body.innerHTML = JSON.parse(JSON.stringify(html));

  [
    // Selector query with no results
    ['p', doc.body, 0],
    // Selector query with one result
    ['#title', doc.body, 1],
    // Selector query with three results
    [doc.getElementsByTagName('li'), null, 3],
    // Selector query in an element with three results
    ['li', doc.getElementsByTagName('main')[0], 3],
    // Seht query with three results
    [seht('li', doc.body), null, 3],
    // Selector query in Seht object with three results
    ['li', seht('main', doc.body), 3],
    // HTML query -> creates elements with three results
    ['<i></i><i></i><i></li>', null, 3],
    // Window query with one results
    [window, null, 1],
    // Empty query with no results
    [null, null, 0]
  ].forEach((value, index) => {
    // Query for loop
    const query = seht(value[0], value[1]);
    // Prefix for result log
    const prefix = `Advanced query #${index + 1}`;

    // Result of query should be a Seht object
    assert.ok(
      query instanceof Seht,
      `${prefix} is an instance of Seht`);

    // Length/size of result should match expected value
    assert.strictEqual(
      query.length,
      value[2],
      `${prefix} has expected length/size of ${value[2]}`);
  });
});