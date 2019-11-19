var showWeather = function(options) {

  "use strict";

  /**
   * Variables
   */

  // Default options for the plugin
  var defaults = {
    selector: "#app",
    units: "M",
    message: "Right now in {city}, it's {temperature} and {conditions}.",
    icon: true
  };

  // Merge any user options into the defaults
  var settings = Object.assign(defaults, options);

  // Get the element to render the data into
  var app = document.querySelector(settings.selector);





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
    var temp = document.createElement("div");
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

  // Return C or F depending on the units chosen (metric or imperial)
  function configureUnits(unitsSetting, data) {
    unitsSetting = unitsSetting.toLowerCase();
    if (unitsSetting === "m") return "C";
    if (unitsSetting === "i") return "F";
  }

  // Return a blank string or an icon depending on `settings.icon`
  function configureIcon(iconSetting, data) {
    var icon = "";

    if (iconSetting) {
      icon += "<img src='https://www.weatherbit.io/static/img/icons/" + sanitizeHTML(data.weather.icon) + ".png' alt='" + sanitizeHTML(data.weather.description) + "'>";
    }

    return icon;
  }

  function insertData(data) {
    // Create variables for the icon and units
    var icon, units,

    // Get the actual data object
    data = data["data"][0];

    // Configure icon and units
    icon = configureIcon(settings.icon, data);
    units = configureUnits(settings.units, data);

    // Show the weather data on the page
    app.innerHTML = (
      icon +
      "<p>" +
        settings.message
          .replace("{city}", data.city_name)
          .replace("{temperature}", data.temp + "&deg;" + units)
          .replace("{conditions}", data.weather.description.toLowerCase()) +
      "</p>"
    );
  }

  // Fetch data from the Weatherbit API
  function getWeather(data) {
    return getData("https://api.weatherbit.io/v2.0/current" +
      "?key=" + "ee0dd94ba1d741ef95017dd656b88a52" +
      "&units=" + settings.units +
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

  getData("https://ipapi.co/json")
    .then(getWeather)
    .then(insertData)
    .catch(insertError);

};
