import React, { useState } from "react";
import Header from "./components/Header";
import LoadingScreen from "./components/LoadingScreen";
import { useFetchBySymbol } from "./api/api";
import DataTable from "./components/DataTable";
import Card from "./components/Card";
import { IncomeStatement } from "./types";
import FinancialLineChart from "./components/FinancialLineChart";

const App: React.FC = () => {
  const [symbol, setSymbol] = useState<string>("AAPL"); // Default selection
  const [incomeData, setIncomeData] = useState<IncomeStatement[] | null>(null); // Store income data

  const { data: company, isLoading, error } = useFetchBySymbol(symbol);

  const handleSymbolChange = (newSymbol: string) => {
    setSymbol(newSymbol); // Update the symbol state and trigger fetching
  };

  // Function to handle income data change
  const handleIncomeDataChange = (data: IncomeStatement[]) => {
    setIncomeData(data); // Store updated data in state
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (isLoading) {
    return <LoadingScreen isLoading={true} />;
  }

  return (
    <div className="App">
      {company && (
        <>
          <LoadingScreen isLoading={false} />
          <div>
            <Header company={company} onCompanyChange={handleSymbolChange} />
            <Card
              title={"Company Financial Data for " + company.companyName}
              color={"lightest"}
            >
              {/* Pass onDataChange callback to DataTable */}
              <DataTable
                symbol={symbol}
                columns={[
                  "date",
                  "revenue",
                  "netIncome",
                  "grossProfit",
                  "eps",
                  "operatingIncome",
                ]}
                onDataChange={handleIncomeDataChange}
              />
            </Card>
            {/* Only render the financial line charts if incomeData exists */}
            {incomeData && incomeData.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card title={"Gross Profit Ratio"} color={"light"}>
                    <FinancialLineChart
                      data={incomeData}
                      selectedMetrics={["grossProfitRatio"]}
                    />
                  </Card>{" "}
                  <Card title={"Operating Income Ratio"} color={"primary"}>
                    <FinancialLineChart
                      data={incomeData}
                      selectedMetrics={["operatingIncomeRatio"]}
                    />
                  </Card>
                  <Card title={"EBITDA"} color={"dark"}>
                    <FinancialLineChart
                      data={incomeData}
                      selectedMetrics={["ebitda"]}
                    />
                  </Card>
                  <Card title={"EPS (Earnings per Share)"} color={"darkest"}>
                    <FinancialLineChart
                      data={incomeData}
                      selectedMetrics={["eps"]}
                    />
                  </Card>
                </div>
                <Card
                  title={"Financial Performance Over Time"}
                  color={"lightest"}
                >
                  <FinancialLineChart
                    data={incomeData}
                    selectedMetrics={[
                      "revenue",
                      "netIncome",
                      "grossProfit",
                      "costOfRevenue",
                      "operatingIncome",
                    ]}
                    chartType={"stack"}
                  />
                </Card>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
