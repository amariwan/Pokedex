"use client";

import { useEffect, useState } from 'react';

export default function PwaRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('serviceWorker' in navigator) {
      const onLoad = () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('Service worker registered:', reg);
            setIsRegistered(true);
          })
          .catch((err) => {
            console.warn('SW registration failed:', err);
          });
      };
      window.addEventListener('load', onLoad);

      return () => window.removeEventListener('load', onLoad);
    }
  }, []);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler as EventListener);
    return () => window.removeEventListener('beforeinstallprompt', handler as EventListener);
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return;
    try {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      console.log('PWA install choice', choice);
      setDeferredPrompt(null);
    } catch (err) {
      console.warn('PWA prompt failed', err);
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
