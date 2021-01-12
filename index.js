const express = require('express');
const app = express();
const port = 3000;
const scraper = require('./scraper');
app.get('/',(req, res) => {
    try{
        if(req.query.secret == 'irwan-antonio'){
            showJson = (data) =>{
                res.json(data);
            }
            scraper(showJson,req.query.limit);
        }else{
            res.json({success:true,message : ':P'});
        }
        
    }catch(e){
        res.send('Error! : '+e);
    }
})

app.listen(port, () => {
    console.log('Running in http://localhost:'+port);
})