import request from 'superagent'
import { Token } from '../models'
import { getEndpoint } from '../utils/yelpApi'
import yelpApi from '../yelpApi.json'
import { setTerm } from './cache'

export const attachToken = (req, res, next) =>
  Token
    .getUpdatedToken(Date.now()) // + 600000000000)
    .then((token) => {
      req.token = token
      next()
    })
    .catch((err) => next(err))

export const searchBusinesses = (req, res, next) => 
  request
    .get(yelpApi.endpoint + yelpApi.path.search)
    .set('Authorization', req.token.typedValue)
    .query({ location: req.query.location })
    .end((err, resp) => {
      if (err || resp.body.error) {
        return next(err || resp.body.error)
      }
      res.json(resp.body.businesses)
    })

export const attachBusinesses = (req, res, next) => {
  if (req.query.location === '') {
    req.state = req.state || {}
    req.state.businesses = []
    return next()
  }
  request
    .get(yelpApi.endpoint + yelpApi.path.search)
    .set('Authorization', req.token.typedValue)
    .query({ location: req.query.location })
    .end((err, resp) => {
      console.log(resp.body)
      if (err || resp.body.error || resp.body.total < 1) {
        // Delete erroneous bad terms from cache
        setTerm(req.sessionID, undefined)
        return next(err || resp.body.error)
      }
      req.state = req.state || {}
      req.state.businesses = resp.body.businesses
      next()
    })
}

export const attachBusiness = (req, res, next) => {
  const id = req.body.business
  request
    .get(yelpApi.endpoint + yelpApi.path.business + '/' + id)
    .set('Authorization', req.token.typedValue)
    .then((resp) => {
      req.state = req.state || {}
      req.state.businesses = [resp.body]
      next()
    })
    .catch(next)
}

export const returnBusiness = (req, res, next) => {
  if (req.state.businesses) {
    return res.json(req.state.businesses[0])
  }
  next(new Error('No businesses at search endpoint'))
}

export const returnBusinesses = (req, res, next) => {
  if (req.state.businesses) {
    return res.json(req.state.businesses)
  }
  next(new Error('No businesses at search endpoint'))
}
