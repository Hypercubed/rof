import { ruleOfFour, format, formatInteger, formatDecimal } from '.';

const headings = ['Input Value', 'toLocaleString', 'toPrecision (N=3)', 'Rule of Four', 'format'];

const ms = [0, 1, 2, 3, 4, 5, 6, 7, 8, -1, -2, -3, -4, -5, -6, -7, -8];
const ns = [1, 5];
const ss = [1, -1];

console.log(' ** Rule of Four **');
console.log(formatRow(headings));
console.log(formatRow(headings.map(x => x.replace(/./g, '-'))));

printRow(0.04);
printRow(0.2);
printRow(0.4);
printRow(2);
printRow(4);
printRow(20);
printRow(40);

// integers
console.log('\n ** Integers **');
console.log(formatRow(headings));
console.log(formatRow(headings.map(x => x.replace(/./g, '-'))));

ss.forEach(s => {
  ms.forEach(m => {
    ns.forEach(n => {
      printRow(s * n * Math.pow(10, m));
    });
  });
});

// Floats
console.log('\n ** Floats **');
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
console.log('\n** Special **');
console.log(formatRow(headings));
console.log(formatRow(headings.map(x => x.replace(/./g, '-'))));

printRow(0);
printRow('-0');
printRow(Infinity);
printRow(-Infinity);
printRow(NaN);
printRow('1 + 2', 1 + 2);
printRow('(0.1 + 0.2)*10', (0.1 + 0.2) * 10);
printRow('PI', Math.PI);
printRow('E', Math.E);
printRow('SQRT2', Math.SQRT2);
printRow('EPSILON', Number.EPSILON);

function printRow(x, v = +x) {
  const row = [x, v.toLocaleString(), v.toPrecision(3), ruleOfFour(v), format(v)];
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
