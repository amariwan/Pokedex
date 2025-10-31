'use client';

import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

export const useScrollAnimation = () => {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!ref.current) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						gsap.fromTo(
							entry.target,
							{
								opacity: 0,
								y: 50,
								scale: 0.95,
							},
							{
								opacity: 1,
								y: 0,
								scale: 1,
								duration: 0.8,
								ease: 'power3.out',
							},
						);
					}
				});
			},
			{ threshold: 0.1 },
		);

		observer.observe(ref.current);

		return () => observer.disconnect();
	}, []);

	return ref;
};

export const useMagneticEffect = () => {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		const handleMouseMove = (e: MouseEvent) => {
			const rect = element.getBoundingClientRect();
			const x = e.clientX - rect.left - rect.width / 2;
			const y = e.clientY - rect.top - rect.height / 2;

			gsap.to(element, {
				x: x * 0.3,
				y: y * 0.3,
				duration: 0.3,
				ease: 'power2.out',
			});
		};

		const handleMouseLeave = () => {
			gsap.to(element, {
				x: 0,
				y: 0,
				duration: 0.5,
				ease: 'elastic.out(1, 0.5)',
			});
		};

		element.addEventListener('mousemove', handleMouseMove);
		element.addEventListener('mouseleave', handleMouseLeave);

		return () => {
			element.removeEventListener('mousemove', handleMouseMove);
			element.removeEventListener('mouseleave', handleMouseLeave);
		};
	}, []);

	return ref;
};
