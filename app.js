/* Plugin
========================================================================== */

/**
 * Display the user's local weather information
 * @param {Object} options Options for the plugin
 * @param {String} options.key An API key for the Weatherbit API
 * @param {String} options.selector A CSS selector for the element
 * @param {String} options.units The measurement system to use
 * @param {String} options.message The message to display
 * @param {Boolean} options.icon Whether to show an icon for the weather
 */
const weatherPlugin = function (options) {

  // Opt into strict mode
  'use strict';


  //
  // Variables
  //

  // The required endpoints
  const IP_API = 'https://ipapi.co/json';
  const WEATHER_API = 'https://api.weatherbit.io/v2.0/current';

  // Default settings for the plugin
  const defaults = {
    key: null,
    selector: '#app',
    units: 'M',
    message: 'Right now in {city}, it\'s {temperature} and {description}.',
    icon: true
  };

  // Merge user options with default settings
  const settings = Object.assign(defaults, options);

  // Get the element to render the data into
  const app = document.querySelector(settings.selector);


  //
  // Functions
  //

  /**
   * Get the JSON data from a Fetch request
   * @param {Response} response The Response object
   * @returns {Promise} The JSON data or the rejected response
   */
  function getJSON (response) {
    return response.ok ? response.json() : Promise.reject(response);
  }

  /**
   * Sanitize and encode all HTML in a user-submitted string
   * {@link https://portswigger.net/web-security/cross-site-scripting/preventing}
   * @param {String} str The user-submitted string
   * @returns {String} The sanitized string
   */
  function sanitizeHTML (str) {
    return str.replace(/[^\w. ]/gi, function (c) {
      return '&#' + c.charCodeAt(0) + ';';
    });
  };

  /**
   * Get the HTML string for the icon
   * @param {Object} data The Weatherbit API data
   * @param {String} data.icon The icon code
   * @param {String} data.description The weather description
   * @returns {String} An HTML string
   */
  function getIconHTML ({ icon, description }) {
    return `
      <p>
        <img
          src="https://www.weatherbit.io/static/img/icons/${icon}.png"
          alt="${description}"
          width="120"
          height="120"
        />
      </p>
    `;
  }

  /**
   * Get the correct temperature unit
   * @returns {String} The temperature unit
   */
  function getUnit () {
    // If metric, use Celsius
    if (settings.units.toUpperCase() === 'M') {
      return 'C';
    }

    // If imperial, use Fahrenheit
    if (settings.units.toUpperCase() === 'I') {
      return 'F';
    }
  }

  /**
   * Get the HTML string for the message
   * @param {Object} data The Weatherbit API data
   * @returns {String} An HTML string
   */
  function getMessageHTML (data) {
    return settings.message.replace(/{[A-Za-z]+}/g, function (match) {
      // Get the property name inside the {curly braces}
      const property = match.slice(1, -1);

      // If the property doesn't exist, do nothing
      if (!data.hasOwnProperty(property)) return;

      // If temp, return '[temp] [unit]'
      if (property === 'temperature') {
        return data[property] + ' &deg;' + getUnit();
      }

      // Otherwise, just return the property
      return data[property];
    });
  }

  /**
   * Render the Weatherbit API data
   * @param {Object} data The Weatherbit API data
   * @param {String} data.city_name The city name
   * @param {Number} data.temp The temperature
   * @param {Object} data.weather The weather code, icon code, and description
   */
  function renderWeather ({ city_name, temp, weather }) {
    // Sanitize the data
    const safeData = {
      city: sanitizeHTML(city_name),
      temperature: sanitizeHTML(Math.round(temp).toString()),
      description: sanitizeHTML(weather.description.toLowerCase()),
      icon: sanitizeHTML(weather.icon)
    };

    // Render the data
    app.innerHTML = `
      ${settings.icon ? getIconHTML(safeData) : ''}
      <p>
        ${getMessageHTML(safeData)}
      </p>
    `;
  }

  /**
   * Get the Weatherbit API data
   * @param {Object} data The IP API data
   * @param {Number} data.latitude The user's current latitude
   * @param {Number} data.longitude The user's current longitude
   * @returns {Promise<void>} A call to the Weatherbit API
   */
  function getWeather ({ latitude, longitude }) {
    // Get the key and units settings
    const { key, units } = settings;

    // Call the Weatherbit API
    return (
      fetch(`${WEATHER_API}?key=${key}&lat=${latitude}&lon=${longitude}&units=${units.toUpperCase()}`)
        .then(getJSON)
        .then(function ({ data }) {
          renderWeather(data[0]);
        })
    );
  }

  /**
   * Display an error message
   */
  function handleError () {
    app.innerHTML = `
      <p>
        <strong>
          Sorry, there was a problem.
          Please try again later.
        </strong>
      </p>
    `;
  }

  /**
   * Call the Weatherbit API with the IP API data
   */
  function init () {
    fetch(IP_API)
      .then(getJSON)
      .then(getWeather)
      .catch(handleError);
  }


  //
  // Inits & Event Listeners
  //

  // Call the Weatherbit API with the IP API data
  init();

};


/* Init
========================================================================== */

// Initialize the plugin
weatherPlugin({
  key: '243cdf8f20864201a20a332b0bfc399d',
  selector: '#app',
  units: 'M',
  message: 'Right now in {city}, it\'s {temperature} and {description}.',
  icon: true
});