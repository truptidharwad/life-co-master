import express from 'express'
import request from 'superagent'
import { attachToken, attachBusinesses, returnBusinesses, attachBusiness, returnBusiness } from '../controllers/yelp'
import { attachCheckins, validateParams, isNotCheckedIn, isCheckedIn, postCheckIn, cancelCheckIn } from '../controllers/checkin'
import { isAuthenticated } from '../controllers/auth'
import { cacheSearch } from '../controllers/cache'

const api = express.Router()

api.get('/search', cacheSearch, attachToken, attachBusinesses, attachCheckins, returnBusinesses)

const getAndReturnBiz = [attachToken, attachBusiness, attachCheckins, returnBusiness] 

api.route('/checkin')
  .post(isAuthenticated, validateParams, isNotCheckedIn, postCheckIn, getAndReturnBiz)
  .delete(isAuthenticated, validateParams, isCheckedIn, cancelCheckIn, getAndReturnBiz)

export default api
