const API_BASE = "http://127.0.0.1:8787";

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE}${path}`,
      method: options.method || "GET",
      data: options.data || {},
      header: { "content-type": "application/json" },
      timeout: options.timeout || 15000,
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve(res.data);
        else reject(new Error(`API ${res.statusCode}`));
      },
      fail(error) {
        reject(new Error(`API 请求失败：${error.errMsg || "unknown"}`));
      }
    });
  });
}

module.exports = {
  API_BASE,
  request
};
