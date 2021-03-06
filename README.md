# walkgui

## 简介
这是一个爬虫, 用来下载图片. 具体分为三步
* 下载首页
 * 首页是包含列表的页面, 通常来说具有很多导航列表
* 下载具体页面
 * 具体页面是包含图片的页面, 由首页跳转而来
* 下载图片
 * 图片就是要获取的资源
 
需要正则表达式, 技能自备.

因为获取链接是依赖正则表达式, 所以正则的好坏
很大程度上影响图片的获得.

## 依赖
需要nodejs>=4.x和npm

## 安装
使用 `npm install` 安装必要依赖

## 启动
使用 `npm start` 运行

## 构建
使用 `npm run build` 构建

可以修改 build.js 文件来修改生成的程序文件夹,
具体请参考 electron-packager,
默认只生成 win32 下的程序.
直接用 npm start 也是可以了, 虽然要从命令行里启动.

## 举例
用个实际例子说明更容易明白些.
比如要下载太平洋摄影论坛上的图片, 为了简单起见, 不设置保存目录,
* 第一步, 输入两个首页地址
 * `http://itbbs.pconline.com.cn/dc/f2312647_1.html`
 * `http://itbbs.pconline.com.cn/dc/f2312647_2.html`
* 第二步, 输入正则表达式提取具体页面
 * `http:\/\/itbbs.pconline.com.cn\/dc/(\d)+\.html`
* 第三步, 输入正则表达式提取图片
 * `http:\/\/img.pconline.com.cn\/images\/upload\/upc\/tx\/photoblog\/1605\S+(?="|')`

**Note:**如果你在第一步里设置了一个很大的首页数目,
那么经过第二步后, 第三步里会生成很多的请求. 
比如上面的例子中, 首页数目是默认的5, 第二步就有205个具体页面, 
第三步里就是庞大的1639张图片. 另外, 估算一分钟是30个请求.

**请务必控制首页数目, 或者将第三步分散下载**

