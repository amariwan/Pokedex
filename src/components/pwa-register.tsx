"use client";

import { logger } from '@/lib/logger';
import { useEffect, useState } from 'react';

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
    <div aria-hidden className="fixed bottom-4 right-4 z-50">
      {deferredPrompt ? (
        <button onClick={promptInstall} className="bg-blue-600 text-white px-3 py-2 rounded-md shadow">Install</button>
      ) : null}
      {/* Optionally show a small indicator if SW isn't available */}
      {!deferredPrompt && !isRegistered ? (
        <div className="text-xs text-white/70 p-2">Offline support: enabled</div>
      ) : null}
    </div>
  );
}
