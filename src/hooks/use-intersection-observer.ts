'use client';

import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
	freezeOnceVisible?: boolean;
}

export const useIntersectionObserver = (
	options: UseIntersectionObserverOptions = {},
): [React.RefObject<HTMLDivElement | null>, boolean] => {
	const { threshold = 0, root = null, rootMargin = '0px', freezeOnceVisible = false } = options;

	const ref = useRef<HTMLDivElement | null>(null);
	const [isIntersecting, setIsIntersecting] = useState(false);
	const frozen = useRef(false);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		if (frozen.current) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				setIsIntersecting(entry.isIntersecting);

				if (entry.isIntersecting && freezeOnceVisible) {
					frozen.current = true;
				}
			},
			{ threshold, root, rootMargin },
		);

		observer.observe(element);

		return () => {
			observer.disconnect();
		};
	}, [threshold, root, rootMargin, freezeOnceVisible]);

	return [ref, isIntersecting];
};
