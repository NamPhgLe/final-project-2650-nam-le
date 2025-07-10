import React, { useEffect } from 'react';
import styles from './ChampionStatsPage.module.css';

interface ChampionStatsPageProps {
    championId: string;
    onClose: () => void;
    isClosing: boolean;
}

const ChampionStatsPage: React.FC<ChampionStatsPageProps> = ({
    championId,
    onClose,
    isClosing,
}) => {
    useEffect(() => {
        if (!isClosing) return;
        const timer = setTimeout(onClose, 300);
        return () => clearTimeout(timer);
    }, [isClosing, onClose]);

    return (
        <div className={`${styles.panel} ${isClosing ? styles.exit : ''}`}>
            <button
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close champion stats"
            >
                ×
            </button>
            <h2>Stats for {championId}</h2>
            <p>Detailed stats, lore, abilities…</p>
        </div>
    );
};

export default ChampionStatsPage;
