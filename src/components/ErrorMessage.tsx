// components/ErrorMessage.tsx
import React from 'react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className = '' }) => {
  return (
    <main className={`flex flex-col items-center justify-center  ${className}`}>
        <h1 className="text-4xl font-bold mb-4">Oops!</h1>
        <p className="text-lg mb-4">{message}</p>
        <p className="text-sm">Please try again later or contact support if the issue persists.</p>
    </main>
  );
};

export default ErrorMessage;
