export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const addApp = (map, app) => {
  if (!map.has(app.appId)) {
    map.set(app.appId, app);
  }
};
