import * as React from "react"

const Button = React.forwardRef(
  ({ className = "", variant = "default", size = "md", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    const variants = {
      default: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:from-pink-500 hover:to-indigo-500 shadow-lg",
      outline: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100",
      ghost: "bg-transparent hover:bg-gray-100 text-gray-900",
    };
    const sizes = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-base",
      lg: "h-12 px-6 text-lg",
    };
    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
export { Button }; 