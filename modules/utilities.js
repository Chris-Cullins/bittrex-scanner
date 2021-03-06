/**
 * Created by Chris on 9/12/2017.
 */
var nodemailer = require('nodemailer');
var config = require('./config.json');


const emailFROMAddress = config.emailConfig.emailFromAddress;
const emailTOAddress = config.emailConfig.emailTOAddress;
const emailSUBJECT = config.emailConfig.emailSUBJECT;
const emailPass = config.emailConfig.emailPassword;

function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
        end = new Date().getTime();
    }
}

var sendMail = function(mailOptions) {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailFROMAddress,
            pass: emailPass
        }
    });

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })
};

var emailsForGenericAlgorithm = function(toTextArray, algorithmName) {
    if (toTextArray.length > 0) {
        var textString = "Tickers with " + algorithmName + ": \n";

        for (var j = 0; j < toTextArray.length; j++) {
            item = toTextArray.pop();
            textString = textString + item.ticker + "\n";
        }

        var splits = textString.match(/[\s\S]{1,139}/g);

        for (var k = 0; k < splits.length; k++) {
            var mailoptions = {
                from: emailFROMAddress,
                to: emailTOAddress,
                subject: emailSUBJECT,
                text: splits[k]
            };
            wait(1000);
            sendMail(mailoptions);
        }

    }

}
var emailsForTripStoch = function(toTextArrayTripStoch) {

    if (toTextArrayTripStoch.length > 0) {
        var textString = "Tickers with TripStoch: \n";

        for (var j = 0; j < toTextArrayTripStoch.length; j++) {
            item = toTextArrayTripStoch.pop();
            textString = textString + item.ticker + "\n";
        }

        var splits = textString.match(/[\s\S]{1,139}/g);

        for (var k = 0; k < splits.length; k++) {
            var mailoptions = {
                from: emailFROMAddress,
                to: emailTOAddress,
                subject: emailSUBJECT,
                text: splits[k]
            };
            wait(1000);
            sendMail(mailoptions);
        }

    }
};


exports.sendMail = sendMail;
exports.wait = wait;
exports.emailsForTripStoch = emailsForTripStoch;
exports.emailsForGenericAlgorithm = emailsForGenericAlgorithm;