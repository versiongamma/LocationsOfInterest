const axios = require('axios');
const cheerio  = require('cheerio');
fs = require('fs');

const URL = 'https://www.health.govt.nz/our-work/diseases-and-conditions/covid-19-novel-coronavirus/covid-19-health-advice-public/contact-tracing-covid-19/covid-19-contact-tracing-locations-interest';

axios.get(URL)
.then(response => {

    let locationNames = [];
    let addresses = [];
    let days = [];
    let times = [];
    let dateAdded = [];

    const $ = cheerio.load(response.data);
    $('table > tbody > tr').each((i , row) => {
        locationNames.push($($(row).find('td')[0]).text());
        addresses.push($($(row).find('td')[1]).text());
        days.push($($(row).find('td')[2]).text());
        times.push($($(row).find('td')[3]).text());
        dateAdded.push($($(row).find('td')[5]).text());
    })

    //console.log(addresses);

})