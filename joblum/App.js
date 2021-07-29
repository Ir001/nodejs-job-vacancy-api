const axios = require('axios').default;
const cheerio = require('cheerio');
const moment = require('moment');
const BASEURL = 'https://id.joblum.com';
const URL = `${BASEURL}/jobs`;
let scrape = async (callback)=>{
    let renderStart = new Date().getTime();
    try{
        let {data} = await axios.get(URL);
        let $ = cheerio.load(data);
        let jobs = $('body').find('.item-details');
        console.log(`Found ${jobs.length} job...`);
        let response = jobs.map(async(index,el)=>{
            let job = $(el);
            let origin_post = `${BASEURL}${job.find('.job-title a')?.attr('href')}`;
            let title = job.find('.job-title a span')?.text()?.trim();
            let posted_at = moment(new Date(job.find('.job-date')?.attr('datetime'))).format('YYYY-MM-DD');
            let salary = getSalary(job.find('.date-desktop')?.next()?.text()?.trim());
            let companyName = job.find('.company-meta .company-name a')?.text().trim(); //company name
            let location = getLocation(job.find('.location-desktop')?.text().trim());
            let jobDetail = job.find('.job-details span a');
            let specification = jobDetail?.eq(0)?.text()?.trim();
            let category = jobDetail?.eq(1)?.text()?.trim();
            let industry = jobDetail?.eq(2)?.text()?.trim();
            // Detail
            let {data} = await axios.get(origin_post);
            let detail = $(data);
            let apply = `${BASEURL}${detail.find('.btn-apply')?.attr('href')?.trim()}`;
            let job_description = detail.find('span[itemprop=description]')?.html()?.trim();
            let logo = `${BASEURL}${detail.find('img[itemprop=logo]')?.attr('src')}`;
            let about_company = decodeURI(detail.find('#company-brief a')?.attr('data-full-text'));
            let company = {
                company : companyName,
                industry,
                logo,
                description : about_company,
                address : location
            }
            console.log(`Scraping ${index}...`);
            let post = {
                origin_post,
                title,
                company,
                location,
                category,
                salary,
                posted_at,
                apply,
                job_description,
            };
            return post;
        });
        response = await Promise.all(response)
        callback(response);
        let elapsed = new Date().getTime()-renderStart;
        console.log(`Render in ${elapsed} ms`);
    }catch(er){
        console.error(er);
        callback({success:false, message : er.toString()})
    }
}
let getSalary = (str)=>{
    let regex = /IDR (.*?) - (.*)/gm;
    let data = regex.exec(str);
    if(data == null){
        return {
            secret : true,
            min : 0,
            max : 0,
        };
    }
    let min = data?.[1].replace(/\./g,'');
    let max = data?.[2].replace(/\./g,'');
    return {
        secret : false,
        min : parseFloat(min),
        max : parseFloat(max),
    };

}

let getLocation = (str)=>{
    let comma = str.split(',');
    let _or = str.split('/');
    if(comma.length > 1){
        return comma[comma.length-1].trim();
    }else if(_or.length > 1){
        return _or[_or.length-1].trim();
    }
    return str;
}
exports.scrape = scrape;