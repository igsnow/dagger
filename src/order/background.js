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
    chrome.tabs.create({url: request.msg.url}, function (tab) {
        // 给新建的tab绑定一个id，便于后面更新页面时发送消息
        request.msg.id = tab.id;
        window.data.push(request.msg);
    });

    // 可以针对sender做一些白名单检查
    if (request.type == 'MsgFromPage') {
        sendResponse({type: 'MsgFromChrome', msg: 'Hello, I am chrome res~'});
    }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    // 当新开标签页时，预加载蒙层
    if (changeInfo.status == 'loading') {
        chrome.tabs.query({}, function (tabs) {
            tabs.forEach(function (item, index, arr) {
                if (item.id === tabId) {
                    chrome.tabs.sendMessage(tabId, {cmd: 'pre', value: 'showMask'});
                }
            });
        })
    }
    // 当页面加载完时，才能操作dom
    if (changeInfo.status == 'complete') {
        console.log(tab, window.data);
        chrome.tabs.query({}, function (tabs) {
            tabs.forEach(function (item, index, arr) {
                if (item.id === tabId) {
                    chrome.tabs.sendMessage(tabId, {cmd: 'sku', value: getCurTabMsg(window.data, tabId)});
                }
            });
        })
    }
});

// 根据tabId获取全局对象对应tab的消息
function getCurTabMsg(data, id) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
            return data[i]
        }
    }
}













