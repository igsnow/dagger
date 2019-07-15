// 常驻页面，类似于全局函数。缓存从页面获取的采购msg
let msgObj = {}

chrome.contextMenus.create({
    title: '使用小度搜索：%s',
    contexts: ['selection'],
    onclick: function (params) {
        chrome.tabs.create({url: 'https://www.baidu.com/s?ie=utf-8&wd=' + encodeURI(params.selectionText)});
    }
});

chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
    msgObj = request
    let msg = JSON.stringify(request)
    alert(msg)
    // 可以针对sender做一些白名单检查
    // sendResponse返回响应
    if (request.type == 'MsgFromPage') {
        sendResponse({tyep: 'MsgFromChrome', msg: 'Hello, I am chrome res~'});
    }
});


