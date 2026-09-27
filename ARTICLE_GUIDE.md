# Article Experience V1 写作指南

文章仍保存在 `content/<一级>/<二级>/<slug>.md`，frontmatter、目录配置和路由规则不变。渲染链保留 react-markdown → remark-gfm / remark-math → rehype-katex / rehype-slug，并增加服务端 `markdownExperience` 插件。代码高亮使用 lowlight 的常用语言集，CUDA 使用 C++ 语法规则；浏览器只负责复制交互。

## 数学公式

行内写 `$x^2$`。独立公式用单独一行的 `$$` 包围 LaTeX。公式使用 KaTeX，支持的命令范围以 KaTeX 为准；不是完整的 TeX 排版引擎。

长公式在自己的区域内横向滚动，可用 Tab 聚焦后按左右方向键。正文不会因此加宽。需要多步推导时优先使用 `aligned` 分行，方便手机阅读。

## 代码

围栏声明语言，例如 `python`、`cpp`、`cuda`、`typescript`、`bash`、`json`。未声明或未知语言仍显示原文、行号和复制按钮。无自动语言猜测。

````md
```python {2,4-5}
import math
maximum = max(values)
# 减去最大值，避免指数上溢。
weights = [math.exp(x - maximum) for x in values]
total = math.fsum(weights)
```
````

行号从 1 开始，花括号内支持单行和闭区间，以逗号分隔。没有花括号就不强调任何行。无效范围忽略，越界范围截断到实际行数。

Copy 复制原始代码，保留缩进和换行，不含行号及语言标签。浏览器拒绝剪贴板权限时，按钮提示手动选择复制。代码保持原始换行，长行在代码框中滚动。

## 引用与 Callout

普通引用使用 `> 正文`。提示块在引用第一行写 `[!NOTE]`、`[!TIP]`、`[!IMPORTANT]`、`[!WARNING]` 或 `[!CAUTION]`，正文从下一行开始继续使用 `>`。类型标签始终可见，不仅依赖颜色表达区别。

## 图片与题注

```md
![图片的替代文字](/diagrams/coalesced-access.svg "显示在图片下方的题注")
```

独占一个段落的图片会生成 figure，title 作为 figcaption。替代文字描述图中信息，题注解释它与正文的关系。图片可以不写题注；混在段落里的图片保持原位置。图片延迟加载并适应正文宽度。

## 表格、脚注与链接

- 使用 GFM 表格，宽表在局部区域滚动，可聚焦后用键盘横向查看。
- 脚注写 `正文[^name]`，并在文末写 `[^name]: 注释内容`，自动生成编号和返回链接。
- H1–H6 自动生成可链接锚点，重复标题得到不同 ID。右侧 TOC 仍只读取 H2/H3。
- 站内链接使用 `/一级/二级/文章`。HTTP(S) 外链显示 ↗，在新标签页打开，并包含读屏提示。
- 不执行 Markdown 中的原始 HTML、脚本或 JSX。

## 回归文章与检查

- `/study/math/stable-softmax`：数学公式、Python、行高亮、表格和脚注。
- `/study/cpp/raii-resource-lifetime`：C++、普通引用、Warning/Tip、外链。
- `/infra/cuda/coalesced-access`：CUDA、图片题注、宽表、公式和站内链接。

```sh
npm test
npx tsc --noEmit
npm run lint
npm run check:content
npm run build
```

三套主题共享组件结构，语法配色分别适配深浅背景。中文正文沿用原有字体，只调整阅读组件的行距、换行、聚焦和溢出规则；没有增加背景动画。
