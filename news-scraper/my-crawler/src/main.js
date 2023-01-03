// ================================================================================== \\
// ================================================================================== \\
// USING CHEERIOCRAWLER TO SCRAPE HACKER NEWS
// ================================================================================== //
// ================================================================================== //

import { CheerioCrawler } from "crawlee";
import { router } from "./routes.js";

const startUrls = ["https://news.ycombinator.com/"];

const crawler = new CheerioCrawler({
  requestHandler: router,
});

await crawler.run(startUrls);

// ================================================================================== \\
// ================================================================================== \\
// USING PLAYWRIGHTCRAWLER TO SCRAPE MINT MOBILE
// ================================================================================== //
// ================================================================================== //

import { PlaywrightCrawler } from "crawlee";
import { router } from "./routes.js";

const startUrls = ["https://www.mintmobile.com/deals/"];

const crawler = new PlaywrightCrawler({
  requestHandler: router,
});

await crawler.run(startUrls);
