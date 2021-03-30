```javascript
/**
   * Perform no operation.
   * Stubbing args to make Flow happy without leaving useless transpiled code
   * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
   */
function noop(a, b, c) { }
```

这是一段vue2里的源码。

noop，是No Operation或No Operation Performed的缩写，意为无操作。

在汇编语言中，NOOP指令通常用于控制时序的目的，强制内存对齐，防止流水线灾难，占据分支指令延迟），或是作为占位符以供程序的改善（或替代被移除的指令）。

NOOP在各种语言中的例子：

- 在C语言中，分号（;）或空块（{}）都是NOOP。
- jQuery中，“jQuery.noop()”函数会创建一个NOOP。
- 在Perl中，省略号（…）可以用作NOOP。但是如果Perl尝试执行代码，则会给出未实现的异常。
- 在Python中，“pass”语句可用作NOOP。
- 在Visual Basic中，分号（;）表示NOOP。

在vue源码中的这个noop无操作空函数，主要作用就是为一些函数提供默认值，避免传入undefined之类的数据导致代码出错。

比如vue中：
```javascript
    new Watcher(vm, updateComponent, noop, {
      before: function before() {
        if (vm._isMounted && !vm._isDestroyed) {
          callHook(vm, 'beforeUpdate');
        }
      }
    }, true /* isRenderWatcher */);
```
Watcher具体实现为：
```javascript
var Watcher = function Watcher(
    vm,
    expOrFn,
    cb,
    options,
    isRenderWatcher
) {
    ...
}
```
这里传入noop空函数的作用，就是避免在调用回调函数`cb`时，程序报错导致中断（比如传入undefined，执行cb的时候就会报`cb is not a function`错误）。

这里也可以直接使用一个无操作的匿名函数来代替noop。在vue2的源码中，共有20处使用了noop函数，如果每次都创建一个匿名函数，一个是降低了代码的可读性，另一个是在js压缩时，这部分匿名函数是无法被压缩的，降低了代码的压缩率。

---

参考资料：

- [NOP](https://zh.wikipedia.org/wiki/NOP)

- [No-operation instruction](https://www.computerhope.com/jargon/n/noop.htm)

- [noop in Javascript](https://dev.to/praneshpsg239/noop-in-javascript-478h)

- [What is the JavaScript convention for no operation?](https://stackoverflow.com/questions/21634886/what-is-the-javascript-convention-for-no-operation)