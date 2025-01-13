import React, { useRef, useState } from "react";
import { HeaderProps } from "../types";

const Header: React.FC<HeaderProps> = ({ company, onCompanyChange }) => {
  // Ref for the input symbol
  const inputSymbolRef = useRef<HTMLInputElement>(null);

  // Local state to manage user input for the company symbol
  const [inputSymbol, setInputSymbol] = useState<string>("");

  // Handle the change in the input field
  const handleSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputSymbol(e.target.value);
  };

  // Handle the form submit to change the company based on the symbol
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputSymbol) {
      onCompanyChange(inputSymbol);
      setInputSymbol(""); // Clear the input field after submission
      // Optionally focus the input again after clearing
      if (inputSymbolRef.current) {
        inputSymbolRef.current.focus();
      }
    }
  };

  return (
    <header className="bg-gradient-barbie text-white p-6 rounded-lg shadow-lg">
      {/* Container for the header content */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        {/* Left side: Company info (logo, name, symbol, industry) */}
        <div className="flex items-center space-x-4">
          <img
            src={company.image}
            alt={company.companyName}
            className="w-24 h-24 object-contain rounded-full border-4 border-white shadow-md"
          />
          <div>
            <h1 className="font-barbie text-3xl font-semibold">
              {company.companyName}
            </h1>
            <p className="text-xl">{company.symbol}</p>
            <p className="italic">{company.industry}</p>
          </div>
        </div>

        {/* Right side: User input form to change the company symbol */}
        <form
          onSubmit={handleSubmit}
          className="mt-4 sm:mt-0 flex sm:justify-end space-x-4 items-center w-full sm:w-auto"
        >
          <input
            ref={inputSymbolRef}
            type="text"
            value={inputSymbol}
            onChange={handleSymbolChange}
            placeholder={company.symbol}
            className="p-2 rounded-lg text-black w-full sm:w-auto"
          />
          <button
            type="submit"
            className="bg-primary hover:bg-light text-white p-2 rounded-lg"
          >
            Change Company
          </button>
        </form>
      </div>
    </header>
  );
};

export default Header;
