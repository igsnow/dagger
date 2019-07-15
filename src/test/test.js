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

    // 先跳转到登录页
    let loginUrl = 'https://login.1688.com/member/signin.htm?spm=a260k.dacugeneral.2683862.3.6633436c8iuuzd&Done=https%3A%2F%2Fwww.1688.com%2F';
    // let detailUrl = 'https://detail.1688.com/offer/561232764548.html?tracelog=cps&clickid=1f7533a926bc68461bebb935ae87f947';      // SKU单属性、不可展开
    // let detailUrl = 'https://detail.1688.com/offer/529394257204.html?tracelog=cps&clickid=61e0b598ce01cda708dbaf64d3100e7a'       // 2、SKU单属性、可展开
    // let detailUrl = 'https://detail.1688.com/offer/539920906466.html?tracelog=cps&clickid=1c3be55000cef1bdbb73ccb26c4aadf4';      // 3、SKU双属性、不可展开
    let detailUrl = 'https://detail.1688.com/offer/596119228976.html?tracelog=cps&clickid=e50d2e6469c9988ecb867dc0e2df166d';      // 4、SKU双属性、可展开

    await page.goto(loginUrl, {
        // waitUntil: 'load'
    });

    // 监听到导航栏url变化时，当登录成功时跳转到1688详情页
    if (page.url() === loginUrl) {
        while (true) {
            await page.waitForNavigation({
                // waitUntil: 'load'
            })
            if (page.url() !== loginUrl) {
                console.log('=>登录成功！')
                await page.goto(detailUrl, {
                    // waitUntil: 'load'
                });
                break;
            }
        }
    }

    // 1、SKU单属性、不可展开
    // let secondSku = '计时器XL-331黑色';
    // let num = 30;

    // 2、SKU单属性、可展开
    // let secondSku = '2.1mm圆形20夹';
    // let num = 10;

    // 3、SKU双属性、不可展开
    // let firstSku = '米色';
    // let secondSku = '175cm以上';
    // let num = 4;

    // 4、SKU双属性、可展开
    let firstSku = '白色（001）';
    let secondSku = '2XL';
    let num = 5;

    // 如果有SKU更多展开按钮，则点击
    let hasMore = await page.$eval('.obj-expand', e => {
        return e.style.display
    });
    if (!!hasMore) {
        await page.tap('.obj-expand');
        console.log('=>展开更多sku列表...')
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
                // (坑1)这个函数不能在内部操作，只能返回函数执行的值，返回头部sku的当前需要被点击的index
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
        console.log('=>头部sku已选!')
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
    let selector = '.table-sku tr:nth-child(' + skuObj.second_index + ') .amount-input';
    let up = '.table-sku tr:nth-child(' + skuObj.second_index + ') .amount-up';
    let down = '.table-sku tr:nth-child(' + skuObj.second_index + ') .amount-down';
    await page.focus(selector);
    console.log('=>sku数量输入框已获取焦点,等待输入...');

    await page.waitFor(300);

    // (坑2)自动填写商品数量，但是下方价格不改变，于是先自增一再减一，价格正确显示
    await page.$eval(selector, (input, num) => input.value = num, num);
    await page.waitFor(300);
    await page.tap(up);
    await page.waitFor(300);
    await page.tap(down);
    console.log('=>数量已自动填充完成!');

    // 失去输入框焦点
    // await page.evaluate((selector) => {
    //     document.querySelector(selector).blur()
    // }, selector)

    await page.waitFor(500);

    // 加入购物车
    await page.tap('.do-cart')
    console.log('加入购物车成功!')
})();
