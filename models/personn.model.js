const mongoose = require('mongoose');


const personSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true,"please enter  your name"]


    },
    age : {
        type : Number,
        required : [true,"please enter  your age"]
    },
    favoritefood : {
        type : String,
        required : [true,"please enter  your favorite food"]
    }
});

const personn =  mongoose.model('personn', personSchema);

module.exports = personn;
