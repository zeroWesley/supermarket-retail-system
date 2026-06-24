const app = getApp();

const stores = ["城南店", "城北店", "城东店", "大学城店"];
const shelves = ["A-酒水-01", "A-酒水-02", "B-生鲜-01", "C-冷藏-02", "D-日百-01"];
const mockProducts = [
  { productCode: "6901028001919", productName: "青岛啤酒 500ml 单罐", category: "酒水饮料", unit: "罐", shelf: "A-酒水-02" },
  { productCode: "6921168509256", productName: "农夫山泉 550ml", category: "酒水饮料", unit: "瓶", shelf: "A-酒水-01" },
  { productCode: "6948939650012", productName: "鲜牛奶 950ml 冷藏配送", category: "牛奶冷藏", unit: "盒", shelf: "C-冷藏-02" }
];

Page({
  data: {
    stores,
    shelves,
    storeIndex: 0,
    shelfIndex: 0,
    quantity: 24,
    scanned: null,
    records: app.globalData.stockRecords || [],
    submitEnabled: false
  },

  onShow() {
    this.setData({ records: app.globalData.stockRecords || [] });
  },

  scanCode() {
    wx.showLoading({ title: "识别中" });
    setTimeout(() => {
      const scanned = mockProducts[Math.floor(Math.random() * mockProducts.length)];
      const shelfIndex = shelves.indexOf(scanned.shelf);
      wx.hideLoading();
      this.setData({
        scanned,
        shelfIndex: shelfIndex >= 0 ? shelfIndex : 0,
        submitEnabled: true
      });
      wx.showToast({ title: "已识别商品", icon: "success" });
    }, 500);
  },

  chooseStore(event) {
    this.setData({ storeIndex: Number(event.detail.value) });
  },

  chooseShelf(event) {
    this.setData({ shelfIndex: Number(event.detail.value) });
  },

  onQuantity(event) {
    this.setData({ quantity: Number(event.detail.value || 0) });
  },

  clearScan() {
    this.setData({ scanned: null, submitEnabled: false, quantity: 24 });
  },

  confirmStock() {
    if (!this.data.scanned) {
      wx.showToast({ title: "请先扫码", icon: "none" });
      return;
    }
    if (!this.data.quantity || this.data.quantity <= 0) {
      wx.showToast({ title: "数量需大于0", icon: "none" });
      return;
    }
    const record = {
      id: `ST${Date.now()}`,
      ...this.data.scanned,
      store: stores[this.data.storeIndex],
      shelf: shelves[this.data.shelfIndex],
      quantity: this.data.quantity,
      operator: app.globalData.staff.name,
      time: "刚刚",
      type: "入库"
    };
    app.globalData.stockRecords = [record, ...(app.globalData.stockRecords || [])].slice(0, 10);
    this.setData({ records: app.globalData.stockRecords });
    wx.showModal({
      title: "入库已提交",
      content: `${record.productName} 已入库 ${record.quantity}${record.unit}，门店：${record.store}`,
      showCancel: false,
      success: () => this.clearScan()
    });
  }
});
