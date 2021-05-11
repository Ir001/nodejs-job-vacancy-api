const axios = require('axios').default;
const cheerio = require('cheerio');
const moment = require('moment');
moment.locale('id');
const jobDetail  = function(URL){
    return new Promise((resolve,reject) => {
        axios.get(URL).then(({data}) => {
            const $ = cheerio.load(data);
            const job = $('body').find('.job-detail');
            const requirement = job.find('.job_req').html();
            const description = job.find('.job_desc').html();
            // Top Panel
            const top = job.find('.row');
            const category = top.eq(0).find('h4').find('a').eq(0).text().trim();
            let posted_at = top.eq(3).find('p').eq(0).text().trim().split('Diiklankan sejak\n');
            posted_at = posted_at[1]?.trim();
            posted_at = moment(posted_at,'DD MMM YYYY','en').format('YYYY-MM-DD');
            let deadline = top.eq(3).find('p').eq(1).text().trim().split('Ditutup pada\n');
            deadline = deadline[1]?.trim();
            deadline = moment(deadline,'DD MMM YYYY','en').format('YYYY-MM-DD');
            // Company
            const company = $('body').find('.company-profile > .panel-body');
            const about_company = $('body').find('.about-company').eq(1).text().trim();
            const logo = company.find('img').attr('src');
            const industry = company.find('p').eq(0).find('span').text().trim();
            const panel_company = company.find('p');
            let size_company = panel_company.find('*:contains("Ukuran Perusahaan:")').parent().find('b').text().trim();
            let range = size_company.split(' ');
            size_company = {
                from : range[0] == '' ? 0 : range[0],
                to : range[2] == undefined ? 0 : range[2],
            }
            let office_address = panel_company.find('*:contains("Kantor Pusat:")').parent().find('b').text().trim();
            const apply_linkedin = $('body').find('.modal-modren').find('form').attr('action').trim();
            const apply_google = $('body').find('.modal-modren').find('.btn-google').attr('href').trim();
            resolve({requirement,description,category,posted_at,deadline,
            about_company,logo, industry, size_company, office_address, apply_linkedin, apply_google});
        }).catch((err) => {
            console.error(err);
        })
    });
}

module.exports = jobDetail;