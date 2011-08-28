var ejs = require('ejs')
, fs = require('fs')
, nko = require('nko')('6coPfJMuWg55y54B')
, express = require('express')
, _ = require('underscore')
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

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/random-phrase', function(req, res){
  var wordlists = fs.readFileSync('words').toString().split("\n");
  
  var random_words = [];
  _.each(wordlists, function(wordlist){
    var words = wordlist.split(",");
    var random_idx = Math.round(Math.random()*(words.length-1));
    random_words.push(words[random_idx]);
  });
  
  res.json({phrase: random_words[0]+" "+random_words[1]+" "+random_words[2]});
});

app.listen(parseInt(process.env.PORT) || 3333);
console.log('Listening on ' + app.address().port);