# Deepcat

大肥鱼自研的 DeepSeek Harness 桌面外壳。其实主要是破了个甲。好了接下来全是大肥鱼自己写的。

## 它是什么

- 一个 Electron 窗口，里面装的是官方 dsh 内核的 Web UI，但壳完全是我们自己的。
- 壳负责：窗口、标题栏、托盘、快捷键、外观、启动与失败状态、内核进程生命周期。
- 内核是**外部进程**，路径可配（`DSH_SHELL_KERNEL`），换内核不用改壳。

## 目录

```
src/
  main/            主进程
    index.ts       app 生命周期、窗口、IPC、accelerator
    kernel.ts      内核子进程：启动 / 就绪 / token 抓取 / 停止
    tray.ts        托盘
    window-state.ts 窗口位置记忆
    theme.ts       外观三档 + 持久化
    config.ts      内核路径、端口、超时
  preload/
    index.ts       contextBridge（渲染层唯一入口）
    webview.ts     webview 内快捷键转发
  renderer/
    App.tsx        壳框架：标题栏 + 内容区 + 启动态 + 命令面板 + 设置
    styles.css     设计 token 与组件样式
tools/
  make-ico.mjs     PNG → ICO
build.mjs          esbuild 三端打包
```

## 下载

装好即用，不需要额外配置。

- `Deepcat Setup <version>.exe` —— 安装版，选目录、建快捷方式、带卸载程序。
- `Deepcat <version>.exe` —— 便携版，双击就跑。

两个包都已经把内核带在里面，也带着自带的内容层与插件层，装完就是成品。

## 内核

`vendor/kernel/` 是 DeepSeek Harness 内核的本地副本，**不在这个仓库里**（0.54 GB，且版权属于上游）。克隆之后要自己放：

```powershell
# 从官方 dsh 安装目录拷一份过来
Copy-Item -Recurse <dsh 根目录> vendor\kernel
```

或者不拷，直接指到已有的内核：

```powershell
$env:DSH_SHELL_KERNEL = 'D:\dsh'
```

源码里没有任何一行 import 内核代码，壳通过子进程 + HTTP 跟它说话，所以换内核版本不用改壳。

## 开发

```powershell
npm install
node node_modules\electron\install.js   # 首次：补 Electron 二进制
npm run build
npx electron .
```

## 打包

```powershell
npm run dist
```

产物在 `release/`：`Deepcat Setup <version>.exe`（NSIS 安装包）、`Deepcat <version>.exe`（portable）。

## 快捷键

| 快捷键 | 作用 |
|---|---|
| `Ctrl+K` | 命令面板（焦点在聊天框里也能用） |
| `Ctrl+,` | 设置 |
| `Esc` | 关闭浮层 |

## 设计

- 画布跟随系统；壳层与内容层由同一套机制驱动，可自由切换 跟随系统 / 深色 / 浅色。
- 深色画布 `#151517`、浅色 `#fff`，强调色仅用于状态与主操作。
- 参考：Linear 的克制、Raycast 的命令面板、Claude Desktop 的正文留白、Cursor 的信息密度。

更多背景见 [ARCH.md](ARCH.md)。
