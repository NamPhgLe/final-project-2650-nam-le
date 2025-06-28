import React, { useState } from 'react';
import styles from './ItemSearchFilter.module.css';

interface ItemSearchFilterProps {
  onSearch: (term: string) => void;
}

const ItemSearchFilter: React.FC<ItemSearchFilterProps> = ({ onSearch }) => {
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setValue(term);
    onSearch(term);
  };

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search by item name..."
        className={styles.searchInput}
      />
    </div>
  );
};

export default ItemSearchFilter;
