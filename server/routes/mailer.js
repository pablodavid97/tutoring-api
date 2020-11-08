const express = require('express');
const sendEmail = require('../mailer/mailer');
const router = express.Router();

router.post('/sendmail', async (req, res) => {
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

module.exports = router;
