// 控制扩展程序的js，比如点击插件开始按钮
$(function () {
    $("#btn").click(function () {
        alert('hello')
        // // chrome.tabs.query可以通过回调函数获得当前页面的信息tabs
        // chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        //     // 发送一个copy消息出去
        //     chrome.tabs.sendMessage(tabs[0].id, {action: "copy"}, function (response) {
        //         // 这里的回调函数接收到了要抓取的值，获取值得操作在下方content-script.js
        //         // 将值存在background.js的data属性里面。
        //         var win = chrome.extension.getBackgroundPage();
        //         win.data = response;
        //         console.log(response);
        //     });
        // });
    });
});
