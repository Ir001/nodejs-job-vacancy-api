const axios = require('axios').default;
const cheerio = require('cheerio');
const URL = 'https://www.topkarir.com/lowongan';

let scrape = ()=> {
    axios.get(URL).then(({data}) => {
        return data;
    }).then((html) => {
        const $ = cheerio.load(html);
        const jobs = $('body').find('.job-card');
        let data = [];
        jobs.map((index,jobCard) => {
            let el = $(jobCard);
            let origin_post = el.find('.job-title a').first().attr('src').trim();
            let title = el.find('.job-title').first().text().trim();
            let company_name = el.find('.company-title').first().text().trim();
            let logo = el.find('.card-img img').first().attr("src");
            data.push({
                origin_post : origin_post,
                title : title,
                company : {
                    name : company_name,
                    logo : logo
                }
            });
        })
        console.log(data);
    })
}
let detailPost = (origin_post)=>{

}
try{
    scrape();
}catch(err){
    console.log(err.toString());
}