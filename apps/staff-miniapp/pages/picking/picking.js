const app = getApp();

Page({
  data: {
    orderId: "",
    order: null,
    items: []
  },

  onLoad(options) {
    const orderId = options.id || "20260621001";
    this.setData({ orderId }, () => this.refresh());
  },

  refresh() {
    const order = (app.globalData.orders || []).find((item) => item.id === this.data.orderId) || app.globalData.orders[0];
    this.setData({ order, items: app.globalData.pickingItems });
  },

  checkItem(event) {
    const id = event.currentTarget.dataset.id;
    const item = app.globalData.pickingItems.find((entry) => entry.id === id);
    if (!item) return;
    wx.showLoading({ title: "扫码核验" });
    setTimeout(() => {
      wx.hideLoading();
      item.status = "已核验";
      this.setData({ items: app.globalData.pickingItems });
      wx.showToast({ title: "核验通过", icon: "success" });
    }, 450);
  },

  reportItem(event) {
    const id = event.currentTarget.dataset.id;
    const item = app.globalData.pickingItems.find((entry) => entry.id === id);
    if (item) item.status = "库存预警";
    this.setData({ items: app.globalData.pickingItems });
    wx.showToast({ title: "已标记异常", icon: "success" });
  },

  finishPicking() {
    const unchecked = this.data.items.filter((item) => item.status !== "已核验");
    if (unchecked.length) {
      wx.showModal({
        title: "仍有未核验商品",
        content: `还有 ${unchecked.length} 项未核验，是否继续完成出库？`,
        confirmText: "继续出库",
        success: (res) => {
          if (res.confirm) this.submitPicking();
        }
      });
      return;
    }
    this.submitPicking();
  },

  submitPicking() {
    app.updateOrderStatus(this.data.order.id, "已拣货").catch(() => null).finally(() => {
      wx.showModal({
        title: "出库完成",
        content: "商品已完成扫码出库，可进入配送任务。",
        confirmText: "去配送",
        success(res) {
          if (res.confirm) wx.switchTab({ url: "/pages/delivery/delivery" });
        }
      });
    });
  }
});
