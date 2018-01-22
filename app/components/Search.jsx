import React from 'react'
import SearchBox from './SearchBox'
import Link from './Link'

const scrollToTop = () => {
  window.scrollTo(0, 0)
}

const Search = ({
  isLoading, 
  searchResults, 
  searchboxRef, 
  searchTerm, 
  onChange, 
  onSubmit, 
  children
}) => (
  <div>
    <div className='nav'>
      <div className='nav-left'>
        <h1 className='logotype nav-item'>Life Co.</h1>
        <SearchBox
          { ...{
            onSubmit,
            onChange,
            searchTerm,
            searchboxRef,
          }}
        />
      </div>
    </div>
    <div className='search-results section'>
      <p
        className='search-results-info'
        style={{opacity: (searchResults.length < 1 && !isLoading) ? '0.5' : '1.0'}}
      >Search Results {
        isLoading && '(Loading...)' ||
        searchResults && `(${searchResults.length})`
      }</p>
      {
        children
      }
    </div>
    { searchResults.length > 1 && (
      <div className='footer'>
        <button onClick={scrollToTop}>
          Back to top.
        </button> <Link to='https://github.com/mtso'>
          Designed and built by Matthew Tso.
        </Link> <Link to='https://github.com/mtso/life-co'>
          View full source.
        </Link>
      </div>
    )}
  </div>
)

export default Search
