/**
 * Created by Chris on 9/13/2017.
 */
var technicals = require('../modules/technicals');


/**
 * This function loops through an input array and looks for tickers with a 'stoch diverge' pattern, and returns an array of
 * tickers where the pattern was found.
 * @param ticker
 * @param input (candles)
 * @param log
 */
var checkForStochDiverge = function(ticker, input, log) {

    if (ticker !== undefined) {
        log.info('Checking for StochDiverge on ticker ' + ticker + '.');
        var high = [];
        var low = [];
        var close = [];
        var open = [];
        for (var i = 0; i < input.length; i++) {
            high.push(input[i].H);
            low.push(input[i].L);
            close.push(input[i].C);
            open.push(input[i].O);
        }


        // check for bearish trend (40 period?)

        var highLastFourty = [];
        var lowLastFourty = [];
        var closeLastFourty = [];
        var openLastFourty = [];

        for(var j = 0; j < 40; j++) {
            highLastFourty.push(input[input.length - 41 + j].H);
            lowLastFourty.push(input[input.length - 41 + j].L);
            closeLastFourty.push(input[input.length - 41 + j].C);
            openLastFourty.push(input[input.length - 41 + j].O);
        }

        var fourtyBearishInput = {
            open: openLastFourty,
            high: highLastFourty,
            low: lowLastFourty,
            close: closeLastFourty
        };

        var isBearish = technicals.bearish(fourtyBearishInput);

        var priceDownMins = checkPriceDownMins(input);

        var stochSixty = technicals.stoch(high, low, close, 60, 3);

        var isHigherLowStochSixty = stochHigherLow(stochSixty);

        var stochFourty = technicals.stoch(high, low, close, 40, 3);

        var isHigherLowStochFourty = stochHigherLow(stochFourty);

        var stochFast = technicals.stoch(high, low, close, 14, 3);

        var isHigherLowStochFast = stochHigherLow(stochFast);

        log.info('Results of tests are as follows:');
        log.info('');

        log.info('Is the 40 period trend bearish? - ' + isBearish);
        log.info('Check is price mins are moving down - ' + priceDownMins);
        log.info(' isHigherLowStochSixty - ' + isHigherLowStochSixty);
        log.info(' isHigherLowStochFourty - ' + isHigherLowStochFourty);
        log.info(' isHigherLowStochFast - ' + isHigherLowStochFast);


        log.info('Final Verdict, do we have Stochastic Divergence? - ' + (isBearish && priceDownMins && (isHigherLowStochSixty || isHigherLowStochFourty || isHigherLowStochFast)));

        if (isBearish && priceDownMins && (isHigherLowStochSixty || isHigherLowStochFourty || isHigherLowStochFast)) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};

/**
 * This function checks for 2 low points on the prices where the lowest is in the future compared to the second lowest.
 * @param prices
 */
var checkPriceDownMins = function(input) {

    var lowLast = [];

    for(var j = 0; j < 20; j++) {
        lowLast.push(input[input.length - 21 + j].L);
    }


    var copyOfLow = lowLast.slice();

    var min = Math.min.apply(null, lowLast);
    var minIndex = lowLast.indexOf(min);

    var minPlusTwoPercent = min * 1.03;

    var keepGoing = true;

    while(keepGoing) {
        if (minIndex in lowLast) {
            if (lowLast[minIndex] < minPlusTwoPercent) {
                lowLast.splice(minIndex, 1);
            } else {
                keepGoing = false;
            }
        } else {
            keepGoing = false;
            return false;
        }
    }

    keepGoing = true;
    var index  = 1;

    while(keepGoing) {
        if ((minIndex - index) in lowLast) {
            if (lowLast[minIndex - index] < minPlusTwoPercent) {
                lowLast.splice(minIndex - index, 1);
                index++;
            } else {
                keepGoing = false;
            }
        } else {
            return false;
        }
    }

    var secondMin = Math.min.apply(null, lowLast);
    var secondMinIndex = copyOfLow.indexOf(secondMin);


    if (secondMinIndex < minIndex) {
        return true;
    } else {
        return false;
    }

};

/**
 * Looks at an array of stochastic KD Oscillator values and determines if the last two valleys are 'ascending'
 * @param stoch
 * @returns {boolean}
 */
var stochHigherLow = function (stoch) {

    var lastTwentyK = [];

    for(var j = 0; j < 20; j++) {
        lastTwentyK.push(stoch[stoch.length - 21 + j].d);
    }

    var valleys = findValleys(lastTwentyK);

    valleys = valleys.slice(-2);


    if (!valleys.isSorted()) {
        return true;
    } else {
        return false;
    }


};

/**
 * Finds valleys in an array.
 * @param arr
 * @returns {*}
 */
function findValleys(arr) {
    var valley;
    return arr.reduce(function(valleys, val, i) {
        if (arr[i+1] < arr[i]) {
            valley = arr[i+1];
        } else if ((arr[i+1] > arr[i]) && (typeof valley === 'number')) {
            valleys.push(valley);
            valley = undefined;
        }
        return valleys;
    }, []);
}

/**
 * determines if an array is sorted descending
 */
Array.prototype.isSorted = function() {
    return (function(direction) {
        return this.reduce(function(prev, next, i, arr) {
            if (direction === undefined)
                return (direction = prev <= next ? 1 : -1) || true;
            else
                return (direction + 1 ?
                    (arr[i-1] <= next) :
                    (arr[i-1] >  next));
        }) ? Number(direction) : false;
    }).call(this);
};

exports.checkForStochDiverge = checkForStochDiverge;