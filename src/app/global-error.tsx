'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center p-6">
          <div className="text-center">
            <h1 className="mb-2 text-4xl font-bold">Something went wrong!</h1>
            <p className="mb-8 text-muted-foreground">
              An unexpected error occurred. Please try again.
            </p>
            <Button onClick={() => reset()}>Try Again</Button>
          </div>
        </main>
      </body>
    </html>
  );
}
