/**
 * Created by Chris on 9/12/2017.
 */
var technicals = require('../modules/technicals');


/**
 * This function loops through an input array and looks for tickers with a 'triple stoch' pattern, and returns an array of
 * tickers where the pattern was found.
 * @param ticker
 * @param input (candles)
 * @param log
 */
var checkForTripleStoch = function(ticker, input, log) {

    if (ticker !== undefined) {
        log.info('Checking for TripleStoch on ticker ' + ticker + '.');
        var high = [];
        var low = [];
        var close = [];
        for (var i = 0; i < input.length; i++) {
            high.push(input[i].H);
            low.push(input[i].L);
            close.push(input[i].C);
        }


        var stochSixty = technicals.stoch(high, low, close, 60, 3);

        log.info('Last 60 period stoch was ' + stochSixty[stochSixty.length - 1].k);

        var isStochSixtyAbove = checkStochAboveNum(stochSixty, 60);

        var stochFourty = technicals.stoch(high, low, close, 40, 3);

        log.info('Last 40 period stoch was ' + stochFourty[stochFourty.length - 1].k);

        var isStochFourtyAbove = checkStochAboveNum(stochFourty, 60);

        var stochFast = technicals.stoch(high, low, close, 14, 3);

        log.info('Last fast stoch period was ' + stochFast[stochFast.length - 1].k);

        var isStochFastBelow = checkStochBelowNum(stochFast, 30);


        var emaClose = technicals.ema(close, 20);


        var isPriceAboveEMA = checkPriceAboveEMA(close, emaClose);

        log.info('Last hour close was ' + close[close.length - 1] + ' and ema is ' + emaClose[emaClose.length - 1] + '.');

        log.info('Was our Criteria met? - ' + (isStochSixtyAbove && isStochFourtyAbove && isStochFastBelow && isPriceAboveEMA));

        if (isStochSixtyAbove && isStochFourtyAbove && isStochFastBelow && isPriceAboveEMA) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};


var checkStochAboveNum = function(stoch, num) {

    var end = stoch.length - 1;

    if (stoch[end].k > num && stoch[end].d > num &&
        stoch[end - 1].k > num && stoch[end - 1].d > num &&
        stoch[end - 2].k > num && stoch[end - 2].d > num &&
        stoch[end - 3].k > num && stoch[end - 3].d > num &&
        stoch[end - 4].k > num && stoch[end - 4].d > num) {
        return true;
    } else {
        return false;
    }
};

var checkStochBelowNum = function(stoch, num) {

    var end = stoch.length - 1;

    if (stoch[end].k < num && stoch[end].d < num &&
        stoch[end - 1].k < num && stoch[end - 1].d < num &&
        stoch[end - 2].k < num && stoch[end - 2].d < num &&
        stoch[end - 3].k < num && stoch[end - 3].d < num &&
        stoch[end - 4].k < num && stoch[end - 4].d < num) {
        return true;
    } else {
        return false;
    }
};

var checkPriceAboveEMA = function(prices, ema) {
    var priceEnd = prices.length - 1;
    var emaEnd = ema.length - 1;

    if (prices[priceEnd] > ema[emaEnd] &&
        prices[priceEnd - 1] > ema[emaEnd - 1] &&
        prices[priceEnd - 2] > ema[emaEnd - 2]) {
        return true;
    } else {
        return false;
    }
}

exports.checkForTripleStoch = checkForTripleStoch;