# b612
个人博客

这是一个基于node+express搭建的，配合githup page生成的博客网站。


目前前两个步骤仍需手动：

1. 将markdown编写的博客md文件，放到blogs/md的目录下；
2. 手动更新node-cli/data/blogList.js中的数据；
3. cd进入node-cli，执行npm run dev，在浏览器地址栏里执行http://localhost/init。

此时将自动生成md对应的html文件，并更新index.html中的内容。

index.html的模板在util/indexTemplate.js中

博客内容的模板在util/blogTemplate.js中

模板样式有待优化

生成的博客html文件会自动插入关键词、描述等，内容比较简约，仍有待优化

后续会将流程尽量自动化+可视化，待增加前端操作页面