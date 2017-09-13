var bittrex = require('node.bittrex.api');
var config = require('./api_settings.json');

bittrex.options({
    'apikey': config.api_key,
    'apisecret': config.api_secret
});



/*bittrex.getmarketsummaries( function (data, err) {
    if (err) {
        return console.error(err);
    }
    for (var i in data.result) {
        bittrex.getticker()
    }
})*/

/*var websocketsclient = bittrex.websockets.listen( function( data ) {
    if (data.M === 'updateSummaryState') {
        data.A.forEach(function(data_for) {
            data_for.Deltas.forEach(function(marketsDelta) {
                console.log('Ticker Update for '+ marketsDelta.MarketName, marketsDelta);
            });
        });
    }
});


var websocketsclient = bittrex.websockets.client();

websocketsclient.serviceHandlers.reconnecting = function (message) {
    return true; // set to true stops reconnect/retrying
}

websocketsclient.serviceHandlers.messageReceived = function (message) {
    console.log(message); // the messages received must be parsed as json first e.g. via jsonic(message.utf8Data)
}*/



/*var websocketsclient = bittrex.websockets.subscribe(coins.coin_list, function(data) {
    if (data.M === 'updateExchangeState') {
        data.A.forEach(function(data_for) {
            console.log('Market Update for '+ data_for.MarketName, data_for);
        });
    }
});*/

var getticker = function(coin) {
    bittrex.getticker({ market: coin}, function(data, err) {
        if (data != null) {
            console.log(data);
            return data.result.Last;
        } else {
            console.log(coin + " was null?");
        }

})};

var gettickers = function() {
    var data = [];
    for (index = 0; index < coins.coin_list.length; index++) {
        data.push(getticker(coins.coin_list[index]));
    }

    return data;
};

var getMarketHistory = function() {
    bittrex.getmarkethistory({market: 'BTC-NEO'}, function (data, err) {
        console.log(data);

    })
};

var getAvaliableMarkets = function(callback) {
    bittrex.getmarketsummaries(function(data, err) {
        if (err) {
            return console.error(err);
        } else {
            var marketArray = [];
            for (var i in data.result) {
                marketArray.push(data.result[i].MarketName)
            }
            return callback(marketArray);
        }
    })
};


var getCandlesCloses = function (marketName, tickInterval, callback) {
    bittrex.getcandles({
        marketName: marketName,
        tickInterval: tickInterval // intervals are keywords
    }, function (data, err) {
        //console.log(data);
        var closes = [];
        if (data !== null) {
            for (var i = 0; i < data.result.length; i++) {
                closes.push(data.result[i].C);
            }
            return callback(closes);
        } else {
            return callback([]);
        }

    });
};

var getCandles = function( marketName, tickInterval, callback) {
    bittrex.getcandles({
        marketName: marketName,
        tickInterval: tickInterval // intervals are keywords
    }, function (data, err) {
        //console.log(data);
        if (err) {
            console.log(err);
            return;
        }
        var returnArray = [];
        if (data !== null) {
            for (var i = 0; i < data.result.length; i++) {
                returnArray.push(data.result[i]);
            }
            return callback(returnArray);
        } else {
            return callback([]);
        }

    });
};

//exports.websocketsclient = websocketsclient;
exports.gettickers = gettickers;
exports.getMarketHistory = getMarketHistory;
exports.getCandlesCloses = getCandlesCloses;
exports.getAvaliableMarkets = getAvaliableMarkets;
exports.getCandles = getCandles;