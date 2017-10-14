/* istanbul ignore next  */
const EPSILON = Number.EPSILON || Math.pow(2, -52);

export class Rof {
  static isInteger(x: number | string): boolean {
    x = +x;
    if (x === 0) return true;

    if (x < 1 && x > -1) return false;

    return Math.round(x) / x - 1 <= EPSILON;
  }

  constructor(public basePrecision = 2) {}

  format(x: number): string {
    return Rof.isInteger(x) ? this.formatInteger(x) : this.formatDecimal(x);
  }
  
  formatInteger(x: number): string {
    x = Math.round(x);
  
    if (Object.is(x, -0)) {
      return '-0';
    }
  
    const localeString  = x.toLocaleString();
  
    return (localeString.length <= (7 + this.basePrecision)) ?
      localeString :
      this.formatFloat(x);
  }

  formatDecimal(x: number): string {
    if (Object.is(x, -0)) {
      return `-${x.toPrecision(this.basePrecision + 1)}`;
    }
  
    let localeString;
    let N;
  
    if (Math.abs(x) >= 0.4) {
      localeString = x.toLocaleString(undefined, {
        minimumFractionDigits: this.basePrecision,
        maximumFractionDigits: this.basePrecision
      });
    } else {
      N = this.getRofPrecision(x);
      localeString = x.toPrecision(N);
    }
  
    return (localeString.length <= (7 + this.basePrecision)) ?
      localeString :
      this.formatFloat(x, N);
  }
  
  formatFloat(x: number, N?: number): string {
    if (Object.is(x, -0)) {
      return `-${x.toExponential(this.basePrecision)}`;
    }
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
    return this.basePrecision + (char < 4 ? 1 : 0);
  }
}

const rof = new Rof();

export const ruleOfFour = x => rof.ruleOfFour(x);
export const formatDecimal = x => rof.formatDecimal(x);
export const formatInteger = x => rof.formatInteger(x);
export const formatFloat = x => rof.formatFloat(x);
export const format = x => rof.format(x);
