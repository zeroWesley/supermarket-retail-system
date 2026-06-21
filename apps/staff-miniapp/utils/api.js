const API_BASE = "http://127.0.0.1:8787";

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE}${path}`,
      method: options.method || "GET",
      data: options.data || {},
      header: { "content-type": "application/json" },
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve(res.data);
        else reject(new Error(`API ${res.statusCode}`));
      },
      fail: reject
    });
  });
}

module.exports = {
  API_BASE,
  request
};
