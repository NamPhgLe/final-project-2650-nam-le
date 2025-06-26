import React, { useState, useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    const className = 'dark';
    const body = document.body;

    if (darkMode) {
      body.classList.add(className);
    } else {
      body.classList.remove(className);
    }
  }, [darkMode]);

  return (
    <div>
      <header
        style={{
          padding: '1rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-color)',
          color: 'var(--text-color)',
        }}
      >
        <button onClick={() => setDarkMode((d) => !d)}>
          Switch to {darkMode ? 'Light' : 'Dark'} Mode
        </button>
      </header>

      <main style={{ padding: '1rem' }}>{children}</main>

      <footer
        style={{
          padding: '1rem',
          borderTop: '1px solid var(--border-color)',
          textAlign: 'center',
          backgroundColor: 'var(--bg-color)',
          color: 'var(--text-color)',
        }}
      >
        &copy; 2025 Footer
      </footer>
    </div>
  );
};

export default Layout;
