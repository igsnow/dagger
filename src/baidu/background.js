// 常驻页面，类似于全局函数。缓存从浏览器页面获取的消息
window.data = [];

chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
    window.data.push(request)
    let d = JSON.stringify(window.data)

    window.open(request.msg.url)

    // 可以针对sender做一些白名单检查
    if (request.type == 'MsgFromPage') {
        sendResponse({type: 'MsgFromChrome', msg: 'Hello, I am chrome res~'});
    }
});



