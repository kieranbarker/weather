var showWeather = function(options) {

  "use strict";

  /**
   * Variables
   */

  // Default options for the plugin
  var defaults = {
    selector: "#app",
    measurement: "celsius",
    message: "Right now in {city}, it's {temperature} and {conditions}.",
    icon: true
  };

  // Merge any user options into the defaults
  var settings = Object.assign(defaults, options);

  var endpoints = {
    location: "https://ipapi.co/json",
    weather: {
      url: "https://api.weatherbit.io/v2.0/current",
      apiKey: "ee0dd94ba1d741ef95017dd656b88a52"
    }
  };

  var app = document.querySelector("#app");
  var screenReader = document.querySelector("#screen-reader");



  /**
   * Functions
   */

  /**
   * Sanitize and encode all HTML in a user-submitted string
   * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
   * @param  {String} str  The user-submitted string
   * @return {String}      The sanitized string
   */
  function sanitizeHTML(str) {
    var temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  }

  // Get the JSON from a fetch request
  function getJSON(response) {
    return (response.ok) ? response.json() : Promise.reject(response);
  }

  // Fetch data from an endpoint AND get the JSON, in a single function
  function getData(url) {
    return fetch(url).then(getJSON);
  }

  function insertData(data) {
    // Get the actual data object
    data = data["data"][0];

    // Show the weather data on the page
    app.innerHTML = (
      "<img src='https://www.weatherbit.io/static/img/icons/" + sanitizeHTML(data.weather.icon) + ".png' alt='" + sanitizeHTML(data.weather.description) + "'>" +
      "<p>" +
        "Right now in " + sanitizeHTML(data.city_name) + ", it's " + sanitizeHTML(data.temp) + "&deg;C and " + sanitizeHTML(data.weather.description).toLowerCase() + "." +
      "</p>" +
      "<p>" +
        " Last observed: " +
        "<time>" +
          new Date(sanitizeHTML(data.ob_time).replace(" ", "T")).toLocaleTimeString() +
        "</time>." +
      "</p>"
    );

    // Announce the update to screen readers
    screenReader.textContent = app.textContent;
  }

  // Fetch data from the Weatherbit API
  function getWeather(data) {
    return getData(endpoints.weather.url +
      "?key=" + endpoints.weather.apiKey +
      "&city=" + data.city +
      "&country=" + data.country
    );
  }

  // Insert an error message into the DOM
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

  getData(endpoints.location)
    .then(getWeather)
    .then(insertData)
    .catch(insertError);

};