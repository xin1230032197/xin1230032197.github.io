# 三境 / Visual art direction

基于现有 Personal Codex 继续实现。保留路由、数据驱动目录、Markdown、全文搜索、主题存储与阅读布局。参考图 `personal-codex-reference.png` 仅供设计指导，没有被网页引用。

## 背景结构

所有主题共享正文与导航 DOM。`components/theme-backgrounds/ThemeBackground.tsx` 常驻三个独立背景组件，通过 `data-theme` 和 350ms 渐变切换；背景不参与点击、焦点或正文布局。

- INK：深墨绿底、空间气氛、局部书房、窗光、烛光、材质、天体仪线稿、浮尘、阅读遮罩、颗粒暗角。
- ZEN：和纸底、自然光、纤维、局部水墨、边缘晕染、流动淡墨、扫光、金箔、细金线、朱砂印、颗粒。
- AURORA：宇宙底、SVG 星场、独立曲线极光及细丝、局部行星山谷、轨道、流动空间雾、弱图纸格线、阅读遮罩、颗粒。

`app/codex-art-direction.css` 控制公共三栏与排版；`app/theme-environments.css` 控制各主题材质、光照和运动。桌面两侧为 270/290px，宽屏为 280/300px，正文最大 820px。平板收起右栏，手机使用抽屉目录。

## 持续流动（2026-09-14 更新）

按用户最新要求，三套主题都有无限循环的环境运动。固定书架、纸张、山体和文字作为空间锚点，运动只作用于独立光影与氛围层。

| 主题 | 流动层 | 单程/周期时长 |
| --- | --- | --- |
| INK | 气氛呼吸、窗光偏移、烛光变化、浮尘移动 | 47 / 55 / 31 / 38 秒 |
| ZEN | 暖光漂移、淡墨流动、纸面扫光、金箔反光 | 48 / 58 / 36 / 33 秒 |
| AURORA | 极光漂移、星光变化、轨道旋转、空间雾流动 | 56 / 43 / 120 / 54 秒 |

多数动画使用 alternate，往返完整循环为两倍时长。采用 transform/opacity 动画，无逐帧 React 更新；未选中的主题暂停。保留 `prefers-reduced-motion` 无动画适配。部分动画使用负延迟，首次出现即处于流动过程。

## 素材

三张局部素材分别使用内置 imagegen 生成一次，未生成变体。原始图片保存在项目外，经 Sharp 以 quality 88 转换 WebP；创意效果由独立 CSS/SVG 层叠加。

| 主题 | 项目资源 | 尺寸 | 文件大小 |
| --- | --- | --- | --- |
| INK | `public/theme-assets/ink-library.webp` | 1024×1536 | 179110 bytes |
| ZEN | `public/theme-assets/zen-ink-wash.webp` | 1536×1024 | 377780 bytes |
| AURORA | `public/theme-assets/aurora-observatory.webp` | 1024×1536 | 131646 bytes |

原始目录：`C:/Users/xia/.codex/generated_images/01a09abe-3cfd-75f1-9318-af58b6910f26/`

- INK：`exec-3513175a-78be-4e10-90d0-898bc6fbd05b.png`
- ZEN：`exec-87529af0-e22f-412a-8572-54849539f712.png`
- AURORA：`exec-c7ed72d1-33e2-4b13-b99d-4ad05db9acf1.png`

## Imagegen prompts

### INK

```text
Use case: stylized-concept
Asset type: ONE standalone portrait decorative scenery vignette for a website, requested dimensions 1024x1536.
Reference image role: art direction only. In the supplied triptych, use ONLY the TOP strip's antique black-green library lighting and tactile materials. Do not reproduce the interface or overall reference layout.
Primary request: Exquisitely detailed cinematic antique dark royal library, tall leaded window at upper right, dark emerald volumetric daylight beam falling into shadowed leatherbound archive shelves and book stacks; aged brass armillary sphere on a wooden desk and a tiny warm candle in lower right.
Composition: All recognizable scenery subjects confined to the right 65% of the portrait. Leftmost 35% is quiet, empty near-black green #07100d, with a gradual natural atmospheric fade into scenery; no abrupt edge. The window stays in upper right; desk, books, armillary and small candle occupy lower right. This is an isolated scenery layer to be composed with separate CSS lighting and geometry, so keep the composition uncluttered and localized.
Lighting and palette: lush very dark black-green shadows, emerald volumetric daylight, restrained muted antique brass highlights, very small warm candle glow. Dark academia, cinematic realism, tactile aged wood, worn leather, patinated brass, subtle dust in light. Rich detail in illuminated areas while overall remaining dark.
Avoid: no webpage, no UI, no full screen background design, no frames, no borders, no letters, no labels, no writing, no readable text even on books, no watermark. One image only.
```

### ZEN

```text
Use case: stylized-concept
Asset type: ONE standalone local material and ink decorative vignette, landscape 1536x1024, for compositing into a lower-right website corner.
Reference image role: art direction only. Use ONLY the supplied triptych's MIDDLE strip warm ivory paper, delicate ink washes and aged gold material. Do not reproduce the interface, symbols, or full background composition.
Primary request: An exquisite editorial art-book photograph of real handmade luxurious warm ivory washi paper (#f2e6cf) with abstract sumi ink washes, misty layered non-specific ink ridges and landforms clustered primarily in the lower-right, delicately bleeding charcoal pigment, organic feathered washes, sparse fragmented genuine aged gold leaf with subtle torn edges. Natural tactile paper fibres and physical gold foil with restrained reflections.
Composition: Top half and leftmost 35% mostly quiet pale paper. Ink forms and dark charcoal washes concentrated in lower-right corner, grading softly into empty paper without borders. Gold chips sparse near right edge, detailed enough for compositing. This is a localized material ornament, not a complete page background.
Style: Refined art-book material photography, organic and imperfect handmade paper and pigment, restrained atmospheric ink, natural editorial lighting, no saturated colors.
Avoid: No webpage, UI, readable text, writing, symbols, stamp, seals, branches, cherry blossoms, Fuji, torii, literal cultural icons, frames or watermark. One image only.
```

### AURORA

```text
Use case: stylized-concept
Asset type: ONE standalone portrait local space-environment vignette, 1024x1536, for a website's rightmost approximately 45% decorative depth layer.
Reference image role: art direction only. Use ONLY the supplied triptych's BOTTOM strip's far-right cosmic body rim and cold mountain depth. Do not reproduce the interface or overall background.
Primary request: Exquisitely detailed realistic painterly cosmic landscape in very dark blue-black and green-black. A huge celestial body's curved cyan-blue luminous rim appears high on the right, partially cropped beyond the right edge. Lower-right contains layered rugged cold-toned mountains, distant canyon depth, and thin atmospheric mist. Very few tiny stars. Only faint space haze, no prominent aurora.
Composition: Leftmost 40% stays quiet near-black negative space, naturally and softly fading into the scenery. All primary subjects are anchored to the right. Celestial rim high on right, successive cold rocky ridges and canyons low on right, depth through restrained haze. The whole image is a local scenic ornament, not a full-screen background design.
Style, light and palette: sophisticated realistic painting with tactile geological detail, cinematic spatial depth, restrained cyan and teal glow against deep near-black blues and greens; subtle cold atmospheric light, dark quiet majesty, no purple neon.
Constraints: A separate SVG/CSS layer will provide large aurora ribbons, so DO NOT paint any significant aurora, luminous sky ribbons, or broad glowing bands. No webpage, no UI, no text, no letters, no labels, no logos, no frames, no watermark. Exactly one image, no variants.
```

## 验证记录

- `npm run build` 完成；`npx tsc --noEmit` 无类型错误。
- `npm run check:content`：7 个一级目录、39 条内容路由、6 篇文章、3 个内部引用关系通过。
- 三主题检查 1920×1080 与 2560×1440；正文宽度实测 820px，宽屏两侧实测 280/300px。
- 390×844 手机视图无横向溢出；一级与当前二级目录在抽屉中，主题切换可用。
- Ctrl+K 搜索、结果筛选和键盘跳转正常；搜索面板随主题使用对应材质。
- 阅读中切换 ZEN → INK，article HTML 不变，scrollY 前后均为 2563，未重建正文。
- 浏览器读取到 INK 4 个、ZEN 4 个、AURORA 4 个持续运行的动画；ZEN 的光与淡墨 transform 在两次观察间变化。
- 系统偏好减少动态时，CSS 禁用环境动画；未激活的主题动画暂停。

## 滚动与版面修订（2026-09-14）

移除右栏 THE READING ROOM / 主题名称 / 箴言区块，以及正文顶部 PERSONAL CODEX / 分类标记横栏文字；保留细线和紧凑留白。主导航、面包屑与文章目录保留。

静态 SVG 噪声材质与多层模糊极光预渲染为 WebP，原始 SVG/TSX 保存在 design 与 public/textures；通过 `node scripts/bake-theme-artwork.mjs` 可重新生成。运行时继续独立移动极光图层，不再逐帧计算 SVG 模糊。移除全屏 CSS blur，并隔离背景合成。

目录仅在正文尺寸变化时缓存标题位置；滚动使用缓存，不再逐帧测量每个标题。更新时只在活动章节改变时写 React 状态，并清理挂起的动画帧。

INK 增加前景双层浮尘（24/31 秒），窗光加强为 28 秒单程的可见游移。仅激活主题的关键运动层预先提升合成。

本机 1920×1080 开发预览短采样：INK 上下滚动时 requestAnimationFrame 平均间隔约 9.97ms，95 分位约 16.7ms。此结果是当前设备的短时回调采样，不代表所有设备或实际屏幕呈现 FPS；临时采样代码已移除。确认文字已清除、目录随滚动高亮、极光预渲染后仍保持独立流动。

## ZEN 流动加强与去印章

按用户反馈彻底移除「映疏星记」印章节点及其样式。ZEN 的暖光、淡墨、扫光单程分别调整为 26/24/22 秒，增加移动幅度与可见度，边缘加入 27 秒循环的稀疏金色浮光。保留无实时模糊的 transform/opacity 合成方式和减少动态适配。
