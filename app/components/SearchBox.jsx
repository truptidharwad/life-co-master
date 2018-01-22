import React from 'react'

export default ({ searchTerm, onChange, onSubmit, searchboxRef }) => (
  <form onSubmit={onSubmit} className='nav-item search-container'>
    <input
      type='search'
      placeholder={(!!searchTerm) ? '' : 'Location'}
      value={searchTerm}
      onChange={onChange}
      ref={searchboxRef}
      className='search-box'
    />
    <button
      type='submit'
      className='search-button'
    >
      Search
    </button>
  </form>
)
