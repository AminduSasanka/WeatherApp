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
          reject("Something went wrong");
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

  $(".toggle-btn").click(toggleModal);
  $(".submit-btn").click(async () => {
    let coordinates = checkInputs();
    let newData = await fetchData(coordinates);
    updateWidgets(newData);
    toggleModal();
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
  $(".weather-img").empty();
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

  $(".bottom-row").empty();
  var wind_info = $("<p></p>").text(wind.speed + "kmph");
  var humidity_info = $("<p></p>").text(main.humidity + "%");
  var pressure_info = $("<p></p>").text(mbToatm(main.pressure) + "atm");
  var visibility_info = $("<p></p>").text(visibility / 1000 + "km");
  $(".bottom-row").append(
    wind_info,
    humidity_info,
    pressure_info,
    visibility_info
  );

  // weather info
  $(".more-info .info").empty();
  var min_temp = `<div><p>Minimum temp</p><p>${main.temp_min}<sup>&deg</sup>C</p></div>`;
  var max_temp = `<div><p>Maximum temp</p><p>${main.temp_max}<sup>&deg</sup>C</p></div>`;
  var sea_level = `<div><p>Sea level pressure</p><p>${
    main.sea_level ? mbToatm(main.sea_level) : "- "
  }atm</p></div>`;
  var grnd_level = `<div><p>Ground level pressure</p><p>${
    main.grnd_level ? mbToatm(main.grnd_level) : "- "
  }atm</p></div>`;
  $(".more-info .info").append(min_temp, max_temp, sea_level, grnd_level);

  // location info
  $(".location-info .info").empty();
  var country = `<div><p>Country</p><p>${
    sys.country ? sys.country : ""
  }</p></div>`;
  var city = `<div><p>City</p><p>${name}</p></div>`;
  var sunrise = `<div><p>Sunrise</p><p>${timeConvert(
    sys.sunrise
  )}  UTC</p></div>`;
  var sunset = `<div><p>Sunset</p><p>${timeConvert(sys.sunset)}  UTC</p></div>`;
  var timeZone = `<div><p>Time zone</p><p>${timeConvert(
    0,
    timezone
  )} UTC</p></div>`;
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
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=e83d2990635b79244dfeb46e77e79b0b&units=metric`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    alert("Server error : " + error);
    console.log(error);
  }
};

// unix time to standard timer converter & timezone
const timeConvert = (unixTime, timezone = 0) => {
  // timezone calculation
  if (timezone) {
    var date = new Date(unixTime);

    var hours = date.getHours();
    hours = hours < 10 ? `0${hours}` : `${hours}`;

    var mins = date.getMinutes();
    mins = mins < 10 ? `0${mins}` : `${mins}`;

    return `${hours}:${mins}`;
  }
  // unix to standard time convert
  var date = new Date(unixTime * 1000);

  var hours = date.getHours();
  hours = hours < 10 ? `0${hours}` : `${hours}`;

  var mins = date.getMinutes();
  mins = mins < 10 ? `0${mins}` : `${mins}`;

  return `${hours}:${mins}`;
};

// pressure converter milibar to atm
const mbToatm = (pressure) => {
  const mbInAtm = 0.000986923;
  let value = Math.round(pressure * mbInAtm * 100) / 100;
  return value;
};

const toggleModal = () => {
  $(".modal").toggleClass("modal-active");
};

const checkInputs = () => {
  let lat_val = $("#lat").val();
  let lon_val = $("#lon").val();

  if (lat_val == "") {
    $(".lat-error").text("Please enter valid coordinate");
  }
  if (lon_val == "") {
    $(".lon-error").text("Please enter valid coordinate");
  }
  if (lat_val && lon_val) {
    $(".lat-error").text("");
    $(".lon-error").text("");
  }
  return { lat: Number(lat_val), lon: Number(lon_val) };
};
