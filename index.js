var https = require('https');
var Slack = require('slack-node');
var Promise = require("bluebird");

var slack = new Slack();
slack.setWebhook(process.env.SLACK_TOKEN);
console.log('test');

exports.handler = function(event, context) {

  var results_array = [];

  for (link in event){
    var promise = new Promise(function(resolve, reject) {
      (function(url) {
        https.request({host: url, port: 443, method: "GET"}, function(res) {
          var cert = res.connection.getPeerCertificate().valid_to;
          var cert_date = new Date(cert);
          var date_now = new Date();
          var days = days_between(cert_date, date_now);
          var result = url + " will expire in " + days  + " days.\n";
          resolve(result);
        }).end();
      })(event[link]);
    });
    results_array.push(promise);
  }

  // TODO: add failure
  Promise.all(results_array).then(function(results) {
    slack.webhook({
      channel: '#digital-ops',
      username: 'SSL Watch',
      text: results.join("")
    }, function(err, response) {
      if(response.statusCode == "200"){
        context.succeed("done")
      }
    });
  });
};

function days_between(date1, date2) {
  // The number of milliseconds in one day
  var ONE_DAY = 1000 * 60 * 60 * 24;

  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = Math.abs(date1_ms - date2_ms);

  // Convert back to days and return
  return Math.round(difference_ms/ONE_DAY);
}
