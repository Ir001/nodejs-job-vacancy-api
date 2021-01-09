const cheerio = require('cheerio');
const axios = require('axios').default;

const fetchHtml = async url => {
    try{
        const {data} = await axios.get(url);
        return data;
    }catch{
        console.error('Error saat request GET ke :$(url)');
    }
}

const scrapeJob = async () => {
    const siteUrl = 'https://www.jobs.id/lowongan-kerja';
    const html = await fetchHtml(siteUrl);
    const selector = cheerio.load(html);
    const searchResult = selector('body').find('#job-ads-container');
    
    const jobs = searchResult.map((idx,el)=>{
        const elementSelector = selector(el);
        return extractJob(elementSelector);
    }).get();
    return jobs;
}

const extractJob = elementSelector => {
    const title = elementSelector.find('.single-job-ads').find('h3').text().trim();
    return {title};
}

module.exports = scrapeJob;