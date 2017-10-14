export interface RofOptions extends Intl.NumberFormatOptions {
  integerThreshold?: number;
}

export interface RofResolvedOptions extends Intl.NumberFormatOptions {
  integerThreshold: number;
  minimumSignificantDigits: number;
  maximumSignificantDigits: number;
}

export class Rof {
  private intNumberFormat: Intl.NumberFormat;
  private decNumberFormat: Intl.NumberFormat;
  private options: RofResolvedOptions;

  constructor(locales?: string | string[], options?: RofOptions) {
    this.options = {
      minimumSignificantDigits: 2,
      integerThreshold: Number.EPSILON,
      style: 'decimal',
      ...options
    } as any;

    if (typeof this.options.maximumSignificantDigits === 'undefined') {
      this.options.maximumSignificantDigits = this.options.minimumSignificantDigits + 1;
    }

    const numberFormatOptions: Intl.NumberFormatOptions = {
      ...options
    };

    this.intNumberFormat = new Intl.NumberFormat(locales, numberFormatOptions);

    this.decNumberFormat = new Intl.NumberFormat(locales, {
      minimumFractionDigits: this.options.minimumSignificantDigits,
      maximumFractionDigits: this.options.minimumSignificantDigits,
      ...numberFormatOptions
    });
  }

  format(x: number): string {
    return this.isInteger(x) ? this.formatInteger(x) : this.formatDecimal(x);
  }
  
  formatInteger(x: number): string {
    x = Math.round(x);
  
    if (Object.is(x, -0)) {
      return '-0';
    }
  
    const localeString  = this.intNumberFormat.format(x);
  
    return (localeString.length <= (7 + this.options.minimumSignificantDigits)) ?
      localeString :
      this.formatFloat(x);
  }

  formatDecimal(x: number): string {
    if (Object.is(x, -0)) {
      return `-${x.toPrecision(this.options.minimumSignificantDigits + 1)}`;
    }
  
    let localeString;
    let N;
  
    if (Math.abs(x) >= 0.4) {
      localeString = this.decNumberFormat.format(x);
    } else {
      N = this.getRofPrecision(x);
      localeString = x.toPrecision(N);
    }
  
    return (localeString.length <= (7 + this.options.minimumSignificantDigits)) ?
      localeString :
      this.formatFloat(x, N);
  }
  
  formatFloat(x: number, N?: number): string {
    if (Object.is(x, -0)) {
      return `-${x.toExponential(this.options.minimumSignificantDigits)}`;
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
    return char < 4 ? this.options.maximumSignificantDigits : this.options.minimumSignificantDigits;
  }

  private isInteger(x: number): boolean {
    if (x === 0) return true;
    if (x < 1 && x > -1) return false;
    return Number.isInteger(x) || Math.abs(Math.round(x) / x - 1) <= this.options.integerThreshold;
  }
}

const rof = new Rof();

export const ruleOfFour = x => rof.ruleOfFour(x);
export const formatDecimal = x => rof.formatDecimal(x);
export const formatInteger = x => rof.formatInteger(x);
export const formatFloat = x => rof.formatFloat(x);
export const format = x => rof.format(x);
