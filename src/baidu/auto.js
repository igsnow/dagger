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


    window.onload = function () {
        console.log(document.getElementsByClassName("amount-input"));
        let ipt = document.getElementsByClassName("amount-input")
        if (ipt && ipt[0]) ipt[0].value = 5

        document.getElementsByClassName("amount-up ")[0].click()
    }


    // document.getElementsByClassName("amount-up ")[0].click()
    // $(".amount-up").click()
    // $(".amount-up").eq(1)[0].click()

    $(".region-detail-title").css("background-color", "red")

    sendMessageToContentScriptByPostMessage("1688", data)


    // let tb = document.querySelectorAll('a')
    // console.log(tb);
}


// 通过DOM事件发送消息给content-script
(function ($) {
    if (location.host == 'detail.1688.com') {
        get1688($);
    } else {
        alert(location.host + "下单功能还未加入!")
    }
})(jQuery);
