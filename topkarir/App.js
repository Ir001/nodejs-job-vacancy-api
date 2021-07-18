const axios = require('axios').default;
const cheerio = require('cheerio');
const URL = 'https://www.topkarir.com/lowongan';

let scrape = (callback)=> {
    return new Promise((resolve, reject) => {
        axios.get(URL).then(({data}) => {
            const $ = cheerio.load(data);
            const jobsEl = $('body').find('.job-card');
            let job = [];
            // jobsEl.map((index,jobCard) => {
            //     if(index < 2){
            //         let el = $(jobCard);
            //         let origin_post = el.find('.job-title a').first().attr('href').trim();
            //         let title = el.find('.job-title').first().text().trim();
            //         let company_name = el.find('.company-title').first().text().trim();
            //         let logo = el.find('.card-img img').first().attr("src");
            //         job.push({
            //             origin_post : origin_post,
            //             title : title,
            //             company : {
            //                 name : company_name,
            //                 logo : logo
            //             }
            //         });
            //     }               
            // })
            for (let index = 0; index < 3; index++) {
                let el = $(jobsEl[index]);
                let origin_post = el.find('.job-title a').first().attr('href').trim();
                let title = el.find('.job-title').first().text().trim();
                let company_name = el.find('.company-title').first().text().trim();
                let logo = el.find('.card-img img').first().attr("src");
                job.push({
                    origin_post : origin_post,
                    title : title,
                    company : {
                        name : company_name,
                        logo : logo
                    }
                });
            }
            let response = [];
            job.map((value, index) => {
                response.push(new Promise((resolve,reject)=>{
                    detailPost(value).then(data=>{return resolve(data)})
                }))
            });
            console.log(response);
            return resolve(callback(response))
        }).catch(e => {
            console.log(e);
        })
    })
}
let detailPost = (job)=>{
    return new Promise((resolve,reject) =>{
        axios.get(job?.origin_post).then(({data}) => {
            const $ = cheerio.load(data);
            let element = $('body').first();
            let topPanel = element.find('#detail-comprof').first();
            // let headers = getInfoHeader(topPanel.text());
            // let regency = headers?.[0];
            // let category = headers?.[1];
            // let posted_at = getInfoPostedAt(headers?.[2]);
            let industry =  element.find('*:contains("Industri")td').parent().find('.jobval').text().trim();
            let education =  element.find('*:contains("Pendidikan")td').parent().find('.jobval').text().trim();
            let range_salary =  element.find('*:contains("Gaji yang Ditawarkan")td').parent().find('.jobval').text().trim();
            let facility =  element.find('*:contains("Fasilitas & Tunjangan")td').parent().find('.jobval').text().trim();
            let expertise =  element.find('*:contains("Keahlian")td').parent().find('.jobval').text().trim();
            let required =  element.find('*:contains("Jumlah yang dibutuhkan")td').parent().find('.jobval').text().trim();
            let placed =  element.find('*:contains("Ditempatkan")td').parent().find('.jobval').text().trim();
            let description =  element.find('.jobdesc').first().html().trim();
            let btnApply = element.find('.btn-apply').first();
            let apply_url = btnApply.attr('data-url') != undefined ? btnApply.attr('data-url') : btnApply.attr('href'); 
            job.company.industry = industry;
            job.detail = 
                {
                    education : education,
                    facility : facility,
                    expertise : expertise,
                    required : required,
                    placed : placed,
                    // regency : regency,
                    // category : category,
                    description : description,
                    apply_url : apply_url,
                    // posted_at : posted_at,
                }
            ;
                resolve(job);
        }).catch(e => {
            console.log(e);
        })
    });

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
        let day_ago = parseInt(getDay[1]);
        let date = new Date();
        date.setDate(date.getDate() - day_ago);
        return date;
    }catch(e){
        console.log(`Error ${e}`)
        return new Date();
    }
}
// detailPost({origin_post : 'https://www.topkarir.com/lowongan/detil/pt-abc-kogen-dairy-plant-performance-and-it-staff', company : {name : 'x'}});
// scrape();
exports.scrape = scrape;