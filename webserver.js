var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname  + '/app/'));

app.get('/', function(req, res) {
  res.sendFile('index.html', {root: __dirname + '/app/' })
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
  console.log('This one is the dir above.' + __dirname );
});
