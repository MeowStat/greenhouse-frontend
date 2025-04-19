import { Outlet } from 'react-router-dom';

import { Footer } from './Footer';
import { Header } from './Header';

function Layout() {
  return (
    <div className="font-montserrat flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 left-0 right-0 z-20 bg-white shadow-md">
        <Header />
      </header>

      <main className="flex-1 pt-6 px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200">
        <Footer />
      </footer>
    </div>
  );
}

export default Layout;
