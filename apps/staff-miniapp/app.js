const { request } = require("./utils/api");

App({
  globalData: {
    staff: {
      name: "张师傅",
      id: "staff-zhang",
      store: "Zero便利超市 · 城南店",
      storeId: "south",
      phone: "138****0002",
      shift: "早班 09:00-18:00"
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
        items: "上海青、鸡蛋、调味料等 5 件",
        distance: "2.1km",
        eta: "18:50前送达",
        pickedCount: 0,
        totalCount: 5
      },
      {
        id: "20260621001",
        user: "李先生",
        phone: "138****8888",
        address: "绿洲小区 3 栋 1602",
        amount: 63.6,
        status: "已接单",
        remark: "啤酒要冰的，水果挑硬一点",
        items: "青岛啤酒、苹果、牛奶等 3 件",
        distance: "1.2km",
        eta: "18:30前送达",
        pickedCount: 1,
        totalCount: 3
      }
    ],
    pickingItems: [
      { id: "beer", name: "青岛啤酒 500ml", required: 6, stock: 126, status: "已核验" },
      { id: "apple", name: "红富士苹果 500g", required: 2, stock: 42, status: "待核验" },
      { id: "milk", name: "鲜牛奶 950ml", required: 1, stock: 8, status: "库存预警" }
    ],
    stockRecords: [
      { id: "ST20260624001", productCode: "6901028001919", productName: "青岛啤酒 500ml 单罐", store: "城南店", quantity: 36, shelf: "A-酒水-02", operator: "张师傅", time: "09:18", type: "入库" },
      { id: "ST20260624002", productCode: "6921168509256", productName: "农夫山泉 550ml", store: "城南店", quantity: 48, shelf: "A-饮料-01", operator: "张师傅", time: "10:02", type: "入库" }
    ],
    deliveries: [
      {
        id: "20260621001",
        user: "李先生",
        distance: "1.2km",
        address: "绿洲小区 3 栋 1602",
        phone: "138****8888",
        eta: "18:30 前送达",
        status: "配送中",
        latitude: 30.2741,
        longitude: 120.1551
      },
      {
        id: "20260621005",
        user: "王先生",
        distance: "2.4km",
        address: "万达公寓 12 层",
        phone: "138****5521",
        eta: "19:00 前送达",
        status: "待出发",
        latitude: 30.2812,
        longitude: 120.162
      }
    ],
    historyOrders: [
      { id: "20260623012", user: "陈女士", address: "绿洲小区 8 栋", amount: 56.8, status: "已完成", finishedAt: "昨天 17:42", items: "水果、牛奶等 4 件" },
      { id: "20260623009", user: "赵先生", address: "云桥花园 2 栋", amount: 92.5, status: "已完成", finishedAt: "昨天 15:20", items: "酒水、零食等 6 件" },
      { id: "20260622018", user: "林女士", address: "星河湾 1 栋", amount: 37.9, status: "已完成", finishedAt: "06-22 19:05", items: "日用品 3 件" }
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
            amount: item.amount,
            items: item.items,
            distance: item.distance || "1.2km",
            address: item.address,
            phone: item.phone,
            eta: item.eta || "18:30 前送达",
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
