// 共用页面的DOM，但是和页面的js是隔离的
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.cmd == 'batch') {
        alert(request.value);
        $('.fxkbtn').each(function (index, element) {
            if ($(this).css("display") != "none") {
                $(this).click()
            }
        });
        sendResponse('批量点击消息已收到！');
    }

    if (request.cmd == 'sku') {
        console.log(request.value);
        sendResponse('sku消息已收到！');
    }
});


if (location.host == 'detail.1688.com') {

    let firstSku = '咖啡';
    let secondSku = '大本';
    let num = 3;

    window.onload = function () {
        // 如果有SKU更多展开按钮，则点击
        let hasMore = $(".obj-expand");
        if (hasMore && hasMore[0]) {
            let isShow = hasMore[0].style.display;
            if (!!isShow) {
                hasMore[0].click();
                console.log('=>展开更多sku列表...')
            }
        }

        // 判断页面是否有如颜色等切换的SKU属性 即含有class为obj-leading的标签
        let hasObjLead = $('.obj-leading');
        if (hasObjLead.length) {
            let aList = $('.list-leading a');
            let arr = [];
            let first_index;
            for (let i = 0; i < aList.length; i++) {
                arr.push(aList[i].title);
                if (aList[i].title == firstSku) {
                    first_index = i
                }
            }
            console.log({arr, first_index});
            // 拿到头部sku下标，开始点击
            if (!!first_index) {
                if ($('.list-leading a') && $('.list-leading a')[first_index]) {
                    $('.list-leading a')[first_index].click();
                    console.log('=>头部sku已选!')
                }
            }
        }

        // 是否有数量选择sku
        let hasObjSku = $('.obj-sku');
        if (hasObjSku.length) {
            let nList = $('.table-sku .name');
            let arr = [];
            let second_index;
            for (let i = 0; i < nList.length; i++) {
                // 如果sku有图片，则sku取span标签的title值
                if (nList[i].children[0].title) {
                    arr.push(nList[i].children[0].title);
                    if (nList[i].children[0].title == secondSku) {
                        second_index = i
                    }
                } else {
                    arr.push(nList[i].children[0].innerHTML);
                    if (nList[i].children[0].innerHTML == secondSku) {
                        second_index = i
                    }
                }
            }
            console.log({arr, second_index});

            if (!!second_index) {
                second_index += 1
                // (坑)自动填写商品数量，但是下方价格不改变，于是先自增一再减一，价格正确显示
                let ipt = $('.table-sku tr:nth-child(' + second_index + ') .amount-input');
                let up = $('.table-sku tr:nth-child(' + second_index + ') .amount-up');
                let down = $('.table-sku tr:nth-child(' + second_index + ') .amount-down');
                if (ipt && ipt[0]) {
                    ipt[0].value = num;
                }
                if (up && up[0]) {
                    up[0].click()
                }
                if (down && down[0]) {
                    down[0].click()
                }
                console.log('=>数量已自动填充完成!');
            }
        }

        // 点击加入购物车按钮
        let cart = $('.do-cart')
        if (cart && cart[0]) {
            cart[0].click();
            console.log('=>加入购物车!')
        }
    };
} else {
    console.log('不是1688页面!')
}





