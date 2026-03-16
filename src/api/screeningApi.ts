import type { IScreeningError, IScreeningResponse } from "../interfaces/IScreening";
import { appsettings } from "../settings/appsettings";

const defaultHeaders = {
  "Content-Type": "application/json",
  "X-Api-Key": appsettings.apiKey
};

export async function ejecutarScreening(searchTerm: string): Promise<IScreeningResponse> {
  const response = await fetch(`${appsettings.apiUrl}/api/screening/search`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify({ searchTerm })
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as IScreeningError;

    if (response.status === 502) {
      throw new Error(error.message || "OffshoreLeaks devolvió 202 con desafío de AWS WAF.");
    }

    throw new Error(error.message || "No se pudo ejecutar el screening.");
  }

  return data as IScreeningResponse;
}