# web-scraping-with-node

## A collection of web scraping projects using Node.js & their corresponding technologies.

### **Formula One Scraper _(Node.js, Cheerio, Node-Fetch, PDFKit)_**

- _Scrapes the Formula One website for the latest news, results,standings, converts the scraped data into a PDF file, and saves it to a local folder._

### **Book Scraper _(Node.js, Cheerio, Axios, Json2Csv, CsvToJson)_**

- _Scrapes the website for the latest books, converts the scraped data into a CSV file & saves it to a local folder._

### **Hacker News Scraper _(Node.js, Cheerio, Got-Scraping, Crawlee, Docker)_**

- Version 1: _Scrapes the website for the latest news._
- Version 2: _The **CheerioCrawler** version using **Crawlee** is similar, but since **Crawlee** "simulates" the actions of a real user, the browser settings are defaulted to `"headless: true"`, so the designated browser opens & the whole program runs as automated. Also, any & all Datasets are stored in a storage folder in the root directory, & containerized using **Docker**._

### **Product Scraper _(Node.js, Cheerio, Playwright, Crawlee, Docker)_**

- Version 1: _Scrapes a website for a specific product & takes a screenshot of the webpage. Code is currently set for mintmobile.com._
- Version 2: _The **PlaywrightCrawler** version using **Crawlee** is similar, but since **Crawlee** "simulates" the actions of a real user, the browser settings are defaulted to `"headless: true"`, so the designated browser opens & the whole program runs as automated. Also, any & all Datasets are stored in a storage folder in the root directory, & containerized using **Docker**._

### **Amazon Scraper _(Node.js, Cheerio, Puppeteer, Playwright)_**

- Version 1: _Scrapes Amazon for a specific product & takes a screenshot of the webpage._
- Version 2: _The **Playwright** version is similar, but since **Playwright** "simulates" the actions of a real user, the browser settings are defaulted to `"headless: true"`, so the designated browser opens & the whole program runs as automated._

### **Yelp Scraper _(Node.js, Cheerio, Unirest)_**

- _Scrapes Yelp for the latest restaurants, their corresponding information & saves it in a local folder._

### **Google Search Scraper _(Node.js, Cheerio, Unirest)_**

- _Scrapes Google for the latest search results._

### **Google Jobs Scraper _(Node.js, Cheerio, Unirest, PDFKit)_**

- _Scrapes Google for the latest jobs in an area, and converts the scraped data into a PDF file in a local folder._

### **Google Images Scraper _(Node.js, Cheerio, Unirest)_**

- _Scrapes Google for the latest images in an area, and downloads them to a local folder._

### **Website Image Scraper _(Node.js, Puppeteer)_**

- _Scrapes a website for all of its images, and downloads them to a local folder._
