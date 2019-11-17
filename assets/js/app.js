;(function(d) {

  var endpoints = {
    location: "https://ipapi.co/json",
    weather: {
      url: "https://api.weatherbit.io/v2.0/current",
      apiKey: "ee0dd94ba1d741ef95017dd656b88a52"
    }
  };

  function getJSON(response) {
    return (response.ok) ? response.json() : Promise.reject(response);
  }

  fetch(endpoints.location)
    .then(getJSON)
    .then(console.dir);

})(document);