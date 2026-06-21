const app = getApp();

Page({
  data: {
    store: app.globalData.store,
    product: null
  },

  onLoad(options) {
    const product = app.globalData.products.find((item) => item.id === options.id) || app.globalData.products[0];
    this.setData({ product });
  },

  addCart() {
    const productId = this.data.product.id;
    const item = app.globalData.cart.find((cartItem) => cartItem.productId === productId);
    if (item) item.quantity += 1;
    else app.globalData.cart.push({ productId, quantity: 1 });
    wx.showToast({ title: "已加入购物车", icon: "success" });
  },

  buyNow() {
    this.addCart();
    wx.switchTab({ url: "/pages/cart/cart" });
  }
});
