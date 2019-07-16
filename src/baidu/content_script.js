// 共用页面的DOM，但是和页面的js是隔离的

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.cmd == 'batch') {
        alert(request.value);
        $('.fxkbtn').each(function (index, element) {
            if ($(this).css("display") != "none") {
                $(this).click()
            }
        })
    }
    sendResponse('我收到了你的消息！');
});



