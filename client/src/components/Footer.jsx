import React from 'react';


function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4 text-center mt-auto shadow-inner">
      <div className="container mx-auto">
        <p className="text-sm">&copy; {new Date().getFullYear()} Blog App. Bütün Hüquqlar Qorunur.</p>
      </div>
    </footer>
  );
}

export default Footer;