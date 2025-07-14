import React from 'react';
import styles from './InventoryPage.module.css';
import ItemFetcher from '../../lol-ItemFetch/ItemFetch/ItemFetch'; 

interface InventoryPageProps {
  isOpen: boolean;
  onClose: () => void;
}

const InventoryPage: React.FC<InventoryPageProps> = ({ isOpen, onClose }) => {
  return (
    <div className={`${styles.inventoryPanel} ${isOpen ? styles.open : ''}`}>
        <ItemFetcher />
    </div>
  );
};

export default InventoryPage;