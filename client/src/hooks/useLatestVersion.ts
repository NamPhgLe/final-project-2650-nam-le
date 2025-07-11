import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useLatestVersion(): string | null {
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const res = await axios.get<string[]>(
          'https://ddragon.leagueoflegends.com/api/versions.json'
        );
        setVersion(res.data[0]);
      } catch (err) {
        console.error('Failed to fetch latest version:', err);
      }
    };
    fetchVersion();
  }, []);

  return version;
}
