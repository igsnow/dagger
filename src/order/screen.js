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
    let url = 'https://detail.1688.com/offer/585943639773.html?spm=a261p.8650809.0.0.6e476328Bt7AQv&tracelog=cps&clickid=e4f7eaf54a50c5a293338d5f39f68907';
    await page.goto(url, {
        waitUntil: 'load'
    });
    // TODO 业务逻辑

    // 页面自动滚动到底部，确保获取懒加载的信息
    await page.evaluate(() => {
        return new Promise((resolve, reject) => {
            let totalHeight = 0
            let distance = 600
            let timer = setInterval(() => {
                window.scrollBy(0, distance)
                totalHeight += distance
                if (totalHeight >= document.body.scrollHeight) {
                    clearInterval(timer)
                    resolve()
                }
            }, 200)
        })
    });
    // 获取页面所有的a链接
    let res = await page.evaluate(() => {
        return new Promise((resolve, reject) => {
            let links = [...document.querySelectorAll('a')]
            let arr = links.map(el => {
                return {href: el.href.trim(), text: el.innerText}
            })
            resolve(arr)
        })
    })
    console.log(res);

    // // 获取页面源代码信息
    // const bodyHandle = await page.$('body');
    // const html = await page.evaluate(body => body.innerHTML, bodyHandle);
    // await bodyHandle.dispose();
    // console.log(html);

    // 获取完整的页面截图
    // await page.screenshot({path: 'screenshot.png', fullPage: true});
    await browser.close();
});
