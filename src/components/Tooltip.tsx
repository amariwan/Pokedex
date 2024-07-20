import React from 'react';

interface TooltipProps {
	text: string;
	children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
	return (
		<>
			{children}
			<div className='absolute bottom-0 flex flex-col items-center hidden mb-6 group-hover:flex'>
				<span className='relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg rounded-md'>{text}</span>
				<div className='w-3 h-3 -mt-2 rotate-45 bg-black'></div>
			</div>
		</>
	);
};

export default Tooltip;
