let sunSetTime;

fetch("https://api.sunrisesunset.io/json?lat=40.707765&lng=-73.806755")
    .then(response =>  response.json())
    .then(data => {
        sunSetTime = data.results.sunset;
        console.log(sunSetTime);
        let sunset = document.getElementById('areddDot');
        sunset.textContent = sunSetTime;
    })
    .catch(error => console.error(error));