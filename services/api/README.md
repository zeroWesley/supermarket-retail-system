# Zero便利超市本地 API

这是 MVP 联调用的轻量 Node.js API，不依赖第三方包。

## 启动

```bash
node services/api/server.js
```

默认地址：

```text
http://127.0.0.1:8787
```

## 常用接口

- `GET /health`
- `GET /api/bootstrap`
- `POST /api/login`
- `GET /api/public/products`
- `GET /api/public/categories`
- `GET /api/public/orders`
- `POST /api/public/orders`
- `GET/POST/PATCH/DELETE /api/products`
- `GET/POST/PATCH/DELETE /api/promotions`
- `GET/POST/PATCH/DELETE /api/orders`
- `GET/POST/PATCH/DELETE /api/stores`
- `GET/POST/PATCH/DELETE /api/accounts`

数据文件位于 `services/api/data/db.json`。首次启动会从 `seed.json` 复制生成。

## 演示数据

如果需要恢复到内置演示数据，启动 API 后调用：

```bash
curl -X POST http://127.0.0.1:8787/api/reset
```

当前 `seed.json` 包含多门店、商品、生鲜酒水、库存预警、营销活动、订单状态和权限账号等验证数据。

## 测试账号

| 账号 | 密码 | 用途 |
| --- | --- | --- |
| `admin` | `admin123` | 系统管理员，可进入管理端和运营端 |
| `operator` | `ops123` | 普通运营，仅有商品管理权限 |
| `opsfull` | `ops123` | 全权限运营人员 |
| `promo` | `ops123` | 活动运营，仅有商品管理和营销活动权限 |
| `storekeeper` | `ops123` | 门店店长，有库存、订单和门店配置权限 |
| `staff` | `staff123` | 员工端演示账号 |
