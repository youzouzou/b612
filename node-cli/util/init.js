/**
 * 1. 手动：将md博客保存到blogs/md路径下，如果博客中有图片，md文件中需要修改下路径，指向assets，图片就保存到assets下
 * 2. 手动：修改blogList.js
 * 3. 遍历blogList.js，根据md和blogList.js生成对应的html
 * 3. 遍历blogList.js，更新index.html
 */
const getFileList = require('../util/readMdList');
const list = require('../data/blogList');
const dist = './../blogs/';
const blogTemplate = require('../util/blogTemplate');
const createHtml = require('../util/createHtml');
const updateIndex = require('../util/updateIndex');

function updateHTMLList() {
    list.forEach(item => {
        const { fileName, desc, keywords } = item;
        const target = './../blogs/md/' + fileName + '.md';
        new createHtml(target, dist, fileName, desc, keywords, blogTemplate);
    })
}

function updateIndexHTML() {
    let tpl = ``;
    list.forEach(item => {
        const { fileName, title, date } = item;
        tpl += `<div><a href="./blogs/` + fileName + `.html">[` + date + `]《` + title + `》</a></div>`;
    })
    updateIndex('../index.html', tpl)
}

const initUtil = {
    updateHTMLList,
    updateIndexHTML
}

module.exports = initUtil;