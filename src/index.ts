import { Rof } from './Rof';

export * from './Rof';

const rof = new Rof();

export const ruleOfFour = rof.ruleOfFour;
export const formatDecimal = rof.formatDecimal;
export const formatInteger = rof.formatInteger;
export const formatFloat = rof.formatFloat;
export const format = rof.format;
export const pickFormat = rof.pickFormat;
