// backend/controllers/formController.js
const nodemailer = require('nodemailer');
const FormSubmission = require('../models/FormSubmission');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT == 465,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

exports.handleFormSubmission = async (req, res) => {
  // ZMIANA: Odczytujemy nowe pole 'interest'
  const { name, email, phone, message, interest } = req.body;

  const newSubmission = new FormSubmission({ name, email, phone, message, interest });
  
  try {
    await newSubmission.save();

    const mailOptions = {
      from: `"Formularz Home Evolution" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `Nowe zapytanie: ${interest || 'Sprawa ogólna'} od ${name}`,
      html: `
        <h2>Otrzymano nową wiadomość ze strony!</h2>
        <p><strong>Imię i nazwisko:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Telefon:</strong> ${phone || 'Nie podano'}</p>
        <p><strong>Temat zapytania:</strong> ${interest || 'Zapytanie ogólne'}</p>
        <hr>
        <h3>Wiadomość:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Wiadomość została wysłana pomyślnie!' });

  } catch (error) {
    console.error('Błąd podczas wysyłania formularza:', error);
    res.status(500).json({ message: 'Wystąpił błąd serwera.' });
  }
};