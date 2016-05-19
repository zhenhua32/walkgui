const fs = require('fs');
const path = require('path');

let helper = {};

helper.testdir = function (dir, defaultdir) {
    // 简陋的检测
    if (typeof defaultdir !== 'string') return;
    // 要明白__dirname是当前执行的脚本的位置
    // 而不是调用这个脚本的脚本的位置
    function step(resolve, reject) {
        // 如果dir不存在
        if (!dir) dir = defaultdir;

        fs.stat(dir, function (err, stats) {
            // 如果发生错误, 常见的是路径不存在
            if (err) dir = defaultdir;
            // 如果状态不存在
            if (!stats) dir = defaultdir;
            // 如果dir不是目录
            if (!stats.isDirectory()) dir = defaultdir;
            // 如果不是绝对路径
            if (!path.isAbsolute(dir)) {
                dir = path.join(__dirname,defaultdir);
            } 
            resolve(dir);
        });
    }
    return new Promise(step);

}


module.exports = helper;
