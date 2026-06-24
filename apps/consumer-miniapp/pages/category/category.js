const app = getApp();

Page({
  data: {
    categories: app.globalData.categories,
    activeId: "hot",
    products: [],
    sortTabs: ["猜你喜欢", "默认", "销量", "价格", "筛选"],
    activeSort: 1,
    couponCount: 0,
    bannerTitle: "选购指南",
    bannerDesc: "酒水、生鲜、零食一站配齐"
  },

  onLoad() {
    this.refreshProducts("hot");
    app.loadRemoteData().then(() => {
      this.setData({ categories: app.globalData.categories });
      this.refreshProducts(this.data.activeId);
    });
  },

  onShow() {
    const defaultCategory = app.globalData.defaultCategory;
    if (defaultCategory) {
      app.globalData.defaultCategory = "";
      this.refreshProducts(defaultCategory);
    }
  },

  selectCategory(event) {
    const activeId = event.currentTarget.dataset.id;
    this.refreshProducts(activeId);
  },

  selectSort(event) {
    this.setData({ activeSort: Number(event.currentTarget.dataset.index) });
  },

  refreshProducts(activeId) {
    const products = activeId === "hot"
      ? app.globalData.products
      : app.globalData.products.filter((item) => item.categoryId === activeId);
    this.setData({
      activeId,
      products,
      couponCount: app.globalData.coupons.filter((item) => item.status === "启用").length
    });
  },

  goProduct(event) {
    wx.navigateTo({ url: `/pages/product/product?id=${event.currentTarget.dataset.id}` });
  },

  addCart(event) {
    const productId = event.currentTarget.dataset.id;
    const item = app.globalData.cart.find((cartItem) => cartItem.productId === productId);
    if (item) item.quantity += 1;
    else app.globalData.cart.push({ productId, quantity: 1 });
    wx.showToast({ title: "已加入购物车", icon: "success" });
  },

  openCoupon() {
    wx.showToast({ title: "可用券已展开", icon: "success" });
  }
});
