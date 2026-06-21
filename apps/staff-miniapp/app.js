const { request } = require("./utils/api");

App({
  globalData: {
    staff: {
      name: "张师傅",
      store: "Zero便利超市 · 城南店"
    },
    stats: {
      pendingOrders: 12,
      picking: 8,
      delivering: 5
    },
    orders: [
      {
        id: "20260621002",
        user: "周女士",
        phone: "138****1024",
        address: "云桥花园 6 栋",
        amount: 48.2,
        status: "待接单",
        remark: "菜要新鲜",
        items: "上海青、鸡蛋、调味料等 5 件"
      },
      {
        id: "20260621001",
        user: "李先生",
        phone: "138****8888",
        address: "绿洲小区 3 栋 1602",
        amount: 63.6,
        status: "已接单",
        remark: "啤酒要冰的，水果挑硬一点",
        items: "青岛啤酒、苹果、牛奶等 3 件"
      }
    ],
    pickingItems: [
      { id: "beer", name: "青岛啤酒 500ml", required: 6, stock: 126, status: "已核验" },
      { id: "apple", name: "红富士苹果 500g", required: 2, stock: 42, status: "待核验" },
      { id: "milk", name: "鲜牛奶 950ml", required: 1, stock: 8, status: "库存预警" }
    ],
    deliveries: [
      {
        id: "20260621001",
        user: "李先生",
        distance: "1.2km",
        address: "绿洲小区 3 栋 1602",
        phone: "138****8888",
        eta: "18:30 前送达",
        status: "配送中"
      },
      {
        id: "20260621005",
        user: "王先生",
        distance: "2.4km",
        address: "万达公寓 12 层",
        phone: "138****5521",
        eta: "19:00 前送达",
        status: "待出发"
      }
    ]
  },

  loadRemoteOrders() {
    return request("/api/staff/orders")
      .then((orders) => {
        this.globalData.orders = orders;
        this.globalData.deliveries = orders
          .filter((item) => ["已接单", "已拣货", "配送中", "待出发"].includes(item.status))
          .map((item) => ({
            id: item.id,
            user: item.user,
            distance: item.distance || "1.2km",
            address: item.address,
            phone: item.phone,
            eta: "18:30 前送达",
            status: item.status === "配送中" ? "配送中" : "待出发"
          }));
        this.globalData.stats = {
          pendingOrders: orders.filter((item) => item.status === "待接单").length,
          picking: orders.filter((item) => ["已接单", "待拣货"].includes(item.status)).length,
          delivering: orders.filter((item) => item.status === "配送中").length
        };
        return orders;
      })
      .catch(() => null);
  },

  updateOrderStatus(id, status) {
    return request(`/api/staff/orders/${id}/status`, {
      method: "PATCH",
      data: { status }
    }).then((order) => {
      const index = this.globalData.orders.findIndex((item) => item.id === id);
      if (index >= 0) this.globalData.orders[index] = order;
      return order;
    });
  }
});
