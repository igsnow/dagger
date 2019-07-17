// 常驻页面，存放一些全局的通用方法
window.data = [];

// 获取当前选项卡ID
function getCurrentTabId(callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        if (callback) callback(tabs.length ? tabs[0].id : null);
    });
}

// 给content.js发送消息
function sendMessageToContentScript(message, callback) {
    getCurrentTabId((tabId) => {
        chrome.tabs.sendMessage(tabId, message, function (response) {
            if (callback) callback(response);
        });
    });
}

chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
    window.data.push(request.msg)
    let d = JSON.stringify(window.data)
    // alert(d)

    chrome.tabs.create({url: request.msg.url});
    // chrome.tabs.create({url: 'https://www.baidu.com/'});

    // 可以针对sender做一些白名单检查
    if (request.type == 'MsgFromPage') {
        sendResponse({type: 'MsgFromChrome', msg: 'Hello, I am chrome res~'});
    }

    return true
});

// 新建标签页时触发
chrome.tabs.onCreated.addListener(function (newTab) {
    // 获取所有页面的tab
    chrome.tabs.getAllInWindow(newTab.windowId, function (tabs) {
        // alert(JSON.stringify(tabs))
        tabs.forEach(function (otherTab, index, arr) {
            // 筛选出新建的tab
            if (otherTab.url === newTab.url) {
                setTimeout(() => {
                    chrome.tabs.sendMessage(newTab.id, {
                        cmd: 'sku',
                        value: window.data[arr.length - 1 - index]
                    }, function (response) {
                        console.log(response);
                    });
                }, 1000)   // 不延时的话会报错
                // alert(JSON.stringify(window.data[arr.length - 1 - index]))
            }
        });
    });
    return true
});







