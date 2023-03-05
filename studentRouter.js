const express = require('express');
const router = express.Router();
const Student = require('./model');
const short = require('short-uuid');

router
    .route('/')
    .get((req, res) => {
        try{
            res.status(200).json({
                status: 'success',
                data: {
                    students: Student.fetchAllStudents(),
                },
            });
        }catch (e) {
            res.status(500).json({
                status: 'fail',
                data: {
                    error: e.message,
                },
            });
        }
    })
    .post((req, res) => {
        try{
            let student = Student.addStudent({...req.body,id: short.generate()})
            res.status(201).json({
                status: 'success',
                data: {
                    student,
                },
            });
        }catch (e) {
            res.status(400).json({
                status: 'fail',
                data: {
                    error: e.message,
                },
            });
        }
    })

router
    .route('/minmax')
    .get((req, res) => {
        try{
            let students = Student.fetchAllStudents().map(s => {
                let min= null;
                let max= null;
                for(let m of s.modules){
                    if(min == null){
                        min = m;
                    }
                    if(max == null){
                        max = m;
                    }
                    if(max.note > m.note){
                        max = m;
                    }
                    if(min.note < m.note){
                        min = m;
                    }
                }
                return {
                    ...s,
                    min,
                    max
                }
            });
            res.status(200).json({
                status: 'success',
                data: {
                    students,
                },
            });

        }catch (e) {
            res.status(500).json({
                status: 'fail',
                data: {
                    error: e.message,
                },
            });
        }
    })

router
    .route('/moyenneTotale')
    .get((req, res) => {
        try{
            let students = Student.fetchAllStudents();
            let sum = 0;
            for(let s of students){
                sum = sum + s.moyenne;
            }
            res.status(200).json({
                status: 'success',
                data: {
                    average: sum/students.length,
                },
            });
        }catch (e) {
            res.status(500).json({
                status: 'fail',
                data: {
                    error: e.message,
                },
            });
        }
    })

router
    .route('/:id')
    .get((req, res) => {
        try{
            res.status(200).json({
                status: 'success',
                data: {
                    student: Student.fetchAllStudents().find(s => s.id === req.params.id)
                },
            });
        }catch (e) {
            res.status(500).json({
                status: 'fail',
                data: {
                    error: e.message,
                },
            });
        }
    })
    .put((req, res) => {
        try{
            let student = Student.fetchAllStudents().find(s => s.id === req.params.id);
            Student.deleteStudent(student);
            student = Student.addStudent({...student, ...req.body});

            res.status(204).json({
                status: 'success',
                data: {
                    student
                },
            });
        }catch (e) {
            res.status(500).json({
                status: 'fail',
                data: {
                    error: e.message,
                },
            });
        }
    })
    .delete((req, res) => {
        try{
            Student.deleteStudent({id: req.params.id})
            res.status(203).json({
                status: 'success'
            });
        }catch (e) {
            res.status(500).json({
                status: 'fail',
                data: {
                    error: e.message,
                },
            });
        }
    });


module.exports = router;