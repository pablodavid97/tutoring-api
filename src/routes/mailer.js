const express = require('express');
const sendEmail = require('../mailer/mailer');
const router = express.Router();
const utils = require('../lib/utils')

router.post('/send-pwd-reset', async (req, res) => {
  try {
    const context = {
      user: req.body
    };

    const message = {
      from: process.env.MAIL_SENDER,
      to: process.env.MAIL_RECIPIENT,
      subject: 'USFQ Tutorías: Restablece tu contraseña',
      template: '../views/mailer/password-reset-email',
      context: context
    };

    const result = await sendEmail(message);

    res.json({
      status: true,
      playload: result
    });
  } catch (error) {
    console.error(error.message);
    res.json({
      status: false,
      playload: 'Something went wrong in sending the email.'
    });
  }
});

router.post('/send-meeting-notification', async (req, res) => {
  try {
    let preHeader = ""
    let messageStart = ""
    let messageEnding = ""
    let student = req.body.student
    let professor = req.body.professor
    let meeting = req.body.meeting
    let meetingSubject = ""
    let isProfessor = false
    let isStudent = false
    let user = undefined

    if(req.body.isProfessor) {
      isProfessor = req.body.isProfessor
    } else if(req.body.isStudent) {
      isStudent = req.body.isStudent
    }

    console.log("meeting: ", meeting);

    // Changes message based on meeting status
    if(meeting.estadoId === 1) {
      user = student
      preHeader = "Tu profesor ha creado una reunión en la que participas."
      meetingSubject = "USFQ Tutorías: Reunión Creada"
      messageStart = professor.nombres + " " + professor.apellidos + " te ha invitado a una reunión. Los detalles se muestran a continuación."
      messageEnding = "Si necesitas mayor información comunicate con tu profesor."
    } else if (meeting.estadoId === 2) {
      user = student
      preHeader = "Tu profesor ha editado una reunión en la que participabas."
      meetingSubject = "USFQ Tutorías: Reunión Editada"
      messageStart = professor.nombres + " " + professor.apellidos + " editó una reunión en la que participabas. Los detalles se muestran a continuación."
      messageEnding = "Si necesitas mayor información comunicate con tu profesor."
    } else if (meeting.estadoId === 3) {
      user = professor
      preHeader = student.nombres + " aceptó una reunión que creaste."
      meetingSubject = "USFQ Tutorías: Reunión Aceptada"
      messageStart = student.nombres + " " + student.apellidos + " aceptó la reunión. Los detalles se muestran a continuación."
      messageEnding = "Planifica los temas a tratar en esta reunión antes de que se realice."
    } else if (meeting.estadoId === 4){
      user = professor
      preHeader = student.nombres + " rechazó una reunión que creaste."
      meetingSubject = "USFQ Tutorías: Reunión Rechazada"
      messageStart = student.nombres + " " + student.apellidos + " rechazó la reunión que creaste. Los detalles se muestran a continuación."
      messageEnding = "Ponte en contacto con " + student.nombres + " " + student.apellidos + " para reagendar la reunión."
    } else if (meeting.estadoId === 5){
      user = student
      preHeader = "Tu profesor ha eliminado una reunión en la que participabas."
      meetingSubject = "USFQ Tutorías: Reunión Eliminada"
      messageStart = professor.nombres + " " + professor.apellidos + " eliminó una reunión en la que participabas. Los detalles se muestran a continuación."
      messageEnding = "Si necesitas mayor información comunicate con tu profesor."
    } else if (meeting.estadoId === 6){
      // change date format 
      const dateTimeValues = utils.getDateTimeValues(meeting.fecha);

      meeting.fecha = dateTimeValues[0] + ' ' + dateTimeValues[1] + ':' + dateTimeValues[2] + dateTimeValues[3].text;

      if(isProfessor) {
        user = professor
      } else if (isStudent) {
        user = student
      }
      preHeader = "Tienes una reunión el día de hoy."
      meetingSubject = "USFQ Tutorías: Reunión en Progreso"
      messageStart = "Tienes una reunión fijada para el día de hoy. Los detalles se muestran a continuación."
      messageEnding = "Ingresa a la plataforma para asistir a la reunión e incluir tus comentarios."
    } else if (meeting.estadoId === 7){
      preHeader = "Una reunión que participaste se realizó con exito."
      meetingSubject = "USFQ Tutorías: Reunión Realizada"

      if(isProfessor) {
        user = professor
        messageStart = "Indicaste que la reunión se realizó con exito. Los detalles se muestran a continuación."
        messageEnding = "Si quieres agendar una nueva reunión ingresa a la plataforma." 
      } else if(isStudent) {
        user = student
        messageStart = professor.nombres + " " + professor.apellidos + " indicó que la reunión se realizó con exito. Los detalles se muestran a continuación"
        messageEnding = "Si tienes alguna duda sobre la información presentada comunicate con tu profesor."
      }
    } else if (meeting.estadoId === 8){
      preHeader = "Una reunión que participabas no se realizó."
      meetingSubject = "USFQ Tutorías: Reunión no Realizada"

      if(isProfessor) {
        user = professor
        messageStart = "Indicaste que la reunión no se realizó. Los detalles se muestran a continuación."
        messageEnding = "Si quieres agendar una nueva reunión ingresa a la plataforma." 
      } else if(isStudent) {
        user = student
        messageStart = professor.nombres + " " + professor.apellidos + " indicó que la reunión no se realizó. Los detalles se muestran a continuación"
        messageEnding = "Si tienes alguna duda sobre la información presentada comunicate con tu profesor."
      }
    }

    const context = {
      user: user,
      student: student,
      professor: professor,
      meeting: meeting,
      preHeader: preHeader,
      messageStart: messageStart,
      messageEnding: messageEnding
    };

    const message = {
      from: process.env.MAIL_SENDER,
      to: process.env.MAIL_RECIPIENT,
      subject: meetingSubject,
      template: '../views/mailer/meeting-notification-email',
      context: context
    };

    const result = await sendEmail(message);

    res.json({
      status: true,
      playload: result
    });
  } catch (error) {
    console.error(error.message);
    res.json({
      status: false,
      playload: 'Something went wrong in sending the email.'
    });
  }
})

module.exports = router;
