import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './NavBar.module.css';

const NavBar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        {['/', '/login', '/signup'].map((path, i) => {
          const names = ['Home', 'Login', 'Signup'];
          const isActive = location.pathname === path;
          return (
            <li key={i}>
              <Link
                to={path}
                className={isActive ? styles.active : undefined}
              >
                {names[i]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavBar;
