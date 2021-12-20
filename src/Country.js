import React from 'react'
import totConfirmed from './totConfirmed.svg'
import totDeaths from './totDeaths.svg'
import totRecovered from './totRecovered.svg'

export default function Country({countryData, toggleModal}) {
  console.log(countryData);
  return (
    <div className='country-modal'>
      <div className="country-modal__content">
        <h3>{countryData.Country}</h3>
        <ul className='country-modal__list'>
          <li>
            <img src={totConfirmed} alt="" srcSet="" />
            <span>Total Confirmed</span>
            <span>{countryData.TotalConfirmed}</span>
          </li>
          <li>
            <img src={totDeaths} alt="" srcSet="" />
            <span>Total Deaths</span>
            <span>{countryData.TotalDeaths}</span>
          </li>
          <li>
            <img src={totRecovered} alt="" srcSet="" />
            <span>Total Recovered</span>
            <span>{countryData.TotalRecovered}</span>
          </li>
        </ul>
        <button className='country-modal__ok' onClick={ () => toggleModal() }>OK</button>
      </div>
    </div>
  )
}
