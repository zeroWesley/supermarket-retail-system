const app = getApp();

Page({
  data: {
    deliveries: app.globalData.deliveries
  },

  finishDelivery(event) {
    const id = event.currentTarget.dataset.id;
    const delivery = app.globalData.deliveries.find((item) => item.id === id);
    if (delivery) delivery.status = delivery.status === "配送中" ? "已送达" : "配送中";
    this.setData({ deliveries: app.globalData.deliveries });
  }
});
