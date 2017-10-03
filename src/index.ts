export function format(x: number): string {
  return isInteger(x) ? formatInteger(x) : formatDecimal(x);
}

export function formatInteger(x: number): string {
  x = Math.round(x);

  if (Object.is(x, -0)) {
    return '-0';
  }

  const localeString  = x.toLocaleString();

  if (localeString.length <= 9) {
    return localeString;
  }

  const N = getRofPrecision(x);
  return x.toExponential(N);
}

export function formatDecimal(x: number): string {
  if (Object.is(x, -0)) {
    return '-0.00';
  }

  let localeString;
  let N;

  if (Math.abs(x) >= 0.4) {
    localeString = x.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
  } else {
    N = getRofPrecision(x);
    localeString = x.toPrecision(N);
  }

  if (localeString.length <= 9) {
    return localeString;
  }

  N = N || getRofPrecision(x);
  return x.toExponential(N);
}

// rule of four:
// * uses three decimal places for ratios in the range 0.040-0.399
// * two decimals for 0.40-3.99, one decimal for 4.0-39.9, etc
export function ruleOfFour(x: number): string {
  const N = getRofPrecision(x);
  return x.toPrecision(N);
}

function getRofPrecision(x: number): number {
  const match = ('' + x).match(/[1-9]/);
  const char = match ? +match[0] : 0;
  return char < 4 ? 3 : 2;
}

function isInteger(x: number | string): boolean {
  x = '' + x;
  return parseInt(x, undefined) === parseFloat(x);
}
