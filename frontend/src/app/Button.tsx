import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={["btn", className || ""].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 