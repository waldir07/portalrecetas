const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'this fild is required'
    },
    image: {
        type: String,
        required: 'this fild is required'
    },
}); 

module.exports = mongoose.model('Category', categorySchema)