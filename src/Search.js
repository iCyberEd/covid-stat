import React, {useState} from 'react'
import magnifier from './magnifier.svg'

export default function Search({filterByCountry}) {

  const [searchState, setsearchState] = useState("")

  return (
    <div className='search'>
      <input type="text" name="" id="" className='search__line' placeholder='Search...' onInput={ e => setsearchState(e.target.value) } value={searchState} />
      <button className='search__button' onClick={ (e) => filterByCountry(searchState) }>
        <img src={magnifier} alt="magnifier" />
      </button>
    </div>
  )
}
