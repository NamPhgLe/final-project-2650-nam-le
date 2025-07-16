import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './NavBar.module.css';

interface NavBarProps {
  loggedIn: boolean;
  onLogout: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ loggedIn, onLogout }) => {
  const location = useLocation();

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li>
          <Link
            to="/"
            className={location.pathname === '/' ? styles.active : undefined}
          >
            Home
          </Link>
        </li>
        {!loggedIn && (
          <>
            <li>
              <Link
                to="/login"
                className={location.pathname === '/login' ? styles.active : undefined}
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/signup"
                className={location.pathname === '/signup' ? styles.active : undefined}
              >
                Signup
              </Link>
            </li>
          </>
        )}
        {loggedIn && (
          <li>
            <button onClick={onLogout} className={styles.logoutButton}>
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
