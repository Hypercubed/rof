class Rof {
  constructor(public precision) {}

  format(x: number): string {
    return isInteger(x) ? formatInteger(x) : formatDecimal(x);
  }
  
  formatInteger(x: number): string {
    x = Math.round(x);
  
    if (Object.is(x, -0)) {
      return '-0';
    }
  
    const localeString  = x.toLocaleString();
  
    return (localeString.length <= (7 + this.precision)) ?
      localeString :
      this.formatFloat(x);
  }
  
  formatDecimal(x: number): string {
    if (Object.is(x, -0)) {
      return '-0.' + '0'.repeat(this.precision);
    }
  
    let localeString;
    let N;
  
    if (Math.abs(x) >= 0.4) {
      localeString = x.toLocaleString(undefined, {
        minimumFractionDigits: this.precision,
        maximumFractionDigits: this.precision
      });
    } else {
      N = this.getRofPrecision(x);
      localeString = x.toPrecision(N);
    }
  
    return (localeString.length <= (7 + this.precision)) ?
      localeString :
      this.formatFloat(x, N);
  }
  
  formatFloat(x: number, N?: number): string {
    N = N || this.getRofPrecision(x);
    return x.toExponential(N - 1);
  }
  
  // rule of four:
  // * uses three decimal places for ratios in the range 0.040-0.399
  // * two decimals for 0.40-3.99, one decimal for 4.0-39.9, etc
  ruleOfFour(x: number): string {
    const N = this.getRofPrecision(x);
    return x.toPrecision(N);
  }
  
  private getRofPrecision(x: number): number {
    const match = ('' + x).match(/[1-9]/);
    const char = match ? +match[0] : 0;
    return this.precision + (char < 4 ? 1 : 0);
  }
}

function isInteger(x: number | string): boolean {
  x = '' + x;
  return parseInt(x, undefined) === parseFloat(x);
}

const rof = new Rof(2);

const ruleOfFour = rof.ruleOfFour.bind(rof);
const formatDecimal = rof.formatDecimal.bind(rof);
const formatInteger = rof.formatInteger.bind(rof);
const format = rof.format.bind(rof);

export {
  ruleOfFour,
  formatDecimal,
  formatInteger,
  format
};
