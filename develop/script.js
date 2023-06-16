// have fun with coding this:)
movieKey = "7355d3ba";

var movieNameRef = $("movie-name");
var searchBTn = $("search-btn");
var result = $("result");



$(document).ready(function () {
    $(".sidenav").sidenav();

    $("#enter-home-btn").click(function () {
        $(".initial-container").addClass("display-none");
        $("#home").removeClass("display-none");
    });
});

// var x = document.getElementById("demo");
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, handleLocationError);
    } else {
        handleLocationError("Geolocation is not supported by this browser.");
    }
}

function handleLocationError(error) {
    $("#weather-description").text("Error retrieving weather - enjoy random movies!");
    $("#weather-image").hide();
    console.log("Geolocation error:", error);
}

function getImageSource(weatherCode) {
    var weatherImages = {
        200: "./assets/weather-icons/lightning-icon.png",
        300: "./assets/weather-icons/rain-icon.png",
        500: "./assets/weather-icons/rain-icon.png",
        800: "./assets/weather-icons/sunny-icon.png",
    };

    var imageSrc = weatherImages[weatherCode];

    if (!imageSrc) {
        imageSrc = "./assets/weather-icons/cloudy-icon.png";
    }

    return imageSrc;
}

function showPosition(position) {
    console.log(position);
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    var weatherKey = "96515e32da8200e2651c60008ed403ea";
    var baseURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${weatherKey}`;
    console.log("API URL:", baseURL);
    fetch(baseURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (res) {
            console.log(res);
            var weatherCode = res.weather[0].id; // Get the weather condition code

            var imageSrc = getImageSource(weatherCode);

            $("#weather-image").attr("src", imageSrc);
            $("#weather-description").text(res.weather[0].main);
            $("#temperature").text(
                "Temperature: " + Math.round(res.main.temp) + "°F"
            );
            $("#humidity").text("Humidity: " + res.main.humidity + "%");

            if (weatherCode >= 200 && weatherCode <= 232) {
                $("#weather-image").attr(
                    "src",
                    "develop/assets/weather-icons/lightning-icon.png"
                );
            } else if (weatherCode >= 500 && weatherCode <= 599) {
                $("#weather-image").attr(
                    "src",
                    "develop/assets/weather-icons/rain-icon.png"
                );
            } else if (weatherCode === 800) {
                $("#weather-image").attr(
                    "src",
                    "develop/assets/weather-icons/sunny-icon.png"
                );
            } else if (weatherCode >= 600 && weatherCode <= 622) {
                $("#weather-image").attr(
                    "src",
                    "develop/assets/weather-icons/snowing-icon.png"
                );
            } else {
                $("#weather-image").attr(
                    "src",
                    "develop/assets/weather-icons/cloudy-icon.png"
                );
            }
        });
}

getLocation();

function suggestMovies(weatherCode) {
    // var weatherCode = res.weather[0].id;
    var movieGenre;
    if (weatherCode >= 200 && weatherCode <= 232) {
        // Thunderstorms
        movieGenre = "horror";
    } else if (weatherCode >= 500 && weatherCode <= 599) {
        // Rain
        movieGenre = "drama";
    } else if (weatherCode === 800) {
        // Clear sky
        movieGenre = "adventure";
    } else if (weatherCode >= 600 && weatherCode <= 622) {
        // Snow
        movieGenre = "fantasy";
    } else {
        // Other weather conditions
        movieGenre = "comedy";
    }






    
    var movieTitle = movieGenre;
    var apiUrl = `https://www.omdbapi.com/?apikey=${movieKey}&t=${encodeURIComponent(movieTitle)}&genre=${encodeURIComponent(movieGenre)}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Handle the movie data
            console.log(data);
            // Display the movie suggestions on the page
            var movieTitle = data.Title
            var result = $('#movie-name');
            result.html('');
            result.append(movieTitle)
            });
        

}
var weatherCode = 800;
suggestMovies(weatherCode);