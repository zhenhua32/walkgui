const fs = require('fs');
const path = require('path');

let helper = {};

helper.testdir = function (dir, defaultdir) {
    // 简陋的检测
    if (typeof defaultdir !== 'string') return;
    // 要明白__dirname是当前执行的脚本的位置
    // 而不是调用这个脚本的脚本的位置
    function step(resolve, reject) {
        if (!dir || !path.isAbsolute(dir)) dir = defaultdir;
        
        fs.stat(dir, function (err, stats) {
            if (err) dir = defaultdir;
            if (!stats.isDirectory()) {
                dir = path.join(__dirname, defaultdir);
            }
            resolve(dir);
        });  
    }
    return new Promise(step);

}


module.exports = helper;
