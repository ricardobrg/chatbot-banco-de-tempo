var verify_token = "pissiti";
var name = "Banco de Tempo Blumenau";

// -- NÃO EDITAR ABAIXO DESSA LINHA!!! --
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

//Facebook Authentication
app.get('/', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === verify_token) {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }  
});

//messages processing
app.post('/', function(req, res) {
   var data = req.body;
  // Make sure this is a page subscription
  if (data.object === 'page') {
    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    // everything is ok!
    res.sendStatus(200);
  }
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function receivedMessage(event) {
  // Just logging
  console.log("Message data: ", event.message);
}
