import gplay from 'google-play-scraper';
import { config } from '../config.js';
import { sleep } from '../utils/helpers.js';
import { log } from '../utils/logger.js';

export const fetchApp = async (appId) => {
  try {
    const app = await gplay.app({ appId });
    await sleep(config.DELAY_MS);
    return app;
  } catch (error) {
    log(`[ERROR] fetching ${appId}: ${error.message}`);
    return null;
  }
};

export const searchSimilarNames = async (title) => {
  try {
    const apps = await gplay.search({
      term: title,
      throttle: config.SEARCH_THROTTLE,
      num: config.SEARCH_RESULTS_LIMIT,
    });
    await sleep(config.DELAY_MS);
    return apps;
  } catch (error) {
    log(`[ERROR] searching for "${title}": ${error.message}`);
    return [];
  }
};

export const fetchSimilarApps = async (appId) => {
  try {
    const apps = await gplay.similar({
      appId: appId
    });
    await sleep(config.DELAY_MS);
    return apps;
  } catch (error) {
    log(`[ERROR] fetching similar apps for ${appId}: ${error.message}`);
    return [];
  }
};
