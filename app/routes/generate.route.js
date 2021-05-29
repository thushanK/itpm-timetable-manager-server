const express = require('express');
const router = express.Router();
const generate = require("../controllers/generate.controller");
 
   //Get all timeslot list
   router.get('/get/normal' , generate.get_normal );

   //Get timeslots 
    router.get('/get/timeslots/:id' , generate.get_timeslots );

   //Get timeslots 
    router.get('/get/parallel' , generate.get_parallel );

   //Get timeslots 
    router.get('/get/con' , generate.get_con );

    //upload results
    router.post('/upload' , generate.upload );

    //Get lecturer timetble 
    router.get('/get/timetable/:group_id/:lecturer_id' , generate.get_lecturer_table );

    //Get group timetble 
    router.get('/get/grouptable/:group_id/:group' , generate.get_group_table );

    //Get room timetble 
    router.get('/get/roomtable/:group_id/:room' , generate.get_room_table );

    //Get all timeslot list
   router.get('/get/test' , (req,res) => {
    res.status(200).json({message : 'success'})
   });

   //Get all timeslot list
   router.get('/get/notoverlap' , generate.get_notoverlap );


//export router
module.exports = router