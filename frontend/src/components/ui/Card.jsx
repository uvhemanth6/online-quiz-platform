import * as React from "react"

function Card({ className = "", children, ...props }) {
  return (
    <div
      className={`bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ className = "", children, ...props }) {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

function CardTitle({ className = "", children, ...props }) {
  return (
    <h2 className={`text-2xl font-bold tracking-tight ${className}`} {...props}>
      {children}
    </h2>
  );
}

function CardContent({ className = "", children, ...props }) {
  return (
    <div className={`text-base ${className}`} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ className = "", children, ...props }) {
  return (
    <div className={`mt-6 flex justify-end gap-2 ${className}`} {...props}>
      {children}
    </div>
  );
}

export { Card, CardHeader, CardTitle, CardContent, CardFooter } 