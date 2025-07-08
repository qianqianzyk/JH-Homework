# 精弘小论坛前端项目

## 项目简介
本项目为“精弘小论坛”前端部分，基于 Vue 3 + TypeScript + Vite + Element Plus 实现，支持学生与管理员两类用户的注册、登录、发帖、举报、管理等功能。

## 技术栈
- [Vue 3](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Element Plus](https://element-plus.org/)
- [Pinia](https://pinia.vuejs.org/) 状态管理
- [Axios](https://axios-http.com/) 网络请求

## 项目结构
```
JH-Homework/
├── index.html                # 入口 HTML
├── package.json              # 项目依赖与脚本
├── public/                   # 公共资源
├── src/                      # 源码目录
│   ├── apis/                 # 所有 API 封装
│   ├── assets/               # 静态资源
│   ├── components/           # 公共组件
│   ├── pages/                # 主要页面
│   ├── router/               # 路由配置
│   ├── stores/               # Pinia 状态管理
│   ├── types/                # TypeScript 类型定义
│   ├── utilities/            # 工具函数
│   └── style.css             # 全局样式
├── tsconfig.json             # TypeScript 配置
├── vite.config.js            # Vite 配置
└── README.md                 # 项目说明
```

## 主要功能
- 用户注册/登录/登出（支持学生与管理员）
- 论坛发帖、编辑、删除
- 帖子举报与举报理由填写
- 管理员处理举报（同意/拒绝）
- 个人信息与举报记录查询

## 页面说明
- **登录/注册页**：支持账号注册、登录，身份选择（学生/管理员）。
- **首页**：展示所有帖子，支持发帖、编辑、删除、举报。
- **个人中心**：
  - 学生：查看个人信息、举报记录及处理状态。
  - 管理员：查看个人信息、按用户ID查询举报、处理举报。

## 安装与启动
1. 安装依赖（需先安装 [Node.js](https://nodejs.org/) 和 [pnpm](https://pnpm.io/)）：
   ```bash
   pnpm install
   ```
2. 启动开发环境：
   ```bash
   pnpm dev
   ```
3. 构建生产环境：
   ```bash
   pnpm build
   ```
4. 预览生产环境：
   ```bash
   pnpm preview
   ```

## 接口说明
所有 API 已在 `src/apis/` 目录下封装，具体见各模块文件。

## 代理与后端
开发环境下已配置 `/api` 代理至后端服务器（见 `vite.config.js`）。

## 联系方式
- QQ：3265569512
- Designed by qianqianzyk

---
如有问题欢迎 issue 或联系作者。