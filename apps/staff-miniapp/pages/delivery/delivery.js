const app = getApp();

Page({
  data: {
    deliveries: app.globalData.deliveries
  },

  onShow() {
    this.setData({ deliveries: app.globalData.deliveries });
    app.loadRemoteOrders().then(() => {
      this.setData({ deliveries: app.globalData.deliveries });
    });
  },

  finishDelivery(event) {
    const id = event.currentTarget.dataset.id;
    const delivery = app.globalData.deliveries.find((item) => item.id === id);
    if (delivery) delivery.status = delivery.status === "配送中" ? "已完成" : "配送中";
    this.setData({ deliveries: app.globalData.deliveries });
    app.updateOrderStatus(id, delivery.status).then(() => app.loadRemoteOrders()).then(() => {
      this.setData({ deliveries: app.globalData.deliveries });
    });
  }
});
