import React from 'react';
import styles from './InventoryPage.module.css';
import ItemFetcher from '../../lol-ItemFetch/ItemFetch/ItemFetch'; 

interface InventoryPageProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InventoryPage({ isOpen, onClose }: InventoryPageProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.show : ''}`}
        onClick={onClose}
      />

      {/* Sliding panel */}
      <div className={`${styles.panel} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <h2>Inventory</h2>
          <button onClick={onClose} aria-label="Close inventory">
            ×
          </button>
        </div>
        <div className={styles.content}>
          <ItemFetcher />
        </div>
      </div>
    </>
  );
}
