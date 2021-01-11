const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');
const app = express();
const port = 3000;
const scrape = async () => {
    const url = 'https://www.jobs.id/lowongan-kerja';
    const html = await axios.get(url).then(({data}) => {return data}).catch((e)=>{console.error(e)});
    const selector = cheerio.load(html);
    const jobs = selector('body').find('#job-ads-container');
    let data = [];
    jobs.map((idx,el) => {
        // console.log(this.extractJob(selector(el)));
        data[idx] = extractJob(selector(el)).then(result => {return result});
    })
    console.log(data.then(result => {return result}));
    return data;
}
const extractJob = async el =>{
    const detail = el.find('.single-job-ads');
    const link = detail.find('h3').find('a').attr('href').trim();
    const title = detail.find('h3').eq(0).text().trim();
    const company = detail.find('p > a').eq(0).text().trim();
    const location = detail.find('p > span').eq(0).text().trim();
    const salary = detail.find('p').eq(1).text().trim();
    let result;
    /* Detail Job  */
    const data = await axios.get(link).then(({data}) => {
        const $ = cheerio.load(data);
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

        result = {title,requirement,description,category,posted_at,deadline,
        about_company,logo, industry, size_company, office_address, apply};
    }).catch((e)=>{console.log(e)});
    return result;
    
}
app.get('/',(req, res) => {
    try{
        let response = scrape();
        res.json(response);
        console.log(response.then(result => {return result}));
    }catch{
        res.send('Error!');
    }
})

app.listen(port, () => {
    console.log(`Running in localhost: $(port)`);
})