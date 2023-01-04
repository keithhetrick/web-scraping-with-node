const axios = require("axios");

// set up the request parameters
const params = {
  api_key: "28F47F91EC22466C923F97098911DB61",
  q: "javascript developer jobs",
  location: "Nashville,TN,United States",
  google_domain: "google.com",
  gl: "us",
  hl: "en",
  max_page: "5",
  num: "1",
  output: "json",
};

// make the http GET request to Scale SERP
axios
  .get("https://api.scaleserp.com/search", { params })
  .then((response) => {
    // print the JSON response from Scale SERP
    console.log(JSON.stringify(response.data, 0, 2));
  })
  .catch((error) => {
    // catch and print the error
    console.log(error);
  });
