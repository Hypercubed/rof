# Rule of Four

Determine the most reasonable display format for a given numeric value or set of numeric values. Using a modified version of the [rule of four](http://www.bmj.com/content/350/bmj.h1845) and other methods.

## Introduction

Ideally, when working numeric data, one should know the precision of the underlying data and display those values appropriately.  However, when developing software it is not always possible to pre-determine the precision. In addition, when using JavaScript, numbers are not often displayed as one would expect.  Take for example the following values and three common methods for generating a display string in JavaScript.

|               Input Value |                toLocaleString |    toPrecision (N=3) |        toExponential (N=2) |
|               ----------- |                -------------- |    ----------------- |               ------------ |
|                      0.04 |                          0.04 |               0.0400 |              4.00e-2 |
|                       0.2 |                           0.2 |                0.200 |              2.00e-1 |
|                   20.0001 |                            20 |                 20.0 |              2.00e+1 |
|                         2 |                             2 |                 2.00 |              2.00e+0 |
|                        20 |                            20 |                 20.0 |              2.00e+1 |
|                   1.2e+21 | 1,200,000,000,000,000,000,000 |             1.20e+21 |             1.20e+21 |
|             1234567891234 |             1,234,567,891,234 |             1.23e+12 |             1.23e+12 |
|                  0.002555 |                         0.003 |              0.00255 |              2.55e-3 |
|                0.00006777 |                             0 |            0.0000678 |              6.78e-5 |

Some issues we notices are:

* `toLocaleString` has inconsistent precision.  In many cases (for example 0.00255 and 2.00001) `toLocaleString` provides too low precision, in others (for example 1234567891234) the precision is unnecessarily high.
* All three methods make no distinction between integers, decimal, and floating point values.
* `toLocaleString` highly has inconsistent string size.  For example, displaying 1.2e+21 as a decimal results in an unnecessarily long string.

Additionally, given a set of values, the values should be formatted consistently for comparison to each other.

Therefore, the goals of this project are:

* Determine the display precision in a predictable manner.
* Preserve (as much as possible) display for integers, decimals, and floats.
* Display the smallest string necessary for the value.
* Given a set of values, determine the most consistent display format across the set.

To this end, this library makes use or the "rule of four" described in [Setting number of decimal places for reporting risk ratios: rule of four](http://www.bmj.com/content/350/bmj.h1845).  The rule of four is a simple method for determining appropriate number of decimal places to use when reporting risk ratios.  The rule states “Round the risk ratio to two significant digits if the leading non-zero digit is four or more, otherwise round to three;”.  We extend the rule here to other values.

## Getting Started

### Installing

```bash
npm install rof
```

The core formatting methods (with default options) can be imported directly:

```js
import { ruleOfFour, format, formatInteger, formatDecimal, formatFloat, pickFormat } from '.';
```

### Summary of Methods

**`ruleOfFour`:** Formats a value as a decimal using the strict rule of four to determine the precision.

**`formatFloat`:** Formats a value as a float (exponential) using the rule of four to determine the precision.

**`formatInteger`:** Formats a value as an integer or float (using `formatFloat`) for large values.

**`formatDecimal`:** Formats a value as a decimal or float (using `formatFloat`) for large or small values.

**`format`:** Formats a value as an integer (using `formatInteger`) or a decimal (using `formatDecimal`) if the value is not an integer.

**`pickFormat`:** Given an array of values, returns the best formatter method, from among the following three methods: `formatFloat`, `formatInteger`, and `formatDecimal`.

## API Reference

### `ruleOfFour(x: number): string`

Formats a value as a decimal using the strict rule of four to determine the precision.

|               Input Value |       toLocaleString |    toPrecision (N=3) |         Rule of Four |
|               ----------- |       -------------- |    ----------------- |         ------------ |
|                      0.04 |                 0.04 |               0.0400 |                0.040 |
|                       0.2 |                  0.2 |                0.200 |                0.200 |
|                       0.4 |                  0.4 |                0.400 |                 0.40 |
|                   2.00001 |                    2 |                 2.00 |                 2.00 |
|                   4.00001 |                    4 |                 4.00 |                  4.0 |
|                   20.0001 |                   20 |                 20.0 |                 20.0 |
|                   40.0001 |                   40 |                 40.0 |                   40 |
|                         2 |                    2 |                 2.00 |                 2.00 |
|                         4 |                    4 |                 4.00 |                  4.0 |
|                        20 |                   20 |                 20.0 |                 20.0 |
|                        40 |                   40 |                 40.0 |                   40 |
|                         0 |                    0 |                 0.00 |                 0.00 |
|                        -0 |                    0 |                 0.00 |                 0.00 |
|                  Infinity |                    ∞ |             Infinity |             Infinity |
|                 -Infinity |                   -∞ |            -Infinity |            -Infinity |

### `formatFloat(x: number): string`

Returns the value formatted as a floating point value using the following rules:

* If `x === -0` returns `-0.00e+0`
* otherwise returns `x.toExponential(N)` (where N is the precision following the rule of four)

|               Input Value |       toLocaleString |    toPrecision (N=3) |         Rule of Four |          formatFloat |
|               ----------- |       -------------- |    ----------------- |         ------------ |               ------ |
|                      0.04 |                 0.04 |               0.0400 |                0.040 |               4.0e-2 |
|                       0.2 |                  0.2 |                0.200 |                0.200 |              2.00e-1 |
|                       0.4 |                  0.4 |                0.400 |                 0.40 |               4.0e-1 |
|                   2.00001 |                    2 |                 2.00 |                 2.00 |              2.00e+0 |
|                   4.00001 |                    4 |                 4.00 |                  4.0 |               4.0e+0 |
|                   20.0001 |                   20 |                 20.0 |                 20.0 |              2.00e+1 |
|                   40.0001 |                   40 |                 40.0 |                   40 |               4.0e+1 |
|                         2 |                    2 |                 2.00 |                 2.00 |              2.00e+0 |
|                         4 |                    4 |                 4.00 |                  4.0 |               4.0e+0 |
|                        20 |                   20 |                 20.0 |                 20.0 |              2.00e+1 |
|                        40 |                   40 |                 40.0 |                   40 |               4.0e+1 |
|                         0 |                    0 |                 0.00 |                 0.00 |              0.00e+0 |
|                        -0 |                    0 |                 0.00 |                 0.00 |              0.00e+0 |
|                  Infinity |                    ∞ |             Infinity |             Infinity |             Infinity |
|                 -Infinity |                   -∞ |            -Infinity |            -Infinity |            -Infinity |

### `formatInteger(x: number): string`

Returns the value formatted as an integer using with the following rules:

* If the `Math.round(x) === -0` returns `-0`
* if the resulting character length is <= 9 returns `Math.round(x).toLocaleString()`
* otherwise, `formatFloat(Math.round(x))`

|               Input Value |       toLocaleString |    toPrecision (N=3) |         Rule of Four |        formatInteger |
|               ----------- |       -------------- |    ----------------- |         ------------ |               ------ |
|                      0.04 |                 0.04 |               0.0400 |                0.040 |                    0 |
|                       0.2 |                  0.2 |                0.200 |                0.200 |                    0 |
|                       0.4 |                  0.4 |                0.400 |                 0.40 |                    0 |
|                   2.00001 |                    2 |                 2.00 |                 2.00 |                    2 |
|                   4.00001 |                    4 |                 4.00 |                  4.0 |                    4 |
|                   20.0001 |                   20 |                 20.0 |                 20.0 |                   20 |
|                   40.0001 |                   40 |                 40.0 |                   40 |                   40 |
|                         2 |                    2 |                 2.00 |                 2.00 |                    2 |
|                         4 |                    4 |                 4.00 |                  4.0 |                    4 |
|                        20 |                   20 |                 20.0 |                 20.0 |                   20 |
|                        40 |                   40 |                 40.0 |                   40 |                   40 |
|                         0 |                    0 |                 0.00 |                 0.00 |                    0 |
|                        -0 |                    0 |                 0.00 |                 0.00 |                   -0 |
|                  Infinity |                    ∞ |             Infinity |             Infinity |                    ∞ |
|                 -Infinity |                   -∞ |            -Infinity |            -Infinity |                   -∞ |

### `formatDecimal(x: number): string`

Returns the value formatted as a decimal using with the following rules:

* If the value is `-0`, returns `-0.00`
* if `Math.abs(x) < 0.4` and the resulting character length is <= 9, returns `x.toPrecision(N)` (where N is the precision following the rule of four)
* if `Math.abs(x) >= 0.4` and the resulting character length is <= 9, returns `x.toLocaleString(locales, {minimumFractionDigits: 2, maximumFractionDigits: 2})` 
* otherwise, returns `formatFloat(x)`.

|               Input Value |       toLocaleString |    toPrecision (N=3) |         Rule of Four |        formatDecimal |
|               ----------- |       -------------- |    ----------------- |         ------------ |               ------ |
|                      0.04 |                 0.04 |               0.0400 |                0.040 |                0.040 |
|                       0.2 |                  0.2 |                0.200 |                0.200 |                0.200 |
|                       0.4 |                  0.4 |                0.400 |                 0.40 |                 0.40 |
|                   2.00001 |                    2 |                 2.00 |                 2.00 |                 2.00 |
|                   4.00001 |                    4 |                 4.00 |                  4.0 |                 4.00 |
|                   20.0001 |                   20 |                 20.0 |                 20.0 |                20.00 |
|                   40.0001 |                   40 |                 40.0 |                   40 |                40.00 |
|                         2 |                    2 |                 2.00 |                 2.00 |                 2.00 |
|                         4 |                    4 |                 4.00 |                  4.0 |                 4.00 |
|                        20 |                   20 |                 20.0 |                 20.0 |                20.00 |
|                        40 |                   40 |                 40.0 |                   40 |                40.00 |
|                         0 |                    0 |                 0.00 |                 0.00 |                 0.00 |
|                        -0 |                    0 |                 0.00 |                 0.00 |                -0.00 |
|                  Infinity |                    ∞ |             Infinity |             Infinity |                    ∞ |
|                 -Infinity |                   -∞ |            -Infinity |            -Infinity |                   -∞ |

### `format(x: number): string`

Returns the value formatted with the following rules:

* If `x` is an integer (within a given threshold) returns `formatInteger(x)` .
* otherwise, returns `formatDecimal(x)`.

|               Input Value |       toLocaleString |    toPrecision (N=3) |         Rule of Four |               format |
|               ----------- |       -------------- |    ----------------- |         ------------ |               ------ |
|                      0.04 |                 0.04 |               0.0400 |                0.040 |                0.040 |
|                       0.2 |                  0.2 |                0.200 |                0.200 |                0.200 |
|                       0.4 |                  0.4 |                0.400 |                 0.40 |                 0.40 |
|                   2.00001 |                    2 |                 2.00 |                 2.00 |                 2.00 |
|                   4.00001 |                    4 |                 4.00 |                  4.0 |                 4.00 |
|                   20.0001 |                   20 |                 20.0 |                 20.0 |                20.00 |
|                   40.0001 |                   40 |                 40.0 |                   40 |                40.00 |
|                         2 |                    2 |                 2.00 |                 2.00 |                    2 |
|                         4 |                    4 |                 4.00 |                  4.0 |                    4 |
|                        20 |                   20 |                 20.0 |                 20.0 |                   20 |
|                        40 |                   40 |                 40.0 |                   40 |                   40 |
|                         0 |                    0 |                 0.00 |                 0.00 |                    0 |
|                        -0 |                    0 |                 0.00 |                 0.00 |                   -0 |
|                  Infinity |                    ∞ |             Infinity |             Infinity |                    ∞ |
|                 -Infinity |                   -∞ |            -Infinity |            -Infinity |                   -∞ |

Other sample outputs below:

#### Integers

|               Input Value |       toLocaleString |    toPrecision (N=3) |         Rule of Four |               format |
|               ----------- |       -------------- |    ----------------- |         ------------ |               ------ |
|                         1 |                    1 |                 1.00 |                 1.00 |                    1 |
|                         0 |                    0 |                 0.00 |                 0.00 |                    0 |
|                         4 |                    4 |                 4.00 |                  4.0 |                    4 |
|                       234 |                  234 |                  234 |                  234 |                  234 |
|                       396 |                  396 |                  396 |                  396 |                  396 |
|                      3728 |                3,728 |              3.73e+3 |              3.73e+3 |                3,728 |
|                       511 |                  511 |                  511 |               5.1e+2 |                  511 |
|                      2156 |                2,156 |              2.16e+3 |              2.16e+3 |                2,156 |
|                     85230 |               85,230 |              8.52e+4 |               8.5e+4 |               85,230 |
|                    428950 |              428,950 |              4.29e+5 |               4.3e+5 |              428,950 |
|                    138612 |              138,612 |              1.39e+5 |              1.39e+5 |              138,612 |
|                   2826058 |            2,826,058 |              2.83e+6 |              2.83e+6 |            2,826,058 |
|                   7984085 |            7,984,085 |              7.98e+6 |               8.0e+6 |            7,984,085 |
|                  39542624 |           39,542,624 |              3.95e+7 |              3.95e+7 |              3.95e+7 |
|                  19448594 |           19,448,594 |              1.94e+7 |              1.94e+7 |              1.94e+7 |
|                 498762759 |          498,762,759 |              4.99e+8 |               5.0e+8 |               5.0e+8 |
|                        -5 |                   -5 |                -5.00 |                 -5.0 |                   -5 |
|                        -4 |                   -4 |                -4.00 |                 -4.0 |                   -4 |
|                       -18 |                  -18 |                -18.0 |                -18.0 |                  -18 |
|                      -467 |                 -467 |                 -467 |              -4.7e+2 |                 -467 |
|                      -360 |                 -360 |                 -360 |                 -360 |                 -360 |
|                     -1997 |               -1,997 |             -2.00e+3 |             -2.00e+3 |               -1,997 |
|                     -5302 |               -5,302 |             -5.30e+3 |              -5.3e+3 |               -5,302 |
|                    -33667 |              -33,667 |             -3.37e+4 |             -3.37e+4 |              -33,667 |
|                    -86551 |              -86,551 |             -8.66e+4 |              -8.7e+4 |              -86,551 |
|                   -412564 |             -412,564 |             -4.13e+5 |              -4.1e+5 |             -412,564 |
|                   -499362 |             -499,362 |             -4.99e+5 |              -5.0e+5 |             -499,362 |
|                  -1497968 |           -1,497,968 |             -1.50e+6 |             -1.50e+6 |             -1.50e+6 |
|                  -2995607 |           -2,995,607 |             -3.00e+6 |             -3.00e+6 |             -3.00e+6 |
|                 -30457267 |          -30,457,267 |             -3.05e+7 |             -3.05e+7 |             -3.05e+7 |
|                 -63377713 |          -63,377,713 |             -6.34e+7 |              -6.3e+7 |              -6.3e+7 |
|                -314199248 |         -314,199,248 |             -3.14e+8 |             -3.14e+8 |             -3.14e+8 |

#### Decimals and Floats

|               Input Value |       toLocaleString |    toPrecision (N=3) |         Rule of Four |               format |
|               ----------- |       -------------- |    ----------------- |         ------------ |               ------ |
|         0.767411739182299 |                0.767 |                0.767 |                 0.77 |                 0.77 |
|       0.16508913624765253 |                0.165 |                0.165 |                0.165 |                0.165 |
|         9.569596429495878 |                 9.57 |                 9.57 |                  9.6 |                 9.57 |
|        44.633668449502025 |               44.634 |                 44.6 |                   45 |                44.63 |
|         66.36058993193781 |               66.361 |                 66.4 |                   66 |                66.36 |
|        236.50398366071715 |              236.504 |                  237 |                  237 |               236.50 |
|        385.04081126722724 |              385.041 |                  385 |                  385 |               385.04 |
|        2012.6858496920831 |            2,012.686 |              2.01e+3 |              2.01e+3 |             2,012.69 |
|        2355.3253359621062 |            2,355.325 |              2.36e+3 |              2.36e+3 |             2,355.33 |
|        3883.8132256163394 |            3,883.813 |              3.88e+3 |              3.88e+3 |             3,883.81 |
|        29654.129675051678 |            29,654.13 |              2.97e+4 |              2.97e+4 |            29,654.13 |
|        423219.76370784326 |          423,219.764 |              4.23e+5 |               4.2e+5 |               4.2e+5 |
|          682694.689384022 |          682,694.689 |              6.83e+5 |               6.8e+5 |               6.8e+5 |
|         4936032.232083635 |        4,936,032.232 |              4.94e+6 |               4.9e+6 |               4.9e+6 |
|        3924507.9287528917 |        3,924,507.929 |              3.92e+6 |              3.92e+6 |              3.92e+6 |
|        1121775.0908455115 |        1,121,775.091 |              1.12e+6 |              1.12e+6 |              1.12e+6 |
|        10578661.867027273 |       10,578,661.867 |              1.06e+7 |              1.06e+7 |              1.06e+7 |
|         389792236.9268605 |      389,792,236.927 |              3.90e+8 |              3.90e+8 |              3.90e+8 |
|      0.030308351045653104 |                 0.03 |               0.0303 |               0.0303 |               0.0303 |
|       0.37989248198638115 |                 0.38 |                0.380 |                0.380 |                0.380 |
|      0.009126632416022297 |                0.009 |              0.00913 |               0.0091 |               0.0091 |
|      0.020924021452634466 |                0.021 |               0.0209 |               0.0209 |               0.0209 |
|   0.000049974268339024964 |                    0 |            0.0000500 |             0.000050 |             0.000050 |
|      0.002445454092493252 |                0.002 |              0.00245 |              0.00245 |              0.00245 |
|    0.00006670078980387038 |                    0 |            0.0000667 |             0.000067 |             0.000067 |
|    0.00023263152347463692 |                    0 |             0.000233 |             0.000233 |             0.000233 |
|   0.000008228857414663178 |                    0 |           0.00000823 |            0.0000082 |            0.0000082 |
|   0.000028614051944731547 |                    0 |            0.0000286 |            0.0000286 |            0.0000286 |
|      6.667119786706243e-7 |                    0 |              6.67e-7 |               6.7e-7 |               6.7e-7 |
|     5.8605715503222685e-8 |                    0 |              5.86e-8 |               5.9e-8 |               5.9e-8 |
|     1.8237805354572288e-8 |                    0 |              1.82e-8 |              1.82e-8 |              1.82e-8 |
|       7.49612642450942e-8 |                    0 |              7.50e-8 |               7.5e-8 |               7.5e-8 |
|      9.327911102521533e-9 |                    0 |              9.33e-9 |               9.3e-9 |               9.3e-9 |
|      1.181162832355276e-9 |                    0 |              1.18e-9 |              1.18e-9 |              1.18e-9 |
|       -0.7600695370948154 |                -0.76 |               -0.760 |                -0.76 |                -0.76 |
|        -1.781100859767616 |               -1.781 |                -1.78 |                -1.78 |                -1.78 |
|        -8.754569639736625 |               -8.755 |                -8.75 |                 -8.8 |                -8.75 |
|       -3.2390801713915063 |               -3.239 |                -3.24 |                -3.24 |                -3.24 |
|         -17.8859938122373 |              -17.886 |                -17.9 |                -17.9 |               -17.89 |
|        -130.5215974441648 |             -130.522 |                 -131 |                 -131 |              -130.52 |
|        -324.5343291038001 |             -324.534 |                 -325 |                 -325 |              -324.53 |
|         -3554.46555809074 |           -3,554.466 |             -3.55e+3 |             -3.55e+3 |            -3,554.47 |
|        -3411.666120331296 |           -3,411.666 |             -3.41e+3 |             -3.41e+3 |            -3,411.67 |
|        -43599.62195662187 |          -43,599.622 |             -4.36e+4 |              -4.4e+4 |              -4.4e+4 |
|        -98189.53648882844 |          -98,189.536 |             -9.82e+4 |              -9.8e+4 |              -9.8e+4 |
|        -357442.9233516688 |         -357,442.923 |             -3.57e+5 |             -3.57e+5 |             -3.57e+5 |
|       -464747.87306420476 |         -464,747.873 |             -4.65e+5 |              -4.6e+5 |              -4.6e+5 |
|        -131706.4677680402 |         -131,706.468 |             -1.32e+5 |             -1.32e+5 |             -1.32e+5 |
|         -599752.080929028 |         -599,752.081 |             -6.00e+5 |              -6.0e+5 |              -6.0e+5 |
|        -10356429.76627571 |      -10,356,429.766 |             -1.04e+7 |             -1.04e+7 |             -1.04e+7 |
|        -67522686.27283327 |      -67,522,686.273 |             -6.75e+7 |              -6.8e+7 |              -6.8e+7 |
|       -446240278.38519365 |     -446,240,278.385 |             -4.46e+8 |              -4.5e+8 |              -4.5e+8 |
|     -0.047570797733379494 |               -0.048 |              -0.0476 |               -0.048 |               -0.048 |
|      -0.40606861218027934 |               -0.406 |               -0.406 |                -0.41 |                -0.41 |
|    -0.0037719778035773446 |               -0.004 |             -0.00377 |             -0.00377 |             -0.00377 |
|    -0.0005854655216267713 |               -0.001 |            -0.000585 |             -0.00059 |             -0.00059 |
|    -0.0009629408942679378 |               -0.001 |            -0.000963 |             -0.00096 |             -0.00096 |
|     -0.002278157157351423 |               -0.002 |             -0.00228 |             -0.00228 |             -0.00228 |
|  -0.000055188346473247886 |                   -0 |           -0.0000552 |            -0.000055 |            -0.000055 |
|   -0.00046808214910745374 |                   -0 |            -0.000468 |             -0.00047 |             -0.00047 |
|   -0.00000763481366128597 |                   -0 |          -0.00000763 |           -0.0000076 |              -7.6e-6 |
|  -0.000024127446661277244 |                   -0 |           -0.0000241 |           -0.0000241 |             -2.41e-5 |
|    -2.2228413638871935e-7 |                   -0 |             -2.22e-7 |             -2.22e-7 |             -2.22e-7 |
|     -2.652616482513714e-7 |                   -0 |             -2.65e-7 |             -2.65e-7 |             -2.65e-7 |
|     -7.727311790760662e-8 |                   -0 |             -7.73e-8 |              -7.7e-8 |              -7.7e-8 |
|    -3.6526232386466837e-7 |                   -0 |             -3.65e-7 |             -3.65e-7 |             -3.65e-7 |
|      -9.78731507500792e-9 |                   -0 |             -9.79e-9 |              -9.8e-9 |              -9.8e-9 |
|     -2.195914860919613e-8 |                   -0 |             -2.20e-8 |             -2.20e-8 |             -2.20e-8 |

#### Special

|               Input Value |       toLocaleString |    toPrecision (N=3) |         Rule of Four |               format |
|               ----------- |       -------------- |    ----------------- |         ------------ |               ------ |
|                       NaN |                  NaN |                  NaN |                  NaN |                  NaN |
|                     1 + 2 |                    3 |                 3.00 |                 3.00 |                    3 |
|            (0.1 + 0.2)*10 |                    3 |                 3.00 |                 3.00 |                 3.00 |
|                        PI |                3.142 |                 3.14 |                 3.14 |                 3.14 |
|                         E |                2.718 |                 2.72 |                 2.72 |                 2.72 |
|                     SQRT2 |                1.414 |                 1.41 |                 1.41 |                 1.41 |
|                   EPSILON |                    0 |             2.22e-16 |             2.22e-16 |             2.22e-16 |

### `pickFormat(arr: number[]): function`

Given an array of values, returns the best formatting method using the following rules:

* If all values are integers:
  * and the maximum `Log10` of the values is <= 6, returns `formatInteger`.
  * otherwise, returns `formatFloat`.
* If not all values are integers:
  * and the maximum `Log10` of the values is >= 6 or minimum `Log10` of the values <= -6, returns `formatFloat`
  * otherwise, returns `formatDecimal`

### `RofFormat` class

The RofFormat object is a constructor encapsulating the methods above and allowing customization.

```
new RofFormat(locales?: string | string[], options?: RofFormatOptions)
```

`locales` parameter is a string or array passed to internal usage of [NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat).

`options` operator is an object with some or all of the following properties:

**minimumSignificantDigits**
The minimum number of integer digits to use. The default is `2`.

**maximumSignificantDigits**
The maximum number of significant digits to use. The default is `minimumSignificantDigits + 1`

**integerThreshold**
The threshold used to determine if a value is an integer.  The default is `Number.EPSILON`.

Other `options` values are passed to internal usage of [NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat).

## License

This project is licensed under the MIT License - see the LICENSE file for details
