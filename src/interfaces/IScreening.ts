export interface IScreeningItem {
  entityName?: string;
  jurisdiction?: string;
  linkedTo?: string;
  dataFrom?: string;
}

export interface IScreeningResponse {
  source: string;
  hits: number;
  data: IScreeningItem[];
}

export interface IScreeningError {
  message: string;
  status?: number;
  source?: string;
  wafBody?: string;
  detail?: string;
}