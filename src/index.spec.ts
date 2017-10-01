import { test } from 'ava';
import { format, ruleOfFour, formatDecimal } from '.';

test('should work for zero and neg zero', t => {
  t.is(format(0), '0');
  t.is(format(-0), '-0');
});

test('should work for infinity and neg infinity', t => {
  t.is(format(Infinity), '∞');
  t.is(format(-Infinity), '-∞');
});

test('should work for integers', t => {
  t.is(format(1), '1');
  t.is(format(10), '10');
  t.is(format(100), '100');
  t.is(format(1000), '1,000');
  t.is(format(10000), '10,000');
  t.is(format(100000), '100,000');
});

test('should work for negitive integers', t => {
  t.is(format(-0), '-0');
  t.is(format(-1), '-1');
  t.is(format(-10), '-10');
  t.is(format(-100), '-100');
  t.is(format(-1000), '-1,000');
  t.is(format(-10000), '-10,000');
  t.is(format(-100000), '-100,000');
});

test('should work for large integers', t => {
  t.is(format(1000000), '1.000e+6');
  t.is(format(10000000), '1.000e+7');
  t.is(format(-1000000), '-1.000e+6');
  t.is(format(-10000000), '-1.000e+7');
});

test('should work for large integers', t => {
  t.is(format(1234567), '1.235e+6');
  t.is(format(4234567), '4.23e+6');
  t.is(format(12345678), '1.235e+7');
  t.is(format(42345678), '4.23e+7');
  t.is(format(-1234567), '-1.235e+6');
  t.is(format(-4234567), '-4.23e+6');
  t.is(format(-12345678), '-1.235e+7');
  t.is(format(-42345678), '-4.23e+7');
});

test('should work for large decimals', t => {
  t.is(format(1234567.89), '1.235e+6');
  t.is(format(4234567.89), '4.23e+6');
  t.is(format(12345678.89), '1.235e+7');
  t.is(format(42345678.89), '4.23e+7');
  t.is(format(-1234567.89), '-1.235e+6');
  t.is(format(-4234567.89), '-4.23e+6');
  t.is(format(-12345678.89), '-1.235e+7');
  t.is(format(-42345678.89), '-4.23e+7');
});

test('format, rule of four', t => {
  t.is(format(0.04), '0.040');
  t.is(format(0.399), '0.399');
  t.is(format(0.4), '0.40');
  t.is(format(3.99), '3.99');
  t.is(format(4), '4');
  t.is(format(4.001), '4.00');
  t.is(format(39.9), '39.90');
  t.is(format(40), '40');
  t.is(format(40.001), '40.00');
});

test('rule of four', t => {
  t.is(ruleOfFour(0.04), '0.040');
  t.is(ruleOfFour(0.399), '0.399');
  t.is(ruleOfFour(0.4), '0.40');
  t.is(ruleOfFour(3.99), '3.99');
  t.is(ruleOfFour(4.001), '4.0');
  t.is(ruleOfFour(39.9), '39.9');
  t.is(ruleOfFour(40.001), '40');
});

test('formatDecimal', t => {
  t.is(formatDecimal(0), '0.00');
  t.is(formatDecimal(-0), '-0.00');
});
