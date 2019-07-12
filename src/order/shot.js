var puppeteer = require('puppeteer');

let scrape = async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.setViewport({width: 1920, height: 1080});
    let request_url = 'https://detail.1688.com/offer/585943639773.html?spm=a261p.8650809.0.0.6e476328Bt7AQv&tracelog=cps&clickid=e4f7eaf54a50c5a293338d5f39f68907';
    await page.goto(request_url);
    await page.waitFor(2000);
    await page.screenshot({
        path: 'eg.png',
        fullPage: true
    })
    browser.close();
};

scrape();
