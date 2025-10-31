'use client';

import { useEffect, useState } from 'react';

import { logger } from '@/lib/logger';

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PwaRegister() {
	const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
	const [isRegistered, setIsRegistered] = useState(false);

	useEffect(() => {
		if (typeof window === 'undefined') return;

		if ('serviceWorker' in navigator) {
			const onLoad = () => {
				navigator.serviceWorker
					.register('/sw.js')
					.then((reg) => {
						logger.info('Service worker registered', { scope: reg.scope });
						setIsRegistered(true);
					})
					.catch((err) => {
						logger.error('Service worker registration failed', err);
					});
			};
			window.addEventListener('load', onLoad);

			return () => window.removeEventListener('load', onLoad);
		}
	}, []);

	useEffect(() => {
		const handler = (e: Event) => {
			e.preventDefault();
			setDeferredPrompt(e as BeforeInstallPromptEvent);
		};
		window.addEventListener('beforeinstallprompt', handler);
		return () => window.removeEventListener('beforeinstallprompt', handler);
	}, []);

	const promptInstall = async () => {
		if (!deferredPrompt) return;
		try {
			await deferredPrompt.prompt();
			const { outcome } = await deferredPrompt.userChoice;
			logger.debug('PWA install outcome', { outcome });
			setDeferredPrompt(null);
		} catch (err) {
			logger.error('PWA install prompt failed', err);
		}
	};

	return (
		<div aria-hidden className='fixed right-4 bottom-4 z-50'>
			{deferredPrompt ? (
				<button
					onClick={promptInstall}
					className='rounded-md bg-blue-600 px-3 py-2 text-white shadow'
				>
					Install
				</button>
			) : null}
			{/* Optionally show a small indicator if SW isn't available */}
			{!deferredPrompt && !isRegistered ? (
				<div className='p-2 text-xs text-white/70'>Offline support: enabled</div>
			) : null}
		</div>
	);
}
