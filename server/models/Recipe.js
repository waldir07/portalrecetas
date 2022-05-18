const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'this fild is required'
    },
    description: {
        type: String,
        required: 'this fild is required'
    },
    email: {
        type: String,
        required: 'this fild is required'
    },
    ingredients: {
        type: Array,
        required: 'this fild is required'
    },
    category: {
        type: String,
        enum: ['peruana','americana','mexicana','china','italiana'],
        required: 'this fild is required'
    },
    image: {
        type: String,
        required: 'this fild is required'
    },
}); 

recipeSchema.index({name: 'text',description:'text'});

module.exports = mongoose.model('Recipe', recipeSchema)