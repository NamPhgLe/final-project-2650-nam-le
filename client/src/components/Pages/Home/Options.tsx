import React from 'react';
import styles from './HomePage.module.css';
import { useNavigate } from 'react-router-dom';

interface OptionsProps {
  isVisible: boolean;
  slideOut: boolean;
  onGamePick: () => void;
}

const Options: React.FC<OptionsProps> = ({ isVisible, slideOut, onGamePick }) => {
  const navigate = useNavigate();

  const handleClick = (label: string) => {
    if (label === 'League of Legends') {
      onGamePick();
      setTimeout(() => navigate('/league'), 400); // Wait for slide-out animation
    }
  };

  const labels = ['League of Legends', 'Coming Soon...', 'Coming Soon...'];

  const panelClass = `${styles.leftPanel} 
    ${isVisible ? styles.visible : ''} 
    ${slideOut ? styles.slideOut : ''}`.trim();

  return (
    <div className={panelClass}>
      <h1 className={styles.welcomeTitle}>Choose a Game</h1>
      <div className={styles.optionsGrid}>
        {labels.map((label, idx) => (
          <div
            key={idx}
            className={styles.optionBox}
            onClick={() => handleClick(label)}
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
