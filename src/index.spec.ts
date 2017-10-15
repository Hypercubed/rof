import { test } from 'ava';
import { format, ruleOfFour, formatInteger, formatDecimal, formatFloat, pickFormat, Rof } from '.';

// role of four

test('ruleOfFour', t => {
  t.is(ruleOfFour(0.04), '0.040');
  t.is(ruleOfFour(0.2), '0.200');
  t.is(ruleOfFour(2), '2.00');
  t.is(ruleOfFour(4), '4.0');
  t.is(ruleOfFour(20), '20.0');
  t.is(ruleOfFour(40), '40');
});

test('ruleOfFour, negative values', t => {
  t.is(ruleOfFour(-0.04), '-0.040');
  t.is(ruleOfFour(-0.2), '-0.200');
  t.is(ruleOfFour(-2), '-2.00');
  t.is(ruleOfFour(-4), '-4.0');
  t.is(ruleOfFour(-20), '-20.0');
  t.is(ruleOfFour(-40), '-40');
});

// format floats

test('#formatFloat, zero', t => {
  t.is(formatFloat(0), '0.00e+0');
  t.is(formatFloat(-0), '-0.00e+0');
});

test('#formatFloat', t => {
  t.is(formatFloat(0.04), '4.0e-2');
  t.is(formatFloat(2), '2.00e+0');
  t.is(formatFloat(4), '4.0e+0');
  t.is(formatFloat(20), '2.00e+1');
  t.is(formatFloat(40), '4.0e+1');
});

test('#formatFloat, negative values', t => {
  t.is(formatFloat(-0.04), '-4.0e-2');
  t.is(formatFloat(-2), '-2.00e+0');
  t.is(formatFloat(-4), '-4.0e+0');
  t.is(formatFloat(-20), '-2.00e+1');
  t.is(formatFloat(-40), '-4.0e+1');
});

// format integers

test('#formatInteger, zero', t => {
  t.is(formatInteger(0), '0');
  t.is(formatInteger(-0), '-0');
});

test('#formatInteger', t => {
  t.is(formatInteger(0.04), '0');
  t.is(formatInteger(2), '2');
  t.is(formatInteger(4), '4');
  t.is(formatInteger(20), '20');
  t.is(formatInteger(40), '40');
});

test('#formatInteger, negative values', t => {
  t.is(formatInteger(-0.04), '-0');
  t.is(formatInteger(-2), '-2');
  t.is(formatInteger(-4), '-4');
  t.is(formatInteger(-20), '-20');
  t.is(formatInteger(-40), '-40');
});

test('#formatInteger, special', t => {
  t.is(formatInteger(0.1 + 0.2), '0');
  t.is(formatInteger((0.1 + 0.2) * 10), '3');
});

// format formatDecimal

test('#formatDecimal, zero', t => {
  t.is(formatDecimal(0), '0.00');
  t.is(formatDecimal(-0), '-0.00');
});

test('#formatDecimal', t => {
  t.is(formatDecimal(0.04), '0.040');
  t.is(formatDecimal(0.2), '0.200');
  t.is(formatDecimal(2), '2.00');
  t.is(formatDecimal(4), '4.00');
  t.is(formatDecimal(20), '20.00');
  t.is(formatDecimal(40), '40.00');
});

test('#formatDecimal, negative', t => {
  t.is(formatDecimal(-0.04), '-0.040');
  t.is(formatDecimal(-0.2), '-0.200');
  t.is(formatDecimal(-2), '-2.00');
  t.is(formatDecimal(-4), '-4.00');
  t.is(formatDecimal(-20), '-20.00');
  t.is(formatDecimal(-40), '-40.00');
});

// format

test('#format, should work for zero and neg zero', t => {
  t.is(format(0), '0');
  t.is(format(-0), '-0');
});

test('#format, rule of four', t => {
  t.is(format(0.04), '0.040');
  t.is(format(0.2), '0.200');
  t.is(format(2.0001), '2.00');
  t.is(format(4.0001), '4.00');
  t.is(format(20.0001), '20.00');
  t.is(format(40.0001), '40.00');
});

test('#format, rule of four, integers', t => {
  t.is(format(2), '2');
  t.is(format(4), '4');
  t.is(format(20), '20');
  t.is(format(40), '40');
});

test('#format, rule of four, negative', t => {
  t.is(format(-0.04), '-0.040');
  t.is(format(-0.2), '-0.200');
  t.is(format(-2), '-2');
  t.is(format(-4), '-4');
  t.is(format(-20), '-20');
  t.is(format(-40), '-40');
});

test('#format, should work for infinity and neg infinity', t => {
  t.is(format(Infinity), '∞');
  t.is(format(-Infinity), '-∞');
});

test('#format, should work for integers', t => {
  t.is(format(1), '1');
  t.is(format(10), '10');
  t.is(format(100), '100');
  t.is(format(1000), '1,000');
  t.is(format(10000), '10,000');
  t.is(format(100000), '100,000');
});

test('#format, should work for negative integers', t => {
  t.is(format(-0), '-0');
  t.is(format(-1), '-1');
  t.is(format(-10), '-10');
  t.is(format(-100), '-100');
  t.is(format(-1000), '-1,000');
  t.is(format(-10000), '-10,000');
  t.is(format(-100000), '-100,000');
});

test('#format, should work for large integers', t => {
  t.is(format(1234567), '1,234,567');
  t.is(format(4234567), '4,234,567');
  t.is(format(12345678), '1.23e+7');
  t.is(format(42345678), '4.2e+7');
  t.is(format(-1234567), '-1.23e+6');
  t.is(format(-4234567), '-4.2e+6');
  t.is(format(-12345678), '-1.23e+7');
  t.is(format(-42345678), '-4.2e+7');
});

test('#format, should work for large decimals', t => {
  t.is(format(1234567.89), '1.23e+6');
  t.is(format(4234567.89), '4.2e+6');
  t.is(format(12345678.89), '1.23e+7');
  t.is(format(42345678.89), '4.2e+7');
  t.is(format(-1234567.89), '-1.23e+6');
  t.is(format(-4234567.89), '-4.2e+6');
  t.is(format(-12345678.89), '-1.23e+7');
  t.is(format(-42345678.89), '-4.2e+7');
});

test('#format, special', t => {
  t.is(format(0.1 + 0.2), '0.300');
  t.is(format((0.1 + 0.2) * 10), '3');
  t.is(format((0.1 + 0.2) * 10 - 3), '4.4e-16');
  t.is(format(Number.EPSILON), '2.22e-16');
  t.is(format(Number.EPSILON / 2), '1.11e-16');
  t.is(format(Number.MAX_VALUE), '1.80e+308');
  t.is(format(2.05 + 1.01), '3.06');
  t.is(format((2.05 + 1.01) * 100), '306');
});

// Constructor

test('Constructor #ruleOfFour, defaults', t => {
  const rof = new Rof();
  t.is(rof.ruleOfFour(0.04), '0.040');
  t.is(rof.ruleOfFour(0.2), '0.200');
  t.is(rof.ruleOfFour(2), '2.00');
  t.is(rof.ruleOfFour(4), '4.0');
  t.is(rof.ruleOfFour(20), '20.0');
  t.is(rof.ruleOfFour(40), '40');
});

test('Constructor #ruleOfFour', t => {
  const rof = new Rof(undefined, {minimumSignificantDigits: 4, maximumSignificantDigits: 6});
  t.is(rof.ruleOfFour(0.04), '0.04000');
  t.is(rof.ruleOfFour(0.2), '0.200000');
  t.is(rof.ruleOfFour(2), '2.00000');
  t.is(rof.ruleOfFour(4), '4.000');
  t.is(rof.ruleOfFour(20), '20.0000');
  t.is(rof.ruleOfFour(40), '40.00');
});

// Best
test('#pickFormat', t => {
  const _ = arr => arr.map(pickFormat(arr));

  // formatInteger
  t.deepEqual(_([ 0,   1,   2,   3,   -1,   -2,   -3]),   
                ['0', '1', '2', '3', '-1', '-2', '-3']);

  // formatFloat (integers) 
  t.deepEqual(_([0,          1,         2,         3,         123456789, -123456789]),  
                ['0.00e+0', '1.00e+0', '2.00e+0', '3.00e+0', '1.23e+8', '-1.23e+8']);

  // formatDecimal (toPrecision)    
  t.deepEqual(_([ 0,      1,      2,      3,      0.4,    -0.4,    3.1,    -3.1]),
                ['0.00', '1.00', '2.00', '3.00', '0.40', '-0.40', '3.10', '-3.10']);

  // formatDecimal
  t.deepEqual(_([ 0,      1,      2,      3,      0.1,     0.001]),
                ['0.00', '1.00', '2.00', '3.00', '0.100', '0.00100']);

  // formatFloat (decimals)
  t.deepEqual(_([0,         1,         2,         3,         0.1,       0.001,     1e-7,      -1e-7]),      
               ['0.00e+0', '1.00e+0', '2.00e+0', '3.00e+0', '1.00e-1', '1.00e-3', '1.00e-7', '-1.00e-7']);

});
