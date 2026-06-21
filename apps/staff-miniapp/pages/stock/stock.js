Page({
  data: {
    stockItem: {
      name: "青岛啤酒 500ml",
      type: "补货入库",
      quantity: "+36"
    }
  },

  scanCode() {
    wx.showToast({ title: "已识别商品", icon: "success" });
  },

  toggleType() {
    const isIn = this.data.stockItem.type === "补货入库";
    this.setData({
      stockItem: {
        ...this.data.stockItem,
        type: isIn ? "拣货出库" : "补货入库",
        quantity: isIn ? "-6" : "+36"
      }
    });
  },

  confirmStock() {
    wx.showModal({
      title: "库存已同步",
      content: "本次操作已写入模拟库存记录。",
      showCancel: false
    });
  }
});
