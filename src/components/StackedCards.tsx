'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useState } from 'react';

import { cn } from '@/lib/utils';

interface StackedCardsProps {
	children: React.ReactNode[];
	className?: string;
}

export const StackedCards: React.FC<StackedCardsProps> = ({ children, className }) => {
	const [activeIndex, setActiveIndex] = useState(0);
	const x = useMotionValue(0);
	const rotateZ = useTransform(x, [-200, 200], [-15, 15]);
	const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

	const handleDragEnd = (_: any, info: any) => {
		if (Math.abs(info.offset.x) > 100) {
			if (info.offset.x > 0) {
				setActiveIndex((prev) => Math.max(0, prev - 1));
			} else {
				setActiveIndex((prev) => Math.min(children.length - 1, prev + 1));
			}
		}
	};

	return (
		<div className={cn('relative h-96 w-full', className)}>
			{children.map((child, index) => {
				const isActive = index === activeIndex;
				const offset = index - activeIndex;

				return (
					<motion.div
						key={index}
						className='absolute inset-0'
						style={{
							x: isActive ? x : 0,
							rotateZ: isActive ? rotateZ : 0,
							opacity: isActive ? opacity : 1,
							zIndex: children.length - Math.abs(offset),
						}}
						animate={{
							scale: isActive ? 1 : 1 - Math.abs(offset) * 0.05,
							y: Math.abs(offset) * 20,
							opacity: Math.abs(offset) > 2 ? 0 : 1,
						}}
						drag={isActive ? 'x' : false}
						dragConstraints={{ left: 0, right: 0 }}
						onDragEnd={handleDragEnd}
						transition={{ type: 'spring', stiffness: 300, damping: 30 }}
					>
						{child}
					</motion.div>
				);
			})}
		</div>
	);
};
