const cheerio = require("cheerio");
const axios = require("axios");
const j2cp = require("json2csv").Parser;
const fs = require("fs");

// base url for pagination
const baseUrl =
  "https://books.toscrape.com/catalogue/category/books/mystery_3/";

// url for mystery genre
const mystery =
  "https://books.toscrape.com/catalogue/category/books/mystery_3/index.html";

const book_data = [];

// pass url to getBooks function for pagination
async function getBooks(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const genre = $("h1").text();
    console.log("GENRE: ", genre, "\n");

    const books = $("article");
    books.map((i, book) => {
      const title = $(book).find("h3 a").attr("title");
      const price = $(book).find(".price_color").text();
      const stock = $(book).find(".availability").text().trim();

      book_data.push({ title, price, stock });
    });

    // this is where the next page url comes in to effect
    if ($(".next a").length > 0) {
      next_page = baseUrl + $(".next a").attr("href");

      getBooks(next_page);
    } else {
      // create csv file
      const csv_File_Path = "./";
      const csv_File_Name = "books.csv";
      const csv_FullFile_Name = csv_File_Path + csv_File_Name;

      const parser = new j2cp();
      const csv = parser.parse(book_data);
      fs.writeFileSync(csv_FullFile_Name, csv, "utf-8");
    }

    console.log("BOOKS: ", book_data, "\n");
  } catch (err) {
    console.log("ERROR: ", err);
  }
}
getBooks(mystery);
