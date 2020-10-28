const { logger } = require('../utils/logger');
const {Sequelize} = require('sequelize')
const database = require('../models/connection-manager')
const reunionView = database.reunionView
const reunionViewController = {}

reunionViewController.getReuniones = async () => {
    try {
        reuniones = await reunionView.findAll()

        return reuniones;

    } catch (error) {
        logger.error(error.message);
    }
}

reunionViewController.getReunionesActivas = async () => {
    try {
        reuniones = await reunionView.findAll({
            where: {
                estadoId: {
                    [Sequelize.Op.not]: 5
                }
            }
        })

        return reuniones
    } catch (error) {
        logger.error(error.message);
    }
}

module.exports = reunionViewController