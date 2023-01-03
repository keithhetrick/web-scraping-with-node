const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const cron = require("node-cron");

const screenSizeDefaultUrl =
  "https://learnwebcode.github.io/practice-requests/";
const entirePageUrl = "https://en.wikipedia.org/wiki/JavaScript";

async function start() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(screenSizeDefaultUrl);
  await page.goto(entirePageUrl);

  const screenSizeDefaultUrl_File_name = "amazing.png";
  const entirePageUrl_File_Name = "javascript.png";

  // add both screenshots to the img folder
  await page.screenshot({
    path: `img/${screenSizeDefaultUrl_File_name}`,
    fullPage: false,
  });
  await page.screenshot({
    path: `img/${entirePageUrl_File_Name}`,
    fullPage: true,
  });

  const names = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".info strong")).map(
      (x) => x.textContent
    );
  });
  await fs.writeFile("names.txt", names.join("\r\n"));

  await page.click("#clickme");
  const clickedData = await page.$eval("#data", (el) => el.textContent);
  console.log(clickedData);

  const photos = await page.$$eval("img", (imgs) => {
    return imgs.map((x) => x.src);
  });

  await page.type("#ourfield", "blue");
  await Promise.all([page.click("#ourform button"), page.waitForNavigation()]);
  const info = await page.$eval("#message", (el) => el.textContent);

  console.log(info);

  for (const photo of photos) {
    const imagePage = await page.goto(photo);
    // save all imgs to the img folder
    await fs.writeFile(
      `img/${photo.split("/").pop()}`,
      await imagePage.buffer()
    );
  }

  await browser.close();
}
start();

// add setInterval to run every 5 seconds
// setInterval(start, 5000);

// add cron job to run every 5 seconds
cron.schedule("*/5 * * * * *", start);
