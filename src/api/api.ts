import useFetch from "../hooks/useFetch";
import { CompanyProfile } from "../types";

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
