import useFetch from "../hooks/useFetch";
import { CompanyProfile, FilterSortParams, IncomeStatement } from "../types";

// Base URL for the deployed backend API on Vercel
const API_BASE_URL = "https://profit-princess-api.vercel.app";

export const useFetchBySymbol = (
  symbol: string
): {
  data: CompanyProfile | null;
  isLoading: boolean;
  error: string | null;
} => {
  return useFetch(`${API_BASE_URL}/fetch-data?query=${symbol}`);
};

export const useFetchBySymbolIncome = (
  symbol: string
): {
  data: IncomeStatement[] | null;
  isLoading: boolean;
  error: string | null;
} => {
  return useFetch(`${API_BASE_URL}/fetch-income?query=${symbol}`);
};

export const useFetchSort = (
  params: FilterSortParams
): {
  data: IncomeStatement[] | null;
  isLoading: boolean;
  error: string | null;
} => {
  // Convert params object to a JSON string
  const query = JSON.stringify(params);

  // Encode the query to ensure it's safely passed in the URL
  const encodedQuery = encodeURIComponent(query);

  return useFetch(`${API_BASE_URL}/filter-sort-income?query=${encodedQuery}`);
};
