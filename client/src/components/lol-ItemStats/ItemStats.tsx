import React from 'react';

interface ItemStatsProps {
  item: ItemData;
}

interface ItemData {
  name: string;
  description: string;
  colloq: string;
  plaintext: string;
  into?: string[];
  from?: string[];
  specialRecipe?: number;
  inStore?: boolean;
  hideFromAll?: boolean;
  requiredChampion?: string;
  requiredAlly?: string;
  stats: Record<string, number>;
  tags: string[];
  maps: Record<string, boolean>;
  gold: {
    base: number;
    total: number;
    sell: number;
    purchasable: boolean;
  };
  effect?: Record<string, string>;
  depth?: number;
  stacks?: number;
}

const ItemStats: React.FC<ItemStatsProps> = ({ item }) => {
  return (
    <div>
      <h5>{item.name}</h5>
      {item.plaintext && <p>{item.plaintext}</p>}
      <div dangerouslySetInnerHTML={{ __html: item.description }} />

      <h6>Stats:</h6>
      <ul>
        {Object.entries(item.stats).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong> {value}
          </li>
        ))}
      </ul>

      {item.effect && (
        <>
          <h6>Effects:</h6>
          <ul>
            {Object.entries(item.effect).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        </>
      )}

      <h6>Tags:</h6>
      <p>{item.tags.join(', ')}</p>

      <h6>Gold:</h6>
      <ul>
        <li><strong>Base:</strong> {item.gold.base}</li>
        <li><strong>Total:</strong> {item.gold.total}</li>
        <li><strong>Sell:</strong> {item.gold.sell}</li>
        <li><strong>Purchasable:</strong> {item.gold.purchasable ? 'Yes' : 'No'}</li>
      </ul>
    </div>
  );
};

export default ItemStats;
