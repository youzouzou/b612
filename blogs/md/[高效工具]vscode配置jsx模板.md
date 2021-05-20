首先打开vscode，菜单选项：File>Preferences>User Snippets>javascritreact.json

文件内容改为：
```json
{
	"JSX": { // 函数式组件
		"prefix": "jsx",
		"body": [
			"import React, { useEffect, useState } from \"react\"",
			"",
			"function DemoPage$1 (props){",
			"\tuseEffect(() => {",
			"\t\tdocument.title =\"\"",
			"\t\tdocument.body.style.background = \"#fff\"",
			"\t}, [])",
			"\treturn(",
			"\t\t<div></div>",
			"\t)",
			"}",
			"",
			"export default DemoPage",
		],
		"description": "jsx components"
	},
      "JSXClass": { // class组件
        "prefix": "jsx-class",
        "body": [
            "import React, { useEffect, useState } from \"react\"",
            "import styled from \"styled-components\"",
            "import { rem } from \"@utils/UtilsFunc\"",
            "",
            "class Demo extends React.Component{",
            "\trender(){",
            "\t\treturn(",
            "\t\t\t$1",
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

![配置效果图](https://github.com/youzouzou/b612/blob/main/assets/87433694e06cb95215a27487e57d2d5.png)

可以修改`prefix`来修改触发的关键字，也可以修改`body`里的内容，来修改初始化的模板。