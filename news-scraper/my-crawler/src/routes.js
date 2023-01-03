// ======================================================================================================== \\
// ======================================================================================================== \\
// USING CHEERIOCRAWLER TO SCRAPE HACKER NEWS
// ======================================================================================================== //
// ======================================================================================================== //

import { Dataset, createCheerioRouter } from "crawlee";

export const router = createCheerioRouter();

router.addDefaultHandler(async ({ enqueueLinks, log, $ }) => {
  log.info(`enqueueing new URLs`);
  await enqueueLinks({
    globs: ["https://news.ycombinator.com/?p=*"],
  });

  const data = $(".athing")
    .map((i, post) => {
      return {
        postUrL: $(post).find(".title a").attr("href"),
        title: $(post).find(".title a").text(),
        rank: $(post).find(".rank").text(),
      };
    })
    .toArray();

  await Dataset.pushData({
    data,
  });
});

// ======================================================================================================== \\
// ======================================================================================================== \\
// USING PLAYWRIGHTCRAWLER TO SCRAPE MINT MOBILE
// ======================================================================================================== //
// ======================================================================================================== //

import { Dataset, createPlaywrightRouter } from "crawlee";

export const router = createPlaywrightRouter();

router.addDefaultHandler(async ({ log, page }) => {
  log.info("Extracting data");
  const data = await page.$$eval(
    ".m-filterable-products-container__card",
    ($phones) => {
      const scrapedData = [];

      // We're getting the URL, product name, total price and monthly price of each phone on Mint Mobile's first page.
      $phones.forEach(($phone) => {
        scrapedData.push({
          productPageUrl: $phone.querySelector(
            'a[data-elact="Click View Details"]'
          ).href,
          name: $phone.querySelector("h2.subHeader--phoneTitle").innerText,
          totalPrice: $phone
            .querySelector(".m-center__price p")
            .innerText.split(":")
            .pop(),
          monthlyPrice: $phone
            .querySelector(".a-pricing")
            .innerText.replace(/\n/g, "")
            .split("/")
            .shift(),
        });
      });
      return scrapedData;
    }
  );
  log.info("Pushing scraped data to the dataset");
  await Dataset.pushData({
    data,
  });
});
