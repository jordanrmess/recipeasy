var mongoose = require('mongoose');


var recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    meal: {
        type: String,
        enum: ['breakfast','lunch','dinner','dessert'],
        required:true
    },
    author: {
        type: String,
        required: true
    },
    diffLevel: {
        type: String,
        enum: ['easy','med','hard'],
        required: true
    },
    ingredients:{
        type: [String],
        required:true,
        validate: [arrayLimit,'You need at least 1 ingredient']
    },
    time:{
        type:Number,
        required:true
    },
    servSize:{
        type: Number,
        required: true
    }
});

function arrayLimit(val) {
    return val.length >= 1;
}

var Recipe = mongoose.model('Recipe',recipeSchema); 
module.exports = { Recipe }; 