const ytrend = require("@freetube/yt-trending-scraper");
const express = require("express");
const bodyparser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyparser.urlencoded({ extended: false }));

app.use(bodyparser.json());

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", { data: "" });
});

app.post("/getinfo", (req, res) => {
  // get the country and the category from the form
  const country = req.body.countryCode;
  const category = req.body.category;

  const parameters = {
    geoLocation: country,
    parseCreatorOnRise: false,
    page: category,
  };

  // call youtube trending scraper
  ytrend
    .scrapeTrendingPage(parameters)
    .then((data) => {
      console.log(
        "DATA: ",
        data,
        "\n",
        "========================================================================="
      );
      res.render("index", { data: data });
    })
    .catch((error) => {
      console.error(error);
    });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
