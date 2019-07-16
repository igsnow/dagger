// 共用页面的DOM，但是和页面的js是隔离的

//向页面注入JS
function injectCustomJs(jsPath) {
    jsPath = jsPath || 'auto.js';
    var temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    temp.src = chrome.extension.getURL(jsPath);
    temp.onload = function () {
        // this.parentNode.removeChild(this);
    };
    document.body.appendChild(temp);
}

//直接提交表单，
window.addEventListener("message", function (e) {
    if (e.data && e.data.cmd == '1688') {
        //传递给background
        //chrome.runtime.sendMessage({host:"1688",data:e.data.data}, function(response) {
        //});
        console.log(e.data);
        alert('下单成功')
    }
}, false);


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

if (location.host == 'detail.1688.com') {
    $(function () {
        injectCustomJs();
    })
} else {
    console.log('不是1688页面!')
}





