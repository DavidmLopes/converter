export type Rates = Record<string, number>;

export const unitConversions: Record<string, Rates> = {
  length: { m: 1, cm: 100, km: 0.001, inch: 39.3701 },
  volume: { l: 1, ml: 1000, gal: 0.264172 },
  weight: { kg: 1, g: 1000, lb: 2.20462 },
};

export function convert(
  value: string,
  from: string,
  to: string,
  rates: Rates,
): number | '' {
  if (value.trim() === '') return '';
  const amount = Number(value);
  const fromRate = rates[from];
  const toRate = rates[to];
  if (
    !Number.isFinite(amount) ||
    !Number.isFinite(fromRate) ||
    !Number.isFinite(toRate) ||
    fromRate <= 0 ||
    toRate <= 0
  )
    return '';
  const result = (amount / fromRate) * toRate;
  return Number.isFinite(result) ? Number(result.toFixed(2)) : '';
}

export function parseRates(data: unknown): Rates {
  if (
    !data ||
    typeof data !== 'object' ||
    !('rates' in data) ||
    !data.rates ||
    typeof data.rates !== 'object' ||
    Array.isArray(data.rates)
  ) {
    throw new Error('Invalid exchange rates response');
  }
  const rates = Object.fromEntries(
    Object.entries(data.rates).filter(
      ([code, value]) =>
        /^[A-Z]{3}$/.test(code) &&
        typeof value === 'number' &&
        Number.isFinite(value) &&
        value > 0,
    ),
  );
  if (!rates.EUR || !rates.USD)
    throw new Error('Missing default exchange rates');
  return rates;
}
