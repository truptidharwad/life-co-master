import { Router } from 'express'
import passport from 'passport'
import { cacheSearch } from '../controllers/cache'

const auth = Router()

auth.get('/twitter', cacheSearch, passport.authenticate('twitter'))

auth.get('/twitter/callback', 
  passport.authenticate('twitter', {failureRedirect: '/'}),
  (req, res) => res.redirect('/')
)

export default auth
