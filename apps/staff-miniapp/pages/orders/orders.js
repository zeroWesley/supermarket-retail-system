const app = getApp();

Page({
  data: {
    orders: app.globalData.orders
  },

  onShow() {
    this.setData({ orders: app.globalData.orders });
    app.loadRemoteOrders().then(() => {
      this.setData({ orders: app.globalData.orders });
    });
  },

  acceptOrder(event) {
    const id = event.currentTarget.dataset.id;
    const order = app.globalData.orders.find((item) => item.id === id);
    if (order) order.status = "已接单";
    this.setData({ orders: app.globalData.orders });
    app.updateOrderStatus(id, "已接单").finally(() => {
      wx.showToast({ title: "已接单", icon: "success" });
      app.loadRemoteOrders().then(() => this.setData({ orders: app.globalData.orders }));
    });
  }
});
