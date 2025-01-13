import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import LoadingScreen from "./components/LoadingScreen";
import { useFetchBySymbol, useFetchBySymbolIncome } from "./api/api";
import DataTable from "./components/DataTable";
import Card from "./components/Card";
import NotFound from "./components/NotFound";
import FinancialLineChart from "./components/FinancialLineChart";

const App: React.FC = () => {
  const [symbol, setSymbol] = useState<string>("AAPL.NE"); // Default selection
  const [loadScreen, setLoadScreen] = useState(true);

  // Fetch company information
  const {
    data: company,
    isLoading: companyLoading,
    error: companyError,
  } = useFetchBySymbol(symbol);

  const strippedSymbol = symbol.split(".")[0]; // Get symbol without the acronym

  // Fetch income data for the given symbol
  const {
    data: incomeData,
    isLoading: incomeLoading,
    error: incomeError,
  } = useFetchBySymbolIncome(strippedSymbol);

  const handleLoadingComplete = () => {
    setLoadScreen(false);
  };

  const handleSymbolChange = (newSymbol: string) => {
    setSymbol(newSymbol); // Update the symbol state and trigger fetching
  };

  // Handling load screen timeout based on loading status
  useEffect(() => {
    if (!companyLoading && !incomeLoading && company) {
      handleLoadingComplete(); // Trigger the loading complete function when both data are loaded
    }
  }, [companyLoading, incomeLoading, company]);

  // Check if there is any error (404 or other errors) in company or income data
  const hasError = companyError || incomeError;

  // If an error occurs, render the NotFound component
  if (hasError) {
    return (
      <Card title={""}>
        <NotFound onRefresh={() => setSymbol("AAPL.NE")} />
      </Card>
    );
  }

  return (
    <div className="App">
      {loadScreen ? (
        <LoadingScreen
          isLoading={loadScreen}
          onLoaded={handleLoadingComplete}
        />
      ) : (
        <>
          {/* Make sure to check company is not null before passing */}
          {company && incomeData && (
            <div>
              <Header company={company} onCompanyChange={handleSymbolChange} />
              <Card
                title={"Company Financial Data for " + company.companyName}
                color={"light"}
              >
                <DataTable
                  columns={[
                    "date",
                    "revenue",
                    "netIncome",
                    "grossProfit",
                    "eps",
                    "operatingIncome",
                  ]}
                  initialData={incomeData}
                />
              </Card>
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
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
