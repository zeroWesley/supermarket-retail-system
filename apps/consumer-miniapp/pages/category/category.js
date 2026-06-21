const app = getApp();

Page({
  data: {
    categories: app.globalData.categories,
    activeId: "hot",
    products: []
  },

  onLoad() {
    this.refreshProducts("hot");
  },

  selectCategory(event) {
    const activeId = event.currentTarget.dataset.id;
    this.refreshProducts(activeId);
  },

  refreshProducts(activeId) {
    const products = activeId === "hot"
      ? app.globalData.products
      : app.globalData.products.filter((item) => item.categoryId === activeId);
    this.setData({ activeId, products });
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
  }
});
