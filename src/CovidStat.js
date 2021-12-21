import React, {useState, useEffect, useCallback} from 'react'
import Country from './Country';
import logo from './logo.png'
import loading from './loading.svg'
import Search from './Search';

// TODO Add click outside modal window
// TODO add total stats to the end or top of the list

const rawData = []

function CovidStat() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false)
  const [covidData, setCovidData] = useState([])
  const [covidElements, setCovidElements] = useState([])
  const [countryModal, setCountryModal] = useState(false)
  const [countryData, setCountryData] = useState({})
  const [sortOrder, setSortOrder] = useState({Country: "ascend"})

  const toggleModal = useCallback(() => {
    setCountryModal(!countryModal)
    document.body.style.overflow = document.body.style.overflow === "hidden" ? "visible" : "hidden"
  }, [countryModal])
  
  useEffect(() => {
    console.log("useEffect initiation");
    setTimeout(() => {
    fetch('https://api.covid19api.com/summary')
      .then( response => response.json() )
      .then( json => {
        console.log(json)

        // catching error: when page not found covid19api returns json
        if (json.message) {
          throw json
        }

        let countriesArr = json.Countries.map( (country, ind) => {
          country.id = ind + 1
          return country
        })

        rawData.push(...countriesArr)
        Object.freeze(rawData)
        setIsLoaded(true)
        setCovidData([...countriesArr])
      })
      .catch((error) => {
        console.dir(error)
        setIsLoaded(true)
        setError(error)
      })
    }, 3000);
  }, [])

  useEffect(() => {
    const countryClick = (country) => {
      setCountryData(country)
      toggleModal()
    }

    console.log("useEffect covidData");
    let isAscend = Object.values(sortOrder)[0] === "ascend"
    let countriesArrEl = covidData.map( (country, ind) => {
      return (<li key={country.id} className='country-list__element' onClick={ () => countryClick(country) }>
        <div className="country-list__element__index">{isAscend ? ind + 1 : covidData.length - ind}</div>
        <div className="country">{country.Country}</div>
        <div className="TotalConfirmed">{country.TotalConfirmed}</div>
      </li>)
    })
    setCovidElements([...countriesArrEl])
  }, [covidData, sortOrder, toggleModal])


  function covidTableSort(headerName) {
    let dataCopy = [...covidData]
    let newSortType = undefined // set 1 to ascend, -1 to descend

    if ( sortOrder.hasOwnProperty(headerName) ) {
      // flip the value if sorted by the same value the previous time
      newSortType = sortOrder[headerName] === "ascend" ? -1 : 1
    } else {
      if (headerName === "id" || headerName === "Country") {
        newSortType = 1
      } else {
        newSortType = -1
      }
    }

    dataCopy.sort( (firstEl, secondEl) => {
      let sameType = typeof firstEl[headerName] === typeof secondEl[headerName]
      let elType = sameType && typeof firstEl[headerName]
      console.log(elType);
      if (elType === "number") {
        return (firstEl[headerName] - secondEl[headerName]) * newSortType
      } else {
        return (firstEl[headerName].localeCompare(secondEl[headerName])) * newSortType
      }
    })
    let obj = {}
    obj[headerName] = newSortType === 1 ? "ascend" : "descend"
    setSortOrder({...obj})
    setCovidData([...dataCopy])
  }

  function filterByCountry(countryName) {
    const searchInput = countryName.toLowerCase()
    let result = rawData.filter( (el) => {
      const countryName = el.Country.toLowerCase()
      return countryName.includes(searchInput)
    })
    setCovidData([...result])
  }

  function getHeaderClass(headerClass) {
    let thisClassName = "country-list__header"

    if (sortOrder.hasOwnProperty(headerClass)) {
      thisClassName += sortOrder[headerClass] === "ascend" ? " ascending" : " descending"
    }
    return thisClassName
  }

  function renderingLoadingState() {
    if (error) {
      return <div className='error'>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <div className="loading">
        <div>Loading...</div>
        <div><img src={loading} alt="loading" /></div>
      </div>
    } else {
      return (
      <ul className='country-list'>
        <li className='country-list__headers'>
          <div className='country-list__element__index'>№</div>
          <div className={getHeaderClass("Country")} onClick={ () => covidTableSort("Country") }>Country</div>
          <div className={getHeaderClass("TotalConfirmed")} onClick={ () => covidTableSort("TotalConfirmed") }>Total confirmed</div>
        </li>
        {covidElements}
      </ul>
      )
    }
  }

  return (
    <>
      <div className={countryModal ? "main-wrapper__modal" : "main-wrapper"}>
        <header>
          <a href="/" className='homepage-link'>
            <img src={logo} alt="covid19statistic.com" className='logo'></img>
            <h1 className='title'>STATISTIC</h1>
          </a>
          <Search filterByCountry={filterByCountry.bind(this)} />
        </header>
        {renderingLoadingState()}
      </div>

      {countryModal && <Country countryData={countryData} toggleModal={toggleModal.bind(this)} />}
    </>
  );
}

export default CovidStat;