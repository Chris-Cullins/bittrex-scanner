# bittrex-scanner

This is a pet project that I'm creating to scan the [Bittrex](https://bittrex.com) market and look for entry points on the different 'BTC-*' tickers. It grabs the candles for each ticker and performs some technical analysis on those candles, then 'texts' (it's actually email) you as an alert if on meets one of those algorithm's entry conditions.




#### Current Algorithms -

1. The Triple Stochastic setup.
2. Stochastic Divergence.
3. [MACD Power Cross](http://www.traderplanet.com/articles/view/164694-identify-swing-trades-the-power-crossover-method/)


#### Configuration -

1. Get an API KEY and SECRET set from Bittrex (Under Settings on your account)
2. Create file "api_settings.json" in the following format in the 'modules' folder:
```JSON
    {
      "api_key": "YOUR_API_KEY_GOES_HERE",
      "api_secret": "YOUR_API_SECRET_GOES_HERE"
    }
```
3. Create a config.json file also in the 'modules' folder like so:
```JSON
    {
      "mainSettings": {
        "intervalBetweenScans": 900000
      },
      "emailConfig": {
        "emailFromAddress": "your_email_address@whatever.com",
        "emailPassword": "your_emails_password",
        "emailTOAddress": "where you want to receive the emails",
        "emailSUBJECT": "Indicator Alert"
      },
      "algorithmConfig": {
        "stochdiverge": true,
        "tripstoch": true,
        "macdcross": true
      }
    }
```