/**
 * Created by Chris on 9/5/2017.
 */
var ta = require('technicalindicators');
const SMA = ta.SMA;
const EMA = ta.EMA;
const Stochastic = ta.Stochastic;
var RSI = ta.RSI;



var sma = function(series1, period) {
    if (typeof period === "undefined") {
        period = 5;
    }
    return SMA.calculate({period: period, values: series1});
};

var rsi = function(inputRSI) {
    return RSI.calculate(inputRSI);
};

var stoch = function(high, low, close, period, signalPeriod) {
    var input = {
        high: high,
        low: low,
        close: close,
        period: period,
        signalPeriod: signalPeriod
    };

    return Stochastic.calculate(input);
};

var ema = function(values, period) {
    return EMA.calculate({period: period, values: values});
};

var bearish = function(input) {
    return ta.bearish(input);
};

exports.sma = sma;
exports.rsi = rsi;
exports.stoch = stoch;
exports.ema = ema;
exports.bearish = bearish;