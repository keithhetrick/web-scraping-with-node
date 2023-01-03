const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

(async () => {
  const browser = await puppeteer.launch({
    // headless: false,
  });
  const page = await browser.newPage();
  page.on("response", async (response) => {
    const url = response.url();

    if (response.request().resourceType() === "image") {
      response.buffer().then((file) => {
        const file_Name = url.split("/").pop();
        const file_Path = path.join(__dirname, `./images_folder/${file_Name}`);
        const writeStream = fs.createWriteStream(file_Path);

        // if Response body is unavailable for redirect responses, the method will throw an error & move on to the next response
        if (response.status() === 301) {
          throw new Error(
            "Response body is unavailable for redirect responses"
          );
        }
        writeStream.write(file);
        writeStream.on("error", (err) => {
          console.log("Error in writing to file", err);
        });
        writeStream.on("finish", () => {
          console.log(`Image ${file_Name} has been downloaded!`);
        });
        writeStream.end();
      });
    }
  });
  await page.goto("https://donarturosspringhill.com/");
  // await page.waitForTimeout(10000);
  await browser.close();
})();
