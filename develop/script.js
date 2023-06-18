$(document).ready(function () {
    // Initialize the modal
    $(".modal").modal();

var movieKey = "7355d3ba";

    $(".sidenav").sidenav();

    $("#enter-home-btn").click(function () {
        $(".initial-container").addClass("display-none");
        $("#home").removeClass("display-none");
        $(".footer").addClass("display-none");
    });

    $("#home-link").click(function (e) {
        e.preventDefault(); // Prevent default link behavior
        window.location.href = "index.html"; // Replace "index.html" with the filename or URL of your main home screen
        window.location.reload(); // Refresh the browser window
    });

$(document).on("click", "#favoritesBtn", function () {
    var movieTitle = $(this).siblings("h3").text();
    var favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
    // Check if movie is already in favorites
    if (!favoriteMovies.includes(movieTitle)) {
        favoriteMovies.push(movieTitle);
        localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovies));
        $("#modalTitle").text("Success!");
        $("#modalMessage").text("Movie added to favorites!");
        $("#messageModal").modal("open");
    } else {
        $("#modalTitle").text("Oops!");
        $("#modalMessage").text("This movie is already in your favorites!");
        $("#messageModal").modal("open");
    }
});

$(document).on("click", "#favoriteMoviesLink", function () {
    var favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];

    if (favoriteMovies.length > 0) {
        var html = "<h3>Your Favorite Movies:</h3>";
        html += "<ul class='favourite-movies-list'>";

        favoriteMovies.forEach(function (movie) {
            html += "<li class='favourite-movie'>" + movie + "</li>";
        });

        html += "</ul>";

        $("#result").html(html);
    } else {
        $("#result").html("<h3>No favorite movies found!</h3>");
    }

    $(".sidenav").sidenav("close");
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
        toggleWeather("cloudy");
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
                toggleWeather("lightning");
            } else if (weatherCode >= 500 && weatherCode <= 599) {
                $("#weather-image").attr("src", "develop/assets/weather-icons/rain-icon.png");
                toggleWeather("rain");
            } else if (weatherCode === 800) {
                $("#weather-image").attr("src", "develop/assets/weather-icons/sunny-icon.png");
                toggleWeather("sunny");
            } else if (weatherCode >= 600 && weatherCode <= 622) {
                $("#weather-image").attr(
                    "src",
                    "develop/assets/weather-icons/snowing-icon.png"
                );
                toggleWeather("snow");
            } else {
                $("#weather-image").attr(
                    "src",
                    "develop/assets/weather-icons/cloudy-icon.png"
                );
                toggleWeather("cloudy");
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
        movieKeywords[Math.floor(Math.random() * movieKeywords.length)]
    )}&type=movie`;

    console.log(apiUrl);

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            if (data.Response === "True") {
                var movies = data.Search;
                var result = $('#result');
                result.html('');

                if (movies.length > 0) {
                    var firstMovie = movies[0];
                    var title = firstMovie.Title;
                    var year = firstMovie.Year;
                    var poster = firstMovie.Poster;

                    var html = `
                        <h3>${title} (${year})</h3>
                        <img src="${poster}" alt="${title} Poster">
                        <button id="randomMovieBtn">Generate Random Movie</button>
                    `;
                    result.html(html);

                    var favoritesButton = $("<button>")
                        .attr("id", "favoritesBtn")
                        .addClass("btn-floating btn-large waves-effect waves-light red")
                        .html('<i class="material-icons">favorite</i>');

                    result.append(favoritesButton);

                    $('#randomMovieBtn').on('click', function () {
                        suggestMovies(weatherCode);
                    });
                }
            }
        })
        .catch(error => {
            console.log("Error fetching movie data:", error);
        });
}});

function toggleWeather(weather) {
    resetBackground();
    var x = document.getElementById(weather);
    x.style.display = "block";
}
function resetBackground() {
    document.getElementById("lightning").style.display = "none";
    document.getElementById("sunny").style.display = "none";
    document.getElementById("cloudy").style.display = "none";
    document.getElementById("rain").style.display = "none";
    document.getElementById("snow").style.display = "none";
}
resetBackground();