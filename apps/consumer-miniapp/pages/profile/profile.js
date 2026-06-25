const app = getApp();

function memberSummary() {
  const user = app.globalData.memberUser;
  const levels = [...(app.globalData.memberLevels || [])].sort((a, b) => Number(a.threshold) - Number(b.threshold));
  const current = levels.find((item) => item.id === user.levelId) || levels[0] || {};
  const next = levels.find((item) => Number(item.threshold) > Number(current.threshold || 0));
  const gap = next ? Math.max(Number(next.threshold) - Number(user.growth || 0), 0) : 0;
  return {
    user,
    current,
    next,
    gap,
    progressText: next ? `距${next.name}还差${gap}` : "已达最高等级"
  };
}

Page({
  data: {
    member: memberSummary(),
    orderActions: [
      { icon: "付", name: "待支付" },
      { icon: "收", name: "待收货" },
      { icon: "评", name: "我的评价" },
      { icon: "退", name: "售后/退款" }
    ],
    services: [
      { icon: "指", name: "选购指南" },
      { icon: "券", name: "优惠券" },
      { icon: "址", name: "地址管理" },
      { icon: "客", name: "客服帮助" },
      { icon: "票", name: "发票说明" },
      { icon: "鉴", name: "商品鉴别" },
      { icon: "合", name: "合作咨询" }
    ]
  },

  onShow() {
    this.setData({ member: memberSummary() });
  },

  goMember() {
    wx.navigateTo({ url: "/pages/member/member" });
  }
});
