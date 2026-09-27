# Personal Codex 内容维护

文章排版与代码行高亮、图片题注等写法见 [Article Experience V1 写作指南](./ARTICLE_GUIDE.md)。

Wiki 内链、aliases、反向引用、相关笔记、标签及搜索规则见 [Knowledge Layer V2 指南](./KNOWLEDGE_GUIDE.md)。

内容来源统一为 `content/directories.json` 和 `content/<一级 slug>/<二级 slug>/<文章 slug>.md`。构建时生成内容树、导航、路由和搜索索引；不再手写文章 import 或元数据数组。当前使用 Markdown，不启用 MDX/JSX 执行。

## 目录配置

编辑 `content/directories.json`：

```json
[
  {
    "id": "infra",
    "slug": "infra",
    "title": "AI Infra",
    "label": "AI INFRA",
    "description": "系统笔记",
    "order": 10,
    "children": [
      {
        "id": "cuda",
        "slug": "cuda",
        "title": "CUDA",
        "description": "并行计算",
        "order": 10
      }
    ]
  }
]
```

- 新增、删除、改名、排序只改内容数据，不改组件。一级可有空 children，二级可以暂时没有文章。
- `id` 是稳定标识；`title` 是显示标题；`slug` 是 URL 和文件夹名。slug 使用小写英文字母、数字与连字符。
- `order` 越小越靠前，未填写按 0；同 order 按 slug 排序，避免依赖文件扫描顺序。一级、二级、文章各自排序。
- 修改 title 不改变 URL。修改 slug 时一并改对应文件夹名、正文内部链接；旧 URL 不自动重定向。
- 删除目录前移动或删除其文章。孤立文件、重复 ID/slug 或无效 frontmatter 会明确报错，避免静默丢文章。
- 首页快捷链接在 `data/site.ts` 使用稳定目录 ID，随目录 slug 自动更新；目标目录删除后自动隐藏。

## 新增文章

例如新建 `content/infra/cuda/kernel.md`，自动获得 `/infra/cuda/kernel`：

````md
---
title: Kernel 基础
description: 理解线程、线程块与网格。
date: 2026-09-26
updated: 2026-09-26
tags:
  - CUDA
  - Kernel
order: 20
---

正文介绍。

## 线程与线程块

正文与 `inline code`。

### 一个例子

```cpp
int i = blockIdx.x * blockDim.x + threadIdx.x;
```

[存储层次](/infra/cuda/memory-hierarchy)
````

不需要修改 `data/articles.ts`、路由文件、导航或搜索代码。开发服务监听 Markdown 与目录配置的新增、编辑和删除，自动重建索引并刷新；生产站点修改内容后重新构建发布。

### Frontmatter 字段

| 字段        | 规则                             |
| ----------- | -------------------------------- |
| title       | 必填，非空标题                   |
| description | 可选，默认空字符串               |
| date        | 必填，真实有效的 YYYY-MM-DD 日期 |
| updated     | 可选，默认 date，不能早于 date   |
| tags        | 可选，字符串数组，默认空数组     |
| aliases     | 可选，文章别名数组，用于 Wiki 内链和搜索 |
| order       | 可选，有限数字，默认 0           |
| sample      | 可选，仅用于标示现有示例笔记     |

YAML 支持数组与多行字符串。包含冒号的标题建议加引号。未知字段和重复 YAML key 会报错，避免拼写错误悄悄生效。

## 渲染、目录、翻页与搜索

复用现有 Markdown 渲染器：标题、列表、引用、GFM 表格、代码块复制、图片、脚注、行内和块级数学公式、内部/外部链接及 NOTE/TIP/WARNING/IMPORTANT callout。原始 HTML 和 JSX 不执行。

- 左侧来自一级目录；右侧分类来自当前一级目录。
- Breadcrumb 由当前路径和内容树生成，显示目录配置/文章中的真实标题。
- 文章 H2/H3 自动生成锚点和 ON THIS PAGE，重复标题也有独立锚点。IntersectionObserver 跟踪阅读位置；图片、字体或窗口尺寸变化后重建观察区域。
- 上一篇/下一篇限定当前二级目录，遵循 order，不跨分类、不循环。首篇没有上一篇，末篇没有下一篇；单篇只显示返回分类。
- Ctrl/Cmd+K 搜索目录标题、文章标题、标签、摘要与正文；多词使用 AND，忽略大小写，标题优先。上下键选择，Enter 打开，Esc 关闭。
- 搜索端只加载导航信息与预编译的纯文本索引，不携带 YAML 解析器。Markdown 文件内容都会用于搜索，请仅放计划公开的内容。
- 三主题共用以上逻辑；手机一级/二级目录与文章 TOC 继续使用现有抽屉。

## 开发与验证

需要 Node 22.18+（推荐 Node 24）及 npm。

```sh
npm install
npm run dev
npm run check:content
node --test tests/content-model.test.mjs
npx tsc --noEmit
npm run build
# 可选：检查运行中的所有内容路由及无效路径
npm run check:content -- http://localhost:5173
```

目录结构和 frontmatter 在开发/构建时校验；`check:content` 还检查站内 Markdown 链接和图片路径。错误会给出源 Markdown 文件名。

加载链：`build/content-source.ts` 读取文件 → `lib/content-model.ts` 校验和构建内容树 → `build/content-vite-plugin.ts` 输出虚拟模块。运行中的浏览器/Cloudflare Worker 无需读取本地文件系统。

## 视觉与字体

本阶段保留 INK / ZEN / AURORA 的 Art Direction，未增加背景或动画。文章翻页复用现有文本链接样式。

本地字体与原有字体回退保留。新增大量中文内容后，可运行 `scripts/subset-fonts.py` 重新生成字体子集；未生成也会通过完整字体回退显示新汉字。
