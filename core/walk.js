const request = require('request');
const iconv = require('iconv-lite');
const fs = require('fs');
const path = require('path');

let walk = {};

let options = {
    url: null,
    headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36'
    }
}

walk.gethtml = function (url, filepath, isgbk) {

    let stream = fs.createWriteStream(filepath);
    options.url = url;
    // 好像不用转换, 直接用就可以了
    function step(resolve, reject) {
        if (isgbk) {
            request
                .get(options)
                .on('error', function (err) {
                    new Notification('下载网页的时候出现问题', {
                        body: 'err.toString()'
                    });
                })
                .pipe(iconv.decodeStream('gbk'))
                .pipe(iconv.encodeStream('utf8'))
                .pipe(stream);
        } else {
            request
                .get(options)
                .on('error', function (err) {
                    new Notification('下载网页的时候出现问题', {
                        body: 'err.toString()'
                    });
                })
                .pipe(stream);
            console.log(222)
        }

        stream.on('finish', () => {
            resolve('good');
        });
    }

    return new Promise(step);
}

// 从两个链接中推导出链接增长模式
// 方法一, 逐字比较, 不完整
walk.getlinks1 = function (link1, link2, number) {
    let array1 = link1.split('');
    let array2 = link2.split('');
    let same1 = [];
    let same2 = [];
    let different1 = null;
    let different2 = null;

    let min = array1.length < array2.length ? array1.length : array2.length;
    let max = array1.length > array2.length ? array1.length : array2.length;

    let stop = 0;

    for (let i = 0; i < min; i++) {
        if (array1[i] === array2[i]) {
            same1.push(array1[i]);
            stop++;
        } else break;
    }

    let backwards = 0;

    for (let i = 1; i < min; i++) {
        if (array1[array1.length - i] === array2[array2.length - i]) {
            if (isNaN(array1[array1.length - i]) && isNaN(array2[array2.length - i])) {
                same2.push(array1.length - i);
                backwards++;
            }
        } else break;
    }

    different1 = link1.substring(stop, array1.length - backwards);
    different2 = link2.substring(stop, array2.length - backwards);
}
// 方法二, 正则匹配数字
walk.getlinks = function (link1, link2, number) {
    let array1 = link1.match(/(\d)+/ig);
    let array2 = link2.match(/(\d)+/ig);

    let stop = null;

    for (let i = 0; i < array1.length; i++) {
        if (array1[i] !== array2[i]) {
            stop = i;
            break;
        }
    }
    let length1 = array1[stop].length;
    let length2 = array2[stop].length;
    // 其实还是有很大风险的, 不过从后面找风险更小一些
    let index1 = link1.lastIndexOf(array1[stop]);
    let index2 = link2.lastIndexOf(array2[stop]);

    // substring 不包括 index1的位置
    let part1 = link1.substring(0, index1);
    let part2 = link1.substring(index1 + length1);

    let step = array2[stop] - array1[stop];
    step = step < 0 ? -step : step;
    let min = array1[stop] < array2[stop] ? array1[stop] : array2[stop];
    min = Number(min);

    let links = [];
    for (let i = 0; i < number; i++) {
        links.push(part1 + (min + step * i) + part2)
    }

    return links;
}
// 方法三, 交给人脑, 修改视图, 加上part1, part2, 变量, 步长四个参数手动填写

walk.parse = function (dir, linkreg, filereg, part) {
    if (!linkreg instanceof RegExp || !filereg instanceof RegExp) {
        return Promise.reject('不是正则');
    }

    let all = fs.readdirSync(dir);
    let files = [];
    // 测试文件名是否符合模式
    for (let f of all) {
        if (filereg.test(f)) {
            files.push(f);
        }
    }

    let links = [];
    // 这样可能会有内存泄漏, 在links数目巨大时
    for (let f of files) {
        let data = fs.readFileSync(path.join(dir, f), {
            encoding: 'utf8'
        });
        let templink = data.match(linkreg);
        if (templink) {
            if (part) {
                for (t of templink) {
                    links.push(part + t);
                }
            } else {
                links = links.concat(templink);
            }
        }
    }
    // 数组去重
    links = Array.from(new Set(links));

    return links;

}

module.exports = walk;
