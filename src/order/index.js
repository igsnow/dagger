const request = require('request');

request({
    url: 'https://www.baidu.com',
    method: 'GET',
    headers: {
        'Accept-Language': 'zh-CN,zh;q=0.8',         // 指定 Accept-Language
        'Cookie': '__utma=4454.11221.455353.21.143;' // 指定 Cookie
    }
}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body) // 输出网页内容
    }
});


