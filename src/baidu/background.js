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
    // alert(JSON.stringify(window.data))

    chrome.tabs.create({url: request.msg.url});


    // 可以针对sender做一些白名单检查
    if (request.type == 'MsgFromPage') {
        sendResponse({type: 'MsgFromChrome', msg: 'Hello, I am chrome res~'});
    }
});

// 新建标签页时触发
chrome.tabs.onCreated.addListener(function (newTab) {
    // 获取所有页面的tab
    chrome.tabs.query({windowId: newTab.windowId}, function (tabs) {
        tabs.forEach(function (item, index, arr) {
            // 筛选出新建的tab
            if (item.url === newTab.url) {
                setTimeout(() => {
                    chrome.tabs.sendMessage(newTab.id, {
                        cmd: 'sku',
                        value: window.data[0]
                    }, function (response) {
                        // alert('tab content的回复：' + response);
                    });
                    window.data.splice(0, 1)
                }, 1000)   // 不延时的话会报错
            }
        });
    });
});











