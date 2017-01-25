var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();
var path = require('path');
var port = 8791;

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:' + port);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.param('bookch', function(req, res, next, id) {
	next();
});
app.param('verse', function(req, res, next, id) {
	next();
});

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});


app.get('/:bookch/:verse', function(req, res) {
	
	var bookch = req.params.bookch;
	var verse = req.params.verse;
	var search = bookch + ':' + verse;

	var url = 'http://wol.jw.org/en/wol/l/r1/lp-e?q=' + search;
	var options = {
		url: url,
		method: 'GET'
	};

	request(options, function(error, response, html) {

		if (!error) {
			console.log('search', search);
			var $ = cheerio.load(html);
			var out = '';
			var ref = $('.results .caption .lnk').text();
			if (ref != '') {
				text = $('.bibleCitation article p span')
					.clone()    //clone the element
				    .children() //select all the children
				    .remove()   //remove all the children
				    .end()	 //again go back to selected element
					.text()
					.trim();
				out = text + ' (' + ref + ')';
				res.send(out);
			}
			else
				res.send('not found');
		}
		else
			console.log('error');
	});
});
app.listen(port);
console.log('magic happens on port ' + port);
exports = module.exports = app;