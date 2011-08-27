var ejs = require('ejs')
, nko = require('nko')('6coPfJMuWg55y54B')
, express = require('express')
, mongo = require('mongoose');

app = express.createServer();
app.set('view engine', 'ejs');
app.configure(function(){
  app.use(express.static(__dirname + '/static'));
});

if(process.env.MONGOHQ_URI) {
  console.log("connecting to mongohq...");
  mongo.connect(process.env.MONGOHQ_URI);
}
else {
  console.log("connecting to local mongo");
  mongo.connect('mongodb://localhost/nko-shoujo');
}

app.get('/', function (req, res) {
  res.render('index');
});

app.listen(parseInt(process.env.PORT) || 3333);
console.log('Listening on ' + app.address().port);