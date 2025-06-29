export interface ItemData {
  id: string;
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
