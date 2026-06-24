const app = getApp();

Page({
  data: {
    deliveries: [],
    activeDelivery: null,
    markers: [],
    polyline: []
  },

  onShow() {
    this.refresh();
    app.loadRemoteOrders().then(() => this.refresh());
  },

  refresh() {
    const deliveries = app.globalData.deliveries || [];
    const activeDelivery = deliveries.find((item) => item.status === "配送中") || deliveries[0] || null;
    this.setData({
      deliveries,
      activeDelivery,
      markers: activeDelivery ? this.buildMarkers(activeDelivery) : [],
      polyline: activeDelivery ? this.buildPolyline(activeDelivery) : []
    });
  },

  buildMarkers(delivery) {
    return [
      { id: 1, latitude: 30.273, longitude: 120.1536, title: "城南店", width: 28, height: 28 },
      { id: 2, latitude: delivery.latitude || 30.2741, longitude: delivery.longitude || 120.1551, title: delivery.address, width: 32, height: 32 }
    ];
  },

  buildPolyline(delivery) {
    return [{
      points: [
        { latitude: 30.273, longitude: 120.1536 },
        { latitude: delivery.latitude || 30.2741, longitude: delivery.longitude || 120.1551 }
      ],
      color: "#13b66b",
      width: 5,
      dottedLine: false
    }];
  },

  selectDelivery(event) {
    const id = event.currentTarget.dataset.id;
    const activeDelivery = this.data.deliveries.find((item) => item.id === id);
    this.setData({
      activeDelivery,
      markers: this.buildMarkers(activeDelivery),
      polyline: this.buildPolyline(activeDelivery)
    });
  },

  startDelivery(event) {
    const id = event.currentTarget.dataset.id;
    const delivery = app.globalData.deliveries.find((item) => item.id === id);
    if (delivery) delivery.status = "配送中";
    app.updateOrderStatus(id, "配送中").catch(() => null).finally(() => {
      wx.showToast({ title: "已开始配送", icon: "success" });
      this.refresh();
    });
  },

  finishDelivery(event) {
    const id = event.currentTarget.dataset.id;
    const delivery = app.globalData.deliveries.find((item) => item.id === id);
    wx.showModal({
      title: "确认送达",
      content: `确认订单 #${id} 已交付给用户？`,
      confirmText: "确认送达",
      success: (res) => {
        if (!res.confirm) return;
        if (delivery) {
          app.globalData.historyOrders = [{
            id: delivery.id,
            user: delivery.user,
            address: delivery.address,
            amount: delivery.amount || 0,
            status: "已完成",
            finishedAt: "刚刚",
            items: delivery.items || "配送订单"
          }, ...(app.globalData.historyOrders || [])];
          app.globalData.deliveries = app.globalData.deliveries.filter((item) => item.id !== id);
        }
        app.updateOrderStatus(id, "已完成").catch(() => null).finally(() => {
          wx.showToast({ title: "配送完成", icon: "success" });
          this.refresh();
        });
      }
    });
  },

  callUser(event) {
    wx.showModal({
      title: "联系用户",
      content: `将拨打 ${event.currentTarget.dataset.phone}`,
      confirmText: "模拟拨打",
      success(res) {
        if (res.confirm) wx.showToast({ title: "已发起", icon: "success" });
      }
    });
  },

  openHistory() {
    wx.navigateTo({ url: "/pages/history/history" });
  }
});
