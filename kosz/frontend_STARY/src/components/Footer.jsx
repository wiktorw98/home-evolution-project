import React from 'react';

const Footer = () => {
  const companyName = "Home Evolution Sp. z o.o.";
  const currentYear = new Date().getFullYear();
  const address = "ul. Barwinek 3/45, 25-150 Kielce";
  const email = "biuro@home-evolution.pl";
  const phone = "+48 123 456 789";

  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-6 py-10">
        <div className="text-center">
          <h3 className="text-2xl font-bold">{companyName}</h3>
          <p className="text-gray-300 mt-2">{address}</p>
          <div className="mt-4 flex justify-center gap-6">
            <a href={`mailto:${email}`} className="text-gray-300 hover:text-accent transition-colors">{email}</a>
            <a href={`tel:${phone}`} className="text-gray-300 hover:text-accent transition-colors">{phone}</a>
          </div>
        </div>
        <div className="text-center text-gray-400 border-t border-gray-700 mt-8 pt-6">
          <p>&copy; {currentYear} {companyName}. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;