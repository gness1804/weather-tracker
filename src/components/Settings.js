import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class Settings extends Component {
  constructor() {
    super()
    this.state = {
      submitDisabled: true,
    }
  }

  disableInput() {
    this.setState({ submitDisabled: true })
  }

  recordInput(e) {
    if (e.target.value) {
      this.setState({ submitDisabled: false })
    }
  }

  render() {
    const { state, removePinnedCity, fetchForecastByZip } = this.props
    const { submitDisabled } = this.state

    let input
    const cities = state.getCurrentWeatherByZip ?
                   state.getCurrentWeatherByZip.map((city, i) => {
                     return (
                       <div key={i}>
                         <button
                           className="remove-button"
                           onClick={() => removePinnedCity(i)} // pass in id
                         >
                           X
                         </button>
                         <p className="location">{city.location}</p>
                       </div>
                     )
                   }) :
                   null

    return (
      <div className="settings-container">
        <h1 className="settings-headline">My Cities</h1>
        {cities}
        <input
          type="number"
          placeholder="Enter a zip code"
          value={input}
          ref={(node) => { input = node }}
          onChange={(e) => { this.recordInput(e) }}
        />
        <button
          onClick={(e) => {
            e.preventDefault()
            fetchForecastByZip(input.value)
            input.value = ''
            this.disableInput()
          }}
          className="add-city-button"
          disabled={submitDisabled}
        >Submit</button>
        <p className="back-to-home-link-from-settings"><Link to="/">Back to Home &raquo;</Link></p>
      </div>
    )
  }
  }


export default Settings
