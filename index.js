import gplay from 'google-play-scraper';
import { styledLogger } from './utils/functions.js';
import fs from 'fs';

const apps = new Map();
const addApp = (app) => {
  if (!apps.has(app.appId)) {
    apps.set(app.appId, app);
  }
};

(async () => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) {
    styledLogger('Good Morning!');
  } else if (currentHour < 18) {
    styledLogger('Good Afternoon!');
  } else {
    styledLogger('Good Evening!');
  }

  // TARGET FINANCE CATEGORY, TOP FREE
  const listApps = await gplay.list({
    category: gplay.category.FINANCE,
    collection: gplay.collection.TOP_FREE,
    num: 100,
  });
  styledLogger(`Init w/ ${listApps.length} apps`);

  // LOOP OVER CATEGORY STARTS

  for (const app of listApps) {
    let selectedApp = app;

    let apps_w_sama_naming = await gplay.search({
      term: selectedApp.title,
      throttle: 10,
      num: 20,
      price: 'free',
    });

    console.log(
      `Found ${apps_w_sama_naming.length} apps with same naming as ${selectedApp.appId} : ${selectedApp.title}`
    );

    // APPS WITH SAME NAMING STARTS
    for (const _app of apps_w_sama_naming) {
      // track which app led to this app
      _app.gotFrom = selectedApp.appId;
      addApp(_app);

      // SIMILAR APPS SEARCH START
      try{
        // to handle cluster error file:///google-play-scraper/lib/similar.js:72
        let similar_apps = await gplay.similar({
          appId: _app.appId,
          num: 5,
        });
  
        for (const similar_app of similar_apps) {
          similar_app.gotFrom = _app.appId;
          addApp(similar_app);
        }
  
        console.log(
          `Found ${similar_apps.length} similar apps for ${_app.appId}`
        );
      }catch(e){
        console.log(`Error: ${e.message}`);
      }
      // SIMILAR APPS SEARCH END
    }
    // APPS WITH SAME NAMING ENDS
  }
  // LOOP OVER CATEGORY ENDS

  fs.writeFileSync(
    `./lists/${new Date().toLocaleDateString().replace(/\//g, '-')}-apps.json`,
    JSON.stringify(Object.fromEntries(apps), null, 2)
  );

  styledLogger(`Found ${apps.size} apps in total`);

  styledLogger('Done!');
})();
