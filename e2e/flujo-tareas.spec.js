// e2e/flujo-tareas.spec.js
import { test, expect } from '@playwright/test';

test('un usuario puede crear una tarea y verla en la lista', async ({ page }) => {
  // 1. Entrar a la aplicación
  await page.goto('/');

  // 2. Crear una tarea
  await page.getByLabel('Nueva tarea').fill('Comprar pan');
  await page.getByRole('button', { name: 'Agregar' }).click();

  // 3. Verla en la lista
  await expect(page.getByText('Comprar pan')).toBeVisible();
});
