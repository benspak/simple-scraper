const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const { parse } = require("json2csv");

const URLS = [
  "https://www.imdb.com/title/tt10048342/",
  "https://www.imdb.com/title/tt0277371/",
];

// The Queen's Gambit
// https://www.imdb.com/title/tt10048342/

(async () => {
  let moviesData = [];

  for (let movie of URLS) {
    const response = await request({
      uri: movie,
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "max-age=0",
        dnt: "1",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "sec-gpc": "1",
        "upgrade-insecure-requests": "1",
        "user-agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36",
      },
    });

    let $ = cheerio.load(response);

    let title = $('div[class="title_wrapper"] > h1').text().trim();
    let rating = $('div[class="ratingValue"] > strong > span').text();
    let poster = $('div[class="poster"] > a > img').attr("src");
    let totalRatings = $('div[class="imdbRating"] > a').text();
    let releaseDate = $('a[title="See more release dates"]').text().trim();
    let genres = [];
    $('a[href^="/search/title?genres="]').each((i, elm) => {
      let genre = $(elm).text();
      genres.push(genre);
    });

    moviesData.push({
      genres,
      title,
      rating,
      poster,
      totalRatings,
      releaseDate,
    });
  }

  const csv = parse(moviesData);

  fs.writeFileSync("./output/data.csv", csv, "utf-8");
  console.log(csv);
})();
