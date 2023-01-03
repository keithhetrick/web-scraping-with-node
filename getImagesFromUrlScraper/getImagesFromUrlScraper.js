const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

// url to scrape
const url = "https://www.nasa.gov/multimedia/imagegallery/iotd.html";

async function getImagesFromUrl() {
  const browser = await puppeteer.launch({
    // open chromium browser in headless mode, comment out if not needed
    headless: false,
  });
  const page = await browser.newPage();

  page.on("response", async (response) => {
    const url = response.url();
    const status = response.status();

    // if redirect is to an undefined location, the method will throw an error & continue on to the next response
    if (status >= 300 && status <= 399) {
      console.log(
        "\n",
        "Redirect from",
        response.url(),
        "to",
        response.headers()["location"],
        "\n"
      );
    }
    if (status >= 500 && status <= 599) {
      console.log(
        "\n",
        "Server Error",
        response.url(),
        "with status code",
        response.status(),
        "\n"
      );
    }

    if (response.request().resourceType() === "image") {
      response.buffer().then((file) => {
        // if file name is too long, truncate
        if (url.length > 255) {
          console.log(
            "\n",
            "File name is too long, truncating to 255 characters...",
            "\n"
          );
        }
        // if no image is found, the method will throw an error & continue on to the next response
        if (file.length === 0) {
          console.log("\n", "No image found", "\n");
        }

        const file_Name = url.split("/").pop().split("?")[0];
        const file_Path = path.join(__dirname, `./images_folder/${file_Name}`);
        const writeStream = fs.createWriteStream(file_Path);

        writeStream.write(file);
        writeStream.on("error", (err) => {
          console.log("\n", "Error in writing to file", err, "\n");
        });
        writeStream.on("finish", () => {
          console.log(`Image ${file_Name} has been downloaded!`);
        });
        writeStream.end();
      });
    }
  });
  await page.goto(url);
  await browser.close();
}
getImagesFromUrl();
