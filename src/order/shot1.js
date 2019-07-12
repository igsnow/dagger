const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ignoreHTTPSErrors: true, headless: false, args: ['--no-sandbox']});
    const page = await browser.newPage();
    await page.setViewport({width: 1920, height: 1080});
    let request_url = 'https://detail.1688.com/offer/585943639773.html?spm=a261p.8650809.0.0.6e476328Bt7AQv&tracelog=cps&clickid=e4f7eaf54a50c5a293338d5f39f68907';
    await page.goto(request_url, {waitUntil: 'domcontentloaded'}).catch(err => console.log(err));
    await page.waitFor(1000);
    let title = await page.title();
    console.log(title);
    const max_height_px = 20000;
    let scrollStep = 1080;
    let height_limit = false;
    let mValues = {'scrollEnable': true, 'height_limit': height_limit};
    while (mValues.scrollEnable) {
        mValues = await page.evaluate((scrollStep, max_height_px, height_limit) => {
            if (document.scrollingElement) {
                let scrollTop = document.scrollingElement.scrollTop;
                document.scrollingElement.scrollTop = scrollTop + scrollStep;
                if (null != document.body && document.body.clientHeight > max_height_px) {
                    height_limit = true;
                } else if (document.scrollingElement.scrollTop + scrollStep > max_height_px) {
                    height_limit = true;
                }
                let scrollEnableFlag = false;
                if (null != document.body) {
                    scrollEnableFlag = document.body.clientHeight > scrollTop + 1081 && !height_limit;
                } else {
                    scrollEnableFlag = document.scrollingElement.scrollTop + scrollStep > scrollTop + 1081 && !height_limit;
                }
                return {
                    'scrollEnable': scrollEnableFlag,
                    'height_limit': height_limit,
                    'document_scrolling_Element_scrollTop': document.scrollingElement.scrollTop
                };
            }
        }, scrollStep, max_height_px, height_limit);
        await sleep(800);
    }
    try {
        await page.screenshot({path: "eg1.png", fullPage: true}).catch(err => {
            console.log(err);
        });
        await page.waitFor(5000);
    } catch (e) {
        console.log(e);
    } finally {
        await browser.close();
    }
})();


function sleep(delay) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                resolve(1)
            } catch (e) {
                reject(0)
            }
        }, delay)
    })
}

