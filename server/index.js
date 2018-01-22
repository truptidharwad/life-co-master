import express from 'express'
import middleware from './middleware'
import { api, root, auth } from './routes'
import { sequelize } from './models'

const app = express()
const port = process.env.PORT || 3750

app.use(middleware)
app.use('/api', api)
app.use('/auth', auth)
app.use('/*', root)

sequelize
  .sync()
  .then(() => app.listen(
    port,
    () => console.log('listening on', port)
  ))
  .catch((err) => console.error(err))

export default app
