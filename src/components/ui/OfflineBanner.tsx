'use client';

import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';

export interface OfflineBannerProps {
  className?: string;
  onStatusChange?: (isOnline: boolean) => void;
}

export function OfflineBanner({ className = '', onStatusChange }: OfflineBannerProps) {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [justReconnected, setJustReconnected] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOnline(window.navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setJustReconnected(true);
      if (onStatusChange) onStatusChange(true);
      const timer = setTimeout(() => setJustReconnected(false), 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setJustReconnected(false);
      if (onStatusChange) onStatusChange(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [onStatusChange]);

  const checkConnection = async () => {
    setChecking(true);
    try {
      // Use head request or lightweight ping
      const res = await fetch('/api/auth/me', { method: 'GET', cache: 'no-store' });
      if (res.ok || res.status === 401) {
        setIsOnline(true);
        setJustReconnected(true);
        if (onStatusChange) onStatusChange(true);
        setTimeout(() => setJustReconnected(false), 3000);
      } else {
        setIsOnline(false);
      }
    } catch {
      setIsOnline(false);
    } finally {
      setChecking(false);
    }
  };

  if (isOnline && !justReconnected) {
    return null;
  }

  if (justReconnected) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`w-full bg-emerald-700 text-white px-4 py-2 text-xs font-medium flex items-center justify-center gap-2 shadow-sm animate-in slide-in-from-top duration-200 ${className}`}
      >
        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Connection restored. Changes have been synchronized.</span>
      </div>
    );
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`w-full bg-[#934638] text-white px-4 py-2 text-xs font-medium flex flex-wrap items-center justify-between gap-3 shadow-md animate-in slide-in-from-top duration-200 ${className}`}
    >
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>
          <strong>You are currently offline.</strong> Your latest edits are safely preserved on this device.
        </span>
      </div>

      <button
        type="button"
        onClick={checkConnection}
        disabled={checking}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/20 hover:bg-white/30 text-white text-[11px] font-semibold transition-colors disabled:opacity-50"
      >
        <RefreshCw className={`w-3 h-3 ${checking ? 'animate-spin' : ''}`} aria-hidden="true" />
        <span>{checking ? 'Checking...' : 'Check Connection'}</span>
      </button>
    </div>
  );
}
