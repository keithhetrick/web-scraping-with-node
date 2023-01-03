// Description: This file contains multiple examples of web scraping using the following libraries:
// - Got-Scraping
// - Puppeteer
// - Cheerio
// - Playwright

const { gotScraping } = require("got-scraping");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const playwright = require("playwright");

// ================================================================================== \\
// ================================================================================== \\
// HACKER NEWS SCRAPING WITH GOT-SCRAPING & CHEERIO
// ================================================================================== //
// ================================================================================== //

const newsUrl = "https://news.ycombinator.com/";

async function getHackerNews() {
  const response = await gotScraping(newsUrl);
  const html = response.body;

  // Use Cheerio to parse the HTML
  const $ = cheerio.load(html);

  // Select all the elements with the class name "athing"
  const articles = $(".athing");

  // Loop through the selected elements
  for (const article of articles) {
    const articleTitleText = $(article).text();

    // Log each element's text to the terminal
    console.log("HACKER NEWS: ", articleTitleText);
  }
}
getHackerNews();

const amazonUrl =
  "https://www.amazon.com/Hitchhikers-Guide-Galaxy-Douglas-Adams-ebook/dp/B000XUBC2C/ref=tmm_kin_swatch_0?_encoding=UTF8&qid=1642536225&sr=8-1";

// ================================================================================== \\
// ================================================================================== \\
// AMAZON SCRAPING WITH PUPPETEER, CHEERIO & PLAYWRIGHT
// ================================================================================== //
// ================================================================================== //

// ================================================================================== \\
// USING PUPPETEER & CHEERIO TO SCRAPE AMAZON
// ================================================================================== //

async function amazonPuppeteerScraper() {
  const browser = await puppeteer.launch({
    headless: true, // Set headless to false to see the browser working
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 }); // Maximize the screensize
  await page.goto(amazonUrl);

  const book = await page.evaluate(() => {
    return {
      title: document.querySelector("#productTitle").innerText,
      author: document.querySelector(".a-link-normal.contributorNameID")
        .innerText,
      edition: document.querySelector("#productSubtitle").innerText,
      kindlePrice: document.querySelector("#kindle-price").innerText,
    };
  });

  // Save the screenshot to a file
  const file_name = "book.png";
  const file_path = "./screenshots";
  const full_File_Path = `${file_path}/${file_name}`;

  await page.screenshot({ path: full_File_Path }); // Take a screenshot of the page

  console.log("BOOK: ", book, "\n");
  await browser.close();
}
amazonPuppeteerScraper();

// ================================================================================== \\
// USING PLAYWRIGHT & CHEERIO TO SCRAPE AMAZON
// ================================================================================== //

async function amazonPlaywrightScraper() {
  const browser = await playwright.firefox.launch({
    headless: false, // Set headless to false, so we can see the browser working
  });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1366, height: 768 }); // Maximize the screensize
  await page.goto(amazonUrl);

  const book = {
    bookTitle: await page.locator("#productTitle").innerText(),
    author: await page.locator(".a-link-normal.contributorNameID").innerText(),
    edition: await page.locator("#productSubtitle").innerText(),
    kindlePrice: await page.locator("#kindle-price").innerText(),
  };

  // Save the screenshot to a file
  const file_name = "book.png";
  const file_path = "./screenshots";
  const full_File_Path = `${file_path}/${file_name}`;

  await page.screenshot({ path: full_File_Path }); // Take a screenshot of the page

  console.log("BOOK: ", book, "\n");
  await browser.close();
}
amazonPlaywrightScraper();

// ================================================================================== \\
// ================================================================================== \\
// MINT MOBILE SCRAPING WITH PLAYWRIGHT & CHEERIO
// ================================================================================== //
// ================================================================================== //

const mintMobileUrl =
  "https://www.mintmobile.com/product/google-pixel-7-pro-bundle/";

async function mintMobileScraper() {
  const browser = await playwright.chromium.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto(mintMobileUrl);
  const html = await page.evaluate(() => document.body.innerHTML); // Save the page's HTML to a variable

  const $ = cheerio.load(html); // Use Cheerio to load the page's HTML code

  // Continue writing your scraper using Cheerio's jQuery syntax
  const phone = {
    name: $("div.m-productCard__heading h1").text().trim(),
    memory: $(
      "div.composited_product_details_wrapper > div > div > div:nth-child(2) > div.label > span"
    )
      .text()
      .split(" ")
      .pop(),
    payMonthlyPrice: $("div.composite_price_monthly span").text().trim(),
    payTodayPrice: $("div.composite_price > p > ins > span").text().trim(),
  };

  console.log("PHONE: ", phone, "\n");
  await browser.close();
}
mintMobileScraper();
