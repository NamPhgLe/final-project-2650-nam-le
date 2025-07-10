import React from 'react';
import styles from './HomePage.module.css';

interface WelcomeProps {
  togglePanel: () => void;
  isPanelVisible: boolean;
}

const Welcome: React.FC<WelcomeProps> = ({ togglePanel, isPanelVisible }) => {
  return (
    <div className={styles.rightPanel}>
      <h1 className={styles.welcomeTitle}>Welcome to Game Simulator</h1>
      <p className={styles.description}>Build, Create, and Experiment.</p>
      <button className={styles.getStartedButton} onClick={togglePanel}>
        {isPanelVisible ? 'Close' : 'Get Started'}
      </button>
    </div>
  );
};

export default Welcome;
