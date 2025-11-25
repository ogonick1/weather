import React from "react";
import type { ErrorMessageProps } from "../types/weather";



export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/60 px-3 py-2 text-sm text-red-100">
      {message}
    </div>
  );
};
