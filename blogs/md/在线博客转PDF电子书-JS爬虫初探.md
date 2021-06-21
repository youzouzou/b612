最近在看一位大佬写的源码解析博客，平时上下班用手机看不太得劲，但是平板又没有网卡，所以就想搞个离线pdf版，方便通勤时间学习阅读。

所以，问题来了: *怎么把在线网页内容转成pdf？*

这位大佬的博客是用gitbook写的，我先上网搜了下工具，发现大多是将自己本地gitbook转pdf，只有一个开源工具是用python爬取的在线gitbook，但是一看issues，中文乱码、空白页、看不到图等等问题都没解决，遂放弃……

经过我不懈的搜索，终于找到了一个可以直接把网页保存成pdf工具：**phantomjs**。 

phantomjs是一个无界面的，可脚本编程的 WebKit 浏览器引擎，也就是俗称的“无头浏览器”，常用于爬取网页信息。

下载地址：https://phantomjs.org/download.html

我用的是win系统，下载后在bin目录下找到.exe文件，然后新建如下js脚本：

```js
// html2pdf.js
var page = require('webpage').create();
var system = require('system');

if (system.args.length === 1) {
    console.log('Usage: loadspeed.js <some URL>');
    //这行代码很重要。凡是结束必须调用。否则phantomjs不会停止
    phantom.exit();
}
page.settings.loadImages = true;  //加载图片
page.settings.resourceTimeout = 30000;//超过10秒放弃加载
//截图设置，
//page.viewportSize = {
//  width: 1000,
//  height: 3000
//};
var address = system.args[1];
var name = system.args[2];
page.open(address, function (status) {

    function checkReadyState() {//等待加载完成将页面生成pdf
        setTimeout(function () {
            var readyState = page.evaluate(function () {
                return document.readyState;
            });

            if ("complete" === readyState) {

                page.paperSize = { width: '297mm', height: '500mm', orientation: 'portrait', border: '1cm' };
                var timestamp = Date.parse(new Date());
                var pdfname = name;
                var outpathstr = "C:/Users/Desktop/pdfs/" + pdfname + ".pdf"; // 输出路径
                page.render(outpathstr);
                console.log("生成成功");
                console.log("$" + outpathstr + "$");
                phantom.exit();
            } else {
                checkReadyState();
            }
        }, 1000);
    }
    checkReadyState();
});
```

控制台cd进入bin目录，命令行执行：
`phantomjs html2pdf.js http://xxx.xx.xxx(博客所在地址)`
即可将该网页转成一个pdf。

这时候问题又来了:
1. phantomjs不能自动截取下一页；
2. 每一个网页都只能生成一个pdf，最后还要找工具把所有pdf合并成一个；
3. 保存的实际上是网页的截图，对于侧边栏、顶部栏、底部等我不需要的内容也会保存到页面中，不能很好地适配。

思考和观察得出解决办法：
- 这个博客的网址除了域名统一外并没有其他规律，只能手动维护一个url列表，然后通过脚本遍历来解决第 1 个问题；
- pdf合并工具网上有现成的，第 2 个问题也能解决；
- phantomjs是可以对dom进行操作的，但是有个问题，页面里如果有异步请求的资源，比如图片，就需要延迟截图时间，否则会出现很多空白区域，具体解决办法可以参见这篇博客：[使用phantomjs操作DOM并对页面进行截图需要注意的几个问题](https://www.cnblogs.com/xiehuiqi220/p/3551699.html)。

问题虽然是能解决，但是过于麻烦，而且这个dom操作并不能在截图的时候去掉多余内容。

经过上面一系列骚操作，我受到了启发，从而有了一个全新的思路：

**通过dom操作，把整个博客的内容都爬到一个html文件中，再把这个html文件转成pdf。**

话不多说，直接开撸。

为了避开浏览器同源网络策略，我基于之前搭建的node+express本地服务，并引入插件cheerio(用于dom操作)、html-pdf(用于将网页转成pdf)来实现。

首先，观察需要爬取的dom元素的特点：
我需要爬取的内容如图所示
![](https://files.mdnice.com/user/14530/3b80486b-7457-4690-b51c-c57c0a3c7078.png)
这部分的内容可以通过.theme-default-content样式获取到：

```js
https.get(url, function (res) {
    var str = "";
    //绑定方法，获取网页数据
    res.on("data", function (chunk) {
      str += chunk;
    })
    //数据获取完毕
    res.on("end", function () {
      //沿用JQuery风格，定义$
      var $ = cheerio.load(str);
      //获取的数据数组
      var arr = $(".theme-default-content");
      var main = "";
      if (arr && arr.length > 0) {
          main = arr[0]
      }
    })
```
通过这段代码得到的main就是我们要获取的主体dom。

其次，观察图片资源的url：
![](https://files.mdnice.com/user/14530/36783b29-6806-447b-bc60-4b03676165e1.png)
这里用的是相对路径，所以需要对图片路径进行处理：

```js
// 将上面得到的main转为字符串便于处理
main = $.html(main)
// 对图片路径进行补全
main = main.replace(/src=\"\/img/g, "src=\"" + prefixUrl + "/img")
```

观察下一页的url地址，都是在一个样式名为`next`的`span`标签内：
![](https://files.mdnice.com/user/14530/c5102690-6dd6-475c-b3d1-8272ebf1f001.png)
获取下一页内容的代码如下：
```js
var $ = cheerio.load(str);
var arr = $(".next");
var nextData = "";
if (arr && arr.length > 0) {
    nextData = arr[0]
    if (nextData && nextData.children && nextData.children[0] && nextData.children[0].attribs) {
    // 下一页地址：prefixUrl + nextData.children[0].attribs.href
  } else {
    // 没有下一页
  }
}
```
最后还需要把html转成pdf：
```
function htmlTopdf() {
  var html = fs.readFileSync(path.resolve(__dirname, htmlFileName), 'utf8');
  var options = { format: 'A4' };
  pdf.create(html, options).toFile(path.resolve(__dirname, pdfFileName), function (err, res) {
    if (err) return console.log("error message", err);
    console.log(res);
  });
}

```

总结一下**实现思路**：
1. 通过dom操作抓取到主体内容，并对其中的图片等资源进行处理，然后保存到html文件中；
2. 找到下一页的url，将下一页的主体内容继续拼到html文件后；
3. 最后将html转成pdf保存。

上面的代码不是通用的，但是如果要抓取其他网页的话，思路基本都是这三步。

Demo已开源：[https://github.com/youzouzou/node-crawler/blob/main/routes/index.js](https://github.com/youzouzou/node-crawler/blob/main/routes/index.js)

`npm install`后打开`http://localhost:3009/` 即可生成pdf。