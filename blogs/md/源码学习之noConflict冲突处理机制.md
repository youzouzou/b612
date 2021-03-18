最近接手了一个古早项目，用的backbone，于是正好学习一下早期MVC框架的源码。

这篇主要写冲突处理机制，源码其实就一个函数，代码也很短。原理也很好理解，总结起来就是：**每执行一次noConflict()函数，框架就往前回退一个版本**。

这个 `回退版本`的意思是，当你引用多个backbone.js时，比如按顺序引入了v1、v2、v3，按照正常情况，你现在拿到的是v3，当你执行一次noConflict()之后，你就会回退到v2，再执行一次noConflict()，你就回退到v1，再再执行一次noConflict()，Backbone就是undefined。


举个栗子：

比如你在项目中引入了两个backbone.js：v1.4.0和v1.0.0，

这时候Backbone指向的是最后引入的v1.0.0版本；

执行`Backbone.noConflict()`之后，Backbone就会回退，指向之前引入的v1.4.0版本。

Talk is cheap, let me show the code：

```html
  <script src="underscore-min.js"></script>
    <script src="jquery.js"></script>
    <!-- 引入1.4.0版本 -->
    <script src="backbone.1.4.0.js"></script>
    <!-- 引入1.0.0版本 -->
    <script src="backbone.1.0.0.js"></script>
    <script>
        console.log("Backbone", Backbone); // 1.0.0
        var localBackbone = Backbone.noConflict();
        console.log("Backbone previous", Backbone); // 1.4.0
        console.log("localBackbone", localBackbone); // 1.0.0
    </script>
```
执行结果：

![backbone例子运行结果](../assets/noConflict-backbone-result.png)

代码分析：

先引入1.4.0版本，再引入1.0.0版本；

可以看到执行结果，第一个console出来的Backbone版本号，是最后引入的1.0.0；

当执行了Backbone.noConflict()之后，Backbone的版本就会回退成上一个引入的版本1.4.0。

这个时候如果再执行一次Backbone.noConflict()，Backbone就会变成undefined，因为再往上没有其他Backbone的引入了。


我们再来看看**Backbone的源码**：

```js
 // Save the previous value of the `Backbone` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousBackbone = root.Backbone;
  
  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function () {
    root.Backbone = previousBackbone;
    return this;
  };
```

这里不得不赞一句，Backbone的源码有着丰富的注释，对于学习源码很有帮助。

源码分析：

1. 当引入一个backbone.js时，框架就会通过`previousBackbone`变量，保存一份之前版本的Backbone（如果之前没有引入Backbone，这个`previousBackbone`变量的值就是undefined）；

2. 当调用`Backbone.noConflict()`时，框架就会把Backbone这个变量指向previousBackbone，也就是上述中保存的之前版本的Backbone，简称版本回退；

3. `Backbone.noConflict()`函数return的this，因为这时候this指向的还是当前版本的Backbone，所以我们看到上面的localBackbone版本号还是1.0.0。


官方文档中对于noConflict函数的说明：
> Backbone.noConflict()方法返回了一个Backbone对象，这个对象指向了它的原始值（original value这里指的是当前版本的Backbone）。你可以使用 Backbone.noConflict()来保存一个Backbone的本地引用。如果你不想被第三方网站嵌入的Backbone影响到现有的Backbone，这个方法是非常有用的。

英文比较好的同学可以直接看原版说明：
> Returns the Backbone object back to its original value. You can use the return value of Backbone.noConflict() to keep a local reference to Backbone. Useful for embedding Backbone on third-party websites, where you don't want to clobber the existing Backbone.

据说这个冲突处理机制最初是jQuery发明的，之后很多框架都借鉴了jQuery的做法。于是我也去找了jQuery的源码：

```js
var _jQuery = window.jQuery, // Map over jQuery in case of overwrite
    _$ = window.$; // Map over the $ in case of overwrite

jQuery.noConflict = function( deep ) {
    if ( window.$ === jQuery ) {
        window.$ = _$;
    }

    if ( deep && window.jQuery === jQuery ) {
        window.jQuery = _jQuery;
    }

    return jQuery;
};
```

核心思想和上面Backbone说的一样，引入js文件时就保存一份之前引入的jQuery版本，调用一次noConflict方法就回退一个版本。

这里和Backbone不一样的是，noConflict有个参数deep，只有当deep为true时，jQuery变量才会进行版本回退。（$变量则不管deep是true or false都会回退。）

jQuery的也写个例子跑一下看看：
```html
 <script src="https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.5.1.min.js"></script>
  <script src="https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.4.1.min.js"></script>
    <script>
        console.log("$", $().jquery); // 3.4.1
        console.log("jQuery", jQuery().jquery); // 3.4.1
        var localJQuery = jQuery.noConflict(true);
        console.log("localJQuery", localJQuery().jquery); // 3.4.1
        console.log("$", $().jquery); // 3.5.1
        console.log("jQuery", jQuery().jquery); // 3.5.1，如果传给noConflict的参数值为false，这里就还是3.4.1
    </script>

```

代码分析：

按顺序引入了3.5.1和3.4.1两个版本的jQuery；

在执行noConflict之前，jQuery和$都指向最后引入的3.4.1版本；

在执行noConflict之后，jQuery和$都指向了之前引入的3.5.1版本（这里传入的deep值为true，若为false，则只有$指向3.5.1，jQuery就还是3.4.1）。