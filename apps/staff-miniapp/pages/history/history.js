const app = getApp();

Page({
  data: {
    keyword: "",
    range: "全部",
    ranges: ["全部", "今日", "昨日"],
    rangeIndex: 0,
    orders: []
  },

  onShow() {
    this.refresh();
  },

  onKeyword(event) {
    this.setData({ keyword: event.detail.value }, () => this.refresh());
  },

  chooseRange(event) {
    const rangeIndex = Number(event.detail.value);
    this.setData({ rangeIndex, range: this.data.ranges[rangeIndex] }, () => this.refresh());
  },

  refresh() {
    const keyword = this.data.keyword.trim();
    const range = this.data.range;
    const orders = (app.globalData.historyOrders || []).filter((item) => {
      const matchKeyword = !keyword || item.id.includes(keyword) || item.user.includes(keyword) || item.address.includes(keyword);
      const matchRange = range === "全部" || (range === "今日" ? item.finishedAt === "刚刚" : item.finishedAt.includes("昨天"));
      return matchKeyword && matchRange;
    });
    this.setData({ orders });
  },

  viewDetail(event) {
    const id = event.currentTarget.dataset.id;
    const order = this.data.orders.find((item) => item.id === id);
    wx.showModal({
      title: `订单 #${id}`,
      content: `${order.items}\n${order.address}\n完成时间：${order.finishedAt}`,
      showCancel: false
    });
  }
});
