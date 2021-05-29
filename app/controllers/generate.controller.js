const Sessions = require('../models/sessions.model');
const Timeslots = require('../models/timeslot.model');
const Parallel = require('../models/parallel.model');
const Consecutive = require('../models/consecutive.model');
const Result = require('../models/result.model');
const moment = require('moment'); 
const Overlap = require('../models/overlap.model');

exports.get_normal = (req, res) => {

    const options = { $and : [ { 'parallel': false },{ 'consecutive': false }]} 


    Sessions.aggregate([
        {
            $match : options
        },
        {
            $lookup: {
                from: "lecturers", // collection name in db
                localField: "lecturer",
                foreignField: "_id",
                as: "lecturer"
            }
        },
        {
            $lookup: {
                from: "tags", // collection name in db
                localField: "tag",
                foreignField: "_id",
                as: "tag"
            }
        },
        {
            $lookup: {
                from: "subjects", // collection name in db
                localField: "subject",
                foreignField: "_id",
                as: "subject"
            }
        },
        {
            $lookup: {
                from: "students", // collection name in db
                localField: "group",
                foreignField: "_id",
                as: "group"
            }
        },
        {
            $project: {
                lecturer: { $arrayElemAt: ["$lecturer", 0], },
                tag: { $arrayElemAt: ["$tag", 0] },
                subject: { $arrayElemAt: ["$subject", 0] },
                group: { $arrayElemAt: ["$group", 0] },
                no_of_students: 1,
                duration: 1,
                parallel : 1 , 
                consecutive : 1 ,
                snv : 1,
                rooms : 1,
            }
        }
    ]).exec(function (err, result) {
        if (err) { return next(err) }

        res.status(200).send({
            data : result
        })

    });

};


exports.get_timeslots = (req, res) => {
    Timeslots.find({ group_id : req.params.id})
        .then( workingdays => {
            res.status(200).send(workingdays);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while fetching the data."
            });
        });

};


exports.get_parallel = async (req, res) => {
    const parallel = await Parallel.find({});
    
    Sessions.aggregate([
        {
            $lookup: {
                from: "lecturers", // collection name in db
                localField: "lecturer",
                foreignField: "_id",
                as: "lecturer"
            }
        },
        {
            $lookup: {
                from: "tags", // collection name in db
                localField: "tag",
                foreignField: "_id",
                as: "tag"
            }
        },
        {
            $lookup: {
                from: "subjects", // collection name in db
                localField: "subject",
                foreignField: "_id",
                as: "subject"
            }
        },
        {
            $lookup: {
                from: "students", // collection name in db
                localField: "group",
                foreignField: "_id",
                as: "group"
            }
        },
        {
            $project: {
                lecturer: { $arrayElemAt: ["$lecturer", 0], },
                tag: { $arrayElemAt: ["$tag", 0] },
                subject: { $arrayElemAt: ["$subject", 0] },
                group: { $arrayElemAt: ["$group", 0] },
                no_of_students: 1,
                duration: 1,
                parallel : 1 , 
                consecutive : 1 ,
                snv : 1,
                rooms : 1
            }
        }
    ]).exec(function (err, result) {
        
        console.log(result.map( i => i._id ))

        const final = parallel.map( item => {
           
            let session_01 = result.find( session => session._id == `${item.session_01}` ); 
            let session_02 = result.find( session => session._id == `${item.session_02}`);
            
            if(session_01 != undefined && session_02 != undefined){
                return {
                    _id : item._id ,
                    session_01 : session_01, 
                    session_02 : session_02
                }
             }else{
                 return { _id : item._id , session_01 : {} , session_02 : {}}
             }
        })
        res.status(200).send({
            data : final
        })

    });

};


exports.get_con = async (req, res) => {
    const consecutive = await Consecutive.find({});
    
    Sessions.aggregate([
        {
            $lookup: {
                from: "lecturers", // collection name in db
                localField: "lecturer",
                foreignField: "_id",
                as: "lecturer"
            }
        },
        {
            $lookup: {
                from: "tags", // collection name in db
                localField: "tag",
                foreignField: "_id",
                as: "tag"
            }
        },
        {
            $lookup: {
                from: "subjects", // collection name in db
                localField: "subject",
                foreignField: "_id",
                as: "subject"
            }
        },
        {
            $lookup: {
                from: "students", // collection name in db
                localField: "group",
                foreignField: "_id",
                as: "group"
            }
        },
        {
            $project: {
                lecturer: { $arrayElemAt: ["$lecturer", 0], },
                tag: { $arrayElemAt: ["$tag", 0] },
                subject: { $arrayElemAt: ["$subject", 0] },
                group: { $arrayElemAt: ["$group", 0] },
                no_of_students: 1,
                duration: 1,
                parallel : 1 , 
                consecutive : 1 ,
                snv : 1,
                rooms : 1
            }
        }
    ]).exec(function (err, result) {
        
        console.log(result.map( i => i._id ))

        const final = consecutive.map( item => {
           
            let session_01 = result.find( session => session._id == `${item.session_01}` ); 
            let session_02 = result.find( session => session._id == `${item.session_02}`);
            
            if(session_01 != undefined && session_02 != undefined){
                return {
                    _id : item._id ,
                    session_01 : session_01, 
                    session_02 : session_02,
                    rooms : item.rooms
                }
             }else{
                 return { _id : item._id , session_01 : {} , session_02 : {}}
             }
        })
        res.status(200).send({
            data : final
        })

    });

};


exports.upload = async (req, res) => {

    if( req.body.group_id == undefined  || req.body.group_id == null ){
        return res.status(401).send({ message : 'group id required!' });
    }

    if( req.body.results == undefined || req.body.results == null  || req.body.results.length == 0){
        return res.status(401).send({ message : 'results requied!' });
    }

    try{
        await Result.remove({ group_id :  req.body.group_id});
       
        let result = req.body.results;
        let g_id = req.body.group_id;

        let array = result.map( item => {
            return new Result({
                session: item.session,
                group_id :  g_id,
                group: item.group_id,
                lecturer: item.lecturer_id , 
                s_time : item.s_time , 
                room : item.room ,
                e_time : item.e_time ,
                day : item.day ,
                duration : item.duration,
                type : item.type
            })
        })

        Result.insertMany(array)  
        .then((result) => {
            return res.status(200).send({ message : 'added successfully' });
        })
        .catch(err => {
            return res.status(401).send({ message : 'upload failed !' , error : err });
        });
       
    
    }catch(err){
        return res.status(401).send({ message : 'upload failed !' , error : err });
    }

}


exports.get_lecturer_table = (req, res) => {
   
    Result.find( { $and : [ { group_id : req.params.group_id },{ lecturer : req.params.lecturer_id }]} )
    .then( results => {
        console.log(results.length);
        res.status(200).send(results);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while fetching the data."
        });
    });

};

exports.get_group_table = (req, res) => {
   
    Result.find( { $and : [ { group_id : req.params.group_id },{ group : req.params.group }]} )
    .then( results => {
        console.log(results.length);
        res.status(200).send(results);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while fetching the data."
        });
    });

};

exports.get_room_table = (req, res) => {
   
    Result.find( { $and : [ { group_id : req.params.group_id },{ room : req.params.room }]} )
    .then( results => {
        console.log(results.length);
        res.status(200).send(results);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while fetching the data."
        });
    });

};

exports.get_notoverlap = (req, res) => {
    Overlap.find()
        .then( data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while fetching the data."
            });
        });

};