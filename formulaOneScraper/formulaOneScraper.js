const cheerio = require("cheerio");
const fs = require("fs");

// work-around for "require" syntax from node-fetch";
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function getFormulaOneDrivers() {
  console.log("Getting Formula One Drivers...");

  const response = await fetch("https://www.formula1.com/en/drivers.html");
  const body = await response.text();
  const $ = cheerio.load(body);

  // ============================================================================= \\
  // ============================================================================= \\
  // - - - - - - - - - - - C O R E    L O G I C    S T A R T - - - - - - - - - - - ||
  // ============================================================================= //
  // ============================================================================= //

  // check size of class count
  const wrapper = $(".listing-items--wrapper");
  console.log("WRAPPER COUNT: ", wrapper.length);

  const items = [];

  $(".listing-items--wrapper > .row > .col-12").map((i, el) => {
    // ================================================================ \\
    // ---- DATA ISN'T AVAILABLE OFF SEASON, SO IT'S COMMENTED OUT ---- \\

    // const rank = $(el).find(".rank").text();
    // console.log("RANK: ", rank);

    // const points = $(el).find(".points > .f1-wide--s").text();
    // console.log("POINTS: ", points);
    // ================================================================ //

    const firstName = $(el).find(".listing-item--name span:first").text();
    const lastName = $(el).find(".listing-item--name span:last").text();
    const fullDriverName = firstName + " " + lastName;
    console.log("FULL NAME: ", fullDriverName);

    const team = $(el).find(".listing-item--team").text();
    console.log("TEAM: ", team);

    const photo = $(el).find(".listing-item--photo img").attr("data-src");
    console.log("PHOTO: ", photo);

    items.push({
      // rank,
      // points,
      fullDriverName,
      team,
      photo,
    });
  });

  console.log("ITEMS: ", items);

  // saves as new json file in the same directory
  const file_path = "./";
  const file_name = "formulaOne.json";
  const fullFile_Name = file_path + file_name;

  fs.writeFile(fullFile_Name, JSON.stringify(items), function (err) {
    if (err) throw err;
    console.log(`Formula One data saved to "${fullFile_Name}"!`);
  });

  try {
  } catch (error) {
    console.log("ERROR: ", error);
  }
}
getFormulaOneDrivers();
