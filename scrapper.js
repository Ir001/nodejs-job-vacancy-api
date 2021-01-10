const axios = require('axios').default;
const cheerio = require('cheerio');
const url = 'https://www.jobs.id/lowongan-kerja';
function getHtml(url,callback){
    const response = axios.get(url)
        .then(response => {
            return callback(response.data)
        })
        .catch(e => console.error(e));
    return response;
}
function detailJob(el){
    const $ = cheerio.load(el);
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
}
function jobList(html){
    const $ = cheerio.load(html);
    const jobs = $('body').find('.single-job-ads');
    let data = [];
    jobs.map((idx,el) => {
        data.push(extractJob($(el)));
    })
    return data;
}
function extractJob(el){
    const title = el.find('h3').eq(0).text().trim();
    const link = el.find('h3').find('a').attr('href').trim();
    const company = el.find('p > a').eq(0).text().trim();
    const location = el.find('p > span').eq(0).text().trim();
    const salary = getSalary(el.find('p').eq(1).text().trim());
    let job = [];
    let data = getHtml(link,detailJob)
        .then(res => {
            job = {title,company,location,salary,res};
            return job;
        })
        .catch(err => console.log(err));
    let res = data
        .then((result) => {console.log(result)})
        .catch(err => console.error(err));
    return res;
}
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

let response = getHtml(url,jobList);
response.then(success => console.log(success));
