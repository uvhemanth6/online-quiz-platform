import * as React from "react"

const Input = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition ${className}`}
      {...props}
    />
  );
});
Input.displayName = "Input";
export { Input }; 