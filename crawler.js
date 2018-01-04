const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');

const GENERATION_I = 'https://www.giantbomb.com/profile/wakka/lists/the-150-original-pokemon/59579/?page=1';
const GENERATION_II = 'https://www.giantbomb.com/profile/wakka/lists/the-150-original-pokemon/59579/?page=2';

(async () => {
  try {
    let pokemons = [
      await getPokemons(GENERATION_I),
      await getPokemons(GENERATION_II)
    ];
    pokemons = [...pokemons[0], ...pokemons[1]];
    
    // save file
    fs.writeFile(`./pokemons.json`, JSON.stringify(pokemons, null, 4), (err) => {
      if (err) {
        console.log(err);
      }
    });
  } catch (err) {
    console.log(err);
  }
})();

async function download(uri, filename) {
  return new Promise((resolve, reject) => {
    const request = require('request');
    request.head(uri, function (err, res, body) {
      if (err) {
        return reject(err);
      }
      request(uri).pipe(fs.createWriteStream(`./public/img/${filename}.png`)).on('close', (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

async function getPokemons(url) {
  let html = await request(url);
  let $ = cheerio.load(html);
  let pokemons = [];
  $('div.img.imgboxart').each(async (i, ele) => {
    let $card = $(ele);
    let name = $card.next('h3').text().trim().split(' ')[1];
    pokemons.push(name);

    let imgUri = $card.find('img').attr('src');
    try {
      await download(imgUri, name);
    } catch(err) {
      console.log(err);
    }
    console.log('Catch: ', name);
  });
  return pokemons;
}
