const request = require('request');

request('http://www.baidu.com', function (err, res, body) {
    if (!err && res.statusCode == 200) {
        console.log(body);
    }
});
