'use client';

import { useState } from 'react';
import { convert, type Rates } from '@/lib/conversion';

export function useConversion(from: string, to: string, rates: Rates) {
  const [input, setInput] = useState({ value: '', side: 'amount' });
  const amount =
    input.side === 'amount'
      ? input.value
      : convert(input.value, to, from, rates);
  const result =
    input.side === 'result'
      ? input.value
      : convert(input.value, from, to, rates);

  return {
    amount,
    result,
    changeAmount: (value: string) => setInput({ value, side: 'amount' }),
    changeResult: (value: string) => setInput({ value, side: 'result' }),
    swap: () =>
      setInput((current) => ({
        ...current,
        side: current.side === 'amount' ? 'result' : 'amount',
      })),
  };
}
