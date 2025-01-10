import React, { useState } from "react";
import { IncomeStatement, DataTableProps, FilterSortParams } from "../types";
import { useFetchBySymbolIncome, useFetchSort } from "../api/api";
import { downArrow, downUpArrow, upArrow } from "../assets/Icon";

const DataTable: React.FC<DataTableProps> = ({ symbol, columns }) => {
  const {
    data: initialData,
    isLoading: initialLoading,
    error: initialError,
  } = useFetchBySymbolIncome(symbol);

  const [sortParams, setSortParams] = useState<FilterSortParams>({
    sort_field: undefined,
    ascending: true,
  });

  const {
    data: sortedData,
    isLoading: sortLoading,
    error: sortError,
  } = useFetchSort(sortParams);

  const isSortingActive = sortParams.sort_field !== undefined;
  const data = isSortingActive ? sortedData : initialData;
  const isLoading = isSortingActive ? sortLoading : initialLoading;
  const error = isSortingActive ? sortError : initialError;

  const handleSort = (field: keyof IncomeStatement) => {
    setSortParams((prev) => ({
      sort_field: field,
      ascending: prev.sort_field === field ? !prev.ascending : true,
    }));
  };

  const getArrow = (field: keyof IncomeStatement) => {
    if (sortParams.sort_field !== field) {
      return <img src={downUpArrow} alt="Default sort" className="w-4 h-4" />;
    }

    return (
      <img
        src={sortParams.ascending ? upArrow : downArrow}
        alt={sortParams.ascending ? "Ascending" : "Descending"}
        className="w-4 h-4"
      />
    );
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="DataTable p-4">
      {data && data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table-auto min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={col}
                    className={`px-3 py-2 text-left cursor-pointer whitespace-nowrap ${
                      index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
                    }`}
                    onClick={() => handleSort(col)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{col.charAt(0).toUpperCase() + col.slice(1)}</span>
                      <span className="ml-1">{getArrow(col)}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {data.map((incomeStatement: IncomeStatement) => (
                <tr
                  key={incomeStatement.date}
                  className="border-t hover:bg-gray-50"
                >
                  {columns.map((col, index) => (
                    <td
                      key={col}
                      className={`px-4 py-2 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                      }`}
                    >
                      {typeof incomeStatement[col] === "number"
                        ? incomeStatement[col].toLocaleString()
                        : incomeStatement[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-gray-600">No income statements available.</div>
      )}
    </div>
  );
};

export default DataTable;
