// backend/controllers/formController.js
const nodemailer = require('nodemailer');
const FormSubmission = require('../models/FormSubmission');

// Konfiguracja transportera Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.handleFormSubmission = async (req, res) => {
  const { name, email, phone, message } = req.body;

  // Zapisz zgłoszenie w bazie danych
  const newSubmission = new FormSubmission({ name, email, phone, message });
  
  try {
    await newSubmission.save();

    // Przygotuj treść e-maila
    const mailOptions = {
      from: `"Formularz kontaktowy" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Wysyłamy na nasz własny adres
      subject: `Nowa wiadomość od ${name}`,
      html: `
        <h2>Otrzymano nową wiadomość ze strony internetowej!</h2>
        <p><strong>Imię i nazwisko:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone || 'Nie podano'}</p>
        <hr>
        <h3>Wiadomość:</h3>
        <p>${message}</p>
      `,
    };

    // Wyślij e-mail
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Wiadomość została wysłana pomyślnie!' });

  } catch (error) {
    console.error('Błąd podczas wysyłania formularza:', error);
    res.status(500).json({ message: 'Wystąpił błąd serwera.' });
  }
};