import React from "react";
import { IncomeStatement, DataTableProps } from "../types";
import { useFetchBySymbolIncome } from "../api/api";

const DataTable: React.FC<DataTableProps> = ({ symbol }) => {
  const { data: company, isLoading, error } = useFetchBySymbolIncome(symbol);
  console.log({ company, isLoading, error });

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="DataTable p-4">
      {company && company.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Revenue</th>
              <th className="px-4 py-2 text-left">Net Income</th>
              <th className="px-4 py-2 text-left">Gross Profit</th>
              <th className="px-4 py-2 text-left">EPS</th>
              <th className="px-4 py-2 text-left">Operating Income</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {company.map((incomeStatement: IncomeStatement) => (
              <tr
                key={incomeStatement.date}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-4 py-2">{incomeStatement.date}</td>
                <td className="px-4 py-2">
                  {incomeStatement.revenue.toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  {incomeStatement.netIncome.toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  {incomeStatement.grossProfit.toLocaleString()}
                </td>
                <td className="px-4 py-2">{incomeStatement.eps.toFixed(2)}</td>
                <td className="px-4 py-2">
                  {incomeStatement.operatingIncome.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-gray-600">No income statements available.</div>
      )}
    </div>
  );
};

export default DataTable;
