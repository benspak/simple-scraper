const requestPromise = require("request-promise");
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");

const URLS = [
  { url: "https://www.imdb.com/title/tt10048342/", id: "the_queens_gambit" },
  //  {
  //    url: "https://www.imdb.com/title/tt0277371/",
  //    id: "not_another_teen_movie",
  //  },
];

// The Queen's Gambit
// https://www.imdb.com/title/tt10048342/

(async () => {
  let moviesData = [];

  for (let movie of URLS) {
    const response = await requestPromise({
      uri: movie.url,
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "max-age=0",
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
      title,
      rating,
      poster,
      totalRatings,
      releaseDate,
      genres,
    });

    let file = fs.createWriteStream(`${movie.id}.jpg`);

    let stream = request({
      uri: poster,
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "max-age=0",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "sec-gpc": "1",
        "upgrade-insecure-requests": "1",
        "user-agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36",
      },
      gzip: true,
    }).pipe(file);
  }
})();
