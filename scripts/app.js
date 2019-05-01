const key = '&appid=f4bd28c35a4186f44a239f43bcceca95'
const metricUnits = '&units=metric'
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?'

const siteWrapper = document.querySelector('.site-wrapper')
const loader = document.querySelector('.loader')
const cityOutput = document.querySelector('#city')
const tempOutput = document.querySelector('#temperature')
const celsButton = document.querySelector('#celsius')
const fahrButton = document.querySelector('#fahrenheit')
const weatherIcon = document.querySelector('#weather-icon')
let celsActive = true

const coordinates = {
    lat:'',
    lon: '',
    currPosition: {}
}

const weather = {
    tempCel: '',
    tempFahr: '',
    city: null,
    day: true,
    icon: {
        bgSrc:'',
        iconSrc: ''
    }
}

function tempSwitcher(e) {
    if (e.target.id === 'celsius') {
        if (celsActive) return
        
        tempOutput.textContent = weather.tempCel
        fahrButton.classList.remove('temp-active')
        e.target.classList.add('temp-active')
        celsActive = true
    }

    if (e.target.id === 'fahrenheit') {
        if (!celsActive) return

        tempOutput.textContent = weather.tempFahr
        celsButton.classList.remove('temp-active')
        e.target.classList.add('temp-active')
        celsActive = false
    }

}

fahrButton.addEventListener('click' , tempSwitcher)
celsButton.addEventListener('click' , tempSwitcher)

function getCoordinates() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((coords) => {
            let strLat = coords.coords.latitude.toString().split('.')
            let strLon = coords.coords.longitude.toString().split('.')

            coordinates.lat = strLat[0] + '.' + strLat[1].slice(0,2)
            coordinates.lon = strLon[0] + '.' + strLon[1].slice(0,2)

            getWeather(coordinates)
        })
    }
}

function getWeather(coords) {
    loader.classList.add('loader-active')
    let url = baseUrl + 'lat=' + coords.lat + '&lon=' + coords.lon + metricUnits + key
    
    return fetch(url).then(
        response => {
            return response.json()
        }
    ).then((data)=>{
        let dayNight, code

        weather.tempCel = Math.round(data.main.temp)
        weather.tempFahr = Math.round(weather.tempCel * 9 / 5 + 32)
        weather.city = data.name
        dayNight = data.weather[0].icon[2]
        code = data.weather[0].icon.slice(0, data.weather[0].icon.length - 1)

        if (dayNight === 'n') {
            weather.icon.iconSrc = 'img/night/' + icons[code][0]
            weather.icon.bgSrc = 'img/' + icons[code][1]
            weather.day = false
        } else {
            weather.icon.iconSrc = 'img/' + icons[code][0]
            weather.icon.bgSrc = 'img/' + icons[code][1]
            weather.day = true
        }

    }).then(()=>{
        fillData(weather)
        loader.classList.remove('loader-active')
    }).catch(err=>console.log(err))
}


function fillData(weatherObj) {
    cityOutput.textContent = weatherObj.city
    tempOutput.textContent = weatherObj.tempCel
    weatherIcon.src = weatherObj.icon.iconSrc

    if (!weather.day){
        siteWrapper.style.backgroundImage = 'linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7) ), url(' + weather.icon.bgSrc + ')'
        weatherIcon.title = "Night"
    }

    if (weather.day) {
        siteWrapper.style.backgroundImage = 'url(' + weather.icon.bgSrc + ')'
    }
}

getCoordinates()

const icons = {
    "01": ['clear-icon.svg', 'clear.jpg'],
    "02": ['ptcloudy-icon.svg', 'ptcloudy.jpg'],
    "03": ['cloudy-icon.svg', 'cloudy.jpg'],
    "04": ['cloudy-icon.svg', 'cloudy.jpg'],
    "09": ['rain-icon.svg', 'rain.jpg'],
    "10": ['rain-icon.svg', 'rain.jpg'],
    "11": ['rain-icon.svg', 'rain.jpg'],
    "13": ['snow-icon.svg', 'snow.jpg'],
    "50": ['cloudy-icon.svg', 'cloudy.jpg']
}
