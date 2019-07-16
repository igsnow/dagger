// 控制扩展程序的js，比如点击插件开始按钮
let bg = chrome.extension.getBackgroundPage();
$(function () {
    $("#btn").click(function () {
        bg.sendMessageToContentScript({cmd: 'batch', value: '我要开始批量点击了！'}, res => {
            console.log('来自content的回复：' + res);
        });
    });
});
