const axios = require("axios");
const cheerio = require("cheerio");

// Define the URL to scrape
const url = "https://books.toscrape.com";

async function scrapeBooks() {
  try {
    // Fetch the HTML content from the website
    const { data } = await axios.get(url);

    // Load the HTML content into cheerio
    const $ = cheerio.load(data);

    // Log the title and price of each book (read my medium for explanation)
    const books = [];
    $(".product_pod").each((index, element) => {
      const title = $(element).find("h3 a").attr("title");
      const price = $(element).find(".price_color").text();
      books.push({ title, price });
    });

    console.log(books);
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
  }
}

// Run the scraper
scrapeBooks();
