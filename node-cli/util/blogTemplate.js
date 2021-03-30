const template = `<!DOCTYPE html>
        <html>
            <head>
            <meta charset="utf-8" >
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>{{{title}}}</title>
            <meta name="keywords" content="{{{keywords}}}">
            <meta name="description" content="{{{desc}}}">
            <style>
                .markdown-body {
                    box-sizing: border-box;
                    min-width: 200px;
                    max-width: 980px;
                    margin: 0 auto;
                    padding: 45px;
                }
                @media (max-width: 767px) {
                    .markdown-body {
                        padding: 15px;
                    }
                }
                {{{style}}}
            </style>
            </head>
            <body>
                <article class="markdown-body">
                <p>
                    <a href="../">返回文章列表</a>
                </p>
                <blockquote><p>《{{{title}}}》</p></blockquote>
                    {{{content}}}
                <blockquote>
                    文章仅代表个人观点，如有错误，欢迎指正~
                </blockquote>
                </article> 
            </body>
        </html>`;
module.exports = template