// 共用页面的DOM，但是和页面的js是隔离的

//向页面注入JS
function injectCustomJs(jsPath) {
    jsPath = jsPath || 'auto.js';
    var temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    temp.src = chrome.extension.getURL(jsPath);
    temp.onload = function () {
        this.parentNode.removeChild(this);
    };
    document.body.appendChild(temp);
}


window.addEventListener("message", function (e) {
    if (e.data && e.data.cmd == '1688') {
        // console.log(e.data);
        // alert('下单成功')
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

    if (request.cmd == 'sku') {
        console.log(request.value);
    }
    sendResponse('我收到了你的消息！');
});


// detail.1688.com
if (location.host == 'detail.1688.com') {

    console.log(6666666)


    $(function () {
        injectCustomJs();
    })
} else {
    console.log('不是1688页面!')
}





