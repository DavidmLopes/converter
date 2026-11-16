import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/api/rates', (route) =>
    route.fulfill({ json: { rates: { EUR: 1, USD: 1.1, GBP: 0.85 } } }),
  );
  await page.goto('/');
  await expect(
    page.getByRole('combobox', { name: 'From', exact: true }),
  ).toBeEnabled();
});

test('currency selections, reverse edits, and swaps recalculate', async ({
  page,
}) => {
  await page.getByLabel('Amount').fill('100');
  await expect(page.getByLabel('Result')).toHaveValue('110');
  await page.getByRole('combobox', { name: 'To', exact: true }).click();
  await page.getByRole('option', { name: 'GBP' }).click();
  await expect(page.getByLabel('Result')).toHaveValue('85');
  await page.getByLabel('Result').fill('170');
  await expect(page.getByLabel('Amount')).toHaveValue('200');
  await page.getByRole('button', { name: 'Swap currencies' }).click();
  await expect(page.getByLabel('Amount')).toHaveValue('170');
  await expect(page.getByLabel('Result')).toHaveValue('200');
});

test('unit selections and category changes recalculate; either field can be cleared', async ({
  page,
}) => {
  await page.getByRole('tab', { name: 'Units', exact: true }).click();
  await page.getByLabel('Amount').fill('2');
  await expect(page.getByLabel('Result')).toHaveValue('200');
  await page.getByRole('combobox', { name: 'To', exact: true }).click();
  await page.getByRole('option', { name: 'km', exact: true }).click();
  await expect(page.getByLabel('Result')).toHaveValue('0');
  await page.getByRole('combobox', { name: 'Unit Type' }).click();
  await page.getByRole('option', { name: 'Volume' }).click();
  await expect(page.getByLabel('Result')).toHaveValue('2000');
  await page.getByRole('button', { name: 'Swap units' }).click();
  await expect(page.getByLabel('Amount')).toHaveValue('2000');
  await expect(page.getByLabel('Result')).toHaveValue('2');
  await page.getByLabel('Result').fill('3');
  await expect(page.getByLabel('Amount')).toHaveValue('3000');
  await page.getByLabel('Amount').fill('');
  await expect(page.getByLabel('Result')).toHaveValue('');
});

test('currency failures can be retried and units remain available', async ({
  page,
}) => {
  await page.route('**/api/rates', (route) =>
    route.fulfill({ status: 502, json: { error: 'Unavailable' } }),
  );
  await page.reload();
  await expect(
    page
      .getByRole('alert')
      .filter({ hasText: 'Unable to load exchange rates' }),
  ).toContainText('Unable to load exchange rates');
  await page.getByRole('tab', { name: 'Units', exact: true }).click();
  await page.getByLabel('Amount').fill('1');
  await expect(page.getByLabel('Result')).toHaveValue('100');
  await page.getByRole('tab', { name: 'Currency', exact: true }).click();
  await expect(
    page
      .getByRole('alert')
      .filter({ hasText: 'Unable to load exchange rates' }),
  ).toBeVisible();
  await page.unroute('**/api/rates');
  await page.route('**/api/rates', (route) =>
    route.fulfill({ json: { rates: { EUR: 1, USD: 1.1 } } }),
  );
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(
    page.getByRole('combobox', { name: 'From', exact: true }),
  ).toBeEnabled();
  await page.getByLabel('Amount').fill('10');
  await expect(page.getByLabel('Result')).toHaveValue('11');
});

test('theme toggle persists and manifest icons resolve', async ({
  page,
  request,
}) => {
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.getByRole('button', { name: 'Toggle color theme' }).click();
  await expect(page.locator('html')).toHaveClass(/light/);
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/light/);
  expect((await request.get('/manifest.json')).ok()).toBeTruthy();
  const response = await request.get('/manifest.webmanifest');
  expect(response.ok()).toBeTruthy();
  const manifest = await response.json();
  for (const icon of manifest.icons)
    expect((await request.get(icon.src)).ok()).toBeTruthy();
});

test('switching tabs keeps the loaded rates without another request', async ({
  page,
}) => {
  let requests = 0;
  await page.route('**/api/rates', (route) => {
    requests++;
    return route.fulfill({ json: { rates: { EUR: 1, USD: 1.1 } } });
  });
  await page.reload();
  await expect(
    page.getByRole('combobox', { name: 'From', exact: true }),
  ).toBeEnabled();
  await page.getByRole('tab', { name: 'Units', exact: true }).click();
  await page.getByRole('tab', { name: 'Currency', exact: true }).click();
  await expect(
    page.getByRole('combobox', { name: 'From', exact: true }),
  ).toBeEnabled();
  expect(requests).toBe(1);
});
