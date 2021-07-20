const axios = require('axios').default;
const cheerio = require('cheerio');
const URL = 'https://www.topkarir.com/lowongan';

let scrape = async (callback)=> {
    const request = await axios.get(URL);
    const data = request.data;
    const $ = cheerio.load(data);
    const jobsEl = $('body').find('.job-card');
    console.log(`Trying to get ${jobsEl.length} jobs`,`\n Loading...`);
    let job = [];
    for (let index = 0; index < jobsEl.length; index++) {
        let el = $(jobsEl[index]);
        let origin_post = el.find('.job-title a').first().attr('href')?.trim();
        let title = el.find('.job-title').first().text()?.trim();
        let company_name = el.find('.company-title').first().text()?.trim();
        let logo = el.find('.card-img img').first().attr("src");
        job.push({
            origin_post : origin_post,
            title : title,
            company : {
                name : company_name,
                logo : logo
            },
            detail : null,
        });
    }
     let responses = job.map(async (value, index) => {
         let detail = await detailPost(value);
         return detail;
     })
     responses = await Promise.all(responses);
     callback(responses);
}
let detailPost = async (job)=>{
   try{
        let request = await axios.get(job?.origin_post);
        const $ = cheerio.load(request.data);
        let element = $('body').first();
        let topPanel = element.find('#detail-comprof').first();
        let headers = getInfoHeader(topPanel.text());
        let regency = headers?.[0];
        let category = headers?.[1];
        let posted_at = getInfoPostedAt(headers?.[2]);
        let industry =  element.find('*:contains("Industri")td').parent().find('.jobval').text()?.trim();
        let education =  element.find('*:contains("Pendidikan")td').parent().find('.jobval').text()?.trim();
        let range_salary =  element.find('*:contains("Gaji yang Ditawarkan")td').parent().find('.jobval').text()?.trim();
        let facility =  element.find('*:contains("Fasilitas & Tunjangan")td').parent().find('.jobval').text()?.trim();
        let expertise =  element.find('*:contains("Keahlian")td').parent().find('.jobval').text()?.trim();
        let required =  element.find('*:contains("Jumlah yang dibutuhkan")td').parent().find('.jobval').text()?.trim();
        let placed =  element.find('*:contains("Ditempatkan")td').parent().find('.jobval').text()?.trim();
        let description =  element.find('.jobdesc').first().html()?.trim();
        let btnApply = element.find('.btn-apply').first();
        let apply_url = btnApply.attr('data-url') != undefined ? btnApply.attr('data-url') : btnApply.attr('href'); 
        job.company.industry = industry;
        job.detail = 
            [{
                education : education,
                facility : facility,
                expertise : expertise,
                required : required,
                placed : placed,
                salary : range_salary,
                regency : regency,
                category : category,
                description : description,
                apply_url : apply_url,
                posted_at : posted_at,
            }]
        ;
        return await job;
   }catch(er){
        console.log(`Error scraping detail : ${e}`);
        return null;
   }

}
let getInfoHeader = (str) => {
    let header = str.trim().split('\n');
    header.map((value,index) => {
        header[index] = value.trim().trimStart();
    });
    header.map((value,index) => {
        (header[index] == '' ? header.splice(index,1) : 0);
    })
    return header;
}
let getInfoPostedAt = (str) => {
    try{
        let regex = /Dipasang(.*?)hari lalu/gm;
        let getDay = regex.exec(str);
        if(getDay == null){
            return new Date();
        }
        let day_ago = parseInt(getDay?.[1]);
        let date = new Date();
        date.setDate(date.getDate() - day_ago);
        return date;
    }catch(e){
        console.log(`Error ${e}`)
        return new Date();
    }
}
// detailPost({origin_post : 'https://www.topkarir.com/lowongan/detil/pt-abc-kogen-dairy-plant-performance-and-it-staff', company : {name : 'x'}})
// .catch((e)=>{
//     console.error(e);
// });
// scrape(console.log).catch(e=>console.log(e));
exports.scrape = scrape;