const STORAGE_KEY = "zero-admin-web-v3";
const API_BASE = localStorage.getItem("ZERO_API_BASE") || "http://127.0.0.1:8787";

const operatePages = ["dashboard", "products", "inventory", "promotions", "orders", "stores"];
const managePages = ["accounts", "permissions", "logs"];

const seedData = {
  products: [
    { id: "beer-qingdao", name: "青岛啤酒 500ml 单罐", category: "酒水饮料", price: 5.5, stock: 126, threshold: 24, status: "已上架", tag: "限时特价" },
    { id: "apple-fuji", name: "烟台红富士苹果 约500g", category: "水果生鲜", price: 6.9, stock: 42, threshold: 20, status: "已上架", tag: "满减可用" },
    { id: "milk-fresh", name: "鲜牛奶 950ml 冷藏配送", category: "冷藏乳品", price: 13.8, stock: 8, threshold: 12, status: "已上架", tag: "库存预警" },
    { id: "vegetable-green", name: "精选上海青 约400g", category: "水果生鲜", price: 4.99, stock: 32, threshold: 10, status: "已上架", tag: "今日到货" },
    { id: "chips", name: "原味薯片 104g", category: "休闲零食", price: 8.8, stock: 58, threshold: 16, status: "已下架", tag: "第二件半价" }
  ],
  promotions: [
    { id: "promo-full-79", name: "满79减10", type: "满减", target: "全场商品", start: "2026-06-21", end: "2026-06-30", status: "进行中", metric: "已用 38 次" },
    { id: "promo-beer-night", name: "酒水夜间特价", type: "限时特价", target: "酒水饮料", start: "2026-06-21", end: "2026-07-05", status: "进行中", metric: "销售 126 件" },
    { id: "promo-new-user", name: "新人优惠券", type: "优惠券", target: "新用户", start: "2026-06-21", end: "长期", status: "待启用", metric: "未开始" }
  ],
  orders: [
    { id: "20260621001", user: "李先生", amount: 63.6, store: "城南店", status: "配送中", items: "青岛啤酒、苹果、牛奶等 3 件", abnormal: "" },
    { id: "20260621002", user: "周女士", amount: 48.2, store: "城北店", status: "待拣货", items: "上海青、鸡蛋、调味料等 5 件", abnormal: "" },
    { id: "20260621003", user: "王先生", amount: 132, store: "城南店", status: "缺货异常", items: "鲜牛奶、酒水等 6 件", abnormal: "鲜牛奶库存不足" }
  ],
  stores: [
    { id: "south", name: "城南店", address: "绿洲路 88 号", staff: 8, radius: "3km", status: "营业中" },
    { id: "north", name: "城北店", address: "云桥路 19 号", staff: 5, radius: "2.5km", status: "营业中" }
  ],
  accounts: [
    {
      id: "admin",
      username: "admin",
      password: "admin123",
      name: "系统管理员",
      phone: "138****0001",
      role: "系统管理员",
      store: "全部门店",
      status: "启用",
      workspaces: ["manage", "operate"],
      permissions: [...managePages, ...operatePages]
    },
    {
      id: "operator",
      username: "operator",
      password: "ops123",
      name: "李运营",
      phone: "138****0003",
      role: "运营人员",
      store: "全部门店",
      status: "启用",
      workspaces: ["operate"],
      permissions: ["products"]
    },
    {
      id: "staff-zhang",
      username: "staff",
      password: "staff123",
      name: "张师傅",
      phone: "138****0002",
      role: "配送/拣货员工",
      store: "城南店",
      status: "启用",
      workspaces: [],
      permissions: []
    }
  ],
  logs: [
    { time: "14:20", actor: "王店长", action: "新增账号", target: "张师傅", result: "成功" },
    { time: "13:42", actor: "李运营", action: "修改活动", target: "满79减10", result: "成功" },
    { time: "12:18", actor: "张师傅", action: "库存入库", target: "青岛啤酒 +36", result: "成功" }
  ]
};

let state = loadState();
let currentRole = "operate";
let currentPage = "dashboard";
let currentUser = null;
let apiOnline = false;

const content = document.getElementById("content");
const pageTitle = document.getElementById("pageTitle");
const pageDesc = document.getElementById("pageDesc");
const loginScreen = document.getElementById("loginScreen");
const entryScreen = document.getElementById("entryScreen");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalForm = document.getElementById("modalForm");
const toast = document.getElementById("toast");

const pageMeta = {
  dashboard: ["经营概览", "查看门店经营、订单履约、库存预警和活动效果。"],
  products: ["商品管理", "新增、编辑、上下架商品，并同步到 C端小程序展示。"],
  inventory: ["库存管理", "查看实时库存、库存预警、人工修正和出入库记录。"],
  promotions: ["营销活动", "配置满减、优惠券、限时特价、秒杀等活动。"],
  orders: ["订单管理", "查看全量订单，处理异常订单并调整履约状态。"],
  stores: ["门店配置", "维护门店地址、营业状态、配送范围和员工数量。"],
  accounts: ["账号管理", "添加、停用和删除后台账号，并绑定门店角色。"],
  permissions: ["角色权限", "配置系统管理员、运营人员、店长和员工的菜单权限。"],
  logs: ["操作日志", "查看账号、活动、库存、订单等关键操作记录。"]
};

const menuLabels = {
  dashboard: "经营概览",
  products: "商品管理",
  inventory: "库存管理",
  promotions: "营销活动",
  orders: "订单管理",
  stores: "门店配置",
  accounts: "账号管理",
  permissions: "角色权限",
  logs: "操作日志"
};

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return structuredClone(seedData);
  try {
    return JSON.parse(saved);
  } catch {
    return structuredClone(seedData);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  if (!response.ok) throw new Error(`API ${response.status}`);
  return response.json();
}

async function loadRemoteState() {
  try {
    const data = await apiRequest("/api/bootstrap");
    state = { ...state, ...data };
    apiOnline = true;
    saveState();
    render();
    showToast("已连接本地 API");
  } catch {
    apiOnline = false;
  }
}

async function syncResource(resource, item, method = "POST") {
  if (!apiOnline) return;
  const path = method === "POST" ? `/api/${resource}` : `/api/${resource}/${item.id}`;
  try {
    await apiRequest(path, { method, body: { ...item, actor: currentUser?.name } });
  } catch {
    showToast("API 同步失败，已保留本地演示数据");
  }
}

async function deleteResource(resource, id) {
  if (!apiOnline) return;
  try {
    await apiRequest(`/api/${resource}/${id}`, { method: "DELETE", body: { actor: currentUser?.name } });
  } catch {
    showToast("API 删除同步失败");
  }
}

function showToast(text = "已保存") {
  toast.textContent = text;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1300);
}

function money(value) {
  return `¥${Number(value).toFixed(2)}`;
}

function tag(text) {
  const cls = text.includes("异常") || text.includes("预警") ? "danger" : text.includes("待") || text.includes("下架") ? "warn" : "";
  return `<span class="tag ${cls}">${text}</span>`;
}

function workspaceText(workspaces = []) {
  if (!workspaces.length) return "无后台入口";
  return workspaces.map((item) => item === "manage" ? "管理端" : "运营端").join("、");
}

function operatePermissionText(account) {
  const permissions = account.permissions || [];
  const operatePermissions = permissions.filter((page) => operatePages.includes(page));
  return operatePermissions.map((page) => menuLabels[page]).filter(Boolean).join("、") || "未授权";
}

function isAdminAccount(account = currentUser) {
  return account?.role === "系统管理员";
}

function log(action, target) {
  state.logs.unshift({
    time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
    actor: currentUser?.name || (currentRole === "manage" ? "系统管理员" : "李运营"),
    action,
    target,
    result: "成功"
  });
  state.logs = state.logs.slice(0, 20);
  saveState();
}

function userHasPage(page) {
  return currentUser?.permissions?.includes(page);
}

function firstAllowedPage(role) {
  const pages = role === "manage" ? managePages : operatePages;
  return pages.find(userHasPage);
}

function applyMenuPermissions() {
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    const page = btn.dataset.page;
    btn.classList.toggle("hidden", !userHasPage(page));
  });
}

function updateUserLabels() {
  const text = currentUser ? `当前登录：${currentUser.name}（${currentUser.role}）` : "未登录";
  document.getElementById("currentUserLabel").textContent = text;
  document.getElementById("entryUserLabel").textContent = text;
}

async function handleLogin(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  let account = null;
  if (apiOnline) {
    try {
      account = await apiRequest("/api/login", { method: "POST", body: data });
    } catch {
      account = null;
    }
  }
  if (!account) account = state.accounts.find((item) => item.username === data.username && item.password === data.password && item.status === "启用");
  if (!account) {
    showToast("账号或密码错误");
    return;
  }
  currentUser = account;
  updateUserLabels();
  loginScreen.classList.add("hidden");
  if (account.workspaces.includes("manage") && account.workspaces.includes("operate")) {
    entryScreen.classList.remove("hidden");
  } else if (account.workspaces.includes("operate")) {
    enterWorkspace("operate");
  } else if (account.workspaces.includes("manage")) {
    enterWorkspace("manage");
  } else {
    showToast("当前账号无后台权限");
    loginScreen.classList.remove("hidden");
  }
}

function logout() {
  currentUser = null;
  updateUserLabels();
  entryScreen.classList.add("hidden");
  loginScreen.classList.remove("hidden");
}

function setRole(role) {
  if (role === "manage" && !isAdminAccount()) {
    showToast("只有管理员可进入管理端");
    return;
  }
  currentRole = role;
  document.querySelectorAll(".role-btn").forEach((btn) => btn.classList.toggle("active", btn.dataset.role === role));
  document.querySelector(".nav-operate").classList.toggle("hidden", role !== "operate");
  document.querySelector(".nav-manage").classList.toggle("hidden", role !== "manage");
  applyMenuPermissions();
  const page = firstAllowedPage(role);
  if (!page) {
    content.innerHTML = `<section class="panel"><h2>暂无可访问菜单</h2><p class="muted">请联系管理员授予当前后台的菜单权限。</p></section>`;
    pageTitle.textContent = role === "operate" ? "运营端" : "管理端";
    pageDesc.textContent = "当前账号没有可访问菜单。";
    return;
  }
  setPage(page);
}

function enterWorkspace(role) {
  if (role === "manage" && !isAdminAccount()) {
    showToast("只有管理员可进入管理端");
    return;
  }
  entryScreen.classList.add("hidden");
  setRole(role);
}

function backToEntry() {
  if (currentUser?.workspaces?.includes("manage") && currentUser?.workspaces?.includes("operate")) {
    entryScreen.classList.remove("hidden");
  } else {
    showToast("当前账号只有一个后台入口");
  }
}

function setPage(page) {
  currentPage = page;
  document.querySelectorAll(".nav-btn").forEach((btn) => btn.classList.toggle("active", btn.dataset.page === page));
  pageTitle.textContent = pageMeta[page][0];
  pageDesc.textContent = pageMeta[page][1];
  render();
}

function render() {
  const renderers = {
    dashboard: renderDashboard,
    products: renderProducts,
    inventory: renderInventory,
    promotions: renderPromotions,
    orders: renderOrders,
    stores: renderStores,
    accounts: renderAccounts,
    permissions: renderPermissions,
    logs: renderLogs
  };
  content.innerHTML = renderers[currentPage]();
  bindPageActions();
}

function renderDashboard() {
  const orderCount = state.orders.length;
  const revenue = state.orders.reduce((sum, item) => sum + item.amount, 0);
  const warningCount = state.products.filter((item) => item.stock <= item.threshold).length;
  const activePromo = state.promotions.filter((item) => item.status === "进行中").length;
  return `
    <div class="metric-grid">
      <div class="metric"><span>今日订单</span><strong>${orderCount}</strong><small>模拟数据</small></div>
      <div class="metric"><span>模拟销售额</span><strong>${money(revenue)}</strong><small>含配送费</small></div>
      <div class="metric"><span>库存预警</span><strong>${warningCount}</strong><small>低于阈值</small></div>
      <div class="metric"><span>进行中活动</span><strong>${activePromo}</strong><small>同步 C端</small></div>
    </div>
    <div class="two-col">
      <section class="panel">
        <div class="panel-head"><h2>待处理订单</h2><button class="secondary" data-nav="orders">查看订单</button></div>
        ${orderTable(state.orders.filter((item) => item.status !== "已完成").slice(0, 3))}
      </section>
      <section class="panel">
        <div class="panel-head"><h2>库存预警</h2><button class="secondary" data-nav="inventory">去处理</button></div>
        ${inventoryTable(state.products.filter((item) => item.stock <= item.threshold))}
      </section>
    </div>
    <section class="panel">
      <div class="panel-head"><h2>业务流程</h2><span class="tag">演示版</span></div>
      <div class="flow">
        <div>后台配置商品/活动</div>
        <div>C端展示并下单</div>
        <div>员工接单拣货</div>
        <div>人工确认扣库存</div>
        <div>员工自配送完成</div>
      </div>
    </section>
  `;
}

function renderProducts() {
  return `
    <section class="panel">
      <div class="panel-head">
        <h2>商品列表</h2>
        <button class="primary" data-open="product">新增商品</button>
      </div>
      <div class="tool-row">
        <input class="input" id="productKeyword" placeholder="商品名称/分类">
        <button class="secondary" data-filter="products">查询</button>
      </div>
      <div id="productTable">${productTable(state.products)}</div>
    </section>
  `;
}

function renderInventory() {
  return `
    <section class="panel">
      <div class="panel-head">
        <h2>库存列表</h2>
        <button class="primary" data-open="stock">人工库存修正</button>
      </div>
      <div class="tool-row">
        <select class="select"><option>城南店</option><option>城北店</option></select>
        <span class="store-pill">低于阈值自动预警</span>
      </div>
      ${inventoryTable(state.products, true)}
    </section>
  `;
}

function renderPromotions() {
  return `
    <section class="panel">
      <div class="panel-head">
        <h2>营销活动</h2>
        <button class="primary" data-open="promotion">新建活动</button>
      </div>
      <table>
        <thead><tr><th>活动</th><th>类型</th><th>时间</th><th>适用范围</th><th>状态</th><th>效果</th><th>操作</th></tr></thead>
        <tbody>
          ${state.promotions.map((item) => `
            <tr>
              <td>${item.name}</td>
              <td>${item.type}</td>
              <td>${item.start} 至 ${item.end}</td>
              <td>${item.target}</td>
              <td>${tag(item.status)}</td>
              <td>${item.metric}</td>
              <td class="table-actions">
                <button class="link-btn" data-toggle-promo="${item.id}">${item.status === "进行中" ? "停用" : "启用"}</button>
                <button class="link-btn" data-delete-promo="${item.id}">删除</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </section>
  `;
}

function renderOrders() {
  return `
    <section class="panel">
      <div class="panel-head"><h2>订单管理</h2><button class="secondary">导出模拟数据</button></div>
      ${orderTable(state.orders, true)}
    </section>
  `;
}

function renderStores() {
  return `
    <section class="panel">
      <div class="panel-head"><h2>门店配置</h2><button class="primary" data-open="store">新增门店</button></div>
      <table>
        <thead><tr><th>门店</th><th>地址</th><th>员工</th><th>配送范围</th><th>状态</th><th>操作</th></tr></thead>
        <tbody>
          ${state.stores.map((item) => `
            <tr>
              <td>${item.name}</td>
              <td>${item.address}</td>
              <td>${item.staff} 人</td>
              <td>${item.radius}</td>
              <td>${tag(item.status)}</td>
              <td><button class="link-btn" data-toggle-store="${item.id}">${item.status === "营业中" ? "暂停营业" : "开始营业"}</button></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </section>
  `;
}

function renderAccounts() {
  return `
    <section class="panel">
      <div class="panel-head"><h2>账号管理</h2><button class="primary" data-open="account">新增账号</button></div>
      <table>
        <thead><tr><th>账号</th><th>登录名</th><th>手机号</th><th>角色</th><th>后台入口</th><th>运营端菜单权限</th><th>状态</th><th>操作</th></tr></thead>
        <tbody>
          ${state.accounts.map((item) => `
            <tr>
              <td>${item.name}</td>
              <td>${item.username || "-"}</td>
              <td>${item.phone}</td>
              <td>${item.role}</td>
              <td>${workspaceText(item.workspaces)}</td>
              <td>${isAdminAccount(item) ? "全部后台权限" : operatePermissionText(item)}</td>
              <td>${tag(item.status)}</td>
              <td class="table-actions">
                ${isAdminAccount(item) ? '<span class="muted">管理员默认全权限</span>' : `<button class="link-btn" data-edit-permission="${item.id}">授予权限</button>`}
                <button class="link-btn" data-toggle-account="${item.id}">${item.status === "启用" ? "停用" : "启用"}</button>
                <button class="link-btn" data-delete-account="${item.id}">删除</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </section>
  `;
}

function renderPermissions() {
  return `
    <section class="panel">
      <div class="panel-head"><h2>运营端菜单权限</h2><span class="store-pill">管理端仅管理员可进入，管理员默认全权限</span></div>
      <table>
        <thead><tr><th>账号</th><th>角色</th><th>后台入口</th><th>运营端菜单权限</th><th>操作</th></tr></thead>
        <tbody>
          ${state.accounts.map((item) => `
            <tr>
              <td>${item.name}<br><span class="muted">${item.username || "-"}</span></td>
              <td>${item.role}</td>
              <td>${workspaceText(item.workspaces)}</td>
              <td>${isAdminAccount(item) ? "全部后台权限" : operatePermissionText(item)}</td>
              <td>${isAdminAccount(item) ? '<span class="muted">无需单独授权</span>' : `<button class="link-btn" data-edit-permission="${item.id}">编辑权限</button>`}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </section>
    <section class="panel">
      <div class="panel-head"><h2>权限示例</h2></div>
      <p class="muted">普通运营账号默认只授予“商品管理”，所以登录后只能看到商品管理菜单，不会看到经营数据、活动配置或订单数据。管理端固定只允许系统管理员进入。</p>
    </section>
  `;
}

function renderLogs() {
  return `
    <section class="panel">
      <div class="panel-head"><h2>操作日志</h2><button class="secondary">导出日志</button></div>
      <table>
        <thead><tr><th>时间</th><th>操作人</th><th>动作</th><th>对象</th><th>结果</th></tr></thead>
        <tbody>
          ${state.logs.map((item) => `<tr><td>${item.time}</td><td>${item.actor}</td><td>${item.action}</td><td>${item.target}</td><td>${tag(item.result)}</td></tr>`).join("")}
        </tbody>
      </table>
    </section>
  `;
}

function productTable(items) {
  return `
    <table>
      <thead><tr><th>商品</th><th>分类</th><th>售价</th><th>库存</th><th>标签</th><th>状态</th><th>操作</th></tr></thead>
      <tbody>
        ${items.map((item) => `
          <tr>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${money(item.price)}</td>
            <td>${item.stock}</td>
            <td>${item.tag}</td>
            <td>${tag(item.status)}</td>
            <td class="table-actions">
              <button class="link-btn" data-toggle-product="${item.id}">${item.status === "已上架" ? "下架" : "上架"}</button>
              <button class="link-btn" data-adjust-stock="${item.id}">调库存</button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function inventoryTable(items, withActions = false) {
  return `
    <table>
      <thead><tr><th>商品</th><th>可售库存</th><th>预警阈值</th><th>最近变动</th><th>状态</th>${withActions ? "<th>操作</th>" : ""}</tr></thead>
      <tbody>
        ${items.map((item) => `
          <tr>
            <td>${item.name}</td>
            <td>${item.stock}</td>
            <td>${item.threshold}</td>
            <td>${item.tag}</td>
            <td>${tag(item.stock <= item.threshold ? "预警" : "正常")}</td>
            ${withActions ? `<td><button class="link-btn" data-adjust-stock="${item.id}">人工修正</button></td>` : ""}
          </tr>
        `).join("") || `<tr><td colspan="${withActions ? 6 : 5}">暂无预警商品</td></tr>`}
      </tbody>
    </table>
  `;
}

function orderTable(items, withActions = false) {
  return `
    <table>
      <thead><tr><th>订单号</th><th>用户</th><th>金额</th><th>门店</th><th>商品</th><th>状态</th>${withActions ? "<th>操作</th>" : ""}</tr></thead>
      <tbody>
        ${items.map((item) => `
          <tr>
            <td>#${item.id}</td>
            <td>${item.user}</td>
            <td>${money(item.amount)}</td>
            <td>${item.store}</td>
            <td>${item.items}</td>
            <td>${tag(item.status)}</td>
            ${withActions ? `<td class="table-actions"><button class="link-btn" data-next-order="${item.id}">流转状态</button><button class="link-btn" data-abnormal-order="${item.id}">异常处理</button></td>` : ""}
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function bindPageActions() {
  document.querySelectorAll("[data-nav]").forEach((btn) => btn.addEventListener("click", () => setPage(btn.dataset.nav)));
  document.querySelectorAll("[data-open]").forEach((btn) => btn.addEventListener("click", () => openForm(btn.dataset.open)));
  document.querySelectorAll("[data-toggle-product]").forEach((btn) => btn.addEventListener("click", () => toggleProduct(btn.dataset.toggleProduct)));
  document.querySelectorAll("[data-adjust-stock]").forEach((btn) => btn.addEventListener("click", () => openStockForm(btn.dataset.adjustStock)));
  document.querySelectorAll("[data-toggle-promo]").forEach((btn) => btn.addEventListener("click", () => togglePromo(btn.dataset.togglePromo)));
  document.querySelectorAll("[data-delete-promo]").forEach((btn) => btn.addEventListener("click", () => deletePromo(btn.dataset.deletePromo)));
  document.querySelectorAll("[data-next-order]").forEach((btn) => btn.addEventListener("click", () => nextOrder(btn.dataset.nextOrder)));
  document.querySelectorAll("[data-abnormal-order]").forEach((btn) => btn.addEventListener("click", () => abnormalOrder(btn.dataset.abnormalOrder)));
  document.querySelectorAll("[data-toggle-store]").forEach((btn) => btn.addEventListener("click", () => toggleStore(btn.dataset.toggleStore)));
  document.querySelectorAll("[data-toggle-account]").forEach((btn) => btn.addEventListener("click", () => toggleAccount(btn.dataset.toggleAccount)));
  document.querySelectorAll("[data-delete-account]").forEach((btn) => btn.addEventListener("click", () => deleteAccount(btn.dataset.deleteAccount)));
  document.querySelectorAll("[data-edit-permission]").forEach((btn) => btn.addEventListener("click", () => openPermissionForm(btn.dataset.editPermission)));
  document.querySelectorAll("[data-save-permissions]").forEach((btn) => btn.addEventListener("click", () => showToast("权限已保存")));
  const filterBtn = document.querySelector("[data-filter='products']");
  if (filterBtn) filterBtn.addEventListener("click", filterProducts);
}

function openForm(type) {
  const map = {
    product: ["新增商品", productForm()],
    promotion: ["新建活动", promotionForm()],
    stock: ["人工库存修正", stockForm()],
    store: ["新增门店", storeForm()],
    account: ["新增账号", accountForm()]
  };
  modalTitle.textContent = map[type][0];
  modalForm.innerHTML = map[type][1];
  modalForm.dataset.type = type;
  modal.classList.remove("hidden");
}

function openStockForm(id) {
  const product = state.products.find((item) => item.id === id);
  modalTitle.textContent = "人工库存修正";
  modalForm.innerHTML = stockForm(product);
  modalForm.dataset.type = "stock";
  modal.classList.remove("hidden");
}

function openPermissionForm(id) {
  const account = state.accounts.find((item) => item.id === id);
  if (isAdminAccount(account)) {
    showToast("管理员默认拥有全部权限");
    return;
  }
  modalTitle.textContent = `授予权限：${account.name}`;
  modalForm.innerHTML = permissionForm(account);
  modalForm.dataset.type = "permission";
  modal.classList.remove("hidden");
}

function productForm() {
  return `
    <div class="form-grid">
      <div class="form-field"><label>商品名称</label><input class="input" name="name" required></div>
      <div class="form-field"><label>分类</label><input class="input" name="category" value="水果生鲜" required></div>
      <div class="form-field"><label>售价</label><input class="input" name="price" type="number" step="0.01" value="9.90" required></div>
      <div class="form-field"><label>库存</label><input class="input" name="stock" type="number" value="20" required></div>
      <div class="form-field"><label>预警阈值</label><input class="input" name="threshold" type="number" value="10" required></div>
      <div class="form-field"><label>标签</label><input class="input" name="tag" value="新品"></div>
    </div>
    <div class="panel-head" style="margin-top:18px"><button class="primary">保存商品</button></div>
  `;
}

function promotionForm() {
  return `
    <div class="form-grid">
      <div class="form-field"><label>活动名称</label><input class="input" name="name" required></div>
      <div class="form-field"><label>类型</label><select class="select" name="type"><option>满减</option><option>优惠券</option><option>限时特价</option><option>秒杀</option></select></div>
      <div class="form-field"><label>开始日期</label><input class="input" name="start" type="date" value="2026-06-21"></div>
      <div class="form-field"><label>结束日期</label><input class="input" name="end" type="date" value="2026-06-30"></div>
      <div class="form-field full"><label>适用范围</label><input class="input" name="target" value="全场商品"></div>
    </div>
    <div class="panel-head" style="margin-top:18px"><button class="primary">保存活动</button></div>
  `;
}

function stockForm(product = state.products[0]) {
  return `
    <div class="form-grid">
      <input type="hidden" name="id" value="${product.id}">
      <div class="form-field"><label>商品</label><input class="input" value="${product.name}" disabled></div>
      <div class="form-field"><label>当前库存</label><input class="input" value="${product.stock}" disabled></div>
      <div class="form-field"><label>调整后库存</label><input class="input" name="stock" type="number" value="${product.stock}" required></div>
      <div class="form-field"><label>预警阈值</label><input class="input" name="threshold" type="number" value="${product.threshold}" required></div>
      <div class="form-field full"><label>修正原因</label><textarea class="textarea" name="reason">人工盘点修正</textarea></div>
    </div>
    <div class="panel-head" style="margin-top:18px"><button class="primary">保存库存</button></div>
  `;
}

function storeForm() {
  return `
    <div class="form-grid">
      <div class="form-field"><label>门店名称</label><input class="input" name="name" required></div>
      <div class="form-field"><label>配送范围</label><input class="input" name="radius" value="3km"></div>
      <div class="form-field full"><label>地址</label><input class="input" name="address" required></div>
      <div class="form-field"><label>员工数</label><input class="input" name="staff" type="number" value="3"></div>
    </div>
    <div class="panel-head" style="margin-top:18px"><button class="primary">保存门店</button></div>
  `;
}

function accountForm() {
  return `
    <div class="form-grid">
      <div class="form-field"><label>姓名</label><input class="input" name="name" required></div>
      <div class="form-field"><label>登录名</label><input class="input" name="username" required></div>
      <div class="form-field"><label>密码</label><input class="input" name="password" value="123456" required></div>
      <div class="form-field"><label>手机号</label><input class="input" name="phone" value="138****0000"></div>
      <div class="form-field"><label>角色</label><select class="select" name="role"><option>运营人员</option><option>门店店长</option><option>配送/拣货员工</option><option>系统管理员</option></select></div>
      <div class="form-field"><label>门店</label><input class="input" name="store" value="城南店"></div>
    </div>
    <div class="panel-head" style="margin-top:18px"><button class="primary">保存账号</button></div>
  `;
}

function checkbox(name, value, label, checked) {
  return `<label class="check-item"><input type="checkbox" name="${name}" value="${value}" ${checked ? "checked" : ""}> ${label}</label>`;
}

function permissionForm(account) {
  const permissions = account.permissions || [];
  return `
    <input type="hidden" name="id" value="${account.id}">
    <div class="form-grid">
      <div class="form-field full">
        <label>运营端菜单权限</label>
        <div class="check-grid">
          ${operatePages.map((page) => checkbox("permissions", page, menuLabels[page], permissions.includes(page))).join("")}
        </div>
      </div>
      <div class="form-field full">
        <p class="muted">该账号将只能进入运营端；管理端固定仅系统管理员可进入。</p>
      </div>
    </div>
    <div class="panel-head" style="margin-top:18px"><button class="primary">保存权限</button></div>
  `;
}

function closeModal() {
  modal.classList.add("hidden");
  modalForm.innerHTML = "";
}

async function handleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(modalForm);
  const data = Object.fromEntries(formData.entries());
  const type = modalForm.dataset.type;
  if (type === "product") {
    const product = { id: `product-${Date.now()}`, name: data.name, category: data.category, price: Number(data.price), stock: Number(data.stock), threshold: Number(data.threshold), status: "已上架", tag: data.tag || "新品" };
    state.products.unshift(product);
    log("新增商品", product.name);
    await syncResource("products", product);
  }
  if (type === "promotion") {
    const promo = { id: `promo-${Date.now()}`, name: data.name, type: data.type, target: data.target, start: data.start, end: data.end || "长期", status: "待启用", metric: "未开始" };
    state.promotions.unshift(promo);
    log("新建活动", promo.name);
    await syncResource("promotions", promo);
  }
  if (type === "stock") {
    const product = state.products.find((item) => item.id === data.id);
    if (product) {
      product.stock = Number(data.stock);
      product.threshold = Number(data.threshold);
      product.tag = data.reason || "人工修正";
      log("库存修正", product.name);
      await syncResource("products", product, "PATCH");
    }
  }
  if (type === "store") {
    const store = { id: `store-${Date.now()}`, name: data.name, address: data.address, staff: Number(data.staff), radius: data.radius, status: "营业中" };
    state.stores.unshift(store);
    log("新增门店", store.name);
    await syncResource("stores", store);
  }
  if (type === "account") {
    const isAdmin = data.role === "系统管理员";
    const account = {
      id: `account-${Date.now()}`,
      username: data.username,
      password: data.password,
      name: data.name,
      phone: data.phone,
      role: data.role,
      store: data.store,
      status: "启用",
      workspaces: isAdmin ? ["manage", "operate"] : ["operate"],
      permissions: isAdmin ? [...managePages, ...operatePages] : ["products"]
    };
    state.accounts.unshift(account);
    log("新增账号", account.name);
    await syncResource("accounts", account);
  }
  if (type === "permission") {
    const account = state.accounts.find((item) => item.id === data.id);
    if (account && !isAdminAccount(account)) {
      account.workspaces = ["operate"];
      account.permissions = formData.getAll("permissions").filter((page) => operatePages.includes(page));
      log("菜单权限调整", account.name);
      if (currentUser?.id === account.id) {
        currentUser = account;
        applyMenuPermissions();
      }
      await syncResource("accounts", account, "PATCH");
    }
  }
  saveState();
  closeModal();
  render();
  showToast();
}

async function toggleProduct(id) {
  const product = state.products.find((item) => item.id === id);
  product.status = product.status === "已上架" ? "已下架" : "已上架";
  log("商品上下架", product.name);
  await syncResource("products", product, "PATCH");
  saveState();
  render();
}

function filterProducts() {
  const keyword = document.getElementById("productKeyword").value.trim();
  const list = state.products.filter((item) => !keyword || item.name.includes(keyword) || item.category.includes(keyword));
  document.getElementById("productTable").innerHTML = productTable(list);
  bindPageActions();
}

async function togglePromo(id) {
  const promo = state.promotions.find((item) => item.id === id);
  promo.status = promo.status === "进行中" ? "已停用" : "进行中";
  log("活动启停", promo.name);
  await syncResource("promotions", promo, "PATCH");
  saveState();
  render();
}

async function deletePromo(id) {
  const promo = state.promotions.find((item) => item.id === id);
  state.promotions = state.promotions.filter((item) => item.id !== id);
  log("删除活动", promo.name);
  await deleteResource("promotions", id);
  saveState();
  render();
}

async function nextOrder(id) {
  const order = state.orders.find((item) => item.id === id);
  const flow = ["待拣货", "已拣货", "配送中", "已完成"];
  const index = flow.indexOf(order.status);
  order.status = flow[index + 1] || "已完成";
  log("订单状态流转", `#${order.id} ${order.status}`);
  await syncResource("orders", order, "PATCH");
  saveState();
  render();
}

async function abnormalOrder(id) {
  const order = state.orders.find((item) => item.id === id);
  order.status = "缺货异常";
  order.abnormal = "运营端标记异常";
  log("异常订单处理", `#${order.id}`);
  await syncResource("orders", order, "PATCH");
  saveState();
  render();
}

async function toggleStore(id) {
  const store = state.stores.find((item) => item.id === id);
  store.status = store.status === "营业中" ? "暂停营业" : "营业中";
  log("门店营业状态", store.name);
  await syncResource("stores", store, "PATCH");
  saveState();
  render();
}

async function toggleAccount(id) {
  const account = state.accounts.find((item) => item.id === id);
  account.status = account.status === "启用" ? "停用" : "启用";
  log("账号状态调整", account.name);
  await syncResource("accounts", account, "PATCH");
  saveState();
  render();
}

async function deleteAccount(id) {
  const account = state.accounts.find((item) => item.id === id);
  state.accounts = state.accounts.filter((item) => item.id !== id);
  log("删除账号", account.name);
  await deleteResource("accounts", id);
  saveState();
  render();
}

document.querySelectorAll(".role-btn").forEach((btn) => btn.addEventListener("click", () => setRole(btn.dataset.role)));
document.querySelectorAll(".nav-btn").forEach((btn) => btn.addEventListener("click", () => setPage(btn.dataset.page)));
document.querySelectorAll("[data-entry-role]").forEach((btn) => btn.addEventListener("click", () => enterWorkspace(btn.dataset.entryRole)));
document.querySelectorAll("[data-fill-login]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const account = state.accounts.find((item) => item.username === btn.dataset.fillLogin);
    document.querySelector("[name='username']").value = account.username;
    document.querySelector("[name='password']").value = account.password;
  });
});
document.getElementById("loginForm").addEventListener("submit", handleLogin);
document.getElementById("backEntryBtn").addEventListener("click", backToEntry);
document.getElementById("logoutBtn").addEventListener("click", logout);
document.getElementById("closeModalBtn").addEventListener("click", closeModal);
document.getElementById("modal").addEventListener("click", (event) => {
  if (event.target.id === "modal") closeModal();
});
document.getElementById("modalForm").addEventListener("submit", handleSubmit);
document.getElementById("resetDataBtn").addEventListener("click", () => {
  state = structuredClone(seedData);
  saveState();
  if (apiOnline) apiRequest("/api/reset", { method: "POST" }).catch(() => {});
  render();
  showToast("演示数据已重置");
});

render();
loadRemoteState();
