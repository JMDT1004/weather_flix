movieKey = "7355d3ba";

var movieNameRef = $("#movie-name");
var searchBTn = $("#search-btn");
var result = $("#result");

$(document).ready(function () {
    $(".sidenav").sidenav();

    $("#enter-home-btn").click(function () {
        $(".initial-container").addClass("display-none");
        $("#home").removeClass("display-none");
    });
});

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
            $("#temperature").text("Temperature: " + Math.round(res.main.temp) + "°F");
            $("#humidity").text("Humidity: " + res.main.humidity + "%");

            if (weatherCode >= 200 && weatherCode <= 232) {
                $("#weather-image").attr(
                    "src",
                    "develop/assets/weather-icons/lightning-icon.png"
                );
            } else if (weatherCode >= 500 && weatherCode <= 599) {
                $("#weather-image").attr("src", "develop/assets/weather-icons/rain-icon.png");
            } else if (weatherCode === 800) {
                $("#weather-image").attr("src", "develop/assets/weather-icons/sunny-icon.png");
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

            // Call the function to suggest movies based on the weather code
            suggestMovies(weatherCode);
        });
}

getLocation();

function suggestMovies(weatherCode) {
    var movieKeywords;
    if (weatherCode >= 200 && weatherCode <= 232) {
        // Thunderstorms
        movieKeywords = horrorMovies;
    } else if (weatherCode >= 500 && weatherCode <= 599) {
        // Rain
        movieKeywords = dramaMovies;
    } else if (weatherCode === 800) {
        // Clear sky
        movieKeywords = adventureMovies;
    } else if (weatherCode >= 600 && weatherCode <= 622) {
        // Snow
        movieKeywords = fantasyMovies;
    } else {
        // Other weather conditions
        movieKeywords = comedyMovies;
    }

    var apiUrl = `https://www.omdbapi.com/?apikey=${movieKey}&s=${encodeURIComponent(
        movieKeywords.join('|')
    )}&type=movie`;

    $.getJSON(apiUrl)
        .done(function (data) {
            console.log(data); // Log the API response for debugging

            if (data.Response === "True") {
                var movies = data.Search;
                var result = $('#result');
                result.html('');

                if (movies && movies.length > 0) {
                    // Filter movies based on the genre
                    var genreMovies = movies.filter(movie => {
                        var genres = movie.Genre.split(", ");
                        return movieKeywords.some(keyword => genres.includes(keyword));
                    });

                    if (genreMovies.length > 0) {
                        // Shuffle the movies array
                        shuffleArray(genreMovies);
                        // Display up to six movies
                        for (var i = 0; i < Math.min(6, genreMovies.length); i++) {
                            var movie = genreMovies[i];
                            var movieTitle = movie.Title;
                            var movieYear = movie.Year;
                            var moviePoster = movie.Poster;

                            // Create movie elements
                            var movieElement = $('<div>').addClass('movie');
                            var posterElement = $('<img>').attr('src', moviePoster).addClass('poster');
                            var titleElement = $('<h6>').text(movieTitle).addClass('title');
                            var yearElement = $('<span>').text(movieYear).addClass('year');

                            // Append movie elements to the result container
                            movieElement.append(posterElement, titleElement, yearElement);
                            result.append(movieElement);
                        }
                    } else {
                        result.append('No movies found for the specified genre.');
                    }
                } else {
                    result.append('No movies found for the specified genre.');
                }
            } else {
                console.log("Error: ", data.Error);
            }
        })
        .fail(function (error) {
            console.log("Error fetching movie data:", error);
        });
};