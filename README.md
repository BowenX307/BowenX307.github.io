# Bowen Xiao — Portfolio

个人作品集，沿用 OtherWise 的视觉和宇宙引擎：近黑底、Newsreader + IBM Plex Mono、颜色只出现在星球上。每颗星球是一个项目。

```bash
npm install
npm run dev      # http://localhost:5181
npm run build    # 输出到 dist/，纯静态
```

线上地址：https://bowenx307.github.io 。push 到 `main` 后，GitHub Actions（`.github/workflows/deploy.yml`）会自动构建并发布，大约 1 分钟。

## 改内容只改一个文件

`src/content.ts`，里面有：

- `projects`：每个项目一颗星球
  - `orbit`：放在哪条轨道
  - `field`：颜色
  - `size`：星球大小
  - `award`：有奖项的星球带环
  - `summary`、`points`、`stack`、`links`：详情页的内容
- `profile`：标题、About、联系方式

宇宙的含义：

| | 规则 |
|---|---|
| 轨道 | 时间，从中心往外：`01 · Foundations`（学校和比赛）→ `02 · First roles` → `03 · Now` |
| 颜色 | 领域：ML & NLP、Research、Software & systems、Design、Data、Math |
| 大小 | 分量 |
| 环 | 获奖 |
| 中心 Orb | 你自己，点它打开 About |

## 链接

| 地址 | 打开什么 |
|---|---|
| `/#about` | About |
| `/#contact` | Contact |
| `/#<项目 id>` | 直接打开那个项目，比如 `/#lenovo`，可以单独发给别人 |
| `/?intro=off` | 跳过开场动画 |

## 键盘和调试

- 键盘：`Esc` 返回，`M` 开关声音（默认关）
- 控制台：`portfolio.wake()` 唤醒，`portfolio.reset()` 回到睡着的 Orb，用来重看开场

## 文件

```
src/content.ts            全部内容
src/pages/Home.tsx        页面：顶栏 + 宇宙
src/components/AppShell   顶栏（Work / About / Contact / Sound）
src/universe/
  UniverseScene.tsx       宇宙渲染、镜头、交互、深链接
  engine.ts               轨道、弹簧物理、开场编排
  Panel.tsx               左列：首页索引、项目详情、About、Contact
  orbCore.ts              中心 Orb（也是 logo）
  starfield.ts            背景星点
  sound.ts                Web Audio 合成的声音
_source/                  简历和 LinkedIn 原件（不提交）
```
