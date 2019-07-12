import pkg from './package.json';

const header = [
  '/*!',
  ` * Seht, v${pkg.version} - a JavaScript library, like jQuery or Zepto!`,
  ' * https://github.com/oscarpalmer/seht',
  ' * (c) Oscar Palmér, 2019, MIT @license',
  ' */',
];

module.exports = {
  input: './src/seht.js',
  output: {
    banner: header.join('\n'),
    file: './dist/seht.js',
    format: 'iife',
    name: 'seht',
    named: true,
    preferConst: true,
  },
  watch: {
    include: 'src/**',
  },
};