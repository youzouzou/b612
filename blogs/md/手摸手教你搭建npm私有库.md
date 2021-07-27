最近终于有时间可以做一些业务需求之外的东西了，就把组件库需求提上了日程。

对于一些不适合开源的组件，我想到了**搭建私有npm仓库**。

于是我跑去咨询了一下有经验的大佬，大佬微微一笑，说：**verdaccio**。

![我的内心](https://img-blog.csdnimg.cn/img_convert/f285ea4a4125e7d2931e9f13e32d77de.png)

这是个啥？

果断打开github搜索关键词，果然不出我所料，这是一个坐拥11.8kstar的开源库（https://github.com/verdaccio/verdaccio）。

![是不是像极了英语不好的你 :)](https://img-blog.csdnimg.cn/img_convert/08bea327d1e6e4955a836ffc99695f65.png)

总而言之，这是一个搭建npm仓库的工具。

出于好奇，我去维基百科了一下这个单词：

> verdaccio是意大利语，意为黑色、白色和黄色颜料的混合物，其颜色为淡灰色或淡黄色，柔和的绿褐色。

这个词起源壁画，是壁画中的一种「底色」，在底色之上可以更好地去渲染其他颜色。作者之所以起这个名字，其实是因为verdaccio的前身是**sinopia**（也是一个开源的npm仓库搭建工具），而sinopia意思是壁画底色中的红土色或铁锈色。

不采用sinopia的原因也很简单，这个项目比较古老，最近一次更新已经是6年前了。。。
![](https://img-blog.csdnimg.cn/img_convert/8623428b03ab4137d5a55b1e4aa02fa8.png)


话不多说，直接开撸。

### 安装运行

verdaccio有两种安装方法，一种是直接安装，一种是用docker镜像。

#### 1.1 直接安装

```
npm install --global verdaccio@6-next --registry https://registry.verdaccio.org/
```
安装完成后，就可以在`/node/bin`目录下看到一个名为`verdacio`的文件，这个文件实际指向的是`verdaccio`包下的`build/lib/cli.js`。
```js
// cli.js
#!/usr/bin/env node
"use strict";
if (process.getuid && process.getuid() === 0) {
  process.emitWarning(`Verdaccio doesn't need superuser privileges. don't run it under root`);
} // eslint-disable-next-line import/order
const logger = require('./logger');
logger.setup(null, {
  logStart: false
}); // default setup
require('./cli/cli');
process.on('uncaughtException', function (err) {
  logger.logger.fatal({
    err: err
  }, 'uncaught exception, please report this\n@{err.stack}');
  process.exit(255);
});
```
- `#!/usr/bin/env node`(看到这句的我就知道事情并不简单) 这句是告诉系统得用node来执行这个脚本文件；
- ` process.getuid()`会返回运行进程的用户id，当为0时会提示不要运行在root用户下（root用户id=0）；
- `logger`是verdaccio项目下的一个日志模块，当进程捕捉到异常时，就会去更新日志并结束当前进程；
- `require('./cli/cli')`会去加载cli文件，这个文件里会进行一些初始化操作，比如读取.yaml或.yml配置文件的信息，去设置对应的页面标题、图标等信息，创建node服务器并监听配置的端口(如默认配置的4873)等等，经过这一系列复杂的操作之后，我们就可以直接运行verdaccio并通过端口号访问到对应的页面。

#### 1.2 直接运行
运行verdaccio：
```sh
verdaccio
```
运行成功！
![](https://img-blog.csdnimg.cn/img_convert/3b92a13769127c1f681afcd7516f5bfc.png)
如果是本地安装，打开浏览器，输入`http://localhost:4873`，就可以看到页面：
![](https://img-blog.csdnimg.cn/img_convert/af4e1f6402d1033a042237d3b124eb38.png)

注意：
1. 如果是在服务器上安装，则需要在配置文件中添加`listen: 0.0.0.0:4873`（详见下文中的配置文件），再通过IP+4873端口号在线访问。
2. 如果使用的是云服务器，还需注意防火墙规则：

![我用的阿里云，需添加4873端口](https://img-blog.csdnimg.cn/img_convert/063ad147076397e8a157ad86d7e501b9.png)

#### 1.3 pm2守护进程后台运行
在命令行直接运行verdaccio，进程关闭后就无法访问到页面，所以这里推荐使用**pm2**守护进程，通过pm2可让verdaccio在后台运行。

pm2官网：https://pm2.keymetrics.io/

运行verdaccio：
```sh
pm2 start verdaccio
```

![](https://img-blog.csdnimg.cn/img_convert/c2c4c6c9080dd9b1b05dd83a96cb4508.png)

停止verdaccio：
```sh
pm2 stop verdaccio
```

![](https://img-blog.csdnimg.cn/img_convert/e245227202dfc96e2319e0251067ec28.png)


#### 2.1 docker安装
```sh
docker pull verdaccio/verdaccio:nightly-master
```
#### 2.2 docker运行
```sh
docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
```

效果和直接安装一样，在浏览器打开链接可访问到页面。

### 权限配置

搭建是搭建好了，但是怎么控制访问权限？

在官方文档里提到了verdaccio使用了一个名为**htpasswd**的插件来做权限配置，默认的配置文件是verdaccio安装目录下的`config.yaml`。

官方文档上有对配置项的详细说明：https://verdaccio.org/docs/en/configuration。

这是我的配置文件：
```
auth:
  htpasswd:
    file: ./htpasswd
    # Maximum amount of users allowed to register, defaults to "+inf".
    # You can set this to -1 to disable registration.
    max_users: -1

uplinks:
  npmjs:
    url: https://registry.npmjs.org/

packages:
  '@*/*':
    # scoped packages
    access: $authenticated
    publish: $authenticated
    unpublish: $authenticated
    proxy: npmjs


  '**':
    access: $authenticated
    publish: $authenticated
    unpublish: $authenticated
    proxy: npmjs

server:
  keepAliveTimeout: 60

middlewares:
  audit:
    enabled: true

logs: { type: stdout, format: pretty, level: http }

listen: 0.0.0.0:4873
```
配置项说明：
- access（访问权限）、publish（发布权限）、unpublish（取消发布权限）可选值如下：
  - $all：任意用户；
  - $anonymous：仅匿名用户； 
  - $authenticated：仅授权用户。
- max_users:-1，不允许用户注册（此时执行npm adduser会报409错误；因此需先注释掉这句，在本地注册完用户后再设置为-1）
- listen: 0.0.0.0:4873，没有这句就只能在本地访问，加上这句才可以通过ip+端口号在线访问。

修改完配置文件后，重启verdaccio生效：
```
verdaccio -c config.yaml
```

此时只有登录了verdaccio的用户才能对仓库里的包进行操作。

npm登录：`npm adduser --registry http://xxx.xx.xxx:4873`

发布包：`npm publish --registry http://xxx.xx.xxx:4873`

取消发布：`npm unpublish 包名 --registry http://xxx.xx.xxx:4873`（如果是24h内发布的包，需要加上--force）

下载包：`npm install 包名 --registry http://xx.xx.xxx:4873`

### 设为镜像源

 ```
 npm set registry http://xx.xx.xxx:4873/
 ```
执行这句就可以把`verdaccio`设为本地全局镜像源，如果在仓库中找不到对应的包，`verdaccio`就会去`npm`官方仓库尝试拉取对应的包，拉取成功后会缓存在`storage`目录下（压缩包格式）。