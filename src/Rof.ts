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

  /**
   * Formats a value as an integer (using `formatInteger`)
   * or a decimal (using `formatDecimal`) if the value is not an integer.
   * 
   * @param x  The number to format.
   * @returns  A string with a formatted representation of the given number.
   */
  format = (x: number): string => {
    return this.isInteger(x) ? this.formatInteger(x) : this.formatDecimal(x);
  }
  
  /**
   * Formats a value as an integer
   * or float (using `formatFloat`) for large values.
   * 
   * @param x  The number to format.
   * @returns  A string with a formatted representation of the given number.
   */
  formatInteger = (x: number): string => {
    x = Math.round(x);
  
    if (Object.is(x, -0)) {
      return '-0';
    }
  
    const localeString  = this.intNumberFormat.format(x);
  
    return (localeString.length <= (7 + this.options.minimumSignificantDigits)) ?
      localeString :
      this.formatFloat(x);
  }

  /**
   * Formats a value as a decimal
   * or float (using `formatFloat`) for large or small values.
   * 
   * @param x  The number to format.
   * @returns  A string with a formatted representation of the given number.
   */
  formatDecimal = (x: number): string => {
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
      this._formatFloat(x, N);
  }
  
  /**
   * Formats a value as a float (exponential) using the rule of four to determine the precision.
   * 
   * @param x  The number to format.
   * @returns  A string with a formatted representation of the given number.
   */
  formatFloat = (x: number): string => {
    const N = this.getRofPrecision(x);
    return this._formatFloat(x, N);
  }

  /**
   * Formats a value as a decimal using the strict rule of four to determine the precision.
   * 
   * rule of four:
   * * uses three decimal places for ratios in the range 0.040-0.399
   * * two decimals for 0.40-3.99, one decimal for 4.0-39.9, etc
   * 
   * @param x  The number to format.
   * @returns  A string with a formatted representation of the given number.
   */
  ruleOfFour = (x: number): string => {
    const N = this.getRofPrecision(x);
    return x.toPrecision(N);
  }

  /**
   * Given an array of values, returns the best formatter method
   * 
   * @param arr  The values used to determine the optimal formatting method
   * @returns    The optimal formatting method
   */
  pickFormat = (arr: number[]): string | any => {
    const stats = this.getStats(arr);
    if (stats.integers) return (stats.maxLog > 6) ? this.formatFloat : this.formatInteger;
    if (stats.maxLog >= 6 || stats.minLog <= -6) {
      return this.formatFloat;
    }
    return this.formatDecimal;
  }

  /**
   * Formats a value as a float (exponential) using the rule of four to determine the precision.
   * 
   * @param x  The number to format.
   * @param N  The precision.
   * @returns  A string with a formatted representation of the given number.
   */
  private _formatFloat(x: number, N?: number): string {
    if (Object.is(x, -0)) {
      return `-${x.toExponential(this.options.minimumSignificantDigits)}`;
    }
    N = typeof N === 'number' ? N : this.getRofPrecision(x);
    return x.toExponential(N - 1);
  }

  /**
   * Given an array of values, returns statistics needed to determine the best formatter method
   * 
   * @param arr  The values used to determine the optimal formatting method
   * @returns    The statistics needed to determine the best formatting method
   */
  private getStats(arr: number[]): any {
    let integers = true;
    let minLog = Infinity;
    let maxLog = -Infinity;

    arr.forEach(n => {
      integers = integers && this.isInteger(n);

      const l = n === 0 ? 1 : Math.log10(Math.abs(n));
      minLog = Math.min(l, minLog);
      maxLog = Math.max(l, maxLog);
    });

    return {
      integers,
      minLog,
      maxLog
    };
  }
  
  /**
   * Given an number, returns the precision using the role of four
   * 
   * @param x  The number.
   * @returns  A Number indicating the precision using the role of four
   */
  private getRofPrecision(x: number): number {
    const match = ('' + x).match(/[1-9]/);
    const char = match ? +match[0] : 0;
    return char < 4 ? this.options.maximumSignificantDigits : this.options.minimumSignificantDigits;
  }

  /**
   * Determines if a value is an integer with the integer threshold 
   * 
   * @param x  The number.
   * @returns  A Boolean indicating whether or not the given value is an integer.
   */
  private isInteger(x: number): boolean {
    if (x === 0) return true;
    if (x < 1 && x > -1) return false;
    return Number.isInteger(x) || Math.abs(Math.round(x) / x - 1) <= this.options.integerThreshold;
  }
}

const rof = new Rof();

export const ruleOfFour = rof.ruleOfFour;
export const formatDecimal = rof.formatDecimal;
export const formatInteger = rof.formatInteger;
export const formatFloat = rof.formatFloat;
export const format = rof.format;
export const pickFormat = rof.pickFormat;
