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
            <a
              href="https://www.facebook.com/bistrosaimaaoy"
              className="hover:text-emerald-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
            {/* <a href="#" className="hover:text-emerald-400">
              Instagram
            </a> */}
          </div>
          <div className="relative w-full">
            <p className="text-gray-400 text-sm">
              &copy; 2025 Bistro Saimaa Oy. Kaikki oikeudet pidätetään. &nbsp;|&nbsp; Made with 🩵 by{' '}
              <a
                href="https://github.com/koinsaari"
                className="hover:underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Aaro
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
