var request = require('request');
var express = require('express');
var bodyParser = require('body-parser');
var cheerio = require('cheerio');

var app = express();

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.set('port', (process.env.PORT || 5000));

app.get('/', function (req, res) {
  res.send('Node.js webserver for Slack integration')
});

app.post('/case', function(req, res) {
  console.log("CASE, initiated by: " + req.body.user_name);

  var number = req.body.text;
  if (number.length <= 6 && !isNaN(parseFloat(number)) && isFinite(number)) {
    sendUrl();
  } else {
    console.log("Invalid Case number");
    res.send(number + " - is an invalid Case number");
  };

  function sendUrl() {
    var hook = "https://hooks.slack.com/services/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"
    var channel = req.body.channel_id;
    var baseUrl = "http://home.esricanada.com/report/SCMCase.asp";
    var returnUrl = baseUrl + "?Case_No=" + number;
    var caseUrl = "<" + returnUrl + "|Case#" + number + ">"

    var payload = {
      text: caseUrl,
      channel : channel
    };
    slackWrite(hook, payload);
    res.end();
  };
});

app.post('/bugs', function(req, res) {
  console.log("BUG, initiated by: " + req.body.user_name);

  var hook = "https://hooks.slack.com/services/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"
  var channel = req.body.channel_id;
  var searchTerm = req.body.text;
  var url = 'http://search.esri.com/results/index.cfm?do=support&searchview=all&filterid=2&requiredfields=(search-category:bugs/nimbus)&filter=p&q=' + searchTerm;

  // Get first search result, if any
  request(url, function(err, resp, body) {
    $ = cheerio.load(body);
    try {
      var link = $('a[class=searchTitle]')[0].attribs.href;
      getDetails(link);
      res.end();
    } catch(error) {
      console.log("No results found");
      res.send(searchTerm + " - did not match any results");
    }
  });

  // Follow link of first result to get bug details
  function getDetails(link) {
    request(link, function(err, resp, body) {
      $ = cheerio.load(body);
      var synop = $('div[class="col pct60"]').children();
      var synopsis = synop[1].children[0].data.trim();

      var table = $('table[class="listing shaded"] > tbody > tr > td');
      var number = table[0].children[0].data.trim();
      var versionFound = table[4].children[0].data.trim();
      var status = table[10].children[0].data.trim();
      var versionFixed = table[11].children[0].data.trim();

      var payload = {
        "attachments": [
          {
            "fallback": "Esri Support - " + number + ": " + link,
            "pretext": "<" + link + "|" + number + "> - " + synopsis,
            "fields": [
              {
                "title": "Version Found",
                "value": versionFound
              },
              {
                "title": "Status",
                "value": status
              },
              {
                "title": "Version Fixed",
                "value": versionFixed
              }
            ],
            "color": "#339933",
            "mrkdwn_in": ["pretext"]
          }
        ],
          channel : channel
      };
      slackWrite(hook, payload);
    });
  }
});

function slackWrite(hook, payload) {
	var userString = JSON.stringify(payload);
    request.post(
      {
        url: hook,
        form: userString
      },
      function(err, httpResponse, body) {
        if (!err) {
          console.log("Posted to Slack");
        } else {
          console.log("Error posting to Slack: " + err);
        }
  });
}

app.listen(app.get('port'), function() {
  console.log("Node.js app is running at localhost:" + app.get('port'));
});
