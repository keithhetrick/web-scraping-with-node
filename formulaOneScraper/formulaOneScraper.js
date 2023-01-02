const cheerio = require("cheerio");
const fs = require("fs");
const PDFDocument = require("pdfkit");

// work-around for "require" syntax from node-fetch";
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function getFormulaOneDrivers() {
  console.log("Getting Formula One data...");

  // ============================================================================= \\
  // ============================================================================= \\
  // - - - - - - - - - - - C O R E    L O G I C    S T A R T - - - - - - - - - - - ||
  // ============================================================================= //
  // ============================================================================= //

  // GET using multiple URLs
  const urls = [
    "https://www.formula1.com/en/latest.html",
    "https://www.formula1.com/en/results.html/2022/drivers.html",
    "https://www.formula1.com/en/results.html/2022/team.html",
  ];

  // go through each url and get the body of the page
  const items = [];
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const response = await fetch(url);
    const body = await response.text();

    // console.log("BODY: ", body);

    // load the body into cheerio
    const $ = cheerio.load(body);

    // get the title
    const title = $("title").text();

    // get the h1
    const h1 = $("h1").text();

    // get the latest news
    const latestNews = $(".f1-race-hub--latest").text();

    // get the latest videos
    const latestVideos = $(".f1-race-hub--latest-videos").text();

    // get the latest driver updates
    const latestDriverMarket = $(
      ".f1-race-hub--latest-interviews-features"
    ).text();
    // console.log("DIV: ", div, "\n", "====================================");

    // cleans up & removes extra lines and spaces
    const regex = /(\r\n|\n|\r)/gm;
    const cleanLatestNews = latestNews.replace(regex, "");
    const cleanLatestVideos = latestVideos.replace(regex, "");
    const cleanLatestDriverMarket = latestDriverMarket.replace(regex, "");

    items.push({
      url,
      title,
      h1,
      cleanLatestNews,
      cleanLatestVideos,
      cleanLatestDriverMarket,
    });
  }

  // console.log("ITEMS: ", items, "\n", "====================================");

  // saves as new json file
  const multi_Page_JSON_file_path = "./";
  const multi_Page_JSON_file_name = "formulaOneData.json";
  const multi_Page_JSON_fullFile_Name =
    multi_Page_JSON_file_path + multi_Page_JSON_file_name;

  fs.writeFile(
    multi_Page_JSON_fullFile_Name,
    JSON.stringify(items),
    function (err) {
      if (err) throw err;
      console.log(
        `Formula One data saved to "${multi_Page_JSON_fullFile_Name}"!`
      );
    }
  );

  // create PDF file
  const doc = new PDFDocument();

  const multi_Page_PDF_File_path = "./";
  const multi_Page_PDF_File_name = "formulaOneData.pdf";
  const multi_Page_PDF_FullFile_Name =
    multi_Page_PDF_File_path + multi_Page_PDF_File_name;

  doc.pipe(fs.createWriteStream(multi_Page_PDF_FullFile_Name));
  doc.fontSize(20).text("Formula One Data", {
    align: "center",
  });

  items.forEach((item) => {
    doc
      .fontSize(12)
      .text(
        `---------------------------------------------------------------------------------------------------------------------------`,
        {
          align: "left",
          width: 500,
        }
      );
    doc.fontSize(12).text(`Url: ${item.url}`, {
      align: "left",
      width: 500,
    });
    doc.fontSize(12).text(`Title: ${item.title}`, {
      align: "left",
      width: 500,
    });
    doc.fontSize(12).text(`H1: ${item.h1}`, {
      align: "left",
      width: 500,
    });
    doc
      .fontSize(12)
      .text(`Latest News (from "${item.url}"): ${item.cleanLatestNews}`, {
        align: "left",
        width: 500,
      });
    doc
      .fontSize(12)
      .text(`Latest Videos (from "${item.url}"): ${item.cleanLatestVideos}`, {
        align: "left",
        width: 500,
      });
    doc
      .fontSize(12)
      .text(
        `Latest Driver Market (from "${item.url}"): ${item.cleanLatestDriverMarket}`,
        {
          align: "left",
          width: 500,
        }
      );
    doc
      .fontSize(12)
      .text(
        `---------------------------------------------------------------------------------------------------------------------------`,
        {
          align: "left",
          width: 500,
        }
      );
  });

  doc.end();
  console.log(`Formula One data saved to "${multi_Page_PDF_FullFile_Name}"!`);

  // ============================================================================= //
  // ============================================================================= //

  // GET using single URL

  const url = "https://www.formula1.com/en/drivers.html";

  const response = await fetch(url);
  const body = await response.text();
  const $ = cheerio.load(body);

  // check size of class count
  const wrapper = $(".listing-items--wrapper");
  console.log("WRAPPER COUNT: ", wrapper.length);

  const driverData = [];

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

    driverData.push({
      // rank,
      // points,
      fullDriverName,
      team,
      photo,
    });
  });

  console.log("DRIVER DATA: ", driverData);

  // saves as new json file
  const single_Page_JSON_File_path = "./";
  const single_Page_JSON_File_name = "formulaOneDriverData.json";
  const single_Page_JSON_FullFile_Name =
    single_Page_JSON_File_path + single_Page_JSON_File_name;

  fs.writeFile(
    single_Page_JSON_FullFile_Name,
    JSON.stringify(driverData),
    function (err) {
      if (err) throw err;
      console.log(
        `Formula One Driver data saved to "${single_Page_JSON_FullFile_Name}"!`
      );
    }
  );

  // create PDF file
  const single_Page_PDF_File_path = "./";
  const single_Page_PDF_File_name = "formulaOneDriverData.pdf";
  const single_Page_PDF_FullFile_Name =
    single_Page_PDF_File_path + single_Page_PDF_File_name;

  doc.pipe(fs.createWriteStream(single_Page_PDF_FullFile_Name));
  doc.fontSize(20).text("Formula One Driver Data", {
    align: "center",
  });

  driverData.forEach((driver) => {
    doc
      .fontSize(12)
      .text(
        `---------------------------------------------------------------------------------------------------------------------------`,
        {
          align: "left",
          width: 500,
        }
      );
    // doc.fontSize(12).text(`Rank: ${driver.rank}`, {
    //   align: "left",
    //   width: 500,
    // });
    // doc.fontSize(12).text(`Points: ${driver.points}`, {
    //   align: "left",
    //   width: 500,
    // });
    doc.fontSize(12).text(`Full Driver Name: ${driver.fullDriverName}`, {
      align: "left",
      width: 500,
    });
    doc.fontSize(12).text(`Team: ${driver.team}`, {
      align: "left",
      width: 500,
    });
    doc.fontSize(12).text(`Photo: ${driver.photo}`, {
      align: "left",
      width: 500,
    });
    doc
      .fontSize(12)
      .text(
        `---------------------------------------------------------------------------------------------------------------------------`,
        {
          align: "left",
          width: 500,
        }
      );
  });

  doc.end();
  console.log(
    `Formula One Driver data saved to "${single_Page_PDF_FullFile_Name}"!`
  );

  try {
  } catch (error) {
    console.log("ERROR: ", error);
  }
}
getFormulaOneDrivers();
