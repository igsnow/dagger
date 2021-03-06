let skuObj = {};             // 从vwork接收的后台sku属性
let firstSku = '';           // 第一个sku属性值，如切换选中的颜色等
let secondSku = '';          // 第二个sku属性值
let num = 0;                 // 采购数量
let itemImg;                 // 商品图片
let itemName;                // 商品名称
let first_index;             // 第一个sku被点击的下标
let second_index;            // 第二个sku填写数量的一行
let hasFirstSku = false;     // 是否有第一个sku标识

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

    if (location.host == 'detail.1688.com') {
        if (request.cmd == 'pre') {
            console.log(request.value);
            if (request.value == null) return;
            $(document).ready(function () {
                preMask()
            })
        }

        if (request.cmd == 'sku') {
            console.log(request.value);
            let res = request.value;
            skuObj = res && res.skuProps && JSON.parse(res.skuProps);
            num = res && res.skuNum;
            itemImg = res && res.img;
            itemName = res && res.name;
            sendResponse('sku消息已收到！');

            // 过滤掉非采购1688页面
            if (request.value == null) return;
            // 如果预加载蒙层没出现(有概率失败)，如果没有则标签加载完成再加上蒙层
            let isMaskExit = document.getElementById('bgMask');
            if (isMaskExit == null) {
                preMask()
            }
            getActionTip(skuObj, num, itemImg, itemName);

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
                hasFirstSku = true;
                // 匹配页面的第一个sku属性名称
                let firstSkuEle = $('.obj-leading .obj-title');
                if (firstSkuEle && firstSkuEle[0]) {
                    let firstSkuName = firstSkuEle[0].innerHTML;
                    let name = getSkuValByName(firstSkuName, skuObj);
                    firstSku = skuObj[name];
                }
                let aList = $('.list-leading a');
                // let arr = [];
                for (let i = 0; i < aList.length; i++) {
                    // arr.push(aList[i].title);
                    if (aList[i].title == firstSku) {
                        first_index = i;
                        break
                    }
                }
                // console.log({arr, first_index});
                // 拿到头部sku下标，开始点击
                if (first_index !== undefined) {
                    if ($('.list-leading a') && $('.list-leading a')[first_index]) {
                        $('.list-leading a')[first_index].click();
                        console.log('=>头部sku已选!')
                    }
                }
            }
            // 是否有数量选择sku
            let hasObjSku = $('.obj-sku');
            if (hasObjSku.length) {
                // 匹配页面的第二个sku属性名称
                let secondSkuEle = $('.obj-sku .obj-title');
                if (secondSkuEle && secondSkuEle[0]) {
                    let secondSkuName = secondSkuEle[0].innerHTML;
                    let name = getSkuValByName(secondSkuName, skuObj);
                    secondSku = skuObj[name];
                }
                let nList = $('.table-sku .name');
                // let arr = [];
                for (let i = 0; i < nList.length; i++) {
                    // 如果sku有图片，则sku取span标签的title值
                    if (nList[i].children[0].title) {
                        // arr.push(nList[i].children[0].title);
                        if (nList[i].children[0].title == secondSku) {
                            second_index = i;
                            break
                        }
                    } else {
                        // arr.push(nList[i].children[0].innerHTML);
                        if (nList[i].children[0].innerHTML == secondSku) {
                            second_index = i;
                            break
                        }
                    }
                }
                // console.log({arr, second_index});
                if (second_index !== undefined) {
                    second_index += 1;
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
            let cart = $('.do-cart');
            // 如果有头部sku,只有头部下标有值才能点击加入购物车
            if (hasFirstSku && first_index !== undefined && second_index !== undefined) {
                cart[0].click();
            } else if (second_index !== undefined) {
                cart[0].click();
            }
            // sleep3秒钟，若出现提示框，则说明加入购物车成功
            setTimeout(() => {
                let successDialog = $('.purchase-dialog');
                if (successDialog.length) {
                    if (successDialog.css("display") != 'none') {
                        console.log('=>加入购物车成功!');
                        let tipDiv = document.getElementById('cartTip');
                        tipDiv.innerHTML = '加入购物车成功!';
                    }
                }
            }, 1500)
        }
    } else {
        console.log('不是1688页面!')
    }
});

// 给sku属性名做兼容，比如页面元素是返回尺码（双），带个单位，但接口返回'尺码'，做个兼容
function getSkuValByName(name, obj) {
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            if (name.indexOf(i) > -1) {
                return i
            }
        }
    }
}

// 预加载蒙层
function preMask() {
    // 设置页面加载蒙层
    let bgDiv = document.createElement("div");
    bgDiv.setAttribute("id", "bgMask");
    bgDiv.style.background = "rgba(0, 0, 0, .5)";
    bgDiv.style.position = "fixed";
    bgDiv.style.top = "0";
    bgDiv.style.left = "0";
    bgDiv.style.right = "0";
    bgDiv.style.bottom = "0";
    bgDiv.style.opacity = "0.8";
    bgDiv.style.zIndex = "2002";
    document.body.appendChild(bgDiv);
    let closeBtn = document.createElement("div");
    closeBtn.setAttribute("id", "cBtn");
    closeBtn.style.border = "2px solid #E6A23C";
    closeBtn.style.borderRadius = '50%';
    closeBtn.style.width = "40px";
    closeBtn.style.height = "40px";
    closeBtn.style.textAlign = 'center';
    closeBtn.style.lineHeight = '40px';
    closeBtn.style.fontSize = '25px';
    closeBtn.style.fontWeight = 'bold';
    closeBtn.style.color = '#E6A23C';
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "20px";
    closeBtn.style.right = "110px";
    closeBtn.style.cursor = 'pointer';
    closeBtn.innerHTML = '×';
    bgDiv.appendChild(closeBtn);
    let cBtn = document.getElementById("cBtn");
    cBtn.onclick = function () {
        let mask = document.getElementById("bgMask");
        mask.style.display = 'none'
    }
}

// 弹出订单详情框
function getActionTip(sku, num, img, name) {
    let propsViewArr = [];
    for (let i in sku) {
        if (sku.hasOwnProperty(i)) {
            propsViewArr.push(sku[i])
        }
    }
    let skuStr = propsViewArr.join('/');
    // 订单详情提示框
    let infoDiv = document.createElement("div");
    infoDiv.style.background = "#E6A23C";
    infoDiv.style.border = "1px solid #E6A23C";
    infoDiv.style.borderRadius = '5px';
    infoDiv.style.width = "450px";
    infoDiv.style.height = "200px";
    infoDiv.style.fontWeight = 'bold';
    infoDiv.style.color = '#000000';
    infoDiv.style.position = "fixed";
    infoDiv.style.top = "150px";
    infoDiv.style.right = "120px";
    infoDiv.style.opacity = "0.8";
    infoDiv.style.zIndex = "2003";
    document.body.appendChild(infoDiv);
    // 采购单sku详情
    let skuDiv = document.createElement("div");
    skuDiv.style.display = 'flex';
    skuDiv.style.margin = '8px';
    infoDiv.appendChild(skuDiv);
    let imgE = document.createElement("img");
    imgE.style.display = 'inline-block';
    imgE.style.width = '70px';
    imgE.style.height = '70px';
    imgE.src = img;
    skuDiv.appendChild(imgE);
    let rightDiv = document.createElement("div");
    rightDiv.style.marginLeft = '10px';
    rightDiv.style.flex = '1';
    rightDiv.style.width = 'calc(100% - 80px)';
    rightDiv.style.fontSize = '15px';
    skuDiv.appendChild(rightDiv);
    let nameP = document.createElement("p");
    nameP.style.whiteSpace = 'nowrap';
    nameP.style.overflow = 'hidden';
    nameP.style.textOverflow = 'ellipsis';
    nameP.style.lineHeight = '40px';
    nameP.title = name;
    nameP.innerHTML = name;
    rightDiv.appendChild(nameP);
    let skuP = document.createElement("p");
    skuP.innerHTML = skuStr + '     ×' + num;
    rightDiv.appendChild(skuP);
    let tipDiv = document.createElement("div");
    tipDiv.setAttribute("id", "cartTip");
    tipDiv.style.textAlign = 'center';
    tipDiv.style.marginTop = '20px';
    tipDiv.style.fontSize = '22px';
    infoDiv.appendChild(tipDiv);
    // 如果开始采购，则弹框信息显示加载中，否则显示加入购物车成功
    tipDiv.innerHTML = '采购中......';
}






