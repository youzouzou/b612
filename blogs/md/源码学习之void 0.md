今天看源码的时候看到 `void 0` 这样的写法，平时在业务代码里基本没有这样的写法，于是学习了一下。

在控制台运行了一下`void 0`，得到返回值是`undefined`。

在[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/void)上搜了一下void，了解到：

- void是个运算符
- void用于获取原始数据类型undefined
- void可以将function关键字识别为函数表达式（立即执行函数）
- void可以用于箭头函数以避免泄漏


以vue的源码为例：
```javascript
  var createEmptyVNode = function (text) {
    if (text === void 0) text = '';

    var node = new VNode();
    node.text = text;
    node.isComment = true;
    return node
  };
```
这段代码用于创建一个空节点。

这里`void 0`返回了`undefined`，并与传入的text参数比较，如果相等，将text赋值为空字符串。

为什么这里不直接用`undefined`，而要“多此一举”地用`void 0`？

看下面这段代码：

```javascript
function test(){
    let undefined = "666";
    console.log(undefined); // "666"
    console.log(void 0); // undefined
}
```
可以看到，undefined是可以被重写的：在`test`函数中`undefined`被重写为字符串`"666"`，而`void 0`却不受影响，依然得到`undefined`数据类型。

这里需要注意：

- `undefined` 并不是保留词（reserved word），它只是全局对象的一个属性，在低版本 IE 中能被重写（因此很多框架为了兼容低版本，就会选用void 0代替undefined）。
- `undefined` 在 `ES5` 中已经是全局对象的一个只读（read-only）属性了，它不能被重写；但是在局部作用域中，还是可以被重写的。

除了`void 0`，也可以用`void 123`、`void "abc"`等其他void表达式代替，之所以选择`void 0`，是因为它是各种void表达式中字节数最少之一（6个字节，用`void 0`代替`undefined`能节省3个字节）。


---


参考资料：
- [为什么用「void 0」代替「undefined」](https://github.com/lessfish/underscore-analysis/issues/1)