import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center py-4">
      <div className="container mx-auto">
        <p className="text-gray-300">
          &copy; 2024 Samaan. All Rights Reserved.
        </p>
        <p>
          Contact us at{' '}
          <a
            href="mailto:support@samaan.com"
            className="text-orange-500 hover:underline"
          >
            support@samaan.com
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
