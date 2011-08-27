// server.js
var http = require('http')
, nko = require('nko')('6coPfJMuWg55y54B');

var app = http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('Hello, World');
});

app.listen(parseInt(process.env.PORT) || 3333);
console.log('Listening on ' + app.address().port);