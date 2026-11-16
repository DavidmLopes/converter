import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  convert,
  parseRates,
  unitConversions,
  type Rates,
} from '../src/lib/conversion.ts';

test('converts currencies through a shared base and rounds to two decimals', () => {
  const rates = { EUR: 0.9, USD: 1, GBP: 0.8 };
  assert.equal(convert('100', 'EUR', 'USD', rates), 111.11);
  assert.equal(convert('100', 'USD', 'EUR', rates), 90);
  assert.equal(convert('0', 'EUR', 'USD', rates), 0);
});

test('converts every unit category in both directions', () => {
  assert.equal(convert('2', 'm', 'cm', unitConversions.length), 200);
  assert.equal(convert('200', 'cm', 'm', unitConversions.length), 2);
  assert.equal(convert('2', 'l', 'ml', unitConversions.volume), 2000);
  assert.equal(convert('2000', 'g', 'kg', unitConversions.weight), 2);
});

test('does not produce NaN or infinity from empty input or unavailable rates', () => {
  for (const input of ['', ' ', 'invalid', 'Infinity', '1e309']) {
    assert.equal(convert(input, 'EUR', 'USD', { EUR: 1, USD: 2 }), '');
  }
  for (const rates of [
    {},
    { EUR: 0, USD: 1 },
    { EUR: 1, USD: Infinity },
  ] as Rates[]) {
    assert.equal(convert('10', 'EUR', 'USD', rates), '');
  }
});

test('validates upstream rates and rejects unusable responses', () => {
  assert.deepEqual(
    parseRates({
      rates: { EUR: 1, USD: 1.1, GBP: 0.85, BAD: -1, NAN: NaN, STRING: '2' },
    }),
    { EUR: 1, USD: 1.1, GBP: 0.85 },
  );
  for (const data of [
    null,
    {},
    { rates: [] },
    { rates: { EUR: 0, USD: 1 } },
    { rates: { EUR: 1 } },
  ]) {
    assert.throws(() => parseRates(data));
  }
});
