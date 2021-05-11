const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const scraper = require('./scraper');
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
})

app.listen(port, () => {
    console.log(`Application running in port: ${port}`);
})