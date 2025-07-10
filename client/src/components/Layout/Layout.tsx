import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  React.useEffect(() => {
    document.body.classList.add('dark');
    return () => {
      document.body.classList.remove('dark');
    };
  }, []);

  return (
    <div>
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
