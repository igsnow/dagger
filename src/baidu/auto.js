// 发送普通消息到content-script
function sendMessageToContentScriptByPostMessage(type, data) {
    window.postMessage({cmd: type, data: data}, '*');
}

function get1688($) {
    let data = {}

    // let ipt = document.getElementById('kw')
    // let btn = document.getElementById('su')
    // ipt.value = '手机'
    // if (ipt.value) btn.click()

    sendMessageToContentScriptByPostMessage("1688", data)
}


// 通过DOM事件发送消息给content-script
(function ($) {
    if (location.host == 'detail.1688.com') {
        get1688($);
    } else {
        alert(location.host + "下单功能还未加入!")
    }
})(jQuery);
