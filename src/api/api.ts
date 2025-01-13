import useFetch from "../hooks/useFetch";
import { CompanyProfile, FilterSortParams, IncomeStatement } from "../types";

// Set to 'true' to use the local API during development
const USE_LOCAL_API = false;

const API_BASE_URL = USE_LOCAL_API
  ? "http://localhost:5000" // Local backend server URL (ensure it's running on this port)
  : "https://profit-princess-api.vercel.app"; // Deployed backend URL on Vercel

/**
 * Fetches company profile data by symbol.
 * @param symbol - The stock symbol to query for.
 * @returns An object containing the company profile data, loading status, and error (if any).
 */
export const useFetchBySymbol = (
  symbol: string
): {
  data: CompanyProfile | null;
  isLoading: boolean;
  error: string | null;
} => {
  return useFetch(`${API_BASE_URL}/fetch-data?query=${symbol}`);
};

/**
 * Fetches income statement data by symbol.
 * @param symbol - The stock symbol to query for.
 * @returns An object containing an array of income statements, loading status, and error (if any).
 */
export const useFetchBySymbolIncome = (
  symbol: string
): {
  data: IncomeStatement[] | null;
  isLoading: boolean;
  error: string | null;
} => {
  return useFetch(`${API_BASE_URL}/fetch-income?query=${symbol}`);
};

/**
 * Fetches sorted and filtered income statement data.
 * @param params - An object containing filter and sort parameters.
 * @returns An object containing the filtered and sorted income statements, loading status, and error (if any).
 */
export const useFetchSort = (
  params: FilterSortParams
): {
  data: IncomeStatement[] | null;
  isLoading: boolean;
  error: string | null;
} => {
  const query = JSON.stringify(params);
  const encodedQuery = encodeURIComponent(query);
  return useFetch(`${API_BASE_URL}/filter-sort-income?query=${encodedQuery}`);
};
