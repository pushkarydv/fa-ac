import { config } from './config.js';
import { log, logStyled } from './utils/logger.js';
import { addApp } from './utils/helpers.js';
import {
  fetchApp,
  searchSimilarNames,
  fetchSimilarApps,
} from './services/appService.js';

export const scrapeApps = async () => {
  const mainApps = new Map();
  const similarApps = new Map();

  try {
    logStyled('[INFO] Fetching app IDs...');
    const response = await fetch(config.API_ENDPOINT);
    const { apps } = await response.json();

    logStyled(`[INFO] will now fetch main apps`);
    for (const appId of apps) {
      const app = await fetchApp(appId);
      if (app) {
        addApp(mainApps, app);
        log(`[INFO] Fetched ${appId}`);
      }
    }

    logStyled(`[INFO] main apps to fecthed : ${mainApps.size}`);

    logStyled(`[INFO] Searching for apps with similar names...`);
    // Create a copy of mainApps to avoid modifying the original map
    let mainAppCopy = new Map(mainApps);
    logStyled(`mainAppCopy size: ${mainAppCopy.size}`);
    for (const [appId, appObject] of mainAppCopy) {
      const similarNameApps = await searchSimilarNames(appObject.title);
      log(
        `Found ${similarNameApps.length} apps with similar name to ${appObject.title}`
      );

      for (const app of similarNameApps) {
        app.gotFrom = appId;
        addApp(mainApps, app);
      }
    }
    logStyled(`mainApps size: ${mainApps.size}`);

    logStyled(`[INFO] Searching similar apps...`);
    for (const  [appId, appObject] of mainApps) {
      const relatedApps = await fetchSimilarApps(appId);
      log(`Found ${relatedApps.length} similar apps for ${appId}`);

      for (const app of relatedApps) {
        app.gotFrom = appId;
        addApp(similarApps, app);
      }
    }
    
    logStyled(`[INFO] mainApps size: ${mainApps.size}`);
    logStyled(`[INFO] similarApps size: ${similarApps.size}`);

    return {
      mainAppsCount: mainApps.size,
      similarAppsCount: similarApps.size,
      mainApps: Array.from(mainApps.values()),
      similarApps: Array.from(similarApps.values()),
    };
  } catch (error) {
    log(`Fatal error: ${error.message}`);
    throw error;
  }
};
