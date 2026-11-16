'use client';

import { useEffect, useState } from 'react';
import { parseRates, type Rates } from '@/lib/conversion';

export function useCurrencyRates() {
  const [rates, setRates] = useState<Rates>({});
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  );
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch('/api/rates', {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Exchange rates request failed');
        const rates = parseRates(await response.json());
        if (!controller.signal.aborted) {
          setRates(rates);
          setStatus('ready');
        }
      } catch {
        if (!controller.signal.aborted) setStatus('error');
      }
    }
    void load();
    return () => controller.abort();
  }, [attempt]);

  return {
    rates,
    status,
    retry: () => {
      setStatus('loading');
      setAttempt((current) => current + 1);
    },
  };
}
