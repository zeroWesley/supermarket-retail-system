const STORAGE_KEY = "zero-admin-web-v4";
const API_BASE = localStorage.getItem("ZERO_API_BASE") || "http://127.0.0.1:8787";

const operatePages = ["dashboard", "products", "coupons", "campaigns", "membership", "orders", "stores"];
const managePages = ["accounts", "permissions", "logs"];

const seedData = {
  products: [
    { id: "beer-qingdao", name: "青岛啤酒 500ml 单罐", category: "酒水饮料", price: 5.5, stock: 126, threshold: 24, status: "已上架", tag: "限时特价" },
    { id: "apple-fuji", name: "烟台红富士苹果 约500g", category: "水果生鲜", price: 6.9, stock: 42, threshold: 20, status: "已上架", tag: "满减可用" },
    { id: "milk-fresh", name: "鲜牛奶 950ml 冷藏配送", category: "冷藏乳品", price: 13.8, stock: 8, threshold: 12, status: "已上架", tag: "库存预警" },
    { id: "vegetable-green", name: "精选上海青 约400g", category: "水果生鲜", price: 4.99, stock: 32, threshold: 10, status: "已上架", tag: "今日到货" },
    { id: "chips", name: "原味薯片 104g", category: "休闲零食", price: 8.8, stock: 58, threshold: 16, status: "已下架", tag: "第二件半价" }
  ],
  coupons: [
    { id: "coupon-full-79", coupon_id: "100001", name: "满79减10", type: "通用券", usableProducts: [], amount: 10, threshold: 79, stock: 500, start: "2026-06-21", end: "2026-07-31", status: "启用", description: "全场商品满79元可用。" },
    { id: "coupon-beer-20", coupon_id: "100003", name: "酒水满59减8", type: "商品券", usableProducts: ["beer-qingdao"], amount: 8, threshold: 59, stock: 180, start: "2026-06-21", end: "2026-07-15", status: "启用", description: "仅限酒水饮料商品使用。" },
    { id: "coupon-member-49", coupon_id: "100101", name: "会员专享满49减5", type: "通用券", usableProducts: [], amount: 5, threshold: 49, stock: 300, start: "2026-06-21", end: "2026-07-31", status: "启用", forMember: true, description: "注册会员每月可领取，用于C端会员页展示。" }
  ],
  campaigns: [
    { id: "campaign-home-banner", activity_id: "200001", name: "首页主Banner-今晚吃喝用", position: "首页主Banner", coupon_id: "100001", couponId: "100001", start: "2026-06-21", end: "2026-07-31", status: "进行中", title: "今晚吃喝用，一次配齐", subtitle: "生鲜酒水员工自配送", sort: 1 },
    { id: "campaign-beer-night", activity_id: "200003", name: "首页券区-酒水夜间特价", position: "首页优惠券区", coupon_id: "100003", couponId: "100003", start: "2026-06-21", end: "2026-07-15", status: "进行中", title: "酒水满59减8", subtitle: "酒水饮料可用", sort: 2 }
  ],
  memberLevels: [
    { id: "level-silver", name: "银卡会员", threshold: 0, growthRule: "每消费1元累计1成长值", status: "启用" },
    { id: "level-gold", name: "金卡会员", threshold: 1000, growthRule: "每消费1元累计1成长值，酒水订单额外+20%", status: "启用" },
    { id: "level-black", name: "黑金会员", threshold: 3000, growthRule: "每消费1元累计1.2成长值，生鲜酒水加速成长", status: "启用" }
  ],
  memberBenefits: [
    { id: "benefit-member-coupon", name: "每月会员券", type: "会员券", levelId: "level-silver", content: "每月发放满49减5会员券", status: "启用" },
    { id: "benefit-member-price", name: "会员专享价", type: "会员价", levelId: "level-gold", content: "指定商品展示会员价", status: "启用" },
    { id: "benefit-priority-delivery", name: "缺货优先确认", type: "履约权益", levelId: "level-black", content: "缺货订单优先人工确认处理", status: "启用" }
  ],
  memberCouponPlacements: [
    { id: "member-coupon-placement-100101", name: "金卡月度会员券", coupon_id: "100101", levelId: "level-silver", start: "2026-06-21", end: "2026-07-31", cycle: "每月可领1次", status: "启用" }
  ],
  memberPrices: [
    { id: "member-price-beer", productId: "beer-qingdao", levelId: "level-gold", memberPrice: 4.9, status: "启用" },
    { id: "member-price-milk", productId: "milk-fresh", levelId: "level-gold", memberPrice: 12.8, status: "启用" },
    { id: "member-price-apple", productId: "apple-fuji", levelId: "level-black", memberPrice: 5.9, status: "启用" }
  ],
  memberUsers: [
    { id: "member-zero", name: "ZeroWesley", levelId: "level-gold", growth: 1680, registeredAt: "2026-06-21", status: "有效" }
  ],
  promotions: [],
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
  products: ["商品管理", "统一管理商品信息、图片、上下架和库存增减，并同步到 C端小程序展示。"],
  coupons: ["优惠券配置", "创建券定义，维护券类型、适用商品、面额门槛、库存和可用时间。"],
  campaigns: ["活动配置", "配置活动投放位置、绑定优惠券、投放文案和起止时间。"],
  membership: ["会员体系", "配置注册制分级会员、成长值规则、会员权益、会员券和会员价。"],
  orders: ["订单管理", "查看全量订单，处理异常订单并调整履约状态。"],
  stores: ["门店配置", "维护门店地址、营业状态、配送范围和员工数量。"],
  accounts: ["账号管理", "添加、停用和删除后台账号，并绑定门店角色。"],
  permissions: ["角色权限", "配置系统管理员、运营人员、店长和员工的菜单权限。"],
  logs: ["操作日志", "查看账号、活动、库存、订单等关键操作记录。"]
};

const menuLabels = {
  dashboard: "经营概览",
  products: "商品管理",
  coupons: "优惠券配置",
  campaigns: "活动配置",
  membership: "会员体系",
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

function mediaUrl(src = "") {
  if (!src) return "";
  if (src.startsWith("/assets/")) return `../${src.slice(1)}`;
  return src;
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

function couponBusinessId(coupon = {}) {
  return normalizeCouponBusinessId(coupon.coupon_id || coupon.id || "", coupon);
}

function activityBusinessId(campaign = {}) {
  return normalizeActivityBusinessId(campaign.activity_id || campaign.id || "", campaign);
}

function campaignCouponId(campaign = {}) {
  return normalizeCouponBusinessId(campaign.coupon_id || campaign.couponId || "");
}

function couponName(id) {
  const numericId = normalizeCouponBusinessId(id);
  const coupon = (state.coupons || []).find((item) => item.id === id || item.coupon_id === id || couponBusinessId(item) === numericId);
  return coupon ? `${couponBusinessId(coupon)} ｜ ${coupon.name}` : id || "未绑定";
}

function productById(id) {
  return (state.products || []).find((item) => item.id === id);
}

function memberLevelName(id) {
  return (state.memberLevels || []).find((item) => item.id === id)?.name || id || "-";
}

function memberLevelOptions(selected = "") {
  return (state.memberLevels || []).map((item) => `<option value="${item.id}" ${selected === item.id ? "selected" : ""}>${item.name} ｜ ${item.threshold}成长值</option>`).join("");
}

function memberProductOptions(selected = "") {
  return (state.products || []).map((item) => `<option value="${item.id}" ${selected === item.id ? "selected" : ""}>${item.name}</option>`).join("");
}

function couponProductsText(coupon) {
  if (coupon.type !== "商品券") return "全场通用";
  const ids = coupon.usableProducts || [];
  if (!ids.length) return "未选择商品";
  return ids.map((id) => state.products.find((item) => item.id === id)?.name || id).slice(0, 2).join("、") + (ids.length > 2 ? ` 等${ids.length}件` : "");
}

function productOptions(selected = []) {
  const selectedIds = Array.isArray(selected) ? selected : String(selected || "").split(",").filter(Boolean);
  return state.products.map((item) => `<option value="${item.id}" ${selectedIds.includes(item.id) ? "selected" : ""}>${item.name}</option>`).join("");
}

function couponOptions(selected = "") {
  const selectedId = normalizeCouponBusinessId(selected);
  return (state.coupons || []).map((item) => {
    const couponId = couponBusinessId(item);
    const isSelected = selected === item.id || selected === item.coupon_id || selectedId === couponId;
    return `<option value="${couponId}" ${isSelected ? "selected" : ""}>${couponId} ｜ ${item.name}</option>`;
  }).join("");
}

function memberCouponOptions(selected = "") {
  const selectedId = normalizeCouponBusinessId(selected);
  return (state.coupons || []).filter((item) => item.forMember).map((item) => {
    const couponId = couponBusinessId(item);
    const isSelected = selected === item.id || selected === item.coupon_id || selectedId === couponId;
    return `<option value="${couponId}" ${isSelected ? "selected" : ""}>${couponId} ｜ ${item.name}</option>`;
  }).join("");
}

function normalizeCouponBusinessId(value = "", coupon = {}) {
  const raw = String(value || "").trim();
  if (/^\d+$/.test(raw)) return raw;
  const map = {
    "coupon-full-79": "100001",
    "coupon-full-99": "100002",
    "coupon-beer-20": "100003",
    "coupon-fresh-30": "100004"
  };
  return map[raw] || map[coupon.id] || "";
}

function normalizeActivityBusinessId(value = "", campaign = {}) {
  const raw = String(value || "").trim();
  if (/^\d+$/.test(raw)) return raw;
  const map = {
    "campaign-home-banner": "200001",
    "activity-home-banner": "200001",
    "campaign-coupon-row-99": "200002",
    "activity-coupon-row-99": "200002",
    "campaign-beer-night": "200003",
    "activity-beer-night": "200003",
    "campaign-fresh-morning": "200004",
    "activity-fresh-morning": "200004"
  };
  return map[raw] || map[campaign.id] || "";
}

function nextNumericId(items = [], field, start) {
  const max = items.reduce((value, item) => {
    const normalized = field === "coupon_id" ? couponBusinessId(item) : activityBusinessId(item);
    const current = Number(normalized || item[field]);
    return Number.isFinite(current) ? Math.max(value, current) : value;
  }, start - 1);
  return String(max + 1);
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
    coupons: renderCoupons,
    campaigns: renderCampaigns,
    membership: renderMembership,
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
  const activeCampaigns = (state.campaigns || []).filter((item) => item.status === "进行中").length;
  return `
    <div class="metric-grid">
      <div class="metric"><span>今日订单</span><strong>${orderCount}</strong><small>模拟数据</small></div>
      <div class="metric"><span>模拟销售额</span><strong>${money(revenue)}</strong><small>含配送费</small></div>
      <div class="metric"><span>库存预警</span><strong>${warningCount}</strong><small>低于阈值</small></div>
      <div class="metric"><span>进行中投放</span><strong>${activeCampaigns}</strong><small>同步 C端</small></div>
    </div>
    <div class="two-col">
      <section class="panel">
        <div class="panel-head"><h2>待处理订单</h2><button class="secondary" data-nav="orders">查看订单</button></div>
        ${orderTable(state.orders.filter((item) => item.status !== "已完成").slice(0, 3))}
      </section>
      <section class="panel">
        <div class="panel-head"><h2>库存预警</h2><button class="secondary" data-nav="products">去处理</button></div>
        ${inventoryTable(state.products.filter((item) => item.stock <= item.threshold))}
      </section>
    </div>
    <section class="panel">
      <div class="panel-head"><h2>业务流程</h2><span class="tag">演示版 v4</span></div>
      <div class="flow">
        <div>后台配置商品/优惠券</div>
        <div>活动投放到 C端</div>
        <div>C端展示并下单</div>
        <div>员工接单拣货</div>
        <div>员工自配送完成</div>
      </div>
    </section>
  `;
}

function renderProducts() {
  return `
    <section class="panel">
      <div class="panel-head">
        <h2>商品与库存</h2>
        <button class="primary" data-open="product">新增商品</button>
      </div>
      <div class="tool-row">
        <input class="input" id="productKeyword" placeholder="商品名称/分类">
        <button class="secondary" data-filter="products">查询</button>
        <span class="store-pill">库存低于阈值自动预警</span>
      </div>
      <div id="productTable">${productTable(state.products)}</div>
    </section>
  `;
}

function renderCoupons() {
  return `
    <section class="panel">
      <div class="panel-head">
        <h2>优惠券配置</h2>
        <button class="primary" data-open="coupon">新增优惠券</button>
      </div>
      <table>
        <thead><tr><th>券ID</th><th>券名称</th><th>归属</th><th>类型</th><th>面额/门槛</th><th>库存</th><th>可用时间</th><th>可用商品</th><th>状态</th><th>操作</th></tr></thead>
        <tbody>
          ${(state.coupons || []).map((item) => `
            <tr>
              <td><code class="code-id">${couponBusinessId(item)}</code></td>
              <td>${item.name}</td>
              <td>${item.forMember ? tag("会员券") : "普通券"}</td>
              <td>${item.type}</td>
              <td>${money(item.amount)} / 满${item.threshold}</td>
              <td>${item.stock}</td>
              <td>${item.start} 至 ${item.end}</td>
              <td>${couponProductsText(item)}</td>
              <td>${tag(item.status)}</td>
              <td class="table-actions">
                <button class="link-btn" data-edit-coupon="${item.id}">编辑</button>
                <button class="link-btn" data-toggle-coupon="${item.id}">${item.status === "启用" ? "停用" : "启用"}</button>
                <button class="link-btn" data-delete-coupon="${item.id}">删除</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </section>
  `;
}

function renderCampaigns() {
  return `
    <section class="panel">
      <div class="panel-head">
        <h2>活动配置</h2>
        <button class="primary" data-open="campaign">新增投放</button>
      </div>
      <table>
        <thead><tr><th>活动ID</th><th>活动</th><th>投放位置</th><th>绑定券ID</th><th>时间</th><th>状态</th><th>展示文案</th><th>操作</th></tr></thead>
        <tbody>
          ${(state.campaigns || []).map((item) => `
            <tr>
              <td><code class="code-id">${activityBusinessId(item)}</code></td>
              <td>${item.name}</td>
              <td>${item.position}</td>
              <td>${couponName(campaignCouponId(item))}</td>
              <td>${item.start} 至 ${item.end}</td>
              <td>${tag(item.status)}</td>
              <td>${item.title}<br><span class="muted">${item.subtitle || ""}</span></td>
              <td class="table-actions">
                <button class="link-btn" data-edit-campaign="${item.id}">编辑</button>
                <button class="link-btn" data-toggle-campaign="${item.id}">${item.status === "进行中" ? "停用" : "启用"}</button>
                <button class="link-btn" data-delete-campaign="${item.id}">删除</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </section>
  `;
}

function renderMembership() {
  const memberCouponPlacements = state.memberCouponPlacements || [];
  return `
    <div class="metric-grid">
      <div class="metric"><span>会员等级</span><strong>${(state.memberLevels || []).length}</strong><small>注册制分级</small></div>
      <div class="metric"><span>会员权益</span><strong>${(state.memberBenefits || []).length}</strong><small>券/会员价/履约</small></div>
      <div class="metric"><span>会员券投放</span><strong>${memberCouponPlacements.length}</strong><small>绑定会员券ID</small></div>
      <div class="metric"><span>会员价商品</span><strong>${(state.memberPrices || []).length}</strong><small>同步 C端展示</small></div>
    </div>
    <section class="panel">
      <div class="panel-head"><h2>会员等级配置</h2><button class="primary" data-open="memberLevel">新增等级</button></div>
      <table>
        <thead><tr><th>等级</th><th>成长值门槛</th><th>成长值累计规则</th><th>状态</th><th>操作</th></tr></thead>
        <tbody>${(state.memberLevels || []).sort((a, b) => Number(a.threshold) - Number(b.threshold)).map((item) => `
          <tr><td>${item.name}</td><td>${item.threshold}</td><td>${item.growthRule}</td><td>${tag(item.status)}</td><td class="table-actions"><button class="link-btn" data-edit-member-level="${item.id}">编辑</button><button class="link-btn" data-toggle-member-level="${item.id}">${item.status === "启用" ? "停用" : "启用"}</button></td></tr>
        `).join("")}</tbody>
      </table>
    </section>
    <section class="panel">
      <div class="panel-head"><h2>会员权益配置</h2><button class="primary" data-open="memberBenefit">新增权益</button></div>
      <table>
        <thead><tr><th>权益名称</th><th>权益类型</th><th>适用等级</th><th>权益说明</th><th>状态</th><th>操作</th></tr></thead>
        <tbody>${(state.memberBenefits || []).map((item) => `
          <tr><td>${item.name}</td><td>${item.type}</td><td>${memberLevelName(item.levelId)}</td><td>${item.content}</td><td>${tag(item.status)}</td><td class="table-actions"><button class="link-btn" data-edit-member-benefit="${item.id}">编辑</button><button class="link-btn" data-toggle-member-benefit="${item.id}">${item.status === "启用" ? "停用" : "启用"}</button></td></tr>
        `).join("")}</tbody>
      </table>
    </section>
    <section class="panel">
      <div class="panel-head"><h2>会员券投放</h2><button class="primary" data-open="memberCouponPlacement">新增投放</button></div>
      <table>
        <thead><tr><th>投放名称</th><th>绑定券ID</th><th>券名称</th><th>适用等级</th><th>投放周期</th><th>时间区间</th><th>状态</th><th>操作</th></tr></thead>
        <tbody>${memberCouponPlacements.map((item) => {
          const coupon = (state.coupons || []).find((entry) => couponBusinessId(entry) === normalizeCouponBusinessId(item.coupon_id));
          return `<tr><td>${item.name}</td><td><code class="code-id">${normalizeCouponBusinessId(item.coupon_id)}</code></td><td>${coupon?.name || "-"}</td><td>${memberLevelName(item.levelId)}</td><td>${item.cycle || "-"}</td><td>${item.start} 至 ${item.end}</td><td>${tag(item.status)}</td><td class="table-actions"><button class="link-btn" data-edit-member-coupon-placement="${item.id}">编辑</button><button class="link-btn" data-toggle-member-coupon-placement="${item.id}">${item.status === "启用" ? "停用" : "启用"}</button></td></tr>`;
        }).join("") || `<tr><td colspan="8">暂无投放，请先在优惠券配置中创建会员券，再在这里绑定券ID投放。</td></tr>`}</tbody>
      </table>
      <p class="muted panel-note">会员券本身在“优惠券配置”创建，并将券归属设置为会员券；本页只做会员券投放和展示规则。</p>
    </section>
    <section class="panel">
      <div class="panel-head"><h2>会员价配置</h2><button class="primary" data-open="memberPrice">新增会员价</button></div>
      <table>
        <thead><tr><th>商品</th><th>适用等级</th><th>原价</th><th>会员价</th><th>状态</th><th>操作</th></tr></thead>
        <tbody>${(state.memberPrices || []).map((item) => {
          const product = productById(item.productId);
          return `<tr><td>${product?.name || item.productId}</td><td>${memberLevelName(item.levelId)}</td><td>${money(product?.price || 0)}</td><td>${money(item.memberPrice)}</td><td>${tag(item.status)}</td><td class="table-actions"><button class="link-btn" data-edit-member-price="${item.id}">编辑</button><button class="link-btn" data-toggle-member-price="${item.id}">${item.status === "启用" ? "停用" : "启用"}</button></td></tr>`;
        }).join("")}</tbody>
      </table>
    </section>
    <section class="panel">
      <div class="panel-head"><h2>演示会员信息</h2><span class="store-pill">C端个人中心同步展示</span></div>
      <table>
        <thead><tr><th>用户</th><th>等级</th><th>成长值</th><th>注册时间</th><th>状态</th></tr></thead>
        <tbody>${(state.memberUsers || []).map((item) => `<tr><td>${item.name}</td><td>${memberLevelName(item.levelId)}</td><td>${item.growth}</td><td>${item.registeredAt}</td><td>${tag(item.status)}</td></tr>`).join("")}</tbody>
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
      <thead><tr><th>图片</th><th>商品</th><th>分类</th><th>售价</th><th>库存</th><th>标签</th><th>状态</th><th>操作</th></tr></thead>
      <tbody>
        ${items.map((item) => `
          <tr>
            <td>${item.image ? `<img class="product-thumb" src="${mediaUrl(item.image)}" alt="${item.name}">` : `<span class="product-thumb fallback">${item.icon || "商"}</span>`}</td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${money(item.price)}</td>
            <td>${item.stock}</td>
            <td>${item.tag}</td>
            <td>${tag(item.status)}</td>
            <td class="table-actions">
              <button class="link-btn" data-edit-product="${item.id}">编辑</button>
              <button class="link-btn" data-toggle-product="${item.id}">${item.status === "已上架" ? "下架" : "上架"}</button>
              <button class="link-btn" data-adjust-stock="${item.id}">调库存</button>
              <button class="link-btn" data-delete-product="${item.id}">删除</button>
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
  document.querySelectorAll("[data-edit-product]").forEach((btn) => btn.addEventListener("click", () => openProductForm(btn.dataset.editProduct)));
  document.querySelectorAll("[data-toggle-product]").forEach((btn) => btn.addEventListener("click", () => toggleProduct(btn.dataset.toggleProduct)));
  document.querySelectorAll("[data-adjust-stock]").forEach((btn) => btn.addEventListener("click", () => openStockForm(btn.dataset.adjustStock)));
  document.querySelectorAll("[data-delete-product]").forEach((btn) => btn.addEventListener("click", () => deleteProduct(btn.dataset.deleteProduct)));
  document.querySelectorAll("[data-edit-coupon]").forEach((btn) => btn.addEventListener("click", () => openCouponForm(btn.dataset.editCoupon)));
  document.querySelectorAll("[data-toggle-coupon]").forEach((btn) => btn.addEventListener("click", () => toggleCoupon(btn.dataset.toggleCoupon)));
  document.querySelectorAll("[data-delete-coupon]").forEach((btn) => btn.addEventListener("click", () => deleteCoupon(btn.dataset.deleteCoupon)));
  document.querySelectorAll("[data-edit-campaign]").forEach((btn) => btn.addEventListener("click", () => openCampaignForm(btn.dataset.editCampaign)));
  document.querySelectorAll("[data-toggle-campaign]").forEach((btn) => btn.addEventListener("click", () => toggleCampaign(btn.dataset.toggleCampaign)));
  document.querySelectorAll("[data-delete-campaign]").forEach((btn) => btn.addEventListener("click", () => deleteCampaign(btn.dataset.deleteCampaign)));
  document.querySelectorAll("[data-edit-member-level]").forEach((btn) => btn.addEventListener("click", () => openMemberLevelForm(btn.dataset.editMemberLevel)));
  document.querySelectorAll("[data-toggle-member-level]").forEach((btn) => btn.addEventListener("click", () => toggleMemberResource("memberLevels", "member-levels", btn.dataset.toggleMemberLevel)));
  document.querySelectorAll("[data-edit-member-benefit]").forEach((btn) => btn.addEventListener("click", () => openMemberBenefitForm(btn.dataset.editMemberBenefit)));
  document.querySelectorAll("[data-toggle-member-benefit]").forEach((btn) => btn.addEventListener("click", () => toggleMemberResource("memberBenefits", "member-benefits", btn.dataset.toggleMemberBenefit)));
  document.querySelectorAll("[data-edit-member-coupon-placement]").forEach((btn) => btn.addEventListener("click", () => openMemberCouponPlacementForm(btn.dataset.editMemberCouponPlacement)));
  document.querySelectorAll("[data-toggle-member-coupon-placement]").forEach((btn) => btn.addEventListener("click", () => toggleMemberResource("memberCouponPlacements", "member-coupon-placements", btn.dataset.toggleMemberCouponPlacement)));
  document.querySelectorAll("[data-edit-member-price]").forEach((btn) => btn.addEventListener("click", () => openMemberPriceForm(btn.dataset.editMemberPrice)));
  document.querySelectorAll("[data-toggle-member-price]").forEach((btn) => btn.addEventListener("click", () => toggleMemberResource("memberPrices", "member-prices", btn.dataset.toggleMemberPrice)));
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
    coupon: ["新增优惠券", couponForm()],
    campaign: ["新增活动投放", campaignForm()],
    memberLevel: ["新增会员等级", memberLevelForm()],
    memberBenefit: ["新增会员权益", memberBenefitForm()],
    memberCouponPlacement: ["新增会员券投放", memberCouponPlacementForm()],
    memberPrice: ["新增会员价", memberPriceForm()],
    stock: ["人工库存修正", stockForm()],
    store: ["新增门店", storeForm()],
    account: ["新增账号", accountForm()]
  };
  modalTitle.textContent = map[type][0];
  modalForm.innerHTML = map[type][1];
  modalForm.dataset.type = type;
  modal.classList.remove("hidden");
}

function openProductForm(id) {
  const product = state.products.find((item) => item.id === id);
  if (!product) return;
  modalTitle.textContent = `编辑商品：${product.name}`;
  modalForm.innerHTML = productForm(product);
  modalForm.dataset.type = "product";
  modal.classList.remove("hidden");
}

function openStockForm(id) {
  const product = state.products.find((item) => item.id === id);
  modalTitle.textContent = "人工库存修正";
  modalForm.innerHTML = stockForm(product);
  modalForm.dataset.type = "stock";
  modal.classList.remove("hidden");
}

function openCouponForm(id) {
  const coupon = (state.coupons || []).find((item) => item.id === id);
  if (!coupon) return;
  modalTitle.textContent = `编辑优惠券：${coupon.name}`;
  modalForm.innerHTML = couponForm(coupon);
  modalForm.dataset.type = "coupon";
  modal.classList.remove("hidden");
}

function openCampaignForm(id) {
  const campaign = (state.campaigns || []).find((item) => item.id === id);
  if (!campaign) return;
  modalTitle.textContent = `编辑活动投放：${campaign.name}`;
  modalForm.innerHTML = campaignForm(campaign);
  modalForm.dataset.type = "campaign";
  modal.classList.remove("hidden");
}

function openMemberLevelForm(id) {
  const item = (state.memberLevels || []).find((entry) => entry.id === id);
  if (!item) return;
  modalTitle.textContent = `编辑会员等级：${item.name}`;
  modalForm.innerHTML = memberLevelForm(item);
  modalForm.dataset.type = "memberLevel";
  modal.classList.remove("hidden");
}

function openMemberBenefitForm(id) {
  const item = (state.memberBenefits || []).find((entry) => entry.id === id);
  if (!item) return;
  modalTitle.textContent = `编辑会员权益：${item.name}`;
  modalForm.innerHTML = memberBenefitForm(item);
  modalForm.dataset.type = "memberBenefit";
  modal.classList.remove("hidden");
}

function openMemberCouponPlacementForm(id) {
  const item = (state.memberCouponPlacements || []).find((entry) => entry.id === id);
  if (!item) return;
  modalTitle.textContent = `编辑会员券投放：${item.name}`;
  modalForm.innerHTML = memberCouponPlacementForm(item);
  modalForm.dataset.type = "memberCouponPlacement";
  modal.classList.remove("hidden");
}

function openMemberPriceForm(id) {
  const item = (state.memberPrices || []).find((entry) => entry.id === id);
  if (!item) return;
  modalTitle.textContent = "编辑会员价";
  modalForm.innerHTML = memberPriceForm(item);
  modalForm.dataset.type = "memberPrice";
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

function productForm(product = {}) {
  return `
    <div class="form-grid">
      <input type="hidden" name="id" value="${product.id || ""}">
      <div class="form-field"><label>商品名称</label><input class="input" name="name" value="${product.name || ""}" required></div>
      <div class="form-field"><label>分类</label><input class="input" name="category" value="${product.category || "水果生鲜"}" required></div>
      <div class="form-field"><label>售价</label><input class="input" name="price" type="number" step="0.01" value="${product.price || "9.90"}" required></div>
      <div class="form-field"><label>库存</label><input class="input" name="stock" type="number" value="${product.stock ?? 20}" required></div>
      <div class="form-field"><label>预警阈值</label><input class="input" name="threshold" type="number" value="${product.threshold ?? 10}" required></div>
      <div class="form-field"><label>标签</label><input class="input" name="tag" value="${product.tag || "新品"}"></div>
      <div class="form-field"><label>状态</label><select class="select" name="status"><option ${product.status === "已上架" ? "selected" : ""}>已上架</option><option ${product.status === "已下架" ? "selected" : ""}>已下架</option></select></div>
      <div class="form-field"><label>C端短描述</label><input class="input" name="desc" value="${product.desc || product.tag || ""}"></div>
      <div class="form-field full"><label>商品配图 URL（模拟后台上传后生成）</label><input class="input" name="image" value="${product.image || ""}" placeholder="https://..."></div>
    </div>
    <div class="panel-head" style="margin-top:18px"><button class="primary">保存商品</button></div>
  `;
}

function couponForm(coupon = {}) {
  const couponId = couponBusinessId(coupon) || nextNumericId(state.coupons || [], "coupon_id", 100001);
  return `
    <div class="form-grid">
      <input type="hidden" name="id" value="${coupon.id || ""}">
      <div class="form-field"><label>券ID coupon_id</label><input class="input" name="coupon_id" value="${couponId}" inputmode="numeric" pattern="[0-9]*" required></div>
      <div class="form-field"><label>券名称</label><input class="input" name="name" value="${coupon.name || ""}" required></div>
      <div class="form-field"><label>券类型</label><select class="select" name="type"><option ${coupon.type === "通用券" ? "selected" : ""}>通用券</option><option ${coupon.type === "商品券" ? "selected" : ""}>商品券</option></select></div>
      <div class="form-field"><label>面额</label><input class="input" name="amount" type="number" step="0.01" value="${coupon.amount ?? 10}" required></div>
      <div class="form-field"><label>使用门槛</label><input class="input" name="threshold" type="number" step="0.01" value="${coupon.threshold ?? 79}" required></div>
      <div class="form-field"><label>券库存</label><input class="input" name="stock" type="number" value="${coupon.stock ?? 100}" required></div>
      <div class="form-field"><label>状态</label><select class="select" name="status"><option ${coupon.status === "启用" ? "selected" : ""}>启用</option><option ${coupon.status === "停用" ? "selected" : ""}>停用</option></select></div>
      <div class="form-field"><label>券归属</label><select class="select" name="couponScope"><option value="normal" ${coupon.forMember ? "" : "selected"}>普通券</option><option value="member" ${coupon.forMember ? "selected" : ""}>会员券</option></select></div>
      <div class="form-field"><label>开始日期</label><input class="input" name="start" type="date" value="${coupon.start || "2026-06-23"}"></div>
      <div class="form-field"><label>结束日期</label><input class="input" name="end" type="date" value="${coupon.end || "2026-07-31"}"></div>
      <div class="form-field full"><label>券可用商品（仅商品券需要，可多选）</label><select class="select" name="usableProducts" multiple>${productOptions(coupon.usableProducts)}</select></div>
      <div class="form-field full"><label>用途说明</label><textarea class="textarea" name="description">${coupon.description || "用于C端活动投放，用户领取后可在模拟结算中展示。"}</textarea></div>
    </div>
    <div class="panel-head" style="margin-top:18px"><button class="primary">保存优惠券</button></div>
  `;
}

function campaignForm(campaign = {}) {
  const activityId = activityBusinessId(campaign) || nextNumericId(state.campaigns || [], "activity_id", 200001);
  const selectedCouponId = campaignCouponId(campaign);
  return `
    <div class="form-grid">
      <input type="hidden" name="id" value="${campaign.id || ""}">
      <div class="form-field"><label>活动ID activity_id</label><input class="input" name="activity_id" value="${activityId}" inputmode="numeric" pattern="[0-9]*" required></div>
      <div class="form-field"><label>活动名称</label><input class="input" name="name" value="${campaign.name || ""}" required></div>
      <div class="form-field"><label>投放位置</label><select class="select" name="position">${["首页主Banner", "首页优惠券区", "首页频道入口", "分类页顶部", "商品详情页"].map((item) => `<option ${campaign.position === item ? "selected" : ""}>${item}</option>`).join("")}</select></div>
      <div class="form-field"><label>绑定券ID coupon_id</label><select class="select" name="coupon_id">${couponOptions(selectedCouponId)}</select></div>
      <div class="form-field"><label>排序</label><input class="input" name="sort" type="number" value="${campaign.sort ?? 10}"></div>
      <div class="form-field"><label>开始日期</label><input class="input" name="start" type="date" value="${campaign.start || "2026-06-23"}"></div>
      <div class="form-field"><label>结束日期</label><input class="input" name="end" type="date" value="${campaign.end || "2026-07-31"}"></div>
      <div class="form-field"><label>状态</label><select class="select" name="status"><option ${campaign.status === "进行中" ? "selected" : ""}>进行中</option><option ${campaign.status === "待启用" ? "selected" : ""}>待启用</option><option ${campaign.status === "已停用" ? "selected" : ""}>已停用</option><option ${campaign.status === "已结束" ? "selected" : ""}>已结束</option></select></div>
      <div class="form-field"><label>活动图 URL</label><input class="input" name="image" value="${campaign.image || ""}" placeholder="/assets/promotions/promo-full-79.svg"></div>
      <div class="form-field full"><label>C端标题</label><input class="input" name="title" value="${campaign.title || ""}" required></div>
      <div class="form-field full"><label>C端副标题</label><input class="input" name="subtitle" value="${campaign.subtitle || ""}"></div>
    </div>
    <div class="panel-head" style="margin-top:18px"><button class="primary">保存投放</button></div>
  `;
}

function memberLevelForm(level = {}) {
  return `
    <div class="form-grid">
      <input type="hidden" name="id" value="${level.id || ""}">
      <div class="form-field"><label>等级名称</label><input class="input" name="name" value="${level.name || ""}" required></div>
      <div class="form-field"><label>成长值门槛</label><input class="input" name="threshold" type="number" value="${level.threshold ?? 0}" required></div>
      <div class="form-field"><label>状态</label><select class="select" name="status"><option ${level.status === "启用" ? "selected" : ""}>启用</option><option ${level.status === "停用" ? "selected" : ""}>停用</option></select></div>
      <div class="form-field full"><label>成长值累计规则</label><textarea class="textarea" name="growthRule">${level.growthRule || "每消费1元累计1成长值"}</textarea></div>
    </div>
    <div class="panel-head" style="margin-top:18px"><button class="primary">保存等级</button></div>
  `;
}

function memberBenefitForm(benefit = {}) {
  return `
    <div class="form-grid">
      <input type="hidden" name="id" value="${benefit.id || ""}">
      <div class="form-field"><label>权益名称</label><input class="input" name="name" value="${benefit.name || ""}" required></div>
      <div class="form-field"><label>权益类型</label><select class="select" name="type"><option ${benefit.type === "会员券" ? "selected" : ""}>会员券</option><option ${benefit.type === "会员价" ? "selected" : ""}>会员价</option><option ${benefit.type === "履约权益" ? "selected" : ""}>履约权益</option></select></div>
      <div class="form-field"><label>适用等级</label><select class="select" name="levelId">${memberLevelOptions(benefit.levelId)}</select></div>
      <div class="form-field"><label>状态</label><select class="select" name="status"><option ${benefit.status === "启用" ? "selected" : ""}>启用</option><option ${benefit.status === "停用" ? "selected" : ""}>停用</option></select></div>
      <div class="form-field full"><label>权益说明</label><textarea class="textarea" name="content">${benefit.content || ""}</textarea></div>
    </div>
    <div class="panel-head" style="margin-top:18px"><button class="primary">保存权益</button></div>
  `;
}

function memberCouponPlacementForm(placement = {}) {
  const couponOptionsHtml = memberCouponOptions(placement.coupon_id);
  return `
    <div class="form-grid">
      <input type="hidden" name="id" value="${placement.id || ""}">
      <div class="form-field"><label>投放名称</label><input class="input" name="name" value="${placement.name || ""}" required></div>
      <div class="form-field"><label>绑定会员券 coupon_id</label><select class="select" name="coupon_id" required>${couponOptionsHtml || "<option value=''>请先创建会员券</option>"}</select></div>
      <div class="form-field"><label>适用会员等级</label><select class="select" name="levelId">${memberLevelOptions(placement.levelId)}</select></div>
      <div class="form-field"><label>投放周期</label><input class="input" name="cycle" value="${placement.cycle || "每月可领1次"}" required></div>
      <div class="form-field"><label>开始日期</label><input class="input" name="start" type="date" value="${placement.start || "2026-06-23"}"></div>
      <div class="form-field"><label>结束日期</label><input class="input" name="end" type="date" value="${placement.end || "2026-07-31"}"></div>
      <div class="form-field"><label>状态</label><select class="select" name="status"><option ${placement.status === "启用" ? "selected" : ""}>启用</option><option ${placement.status === "停用" ? "selected" : ""}>停用</option></select></div>
    </div>
    <div class="panel-head" style="margin-top:18px"><button class="primary">保存投放</button></div>
  `;
}

function memberPriceForm(price = {}) {
  return `
    <div class="form-grid">
      <input type="hidden" name="id" value="${price.id || ""}">
      <div class="form-field"><label>商品</label><select class="select" name="productId">${memberProductOptions(price.productId)}</select></div>
      <div class="form-field"><label>适用等级</label><select class="select" name="levelId">${memberLevelOptions(price.levelId)}</select></div>
      <div class="form-field"><label>会员价</label><input class="input" name="memberPrice" type="number" step="0.01" value="${price.memberPrice ?? 0}" required></div>
      <div class="form-field"><label>状态</label><select class="select" name="status"><option ${price.status === "启用" ? "selected" : ""}>启用</option><option ${price.status === "停用" ? "selected" : ""}>停用</option></select></div>
    </div>
    <div class="panel-head" style="margin-top:18px"><button class="primary">保存会员价</button></div>
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
    const product = {
      id: data.id || `product-${Date.now()}`,
      name: data.name,
      category: data.category,
      price: Number(data.price),
      stock: Number(data.stock),
      threshold: Number(data.threshold),
      status: data.status || "已上架",
      tag: data.tag || "新品",
      desc: data.desc || data.tag || "",
      image: data.image || "",
      uploadStatus: data.image ? "后台已上传" : "未上传"
    };
    const index = state.products.findIndex((item) => item.id === product.id);
    if (index >= 0) {
      state.products[index] = { ...state.products[index], ...product };
      log("编辑商品", product.name);
      await syncResource("products", state.products[index], "PATCH");
    } else {
      state.products.unshift(product);
      log("新增商品", product.name);
      await syncResource("products", product);
    }
  }
  if (type === "coupon") {
    const couponId = normalizeCouponBusinessId(data.coupon_id) || nextNumericId(state.coupons || [], "coupon_id", 100001);
    const coupon = {
      id: data.id || `coupon-${couponId}`,
      coupon_id: couponId,
      name: data.name,
      type: data.type,
      usableProducts: formData.getAll("usableProducts"),
      amount: Number(data.amount),
      threshold: Number(data.threshold),
      stock: Number(data.stock),
      start: data.start,
      end: data.end,
      status: data.status || "启用",
      description: data.description || "",
      forMember: data.couponScope === "member"
    };
    if (coupon.type === "通用券") coupon.usableProducts = [];
    const index = (state.coupons || []).findIndex((item) => item.id === coupon.id);
    if (index >= 0) {
      state.coupons[index] = { ...state.coupons[index], ...coupon };
      log("编辑优惠券", coupon.name);
      await syncResource("coupons", state.coupons[index], "PATCH");
    } else {
      state.coupons = [coupon, ...(state.coupons || [])];
      log("新建优惠券", coupon.name);
      await syncResource("coupons", coupon);
    }
  }
  if (type === "campaign") {
    const activityId = normalizeActivityBusinessId(data.activity_id) || nextNumericId(state.campaigns || [], "activity_id", 200001);
    const boundCouponId = normalizeCouponBusinessId(data.coupon_id || data.couponId);
    const campaign = {
      id: data.id || `campaign-${activityId}`,
      activity_id: activityId,
      name: data.name,
      position: data.position,
      coupon_id: boundCouponId,
      couponId: boundCouponId,
      start: data.start,
      end: data.end,
      status: data.status || "待启用",
      title: data.title,
      subtitle: data.subtitle || "",
      image: data.image || "",
      sort: Number(data.sort || 10)
    };
    const index = (state.campaigns || []).findIndex((item) => item.id === campaign.id);
    if (index >= 0) {
      state.campaigns[index] = { ...state.campaigns[index], ...campaign };
      log("编辑活动投放", campaign.name);
      await syncResource("campaigns", state.campaigns[index], "PATCH");
    } else {
      state.campaigns = [campaign, ...(state.campaigns || [])];
      log("新建活动投放", campaign.name);
      await syncResource("campaigns", campaign);
    }
  }
  if (type === "memberLevel") {
    const level = {
      id: data.id || `level-${Date.now()}`,
      name: data.name,
      threshold: Number(data.threshold),
      growthRule: data.growthRule || "每消费1元累计1成长值",
      status: data.status || "启用"
    };
    const index = (state.memberLevels || []).findIndex((item) => item.id === level.id);
    if (index >= 0) {
      state.memberLevels[index] = { ...state.memberLevels[index], ...level };
      log("编辑会员等级", level.name);
      await syncResource("member-levels", state.memberLevels[index], "PATCH");
    } else {
      state.memberLevels = [level, ...(state.memberLevels || [])];
      log("新增会员等级", level.name);
      await syncResource("member-levels", level);
    }
  }
  if (type === "memberBenefit") {
    const benefit = {
      id: data.id || `benefit-${Date.now()}`,
      name: data.name,
      type: data.type,
      levelId: data.levelId,
      content: data.content || "",
      status: data.status || "启用"
    };
    const index = (state.memberBenefits || []).findIndex((item) => item.id === benefit.id);
    if (index >= 0) {
      state.memberBenefits[index] = { ...state.memberBenefits[index], ...benefit };
      log("编辑会员权益", benefit.name);
      await syncResource("member-benefits", state.memberBenefits[index], "PATCH");
    } else {
      state.memberBenefits = [benefit, ...(state.memberBenefits || [])];
      log("新增会员权益", benefit.name);
      await syncResource("member-benefits", benefit);
    }
  }
  if (type === "memberCouponPlacement") {
    const couponId = normalizeCouponBusinessId(data.coupon_id);
    const placement = {
      id: data.id || `member-coupon-placement-${couponId || Date.now()}`,
      name: data.name,
      coupon_id: couponId,
      levelId: data.levelId,
      cycle: data.cycle || "每月可领1次",
      start: data.start,
      end: data.end,
      status: data.status || "启用"
    };
    const index = (state.memberCouponPlacements || []).findIndex((item) => item.id === placement.id);
    if (index >= 0) {
      state.memberCouponPlacements[index] = { ...state.memberCouponPlacements[index], ...placement };
      log("编辑会员券投放", placement.name);
      await syncResource("member-coupon-placements", state.memberCouponPlacements[index], "PATCH");
    } else {
      state.memberCouponPlacements = [placement, ...(state.memberCouponPlacements || [])];
      log("新增会员券投放", placement.name);
      await syncResource("member-coupon-placements", placement);
    }
  }
  if (type === "memberPrice") {
    const memberPrice = {
      id: data.id || `member-price-${Date.now()}`,
      productId: data.productId,
      levelId: data.levelId,
      memberPrice: Number(data.memberPrice),
      status: data.status || "启用"
    };
    const index = (state.memberPrices || []).findIndex((item) => item.id === memberPrice.id);
    if (index >= 0) {
      state.memberPrices[index] = { ...state.memberPrices[index], ...memberPrice };
      log("编辑会员价", productById(memberPrice.productId)?.name || memberPrice.productId);
      await syncResource("member-prices", state.memberPrices[index], "PATCH");
    } else {
      state.memberPrices = [memberPrice, ...(state.memberPrices || [])];
      log("新增会员价", productById(memberPrice.productId)?.name || memberPrice.productId);
      await syncResource("member-prices", memberPrice);
    }
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

async function deleteProduct(id) {
  const product = state.products.find((item) => item.id === id);
  if (!product) return;
  state.products = state.products.filter((item) => item.id !== id);
  log("删除商品", product.name);
  await deleteResource("products", id);
  saveState();
  render();
}

function filterProducts() {
  const keyword = document.getElementById("productKeyword").value.trim();
  const list = state.products.filter((item) => !keyword || item.name.includes(keyword) || item.category.includes(keyword));
  document.getElementById("productTable").innerHTML = productTable(list);
  bindPageActions();
}

async function toggleCoupon(id) {
  const coupon = (state.coupons || []).find((item) => item.id === id);
  coupon.status = coupon.status === "启用" ? "停用" : "启用";
  log("优惠券启停", coupon.name);
  await syncResource("coupons", coupon, "PATCH");
  saveState();
  render();
}

async function deleteCoupon(id) {
  const coupon = (state.coupons || []).find((item) => item.id === id);
  state.coupons = (state.coupons || []).filter((item) => item.id !== id);
  log("删除优惠券", coupon.name);
  await deleteResource("coupons", id);
  saveState();
  render();
}

async function toggleCampaign(id) {
  const campaign = (state.campaigns || []).find((item) => item.id === id);
  campaign.status = campaign.status === "进行中" ? "已停用" : "进行中";
  log("活动投放启停", campaign.name);
  await syncResource("campaigns", campaign, "PATCH");
  saveState();
  render();
}

async function deleteCampaign(id) {
  const campaign = (state.campaigns || []).find((item) => item.id === id);
  state.campaigns = (state.campaigns || []).filter((item) => item.id !== id);
  log("删除活动投放", campaign.name);
  await deleteResource("campaigns", id);
  saveState();
  render();
}

async function toggleMemberResource(collection, apiName, id) {
  const item = (state[collection] || []).find((entry) => entry.id === id);
  if (!item) return;
  item.status = item.status === "启用" ? "停用" : "启用";
  log("会员配置启停", item.name || id);
  await syncResource(apiName, item, "PATCH");
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
document.getElementById("resetDataBtn").addEventListener("click", async () => {
  if (apiOnline) {
    try {
      state = await apiRequest("/api/reset", { method: "POST" });
    } catch {
      state = structuredClone(seedData);
    }
  } else {
    state = structuredClone(seedData);
  }
  saveState();
  render();
  showToast("演示数据已重置");
});

render();
loadRemoteState();
