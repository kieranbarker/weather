var showWeather = function(options) {

  "use strict";

  /**
   * Variables
   */

  // Default options for the plugin
  var defaults = {
    apiKey: null,
    selector: "#app",
    units: "M",
    message: "Right now in {city}, it's {temperature} and {conditions}.",
    icon: true,
    error: "Sorry, there was a problem getting the weather. Please try again later."
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

  // Return a blank string or an icon depending on `settings.icon`
  function getIcon(iconSetting, data) {
    var icon = "";

    if (iconSetting) {
      icon += "<img src='https://www.weatherbit.io/static/img/icons/" + sanitizeHTML(data.weather.icon) + ".png' alt='" + sanitizeHTML(data.weather.description) + "'>";
    }

    return icon;
  }

  // Return C or F depending on the units chosen (metric or imperial)
  function getUnits(unitsSetting) {
    unitsSetting = unitsSetting.toLowerCase();
    if (unitsSetting === "m") return "C";
    if (unitsSetting === "i") return "F";
  }

  // Get the description of the weather
  function getDescription(data) {
    return settings.message
      .replace("{city}", sanitizeHTML(data.city_name))
      .replace("{temperature}", sanitizeHTML(data.temp) + "&deg;" + units)
      .replace("{conditions}", sanitizeHTML(data.weather.description).toLowerCase());
  }

  function insertData(data) {
    // Create variables for the icon and units
    var icon, units;

    // Get the actual data object
    data = data["data"][0];

    // Configure icon and units
    icon = getIcon(settings.icon, data);
    units = getUnits(settings.units);

    // Show the weather data on the page
    app.innerHTML = icon + "<p>" + getDescription(data) + "</p>";
  }

  // Fetch data from the Weatherbit API
  function getWeather(data) {
    return getData("https://api.weatherbit.io/v2.0/current" +
      "?key=" + settings.apiKey +
      "&units=" + settings.units.toUpperCase() +
      "&city=" + data.city +
      "&country=" + data.country
    );
  }

  // Insert an error message into the DOM
  function insertError(error) {
    app.innerHTML = "<p>" + settings.error + "</p>";
  }





  /**
   * Init
   */

   // Don't run if no API key was provided
   if (!settings.apiKey) {
     console.error("Please provide an API key.");
     return;
   }

  getData("https://ipapi.co/json")
    .then(getWeather)
    .then(insertData)
    .catch(insertError);

};
