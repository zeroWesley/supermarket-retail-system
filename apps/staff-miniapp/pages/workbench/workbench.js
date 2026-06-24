const app = getApp();

Page({
  data: {
    staff: app.globalData.staff,
    stats: app.globalData.stats,
    urgentOrder: null,
    nextDelivery: null,
    lastStock: null
  },

  onShow() {
    this.refresh();
    app.loadRemoteOrders().then(() => this.refresh());
  },

  refresh() {
    const orders = app.globalData.orders || [];
    const deliveries = app.globalData.deliveries || [];
    this.setData({
      staff: app.globalData.staff,
      stats: app.globalData.stats,
      urgentOrder: orders.find((item) => item.status === "待接单" || item.status === "缺货异常") || orders[0],
      nextDelivery: deliveries.find((item) => item.status === "配送中") || deliveries[0],
      lastStock: (app.globalData.stockRecords || [])[0]
    });
  },

  goOrders() {
    wx.switchTab({ url: "/pages/orders/orders" });
  },

  goStock() {
    wx.switchTab({ url: "/pages/stock/stock" });
  },

  goDelivery() {
    wx.switchTab({ url: "/pages/delivery/delivery" });
  },

  goHistory() {
    wx.navigateTo({ url: "/pages/history/history" });
  },

  callStore() {
    wx.showModal({
      title: "联系门店",
      content: "将拨打城南店值班电话 0571-88880000",
      confirmText: "模拟拨打",
      success(res) {
        if (res.confirm) wx.showToast({ title: "已发起", icon: "success" });
      }
    });
  }
});
