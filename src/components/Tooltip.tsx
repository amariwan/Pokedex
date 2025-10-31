import React from 'react';

interface TooltipProps {
	text: string;
	children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
	return (
		<span className='relative inline-flex group'>
			{children}
			<span className='pointer-events-none absolute -top-10 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center group-hover:flex'>
				<span className='rounded-md bg-black px-2 py-1 text-xs font-medium text-white shadow-lg'>{text}</span>
				<span className='h-2 w-2 rotate-45 bg-black'></span>
			</span>
		</span>
	);
};

export default Tooltip;
