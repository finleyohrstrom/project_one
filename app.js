// I (Finley) wrote all this too lol pretty ba i know

$(document).ready(function() {
  console.log('doc ready yea yea');

  var config = {
        apiKey: "AIzaSyCvKr8XCnaCGcSrSDC5Fy7AyALsa8CToEk",
        authDomain: "projectone-b4271.firebaseapp.com",
        databaseURL: "https://projectone-b4271.firebaseio.com",
        projectId: "projectone-b4271",
        storageBucket: "projectone-b4271.appspot.com",
        messagingSenderId: "469463387856"
      };
      firebase.initializeApp(config);
      var database = firebase.database();

      // set some gnarly var's
      var interval = setInterval(arrow, 1000 * 15);
      var basePrice = 0
      var stock = ""
      var news = ""
      var arrowDiv = $("<div>")
      var currentUser = location.hash.replace("#", "")
      console.log(currentUser)

      // This is the big kahuna, on page load it verifys if you are coming from a sign in page, then it cross references your password for security (i know its not encrypted etc. ill do that in project 2). f you are logging in as opposed to using first time, it will populate the news, weather, and stock divs by randomly selecting one of you stored in database news + stock interests, as well as populting weather with your stored home city + state. This function activates the arrow() function that measures off the same gobally stored variable as the the stock information is populated by, and again, randomly chosen from a user input and stored array.

      $(document).ready(function() {
        database.ref(currentUser).on('value', function(snap){
          console.log(snap.val())
          var realUser = snap.val().userName;
          if (currentUser === realUser){
            stock = snap.val().finance[Math.floor(Math.random()*snap.val().finance.length)];
            news = snap.val().news[Math.floor(Math.random()*snap.val().news.length)];

            var nameDiv = $("<div>").addClass("name-div");
            var nameRaw = "Hello " + snap.val().firstName + " " + snap.val().lastName + "! Welcome back."

            var name = $(nameDiv).html(nameRaw)
            $("#nameDiv").html(name)
          }
          else {
            alert("You failed to log in... lol")
          }
          var queryURL = "https://crossorigin.me/http://marketdata.websol.barchart.com/getQuote.json?key=3a7c2bc136b9027743e077f17c788f0c&symbols=" + stock;

          $.ajax({
            url: queryURL,
            method: "GET"
          }).done(function(response) {
            console.log(response);

            var name = response.results[0].name;
            var symbol = response.results[0].symbol;
            var exchange = response.results[0].exchange;
            var last = response.results[0].lastPrice;
            basePrice = response.results[0].lastPrice;
            var open = response.results[0].open;
            var close = response.results[0].close;
            var netChange = response.results[0].netChange;
            var percentChange = response.results[0].percentChange;
            var volume = response.results[0].volume;

            if (close === 0) {
              var close = "closes 5pm est";
            }
            else {
              var close = "$" + close;
            };

            var stock_title_div = $("<div>").addClass("stock-title");
            var stock_title = $(stock_title_div).html("Company: " + name + " (" + symbol + ") ");


            var stock_data_div = $("<div>").addClass("stock-data");
            var stock_data = $(stock_data_div).html("Exchange: " + " (" + exchange + ") " + "<br/>"
              + "Current Price: $" + last + "  |  Volume: $" + volume + "<br/>"
              + "Open: $" + open + "  |   Close: " + close + "<br/>"
              + "Change($): $" + netChange + "  |   Change(%): " + percentChange + "%")

            var message = " Calculating..."
            var evenArrow = $("<img src='https://img.ifcdn.com/images/a1e0be1883a6d485900c9d70b3c2e1174275a2ca8437e75182a1ef6c19931f09_1.jpg'>")
            $(evenArrow).attr({height: "50", width: "50", border: "5"})
            var calculating = $(arrowDiv).html(evenArrow)
            var calculating = $(arrowDiv).append(message)

            $("#stockInfo").append(calculating);
            $("#stockInfo").append(stock_title);
            $("#stockInfo").append(stock_data);
          });

          var apiKey = "api/5b12c8b5120a5684"
          var state = snap.val().state;
          var city = snap.val().city;
          var queryURL = "https://api.wunderground.com/" + apiKey + "/conditions/q/" + state + "/" + city + ".json"

          $.ajax({
            url: queryURL,
            method: "GET"
          }).done(function(response) {
            console.log(response);

            var temp_f = response.current_observation.temp_f;
            var feelslike_f = response.current_observation.feelslike_f;
            var wind_mph = response.current_observation.wind_mph;
            var relative_humidity = response.current_observation.relative_humidity;
            var weather = response.current_observation.weather;
            var precip_today_string = response.current_observation.precip_today_string;
            var city = response.current_observation.display_location.city;
            var state_name = response.current_observation.display_location.state_name;
            var state = response.current_observation.display_location.state;
            var country = response.current_observation.display_location.country;
            var elevation = response.current_observation.display_location.elevation;

            var weather_title_div = $("<div>").addClass("weather-title")
            var weather_title = $(weather_title_div).html(city + ", " + state_name + " (" + state + ") " + country + " (" + temp_f + " f)" + "<br/>")

            var opening_div = $("<div>").addClass("opening");
            var weather_opening = $(opening_div).html("Wow! Looks like it's a " + weather + " day in " + city + ". That wild wind's a whistlin' at " + wind_mph + "MPH. " + "<br/>" + "How about a drum roll for precipitation... It's rained " + precip_today_string + " today!!! Wow." + "<br/>" + "Check out the some other statistics below:" + "<br/>");

            var statistics_div = $("<div>").addClass("statistics");
            var weather_statistics = $(statistics_div).html(
              "Temperature: " + temp_f + "  | Feels Like: " + feelslike_f + " f" + "<br/>" +
              "Wind Speed: " + wind_mph + " mph" + "  | Rain Today: " + precip_today_string + "<br/>" +
              "Humidity: " + relative_humidity + "  | Elevation: " + elevation + " ft");

            $("#weatherInfo").append(weather_title);
            $("#weatherInfo").append(weather_opening);
            $("#weatherInfo").append(weather_statistics);
          });

          arrow();

          var authKey = "8b5829de8d0d4d038ab015d4d89a435d";
          var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=" +
          authKey + "&q=" + news;
          //AJAX function
          $.ajax({
           url: queryURL,
           method: "GET"
          }).done(function(NYTData) {

            var article = NYTData.response.docs[Math.floor(Math.random()*NYTData.response.docs.length)]
            console.log(article)

            var author = "";
            var headline = "";
            var lead_paragraph = article.lead_paragraph;
            var copyright = NYTData.copyright;
            var wordcount = article.word_count;
            var section = article.section_name;
            var url = article.web_url;
            var pub_date_raw = article.pub_date;
            var pub_date = ""

            //This function splits the string into 2 arrays only printing the first to make it prettier. Yes, attention to detail is key. Just spent and hour learnign to do that... wow makes you think about the signifagance of life.
            function splitString(stringToSplit, separator) {
              var arrayOfStrings = stringToSplit.split(separator);
              pub_date = arrayOfStrings[0];
            };

            // *** BROKENISH *** various if statement to make sure theres not void posting *** BROKENISH ***
            if (article.headline === "null") {
              headline = "Untitled";
            }
            else {
              headline = article.headline.main;
            }
            if (article.byline && article.byline.original) {
              author = article.byline.original;
            }
            else {
              var author = "Anonymous";
            }
            if (article.pub_date === "null") {
              pub_date = "Unknown";
            }
            else {
              splitString(pub_date_raw, "T");
            }
            console.log("head: " + headline + " | author: " + author)

            // build the divs lol
            var news_title_div = $("<div>").addClass("news-title");
            var news_title = $(news_title_div).html("<bold>" + headline + "<br/>" + author + "<br/>Section: " + section + "</bold>");

            var news_data_div = $("<div>").addClass("news-data");
            var news_data = $(news_data_div).html(lead_paragraph + "<br/>" + "Published: " + pub_date + "<br/>Wordcount: " + wordcount)

            var articleButton = $("<button>Visit Article</button>").addClass("article-button");
            var a = $(articleButton).append("<a href='" + url + "'>")

            // fill the divs
            $("#News").append(news_title);
            $("#News").append(news_data);
            $("#News").append(articleButton);

            // click the dumb button, get to the dumb link!
            $(".article-button").on("click", function(event) {
              window.location.href=url
            });
          });
        });
      });

      $("#signin-button").on("click", function(event) {
        event.preventDefault();

        window.location.href="file:///Users/Luca/Documents/project1ucla/ProjectOne_Account_JS.html"
      });

      // This populates the info div with searched stock, as well as clearing the inputs from prior searched stocks if the user wants to learn about another asset
      $("#add-stock").on("click", function(event) {
        event.preventDefault();

        stock = $("#stock-input").val().trim().toUpperCase();
        var queryURL = "https://crossorigin.me/http://marketdata.websol.barchart.com/getQuote.json?key=3a7c2bc136b9027743e077f17c788f0c&symbols=" + stock;

        $.ajax({
          url: queryURL,
          method: "GET"
        }).done(function(response) {
          console.log(response);

          var name = response.results[0].name;
          var symbol = response.results[0].symbol;
          var exchange = response.results[0].exchange;
          var last = response.results[0].lastPrice;
          basePrice = response.results[0].lastPrice;
          var open = response.results[0].open;
          var close = response.results[0].close;
          var netChange = response.results[0].netChange;
          var percentChange = response.results[0].percentChange;
          var volume = response.results[0].volume;

          var stock_title_div = $("<div>").addClass("stock-title");
          var stock_title = $(stock_title_div).html("Company: " + name + " (" + symbol + ") ");


          var stock_data_div = $("<div>").addClass("stock-data");
          var stock_data = $(stock_data_div).html("Exchange: " + " (" + exchange + ") " + "<br/>"
            + "Current Price: $" + last + "  |  Volume: $" + volume + "<br/>"
            + "Open: $" + open + "  |   Close: $" + close + "<br/>"
            + "Change($): $" + netChange + "  |   Change(%): " + percentChange + "%")

          var message = " Calculating..."
          var evenArrow = $("<img src='https://img.ifcdn.com/images/a1e0be1883a6d485900c9d70b3c2e1174275a2ca8437e75182a1ef6c19931f09_1.jpg'>")
          $(evenArrow).attr({height: "50", width: "50", border: "5"})
          var calculating = $(arrowDiv).html(evenArrow)
          var calculating = $(arrowDiv).append(message)

          $("#stockInfo").empty();

          $("#stockInfo").append(calculating);
          $("#stockInfo").append(stock_title);
          $("#stockInfo").append(stock_data);

          $("#stock-input").val("");

        });
      });

      // prevents arrow() from continously calling and blowing our api limit
      var value = 1

      // This function stores the price of the searched asset upon page load, then compare it to a current price value pulled every 15 seconds. Has a 'calculating' look while it works to pull data. deletes itself before repopulating.

      function arrow(){
        console.log("arrow pt 1")
        var queryURL = "https://crossorigin.me/http://marketdata.websol.barchart.com/getQuote.json?key=3a7c2bc136b9027743e077f17c788f0c&symbols=" + stock;

        if (value === 1){

              $.ajax({
              url: queryURL,
              method: "GET"
              }).done(function(response) {
                console.log("arrow pt 3")
                var currentPrice = response.results[0].lastPrice;
                console.log("current price: " + currentPrice)
                $(arrowDiv).empty();


              if (basePrice > currentPrice) {
                var down = "-" + (100 - ((currentPrice / basePrice) * 100)) + "% change since watching";
                console.log(down);

                var arrowDiv = $("<div>")
                var downArrow = $("<img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJcgQbeyJemrpdzM5Md8LZrnQPnNAj26vVi52x6Tnw7-ZYlh6u'>")
                var coolDownArrow = $(downArrow).attr({height: "50", width: "50"})
                var arrow = $(arrowDiv).html(downArrow)
                var arrow = $(arrowDiv).append(down)
                $("#stockInfo").append(arrow);
              }

              else if (basePrice < currentPrice) {
                var up = "+" + (100 - ((basePrice / currentPrice) * 100)) + "% change since watching"
                console.log(up)

                var arrowDiv = $("<div>")
                var upArrow = $("<img src='https://www.top13.net/wp-content/uploads/2015/04/smiling-puppy-3.jpg'>")
                var coolUpArrow = $(upArrow).attr({height: "50", width: "50"})
                var arrow = $(arrowDiv).html(upArrow)
                var arrow = $(arrowDiv).append(down)
                $("#stockInfo").append(arrow);
              }

              else if (basePrice === currentPrice) {
                var even = "0% change since watching"
                console.log("Even")

                var arrowDiv = $("<div>")
                var evenArrow = $("<img src='https://img.ifcdn.com/images/a1e0be1883a6d485900c9d70b3c2e1174275a2ca8437e75182a1ef6c19931f09_1.jpg'>")
                var coolEvenArrow = $(evenArrow).attr({height: "50", width: "50", border: "5"})
                var arrow = $(arrowDiv).html(evenArrow)
                var arrow = $(arrowDiv).append(even)
                $("#stockInfo").append(arrow);
              }

              else {
                console.log("error")
              };

              console.log("arrow pt 4")
              value = 0
              return;
          });
        }
        else {
          return;
        };
      };

      // adds the weather bull
      $("#add-weathers").on("click", function(event) {
        event.preventDefault()

        $("#weatherInfo").empty();

        var apiKey = "api/5b12c8b5120a5684"
        var state = $("#state-input").val().trim().toUpperCase()
        var city = $("#city-input").val().trim().toUpperCase()
        var queryURL = "https://api.wunderground.com/" + apiKey + "/conditions/q/" + state + "/" + city + ".json"

        $.ajax({
          url: queryURL,
          method: "GET"
        }).done(function(response) {
          console.log(response);

          var temp_f = response.current_observation.temp_f;
          var feelslike_f = response.current_observation.feelslike_f;
          var wind_mph = response.current_observation.wind_mph;
          var relative_humidity = response.current_observation.relative_humidity;
          var weather = response.current_observation.weather;
          var precip_today_string = response.current_observation.precip_today_string;
          var city = response.current_observation.display_location.city;
          var state_name = response.current_observation.display_location.state_name;
          var state = response.current_observation.display_location.state;
          var country = response.current_observation.display_location.country;
          var elevation = response.current_observation.display_location.elevation;

          var weather_title_div = $("<div>").addClass("weather-title")
          var weather_title = $(weather_title_div).html(city + ", " + state_name + " (" + state + ") " + country + " (" + temp_f + " f)" + "<br/>")

          var opening_div = $("<div>").addClass("opening");
          var weather_opening = $(opening_div).html("Wow! Looks like it's a " + weather + " day in " + city + ". That wild wind's a whistlin' at " + wind_mph + "MPH. " + "<br/>" + "How about a drum roll for precipitation... It's rained " + precip_today_string + " today!!! Wow." + "<br/>" + "Check out the some other statistics below:" + "<br/>");

          var statistics_div = $("<div>").addClass("statistics");
          var weather_statistics = $(statistics_div).html(
            "Temperature: " + temp_f + "  | Feels Like: " + feelslike_f + " f" + "<br/>" +
            "Wind Speed: " + wind_mph + " mph" + "  | Rain Today: " + precip_today_string + "<br/>" +
            "Humidity: " + relative_humidity + "  | Elevation: " + elevation + " ft");

          $("#weatherInfo").append(weather_title);
          $("#weatherInfo").append(weather_opening);
          $("#weatherInfo").append(weather_statistics);

          $("#city-input").val("");
          $("#state-input").val("");
        });
      });

      // you already know, adds the news
      $("#add-news").on("click", function(event) {
        var authKey = "8b5829de8d0d4d038ab015d4d89a435d";
        var query = $("#news-input").val().trim();
        var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=" +
        authKey + "&q=" + query;
        //AJAX function
        $.ajax({
         url: queryURL,
         method: "GET"
        }).done(function(NYTData) {

          var article = NYTData.response.docs[Math.floor(Math.random()*NYTData.response.docs.length)]
          console.log(article)

          var author = "";
          var headline = "";
          var lead_paragraph = article.lead_paragraph;
          var copyright = NYTData.copyright;
          var wordcount = article.word_count;
          var section = article.section_name;
          var url = article.web_url;
          var pub_date_raw = article.pub_date;
          var pub_date = ""

          //This function splits the string into 2 arrays only printing the first to make it prettier. Yes, attention to detail is key. Just spent and hour learnign to do that... wow makes you think about the signifagance of life.
          function splitString(stringToSplit, separator) {
            var arrayOfStrings = stringToSplit.split(separator);
            pub_date = arrayOfStrings[0];
          };

          // various if statement to make sure theres not void posting
          if (article.headline === "null") {
            headline = "Untitled";
          }
          else {
            headline = article.headline.main;
          }
          if (article.byline && article.byline.original) {
            author = article.byline.original;
          }
          else {
            var author = "Anonymous";
          }
          if (article.pub_date === "null") {
            pub_date = "Unknown";
          }
          else {
            splitString(pub_date_raw, "T");
          }
          console.log("head: " + headline + "author: " + author)
          // build the divs lol
          var news_title_div = $("<div>").addClass("news-title");
          var news_title = $(news_title_div).html("<bold>" + headline + "<br/>" + author + "<br/>Section: " + section + "</bold>");

          var news_data_div = $("<div>").addClass("news-data");
          var news_data = $(news_data_div).html(lead_paragraph + "<br/>" + "Published: " + pub_date + "<br/>Wordcount: " + wordcount)

          var articleButton = $("<button>Visit Article</button>").addClass("article-button");
          var a = $(articleButton).append("<a href='" + url + "'>")

          // clear the divs lmao
          $("#News").empty();

          // fill the divs
          $("#News").append(news_title);
          $("#News").append(news_data);
          $("#News").append(articleButton);

          // clear the inputs haha
          $("#news-input").val("");

          // click the dumb button, get to the dumb link!
          $(".article-button").on("click", function(event) {
            window.location.href=url
          });
        });
      });
    });
