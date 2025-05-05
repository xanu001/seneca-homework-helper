export interface SenecaQuestion {
  question: string;
  answer: string;
  type: 'multiple-choice' | 'toggle' | 'list' | 'grid' | 'wordfill' | 'image-description';
  toggleGroup?: string; // For grouping related toggle questions
}

export interface SenecaConcept {
  type: 'concept';
  title: string;
  content: string;
}

export type SenecaSection = SenecaQuestion[] | SenecaConcept;

export interface SenecaResults {
  title: string;
  sections: SenecaSection[];
} 