# Rule of Four

Determine the most resonable display format for a given numeric value. Using a modified version of the [rule of four](http://www.bmj.com/content/350/bmj.h1845) and other methods.

Goals:
  * Preserve display for integers and floats.
  * Limit to a precision of 2 or 3 following the rule of four.
  * Display the smaller of fixed or exponential formatting.

Coming soon?
  * Detemine optimal format give an array of values.

## Rule of Four (`ruleOfFour` function)

```
ruleOfFour(x: number): string
```

> The rule states: “Round the risk ratio to two significant digits if the leading non-zero digit is four or more, otherwise round to three;” it uses three decimal places for ratios in the range 0.040-0.399, two decimals for 0.40-3.99, one decimal for 4.0-39.9, and so on.
> -- [Setting number of decimal places for reporting risk ratios: rule of four](http://www.bmj.com/content/350/bmj.h1845).

| Input Value |       toLocaleString |    toPrecision (N=3) |         Rule of Four |
| ----------- |       -------------- |    ----------------- |         ------------ |
| 0.04        |                 0.04 |               0.0400 |                0.040 |
| 0.2         |                  0.2 |                0.200 |                0.200 |
| 0.4         |                  0.4 |                0.400 |                 0.40 |
| 2           |                    2 |                 2.00 |                 2.00 |
| 4           |                    4 |                 4.00 |                  4.0 |
| 20          |                   20 |                 20.0 |                 20.0 |
| 40          |                   40 |                 40.0 |                   40 |


## `formatInteger` function

```
formatInteger(x: number): string
```

The `formatInteger` function returns the value formatted with the following rules:

* Returns `-0` if the value is `-0`
* Returns a string that is the smaller of the following:
  * The result of `Math.round(x).toLocaleString()`
  * The result of `Math.round(x).toExponential(N)` where N is the presision following the rule of four.

| Input Value |       toLocaleString |    toPrecision (N=3) |        formatInteger |
| ----------- |       -------------- |    ----------------- |        ------------- |
|        0.04 |                 0.04 |               0.0400 |                    0 |
|         0.2 |                  0.2 |                0.200 |                    0 |
|         0.4 |                  0.4 |                0.400 |                    0 |
|           2 |                    2 |                 2.00 |                    2 |
|           4 |                    4 |                 4.00 |                    4 |
|          20 |                   20 |                 20.0 |                   20 |
|          40 |                   40 |                 40.0 |                   40 |
|           0 |                    0 |                 0.00 |                    0 |
|          -0 |                    0 |                 0.00 |                   -0 |
|    Infinity |                    ∞ |             Infinity |                    ∞ |
|   -Infinity |                   -∞ |            -Infinity |                   -∞ |

## `formatDecimal` function

```
formatDecimal(x: number): string
```

The `formatDecimal` function returns the value formatted with the following rules:

* Returns `x.toLocaleString()` for `Infinity` and `-Infinity`.
* Returns `-0.00` if the value is `-0`
* Returns a string that is the smaller of the following:
  * The result of `x.toExponential(N)` where N is the presision following the rule of four.
  * If:
    * `Math.abs(x) >= 0.4`: `x.toFixed(2)`
    * Otherwise, `x.toPrecision(N)` where N is the presision following the rule of four.

| Input Value |       toLocaleString |    toPrecision (N=3) |        formatDecimal |
| ----------- |       -------------- |    ----------------- |        ------------- |
|        0.04 |                 0.04 |               0.0400 |                0.040 |
|         0.2 |                  0.2 |                0.200 |                0.200 |
|         0.4 |                  0.4 |                0.400 |                 0.40 |
|           2 |                    2 |                 2.00 |                 2.00 |
|           4 |                    4 |                 4.00 |                 4.00 |
|          20 |                   20 |                 20.0 |                20.00 |
|          40 |                   40 |                 40.0 |                40.00 |
|           0 |                    0 |                 0.00 |                 0.00 |
|          -0 |                    0 |                 0.00 |                -0.00 |
|    Infinity |                    ∞ |             Infinity |                    ∞ |
|   -Infinity |                   -∞ |            -Infinity |                   -∞ |

## `format` function

```
format(x: number): string
```

The `format` function returns the value formatted with the following rules:

* Returns `formatInteger(x)` if `x` is an integer defined by `parseInt(x) === parseFloat(x)`.
* Returns `formatDecimal(x)` otherwise.

| Input Value |       toLocaleString |    toPrecision (N=3) |         Rule of Four | format               |
| ----------- |       -------------- |    ----------------- |         ------------ | -------------------- |
|        0.04 |                 0.04 |               0.0400 |                0.040 |                0.040 |
|         0.2 |                  0.2 |                0.200 |                0.200 |                0.200 |
|         0.4 |                  0.4 |                0.400 |                 0.40 |                 0.40 |
|           2 |                    2 |                 2.00 |                 2.00 |                    2 |
|           4 |                    4 |                 4.00 |                  4.0 |                    4 |
|          20 |                   20 |                 20.0 |                 20.0 |                   20 |
|          40 |                   40 |                 40.0 |                   40 |                   40 |
|           0 |                    0 |                 0.00 |                 0.00 |                    0 |
|          -0 |                    0 |                 0.00 |                 0.00 |                   -0 |
|    Infinity |                    ∞ |             Infinity |             Infinity |                    ∞ |
|   -Infinity |                   -∞ |            -Infinity |            -Infinity |                   -∞ |

Other sample outputs below:

### Integers

|               Input Value |       toLocaleString |    toPrecision (N=3) |         Rule of Four |               format |
|               ----------- |       -------------- |    ----------------- |         ------------ |               ------ |
|                         1 |                    1 |                 1.00 |                 1.00 |                    1 |
|                         5 |                    5 |                 5.00 |                  5.0 |                    5 |
|                        10 |                   10 |                 10.0 |                 10.0 |                   10 |
|                        50 |                   50 |                 50.0 |                   50 |                   50 |
|                       100 |                  100 |                  100 |                  100 |                  100 |
|                       500 |                  500 |                  500 |               5.0e+2 |                  500 |
|                      1000 |                1,000 |              1.00e+3 |              1.00e+3 |                1,000 |
|                      5000 |                5,000 |              5.00e+3 |               5.0e+3 |                5,000 |
|                     10000 |               10,000 |              1.00e+4 |              1.00e+4 |               10,000 |
|                     50000 |               50,000 |              5.00e+4 |               5.0e+4 |               50,000 |
|                    100000 |              100,000 |              1.00e+5 |              1.00e+5 |              100,000 |
|                    500000 |              500,000 |              5.00e+5 |               5.0e+5 |              500,000 |
|                   1000000 |            1,000,000 |              1.00e+6 |              1.00e+6 |             1.000e+6 |
|                   5000000 |            5,000,000 |              5.00e+6 |               5.0e+6 |              5.00e+6 |
|                  10000000 |           10,000,000 |              1.00e+7 |              1.00e+7 |             1.000e+7 |
|                  50000000 |           50,000,000 |              5.00e+7 |               5.0e+7 |              5.00e+7 |
|                 100000000 |          100,000,000 |              1.00e+8 |              1.00e+8 |             1.000e+8 |
|                 500000000 |          500,000,000 |              5.00e+8 |               5.0e+8 |              5.00e+8 |
|                       0.1 |                  0.1 |                0.100 |                0.100 |                0.100 |
|                       0.5 |                  0.5 |                0.500 |                 0.50 |                 0.50 |
|                      0.01 |                 0.01 |               0.0100 |               0.0100 |               0.0100 |
|                      0.05 |                 0.05 |               0.0500 |                0.050 |                0.050 |
|                     0.001 |                0.001 |              0.00100 |              0.00100 |              0.00100 |
|                     0.005 |                0.005 |              0.00500 |               0.0050 |               0.0050 |
|                    0.0001 |                    0 |             0.000100 |             0.000100 |             0.000100 |
|                    0.0005 |                0.001 |             0.000500 |              0.00050 |              0.00050 |
|                   0.00001 |                    0 |            0.0000100 |            0.0000100 |             1.000e-5 |
|                   0.00005 |                    0 |            0.0000500 |             0.000050 |              5.00e-5 |
|                  0.000001 |                    0 |           0.00000100 |           0.00000100 |             1.000e-6 |
|                  0.000005 |                    0 |           0.00000500 |            0.0000050 |              5.00e-6 |
|                      1e-7 |                    0 |              1.00e-7 |              1.00e-7 |              1.00e-7 |
|                      5e-7 |                    0 |              5.00e-7 |               5.0e-7 |               5.0e-7 |
|                      1e-8 |                    0 |              1.00e-8 |              1.00e-8 |              1.00e-8 |
|                      5e-8 |                    0 |              5.00e-8 |               5.0e-8 |               5.0e-8 |
|                        -1 |                   -1 |                -1.00 |                -1.00 |                   -1 |
|                        -5 |                   -5 |                -5.00 |                 -5.0 |                   -5 |
|                       -10 |                  -10 |                -10.0 |                -10.0 |                  -10 |
|                       -50 |                  -50 |                -50.0 |                  -50 |                  -50 |
|                      -100 |                 -100 |                 -100 |                 -100 |                 -100 |
|                      -500 |                 -500 |                 -500 |              -5.0e+2 |                 -500 |
|                     -1000 |               -1,000 |             -1.00e+3 |             -1.00e+3 |               -1,000 |
|                     -5000 |               -5,000 |             -5.00e+3 |              -5.0e+3 |               -5,000 |
|                    -10000 |              -10,000 |             -1.00e+4 |             -1.00e+4 |              -10,000 |
|                    -50000 |              -50,000 |             -5.00e+4 |              -5.0e+4 |              -50,000 |
|                   -100000 |             -100,000 |             -1.00e+5 |             -1.00e+5 |             -100,000 |
|                   -500000 |             -500,000 |             -5.00e+5 |              -5.0e+5 |             -500,000 |
|                  -1000000 |           -1,000,000 |             -1.00e+6 |             -1.00e+6 |            -1.000e+6 |
|                  -5000000 |           -5,000,000 |             -5.00e+6 |              -5.0e+6 |             -5.00e+6 |
|                 -10000000 |          -10,000,000 |             -1.00e+7 |             -1.00e+7 |            -1.000e+7 |
|                 -50000000 |          -50,000,000 |             -5.00e+7 |              -5.0e+7 |             -5.00e+7 |
|                -100000000 |         -100,000,000 |             -1.00e+8 |             -1.00e+8 |            -1.000e+8 |
|                -500000000 |         -500,000,000 |             -5.00e+8 |              -5.0e+8 |             -5.00e+8 |
|                      -0.1 |                 -0.1 |               -0.100 |               -0.100 |               -0.100 |
|                      -0.5 |                 -0.5 |               -0.500 |                -0.50 |                -0.50 |
|                     -0.01 |                -0.01 |              -0.0100 |              -0.0100 |              -0.0100 |
|                     -0.05 |                -0.05 |              -0.0500 |               -0.050 |               -0.050 |
|                    -0.001 |               -0.001 |             -0.00100 |             -0.00100 |             -0.00100 |
|                    -0.005 |               -0.005 |             -0.00500 |              -0.0050 |              -0.0050 |
|                   -0.0001 |                   -0 |            -0.000100 |            -0.000100 |            -0.000100 |
|                   -0.0005 |               -0.001 |            -0.000500 |             -0.00050 |             -0.00050 |
|                  -0.00001 |                   -0 |           -0.0000100 |           -0.0000100 |            -1.000e-5 |
|                  -0.00005 |                   -0 |           -0.0000500 |            -0.000050 |             -5.00e-5 |
|                 -0.000001 |                   -0 |          -0.00000100 |          -0.00000100 |            -1.000e-6 |
|                 -0.000005 |                   -0 |          -0.00000500 |           -0.0000050 |             -5.00e-6 |
|                     -1e-7 |                   -0 |             -1.00e-7 |             -1.00e-7 |             -1.00e-7 |
|                     -5e-7 |                   -0 |             -5.00e-7 |              -5.0e-7 |              -5.0e-7 |
|                     -1e-8 |                   -0 |             -1.00e-8 |             -1.00e-8 |             -1.00e-8 |
|                     -5e-8 |                   -0 |             -5.00e-8 |              -5.0e-8 |              -5.0e-8 |

### Floats

|               Input Value |       toLocaleString |    toPrecision (N=3) |         Rule of Four |               format |
|               ----------- |       -------------- |    ----------------- |         ------------ |               ------ |
|       0.31888568301694575 |                0.319 |                0.319 |                0.319 |                0.319 |
|        3.7349084381901907 |                3.735 |                 3.73 |                 3.73 |                 3.73 |
|          2.62191756199057 |                2.622 |                 2.62 |                 2.62 |                 2.62 |
|         6.729015241365022 |                6.729 |                 6.73 |                  6.7 |                 6.73 |
|         65.09040893408195 |                65.09 |                 65.1 |                   65 |                65.09 |
|         428.4574925919192 |              428.457 |                  428 |               4.3e+2 |               428.46 |
|         384.1608949935447 |              384.161 |                  384 |                  384 |               384.16 |
|         2058.765806103118 |            2,058.766 |              2.06e+3 |              2.06e+3 |              2058.77 |
|          5114.44148151625 |            5,114.441 |              5.11e+3 |               5.1e+3 |              5114.44 |
|         41984.08325051327 |           41,984.083 |              4.20e+4 |               4.2e+4 |              4.20e+4 |
|        20736.007291296988 |           20,736.007 |              2.07e+4 |              2.07e+4 |             20736.01 |
|         483368.2698327662 |           483,368.27 |              4.83e+5 |               4.8e+5 |              4.83e+5 |
|         453577.5573672542 |          453,577.557 |              4.54e+5 |               4.5e+5 |              4.54e+5 |
|        2251959.4266486606 |        2,251,959.427 |              2.25e+6 |              2.25e+6 |             2.252e+6 |
|        3278722.2614856646 |        3,278,722.261 |              3.28e+6 |              3.28e+6 |             3.279e+6 |
|        21605167.815446444 |       21,605,167.815 |              2.16e+7 |              2.16e+7 |             2.161e+7 |
|        30111953.934109792 |       30,111,953.934 |              3.01e+7 |              3.01e+7 |             3.011e+7 |
|         43599800.38184441 |       43,599,800.382 |              4.36e+7 |               4.4e+7 |              4.36e+7 |
|       0.08041743068029608 |                 0.08 |               0.0804 |                0.080 |                0.080 |
|        0.4620821058214287 |                0.462 |                0.462 |                 0.46 |                 0.46 |
|     0.0044713018315218345 |                0.004 |              0.00447 |               0.0045 |               0.0045 |
|        0.0333510017922964 |                0.033 |               0.0334 |               0.0334 |               0.0334 |
|    0.00010697220471817625 |                    0 |             0.000107 |             0.000107 |             0.000107 |
|     0.0020588111792344535 |                0.002 |              0.00206 |              0.00206 |              0.00206 |
|    0.00001474732124651983 |                    0 |            0.0000147 |            0.0000147 |             1.475e-5 |
|    0.00018593267233908817 |                    0 |             0.000186 |             0.000186 |             0.000186 |
|   0.000006413672328890284 |                    0 |           0.00000641 |            0.0000064 |              6.41e-6 |
|   0.000023234905008112526 |                    0 |            0.0000232 |            0.0000232 |             2.323e-5 |
|      2.548118310825349e-7 |                    0 |              2.55e-7 |              2.55e-7 |              2.55e-7 |
|   0.000004207674229827719 |                    0 |           0.00000421 |            0.0000042 |              4.21e-6 |
|      9.896647250897363e-8 |                    0 |              9.90e-8 |               9.9e-8 |               9.9e-8 |
|     2.0452432460261137e-7 |                    0 |              2.05e-7 |              2.05e-7 |              2.05e-7 |
|     6.1251293909913705e-9 |                    0 |              6.13e-9 |               6.1e-9 |               6.1e-9 |
|     4.7698785393715595e-8 |                    0 |              4.77e-8 |               4.8e-8 |               4.8e-8 |
|       -0.6964459930941029 |               -0.696 |               -0.696 |                -0.70 |                -0.70 |
|       -1.8739829363596516 |               -1.874 |                -1.87 |                -1.87 |                -1.87 |
|        -7.553272182060371 |               -7.553 |                -7.55 |                 -7.6 |                -7.55 |
|         -8.82700483198825 |               -8.827 |                -8.83 |                 -8.8 |                -8.83 |
|        -82.91267543648047 |              -82.913 |                -82.9 |                  -83 |               -82.91 |
|       -295.86167187446557 |             -295.862 |                 -296 |                 -296 |              -295.86 |
|        -80.02183960220944 |              -80.022 |                -80.0 |                  -80 |               -80.02 |
|       -2586.9971731866203 |           -2,586.997 |             -2.59e+3 |             -2.59e+3 |             -2587.00 |
|        -9468.057758192099 |           -9,468.058 |             -9.47e+3 |              -9.5e+3 |             -9468.06 |
|       -23573.464563830094 |          -23,573.465 |             -2.36e+4 |             -2.36e+4 |            -23573.46 |
|        -90376.94487735166 |          -90,376.945 |             -9.04e+4 |              -9.0e+4 |             -9.04e+4 |
|         -43899.6650073481 |          -43,899.665 |             -4.39e+4 |              -4.4e+4 |             -4.39e+4 |
|        -941288.6685837733 |         -941,288.669 |             -9.41e+5 |              -9.4e+5 |             -9.41e+5 |
|       -1121330.6413018953 |       -1,121,330.641 |             -1.12e+6 |             -1.12e+6 |            -1.121e+6 |
|       -1439058.9572288604 |       -1,439,058.957 |             -1.44e+6 |             -1.44e+6 |            -1.439e+6 |
|       -15575649.114862278 |      -15,575,649.115 |             -1.56e+7 |             -1.56e+7 |            -1.558e+7 |
|          -89394685.843193 |      -89,394,685.843 |             -8.94e+7 |              -8.9e+7 |             -8.94e+7 |
|        -498734797.6135538 |     -498,734,797.614 |             -4.99e+8 |              -5.0e+8 |             -4.99e+8 |
|      -0.07918699156341512 |               -0.079 |              -0.0792 |               -0.079 |               -0.079 |
|        -0.347016783395845 |               -0.347 |               -0.347 |               -0.347 |               -0.347 |
|   -0.00009530013556439565 |                   -0 |           -0.0000953 |            -0.000095 |             -9.53e-5 |
|      -0.04519493820914464 |               -0.045 |              -0.0452 |               -0.045 |               -0.045 |
|    -0.0004954580779604239 |                   -0 |            -0.000495 |             -0.00050 |             -0.00050 |
|    -0.0007170739440115593 |               -0.001 |            -0.000717 |             -0.00072 |             -0.00072 |
|   -0.00004267033081279972 |                   -0 |           -0.0000427 |            -0.000043 |             -4.27e-5 |
|   -0.00003060138756995545 |                   -0 |           -0.0000306 |           -0.0000306 |            -3.060e-5 |
| -0.0000056685435041096606 |                   -0 |          -0.00000567 |           -0.0000057 |             -5.67e-6 |
|    -0.0000311353810925504 |                   -0 |           -0.0000311 |           -0.0000311 |            -3.114e-5 |
|     -1.619736049595004e-7 |                   -0 |             -1.62e-7 |             -1.62e-7 |             -1.62e-7 |
|    -3.6561547710797893e-7 |                   -0 |             -3.66e-7 |             -3.66e-7 |             -3.66e-7 |
|     -6.028281075250526e-8 |                   -0 |             -6.03e-8 |              -6.0e-8 |              -6.0e-8 |
|    -2.9157610919225417e-8 |                   -0 |             -2.92e-8 |             -2.92e-8 |             -2.92e-8 |
|     -7.982381183488154e-9 |                   -0 |             -7.98e-9 |              -8.0e-9 |              -8.0e-9 |
|    -2.6891725505438782e-8 |                   -0 |             -2.69e-8 |             -2.69e-8 |             -2.69e-8 |

### Special

|               Input Value |       toLocaleString |    toPrecision (N=3) |         Rule of Four |               format |
|               ----------- |       -------------- |    ----------------- |         ------------ |               ------ |
|                       NaN |                  NaN |                  NaN |                  NaN |                  NaN |
|                     1 + 2 |                    3 |                 3.00 |                 3.00 |                    3 |
|            (0.1 + 0.2)*10 |                    3 |                 3.00 |                 3.00 |                 3.00 |
|                        PI |                3.142 |                 3.14 |                 3.14 |                 3.14 |
|                         E |                2.718 |                 2.72 |                 2.72 |                 2.72 |
|                     SQRT2 |                1.414 |                 1.41 |                 1.41 |                 1.41 |
|                   EPSILON |                    0 |             2.22e-16 |             2.22e-16 |             2.22e-16 |
