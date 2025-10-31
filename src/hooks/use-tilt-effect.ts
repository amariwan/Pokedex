'use client';

import { useCallback, useEffect, useRef } from 'react';

interface TiltConfig {
	max?: number;
	perspective?: number;
	scale?: number;
	speed?: number;
	easing?: string;
	glare?: boolean;
	maxGlare?: number;
}

export const useTiltEffect = (config: TiltConfig = {}) => {
	const {
		max = 15,
		perspective = 1000,
		scale = 1.05,
		speed = 400,
		easing = 'cubic-bezier(.03,.98,.52,.99)',
		glare = true,
		maxGlare = 0.5,
	} = config;

	const ref = useRef<HTMLDivElement>(null);
	const glareRef = useRef<HTMLElement | null>(null);
	const pointerRef = useRef<{ x: number; y: number } | null>(null);
	const frameRef = useRef<number | null>(null);
	const resetTransitionTimeoutRef = useRef<number | null>(null);

	const cancelFrame = useCallback(() => {
		if (frameRef.current !== null) {
			cancelAnimationFrame(frameRef.current);
			frameRef.current = null;
		}
	}, []);

	const clearTransitionTimeout = useCallback(() => {
		if (resetTransitionTimeoutRef.current !== null) {
			window.clearTimeout(resetTransitionTimeoutRef.current);
			resetTransitionTimeoutRef.current = null;
		}
	}, []);

	const updateTilt = useCallback(() => {
		if (!ref.current || !pointerRef.current) {
			frameRef.current = null;
			return;
		}

		const rect = ref.current.getBoundingClientRect();
		const x = pointerRef.current.x - rect.left;
		const y = pointerRef.current.y - rect.top;

		const centerX = rect.width / 2;
		const centerY = rect.height / 2;

		const rotateX = ((y - centerY) / centerY) * -max;
		const rotateY = ((x - centerX) / centerX) * max;

		ref.current.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;

		if (glare && glareRef.current) {
			const percentageX = (x / rect.width) * 100;
			const percentageY = (y / rect.height) * 100;
			glareRef.current.style.background = `radial-gradient(circle at ${percentageX}% ${percentageY}%, rgba(255,255,255,${maxGlare}) 0%, transparent 50%)`;
		}

		frameRef.current = null;
	}, [glare, max, maxGlare, perspective, scale]);

	const handleMouseMove = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!ref.current) return;

			clearTransitionTimeout();

			pointerRef.current = {
				x: e.clientX,
				y: e.clientY,
			};

			ref.current.style.transition = '';

			if (glare && !glareRef.current) {
				glareRef.current = ref.current.querySelector('.tilt-glare') as HTMLElement | null;
			}

			if (frameRef.current === null) {
				frameRef.current = requestAnimationFrame(updateTilt);
			}
		},
		[clearTransitionTimeout, glare, updateTilt],
	);

	const handleMouseLeave = useCallback(() => {
		if (!ref.current) return;

		cancelFrame();
		clearTransitionTimeout();

		pointerRef.current = null;

		ref.current.style.transition = `transform ${speed}ms ${easing}`;
		ref.current.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;

		if (glare && glareRef.current) {
			glareRef.current.style.background = '';
		}

		resetTransitionTimeoutRef.current = window.setTimeout(() => {
			if (ref.current) {
				ref.current.style.transition = '';
				ref.current.style.willChange = '';
			}
			resetTransitionTimeoutRef.current = null;
		}, speed);

		glareRef.current = null;
	}, [cancelFrame, clearTransitionTimeout, easing, glare, perspective, speed]);

	const handleMouseEnter = useCallback(() => {
		if (!ref.current) return;

		clearTransitionTimeout();

		ref.current.style.willChange = 'transform';
		ref.current.style.transition = `transform ${speed}ms ${easing}`;

		if (glare) {
			glareRef.current = ref.current.querySelector('.tilt-glare') as HTMLElement | null;
		}

		resetTransitionTimeoutRef.current = window.setTimeout(() => {
			if (ref.current) {
				ref.current.style.transition = '';
			}
			resetTransitionTimeoutRef.current = null;
		}, speed);
	}, [clearTransitionTimeout, easing, glare, speed]);

	useEffect(() => {
		return () => {
			cancelFrame();
			clearTransitionTimeout();
		};
	}, [cancelFrame, clearTransitionTimeout]);

	return {
		ref,
		handleMouseMove,
		handleMouseLeave,
		handleMouseEnter,
	};
};
