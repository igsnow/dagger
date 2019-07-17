// 发送普通消息到content-script
function sendMessageToContentScriptByPostMessage(type, data) {
    window.postMessage({cmd: type, data: data}, '*');
}

function get1688($) {
    //获取抓取的所有信息，然后返回给content
    let data = {name: 'zzy'}


    let ipt = document.getElementById('kw')
    let btn = document.getElementById('su')
    ipt.value = '手机'
    if (ipt.value) btn.click()


    // document.getElementsByClassName("amount-up ")[0].click()
    // console.log(document.getElementsByClassName("amount-up "));
    // $(".amount-up").click()
    // $(".amount-up").eq(1)[0].click()
    // console.log($('.list-leading'))

    $(".region-detail-title").css("background-color", "red")

    sendMessageToContentScriptByPostMessage("1688", data)
}


// 通过DOM事件发送消息给content-script
(function ($) {
    if (location.host == 'www.baidu.com') {
        get1688($);
    } else {
        alert(location.host + "下单功能还未加入!")
    }
})(jQuery);
