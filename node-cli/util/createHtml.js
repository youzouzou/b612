
/**
 * markdown文件转html页面
 */
class Md2Html {
    constructor(target, dist, fileName, desc, keywords, template) {
        console.log("开始生成")
        this.fs = require('fs'); //文件模块
        this.marked = require('marked'); //md转html模块
        this.request = require('request'); //http请求模块
        this.path = require('path'); //路径模块
        this.fileName = fileName || '不知道起什么标题';
        this.dist = dist;
        this.fs.readFile(target, 'utf-8', (err, data) => { //读取文件
            if (err) {
                throw err;
            }
            const html = this.marked(data); //将md内容转为html内容
            // let template = this.createTemplate();
            template = template.replace('{{{title}}}', fileName);
            template = template.replace('{{{desc}}}', desc);
            template = template.replace('{{{keywords}}}', keywords);
            template = template.replace('{{{content}}}', html); //替换html内容占位标记
            console.log(123, template);

            this.createMarkdownCss(css => {
                template = template.replace('{{{style}}}', css); //替换css内容占位标记
                this.createFile(template);

            });
        });
        // this.watchFile();
    }


    /**
     * 创建页面模板
     * @returns {string} 页面骨架字符串
     */

    createTemplate() {
        const template = `<!DOCTYPE html>
        <html>
            <head>
            <meta charset="utf-8" >
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>{{{title}}}</title>
            <meta name="keywords" content="{{{keywords}}}">
            <meta name="description" content="{{{desc}}}">
            <style>
                .markdown-body {
                    box-sizing: border-box;
                    min-width: 200px;
                    max-width: 980px;
                    margin: 0 auto;
                    padding: 45px;
                }
                @media (max-width: 767px) {
                    .markdown-body {
                        padding: 15px;
                    }
                }
                {{{style}}}
            </style>
            </head>
            <body>
                <article class="markdown-body">
                    {{{content}}}
                </article>  
            </body>
        </html>`;
        return template;
    }

    /**
     * 读取css内容
     * @param {function} fn 回调函数
     */
    createMarkdownCss(fn) {
        var url = 'https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/3.0.1/github-markdown.min.css';
        this.request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                fn && fn(body);
            }
        });
    }


    /**
     * 创建html文件
     * @param {string} content 写入html的文件内容
     */
    createFile(content) {
        const name = this.fileName; //文件名
        const suffix = 'html'; //文件格式
        const fullName = name + '.' + suffix;  //文件全名
        const file = this.path.join(this.dist, fullName); //文件地址

        this.fs.writeFile(file, content, 'utf-8', err => {
            if (err) {
                throw err;
            }
            console.log('写入成功！');
        });
    }

}


module.exports = Md2Html;