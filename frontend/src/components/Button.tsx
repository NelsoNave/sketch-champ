import React from "react";

export interface ButtonProps extends React.HTMLAttributes<Element> {
  variant?: "green" | "yellow" | "pink" | "white";
  size?: "sm" | "md" | "lg";
}

export default function Button({
  children,
  variant = "white",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  // base
  const baseStyles =
    "rounded-xl transition-all duration-200 focus:outline-none focus:ring-2  w-full h-[50px] font-russo_one border-2 border-black shadow-custom";

  const variantStyles = {
    green:
      "bg-custom-teal text-white hover:bg-custom-yellow focus:ring-blue-500",
    yellow: "bg-custom-yellow hover:bg-custom-teal focus:ring-gray-500",
    pink: "bg-custom-pink hover:bg-custom-blue focus:ring-gray-500",
    white: "bg-white hover:bg-amber-300 focus:ring-gray-500",
  };

  const sizeStyles = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
}
