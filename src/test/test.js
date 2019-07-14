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
    });
    await page.setViewport({
        width: 1500,
        height: 900
    });

    // let detailUrl = 'https://detail.1688.com/offer/561232764548.html?tracelog=cps&clickid=3d16a2c1e1e00b819e68ce6d535f2a9a';      // SKU单属性、不可展开
    let detailUrl = 'https://detail.1688.com/offer/559772796641.html?tracelog=cps&clickid=765f70be6e5b3a0899e7801479b1206b'       // SKU单属性、可展开
    // let detailUrl = 'https://detail.1688.com/offer/539920906466.html?tracelog=cps&clickid=4cfcf6948b3b96be76ab44c199ee173d'          //  SKU双属性、不可展开
    await page.goto(detailUrl, {
        waitUntil: 'load'
    });

    // sku属性
    let firstSku = '卡其';
    let secondSku = 'BTS展会自制卡';
    let num = 3;

    // 如果有SKU更多展开按钮，则点击
    let hasMore = await page.$eval('.obj-expand', e => {
        return e.style.display
    });
    if (!!hasMore) {
        await page.tap('.obj-expand')
    }
    // 延时，模拟用户操作时长
    await page.waitFor(300);

    // 判断页面是否有如颜色等切换的SKU属性 即含有class为obj-leading的标签
    let hasLeadSKU = await page.$('.obj-leading');
    let leadObj;
    if (!!hasLeadSKU) {
        leadObj = await page.$$eval('.list-leading a', (e, firstSku) => {
            let arr = [];
            let first_index = 0;
            for (let i = 0; i < e.length; i++) {
                arr.push(e[i].title);
                // (坑!!!)这个函数不能在内部操作，只能返回函数执行的值，返回头部sku的当前需要被点击的index
                if (e[i].title == firstSku) {
                    first_index = i
                }
            }
            return {arr, first_index};
        }, firstSku);
        console.log(leadObj);
        leadObj.first_index += 1;
        // 拿到头部sku下标，开始点击
        await page.tap('.list-leading li:nth-child(' + leadObj.first_index + ')');
    }
    await page.waitFor(300);
    // 获取商品sku数组
    const skuObj = await page.$$eval('.table-sku .name', (e, secondSku) => {
        let arr = [];
        let second_index = 0;
        for (let i = 0; i < e.length; i++) {
            // 如果sku有图片，则sku取span标签的title值
            if (e[i].children[0].title) {
                arr.push(e[i].children[0].title)
                if (e[i].children[0].title == secondSku) {
                    second_index = i
                }
            } else {
                arr.push(e[i].children[0].innerHTML)
                if (e[i].children[0].innerHTML == secondSku) {
                    second_index = i
                }
            }
        }
        return {arr, second_index};
    }, secondSku);
    console.log(skuObj);
    skuObj.second_index += 1;

    // 数量输入框得聚焦，不然sku下方的价格统计不显示
    await page.focus('.table-sku tr:nth-child(' + skuObj.second_index + ') .amount-input');
    await page.waitFor(300);
    // 自动填写商品数量
    await page.$eval('.table-sku tr:nth-child(' + skuObj.second_index + ') .amount-input', (input, num) => input.value = num, num);


})();
