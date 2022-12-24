const mongoose = require("mongoose");
const request = require('supertest');
const app = require('../app');
require("dotenv").config();

beforeEach(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
});

afterEach(async () => {
    await mongoose.connection.close();
});

describe("GET /api/shorturl/1", () => {
  it("should return a 302 redirection ", async () => {
    const res = await request(app).get("/api/shorturl/1");
    expect(res.statusCode).toBe(302);
    //expect(res.body.length).toBeGreaterThan(0);
  });
});

describe("POST /api/shorturl", () => {
    
    it("should create a new element with short url", async () => {
        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min) + min); 
          }
      let random = getRandomInt(1,1500);
      let url_test = "https://www.radaranuncios.com/?ref="+random;
      const res = await request(app).post("/api/shorturl").send({
        url: url_test,
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.original_url).toBe(url_test);
    });

    it("should return error if an invald url is sended", async () => {
      let url_test = "ftp://radaranuncios..loom/?ref";
      const res = await request(app).post("/api/shorturl").send({
        url: url_test,
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.error).toBe('invalid url');
    });
    
  });