const cache = {}

export const setTerm = (sessionId, term) => {
  cache[sessionId] = term
}

export const getTerm = (sessionId) => {
  return cache[sessionId]
}

export const cacheSearch = (req, res, next) => {
  if (req.query && req.query.location) {
    setTerm(req.sessionID, req.query.location)
  }
  next()
}

export const loadSearchTerm = (req, res, next) => {
  if (req.sessionID && !(req.query && req.query.location)) {
    req.query = req.query || {}
    req.query.location = getTerm(req.sessionID) || ''
  }
  next()
}
