const { request } = require("./utils/api");

App({
  globalData: {
    store: {
      id: "store-south",
      name: "Zero便利超市 · 城南店",
      eta: "约32分钟达",
      distance: "1.2km"
    },
    categories: [
      { id: "hot", name: "热销" },
      { id: "fresh", name: "水果生鲜" },
      { id: "beer", name: "酒水饮料" },
      { id: "milk", name: "牛奶冷藏" },
      { id: "snack", name: "休闲零食" },
      { id: "daily", name: "日用百货" }
    ],
    products: [
      {
        id: "beer-qingdao",
        categoryId: "beer",
        name: "青岛啤酒 500ml 单罐",
        desc: "冰镇更畅快，员工自配送",
        price: 5.5,
        oldPrice: 6.5,
        stock: 126,
        tag: "限时特价",
        icon: "酒"
      },
      {
        id: "apple-fuji",
        categoryId: "fresh",
        name: "烟台红富士苹果 约500g",
        desc: "新鲜脆甜，门店现拣",
        price: 6.9,
        stock: 42,
        tag: "满减可用",
        icon: "鲜"
      },
      {
        id: "milk-fresh",
        categoryId: "milk",
        name: "鲜牛奶 950ml 冷藏配送",
        desc: "低温商品，尽快送达",
        price: 13.8,
        stock: 8,
        tag: "库存预警",
        icon: "乳"
      },
      {
        id: "vegetable-green",
        categoryId: "fresh",
        name: "精选上海青 约400g",
        desc: "生鲜称重，允许员工调整",
        price: 4.99,
        stock: 32,
        tag: "今日到货",
        icon: "菜"
      },
      {
        id: "chips",
        categoryId: "snack",
        name: "原味薯片 104g",
        desc: "聚会零食搭配",
        price: 8.8,
        stock: 58,
        tag: "第二件半价",
        icon: "零"
      },
      {
        id: "tissue",
        categoryId: "daily",
        name: "抽纸 3包/提",
        desc: "家庭日用补货",
        price: 12.9,
        stock: 74,
        tag: "常购",
        icon: "家"
      }
    ],
    promotions: [
      {
        id: "promo-full-79",
        name: "满79减10",
        type: "满减",
        target: "全场商品",
        status: "进行中",
        displayText: "满79减10 · 全场商品"
      },
      {
        id: "promo-beer-night",
        name: "酒水夜间特价",
        type: "限时特价",
        target: "酒水饮料",
        status: "进行中",
        displayText: "酒水夜间特价 · 酒水饮料"
      },
      {
        id: "promo-free-delivery",
        name: "满99免配送费",
        type: "配送优惠",
        target: "全场商品",
        status: "进行中",
        displayText: "满99免配送费 · 全场商品"
      }
    ],
    coupons: [
      { id: "coupon-full-79", coupon_id: "coupon-full-79", name: "满79减10", type: "通用券", amount: 10, threshold: 79, status: "启用" },
      { id: "coupon-full-99", coupon_id: "coupon-full-99", name: "满99减15", type: "通用券", amount: 15, threshold: 99, status: "启用" }
    ],
    campaigns: [
      { id: "campaign-home-banner", activity_id: "activity-home-banner", name: "首页主Banner", position: "首页主Banner", coupon_id: "coupon-full-79", couponId: "coupon-full-79", status: "进行中", title: "今晚吃喝用，一次配齐", subtitle: "生鲜酒水员工自配送 · 缺货先确认再处理", sort: 1 },
      { id: "campaign-coupon-row-99", activity_id: "activity-coupon-row-99", name: "首页券区", position: "首页优惠券区", coupon_id: "coupon-full-99", couponId: "coupon-full-99", status: "进行中", title: "满99减15", subtitle: "全场商品可用", sort: 2 }
    ],
    cart: [
      { productId: "beer-qingdao", quantity: 6 },
      { productId: "apple-fuji", quantity: 2 },
      { productId: "milk-fresh", quantity: 1 }
    ],
    orders: [
      {
        id: "20260621001",
        status: "配送中",
        amount: 63.6,
        items: "青岛啤酒、苹果、牛奶等 3 件",
        timeline: ["模拟支付成功", "员工已完成拣货", "订单配送中"]
      },
      {
        id: "20260620018",
        status: "待拣货",
        amount: 48.2,
        items: "上海青、鸡蛋、调味料等 5 件",
        timeline: ["模拟支付成功", "等待员工接单"]
      }
    ]
  },

  loadRemoteData() {
    return request("/api/bootstrap")
      .then((data) => {
        this.globalData.categories = data.categories || this.globalData.categories;
        this.globalData.products = data.products || this.globalData.products;
        this.globalData.promotions = data.promotions || this.globalData.promotions;
        this.globalData.coupons = data.coupons || this.globalData.coupons;
        this.globalData.campaigns = data.campaigns || this.globalData.campaigns;
        this.globalData.orders = data.orders || this.globalData.orders;
        return data;
      })
      .catch(() => null);
  },

  createOrder(payload) {
    return request("/api/public/orders", {
      method: "POST",
      data: payload
    }).then((order) => {
      this.globalData.orders.unshift(order);
      return order;
    });
  }
});
