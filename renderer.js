// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const request = require('request');
const iconv = require('iconv-lite');
const fs = require('fs');
const path = require('path');
const walk = require('./core/walk.js');
const helper = require('./core/helper.js');

document.getElementById('clear')
    .addEventListener('click', function (evnet) {
        document.getElementById('list').innerHTML = '';
    });

document.getElementById('download')
    .addEventListener('submit', function (evnet) {
        evnet.preventDefault();
        let link = event.target.url.value;
        let dir = event.target.savedir.value;
        let isgbk = event.target.isgbk.checked;
        // 相对地址的基准不好确定
        helper.testdir(dir, path.join(__dirname, './out'))
            .then(function (result) {
                dir = result;
                let filepath = path.join(dir, Date.now() + '.html');
                walk.gethtml(link, filepath, isgbk)
                    .then(function (result) {
                        // 更新视图
                        // 其实挺不好的, 要不用个框架吧
                        let childli = document.createElement('li');
                        childli.textContent = filepath;
                        document.getElementById('list').appendChild(childli);
                        new Notification('下载单个网页', {
                            body: link + '已下载完成'
                        });
                    });
            });
    });

document.getElementById('download-homepage')
    .addEventListener('submit', function (evnet) {
        event.preventDefault();
        let link1 = event.target.homelink1.value;
        let dir = evnet.target.savedir1.value;
        let link2 = event.target.homelink2.value;
        let number = evnet.target.linknumber.value;
        let isgbk = event.target.isgbk1.checked;

        helper.testdir(dir, path.join(__dirname, './out/shouye'))
            .then(function (result) {
                dir = result;

                let links = walk.getlinks(link1, link2, number);
                let i = 0;
                function recursion() {
                    let filepath = path.join(dir, Date.now() + '.html');
                    if (i < links.length) {
                        setTimeout(function () {
                            walk.gethtml(links[i], filepath, isgbk)
                                .then(function (result) {
                                    // 更新视图
                                    // 其实挺不好的, 要不用个框架吧
                                    let childli = document.createElement('li');
                                    childli.textContent = filepath;
                                    document.getElementById('list').appendChild(childli);

                                });
                            i++;
                            recursion();
                        }, 2000);
                    } else {
                        new Notification('下载首页', {
                            body: '首页已下载完成'
                        });
                    }
                }
                recursion();
            })
    });

document.getElementById('download-specificpage')
    .addEventListener('submit', function (event) {
        event.preventDefault();
        let getdir = event.target.getdir1.value;
        let savedir = event.target.savedir2.value;
        let reg = new RegExp(event.target.reg1.value, 'ig');
        let part = event.target.part1.value.trim();
        let isgbk = event.target.isgbk2.checked;

        let links = null;

        helper.testdir(getdir, path.join(__dirname, './out/shouye'))
            .then(function (result) {
                getdir = result;
                links = walk.parse(getdir, reg, /(\d){13}.html/i, part);
                console.log(links)
                return helper.testdir(savedir, path.join(__dirname, './out/juti'));
            })
            .then(function (result) {
                savedir = result;

                let i = 0;
                function recursion() {
                    let filepath = path.join(savedir, Date.now() + '.html');
                    if (i < links.length) {
                        setTimeout(function () {
                            walk.gethtml(links[i], filepath, isgbk)
                                .then(function (result) {
                                    // 更新视图
                                    // 其实挺不好的, 要不用个框架吧
                                    let childli = document.createElement('li');
                                    childli.textContent = filepath;
                                    document.getElementById('list').appendChild(childli);
                                });
                            i++;
                            recursion();
                        }, 2000);
                    } else {
                        new Notification('下载具体页面', {
                            body: '具体页面已下载完成'
                        });
                    }
                }
                recursion();
            });

    });

document.getElementById('download-img')
    .addEventListener('submit', function (event) {
        event.preventDefault();
        let getdir = event.target.getdir2.value;
        let savedir = event.target.savedir3.value;
        let reg = new RegExp(event.target.reg2.value, 'ig');
        let part = event.target.part2.value.trim();

        let links = null;

        helper.testdir(getdir, path.join(__dirname, './out/juti'))
            .then(function (result) {
                getdir = result;
                links = walk.parse(getdir, reg, /(\d){13}.html/i, part);
                //
                console.log(links.length);
                return helper.testdir(savedir, path.join(__dirname, './out/img'));
            })
            .then(function (result) {
                savedir = result;

                let i = 0;
                function recursion() {
                    let filepath = path.join(savedir, Date.now().toString());
                    if (i < links.length) {
                        setTimeout(function () {
                            // 识别图片类型
                            filepath += links[i].substring(links[i].lastIndexOf('.'));

                            walk.gethtml(links[i], filepath, false)
                                .then(function (result) {
                                    // 更新视图
                                    // 其实挺不好的, 要不用个框架吧
                                    let childli = document.createElement('li');
                                    childli.textContent = filepath;
                                    document.getElementById('list').appendChild(childli);
                                });
                            i++;
                            recursion();
                        }, 2000);
                    } else {
                        new Notification('下载图片', {
                            body: '图片已下载完成'
                        });
                    }
                }
                recursion();
            });
    });

