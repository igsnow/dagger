// 发送普通消息到content-script
function sendMessageToContentScriptByPostMessage(type, data) {
    window.postMessage({cmd: type, data: data}, '*');
}

function get1688() {
    //获取抓取的所有信息，然后返回给content
    var data = {name: 'zzy'}

    sendMessageToContentScriptByPostMessage("1688", data)
}


// 通过DOM事件发送消息给content-script
(function () {
    if (location.host == 'detail.1688.com') {
        get1688();
    } else {
        alert(location.host + "下单功能还未加入!")
    }
})();
