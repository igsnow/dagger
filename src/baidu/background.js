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

// 向新页面注入js
function evalNewPageScript(detail, callback) {
    getCurrentTabId((tabId) => {
        chrome.tabs.executeScript(tabId, detail, function (response) {
            if (callback) callback(response);
        });
    });
}

chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
    window.data.push(request)
    let d = JSON.stringify(window.data)

    chrome.tabs.create({url: request.msg.url});

    // sendMessageToContentScript({id: getCurrentTabId(), value: request.msg});


    // 可以针对sender做一些白名单检查
    if (request.type == 'MsgFromPage') {
        sendResponse({type: 'MsgFromChrome', msg: 'Hello, I am chrome res~'});
    }

});




