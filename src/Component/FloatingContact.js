import React, { useState } from "react";
import { FaWhatsapp, FaPhoneAlt, FaTimes } from "react-icons/fa";

const FloatingContact = () => {
  const [open, setOpen] = useState(false);

  const phoneNumber = "919876543210"; // change to your number

  return (
    <div className="fixed bottom-5 right-5 z-50">
      
      {/* Options Box */}
      {open && (
        <div className="mb-3 bg-white shadow-lg rounded-lg p-3 flex flex-col gap-2">
          
          {/* Call Now */}
          <a
            href={`tel:${7016002448}`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <FaPhoneAlt /> Call Now
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${7016002448}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            <FaWhatsapp /> WhatsApp
          </a>
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600"
      >
        {open ? <FaTimes /> : <FaWhatsapp />}
      </button>
    </div>
  );
};

export default FloatingContact;