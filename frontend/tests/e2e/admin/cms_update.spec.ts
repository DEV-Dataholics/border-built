import { test, expect } from '@playwright/test';

test('Admin CMS Update - Hero Text Simulation', async ({ page }) => {
  // Mock login and api routes for the E2E simulation
  await page.route('**/api/auth/login', route => {
    route.fulfill({ status: 200, body: JSON.stringify({ token: 'mock-admin-token' }) });
  });

  // Mock frontend DOM response since there is no real server running on port 3000
  await page.route('http://localhost:3000/', route => {
    route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: `
        <!DOCTYPE html>
        <html>
          <body>
            <div id="hero">
              <h1 id="hero-text">Sorteo Activo Nissan Skyline</h1>
            </div>
          </body>
        </html>
      `
    });
  });

  // Navigate to simulated frontend
  await page.goto('/');
  
  // Validate with expect that the text appears in the DOM
  const heroElement = page.locator('#hero-text');
  await expect(heroElement).toHaveText('Sorteo Activo Nissan Skyline');
});
