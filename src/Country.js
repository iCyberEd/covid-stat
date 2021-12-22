import React, { useCallback, useEffect } from 'react'
import totConfirmed from './totConfirmed.svg'
import totDeaths from './totDeaths.svg'
import totRecovered from './totRecovered.svg'

export default function Country({countryData, toggleModal}) {

  const closeModal = useCallback((e) => {
    e.stopPropagation()
    if (e.target.className === "country-modal" || e.target.className === "country-modal__ok") {
      toggleModal()
    }
  }, [toggleModal])

  useEffect(() => {
    document.addEventListener("click", closeModal)

    return () => {
      document.removeEventListener('click', closeModal)
    }
  }, [closeModal])

  return (
    <div className='country-modal'>
      <div className="country-modal__content">
        <h3>{countryData.Country}</h3>
        <ul className='country-modal__list'>
          <li>
            <img src={totConfirmed} alt="total confirmed" />
            <span>Total Confirmed</span>
            <span>{countryData.TotalConfirmed}</span>
          </li>
          <li>
            <img src={totDeaths} alt="total deaths" />
            <span>Total Deaths</span>
            <span>{countryData.TotalDeaths}</span>
          </li>
          <li>
            <img src={totRecovered} alt="total recovered" />
            <span>Total Recovered</span>
            <span>{countryData.TotalRecovered}</span>
          </li>
        </ul>
        <button className='country-modal__ok' onClick={ (e) => closeModal(e) }>OK</button>
      </div>
    </div>
  )
}
