const app = getApp();

const tabs = ["待接单", "出库中", "配送中"];

Page({
  data: {
    tabs,
    activeTab: "待接单",
    orders: [],
    keyword: ""
  },

  onShow() {
    this.refresh();
    app.loadRemoteOrders().then(() => this.refresh());
  },

  refresh() {
    const keyword = this.data.keyword.trim();
    const orders = (app.globalData.orders || []).filter((item) => {
      const matchTab =
        this.data.activeTab === "待接单"
          ? item.status === "待接单"
          : this.data.activeTab === "出库中"
            ? ["已接单", "待拣货", "已拣货"].includes(item.status)
            : item.status === "配送中";
      const matchKeyword = !keyword || item.id.includes(keyword) || item.user.includes(keyword) || item.address.includes(keyword) || item.phone.includes(keyword);
      return matchTab && matchKeyword;
    });
    this.setData({ orders });
  },

  switchTab(event) {
    this.setData({ activeTab: event.currentTarget.dataset.tab }, () => this.refresh());
  },

  onKeyword(event) {
    this.setData({ keyword: event.detail.value }, () => this.refresh());
  },

  acceptOrder(event) {
    const id = event.currentTarget.dataset.id;
    this.patchOrder(id, "已接单", "已接单，可开始扫码出库");
  },

  scanOut(event) {
    const id = event.currentTarget.dataset.id;
    wx.showLoading({ title: "扫码中" });
    setTimeout(() => {
      wx.hideLoading();
      this.patchOrder(id, "已拣货", "商品已扫码出库");
    }, 500);
  },

  startDelivery(event) {
    const id = event.currentTarget.dataset.id;
    this.patchOrder(id, "配送中", "已转入配送任务");
    wx.switchTab({ url: "/pages/delivery/delivery" });
  },

  reportIssue(event) {
    const id = event.currentTarget.dataset.id;
    wx.showActionSheet({
      itemList: ["商品缺货", "用户电话无人接", "地址不清晰"],
      success: (res) => {
        const reasons = ["商品缺货", "用户电话无人接", "地址不清晰"];
        const order = app.globalData.orders.find((item) => item.id === id);
        if (order) {
          order.status = "缺货异常";
          order.abnormal = reasons[res.tapIndex];
        }
        this.refresh();
        wx.showToast({ title: "已上报", icon: "success" });
      }
    });
  },

  callUser(event) {
    const phone = event.currentTarget.dataset.phone;
    wx.showModal({
      title: "联系用户",
      content: `将拨打 ${phone}`,
      confirmText: "模拟拨打",
      success(res) {
        if (res.confirm) wx.showToast({ title: "已发起", icon: "success" });
      }
    });
  },

  openPicking(event) {
    wx.navigateTo({ url: `/pages/picking/picking?id=${event.currentTarget.dataset.id}` });
  },

  patchOrder(id, status, message) {
    const order = app.globalData.orders.find((item) => item.id === id);
    if (order) order.status = status;
    this.refresh();
    app.updateOrderStatus(id, status)
      .catch(() => null)
      .finally(() => {
        wx.showToast({ title: message, icon: "success" });
        app.loadRemoteOrders().then(() => this.refresh());
      });
  }
});
