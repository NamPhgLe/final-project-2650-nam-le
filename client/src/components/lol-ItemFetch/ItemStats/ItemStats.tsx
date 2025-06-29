import type { ItemData } from '../../../constants/lol-ItemTypes';
import styles from './ItemStats.module.css';

interface ItemStatsProps {
  item: ItemData;
  img? :string;
}

const ItemStats: React.FC<ItemStatsProps> = ({ item, img }) => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
      {img && (
          <img
            src={img}
            alt={item.name}
            className={styles.itemIcon}
          />
        )}
        <span>{item.name}</span>
        
      </div>
      <p>Id: {item.id}</p>
      {item.plaintext && <p>{item.plaintext}</p>}

      <div dangerouslySetInnerHTML={{ __html: item.description }} />
        <br></br>
      <h6>Gold:</h6>
      <ul>
        <li><strong>Sell:</strong> {item.gold.sell}</li>
      </ul>
    </div>
  );
};

export default ItemStats;
