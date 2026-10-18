import { chromium } from 'playwright';
import { mkdir, appendFile } from 'node:fs/promises';

const baseUrl = 'http://127.0.0.1:3005';
const devices = [
  { name: 'desktop', viewport: { width: 1440, height: 1000 } },
  { name: 'mobile', viewport: { width: 390, height: 844 } },
];

await mkdir('visual-audit', { recursive: true });

const browser = await chromium.launch({ headless: true });
try {
  // Scan and scroll through every gallery card before taking its verified capture.
  for (const device of devices) {
    const context = await browser.newContext({
      viewport: device.viewport,
      deviceScaleFactor: 1,
      reducedMotion: 'no-preference',
    });
    const page = await context.newPage();
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    await page.goto(`${baseUrl}/templates`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(800);

    const cards = page.locator('.kadi-template-card');
    const cardCount = await cards.count();
    const galleryReport = [];
    for (let index = 0; index < cardCount; index += 1) {
      const card = cards.nth(index);
      await card.scrollIntoViewIfNeeded();
      await page.waitForTimeout(160);
      galleryReport.push(await card.evaluate((element, cardIndex) => {
        const title = element.querySelector('h3')?.innerText?.trim() || '';
        const stage = element.querySelector('.kadi-template-card__canvas-stage');
        const stageRect = stage?.getBoundingClientRect();
        const canvas = element.querySelector('.kadi-canvas-artboard');
        const canvasRect = canvas?.getBoundingClientRect();
        const canvasRendered = Boolean(canvas && canvasRect && canvasRect.width > 100 && canvasRect.height > 150);
        const canvasFitsStage = Boolean(
          canvasRect && stageRect
          && canvasRect.left >= stageRect.left - 1
          && canvasRect.top >= stageRect.top - 1
          && canvasRect.right <= stageRect.right + 1
          && canvasRect.bottom <= stageRect.bottom + 1
        );
        const heroPhoto = canvas?.querySelector('[data-canvas-element-id="photo-hero"]');
        const htmlImage = heroPhoto?.querySelector('img');
        const svgImage = heroPhoto?.querySelector('image');
        const src = htmlImage?.currentSrc || htmlImage?.getAttribute('src')
          || svgImage?.getAttribute('href')
          || svgImage?.getAttribute('xlink:href')
          || '';
        const photoBox = heroPhoto?.getBoundingClientRect();
        const photoElementVisible = Boolean(heroPhoto && photoBox && photoBox.width > 0 && photoBox.height > 0);
        const photoSourcePresent = Boolean(src.trim());
        const htmlPhotoLoaded = htmlImage ? Boolean(htmlImage.complete && htmlImage.naturalWidth > 0) : null;
        return {
          index: cardIndex,
          title,
          heroPhotoSrc: src,
          heroPhotoSourceKey: src ? src.split('?')[0] : '',
          photoSourcePresent,
          photoElementVisible,
          htmlPhotoLoaded,
          canvasRendered,
          canvasFitsStage,
          stageSize: stageRect ? { width: Math.round(stageRect.width), height: Math.round(stageRect.height) } : null,
          canvasSize: canvasRect ? { width: Math.round(canvasRect.width), height: Math.round(canvasRect.height) } : null,
        };
      }, index));
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `visual-audit/templates-verified-${device.name}.png`,
      fullPage: true,
      animations: 'disabled',
    });

    const sourceCounts = {};
    for (const item of galleryReport) {
      if (item.heroPhotoSourceKey) sourceCounts[item.heroPhotoSourceKey] = (sourceCounts[item.heroPhotoSourceKey] || 0) + 1;
    }
    const galleryDetails = {
      device: device.name,
      cardCount,
      failedImages: galleryReport
        .filter((item) => !item.canvasRendered || !item.photoSourcePresent || !item.photoElementVisible || item.htmlPhotoLoaded === false)
        .map(({ title, heroPhotoSrc, canvasRendered, photoSourcePresent, photoElementVisible, htmlPhotoLoaded }) => ({
          title, heroPhotoSrc, canvasRendered, photoSourcePresent, photoElementVisible, htmlPhotoLoaded,
        })),
      canvasOverflows: galleryReport
        .filter((item) => !item.canvasFitsStage)
        .map(({ title, stageSize, canvasSize }) => ({ title, stageSize, canvasSize })),
      duplicateImageSources: Object.entries(sourceCounts)
        .filter(([, count]) => count > 1)
        .map(([source, count]) => ({ source, count })),
      cards: galleryReport,
      pageErrors,
    };
    await appendFile(
      'visual-audit/report.txt',
      `\nTemplate gallery scroll audit (${device.name}):\n${JSON.stringify(galleryDetails, null, 2)}\n`,
    );
    await context.close();
  }

  // Guest experience: capture flap, then scroll each content block into view before the full-page shot.
  for (const device of devices) {
    const context = await browser.newContext({
      viewport: device.viewport,
      deviceScaleFactor: 1,
      reducedMotion: 'no-preference',
    });
    const page = await context.newPage();
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    await page.goto(`${baseUrl}/e/kevin-and-wanjiku`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(900);

    const openButton = page.getByRole('button', { name: 'Open your invitation envelope' });
    await openButton.waitFor({ state: 'visible', timeout: 15000 });
    await openButton.click();

    await page.waitForTimeout(850);
    await page.screenshot({
      path: `visual-audit/opening-flap-${device.name}.png`,
      fullPage: false,
      animations: 'allow',
    });
    await page.waitForTimeout(2300);

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
        text: (element.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 180),
      }), index));
    }

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

    // Record embedded-map status separately; browser screenshot success doesn't guarantee third-party tiles loaded.
    const iframeReport = await page.locator('iframe').evaluateAll((elements) => elements.map((element) => ({
      title: element.title || '',
      src: element.getAttribute('src') || '',
      width: Math.round(element.getBoundingClientRect().width),
      height: Math.round(element.getBoundingClientRect().height),
    })));

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
      iframes: iframeReport,
      pageErrors,
    };
    await appendFile(
      'visual-audit/report.txt',
      `\nInteractive opening and scroll audit (${device.name}):\n${JSON.stringify(details, null, 2)}\n`,
    );
    await context.close();
  }
} finally {
  await browser.close();
}
