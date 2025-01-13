/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { IncomeStatement, DataTableProps, FilterSortParams } from "../types";
import { useFetchBySymbolIncome, useFetchSort } from "../api/api";
import { downArrow, downUpArrow, upArrow } from "../assets/Icon";
import "rc-slider/assets/index.css";
import TooltipSlider from "./Slider";

const DataTable: React.FC<DataTableProps> = ({
  symbol,
  columns,
  onDataChange,
}) => {
  const {
    data: initialData,
    isLoading: initialLoading,
    error: initialError,
  } = useFetchBySymbolIncome(symbol);

  // State for managing sorting parameters
  const [sortParams, setSortParams] = useState<FilterSortParams>({
    sort_field: undefined,
    ascending: true,
    fields: {},
  });

  // State for managing filter ranges (for sliders)
  const [filterRanges, setFilterRanges] = useState<
    Record<string, [number, number]>
  >({});

  // State for storing min/max values of each column for the slider
  const [sliderMinMax, setSliderMinMax] = useState<{
    [key: string]: [number, number];
  }>({});

  // State for checking if data is available
  const [hasData, setHasData] = useState<boolean>(false);

  // Update hasData based on initialData availability
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setHasData(true);
      // Send initial data back to the parent when data is available
      onDataChange(initialData);
    } else {
      setHasData(false);
    }
  }, [initialData, onDataChange]);

  // Combine sorting and filtering parameters for fetching sorted data
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

  // Fetch sorted data based on combined parameters
  const {
    data: sortedData,
    isLoading: sortLoading,
    error: sortError,
  } = useFetchSort(combinedParams);

  // Determine if sorting or filtering is active
  const isSortingActive =
    sortParams.sort_field !== undefined || Object.keys(filterRanges).length > 0;

  // Select data based on whether sorting is active
  const data = isSortingActive ? sortedData : initialData;
  const isLoading = isSortingActive ? sortLoading : initialLoading;
  const error = isSortingActive ? sortError : initialError;

  // Fallback to empty array if `data` is null or undefined
  const validData = data ?? [];

  // Set initial data availability
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setHasData(true);
    } else {
      setHasData(false);
    }
  }, [initialData]);

  // Handle sorting of a given column
  const handleSort = (field: keyof IncomeStatement) => {
    setSortParams((prev) => ({
      sort_field: field,
      ascending: prev.sort_field === field ? !prev.ascending : true,
      fields: prev.fields,
    }));
  };

  // Handle changes in filter range (sliders)
  const handleRangeChange = (field: string, range: [number, number]) => {
    setFilterRanges((prev) => ({ ...prev, [field]: range }));
  };

  // Get min/max slider values for a specific column
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

  // Get the appropriate arrow icon based on the sorting state
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

  // Reset sorting and filters
  const handleReset = () => {
    setFilterRanges({});
    setSortParams({ sort_field: undefined, ascending: true, fields: {} });
  };

  /*
  This "if error" slightly redundant as I render this by default when no data is available. 
  Theoretically it should only render this given a 404 error 
  but I did not have time fore proper testing frameworks 
  to really ensure a high quality user experience 
  so this placeholder handles that for now.
  */
  if (error) {
    return (
      <div className="text-gray-600">
        This company may not have data available. Try a different company
        symbol, for example: AAPL.NE or AGO.WA.
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="DataTable p-4">
      {validData && validData.length > 0 ? (
        <>
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
        </>
      ) : (
        <div className="text-gray-600">
          {hasData ? (
            <>
              No income statements available.
              <div className="mt-4">
                <button
                  onClick={handleReset}
                  className="bg-darkest text-white px-4 py-2 rounded"
                >
                  Reset Filters
                </button>
              </div>
            </>
          ) : (
            "This company may not have data available. Try a different company symbol, for example: AAPL.NE or AGO.WA."
          )}
        </div>
      )}
    </div>
  );
};

export default DataTable;
