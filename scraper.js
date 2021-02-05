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
        start = Number(new_salary[1].trim().replace(/\./g,''));
        end = Number(new_salary[3].trim().replace(/\./g,''));
    }else if(new_salary[0] === 'Gaji Dirahasiakan'){
        secret = true;
    }
    return {start,end,secret};
}

const scraper = (callback,request=25) => {
    axios.get(URL).then(({data}) => {
        return data;
    }).then((html) => {
        const $ = cheerio.load(html);
        const jobs = $('body').find('.single-job-ads');
        let data = [];
        for (let index = 0; index < request; index++) {
            if(index >= jobs.length ){
                break;
            }
            const el = $(jobs[index]);
            const title = el.find('h3').eq(0).text().trim();
            const link = el.find('h3').find('a').attr('href').trim();
            let company = el.find('p > a[class="bold"]').eq(0).text().trim();
            company = company == '' ? 'Perusahaan Dirahasiakan' : company;
            const location = el.find('p > span').eq(0).text().trim();
            const salary = getSalary(el.find('p').eq(1).text().trim());
            data.push({link,title,company,location,salary});
                        
        }
        return data;
    }).then(data => {
        return Promise.all(
            data.map((basic) => {
               return jobDetail(basic.link).then(detail => {
                    return Promise.resolve({basic, detail});
                }).then(data => {
                    let clean = [];
                    clean = {
                        origin_post : data.basic.link,
                        title : data.basic.title,
                        category : data.detail.category,
                        location : data.basic.location,
                        salary : data.basic.salary,
                        description : data.detail.description,
                        requirement : data.detail.requirement,
                        posted_at : data.detail.posted_at,
                        deadline : data.detail.deadline,
                        apply_linkedin : data.detail.apply_linkedin,
                        apply_google : data.detail.apply_google,
                        company : {
                            company : data.basic.company,
                            industry :data.detail.industry,
                            logo : data.detail.logo,
                            about : data.detail.about_company,
                            size : data.detail.size_company,
                            address : data.detail.office_address,
                        }
                    }                    
                    return clean;
                });
            })
        );
    }).then((response) => {
        callback(response);
    }).catch((err) => {
        console.error(err);
    });
}
module.exports = scraper;
// scraper(console.log,1)