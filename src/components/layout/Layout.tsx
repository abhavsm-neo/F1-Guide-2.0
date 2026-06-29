import { Outlet, useLocation } from 'react-router-dom';
import { Hero } from './Hero';
import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';
import { useTheme } from '../../context/ThemeContext';

export function Layout() {
  const { darkMode } = useTheme();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className={`f1-app${darkMode ? '' : ' light-mode'}`}>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <div className="grid-bg" aria-hidden="true" />
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />
      <div className="orb orb-3" aria-hidden="true" />

      <div className="content">
        {isHome && <Hero />}
        <Navbar />
        <main id="main-content" className="main">
          <Outlet />
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
