import { useEffect, useState, useRef } from 'react';
import MapFilter from './MapFilter';
import axios from 'axios';

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


type ItemMap = Record<string, ItemData>;

export default function ItemFetcher() {
  const [items, setItems] = useState<ItemMap | null>(null);
  const [version, setVersion] = useState<string | null>(null);
  const [showText, setShowText] = useState(true);
  const [selectedMap, setSelectedMap] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const filteredItems = items
    ? selectedMap
      ? Object.entries(items).filter(([_, item]) => item.maps[selectedMap])
      : Object.entries(items)
    : [];

  useEffect(() => {
    const loadData = async () => {
      try {
        const versionRes = await axios.get<string[]>(
          'https://ddragon.leagueoflegends.com/api/versions.json'
        );
        const latestVersion = versionRes.data[0];
        setVersion(latestVersion);

        const itemsRes = await axios.get(
          `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/item.json`
        );
        setItems(itemsRes.data.data);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerSize({ width, height });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const autoHideText = containerSize.height < 400 && containerSize.width < 800;
  const effectiveShowText = showText && !autoHideText;

 return (
    <div className="container mt-4">
      <h2>Items (Version: {version ?? 'loading...'})</h2>

      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowText((prev) => !prev)}
      >
        {showText ? 'Hide Text' : 'Show Text'}
      </button>

      {/* MapFilter OUTSIDE scrollable container */}
      {items && version ? (
        <MapFilter
        items={items}
        version={version}
        showText={effectiveShowText}
        selectedMap={selectedMap}
        onSelectMap={setSelectedMap}
      />
      ) : (
        <p>Loading items...</p>
      )}

      {/* Scrollable container for filtered items */}
      <div
        ref={containerRef}
        style={{
          maxHeight: '600px',
          maxWidth: '100%',
          overflowY: 'auto',
          resize: 'both',
          border: '1px solid #444',
          padding: '10px',
          marginTop: '1rem',
        }}
      >
        <div className="row justify-content-center">
          {filteredItems.length > 0 ? (
            filteredItems.map(([id, item]) => (
              <div
                key={id}
                className="col-6 col-sm-4 col-md-2 mb-3 d-flex justify-content-center"
                style={{ minWidth: '120px', minHeight: '150px' }}
              >
                <div
  key={id}
  className="bg-dark text-light rounded shadow-sm d-flex flex-column align-items-center justify-content-center"
  style={{
    width: '120px',
    minHeight: showText ? '150px' : '90px',  // smaller height without text
    padding: showText ? '0.5rem' : '0.25rem',
    boxSizing: 'border-box',
    textAlign: 'center',
  }}
>
  <img
    src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${id}.png`}
    alt={item.name}
    style={{ width: '64px', height: '64px', objectFit: 'contain', marginBottom: showText ? '0.5rem' : 0 }}
  />
  {showText && (
    <>
      <h6
        style={{
          fontWeight: '600',
          marginBottom: '0.25rem',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          width: '100%',
        }}
      >
        {item.name}
      </h6>
      <div>
        <strong>Gold:</strong> {item.gold.total}
      </div>
    </>
  )}
</div>
              </div>
            ))
          ) : (
            <p style={{ color: '#ccc' }}>
              No items available{selectedMap ? ` on ${selectedMap}` : ''}.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}