import { Outlet, useLocation } from 'react-router-dom';
import { Hero } from './Hero';
import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';
import { Sidebar } from './Sidebar';
import { RaceCountdown } from './RaceCountdown';
import { GlobalSearch } from './GlobalSearch';
import styles from './Layout.module.css';

export function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <>
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>

      <div className="app-layout">
        <Sidebar />

        <main className="main-content" id="main-content">
          {isHome && <Hero />}
          <RaceCountdown />
          <div className="content-area">
            <Outlet />
          </div>
        </main>
      </div>

      <Navbar />
      <MobileNav />
      <GlobalSearch />
    </>
  );
}
