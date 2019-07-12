var http = require("http");
var iconv = require('iconv-lite');

var option = {
    hostname: "http://test.mvcb.qilie.biz",
    path: "/#/goodsDetailAgent/url?address=detail.1688.com&itemId=530159354589"
};

var req = http.request(option, function (res) {
    res.on("data", function (chunk) {
        console.log(iconv.decode(chunk, "gbk"));
    });
}).on("error", function (e) {
    console.log(e.message);
});

req.end();
