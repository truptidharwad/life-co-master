import getAccessToken from '../utils/getAccessToken'

module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define('Token', {
    value: {
      type: DataTypes.STRING,
    },
    expiresAt: {
      type: DataTypes.DATE(6),
    },
    type: {
      type: DataTypes.STRING,
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
            this.setDataValue('expiresAt', new Date(expirationDate))
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
            const ms = Date.now() + +resp.body.expires_in * 1000
            const expiresAt = new Date(ms)
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
            .then((token) => {
              if (!token) {
                this.createFirst()
                  .then((first) => resolve(first))
                  .catch((err) => reject(err))
              } else if (new Date(token.expiresAt) < time) {
                token.update()
                  .then((updated) => resolve(updated))
                  .catch((err) => reject(err))
              } else {
                resolve(token)
              }
            })
            .catch((err) => reject(err))
        }
        return new Promise(getUpdatedToken)
      }
    }
  })

  return Token
}
