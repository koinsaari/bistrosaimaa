/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <div className="text-2xl font-bold mb-4">Bistro Saimaa</div>
          <div className="flex gap-6 mb-4">
            <a href="#" className="hover:text-emerald-400">
              Facebook
            </a>
            <a href="#" className="hover:text-emerald-400">
              Instagram
            </a>
          </div>
          <p className="text-gray-400 text-sm">
            &copy; 2025 Bistro Saimaa &nbsp;|&nbsp; Made with 🩵 by{' '}
            <a
              href="https://www.linkedin.com/in/aarokoinsaari"
              className="text-emerald-400 hover:text-emerald-300 hover:underline transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Aaro
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
