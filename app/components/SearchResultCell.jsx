import React from 'react'
import Link from './Link'
import CheckInButton from './CheckInButton'

const renderDistance = (distance) => {
  if (distance < 100) {
    return '<100m'
  } else if (distance < 1000) {
    return Math.round(distance / 100) + '00m'
  } else {
    return (distance / 1000).toFixed(1) + 'km'
  }
}

const renderCheckins = (checkins) => {
  if (checkins === 1) {
    return '1 check-in'
  } else {
    return `${checkins} check-ins`
  }
}

const renderStars = (stars) => {
  if (stars === 1) {
    return '1 star'
  } else {
    return `${stars} stars`
  }
}

export default ({
  image_url,
  name,
  url,
  rating,
  onCheckin,
  isCheckedIn,
  checkins,
  location,
  is_closed,
  distance,
  categories,
}) => (
  <div className='search-result-cell'>
    <Link to={url}>
      <img
        src={image_url}
        className='image is-128x128 thumbnail'
      />
      <CheckInButton
        onClick={onCheckin}
        isCheckedIn={isCheckedIn}
      >
        {isCheckedIn ? '✓' : '✕'} Going
      </CheckInButton>
    </Link>
    <div
      className='search-result-content'
    >
      <Link to={url}>
        <h2 className='search-result-title'>{name}</h2>
        <p>{
          renderCheckins(checkins)
        }. {
          renderStars(rating)
        }. {
          is_closed ? 'Closed' : 'Open now'
        }. {
          renderDistance(distance)
        }.</p>
        <p>{location.address1}, {location.city}</p>
        <p>{categories.map((c) => c.title).join(', ')}</p>
        <img
          className='attribution'
          src='/img/Yelp_trademark_RGB_outline.png'
        />
      </Link>
    </div>
  </div>
)
