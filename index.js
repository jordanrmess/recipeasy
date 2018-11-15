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
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));

/* Add whatever endpoints you need! Remember that your API endpoints must
 * have '/api' prepended to them. Please remember that you need at least 5 
 * endpoints for the API, and 5 others. 
 */


 /**
  * Connecting to DB 
  */
mongoose.connect(process.env.MONGODB,{ useNewUrlParser: true });
console.log(process.env.MONGODB);
mongoose.connection.on('error', function(err) {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    throw err;
    process.exit(1);
});

/**POST ENDPOINT: Add a new recipe */

app.post('/recipe', function(req, res) {
    
    console.log('REQUEST: ' + JSON.stringify(req.body));
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

    recipe.save(function(err) {
        if (err) throw err;
        return res.send('Succesfully added recipe.');
    });
});

app.delete('/recipe/:id',function(req,res){
     // Find movie by id
     Recipe.findByIdAndRemove(req.body.id, function(err, recipe){
        if (err) throw err;
        if (!recipe) return res.send("No recipe by that ID found");

        return res.send("Recipe "+req.body.id+" was deleted!");
    });
})



app.listen(3000, function() {
    console.log('Recipeasy listening on port 3000!');
});
