'use client';
import gsap from 'gsap';
import React, { useEffect, useRef } from 'react';

type Props = {
	value: number;
	accentClassName?: string;
};

export const StatsBar = ({ value, accentClassName }: Props) => {
	const barRef = useRef<HTMLDivElement>(null!);

	useEffect(() => {
		gsap.to(barRef.current, {
			width: `${(value / 255) * 100}%`,
			duration: 0.7,
			ease: `rough({ template: bounce.out, strength: 1, points: 10, taper: out, randomize: true, clamp: false})`,
		});
	}, [value]);

	return (
		<div className='h-2 w-full overflow-hidden rounded-full bg-white/10'>
			<div
				ref={barRef}
				className={`h-full ${accentClassName ?? 'bg-emerald-500'}`}
				style={{ width: '0%' }}
			/>
		</div>
	);
};
