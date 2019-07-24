// 控制扩展程序的js，比如点击插件开始按钮
let bg = chrome.extension.getBackgroundPage();
$(function () {
    $("#btn").click(function () {
        // 在非1688页面点击插件按钮不会导致插件报错
        if (bg) {
            bg.sendMessageToContentScript({cmd: 'batch', value: '开始1688批量采购！'}, res => {
                console.log('来自vwork content的回复：' + res);
            });
        }
    });
    $("#tBtn").click(function () {
        // 在非1688页面点击插件按钮不会导致插件报错
        if (bg) {
            bg.sendMessageToContentScript({cmd: 'tBatch', value: '开始淘宝批量采购！'}, res => {
                console.log('来自vwork content的回复：' + res);
            });
        }
    });
});
