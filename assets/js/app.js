;(function(d) {

  "use strict";

  /**
   * Variables
   */

  var endpoints = {
    location: "https://ipapi.co/json",
    weather: {
      url: "https://api.weatherbit.io/v2.0/current",
      apiKey: "ee0dd94ba1d741ef95017dd656b88a52"
    }
  };

  var app = d.querySelector("#app");
  var screenReader = d.querySelector("#screen-reader");

  /**
   * Functions
   */

  function getJSON(response) {
    return (response.ok) ? response.json() : Promise.reject(response);
  }

  function insertData(data) {
    // Get only the data we need
    data = data["data"][0];

    // Show the weather data on the page
    app.innerHTML = (
      "<img " +
        "src='https://www.weatherbit.io/static/img/icons/" + data.weather.icon + ".png' " +
        "alt='" + data.weather.description + "'>" +
      "<p>" +
        "Right now in " + data.city_name + ", it's " + data.temp + "&deg;C " +
        "and " + data.weather.description.toLowerCase() + "." +
      "</p>" +
      "<p>" +
        " Last observed: " +
        "<time>" +
          new Date(data.ob_time).toLocaleTimeString() +
        "</time>." +
      "</p>"
    );

    // Announce the update to screen readers
    screenReader.textContent = app.textContent;
  }

  function getWeather(data) {
    return (
      fetch(endpoints.weather.url +
        "?key=" + endpoints.weather.apiKey +
        "&city=" + data.city +
        "&country=" + data.country
      ).then(getJSON).then(insertData)
    );
  }

  function insertError(error) {
    app.innerHTML = (
      "<p>" +
        "Sorry, there was a problem getting the weather. Please try again later." +
      "</p>"
    );
  }

  /**
   * Init
   */

  fetch(endpoints.location)
    .then(getJSON)
    .then(getWeather)
    .catch(insertError);

})(document);