$(document).ready(async () => {
  var currentData;

  let getLocation = new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("location service is not supported");
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        var lat = pos.coords.latitude;
        var lon = pos.coords.longitude;

        if (lat && lon) {
          resolve({ lat, lon });
        } else {
          reject("blah");
        }
      },
      () => reject("Location is not allowed")
    );
  });

  getLocation
    .then(async (coordinates) => {
      currentData = await fetchData(coordinates);
      updateWidgets(currentData);
    })
    .catch(async (value) => {
      console.log(value);
      currentData = await fetchData({ lat: 2.786, lon: 35.567 });
      updateWidgets(currentData);
    });
});

// widget refresh
const updateWidgets = (currentData) => {
  const {
    coord,
    weather,
    main,
    visibility,
    wind,
    clouds,
    dt,
    sys,
    timezone,
    id,
    name,
    cod,
  } = currentData;

  updateBackground(weather[0].id);

  var weather_icon = `<img src=http://openweathermap.org/img/wn/${weather[0].icon}@4x.png>`;
  $(".weather-img").append(weather_icon);
  $(".current-info .sub-heading").html(
    name !== null ? name : "" + "  " + sys.country
  );
  $(".current-info .info .heading").text(weather[0].main);
  $(".current-info .info .description").text(weather[0].description);
  $(".info .sub-heading").html(Math.floor(main.temp) + "<sup>&deg</sup>" + "C");
  $(".temp-feelsLike").html(
    "feels like " + Math.floor(main.feels_like) + "<sup>&deg</sup>" + "C"
  );

  var wind_info = $("<p></p>").text(wind.speed + "kmph");
  var humidity_info = $("<p></p>").text(main.humidity + "%");
  var pressure_info = $("<p></p>").text(main.pressure + "mb");
  var visibility_info = $("<p></p>").text(visibility / 1000 + "km");
  $(".bottom-row").append(
    wind_info,
    humidity_info,
    pressure_info,
    visibility_info
  );

  var min_temp = `<div><p>Minimum temp</p><p>${main.temp_min}<sup>&deg</sup>C</p></div>`;
  var max_temp = `<div><p>Maximum temp</p><p>${main.temp_max}<sup>&deg</sup>C</p></div>`;
  var sea_level = `<div><p>Sea level pressure</p><p>${
    main.sea_level ? main.sea_level : "- "
  }mb</p></div>`;
  var grnd_level = `<div><p>Ground level pressure</p><p>${
    main.grnd_level ? main.grnd_level : "- "
  }mb</p></div>`;
  $(".more-info .info").append(min_temp, max_temp, sea_level, grnd_level);

  var country = `<div><p>Country</p><p>${
    sys.country ? sys.country : ""
  }</p></div>`;
  var city = `<div><p>City</p><p>${name}</p></div>`;
  var sunrise = `<div><p>Sun rise</p><p>${sys.sunrise} unix UTC</p></div>`;
  var sunset = `<div><p>Sun set</p><p>${sys.sunset} unix UTC</p></div>`;
  var timeZone = `<div><p>Time zone</p><p>${timezone}s UTC</p></div>`;
  $(".location-info .info").append(country, city, timeZone, sunrise, sunset);
};

// background image refresh
const updateBackground = (id) => {
  if (200 <= id && id < 250) {
    $("main").css("background-image", `url(images/${200}.jpg)`);
  } else if (300 <= id && id < 400) {
    $("main").css("background-image", `url(images/${300}.jpg)`);
  } else if (500 <= id && id < 600) {
    $("main").css("background-image", `url(images/${500}.jpg)`);
  } else if (600 <= id && id < 700) {
    $("main").css("background-image", `url(images/${600}.jpg)`);
  } else if (700 <= id && id < 800) {
    $("main").css("background-image", `url(images/${700}.jpg)`);
  } else if (id > 800) {
    $("main").css("background-image", `url(images/${801}.jpg)`);
  } else {
    $("main").css("background-image", `url(images/${800}.jpg)`);
  }
};

const fetchData = async ({ lat, lon }) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=e83d2990635b79244dfeb46e77e79b0b&units=metric`
  );
  const data = await response.json();
  return data;
};
