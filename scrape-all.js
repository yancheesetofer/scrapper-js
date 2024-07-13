const axios = require("axios");
const cheerio = require("cheerio");

const baseURL = "https://books.toscrape.com/catalogue/";
const startURL = `${baseURL}page-1.html`;

// From our previous scraper, we know that the structure of the page is the same
async function scrapePage(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const books = [];

    $(".product_pod").each((index, element) => {
      const title = $(element).find("h3 a").attr("title");
      const price = $(element).find(".price_color").text();
      const availability = $(element).find(".availability").text().trim();
      books.push({ title, price, availability });
    });

    const nextPage = $(".pager .next a").attr("href");
    return { books, nextPage };
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return { books: [], nextPage: null };
  }
}

// Function to scrape all pages
async function scrapeAllPages(startURL) {
  let url = startURL;
  const allBooks = [];

  while (url) {
    console.log(`Scraping: ${url}`);
    const { books, nextPage } = await scrapePage(url);
    allBooks.push(...books);
    url = nextPage ? baseURL + nextPage : null;
  }

  return allBooks;
}

// Run the scraper
scrapeAllPages(startURL).then((books) => {
  console.log(`Total books scraped: ${books.length}`);
  console.log(books);
});