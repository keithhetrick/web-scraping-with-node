const cheerio = require("cheerio");
const unirest = require("unirest");
const fs = require("fs");
const PDFDocument = require("pdfkit");

const getJobsData = async () => {
  try {
    const url =
      "https://www.google.com/search?q=javascript+developer+in+nashville&ibp=htl;jobs&hl=en";

    const response = await unirest.get(url).headers({
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
    });
    let $ = cheerio.load(response.body);

    let jobs_results = [];
    $(".iFjolb").map((i, el) => {
      jobs_results.push({
        title: $(el).find(".PUpOsf").text(),
        company_name: $(el).find(".vNEEBe").text(),
        location: $(el).find(".vNEEBe+ .Qk80Jf").text(),
        via: $(el).find(".Qk80Jf+ .Qk80Jf").text(),
      });
      if ($(el).find(".KKh3md").length) {
        jobs_results[i].extensions = [];
        $(el)
          .find(".KKh3md .LL4CDc")
          .each((j, el) => {
            jobs_results[i].extensions[j] = $(el).text();
          });
      }
    });
    console.log("JOB RESULTS: ", jobs_results);

    // create .txt file
    jobs_results.forEach((job) => {
      fs.appendFile(
        "googleJobsResults.txt",
        `\n Title: ${job.title}
        Company Name: ${job.company_name}
        Location: ${job.location}
        Via: ${job.via}
        Extensions: ${job.extensions}
        `,
        (err) => {
          if (err) throw err;
          console.log("Saved!");
        }
      );
    });

    // create PDF file
    const doc = new PDFDocument();

    const pdfName = "googleJobsResults.pdf";
    doc.pipe(fs.createWriteStream(pdfName));
    doc.fontSize(20).text("Google Jobs Results", {
      align: "center",
    });

    jobs_results.forEach((job) => {
      doc.fontSize(18).text(`\n Title: ${job.title}`, {
        align: "left",
        width: 500,
      });
      doc.fontSize(15).text(`Company Name: ${job.company_name}`, {
        align: "left",
        width: 500,
      });
      doc.fontSize(15).text(`Location: ${job.location}`, {
        align: "left",
        width: 500,
      });
      doc.fontSize(15).text(`Via: ${job.via}`, {
        align: "left",
        width: 500,
      });
      doc.fontSize(15).text(`Extensions: ${job.extensions}`, {
        align: "left",
        width: 500,
      });
      doc
        .fontSize(12)
        .text(`----------------------------------------------------`, {
          align: "left",
          width: 500,
        });
    });

    doc.end();
  } catch (e) {
    console.log("ERROR:", e);
  }
};
getJobsData();
