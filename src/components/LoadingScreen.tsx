import React, { useEffect, useState } from "react";
import { LoadingScreenProps } from "../types";

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoaded }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading process
    const timer = setTimeout(() => {
      setIsLoading(false);
      onLoaded();
    }, 5000); // 3 seconds loading time
    return () => clearTimeout(timer);
  }, [onLoaded]);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full flex items-center justify-center transition-opacity duration-1000 ${
        isLoading ? "opacity-100" : "opacity-0"
      } bg-gradient-barbie`}
    >
      <div className="text-center">
        <h1 className="font-bold text-white">
          {/* Desktop single-line text with space between words */}
          <span className="hidden md:inline-block text-[10vw]">{`Profit Princess`}</span>

          {/* Mobile multi-line text, full-width and centered */}
          <span className="md:hidden block w-full text-[20vw]">{`Profit`}</span>
          <span className="md:hidden block w-full text-[20vw]">{`Princess`}</span>
        </h1>

        {/* Tagline */}
        <p className="mt-4 text-[5vw] text-white font-semibold md:text-[3vw]">
          A story about company finances
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
