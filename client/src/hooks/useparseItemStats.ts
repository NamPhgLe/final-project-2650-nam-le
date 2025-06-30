import { useMemo } from 'react';
import { parseItemDescription,  } from '../utils/parseItemDescription';
import type { ParsedStats } from '../utils/parseItemDescription';

export function useParsedItemStats(description: string | undefined): ParsedStats {
  return useMemo(() => {
    if (!description) return {};
    return parseItemDescription(description);
  }, [description]);
}
