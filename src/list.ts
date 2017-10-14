import { ruleOfFour, format, formatInteger, formatDecimal, formatFloat, Rof } from '.';

const headings = ['Input Value', 'toLocaleString', 'toPrecision (N=3)', 'Rule of Four', 'format'];

const ms = [0, 1, 2, 3, 4, 5, 6, 7, 8, -1, -2, -3, -4, -5, -6, -7, -8];
const ns = [1, 5];
const ss = [1, -1];

console.log('\n## ruleOfFour\n');

console.log(formatRow(headings.slice(0, 4)));
console.log(formatRow(headings.slice(0, 4).map(x => x.replace(/./g, '-'))));

printRow(0.04, undefined, () => '');
printRow(0.2, undefined, () => '');
printRow(0.4, undefined, () => '');
printRow(2.00001, undefined, () => '');
printRow(4.00001, undefined, () => '');
printRow(20.0001, undefined, () => '');
printRow(40.0001, undefined, () => '');
printRow(2, undefined, () => '');
printRow(4, undefined, () => '');
printRow(20, undefined, () => '');
printRow(40, undefined, () => '');
printRow(0, undefined, () => '');
printRow('-0', undefined, () => '');
printRow(Infinity, undefined, () => '');
printRow(-Infinity, undefined, () => '');

console.log('\n## formatInteger\n');

console.log(formatRow([...headings.slice(0, 4), 'formatInteger']));
console.log(formatRow(headings.map(x => x.replace(/./g, '-'))));

printRow(0.04, undefined, formatInteger);
printRow(0.2, undefined, formatInteger);
printRow(0.4, undefined, formatInteger);
printRow(2.00001, undefined, formatInteger);
printRow(4.00001, undefined, formatInteger);
printRow(20.0001, undefined, formatInteger);
printRow(40.0001, undefined, formatInteger);
printRow(2, undefined, formatInteger);
printRow(4, undefined, formatInteger);
printRow(20, undefined, formatInteger);
printRow(40, undefined, formatInteger);
printRow(0, undefined, formatInteger);
printRow('-0', undefined, formatInteger);
printRow(Infinity, undefined, formatInteger);
printRow(-Infinity, undefined, formatInteger);

console.log('\n## formatFloat\n');

console.log(formatRow([...headings.slice(0, 4), 'formatFloat']));
console.log(formatRow(headings.map(x => x.replace(/./g, '-'))));

printRow(0.04, undefined, formatFloat);
printRow(0.2, undefined, formatFloat);
printRow(0.4, undefined, formatFloat);
printRow(2.00001, undefined, formatFloat);
printRow(4.00001, undefined, formatFloat);
printRow(20.0001, undefined, formatFloat);
printRow(40.0001, undefined, formatFloat);
printRow(2, undefined, formatFloat);
printRow(4, undefined, formatFloat);
printRow(20, undefined, formatFloat);
printRow(40, undefined, formatFloat);
printRow(0, undefined, formatFloat);
printRow('-0', undefined, formatFloat);
printRow(Infinity, undefined, formatFloat);
printRow(-Infinity, undefined, formatFloat);

console.log('\n## formatDecimal\n');

console.log(formatRow([...headings.slice(0, 4), 'formatDecimal']));
console.log(formatRow(headings.map(x => x.replace(/./g, '-'))));

printRow(0.04, undefined, formatDecimal);
printRow(0.2, undefined, formatDecimal);
printRow(0.4, undefined, formatDecimal);
printRow(2.00001, undefined, formatDecimal);
printRow(4.00001, undefined, formatDecimal);
printRow(20.0001, undefined, formatDecimal);
printRow(40.0001, undefined, formatDecimal);
printRow(2, undefined, formatDecimal);
printRow(4, undefined, formatDecimal);
printRow(20, undefined, formatDecimal);
printRow(40, undefined, formatDecimal);
printRow(0, undefined, formatDecimal);
printRow('-0', undefined, formatDecimal);
printRow(Infinity, undefined, formatDecimal);
printRow(-Infinity, undefined, formatDecimal);

console.log('\n## format\n');

console.log(formatRow(headings));
console.log(formatRow(headings.map(x => x.replace(/./g, '-'))));

printRow(0.04);
printRow(0.2);
printRow(0.4);
printRow(2.00001);
printRow(4.00001);
printRow(20.0001);
printRow(40.0001);
printRow(2);
printRow(4);
printRow(20);
printRow(40);
printRow(0);
printRow('-0');
printRow(Infinity);
printRow(-Infinity);

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
