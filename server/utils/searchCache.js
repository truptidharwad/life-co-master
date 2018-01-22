const cache = {}

export const setTerm = (sessionId, term) => {
  cache[sessionId] = term
}

export const getTerm = (sessionId) => {
  return cache[sessionId]
}
