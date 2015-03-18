var request = require('request');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.set('port', (process.env.PORT || 5000));

//variables
var baseUrl = "http://home.esricanada.com/report/SCMCase.asp";

app.post('/', function(req, res) {
  console.log(req.body);
  console.log("Initiated by: " + req.body.user_name);

  var number = req.body.text;
  var channel = req.body.channel_id;
  var returnUrl = baseUrl + "?Case_No=" + number;
  var caseUrl = "<" + returnUrl + "|Case#" + number + ">"

  var payload = {
      text: caseUrl,
      channel : channel
  };
  var userString = JSON.stringify(payload);

  request.post({
    url:'https://hooks.slack.com/services/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',
    form: userString},
    function(err,httpResponse,body){
      console.log(err);
    });

    res.end();
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
