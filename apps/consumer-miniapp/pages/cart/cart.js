const app = getApp();

function money(value) {
  return Number(value).toFixed(2);
}

Page({
  data: {
    items: [],
    total: "0.00",
    payAmount: "0.00",
    gapAmount: "0.00",
    discountText: "满79减10，暂未满足"
  },

  onShow() {
    this.refresh();
  },

  refresh() {
    const items = app.globalData.cart
      .map((cartItem) => {
        const product = app.globalData.products.find((item) => item.id === cartItem.productId);
        return {
          ...cartItem,
          product,
          subtotal: money(product.price * cartItem.quantity)
        };
      })
      .filter((item) => item.product && item.quantity > 0);
    const total = items.reduce((sum, item) => sum + Number(item.subtotal), 0);
    const discount = total >= 79 ? 10 : 0;
    this.setData({
      items,
      total: money(total),
      payAmount: money(total + 3 - discount),
      gapAmount: money(Math.max(79 - total, 0)),
      discountText: discount ? "满79减10，已抵扣 ¥10.00" : "满79减10，暂未满足"
    });
  },

  plus(event) {
    const item = app.globalData.cart.find((cartItem) => cartItem.productId === event.currentTarget.dataset.id);
    if (item) item.quantity += 1;
    this.refresh();
  },

  minus(event) {
    const item = app.globalData.cart.find((cartItem) => cartItem.productId === event.currentTarget.dataset.id);
    if (item) item.quantity = Math.max(item.quantity - 1, 0);
    this.refresh();
  },

  submitOrder() {
    const itemNames = this.data.items.map((item) => item.product.name).join("、");
    app.createOrder({
      amount: Number(this.data.payAmount),
      items: `${itemNames}等 ${this.data.items.length} 件`,
      remark: "啤酒要冰的，水果挑硬一点",
      store: "城南店"
    }).catch(() => null).finally(() => {
      wx.showModal({
        title: "模拟支付成功",
        content: "订单已提交，等待门店员工接单拣货。",
        showCancel: false,
        success: () => wx.switchTab({ url: "/pages/orders/orders" })
      });
    });
  }
});
