const { logger } = require('../utils/logger');
const {Sequelize} = require('sequelize')
const database = require('../models/connection-manager');
const reunionView = database.reunionView
const reunionViewController = {}

reunionViewController.getReunionesByProfessor = async (userId) => {
    try {
        reuniones = await reunionView.findAll({
            where: {
                profesorId: userId,
                estadoId: {
                    [Sequelize.Op.not]: 5
                }
            }
        });

        return reuniones
    } catch (error) {
        logger.error(error.message)
    }
}

reunionViewController.getReunionesByStudent = async (userId) => {
    try {
        reuniones = await reunionView.findAll({
            where: {
                estudianteId: userId,
                estadoId: {
                    [Sequelize.Op.not]: 5
                }
            }
        });

        return reuniones;

    } catch (error) {
        logger.error(error.message)
    }
}

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

reunionViewController.getLastMeetingId = async () => {
    try {
        reunionId = await reunionView.findOne({
            order: [['id', 'DESC']]
        });

        // console.log("Reunion Id: ", reunionId);

        return reunionId.id;
    } catch (error) {
        logger.error(error.message)
    }
}

module.exports = reunionViewController