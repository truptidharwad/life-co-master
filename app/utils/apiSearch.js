import request from 'superagent'

export const searchBusinesses = (searchTerm) => {
  return request
    .get('/api/search')
    .query({ location: searchTerm })
}
