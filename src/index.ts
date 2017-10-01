export function format(x: number): string {
  return isInteger(x) ? formatInteger(x) : formatDecimal(x);
}

export function formatInteger(x) {
  if (Object.is(x, -0)) {
    return '-0';
  }

  const N = getFirstDigit(x) < 4 ? 3 : 2;
 
  const exp = x.toExponential(N);
  const rnd  = Math.round(x).toLocaleString();

  // Return the smaller of exponential notation or "rule of four"
  return exp.length < rnd.length ? exp : rnd;
}

export function formatDecimal(x) {
  if (x === Infinity || x === -Infinity) {
    return x.toLocaleString();
  }
  const N = getFirstDigit(x) < 4 ? 3 : 2;
 
  const exp = x.toExponential(N);
  const rnd = Math.abs(x) >= 0.4 ? x.toFixed(2) : x.toPrecision(N);
  
  // Return the smaller of exponential notation or "rule of four"
  return exp.length < rnd.length ? exp : rnd;
}

// rule of four:
// * uses three decimal places for ratios in the range 0.040-0.399
// * two decimals for 0.40-3.99, one decimal for 4.0-39.9, etc
export function ruleOfFour(x) {
  const abs = Math.abs(x);
  const char = getFirstDigit(x);
  const N = char < 4 ? 3 : 2;
  return x.toPrecision(N);
}

function getFirstDigit(x) {
  const match = ('' + x).match(/[1-9]/);
  return match ? +match[0] : 0;
}

function isInteger(x) {
  return parseInt(x, undefined) === parseFloat(x);
}
