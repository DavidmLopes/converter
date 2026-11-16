import { parseRates } from '@/lib/conversion';

export async function GET() {
  try {
    const response = await fetch('https://api.fxratesapi.com/latest', {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error('Exchange rates request failed');
    return Response.json({ rates: parseRates(await response.json()) });
  } catch {
    return Response.json(
      { error: 'Exchange rates are temporarily unavailable.' },
      { status: 502 },
    );
  }
}
