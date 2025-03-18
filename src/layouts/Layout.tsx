import { Outlet } from 'react-router-dom'

import { Footer } from './Footer'
import { Header } from './Header'

function Layout() {
  return (
    <div className="font-montserrat flex flex-col min-h-screen">
      <header className="sticky top-0 left-0 right-0 z-10">
        <Header />
      </header>
      <main className="flex-1 pt-4">
        <Outlet />
      </main>
      <footer className="p-0 m-0">
        <Footer />
      </footer>
    </div>
  )
}

export default Layout
