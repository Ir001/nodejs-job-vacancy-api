const axios = require('axios').default;
const cheerio = require('cheerio');
const moment = require('moment');
const randomUseragent = require('random-useragent');
const URL = 'https://www.topkarir.com/lowongan';
const configs = {
    headers : {
        'User-Agent' : randomUseragent.getRandom(),
        'Referer' : 'https://www.topkarir.com/',
    }
}
let scrape = async (callback)=> {
    let {data} = await axios.get(URL,configs);
    let $ = cheerio.load(data);
    const jobsEl = $('body').find('.job-card');
    console.log(`Trying to get ${jobsEl.length} jobs`,`\nLoading...`);

    let response = jobsEl.map(async(index, el)=>{
        let job = $(el);
        let origin_post = job.find('.job-title a').first().attr('href')?.trim();
        let title = job.find('.job-title').first().text()?.trim();
        let company_name = job.find('.company-title').first().text()?.trim();
        let logo = job.find('.card-img img').first().attr("src");
        // Detail Post
        let {data} = await axios.get(origin_post,configs);
        let $$ = cheerio.load(data);
        let element = $$('body').first();
        let topPanel = element.find('#detail-comprof').first();
        let headers = getInfoHeader(topPanel.text());
        let location = headers?.[0];
        let category = headers?.[1];
        let posted_at = moment(getInfoPostedAt(headers?.[2])).format('YYYY-MM-DD');
        let industry =  element.find('*:contains("Industri")td').parent().find('.jobval').text()?.trim();
        let education =  element.find('*:contains("Pendidikan")td').parent().find('.jobval').text()?.trim();
        let range_salary =  element.find('*:contains("Gaji yang Ditawarkan")td').parent().find('.jobval').text()?.trim();
        let facility =  element.find('*:contains("Fasilitas & Tunjangan")td').parent().find('.jobval').text()?.trim();
        let expertise =  element.find('*:contains("Keahlian")td').parent().find('.jobval').text()?.trim();
        let required =  element.find('*:contains("Jumlah yang dibutuhkan")td').parent().find('.jobval').text()?.trim();
        let placed =  element.find('*:contains("Ditempatkan")td').parent().find('.jobval').text()?.trim();
        let description =  element.find('.jobdesc').first().html()?.trim();
        let btnApply = element.find('.btn-apply').first();
        let apply = btnApply.attr('data-url') != undefined ? btnApply.attr('data-url') : btnApply.attr('href'); 
        //
        let company = {
            company : company_name,
            industry,
            logo
        }
        let post = {
            origin_post,
            title,
            location,
            category,
            company,
            range_salary,
            education,
            facility,
            required,
            expertise,
            placed,
            description,
            apply,
            posted_at,
        }
        return post;
    })
    response = await Promise.all(response);
    return callback(response);
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
exports.scrape = scrape;