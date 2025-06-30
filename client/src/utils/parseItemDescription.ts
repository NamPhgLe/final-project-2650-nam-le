import { regexStatMap } from "../constants/regexStatMap";

export type ParsedStats = Record<string, number>;

function stripTags(html: string): string {
    return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<\/ul>/gi, '\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<\/?[^>]+(>|$)/g, '');
  }
  
  export function parseItemDescription(description: string): ParsedStats {
    const cleanDescription = stripTags(description);
    const lines = cleanDescription.split(/\n/).map(line => line.trim()).filter(Boolean);
  
    const stats: ParsedStats = {};
  
    for (const line of lines) {
      for (const { regex, key } of Object.values(regexStatMap)) {
        const match = line.match(regex);
        if (match) {
          const value = parseInt(match[1], 10);
          stats[key] = (stats[key] ?? 0) + value;
          break;
        }
      }
    }
  
    return stats;
  }
  
