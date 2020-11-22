const { sequelize } = require('../models/connection-manager');
const database = require('../models/connection-manager');
const { logger } = require('../utils/logger');
const gpaView = database.gpaView;
const gpaViewController = {};

gpaViewController.getGPAListByStudent = async (studentId) => {
    try {
        gpaList = await gpaView.findAll({
            where: {
                estudianteId: studentId
            }
        })

        return gpaList
    } catch (error) {
        logger.error(error.message)
    }
}

module.exports = gpaViewController