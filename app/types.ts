export interface Figure {
  id: string;
  name: string;
  nameKo: string;
  birthYear: number;
  deathYear: number;
  category: Category;
  description: string;
  descriptionEn: string;
  significance: string;
}

export interface Event {
  id: string;
  name: string;
  nameKo: string;
  year: number;
  category: Category;
  description: string;
  descriptionEn: string;
}

export interface Work {
  id: string;
  name: string;
  nameKo: string;
  year: number;
  author: string;
  authorKo: string;
  category: Category;
  description: string;
  descriptionEn: string;
}

export type Category = 'religious' | 'political' | 'philosophical' | 'scientific' | 'artistic' | 'cultural';

export interface EraData {
  era: string;
  eraEn: string;
  startYear: number;
  endYear: number;
  figures: Figure[];
  events: Event[];
  works: Work[];
}

export type TimelineItem = 
  | { type: 'figure'; data: Figure }
  | { type: 'event'; data: Event }
  | { type: 'work'; data: Work };

export const CATEGORY_COLORS: Record<Category, string> = {
  religious: '#C4A265',
  political: '#8B4513',
  philosophical: '#6B8E6B',
  scientific: '#4682B4',
  artistic: '#9B6B9B',
  cultural: '#CD853F',
};

export const CATEGORY_LABELS: Record<Category, string> = {
  religious: 'Religious',
  political: 'Political',
  philosophical: 'Philosophical',
  scientific: 'Scientific',
  artistic: 'Artistic',
  cultural: 'Cultural',
};

export const ERA_FILES = ['ancient', 'classical', 'medieval', 'renaissance', 'modern'] as const;

export const ERA_BACKGROUNDS: Record<string, string> = {
  ancient: 'rgba(205, 185, 145, 0.15)',
  classical: 'rgba(180, 165, 130, 0.15)',
  medieval: 'rgba(160, 150, 130, 0.18)',
  renaissance: 'rgba(190, 175, 145, 0.12)',
  modern: 'rgba(200, 190, 165, 0.10)',
};
