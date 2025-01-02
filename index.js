import { greet, log, logStyled } from './utils/logger.js';
import { scrapeApps } from './scraper.js';

const main = async () => {
  try {
    greet();
    const results = await scrapeApps();

    // Log final results
    logStyled('Scripting completed. Writing results to file...');

    fs.writeFileSync(
      `./lists/${new Date()
        .toLocaleDateString()
        .replace(/\//g, '-')}-apps.json`,
      JSON.stringify(results, null, 2)
    );

    logStyled('Done!');
  } catch (error) {
    log(`Script failed: ${error.message}`);
    process.exit(1);
  }
};

main();
