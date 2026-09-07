const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 500, height: 800 } });
  await page.goto('http://localhost:8000/');
  
  // Wait for the grid to render
  await page.waitForSelector('.horizontal-scroll-track');
  
  // Take a screenshot of the section
  const section = await page.$('.horizontal-scroll-section');
  await section.screenshot({ path: 'work_section.png' });
  
  console.log("Screenshot saved to work_section.png");
  await browser.close();
})();
