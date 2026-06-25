const app = getApp();

function levelInfo() {
  const levels = [...(app.globalData.memberLevels || [])].sort((a, b) => Number(a.threshold) - Number(b.threshold));
  const user = app.globalData.memberUser;
  const current = levels.find((item) => item.id === user.levelId) || levels[0] || {};
  const next = levels.find((item) => Number(item.threshold) > Number(current.threshold || 0));
  const gap = next ? Math.max(Number(next.threshold) - Number(user.growth || 0), 0) : 0;
  const progress = next
    ? Math.min(100, Math.round((Number(user.growth || 0) / Number(next.threshold || 1)) * 100))
    : 100;
  return { levels, user, current, next, gap, progress };
}

Page({
  data: {
    user: {},
    currentLevel: {},
    nextLevel: null,
    gap: 0,
    progress: 0,
    benefits: [],
    memberCoupons: [],
    memberPrices: []
  },

  onShow() {
    app.applyMembershipPrices();
    const info = levelInfo();
    const levelThreshold = Number(info.current.threshold || 0);
    const benefits = (app.globalData.memberBenefits || [])
      .filter((item) => item.status !== "停用")
      .filter((item) => {
        const level = info.levels.find((entry) => entry.id === item.levelId);
        return Number(level?.threshold || 0) <= levelThreshold;
      });
    const memberPrices = (app.globalData.memberPrices || [])
      .filter((item) => item.status !== "停用" && app.canUseMemberPrice(item))
      .map((item) => ({
        ...item,
        product: app.globalData.products.find((product) => product.id === item.productId)
      }))
      .filter((item) => item.product);
    this.setData({
      user: info.user,
      currentLevel: info.current,
      nextLevel: info.next || null,
      gap: info.gap,
      progress: info.progress,
      benefits,
      memberCoupons: (app.globalData.coupons || []).filter((item) => item.forMember && item.status === "启用"),
      memberPrices
    });
  }
});
