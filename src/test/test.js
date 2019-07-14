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

    // let detailUrl = 'https://detail.1688.com/offer/561232764548.html?tracelog=cps&clickid=3d16a2c1e1e00b819e68ce6d535f2a9a';      // SKU单属性、不可展开
    // let detailUrl = 'https://detail.1688.com/offer/590864628132.html?tracelog=cps&clickid=21f794860a79469308613e79ab4d77a0'       // SKU单属性、可展开
    let detailUrl = 'https://detail.1688.com/offer/539920906466.html?tracelog=cps&clickid=4cfcf6948b3b96be76ab44c199ee173d'          //  SKU双属性、不可展开
    await page.goto(detailUrl, {
        waitUntil: 'load'
    });


    // props
    let firstSku = '卡其';
    let secondSku = '175cm以上';


    // 如果有SKU展开按钮，则点击
    let hasMore = await page.$eval('.obj-expand', e => {
        return e.style.display
    });
    if (!!hasMore) {
        await page.tap('.obj-expand')
    }

    // 如果有leading SKU属性 obj-leading
    let hasLeadSKU = await page.$('.obj-leading')
    let leadArr
    if (!!hasLeadSKU) {
        leadArr = await page.$$eval('.list-leading a', (e, firstSku) => {
            let arr = [];
            let first_index = 0
            for (let i = 0; i < e.length; i++) {
                arr.push(e[i].title)
                // 这个函数不能在内部操作，只能返回函数执行的值，返回头部sku的当前需要被点击的index
                if (e[i].title == firstSku) {
                    first_index = i
                }
            }
            return {arr, first_index};
        }, firstSku);
    }
    leadArr.first_index += 1
    // 拿到头部sku下标，开始点击
    await page.tap('.list-leading li:nth-child(' + leadArr.first_index + ')');


    // 获取商品sku数组
    const skuArr = await page.$$eval('.table-sku .name', e => {
        let arr = [];
        for (let i = 0; i < e.length; i++) {
            arr.push(e[i].children[0].innerHTML)
        }
        return arr;
    });
    console.log(skuArr);

    // await page.waitFor(2000);
    // await page.focus('.amount-input');
    // await page.type('.amount-input', '1', {
    //     delay: 300,
    // });


})();
