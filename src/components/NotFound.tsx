import React from "react";

interface NotFoundProps {
  onRefresh: () => void;
}

const NotFound: React.FC<NotFoundProps> = ({ onRefresh }) => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
        <h1 className="text-4xl text-darkest font-bold uppercase mb-6 animate-bounce">
          Oops! Company Not Found!
        </h1>
        <p className="text-lg text-gray-800 font-light mb-6">
          Looks like we couldn't find the company you were looking for. Maybe
          it's a hidden gem, but who knows? 🎀✨
        </p>
        <button
          className="bg-darkest text-white py-2 px-6 rounded-full text-xl transform transition-transform hover:scale-110"
          onClick={onRefresh}
        >
          Try "AAPL.NE" ✨
        </button>
      </div>
    </div>
  );
};

export default NotFound;
