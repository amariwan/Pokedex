// components/ErrorMessage.tsx
import React from 'react';

interface ErrorMessageProps {
	message: string;
	className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className = '' }) => {
	return (
		<main className={`flex flex-col items-center justify-center ${className}`}>
			<h1 className='mb-4 text-4xl font-bold'>Oops!</h1>
			<p className='mb-4 text-lg'>{message}</p>
			<p className='text-sm'>Please try again later or contact support if the issue persists.</p>
		</main>
	);
};

export default ErrorMessage;
