import React from 'react';
import type { ChampionDetail } from '../../constants/champData';

interface ChampionAbilitiesProps {
  championData: ChampionDetail;
  version: string;
}

export default function ChampionAbilities({ championData, version }: ChampionAbilitiesProps) {
  const { passive, spells } = championData;

  return (
    <div>
      <h3>Abilities</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ marginBottom: '1em', display: 'flex', alignItems: 'center' }}>
          <img
            src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/passive/${passive.image.full}`}
            alt={passive.name}
            width={48}
            height={48}
            style={{ marginRight: '0.75em' }}
          />
          <div>
            <strong>Passive - {passive.name}</strong>
            <p dangerouslySetInnerHTML={{ __html: passive.description }} />
          </div>
        </li>

        {spells.map((spell, idx) => (
          <li key={idx} style={{ marginBottom: '1em', display: 'flex', alignItems: 'center' }}>
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${spell.image.full}`}
              alt={spell.name}
              width={48}
              height={48}
              style={{ marginRight: '0.75em' }}
            />
            <div>
              <strong>{['Q', 'W', 'E', 'R'][idx]} - {spell.name}</strong>
              <p dangerouslySetInnerHTML={{ __html: spell.description }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
