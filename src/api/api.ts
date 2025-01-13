import useFetch from "../hooks/useFetch";
import { CompanyProfile, FilterSortParams, IncomeStatement } from "../types";

export const useFetchBySymbol = (
  symbol: string
): {
  data: CompanyProfile | null;
  isLoading: boolean;
  error: string | null;
} => {
  // return useFetch(`/api/fetch-data?query=${symbol}`);
  return useFetch(`http://localhost:5000/fetch-data?query=${symbol}`);
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
  // return useFetch(`/api/fetch-income?query=${symbol}`);
  return useFetch(`http://localhost:5000/fetch-income?query=${symbol}`);
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

  // return useFetch(`/api/filter-sort-income?query=${encodedQuery}`);
  return useFetch(
    `http://localhost:5000/filter-sort-income?query=${encodedQuery}`
  );
};
