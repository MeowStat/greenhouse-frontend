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

      {/* Main Content */}
      <main className="flex-1 w-full pt-6 pb-10">
        <div className="px-4 sm:px-6 lg:px-10 xl:px-16 max-w-screen-xl mx-auto w-full">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200">
        <Footer />
      </footer>
    </div>
  );
}

export default Layout;
