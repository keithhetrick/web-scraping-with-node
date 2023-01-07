const axios = require("axios");
const fs = require("fs");
const PDFDocument = require("pdfkit");

// set up the request parameters
const params = {
  api_key: "28F47F91EC22466C923F97098911DB61",
  q: "javascript developer jobs",
  location: "Nashville,TN,United States",
  google_domain: "google.com",
  gl: "us",
  hl: "en",
  max_page: "5",
  num: "100",
  output: "json",
};

// make the http GET request to Scale SERP
axios
  .get("https://api.scaleserp.com/search", { params })
  .then((response) => {
    // print the JSON response from Scale SERP
    console.log(JSON.stringify(response.data, 0, 2));
    // save to json file
    fs.writeFile("serpApi.json", JSON.stringify(response.data, 0, 2), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("\nFile has been created!\n");
    });
  })
  .catch((error) => {
    // catch and print the error
    console.log(error);
  });

// create a new PDF document
const doc = new PDFDocument();
