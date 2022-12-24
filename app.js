const express = require("express");
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const createInDbUrl = require("./db.js").createInDbUrl;
const findAll = require("./db.js").findAll;
const ElUrl = require("./db.js").ElUrl;

const Db = require("./db.js").Database;


app.use(cors({ optionsSuccessStatus: 200 }));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'));


app.get("/", function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/api/shorturl/:shortkey', async (req,res)=>{
    let dt = req.params.shortkey;
    Db._connect();
    const Ele = await ElUrl.find({shortUrl:Number(dt)});
    
    if (Ele.length==0) {
        res.json({
            'error':'invalid short url'
        })
    } else {
        console.log('redirecting to :'+Ele[0].url)
        res.redirect(Ele[0].url);  
    }
});

app.post('/api/shorturl', async (req, res) => {
    const url_r = req.body.url || '';
    const url_valid = url => {
        let url_d;
        try { 
            //return Boolean(new URL(url)); 
            url_d = new URL(url);
        }
        catch(e){ 
            return false; 
        }
        return url_d.protocol === "http:" || url_d.protocol === "https:";
    }
    console.log('valid url :'+ url_valid(url_r));

    if (!url_valid(url_r)){
        res.json({
            'error':'invalid url'
        })
    } else {
        Db._connect();
        const Ele = await ElUrl.find({ url:url_r});
        const count = await ElUrl.find();
        if (Ele.length == 0){
            console.log('url not registered : '+url_r)
            const result = await createInDbUrl(url_r,count.length+1);
            console.log(result);
            res.json({
                'original_url':url_r,
                'short_url':count.length+1
            });
        } else {
        res.json({
            'original_url':url_r,
            'short_url':Ele[0].shortUrl
        });
        }
    }   
  })

module.exports = app;