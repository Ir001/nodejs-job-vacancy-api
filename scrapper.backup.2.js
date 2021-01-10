const cheerio = require('cheerio');
const axios = require('axios');

class Scrapper{
    scrape(){
        let data = [];
        const url = 'https://www.jobs.id/lowongan-kerja';
        axios.get(url).then((response) => {
            const selector = cheerio.load(response.data);
            const jobs = selector('body').find('#job-ads-container');
            jobs.map((idx,el) => {
                // console.log(this.extractJob(selector(el)));
                data.push(this.extractJob(selector(el)));
            })
        }).catch((e)=>{console.error(e)});        
        return data;
    }
    extractJob(el){
        const detail = el.find('.single-job-ads');
        const link = detail.find('h3').find('a').attr('href').trim();
        const title = detail.find('h3').eq(0).text().trim();
        const company = detail.find('p > a').eq(0).text().trim();
        const location = detail.find('p > span').eq(0).text().trim();
        const salary = detail.find('p').eq(1).text().trim();
        /* Detail Job  */
        let data_job = [];
        axios.get(link).then((res) => {
            const $ = cheerio.load(res.data);
            const job = $('body').find('.job-detail');
            const requirement = job.find('.job_req').html().trim();
            const description = job.find('.job_desc').html().trim();
            // Top Panel
            const top = job.find('.row');
            const category = top.eq(0).find('h4').find('a').text().trim();
            let posted_at = top.eq(3).find('p').eq(0).text().trim().split('Diiklankan sejak\n');
            posted_at = posted_at[1].trim();
            let deadline = top.eq(3).find('p').eq(1).text().trim().split('Ditutup pada\n');
            deadline = deadline[1].trim();

            // Company
            const company = $('body').find('.company-profile > .panel-body');
            const about_company = $('body').find('.about-company').eq(1).text().trim();
            const logo = company.find('img').attr('src').trim();
            const industry = company.find('p').eq(0).find('span').text().trim();
            const size_company = company.find('p').eq(1).find('b').text();
            const office_address = company.find('p').eq(2).find('b').text();
            // 
            const apply = $('body').find('.modal-modren').find('form').attr('action').trim();

            data_job.push({title,requirement,description,category,posted_at,deadline,
            about_company,logo, industry, size_company, office_address, apply});
        }).catch((e)=>{console.log(e)});
        console.log(data_job);
        return data_job;
        
    }
}
let scrapper = new Scrapper();
let scrape = scrapper.scrape();
// scrape.then(res => console.log(res));
console.log(scrape);
// module.exports = scrapper;