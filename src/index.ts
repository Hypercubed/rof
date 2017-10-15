import { RofFormat } from './RofFormat';

export * from './RofFormat';

const rof = new RofFormat();

export const ruleOfFour = rof.ruleOfFour;
export const formatDecimal = rof.formatDecimal;
export const formatInteger = rof.formatInteger;
export const formatFloat = rof.formatFloat;
export const format = rof.format;
export const pickFormat = rof.pickFormat;
