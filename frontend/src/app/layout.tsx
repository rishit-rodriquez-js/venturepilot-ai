import '@/styles/globals.css';
import type { Metadata } from 'next';
import { ClientErrorHandler } from '@/components/ClientErrorHandler';

export const metadata: Metadata = {
  title: 'VenturePilot AI — Enterprise AI Startup Operating System',
  description: 'Persistent AI Co-Founder system transforming raw startup ideas into investor-ready companies.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var origError = console.error;
                console.error = function() {
                  var args = Array.prototype.slice.call(arguments).map(function(arg) {
                    if (arg && typeof arg === 'object' && !(arg instanceof Error)) {
                      if (arg instanceof Event || (arg.constructor && arg.constructor.name && arg.constructor.name.indexOf('Event') !== -1) || arg.type) {
                        return '[Suppressed Event: ' + (arg.type || 'DOM Event') + ']';
                      }
                    }
                    return arg;
                  });
                  origError.apply(console, args);
                };
                window.addEventListener('error', function(e) {
                  if (!e.error || !(e.error instanceof Error)) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }, true);
                window.addEventListener('unhandledrejection', function(e) {
                  if (e.reason && typeof e.reason === 'object' && !(e.reason instanceof Error)) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }, true);
              })();
            `
          }}
        />
      </head>
      <body className="bg-[#070b12] text-slate-100 antialiased selection:bg-cyan-500 selection:text-white">
        <ClientErrorHandler />
        {children}
      </body>
    </html>
  );
}
