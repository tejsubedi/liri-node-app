require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");
var command = process.argv[2];
var param = process.argv.slice(3).join(" ");
var text = command + " " + param + "\n";
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);


switch (command) {
  case "concert-this":
    // var artist = param;
    //If user's choice is to concert a song, call the function concertThis()
    concertThis(param);
    break;

  case "spotify-this-song":
    //If user's choice is to get a song details from Spotify API, call the function spotifyThisSong()
    spotifyThisSong(param);
    break;

  case "movie-this":
    //If user do not provide a command, this is the default, display the details of Mr.Nobody movie by calling getMovieDetails function
    if (param == "") {
      param = "Mr.Nobody";
      getMovieDetails(param);
    } else {

      getMovieDetails(param);
    }
    break;
    
  case "do-what-it-says":
    //if the choice is do-what-it-says, read the command from a text file and execute
    
    fs.readFile("random.txt", "utf8", function (error, data) {
      if (error) {
        return console.log(error);
      }
      //get the string from text file and split by comma
      var dataArr = data.split(",");
      //store the split elements in an array called dataArr1
      var dataArr1 = dataArr[1].slice();
      console.log(dataArr1);
      //If the first value of dataArr is movie-this, call the function getMovieDetails and pass the dataArr1 as arguement
      if (dataArr[0] == "movie-this")
        getMovieDetails(dataArr1);
      //If the first value of dataArr is concert-this, call the function concertThis and pass the dataArr1 as arguement
      if (dataArr[0] == "concert-this")
        concertThis(dataArr1);
      //If the first value of dataArr is spotify-this-song, call the function spotifyThisSong and pass the dataArr1 as arguement
      if (dataArr[0] == "spotify-this-song")
        spotifyThisSong(dataArr1);
    });
    break;

}


//Function to display the movie details from the omDB api by passing the movie name as parameter
function getMovieDetails(movieName) {

  var queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
  //Axios call to omdb API to get details like title,year,imdbrating,Country,Language,Plot and Actors
  axios.get(queryURL).then(
    function (response) {
      // console.log(response);
      var result = response.data;
      logText(result);
      console.log("Title : " + result.Title);
      console.log("Year the movie came out: " + result.Year);
      console.log("IMDB Rating: " + result.imdbRating);
      console.log("Rotten Tomatoes Rating: " + result["Ratings"][1]["Value"]);
      console.log("Country where the movie was produced: " + result.Country);
      console.log("Language: " + result.Language);
      console.log("Plot: " + result.Plot);
      console.log("Actors: " + result.Actors);
    });

}

function concertThis(artist) {
console.log("Param: ",param);

  var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

  axios.get(queryURL)
    .then(function (response) {

      var result = response.data;
      
      for (var i = 0; i < result.length; i++) {
        var dateTime = result[i]["datetime"];
        var concertDate = moment(dateTime).format("L");
        var venuDetails = result[i]["venue"];
        var nameOfVenu = venuDetails["name"];
        var country = venuDetails["country"];
        var location = venuDetails["city"];
        
      }
      console.log("Venu Details: " + nameOfVenu );
      console.log("Venu Country: " + country); 
      console.log("Venue City: " + location); 
      console.log("Concert Date: " +  concertDate);
      logText(result);

    });

};



//Function to display the details of a song from spotify API base don the song name
function spotifyThisSong(param) {
  var song = param;
  //If no song name is passed, display details for The Sign song
  if (param == "") {
    song = "The Sign";
  }
  //Pass the song name and search the spotify DB
  spotify.search({ type: 'track', query: song })
    .then(function (response) {
      var result = response.tracks.items[0];

      var artist = result.artists[0].name;
      console.log("Name of the Artist(s):" + artist);
      console.log("Name of the song:" + song);
      var songLink = result.href;
      console.log("Link to the song: " + songLink);
      var album = result.album["name"];
      console.log("Album the song is from :" + album);
      //Log the results in the text file for logging
      logText(result);
    })
    .catch(function (err) {
      console.log(err);
    });


}

//Function to log all the results of the commands in a text file
function logText(result) {
  var logText = "\n" + text + " " + "\n";
  var objectText = JSON.stringify(result);
  var finalText = logText + "\n" + objectText;
  //appendFile to append the contents and avoid overwriting
  fs.appendFile("log.txt", finalText, function (err) {

    // If an error was experienced we will log it.
    if (err) {
      console.log(err);
    }

    // If no error is experienced, we'll log the phrase "Content Added" to our node console.
    else {

      console.log("Content Added!");
    }

  });
}
