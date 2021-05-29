
//import Lecturer
const GenerateSubGroup = require('../models/generateSubgroup');




// create generate sub group ID
exports.add = async (req, res) => {
    console.log("mennameka",req.body);
    // Validate request
    // if (req.body.name == null || req.body.name == undefined) {
    //     res.status(400).send({
    //         message: "Content can not be empty!"
    //     });
    //     return;
    // }

    let new_generateID = GenerateSubGroup({
        academicYear: req.body.academicYear,
        group_mo: req.body.group_mo,
        subgroup_mo: req.body.subgroup_mo,
        program: req.body.program,
    });
    // Save Tutorial in the database
    try {
        GenerateSubGroup.find({ academicYear: new_generateID.academicYear }, function (err, docs) {
            // if (docs.length == 0) {
                //save 
                new_generateID.save(function (err) {
                    if (err) {
                        return err;
                    }
                    console.log("New user register");

                    return res.status(200).send(new_generateID);
                })
            // } else {
            //     return res.status(403).send('Already have')
            // }
        })

    } catch (error) {
        return res.status(405).send(error)

    }
};



exports.update = async (req, res) => {
    console.log(req.body);
    // if (req.body.empId == null || req.body.empId == undefined) {
    //     res.status(400).send({
    //         message: "Content can not be empty!"
    //     });
    //     return;
    // }

    const update_result = await GenerateSubGroup.findOneAndUpdate({academicYear: req.body.academicYear}, 
        { academicYear: req.body.academicYear, program: req.body.program, group_mo: req.body.group_mo, subgroup_mo: req.body.subgroup_mo },
        { new: true }
    ).then(result =>
        res.status(200).send({
            message: "Successfully update"
        })
    )
        .catch(err =>
            res.status(400).send({
                message: err
            })
        )


}

exports.delete = async (req, res) => {

    console.log(req.params.id);
    
    if (req.params.id == null || req.params.id == undefined) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    
    GenerateSubGroup.findOneAndDelete({ _id: req.params.id })
    .then( result => {

        if (!result) {
            throw new Error('No record found')
        }

        res.status(200).send({
            message: "Deleted successfully"
        });
    
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while deleting the data."
        });
    });   
   
}


// exports.delete = async (req, res) => {

//     console.log(req.body);
//     // if (req.body.empId == null || req.body.empId == undefined) {
//     //     return  res.status(400).send({
//     //         message: "Content can not be empty!"
//     //     });
//     // }
//     var result = await GenerateSubGroup.findOneAndDelete({id: req.body.id})
//     if (!result) {
//       return  res.status(400).send({
//             message: "No Found"
//         });
//     }
//     return res.status(200).send({
//         message: "Deleted success"
//     });

// }

exports.get = async (req, res) => {
    try {
        const lecturer = await GenerateSubGroup.find();

        return res.status(200).send({
            data: lecturer
        })
    } catch (error) {
        console.log(error);
        return res.status(401).send({
            error: error
        })
    }

}

exports.getOne = async (req, res) => {

    console.log(req.params);

    try {
        const lectuggrer = await GenerateSubGroup.findOne({  _id: req.params.id });
        console.log(lectuggrer);
        return res.status(200).send({
            data: lectuggrer
        })
    } catch (error) {
        return res.status(401).send({
            error: error
        })
    }

}



// exports.get_filtered = async (req, res) => {

//     console.log(req.body);
//     var word = req.body.word;
//     var column
//     var whe = {
//         faculty: word
//     }
//     if (req.body.filed == "name") {
//         column = "name"
//         whe = {
//             name: word
//         }
//     }
//     else if (req.body.filed == "employeeId") {
//         column = "empId"
//         whe = {
//             empId: word
//         }
//     }
//     else if (req.body.filed == "faculty") {
//         column = "faculty"
//         whe = {
//             faculty: word
//         }
//     }
//     else if (req.body.filed == "department") {
//         column = "department"
//         whe = {
//             department: word
//         }
//     }
//     else if (req.body.filed == "center") {
//         column = "center"
//         whe = {
//             center: word
//         }
//     }
//     else if (req.body.filed == "building") {
//         column = "building"
//         whe = {
//             building: word
//         }
//     }
//     else if (req.body.filed == "level") {
//         column = "level"
//         whe = {
//             level: word
//         }
//     }
//     console.log(column);
//     console.log(word);

//     try {
//         const lecturer = await Lecturer.find( whe );
//         return res.status(200).send({
//             data: lecturer
//         })
//     } catch (error) {
//         return res.status(401).send({
//             error: error
//         })
//     }

// }


