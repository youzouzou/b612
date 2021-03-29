var express = require('express');
var router = express.Router();
var initUtil = require('../util/init')
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/init', function (req, res, next) {
  initUtil.updateHTMLList(); // 遍历生成HTML文件
  initUtil.updateIndexHTML(); // 更新index.html
  res.render('index', { title: 'init初始化页面' });
});


module.exports = router;
