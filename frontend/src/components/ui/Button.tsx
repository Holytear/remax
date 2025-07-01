import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "green" | "purple";
}

const variantClasses = {
  primary: "border-blue-500 text-blue-600 hover:bg-blue-50",
  green: "border-green-500 text-green-600 hover:bg-green-50",
  purple: "border-purple-500 text-purple-600 hover:bg-purple-50",
};

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className = "",
  children,
  ...props
}) => {
  return (
    <button
      className={`px-4 py-2 rounded border font-medium transition-colors duration-200 outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 