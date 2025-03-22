require("dotenv").config();
const express = require("express");
const path = require('path');
const https = require("https");
const bodyParser = require("body-parser");
const app = express();
// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
app.post("/", function (req, res) {
    // console.log(req.body.cityName);
    const query = req.body.cityName;
    const apiKey = process.env.WEATHER_API_KEY;
    const unit = "metric"
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;
    https.get(url, function (response) {
        console.log(response.statusCode);
        response.on("data", function (data) {
            const weatherData = JSON.parse(data)
            const temp = weatherData.main.temp
            const weather = weatherData.weather[0].description
            const icon = weatherData.weather[0].icon
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
                // console.log(temp);
            res.render('index', {
                imageURL, weather, temp, query
            });
            /*res.send(`
     <html>
         <head>
             <title>Weather Report</title>
             <head>
             <link href="css/style.css" rel="stylesheet">
         </head>
         <body>
         <div class="grid-container">
  <div class="grid-item"> <img src="${imageURL}" alt="Weather Image"> </div>
  <div class="grid-item"> </div>
  <div class="grid-item right"> <img src="${imageURL}" alt="Weather Image">  </div>
  <div class="grid-item"> <img src="${imageURL}" alt="Weather Image"> </div>
  <div class="grid-item center"> <p>Weather is Currently ${weather}</p>
  <h3>Temperature in ${query} is ${temp} Degrees Celsius</h3>
  <img src="${imageURL}" alt="Weather Image">  </div>
  <div class="grid-item right"><img src="${imageURL}" alt="Weather Image"> </div>  
  <div class="grid-item"><img src="${imageURL}" alt="Weather Image"> </div>
  <div class="grid-item "></div>
  <div class="grid-item right">  <img src="${imageURL}" alt="Weather Image"> </div>  
</div>
             
         </body>
     </html>
 `); */
        });
    })
})
app.listen(3000, function () {
    console.log("server is running");
});