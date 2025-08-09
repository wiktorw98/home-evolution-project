'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const logoText = "Home Evolution";
  const navLinks = [
    { title: 'Strona Główna', path: '/' },
    { title: 'Oferta', path: '/oferta' },
    { title: 'Realizacje', path: '/realizacje' },
    { title: 'Blog', path: '/blog' },
    { title: 'Kontakt', path: '/kontakt' },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-accent hover:opacity-80 transition-opacity">
          {logoText}
        </Link>
        <div className="hidden md:flex space-x-8 items-center">
          {navLinks.map((link) => (
            <Link key={link.title} href={link.path} className="text-text-main hover:text-accent transition-colors duration-300 font-semibold">
              {link.title}
            </Link>
          ))}
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-primary focus:outline-none">
            {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white px-6 pt-2 pb-4 border-t border-gray-200">
          {navLinks.map((link) => (
            <Link key={link.title} href={link.path} onClick={() => setIsOpen(false)} className="block py-3 text-center text-text-main hover:bg-background rounded-md font-semibold">
              {link.title}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};
export default Navbar;