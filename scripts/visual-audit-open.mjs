import { chromium } from 'playwright';
import { mkdir, appendFile, writeFile } from 'node:fs/promises';

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

    // Save the physical flap-open phase before scrolling changes the scene.
    await page.waitForTimeout(850);
    await page.screenshot({
      path: `visual-audit/opening-flap-${device.name}.png`,
      fullPage: false,
      animations: 'allow',
    });

    // Wait through card rise + settle.
    await page.waitForTimeout(2300);

    // Reveal every scroll-animated content block the way a real guest would.
    const blocks = page.locator('.iv-content-sections .iv-stationery-page');
    const blockCount = await blocks.count();
    const blockReport = [];
    for (let index = 0; index < blockCount; index += 1) {
      const block = blocks.nth(index);
      await block.scrollIntoViewIfNeeded();
      await page.waitForTimeout(680);
      blockReport.push(await block.evaluate((element, blockIndex) => ({
        index: blockIndex,
        id: element.id || null,
        height: Math.round(element.getBoundingClientRect().height),
        opacity: getComputedStyle(element).opacity,
        text: (element.innerText || '').replace(/\\s+/g, ' ').trim().slice(0, 180),
      }), index));
    }

    // Force lazy-loaded media to enter view once, then capture the entire invitation
    // from the top with all scroll-triggered content already revealed.
    const images = page.locator('img');
    const imageReport = [];
    const imageCount = await images.count();
    for (let index = 0; index < imageCount; index += 1) {
      const img = images.nth(index);
      try {
        await img.scrollIntoViewIfNeeded({ timeout: 1500 });
        await page.waitForTimeout(100);
        imageReport.push(await img.evaluate((element, imageIndex) => ({
          index: imageIndex,
          alt: element.alt || '',
          src: element.currentSrc || element.getAttribute('src') || '',
          loaded: element.complete && element.naturalWidth > 0,
          naturalWidth: element.naturalWidth,
        }), index));
      } catch (error) {
        imageReport.push({ index, error: String(error) });
      }
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(700);
    await page.screenshot({
      path: `visual-audit/opened-invitation-${device.name}.png`,
      fullPage: true,
      animations: 'disabled',
    });

    const details = {
      device: device.name,
      revealed: await page.locator('.iv-world--revealed').count() > 0,
      blockCount,
      blocks: blockReport,
      imageCount: imageReport.length,
      brokenImages: imageReport.filter((entry) => 'loaded' in entry && !entry.loaded),
      pageErrors,
    };
    await appendFile(
      'visual-audit/report.txt',
      `\\nInteractive opening and scroll audit (${device.name}):\\n${JSON.stringify(details, null, 2)}\\n`,
    );
    await context.close();
  }
} finally {
  await browser.close();
}
