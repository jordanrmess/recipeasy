var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var dotenv = require('dotenv');
var Recipe = require('./shell/models/Recipe');
var _ = require('underscore');

dotenv.load();
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


app.use('/public', express.static('public'));

/* Add whatever endpoints you need! Remember that your API endpoints must
 * have '/api' prepended to them. Please remember that you need at least 5 
 * endpoints for the API, and 5 others. 
 */


/**
 * Connecting to DB 
 */
mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true
});
mongoose.connection.on('error', function (err) {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    throw err;
    process.exit(1);
});



/**POST ENDPOINT: Add a new recipe */

app.post('/recipe', function (req, res) {
    /**Recipe Object */
    var recipe = new Recipe({
        name: req.body.name,
        meal: req.body.meal,
        author: req.body.author,
        diffLevel: req.body.diffLevel,
        ingredients: req.body.ingredients,
        time: req.body.time,
        servSize: req.body.servSize
    });

    recipe.save(function (err) {
        if (err) throw err;
        return res.send('Succesfully added recipe.');
    });
});

app.get('/add', function (req, res) {
    res.render('add');
});

app.get('/', function (req, res) {
    // Get all recipes
    Recipe.find({}, function (err, recipes) {


        names = _.pluck(recipes, "name");

        if (err) throw err;
        res.render('home', {
            recipes: names
        })
    });
});

app.get('/api/ing/:item', function (req, res) {
    var item = req.params.item;
    Recipe.find({}, function (err, recipes) {
        if (err) throw err;
        var r = _.filter(recipes, function (ele) {
            return JSON.parse(ele.ingredients).includes(item);
        });
        names = _.pluck(r, "name");
        res.send(JSON.stringify(names));
    });
});

app.get('/api/recipes', function (req, res) {
    // Get all recipes
    Recipe.find({}, function (err, recipes) {
        if (err) throw err;
        res.send(JSON.stringify(recipes));
    });
});

app.get('/random', function (req, res) {

    Recipe.find({}, function (err, recipes) {

        var keys = Object.keys(recipes)
        var randIndex = Math.floor(Math.random() * keys.length)
        var recipe = recipes[randIndex]
        if (err) throw err;
        var url = '/recipe/' + recipe.name;
        console.log(url);
        res.render('random', {
            name: recipe.name,
            url: url.replace(' ', '%20')
        })
    });
});

app.get('/easy', function (req, res) {


    Recipe.find({}, function (err, recipes) {

        if (err) throw err;

        easy = _.filter(recipes, function (ele) {
            return ele.diffLevel == 'easy'
        });
        names = _.pluck(easy, "name");

        res.render('easy', {
            recipes: names
        })
    });
});

app.get('/recipe/:entry', function (req, res) {

    var entry = req.params.entry;
    Recipe.find({}, function (err, recipes) {

        if (err) throw err;

        r = _.find(recipes, function (ele) {
            return ele.name == entry
        });
        if (r == undefined) {
            res.render('error');
        } else {
            res.render('recipe', {
                name: r.name,
                author: r.author,
                diff: r.diffLevel,
                time: r.time,
                serv: r.servSize,
                ingredients: JSON.parse(r.ingredients)
            });
        }

    });
});

app.get('/ing', function (req, res) {

    Recipe.find({}, function (err, recipes) {
        if (err) throw err;
        names = _.pluck(recipes, "name");

        res.render('ingredients', {
            items: names
        });


    });

});



function arrayContainsAnotherArray(needle, haystack) {
    for (var i = 0; i < needle.length; i++) {
        if (haystack.indexOf(needle[i]) === -1)
            return false;
    }
    return true;
}

app.get('/meal/:mt', function (req, res) {
    var mealType = req.params.mt;

    Recipe.find({}, function (err, recipes) {

        if (err) throw err;

        var lst = _.filter(recipes, function (ele) {
            return ele.meal == mealType
        });
        var names = _.pluck(lst, "name");
        var desc;
        if (mealType == 'breakfast') {
            desc = 'The most important meal of the day'
        } else if (mealType == 'lunch') {
            desc = 'An underrated yet delicious meal';
        } else if (mealType == 'dinner') {
            desc = 'Let\'s eat!'
        } else {
            desc = 'Let your sweet tooth free'
        }
        res.render('meal', {
            mealtype: toTitleCase(mealType),
            description: desc,
            recipes: names
        })
    });

});

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}
app.listen(process.env.PORT || 3000, function () {
    console.log('Recipeasy listening on port 3000!');
});