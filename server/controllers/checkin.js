import { CheckIn } from '../models'

//
// Helpers
//

const calculateCutoff = (date) => {
  if (typeof date !== 'object') {
    date = new Date(date)
  }
  const cutoffMs = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  return new Date(cutoffMs)
}

const countCheckins = (checkins) => {
  if (!checkins) {
    return {}
  } else if (!('length' in checkins)) {
    const count = {}
    count[checkins.business] = 1
    return count 
  }
  return checkins.reduce((count, checkin) => {
    count[checkin.business] = count[checkin.business] + 1 || 1
    return count
  }, {})
}

const countUserCheckins = (checkins, username) => {
  if (!username || !checkins) {
    return {}
  } else if (!('length' in checkins)) {
    const count = {}
    if (checkins.username === username) {
      count[checkins.business] = 1
    }
    return count
  }
  return checkins.reduce((count, checkin) => {
    if (checkin.username === username) {
      count[checkin.business] = username
    }
    return count
  }, {})
}

//
// Middlewares
//

export const validateParams = (req, res, next) => {
  if (!(req.user && req.user.username)) {
    res.json({error: 'Missing username'})
  } else if (!req.body.business) {
    res.json({error: 'Missing business ID'})
  } else {
    next()
  }
}

export const isNotCheckedIn = (req, res, next) => {
  const lastNight = calculateCutoff(new Date())
  CheckIn
    .findOne({
      where: {
        username: req.user.username,
        business: req.body.business,
        createdAt: { $gte: lastNight },
      },
    })
    .then((checkin) => {
      if (!!checkin) {
        return res.json({
          error: 'Already checked in'
        })
      }
      next()
    })
    .catch(next)
}

export const isCheckedIn = (req, res, next) => {
  const lastNight = calculateCutoff(new Date())
  CheckIn
    .findOne({
      where: {
        username: req.user.username,
        business: req.body.business,
        createdAt: { gte: lastNight },
      },
    })
    .then((checkin) => {
      if (!checkin) {
        return res.json({
          error: 'Is not checked in'
        })
      }
      next()
    })
    .catch(next)
}

export const attachCheckins = (req, res, next) => {
  // get all checkins that match
  // - business ID range
  // - gte last night
  // -> Attach checkins (count)
  // determine business where user is checked in
  // -> Attach isCheckedIn
  CheckIn
    .findAll({
      where: {
        business: { $in: req.state.businesses.map((b) => b.id) },
        createdAt: { $gte: calculateCutoff(new Date()) },
      },
    })
    .then((checkins) => {
      const count = countCheckins(checkins)
      const isUserCheckedin = countUserCheckins(checkins, req.user && req.user.username)
      req.state.businesses = req.state.businesses.map((business) => {
        business.checkins = count[business.id] || 0
        business.isCheckedIn = !!isUserCheckedin[business.id]
        return business
      })
      next()
    })
}

//
// Endpoints
//

export const postCheckIn = (req, res, next) => {
  CheckIn
    .create({
      username: req.user.username,
      business: req.body.business,
    })
    .then((checkin) => {
      next()
    })
    .catch(next)
}

export const cancelCheckIn = (req, res, next) => {
  const lastNight = calculateCutoff(new Date())
  CheckIn
    .find({
      where: {
        username: req.user.username,
        business: req.body.business,
        createdAt: { $gte: lastNight },
      },
    })
    .then((checkin) => {
      checkin.destroy()
      next()
    })
    .catch(next)
}
