import React from "react";

interface CardProps {
  title: string;
  children: React.ReactNode;
  color?: "lightest" | "light" | "primary" | "dark" | "darkest";
}

const Card: React.FC<CardProps> = ({ title, children, color = "primary" }) => {
  const backgroundColor = {
    lightest: "bg-lightest",
    light: "bg-light",
    primary: "bg-primary",
    dark: "bg-dark",
    darkest: "bg-darkest",
  };

  return (
    <div
      className={`${backgroundColor[color]} text-black p-6 shadow-lg rounded-lg flex flex-col space-y-4`}
    >
      <h2 className="text-2xl">{title}</h2>
      <div className="flex-grow">{children}</div>
    </div>
  );
};

export default Card;
