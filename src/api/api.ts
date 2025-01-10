import useFetch from "../hooks/useFetch";
import { CompanyProfile, IncomeStatement } from "../types";

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

export const useFetchSort = (): {
  data: IncomeStatement | null;
  isLoading: boolean;
  error: string | null;
} => {
  // return useFetch(`/api/filter-sort-income`);
  return useFetch(`http://localhost:5000/filter-sort-income`);
};
