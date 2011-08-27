var ejs = require('ejs')
, nko = require('nko')('6coPfJMuWg55y54B')
, express = require('express');

app = express.createServer();
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('index')
});

app.listen(parseInt(process.env.PORT) || 3333);
console.log('Listening on ' + app.address().port);