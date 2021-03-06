
/**
 * markdown文件转html页面
 */

const fs = require('fs'); //文件模块
const request = require('request'); //http请求模块
let template = require('./indexTemplate');

function updateIndex(target, listHtml) {
    console.log("开始更新")
    fs.readFile(target, 'utf-8', (err, data) => { //读取文件
        if (err) {
            throw err;
        }
        template = template.replace('{{{list}}}', listHtml); //替换html内容占位标记
        createFile(template);
    });
}


/**
 * 读取css内容
 * @param {function} fn 回调函数
 */
function createMarkdownCss(fn) {
    var url = 'https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/3.0.1/github-markdown.min.css';
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body)
            fn && fn(body);
        }
    });
}


/**
 * 创建html文件
 * @param {string} content 写入html的文件内容
 */
function createFile(content) {
    const file = './../index.html'; //文件地址

    fs.writeFile(file, content, 'utf-8', err => {
        if (err) {
            throw err;
        }
        console.log('更新成功！');
    });
}

module.exports = updateIndex;