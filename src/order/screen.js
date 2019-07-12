const puppeteer = require('puppeteer');

puppeteer.launch({
    headless: false,                     // 是否显示浏览器
    args: ['--start-maximized']          // 是否全屏显示
}).then(async browser => {
    const page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 1080
    });
    let request_url = 'https://detail.1688.com/offer/585943639773.html?spm=a261p.8650809.0.0.6e476328Bt7AQv&tracelog=cps&clickid=e4f7eaf54a50c5a293338d5f39f68907';
    await page.goto(request_url);
    // TODO

    const bodyHandle = await page.$('body');
    const html = await page.evaluate(body => body.innerHTML, bodyHandle);
    await bodyHandle.dispose();
    console.log(html);
    await page.screenshot({path: 'screenshot.png', fullPage: true});
    await browser.close();
});
