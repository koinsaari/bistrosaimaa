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
            <a href="#" className="hover:text-emerald-400">
              Instagram
            </a>
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
            {/* <a
              href="https://github.com/koinsaari/bistrosaimaa"
              className="absolute right-0 bottom-0 text-gray-500 hover:text-emerald-400 text-xs flex items-center gap-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
              <span>Sivuston lähdekoodi</span>
            </a> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
