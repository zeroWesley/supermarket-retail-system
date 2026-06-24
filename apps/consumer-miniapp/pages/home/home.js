const app = getApp();

Page({
  data: {
    store: app.globalData.store,
    products: [],
    promotions: [],
    heroCampaign: null,
    quickEntries: [
      { id: "beer", icon: "啤", name: "畅饮啤酒", note: "冰镇快送" },
      { id: "beer", icon: "酿", name: "精酿啤酒", note: "小众上新" },
      { id: "beer", icon: "白", name: "经典白酒", note: "宴请常备" },
      { id: "beer", icon: "洋", name: "洋酒烈酒", note: "聚会微醺" },
      { id: "beer", icon: "葡", name: "葡萄酒", note: "餐酒搭配" },
      { id: "beer", icon: "威", name: "威士忌", note: "精选口粮" },
      { id: "snack", icon: "零", name: "下酒零食", note: "搭配更省" },
      { id: "daily", icon: "急", name: "餐厅急送", note: "缺啥补啥" },
      { id: "fresh", icon: "鲜", name: "水果生鲜", note: "门店现拣" },
      { id: "milk", icon: "乳", name: "牛奶冷藏", note: "低温配送" }
    ],
    featureTiles: [
      { title: "限时抢购", subtitle: "02:33:43 截止", price: "¥19.9" },
      { title: "Zero上新", subtitle: "喝点不一样的", price: "¥3.9" },
      { title: "买手推荐", subtitle: "甄选常购好物", price: "¥49" },
      { title: "Zero榜单", subtitle: "万人订单推荐", price: "TOP1" }
    ],
    shelfTabs: ["猜你喜欢", "整箱更省", "名酒真品", "微醺酒馆"]
  },

  refreshFromGlobal() {
    const activeCampaigns = app.globalData.campaigns
      .filter((item) => item.status === "进行中")
      .sort((a, b) => Number(a.sort || 99) - Number(b.sort || 99));
    const heroCampaign = activeCampaigns.find((item) => item.position === "首页主Banner") || activeCampaigns[0] || null;
    const couponCampaigns = activeCampaigns.filter((item) => item.position === "首页优惠券区").slice(0, 3);
    const fallbackPromotions = app.globalData.promotions.filter((item) => item.status === "进行中").slice(0, 3);
    this.setData({
      products: app.globalData.products.slice(0, 6),
      promotions: couponCampaigns.length ? couponCampaigns : fallbackPromotions,
      heroCampaign
    });
  },

  onLoad() {
    this.refreshFromGlobal();
    app.loadRemoteData().then(() => {
      this.refreshFromGlobal();
    });
  },

  goProduct(event) {
    wx.navigateTo({
      url: `/pages/product/product?id=${event.currentTarget.dataset.id}`
    });
  },

  addCart(event) {
    const productId = event.currentTarget.dataset.id;
    const item = app.globalData.cart.find((cartItem) => cartItem.productId === productId);
    if (item) item.quantity += 1;
    else app.globalData.cart.push({ productId, quantity: 1 });
    wx.showToast({ title: "已加入购物车", icon: "success" });
  },

  goCategory(event) {
    app.globalData.defaultCategory = event.currentTarget.dataset.id || "hot";
    wx.switchTab({ url: "/pages/category/category" });
  },

  openCoupon() {
    wx.showToast({ title: "优惠券已领取", icon: "success" });
  }
});
