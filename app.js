const bodyParser = require("body-parser");
const express = require("express");
const https = require("https");
const app = express();
const port = 17457;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

function notFound(res) {
  res.write("<!DOCTYPE html>");
  res.write("<html lang='en'>");
  res.write("<head>");
  res.write("<meta charset='UTF-8'>");
  res.write(
    "<meta name='viewport' content='width=device-width, initial-scale=1.0'>"
  );
  res.write("<title>Weather App</title>");
  res.write("<link rel='stylesheet' href='../css/style.css'>");
  res.write("</head>");
  bodyBg(res);
  res.write("<div class='container'>");
  res.write("<div class='header'>");
  res.write("<h1 class='city'>City not found</h1>");
  res.write("</div>");
  res.write("<div class='weather'>");
  res.write("<h1 class='temperature'>Try again</h1>");
  res.write(
    "<img class='weatherIcon' src='https://www.nicepng.com/png/full/225-2255762_error404-error-404-icono-png.png'>"
  );
  res.write("</div>");
  res.write("</div>");
  res.write("<a href='/' class='back-button'>Back</a>");
  res.write("</body>");
  res.write("</html>");
  res.send();
}

function bodyBg(res, icon) {
  const imageLocation = "./images/";
  switch (icon) {
    case "01d":
      res.write(
        `<body style="background: url(${imageLocation}sunnyyBg.jpg) no-repeat center center fixed; background-size: cover;" >`
      );
      break;
    case "01n":
      res.write(
        `<body style="background: url(${imageLocation}nightyBg.jpg) no-repeat center center fixed; background-size: cover;">`
      );
      res.write(
        "<style>.container {box-shadow: 0 0 15px 0 rgba(255, 255, 255, 1);} .forecast-header {background-color: rgba(255, 255, 255, 0.8); color: #333; box-shadow: 0 0 5px 0 rgba(255, 255, 255, 1);}</style>"
      );
      break;
    case "04d":
    case "04n":
      res.write(
        `<body style="background: url(${imageLocation}brokenBg.jpg) no-repeat center center fixed; background-size: cover;">`
      );
      break;
    case "09d":
    case "09n":
    case "10d":
    case "10n":
      res.write(
        `<body style="background: url(${imageLocation}rainyBg.jpg) no-repeat center center fixed; background-size: cover;">`
      );
      break;
    case "11d":
    case "11n":
      res.write(
        `<body style="background: url(${imageLocation}thunderBg.jpg) no-repeat center center fixed; background-size: cover;">`
      );
      break;
    case "13d":
    case "13n":
      res.write(
        `<body style="background: url(${imageLocation}snowBg.jpg) no-repeat center center fixed; background-size: cover;">`
      );
      break;
    case "50d":
    case "50n":
      res.write(
        `<body style="background: url(${imageLocation}mistBg.jpg) no-repeat center center fixed; background-size: cover;">`
      );
      break;

    default:
      res.write(
        `<body style="background: url(${imageLocation}cloudBg.jpg) no-repeat center center fixed; background-size: cover;">`
      );
      break;
  }
}

app.post("/", (req, res) => {
  const query = req.body.city;
  const apiKey = "bc9b64d979da5c37a3d0ffcc4bf71a31";
  const units = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&APPID=" +
    apiKey +
    "&units=" +
    units;
  https.get(url, (response) => {
    response.on("data", (data) => {
      const weatherData = JSON.parse(data);
      const cityCheck = weatherData.message;

      if (
        cityCheck === "city not found" ||
        cityCheck === "Nothing to geocode"
      ) {
        notFound(res);
      } else {
        const temp = weatherData.main.temp;
        const weatherDescription = weatherData.weather[0].description;
        const country = weatherData.sys.country;
        const city = weatherData.name;
        const icon = weatherData.weather[0].icon;
        const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@4x.png";
        res.write("<!DOCTYPE html>");
        res.write("<html lang='en'>");
        res.write("<head>");
        res.write("<meta charset='UTF-8'>");
        res.write(
          "<meta name='viewport' content='width=device-width, initial-scale=1.0'>"
        );
        res.write("<title>Weather App</title>");
        res.write("<link rel='stylesheet' href='../css/style.css'>");
        res.write("</head>");
        bodyBg(res, icon);
        res.write("<h1 class='forecast-header'>Today's Weather</h1>");
        res.write("<div class='container'>");
        res.write("<div class='header'>");
        res.write("<h1 class='city'>" + city + ", " + country + "</h1>");
        res.write("</div>");
        res.write("<div class='weather'>");
        res.write("<h1 class='temperature'>" + temp + "°C</h1>");
        res.write("<img class='weatherIcon' src=" + imageUrl + ">");
        res.write("</div>");
        res.write("<div class='description'>");
        res.write("<h3>" + weatherDescription + "</h3>");
        res.write("</div>");
        res.write("</div>");
        res.write("<a href='/' class='back-button'>Back</a>");
        res.write("</body>");
        res.write("</html>");
        res.send();
      }
    });
  });
});

app.listen(port, () => console.log(`API Running on port: ${port}!`));
