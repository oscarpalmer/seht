export default {
  'env': {
    'browser': true,
    'es6': true
  },
  'extends': 'airbnb-base',
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module'
  },
  'rules': {
    'dot-notation': 0,
    'no-nested-ternary': 0,
    'no-param-reassign': 0,
    'no-use-before-define': 0,
    'quote-props': 0
  }
};