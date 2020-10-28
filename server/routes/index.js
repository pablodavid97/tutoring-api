const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller')
const rolController = require('../controllers/rol.controller')
const estudianteController = require('../controllers/estudiante.controller')
const estudianteViewController = require('../controllers/estudiante-view.controller')
const reunionViewController = require('../controllers/reunion-view.controller')
const profesorViewController = require('../controllers/profesor-view.controller');

router.get('/home', async (req, res) => {
    console.log("Got in!");

    console.log("Data: ", req.query);

    usuarioId = req.query.userId
    rolId = req.query.rolId

    isStudent = (rolId === '3')

    console.log("Is student: ", isStudent);

    studentInfo = undefined
    tutor = undefined

    try {
        rol = await rolController.getRolById(rolId)
        console.log("Rol: ", rol);

        if(isStudent) {
            console.log("Entro!");
            studentInfo = await estudianteController.getEstudianteById(usuarioId)

            console.log("Student Info: ", studentInfo);

            profesorId = studentInfo.ProfesorId
            
            console.log("Profesor Id: ", profesorId);

            tutor = await usuarioController.getUserById(profesorId)

            console.log("Tutor: ", tutor);
        }

        estudiantes = await estudianteViewController.getEstudiantes()
        profesores = await profesorViewController.getProfesores()
        reuniones = await reunionViewController.getReuniones()

        console.log("Numero de Estudiantes", estudiantes.length);
        console.log("Numero de Profesores", profesores.length);
        console.log("Reuniones", reuniones);

        res.send({rol, studentInfo, tutor})
    } catch (error) {
        console.error(error.message);
    }
});

router.get('/tutor', async (req, res) => {
    rolId = 2
    estudianteId = 63

    try {
        rol = await rolController.getRolById(rolId)
        studentInfo = await estudianteController.getEstudianteById(estudianteId)
        profesorId = studentInfo.ProfesorId

        tutor = await usuarioController.getUserById(profesorId)

        res.json({rol, studentInfo, tutor})

    } catch (error) {
        console.error(error.message);
    }
});

router.get('/students', async (req, res) => {
    profesorId = 38
    try {
        estudiantes = await estudianteViewController.getEstudiantesByProfesorId(profesorId)

        res.json({estudiantes})
    } catch (error) {
        console.error(error.message);
    }
});

router.get('/student', async (req, res) => {
    estudianteId = 62
    try {
        estudiante = await estudianteViewController.getEstudianteById(estudianteId)
        res.json({estudiante})
    } catch (error) {
        console.error(error.message);
    }
});

router.get('/reports', async(req, res) => {
    try {
        reuniones = await reunionViewController.getReunionesActivas()

        res.json({reuniones})
    } catch (error) {
        console.error(error.message);
    }
});

router.get('/notifications', async(req, res) => {
    rolId = 2
    try {
        rol = await rolController.getRolById(rolId)
        res.json({rol})
    } catch (error) {
        console.error(error.message);
    }
})

module.exports = router