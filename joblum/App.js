const axios = require('axios').default;
const cheerio = require('cheerio');
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
            let posted_at = new Date(job.find('.job-date')?.attr('datetime'));
            let salary = getSalary(job.find('.date-desktop')?.next()?.text()?.trim());
            let company = job.find('.company-meta .company-name a')?.text().trim();
            let location = job.find('.location-desktop')?.text().trim();
            let jobDetail = job.find('.job-details span a');
            let specification = jobDetail?.eq(0)?.text()?.trim();
            let category = jobDetail?.eq(1)?.text()?.trim();
            let industry = jobDetail?.eq(2)?.text()?.trim();
            // Detail
            let {data} = await axios.get(origin_post);
            let detail = $(data);
            let job_description = detail.find('span[itemprop=description]')?.html()?.trim();
            let apply = `${BASEURL}${detail.find('.btn-apply')?.attr('href')?.trim()}`;
            let about_company = decodeURI(detail.find('#company-brief a')?.attr('data-full-text'));

            console.log(`Scraping ${index}...`);
            let post = {
                origin_post,
                title,
                company,
                location,
                specification,
                category,
                industry,
                salary,
                posted_at,
                job_description,
                apply,
                about_company
            };
            return post;
        });
        response = await Promise.all(response)
        callback(response);
        let elapsed = new Date().getTime()-renderStart;
        console.log(`Render in ${elapsed} ms`);
    }catch(er){
        console.error(er);
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
exports.scrape = scrape;