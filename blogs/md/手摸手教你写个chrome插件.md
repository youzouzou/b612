## 目录
1. 需求分析
2. 官网Demo入门
3. Manifest配置文件
4. 实现思路
5. 核心代码
6. 实现效果

---

不知道大家有没有过类似的经历，查阅资料时经常会打开一堆临时tab标签，不至于到要加入收藏夹的地步，但是直接关了再找又麻烦，而且挤挤挨挨的一堆找起来也很费眼睛......

![密密麻麻的tab标签页](https://img-blog.csdnimg.cn/img_convert/d5e88739d84f0818ed86657e4f18777b.png)

有没有什么工具能保存下我打开的tab，并且能方便地查看？

受到印象笔记剪藏插件的启发，我找到了个插件**OneTab**，可以一键关闭所有标签页并保存到一个页面中：

![OneTab](https://img-blog.csdnimg.cn/img_convert/9ea68dbb986d8fce57ca10c3dafc0111.png)

出于好奇，我去了解了下：如何写一个chrome插件？

再次打开一堆tab.......

> 写一个chrome插件需要的技术基础：**html、js、css**。

？？？就这？这不就是我前端切图仔的三板斧吗？！

话不多说，直接开撸！

### 需求分析

首先分析我的需求：
1. 保存打开的网页地址；
2. 看完后可以便捷地删除；
3. 最好能一键全部保存；
4. 再来个一键删除；
5. 再来个一键全开；

......

打住打住，先完成核心需求再说= =。

### 官网Demo入门
依据官网上的指示，插件应包含以下文件：

* 一个manifest文件（配置文件）
* 一个或多个HTML文件（除非这个应用是一个皮肤）
* 可选的一个或多个JavaScript文件
* 可选的任何需要的其他文件，例如图片

除了manifest不知道是啥，其他都是熟悉的配方。谷歌官方还很贴心地给出了入门demo：[https://storage.googleapis.com/chrome-gcs-uploader.appspot.com/file/WlD8wC6g8khYWPJUsQceQkhXSlv1/SVxMBoc5P3f6YV3O7Xbu.zip](https://storage.googleapis.com/chrome-gcs-uploader.appspot.com/file/WlD8wC6g8khYWPJUsQceQkhXSlv1/SVxMBoc5P3f6YV3O7Xbu.zip)

下载下来后可以看到有这么几个文件：

![getting-started目录](https://img-blog.csdnimg.cn/img_convert/0e679f2f584018bd70515d78e9c0afe6.png)

打开chrome，右上角扩展操作>更多工具>扩展程序，点击加载已解压的扩展程序，选中上面的文件夹，就可以看到加载进来的demo插件。

![加载插件](https://img-blog.csdnimg.cn/img_convert/6e97301563b181efed749dd44203d523.png)

![已加载进来的demo插件](https://img-blog.csdnimg.cn/img_convert/0639ff70a4dc66d1ddb169dc5062336d.png)

### Manifest配置文件
我们先来看看demo里的manifest.json配置：

```json
{
  "name": "Getting Started Example",
  "description": "Build an Extension!",
  "version": "1.0",
  "manifest_version": 3,
  "background": {
    "service_worker": "background.js"
  },
  "permissions": ["storage", "activeTab", "scripting"],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "/images/get_started16.png",
      "32": "/images/get_started32.png",
      "48": "/images/get_started48.png",
      "128": "/images/get_started128.png"
    }
  },
  "icons": {
    "16": "/images/get_started16.png",
    "32": "/images/get_started32.png",
    "48": "/images/get_started48.png",
    "128": "/images/get_started128.png"
  },
  "options_page": "options.html"
}
```
#### 配置说明
| 参数|说明|
| --- | --- |
|name |插件名称|
|description|插件描述|
|version|插件版本号|
|manifest_version|清单文件的版本（目前是3，按照官方的来就可以）|
|background|后台默认程序，版本3使用service_worker替代了之前的scripts，主要作用是管理缓存、预加载资源和启用离线网页。|
|permissions|需要的权限|
|action|toolbar扩展菜单配置|
|icons|插件图标（可以适配不同的尺寸）|
|options_page|扩展程序选项（一般是让用户自定义选择插件的某些参数值）|

其中，
- 本次需要的permissions有：
  - tabs：访问tab页；
  - storage：存取缓存；
  - unlimitedStorage：无限缓存。
更多权限配置说明见官网：[https://developer.chrome.com/docs/extensions/mv2/declare_permissions/#manifest](https://developer.chrome.com/docs/extensions/mv2/declare_permissions/#manifest)
- `action`这里我用的是清单版本2中的`browser_action`，版本3中的action无法弹出popup选项卡，估计是我用的姿势不太对......（有知道的童鞋可以留言告诉我怎么用~）

修改后的配置文件：

```json
{
    "manifest_version": 3,
    "name": "阅读TODO清单",
    "version": "1.0.0",
    "description": "一键保存tab，轻松管理临时标签页",
    "icons":
    {
        "16": "images/icon.png",
        "48": "images/icon.png",
        "128": "images/icon.png"
    },
    "browser_action":
    {
        "default_icon": "images/icon.png",
        "default_title": "阅读清单-by 游走走",
        "default_popup": "popup.html"
    },
    "permissions":
    [
        "tabs",
        "storage",
        "unlimitedStorage"
    ],
    "options_page": "options.html",
    "homepage_url": "https://github.com/youzouzou/my-chrome-plugin-read-todo"
}
```
- homepage_url：扩展程序网站，这里指向了我的github开源地址:)

### 实现思路

TODO清单这种小玩意儿就不多说了，简单来讲就是维护一个数组，并通过本地缓存get/set来实现增删改查。

### 核心代码

![popup插件选项卡](https://img-blog.csdnimg.cn/img_convert/90c44a9b024091f3e0a7b8eb99a415f6.png)

讲完了配置，接下来就是我们熟悉的html/js/css三板斧了。

在`popup.html`里我定义了三个按钮：**加入阅读清单**、**查看清单**、**加入所有打开tab**。

```html
<div id="addBtn">加入阅读清单</div>
<div id="viewBtn">查看清单</div>
<div id="addAll">加入所有打开tab</div>
```
监听按钮点击事件：
```js
const addBtn = document.getElementById("addBtn")
addBtn.addEventListener("click", async () => { });
```
#### 加入阅读清单
加入阅读清单是将当前tab的url和title保存到缓存数组中，这里就涉及到3个chrome的API。
1. 获取当前tab的url和title
```js
chrome.tabs.getSelected(null, function (tab) {
  console.log(tab.url, tab.title)
});
```
2. 获取当前缓存的tab数组
```js
chrome.storage.sync.get("tabs", ({ tabs }) => { });
```
3. 更新缓存中的tab数组
```js
chrome.storage.sync.set({ "tabs": newTabList });
```
#### 查看清单
```js
viewBtn.addEventListener("click", async () => {
  window.open(chrome.extension.getURL('list.html'));
});
```
这里会打开一个新的tab页，指向的是`list.html`文件。我在这个页面展示了缓存的tab数组，并提供了单个url打开/删除、一键全部打开/删除的功能。
#### 加入所有打开tab
这里和加入单个tab差不多，只不过需要多调一个API来获取所有窗口的所有tab：
```js
chrome.windows.getAll({ populate: true }, function (windows) {
      windows.forEach(function (window) {
        window.tabs.forEach(function (tab) {
          // 遍历到所有tab
        });
      });
});
```

核心代码基本就是这几个API，具体实现可以参照demo：[https://github.com/youzouzou/my-chrome-plugin-read-todo](https://github.com/youzouzou/my-chrome-plugin-read-todo)

感兴趣的同学可以下载demo，加载已解压的扩展程序，就可以看到具体的实现效果。打包成.crx文件也很简单，打开扩展程序，点击**打包扩展程序**：

![打包扩展程序](https://img-blog.csdnimg.cn/img_convert/c64bf606dc21168740626169e4f04035.png)

还可以注册开发者账号，将开发好的插件上传到chrome网上应用商店供其他用户购买和下载(发家致富的路子又多了一个有木有~)。


### 实现效果

![chrome插件展示](https://img-blog.csdnimg.cn/img_convert/b2bcb5194292809e4750e689e3b77ec8.png)

![左键点击toolbar中的插件](https://img-blog.csdnimg.cn/img_convert/da4198c107a214fa7a26c7b91fc56f29.png)

![右键点击toolbar中的插件](https://img-blog.csdnimg.cn/img_convert/497e3194b9c4df7a19d02af4c5413490.png)

注：这里的`阅读TODO清单`指向的就是`homepage_url`；`选项`指向的就是`options_page`。


![查看清单](https://img-blog.csdnimg.cn/img_convert/6d3689b87ced8034fbc9d1eb9f414083.png)

### 总结
功能比起OneTab是要简陋得多，不过通过这次尝试，打开了我新世界的大门，以后解决问题的思路又多了一种√。


