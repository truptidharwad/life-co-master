const app = require('../build/server')
const request = require('supertest')
const expect = require('chai').expect
const agent = request(app)

describe('/api/checkin', function() {
  describe('POST', function() {
    it('should succeed for the first time', function(done) {
      request(app)
        .post('/api/checkin')
        .send({ business: 'test-business-id' })
        .then((resp) => {
          expect(resp.body).to.be.defined
          done()
        })
        .catch((err) => done(err))
    })

    it('should fail for the second time', function(done) {
      done()
    })
  })
})

describe('/auth/twitter', () => {
  it('GET', () => {
    // 1. hit auth button
    // -> need auth button?
    // 2. get /auth/twitter endpoint
    // 3. enter user/pass
    // 4. hit signin button
    // 5. follow redirects back to root
    // 6. verify login
    // 7. check in once
    // 8. check in twice
    // 9. verify single check in

    const username = process.env.TEST_TWITTER_USER
    const password = process.env.TEST_TWITTER_PASS
    agent
      .get('/auth/twitter')
      .then((resp) => {
        resp.body
      })

  })
})