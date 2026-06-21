const app = getApp();

Page({
  data: {
    orders: []
  },

  onShow() {
    this.setData({ orders: app.globalData.orders });
    app.loadRemoteData().then(() => {
      this.setData({ orders: app.globalData.orders });
    });
  }
});
