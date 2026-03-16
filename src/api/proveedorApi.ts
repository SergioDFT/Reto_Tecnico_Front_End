import { appsettings } from "../settings/appsettings";
import type { IEmpresa } from "../interfaces/IEmpresa";

const defaultHeaders = {
  "Content-Type": "application/json",
  "X-Api-Key": appsettings.apiKey
};

export async function obtenerProveedores(): Promise<IEmpresa[]> {
  const response = await fetch(`${appsettings.apiUrl}/api/providers`, {
    method: "GET",
    headers: defaultHeaders
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener la lista de proveedores");
  }

  return await response.json();
}

export async function obtenerProveedorPorId(id: number): Promise<IEmpresa> {
  const response = await fetch(`${appsettings.apiUrl}/api/providers/${id}`, {
    method: "GET",
    headers: defaultHeaders
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener el proveedor");
  }

  return await response.json();
}

export async function crearProveedor(payload: Omit<IEmpresa, "id" | "lastModifiedAt">) {
  const response = await fetch(`${appsettings.apiUrl}/api/providers`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("No se pudo crear el proveedor");
  }

  return await response.json();
}

export async function editarProveedor(id: number, payload: Omit<IEmpresa, "id" | "lastModifiedAt">) {
  const response = await fetch(`${appsettings.apiUrl}/api/providers/${id}`, {
    method: "PUT",
    headers: defaultHeaders,
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("No se pudo actualizar el proveedor");
  }

  return await response.json();
}

export async function eliminarProveedor(id: number) {
  const response = await fetch(`${appsettings.apiUrl}/api/providers/${id}`, {
    method: "DELETE",
    headers: defaultHeaders
  });

  if (!response.ok) {
    throw new Error("No se pudo eliminar el proveedor");
  }
}