import { test, expect } from '@playwright/test';

/**
 * Suite de Pruebas Post-Despliegue en Navegador (Post-Deploy Smoke & Health Suite)
 * Objetivo: Verificar la salud, renderizado, rutas públicas, i18n y seguridad de la app en producción.
 * URL Objetivo por defecto: https://border-built.com/
 */

test.describe('BORDERBUILT - Post-Deploy Smoke Suite', () => {

  test('01. Carga inicial e Infraestructura (Status 200, DOM Root y Assets)', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);

    // Verificar contenedor principal del cliente React
    const rootContainer = page.locator('#root');
    await expect(rootContainer).toBeVisible();

    // Verificar presencia del título en la aplicación
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('02. Navegación por Vistas Públicas Principales', async ({ page }) => {
    // 1. Tienda / Shop
    await page.goto('/shop');
    await expect(page).toHaveURL(/\/shop/);
    await expect(page.locator('#root')).toBeVisible();

    // 2. Cómo funciona / How It Works
    await page.goto('/how-it-works');
    await expect(page).toHaveURL(/\/how-it-works/);

    // 3. Ganadores / Winners
    await page.goto('/winners');
    await expect(page).toHaveURL(/\/winners/);

    // 4. Términos / Legal
    await page.goto('/legal');
    await expect(page).toHaveURL(/\/legal/);
  });

  test('03. Verificación de Protección de Rutas (Redirects a Login para usuarios anónimos)', async ({ page }) => {
    // Mi Garage (/garage) redirige a /login para usuarios anónimos
    await page.goto('/garage');
    await expect(page).toHaveURL(/\/login/);

    // Ruta de administración (/admin) redirige a /login si no hay sesión
    await page.goto('/admin');
    await page.waitForURL(/\/(login|$)/);
    expect(page.url()).not.toContain('/admin');
  });

  test('04. Pantalla de Autenticación / Login Form UI Check', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/\/login/);

    // Verificar presencia de inputs de correo y contraseña o botón de acción
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i], input[placeholder*="correo" i]');
    const passwordInput = page.locator('input[type="password"], input[name="password"]');

    // Al menos uno de los controles o el formulario de autenticación debe estar presente en el DOM
    const hasEmailField = await emailInput.count() > 0;
    const hasPasswordField = await passwordInput.count() > 0;

    expect(hasEmailField || hasPasswordField).toBeTruthy();
  });

  test('05. Checkout UI & Estado Guard (Sin procesamiento real)', async ({ page }) => {
    await page.goto('/checkout');
    await expect(page).toHaveURL(/\/checkout/);

    // El checkout debe renderizar el contenedor principal
    const rootVisible = await page.locator('#root').isVisible();
    expect(rootVisible).toBe(true);
  });

  test('06. Verificación i18n & Renderizado de Textos', async ({ page }) => {
    await page.goto('/');

    // Verificar que no se estén mostrando claves de i18n sin resolver como "t('some.key')"
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).not.toContain("t('");
    expect(bodyText).not.toContain('undefined');
  });

  test('07. Canje de Cupones / Claim Route UI Check', async ({ page }) => {
    await page.goto('/claim');
    await expect(page).toHaveURL(/\/(claim|cupones)/);
    await expect(page.locator('#root')).toBeVisible();
  });

});
