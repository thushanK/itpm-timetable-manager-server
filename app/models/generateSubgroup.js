const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let GenerateSubGroup = new Schema({



    academicYear: {
        type: String,
   

    },
    program: {
        type: String,


    },
    group_mo: {
        type: Number,

    },
    subgroup_mo: {
        type: String,

    },


});
module.exports = mongoose.model('generatesubgroup', GenerateSubGroup);
