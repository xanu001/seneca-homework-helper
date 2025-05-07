
// Adding SenecaResults export to fix type error
export interface SenecaResults {
  id: string;
  title: string;
  data: any;
  type: string;
  sections: SenecaSection[];
  [key: string]: any;
}

export interface SenecaQuestion {
  question: string;
  answer: string;
  type: string;
  toggleGroup?: string;
  [key: string]: any;
}

export interface SenecaConcept {
  title: string;
  content: string;
  type: string;
  [key: string]: any;
}

export type SenecaSection = SenecaQuestion | SenecaConcept;
