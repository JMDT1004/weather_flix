// have fun with coding this:)
movieKey = "7355d3ba";

$(document).ready(function () {
  $(".sidenav").sidenav();

  $("#enter-home-btn").click(function () {
    $(".initial-container").addClass("display-none");
    $("#home").removeClass("display-none");
  });
});





var baseURL =
  "https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={weatherKey}";
var weatherKey = "96515e32da8200e2651c60008ed403ea";
var url = baseURL.replace("{weatherKey}", weatherKey);
var latitude = position.coords.latitude;
var longitude = position.coords.longitude;
console.log(url);

function getCurrentPosition() {
  return new Promise(function (resolve, reject) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    } else {
      reject("Geolocation is not supported by this browser.");
    }
  });
}

getCurrentPosition()
  .then(function (position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    var weatherKey = "96515e32da8200e2651c60008ed403ea";
    var url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherKey}`;

    console.log("API URL:", url);

    // Perform further actions with the URL, such as making an API request
  })
  .catch(function (error) {
    console.log("Error:", error);
  });
