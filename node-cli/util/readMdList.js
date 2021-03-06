const fs = require('fs');
function getFileList(path) {
    var filesList = [];
    readFileList(path, filesList);
    console.log(filesList)
    return filesList;
}

function readFileList(path, filesList) {
    var files = fs.readdirSync(path);
    files.forEach(function (itm, index) {
        var stat = fs.statSync(path + itm);
        if (stat.isDirectory()) {
            //递归读取文件
            readFileList(path + itm + "/", filesList)
        } else {
            // var obj = {};//定义一个对象存放文件的路径和名字
            // obj.path = path;//路径
            // obj.filename = itm//名字
            filesList.push(itm.split('.')[0]);
        }

    })
}

module.exports = getFileList;