// Adding SenecaResults export to fix type error
export interface SenecaResults {
  id: string;
  title: string;
  data: any;
  type: string;
  [key: string]: any;
}
