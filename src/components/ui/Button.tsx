import React from 'react';
export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'outline' | 'default' }> = ({ children, variant = 'default', ...props }) => {
  const base = "px-4 py-2 rounded font-medium focus:ring-2 focus:ring-offset-2";
  const variants = {
    default: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    outline: "border border-gray-300 hover:bg-gray-100 focus:ring-gray-500"
  };
  return <button className={`${base} ${variants[variant]}`} {...props}>{children}</button>;
};
