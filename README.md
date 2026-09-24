# 首尔与江陵 · 七日旅行手册

2026 年 10 月 1—7 日。运行文件只有 `public/index.html`；样式、SVG 地图、行程与脚本全部内嵌，无字体、图片、地图 API 或前端库的外部请求。安装依赖仅用于 Cloudflare 发布工具，不影响网页或离线阅读。

## 阅读与离线

直接用浏览器打开 `public/index.html`。线上页面底部的“下载离线手册”会保存完整 HTML；离线时文字、路线图和倒计时可用。Google 地图、官网和电话服务需要相应网络或设备能力。离线副本不会自动更新，出发前重新下载。

所有事件使用带 `+08:00` 或 `+09:00` 的 ISO 时间。页面明暗配色依据设备当地时间，07:00–19:00 为白天。多点路线按游览顺序列出，不把混合交通误当作可连续驾驶路线；手机浏览器的 3 个中途点限制由分段入口补足。

## 通过 Cloudflare Workers 连接 GitHub

使用 Workers 免费方案，不需要买域名。源码仓库可以保持私有，发布后的 `workers.dev` 页面仍可公开匿名访问。

1. 在电脑 Chrome 登录 GitHub 与 Cloudflare。密码、验证码与任何密码重置由账号本人输入。
2. GitHub 专用仓库名为 `korea-trip-2026`，保留目录结构，`public/index.html` 与根目录 `wrangler.jsonc`、`package.json`、`package-lock.json` 一起提交到 `main`。
3. Cloudflare → Workers & Pages → Create application（创建应用）→ 连接 GitHub／Import a repository。不同界面的按钮名称可能略有不同。
4. 若出现 GitHub 安装授权，账号本人确认权限，选择 Only select repositories，仅开放 `korea-trip-2026`。这让 Cloudflare 读取该仓库并监听提交；不需要开放全部仓库。
5. 选择仓库与 `main` 分支，Worker 名称填 `korea-trip-2026`，根目录保持仓库根目录；构建命令留空，部署命令填 `npm run deploy`。不要把根目录改成 `public`，配置文件在仓库根目录。
6. 点击部署。成功后打开 Cloudflare 给出的真实 `workers.dev` 地址；不要开启 Cloudflare Access 登录保护。使用手机或浏览器无痕窗口检查可以匿名访问。
7. 后续修改 `public/index.html`，提交并 push 到 `main`。Cloudflare 会自动发布；分支需在 Settings → Builds 中保持为 `main`。仅修改本地文件或仅执行 commit 而未 push 不会更新线上。

### 哪些必须用电脑

- 本次首次配置由助手操作这台电脑的 Chrome，因此账号登录与出现的安装授权请在这台电脑完成；手机可以接收验证码。
- 如选择自行上传整个目录或在本地执行 Git push，需要电脑。本项目已提供完整目录，不必安装手机 App。
- 平台的登录、仓库设置和授权从技术上也可以在手机浏览器完成，并非平台强制桌面；首次连接建议在电脑一次做完。
- 阅读、分享网址、用地图导航、反馈待办完成情况，手机即可。

### 不需要的操作

不需要购买域名、升级 Workers 付费计划、把 API Token 发给助手、使用 GitHub Actions 或在读者设备安装任何依赖。

## 日常维护

主文件是 `public/index.html`。每次改变行程时间，需同时修改静态时间轴的 `<time datetime>` 和页面末尾 `EVENTS` 数据中的 `at`、`when`、`title`，以保持显示与倒计时一致。改变预订状态时同时更新订单区、时间轴与待办列表。待办项目内容由页面统一发布；勾选进度保存在访问者当前浏览器，不跨设备或多人同步。

不要上传订单截图、原始 PDF、姓名、个人手机、证件号、订单确认号、房号或座位号。`public/` 是唯一发布目录，部署说明不展示在旅行页面。

检查：`npm run check`。发布配置检查：`npx wrangler deploy --dry-run`。

## 官方文档

- [Workers Git 连接](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/)
- [静态资源](https://developers.cloudflare.com/workers/static-assets/get-started/)
- [静态资源计费与限制](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)
- [Google Maps URL 多点限制](https://developers.google.com/maps/documentation/urls/get-started)

## 内容来源

行程来自用户提供的最终攻略及后续订单确认。列车截图与私人信息未纳入仓库。运营来源链接在页面“实用贴士”中；未确定的医美、韩屋行李寄存及未来临时运营公告明确标记为待办。
