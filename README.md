# Supermarket Retail System

Zero便利超市零售系统，当前包含原型展示、个人分享入口，以及 C端用户微信小程序首版代码。

## 小程序 AppID

- C端用户小程序：`wx96dae1169f62c178`
- 员工端小程序：`wx1d0c7b230e8730dc`

## 项目结构

```text
apps/
  consumer-miniapp/   C端用户微信小程序，AppID: wx96dae1169f62c178
  staff-miniapp/      员工端微信小程序，AppID: wx1d0c7b230e8730dc
  admin-web/          网页管理端 + 运营端，静态演示应用
outputs/
  prototype/          四端交互原型
  prototype_v1/       已保留的 V1 原型
  share/              个人分享入口页
work/
  requirements.txt    需求文档提取内容
```

## 当前进度

- 已完成 C端用户小程序原生项目骨架。
- 已完成首页、分类、商品详情、购物车、订单、我的页面。
- 已记录员工端微信小程序 AppID。
- 已完成员工端小程序原生项目骨架。
- 已完成员工端工作台、订单处理、拣货核验、扫码出入库、配送任务页面。
- 已完成网页后台静态演示应用，包含运营端和管理端。
- 已整理 GitHub Pages 静态发布目录 `docs/`。
- 当前使用本地模拟数据，支付为模拟流程。
- MVP 演示版已成型，后续重点是接入后端 API、数据库和真实小程序体验版发布。

## 查看方式

### 1. 本地查看网页原型

打开：

```text
outputs/share/index.html
```

或：

```text
outputs/prototype/index.html
```

后台应用：

```text
outputs/admin-web/index.html
```

后台演示账号：

```text
管理员：admin / admin123
普通运营人员：operator / ops123
```

### 2. GitHub Pages 线上查看

仓库推送后，在 GitHub 仓库中进入：

```text
Settings -> Pages
```

设置：

```text
Source: Deploy from a branch
Branch: main
Folder: /docs
```

保存后，线上入口通常是：

```text
https://zerowesley.github.io/supermarket-retail-system/
```

后台应用线上地址通常是：

```text
https://zerowesley.github.io/supermarket-retail-system/admin-web/
```

### 3. 微信开发者工具打开 C端小程序

导入目录：`apps/consumer-miniapp`

AppID：`wx96dae1169f62c178`

### 4. 微信开发者工具打开员工端小程序

导入目录：`apps/staff-miniapp`

AppID：`wx1d0c7b230e8730dc`
