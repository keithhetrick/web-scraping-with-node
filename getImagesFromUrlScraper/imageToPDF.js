// ============================================================================================================== \\
// ============================================================================================================== \\
// THIS FILE IS NOT BEING USED IN THE PROJECT ---- FOR REFERENCE ONLY
// ============================================================================================================== //
// ============================================================================================================== //

const PDFDocument = require("pdfkit");

module.exports = (pages, size) => {
  const doc = new PDFDocument({ margin: 0, size });

  for (let index = 0; index < pages.length; index++) {
    doc.image(pages[index], 0, 0, {
      fit: size,
      align: "center",
      valign: "center",
    });

    if (pages.length != index + 1) doc.addPage();
  }

  doc.end();

  return doc;
};

module.exports.sizes = require("./sizes.json");

// create PDF file using image-to-pdf, PDFDocument, fs, and loop through all usable images in the images folder & add them to the PDF
const images = fs.readdirSync("./images").map((file) => `./images/${file}`);
imgToPDF(images, "all-together.pdf", function (err, pdf) {
  if (err) throw err;
  console.log("Image to PDF conversion complete!");
});

const doc = new PDFDocument({ margin: 0, size: [500, 500] });
doc.pipe(fs.createWriteStream("all-together.pdf"));

for (let i = 0; i < images.length; i++) {
  doc.image(images[i], 0, 0, {
    fit: [500, 500],
    align: "center",
    valign: "center",
  });

  if (images.length != i + 1) doc.addPage();
}
doc.end();

// const images = fs
//   .readdirSync("./images")
//   .map((file) => `./images/${file}`);
// imgToPDF(images, "all-together.pdf", function (err, pdf) {
//   if (err) throw err;
//   console.log("Image to PDF conversion complete!");
// });

// const doc = new PDFDocument();
// doc.pipe(fs.createWriteStream("all-together.pdf"));

// for (let i = 0; i < images.length; i++) {
//   doc.image(images[i], 0, 0, { width: 500 });
//   doc.addPage();
// }
// doc.end();

// const pdf_File_Path = "./";
// const pdf_File_Name = "images.pdf";
// const pdf_FullFile_Name = pdf_File_Path + pdf_File_Name;

// for (let index = 0; index < pages.length; index++) {
//   doc.image(pages[index], 0, 0, {
//     fit: size,
//     align: "center",
//     valign: "center",
//   });

//   if (pages.length != index + 1) doc.addPage();
// }

// doc.end();

// return doc;

// // create PDF file & add all images to it
// const doc = new PDFDocument();

// const pdf_File_Path = "./";
// const pdf_File_Name = "images.pdf";
// const pdf_FullFile_Name = pdf_File_Path + pdf_File_Name;

// doc.pipe(fs.createWriteStream(pdf_FullFile_Name));
// doc.fontSize(20).text("URL Images", {
//   align: "center",
// });

// doc
//   .fontSize(12)
//   .text(
//     `---------------------------------------------------------------------------------------------------------------------------`,
//     {
//       align: "left",
//       width: 500,
//     }
//   );
// doc.fontSize(12).text(`Url: ${url}`, {
//   align: "left",
//   width: 500,
// });
// doc.end();
