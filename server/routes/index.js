const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller')

router.get('/', async (req, res) => {
    let users = await usuarioController.getAllUsers()
    let userRoles = await usuarioController.getAllUsersRoles()
  
    console.log("Usuarios registrados: ", users.length);
    // console.log("Roles y Usuarios: ", userRoles);
    // console.log("Users: ", users);
    res.json({'Users': users})
  });

router.get('/home', async (req, res) => {

    userId = 1

    try {
        user = await usuarioController.findById(userId);

        res.json(user)
    } catch (error) {
        console.error(error.message);
    }
 
})

module.exports = router