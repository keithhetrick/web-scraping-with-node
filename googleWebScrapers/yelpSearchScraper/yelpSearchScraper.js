const unirest = require("unirest");
const cheerio = require("cheerio");
const fs = require("fs");

const getData = async () => {
  let url =
    "https://www.yelp.com/search?find_desc=mexican+food&find_loc=Spring+Hill%2C+TN";

  const selectRandom = () => {
    const userAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64)  AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
    ];
    var randomNumber = Math.floor(Math.random() * userAgents.length);
    return userAgents[randomNumber];
  };
  let user_agent = selectRandom();
  let header = {
    "User-Agent": `${user_agent}`,
  };

  const response = await unirest.get(url).headers(header);

  const $ = cheerio.load(response.body);

  let results = [];
  $(".padding-l3__09f24__IOjKY").each((i, el) => {
    results.push({
      title: $(el).find(".css-1m051bw").text(),
      rating: $(el).find(".css-gutk1c").text(),
      reviews: $(el).find(".margin-t0-5__09f24__gboxT .css-chan6m").text(),
      snippet: $(el).find(".css-16lklrv").text(),
      neighbourhood: $(el).find(".css-dzq7l1 .css-chan6m").text(),
      thumbnail: $(el).find("img").attr("src"),
    });
    if ($(el).find(".mobile-text-medium__09f24__MZ1v6").length) {
      let highlights = [];
      $(el)
        .find(".mobile-text-medium__09f24__MZ1v6")
        .map((i, el) => {
          highlights[i] = $(el).text().replace("");
        });
      results[i].highlights = highlights;
    }
    if (
      $(el).find(".css-1italjr").length &&
      !$(el).find(".content__09f24__vViKh").length
    ) {
      let button = {};
      button = {
        text: $(el).find(".css-1italjr span").text(),
        link: "https://www.yelp.com" + $(el).find("a.css-1italjr").attr("href"),
      };
      results[i].button = button;
    }
    if ($(el).find(".css-11bijt4").length) {
      let categories = [];
      $(el)
        .find("a.css-q7yb35")
        .map((i, el) => {
          categories.push({
            title: $(el).find(".css-11bijt4").text(),
            link: "https://www.yelp.com" + $(el).attr("href"),
          });
        });
      results[i].categories = categories;
    }
    if ($(el).find(".raw__09f24__T4Ezm").length) {
      let service_options = [];
      $(el)
        .find(".raw__09f24__T4Ezm")
        .map((i, el) => {
          service_options[i] = $(el).text();
        });
      results[i].service_options = service_options;
    }
  });

  for (let i = 0; i < results.length; i++) {
    Object.keys(results[i]).forEach((key) =>
      results[i][key] === "" || results[i][key] === undefined
        ? delete results[i][key]
        : {}
    );
  }

  console.log(results);

  // write results to a json file
  fs.writeFile(
    "yelpSearchResults.json",
    JSON.stringify(results, null, 2),
    function (err) {
      if (err) throw err;
      console.log("Saved!");
    }
  );

  // write results to a txt file
  const file_path = "./";
  const file_name = "yelpSearchResults.txt";
  const fullFile_Name = file_path + file_name;

  fs.writeFile(
    fullFile_Name,
    results
      // if any data points are missing, undefined or null they will be replaced with an empty string
      .map((result) => {
        Object.keys(result).forEach((key) =>
          result[key] === "" || result[key] === undefined
            ? (result[key] = "")
            : {}
        );
        return result;
      })
      // map through results data and add a new line after each data point
      .map((result) => {
        return (
          "Title: " +
          result.title +
          "\n" +
          "Rating: " +
          result.rating +
          "\n" +
          "Reviews: " +
          result.reviews +
          "\n" +
          "Snippet: " +
          result.snippet +
          "\n" +
          "Neighborhood: " +
          result.neighbourhood +
          "\n" +
          "Thumbnail: " +
          result.thumbnail +
          "\n" +
          "Highlights: " +
          result.highlights +
          "\n" +
          "Button: " +
          result.button +
          "\n" +
          "Categories: " +
          result.categories +
          "\n" +
          "Service Options: " +
          result.service_options +
          "\n" +
          "------------------------------------------" +
          "\n"
        );
      })
      // join all data points into a single string
      .join(""),
    (err) => {
      if (err) throw err;
      console.log(`File Created at ${fullFile_Name}`);
    }
  );
};
getData();
