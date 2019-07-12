const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    let request_url = 'https://detail.1688.com/offer/585943639773.html?spm=a261p.8650809.0.0.6e476328Bt7AQv&tracelog=cps&clickid=e4f7eaf54a50c5a293338d5f39f68907';
    await page.goto(request_url, {waitUtil: 'networkidle2'});
    await page.setViewport({
        width: 1200,
        height: 800
    });
    await autoScroll(page);
    await page.screenshot({
        path: 'eg2.png',
        fullPage: true
    });
    await browser.close();
})();

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 500;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}
