const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 8787);
const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const SEED_FILE = path.join(DATA_DIR, "seed.json");

function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) fs.copyFileSync(SEED_FILE, DB_FILE);
}

function readDb() {
  ensureDb();
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function writeDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function send(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => { raw += chunk; });
    req.on("end", () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
  });
}

function nowTime() {
  return new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
}

function log(db, actor, action, target) {
  db.logs.unshift({ time: nowTime(), actor: actor || "系统", action, target, result: "成功" });
  db.logs = db.logs.slice(0, 50);
}

function publicProduct(product) {
  return {
    ...product,
    oldPrice: product.oldPrice,
    desc: product.desc || product.tag,
    icon: product.icon || product.name.slice(0, 1)
  };
}

const resourceLabels = {
  products: "商品",
  promotions: "活动",
  coupons: "优惠券",
  campaigns: "活动投放",
  orders: "订单",
  stores: "门店",
  accounts: "账号"
};

function publicCampaigns(db) {
  const coupons = db.coupons || [];
  return (db.campaigns || [])
    .filter((item) => item.status === "进行中")
    .sort((a, b) => Number(a.sort || 99) - Number(b.sort || 99))
    .map((item) => ({
      ...item,
      coupon: coupons.find((coupon) => coupon.id === item.couponId) || null
    }));
}

function routeResource(db, name, req, res, id) {
  if (!db[name]) return send(res, 404, { message: "Not found" });
  if (req.method === "GET") {
    return send(res, 200, id ? db[name].find((item) => item.id === id) : db[name]);
  }
  return readBody(req).then((body) => {
    const { actor, ...payload } = body;
    const label = resourceLabels[name] || name;
    if (req.method === "POST") {
      const item = { id: payload.id || `${name}-${Date.now()}`, ...payload };
      db[name].unshift(item);
      log(db, actor, `新增${label}`, item.name || item.id);
      writeDb(db);
      return send(res, 201, item);
    }
    if ((req.method === "PUT" || req.method === "PATCH") && id) {
      const index = db[name].findIndex((item) => item.id === id);
      if (index < 0) return send(res, 404, { message: "Not found" });
      db[name][index] = { ...db[name][index], ...payload, id };
      log(db, actor, `更新${label}`, db[name][index].name || id);
      writeDb(db);
      return send(res, 200, db[name][index]);
    }
    if (req.method === "DELETE" && id) {
      const item = db[name].find((entry) => entry.id === id);
      db[name] = db[name].filter((entry) => entry.id !== id);
      log(db, actor, `删除${label}`, item?.name || id);
      writeDb(db);
      return send(res, 200, { ok: true });
    }
    return send(res, 405, { message: "Method not allowed" });
  });
}

async function handler(req, res) {
  if (req.method === "OPTIONS") return send(res, 204, {});
  const url = new URL(req.url, `http://${req.headers.host}`);
  const parts = url.pathname.split("/").filter(Boolean);
  const db = readDb();

  try {
    if (url.pathname === "/health") return send(res, 200, { ok: true });
    if (url.pathname === "/api/reset" && req.method === "POST") {
      fs.copyFileSync(SEED_FILE, DB_FILE);
      return send(res, 200, readDb());
    }
    if (url.pathname === "/api/bootstrap") {
      return send(res, 200, {
        stores: db.stores,
        categories: db.categories,
        products: db.products.map(publicProduct),
        promotions: db.promotions,
        coupons: db.coupons || [],
        campaigns: db.campaigns || [],
        orders: db.orders,
        accounts: db.accounts,
        logs: db.logs
      });
    }
    if (url.pathname === "/api/login" && req.method === "POST") {
      const body = await readBody(req);
      const account = db.accounts.find((item) => item.username === body.username && item.password === body.password && item.status === "启用");
      if (!account) return send(res, 401, { message: "账号或密码错误" });
      const { password, ...safeAccount } = account;
      return send(res, 200, safeAccount);
    }
    if (url.pathname === "/api/public/products") {
      return send(res, 200, db.products.filter((item) => item.status === "已上架").map(publicProduct));
    }
    if (url.pathname === "/api/public/promotions") {
      return send(res, 200, db.promotions.filter((item) => item.status === "进行中"));
    }
    if (url.pathname === "/api/public/campaigns") return send(res, 200, publicCampaigns(db));
    if (url.pathname === "/api/public/coupons") return send(res, 200, (db.coupons || []).filter((item) => item.status === "启用"));
    if (url.pathname === "/api/public/categories") return send(res, 200, db.categories);
    if (url.pathname === "/api/public/orders" && req.method === "POST") {
      const body = await readBody(req);
      const order = {
        id: `${Date.now()}`,
        user: body.user || "李先生",
        phone: body.phone || "138****8888",
        address: body.address || "绿洲小区 3 栋 1602",
        amount: Number(body.amount || 0),
        store: body.store || "城南店",
        status: "待接单",
        items: body.items || "用户下单商品",
        remark: body.remark || "",
        abnormal: "",
        timeline: ["模拟支付成功", "等待员工接单"]
      };
      db.orders.unshift(order);
      log(db, "C端用户", "提交订单", `#${order.id}`);
      writeDb(db);
      return send(res, 201, order);
    }
    if (url.pathname === "/api/public/orders") return send(res, 200, db.orders);
    if (url.pathname === "/api/staff/orders") return send(res, 200, db.orders);
    if (parts[0] === "api" && parts[1] === "staff" && parts[2] === "orders" && parts[4] === "status" && req.method === "PATCH") {
      const body = await readBody(req);
      const order = db.orders.find((item) => item.id === parts[3]);
      if (!order) return send(res, 404, { message: "Not found" });
      order.status = body.status;
      order.timeline = [...(order.timeline || []), `员工更新为${body.status}`];
      log(db, "员工端", "订单状态更新", `#${order.id} ${body.status}`);
      writeDb(db);
      return send(res, 200, order);
    }
    if (parts[0] === "api" && parts[1] === "products") return routeResource(db, "products", req, res, parts[2]);
    if (parts[0] === "api" && parts[1] === "promotions") return routeResource(db, "promotions", req, res, parts[2]);
    if (parts[0] === "api" && parts[1] === "coupons") return routeResource(db, "coupons", req, res, parts[2]);
    if (parts[0] === "api" && parts[1] === "campaigns") return routeResource(db, "campaigns", req, res, parts[2]);
    if (parts[0] === "api" && parts[1] === "orders") return routeResource(db, "orders", req, res, parts[2]);
    if (parts[0] === "api" && parts[1] === "stores") return routeResource(db, "stores", req, res, parts[2]);
    if (parts[0] === "api" && parts[1] === "accounts") return routeResource(db, "accounts", req, res, parts[2]);
    if (parts[0] === "api" && parts[1] === "logs") return send(res, 200, db.logs);
    return send(res, 404, { message: "Not found" });
  } catch (error) {
    return send(res, 500, { message: error.message });
  }
}

const server = http.createServer(handler);

server.on("error", (error) => {
  console.error(`Zero API failed to start: ${error.message}`);
  process.exitCode = 1;
});

server.listen(PORT, "127.0.0.1", () => {
  ensureDb();
  console.log(`Zero API listening on http://127.0.0.1:${PORT}`);
});
