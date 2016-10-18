var express = require('express');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: "nj5rh9gto1v5n05t.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    port: 3306,
    user: "jpmfic6bzhhzeyjd", //Your username//
    password: "az0rql713ckr5hef", //Your password//
    database: "jycxtsgajvvqqqrx"
})
var cheerio = require('cheerio');
var request = require('request');

connection.connect(function(err) {
    if (err) {
        console.error("error connecting: " + err.stack);
    }
    
})

var app = express();

app.use(express.static('music'));
app.use(express.static('node_modules'));

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

app.post('/pokemon', function(req, res){

    //console.log(req.body.pokemon);
    var counter = 0;
    var counter2 = 0;
    var pokemon = req.body.pokemon;
    var address = 'https://www.pokemon.com/us/pokedex/'+pokemon;

    request(address, function(error, response, html){
        var $ = cheerio.load(html);
        var result = {};

        //Picture Link
        var link = $('img.active').attr('src');
        result.link = link;

        //Text
        $('p').each(function(i, element){
            if(counter == 0){
                var text = $(this).text().trim();
                counter++;
                result.text = text;
                //console.log(text);
            }
            else{
                return;
            }
        })

        //ID Number
        var id = $('#pokemonID').text().trim();
        result.id = id;
        //console.log(id);

        //Other Values
        $('.attribute-value').each(function(i, element){
            if(counter2 == 2){
                counter2++;
            }
            else if(counter2 == 0){
                var height = $(this).text().trim();
                //console.log(height);
                result.height = height;
                counter2++;
            }
            else if(counter2 == 1){
                var weight = $(this).text().trim();
                //console.log(weight);
                result.weight = weight;
                counter2++;
            }
            else if(counter2 == 3){
                var category = $(this).text().trim();
                //console.log(category);
                result.category = category;
                counter2++;
            }
            else{
                var ability = $(this).text().trim();
                //console.log(ability);
                result.ability = ability;
                counter2++;
            }
            
        })
         //console.log(result);
         res.json(result);
    })
   
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

var port = process.env.PORT || 3000;

app.listen(port);