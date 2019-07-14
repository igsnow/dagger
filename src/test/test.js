const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,                     // 是否显示浏览器
        args: ['--start-maximized']          // 是否全屏显示
    });
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', {
            get: () => undefined,
        });
    })
    await page.setViewport({
        width: 1500,
        height: 900
    });

    let detailUrl = 'https://detail.1688.com/offer/561232764548.html?tracelog=cps&clickid=3d16a2c1e1e00b819e68ce6d535f2a9a';   // 单属性、不可展开
    // let detailUrl = 'https://detail.1688.com/offer/590864628132.html?tracelog=cps&clickid=21f794860a79469308613e79ab4d77a0'       // 单属性、可展开
    await page.goto(detailUrl, {
        waitUntil: 'load'
    });

    // 如果有SKU展开按钮，则点击
    let isMore = await page.$eval('.obj-expand', e => {
        return e.style.display
    });
    console.log(!!isMore);
    if (!!isMore) {
        await page.tap('.obj-expand')
    }

    // 获取商品sku数组
    const res = await page.$$eval('.table-sku .name', e => {
        let arr = [];
        for (let i = 0; i < e.length; i++) {
            arr.push(e[i].children[0].innerHTML)
        }
        return arr;
    });
    console.log(res);

    // await page.waitFor(2000);
    // await page.focus('.amount-input');
    // await page.type('.amount-input', '1', {
    //     delay: 300,
    // });


})();
