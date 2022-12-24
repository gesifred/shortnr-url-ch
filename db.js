require('dotenv').config();

let mongoose = require('mongoose');
const process = require('node:process');

mongoose.set('strictQuery', false);

const Database = {
    _connect: function(){
        let uri = process.env.MONGODB_URI;
        mongoose.connect(uri)
       .then(() => {
            console.log('Database connection successful')
       })
       .catch(err => {
            console.log(err)
            onsole.error('Database connection error')
       })
    }
}

let UrlSchema = new mongoose.Schema({
    url: String,
    shortUrl: Number,
});

UrlSchema.statics.getAllUrl = function(Ele) {
    return new Promise((resolve, reject) => {
      this.find((err, docs) => {
        if(err) {
          console.error(err)
          return reject(err)
        }
        
        resolve(docs)
      })
    })
  }

const ElUrl = mongoose.model('ElUrl', UrlSchema);

const createInDbUrl = async (urlString, urlKey) =>{
    const newUrl = new ElUrl({
        url: urlString,
        shortUrl : urlKey
    });
    return newUrl.save()
        .then(doc => {
            //console.log(doc)
            return doc
        })
        .catch(err => {
            console.error(err)
        })
}

const findAll = ()=>{
    ElUrl.find()
      .then(doc => {
        console.log(doc)
      })
      .catch(err => {
        console.error(err)
      })
}

const findOne = (urlString)=>{
    ElUrl.find({
        url:urlString
    })
      .then(doc => {
        console.log(doc)
      })
      .catch(err => {
        console.error(err)
      })
}

exports.ElUrl = ElUrl;
exports.createInDbUrl = createInDbUrl;
exports.findOne = findOne;

exports.Database = Database;
