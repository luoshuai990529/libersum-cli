# 制作与导出

## 环境

prepare 需要 Python 3 标准库。render 需要 Node.js、可解析的 `playwright` 包及 Chrome；默认使用系统 Chrome。其他 Chromium 可通过 `BROWSER_EXECUTABLE` 指定可执行文件。不要写入固定电脑路径。

先检查当前 Agent 环境中可用的运行时。在 Codex 有 bundled runtime 时使用其工具返回的路径；不要把该路径写进 Skill。缺少 Playwright 时，可在单独的工具目录安装 `playwright` 并令 `NODE_PATH` 指向它的 `node_modules`，不要污染用户项目依赖。缺少浏览器时按运行环境提供的方法准备 Chromium，再设置 `BROWSER_EXECUTABLE`。安装能力和网络取决于当前环境；若受阻，报告具体缺口。

生成的 HTML 与素材不依赖 CDN。系统字体的跨机字形并不完全相同，搬迁后重新检查换行。

## 执行

`SKILL_ROOT` 代表此次实际加载的 Skill 目录，`OUTPUT` 是用户项目中新的交付目录。命令中的路径用实际值替换并保持引号。输出不得位于安装的 Skill 目录内。

```bash
python3 "$SKILL_ROOT/scripts/prepare.py" cards "$OUTPUT"
# 或将 cards 改为 wechat
```

编辑 `$OUTPUT/index.html`，添加 `source.md`，将附图放在 `$OUTPUT/assets/`。只有小红书内容经过提炼时需要 `changes.md`。模板中内容是示例，交付前按原稿替换或删除。

```bash
node "$SKILL_ROOT/scripts/render.cjs" cards "$OUTPUT/index.html" "$OUTPUT/rendered"
# 公众号用 wechat
```

输出目录必须不存在，以防覆盖用户编辑或留下旧版本图片。修改后用新的导出目录（例如 `rendered-v2`），交付时明确最新版本。脚本在临时目录中工作，所有机械检查和导出完成后才产生结果目录。

## 导出行为与边界

- 禁用页面脚本，拦截 HTTP(S) 资源。字体、图片和装饰需本地化，页面设计使用静态 HTML/CSS。
- 等待字体就绪与图片加载，缺图即失败；卡片逐页检查尺寸和明显溢出，输出原生浏览器截图。
- 公众号将本地 PNG/JPEG/WebP/GIF 内嵌进 HTML，保留原格式，并导出手机宽度全文截图。配图体积大时先按用途优化，保持透明背景和可读性，不统一有损转换。
- `report.json` 只记录机械检查结果；`platformVerified: false` 表示没有平台验证。导出成功后还必须进行文案核对和视觉审查。
- 公众号结果中 `article-fragment.html` 是给需要 HTML 片段的工具使用的材料；普通公众号编辑器应从浏览器复制渲染正文。图片粘贴失败时按场景说明手动上传。
- 当前 Skill 不含账号登录或发布操作。
