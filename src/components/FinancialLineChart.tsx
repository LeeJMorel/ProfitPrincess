import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import {
  IncomeStatement,
  LineChartProps,
  NumericIncomeStatementKeys,
  colorMap,
} from "../types";

const FinancialLineChart: React.FC<LineChartProps> = ({
  data,
  selectedMetrics,
  chartType = "line",
}) => {
  // Function to convert camelCase to Title Case
  const formatMetricLabel = (metric: string) => {
    return metric
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (str) => str.toUpperCase());
  };

  // Function to detect the scale (millions or billions) based on data range
  const getScale = (
    data: IncomeStatement[],
    selectedMetrics: NumericIncomeStatementKeys[]
  ) => {
    let maxVal = 0;

    // Find the maximum value in the selected metrics to determine the scale
    data.forEach((item) => {
      selectedMetrics.forEach((metric) => {
        if (item[metric] > maxVal) {
          maxVal = item[metric];
        }
      });
    });

    // Determine scale
    if (maxVal >= 1_000_000_000) {
      return { scale: 1_000_000_000, label: "Billions" };
    } else if (maxVal >= 1_000_000) {
      return { scale: 1_000_000, label: "Millions" };
    } else {
      return { scale: 1, label: "Units" };
    }
  };

  // Prepare dataset by mapping data into a structure compatible with the LineChart
  const dataset = React.useMemo(() => {
    // Get the scale (millions or billions) based on data
    const { scale } = getScale(data, selectedMetrics);

    return data.map((item) => {
      const row: Record<string, number | string> = { year: item.calendarYear };
      selectedMetrics.forEach((metric) => {
        row[metric] = item[metric] / scale;
      });
      return row;
    });
  }, [data, selectedMetrics]);

  // Get scale information (for subtitle and axis)
  const { label } = getScale(data, selectedMetrics);

  // Configure the stack strategy for the chart
  const stackStrategy = {
    stack: "total",
    area: true,
    stackOffset: "none", // To stack 0 on top of others
  } as const;

  // Customize chart properties
  const customize = {
    height: 300,
    legend: { hidden: true },
    margin: { top: 30 },
  };

  // State to manage which metrics are visible
  const [visibleMetrics, setVisibleMetrics] = React.useState<Set<string>>(
    new Set(selectedMetrics.map((metric) => metric.toString()))
  );

  // Handle toggling visibility for a metric in the legend
  const handleLegendToggle = (metric: string) => {
    setVisibleMetrics((prevVisibleMetrics) => {
      const updatedMetrics = new Set(prevVisibleMetrics);
      if (updatedMetrics.has(metric)) {
        updatedMetrics.delete(metric);
      } else {
        updatedMetrics.add(metric);
      }
      return updatedMetrics;
    });
  };

  // Choose chart configuration based on chartType
  const chartConfig = {
    line: {
      stack: undefined,
      area: false,
      stackOffset: undefined,
    },
    stack: stackStrategy,
    area: { area: true },
  }[chartType];

  return (
    <div className="mb-5">
      {/* Render the legend above the chart */}
      <div className="flex justify-center mb-2.5">
        {selectedMetrics.length === 1
          ? // If only one metric is selected, show colored hearts with label
            selectedMetrics.map((metric) => (
              <div key={metric} className="mr-4 flex items-center">
                <span
                  className="text-2xl"
                  style={{
                    color: "#000000",
                  }}
                >
                  ❤︎
                </span>
                <span className="ml-2">
                  {formatMetricLabel(metric.toString())}
                </span>
              </div>
            ))
          : // Else, show checkboxes
            selectedMetrics.map((metric) => (
              <label key={metric} className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  checked={visibleMetrics.has(metric.toString())}
                  onChange={() => handleLegendToggle(metric.toString())}
                  className="mr-2"
                  style={{
                    accentColor: colorMap[metric] || "#000000",
                  }}
                />
                <span>{formatMetricLabel(metric.toString())}</span>
              </label>
            ))}
      </div>

      {/* Render the chart subtitle only if the scale is not "Units" */}
      {label !== "Units" && (
        <div className="text-center text-sm mb-2 italic">
          Y-axis values in {label}
        </div>
      )}

      {/* Render the LineChart below the legend */}
      <LineChart
        xAxis={[
          {
            dataKey: "year",
            valueFormatter: (value) => value.toString(),
          },
        ]}
        series={selectedMetrics
          .filter((metric) => visibleMetrics.has(metric.toString()))
          .map((metric) => ({
            dataKey: metric,
            label: formatMetricLabel(metric.toString()),
            // If only one metric is selected, use the default color; otherwise, use the colorMap
            color:
              selectedMetrics.length === 1
                ? "#000000"
                : colorMap[metric] || "#000000",
            showMark: false,
            ...chartConfig,
          }))}
        dataset={dataset}
        {...customize}
      />
    </div>
  );
};

export default FinancialLineChart;
