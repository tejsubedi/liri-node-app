require("dotenv").config();

var keys = require("./keys.js");
var axios = require("axios");
var command = process.argv[2];
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);


axios.get("http://www.omdbapi.com/?t=remember+the+titans&y=&plot=short&apikey=trilogy").then(
  function(response) {
    // Then we print out the imdbRating
    console.log("The movie's rating is: " + response.data.imdbRating);
  }
);

function concertThis(artist) {
    var queryURL = "https://rest.bandsintown.com/artists/" + "khalid" + "/events?app_id=codingbootcamp";

    axios.get(queryURL).then(function(response) {
        console.log(response.data);
    })
}


function spotifyThisSong(song) {
    var artist = process.argv[3];
}

spotify.search({ type: 'track', query: 'All the Small Things' }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
   
  console.log(data); 
  });