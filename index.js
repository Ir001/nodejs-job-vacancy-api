const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const scraper = require('./scraper');
const topkarirScraper = require('./topkarir/App');
app.get('/',(req, res) => {
    try{
        showJson = (data) =>{
            res.json(data);
        }
        let limit = req?.query?.limit !== undefined || null ? req.query.limit : 25;
        console.log(`Grabing ${limit} url`); 
        return scraper(showJson,limit);        
    }catch(e){
        res.send(`Error : ${e}`);
    }
});
app.get('/top-karir', (req, res)=>{
    try{
        showJson = (data) =>{
            res.json(data);
        }
        return topkarirScraper.scrape(showJson);
    }catch(e){
        return res.json({success : false, 'message' : e.toString()});
    }
})

app.listen(port, () => {
    console.log(`Application running in http://localhost:${port}/`);
})