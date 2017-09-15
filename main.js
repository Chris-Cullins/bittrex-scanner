/**
 * Created by Chris on 9/4/2017.
 */
var fs = require('fs');
var Log = require('log');
var fetchPriceTest = require('./modules/fetchPrice');
var utilities = require('./modules/utilities');
var config = require('./modules/config.json');
var tripStoch = require('./algorithms/tripstoch');
var macdCross = require('./algorithms/macdcross');
var stochDiverge = require('./algorithms/stochdiverge');


var log = new Log('info', fs.createWriteStream('main.log'));


fetchPriceTest.getAvaliableMarkets(function(returned) {

    var marketArray = [];

    for(var i = 0; i < returned.length; i++) {
        if (returned[i] !== undefined) {
            if (returned[i].substring(0, 4) === 'BTC-') {
                marketArray.push(returned[i]);
            }
        }
    }

   setInterval(function() {
        performTests(marketArray);
   }, config.mainSettings.intervalBetweenScans);
});


var performTests = function(marketArray) {

    var toTextArrayTripStoch = [];
    var logStoch = new Log('info', fs.createWriteStream('stoch.log'));

    var toTextArrayStochDivergence = [];
    var toTextArrayMACD = [];



    var index = 0;
    doCandles(marketArray, index);


    function nextMarket(marketArray, index) {
        if (marketArray.length === index) {
            utilities.emailsForTripStoch(toTextArrayTripStoch);
            utilities.emailsForGenericAlgorithm(toTextArrayStochDivergence, "Stoch Diverge");
            utilities.emailsForGenericAlgorithm(toTextArrayMACD, "MACD Cross");
            index = 0;
        } else {

            doCandles(marketArray, index);
        }


    }
    function doCandles(marketArray, index) {
        utilities.wait(1000);

        fetchPriceTest.getCandles(marketArray[index], 'hour', function(data) {


            if (config.algorithmConfig.tripstoch) {
                var hasTripleStoch = tripStoch.checkForTripleStoch(marketArray[index], data, logStoch);

                if (hasTripleStoch) {
                    var toText = {
                        ticker: marketArray[index]
                    };

                    toTextArrayTripStoch.push(toText);
                }
            }

            if (config.algorithmConfig.stochdiverge) {
                var hasStochDiverge = stochDiverge.checkForStochDiverge(marketArray[index], data, logStoch);

                if (hasStochDiverge) {
                    var toTextDiverge = {
                        ticker: marketArray[index]
                    };

                    toTextArrayStochDivergence.push(toTextDiverge);
                }
            }

            if (config.algorithmConfig.macdcross.use) {
                var hasMACDCross = macdCross.checkForMACDCross(marketArray[index], data, logStoch);

                if (hasMACDCross) {
                    var toTextMACD = {
                        ticker: marketArray[index]
                    };

                    toTextArrayMACD.push(toTextMACD);
                }
            }
            index++;
            nextMarket(marketArray, index);
        });
    }
};




