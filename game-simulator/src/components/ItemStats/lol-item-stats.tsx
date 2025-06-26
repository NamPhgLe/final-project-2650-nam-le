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
    <div
      className="bg-dark text-light border border-light rounded p-3"
      style={{
        maxHeight: '600px',
        overflowY: 'auto',
        minWidth: '300px',
      }}
    >
      <h5 className="text-info">{item.name}</h5>
      {item.plaintext && <p className="fst-italic">{item.plaintext}</p>}
      <p dangerouslySetInnerHTML={{ __html: item.description }} />

      <h6 className="mt-3">Stats:</h6>
      <ul className="list-unstyled">
        {Object.entries(item.stats).map(([key, value]) => (
          <li key={key}>
            <strong className="text-warning">{key}:</strong> {value}
          </li>
        ))}
      </ul>

      {item.effect && (
        <>
          <h6 className="mt-3">Effects:</h6>
          <ul className="list-unstyled">
            {Object.entries(item.effect).map(([key, value]) => (
              <li key={key}>
                <strong className="text-success">{key}:</strong> {value}
              </li>
            ))}
          </ul>
        </>
      )}

      <h6 className="mt-3">Tags:</h6>
      <p>{item.tags.join(', ')}</p>

      <h6 className="mt-3">Gold:</h6>
      <ul className="list-unstyled">
        <li><strong>Base:</strong> {item.gold.base}</li>
        <li><strong>Total:</strong> {item.gold.total}</li>
        <li><strong>Sell:</strong> {item.gold.sell}</li>
        <li><strong>Purchasable:</strong> {item.gold.purchasable ? 'Yes' : 'No'}</li>
      </ul>
    </div>
  );
};

export default ItemStats;
