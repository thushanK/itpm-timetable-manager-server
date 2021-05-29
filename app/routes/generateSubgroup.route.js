const express = require('express');
const router = express.Router();

const GenerateSubGroup = require('../controllers/genarateSubgroup.controller');


//======================================================================================================
//===================================  POST and GET REQUEST       ==============================================
//====================================================================================================== 
   // Create new  group
   router.post("/add", GenerateSubGroup.add );
       
   //Get all group list
   router.get('/get' , GenerateSubGroup.get );

   //Update selected group
   router.post('/update' , GenerateSubGroup.update );

   //Delete selected group
   router.delete('/delete/:id' , GenerateSubGroup.delete );

   //get one building
   router.get('/getOne/:id', GenerateSubGroup.getOne);


//export router
module.exports = router
