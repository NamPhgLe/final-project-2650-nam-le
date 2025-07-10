import React, { useState, useEffect } from 'react';
import styles from './HomePage.module.css';
import Options from './Options';
import Welcome from './Welcome';
import { useNavigate, useLocation } from 'react-router-dom';

const preloadLeague = () => import('../Content/LeagueOfLegendsPage');

const HomePage: React.FC = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [slideOutWelcome, setSlideOutWelcome] = useState(false);
  const [slideOutOptions, setSlideOutOptions] = useState(false);
  const [isLoadingLeague, setIsLoadingLeague] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      setShowOptions(false);
      setSlideOutWelcome(false);
      setSlideOutOptions(false);
      setIsLoadingLeague(false);
    }
  }, [location.pathname]);

  const handleGetStarted = () => {
    if (showOptions) {
      setShowOptions(false);
      setSlideOutWelcome(false); 
      setSlideOutOptions(false);
    } else {
      setShowOptions(true);
    }
  };

  const handleGameSelect = () => {
    setIsLoadingLeague(true);

    preloadLeague().then(() => {
      setIsLoadingLeague(false);

      setSlideOutWelcome(true);
      setSlideOutOptions(true);

      setTimeout(() => {
        navigate('/league');
      }, 400);
    });
  };

  return (
    <div className={styles.homePageLayout}>
      <Options
        isVisible={showOptions}
        slideOut={slideOutOptions}
        onGamePick={handleGameSelect}
      />
      <div className={`${styles.rightPanel} ${slideOutWelcome ? styles.slideOut : ''}`}>
        <Welcome togglePanel={handleGetStarted} isPanelVisible={showOptions} />
      </div>

      {isLoadingLeague && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '1.5rem',
            zIndex: 9999,
          }}
        >
          Loading League of Legends...
        </div>
      )}
    </div>
  );
};

export default HomePage;
