const walk = require('./walk.js');
const fs = require('fs');

let link1 = 'http://bbs.zol.com.cn/dcbbs/d16_p1.html';
let link2 = 'http://bbs.zol.com.cn/dcbbs/d16_p2.html';

let link3 = 'https://www.douban.com/group/527906/discussion?start=0';
let link4 = 'https://www.douban.com/group/527906/discussion?start=50'

let link5 = 'http://itbbs.pconline.com.cn/dc/f2312647_1.html'
let link6 = 'http://itbbs.pconline.com.cn/dc/f2312647_2.html'

// // 需要转义, 太蛋疼了, 还是字面量给力
// let reg = new RegExp('\/dcbbs\/d16_(\\d){6}.html', 'ig');
// let dir = 'D:/nodejs/walkgui/out/shouye';

// // 后面那个正则有毒, 不能加上g, 全局匹配有问题
// let link = walk.parse(dir, reg, /(\d){13}.html/i, 'http://bbs.zol.com.cn');

let reg = /http:\/\/(\w)+\.bbs(\w)*\.fd\.zol\-img.com.cn\/\S+(?="|')/ig;
let dir = 'D:/nodejs/walkgui/out/juti';

let link = walk.parse(dir, reg , /(\d){13}\.html/i)

console.log(link.length);

