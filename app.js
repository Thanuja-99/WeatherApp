    const locationInput = document.getElementById("locationInput"),
    weatherIcon = document.querySelector(".weatherIcon"),
    temperature = document.querySelector(".temperature"),
    feelslike = document.querySelector(".feelslike"),
    description = document.querySelector(".description"),
    date = document.querySelector(".date"),
    country = document.querySelector(".country"),
    city = document.querySelector(".city"),

    HValue = document.getElementById("HValue"),
    WValue = document.getElementById("WValue"),
    CValue = document.getElementById("CValue"),
    PValue = document.getElementById("PValue"),
    UVValue = document.getElementById("UVValue"),
    SRValue = document.getElementById("SRValue"),
    SSValue = document.getElementById("SSValue"),
    TempValue = document.getElementById("TempValue");

    function kelvinToCelsius(kelvin) {
        return Math.round(kelvin - 273.15);
    }
const API_KEY = "5232ad5f8d80a425ca72f627a3d73ef8";
WEATHER_API_ENDPOINT = `https://api.openweathermap.org/data/2.5/weather?appid=5232ad5f8d80a425ca72f627a3d73ef8&q=`;
//WEATHER_DATA_ENDPOINT = `https://api.openweathermap.org/data/2.5/onecall?appid=5232ad5f8d80a425ca72f627a3d73ef8&exclude=minutely&units=metric&`;
WEATHER_DATA_ENDPOINT=`https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API_KEY}`;
function findUserLocation() {

    fetch(WEATHER_API_ENDPOINT + locationInput.value).then((response) => response.json()).then((data) => {
        if(data.cod != "" && data.cod != 200){
            alert(data.message);
            return;
        }
        console.log(data);

        const options={
            weekday:"long",
            month:"long",
            day:"numeric",
            hour:"numeric",
            minute:"numeric",
            hour12:true,
        };
        date.innerHTML=getLongFormateDateTime(data.dt,data.timezone,options);

        country.innerHTML="Country : "+" "+data.sys.country;
        city.innerHTML="City : "+" "+data.name;
        weatherIcon.style.background=`url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`
        temperature.innerHTML=kelvinToCelsius(data.main.temp)+" "+"°C";
        feelslike.innerHTML="feelslike : "+kelvinToCelsius(data.main.feels_like)+" "+"°C";
        description.innerHTML=data.weather[0].description;

        HValue.innerHTML=Math.round(data.main.humidity)+"<span>%</span>";
        WValue.innerHTML=data.wind.speed+" km/h";
        CValue.innerHTML =data.clouds.all+ "<span>%</span>";
        PValue.innerHTML=data.main.pressure +" \hPa";
        UVValue.innerHTML="";

        const options1={
            hour:"numeric",
            minute:"numeric",
            hour12:true,
        };
        SRValue.innerHTML=getLongFormateDateTime(data.sys.sunrise,data.timezone,options1);
        SSValue.innerHTML=getLongFormateDateTime(data.sys.sunset,data.timezone,options1);;
        
        TempValue.innerHTML=kelvinToCelsius(data.main.temp)+"°C";


        fetch(WEATHER_DATA_ENDPOINT+`lon=${data.coord.lon}&lat=${data.coord.lat}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            temperature.innerHTML=data.main.temp;
        });

        console.log(data.daily);
        
    });
}

function formatUnixTime(dtValue, offSet, options = {}) {
    const date = new Date((dtValue + offSet) * 1000);
    return date.toLocaleTimeString([], { timeZone: "UTC", ...options });
}

function getLongFormateDateTime(dtValue, offSet, options) {
    return formatUnixTime(dtValue, offSet, options);
}

// Function to fetch UV Index based on lat/lon
function fetchUVIndex(lat, lon) {
    const uvApiUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    fetch(uvApiUrl)
        .then(response => response.json())
        .then(data => {
            UVValue.innerHTML = data.value; // Set the UV index value
        })
        .catch(error => console.error('Error fetching UV index:', error));
}

