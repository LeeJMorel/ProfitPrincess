import React, { useState } from "react";
import Header from "./components/Header";
import { Company } from "./types";

const App: React.FC = () => {
  // Initialize state with the default company data.
  const [company, setCompany] = useState<Company>({
    symbol: "AGO.WA",
    companyName: "Agora S.A.",
    image: "https://financialmodelingprep.com/image-stock/AGO.WA.png",
    industry: "Publishing",
  });

  // Function to fetch company data based on the symbol.
  const fetchCompanyData = (symbol: string) => {
    // Example static company data for simulation
    const companyData: { [key: string]: Company } = {
      "AGO.WA": {
        symbol: "AGO.WA",
        companyName: "Agora S.A.",
        image: "https://financialmodelingprep.com/image-stock/AGO.WA.png",
        industry: "Publishing",
      },
      MSFT: {
        symbol: "MSFT",
        companyName: "Microsoft Corporation",
        image: "https://logo.clearbit.com/microsoft.com",
        industry: "Technology",
      },
    };

    // Fetch the company data based on the symbol (you could replace this with an actual API request)
    const companyInfo = companyData[symbol] || companyData["AGO.WA"];
    setCompany(companyInfo); // Update the company state
  };

  return (
    <div className="App">
      <Header company={company} onCompanyChange={fetchCompanyData} />
    </div>
  );
};

export default App;
