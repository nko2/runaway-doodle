var ejs = require('ejs')
, fs = require('fs')
, nko = require('nko')('6coPfJMuWg55y54B')
, express = require('express')
, _ = require('underscore')
, mongo = require('mongoose');


Schema = mongo.Schema;
if(process.env.MONGOHQ_URI) {
  console.log("connecting to mongohq...");
  mongo.connect(process.env.MONGOHQ_URI);
}
else {
  console.log("connecting to local mongo");
  mongo.connect('mongodb://localhost:27017/nko-shoujo');
}

var ImageSchema = new Schema({
  data: {type:String, match:/^data:image\//}
  , phrase: String
  , name: String
  , created_at: {type:Date, default: Date.now}
});
mongo.model('Image', ImageSchema);
var Image = mongo.model('Image');


app = express.createServer();
app.set('view engine', 'ejs');
app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/static'));
});

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

app.post('/insert-image', function(req, res){
  var image = new Image({data: req.body.image, phrase: req.body.phrase, name: req.body.name});
  image.save();
  res.send(image.id);
});

app.get('/latest', function(req, res){
  var per_page = 9;
  var page = req.query.page ? parseInt(req.query.page) : 1;
  var prev_page = page > 1 ? page - 1 : false;
  
  Image.find({}, function(err, all_images){
    var total_pages = Math.ceil(all_images.length / per_page);
    var next_page = page < total_pages ? page + 1 : false;
    
    Image.find({}, [], {sort: [['created_at','descending']], limit: per_page, skip: per_page*(page-1)}, function(err, images){
      if(err){res.send("bad");}
      else{
        res.render('list', {images: images, page: page, prev_page: prev_page, next_page: next_page, total_pages: total_pages});
      }
    });
  });
});

app.get('/:id', function(req,res){
  Image.findById(req.params.id, function(err, image){
    if(err){res.send("not found");}
    else{
      res.render("show", {image: image, host: req.header('host') });
    }
  });
});

app.listen(parseInt(process.env.PORT) || 3333);
console.log('Listening on ' + app.address().port);