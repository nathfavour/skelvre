'use client';

import React, { useState, useEffect } from 'react';
import { Download, Share, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    );
  });
  const [isIOS] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  });
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  if (isInstalled) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono rounded-lg bg-violet-950/60 border border-violet-500/40 text-violet-300 hover:bg-violet-900/60 hover:text-white transition-colors"
        title="Install Skelvre as an Offline PWA on your device"
      >
        <Download className="w-3.5 h-3.5 text-violet-400" />
        <span>Install App</span>
      </button>

      {/* iOS Safari Installation Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-xl bg-[#161412] border border-white/20 p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Share className="w-4 h-4 text-violet-400" />
                <span>Install on iPhone / iPad</span>
              </h3>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              1. Tap the <strong>Share</strong> button at the bottom of your Safari browser.<br />
              2. Scroll down and tap <strong>Add to Home Screen</strong>.<br />
              3. Open Skelvre from your home screen for full offline execution.
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2 text-xs font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-500 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
