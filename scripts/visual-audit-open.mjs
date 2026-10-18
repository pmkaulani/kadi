import { chromium } from 'playwright';
import { mkdir, appendFile } from 'node:fs/promises';

const baseUrl = 'http://127.0.0.1:3005/e/kevin-and-wanjiku';
const devices = [
  { name: 'desktop', viewport: { width: 1440, height: 1000 } },
  { name: 'mobile', viewport: { width: 390, height: 844 } },
];

await mkdir('visual-audit', { recursive: true });

const browser = await chromium.launch({ headless: true });
try {
  for (const device of devices) {
    const context = await browser.newContext({
      viewport: device.viewport,
      deviceScaleFactor: 1,
      reducedMotion: 'no-preference',
    });
    const page = await context.newPage();
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(900);

    const openButton = page.getByRole('button', { name: 'Open your invitation envelope' });
    await openButton.waitFor({ state: 'visible', timeout: 15000 });
    await openButton.click();

    // Capture the physical flap-open phase while the card is still inside the envelope.
    await page.waitForTimeout(850);
    await page.screenshot({
      path: `visual-audit/opening-flap-${device.name}.png`,
      fullPage: false,
      animations: 'allow',
    });

    // Wait through card rise + settle, then capture the real guest page after the reveal.
    await page.waitForTimeout(2300);
    await page.screenshot({
      path: `visual-audit/opened-invitation-${device.name}.png`,
      fullPage: true,
      animations: 'disabled',
    });

    const revealed = await page.locator('.iv-world--revealed').count();
    await appendFile(
      'visual-audit/report.txt',
      `\nInteractive opening (${device.name}): revealed=${revealed > 0}; pageErrors=${pageErrors.length ? pageErrors.join(' | ') : 'none'}\n`,
    );
    await context.close();
  }
} finally {
  await browser.close();
}
