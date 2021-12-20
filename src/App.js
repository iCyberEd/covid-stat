import React, {useState, useEffect} from 'react'
import './App.scss';
import Country from './Country';
import logo from './logo.png'
import Search from './Search';

// TODO Add loading icon before api loaded
// Add click outside modal window

const rawData = []

function App() {
  const [covidData, setCovidData] = useState([])
  const [covidElements, setCovidElements] = useState([])
  const [countryModal, setCountryModal] = useState(false)
  const [countryData, setCountryData] = useState({})
  // let countryData = {}
  
  useEffect(() => {
    console.log("useEffect initiation");
    fetch('https://api.covid19api.com/summary')
      .then( response => response.json() )
      .then( json => {
        console.log(json);
        let countriesArr = json.Countries.map( (country, ind) => {
          country.id = ind + 1
          return country
        })
        rawData.push(...countriesArr)
        Object.freeze(rawData)
        setCovidData([...countriesArr])
      } )
  }, [])

  useEffect(() => {
    console.log("useEffect covidData");
    let countriesArrEl = covidData.map( (country, ind) => {
      return (<li key={country.id} className='country-list__element' onClick={ () => countryClick(country) }>
        <div className="country-list__element__index">{country.id}</div>
        <div className="country">{country.Country}</div>
        {/* <div className="NewConfirmed">{country.NewConfirmed}</div> */}
        <div className="TotalConfirmed">{country.TotalConfirmed}</div>
        {/* <div className="NewDeaths">{country.NewDeaths}</div>
        <div className="TotalDeaths">{country.TotalDeaths}</div>
        <div className="NewRecoverd">{country.NewRecoverd}</div>
        <div className="TotalRecovered">{country.TotalRecovered}</div>
        <td className="Date">Date: {country.Date}</td> */}
      </li>)
    })
    setCovidElements([...countriesArrEl])
  }, [covidData])


  // TODO: make reverse sorting
  function covidTableSort(headerName) {
    let dataCopy = [...covidData]
    dataCopy.sort( (firstEl, secondEl) => {
      // console.log(firstEl[headerName]);
      if (typeof firstEl[headerName] === "string" && typeof secondEl[headerName] === "string") {
        return firstEl[headerName].localeCompare(secondEl[headerName])
      }

      if (typeof firstEl[headerName] === "number" && typeof secondEl[headerName] === "number") {
        return firstEl[headerName] - secondEl[headerName]
      }
      
      return 0
    })
    // console.log(covidData);
    setCovidData([...dataCopy])
  }

  function filterByCountry(countryName) {
    const searchInput = countryName.toLowerCase()
    console.log(rawData);
    let result = rawData.filter( (el, ind) => {
      const countryName = el.Country.toLowerCase()
      return countryName.includes(searchInput)
    })
    setCovidData([...result])
  }

  function toggleModal() {
    setCountryModal(!countryModal)
    document.body.style.overflow = document.body.style.overflow === "hidden" ? "visible" : "hidden"
  }

  function countryClick(country) {
    // countryData = country
    setCountryData(country)
    // console.log(country);
    toggleModal()
  }


  return (
    <>
      <div className={countryModal ? "main-wrapper__modal" : "main-wrapper"}>
        <header>
          <img src={logo} alt="COVID19 logo" className='logo'></img>
          <h1 className='title'>STATISTIC</h1>
          <Search filterByCountry={filterByCountry.bind(this)} />
        </header>
        
        <ul className='country-list'>
            <li className='country-list__header'>
              <div className='country-list__element__index' onClick={ () => covidTableSort("id") }>№</div>
              <div onClick={ () => covidTableSort("Country") }>Country</div>
              {/* <div onClick={ () => covidTableSort("NewConfirmed") }>New confirmed</div> */}
              <div onClick={ () => covidTableSort("TotalConfirmed") }>Total confirmed</div>
              {/* <div onClick={ () => covidTableSort("NewDeaths") }>New deaths</div>
              <div onClick={ () => covidTableSort("TotalDeaths") }>Total deaths</div>
              <div onClick={ () => covidTableSort("NewRecoverd") }>New recoverd</div>
              <div onClick={ () => covidTableSort("TotalRecovered") }>Total recovered</div> */}
            </li>
            {covidElements}
        </ul>
      </div>

      {countryModal && <Country countryData={countryData} toggleModal={toggleModal.bind(this)} />}
    </>
  );
}

export default App;
