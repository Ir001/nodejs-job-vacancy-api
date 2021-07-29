const axios = require('axios').default;
const cheerio = require('cheerio');
const URL = 'https://www.jobs.id/lowongan-kerja/';

let scrape = async(callback)=>{
    const {data} = await axios.get(URL);
    const $ = cheerio.load(data);
    const jobs = $('body .single-job-ads');
    console.log(`Scraping ${jobs.length}...`);
    jobs.map(async (index,element)=>{
        let job = $(element);
        
    });
}
scrape();