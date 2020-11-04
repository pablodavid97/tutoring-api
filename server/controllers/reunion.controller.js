const database = require('../models/connection-manager');
const { logger } = require('../utils/logger');
const reunion = database.reunion;
const reunionController = {};

// SELECT *
reunionController.find = async () => {
  try {
    const meeting = await reunion.findAll();
    return meeting;
  } catch (error) {
    console.error(error.message);
  }
};

// CREATE MEETING
reunionController.createMeeting = async (
  subject,
  description,
  date,
  professorId,
  studentId,
  email
) => {
  try {
    meeting = await reunion.create(
      {
        tema: subject,
        descripcion: description,
        fecha: date,
        profesorId: professorId,
        estudianteId: studentId,
        estadoId: 1,
        createdBy: email,
        createdOn: new Date()
      },
      {
        fields: [
          'tema',
          'descripcion',
          'fecha',
          'profesorId',
          'estudianteId',
          'estadoId',
          'createdBy',
          'createdOn'
        ]
      }
    );
    console.log("Meetings: ", meeting.dataValues);
    return meeting.dataValues;
  } catch (error) {
    logger.error(error.message);
  }
};

// DELETE MEETING (SET MEETING STATUS TO 5)
reunionController.deleteMeeting = async (reunionId, userEmail) => {
  try {
    await reunion.update(
      { estadoId: 5, updatedOn: new Date(), updatedBy: userEmail },
      {
        where: {
          id: reunionId
        }
      }
    );
  } catch (error) {
    logger.error(error.message);
  }
};

reunionController.editMeeting = async (
  subject,
  description,
  date,
  studentId,
  email,
  meetingId
) => {
  try {
    await reunion.update(
      {
        tema: subject,
        descripcion: description,
        fecha: date,
        estudianteId: studentId,
        estadoId: 2,
        updatedOn: new Date(),
        updatedBy: email
      },
      {
        where: {
          id: meetingId
        }
      }
    );
  } catch (error) {
    logger.error(error.message);
  }
};

reunionController.editMeetingStatus = async (meetingId, statusId, email) => {
  try {
    await reunion.update({estadoId: statusId, updatedBy: email, updatedOn: new Date()}, {
      where: {
        id: meetingId
      }
    })
  } catch (error) {
    logger.error(error.message)
  }
}

reunionController.editMeetingStudentComment = async (meetingId, comment, email) => {
  try {
    await reunion.update({comentariosEstudiante: comment, updatedBy: email, updatedOn: new Date()}, {
      where: {
        id: meetingId
      }
    })
  } catch (error) {
    logger.error(error.message)
  }
}

module.exports = reunionController;
