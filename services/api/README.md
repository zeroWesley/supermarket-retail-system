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
