import { getIdToken } from "@/services/authService";

// physical device via Expo Go, "localhost" refers to the phone
// itself, not your computer — use your computer's local network IP
// (e.g. http://192.168.1.23:3000) instead while developing.
const API_BASE_URL = "http://10.138.147.206:3000";

interface CreateTransactionInput {
  merchantName: string;
  amount: number;
  category: string;
}

async function authorizedFetch(path: string, options: RequestInit = {}) {
  const token = await getIdToken();
  if (!token) {
    throw new Error("Not authenticated — please log in again.");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function createTransaction(input: CreateTransactionInput) {
  return authorizedFetch("/transactions", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function fetchTransactions() {
  return authorizedFetch("/transactions");
}

// category crud
export function fetchCategories() {
  return authorizedFetch("/categories");
}

export function createCategory(name: string) {
  return authorizedFetch("/categories", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export function deleteCategory(id: string) {
  return authorizedFetch(`/categories/${id}`, { method: "DELETE" });
}