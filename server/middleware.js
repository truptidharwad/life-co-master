import path from 'path'
import bodyParser from 'body-parser'
import session from 'express-session'
import express from 'express'
import logger from 'morgan'
import helmet from 'helmet'
import passport from 'passport'
import { Strategy as TwitterStrategy } from 'passport-twitter'

const twitterStrategy = new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: process.env.HOSTNAME + '/auth/twitter/callback',
}, (token, tokenSecret, profile, done) => 
  done(null, {username: profile.username})
)

passport.serializeUser((user, cb) => cb(null, user))
passport.deserializeUser((obj, cb) => cb(null, obj))
passport.use(twitterStrategy)

const middleware = [
  logger('combined'),
  session({
    name: 'sessionId',
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  }),
  passport.initialize(),
  passport.session(),
  bodyParser.json(),
  bodyParser.urlencoded({extended: true}),
  helmet(),
  express.static(path.resolve(__dirname, '..', 'dist')),
]

export default middleware
