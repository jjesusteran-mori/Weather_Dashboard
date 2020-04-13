let city=""; 
let forecastUrl="";
let APIkey="";
let queryurl ="";
let currenturl = "";
let citiesDiv = document.getElementById("searched_cities_container");
//start with empty array
let cities = []; 
init(); 
listClicker(); 
searchClicker(); 

//run function to pull saved cities from local storage and fill array with it
function init(){
    let saved_cities = JSON.parse(localStorage.getItem("cities"));

    if (saved_cities !== null){
        cities = saved_cities
    }   
    
    renderButtons(); 
}

//sets localstorage item to cities array 
function storeCities(){
    localStorage.setItem("cities", JSON.stringify(cities)); 
}


//render buttons for each element in cities array as a search history for user
function renderButtons(){
    citiesDiv.innerHTML = ""; 
    if(cities == null){
        return;
    }
    let unique_cities = [...new Set(cities)];
    for(let i=0; i < unique_cities.length; i++){
        let cityName = unique_cities[i]; 

        let buttonEl = document.createElement("button");
        buttonEl.textContent = cityName; 
        buttonEl.setAttribute("class", "recentSearch"); 

        citiesDiv.appendChild(buttonEl);
        listClicker();
      }
    }
//on click function for search history buttons
function listClicker(){
$(".recentSearch").on("click", function(event){
    event.preventDefault();
    city = $(this).text().trim();
    APIcalls(); 
})
}



//on click function for main search bar
function searchClicker() {
$("#searchbtn").on("click", function(event){
    event.preventDefault();
    city = $(this).prev().val().trim()
    
    //enters city into cities array 
    cities.push(city);
    //array.length max is 8 
    if(cities.length > 8){
        cities.shift()
    }
    //return early if form is blank
    if (city == ""){
        return; 
    }
    APIcalls();
    storeCities(); 
    renderButtons();
})
}

//current weather data & five-day forecast
function APIcalls(){
    
    forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=`;    
    currenturl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=`;
    APIkey = "5ce8439fd4264478d1da0b24a7cd547d";
    queryurl = forecastUrl + APIkey;
    current_weather_url = currenturl + APIkey; 
    
    $("#cityName").text("Today's Weather in " + city);
    $.ajax({
        url: queryurl,
        method: "GET",
        
    }).then(function(response){
        let day_number = 0; 
        for(let i=0; i< response.list.length; i++){
            
            //weather reports for 3pm
            if(response.list[i].dt_txt.split(" ")[1] == "15:00:00")
            {
                //if time of report is 3pm, populate text areas accordingly
                let day = response.list[i].dt_txt.split("-")[2].split(" ")[0];
                let month = response.list[i].dt_txt.split("-")[1];
                let year = response.list[i].dt_txt.split("-")[0];
                $("#" + day_number + "date").text(month + "/" + day + "/" + year);
                $("#" + day_number + "five_day_icon").attr("src", "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png") 
                let temp = Math.round(((response.list[i].main.temp - 273.15) *9/5+32));
                $("#" + day_number + "five_day_temp").text("Temp: " + temp + String.fromCharCode(176)+"F");
                $("#" + day_number + "five_day_humidity").text("Humidity: " + response.list[i].main.humidity);;
                day_number++; 
                        }   
        }
 
    });
    //display data in main div 
     $.ajax({
         url:current_weather_url,
         method: "GET", 
     }).then(function(current_data){
         console.log(current_data);
         $("#currentDayIcon").attr({"src": "http://openweathermap.org/img/w/" + current_data.weather[0].icon + ".png",
         "height": "100px", "width":"100px"});
         let temp = Math.round(((current_data.main.temp - 273.15) * 9/5 + 32))
         $("#currentDayTemp").text("Temperature: " + temp + String.fromCharCode(176)+"F");
         $("#currentDayhumidity").text("Humidity: " + current_data.main.humidity);
         $("#currentDayWindSpeed").text("Wind Speed: " + current_data.wind.speed);
          console.log(current_data)
          var latitude = current_data.coord.lat;
          var lon = current_data.coord.lon;
          function getUVidx() {
            var uvIdxUrl =`https://api.openweathermap.org/data/2.5/uvi?appid=${APIkey}&lat=${latitude}&lon=${lon}`;
            $.ajax({
              url: uvIdxUrl,
              method: 'GET'
            }).then(function(current_data) {
            $("#currentUvIndex").text("UV Index: " + current_data.value);

            //tried to chnage the color or the uv index.
            var bgcolor;
            if(current_data.value <= 3) {
                bgcolor = "green"
            }else if (current_data.value >= 3 || current_data.value <= 6) {
                bgcolor = "yellow";
            }else if (current_data.value >= 6 || current_data.value <= 8) {
                bgcolor = "orange";
            }else{
                bgcolor = "red";
            }
            $("#curerntUvIndex").attr("style", ("background-color:" + bgcolor))
            });
          }
          getUVidx();
     })


}
