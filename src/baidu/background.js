// 常驻页面，类似于全局函数。缓存从浏览器页面获取的消息
window.data = null;

chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
    let msg = JSON.stringify(request)
    alert(msg)
    // 可以针对sender做一些白名单检查
    if (request.type == 'MsgFromPage') {
        sendResponse({type: 'MsgFromChrome', msg: 'Hello, I am chrome res~'});
    }
});


