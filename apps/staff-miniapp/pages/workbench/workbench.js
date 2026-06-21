const app = getApp();

Page({
  data: {
    staff: app.globalData.staff,
    stats: app.globalData.stats
  },

  goOrders() {
    wx.switchTab({ url: "/pages/orders/orders" });
  },

  goStock() {
    wx.switchTab({ url: "/pages/stock/stock" });
  }
});
