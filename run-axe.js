
const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');
const fs = require('fs');

(async () => {
  try {
    const browser = await puppeteer.launch({ 
      executablePath: '/usr/local/bin/openclaw-chromium',
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ] 
    });
    const page = await browser.newPage();
    
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('http://localhost:3000/fake-friend-request', { waitUntil: 'networkidle2' });
    
    // Take screenshots
    await page.screenshot({ path: '/data/openclaw/company/canopy/screenshot-desktop.png' });
    
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
    await page.screenshot({ path: '/data/openclaw/company/canopy/screenshot-large-text.png' });
    
    // Run axe
    const results = await new AxePuppeteer(page).analyze();
    fs.writeFileSync('/data/openclaw/company/canopy/axe-results.json', JSON.stringify(results.violations, null, 2));
    
    await browser.close();
    console.log('SUCCESS');
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
})();

