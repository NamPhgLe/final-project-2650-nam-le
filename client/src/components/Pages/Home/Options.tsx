import React from 'react';
import styles from './HomePage.module.css';

interface OptionsProps {
  isVisible: boolean;
  slideOut: boolean;
  onGamePick: (label: string) => void;
}

const Options: React.FC<OptionsProps> = ({ isVisible, slideOut, onGamePick }) => {
  const labels = ['League of Legends', 'Coming Soon...', 'Coming Soon...'];

  return (
    <div
      className={`
        ${styles.leftPanel}
        ${isVisible ? styles.visible : ''}
        ${slideOut ? styles.slideOut : ''}
      `}
    >
      <h1 className={styles.welcomeTitle}>Choose a Game</h1>
      <div className={styles.optionsGrid}>
        {labels.map((label, idx) => (
          <div
            key={idx}
            className={styles.optionBox}
            onClick={() => label === 'League of Legends' && onGamePick(label)}
            style={{ cursor: label === 'League of Legends' ? 'pointer' : 'default' }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Options;
