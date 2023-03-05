const { readFileSync,writeFileSync } = require('fs');
const Joi = require('joi');
let students;
try {
    students = readFileSync(`students.json`);
}catch (err) {
    console.error(err);
}


const schema = Joi.object({
    id: Joi.string().required(),
    nom: Joi.string()
        .required(),
    classe: Joi.string(),
    modules: Joi.array().items(
        Joi.object({
            note: Joi.number().min(0.0).max(20.0).default(0.0),
            module: Joi.string()
        })
    ),
    moyenne: Joi.number().min(0.0).max(20.0).required(),
});

exports.fetchAllStudents = function() {
    return JSON.parse(students);
}

exports.addStudent = function(student) {
    try {
        let parsedStudents = JSON.parse(students);
        let verification = schema.validate(student);
        if(verification.error){
            let sum = 0;
            for(let m of student.modules){
                sum = sum + m.note;
            }
            student["moyenne"] = sum/student.modules.length;
            parsedStudents.push(student);
            writeFileSync('./students.json', JSON.stringify(parsedStudents, null, 2), 'utf8');
            console.log('Student successfully saved to file');

            return student;
        }else{
            throw Error(verification.error.details[0].message);
        }
    } catch (error) {
        console.log(error.message, error);
    }
}

exports.deleteStudent = function(student) {
    try {
        let parsedStudents = JSON.parse(students).filter(s=> s.id != student.id);
        writeFileSync('./students.json', JSON.stringify(parsedStudents, null, 2), 'utf8');
        console.log('Student successfully deleted to file');
    } catch (error) {
        console.log(error.message, error);
    }
}


