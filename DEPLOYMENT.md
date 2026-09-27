# GitHub Pages 发布

线上地址：https://xin1230032197.github.io/

使用 Node.js 24。首次安装运行 `npm ci`，开发使用 `npm run dev`。

`npm run build:pages` 会通过现有内容索引生成所有目录、文章和标签页面，产物在 `dist/client`。该命令保留现有 Markdown、Wiki links、反向引用、搜索和主题能力。GitHub Pages 不提供服务器接口。

仓库 Settings → Pages 的 Source 设置为 **GitHub Actions**。每次推送 `main` 自动运行测试、TypeScript、lint、静态构建并发布。也可以在 Actions 的 Deploy Personal Codex 手动触发。

文章仍在 `content/` 编辑；目录配置、写作能力和知识链接分别见 CONTENT_GUIDE.md、ARTICLE_GUIDE.md、KNOWLEDGE_GUIDE.md。

Pages 构建不启用 Cloudflare/Sites 插件；原有 `npm run build` 保留服务器构建方式。当前 vinext 静态预渲染与 trailingSlash 重定向存在兼容问题，因此静态导出后补齐目录 index.html 和 URL 解码后的中文文件名。Pages 的链接和搜索结果使用浏览器原生页面跳转，避开该版本静态导出的 RSC 预取问题，主题偏好通过原有 localStorage 保留。

本地验证静态产物：运行 `node scripts/preview-pages.mjs`，打开 http://127.0.0.1:4173。另一个终端执行 `npm run check:content -- http://127.0.0.1:4173` 可检查全部路由。
