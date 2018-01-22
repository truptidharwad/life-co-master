const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL + '/test')
const request = require('superagent')

const getAccessToken = (callback) => {
  request
    .post('https://api.yelp.com/oauth2/token')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send({
      client_id: process.env.YELP_CLIENT_ID,
      client_secret: process.env.YELP_CLIENT_SECRET,
    })
    .end(callback)
}

const Test = sequelize.define('Test', {
  value: {
    type: Sequelize.STRING,
  },
  expiresAt: {
    type: Sequelize.DATE(6),
  },
  type: {
    type: Sequelize.STRING,
  },
}, {
  getterMethods: {
    typedValue() {
      return [this.type, this.value].join(' ')
    }
  },
  instanceMethods: {
    update() {
      const update = (resolve, reject) => {
        getAccessToken((err, resp) => {
          if (err) {
            return reject(err)
          }
          const expirationDate = Date.now() + +resp.body.expires_in * 1000
          this.setDataValue('expiresAt', new Date(expirationDate)) //().toLocaleFormat('YYYY-MM-DD hh:mm:ss'))
          this.setDataValue('type', resp.body.token_type)
          this.setDataValue('value', resp.body.access_token)
          this.save()
            .then((r) => resolve(r))
            .catch((e) => reject(e))
        })
      }

      return new Promise(update)
    },
  },
  classMethods: {
    createFirst() {
      const createFirst = (resolve, reject) => {
        getAccessToken((err, resp) => {
          if (err) {
            return reject(err)
          }
          const expirationSecond = Date.now() + +resp.body.expires_in * 1000
          const expiresAt = new Date(expirationSecond)
          this.create({
            expiresAt,
            type: resp.body.token_type,
            value: resp.body.access_token,
          })
          .then((r) => resolve(r))
          .catch((e) => reject(e))
        })
      }
      return new Promise(createFirst)
    },
    getUpdatedToken(time) {
      if (typeof time !== 'object') {
        time = new Date(time)
      }
      const getUpdatedToken = (resolve, reject) => {
        this.findById(1)
          .then((test) => {
            console.log(new Date(test.expiresAt), time)
            if (!test) {
              this.createFirst()
                .then((first) => resolve(first))
                .catch((err) => reject(err))
            } else if (new Date(test.expiresAt) < time) {
              test.update()
                .then((updated) => resolve(updated))
                .catch((err) => reject(err))
            } else {
              resolve(test)
            }
          })
          .catch((err) => reject(err))
      }
      return new Promise(getUpdatedToken)
    }
  }
})

sequelize.sync()
  .then(() => {
    Test.getUpdatedToken(Date.now())
      .then((token) => {
        request
          .get('https://api.yelp.com/v3/businesses/search')
          .set('Authorization', token.typedValue)
          .query({ location: 'palo alto' })
          .end((err, resp) => {
            if (err) { console.error(err) }
            console.log(resp.body)
          })
        // console.log(token.expiresAt, token.typedValue)
      })
      .catch((err) => console.error(err))
  })
  .catch((err) => console.error(err))
