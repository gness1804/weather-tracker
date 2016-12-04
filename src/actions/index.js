import axios from 'axios'
import moment from 'moment'

const API_KEY = 'APPID=7b05601290f3c029e2162277fc5b288d'

export const receiveLocation = (position) => {
  return {
    type: 'RECEIVE_LOCATION',
    completed: false,
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  }
}

export const receiveForecast = (json) => {
  return {
    type: 'RECEIVE_FORECAST',
    location: json.data.name,
    temp: json.data.main.temp,
    weatherType: json.data.weather[0].main,
  }
}

export const receiveForecastByZip = (json) => {
  return {
    type: 'RECEIVE_FORECAST_ZIP',
    location: json.data.name,
    temp: json.data.main.temp,
    weatherType: json.data.weather[0].main,
  }
}

export const modifyFiveDay = (json) => {
  const todaysDate = moment().format('MM-DD-YYYY').toString().split('-')
  const today = `${todaysDate[2]}-${todaysDate[0]}-${todaysDate[1]}`
  const splitDates = json.data.list.forEach((day) => {
    day.dt_txt = day.dt_txt.split(' ')[0]
  })
  console.log(splitDates)
  console.log(json)
  return {
    word: 'hello',
  }
}


export const receiveFiveDayForecast = (json) => {
  return {
    type: 'RECEIVE_FIVEDAY_FORECAST',
    data: modifyFiveDay(json),
  }
}

export const updateLocation = (position) => {
  return (dispatch) => {
    return dispatch(receiveLocation(position))
  }
}

export const fetchForecast = (position) => {
  return (dispatch) => {
    return axios.get(`
      http://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&${API_KEY}
    `)
      .then(json => {
        dispatch(receiveForecast(json))
      })
      .catch(error => console.error('Error with api call...', error.message))
  }
}
export const fetchFiveDay = (city) => {
  return (dispatch) => {
    return axios.get(`
      http://api.openweathermap.org/data/2.5/forecast?q=${city},us&${API_KEY}
      `)
      .then(json => {
        dispatch(receiveFiveDayForecast(json))
      })
      .catch(error => console.error('Error with api call...', error.message))
  }
}
export const fetchForecastByZip = (zip) => {
  return (dispatch) => {
    return axios.get(`
    http://api.openweathermap.org/data/2.5/weather?zip=${zip},us&${API_KEY}
    `)
      .then(json => {
        dispatch(receiveForecastByZip(json))
        return json
      })
      .then(json => {
        dispatch(fetchFiveDay(json.data.name))
      })
      .catch(error => console.error('Error with api call...', error.message))
  }
}
