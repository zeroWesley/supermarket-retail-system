const app = getApp();

Page({
  data: {
    items: app.globalData.pickingItems
  },

  checkItem(event) {
    const id = event.currentTarget.dataset.id;
    const item = app.globalData.pickingItems.find((entry) => entry.id === id);
    if (item) item.status = "已核验";
    this.setData({ items: app.globalData.pickingItems });
  },

  finishPicking() {
    wx.showModal({
      title: "拣货完成",
      content: "库存将在员工确认后模拟扣减。",
      showCancel: false
    });
  }
});
