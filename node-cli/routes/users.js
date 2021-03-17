var express = require('express');
var router = express.Router();
var createHtml = require('../util/createHtml');
var blogTemplate = require('../util/blogTemplate');
var updateIndex = require('../util/updateIndex');
var getFileList = require('../util/readMdList');

/* GET users listing. */
router.get('/', function (req, res, next) {
  // 测试生成html
  // const fileName = 'TEST';
  // const desc = "测试";
  // const keywords = "关键词1,关键词2"
  // const target = './../blogs/md/' + fileName + '.md';
  // const dist = './../blogs/';
  // new createHtml(target, dist, fileName, desc, keywords, blogTemplate);

  // 测试修改index.html
  // const listHtml = `<div><a href="blogs/TEST.html">测试博客标题123123123213</a></div>`;
  // updateIndex('../index.html', listHtml)

  // 测试读取blogs/md下的所有文件的名称
  // const list = getFileList("./../blogs/md/");
  // console.log("列表", list);
  res.send('respond with a resource');
});

module.exports = router;
