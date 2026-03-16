export type ProviderFormValues = {
  businessName: string;
  tradeName?: string;
  taxId: string;
  phone?: string;
  email?: string;
  website?: string;
  addressLine?: string;
  country?: string;
  annualBillingUsd?: number;
};

export type ProviderFormErrors = Partial<Record<keyof ProviderFormValues, string>>;

export function validateProvider(values: ProviderFormValues): ProviderFormErrors {
  const errors: ProviderFormErrors = {};

  const businessName = values.businessName?.trim() ?? "";
  const taxId = values.taxId?.trim() ?? "";
  const phone = values.phone?.trim() ?? "";
  const email = values.email?.trim() ?? "";
  const website = values.website?.trim() ?? "";

  if (!businessName) {
    errors.businessName = "La razón social es obligatoria";
  }

  if (!taxId) {
    errors.taxId = "El RUC es obligatorio";
  } else if (!/^\d{11}$/.test(taxId)) {
    errors.taxId = "El RUC debe ser numérico y tener 11 dígitos";
  }

  if (phone && !/^\d{9}$/.test(phone)) {
    errors.phone = "El teléfono debe ser numérico y tener 9 dígitos";
  }

  if (email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    errors.email = "El correo electrónico es inválido";
  }

  if (website && !/^https?:\/\/[^\s$.?#].[^\s]*$/i.test(website)) {
    errors.website = "El sitio web es inválido";
  }

  if (
    values.annualBillingUsd !== undefined &&
    values.annualBillingUsd !== null &&
    Number.isNaN(values.annualBillingUsd)
  ) {
    errors.annualBillingUsd = "La facturación anual debe ser numérica";
  }

  if (
    values.annualBillingUsd !== undefined &&
    values.annualBillingUsd !== null &&
    values.annualBillingUsd < 0
  ) {
    errors.annualBillingUsd = "La facturación anual no puede ser negativa";
  }

  return errors;
}