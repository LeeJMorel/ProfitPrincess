/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { IncomeStatement, DataTableProps, FilterSortParams } from "../types";
import { useFetchBySymbolIncome, useFetchSort } from "../api/api";
import { downArrow, downUpArrow, upArrow } from "../assets/Icon";
import "rc-slider/assets/index.css";
import TooltipSlider from "./Slider";

const DataTable: React.FC<DataTableProps> = ({ symbol, columns }) => {
  const {
    data: initialData,
    isLoading: initialLoading,
    error: initialError,
  } = useFetchBySymbolIncome(symbol);

  const [sortParams, setSortParams] = useState<FilterSortParams>({
    sort_field: undefined,
    ascending: true,
    fields: {},
  });

  const [filterRanges, setFilterRanges] = useState<
    Record<string, [number, number]>
  >({});

  const [sliderMinMax, setSliderMinMax] = useState<{
    [key: string]: [number, number];
  }>({});

  // Combine filterRanges into fields in sortParams
  const combinedParams = {
    ...sortParams,
    fields: {
      ...sortParams.fields,
      ...Object.entries(filterRanges).reduce(
        (acc, [key, [min, max]]) => ({
          ...acc,
          [`${key}_min`]: min,
          [`${key}_max`]: max,
        }),
        {}
      ),
    },
  };

  const {
    data: sortedData,
    isLoading: sortLoading,
    error: sortError,
  } = useFetchSort(combinedParams);

  const isSortingActive =
    sortParams.sort_field !== undefined || Object.keys(filterRanges).length > 0;
  const data = isSortingActive ? sortedData : initialData;
  const isLoading = isSortingActive ? sortLoading : initialLoading;
  const error = isSortingActive ? sortError : initialError;

  // Fallback to empty array if `data` is null or undefined
  const validData = data ?? [];

  // Handle sorting by updating sortParams
  const handleSort = (field: keyof IncomeStatement) => {
    setSortParams((prev) => ({
      sort_field: field,
      ascending: prev.sort_field === field ? !prev.ascending : true,
      fields: prev.fields,
    }));
  };

  // Handle range change and update filterRanges
  const handleRangeChange = (field: string, range: [number, number]) => {
    setFilterRanges((prev) => ({ ...prev, [field]: range }));
  };

  const getSliderValues = (col: keyof IncomeStatement): [number, number] => {
    const columnData = validData.map((item) => item[col]);

    const isDateField = col.includes("date");

    if (isDateField) {
      const minYear = Math.min(
        ...columnData.map((item) => new Date(item).getFullYear())
      );
      const maxYear = Math.max(
        ...columnData.map((item) => new Date(item).getFullYear())
      );
      return [minYear, maxYear];
    }

    const minValue = Math.min(...columnData.map((item) => Number(item)));
    const maxValue = Math.max(...columnData.map((item) => Number(item)));

    // Ensure valid [number, number] tuple
    return [minValue, maxValue];
  };

  // Set initial slider min/max only once when the data loads
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      const initialSliderValues = columns.reduce((acc, col) => {
        acc[col] = getSliderValues(col as keyof IncomeStatement);
        return acc;
      }, {} as { [key: string]: [number, number] });
      setSliderMinMax(initialSliderValues);
    }
  }, [initialData, columns]);

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
      {validData && validData.length > 0 ? (
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
                  >
                    <div className="flex flex-col items-start">
                      <div className="flex items-center justify-between w-full">
                        <span>
                          {col.charAt(0).toUpperCase() + col.slice(1)}
                        </span>
                        <span
                          className="ml-1 cursor-pointer"
                          onClick={() =>
                            handleSort(col as keyof IncomeStatement)
                          }
                        >
                          {getArrow(col as keyof IncomeStatement)}
                        </span>
                      </div>
                      {/* Conditionally render slider for numeric and date fields */}
                      {(typeof validData[0][col as keyof IncomeStatement] ===
                        "number" ||
                        col.includes("date")) &&
                        sliderMinMax[col] && (
                          <TooltipSlider
                            range
                            min={sliderMinMax[col][0]}
                            max={sliderMinMax[col][1]}
                            defaultValue={
                              filterRanges[col] ?? sliderMinMax[col]
                            }
                            tipFormatter={(value: any) => `${value}`}
                            onChange={(value: number | number[]) => {
                              if (Array.isArray(value)) {
                                handleRangeChange(
                                  col,
                                  value as [number, number]
                                ); // Type assertion
                              } else {
                                handleRangeChange(col, [value, value]); // Treat as range
                              }
                            }}
                          />
                        )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {validData.map((incomeStatement: IncomeStatement) => (
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
