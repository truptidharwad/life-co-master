import { Router } from 'express'
import { getTerm } from '../utils/searchCache'
import { loadState, renderApp } from '../controllers/app'
import { loadSearchTerm } from '../controllers/cache'
import { attachToken, attachBusinesses } from '../controllers/yelp'
import { attachCheckins } from '../controllers/checkin'

const root = Router()

root.get('/*',
  loadSearchTerm,
  loadState,
  attachToken,
  attachBusinesses,
  attachCheckins,
  renderApp
)

export default root
