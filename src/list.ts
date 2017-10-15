import { ruleOfFour, format, formatInteger, formatDecimal, formatFloat, RofFormat } from '.';

const headings = ['Input Value', 'toLocaleString', 'toPrecision (N=3)', 'Rule of Four', 'format'];

const ms = [0, 1, 2, 3, 4, 5, 6, 7, 8, -1, -2, -3, -4, -5, -6, -7, -8];
const ns = [1, 5];
const ss = [1, -1];
const base = [
  0.04,
  0.2,
  0.4,
  2.00001,
  4.00001,
  20.0001,
  40.0001,
  2,
  4,
  20,
  40,
  0,
  '-0',
  Infinity,
  -Infinity
];

console.log('\n## Intro\n');

console.log(formatRow([...headings.slice(0, 4), 'toExponential (N = 2)']));
console.log(formatRow(headings.map(x => x.replace(/./g, '-'))));

[...base, 1234567891234, 0.002555, 0.00006777].forEach(n => {
  printRow(n, undefined, x => x.toExponential(2));
});

console.log('\n## ruleOfFour\n');

console.log(formatRow(headings.slice(0, 4)));
console.log(formatRow(headings.slice(0, 4).map(x => x.replace(/./g, '-'))));

base.forEach(n => {
  printRow(n, undefined, () => '');
});

console.log('\n## formatInteger\n');

console.log(formatRow([...headings.slice(0, 4), 'formatInteger']));
console.log(formatRow(headings.map(x => x.replace(/./g, '-'))));

base.forEach(n => {
  printRow(n, undefined, formatInteger);
});

console.log('\n## formatFloat\n');

console.log(formatRow([...headings.slice(0, 4), 'formatFloat']));
console.log(formatRow(headings.map(x => x.replace(/./g, '-'))));

base.forEach(n => {
  printRow(n, undefined, formatFloat);
});

console.log('\n## formatDecimal\n');

console.log(formatRow([...headings.slice(0, 4), 'formatDecimal']));
console.log(formatRow(headings.map(x => x.replace(/./g, '-'))));

base.forEach(n => {
  printRow(n, undefined, formatDecimal);
});

console.log('\n## format\n');

console.log(formatRow(headings));
console.log(formatRow(headings.map(x => x.replace(/./g, '-'))));

base.forEach(n => {
  printRow(n);
});

// integers
console.log('\n### Integers\n');
console.log(formatRow(headings));
console.log(formatRow(headings.map(x => x.replace(/./g, '-'))));

ss.forEach(s => {
  [1, 2, 3, 4, 5, 6, 7, 8].forEach(m => {
    ns.forEach(n => {
      printRow(Math.trunc(s * n * Math.random() * Math.pow(10, m)));
    });
  });
});

// Floats
console.log('\n ### Floats');
console.log(formatRow(headings));
console.log(formatRow(headings.map(x => x.replace(/./g, '-'))));

ss.forEach(s => {
  ms.forEach(m => {
    ns.forEach(n => {
      printRow(s * n * Math.random() * Math.pow(10, m));
    });
  });
});

// Special
console.log('\n### Special\n');
console.log(formatRow(headings));
console.log(formatRow(headings.map(x => x.replace(/./g, '-'))));

printRow(NaN);
printRow('1 + 2', 1 + 2);
printRow('(0.1 + 0.2)*10', (0.1 + 0.2) * 10);
printRow('PI', Math.PI);
printRow('E', Math.E);
printRow('SQRT2', Math.SQRT2);
printRow('EPSILON', Number.EPSILON);

function printRow(x, v = +x, fn = format) {
  const row = [x, v.toLocaleString(), v.toPrecision(3), ruleOfFour(v), fn(v)];
  console.log(formatRow(row));
}

function formatRow(row) {
  const ret = row
    .map((x, i) => leftpad(x, i === 0 ? 25 : 20))
    .join(' | ');
  return `| ${ret} |`;
}

function leftpad(str, len, ch = ' ') {
  str = String(str);
  let i = -1;
  len = len - str.length;
  while (++i < len) {
    str = ch + str;
  }
  return str;
}
