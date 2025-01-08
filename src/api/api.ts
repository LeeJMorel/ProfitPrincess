/* eslint-disable @typescript-eslint/no-explicit-any */

const BASE_URL = "http://localhost:5000";

// Define types for the parameters and responses
export interface FilterParams {
  [key: string]: string | number;
}

/**
 * Fetch data from the Flask backend
 * @param endpoint - The API endpoint to call (e.g., "stock/list")
 * @param query - Query parameters for the request
 * @returns A promise that resolves to the fetched data
 */
export const fetchData = async (
  endpoint: string,
  query: string = ""
): Promise<any> => {
  try {
    const url = `${BASE_URL}/fetch-data?endpoint=${endpoint}&query=${query}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

/**
 * Filter and sort data through the Flask backend
 * @param data - Array of data to be filtered
 * @param filters - Object containing filter criteria
 * @param sortBy - Key by which to sort the data
 * @returns A promise that resolves to the filtered and sorted data
 */
export const filterData = async (
  data: any[],
  filters: FilterParams,
  sortBy: string
): Promise<any[]> => {
  try {
    const response = await fetch(`${BASE_URL}/filter-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data, filters, sortBy }),
    });

    if (!response.ok) {
      throw new Error(`Error filtering data: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error filtering data:", error);
    throw error;
  }
};
