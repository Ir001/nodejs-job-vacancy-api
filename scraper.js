const axios = require('axios').default;
const cheerio = require('cheerio');
const URL = 'https://www.jobs.id/lowongan-kerja/';
const jobDetail = require('./job_detail');
function getSalary(salary){
    let new_salary = salary.split('\n');
    let start = 0;
    let end = 0;
    let secret = false;
    if(new_salary[1] !== undefined && new_salary[3] !== undefined){
        start = new_salary[1].trim();
        end = new_salary[3].trim();
    }else if(new_salary[0] === 'Gaji Dirahasiakan'){
        secret = true;
    }
    return {start,end,secret};
}

const scraper = (callback) => {
    axios.get(URL).then(({data}) => {
        return data;
    }).then((html) => {
        const $ = cheerio.load(html);
        const jobs = $('body').find('.single-job-ads');
        let data = [];
        jobs.map((idx,element) => {
            const el = $(element);
            const title = el.find('h3').eq(0).text().trim();
            const link = el.find('h3').find('a').attr('href').trim();
            const company = el.find('p > a').eq(0).text().trim();
            const location = el.find('p > span').eq(0).text().trim();
            const salary = getSalary(el.find('p').eq(1).text().trim());
            data.push({link,title,company,location,salary});
        });
        return data;
    }).then(data => {
        return Promise.all(
            data.map((basic) => {
                let detail = jobDetail(basic.link);
                return {basic, detail};
            })
        );
    }).then((response) => {
        callback(response);
    }).catch((err) => {
        console.error(err);
    });
}
module.exports = scraper;
// scraper(console.log);
// console.log(scrape);