"use client";

import { useEffect } from 'react';

export function ClientErrorHandler() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Intercept and sanitize console.error calls so raw DOM Event objects are formatted safely
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      const sanitized = args.map((arg) => {
        if (arg && typeof arg === 'object' && !(arg instanceof Error)) {
          if (arg instanceof Event || (arg.constructor && arg.constructor.name?.includes('Event')) || arg.type) {
            return `[Suppressed Event: ${arg.type || 'DOM Event'}]`;
          }
        }
        return arg;
      });
      originalConsoleError.apply(console, sanitized);
    };

    const handleUnhandledError = (event: ErrorEvent) => {
      // Suppress unhandled DOM Event overlays for non-Error instances
      if (!event.error || (event.error && !(event.error instanceof Error))) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Suppress unhandled rejections if reason is a raw Event object instead of JS Error
      if (event.reason && typeof event.reason === 'object' && !(event.reason instanceof Error)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener('error', handleUnhandledError, true);
    window.addEventListener('unhandledrejection', handleUnhandledRejection, true);

    return () => {
      console.error = originalConsoleError;
      window.removeEventListener('error', handleUnhandledError, true);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection, true);
    };
  }, []);

  return null;
}
