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

  // return useFetch(`/api/filter-sort-income?query=${encodedQuery}`);
  return useFetch(
    `http://localhost:5000/filter-sort-income?query=${encodedQuery}`
  );
};
