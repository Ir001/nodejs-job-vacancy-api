const axios = require('axios').default;
const cheerio = require('cheerio');

const jobDetail  = function(URL){
    return axios.get(URL).then(({data}) => {
        const $ = cheerio.load(data);
        const job = $('body').find('.job-detail');
        const requirement = job.find('.job_req').html().trim();
        const description = job.find('.job_desc')?.html()?.trim();
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
        const logo = company.find('img').attr('src')?.trim();
        const industry = company.find('p').eq(0).find('span').text().trim();
        const size_company = company.find('p').eq(1).find('b').text();
        const office_address = company.find('p').eq(2).find('b').text();
        // 
        const apply = $('body').find('.modal-modren').find('form').attr('action').trim();

        return {requirement,description,category,posted_at,deadline,
        about_company,logo, industry, size_company, office_address, apply};
    })
}

module.exports = jobDetail;