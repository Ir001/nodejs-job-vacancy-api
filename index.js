const express = require('express');
const app = express();
const port = 3000;
const scraper = require('./scraper');
app.get('/',(req, res) => {
    try{
        showJson = (data) =>{
            res.json(data);
        }
        scraper(showJson);
    }catch(e){
        res.send('Error! : '+e);
    }
})

app.listen(port, () => {
    console.log('Running in localhost: '+port+')');
})