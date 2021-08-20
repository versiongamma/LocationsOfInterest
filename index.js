const axios = require('axios');
const cheerio  = require('cheerio');
fs = require('fs');

const URL = 'https://www.health.govt.nz/our-work/diseases-and-conditions/covid-19-novel-coronavirus/covid-19-health-advice-public/contact-tracing-covid-19/covid-19-contact-tracing-locations-interest';

axios.get(URL)
.then(response => {
    const $ = cheerio.load(response.data);
    let table = '<table>\n' + $('.table-style-two').html() + '\n</table>';
    //console.log(table.html());

    fs.writeFile('index.html', table, ()=>{})
})