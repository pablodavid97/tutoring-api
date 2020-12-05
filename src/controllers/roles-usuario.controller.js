const database = require('../models/connection-manager');
const { logger } = require('../utils/logger');
const rolesUsuario = database.rolesUsuario;
const rolesUsuarioController = {};

rolesUsuarioController.insertRolDeUsuario = async (id, rolId) => {
    try {
        await rolesUsuario.create({
            usuarioId: id,
            rolId: rolId
        }, {
            fields: ["usuarioId", "rolId"]
        })
    } catch (error) {
        logger.error(error.message)
    }
}

module.exports = rolesUsuarioController;
