首先打开vscode，菜单选项：File>Preferences>User Snippets>javascritreact.json

文件内容改为：
```json
{
	"JSX": {
		"prefix": "jsx", //触发的关键字，输入jsx按下tab或者回车键键
		"body": [
			"import React, { useEffect, useState } from 'react'",
			"", //空一行
			"class Demo extends React.Component{",
			"\trender(){", //有制表符的一行
			"\t\treturn(",
			"\t\t\t$1", //光标首次出现的位置
			"\t\t)",
			"\t}",
			"}",
			"",
			"export default Demo",
		],
		"description": "jsx components"
	}
}
```

在新建的jsx文件中输入关键字`jsx`，就会出现关联的初始化配置，回车即可自动初始化文件。

![配置效果图](https://github.com/youzouzou/b612/blob/main/assets/265acc19c3e3d08f5b6c8a299e8994e.png?raw=true)

可以修改`prefix`来修改触发的关键字，也可以修改`body`里的内容，来修改初始化的模板。