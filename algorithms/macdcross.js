/**
 * Created by Chris on 9/14/2017.
 */
var technicals = require('../modules/technicals');
var config = require('../modules/config.json');

var coolDownMap = {};

/**
 * This function loops through an input array and looks for tickers with a 'MACD Power Cross' pattern, and returns an array of
 * tickers where the pattern was found.
 * @param ticker
 * @param input (candles)
 * @param log
 */
var checkForMACDCross = function(ticker, input, log) {


    if (coolDownMap[ticker] !== undefined) {
        var curCount = coolDownMap[ticker].count;

        if (curCount !== undefined && curCount < 4 && curCount > 0) {
            curCount++;
            coolDownMap[ticker] = {'count': curCount};
            return false;
        } else if (curCount === 4 || curCount === 0) {
            curCount = 0;
        }
    }

    if (ticker !== undefined) {
        log.info('Checking for MACDCross ' + ticker + '.');
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


        var stochastic = technicals.stoch(high, low, close, config.algorithmConfig.macdcross.stochPeriod,
            config.algorithmConfig.macdcross.stochSignalPeriod);

        var inputRSI = {
            values: close,
            period: config.algorithmConfig.macdcross.rsiPeriod
        };

        var rsi = technicals.rsi(inputRSI);

        var macdInput = {
            values: close,
            fastPeriod: config.algorithmConfig.macdcross.fastPeriod,
            slowPeriod: config.algorithmConfig.macdcross.slowPeriod,
            signalPeriod: config.algorithmConfig.macdcross.signalPeriod,
            SimpleMAOscillator: false,
            SimpleMASignal: false
        };

        var macddata = technicals.macd(macdInput);


        var shouldEnter = determineIfWereInAnEntryPoint(stochastic, rsi, macddata, log);

        log.info('Results of tests are as follows:');
        log.info('');

        if (shouldEnter) {
            coolDownMap[ticker] = {'count': 1};
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};

/**
 *
 * @param stochastic
 * @param rsi
 * @param macddata
 * @param log
 */
var determineIfWereInAnEntryPoint = function(stochastic, rsi, macddata, log) {

    //did the stochastic just cross into 'above 50' territory?
    var yesStoch = false;
    if (stochastic[stochastic.length - 1].d > 50) {
        if (stochastic[stochastic.length - 2].d <= 50 ||
            stochastic[stochastic.length - 3].d <= 50 ||
            stochastic[stochastic.length - 4].d <= 50) {
            yesStoch = true;
        }
    }

    //did rsi just cross into above 50?
    var yesRSI = false;
    if (rsi[rsi.length - 1] > 50) {
        if (rsi[rsi.length - 2] <= 50 ||
            rsi[rsi.length - 3] <= 50 ||
            rsi[rsi.length - 4] <= 50) {
            yesRSI = true;
        }
    }


    //did the macd just cross the hist and the signal?
    var yesMACDAboveSignal = false;
    var yesMACDPositive = false;

    if (macddata[macddata.length - 1].MACD > 0) {
        if (macddata[macddata.length - 2].MACD <= 0 ||
            macddata[macddata.length - 3].MACD <= 0 ||
            macddata[macddata.length - 4].MACD <= 0) {
            yesMACDPositive = true;
        }
    }
    if (macddata[macddata.length - 1].MACD > macddata[macddata.length - 1].signal) {
        if (macddata[macddata.length - 2].MACD <= macddata[macddata.length - 2].signal ||
            macddata[macddata.length - 3].MACD <= macddata[macddata.length - 3].signal ||
            macddata[macddata.length - 4].MACD <= macddata[macddata.length - 4].signal) {
            yesMACDAboveSignal = true;
        }
    }

    log.info('Did the Stochastic just cross 50? - ' + yesStoch);
    log.info('Did the RSI just cross 50? - ' + yesRSI);
    log.info('Did the MACD just cross the signal? - ' + yesMACDAboveSignal);
    log.info('Was the MACD positive? - ' + yesMACDPositive);

    log.info('Final Verdict on MACD Power Cross - ' + (yesStoch && yesRSI &&  yesMACDAboveSignal && yesMACDPositive));

    return (yesStoch && yesRSI &&  yesMACDAboveSignal && yesMACDPositive);

};

exports.checkForMACDCross = checkForMACDCross;