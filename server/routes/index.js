const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller')
const rolController = require('../controllers/rol.controller')
const estudianteController = require('../controllers/estudiante.controller')

router.get('/home', async (req, res) => {
    console.log("Got in!");

    usuarioId = 61
    rolId = 1

    isStudent = true
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

        res.json({rol, studentInfo, tutor})
    } catch (error) {
        console.error(error.message);
    }
 
})

module.exports = router