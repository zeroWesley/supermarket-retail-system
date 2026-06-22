const app = getApp();

Page({
  data: {
    store: app.globalData.store,
    products: [],
    promotions: [],
    quickEntries: [
      { icon: "鲜", name: "水果生鲜" },
      { icon: "酒", name: "酒水饮料" },
      { icon: "乳", name: "牛奶冷藏" },
      { icon: "折", name: "今日特价" },
      { icon: "菜", name: "粮油调味" },
      { icon: "零", name: "休闲零食" },
      { icon: "家", name: "日用百货" },
      { icon: "券", name: "领券中心" }
    ]
  },

  refreshFromGlobal() {
    const activePromotions = app.globalData.promotions.filter((item) => item.status === "进行中").slice(0, 3);
    this.setData({
      products: app.globalData.products.slice(0, 6),
      promotions: activePromotions
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
  }
});
