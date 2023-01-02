const csvToJson = require("csvtojson");
const fs = require("fs");

// export function to use in bookScraper.js
module.exports = function () {
  const csv_File_Path = "./";
  const csv_File_Name = "books.csv";
  const csv_FullFile_Name = csv_File_Path + csv_File_Name;

  fs.readFile(csv_FullFile_Name, "utf-8", (err) => {
    if (err) throw err;

    // convert the csv to json
    csvToJson()
      .fromFile(csv_FullFile_Name)
      .then((jsonObj) => {
        // Print the JSON object to the console
        console.log(
          "JSON OBJECT: ",
          jsonObj,
          "\n",
          "=====================================================================================",
          "\n"
        );

        const json_File_Path = "./";
        const json_File_Name = "books.json";
        const json_FullFile_Name = json_File_Path + json_File_Name;

        fs.writeFileSync(json_FullFile_Name, JSON.stringify(jsonObj));
        console.log(`JSON file created successfully at ${json_FullFile_Name}`);
      });
  });
};

// returns "hi" when 'node -e 'require("./csvToJson").init()' is run in the terminal
module.exports.init = function sendMessage() {
  console.log("hi");
};

// returns the name passed to the function
function schedules(name) {
  return name;
}

const name = process.argv[2];

if (!name) {
  console.log("Please provide a name!");
  return;
}

console.log(schedules(name));
