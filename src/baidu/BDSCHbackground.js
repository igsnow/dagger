chrome.contextMenus.create({
    title: '使用度娘搜索：%s',
    contexts: ['selection'],
    onclick: function (params) {
        chrome.tabs.create({url: 'https://www.baidu.com/s?ie=utf-8&wd=' + encodeURI(params.selectionText)});
    }
});
