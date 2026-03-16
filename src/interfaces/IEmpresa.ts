export interface IEmpresa {
  id?: number;
  businessName: string;
  tradeName?: string;
  taxId: string;
  phone?: string;
  email?: string;
  website?: string;
  addressLine?: string;
  country: string;
  annualBillingUsd?: number;
  lastModifiedAt?: string;
}