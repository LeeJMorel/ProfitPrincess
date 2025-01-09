import React, { useState } from "react";
import Header from "./components/Header";
import LoadingScreen from "./components/LoadingScreen";
import { useFetchBySymbol } from "./api/api";

const App: React.FC = () => {
  const [symbol, setSymbol] = useState<string>("AAPL.NE"); // Default selection
  const [loadScreen, setLoadScreen] = useState(true);

  const { data: company, isLoading, error } = useFetchBySymbol(symbol);
  console.log({ company, isLoading, error });
  const handleLoadingComplete = () => {
    setLoadScreen(false);
  };

  const handleSymbolChange = (newSymbol: string) => {
    setSymbol(newSymbol); // Update the symbol state and trigger fetching
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!company) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      {loadScreen ? (
        <LoadingScreen onLoaded={handleLoadingComplete} />
      ) : (
        <Header company={company} onCompanyChange={handleSymbolChange} />
      )}
    </div>
  );
};

export default App;
