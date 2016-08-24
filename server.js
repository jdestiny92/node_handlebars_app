var express = require('express');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: "nj5rh9gto1v5n05t.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    port: 3306,
    user: "jpmfic6bzhhzeyjd", //Your username//
    password: "az0rql713ckr5hef", //Your password//
    database: "jycxtsgajvvqqqrx"
})

connection.connect(function(err) {
    if (err) {
        console.error("error connecting: " + err.stack);
    }
    
})

var app = express();

app.use(express.static('music'));

var exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.set('view engine', 'handlebars');

app.post('/', function(req, res){
	//console.log(req.body.name);
	var pokemon = req.body.name;
	connection.query('INSERT INTO pokemon (name) VALUES (?)', pokemon, function(err, result){
		if (err) throw err;
	});

})

app.post('/:pokemon', function(req, res){
	var pokemon = req.pokemon;

	res.render('http://www.pokemon.com/us/pokedex/' + pokemon);
})

app.get('/', function(req, res){
	res.render('index');
})

app.get('/catch', function(req, res){
	res.render('catch');
})

app.get('/pokedex', function(req, res){
	res.render('pokedex');
})

app.get('/info', function(req, res){
	var list = {};
	var total = [];

	connection.query('SELECT * FROM pokemon;', function(err, data){
				if (err) throw err;
				
				for(i=0; i<data.length; i++){
					
					total.push(data[i].name);

				}
				list.names = total;
				//console.log(list);
				res.send(list);
			});

})

var port = 3000;

app.listen(port);