const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller')
const rolController = require('../controllers/rol.controller');
const handler = require('express-async-handler');

router.get('/users', handler (async (req, res) => {
    let users = await usuarioController.getAllUsers()
    let userRoles = await usuarioController.getAllUsersRoles()
    res.json(users)
  }));

//Usuario
router.get('/users2', handler(async (req, res)=>{
    const result = await usuarioController.getAllUsers()
    res.status(200).json(result)
}))

router.get('/users/:id', handler(async (req, res)=>{
    const result = await usuarioController.findOne(req.params.id)
    res.status(200).json(result)
}))

// //Rol
// router.get('/rol', handler(async (req, res)=>{
//     const result = await rolController.getRoleUsers()
//     res.status(200).json(result)
// }))

// router.get('/rol/:id', handler(async (req, res)=>{
//     const result = await rolController.findOne(req.params.id)
//     res.status(200).json(result)
// }))

// //Estudiante
// router.get('/estudiante', handler(async (req, res)=>{
//     const result = await estudianteController.find()
//     res.status(200).json(result)
// }))

// router.get('/estudiante/:id', handler(async (req, res)=>{
//     const result = await estudianteController.findOne(req.params.id)
//     res.status(200).json(result)
// }))

// // //Profesor
// router.get('/profesor', handler(async (req, res)=>{
//     const result = await profesorController.find()
//     res.status(200).json(result)
// }))

// router.get('/profesor/:id', handler(async (req, res)=>{
//     const result = await profesorController.findOne(req.params.id)
//     res.status(200).json(result)
// }))

// // //Decano
// router.get('/decano', handler(async (req, res)=>{
//     const result = await decanoController.find()
//     res.status(200).json(result)
// }))

// router.get('/decano/:id', handler(async (req, res)=>{
//     const result = await decanoController.findOne(req.params.id)
//     res.status(200).json(result)
// }))

// // //Reunion
// router.get('/reunion', handler(async (req, res)=>{
//     const result = await reunionController.find()
//     res.status(200).json(result)
// }))

// router.get('/reunion/:id', handler(async (req, res)=>{
//     const result = await reunionController.findOne(req.params.id)
//     res.status(200).json(result)
// }))

// // //Estado Reunion
// router.get('/estado-reunion', handler(async (req, res)=>{
//     const result = await estadoReunionController.find()
//     res.status(200).json(result)
// }))

// router.get('/estado-reunion/:id', handler(async (req, res)=>{
//     const result = await estadoReunionController.findOne(req.params.id)
//     res.status(200).json(result)
// }))

module.exports = router