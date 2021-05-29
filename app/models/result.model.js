const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Result = new Schema({
    session: {
        type: {},
    },
    group_id : {
        type: Schema.ObjectId,
    },
    group: {
        type: Schema.ObjectId,
    },
    lecturer: {
        type: Schema.ObjectId,
    },
    s_time : {
        type: String,
    },
    room : {
        type: String,
    },
    e_time : {
        type: String,
    },
    day : {
        type: Number,
    },
    duration : {
        type: Number,
    },
    type : {
        type: Number,
    },
   
});

module.exports = mongoose.model('results', Result);