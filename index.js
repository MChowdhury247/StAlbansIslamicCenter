const time = document.getElementById('time');
const date = document.getElementById('date');

// Function to update the current time and date
function updateTimeAndDate() {
    let now = new Date();
    let currentTime = now.toLocaleTimeString();
    let today = now.toLocaleDateString();

    time.textContent = currentTime;
    date.textContent = today;
}

// Initial call to set the time and date
updateTimeAndDate();

let sunSetTime;
let sunRiseTime;
let prayerTimes = {}; // Define prayerTimes globally

function sunset() {
    return fetch("https://api.sunrisesunset.io/json?lat=40.707765&lng=-73.806755")
        .then(response => response.json())
        .then(data => {
            sunSetTime = data.results.sunset.split(":").slice(0, 2).join(":"); // Get HH:MM
            sunRiseTime = data.results.sunrise.split(":").slice(0, 2).join(":"); // Get HH:MM
            const sunset = document.getElementById('sunset');
            sunset.innerHTML = (`Sunset: ${sunSetTime} PM <br><br> Sunrise: ${sunRiseTime} AM`);
            const maghrib = document.getElementById('maghribTime');
            maghrib.innerHTML = (`${sunSetTime} PM`);

            // Update the prayerTimes object after sunset data is fetched
            prayerTimes = {
                fajr: "5:37 AM",
                zuhr: "12:46 PM",
                asr: "04:53 PM",
                maghrib: `${sunSetTime} PM`, // Sunset time is maghrib time
                isha: "7:50 PM",
                jummah: "1:30 PM"
            };

            // Call to set the prayer times
            setPrayerTimes(prayerTimes);
        })
        .catch(error => console.error(error));
}

// Fetch sunset time and set it to Maghrib prayer time
sunset();

// Function to set the prayer times in the table
function setPrayerTimes(times) {
    document.getElementById('fajrTime').textContent = times.fajr;
    document.getElementById('zuhrTime').textContent = times.zuhr;
    document.getElementById('asrTime').textContent = times.asr;
    document.getElementById('maghribTime').textContent = times.maghrib;
    document.getElementById('ishaTime').textContent = times.isha;
    document.getElementById('jummahTime').textContent = times.jummah;

    // Set Zamat times by adding 5 minutes to each prayer time
    document.getElementById('fazrZamatTime').textContent = addMinutes(times.fajr, 5);
    document.getElementById('zuhrZamatTime').textContent = addMinutes(times.zuhr, 5);
    document.getElementById('asrZamatTime').textContent = addMinutes(times.asr, 5);
    document.getElementById('maghribZamatTime').textContent = addMinutes(times.maghrib, 5);
    document.getElementById('ishaZamatTime').textContent = addMinutes(times.isha, 5);
    document.getElementById('jummahZamatTime').textContent = addMinutes(times.jummah, 5);
}

// Helper function to add 5 minutes to a time string
function addMinutes(time, minutesToAdd) {
    let [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    
    minutes += minutesToAdd;
    if (minutes >= 60) {
        minutes -= 60;
        hours += 1;
    }

    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${minutes} ${modifier}`;
}

// Function to get the remaining time until the next prayer
function getRemainingTime() {
    const now = new Date();
    const prayerNames = ['fajr', 'zuhr', 'asr', 'maghrib', 'isha', 'jummah'];

    // Ensure prayerTimes are available
    if (Object.keys(prayerTimes).length === 0) return; // Exit if prayerTimes are not yet set

    const prayerDateTimes = prayerNames.map(prayer => {
        const today = now.toLocaleDateString();
        const timeString = `${today} ${prayerTimes[prayer]}`;
        return new Date(timeString);
    });

    for (let i = 0; i < prayerDateTimes.length; i++) {
        if (prayerDateTimes[i] > now) {
            const nextPrayer = prayerNames[i];
            const timeDiff = prayerDateTimes[i] - now;

            const hours = Math.floor(timeDiff / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

            document.getElementById('remainTime').textContent = 
                `${nextPrayer.charAt(0).toUpperCase() + nextPrayer.slice(1)} in : ${hours}h ${minutes}m ${seconds}s`;
            return;
        }
    }

    document.getElementById('remainTime').textContent = "All prayers for today are complete.";
}

// Call the remaining time function every second to update the countdown
setInterval(getRemainingTime, 1000);
setInterval(updateTimeAndDate, 1000);
