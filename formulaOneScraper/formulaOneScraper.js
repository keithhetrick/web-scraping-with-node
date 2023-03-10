const cheerio = require("cheerio");
const fs = require("fs");
const PDFDocument = require("pdfkit");

// work-around for "require" syntax from node-fetch";
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function getFormulaOneDrivers() {
  console.log("Getting Formula One data... \n");

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
  const formula_One_Multi_Page_Data = [];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const response = await fetch(url);
    const body = await response.text();
    console.log(
      "BODY: ",
      body,
      "\n",
      "===============================================================================================================================",
      "\n"
    );

    // load body into cheerio
    const $ = cheerio.load(body);

    // get title
    const title = $("title").text();

    // get h1
    const h1 = $("h1").text();

    // get latest news
    const latestNews = $(".f1-race-hub--latest").text();

    // get latest videos
    const latestVideos = $(".f1-race-hub--latest-videos").text();

    // get latest driver updates
    const latestDriverMarket = $(
      ".f1-race-hub--latest-interviews-features"
    ).text();

    // clean up & remove extra lines and spaces
    const regex = /(\r\n|\n|\r)/gm;
    const cleanLatestNews = latestNews.replace(regex, "");
    const cleanLatestVideos = latestVideos.replace(regex, "");
    const cleanLatestDriverMarket = latestDriverMarket.replace(regex, "");

    formula_One_Multi_Page_Data.push({
      url,
      title,
      h1,
      cleanLatestNews,
      cleanLatestVideos,
      cleanLatestDriverMarket,
    });
  }

  console.log(
    "MULTI PAGE DATA: ",
    formula_One_Multi_Page_Data,
    "\n",
    "\n",
    "===============================================================================================================================",
    "\n"
  );

  // create json file
  const multi_Page_JSON_file_Path = "./";
  const multi_Page_JSON_file_Name = "formulaOneData.json";
  const multi_Page_JSON_fullFile_Name =
    multi_Page_JSON_file_Path + multi_Page_JSON_file_Name;

  fs.writeFile(
    multi_Page_JSON_fullFile_Name,
    JSON.stringify(formula_One_Multi_Page_Data),
    function (err) {
      if (err) throw err;
      console.log(
        `Formula One data saved to "${multi_Page_JSON_fullFile_Name}"!`,
        "\n",
        "\n",
        "==============================================================================================================================="
      );
    }
  );

  // create PDF file
  const doc = new PDFDocument();

  const multi_Page_PDF_File_Path = "./";
  const multi_Page_PDF_File_Name = "formulaOneData.pdf";
  const multi_Page_PDF_FullFile_Name =
    multi_Page_PDF_File_Path + multi_Page_PDF_File_Name;

  doc.pipe(fs.createWriteStream(multi_Page_PDF_FullFile_Name));
  doc.fontSize(20).text("Formula One Data", {
    align: "center",
  });

  formula_One_Multi_Page_Data.forEach((page) => {
    doc
      .fontSize(12)
      .text(
        `---------------------------------------------------------------------------------------------------------------------------`,
        {
          align: "left",
          width: 500,
        }
      );
    doc.fontSize(12).text(`Url: ${page.url}`, {
      align: "left",
      width: 500,
    });
    doc.fontSize(12).text(`Title: ${page.title}`, {
      align: "left",
      width: 500,
    });
    doc.fontSize(12).text(`H1: ${page.h1}`, {
      align: "left",
      width: 500,
    });
    doc
      .fontSize(12)
      .text(`Latest News (from "${page.url}"): ${page.cleanLatestNews}`, {
        align: "left",
        width: 500,
      });
    doc
      .fontSize(12)
      .text(`Latest Videos (from "${page.url}"): ${page.cleanLatestVideos}`, {
        align: "left",
        width: 500,
      });
    doc
      .fontSize(12)
      .text(
        `Latest Driver Market (from "${page.url}"): ${page.cleanLatestDriverMarket}`,
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
  console.log(
    `Formula One data saved to "${multi_Page_PDF_FullFile_Name}"!`,
    "\n"
  );

  // ============================================================================= //
  // ============================================================================= //

  // GET using single URL

  const url = "https://www.formula1.com/en/drivers.html";

  const response = await fetch(url);
  const body = await response.text();
  const $ = cheerio.load(body);

  // check size of class count
  const wrapper = $(".listing-items--wrapper");
  console.log(
    "\n",
    "WRAPPER COUNT: ",
    wrapper.length,
    "\n",
    "\n",
    "===============================================================================================================================",
    "\n"
  );

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
    console.log("FULL NAME: ", fullDriverName, "\n");

    const team = $(el).find(".listing-item--team").text();
    console.log("TEAM: ", team, "\n");

    const photo = $(el).find(".listing-item--photo img").attr("data-src");
    console.log("PHOTO: ", photo, "\n");

    driverData.push({
      // rank,
      // points,
      fullDriverName,
      team,
      photo,
    });
  });

  console.log(
    "===============================================================================================================================",
    "\n",
    "\n",
    "DRIVER DATA: ",
    driverData,
    "\n",
    "\n",
    "===============================================================================================================================",
    "\n"
  );

  // create json file
  const single_Page_JSON_File_Path = "./";
  const single_Page_JSON_File_Name = "formulaOneDriverData.json";
  const single_Page_JSON_FullFile_Name =
    single_Page_JSON_File_Path + single_Page_JSON_File_Name;

  fs.writeFile(
    single_Page_JSON_FullFile_Name,
    JSON.stringify(driverData),
    function (err) {
      if (err) throw err;
      console.log(
        `Formula One Driver data saved to "${single_Page_JSON_FullFile_Name}"!`,
        "\n",
        "\n",
        "==============================================================================================================================="
      );
    }
  );

  // create PDF file
  const single_Page_PDF_File_Path = "./";
  const single_Page_PDF_File_Name = "formulaOneDriverData.pdf";
  const single_Page_PDF_FullFile_Name =
    single_Page_PDF_File_Path + single_Page_PDF_File_Name;

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
    `Formula One Driver data saved to "${single_Page_PDF_FullFile_Name}"!`,
    "\n"
  );

  try {
  } catch (error) {
    console.log("ERROR: ", error);
  }
}
getFormulaOneDrivers();
