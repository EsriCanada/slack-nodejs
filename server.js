// var http = require('http');
// var url = require('url');
// var request = require('request');
//
// http.createServer(function (req, res) {
//     var queryObject = url.parse(req.url,true).query;
//     var baseUrl = "http://home.esricanada.com/report/SCMCase.asp";
//     var caseNumb = queryObject.text;
//     var channel = queryObject.channel_name;
//     console.log('CASE NUMBER:' + caseNumb);
//     console.log('CHANNEL:' + channel);
//     var returnUrl = baseUrl + "?Case_No=" + caseNumb;
//     var caseUrl = "<" + returnUrl + "|Case#" + caseNumb + ">"
//     var payload = {
//         text: caseUrl,
//         channel : channel
//     };
//     var userString = JSON.stringify(payload);
//
//     request.post({
//       url:'https://hooks.slack.com/services/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',
//       form: userString},
//       function(err,httpResponse,body){
//         console.log(err);
//       });
//
// }).listen(process.env.PORT, process.env.IP);


var request = require('request');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.set('port', (process.env.PORT || 5000));

app.post('/', function(req, res) {
  console.log(req.body);
  res.send('Hello World!');
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
