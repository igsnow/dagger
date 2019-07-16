// 共用页面的DOM，但是和页面的js是隔离的
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.cmd == 'test') {
        alert(request.value);
    }
    sendResponse('我收到了你的消息！');
});
