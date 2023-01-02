const cheerio = require("cheerio");

// work-around for "require" syntax from node-fetch";
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function getFormulaOneDrivers() {
  console.log("Getting Formula One Drivers...");

  const response = await fetch("https://www.formula1.com/en/drivers.html");
  const body = await response.text();
  const $ = cheerio.load(body);

  // const wrapper = $(".listing-items--wrapper");
  // console.log("WRAPPER: ", wrapper.length);

  const items = [];

  $(
    ".listing-items--wrapper > .row > .col-12 > .listing-item--link > .listing-item--border > .container > .listing-item--head > .listing-item--name"
  ).map((i, el) => {
    // insert space after first word
    const name = $(el).find(".f1-color--carbonBlack").text();
    console.log("NAME: ", name);
  });

  try {
  } catch (error) {
    console.log("ERROR: ", error);
  }
}
getFormulaOneDrivers();
