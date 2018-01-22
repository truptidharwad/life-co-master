const Sequelize = require('sequelize')

const client = new Sequelize(process.env.DATABASE_URL)
client.sync()

client.query('CREATE DATABASE lifeco')
  .then((r) => console.log(r))
  .catch((e) => console.log(e))