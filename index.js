import gplay from 'google-play-scraper';
import { styledLogger } from './utils/functions.js';
import fs from 'fs';

(async () => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) {
    styledLogger('Good Morning!');
  } else if (currentHour < 18) {
    styledLogger('Good Afternoon!');
  } else {
    styledLogger('Good Evening!');
  }

  const listApps = await gplay.list({
    category: gplay.category.FINANCE,
    collection: gplay.collection.TOP_FREE,
    num: 100,
  });
  styledLogger(`Init w/ ${listApps.length} apps`);

  const sameConventionApps = [];

  for (const app of listApps) {
    let selectedApp = app;

    let apps_w_sama_naming = await gplay.search({
      term: selectedApp.title,
      throttle: 10,
      num: 20,
      price: 'free',
    });

    if (apps_w_sama_naming.length > 0) {
      sameConventionApps.push({
        appId: selectedApp.appId,
        appName: selectedApp.title,
        sameConventionApps: apps_w_sama_naming,
      });

      console.log(
        `Found ${apps_w_sama_naming.length} apps w/ ${selectedApp.title} inside name`
      );
    }
  }

  console.log(sameConventionApps);

  // Save sameConventionApps to a JSON file
  fs.writeFileSync(
    `./lists/${new Date()
      .toLocaleDateString()
      .replace(/\//g, '-')}-sameConventionApps.json`,
    JSON.stringify(sameConventionApps, null, 2)
  );

  styledLogger('Done!');
})();
