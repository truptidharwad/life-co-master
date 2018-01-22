import request from 'superagent'
import { oauth } from '../yelpApi.json'

const getAccessToken = (callback) => {
  request
    .post(oauth)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send({
      client_id: process.env.YELP_CLIENT_ID,
      client_secret: process.env.YELP_CLIENT_SECRET,
    })
    .end(callback)
}

export default getAccessToken
