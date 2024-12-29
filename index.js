import gplay from 'google-play-scraper';
import { styledLogger } from './utils/functions.js';

(async () => {
  styledLogger('Hello, World!');
  const listApps = await gplay.list({
    category: gplay.category.FINANCE,
    collection: gplay.collection.TOP_FREE,
    num: 100,
  });
  console.log(listApps);
  styledLogger(`Listed ${listApps.length} apps`);

  //   gplay.search({ term: 'panda', throttle: 10, num: 20, price: 'free' }).then(console.log);
})();
