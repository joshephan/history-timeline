import { EraData, Figure } from './types';

export function formatYear(year: number): string {
  if (year < 0) {
    return `${Math.abs(year)} BC`;
  }
  return `AD ${year}`;
}

// Timeline scale: pixels per year
export const PIXELS_PER_YEAR = 3;
export const TIMELINE_START_YEAR = -3500;
export const TIMELINE_END_YEAR = 2050;
export const TIMELINE_PADDING = 100; // px padding on each side

export function yearToX(year: number): number {
  return TIMELINE_PADDING + (year - TIMELINE_START_YEAR) * PIXELS_PER_YEAR;
}

export function getTotalWidth(): number {
  return TIMELINE_PADDING * 2 + (TIMELINE_END_YEAR - TIMELINE_START_YEAR) * PIXELS_PER_YEAR;
}

/**
 * Assign figures to lanes so that no two overlapping figures share a lane.
 * Returns a map from figure id to lane index.
 */
export function assignLanes(figures: Figure[]): Map<string, number> {
  const sorted = [...figures].sort((a, b) => a.birthYear - b.birthYear);
  const lanes: { endYear: number }[] = [];
  const laneMap = new Map<string, number>();

  for (const fig of sorted) {
    let assigned = false;
    for (let i = 0; i < lanes.length; i++) {
      if (fig.birthYear > lanes[i].endYear + 20) { // 20-year gap
        lanes[i].endYear = fig.deathYear;
        laneMap.set(fig.id, i);
        assigned = true;
        break;
      }
    }
    if (!assigned) {
      laneMap.set(fig.id, lanes.length);
      lanes.push({ endYear: fig.deathYear });
    }
  }

  return laneMap;
}

export function getTickYears(startYear: number, endYear: number, interval: number): number[] {
  const ticks: number[] = [];
  const first = Math.ceil(startYear / interval) * interval;
  for (let y = first; y <= endYear; y += interval) {
    ticks.push(y);
  }
  return ticks;
}

export async function loadAllEras(): Promise<EraData[]> {
  const files = ['ancient', 'classical', 'medieval', 'renaissance', 'modern'];
  const results: EraData[] = [];
  
  for (const file of files) {
    try {
      const res = await fetch(`/data/${file}.json`);
      if (res.ok) {
        const data = await res.json();
        results.push(data);
      }
    } catch (e) {
      console.warn(`Failed to load ${file}.json:`, e);
    }
  }
  
  return results;
}
