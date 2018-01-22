import path from 'path'
import request from 'superagent'
import yelpApi from '../yelpApi.json'

export const getAccessToken = (callback) => {
  request
    .post('https://api.yelp.com/oauth2/token')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send({
      client_id: process.env.YELP_CLIENT_ID,
      client_secret: process.env.YELP_CLIENT_SECRET,
    })
    .end(callback)
}

export const getEndpoint = (url) =>
  path.join(yelpApi.endpoint, yelpApi.path[url])
